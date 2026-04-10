# From Ubuntu to Fedora + Hyprland: One Day, Zero Data Loss
Date: 22-03-2026
Tags: linux

## Why I Did It

I had been on Ubuntu 24.04 with GNOME for a while. It worked. But it felt heavy. Every time I opened btop, GNOME was sitting there eating 1.5GB of RAM doing nothing. The extensions kept breaking after updates. The whole thing felt like I was fighting the OS instead of using it.

I had tried Arch before. It died on me after a WiFi issue I couldn't fix at 2am, and I gave up. Ended up back on Ubuntu and stayed there.

But the itch came back. I wanted a proper tiling window manager. I wanted Hyprland. I wanted the kind of setup where everything on screen is exactly where I put it.

This is the story of how I moved from Ubuntu to Fedora 43 with Hyprland and Noctalia shell in a single day, without losing a single file.

---

## The Setup Before

My machine is a Lenovo LOQ 15IRX9. i7-14700HX, 16GB RAM, RTX 4060 Max-Q, 1TB NVMe. Dual boot with Windows. Ubuntu was on a 55GB root partition with a separate 276GB home partition.

The partition layout looked like this:

```
nvme0n1p3   368GB   Windows C:
nvme0n1p5   246GB   DDrive (data)
nvme0n1p6    55GB   Ubuntu root  ← this gets wiped
nvme0n1p7     5.4GB  Swap
nvme0n1p8   276GB   /home        ← this stays
```

The key insight that made this whole migration stress-free: the home partition never gets touched. Everything I care about lives there. My projects, dotfiles, SSH keys, browser profiles, all of it. The root partition is just the OS. Wipe it, install something new, mount home as-is, done.

---

## Step 1: Audit Everything First

Before touching anything, I ran a Claude Code prompt that did a full system audit. It crawled every installed package, every config file, every service, every custom script, all the SSH keys, GPG keys, cron jobs, Docker volumes, everything. Dumped it all into a `system-audit.md`.

This file became the reference point for the entire migration. If I forgot something later, I knew exactly where to look.

The audit found some things I had completely forgotten about:

- A custom systemd service for auto-logging into the IITJ campus network
- A `fix144hz.service` that forced 144Hz on my displays after login
- An rclone cron job syncing my Obsidian vault to Google Drive every hour
- Git credential manager installed at `/usr/local/bin/git-credential-manager`

None of that would have survived if I had blindly wiped and reinstalled.

---

## Step 2: Back Up What Lives on Root

Since the home partition stays, the only things that needed backing up were things on root:

- `/etc/NetworkManager/system-connections/` (campus WiFi credentials)
- GPG secret key export
- Docker named volumes (Redis, Navidrome data)
- `/usr/local/bin/git-credential-manager`
- Custom systemd unit files

Backed all of that to the DDrive partition. Total backup size was maybe 50MB. Nothing dramatic.

---

## Step 3: Resize and Install

The Ubuntu root partition was 55GB and nearly full at 91%. I wanted more room for Fedora. So I booted a Fedora live USB, opened GParted, shrunk the DDrive partition by 30GB, deleted the Ubuntu root partition, and created a new 85GB partition in the freed space.

Then the Fedora installer. The partition assignment screen is where most people panic. It's actually simple once you know what you're doing:

```
nvme0n1p1  →  /boot/efi   mount, DO NOT reformat
nvme0n1p7  →  /home        mount, DO NOT reformat
nvme0n1p8  →  /            format as ext4
nvme0n1p6  →  swap         mount
```

That's it. The installer doesn't touch anything not listed here. My home partition was never in danger.

One thing Fedora tripped me on: after install, SDDM failed to log me into KDE because it couldn't find the home folder. The reason was SELinux. Fedora uses SELinux with strict file context labels. My home partition came from Ubuntu, so none of the files had the right labels. Fixed with:

```bash
sudo restorecon -rv /home/xevrion
```

This relabels everything correctly for Fedora's SELinux policy. Single command, took about 30 seconds, fixed the login loop entirely.

---

## Step 4: Hyprland

Installing Hyprland on Fedora is straightforward:

```bash
sudo dnf install -y hyprland waybar rofi dunst hyprpaper grim slurp wl-clipboard cliphist xdg-desktop-portal-hyprland polkit-gnome kitty
```

For the shell, I used Noctalia. It's a Quickshell-based desktop shell with a built-in bar, notification system, app launcher, clipboard manager, control center, and wallpaper management. It installs from the Terra repository:

```bash
sudo dnf install --nogpgcheck --repofrompath 'terra,https://repos.fyralabs.com/terra$releasever' terra-release
sudo dnf install noctalia-shell
```

Then add it to Hyprland's config:

```
exec-once = qs -c noctalia-shell -d
```

The `-d` flag is important. Without it, Noctalia dies when you close the terminal you launched it from.

---

## Step 5: NVIDIA

NVIDIA on Wayland used to be a nightmare. In 2026 it mostly works, but you still need the proprietary drivers:

```bash
sudo dnf install -y akmod-nvidia xorg-x11-drv-nvidia-cuda
sudo akmods --force
sudo dracut --force
```

For power management, add this so the GPU doesn't stay at full power when idle:

```bash
echo 'options nvidia NVreg_DynamicPowerManagement=0x02' | sudo tee /etc/modprobe.d/nvidia-power.conf
```

And in `hyprland.conf`:

```
misc {
    vfr = true
}
```

VFR (variable frame rate) tells Hyprland to stop rendering at full refresh rate when nothing is moving on screen. On a laptop this matters a lot for heat and battery.

---

## Step 6: The Config

My `hyprland.conf` ended up with a few key things beyond the defaults:

**Dual monitor setup.** My external is a Gigabyte M27QA, 1440p at 144Hz. Laptop screen is 1080p at 144Hz.

```
monitor = HDMI-A-1, 2560x1440@144, 0x0, 1
monitor = eDP-1, 1920x1080@144, 2560x0, 1
```

External on the left, laptop on the right, both at 144Hz.

**Animations.** The default config from my friend had animations disabled. I added smooth ones:

```
animations {
    enabled = true
    bezier = wind, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 6, wind, slide
    animation = workspaces, 1, 5, overshot, slidevert
}
```

**Rounded corners and blur:**

```
decoration {
    rounding = 10
    blur {
        enabled = true
        size = 6
        passes = 3
    }
}
```

**No sleep.** The NVIDIA wake-from-suspend bug on this laptop means if the machine sleeps, the screen never comes back on. Masking suspend entirely is the cleanest fix:

```bash
sudo systemctl mask sleep.target suspend.target hibernate.target
```

---

## What Carried Over Automatically

This is the part that surprised me. Because the home partition was preserved, a huge amount of stuff just worked on first boot with zero setup:

- All my projects in `~/Coding/`
- Neovim config (LazyVim, all plugins)
- Zsh config, Powerlevel10k, oh-my-zsh
- Ghostty config including the custom cursor shader
- SSH keys and GPG key (already in `~/.ssh/` and `~/.gnupg/`)
- Git config with all aliases and KDE invent.kde.org URL rewrites
- All browser profiles for Chrome, Brave, Firefox (9 Chrome profiles, all intact)
- EasyEffects Chu2 Harman EQ preset
- Obsidian Brain vault
- Docker compose files for the homelab

The browsers needed one sign-in each to re-sync, but all local data was there before I even signed in.

---

## The Dotfiles Repo

After getting everything working, I set up a proper dotfiles repo using `stow`. The idea is simple: your configs live in `~/dotfiles/` and stow creates symlinks from there to the actual config locations. Every change you make is automatically tracked.

```bash
sudo dnf install -y stow
mkdir -p ~/dotfiles/{hyprland,ghostty,nvim,zsh,rofi,noctalia}/.config

# Move configs in, create symlinks
mv ~/.config/hypr ~/dotfiles/hyprland/.config/hypr
ln -s ~/dotfiles/hyprland/.config/hypr ~/.config/hypr
# repeat for each config
```

Now `~/dotfiles/` is a git repo at <a href="https://github.com/xevrion/dotfiles">github.com/xevrion/dotfiles</a>. Anyone can clone it and run `stow hyprland ghostty nvim zsh` to get the same setup.

---

## What It Looks Like Now

Fastfetch on first terminal open:

```
OS:      Fedora Linux 43 x86_64
Kernel:  Linux 6.19.8-200.fc43
WM:      Hyprland 0.51.1 (Wayland)
Terminal: ghostty 1.3.1
CPU:     Intel i7-14700HX (28) @ 5.50 GHz
GPU:     NVIDIA GeForce RTX 4060 Max-Q [Discrete]
Memory:  8.1 GiB / 15.4 GiB
```

RAM idle is around 1.8GB including the Noctalia shell and all the background services. That's down from 1.5GB just for GNOME on Ubuntu, and now the WM is actually doing something useful.

The wallpaper changes on `Super + W` and automatically generates a matching color scheme for the entire shell. The notifications match the theme. The blur and rounded corners make everything feel cohesive.

---

## Things That Were Annoying

**Git Credential Manager.** Not in any Fedora repo. Had to grab the tarball from GitHub releases:

```bash
curl -L https://github.com/git-ecosystem/git-credential-manager/releases/download/v2.7.3/gcm-linux-x64-2.7.3.tar.gz -o /tmp/gcm.tar.gz
sudo tar -xvf /tmp/gcm.tar.gz -C /usr/local/bin/
git-credential-manager configure
```

**Ghostty shader support.** Ghostty 1.1.3 (Fedora's version at the time) had a bug where custom shaders failed to load on Wayland. Updated to 1.3.1 via COPR, shader works fine.

**Qt version conflict.** Installing `hyprland-qtutils` from one COPR pulled in Qt 6.9, which conflicted with Noctalia's requirement for Qt 6.10. Removing `hyprland-qtutils` resolved it.

**SELinux.** Already covered above but worth repeating. If you're moving a home partition from a non-SELinux distro to Fedora, `restorecon -rv /home/username` is mandatory.

---

## Total Time

Start to working desktop: about 6 hours, including a lot of time figuring things out along the way. A clean run knowing what I know now would take maybe 2 hours.

Zero data lost. Every project, every config, every browser profile, every key, all intact.

The setup is documented at <a href="https://github.com/xevrion/dotfiles">github.com/xevrion/dotfiles</a> if you want to see the actual config files.
