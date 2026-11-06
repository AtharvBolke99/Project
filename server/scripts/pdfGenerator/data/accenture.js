module.exports = [
  {
    num: 1,
    title: "Find the Second-Largest Element",
    topic: "Arrays",
    statement: "Find the second-largest distinct element in an array of integers.",
    example: "Input: [12, 35, 1, 10, 34, 1]\nOutput: 34",
    approach: "Single traversal tracking largest and secondLargest. Update secondLargest when a value between largest and secondLargest is encountered.",
    code: `public class AccentureSecondLargest {
    public static int findSecondLargest(int[] arr) {
        int l = Integer.MIN_VALUE, s = Integer.MIN_VALUE;
        for (int x : arr) {
            if (x > l) { s = l; l = x; }
            else if (x < l && x > s) { s = x; }
        }
        return s == Integer.MIN_VALUE ? -1 : s;
    }
    public static void main(String[] args) {
        System.out.println(findSecondLargest(new int[]{12, 35, 1, 10, 34, 1})); // 34
    }
}`,
    dryRun: "Single pass identifies largest 35, second-largest 34.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Array with all duplicate values."
  },
  {
    num: 2,
    title: "Count Even and Odd Elements",
    topic: "Arrays",
    statement: "Given an integer array, count the total number of even numbers and odd numbers.",
    example: "Input: [1, 2, 3, 4, 5, 6, 7]\nOutput: Even = 3, Odd = 4",
    approach: "Iterate through elements: if num % 2 == 0 increment even, else increment odd.",
    code: `public class AccentureCountEvenOdd {
    public static void countEvenOdd(int[] arr) {
        int even = 0, odd = 0;
        for (int x : arr) {
            if (x % 2 == 0) even++;
            else odd++;
        }
        System.out.println("Even: " + even + ", Odd: " + odd);
    }
    public static void main(String[] args) {
        countEvenOdd(new int[]{1, 2, 3, 4, 5, 6, 7}); // Even: 3, Odd: 4
    }
}`,
    dryRun: "Evens: 2, 4, 6 (count=3). Odds: 1, 3, 5, 7 (count=4).",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Negative numbers; zeros."
  },
  {
    num: 3,
    title: "Find a Missing Number",
    topic: "Arrays",
    statement: "Find the missing number from 0 to n in the array.",
    example: "Input: [3, 0, 1]\nOutput: 2",
    approach: "XOR index with values.",
    code: `public class AccentureMissingNumber {
    public static int missingNumber(int[] nums) {
        int xor = 0;
        for (int i = 0; i <= nums.length; i++) xor ^= i;
        for (int x : nums) xor ^= x;
        return xor;
    }
    public static void main(String[] args) {
        System.out.println(missingNumber(new int[]{3, 0, 1})); // 2
    }
}`,
    dryRun: "(0^1^2^3) ^ (3^0^1) = 2.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Missing 0 or n."
  },
  {
    num: 4,
    title: "Move Zeros to the End",
    topic: "Arrays",
    statement: "Move all zeros in an array to the end in-place.",
    example: "Input: [0, 1, 0, 3, 12]\nOutput: [1, 3, 12, 0, 0]",
    approach: "Two-pointer placement of non-zero elements.",
    code: `import java.util.Arrays;

public class AccentureMoveZeros {
    public static void moveZeroes(int[] nums) {
        int pos = 0;
        for (int x : nums) if (x != 0) nums[pos++] = x;
        while (pos < nums.length) nums[pos++] = 0;
    }
    public static void main(String[] args) {
        int[] arr = {0, 1, 0, 3, 12};
        moveZeroes(arr);
        System.out.println(Arrays.toString(arr)); // [1, 3, 12, 0, 0]
    }
}`,
    dryRun: "[0, 1, 0, 3, 12] -> [1, 3, 12, 0, 0].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "All zeros; no zeros."
  },
  {
    num: 5,
    title: "Find a Pair with a Target Sum",
    topic: "Hashing",
    statement: "Determine if there exists a pair with sum equal to target.",
    example: "Input: arr = [10, 15, 3, 7], target = 17\nOutput: true (10 + 7)",
    approach: "HashSet lookup for complement = target - x.",
    code: `import java.util.HashSet;

public class AccenturePairSum {
    public static boolean hasPair(int[] arr, int target) {
        HashSet<Integer> seen = new HashSet<>();
        for (int x : arr) {
            if (seen.contains(target - x)) return true;
            seen.add(x);
        }
        return false;
    }
    public static void main(String[] args) {
        System.out.println(hasPair(new int[]{10, 15, 3, 7}, 17)); // true
    }
}`,
    dryRun: "10 seen -> 15 seen -> 3 seen -> 7 checks (17-7=10 in set) -> true.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Target sum using same element twice."
  },
  {
    num: 6,
    title: "Sort an Array by Frequency",
    topic: "Sorting / Hashing",
    statement: "Sort array elements in decreasing order of frequency. If two numbers have the same frequency, the smaller number comes first.",
    example: "Input: [2, 5, 2, 8, 5, 6, 8, 8]\nOutput: [8, 8, 8, 2, 2, 5, 5, 6]",
    approach: "Count frequencies in a HashMap. Sort list using a custom Comparator: compare frequencies descending, then values ascending.",
    code: `import java.util.*;

public class SortByFrequency {
    public static int[] frequencySort(int[] nums) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int x : nums) map.put(x, map.getOrDefault(x, 0) + 1);

        List<Integer> list = new ArrayList<>();
        for (int x : nums) list.add(x);

        list.sort((a, b) -> {
            int freqA = map.get(a), freqB = map.get(b);
            if (freqA != freqB) return Integer.compare(freqB, freqA); // Descending frequency
            return Integer.compare(a, b); // Ascending value
        });

        for (int i = 0; i < nums.length; i++) nums[i] = list.get(i);
        return nums;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 2, 8, 5, 6, 8, 8};
        System.out.println(Arrays.toString(frequencySort(arr)));
        // Output: [8, 8, 8, 2, 2, 5, 5, 6]
    }
}`,
    dryRun: "Frequencies: 8:3, 2:2, 5:2, 6:1. Sorted order: 8, 8, 8, 2, 2, 5, 5, 6.",
    timeComplexity: "O(N log N).",
    spaceComplexity: "O(N).",
    edgeCases: "All elements have frequency 1; all elements same."
  },
  {
    num: 7,
    title: "Check Whether Two Strings Are Anagrams",
    topic: "Strings",
    statement: "Check if two strings contain same letters in different order.",
    example: "Input: \"triangle\", \"integral\"\nOutput: true",
    approach: "26-bucket frequency comparison.",
    code: `public class AccentureAnagram {
    public static boolean isAnagram(String s1, String s2) {
        if (s1.length() != s2.length()) return false;
        int[] c = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            c[s1.charAt(i) - 'a']++;
            c[s2.charAt(i) - 'a']--;
        }
        for (int v : c) if (v != 0) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isAnagram("triangle", "integral")); // true
    }
}`,
    dryRun: "triangle & integral: counts match.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Length mismatch."
  },
  {
    num: 8,
    title: "Remove Duplicate Characters",
    topic: "Strings",
    statement: "Given a string, remove all duplicate characters, keeping only their first occurrence.",
    example: "Input: \"programming\"\nOutput: \"progami\"",
    approach: "Use a LinkedHashSet<Character> or boolean array of seen characters to maintain insertion order.",
    code: `import java.util.*;

public class RemoveDuplicateChars {
    public static String removeDuplicates(String s) {
        boolean[] seen = new boolean[256];
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (!seen[c]) {
                seen[c] = true;
                sb.append(c);
            }
        }
        return sb.toString();
    }
    public static void main(String[] args) {
        System.out.println(removeDuplicates("programming")); // progami
    }
}`,
    dryRun: "p->r->o->g->r(skip)->a->m->m(skip)->i->n->g(skip) -> \"progamin\".",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1) 256 array.",
    edgeCases: "All characters same \"aaaa\" -> \"a\"."
  },
  {
    num: 9,
    title: "Reverse Words in a Sentence",
    topic: "Strings",
    statement: "Reverse word sequence while keeping characters inside words in order.",
    example: "Input: \"Accenture Innovation Delivered\"\nOutput: \"Delivered Innovation Accenture\"",
    approach: "Tokenize by whitespace, traverse array in reverse order.",
    code: `public class AccentureReverseWords {
    public static String reverseWords(String s) {
        String[] w = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = w.length - 1; i >= 0; i--) {
            sb.append(w[i]).append(i == 0 ? "" : " ");
        }
        return sb.toString();
    }
    public static void main(String[] args) {
        System.out.println(reverseWords("Accenture Innovation Delivered"));
    }
}`,
    dryRun: "Delivered Innovation Accenture.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Extra spaces."
  },
  {
    num: 10,
    title: "Find the First Non-Repeating Character",
    topic: "Hashing",
    statement: "Find index of first unique character in string.",
    example: "Input: \"accenture\"\nOutput: 0 ('a')",
    approach: "Frequency count array, second scan for first with frequency 1.",
    code: `public class AccentureFirstNonRepeating {
    public static int firstUniq(String s) {
        int[] freq = new int[256];
        for (char c : s.toCharArray()) freq[c]++;
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i)] == 1) return i;
        }
        return -1;
    }
    public static void main(String[] args) {
        System.out.println(firstUniq("accenture")); // 0
    }
}`,
    dryRun: "'a' count = 1 -> returns index 0.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "No unique characters."
  },
  {
    num: 11,
    title: "Find the Longest Common Prefix",
    topic: "Strings",
    statement: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \"\".",
    example: "Input: strs = [\"flower\", \"flow\", \"flight\"]\nOutput: \"fl\"",
    approach: "Horizontal scanning: Take the first string as candidate prefix. For each subsequent string, while the string does not start with prefix (str.indexOf(prefix) != 0), trim the last character off prefix. If prefix becomes empty, return \"\".",
    code: `public class LongestCommonPrefix {
    public static String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        String prefix = strs[0];

        for (int i = 1; i < strs.length; i++) {
            while (strs[i].indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }

    public static void main(String[] args) {
        String[] strs = {"flower", "flow", "flight"};
        System.out.println("Common Prefix: \\"" + longestCommonPrefix(strs) + "\\""); // "fl"
    }
}`,
    dryRun: "prefix = \"flower\"\n- \"flow\": not found -> \"flowe\" -> \"flow\" (matches at index 0)\n- \"flight\": prefix \"flow\" -> \"flo\" -> \"fl\" (matches)\nResult: \"fl\".",
    timeComplexity: "O(S) where S is the sum of all characters in all strings.",
    spaceComplexity: "O(1) auxiliary space.",
    edgeCases: "Array with 1 string; no common prefix [\"dog\", \"racecar\"]; empty array."
  },
  {
    num: 12,
    title: "Longest Substring Without Repeating Characters",
    topic: "Sliding Window",
    statement: "Find length of longest contiguous substring containing all distinct characters.",
    example: "Input: \"abcabcbb\"\nOutput: 3 (\"abc\")",
    approach: "Sliding window with character index tracking.",
    code: `public class AccentureLongestUnique {
    public static int lengthOfLongestSubstring(String s) {
        int[] last = new int[256];
        java.util.Arrays.fill(last, -1);
        int max = 0, l = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (last[c] >= l) l = last[c] + 1;
            last[c] = r;
            max = Math.max(max, r - l + 1);
        }
        return max;
    }
    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // 3
    }
}`,
    dryRun: "Expands \"abc\" (len 3). Max length = 3.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Empty string."
  },
  {
    num: 13,
    title: "Check Balanced Parentheses",
    topic: "Stack",
    statement: "Verify whether bracket sequence is properly nested and closed.",
    example: "Input: \"{[]}()\"\nOutput: true",
    approach: "Stack push matching closing brackets.",
    code: `import java.util.Stack;

public class AccentureBalancedBrackets {
    public static boolean isValid(String s) {
        Stack<Character> st = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else if (st.isEmpty() || st.pop() != c) return false;
        }
        return st.isEmpty();
    }
    public static void main(String[] args) {
        System.out.println(isValid("{[]}()")); // true
    }
}`,
    dryRun: "Matches '{', '[', ']', '}', '(', ')' -> true.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Odd length strings."
  },
  {
    num: 14,
    title: "Find the Next Greater Element",
    topic: "Monotonic Stack",
    statement: "Given an array nums, find the next greater element for each element. The Next Greater Element for an element x is the first greater element to its right. If it doesn't exist, output -1.",
    example: "Input: arr = [4, 5, 2, 25]\nOutput: [5, 25, 25, -1]",
    approach: "Monotonic Stack: Traverse the array from right to left (n-1 down to 0). While the stack is not empty and stack.peek() <= arr[i], pop elements from the stack. The top element is now the next greater element (or -1 if stack is empty). Push arr[i] onto the stack.",
    code: `import java.util.*;

public class NextGreaterElement {
    public static int[] nextGreater(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Stack<Integer> stack = new Stack<>();

        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && stack.peek() <= nums[i]) {
                stack.pop();
            }
            result[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(nums[i]);
        }
        return result;
    }

    public static void main(String[] args) {
        int[] arr = {4, 5, 2, 25};
        System.out.println(Arrays.toString(nextGreater(arr))); // [5, 25, 25, -1]
    }
}`,
    dryRun: "arr = [4, 5, 2, 25]\n- i=3 (25): stack empty -> result[3]=-1, push 25\n- i=2 (2): stack.peek()=25 > 2 -> result[2]=25, push 2\n- i=1 (5): pop 2, peek()=25 > 5 -> result[1]=25, push 5\n- i=0 (4): stack.peek()=5 > 4 -> result[0]=5, push 4.\nOutput: [5, 25, 25, -1].",
    timeComplexity: "O(N) — each element is pushed and popped at most once.",
    spaceComplexity: "O(N) for stack.",
    edgeCases: "Array sorted descending [5, 4, 3, 2, 1] (all -1 except none); all identical elements."
  },
  {
    num: 15,
    title: "Implement a Stack and Queue",
    topic: "Data Structures",
    statement: "Implement standard Stack (LIFO: push, pop, peek, isEmpty) using an array, and standard Queue (FIFO: enqueue, dequeue, peek, isEmpty) using an array.",
    example: "Stack: push(10), push(20), pop() -> 20\nQueue: enqueue(10), enqueue(20), dequeue() -> 10",
    approach: "Stack: top pointer tracking top element.\nQueue: circular array buffer with front, rear, and size pointers.",
    code: `public class CustomStackQueue {
    static class MyStack {
        private int[] arr;
        private int top;
        MyStack(int cap) { arr = new int[cap]; top = -1; }
        public void push(int x) { arr[++top] = x; }
        public int pop() { return arr[top--]; }
        public int peek() { return arr[top]; }
        public boolean isEmpty() { return top == -1; }
    }

    static class MyQueue {
        private int[] arr;
        private int front, rear, size, cap;
        MyQueue(int cap) {
            this.cap = cap; arr = new int[cap];
            front = 0; rear = -1; size = 0;
        }
        public void enqueue(int x) {
            rear = (rear + 1) % cap; arr[rear] = x; size++;
        }
        public int dequeue() {
            int val = arr[front]; front = (front + 1) % cap; size--; return val;
        }
        public boolean isEmpty() { return size == 0; }
    }

    public static void main(String[] args) {
        MyStack st = new MyStack(5);
        st.push(10); st.push(20);
        System.out.println("Stack Pop: " + st.pop()); // 20

        MyQueue q = new MyQueue(5);
        q.enqueue(10); q.enqueue(20);
        System.out.println("Queue Dequeue: " + q.dequeue()); // 10
    }
}`,
    dryRun: "LIFO vs FIFO properties demonstrated.",
    timeComplexity: "O(1) for all push/pop/enqueue/dequeue operations.",
    spaceComplexity: "O(Capacity) memory allocated.",
    edgeCases: "Underflow on empty stack/queue."
  },
  {
    num: 16,
    title: "Best Time to Buy and Sell Stock",
    topic: "Greedy",
    statement: "Find maximum profit possible from single stock transaction.",
    example: "Input: [7, 1, 5, 3, 6, 4]\nOutput: 5",
    approach: "Track minPrice and maxProfit in single pass.",
    code: `public class AccentureStock {
    public static int maxProfit(int[] prices) {
        int min = Integer.MAX_VALUE, max = 0;
        for (int p : prices) {
            if (p < min) min = p;
            else if (p - min > max) max = p - min;
        }
        return max;
    }
    public static void main(String[] args) {
        System.out.println(maxProfit(new int[]{7, 1, 5, 3, 6, 4})); // 5
    }
}`,
    dryRun: "Min=1, max sell=6 -> 6-1=5.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Decreasing prices."
  },
  {
    num: 17,
    title: "Merge Overlapping Intervals",
    topic: "Intervals",
    statement: "Merge contiguous overlapping intervals.",
    example: "Input: [[1, 3], [2, 6], [8, 10]]\nOutput: [[1, 6], [8, 10]]",
    approach: "Sort by start time, combine if next.start <= curr.end.",
    code: `import java.util.*;

public class AccentureMergeIntervals {
    public static int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> res = new ArrayList<>();
        int[] curr = intervals[0];
        res.add(curr);
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] <= curr[1]) {
                curr[1] = Math.max(curr[1], intervals[i][1]);
            } else {
                curr = intervals[i];
                res.add(curr);
            }
        }
        return res.toArray(new int[res.size()][]);
    }
    public static void main(String[] args) {
        int[][] res = merge(new int[][]{{1, 3}, {2, 6}, {8, 10}});
        for (int[] iv : res) System.out.print(Arrays.toString(iv) + " ");
    }
}`,
    dryRun: "[1,3] and [2,6] merge to [1,6].",
    timeComplexity: "O(N log N).",
    spaceComplexity: "O(N).",
    edgeCases: "No overlaps."
  },
  {
    num: 18,
    title: "Activity Selection Problem",
    topic: "Greedy",
    statement: "Given start and finish times of n activities, select the maximum number of activities that can be performed by a single person, assuming that a person can only work on a single activity at a time.",
    example: "Input: start = [1, 3, 0, 5, 8, 5], finish = [2, 4, 6, 7, 9, 9]\nOutput: 4\nExplanation: Activities (1, 2), (3, 4), (5, 7), (8, 9) can be selected.",
    approach: "Greedy Strategy: Always pick the activity that finishes earliest! This leaves the maximum possible remaining time for subsequent activities.\n1. Sort activities by finish time ascending.\n2. Select first activity. Set lastFinish = finish[0].\n3. For remaining activities: if start[i] >= lastFinish, select activity and update lastFinish = finish[i].",
    code: `import java.util.*;

public class ActivitySelection {
    static class Activity {
        int start, finish;
        Activity(int start, int finish) {
            this.start = start;
            this.finish = finish;
        }
    }

    public static int maxActivities(int[] start, int[] finish) {
        int n = start.length;
        Activity[] acts = new Activity[n];
        for (int i = 0; i < n; i++) acts[i] = new Activity(start[i], finish[i]);

        // Sort by finish time ascending
        Arrays.sort(acts, (a, b) -> Integer.compare(a.finish, b.finish));

        int count = 1;
        int lastFinish = acts[0].finish;

        for (int i = 1; i < n; i++) {
            if (acts[i].start >= lastFinish) {
                count++;
                lastFinish = acts[i].finish;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int[] start = {1, 3, 0, 5, 8, 5};
        int[] finish = {2, 4, 6, 7, 9, 9};
        System.out.println("Max Activities: " + maxActivities(start, finish)); // 4
    }
}`,
    dryRun: "Sorted by finish: (1,2), (3,4), (0,6), (5,7), (8,9), (5,9)\nSelect (1,2) -> lastFinish=2\nSelect (3,4) (3 >= 2) -> lastFinish=4\nSkip (0,6) (0 < 4)\nSelect (5,7) (5 >= 4) -> lastFinish=7\nSelect (8,9) (8 >= 7) -> lastFinish=9. Total = 4.",
    timeComplexity: "O(N log N) — dominated by sorting.",
    spaceComplexity: "O(N) for activity objects array.",
    edgeCases: "All activities start and end at same time; strictly disjoint activities."
  },
  {
    num: 19,
    title: "Coin Change",
    topic: "Dynamic Programming",
    statement: "Find minimum coins needed to make target amount.",
    example: "Input: coins = [1, 2, 5], amount = 11\nOutput: 3 (5 + 5 + 1)",
    approach: "1D DP: dp[i] = min(dp[i], 1 + dp[i - c]).",
    code: `import java.util.Arrays;

public class AccentureCoinChange {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (c <= i) dp[i] = Math.min(dp[i], 1 + dp[i - c]);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
    public static void main(String[] args) {
        System.out.println(coinChange(new int[]{1, 2, 5}, 11)); // 3
    }
}`,
    dryRun: "dp[11] = 3 coins.",
    timeComplexity: "O(amount * coins.length).",
    spaceComplexity: "O(amount).",
    edgeCases: "amount = 0 (0)."
  },
  {
    num: 20,
    title: "Longest Common Subsequence",
    topic: "Dynamic Programming",
    statement: "Find the length of the longest common subsequence of two strings.",
    example: "Input: \"abcde\", \"ace\"\nOutput: 3",
    approach: "2D DP matrix matching characters.",
    code: `public class AccentureLCS {
    public static int lcs(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[i][j] = 1 + dp[i - 1][j - 1];
                else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[m][n];
    }
    public static void main(String[] args) {
        System.out.println(lcs("abcde", "ace")); // 3
    }
}`,
    dryRun: "LCS of \"abcde\" and \"ace\" is \"ace\" of length 3.",
    timeComplexity: "O(M * N).",
    spaceComplexity: "O(M * N).",
    edgeCases: "Disjoint strings."
  }
];
