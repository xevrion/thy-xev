# I Broke My Dual Boot. Then Fixed It. Here's Everything.
Date: 11-04-2026
Tags: linux, windows, sysadmin, grub, dualboot

My Windows was cooked.

Apps taking 2-3 minutes to open. Random freezes every 10 seconds. No websites loading. Completely unusable. And the frustrating part? I booted into Fedora on the same machine and everything was silky smooth. Same hardware. Zero issues.

So it wasn't the laptop. It was Windows.

I ran some diagnostics — pulled event logs, checked services. Turns out LenovoVantageService was hanging for 30 seconds at a time (Event 7011), which matched the freeze pattern exactly. The Valorant anti-cheat (vgc) was also crashing repeatedly, and BcastDVRUserService (Xbox DVR) was stuck in a loop firing every 4 minutes. Windows Search was restarting itself. It was a mess.

I could've tried to fix each service one by one. But I barely use Windows. I only boot into it for gaming — Valorant, Steam, that's it. So I decided: clean reinstall. Minimal Windows. No fluff.

---

## Before Anything — Backup

I backed up everything that mattered to my D: drive before touching anything.

FL Studio projects, game saves (Ghost of Tsushima, GTA V, Watch Dogs 2), voice recordings, Arduino files, all my pictures, desktop files, code, documents, downloads. Everything.

6,471 files. 6.3 GB. D: drive still had 16 GB free after. Good.

---

## Making the USB

Downloaded the Windows 11 Media Creation Tool, grabbed a 59GB USB.

Except the USB was write-protected. It had my old Fedora installation media on it and DiskPart was throwing errors. Had to go into diskpart, clear the readonly attribute, clean the disk, create a new partition, format it. Even then it wasn't showing in File Explorer until I marked the partition active.

Eventually got it working, ran the Media Creation Tool, USB was ready.

---

## The Install

Booted from USB (F12 on Lenovo LOQ), selected Custom install, deleted only the Windows partitions, left D: completely untouched.

At the "connect to network" screen I did the classic trick — `Shift + F10` to open CMD, typed `OOBE\BYPASSNRO`, let it restart. Now there was an "I don't have internet" button. Local account only. No Microsoft account. No subscription suggestions. Clean.

After install, first thing I ran before even connecting to internet:

```
irm christitus.com/win | iex
```

Chris Titus Tech's Windows utility. Removes bloatware, disables telemetry, kills OneDrive, Cortana, Bing search in Start, sets classic right-click menu, adds Ultimate Performance power profile. One click. Done.

GPU drivers had auto-installed. Second monitor worked after. Set refresh rate to 165Hz, disabled mouse acceleration (uncheck "Enhance pointer precision"), turned off every privacy toggle in Settings.

Clean Windows. Exactly what I wanted.

---

## OH HELL NAH

I was in a Discord call with a friend while installing. Mid-conversation he goes:

*"installing Windows after Linux is hell... it overwrites the boot drive"*

I typed: **"OH HELL NAH I FORGOT"**

He was right. When Windows installs, it overwrites the EFI bootloader with its own. GRUB — the bootloader that lets you choose between Fedora and Windows — gets replaced. Fedora doesn't get deleted. Your files are fine. But there's no longer any entry point to it. The system just boots straight into Windows and Fedora "disappears."

I had already wiped the Fedora ISO off my USB to make the Windows installer.

So after Windows was set up, I downloaded the Fedora ISO again, flashed it with Balena Etcher, and booted from it.

---

## Fixing GRUB — What Actually Happened

This is where it got interesting.

Booted into Fedora Live USB, went to Troubleshooting → Rescue a Fedora system, mounted the existing Fedora install at /mnt/sysimage.

Then chroot'd in:

```bash
chroot /mnt/sysimage
```

Tried the standard fix:

```bash
grub2-install /dev/nvme0n1
```

Got blocked immediately.

**Problem 1 — Secure Boot.**
Fedora throws an error when you try to manually run grub2-install with Secure Boot enabled. It wants you to use `dnf reinstall grub2-efi shim` instead.

Fix: disabled Secure Boot in BIOS.

**Problem 2 — No network inside chroot.**
Tried `dnf reinstall grub2-efi shim`. dnf couldn't resolve hostnames. No DNS inside the live environment. `/etc/resolv.conf` was empty. The package manager was completely broken.

So dnf was out. We needed to install the bootloader directly without fetching anything from the internet.

**The actual fix:**

```bash
grub2-install --target=x86_64-efi \
  --efi-directory=/boot/efi \
  --bootloader-id=fedora \
  --removable --force
```

`--force` bypasses Fedora's restrictions on manual grub2-install.
`--removable` installs a fallback EFI loader at `EFI/BOOT/BOOTX64.EFI` — this is the path UEFI firmware always checks, so it guarantees the system can find GRUB even if the named boot entry breaks.

No errors. Then:

```bash
grub2-mkconfig -o /boot/grub2/grub.cfg
```

Rebooted. GRUB menu appeared. Fedora booted perfectly.

---

## Cleaning Up EFI

Ran `efibootmgr -v` to check the boot entries:

```
Boot0000 → Fedora ✅
Boot0005 → Windows Boot Manager ✅
Boot0001 → Ubuntu ❌ (ghost from years ago)
Boot0002 → Linpus ❌ (USB residue)
```

Two ghost entries just sitting there. Cleaned them:

```bash
sudo efibootmgr -b 0001 -B
sudo efibootmgr -b 0002 -B
```

Final boot order: Fedora → Windows. Clean.

---

## What I Actually Learned

Fedora doesn't want you running grub2-install manually. It prefers handling bootloader updates through its package manager. But when you're in a live environment with no network, that's not an option — so `--force --removable` is the escape hatch.

`--removable` is underrated. By writing to the fallback EFI path instead of a named entry, you make the bootloader firmware-independent. Even if the Fedora boot entry gets wiped again, the system will still find GRUB.

Context matters more than commands. I knew what commands to run. What slowed things down was not being able to see the full picture — Secure Boot state, DNS config, exact partition layout. Once those were clear, the fix was straightforward.

And the most important thing: **you don't lose Linux when Windows overwrites GRUB. You lose the pointer to it.** The data is always fine. It's just a bootloader problem, and bootloader problems have a 10-minute fix.

---

## The Actual Boot Flow Now

```
BIOS/UEFI
    ↓
GRUB (Fedora)
    ↓
Fedora   |   Windows
```

Both working. EFI clean. Windows minimal and fast. Fedora untouched.

Worth it.

*Written by Yash (xevrion)*
