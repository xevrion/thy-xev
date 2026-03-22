# Rewriting the IITJ LAN Autologin Tool in Go
Date: 22-03-2026

The bash script worked. That is the honest starting point.

After months of debugging — MAC randomization, Docker subnet conflicts, WiFi stealing packets, two DNS stacks fighting each other — the Linux version was genuinely solid. Sessions stayed alive. SSH stopped dropping. Builds stopped dying mid-way.

But it only worked on Linux. Specifically, on Linux with systemd and NetworkManager. Someone running Arch with OpenRC, or macOS, or Windows would get nothing.

I had the core logic. I had a deep enough understanding of how FortiGate's captive portal works. The only thing left was to do it properly.

So I rewrote it in Go.

---

## Why Go

The requirements were:
- Single binary, no runtime dependency
- Cross-compile for Linux (amd64/arm64), macOS (Intel + Apple Silicon), Windows
- Proper networking primitives — binding to specific interfaces, controlling TLS, custom dialers
- No framework bloat

Go checks every box. `GOARCH=arm64 GOOS=darwin go build` just works. The `net/http` package gives you enough control to replicate what `curl --interface`, `curl --resolve`, and `curl -k` do without shelling out.

Python would have worked too, but shipping Python means assuming Python is installed. Go produces a single self-contained binary.

---

## The Interesting Parts

### Translating `curl --interface` to Go

In the bash script, `curl --interface enp7s0` binds the TCP connection's source address to the ethernet interface. Without this, the kernel picks the source based on routing, which might choose WiFi.

In Go, this is a `net.Dialer` with `LocalAddr` set:

```go
dialer := &net.Dialer{
    LocalAddr: &net.TCPAddr{IP: net.ParseIP(ifaceIP)},
    Timeout:   10 * time.Second,
}
```

By binding to the ethernet interface's IP, the kernel routes the outgoing packet through ethernet. It is the Go equivalent of `--interface`.

### Translating `curl --resolve` to Go

The bash script used `--resolve gateway.iitj.ac.in:1003:172.17.0.3` to force curl to use a specific IP instead of going through the system resolver. This bypasses the glibc DNS race condition where WiFi's DNS returns the real public IPs instead of FortiGate's intercepted `172.17.0.3`.

In Go, this is done by overriding `DialContext` in the transport:

```go
dialContext := func(ctx context.Context, network, addr string) (net.Conn, error) {
    host, port, _ := net.SplitHostPort(addr)
    if host == "gateway.iitj.ac.in" && portalIP != "" {
        addr = net.JoinHostPort(portalIP, port)
    }
    return dialer.DialContext(ctx, network, addr)
}

transport := &http.Transport{
    DialContext:     dialContext,
    TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
}
```

Before any request to `gateway.iitj.ac.in`, we swap in the resolved portal IP. No `getaddrinfo`, no race, no WiFi DNS. The self-signed cert warning is suppressed the same way `curl -k` does it.

### Resolving the Portal IP via Ethernet

Before we can force the IP in the dialer, we need to know what IP FortiGate is returning from its intercepted DNS. The solution is to bind the DNS query itself to the ethernet interface:

```go
resolver := &net.Resolver{
    PreferGo: true,
    Dial: func(ctx context.Context, network, address string) (net.Conn, error) {
        d := net.Dialer{
            LocalAddr: &net.UDPAddr{IP: net.ParseIP(ifaceIP), Port: 0},
            Timeout:   5 * time.Second,
        }
        return d.DialContext(ctx, "udp", address)
    },
}
```

By binding the UDP socket to the ethernet IP, the DNS query packet routes through ethernet. FortiGate intercepts it and returns `172.17.0.3`. We capture that IP and use it for all subsequent HTTP requests.

If that fails, it falls back to the system resolver — which returns `172.17.0.3` anyway if the `/etc/hosts` entry was added during install.

### Credentials: AES-256-GCM

The bash version used `openssl enc -aes-256-cbc` which is fine but CBC doesn't authenticate the ciphertext. AES-256-GCM does — it provides both encryption and integrity. If the ciphertext is tampered with, decryption fails loudly instead of silently returning garbage.

The format is simple: `nonce (12 bytes) || GCM ciphertext`. No external library — just `crypto/aes` and `crypto/cipher` from stdlib.

---

## Cross-Platform Service Management

The most mechanical part of the rewrite was service management. Three completely different mechanisms:

**Linux (systemd):** Write a unit file to `~/.config/systemd/user/iitj-login.service`, then `systemctl --user enable/start`. Enable linger so it survives without an active login session.

**macOS (launchd):** Write a plist to `~/Library/LaunchAgents/ac.iitj.login.plist`, then `launchctl load`. The plist format is XML and verbose but straightforward.

**Windows (Task Scheduler):** Call `schtasks /create /sc onlogon`. Less elegant but it works. No registry hacks needed.

All three point to the same binary with the `login` subcommand. The binary is the daemon; the service manager just ensures it starts on boot.

---

## What the Tool Does Now

```
iitj-login install    # one-time setup wizard
iitj-login status     # show daemon status
iitj-login start/stop
iitj-login uninstall
```

Install does everything automatically:

1. Detects the ethernet interface
2. Disables MAC randomization (Linux/Fedora via nmcli)
3. Warns about Docker subnet conflicts
4. Adds `172.17.0.3 gateway.iitj.ac.in` to `/etc/hosts`
5. Pins a static route for the portal IP via ethernet
6. Encrypts credentials and saves them
7. Installs and starts the daemon

The daemon loop runs every 5 minutes: flush DNS → check if captive portal is active → login if needed → sleep.

```bash
# Linux/macOS
curl -fsSL https://raw.githubusercontent.com/xevrion/iitj-lan-autologin/main/bootstrap.sh | bash

# Windows (PowerShell)
irm https://raw.githubusercontent.com/xevrion/iitj-lan-autologin/main/bootstrap.ps1 | iex
```

---

## What I Actually Learned

Go's `net` package gives you enough control to replicate most of what `curl` does from the CLI. The combination of `net.Dialer` with `LocalAddr` and a custom `DialContext` covers interface binding and hostname overriding. `tls.Config{InsecureSkipVerify: true}` covers self-signed certs. `http.ErrUseLastResponse` covers not following redirects (FortiGate uses JS redirects, not HTTP 302).

The bash script worked by shelling out to `curl` for all of this. The Go version handles it natively, which means no dependency on curl being present, no subprocess overhead in a tight loop, and the same binary works on Windows where curl behavior differs.

The rewrite also forced me to think about the structure. The bash script was a single file that did everything. The Go version has distinct packages for detection, credential storage, login flow, service management, and fixes. Each piece is testable in isolation.

---

The bash script got the idea working. The Go version is the version I'd actually hand to someone and say: here, this will work on your machine.

*Written by Yash (xevrion)*
