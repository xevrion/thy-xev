# I Hated ML. Then I Discovered Agentic Architecture.
Date: 10-04-2026

My software engineering professor started a lecture on <span class="blue">agentic architecture</span> today.

I had never heard the term. I opened a new tab, searched it, and ended up on a page about Claude Code. Then about AI agents. Then about how companies are building entire products on top of this pattern.

Then I noticed something. Nobody in any of these articles was training models. Nobody was touching datasets. Nobody was doing anything I would call ML.

So I kept reading.

---

## The Assumption I Had Wrong

I had grouped everything AI-related into one bucket: machine learning. And I had decided that bucket was not for me.

Training models, fine-tuning weights, GPU clusters, loss functions, research papers — none of that interested me. I am a software engineer. I want to build things that work, not spend months getting a model to converge.

So every time someone said "AI" I mentally checked out.

That was a mistake.

Because <span class="blue">agentic architecture has nothing to do with ML</span>. The model is already trained. Someone else did that part. You just call an API.

It is the same as using Stripe. You do not build the payment processor. You call the API and build the product on top.

---

## What Agentic Architecture Actually Is

Most software works like this:

```
User clicks button → your code runs → result shown
```

Every possible situation is predicted by you in advance. You write the `if/else`. The code is dumb. It only does exactly what you told it.

Agentic software works differently:

```
User gives a goal → agent figures out the steps
```

You do not write the decisions. You give the agent a goal and a set of tools. The agent reads the situation and decides what to do.

The clearest way I can explain the difference is this:

In traditional software, <span class="blue">you hold the `if/else`</span>.

In agentic software, <span class="blue">the LLM holds the `if/else`</span> — at runtime, based on what it actually sees.

---

## The Loop

Every agentic system runs on the same core loop:

```
Goal → Think → Use a tool → See result → Think again → Repeat
```

The agent does not get the answer in one shot. It reasons, acts, observes, and decides what to do next. It keeps going until the goal is done or it decides it cannot do it.

This loop is what makes something "agentic." Not the model. Not the tools. The loop.

---

## What I Built

I built a <span class="blue">CLI debug agent</span> called `debug-agent`.

You give it an error message. It finds the bug. It fixes it. It verifies the fix worked.

```bash
python main.py "NameError: name 'rsult' is not defined in app.py line 5"
```

Output:

```
🐛 Debugging: NameError: name 'rsult' is not defined in app.py line 5

⚙️  Using tool: list_structure with {}
✅ Result: ./ agent.py config.py main.py tools.py test2/ app.py utils.py ...

⚙️  Using tool: read_file with {'path': 'app.py'}
✅ Result: ...print(rsult)...

⚙️  Using tool: write_file with {'path': 'app.py', 'content': '...print(result)...'}
✅ Result: Successfully wrote to app.py

✅ Bug Fixed!
📁 File:     app.py
📍 Line:     5
🔍 Cause:    Typo — 'rsult' should be 'result'
🔧 Fix:      Changed print(rsult) to print(result)
```

I never told it to use `read_file`. I never told it to look at line 5. It figured that out from the error message.

The agent has five tools: `list_structure`, `read_file`, `run_command`, `search_codebase`, and `write_file`. That is the entire surface area it can interact with. Everything else is the LLM reasoning about what to do with them.

The code that runs the loop is about 50 lines.

---

## The Multi-File Problem

The interesting test was a bug that <span class="blue">spanned two files</span>.

`app.py` was crashing with:

```
TypeError: 'NoneType' object is not subscriptable at line 5
```

The error was in `app.py`. But the cause was in `utils.py` — a function that silently returned `None` when it should have raised an error.

A traditional debugger points you at `app.py` line 5. That is where the crash is. But fixing line 5 does not fix the real problem.

The agent read `app.py`, traced where the value came from, read `utils.py`, identified that `get_user()` was returning `None` for unknown IDs, and fixed `utils.py` — the root cause, not the symptom.

It got the path wrong on the first attempt because it did not know the project structure. After I added a `list_structure` tool that maps the entire directory before doing anything else, it got it right immediately.

<span class="blue">Context is everything.</span> An agent that cannot see your project makes things up. An agent that can see it reasons correctly.

---

## What I Learned That Surprised Me

**Agents are bad at open-ended tasks.**

I tried making it write a README. It kept writing empty skeleton sections, overwriting the file multiple times, and hallucinating content it had not actually read.

Give it `"find all TODO comments"` and it is perfect. Give it `"write a README"` and it falls apart.

The difference is specificity. Agentic systems work best when the goal has a <span class="blue">clear pass/fail condition</span>. A bug is either fixed or it is not. A TODO either exists in the file or it does not. A README being "good" is subjective, and LLMs have no way to know when they are done.

**The system prompt shapes everything.**

The same model with a vague system prompt and a tight system prompt behaves completely differently. When I told it "never explain your steps, just call tools then return JSON," it stopped narrating and started acting. When I told it "ALWAYS call list\_structure first," it stopped guessing paths.

The model is not the hard part. <span class="blue">Telling it exactly what you want is the hard part.</span>

**Not every problem needs an agent.**

There was a moment where the agent fixed one bug and introduced a broken import. I spent twenty minutes trying to get the agent to fix its own mistake before I just opened the file and changed one word myself.

Agents are for problems where you do not know where the bug is. Not for "I can see the wrong word right there." Knowing when to use the agent and when to just fix it yourself is a skill.

---

## The Stack

No ML. No training. No research papers.

- Python
- Groq API — free tier, fast inference
- Llama 4 Scout (`meta-llama/llama-4-scout-17b-16e-instruct`)
- Five Python functions as tools
- A `while True` loop

The entire agent loop is this:

```python
while True:
    response = client.chat.completions.create(
        model=Config.MODEL_NAME,
        messages=messages,
        tools=TOOLS_SCHEMA
    )
    message = response.choices[0].message

    if message.tool_calls:
        # run the tool, append result to messages
        # loop again
    else:
        # no tool call = final answer
        break
```

That is it. The `messages` list is the agent's memory. Every tool result gets appended to it. The LLM re-reads the entire history every iteration and decides what to do next.

Everything else is just tooling around that loop.

---

## Why This Matters

I spent months avoiding anything with "AI" in the name because I assumed it required ML knowledge I did not have and did not want.

It does not.

The AI engineering role — building products on top of models — is pure software engineering. You think about APIs, tool design, error handling, prompt structure, and system architecture. None of that requires knowing how transformers work.

The models are the infrastructure. You are the application layer.

That distinction took me an embarrassingly long time to understand. But once it clicked, an entire category of problems became buildable that I had written off completely.

The code for `debug-agent` is at: https://github.com/xevrion/debug-agent

*Written by Yash (xevrion)*
