# Ubuntu Ethernet Login Page Not Loading
Date: 02-11-2025

## Fixed — Docker subnet conflict
## Symptoms

When connecting to campus ethernet, a login page (e.g. `gateway.iitj.ac.in`) normally opens for authentication. On Ubuntu the interface showed "Connected" but no sites loaded (even `google.com`) and manual attempts to reach the gateway returned "Destination Host Unreachable".

## Diagnosis

Run:

```bash
ip route
```

If you see a route like `172.17.0.0/16 dev docker0`, Docker's default network overlaps your campus gateway (for example `172.17.0.3`). Packets destined for the gateway were being routed into Docker's virtual network instead of to the campus gateway.

Example symptom when pinging the gateway:

```
From 172.17.0.1 icmp_seq=1 Destination Host Unreachable
```

## Fix

1. Edit (or create) the Docker daemon config:

```bash
sudo nano /etc/docker/daemon.json
```

2. Add or update the `bip` setting to a non-conflicting subnet, for example:

```json
{
  "bip": "172.26.0.1/16"
}
```

3. Restart Docker and reconnect the ethernet:

```bash
sudo systemctl stop docker
sudo systemctl stop docker.socket
sudo systemctl daemon-reload
sudo systemctl start docker
# or: sudo systemctl restart docker
```

Reconnect the ethernet cable; the login page should open again.

## Explanation (short)

Docker creates a `docker0` bridge using `172.17.0.0/16` by default. If your network/gateway uses the same range, the OS routes traffic into the Docker bridge instead of the real gateway. Changing Docker's bridge subnet removes the conflict.

## Takeaway

If your intranet/login page or proxy stops working on Ubuntu, check `ip route` for `docker0` overlapping your network. Change Docker's subnet in `/etc/docker/daemon.json` and restart Docker.
