# DSA & Competitive Programming Roadmap
Date: 05-05-2026
Tags: dsa, guide, competitive-programming

This is my public roadmap to go from shaky foundations to:

- Solving most Leetcode Hards, all Mediums and Easys independently
- Reaching 1600–1800 rating on Codeforces
- Crushing every DSA round in placements — no blanking, no hesitation

3 months. No excuses. I'm posting this publicly to stay accountable. Every checkbox gets a date when it's done.

---

## Resources I'm Using

These are the only resources I need. Seniors and people who've done this before all point to the same things — so I'm trusting the process.

- **NeetCode YT + NeetCode 250 Sheet** — primary problem list. If stuck on any problem, watch his video. He explains the intuition, not just the code. Use the sheet but submit on LeetCode so the count goes up.
- **Codestory with Mik YT** — watch for problem-solving mindset and contest strategy. His thinking-out-loud style builds intuition fast.
- **LuvDSA YT** — additional problem walkthroughs for practice reinforcement.
- **LeetCode Top 150** — milestone target. If I can do all of these, I'm placement-ready.
- **cp-algorithms.com** — for deep dives on graph and DP algorithms.
- **Codeforces problem filter** — daily grind for CP rating.

---

## Daily Schedule

**Weekdays — 2.5 hours**
- 1 hour morning: 1–2 LeetCode problems (topic I'm currently on). Minimum 30 min struggle before any hint.
- 1 hour evening: theory if new topic, OR 1 more problem.
- 30 min: review solution, understand alternate approaches, note patterns.

**Weekends — 4 hours**
- 2 hours: 2–3 problems, slightly harder than weekday target.
- 1 hour: CF contest (live or virtual) on Saturday.
- 1 hour: upsolve everything missed in the contest. Non-negotiable.

**Daily problem target: 3–4 problems.** On slow days (GSoC heavy), minimum is 2. Zero is never acceptable.

---

## Phase 1 — Foundation Repair
*Target: Weeks 1–3*

### C++ STL Mastery

- [x] `vector`, `pair`, `string` — basics and common operations — **24-02-2026**
- [x] `map`, `unordered_map` — when to use which, complexity difference — **24-02-2026**
- [x] `set`, `multiset`, `unordered_set` — **24-02-2026**
- [x] `stack`, `queue`, `deque` — **24-02-2026**
- [x] `priority_queue` — min-heap and max-heap — **24-02-2026**
- [x] `sort` with custom comparators — **25-02-2026**
- [x] `lower_bound`, `upper_bound`, `binary_search` — **25-02-2026**
- [x] `next_permutation`, `accumulate`, `count`, `find` — **25-02-2026**
- [x] Practice: 10 problems using only STL on Codeforces (800–1000 rating) — **26-02-2026**
  - [x] [4A - Watermelon](https://codeforces.com/problemset/problem/4/A)
  - [x] [50A - Domino Piling](https://codeforces.com/problemset/problem/50/A)
  - [x] [71A - Way Too Long Words](https://codeforces.com/problemset/problem/71/A)
  - [x] [112A - Petya and Strings](https://codeforces.com/problemset/problem/112/A)
  - [x] [158A - Next Round](https://codeforces.com/problemset/problem/158/A)
  - [x] [231A - Team](https://codeforces.com/problemset/problem/231/A)
  - [x] [263A - Beautiful Matrix](https://codeforces.com/problemset/problem/263/A)
  - [x] [282A - Bit++](https://codeforces.com/problemset/problem/282/A)
  - [x] [339A - Helpful Maths](https://codeforces.com/problemset/problem/339/A)
  - [x] [467A - George and Accommodation](https://codeforces.com/problemset/problem/467/A)

### Complexity Analysis

- [x] Big-O notation — O(1), O(log n), O(n), O(n log n), O(n²) — **26-02-2026**
- [x] Can look at any loop structure and instantly state its complexity — **26-02-2026**
- [x] Understand when a solution will TLE based on constraints (n ≤ 10^5 → O(n log n) max, etc.) — **26-02-2026**

### Arrays & Strings

- [x] Two pointers technique — opposite ends and same direction — **26-02-2026**
- [x] Sliding window — fixed size and variable size — **26-02-2026**
- [x] Prefix sums — 1D and 2D — **26-02-2026**
- [ ] Practice: 15 problems on Leetcode (mix of Easy/Medium)
  - [x] [1. Two Sum](https://leetcode.com/problems/two-sum/) — **01-03-2026**
  - [x] [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) — **01-03-2026**
  - [x] [217. Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) — **01-03-2026**
  - [x] [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) — **02-03-2026**
  - [x] [283. Move Zeroes](https://leetcode.com/problems/move-zeroes/) — **02-03-2026**
  - [x] [15. 3Sum](https://leetcode.com/problems/3sum/) — **02-03-2026**
  - [x] [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/) — **02-03-2026**
  - [x] [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) — **03-03-2026**
  - [x] [560. Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) — **03-03-2026**
  - [x] [209. Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/) — **03-03-2026**
  - [x] [1456. Maximum Number of Vowels in a Substring of Given Length](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/) — **03-03-2026**
  - [x] [238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) - **11-05-2026**
  - [x] [438. Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) - **11-05-2026**
  - [x] [128. Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) - **11-05-2026**
  - [x] [75. Sort Colors](https://leetcode.com/problems/sort-colors/) - **11-05-2026**

### Recursion & Backtracking

- [x] Understand the call stack — trace recursive calls by hand on paper first
- [x] Base case thinking — every recursion problem starts here, always
- [x] Classic problems: Fibonacci, factorial, power(x,n), reverse array recursively
- [x] Subsets — draw the decision tree before coding
- [ ] Permutations and combinations
- [ ] Backtracking: N-Queens, Sudoku solver, rat in a maze
- [ ] Watch: Striver's recursion series on YT (full playlist, in order)
- [ ] Watch: Codestory with Mik — recursion + backtracking episodes
- [ ] Practice: 20 pure recursion + backtracking problems before moving on

### Linked Lists

- [ ] Singly linked list — insert, delete, reverse (draw pointer changes before coding)
- [ ] Fast and slow pointers — Floyd's cycle detection
- [ ] Merge two sorted lists
- [ ] Find middle, detect loop, remove nth from end
- [ ] Watch: NeetCode linked list section
- [ ] Practice: 10 problems on Leetcode

---

## Phase 2 — Core DSA
*Target: Weeks 4–10*

### Stacks & Queues

- [ ] Stack using array and STL
- [ ] Monotonic stack — next greater element, previous smaller element (most important pattern for placements)
- [ ] Queue, circular queue, deque
- [ ] Classic problems: valid parentheses, largest rectangle in histogram, sliding window maximum
- [ ] Watch: NeetCode stack section + Mik's monotonic stack video
- [ ] Practice: 12 problems

### Binary Search

- [ ] Binary search on sorted array — the basics cold
- [ ] Binary search on answer — the real skill. "minimize the maximum" = binary search on answer
- [ ] Lower bound / upper bound applications
- [ ] Classic problems: search in rotated array, find peak element, Koko eating bananas, aggressive cows
- [ ] Watch: NeetCode binary search section
- [ ] Practice: 15 problems

### Heaps (Priority Queue)

- [ ] Min-heap and max-heap internals — understand how heapify works
- [ ] K largest / K smallest elements
- [ ] Merge K sorted lists
- [ ] Top K frequent elements
- [ ] Practice: 10 problems

### Trees

- [ ] Binary tree traversals — inorder, preorder, postorder (recursive AND iterative both)
- [ ] Level order traversal — BFS on trees
- [ ] Height, diameter, depth
- [ ] Lowest common ancestor (LCA)
- [ ] Binary Search Tree — insert, delete, search, validate
- [ ] Path sum problems
- [ ] Serialize and deserialize
- [ ] Watch: NeetCode trees section (all 15 problems) + Mik's tree series
- [ ] Practice: 30 problems — non-negotiable before touching graphs

### Graphs

- [ ] Graph representation — adjacency list vs matrix, know when to use which
- [ ] BFS — shortest path in unweighted graph
- [ ] DFS — connected components, cycle detection
- [ ] Topological sort — Kahn's algorithm + DFS approach (both)
- [ ] Union-Find (DSU) — with path compression and union by rank
- [ ] Dijkstra's algorithm — shortest path in weighted graph
- [ ] Bellman-Ford — for negative weights
- [ ] Minimum spanning tree — Kruskal's and Prim's
- [ ] Watch: NeetCode graphs + advanced graphs sections
- [ ] Reference: cp-algorithms.com for DSU and Dijkstra deep dives
- [ ] Practice: 25 problems — topic by topic, one algorithm at a time

### Dynamic Programming

- [ ] 1D DP — climbing stairs, house robber, jump game
- [ ] 2D DP — grid paths, unique paths, minimum path sum
- [ ] Knapsack — 0/1 knapsack, unbounded knapsack
- [ ] String DP — LCS, edit distance, longest palindromic subsequence
- [ ] DP on trees
- [ ] Bitmask DP (intro level)
- [ ] Watch: NeetCode 1D DP + 2D DP sections + Mik's DP series
- [ ] Practice: 30 problems — never memorize, always derive the recurrence from scratch

---

## Phase 3 — NeetCode 250 Grind
*Target: Weeks 7–12 (overlaps with Phase 2)*

Start this alongside Phase 2 theory from Week 7. Use the NeetCode 250 sheet. Submit on LeetCode. Watch NeetCode's video only after 30+ min of genuine struggle.

- [ ] Arrays & Hashing
- [ ] Two Pointers
- [ ] Sliding Window
- [ ] Stack
- [ ] Binary Search
- [ ] Linked List
- [ ] Trees
- [ ] Tries
- [ ] Heap / Priority Queue
- [ ] Backtracking
- [ ] Graphs
- [ ] Advanced Graphs
- [ ] 1D DP
- [ ] 2D DP
- [ ] Greedy
- [ ] Intervals
- [ ] Math & Geometry
- [ ] Bit Manipulation

### LeetCode Top 150 — Placement Milestone

- [ ] Complete LeetCode Top 150 by end of Month 3 — this is the placement-ready checkpoint

### Milestones

- [ ] End of Month 1: Can solve 80% of Leetcode Easys in under 15 minutes independently
- [ ] End of Month 2: Can solve 70% of Leetcode Mediums in under 35 minutes independently
- [ ] End of Month 3: Attempted at least 15 Leetcode Hards independently (no hints for first 45 min)
- [ ] Can explain every data structure and algorithm out loud without notes

---

## Phase 4 — Codeforces Rating Grind
*Target: Week 4 onwards, ongoing in parallel*

Current rating: 1072 (max 1077). Target: 1600–1800.

### Rating Ladder (Codeforces problem filter grind)

- [ ] Solve 20 problems rated 1100
- [ ] Solve 20 problems rated 1200
- [ ] Solve 20 problems rated 1300
- [ ] Solve 15 problems rated 1400
- [ ] Solve 15 problems rated 1500
- [ ] Solve 15 problems rated 1600

### Live Contests

- [ ] Participate in first Div. 4 contest (live)
- [ ] Participate in 5 Div. 4 contests total
- [ ] Participate in first Div. 3 contest (live)
- [ ] Participate in 5 Div. 3 contests total
- [ ] Upsolve every problem missed in every contest — non-negotiable, every single time

### Rating Milestones

- [ ] Reach rating 1200 (Pupil)
- [ ] Reach rating 1400
- [ ] Reach rating 1600 (Specialist) 🎯
- [ ] Reach rating 1800 (Expert boundary) 🎯

---

## Rules — Non-Negotiable

- **30–45 minutes of genuine struggle** before looking at any hint. Pain builds intuition. There's no shortcut here.
- **No copy-pasting solutions.** If I can't solve it, I upsolve it properly — read the editorial, understand it fully, then code from scratch without looking.
- **Every new topic:** theory first, then minimum 10 problems on that topic before moving on.
- **After every CF contest:** upsolve every problem I couldn't solve during the contest. Read the editorial. Code it. No exceptions.
- **NeetCode 250 is the primary sheet.** If stuck on any problem, watch NeetCode's video for that problem. Submit on LeetCode so the count goes up.
- **Zero days are not allowed.** GSoC heavy day = minimum 2 problems. No day is a zero.
- **Update this post with dates** every time a checkbox gets ticked. Public accountability is the point.

---

*Written by Yash (xevrion)*
