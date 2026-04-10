# Rewriting the IITJ LAN Autologin Tool in Go
Date: 23-03-2026
Tags: linux, iit, go

The <span class="blue">bash version worked</span>. That is the important part.

After months of debugging MAC randomization, Docker subnet conflicts, WiFi stealing packets, and DNS behaving differently across tools, the Linux script had become surprisingly reliable. SSH sessions stopped dropping. Downloads stopped dying halfway through. Long builds could survive without me babysitting the connection.

But it still had <span class="blue">one big limitation</span>: it was built for my exact environment.

It assumed Linux. It assumed `systemd`. It assumed NetworkManager. It assumed the machine running it looked a lot like mine.

That was fine for a personal fix. It was not fine for a tool I wanted other people to use.

So I rewrote it in <span class="blue">Go</span>.

The project is here if you want to look at the code:
https://github.com/xevrion/iitj-lan-autologin

It is now the main release line for the tool, with proper GitHub Releases and prebuilt binaries.

## Why Go

I wanted a few things from the rewrite:

- A single binary
- No runtime dependency
- Easy cross-compilation
- Good control over networking
- Something I could hand to Linux, macOS, and Windows users without a long setup guide

Go fit that <span class="blue">almost perfectly</span>.

It gives me a standard library that is boring in a very useful way. `net`, `http`, `tls`, and `os` are enough to build most of the tool without dragging in unnecessary dependencies. It also makes cross-platform builds almost trivial.

```bash
GOOS=darwin GOARCH=arm64 go build
GOOS=windows GOARCH=amd64 go build
GOOS=linux GOARCH=amd64 go build
```

Python could have worked too, but then distribution becomes a different problem. With Go, I get one self-contained binary that I can ship directly.

## The Main Translation Problem

The old bash script leaned heavily on `curl`.

That sounds simple, until you remember that `curl` was doing a lot of heavy lifting:

- Binding requests to the ethernet interface
- Overriding DNS resolution
- Ignoring FortiGate's self-signed certificate
- Avoiding browser-specific DNS behavior

The rewrite was mostly about <span class="blue">reproducing those behaviors directly in Go</span>.

### Replacing `curl --interface`

In the bash script, I used `curl --interface enp7s0` to force traffic through ethernet. Without that, the kernel could choose WiFi as the source path and the whole login flow would go to the wrong network.

In Go, the equivalent is setting `LocalAddr` on a `net.Dialer`:

```go
dialer := &net.Dialer{
    LocalAddr: &net.TCPAddr{IP: net.ParseIP(ifaceIP)},
    Timeout:   10 * time.Second,
}
```

Once the socket is bound to the ethernet interface's IP, requests leave through ethernet instead of whatever route the system feels like using.

### Replacing `curl --resolve`

Another problem was <span class="blue">DNS</span>.

FortiGate exposes the portal internally as `172.17.0.3`, but depending on which resolver answered the query, `gateway.iitj.ac.in` could also resolve to public IPs that are useless for captive-portal login.

In bash, I worked around that with:

```bash
curl --resolve gateway.iitj.ac.in:1003:172.17.0.3
```

In Go, I handled it by overriding `DialContext`:

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

That lets the client talk to the <span class="blue">exact portal IP</span> I want, without depending on the system resolver getting it right at that moment.

### Resolving the Portal IP Through Ethernet

To override the hostname properly, I first need the captive portal IP that FortiGate returns on the ethernet path.

That means the DNS query itself must go through ethernet.

So the resolver also gets its own bound dialer:

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

This is one of those details that sounds minor until it breaks. If the DNS packet leaves through <span class="blue">WiFi</span>, the answer can be completely different from the answer FortiGate gives on <span class="blue">ethernet</span>.

## Security Changed Too

The bash version encrypted credentials, but the Go rewrite was a good excuse to make that part cleaner.

Instead of using <span class="blue">AES-CBC</span> through OpenSSL, I switched to <span class="blue">AES-256-GCM</span> from the Go standard library. That gives authenticated encryption, which means corrupted or tampered ciphertext fails cleanly instead of decrypting into garbage.

The stored format is simple:

```text
nonce || ciphertext
```

No external crypto dependency, no shelling out, and no plaintext credentials sitting around in config files.

## Making It Cross-Platform

The login logic was only half the work. The other half was <span class="blue">service management</span>.

Each platform wants background tasks handled in its own way:

- Linux uses a `systemd` user service
- macOS uses a `launchd` agent
- Windows uses Task Scheduler

All three point to the same binary. Only the startup mechanism changes.

That split actually made the project structure much better than the original script. The Go version naturally separated itself into pieces:

- interface detection
- credential storage
- login flow
- system fixes
- service installation

The bash version was one long file that kept growing because that was the fastest way to keep shipping fixes. The Go rewrite gave the project a shape that is much easier to reason about.

## What the Tool Does Now

The CLI ended up <span class="blue">much cleaner</span> too:

```text
iitj-login install
iitj-login login
iitj-login status
iitj-login start
iitj-login stop
iitj-login uninstall
iitj-login version
```

`install` handles <span class="blue">most of the painful setup automatically</span>:

1. Detect the active ethernet interface
2. Fix MAC randomization where needed
3. Warn about Docker subnet conflicts
4. Add `172.17.0.3 gateway.iitj.ac.in` to `/etc/hosts`
5. Pin the portal route through ethernet
6. Encrypt and store credentials
7. Install the background service

The login loop itself is simple: <span class="blue">clear DNS cache</span>, check whether the portal is intercepting traffic, <span class="blue">log in if required</span>, then sleep for five minutes and repeat.

On Linux and macOS, setup now also installs a manual page, so:

```bash
man iitj-login
```

works after installation.

For installation, it now supports direct bootstrap scripts too:

```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/xevrion/iitj-lan-autologin/main/bootstrap.sh | bash

# Windows PowerShell
irm https://raw.githubusercontent.com/xevrion/iitj-lan-autologin/main/bootstrap.ps1 | iex
```

The bootstrap scripts download the latest matching release binary first and only fall back to building from source when needed.

The release history is also versioned properly now. The current line is:

- `v4.0.0`: Go rewrite and cross-platform binary release
- `v4.0.1`: man page support, uninstall cleanup, and release polish

So this is no longer just a local rewrite that happens to build on other systems. It is a real released binary project now.

## What I Learned

The most useful lesson from this rewrite was that a lot of <span class="blue">"CLI magic" is not magic at all</span>. `curl` feels special until you recreate the same behavior with `net.Dialer`, a custom resolver, and a small amount of transport logic.

The second lesson was more practical: if a tool is solving a genuinely annoying problem for real users, <span class="blue">portability matters more than elegance</span>. The bash version was clever, but fragile outside Linux. The Go version is much less clever and <span class="blue">much more usable</span>.

That trade was worth it.

The script proved the idea. The <span class="blue">Go rewrite</span> turned it into something I could actually hand to someone else and expect them to run without debugging my entire network stack first.

That was the part I wanted most.

Not a cleaner codebase for its own sake. Not a language rewrite for the sake of a rewrite.

Just a tool that solves a real problem and is packaged well enough that another person can install it, trust it, and keep using it.

*Written by Yash (xevrion)*
