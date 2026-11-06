module.exports = [
  {
    num: 1,
    title: "Reverse a Number",
    topic: "Mathematics",
    statement: "Given an integer n, return the reversed number. Handle both positive and negative values.",
    example: "Input: 1234\nOutput: 4321",
    approach: "Extract digits using modulo 10 and build reversed number: rev = rev * 10 + n % 10. Divide n by 10 each step.",
    code: `public class WiproReverseNumber {
    public static int reverse(int n) {
        int rev = 0;
        while (n != 0) {
            rev = rev * 10 + n % 10;
            n /= 10;
        }
        return rev;
    }
    public static void main(String[] args) {
        System.out.println(reverse(1234)); // 4321
        System.out.println(reverse(-456)); // -654
    }
}`,
    dryRun: "1234: rev=4 -> 43 -> 432 -> 4321.",
    timeComplexity: "O(log10 N).",
    spaceComplexity: "O(1).",
    edgeCases: "Number ending in zero (500 -> 5); 0 -> 0."
  },
  {
    num: 2,
    title: "Check a Prime Number",
    topic: "Mathematics",
    statement: "Determine whether a given number is prime or not.",
    example: "Input: 17\nOutput: Prime",
    approach: "Check divisibility up to sqrt(n). If divisible by any number, it is composite.",
    code: `public class WiproPrimeCheck {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isPrime(17) ? "Prime" : "Not Prime"); // Prime
    }
}`,
    dryRun: "17: sqrt is 4.12. Check 2, 3, 4 -> no divisor -> Prime.",
    timeComplexity: "O(sqrt(N)).",
    spaceComplexity: "O(1).",
    edgeCases: "n <= 1 (Not prime); n = 2 (Prime)."
  },
  {
    num: 3,
    title: "Print the Fibonacci Series",
    topic: "Mathematics",
    statement: "Print the first n terms of the Fibonacci sequence.",
    example: "Input: n = 6\nOutput: 0 1 1 2 3 5",
    approach: "Iterative two-pointer state: a = 0, b = 1, next = a + b.",
    code: `public class WiproFibonacci {
    public static void printFibonacci(int n) {
        int a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            System.out.print(a + " ");
            int c = a + b;
            a = b;
            b = c;
        }
        System.out.println();
    }
    public static void main(String[] args) {
        printFibonacci(6); // 0 1 1 2 3 5
    }
}`,
    dryRun: "0, 1, 1, 2, 3, 5.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "n = 1 (prints 0)."
  },
  {
    num: 4,
    title: "Calculate Factorial Using Recursion",
    topic: "Recursion",
    statement: "Given an integer n, calculate its factorial n! using recursion.",
    example: "Input: n = 5\nOutput: 120 (5 * 4 * 3 * 2 * 1)",
    approach: "Base case: if n <= 1 return 1. Recursive case: return n * factorial(n - 1). Use long to handle values up to 20!.",
    code: `public class WiproFactorial {
    public static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    public static void main(String[] args) {
        System.out.println("5! = " + factorial(5)); // 120
    }
}`,
    dryRun: "fact(5) = 5 * fact(4) = 5 * 24 = 120.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N) call stack.",
    edgeCases: "n = 0 (returns 1)."
  },
  {
    num: 5,
    title: "Find GCD and LCM",
    topic: "Mathematics",
    statement: "Find the GCD and LCM of two integers.",
    example: "Input: a = 15, b = 25\nOutput: GCD = 5, LCM = 75",
    approach: "Euclidean algorithm for GCD: gcd(a, b) = gcd(b, a % b). LCM = (a / gcd) * b.",
    code: `public class WiproGcdLcm {
    public static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
    public static int lcm(int a, int b) {
        return (a / gcd(a, b)) * b;
    }
    public static void main(String[] args) {
        System.out.println("GCD: " + gcd(15, 25) + ", LCM: " + lcm(15, 25)); // 5, 75
    }
}`,
    dryRun: "15%25=15 -> 25%15=10 -> 15%10=5 -> 10%5=0 -> GCD=5.",
    timeComplexity: "O(log(min(A, B))).",
    spaceComplexity: "O(log(min(A, B))) stack.",
    edgeCases: "One number is multiple of the other."
  },
  {
    num: 6,
    title: "Find the Second-Largest Array Element",
    topic: "Arrays",
    statement: "Find the second-largest element in an integer array in single traversal.",
    example: "Input: [10, 5, 20, 8]\nOutput: 10",
    approach: "Track max1 and max2. Update max2 when num > max1, or num > max2 and num < max1.",
    code: `public class WiproSecondLargest {
    public static int secondLargest(int[] arr) {
        int max1 = Integer.MIN_VALUE, max2 = Integer.MIN_VALUE;
        for (int x : arr) {
            if (x > max1) {
                max2 = max1;
                max1 = x;
            } else if (x > max2 && x < max1) {
                max2 = x;
            }
        }
        return max2;
    }
    public static void main(String[] args) {
        System.out.println(secondLargest(new int[]{10, 5, 20, 8})); // 10
    }
}`,
    dryRun: "Elements processed: max1=20, max2=10.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Array with duplicate max values."
  },
  {
    num: 7,
    title: "Find the Missing Number",
    topic: "Arrays",
    statement: "Find missing integer in range 1 to n.",
    example: "Input: [1, 2, 4, 5], n = 5\nOutput: 3",
    approach: "Sum formula: total = n*(n+1)/2. Missing = total - sum(arr).",
    code: `public class WiproMissingNumber {
    public static int findMissing(int[] arr, int n) {
        long expected = (long) n * (n + 1) / 2;
        long actual = 0;
        for (int x : arr) actual += x;
        return (int) (expected - actual);
    }
    public static void main(String[] args) {
        System.out.println(findMissing(new int[]{1, 2, 4, 5}, 5)); // 3
    }
}`,
    dryRun: "expected = 15, actual = 12, missing = 3.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Missing first element 1; missing last element n."
  },
  {
    num: 8,
    title: "Move Zeros to the End",
    topic: "Arrays",
    statement: "Shift all 0s in the array to the rightmost positions in-place.",
    example: "Input: [0, 1, 0, 3, 12]\nOutput: [1, 3, 12, 0, 0]",
    approach: "Two pointers: index tracks non-zero placement.",
    code: `import java.util.Arrays;

public class WiproMoveZeros {
    public static void move(int[] arr) {
        int idx = 0;
        for (int x : arr) if (x != 0) arr[idx++] = x;
        while (idx < arr.length) arr[idx++] = 0;
    }
    public static void main(String[] args) {
        int[] arr = {0, 1, 0, 3, 12};
        move(arr);
        System.out.println(Arrays.toString(arr)); // [1, 3, 12, 0, 0]
    }
}`,
    dryRun: "Copy non-zeros to front: [1, 3, 12], fill remaining with 0: [1, 3, 12, 0, 0].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Array with no zeros; array with all zeros."
  },
  {
    num: 9,
    title: "Remove Duplicates from an Array",
    topic: "Arrays",
    statement: "Remove duplicate elements from sorted array in-place.",
    example: "Input: [1, 1, 2, 2, 3]\nOutput: [1, 2, 3]",
    approach: "Two pointers: if arr[i] != arr[idx], increment idx and copy.",
    code: `import java.util.Arrays;

public class WiproRemoveDuplicates {
    public static int removeDuplicates(int[] arr) {
        if (arr.length == 0) return 0;
        int idx = 0;
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] != arr[idx]) arr[++idx] = arr[i];
        }
        return idx + 1;
    }
    public static void main(String[] args) {
        int[] arr = {1, 1, 2, 2, 3};
        int len = removeDuplicates(arr);
        System.out.println(Arrays.toString(Arrays.copyOfRange(arr, 0, len))); // [1, 2, 3]
    }
}`,
    dryRun: "[1, 1, 2, 2, 3] -> unique count = 3.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "All elements unique; all elements same."
  },
  {
    num: 10,
    title: "Rotate an Array by K",
    topic: "Arrays",
    statement: "Rotate array to right by K steps.",
    example: "Input: [1, 2, 3, 4, 5], k = 2\nOutput: [4, 5, 1, 2, 3]",
    approach: "Three reversals: reverse whole array, reverse first k, reverse remaining.",
    code: `import java.util.Arrays;

public class WiproRotateArray {
    public static void rotate(int[] arr, int k) {
        k %= arr.length;
        rev(arr, 0, arr.length - 1);
        rev(arr, 0, k - 1);
        rev(arr, k, arr.length - 1);
    }
    private static void rev(int[] arr, int l, int r) {
        while (l < r) {
            int t = arr[l]; arr[l++] = arr[r]; arr[r--] = t;
        }
    }
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        rotate(arr, 2);
        System.out.println(Arrays.toString(arr)); // [4, 5, 1, 2, 3]
    }
}`,
    dryRun: "Reversing: [5,4,3,2,1] -> [4,5,3,2,1] -> [4,5,1,2,3].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "k = 0; k = length."
  },
  {
    num: 11,
    title: "Reverse a String",
    topic: "Strings",
    statement: "Reverse the given string in-place on a char array.",
    example: "Input: \"hello\"\nOutput: \"olleh\"",
    approach: "Two-pointer swap on char array from ends towards center.",
    code: `public class WiproReverseString {
    public static String reverse(String s) {
        char[] chars = s.toCharArray();
        int l = 0, r = chars.length - 1;
        while (l < r) {
            char temp = chars[l];
            chars[l++] = chars[r];
            chars[r--] = temp;
        }
        return new String(chars);
    }
    public static void main(String[] args) {
        System.out.println(reverse("hello")); // olleh
    }
}`,
    dryRun: "'h' <-> 'o' -> 'e' <-> 'l' -> 'l' unchanged -> \"olleh\".",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N) for char array.",
    edgeCases: "Single char \"a\"; empty string \"\"."
  },
  {
    num: 12,
    title: "Check Palindrome and Anagram",
    topic: "Strings",
    statement: "Implement verification for: (1) whether a string is a palindrome, and (2) whether two strings are anagrams.",
    example: "Palindrome: \"madam\" -> true\nAnagrams: \"listen\" & \"silent\" -> true",
    approach: "Palindrome: two pointers comparing front and back.\nAnagram: frequency array of 26 letters checking equality of counts.",
    code: `import java.util.Arrays;

public class WiproPalAndAnagram {
    public static boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            if (s.charAt(l++) != s.charAt(r--)) return false;
        }
        return true;
    }

    public static boolean isAnagram(String s1, String s2) {
        if (s1.length() != s2.length()) return false;
        int[] freq = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            freq[s1.charAt(i) - 'a']++;
            freq[s2.charAt(i) - 'a']--;
        }
        for (int f : freq) if (f != 0) return false;
        return true;
    }

    public static void main(String[] args) {
        System.out.println("madam is palindrome? " + isPalindrome("madam")); // true
        System.out.println("listen & silent are anagrams? " + isAnagram("listen", "silent")); // true
    }
}`,
    dryRun: "madam: m=m, a=a, d=d -> true. listen vs silent: all 26 freq buckets zero -> true.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Different string lengths."
  },
  {
    num: 13,
    title: "Count Vowels and Consonants",
    topic: "Strings",
    statement: "Given a string, count the number of vowels and consonants in it.",
    example: "Input: \"Wipro Technologies\"\nOutput: Vowels = 6, Consonants = 11",
    approach: "Convert to lowercase. Iterate through characters; if letter, check if 'aeiou' contains it; increment vowel or consonant counter.",
    code: `public class WiproVowelsConsonants {
    public static void count(String s) {
        int vowels = 0, consonants = 0;
        s = s.toLowerCase();
        for (char c : s.toCharArray()) {
            if (c >= 'a' && c <= 'z') {
                if ("aeiou".indexOf(c) != -1) {
                    vowels++;
                } else {
                    consonants++;
                }
            }
        }
        System.out.println("Vowels: " + vowels + ", Consonants: " + consonants);
    }
    public static void main(String[] args) {
        count("Wipro Technologies"); // Vowels: 6, Consonants: 11
    }
}`,
    dryRun: "Scanning \"wipro technologies\" -> vowels: i, o, e, o, o, i, e (6); consonants: w, p, r, t, c, h, n, l, g, s (11).",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "String with numbers or symbols; string with only vowels."
  },
  {
    num: 14,
    title: "Find Character Frequencies",
    topic: "Hashing",
    statement: "Count frequency of every character in a string.",
    example: "Input: \"apple\"\nOutput: a:1, p:2, l:1, e:1",
    approach: "Array of size 256 for ASCII character counting.",
    code: `public class WiproCharFreq {
    public static void printFreq(String s) {
        int[] freq = new int[256];
        for (char c : s.toCharArray()) freq[c]++;
        for (int i = 0; i < 256; i++) {
            if (freq[i] > 0) System.out.print((char) i + ":" + freq[i] + " ");
        }
        System.out.println();
    }
    public static void main(String[] args) {
        printFreq("apple"); // a:1 e:1 l:1 p:2
    }
}`,
    dryRun: "freq['a']=1, freq['p']=2, freq['l']=1, freq['e']=1.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Spaces, symbols."
  },
  {
    num: 15,
    title: "Binary Search",
    topic: "Searching",
    statement: "Search for target in sorted array in O(log N).",
    example: "Input: arr = [2, 5, 8, 12, 16], target = 8\nOutput: 2",
    approach: "low=0, high=len-1. mid = low + (high-low)/2.",
    code: `public class WiproBinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
    public static void main(String[] args) {
        System.out.println(search(new int[]{2, 5, 8, 12, 16}, 8)); // 2
    }
}`,
    dryRun: "mid=2, arr[2]=8 -> found.",
    timeComplexity: "O(log N).",
    spaceComplexity: "O(1).",
    edgeCases: "Target not in array (-1)."
  },
  {
    num: 16,
    title: "Bubble Sort and Selection Sort",
    topic: "Sorting",
    statement: "Implement Bubble Sort and Selection Sort for an integer array.",
    example: "Input: [64, 25, 12, 22, 11]\nOutput: [11, 12, 22, 25, 64]",
    approach: "Bubble Sort: repeatedly swap adjacent inverted pairs.\nSelection Sort: repeatedly find minimum element from unsorted portion and swap it to front.",
    code: `import java.util.Arrays;

public class WiproSorting {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            int t = arr[minIdx]; arr[minIdx] = arr[i]; arr[i] = t;
        }
    }

    public static void main(String[] args) {
        int[] b = {64, 25, 12, 22, 11};
        bubbleSort(b);
        System.out.println("Bubble: " + Arrays.toString(b));

        int[] s = {64, 25, 12, 22, 11};
        selectionSort(s);
        System.out.println("Selection: " + Arrays.toString(s));
    }
}`,
    dryRun: "Both methods arrange [64, 25, 12, 22, 11] into sorted order [11, 12, 22, 25, 64].",
    timeComplexity: "Bubble: O(N^2) worst/avg, O(N) best. Selection: O(N^2).",
    spaceComplexity: "O(1) in-place.",
    edgeCases: "Already sorted array."
  },
  {
    num: 17,
    title: "Merge Two Sorted Arrays",
    topic: "Arrays",
    statement: "Merge two sorted arrays into one combined sorted array.",
    example: "Input: [1, 3, 5] and [2, 4, 6]\nOutput: [1, 2, 3, 4, 5, 6]",
    approach: "Two pointers i and j stepping through both arrays.",
    code: `import java.util.Arrays;

public class WiproMergeSorted {
    public static int[] merge(int[] a, int[] b) {
        int[] res = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) {
            res[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
        }
        while (i < a.length) res[k++] = a[i++];
        while (j < b.length) res[k++] = b[j++];
        return res;
    }
    public static void main(String[] args) {
        System.out.println(Arrays.toString(merge(new int[]{1, 3, 5}, new int[]{2, 4, 6})));
    }
}`,
    dryRun: "[1, 3, 5] + [2, 4, 6] -> [1, 2, 3, 4, 5, 6].",
    timeComplexity: "O(A + B).",
    spaceComplexity: "O(A + B).",
    edgeCases: "One array is empty."
  },
  {
    num: 18,
    title: "Maximum Subarray Sum",
    topic: "Kadane's algorithm",
    statement: "Find the maximum sum of any contiguous subarray.",
    example: "Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6",
    approach: "Kadane: curr = max(x, curr + x), max = max(max, curr).",
    code: `public class WiproKadane {
    public static int maxSubArray(int[] nums) {
        int curr = nums[0], max = nums[0];
        for (int i = 1; i < nums.length; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            max = Math.max(max, curr);
        }
        return max;
    }
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})); // 6
    }
}`,
    dryRun: "Subarray [4, -1, 2, 1] sum = 6.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "All negative numbers."
  },
  {
    num: 19,
    title: "Reverse a Linked List",
    topic: "Linked List",
    statement: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    example: "Input: 1 -> 2 -> 3 -> 4 -> null\nOutput: 4 -> 3 -> 2 -> 1 -> null",
    approach: "Three-pointer iteration: prev = null, curr = head. In loop, save next = curr.next, point curr.next = prev, advance prev = curr, curr = next. Return prev.",
    code: `public class WiproReverseLinkedList {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    public static ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        head.next.next.next = new ListNode(4);

        ListNode rev = reverseList(head);
        while (rev != null) {
            System.out.print(rev.val + " -> ");
            rev = rev.next;
        }
        System.out.println("null"); // 4 -> 3 -> 2 -> 1 -> null
    }
}`,
    dryRun: "1->2->3->4: reverses pointers one by one -> 4->3->2->1.",
    timeComplexity: "O(N) — single pass.",
    spaceComplexity: "O(1) in-place.",
    edgeCases: "head == null; single node."
  },
  {
    num: 20,
    title: "Balanced Parentheses",
    topic: "Stack",
    statement: "Given a string s containing '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    example: "Input: s = \"()[]{}\"\nOutput: true\nInput: s = \"(]\"\nOutput: false",
    approach: "Use a Stack<Character>. Push expected closing bracket when opening bracket is seen. When closing bracket is seen, verify stack is not empty and pop matches character.",
    code: `import java.util.Stack;

public class WiproBalancedParentheses {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else {
                if (stack.isEmpty() || stack.pop() != c) return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println("()[]{} is valid? " + isValid("()[]{}")); // true
        System.out.println("(] is valid? " + isValid("(]"));         // false
    }
}`,
    dryRun: "\"([{}])\": push ')', push ']', push '}'. Matches '}', ']', ')' exactly -> stack empty -> true.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N) stack.",
    edgeCases: "Starting with closing bracket; unmatched brackets."
  }
];
