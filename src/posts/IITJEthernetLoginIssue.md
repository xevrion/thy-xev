# Automating IITJ LAN Login (So My Internet Stops Dying Every 3 Hours)
Date: 19-02-2026

IIT Jodhpur hostel LAN uses a FortiGate captive portal. Ethernet works only after logging in through a browser, and the session expires roughly every 10 000 seconds (~2 h 46 m).

Which means:

- Downloads fail mid-way  
- SSH sessions drop  
- Builds break  
- Long tasks die silently  
- Headless/CLI environments are painful  

So I decided to automate the login and keep the LAN session alive permanently.



## How the IITJ LAN Login Actually Works

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

If credentials are correct, the gateway authorizes your MAC address for ~10 000 s.

Logout is just:

```
GET https://gateway.iitj.ac.in:1003/logout?random
```

Important observations:

- `/login?anything` always returns a fresh login page  
- The `magic` token changes every request  
- Re-login overwrites session expiry (no stacking)  
- Gateway keeps only one active auth per device  

So the login flow is deterministic and scriptable.



## How I Reverse-Engineered It

The obvious first step was opening DevTools → Network tab while logging in normally from the browser.

I watched the requests when submitting credentials and copied the login request as cURL:

```
POST https://gateway.iitj.ac.in:1003/
username=...
password=...
magic=...
4Tredir=...
```

That part was straightforward.

The confusing part was everything around it.

The login URL always looked like:

```
/login?06197964521b4b48
/login?001b7bb6a428f3e8
/login?randomhex
```

And logout:

```
/logout?020205030507080f
/logout?something
```

At first it looked like those values were session IDs that needed to be preserved.

So I tried replaying captured requests exactly via curl.  
They worked — but only once.  
Next time the values changed.

So I assumed they were dynamic tokens and started trying to extract them properly.

Then I noticed something odd.

If I opened:

```
https://gateway.iitj.ac.in:1003/login?anything
```

literally any random string after `?` still returned a valid login page with a fresh `magic` token.

Same for logout:

```
https://gateway.iitj.ac.in:1003/logout?anything
```

always logged me out.

So those query values were not real tokens at all.  
They were just cache-busting noise.

That was the key realization.

The only value that actually mattered was the hidden `magic` field inside the HTML.



## Strategy

The portal session expires after ~2 h 46 m.  
If I re-login before expiry, the session never drops.

Automation logic:

1. Request login page  
2. Extract magic token  
3. POST credentials  
4. Sleep ~2 h  
5. Repeat forever  

This converts captive-portal auth into a persistent local service.



## The Script

I wrote a small daemon-style bash script that refreshes the session periodically.

```
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



## Credentials

Credentials are stored separately so the script isn’t hard-coded.

```
~/.iitj-cred
chmod 600
```

```
IITJ_USER=b24cs1019
IITJ_PASS='yourpassword'
```

The script loads them via:

```
source ~/.iitj-cred
```



## Improvements After Initial Version

My first version actually had credentials hardcoded in the script.

While trying to clean that up, I searched around to see if others had solved similar FortiGate campus login issues and came across an IIT Kanpur automation gist by Sumit Lahiri:

https://gist.github.com/codersguild/bf0b343d9db1b817bdcd7ff14cb05e61

His approach used encrypted credential storage instead of plaintext, which immediately made sense for this use case. I adapted that idea into my version by moving credentials to a separate file with restricted permissions.

So the current design:

- Script contains no secrets  
- Credentials stored in `~/.iitj-cred`  
- File permissions locked (`600`)  
- Loaded at runtime  

The core login logic I reverse-engineered independently, but the credential-handling cleanup was directly inspired by his IITK solution.



## Running in Background

You can run the script detached so it keeps the LAN alive without an open terminal.

Start in background:

```
nohup ~/.iitj-login.sh >/dev/null 2>&1 &
```

Check if running:

```
cat /tmp/iitj-login.pid
ps -p $(cat /tmp/iitj-login.pid)
```

Stop manually:

```
kill -SIGINT $(cat /tmp/iitj-login.pid)
```

This triggers clean logout via the trap.



## Run Automatically on Startup (systemd user service)

Create a user service so LAN auto-authenticates after login.

```
mkdir -p ~/.config/systemd/user
nano ~/.config/systemd/user/iitj-login.service
```

```
[Unit]
Description=IITJ LAN Auto Login
After=network-online.target

[Service]
ExecStart=/home/xevrion/.iitj-login.sh
Restart=always

[Install]
WantedBy=default.target
```

Reload systemd:

```
systemctl --user daemon-reload
```

Enable at login:

```
systemctl --user enable iitj-login
```

Start now:

```
systemctl --user start iitj-login
```

Stop:

```
systemctl --user stop iitj-login
```

Disable:

```
systemctl --user disable iitj-login
```



## Why This Works

FortiGate doesn’t create multiple sessions per login.  
It stores one lease per device (MAC).

Every successful login simply resets the expiry timer.

So periodic login behaves like a keepalive, not parallel sessions.



## Result

IITJ LAN behaves like a normal always-on ethernet connection.

No re-auth interruptions.  
No portal redirects.  
No broken long-running tasks.

Basically turned a captive portal into a persistent local client.



*Written by Yash (xevrion)*
