# I Built a Peer-to-Peer Chat App in Go
Date: 28-01-2026

Sometimes I build things not because they are "useful", but because my brain refuses to shut up until I understand how something works.

This project was exactly that.

I kept using apps like Discord, WhatsApp, Slack, Telegram… and somewhere in the back of my mind there was always this question:

**"What actually happens when I send a message?"**

- Where does it go?
- Who stores it?
- How do two machines even talk?

So instead of watching another YouTube tutorial, I did the most painful thing possible: I decided to build a chat app from scratch.

No backend. No database. No server. Just pure **peer-to-peer**.

And that's how **echo-go** was born.

## The Idea

I wanted something stupidly simple: Run this on two machines:

```bash
go run ./cmd/echo-go
```

And they should just… talk.

No server. No cloud. No middleman. Just:

**User ↔ User**

Directly. Like two laptops whispering over wires.

## What It Actually Is

echo-go is a terminal chat app (TUI) written fully in Go.

The tech stack is very nerd-core:

- Go
- BubbleTea (terminal UI)
- libp2p (real P2P networking)

Every instance is both **client + server**.

So when you run it, your machine:

- Starts a libp2p node
- Opens a TCP port
- Listens for peers
- Connects to others
- Opens a chat UI
- Sends messages directly

No central server exists. If I turn off my laptop, I disappear from the network. That's it. Very raw. Very honest.

## Why I Built This

Not gonna lie — this wasn't about "shipping a product".

It was about learning stuff I kept avoiding:

- goroutines
- channels
- concurrency
- real networking
- distributed systems
- clean architecture

Basically all the scary words.

I intentionally avoided tutorials because tutorials make everything look magical. I wanted to suffer a little and actually understand what breaks.

## Architecture (The Part I'm Weirdly Proud Of)

I forced myself to structure it properly instead of writing one giant `main.go`.

So I split it into layers:

- `core/` → business logic only
- `net/` → libp2p networking
- `tui/` → terminal UI
- `cmd/` → glue code

The rule was simple:

- Core knows nothing about networking
- Net knows nothing about UI
- UI only talks to manager
- cmd just wires everything

It felt overkill at first. But when bugs started appearing at 2AM… this separation literally saved my sanity.

## How Messages Actually Flow

Typing "hello" does this:

```
UI
→ Transport.Send()
→ libp2p stream
→ remote peer
→ Manager.Receive()
→ UI renders
```

The Manager basically became an event bus between network and UI. Simple, but beautiful.

The first time I typed "hello" and saw it appear on another laptop directly…

Man, that felt illegal. Like I hacked the internet or something.

## The Bugs That Humbled Me

This project looked easy on paper. It absolutely was not. Networking is pure chaos.

Most bugs weren't "wrong code". They were:

- Timing
- Ordering
- Race conditions
- Streams closing silently
- Goroutines fighting each other

My favorite one:

Peer B could send messages to A. Peer A could NOT send to B. **Asymmetric chat. One-way friendship.**

Turned out I was creating multiple streams per peer and accidentally closing some of them.

Fix was:

- Exactly ONE stream per peer
- Never close it unless dead
- Protect maps with mutex

After that everything magically became stable. That moment genuinely felt like leveling up in life.

## Things This Project Taught Me

Some realizations hit hard:

- libp2p streams are full duplex (one stream = both ways)
- Concurrency without mutex = disaster
- "Network bugs" are usually just timing issues
- Separating logic layers makes debugging 10x easier
- Distributed systems are 80% edge cases

And also: **Packets are just tiny letters traveling between machines. Nothing mystical. Just physics.**

## Current Features

Right now it's simple but usable:

- Terminal UI
- Real-time chat
- Peer-to-peer (no server)
- Custom usernames
- Multi-peer support
- Manual connect via multiaddr

You can literally run:

```bash
PORT=8080 NAME=alice go run ./cmd/echo-go
PORT=8081 NAME=bob go run ./cmd/echo-go
```

And start chatting locally.

## What's Next

Planned upgrades:

- mDNS auto discovery (LAN auto-connect)
- Peer list
- Message history
- JSON protocol
- Rooms
- Maybe file sharing
- Maybe web UI later

Basically turning it from "toy" → "actually useful". Let's see how far I take it.

## Why This Project Felt Different

Most of my projects are: frontend, backend, APIs, databases…

This one felt… **lower level**. Closer to the metal. Like touching the wires directly.

It made abstract concepts like:

- Streams
- Nodes
- Peers
- Concurrency

Feel tangible.

Typing text and watching it appear on another machine without any server in between is strangely satisfying. Like watching packets breathe.

## Final Thoughts

This app will probably never compete with anything. And that's fine.

It wasn't built to impress anyone. It was built to understand something deeply.

And honestly, I think every developer should build at least one "from scratch" networking project in their life.

You stop fearing the system. You start respecting it. And you realize the internet isn't magic.

**It's just a bunch of machines talking politely.**

echo-go just made that visible.

