# Automating IITJ LAN Login (So My Internet Stops Dying Every 3 Hours)
Date: 19-02-2026

IIT Jodhpur hostel LAN uses a FortiGate captive portal. Ethernet works only after logging in through a browser, and the session expires roughly every 10 000 seconds (~2 h 46 m).

Which means:

- Downloads fail mid-way
- SSH sessions drop
- Builds break
- Long tasks die silently
- Headless/CLI environments are painful

So I built a small tool that keeps the LAN session alive automatically.



---

# Quick Setup - Custom CLI Tool

If you're on Linux and just want this to work without reading everything:

```bash
curl -fsSL https://raw.githubusercontent.com/xevrion/iitj-lan-autologin/main/bootstrap.sh | bash
```

Then run:

```bash
./install.sh
```

It will:

- Ask for your IITJ LDAP username and password
- Encrypt them locally
- Install a background service
- Automatically keep your LAN logged in

After installation, it runs automatically every time you log in to your system.

To manage it later:

```bash
./install.sh
```

You'll see options to Start / Stop / Status / Uninstall.

That's it.

If you're curious how it works internally, continue reading.



---

# How the IITJ LAN Login Actually Works

When you connect ethernet and open any site, the gateway redirects to something like:

```
https://gateway.iitj.ac.in:1003/login?random
```

The login page contains a hidden field:

```
<input name="magic" value="TOKEN">
```

Submitting the form sends:

```
POST https://gateway.iitj.ac.in:1003/
username=<ldap>
password=<ldap>
magic=<token>
4Tredir=...
```

If credentials are correct, the gateway authorizes your MAC address for ~10 000 seconds.

Logout is just:

```
GET https://gateway.iitj.ac.in:1003/logout?random
```

Important observations:

- `/login?anything` always returns a fresh login page
- The `magic` token changes every request
- Re-login overwrites session expiry (no stacking)
- Gateway keeps only one active authentication per device

So the login flow is deterministic and scriptable.



---

# How I Reverse-Engineered It

I opened DevTools → Network tab while logging in normally.

I observed the request made when submitting credentials and copied it as cURL:

```
POST https://gateway.iitj.ac.in:1003/
username=...
password=...
magic=...
4Tredir=...
```

That part was simple.

The confusing part was the login URL pattern:

```
/login?06197964521b4b48
/login?001b7bb6a428f3e8
/login?randomhex
```

Logout looked like:

```
/logout?020205030507080f
/logout?something
```

Initially I assumed those query values were session identifiers.

Replaying captured requests worked once — then failed.

So I tried extracting those values dynamically.

Then I noticed something critical.

Opening:

```
https://gateway.iitj.ac.in:1003/login?anything
```

with literally any random string still returned a valid login page.

Same for logout:

```
https://gateway.iitj.ac.in:1003/logout?anything
```

always logged me out.

So those query values were not authentication tokens.

They were just cache-busting noise.

The only value that actually mattered was the hidden `magic` field in the HTML.



---

# Strategy

The portal session expires after ~2 h 46 m.

If I re-login before expiry, the session never drops.

Automation logic:

1. Request login page
2. Extract `magic` token
3. POST credentials
4. Sleep ~2 hours
5. Repeat forever

This converts captive-portal authentication into a persistent local service.



---

# The Core Script (Minimal Version)

This was the original daemon-style script:

```bash
#!/usr/bin/env bash

LOGIN_URL="https://gateway.iitj.ac.in:1003/login"
POST_URL="https://gateway.iitj.ac.in:1003/"
LOGOUT_URL="https://gateway.iitj.ac.in:1003/logout"

PIDFILE="/tmp/iitj-login.pid"

source ~/.iitj-cred

logout() {
    curl -ks "${LOGOUT_URL}?$(date +%s)" >/dev/null
    rm -f "$PIDFILE"
    exit 0
}

trap logout SIGINT SIGTERM

echo $$ > "$PIDFILE"

login_if_needed() {
    PAGE=$(curl -ks "${LOGIN_URL}?$(date +%s)")
    MAGIC=$(echo "$PAGE" | grep -oP 'name="magic"\s+value="\K[^"]+')

    if [ -n "$MAGIC" ]; then
        curl -ks -X POST "$POST_URL" \
            -H "Content-Type: application/x-www-form-urlencoded" \
            --data "username=$IITJ_USER&password=$IITJ_PASS&magic=$MAGIC&4Tredir=${LOGIN_URL}" \
            >/dev/null

        echo "IITJ login refreshed at $(date)"
    fi
}

while true; do
    login_if_needed
    sleep 7200
done
```



---

# Credentials Handling

The initial version had credentials hardcoded.

That was not ideal.

The improved version:

- Encrypts credentials using OpenSSL (AES-256-CBC)
- Stores them inside `~/.local/share/iitj-login/`
- Restricts permissions
- Decrypts only at runtime

This design was inspired by an IIT Kanpur automation gist by Sumit Lahiri:

https://gist.github.com/codersguild/bf0b343d9db1b817bdcd7ff14cb05e61

The login flow itself was reverse-engineered independently. The credential hardening approach was influenced by that implementation.



---

# Background Execution

Instead of running the script manually, the installer:

- Creates a systemd user service
- Enables it
- Starts it
- Runs automatically at login

Manual control:

```bash
systemctl --user status iitj-login
systemctl --user stop iitj-login
systemctl --user start iitj-login
systemctl --user disable iitj-login
```

Or simply re-run:

```bash
./install.sh
```

and use the menu.



---

# Why This Works

FortiGate does not create multiple parallel sessions.

It stores one lease per device (MAC address).

Every successful login simply resets the expiry timer.

So periodic login behaves like a keepalive — not parallel authentication sessions.



---

# Result

IITJ LAN behaves like a normal always-on ethernet connection.

No re-auth interruptions.
No portal redirects.
No broken long-running tasks.

Just stable internet.

*Written by Yash (xevrion)*

---

# Update (22-03-2026)

After migrating from Ubuntu to Fedora, the script completely stopped working. Same code, same network, different OS — and suddenly nothing.

Debugging this took longer than expected. Here's everything I found.

---

## 1. The Login Endpoint Is Not Always Accessible

The original script hit `/login` directly:

```
https://gateway.iitj.ac.in:1003/login?<anything>
```

This works fine when already authenticated. But when the session has expired, port 1003 is not always reachable with a direct connection. FortiGate only opens port 1003 to devices that have gone through the HTTP interception flow.

So directly requesting `/login` is unreliable as the entry point.

---

## 2. The Real Entry Point Is HTTP Interception

FortiGate intercepts all plain HTTP traffic from unauthenticated devices at the network level — no DNS, no routing tricks, just TCP interception on port 80.

The actual flow:

1. Curl any plain HTTP URL (e.g. `http://neverssl.com`)
2. FortiGate intercepts the request and returns:

```html
<script>window.location="https://gateway.iitj.ac.in:1003/fgtauth?TOKEN";</script>
```

3. That `TOKEN` in the URL is the `magic` field

So:

```
fgtauth token == magic
```

No need to scrape HTML. No need to request `/login`. The token is right there in the redirect URL.

---

## 3. Fedora Randomizes Ethernet MAC Addresses

This was the first big Fedora-specific problem.

FortiGate authenticates devices by MAC address, not by IP or session cookie. Every successful login whitelists the device's MAC for ~10 000 seconds.

Fedora's NetworkManager randomizes ethernet MAC addresses by default (as a privacy feature). Ubuntu's default is to preserve the real hardware MAC.

So on Fedora:

- Every reconnect → different MAC → FortiGate sees an unknown device → blocks it
- Login fails silently
- The script appears to work but nothing happens

Fix:

```bash
nmcli connection modify "Wired connection 1" ethernet.cloned-mac-address permanent
```

This pins the connection to the real hardware MAC. After reconnecting with the real MAC, FortiGate recognized the device instantly and the session was restored.

The installer now does this automatically during setup.

---

## 4. Docker Was Routing the Captive Portal Traffic Locally

Even after fixing the MAC, logins were still failing. The POST to `https://gateway.iitj.ac.in:1003/` was timing out.

The root cause took a while to find.

When unauthenticated, FortiGate also intercepts DNS queries. It returns its own internal captive portal IP for `gateway.iitj.ac.in` instead of the real public IP. On this network, it was returning `172.17.0.3`.

I had Docker running. Docker's default bridge (`docker0`) occupies `172.17.0.0/16`.

So when curl tried to connect to `172.17.0.3:1003`, the kernel routed it into Docker's local bridge instead of sending it out to FortiGate. The packet never left the machine.

This is the same class of issue I wrote about in [Ubuntu Ethernet Login Page Not Loading](/posts/ethernetIITJDockerIssue) — Docker subnets silently stealing campus network traffic.

Fix:

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<'EOF'
{ "default-address-pools": [{ "base": "10.200.0.0/16", "size": 24 }] }
EOF
sudo systemctl restart docker
docker network prune -f
```

Moving Docker off `172.17.x.x` eliminates the conflict entirely.

---

## 5. WiFi Was Stealing Packets Too

There was another routing issue layered on top.

When both WiFi and Ethernet are active, `172.17.0.3` was being routed via the WiFi interface (`wlp...`) instead of the ethernet interface (`enp...`). The `--interface enp7s0` flag in curl binds the source address, but the kernel still routes based on the routing table — and the routing table was sending `172.17.0.3` out on WiFi.

Fix: add a static route for the captive portal IP via the ethernet gateway.

```bash
nmcli connection modify "Wired connection 1" +ipv4.routes "172.17.0.3/32 10.22.16.1"
```

The installer now detects this automatically. It resolves `gateway.iitj.ac.in`, checks which interface the routing table assigns it to, and pins it to ethernet if needed.

---

## 6. The Login Script Had Two Bugs

While debugging, I found two bugs in the generated `login.sh`:

**Bug 1 — `set -e` with no `|| true` on the POST curl**

The POST curl would timeout (exit code 28) when FortiGate wasn't reachable yet. With `set -e`, this crashed the entire script. systemd restarted it, it tried again, timed out again — infinite crash loop.

Fix: remove `set -e`, add `|| true` to the POST command.

**Bug 2 — python3 URL encoding for the password**

The script was doing:

```bash
PASS_ENC=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$PASSWORD'''))")
```

This breaks if the password contains single quotes, and adds a dependency on python3. curl handles URL encoding natively:

```bash
curl --data-urlencode "password=$PASSWORD"
```

Both bugs are fixed in v3.0.0.

---

## 7. What v3.0.0 Does Automatically

The installer now:

1. Auto-detects the ethernet interface (no hardcoded `enp7s0`)
2. Disables MAC randomization for the detected connection
3. Checks if Docker's bridge conflicts with `172.17.x.x` and prints the fix
4. Resolves the captive portal IP and pins routing to ethernet if needed
5. Removes the python3 dependency (uses `--data-urlencode`)
6. Generates a login script with proper error handling

---

## 8. Two DNS Stacks: Why the Browser Portal Never Loaded

After all the above fixes, the script was logging in correctly — but the browser captive portal popup in GNOME still hung forever on `http://connectivitycheck.gstatic.com/generate_204`, and manually visiting `https://gateway.iitj.ac.in:1003/` just spun and timed out.

This was a completely separate problem.

It turns out there are two independent DNS resolution paths on Linux:

**Kernel / `dig` path:** DNS UDP packets go out the ethernet interface. FortiGate intercepts them at the network level and returns `172.17.0.3` for `gateway.iitj.ac.in` when the device is unauthenticated. So `dig +short gateway.iitj.ac.in` → `172.17.0.3`. Correct.

**glibc path (`getaddrinfo`):** This is what browsers, GNOME, and `curl` use when resolving hostnames. It goes through systemd-resolved, which races DNS servers from all active interfaces. With WiFi also connected, WiFi's DNS responds faster and returns the real public IPs for `gateway.iitj.ac.in` (14.139.37.109, 220.158.144.40). Those IPs don't serve port 1003. Connection fails silently.

So `dig` said `172.17.0.3`. `getent hosts gateway.iitj.ac.in` (what the browser actually uses) said `14.139.37.109`. They disagreed, and the browser always lost.

The fix is simple: `/etc/hosts` is checked before any DNS, by all processes, always.

```bash
echo "172.17.0.3 gateway.iitj.ac.in" | sudo tee -a /etc/hosts
```

After that: GNOME captive portal popup loaded the FortiGate login page instantly. Browser navigation to `https://gateway.iitj.ac.in:1003/` worked. Manual login and logout both worked. The script worked with WiFi on or off.

The same race condition also affected the login script itself. `curl --interface enp7s0` binds the source IP to ethernet but still calls `getaddrinfo()` (glibc) for DNS, which could return the public IPs. So the script now:

1. Runs `resolvectl flush-caches` to clear stale entries
2. Immediately runs `dig +short gateway.iitj.ac.in` — its UDP packet goes via ethernet → FortiGate intercepts → returns `172.17.0.3`
3. Passes that IP to all subsequent curl calls via `--resolve gateway.iitj.ac.in:1003:172.17.0.3`, bypassing `getaddrinfo` entirely

---

## Final Takeaway

Captive portals are MAC-based identity systems dressed up as login forms.

Once you understand that, most of the weird failures make sense:

- Different MAC → unrecognized device → silent block
- Wrong routing → packets go nowhere → timeout
- Docker subnets → packets stay local → timeout
- glibc and kernel seeing different DNS answers → script works, browser doesn't, for the exact same reason

The login form is the easy part. Getting the packet to actually reach FortiGate — through the right interface, with the right MAC, through the right DNS answer, past Docker's bridges — is the hard part.

---
