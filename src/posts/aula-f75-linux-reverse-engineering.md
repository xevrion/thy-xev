# Reverse Engineering My AULA F75 Keyboard on Linux (Ongoing)
Date: 30-03-2026

## Why I'm Doing This

I run Fedora 43 with Hyprland. My keyboard is an AULA F75. The software to configure it, RGB effects, speed, macros, is Windows-only. There is no Linux support, no open protocol spec, nothing.

The keyboard has a "Ripples_shining" effect I like. It lights up from a keypress and spreads outward like a wave. The problem is the speed slider only goes from 0 to 4, and even at maximum it feels sluggish. I want faster. I want to push values the UI doesn't allow.

This post is not a success story. I haven't cracked it yet. But I've learned a lot about how this keyboard talks to the OS, and I'm documenting everything here so I don't lose the thread — and in case someone else is doing the same thing.

---

## The Setup

- Fedora 43, Hyprland, kernel 6.x
- AULA F75 (VendorID: `258a`, ProductID: `010c`)
- Wine 11.0 Staging
- Connected via USB-C (wired mode only, wireless is a separate problem)

---

## Step 1: Getting the Software Running Under Wine

The AULA software needs raw HID access via `/dev/hidraw`. By default, the `hid-generic` kernel driver claims the device and blocks this. The fix is a udev rule.

Find your keyboard's IDs:

```bash
lsusb
# Bus 001 Device 003: ID 258a:010c BY Tech Gaming Keyboard
```

Create the rule:

```bash
sudo nano /etc/udev/rules.d/99-aula-f75.rules
```

```
SUBSYSTEM=="usb", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="010c", MODE="0666"
KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="010c", MODE="0666"
```

Reload:

```bash
sudo udevadm control --reload-rules && sudo udevadm trigger
```

Verify:

```bash
ls -la /dev/hidraw*
# should show crw-rw-rw-
```

The F75 exposes two hidraw nodes. Confirm which belong to the keyboard:

```bash
for f in /dev/hidraw*; do
  echo -n "$f: "
  udevadm info --attribute-walk --name=$f | grep -E "idVendor|idProduct" | head -2
done
```

Mine: `/dev/hidraw1` and `/dev/hidraw2` both show `258a:010c`.

Install Wine, reset the prefix if needed, and run:

```bash
rm -rf ~/.wine  # if you get kernel32.dll errors
WINEARCH=win64 wineboot --init
wine ~/Downloads/AULA_F75_Setup.exe
wine ~/.wine/drive_c/Program\ Files\ \(x86\)/AULA/F75/OemDrv.exe
```

It opens. The keyboard is detected. Effects apply. Wine's hidraw integration works fine for this, this part is solved.

---

## Step 2: Capturing the Packets

Plan: use `usbmon` and `tshark` to capture USB traffic while moving the speed slider.

```bash
sudo modprobe usbmon
sudo tshark -i usbmon1 -w /tmp/aula_capture.pcapng
# move slider in AULA software, Ctrl+C
```

Extract HID payloads:

```bash
tshark -r /tmp/aula_capture.pcapng \
  -Y "usb.device_address == 3 && usb.transfer_type == 0x02 && usb.dst == \"1.3.0\"" \
  -V 2>/dev/null | grep "Data Fragment"
```

This worked once. I got real `SET_REPORT` control transfers:

```
bRequest: SET_REPORT (0x09)
wValue: 0x0306  (Report ID 6, Feature type)
wLength: 520
```

Three packets per Apply. 520 bytes each, zero-padded. Diffing the packets between min and max speed:

```
# Only one byte differs:
# index 79 (0x4F): min speed = 0x40, max speed = 0x00
```

Speed is a single byte. `0x40` at slider position 0 (slowest), `0x00` at position 4 (fastest). Linear steps of `0x10`. Lower value = faster. The UI is already sending the minimum possible value (`0x00`) at its maximum setting, so there's nothing to unlock by going below — unless the firmware wraps or interprets `0x00` as "default" rather than true zero.

The problem: every subsequent capture returned empty output. Wine's HID backend is not consistent. Sometimes it routes through the USB stack (visible to usbmon), sometimes it bypasses it entirely and writes directly to hidraw. You can't rely on usbmon alone.

---

## Step 3: What the HID Descriptor Says

```bash
sudo usbhid-dump -a 1:3 2>/dev/null
```

Relevant section for Report ID 6:

```
85 06          → Report ID = 6
75 08          → field size = 8 bits
96 07 02       → report count = 519 bytes
B1 02          → Feature report
```

Device expects: Report ID 6, Feature type, 519 bytes payload = 520 bytes total. Matches the control transfer capture.

---

## Step 4: Trying to Send Packets Directly

The correct ioctl for HID Feature Reports on Linux:

```python
# _IOC(READ|WRITE, 'H', 0x06, 520)
HIDIOCSFEATURE = 0xC2084806
```

Script that sends all three captured packets in sequence:

```python
import fcntl, time

HIDIOCSFEATURE = 0xC2084806

PKT1 = bytes.fromhex("0684000001008000...")  # init/handshake
PKT2 = bytes.fromhex("0604000001008000...")  # effect config
PKT3 = bytes.fromhex("060a000001000002...")  # color data

def pad(pkt):
    return bytes(pkt) + b'\x00' * (520 - len(pkt))

def send(path, pkt):
    with open(path, 'rb+', buffering=0) as f:
        fcntl.ioctl(f, HIDIOCSFEATURE, bytearray(pad(pkt)))

for speed in [0x40, 0x20, 0x00, 0x01, 0x05, 0xff]:
    pkt2 = bytearray(PKT2)
    pkt2[79] = speed
    send('/dev/hidraw2', PKT1)
    send('/dev/hidraw2', bytes(pkt2))
    send('/dev/hidraw2', PKT3)
    time.sleep(4)
```

Result: ioctl succeeded, something happened on the keyboard, but it was the wrong effect. The ripple changed to something else entirely and speed was identical across all values.

The packets from capture session 1 were probably not from Ripples_shining, I don't know what effect was active during that capture. And even if they were, something about the packet content or sequence is wrong.

---

## Step 5: strace -> Where Things Got Complicated

Since usbmon was unreliable, next approach: strace to intercept the actual syscalls Wine makes when writing to hidraw.

Find which Wine process holds the hidraw fds:

```bash
for pid in $(ps aux | grep -i wine | grep -v grep | awk '{print $2}'); do
  echo "=== PID $pid ==="
  ls -la /proc/$pid/fd 2>/dev/null | grep hidraw
done
```

Found it: the `winedevice` process holds:
- fd 51 → `/dev/hidraw1`
- fd 52 → `/dev/hidraw2`

Attaching strace on write to those fds returned nothing. Tried following threads with `-f`, tried all fd numbers, still nothing useful coming through.

The discovery (from continuing the investigation separately) is that Wine uses `writev()` with internal pipes, not direct `write()` to the hidraw fd. The real 520-byte HID payload appears inside a `writev` iov buffer:

```
writev(...)
  iov_len=520  ← this is the real device packet
```

Other sizes (64, 40, 12 bytes) in the strace output are Wine's internal message framing, not device data. The filter was wrong the whole time.

---

## Step 6: What the Real Packets Look Like

Using `writev` interception, two real 520-byte payloads were extracted, `pkt_0.bin` (low speed) and `pkt_1.bin` (high speed). Diffing them:

```
Only ONE byte changes:
offset 109: 0x47 → 0x07
```

No checksum changes. No header changes. Just that one byte inside what appears to be a repeated pattern block:

```
...09 47 09 47 09 47...
→
...09 07 09 47 09 47...
```

So the speed value isn't a standalone "speed field", it's embedded inside a table or pattern structure. Modifying only offset 109 and sending the packet had no visible effect on the keyboard. The firmware either ignores isolated single-byte changes, or requires multiple entries in the pattern to be updated, or needs a separate commit packet after the config.

---

## Where Things Stand

| Thing | Status |
|---|---|
| Wine runs the software on Fedora | ✅ |
| udev rule for hidraw access | ✅ |
| HID descriptor parsed | ✅ Report ID 6, 520 bytes |
| Speed byte identified (index 79 from usbmon, index 109 from writev) | ⚠️ conflicting |
| Reliable packet capture method | ❌ |
| Sending correct effect-specific packets | ❌ |
| Speed values beyond UI limits tested | ❌ |

The two different byte indices (79 from the usbmon capture, 109 from the writev capture) are suspicious. They might be from different packet types, or the usbmon capture was from a different effect entirely. I need a clean, confirmed capture of Ripples_shining specifically at all five speed positions.

---

## Current Hypotheses

Speed is probably not a simple single-byte field. Leading theories:

1. **Pattern table encoding** -> the speed value is repeated across multiple entries in a lookup table. All entries need to change together.
2. **Derived encoding** -> the byte value is computed from the speed setting rather than stored directly. Need to understand the formula.
3. **Missing commit packet** -> there's a separate "apply" packet that triggers the firmware to use the new config. Without it, the keyboard ignores the data.
4. **Wrong interface** -> the config might need to go to hidraw1, not hidraw2, or through a different report ID entirely.

---

## What's Next

1. Clean strace `writev` capture specifically for Ripples_shining at each slider position (0, 1, 2, 3, 4)
2. Diff all five to understand the full encoding pattern
3. Test whether sending the complete unmodified packet for Ripples_shining (no speed change) reproduces the correct effect
4. If that works, start modifying values and watching the keyboard

The udev rule and Wine setup are documented and reproducible. The packet capture methodology is mostly figured out. The missing piece is a clean, controlled, effect-specific capture session.

Will update this when I get further.

---

## Running the Software (TL;DR)

If you just want to use the AULA software on Fedora with Wine:

```bash
# udev rule (one-time setup)
echo 'SUBSYSTEM=="usb", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="010c", MODE="0666"
KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="010c", MODE="0666"' \
  | sudo tee /etc/udev/rules.d/99-aula-f75.rules
sudo udevadm control --reload-rules && sudo udevadm trigger

# run the software
wine ~/.wine/drive_c/Program\ Files\ \(x86\)/AULA/F75/OemDrv.exe
```

Tested on Fedora 43, Wine 11.0 Staging, wired USB-C. Wireless mode needs a separate udev rule for the dongle's VID/PID.
