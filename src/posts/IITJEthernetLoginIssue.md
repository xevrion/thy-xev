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

# Quick Setup (Non-Technical Users)

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

You’ll see options to Start / Stop / Status / Uninstall.

That’s it.

If you’re curious how it works internally, continue reading.



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