# CONCEPTIFYYY — Complete Production-Ready Education Platform

> **"Don't just solve it. SEE it."**

CONCEPTIFYYY is a full-stack, production-ready educational ecosystem designed for engineering students preparing for top product companies and campus placement interviews.

---

## 🌟 Core Features

1. **Signature Interactive Visualizers**:
   - Step-by-step cognitive algorithm animations for Two Sum, Binary Search, Valid Parentheses, Reverse Linked List, Maximum Subarray (Kadane's Algorithm), and Sorting algorithms.
   - Interactive playback controls: Play, Pause, Step Next/Prev, Speed Multiplier (0.5x, 1x, 1.5x, 2x), and progress timeline.
   - Interactive **Visual Lab** for experimenting with custom arrays, Stacks (LIFO), and Queues (FIFO).

2. **DSA Arena**:
   - Multi-language support: JavaScript, Python, C++, Java.
   - Filter by Difficulty (Easy, Medium, Hard), Topic (Arrays, Hashing, Binary Search, Dynamic Programming, etc.), Company (Amazon, Google, Microsoft, TCS, Infosys, Meta), and Solved status.
   - Sandboxed isolated code execution with memory & execution timeout protection.
   - Public and hidden test cases, custom input runner, and runtime/memory telemetry.

3. **Campus Placement Aptitude Arena**:
   - Quantitative Aptitude (Time & Work, Percentages, Profit & Loss, Ratio & Proportion, Probability).
   - Logical Reasoning (Number Series, Blood Relations, Syllogism).
   - Verbal Ability (Sentence Correction, Vocabulary, Reading Comprehension).
   - Animated visual solvers (e.g. Work-Units method for Time & Work, Percentage balances).

4. **Digital Marketplace & Real Razorpay Payments**:
   - Secure digital downloads for handwritten notes, cheat sheets, and full-stack major projects (MERN Job Portal, AI Resume Builder).
   - **Real Razorpay Integration**: Server-side price verification (in paise), HMAC-SHA256 signature verification, and idempotent webhook handler.
   - Includes a **₹1 Conceptifyyy Test Product** for Razorpay Test Mode verification.

5. **Gamification & Progress System**:
   - Experience Points (XP), daily streak counters, achievement badges (Early Adopter, Problem Solver, 7-Day Streak Warrior, Aptitude Ace).
   - Global, Weekly, and Monthly leaderboards.

6. **Admin CMS Portal**:
   - Full CRUD control to add DSA problems, test cases, solutions, animations, aptitude questions, products, and notes live **WITHOUT touching source code**.
   - Analytics overview: revenue telemetry, top-selling products, and user account management.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Launch Development Servers
From the root directory:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🔑 Demo Accounts (1-Click Login Available in UI)

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin Master** | `admin@conceptifyyy.com` | `Admin@12345` | ADMIN (CMS Access) |
| **Demo Student** | `student@conceptifyyy.com` | `Student@12345` | STUDENT |

---

## 🛡️ Security Architecture
- **Sandboxed Execution**: Isolated VM execution engine prevents arbitrary process/file access.
- **Server-Side Price Authority**: Backend queries product price from database in paise and verifies cryptographically before granting access.
- **Protected Downloads**: Direct file downloads require active JWT authentication and verified `PAID` order records.
