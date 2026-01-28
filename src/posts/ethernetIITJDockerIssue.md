# Ubuntu Ethernet Login Page Not Loading
Date: 02-11-2025

## Symptoms

When connecting to campus ethernet, a login page (e.g. `gateway.iitj.ac.in`) normally opens for authentication.

On Ubuntu the interface shows **Connected**, but:

- No websites load (even `google.com`)
- Login page never appears
- Browser shows `ERR_ADDRESS_UNREACHABLE`
- Pinging the gateway returns `Destination Host Unreachable`

## Root Cause

Linux always prefers local routes over default routes. If Docker/VPN creates a bridge using the same subnet as your campus gateway, the OS thinks the gateway is local and sends packets into that virtual bridge instead of the real network.

Result: No packets reach the gateway → captive portal never loads.

## Diagnosis

First, check where the gateway IP is being routed:

```bash
getent hosts gateway.iitj.ac.in
ip route get <gateway-ip>
```

If the route shows something like:

```
dev docker0
dev br-xxxx
dev tailscale0
```

instead of your ethernet interface (e.g., `enpXsY`), then traffic is being captured by a local virtual network instead of the real gateway.

### Common Causes

- Docker default bridge (`172.17.0.0/16`)
- Docker Compose networks
- Old/stale Docker bridges
- VPNs (Tailscale, etc.) adding routing rules
- Any local subnet overlapping the campus network

**Example of a broken route:**

```
172.17.0.3 dev docker0 src 172.17.0.1
```

Packets never leave your laptop.

## Solution: Move Docker Away from Common Private Ranges

### Step 1: Edit Docker daemon config

```bash
sudo nano /etc/docker/daemon.json
```

Use a safe, uncommon subnet:

```json
{
  "default-address-pools": [
    {
      "base": "10.200.0.0/16",
      "size": 24
    }
  ]
}
```

### Step 2: Restart Docker

```bash
sudo systemctl restart docker
```

### Step 3: Recreate Compose networks (important)

Old networks keep old subnets. Remove them:

```bash
docker compose down
docker network prune -f
```

Then start again:

```bash
docker compose up -d
```

### Step 4: Delete any stale bridges (if still present)

```bash
ip a | grep br-
sudo ip link delete br-xxxx
```

## Verification

Check that the route now points to your ethernet interface:

```bash
ip route get <gateway-ip>
```

It should now show:

```
via <ethernet-gateway> dev enpXsY
```

If it routes through ethernet, the login page will load.

## Takeaway

If an intranet/login page shows unreachable on Ubuntu:

1. Resolve the gateway IP
2. Run `ip route get <ip>`
3. Check for Docker/VPN/bridge conflicts

It's almost always a routing issue, not DNS or the browser.
