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
- [x] Permutations and combinations
- [ ] Backtracking: N-Queens, Sudoku solver, rat in a maze
- [ ] Watch: Striver's recursion series on YT (full playlist, in order)
- [ ] Watch: Codestory with Mik — recursion + backtracking episodes
- [ ] Practice: 20 pure recursion + backtracking problems before moving on
  - [ ] [206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
  - [ ] [344. Reverse String](https://leetcode.com/problems/reverse-string/)
  - [ ] [509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)
  - [ ] [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)
  - [ ] [50. Pow(x, n)](https://leetcode.com/problems/powx-n/)
  - [x] [78. Subsets](https://leetcode.com/problems/subsets/)
  - [ ] [90. Subsets II](https://leetcode.com/problems/subsets-ii/)
  - [x] [46. Permutations](https://leetcode.com/problems/permutations/)
  - [ ] [47. Permutations II](https://leetcode.com/problems/permutations-ii/)
  - [ ] [39. Combination Sum](https://leetcode.com/problems/combination-sum/)
  - [ ] [40. Combination Sum II](https://leetcode.com/problems/combination-sum-ii/)
  - [ ] [77. Combinations](https://leetcode.com/problems/combinations/)
  - [ ] [22. Generate Parentheses](https://leetcode.com/problems/generate-parentheses/)
  - [ ] [17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)
  - [ ] [131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/)
  - [ ] [93. Restore IP Addresses](https://leetcode.com/problems/restore-ip-addresses/)
  - [ ] [79. Word Search](https://leetcode.com/problems/word-search/)
  - [ ] [51. N-Queens](https://leetcode.com/problems/n-queens/)
  - [ ] [52. N-Queens II](https://leetcode.com/problems/n-queens-ii/)
  - [ ] [37. Sudoku Solver](https://leetcode.com/problems/sudoku-solver/)

### Linked Lists

- [ ] Singly linked list — insert, delete, reverse (draw pointer changes before coding)
- [ ] Fast and slow pointers — Floyd's cycle detection
- [ ] Merge two sorted lists
- [ ] Find middle, detect loop, remove nth from end
- [ ] Watch: NeetCode linked list section
- [ ] Practice: 10 problems on Leetcode
  - [ ] [206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
  - [ ] [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)
  - [ ] [141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)
  - [ ] [876. Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)
  - [ ] [83. Remove Duplicates from Sorted List](https://leetcode.com/problems/remove-duplicates-from-sorted-list/)
  - [ ] [19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
  - [ ] [143. Reorder List](https://leetcode.com/problems/reorder-list/)
  - [ ] [2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/)
  - [ ] [142. Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/)
  - [ ] [25. Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/)

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
  - [ ] [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
  - [ ] [155. Min Stack](https://leetcode.com/problems/min-stack/)
  - [ ] [232. Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)
  - [ ] [225. Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/)
  - [ ] [496. Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)
  - [ ] [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
  - [ ] [150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)
  - [ ] [394. Decode String](https://leetcode.com/problems/decode-string/)
  - [ ] [901. Online Stock Span](https://leetcode.com/problems/online-stock-span/)
  - [ ] [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)
  - [ ] [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
  - [ ] [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)

### Binary Search

- [ ] Binary search on sorted array — the basics cold
- [ ] Binary search on answer — the real skill. "minimize the maximum" = binary search on answer
- [ ] Lower bound / upper bound applications
- [ ] Classic problems: search in rotated array, find peak element, Koko eating bananas, aggressive cows
- [ ] Watch: NeetCode binary search section
- [ ] Practice: 15 problems
  - [ ] [704. Binary Search](https://leetcode.com/problems/binary-search/)
  - [ ] [278. First Bad Version](https://leetcode.com/problems/first-bad-version/)
  - [ ] [35. Search Insert Position](https://leetcode.com/problems/search-insert-position/)
  - [ ] [374. Guess Number Higher or Lower](https://leetcode.com/problems/guess-number-higher-or-lower/)
  - [ ] [69. Sqrt(x)](https://leetcode.com/problems/sqrtx/)
  - [ ] [167. Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
  - [ ] [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
  - [ ] [153. Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)
  - [ ] [162. Find Peak Element](https://leetcode.com/problems/find-peak-element/)
  - [ ] [74. Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/)
  - [ ] [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)
  - [ ] [1011. Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)
  - [ ] [34. Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
  - [ ] [981. Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/)
  - [ ] [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)

### Heaps (Priority Queue)

- [ ] Min-heap and max-heap internals — understand how heapify works
- [ ] K largest / K smallest elements
- [ ] Merge K sorted lists
- [ ] Top K frequent elements
- [ ] Practice: 10 problems
  - [ ] [703. Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)
  - [ ] [1046. Last Stone Weight](https://leetcode.com/problems/last-stone-weight/)
  - [ ] [973. K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)
  - [ ] [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)
  - [ ] [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)
  - [ ] [621. Task Scheduler](https://leetcode.com/problems/task-scheduler/)
  - [ ] [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)
  - [ ] [355. Design Twitter](https://leetcode.com/problems/design-twitter/)
  - [ ] [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)
  - [ ] [502. IPO](https://leetcode.com/problems/ipo/)

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
  - [ ] [144. Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/)
  - [ ] [94. Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)
  - [ ] [145. Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/)
  - [ ] [104. Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
  - [ ] [226. Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)
  - [ ] [572. Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/)
  - [ ] [100. Same Tree](https://leetcode.com/problems/same-tree/)
  - [ ] [101. Symmetric Tree](https://leetcode.com/problems/symmetric-tree/)
  - [ ] [112. Path Sum](https://leetcode.com/problems/path-sum/)
  - [ ] [102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
  - [ ] [107. Binary Tree Level Order Traversal II](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/)
  - [ ] [637. Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/)
  - [ ] [543. Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)
  - [ ] [110. Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/)
  - [ ] [700. Search in a Binary Search Tree](https://leetcode.com/problems/search-in-a-binary-search-tree/)
  - [ ] [701. Insert into a Binary Search Tree](https://leetcode.com/problems/insert-into-a-binary-search-tree/)
  - [ ] [530. Minimum Absolute Difference in BST](https://leetcode.com/problems/minimum-absolute-difference-in-bst/)
  - [ ] [235. Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)
  - [ ] [199. Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)
  - [ ] [1448. Count Good Nodes in Binary Tree](https://leetcode.com/problems/count-good-nodes-in-binary-tree/)
  - [ ] [230. Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)
  - [ ] [98. Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)
  - [ ] [105. Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
  - [ ] [106. Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
  - [ ] [236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)
  - [ ] [113. Path Sum II](https://leetcode.com/problems/path-sum-ii/)
  - [ ] [124. Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/)
  - [ ] [297. Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)
  - [ ] [450. Delete Node in a BST](https://leetcode.com/problems/delete-node-in-a-bst/)
  - [ ] [99. Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree/)

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
  - [ ] [997. Find the Town Judge](https://leetcode.com/problems/find-the-town-judge/)
  - [ ] [1791. Find Center of Star Graph](https://leetcode.com/problems/find-center-of-star-graph/)
  - [ ] [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)
  - [ ] [733. Flood Fill](https://leetcode.com/problems/flood-fill/)
  - [ ] [695. Max Area of Island](https://leetcode.com/problems/max-area-of-island/)
  - [ ] [542. 01 Matrix](https://leetcode.com/problems/01-matrix/)
  - [ ] [994. Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)
  - [ ] [133. Clone Graph](https://leetcode.com/problems/clone-graph/)
  - [ ] [207. Course Schedule](https://leetcode.com/problems/course-schedule/)
  - [ ] [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)
  - [ ] [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)
  - [ ] [323. Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)
  - [ ] [261. Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/)
  - [ ] [127. Word Ladder](https://leetcode.com/problems/word-ladder/)
  - [ ] [417. Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)
  - [ ] [130. Surrounded Regions](https://leetcode.com/problems/surrounded-regions/)
  - [ ] [286. Walls and Gates](https://leetcode.com/problems/walls-and-gates/)
  - [ ] [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/)
  - [ ] [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)
  - [ ] [1631. Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/)
  - [ ] [332. Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary/)
  - [ ] [1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)
  - [ ] [778. Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/)
  - [ ] [269. Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)
  - [ ] [765. Couples Holding Hands](https://leetcode.com/problems/couples-holding-hands/)

### Dynamic Programming

- [ ] 1D DP — climbing stairs, house robber, jump game
- [ ] 2D DP — grid paths, unique paths, minimum path sum
- [ ] Knapsack — 0/1 knapsack, unbounded knapsack
- [ ] String DP — LCS, edit distance, longest palindromic subsequence
- [ ] DP on trees
- [ ] Bitmask DP (intro level)
- [ ] Watch: NeetCode 1D DP + 2D DP sections + Mik's DP series
- [ ] Practice: 30 problems — never memorize, always derive the recurrence from scratch
  - [ ] [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)
  - [ ] [746. Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/)
  - [ ] [198. House Robber](https://leetcode.com/problems/house-robber/)
  - [ ] [213. House Robber II](https://leetcode.com/problems/house-robber-ii/)
  - [ ] [322. Coin Change](https://leetcode.com/problems/coin-change/)
  - [ ] [518. Coin Change II](https://leetcode.com/problems/coin-change-ii/)
  - [ ] [55. Jump Game](https://leetcode.com/problems/jump-game/)
  - [ ] [45. Jump Game II](https://leetcode.com/problems/jump-game-ii/)
  - [ ] [152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)
  - [ ] [139. Word Break](https://leetcode.com/problems/word-break/)
  - [ ] [62. Unique Paths](https://leetcode.com/problems/unique-paths/)
  - [ ] [63. Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)
  - [ ] [64. Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)
  - [ ] [120. Triangle](https://leetcode.com/problems/triangle/)
  - [ ] [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)
  - [ ] [494. Target Sum](https://leetcode.com/problems/target-sum/)
  - [ ] [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)
  - [ ] [72. Edit Distance](https://leetcode.com/problems/edit-distance/)
  - [ ] [1092. Shortest Common Supersequence](https://leetcode.com/problems/shortest-common-supersequence/)
  - [ ] [516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)
  - [ ] [647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)
  - [ ] [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)
  - [ ] [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
  - [ ] [309. Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)
  - [ ] [714. Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)
  - [ ] [10. Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/)
  - [ ] [115. Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/)
  - [ ] [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/)
  - [ ] [329. Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/)
  - [ ] [337. House Robber III](https://leetcode.com/problems/house-robber-iii/)

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
