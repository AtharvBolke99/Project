module.exports = {
  bookMeta: {
    title: "Conceptifyyy — Company-Wise DSA Placement Preparation 2026",
    brand: "Conceptifyyy",
    subtitle: "Most Important Coding Questions and Java Solutions for Service-Based Company Placements",
    edition: "2026 Official Campus Recruitment Edition",
    author: "Conceptifyyy Placement Engineering Team",
    targetAudience: "Freshers & Pre-Final / Final Year Students Preparing for TCS, Cognizant, Infosys, Wipro, Accenture, Capgemini, Deloitte, HCLTech, and Tech Mahindra.",
    totalProblems: "216 Curated Coding Problems with Full Compilable Java 21 Solutions, Dry Runs & Complexities"
  },
  copyrightText: `Copyright © 2026 CONCEPTIFYYY. All rights reserved.

This document and its comprehensive contents are published exclusively by CONCEPTIFYYY for educational and individual placement preparation purposes. 

No part of this publication may be reproduced, stored in a retrieval system, or transmitted in any form or by any means—electronic, mechanical, photocopying, recording, or otherwise—without prior written permission of the publisher, except in the case of brief quotations embodied in critical reviews and academic studies.

Disclaimer:
Company names (TCS, Cognizant, Infosys, Wipro, Accenture, Capgemini, Deloitte, HCLTech, Tech Mahindra) and trademarks mentioned in this guide belong to their respective corporate entities. References to these companies are strictly for historical exam question pattern identification, student guidance, and educational training. CONCEPTIFYYY is an independent educational publisher and is not officially affiliated with, endorsed by, or sponsored by any of the named corporations. All solutions, explanations, and code implementations are original works developed by the Conceptifyyy technical team.

Published by:
CONCEPTIFYYY Digital Store & Learning Platform
Web: conceptifyyy.com | Support: support@conceptifyyy.com
Printed and Generated in India • 2026 Edition`,
  introduction: {
    heading: "Introduction & How to Master Campus Placements",
    paragraphs: [
      "Welcome to the Conceptifyyy Company-Wise DSA Placement Preparation 2026 guide. Every year, over 1.5 million engineering graduates across India compete for coveted technical positions at major IT and product-oriented service companies. While the volume of applicants is high, recruitment assessment data reveals a consistent reality: the core technical interview questions focus on a clearly defined set of recurring algorithmic patterns.",
      "Rather than attempting to solve 1,500 disconnected problems on online platforms, this guide provides a structured, high-yield mastery path. We have categorized the most frequently asked coding questions across the top 9 recruitment powerhouses: TCS NQT, Cognizant GenC, Infosys (Systems Engineer & Specialist Programmer), Wipro Turbo, Accenture ASE, Capgemini Exceller, Deloitte Analyst, HCLTech, and Tech Mahindra.",
      "Notice the significant pattern overlap between these companies: array manipulation, two pointers, hashing, Kadane's algorithm, sliding windows, and bitwise operations appear universally. When you master these core problems, your technical preparation becomes 100% transferable across every campus drive.",
      "How to Use This Book Effectively:\n1. Solve the 40-Problem Master List First: Before diving into company-specific chapters, complete Section 14 (The Final Master List). These 40 problems form the foundation for 85% of all fresher coding rounds.\n2. Understand the 'Why', Not Just the 'How': For every problem, read the Intuition and Approach section carefully. Understand why a two-pointer technique achieves O(N) time or why a Min-Heap solves Kth-Largest in O(N log K).\n3. Hand-trace with Dry Runs: Walk through the supplied dry-run tables step-by-step. In technical interviews, interviewers often ask you to dry-run code on a whiteboard with custom test cases.\n4. Practice Full Input/Output: In company rounds like Cognizant and TCS, you must write a complete compilable Java class with Scanner input and exact output formatting without extraneous prompt messages.\n5. Review the Complexity Reference Sheet: Before your technical interview, review Section 15 to instantly articulate Big-O time and auxiliary space complexities with confidence."
    ]
  },
  complexitySheet: [
    { structure: "Array (Static / Dynamic)", access: "O(1)", search: "O(N)", insert: "O(N) / O(1) amortized", delete: "O(N)", space: "O(N)" },
    { structure: "Singly Linked List", access: "O(N)", search: "O(N)", insert: "O(1) at head / O(N)", delete: "O(1) / O(N)", space: "O(N)" },
    { structure: "Stack (Array / List)", access: "O(N)", search: "O(N)", insert: "O(1) push", delete: "O(1) pop", space: "O(N)" },
    { structure: "Queue (FIFO)", access: "O(N)", search: "O(N)", insert: "O(1) enqueue", delete: "O(1) dequeue", space: "O(N)" },
    { structure: "Hash Table / HashMap", access: "N/A", search: "O(1) avg / O(N) worst", insert: "O(1) avg", delete: "O(1) avg", space: "O(N)" },
    { structure: "Binary Search Tree (Balanced)", access: "O(log N)", search: "O(log N)", insert: "O(log N)", delete: "O(log N)", space: "O(N)" },
    { structure: "Binary Heap (PriorityQueue)", access: "O(1) peek", search: "O(N)", insert: "O(log N)", delete: "O(log N) poll", space: "O(N)" },
    { structure: "Graph (V vertices, E edges)", access: "Adjacency List", search: "BFS/DFS O(V+E)", insert: "O(1)", delete: "O(E)", space: "O(V+E)" }
  ],
  algorithmComplexities: [
    { algorithm: "Binary Search", best: "O(1)", avg: "O(log N)", worst: "O(log N)", space: "O(1)" },
    { algorithm: "Kadane's Subarray Sum", best: "O(N)", avg: "O(N)", worst: "O(N)", space: "O(1)" },
    { algorithm: "Dutch National Flag (0,1,2)", best: "O(N)", avg: "O(N)", worst: "O(N)", space: "O(1)" },
    { algorithm: "Merge Sort", best: "O(N log N)", avg: "O(N log N)", worst: "O(N log N)", space: "O(N)" },
    { algorithm: "Quick Sort", best: "O(N log N)", avg: "O(N log N)", worst: "O(N^2)", space: "O(log N)" },
    { algorithm: "Dijkstra's Shortest Path", best: "O((V+E) log V)", avg: "O((V+E) log V)", worst: "O((V+E) log V)", space: "O(V+E)" },
    { algorithm: "0/1 Knapsack (DP)", best: "O(N * W)", avg: "O(N * W)", worst: "O(N * W)", space: "O(W)" },
    { algorithm: "Longest Common Subsequence", best: "O(M * N)", avg: "O(M * N)", worst: "O(M * N)", space: "O(M * N)" }
  ],
  roadmap: {
    heading: "Final 60-Day Placement Preparation Roadmap",
    weeks: [
      {
        phase: "Phase 1 (Days 1–15): Foundations & Core Patterns",
        focus: "Arrays, Two Pointers, Sliding Window & Hashing",
        tasks: [
          "Master in-place manipulation: Move Zeros, Rotate Array, Dutch National Flag.",
          "Hashing patterns: Two Sum, Find Duplicates, Frequency Counting, Anagrams.",
          "Subarray optimization: Kadane's Algorithm, Prefix Sums, Sliding Window maximum/distinct.",
          "Practice daily with complete Java Scanner programs to eliminate compilation errors."
        ]
      },
      {
        phase: "Phase 2 (Days 16–30): Essential Linear Data Structures & Strings",
        focus: "Linked Lists, Stacks, Queues & String Algorithms",
        tasks: [
          "Linked List master patterns: Reverse Linked List, Middle of List, Floyd's Cycle Detection.",
          "Stack mechanics: Balanced Parentheses, Next Greater Element, Min-Stack.",
          "Queue implementations: Queue using Stacks and Stack using Queues.",
          "String parsing: Reverse Words, Longest Common Prefix, Palindrome verification."
        ]
      },
      {
        phase: "Phase 3 (Days 31–45): Trees, Graphs & Recursion",
        focus: "Binary Trees, BFS/DFS & Backtracking",
        tasks: [
          "Binary Tree fundamentals: Inorder/Preorder/Postorder traversals, Maximum Height.",
          "Tree ancestors: Lowest Common Ancestor (LCA) and Diameter of Binary Tree.",
          "Graph traversals: BFS and DFS traversal, Number of Islands, Cycle in Undirected Graph.",
          "Backtracking: Generate all Subsets, Permutations, N-Queens basics."
        ]
      },
      {
        phase: "Phase 4 (Days 46–60): Dynamic Programming & Mock Rounds",
        focus: "1D/2D Dynamic Programming & Timed Company Mocks",
        tasks: [
          "Core DP paradigms: Climbing Stairs, Coin Change, Subset Sum, 0/1 Knapsack.",
          "String DP: Longest Common Subsequence (LCS), Longest Increasing Subsequence (LIS).",
          "Company mock assessments: Timed 60-minute tests simulating TCS NQT, Cognizant, Infosys.",
          "Review Aptitude, Core CS (OS, DBMS, CN), and project portfolio."
        ]
      }
    ],
    interviewTips: [
      "1. Clarify Constraints First: Ask the interviewer about input sizes (e.g. N <= 10^5 indicates an O(N) or O(N log N) solution is expected; N <= 20 permits exponential backtracking).",
      "2. State the Brute Force First: Never jump silently to the optimal code. Explain the naive approach, state its O(N^2) complexity, and then explain where redundant work occurs.",
      "3. Name the Pattern: Demonstrate technical maturity by explicitly mentioning algorithmic patterns: 'We can optimize this from O(N^2) to O(N) using a two-pointer sliding window.'",
      "4. Test with Edge Cases: Before declaring your code finished, test mentally with null/empty inputs, single-element arrays, all duplicate values, and negative integers.",
      "5. Write Clean, Modular Code: Use descriptive identifiers (e.g., 'insertPos', 'currentSum') rather than cryptic single letters, and separate helper functions cleanly."
    ]
  }
};
