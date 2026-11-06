module.exports = [
  {
    num: 1,
    title: "Two Sum",
    topic: "Hashing",
    statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example: "Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]",
    approach: "Hash map storing value to index for O(1) complement lookup.",
    code: `import java.util.*;

public class DeloitteTwoSum {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) return new int[]{map.get(comp), i};
            map.put(nums[i], i);
        }
        return new int[0];
    }
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9))); // [0, 1]
    }
}`,
    dryRun: "Complement 9-7=2 found in map -> [0, 1].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Duplicates."
  },
  {
    num: 2,
    title: "Find the Duplicate Number (Floyd's Cycle Detection)",
    topic: "Arrays / Two pointers",
    statement: "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive, there is only one repeated number. Find this repeated number without modifying the array and using only O(1) extra space.",
    example: "Input: nums = [1, 3, 4, 2, 2]\nOutput: 2",
    approach: "Floyd's Tortoise and Hare Cycle Finding:\nTreat the array as a linked list where nums[i] is the pointer to the next node at index nums[i]. Because of the duplicate, a cycle is guaranteed.\nPhase 1: slow = nums[0], fast = nums[0]. Advance slow by 1 step (slow = nums[slow]) and fast by 2 steps (fast = nums[nums[fast]]) until slow == fast.\nPhase 2: Reset slow to nums[0]. Advance both slow and fast by 1 step at a time. The index where they meet is the entry point of the cycle (the duplicate number).",
    code: `public class FindDuplicateNumber {
    public static int findDuplicate(int[] nums) {
        int slow = nums[0];
        int fast = nums[0];

        // Phase 1: Detect cycle
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);

        // Phase 2: Find entry point of cycle
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }

    public static void main(String[] args) {
        int[] nums = {1, 3, 4, 2, 2};
        System.out.println("Duplicate: " + findDuplicate(nums)); // 2
    }
}`,
    dryRun: "nums = [1, 3, 4, 2, 2]\n- Phase 1: slow: 0->1->3->2->4->2; fast: 0->3->4->4->4. They meet at node 2.\n- Phase 2: slow=1, fast=2 -> slow=3, fast=4 -> slow=2, fast=2 (meet at 2). Duplicate = 2.",
    timeComplexity: "O(N) linear time.",
    spaceComplexity: "O(1) strictly constant extra space without altering array.",
    edgeCases: "Duplicate appearing multiple times (e.g. [2, 2, 2, 2]); duplicate at beginning or end."
  },
  {
    num: 3,
    title: "Find the Missing Number",
    topic: "Arrays",
    statement: "Find the single missing number from 0 to n.",
    example: "Input: [0, 1, 3]\nOutput: 2",
    approach: "XOR index with elements.",
    code: `public class DeloitteMissing {
    public static int findMissing(int[] a) {
        int x = 0;
        for (int i = 0; i <= a.length; i++) x ^= i;
        for (int v : a) x ^= v;
        return x;
    }
    public static void main(String[] args) {
        System.out.println(findMissing(new int[]{0, 1, 3})); // 2
    }
}`,
    dryRun: "(0^1^2^3) ^ (0^1^3) = 2.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Missing 0."
  },
  {
    num: 4,
    title: "Maximum Subarray Sum",
    topic: "Kadane's algorithm",
    statement: "Calculate maximum contiguous subarray sum.",
    example: "Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6",
    approach: "Kadane: curr = max(num, curr + num), max = max(max, curr).",
    code: `public class DeloitteKadane {
    public static int maxSubArray(int[] nums) {
        int c = nums[0], m = nums[0];
        for (int i = 1; i < nums.length; i++) {
            c = Math.max(nums[i], c + nums[i]);
            m = Math.max(m, c);
        }
        return m;
    }
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})); // 6
    }
}`,
    dryRun: "Subarray [4, -1, 2, 1] sum = 6.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Negative values."
  },
  {
    num: 5,
    title: "Merge Overlapping Intervals",
    topic: "Intervals",
    statement: "Merge all overlapping intervals into disjoint intervals.",
    example: "Input: [[1, 4], [4, 5]]\nOutput: [[1, 5]]",
    approach: "Sort by start time and merge if curr[0] <= prev[1].",
    code: `import java.util.*;

public class DeloitteIntervals {
    public static int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> res = new ArrayList<>();
        int[] curr = intervals[0];
        res.add(curr);
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] <= curr[1]) curr[1] = Math.max(curr[1], intervals[i][1]);
            else { curr = intervals[i]; res.add(curr); }
        }
        return res.toArray(new int[res.size()][]);
    }
    public static void main(String[] args) {
        int[][] res = merge(new int[][]{{1, 4}, {4, 5}});
        for (int[] iv : res) System.out.print(Arrays.toString(iv) + " "); // [1, 5]
    }
}`,
    dryRun: "Intervals [1,4] and [4,5] touch at 4 -> merge to [1,5].",
    timeComplexity: "O(N log N).",
    spaceComplexity: "O(N).",
    edgeCases: "Touching endpoints."
  },
  {
    num: 6,
    title: "Find the Kth-Largest Element in an Array",
    topic: "Heap / PriorityQueue",
    statement: "Given an integer array nums and an integer k, return the kth largest element in the array.",
    example: "Input: nums = [3, 2, 1, 5, 6, 4], k = 2\nOutput: 5",
    approach: "Min-Heap of size K:\nMaintain a PriorityQueue<Integer> of size k. For each element in nums, add it to the min-heap. If the heap size exceeds k, poll the smallest element. After processing all elements, the top of the min-heap is the kth largest element.",
    code: `import java.util.PriorityQueue;

public class KthLargestElement {
    public static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);
        for (int num : nums) {
            minHeap.add(num);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
        return minHeap.peek();
    }

    public static void main(String[] args) {
        int[] nums = {3, 2, 1, 5, 6, 4};
        System.out.println("2nd Largest: " + findKthLargest(nums, 2)); // 5
    }
}`,
    dryRun: "nums = [3, 2, 1, 5, 6, 4], k = 2\n- add 3, 2 -> heap=[2, 3]\n- add 1 -> heap=[1, 2, 3] -> poll 1 -> [2, 3]\n- add 5 -> heap=[2, 3, 5] -> poll 2 -> [3, 5]\n- add 6 -> heap=[3, 5, 6] -> poll 3 -> [5, 6]\n- add 4 -> heap=[4, 5, 6] -> poll 4 -> [5, 6]\nTop is 5.",
    timeComplexity: "O(N log K) — much faster than O(N log N) sorting when K << N.",
    spaceComplexity: "O(K) for min-heap.",
    edgeCases: "k = 1 (largest element); k = n (smallest element); array with duplicates."
  },
  {
    num: 7,
    title: "Longest Substring Without Repeating Characters",
    topic: "Sliding Window",
    statement: "Find length of longest substring without duplicates.",
    example: "Input: \"bbbbb\"\nOutput: 1",
    approach: "Sliding window with last seen character index table.",
    code: `public class DeloitteLongestUnique {
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
        System.out.println(lengthOfLongestSubstring("bbbbb")); // 1
    }
}`,
    dryRun: "At each 'b', window resets to length 1.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Single character."
  },
  {
    num: 8,
    title: "Group Anagrams",
    topic: "Hashing",
    statement: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    example: "Input: strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\nOutput: [[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
    approach: "Use a HashMap<String, List<String>>. For each word, convert to char array, sort the characters, and convert back to string as the canonical key (e.g. \"eat\", \"tea\", \"ate\" all sort to \"aet\"). Group all words with identical keys.",
    code: `import java.util.*;

public class GroupAnagrams {
    public static List<List<String>> groupAnagrams(String[] strs) {
        if (strs == null || strs.length == 0) return new ArrayList<>();
        Map<String, List<String>> map = new HashMap<>();

        for (String s : strs) {
            char[] ca = s.toCharArray();
            Arrays.sort(ca);
            String key = String.valueOf(ca);
            if (!map.containsKey(key)) {
                map.put(key, new ArrayList<>());
            }
            map.get(key).add(s);
        }
        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        String[] strs = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println(groupAnagrams(strs));
        // [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
    }
}`,
    dryRun: "\"eat\"->\"aet\", \"tea\"->\"aet\", \"tan\"->\"ant\", \"ate\"->\"aet\", \"nat\"->\"ant\", \"bat\"->\"abt\". Groups formed correctly.",
    timeComplexity: "O(N * K log K) where N is number of strings and K is maximum string length.",
    spaceComplexity: "O(N * K) to store strings in map.",
    edgeCases: "Empty strings [\"\"]; single character strings."
  },
  {
    num: 9,
    title: "Valid Parentheses",
    topic: "Stack",
    statement: "Determine whether the brackets string is valid.",
    example: "Input: \"()\"\nOutput: true",
    approach: "Stack push closing counterparts.",
    code: `import java.util.Stack;

public class DeloitteValidParens {
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
        System.out.println(isValid("()")); // true
    }
}`,
    dryRun: "() -> true.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Unclosed bracket."
  },
  {
    num: 10,
    title: "Next Greater Element",
    topic: "Monotonic Stack",
    statement: "Find first greater element to right of each element.",
    example: "Input: [1, 3, 2, 4]\nOutput: [3, 4, 4, -1]",
    approach: "Monotonic stack backwards pass.",
    code: `import java.util.*;

public class DeloitteNGE {
    public static int[] nextGreater(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        Stack<Integer> st = new Stack<>();
        for (int i = n - 1; i >= 0; i--) {
            while (!st.isEmpty() && st.peek() <= nums[i]) st.pop();
            res[i] = st.isEmpty() ? -1 : st.peek();
            st.push(nums[i]);
        }
        return res;
    }
    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreater(new int[]{1, 3, 2, 4}))); // [3, 4, 4, -1]
    }
}`,
    dryRun: "[1, 3, 2, 4] -> [3, 4, 4, -1].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Decreasing array."
  },
  {
    num: 11,
    title: "Reverse a Linked List",
    topic: "Linked List",
    statement: "Reverse a singly linked list in-place.",
    example: "Input: 1 -> 2 -> 3 -> null\nOutput: 3 -> 2 -> 1 -> null",
    approach: "Iterative pointer reversal (prev, curr, next).",
    code: `public class DeloitteReverseLL {
    static class Node {
        int val; Node next;
        Node(int val) { this.val = val; }
    }
    public static Node reverse(Node head) {
        Node prev = null, curr = head;
        while (curr != null) {
            Node next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
    public static void main(String[] args) {
        Node head = new Node(1); head.next = new Node(2); head.next.next = new Node(3);
        Node rev = reverse(head);
        while (rev != null) { System.out.print(rev.val + " "); rev = rev.next; } // 3 2 1
    }
}`,
    dryRun: "Pointers reversed one by one.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "head == null."
  },
  {
    num: 12,
    title: "Detect a Cycle in a Linked List",
    topic: "Linked List / Two pointers",
    statement: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    example: "Input: head = [3, 2, 0, -4], pos = 1 (tail connects to node 2)\nOutput: true",
    approach: "Floyd's Cycle Finding (Tortoise and Hare): slow pointer advances 1 step, fast pointer advances 2 steps. If there is a cycle, fast will eventually lap slow and slow == fast.",
    code: `public class LinkedListCycle {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int x) { val = x; next = null; }
    }

    public static boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(3);
        ListNode second = new ListNode(2);
        ListNode third = new ListNode(0);
        ListNode fourth = new ListNode(-4);
        head.next = second; second.next = third; third.next = fourth;
        fourth.next = second; // cycle

        System.out.println("Has Cycle? " + hasCycle(head)); // true
    }
}`,
    dryRun: "Fast catches slow inside the loop -> returns true.",
    timeComplexity: "O(N) linear time.",
    spaceComplexity: "O(1) extra space.",
    edgeCases: "Empty list; single node with self-loop; list without cycle."
  },
  {
    num: 13,
    title: "Find the Middle of a Linked List",
    topic: "Linked List",
    statement: "Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.",
    example: "Input: head = [1, 2, 3, 4, 5]\nOutput: 3\nInput: head = [1, 2, 3, 4, 5, 6]\nOutput: 4",
    approach: "Fast & slow pointers: when fast reaches the end (fast == null || fast.next == null), slow is precisely at the middle node.",
    code: `public class MiddleOfLinkedList {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    public static ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        head.next.next.next = new ListNode(4);
        head.next.next.next.next = new ListNode(5);

        System.out.println("Middle: " + middleNode(head).val); // 3
    }
}`,
    dryRun: "fast advances by 2, slow by 1. At fast=5, slow=3.",
    timeComplexity: "O(N) — single pass.",
    spaceComplexity: "O(1) extra space.",
    edgeCases: "Even number of nodes (returns second middle); 1 node."
  },
  {
    num: 14,
    title: "Implement a Queue Using Stacks",
    topic: "Queue / Stack",
    statement: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support push, pop, peek, and empty.",
    example: "MyQueue q = new MyQueue(); q.push(1); q.push(2); q.peek(); // 1; q.pop(); // 1; q.empty(); // false",
    approach: "Two Stacks (inbox and outbox):\n- push(x): push onto inbox.\n- pop()/peek(): if outbox is empty, pop all elements from inbox and push onto outbox (reversing their order to FIFO). Then pop/peek from outbox.\n- Amortized complexity is O(1) because each element moves into outbox exactly once.",
    code: `import java.util.Stack;

public class QueueUsingStacks {
    static class MyQueue {
        private Stack<Integer> in = new Stack<>();
        private Stack<Integer> out = new Stack<>();

        public void push(int x) { in.push(x); }

        public int pop() {
            peek();
            return out.pop();
        }

        public int peek() {
            if (out.isEmpty()) {
                while (!in.isEmpty()) {
                    out.push(in.pop());
                }
            }
            return out.peek();
        }

        public boolean empty() {
            return in.isEmpty() && out.isEmpty();
        }
    }

    public static void main(String[] args) {
        MyQueue q = new MyQueue();
        q.push(1); q.push(2);
        System.out.println("Peek: " + q.peek()); // 1
        System.out.println("Pop: " + q.pop());   // 1
        System.out.println("Empty? " + q.empty()); // false
    }
}`,
    dryRun: "Elements transferred in reverse: FIFO behavior verified.",
    timeComplexity: "Amortized O(1) for pop/peek; O(1) push.",
    spaceComplexity: "O(N) to store elements.",
    edgeCases: "Alternating push and pop operations."
  },
  {
    num: 15,
    title: "Binary Tree Traversals (Inorder, Preorder, Postorder)",
    topic: "Binary Trees",
    statement: "Given the root of a binary tree, implement Inorder, Preorder, and Postorder depth-first traversals.",
    example: "Tree: 1 -> right: 2 -> left: 3\nInorder (Left, Root, Right): [1, 3, 2]\nPreorder (Root, Left, Right): [1, 2, 3]\nPostorder (Left, Right, Root): [3, 2, 1]",
    approach: "Recursive DFS definitions:\n- Inorder: recurse(node.left), visit(node), recurse(node.right)\n- Preorder: visit(node), recurse(node.left), recurse(node.right)\n- Postorder: recurse(node.left), recurse(node.right), visit(node)",
    code: `import java.util.*;

public class BinaryTreeTraversals {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    public static void inorder(TreeNode root, List<Integer> res) {
        if (root == null) return;
        inorder(root.left, res);
        res.add(root.val);
        inorder(root.right, res);
    }

    public static void preorder(TreeNode root, List<Integer> res) {
        if (root == null) return;
        res.add(root.val);
        preorder(root.left, res);
        preorder(root.right, res);
    }

    public static void postorder(TreeNode root, List<Integer> res) {
        if (root == null) return;
        postorder(root.left, res);
        postorder(root.right, res);
        res.add(root.val);
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(1);
        root.right = new TreeNode(2);
        root.right.left = new TreeNode(3);

        List<Integer> in = new ArrayList<>(), pre = new ArrayList<>(), post = new ArrayList<>();
        inorder(root, in); preorder(root, pre); postorder(root, post);

        System.out.println("Inorder: " + in);     // [1, 3, 2]
        System.out.println("Preorder: " + pre);   // [1, 2, 3]
        System.out.println("Postorder: " + post); // [3, 2, 1]
    }
}`,
    dryRun: "Standard depth first recursive traversal.",
    timeComplexity: "O(N) — visits each of the N nodes once.",
    spaceComplexity: "O(H) recursion stack where H is tree height.",
    edgeCases: "root == null; skewed tree (H = N)."
  },
  {
    num: 16,
    title: "Find the Height of a Binary Tree",
    topic: "Binary Trees",
    statement: "Given the root of a binary tree, find its maximum depth / height (number of nodes along the longest path from root to leaf).",
    example: "Input: root = [3, 9, 20, null, null, 15, 7]\nOutput: 3",
    approach: "Recursive Divide and Conquer: height(root) = 1 + Math.max(height(root.left), height(root.right)). Base case: null root has height 0.",
    code: `public class HeightOfBinaryTree {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    public static int maxDepth(TreeNode root) {
        if (root == null) return 0;
        int leftHeight = maxDepth(root.left);
        int rightHeight = maxDepth(root.right);
        return 1 + Math.max(leftHeight, rightHeight);
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);

        System.out.println("Height: " + maxDepth(root)); // 3
    }
}`,
    dryRun: "Left depth=1 (node 9), right depth=2 (node 20->15,7). Total = 1 + max(1, 2) = 3.",
    timeComplexity: "O(N) visits every node.",
    spaceComplexity: "O(H) call stack.",
    edgeCases: "root == null (0); single node (1)."
  },
  {
    num: 17,
    title: "Find the Lowest Common Ancestor (LCA)",
    topic: "Binary Trees",
    statement: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q. The LCA is defined between two nodes p and q as the lowest node in T that has both p and q as descendants.",
    example: "Input: root = [3, 5, 1, 6, 2, 0, 8], p = 5, q = 1\nOutput: 3\nExplanation: LCA of 5 and 1 is 3.",
    approach: "Recursive LCA:\n1. If root is null, or root == p, or root == q, return root.\n2. Recurse left and right: left = lca(root.left), right = lca(root.right).\n3. If both left and right are non-null, p and q lie in different subtrees of root, so root is the LCA!\n4. If only one is non-null, return that non-null child.",
    code: `public class LowestCommonAncestor {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        if (left != null && right != null) return root;
        return left != null ? left : right;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(3);
        TreeNode p = new TreeNode(5);
        TreeNode q = new TreeNode(1);
        root.left = p; root.right = q;

        TreeNode lca = lowestCommonAncestor(root, p, q);
        System.out.println("LCA: " + lca.val); // 3
    }
}`,
    dryRun: "Left returns 5, right returns 1 -> both non-null -> root (3) is LCA.",
    timeComplexity: "O(N) — each node visited at most once.",
    spaceComplexity: "O(H) for recursion stack.",
    edgeCases: "p is an ancestor of q (returns p); q is ancestor of p."
  },
  {
    num: 18,
    title: "BFS and DFS",
    topic: "Graphs",
    statement: "Implement Breadth First Search and Depth First Search on graph.",
    example: "BFS: level-order traversal using Queue.\nDFS: depth-first branch traversal using recursion.",
    approach: "BFS uses Queue + visited boolean array. DFS uses recursion + visited boolean array.",
    code: `import java.util.*;

public class DeloitteGraphSearch {
    public static void bfs(int start, List<List<Integer>> adj, int V) {
        boolean[] vis = new boolean[V];
        Queue<Integer> q = new LinkedList<>();
        vis[start] = true; q.add(start);
        System.out.print("BFS: ");
        while (!q.isEmpty()) {
            int u = q.poll();
            System.out.print(u + " ");
            for (int v : adj.get(u)) {
                if (!vis[v]) { vis[v] = true; q.add(v); }
            }
        }
        System.out.println();
    }
    public static void main(String[] args) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < 4; i++) adj.add(new ArrayList<>());
        adj.get(0).add(1); adj.get(0).add(2);
        adj.get(1).add(2); adj.get(2).add(3);
        bfs(0, adj, 4); // BFS: 0 1 2 3
    }
}`,
    dryRun: "0 -> 1, 2 -> 3.",
    timeComplexity: "O(V + E).",
    spaceComplexity: "O(V).",
    edgeCases: "Disconnected graph."
  },
  {
    num: 19,
    title: "Number of Islands",
    topic: "Graphs / BFS & DFS",
    statement: "Count connected components of '1's in 2D binary grid.",
    example: "Input: 2x2 grid with [[1, 0], [0, 1]]\nOutput: 2",
    approach: "Sink connected land cells recursively with DFS.",
    code: `public class DeloitteIslands {
    public static int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    sink(grid, r, c);
                }
            }
        }
        return count;
    }
    private static void sink(char[][] g, int r, int c) {
        if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != '1') return;
        g[r][c] = '0';
        sink(g, r+1, c); sink(g, r-1, c); sink(g, r, c+1); sink(g, r, c-1);
    }
    public static void main(String[] args) {
        char[][] g = {{'1', '0'}, {'0', '1'}};
        System.out.println("Islands: " + numIslands(g)); // 2
    }
}`,
    dryRun: "Diagonal cells are not connected horizontally/vertically -> 2 islands.",
    timeComplexity: "O(M * N).",
    spaceComplexity: "O(M * N).",
    edgeCases: "All water."
  },
  {
    num: 20,
    title: "Climbing Stairs",
    topic: "Dynamic Programming",
    statement: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    example: "Input: n = 3\nOutput: 3\nExplanation: 1+1+1, 1+2, 2+1",
    approach: "Fibonacci recurrence: To reach step n, you must arrive from step n-1 (1 step jump) or step n-2 (2 step jump). Thus, ways(n) = ways(n-1) + ways(n-2). Solved in O(N) time and O(1) space with two variables.",
    code: `public class ClimbingStairs {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;

        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }

    public static void main(String[] args) {
        System.out.println("Ways for n=3: " + climbStairs(3)); // 3
        System.out.println("Ways for n=5: " + climbStairs(5)); // 8
    }
}`,
    dryRun: "n=1: 1; n=2: 2; n=3: 1+2=3; n=4: 2+3=5; n=5: 3+5=8.",
    timeComplexity: "O(N) linear loop.",
    spaceComplexity: "O(1) constant auxiliary space.",
    edgeCases: "n = 1 (1); n = 2 (2)."
  }
];
