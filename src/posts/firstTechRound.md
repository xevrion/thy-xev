# My First Technical Interview (AlgoUniversity)
Date: 14-02-2026

Today I gave my first ever technical interview for an SDE intern role at AlgoUniversity.

There were 2 DSA questions and 2 CS fundamentals (OS + OOP).

This is a straightforward breakdown of what was asked, what I thought, what was right, and what I missed.

---

## DSA Question 1 — Search in Infinite Sorted Array

**Problem**

Sorted array (monotonically increasing, unique).  
Length unknown (conceptually infinite).  
Given a target → return index or -1.

Example:
```
arr = [2, 5, 9, 14, 21, 37, 58, 73, 91, ...]
target = 37 → 5
```

### What I thought

Binary search is ideal since sorted.  
But right boundary unknown.

So I tried expanding range exponentially:

```
while (arr[last] < target)
    last *= 2;
```

I actually wrote this part correctly.

But I embedded it *inside* a binary search loop instead of treating it as a separate phase:

```
while (first < last) {
    while (arr[last] < target)
        last *= 2;

    mid = (first + last) / 2;
    // binary search logic
}
```

### What was right

- Realized boundary must be discovered
- Used exponential growth (correct idea)

### What was wrong

- Mixed range expansion with binary search
- Didn’t separate phases

### Correct structure

1. Expand range exponentially  
2. Binary search inside range  

### Learning

When array size unknown → exponential search first, binary search later.  
Structure matters as much as idea.

---

## DSA Question 2 — Minimum Cost Grid Path

**Problem**

n×n grid with costs.  
Start: (0,0)  
End: (n−1,n−1)  
Move in 4 directions.  
Minimize total cost.

Example:
```
1 3 1
2 1 4
3 2 1
```

### What I thought

Grid → graph  
Cell → node  
Neighbors → edges  
Cost → weight  

So I chose Dijkstra.

Started with direction arrays:

```
dirX = {1,0,0,-1}
dirY = {0,1,-1,0}
```

Then I drifted toward BFS + “pick smallest each stage”.

### What was right

- Correct modeling
- Correct algorithm choice (Dijkstra)

### What was wrong

- Forgot priority queue implementation
- Couldn’t recall Dijkstra mechanics

### Learning

Knowing algorithm name ≠ implementing it.  
Need recall fluency for core algorithms (Dijkstra, BFS, DFS).

---

## OS Question — 2GB RAM Running 5GB Game

**Question**

How can a 2GB RAM laptop run a 5GB game?

### My answer

Swap memory on disk acting like extra RAM.

### Evaluation

Correct concept.

Full idea: virtual memory → inactive pages moved to disk.

### Learning

OS fundamentals are mostly clear.

---

## OOP Question — Virtual Destructors

**Question**

What is a virtual destructor and why important?

### My answer

I misunderstood and talked about `auto` type deduction.  
So this was wrong.

### Correct concept

If deleting via base pointer:

```
Base* b = new Derived();
delete b;
```

Without virtual destructor → only base destroyed.  
Derived cleanup skipped → leak.

### Learning

Need stronger OOP fundamentals recall.

---

## Interview Feedback

Interviewer said:

- Improve DSA
- Talk more and discuss approach
- He would give hints if I interacted more

---

## Overall Learning

- I was often structurally close in DSA
- Main gaps: recall + articulation
- Need practice implementing core graph algorithms
- Need to think aloud in interviews

First technical interview → clear direction now.
