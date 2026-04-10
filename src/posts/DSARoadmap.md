# DSA & Competitive Programming Roadmap
Date: 24-02-2026
Tags: dsa, guide

This is my public roadmap to go from basically nothing to:

- Solving most Leetcode Hards, all Mediums and Easys independently
- Reaching 1600–1800 rating on Codeforces
- Being actually placement-ready

I'm posting this publicly to keep myself accountable. I'll update dates as I complete things.

---

## Phase 1 — Foundation Repair
*Target: Weeks 1–4*

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
  - [ ] [238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)
  - [ ] [567. Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)
  - [ ] [128. Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)
  - [ ] [75. Sort Colors](https://leetcode.com/problems/sort-colors/)


### Recursion & Backtracking

- [ ] Understand the call stack — trace through recursive calls manually
- [ ] Base case thinking — every recursion problem starts here
- [ ] Classic problems: Fibonacci, factorial, power, reverse array
- [ ] Subsets, permutations, combinations
- [ ] Backtracking: N-Queens, Sudoku solver, rat in a maze
- [ ] Practice: 20 pure recursion + backtracking problems before moving on

### Linked Lists

- [ ] Singly linked list — insert, delete, reverse
- [ ] Fast and slow pointers (Floyd's cycle detection)
- [ ] Merge two sorted lists
- [ ] Find middle, detect loop, remove nth from end
- [ ] Practice: 10 problems on Leetcode

---

## Phase 2 — Core DSA
*Target: Weeks 5–12*

### Stacks & Queues

- [ ] Stack using array and STL
- [ ] Monotonic stack — next greater element, previous smaller element
- [ ] Queue, circular queue, deque
- [ ] Classic problems: valid parentheses, largest rectangle in histogram, sliding window maximum
- [ ] Practice: 12 problems

### Binary Search

- [ ] Binary search on sorted array (the basics)
- [ ] Binary search on answer — this is the real skill
- [ ] Lower bound / upper bound applications
- [ ] Classic problems: search in rotated array, find peak element, Koko eating bananas, aggressive cows
- [ ] Practice: 15 problems

### Heaps (Priority Queue)

- [ ] Min-heap and max-heap internals
- [ ] K largest / K smallest elements
- [ ] Merge K sorted lists
- [ ] Top K frequent elements
- [ ] Practice: 10 problems

### Trees

- [ ] Binary tree traversals — inorder, preorder, postorder (recursive + iterative)
- [ ] Level order traversal (BFS on trees)
- [ ] Height, diameter, depth of binary tree
- [ ] Lowest common ancestor (LCA)
- [ ] Binary Search Tree — insert, delete, search, validate
- [ ] Path sum problems
- [ ] Serialize and deserialize
- [ ] Practice: 30 problems (this is non-negotiable before graphs)

### Graphs

- [ ] Graph representation — adjacency list vs matrix
- [ ] BFS — shortest path in unweighted graph
- [ ] DFS — connected components, cycle detection
- [ ] Topological sort (Kahn's algorithm + DFS approach)
- [ ] Union-Find (Disjoint Set Union) — with path compression and union by rank
- [ ] Dijkstra's algorithm — shortest path in weighted graph
- [ ] Bellman-Ford (for negative weights)
- [ ] Minimum spanning tree — Kruskal's and Prim's
- [ ] Practice: 25 problems (topic-wise, one algorithm at a time)

### Dynamic Programming

- [ ] 1D DP — climbing stairs, house robber, jump game
- [ ] 2D DP — grid paths, unique paths, minimum path sum
- [ ] Knapsack — 0/1 knapsack, unbounded knapsack
- [ ] String DP — longest common subsequence, edit distance, longest palindromic subsequence
- [ ] DP on trees
- [ ] Bitmask DP (intro)
- [ ] Practice: 30 problems — never memorize, always derive the recurrence yourself

---

## Phase 3 — Leetcode Grind
*Target: Weeks 8–20 (overlaps with Phase 2)*

### Topic-wise Leetcode (do alongside Phase 2 theory)

- [ ] Arrays & Strings — 20 problems (Easy + Medium)
- [ ] Two Pointers & Sliding Window — 15 problems
- [ ] Binary Search — 15 problems
- [ ] Stacks & Queues — 12 problems
- [ ] Trees — 25 problems
- [ ] Graphs — 20 problems
- [ ] Dynamic Programming — 25 problems
- [ ] Heaps — 10 problems
- [ ] Backtracking — 12 problems

### NeetCode 150

- [ ] Start NeetCode 150 after completing Phase 1
- [ ] Arrays & Hashing (9 problems)
- [ ] Two Pointers (5 problems)
- [ ] Sliding Window (6 problems)
- [ ] Stack (7 problems)
- [ ] Binary Search (7 problems)
- [ ] Linked List (11 problems)
- [ ] Trees (15 problems)
- [ ] Tries (3 problems)
- [ ] Heap / Priority Queue (7 problems)
- [ ] Backtracking (9 problems)
- [ ] Graphs (13 problems)
- [ ] Advanced Graphs (6 problems)
- [ ] 1D DP (12 problems)
- [ ] 2D DP (11 problems)
- [ ] Greedy (8 problems)
- [ ] Intervals (6 problems)
- [ ] Math & Geometry (8 problems)
- [ ] Bit Manipulation (7 problems)

### Milestones

- [ ] Can independently solve 80% of Leetcode Easys in under 15 minutes
- [ ] Can independently solve 70% of Leetcode Mediums in under 35 minutes
- [ ] Attempted at least 10 Leetcode Hards independently (no hints for first 45 min)

<!-- ---

## Phase 4 — Codeforces Grind
*Target: Week 6 onwards, ongoing*

### Rating Ladder (problem filter grind)

- [ ] Solve 30 problems rated 800 on Codeforces
- [ ] Solve 30 problems rated 900
- [ ] Solve 30 problems rated 1000
- [ ] Solve 25 problems rated 1100
- [ ] Solve 25 problems rated 1200
- [ ] Solve 20 problems rated 1300
- [ ] Solve 20 problems rated 1400
- [ ] Solve 15 problems rated 1500
- [ ] Solve 15 problems rated 1600

### Live Contests

- [ ] Participate in first Div. 4 contest (live)
- [ ] Participate in 5 Div. 4 contests
- [ ] Participate in first Div. 3 contest (live)
- [ ] Participate in 5 Div. 3 contests
- [ ] Upsolve every problem missed in every contest (non-negotiable)

### Rating Milestones

- [ ] Reach rating 800 (Newbie)
- [ ] Reach rating 1000
- [ ] Reach rating 1200 (Pupil)
- [ ] Reach rating 1400
- [ ] Reach rating 1600 (Specialist)
- [ ] Reach rating 1700
- [ ] **Reach rating 1800 (Specialist → Expert boundary)** 🎯 -->

---

## Rules I'm Following

- Minimum 30–45 minutes of genuine struggle before looking at any hint
- No copy-pasting solutions to maintain streaks — if I can't solve it, I upsolve it properly
- Every new topic: learn theory first, then immediately do 10+ problems on that topic
- After every contest: upsolve every problem I couldn't solve during the contest
- Update this post with dates every time a checkbox gets ticked

---

<!-- ## Resources

- **Primary theory + problem list:** Striver's A2Z DSA Sheet — takeuforward.org
- **Leetcode structured list:** NeetCode 150 — neetcode.io
- **Codeforces:** Live contests + rating ladder grind
- **Algorithm deep dives:** cp-algorithms.com
- **Language reference:** cppreference.com

--- -->

*Written by Yash (xevrion)*