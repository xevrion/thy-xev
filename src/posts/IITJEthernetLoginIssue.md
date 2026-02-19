# Automating IITJ LAN Login (So My Internet Stops Dying Every 3 Hours)
Date: 19-02-2026

IIT Jodhpur LAN uses a FortiGate captive portal. Ethernet works only after logging in through a browser, and the session expires roughly every 10 000 seconds (~2 h 46 m).

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



## Why This Works

FortiGate doesn’t create multiple sessions per login.  
It stores one lease per device (MAC).

Every successful login simply resets the expiry timer.

So periodic login behaves like a keepalive, not parallel sessions.



## Behavior

Start once:

```
~/.iitj-login.sh
```

Then:

- LAN stays authenticated indefinitely  
- No session drops  
- No browser popups  
- Works in CLI/headless  
- Safe to leave running  

Stop:

```
Ctrl + C
```

Which triggers logout via trap.



## Logout Handling

The script traps termination signals:

```
trap logout SIGINT SIGTERM
```

So stopping the script sends:

```
GET /logout
```

and removes the PID file.



## Result

IITJ LAN behaves like a normal always-on ethernet connection.

No re-auth interruptions.  
No portal redirects.  
No broken long-running tasks.

Basically turned a captive portal into a persistent local client.



*Written by Yash (xevrion)*
