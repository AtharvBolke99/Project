module.exports = [
  {
    num: 1,
    title: "Find Largest and Smallest Elements in an Array",
    topic: "Arrays",
    statement: "Given an array of integers, find the maximum and minimum elements in a single traversal.",
    example: "Input: [3, 5, 4, 1, 9]\nOutput: Min = 1, Max = 9",
    approach: "Initialize min and max with arr[0]. Traverse from index 1 to n-1: if arr[i] < min, update min; if arr[i] > max, update max.",
    code: `public class HclMinMax {
    public static void findMinMax(int[] arr) {
        int min = arr[0], max = arr[0];
        for (int x : arr) {
            if (x < min) min = x;
            if (x > max) max = x;
        }
        System.out.println("Min: " + min + ", Max: " + max);
    }
    public static void main(String[] args) {
        findMinMax(new int[]{3, 5, 4, 1, 9}); // Min: 1, Max: 9
    }
}`,
    dryRun: "Single pass updates min to 1 and max to 9.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Single element; all elements equal."
  },
  {
    num: 2,
    title: "Find the Second-Largest Element",
    topic: "Arrays",
    statement: "Find second-largest element in array without sorting.",
    example: "Input: [10, 20, 4, 45, 99]\nOutput: 45",
    approach: "Track max1 and max2 in single pass.",
    code: `public class HclSecondLargest {
    public static int secondLargest(int[] arr) {
        int m1 = Integer.MIN_VALUE, m2 = Integer.MIN_VALUE;
        for (int x : arr) {
            if (x > m1) { m2 = m1; m1 = x; }
            else if (x < m1 && x > m2) { m2 = x; }
        }
        return m2 == Integer.MIN_VALUE ? -1 : m2;
    }
    public static void main(String[] args) {
        System.out.println(secondLargest(new int[]{10, 20, 4, 45, 99})); // 45
    }
}`,
    dryRun: "Largest 99, second 45.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Duplicates."
  },
  {
    num: 3,
    title: "Reverse an Array",
    topic: "Arrays",
    statement: "Reverse an array in-place.",
    example: "Input: [1, 2, 3, 4, 5]\nOutput: [5, 4, 3, 2, 1]",
    approach: "Two-pointer swap from l=0 and r=n-1 inwards.",
    code: `import java.util.Arrays;

public class HclReverseArray {
    public static void reverse(int[] arr) {
        int l = 0, r = arr.length - 1;
        while (l < r) {
            int t = arr[l]; arr[l++] = arr[r]; arr[r--] = t;
        }
    }
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        reverse(arr);
        System.out.println(Arrays.toString(arr)); // [5, 4, 3, 2, 1]
    }
}`,
    dryRun: "Elements swapped pairwise.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Empty array; 1 element."
  },
  {
    num: 4,
    title: "Find a Missing Number",
    topic: "Arrays",
    statement: "Find missing integer in range 0 to n.",
    example: "Input: [3, 0, 1]\nOutput: 2",
    approach: "Bitwise XOR method.",
    code: `public class HclMissingNumber {
    public static int findMissing(int[] a) {
        int x = 0;
        for (int i = 0; i <= a.length; i++) x ^= i;
        for (int num : a) x ^= num;
        return x;
    }
    public static void main(String[] args) {
        System.out.println(findMissing(new int[]{3, 0, 1})); // 2
    }
}`,
    dryRun: "XOR cancellations leave 2.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Missing 0."
  },
  {
    num: 5,
    title: "Move Zeros to the End",
    topic: "Arrays",
    statement: "Shift zeros to end preserving non-zero order.",
    example: "Input: [0, 1, 0, 3, 12]\nOutput: [1, 3, 12, 0, 0]",
    approach: "Two-pointer in-place write.",
    code: `import java.util.Arrays;

public class HclMoveZeros {
    public static void move(int[] a) {
        int idx = 0;
        for (int x : a) if (x != 0) a[idx++] = x;
        while (idx < a.length) a[idx++] = 0;
    }
    public static void main(String[] args) {
        int[] a = {0, 1, 0, 3, 12};
        move(a);
        System.out.println(Arrays.toString(a)); // [1, 3, 12, 0, 0]
    }
}`,
    dryRun: "[0, 1, 0, 3, 12] -> [1, 3, 12, 0, 0].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "No zeros."
  },
  {
    num: 6,
    title: "Count Array Frequencies",
    topic: "Hashing",
    statement: "Count frequency of each element in array.",
    example: "Input: [10, 20, 20, 10, 10, 20, 5, 20]\nOutput: 10:3, 20:4, 5:1",
    approach: "HashMap counting.",
    code: `import java.util.*;

public class HclArrayFreq {
    public static void printFreq(int[] a) {
        Map<Integer, Integer> map = new LinkedHashMap<>();
        for (int x : a) map.put(x, map.getOrDefault(x, 0) + 1);
        for (Map.Entry<Integer, Integer> e : map.entrySet()) {
            System.out.print(e.getKey() + ":" + e.getValue() + " ");
        }
        System.out.println();
    }
    public static void main(String[] args) {
        printFreq(new int[]{10, 20, 20, 10, 10, 20, 5, 20});
    }
}`,
    dryRun: "10:3 20:4 5:1.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "All distinct."
  },
  {
    num: 7,
    title: "Rotate an Array",
    topic: "Arrays",
    statement: "Rotate array to right by k positions.",
    example: "Input: [1, 2, 3, 4, 5], k = 2\nOutput: [4, 5, 1, 2, 3]",
    approach: "Reverse all, reverse 0..k-1, reverse k..n-1.",
    code: `import java.util.Arrays;

public class HclRotate {
    public static void rotate(int[] a, int k) {
        k %= a.length;
        rev(a, 0, a.length - 1); rev(a, 0, k - 1); rev(a, k, a.length - 1);
    }
    private static void rev(int[] a, int l, int r) {
        while (l < r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; }
    }
    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5};
        rotate(a, 2);
        System.out.println(Arrays.toString(a)); // [4, 5, 1, 2, 3]
    }
}`,
    dryRun: "Three reversals achieve rotation.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "k = 0."
  },
  {
    num: 8,
    title: "Find Duplicates in an Array",
    topic: "Hashing",
    statement: "Find all numbers appearing more than once.",
    example: "Input: [1, 2, 3, 2, 4, 5, 1]\nOutput: [1, 2]",
    approach: "HashSet to track seen elements and identify duplicates.",
    code: `import java.util.*;

public class HclDuplicates {
    public static List<Integer> findDups(int[] a) {
        Set<Integer> seen = new HashSet<>();
        Set<Integer> dups = new LinkedHashSet<>();
        for (int x : a) {
            if (!seen.add(x)) dups.add(x);
        }
        return new ArrayList<>(dups);
    }
    public static void main(String[] args) {
        System.out.println(findDups(new int[]{1, 2, 3, 2, 4, 5, 1})); // [2, 1]
    }
}`,
    dryRun: "2 and 1 repeat.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "No duplicates."
  },
  {
    num: 9,
    title: "Check Whether an Array is Sorted",
    topic: "Arrays",
    statement: "Given an array nums, return true if the array was originally sorted in non-decreasing order.",
    example: "Input: [1, 2, 3, 4, 5]\nOutput: true\nInput: [1, 3, 2, 4]\nOutput: false",
    approach: "Linear scan from index 0 to n-2: if arr[i] > arr[i+1], return false. If loop finishes, return true.",
    code: `public class CheckSortedArray {
    public static boolean isSorted(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) return false;
        }
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isSorted(new int[]{1, 2, 3, 4, 5})); // true
        System.out.println(isSorted(new int[]{1, 3, 2, 4}));    // false
    }
}`,
    dryRun: "Compares adjacent elements in O(N).",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Empty array; 1 element (true); array with all identical elements (true)."
  },
  {
    num: 10,
    title: "Check Prime Number",
    topic: "Mathematics",
    statement: "Determine if n is prime.",
    example: "Input: 23\nOutput: true",
    approach: "Test divisors up to sqrt(n).",
    code: `public class HclPrime {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i * i <= n; i++) if (n % i == 0) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isPrime(23)); // true
    }
}`,
    dryRun: "No divisor <= sqrt(23) -> prime.",
    timeComplexity: "O(sqrt(N)).",
    spaceComplexity: "O(1).",
    edgeCases: "n = 1."
  },
  {
    num: 11,
    title: "Armstrong Number",
    topic: "Mathematics",
    statement: "Check if n equals sum of its digits raised to power of number of digits.",
    example: "Input: 153\nOutput: true",
    approach: "Count digits k, compute sum of digit^k.",
    code: `public class HclArmstrong {
    public static boolean isArmstrong(int n) {
        int orig = n, k = String.valueOf(n).length();
        long sum = 0, temp = n;
        while (temp > 0) {
            sum += Math.round(Math.pow(temp % 10, k));
            temp /= 10;
        }
        return sum == orig;
    }
    public static void main(String[] args) {
        System.out.println(isArmstrong(153)); // true
    }
}`,
    dryRun: "1^3 + 5^3 + 3^3 = 153.",
    timeComplexity: "O(log10 N).",
    spaceComplexity: "O(1).",
    edgeCases: "Single digits 0-9."
  },
  {
    num: 12,
    title: "Fibonacci Series",
    topic: "Mathematics",
    statement: "Print first n terms of Fibonacci sequence.",
    example: "Input: 5\nOutput: 0 1 1 2 3",
    approach: "Iterative two variables a and b.",
    code: `public class HclFibonacci {
    public static void printFib(int n) {
        int a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            System.out.print(a + " ");
            int c = a + b; a = b; b = c;
        }
        System.out.println();
    }
    public static void main(String[] args) {
        printFib(5); // 0 1 1 2 3
    }
}`,
    dryRun: "0 1 1 2 3.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "n = 1."
  },
  {
    num: 13,
    title: "Reverse a String",
    topic: "Strings",
    statement: "Reverse characters in string.",
    example: "Input: \"HCLTech\"\nOutput: \"hceTLCH\"",
    approach: "Two pointers on char array.",
    code: `public class HclReverseString {
    public static String reverse(String s) {
        char[] ca = s.toCharArray();
        int l = 0, r = ca.length - 1;
        while (l < r) {
            char t = ca[l]; ca[l++] = ca[r]; ca[r--] = t;
        }
        return new String(ca);
    }
    public static void main(String[] args) {
        System.out.println(reverse("HCLTech")); // hceTLCH
    }
}`,
    dryRun: "Reversed.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Single char."
  },
  {
    num: 14,
    title: "Check Palindrome",
    topic: "Strings",
    statement: "Check if string is palindrome.",
    example: "Input: \"noon\"\nOutput: true",
    approach: "Two pointers inwards.",
    code: `public class HclPalindrome {
    public static boolean isPal(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isPal("noon")); // true
    }
}`,
    dryRun: "noon matches backwards.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Single character."
  },
  {
    num: 15,
    title: "Check Anagrams",
    topic: "Strings",
    statement: "Check if two strings are anagrams.",
    example: "Input: \"listen\", \"silent\"\nOutput: true",
    approach: "Count array 26 characters.",
    code: `public class HclAnagram {
    public static boolean isAnagram(String a, String b) {
        if (a.length() != b.length()) return false;
        int[] f = new int[26];
        for (int i = 0; i < a.length(); i++) {
            f[a.charAt(i) - 'a']++; f[b.charAt(i) - 'a']--;
        }
        for (int x : f) if (x != 0) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent")); // true
    }
}`,
    dryRun: "Frequencies equal.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Length mismatch."
  },
  {
    num: 16,
    title: "Count Vowels and Consonants",
    topic: "Strings",
    statement: "Count vowels and consonants in string.",
    example: "Input: \"Java\"\nOutput: Vowels = 2, Consonants = 2",
    approach: "Character scan checking against \"aeiou\".",
    code: `public class HclVowelsConsonants {
    public static void count(String s) {
        int v = 0, c = 0;
        for (char ch : s.toLowerCase().toCharArray()) {
            if (ch >= 'a' && ch <= 'z') {
                if ("aeiou".indexOf(ch) != -1) v++; else c++;
            }
        }
        System.out.println("Vowels: " + v + ", Consonants: " + c);
    }
    public static void main(String[] args) {
        count("Java"); // Vowels: 2, Consonants: 2
    }
}`,
    dryRun: "j:c, a:v, v:c, a:v.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Special characters."
  },
  {
    num: 17,
    title: "Binary Search",
    topic: "Searching",
    statement: "Perform binary search for key in sorted array.",
    example: "Input: [10, 20, 30, 40], key = 30\nOutput: 2",
    approach: "Binary search mid calculation.",
    code: `public class HclBinarySearch {
    public static int search(int[] a, int k) {
        int l = 0, h = a.length - 1;
        while (l <= h) {
            int m = l + (h - l) / 2;
            if (a[m] == k) return m;
            if (a[m] < k) l = m + 1; else h = m - 1;
        }
        return -1;
    }
    public static void main(String[] args) {
        System.out.println(search(new int[]{10, 20, 30, 40}, 30)); // 2
    }
}`,
    dryRun: "Returns 2.",
    timeComplexity: "O(log N).",
    spaceComplexity: "O(1).",
    edgeCases: "Key absent."
  },
  {
    num: 18,
    title: "Sort an Array",
    topic: "Sorting",
    statement: "Sort array using quick sort or insertion sort.",
    example: "Input: [5, 2, 8, 1, 9]\nOutput: [1, 2, 5, 8, 9]",
    approach: "Insertion sort: place each element into its correct sorted position in preceding subarray.",
    code: `import java.util.Arrays;

public class HclInsertionSort {
    public static void sort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
    public static void main(String[] args) {
        int[] a = {5, 2, 8, 1, 9};
        sort(a);
        System.out.println(Arrays.toString(a)); // [1, 2, 5, 8, 9]
    }
}`,
    dryRun: "Elements shifted into position.",
    timeComplexity: "O(N^2) average/worst, O(N) best.",
    spaceComplexity: "O(1) in-place.",
    edgeCases: "Already sorted."
  },
  {
    num: 19,
    title: "Reverse a Linked List",
    topic: "Linked List",
    statement: "Reverse singly linked list.",
    example: "Input: 1 -> 2 -> 3\nOutput: 3 -> 2 -> 1",
    approach: "Iterative pointer reversal.",
    code: `public class HclReverseLL {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }
    public static Node reverse(Node head) {
        Node prev = null, curr = head;
        while (curr != null) {
            Node next = curr.next; curr.next = prev; prev = curr; curr = next;
        }
        return prev;
    }
    public static void main(String[] args) {
        Node h = new Node(1); h.next = new Node(2); h.next.next = new Node(3);
        Node r = reverse(h);
        while (r != null) { System.out.print(r.val + " "); r = r.next; } // 3 2 1
    }
}`,
    dryRun: "Reversed list.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Single node."
  },
  {
    num: 20,
    title: "Balanced Parentheses",
    topic: "Stack",
    statement: "Check if string has balanced parentheses.",
    example: "Input: \"[()]\"\nOutput: true",
    approach: "Stack bracket matching.",
    code: `import java.util.Stack;

public class HclBalancedParens {
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
        System.out.println(isValid("[()]")); // true
    }
}`,
    dryRun: "Valid brackets.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Unbalanced brackets."
  }
];
