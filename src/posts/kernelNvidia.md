# How I Spent 5 Hours Fixing My Broken Linux (And Almost Lost My Mind)
Date: 06-11-2025



I don’t even know where to begin. One morning I booted my laptop, and suddenly Ubuntu just… didn’t feel right. My dual monitors weren’t detected, the smooth animations were gone, and the whole desktop felt like it was running on life support. My first thought was, “maybe the NVIDIA driver just crashed.” So naturally, I opened a terminal and ran the sacred command:

```bash
nvidia-smi
```

And it threw the most cursed message possible:

> NVIDIA SMI has failed because it couldn’t communicate with the NVIDIA driver.

That was the moment I knew I was about to have a very long day.



## The Panic

I immediately jumped into fix-it mode — reinstalling NVIDIA drivers, restarting the display manager, rebooting into recovery mode, you name it. Except… nothing changed. The screen kept freezing at login, and the second monitor never came to life.

At some point, I realized something weird. The system was booting with **kernel 6.14.0-35**, but every time I ran recovery mode, it showed **6.14.0-33**. Turns out, I had two kernels installed and had been installing NVIDIA for the wrong one over and over again. So yeah, I was basically fixing a different timeline.



## The Confusion

I started wondering if the problem was me or the universe. I went into recovery mode again, tried random commands, edited files I didn’t understand (`/etc/gdm3/custom.conf`… I’m looking at you), even enabled some “valent” flag I found online. Nothing. The GUI stayed grey and lifeless.

Then I started thinking — what if the kernel itself was broken? Maybe 6.14.0-35 didn’t have what it needed to run the drivers. I checked for `linux-modules-extra` and… it wasn’t installed. That was the missing puzzle piece. Without that, no network, no Wi-Fi, no GPU drivers. My Ubuntu had basically forgotten what hardware was.



## The Desperation

With no internet, I couldn’t even install the missing packages. That’s when things got creative. I booted into a **Live USB**, tried to mount my root partition, and even tried to mount a second USB drive to transfer `.deb` files manually. Except… recovery mode didn’t even recognize my exFAT drive.

At that point, I was staring at the terminal, typing `mount -o remount,rw /` like some ritual, praying to the Linux gods for mercy. I even tried to SSH into my laptop from another computer — but of course, without network drivers, that failed too.

I remember sitting there, 3AM, no Wi-Fi, no GPU, no clue, and thinking — maybe I should just reinstall everything. Then immediately panicking about losing my configs, dotfiles, and Ghostty setup. I swear, for a brief moment, I considered going back to Windows.



## The Turning Point

Then something clicked. Kernel 6.14.0-33 worked. It had network access. I could use that to fix 6.14.0-35. So I booted into 33 and ran:

```bash
sudo apt update
sudo apt install --reinstall linux-image-6.14.0-35-generic linux-modules-6.14.0-35-generic linux-modules-extra-6.14.0-35-generic linux-headers-6.14.0-35-generic
sudo update-initramfs -u -k 6.14.0-35-generic
sudo update-grub
```

That rebuilt everything for the new kernel. I rebooted, selected **6.14.0-35**, and finally saw my Wi-Fi network list pop up again. Ethernet worked too. I was back online.

The only thing left was the NVIDIA driver.



## The Final Boss

With the internet working again, I ran one last set of commands:

```bash
sudo apt purge -y 'nvidia-*'
sudo apt autoremove --purge -y
sudo apt install -y --no-install-recommends nvidia-driver-535 dkms build-essential
sudo update-initramfs -u
sudo update-grub
sudo reboot
```

When the system came back up, I ran `nvidia-smi` out of habit, expecting another failure. But instead… it showed my **RTX 4060**, alive and well. Both monitors working. Animations back. Everything buttery smooth.

I literally whispered, “finally,” out loud.



## What Actually Happened

* Ubuntu upgraded from kernel 33 → 35.
* The new kernel was missing `linux-modules-extra`, which includes all network and GPU drivers.
* I was reinstalling NVIDIA in kernel 33, not 35.
* Kernel 35 couldn’t even load network interfaces or DKMS modules.
* Everything looked broken because I was debugging from the wrong kernel.



## What I Learned (and Won’t Forget)

* Always check `uname -r` before installing anything.
* Don’t fix drivers on the wrong kernel — DKMS builds modules per version.
* Keep `linux-image`, `linux-headers`, and `linux-modules-extra` in sync.
* Lock the NVIDIA driver once it’s stable:

  ```bash
  sudo apt-mark hold nvidia-driver-535
  ```
* And most importantly: **don’t panic.** Linux looks dead long before it’s actually dead.



## The Aftermath

After everything, I ended up running:

```bash
uname -r
# 6.14.0-35-generic
dkms status
# nvidia/535.274.02, 6.14.0-35-generic, x86_64: installed
```

Network working. GPU alive. Dual monitors shining. The chaos was over.



It’s funny now, but in the middle of it, I genuinely thought I’d destroyed my system. I even told a friend I might SSH into my own laptop to fix it (which, in hindsight, is the most overconfident sentence I’ve ever said).

But hey — I survived, learned how the Linux kernel actually works, and came out knowing how to fix it properly next time.

**Would I do it again?** Never.
**Did I learn something worth five hours of suffering?** Absolutely yes.

*Written by Yash (xevrion)*
