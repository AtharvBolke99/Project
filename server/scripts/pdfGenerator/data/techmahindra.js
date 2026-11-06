module.exports = [
  {
    num: 1,
    title: "Reverse a Number",
    topic: "Mathematics",
    statement: "Given an integer, reverse its digits and return the result.",
    example: "Input: 9876\nOutput: 6789",
    approach: "Modulo 10 digit extraction and multiplication by 10.",
    code: `public class TechMReverseNumber {
    public static int reverse(int n) {
        int r = 0;
        while (n != 0) { r = r * 10 + n % 10; n /= 10; }
        return r;
    }
    public static void main(String[] args) {
        System.out.println(reverse(9876)); // 6789
    }
}`,
    dryRun: "9876 -> 6789.",
    timeComplexity: "O(log10 N).",
    spaceComplexity: "O(1).",
    edgeCases: "Trailing zeros."
  },
  {
    num: 2,
    title: "Check Prime Number",
    topic: "Mathematics",
    statement: "Determine whether n is a prime number.",
    example: "Input: 31\nOutput: true",
    approach: "Divisor testing up to sqrt(n).",
    code: `public class TechMPrime {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i * i <= n; i++) if (n % i == 0) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isPrime(31)); // true
    }
}`,
    dryRun: "31 is prime.",
    timeComplexity: "O(sqrt(N)).",
    spaceComplexity: "O(1).",
    edgeCases: "n = 1."
  },
  {
    num: 3,
    title: "Find Factorial",
    topic: "Mathematics",
    statement: "Calculate n!.",
    example: "Input: 6\nOutput: 720",
    approach: "Iterative accumulation using long.",
    code: `public class TechMFactorial {
    public static long fact(int n) {
        long res = 1;
        for (int i = 2; i <= n; i++) res *= i;
        return res;
    }
    public static void main(String[] args) {
        System.out.println("6! = " + fact(6)); // 720
    }
}`,
    dryRun: "1 * 2 * 3 * 4 * 5 * 6 = 720.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "n = 0 (1)."
  },
  {
    num: 4,
    title: "Print Fibonacci Series",
    topic: "Mathematics",
    statement: "Print first n terms of Fibonacci sequence.",
    example: "Input: 6\nOutput: 0 1 1 2 3 5",
    approach: "Iterative state variables.",
    code: `public class TechMFibonacci {
    public static void printFib(int n) {
        int a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            System.out.print(a + " ");
            int c = a + b; a = b; b = c;
        }
        System.out.println();
    }
    public static void main(String[] args) {
        printFib(6); // 0 1 1 2 3 5
    }
}`,
    dryRun: "0 1 1 2 3 5.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "n = 1."
  },
  {
    num: 5,
    title: "Find GCD and LCM",
    topic: "Mathematics",
    statement: "Find GCD and LCM of two integers.",
    example: "Input: 20, 28\nOutput: GCD = 4, LCM = 140",
    approach: "Euclidean algorithm. LCM = (a / gcd) * b.",
    code: `public class TechMGcdLcm {
    public static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
    public static int lcm(int a, int b) { return (a / gcd(a, b)) * b; }
    public static void main(String[] args) {
        System.out.println("GCD: " + gcd(20, 28) + ", LCM: " + lcm(20, 28)); // 4, 140
    }
}`,
    dryRun: "28 % 20 = 8 -> 20 % 8 = 4 -> 8 % 4 = 0. GCD = 4.",
    timeComplexity: "O(log(min(A, B))).",
    spaceComplexity: "O(1).",
    edgeCases: "One number zero."
  },
  {
    num: 6,
    title: "Find Second-Largest Array Element",
    topic: "Arrays",
    statement: "Find second-largest distinct element.",
    example: "Input: [14, 46, 47, 86, 92, 52, 48, 36, 66, 85]\nOutput: 86",
    approach: "Single traversal with max1 and max2.",
    code: `public class TechMSecondLargest {
    public static int secondLargest(int[] a) {
        int m1 = Integer.MIN_VALUE, m2 = Integer.MIN_VALUE;
        for (int x : a) {
            if (x > m1) { m2 = m1; m1 = x; }
            else if (x < m1 && x > m2) { m2 = x; }
        }
        return m2 == Integer.MIN_VALUE ? -1 : m2;
    }
    public static void main(String[] args) {
        System.out.println(secondLargest(new int[]{14, 46, 47, 86, 92, 52, 48, 36, 66, 85})); // 86
    }
}`,
    dryRun: "Max = 92, second max = 86.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Duplicates."
  },
  {
    num: 7,
    title: "Find Missing Number",
    topic: "Arrays",
    statement: "Find missing number in range 1 to n.",
    example: "Input: [1, 2, 3, 5], n = 5\nOutput: 4",
    approach: "Sum formula: n*(n+1)/2 - sum(arr).",
    code: `public class TechMMissing {
    public static int findMissing(int[] a, int n) {
        long exp = (long) n * (n + 1) / 2;
        long act = 0;
        for (int x : a) act += x;
        return (int)(exp - act);
    }
    public static void main(String[] args) {
        System.out.println(findMissing(new int[]{1, 2, 3, 5}, 5)); // 4
    }
}`,
    dryRun: "15 - 11 = 4.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Missing 1."
  },
  {
    num: 8,
    title: "Find Duplicate Elements",
    topic: "Hashing",
    statement: "Print elements appearing more than once.",
    example: "Input: [4, 5, 6, 4, 7, 8, 5]\nOutput: 4, 5",
    approach: "HashSet lookup.",
    code: `import java.util.*;

public class TechMDuplicates {
    public static void printDups(int[] a) {
        Set<Integer> seen = new HashSet<>();
        Set<Integer> dups = new LinkedHashSet<>();
        for (int x : a) if (!seen.add(x)) dups.add(x);
        for (int x : dups) System.out.print(x + " ");
        System.out.println();
    }
    public static void main(String[] args) {
        printDups(new int[]{4, 5, 6, 4, 7, 8, 5}); // 4 5
    }
}`,
    dryRun: "4 and 5 are duplicates.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "No duplicates."
  },
  {
    num: 9,
    title: "Rotate an Array",
    topic: "Arrays",
    statement: "Rotate array right by k steps in-place.",
    example: "Input: [1, 2, 3, 4, 5], k = 3\nOutput: [3, 4, 5, 1, 2]",
    approach: "3-step reverse algorithm.",
    code: `import java.util.Arrays;

public class TechMRotate {
    public static void rotate(int[] a, int k) {
        k %= a.length;
        rev(a, 0, a.length - 1); rev(a, 0, k - 1); rev(a, k, a.length - 1);
    }
    private static void rev(int[] a, int l, int r) {
        while (l < r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; }
    }
    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5};
        rotate(a, 3);
        System.out.println(Arrays.toString(a)); // [3, 4, 5, 1, 2]
    }
}`,
    dryRun: "Rotated by 3.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "k = 0."
  },
  {
    num: 10,
    title: "Move Zeros to the End",
    topic: "Arrays",
    statement: "Shift zeros to end.",
    example: "Input: [0, 0, 1, 2, 0, 3]\nOutput: [1, 2, 3, 0, 0, 0]",
    approach: "Two-pointer write.",
    code: `import java.util.Arrays;

public class TechMMoveZeros {
    public static void move(int[] a) {
        int pos = 0;
        for (int x : a) if (x != 0) a[pos++] = x;
        while (pos < a.length) a[pos++] = 0;
    }
    public static void main(String[] args) {
        int[] a = {0, 0, 1, 2, 0, 3};
        move(a);
        System.out.println(Arrays.toString(a)); // [1, 2, 3, 0, 0, 0]
    }
}`,
    dryRun: "Non-zeros shifted forward.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "All zeros."
  },
  {
    num: 11,
    title: "Count Character Occurrences",
    topic: "Strings / Hashing",
    statement: "Count occurrences of each character in string.",
    example: "Input: \"techmahindra\"\nOutput: t:1 e:1 c:1 h:2 m:1 a:2 i:1 n:1 d:1 r:1",
    approach: "LinkedHashMap for order preservation.",
    code: `import java.util.*;

public class TechMCharCount {
    public static void count(String s) {
        Map<Character, Integer> m = new LinkedHashMap<>();
        for (char c : s.toCharArray()) m.put(c, m.getOrDefault(c, 0) + 1);
        for (Map.Entry<Character, Integer> e : m.entrySet()) System.out.print(e.getKey() + ":" + e.getValue() + " ");
        System.out.println();
    }
    public static void main(String[] args) {
        count("techmahindra");
    }
}`,
    dryRun: "Counts tracked.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(K).",
    edgeCases: "Spaces in string."
  },
  {
    num: 12,
    title: "Reverse a String",
    topic: "Strings",
    statement: "Reverse characters of string.",
    example: "Input: \"Mahindra\"\nOutput: \"ardnihaM\"",
    approach: "Two pointer swap.",
    code: `public class TechMReverseString {
    public static String reverse(String s) {
        char[] ca = s.toCharArray();
        int l = 0, r = ca.length - 1;
        while (l < r) { char t = ca[l]; ca[l++] = ca[r]; ca[r--] = t; }
        return new String(ca);
    }
    public static void main(String[] args) {
        System.out.println(reverse("Mahindra")); // ardnihaM
    }
}`,
    dryRun: "Reversed.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Single char."
  },
  {
    num: 13,
    title: "Check Palindrome",
    topic: "Strings",
    statement: "Check if string is palindrome.",
    example: "Input: \"racecar\"\nOutput: true",
    approach: "Two pointers check.",
    code: `public class TechMPalindrome {
    public static boolean isPal(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isPal("racecar")); // true
    }
}`,
    dryRun: "racecar matches backwards.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Single char."
  },
  {
    num: 14,
    title: "Check Anagrams",
    topic: "Strings",
    statement: "Check whether two strings are anagrams.",
    example: "Input: \"state\", \"taste\"\nOutput: true",
    approach: "26 bucket array.",
    code: `public class TechMAnagram {
    public static boolean isAnagram(String s1, String s2) {
        if (s1.length() != s2.length()) return false;
        int[] f = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            f[s1.charAt(i) - 'a']++; f[s2.charAt(i) - 'a']--;
        }
        for (int x : f) if (x != 0) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isAnagram("state", "taste")); // true
    }
}`,
    dryRun: "All frequencies 0.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Length mismatch."
  },
  {
    num: 15,
    title: "Remove Duplicate Characters",
    topic: "Strings",
    statement: "Remove duplicate characters from string.",
    example: "Input: \"bananas\"\nOutput: \"bans\"",
    approach: "Boolean seen array.",
    code: `public class TechMRemoveDups {
    public static String removeDups(String s) {
        boolean[] seen = new boolean[256];
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (!seen[c]) { seen[c] = true; sb.append(c); }
        }
        return sb.toString();
    }
    public static void main(String[] args) {
        System.out.println(removeDups("bananas")); // bans
    }
}`,
    dryRun: "\"bananas\" -> \"bans\".",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "All identical."
  },
  {
    num: 16,
    title: "Binary Search",
    topic: "Searching",
    statement: "Find index of target in sorted array.",
    example: "Input: [2, 4, 6, 8, 10], target = 6\nOutput: 2",
    approach: "Binary search divide and conquer.",
    code: `public class TechMBinarySearch {
    public static int search(int[] a, int t) {
        int l = 0, h = a.length - 1;
        while (l <= h) {
            int m = l + (h - l) / 2;
            if (a[m] == t) return m;
            if (a[m] < t) l = m + 1; else h = m - 1;
        }
        return -1;
    }
    public static void main(String[] args) {
        System.out.println(search(new int[]{2, 4, 6, 8, 10}, 6)); // 2
    }
}`,
    dryRun: "Index 2.",
    timeComplexity: "O(log N).",
    spaceComplexity: "O(1).",
    edgeCases: "Not found."
  },
  {
    num: 17,
    title: "Selection Sort",
    topic: "Sorting",
    statement: "Implement Selection Sort.",
    example: "Input: [29, 10, 14, 37, 13]\nOutput: [10, 13, 14, 29, 37]",
    approach: "Find minimum in unsorted part, swap with current index.",
    code: `import java.util.Arrays;

public class TechMSelectionSort {
    public static void selectionSort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[minIdx]) minIdx = j;
            }
            int t = a[minIdx]; a[minIdx] = a[i]; a[i] = t;
        }
    }
    public static void main(String[] args) {
        int[] a = {29, 10, 14, 37, 13};
        selectionSort(a);
        System.out.println(Arrays.toString(a)); // [10, 13, 14, 29, 37]
    }
}`,
    dryRun: "Sorts in O(N^2) swaps.",
    timeComplexity: "O(N^2).",
    spaceComplexity: "O(1).",
    edgeCases: "Already sorted."
  },
  {
    num: 18,
    title: "Merge Two Sorted Arrays",
    topic: "Arrays",
    statement: "Merge two sorted arrays.",
    example: "Input: [1, 5, 9] and [2, 4, 6]\nOutput: [1, 2, 4, 5, 6, 9]",
    approach: "Two pointers merge.",
    code: `import java.util.Arrays;

public class TechMMergeSorted {
    public static int[] merge(int[] a, int[] b) {
        int[] res = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) res[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
        while (i < a.length) res[k++] = a[i++];
        while (j < b.length) res[k++] = b[j++];
        return res;
    }
    public static void main(String[] args) {
        System.out.println(Arrays.toString(merge(new int[]{1, 5, 9}, new int[]{2, 4, 6})));
    }
}`,
    dryRun: "[1, 2, 4, 5, 6, 9].",
    timeComplexity: "O(A + B).",
    spaceComplexity: "O(A + B).",
    edgeCases: "Empty array."
  },
  {
    num: 19,
    title: "Find the Middle of a Linked List",
    topic: "Linked List",
    statement: "Find middle node of linked list.",
    example: "Input: 1 -> 2 -> 3 -> 4 -> 5\nOutput: 3",
    approach: "Fast (2 steps) and slow (1 step) pointers.",
    code: `public class TechMMiddleLL {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }
    public static int findMiddle(Node head) {
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next; fast = fast.next.next;
        }
        return slow != null ? slow.val : -1;
    }
    public static void main(String[] args) {
        Node h = new Node(1); h.next = new Node(2); h.next.next = new Node(3);
        h.next.next.next = new Node(4); h.next.next.next.next = new Node(5);
        System.out.println("Middle: " + findMiddle(h)); // 3
    }
}`,
    dryRun: "slow reaches 3.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Even length."
  },
  {
    num: 20,
    title: "Stack and Queue Implementation",
    topic: "Data Structures",
    statement: "Implement Stack using array and Queue using array.",
    example: "Stack LIFO: push(5), pop() -> 5; Queue FIFO: enqueue(5), dequeue() -> 5",
    approach: "Stack pointer top; Queue circular indices front & rear.",
    code: `public class TechMStackQueue {
    static class Stack {
        int[] arr = new int[10]; int top = -1;
        void push(int x) { arr[++top] = x; }
        int pop() { return arr[top--]; }
    }
    static class Queue {
        int[] arr = new int[10]; int front = 0, rear = 0;
        void enqueue(int x) { arr[rear++] = x; }
        int dequeue() { return arr[front++]; }
    }
    public static void main(String[] args) {
        Stack s = new Stack(); s.push(5);
        System.out.println("Stack Pop: " + s.pop()); // 5
        Queue q = new Queue(); q.enqueue(5);
        System.out.println("Queue Dequeue: " + q.dequeue()); // 5
    }
}`,
    dryRun: "Basic LIFO & FIFO operations.",
    timeComplexity: "O(1).",
    spaceComplexity: "O(Capacity).",
    edgeCases: "Overflow / underflow checks."
  }
];
