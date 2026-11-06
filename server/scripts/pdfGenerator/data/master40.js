module.exports = [
  {
    num: 1,
    title: "Reverse a Number",
    topic: "Mathematics",
    statement: "Given an integer n, return the reversed number, handling negative numbers and preventing 32-bit overflow.",
    example: "Input: 1234 -> Output: 4321",
    approach: "Extract last digit using pop = n % 10, check for overflow against Integer.MAX_VALUE / 10, then rev = rev * 10 + pop.",
    code: `public class MasterReverseNumber {
    public static int reverse(int n) {
        int rev = 0;
        while (n != 0) {
            int pop = n % 10;
            n /= 10;
            if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && pop > 7)) return 0;
            if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && pop < -8)) return 0;
            rev = rev * 10 + pop;
        }
        return rev;
    }
    public static void main(String[] args) { System.out.println(reverse(1234)); }
}`,
    dryRun: "1234 -> 4321.",
    timeComplexity: "O(log10 N).",
    spaceComplexity: "O(1).",
    edgeCases: "Overflow; trailing zeros."
  },
  {
    num: 2,
    title: "Palindrome Number",
    topic: "Mathematics",
    statement: "Given an integer x, return true if x is a palindrome integer without converting to string.",
    example: "Input: 121 -> Output: true; Input: -121 -> Output: false",
    approach: "Negative numbers can never be palindromes (e.g. -121 reversed is 121-). Numbers ending in 0 (except 0 itself) cannot be palindromes. Reverse only the second half of the number: while x > revertedNumber, revertedNumber = revertedNumber * 10 + x % 10, x /= 10. Check if x == revertedNumber || x == revertedNumber / 10.",
    code: `public class PalindromeNumber {
    public static boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int rev = 0;
        while (x > rev) {
            rev = rev * 10 + x % 10;
            x /= 10;
        }
        return x == rev || x == rev / 10;
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome(121)); // true
        System.out.println(isPalindrome(-121)); // false
    }
}`,
    dryRun: "x = 121 -> rev = 1, x = 12 -> rev = 12, x = 1 -> x == rev/10 (1 == 1) -> true.",
    timeComplexity: "O(log10 N).",
    spaceComplexity: "O(1).",
    edgeCases: "0 (true); negative numbers (false); ending in 0 (false)."
  },
  {
    num: 3,
    title: "Prime Number",
    topic: "Mathematics",
    statement: "Check if n is prime in O(sqrt(N)).",
    example: "Input: 29 -> Output: true",
    approach: "Check 2 and 3, then check 6k ± 1 up to sqrt(n).",
    code: `public class MasterPrime {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;
        for (int i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) return false;
        }
        return true;
    }
    public static void main(String[] args) { System.out.println(isPrime(29)); }
}`,
    dryRun: "29 not divisible by 2, 3, 5, 7 -> prime.",
    timeComplexity: "O(sqrt(N)).",
    spaceComplexity: "O(1).",
    edgeCases: "n <= 1."
  },
  {
    num: 4,
    title: "Armstrong Number",
    topic: "Mathematics",
    statement: "Verify if n equals sum of digits raised to power of digit count.",
    example: "Input: 371 -> Output: true (27 + 343 + 1 = 371)",
    approach: "Count digits k, accumulate digit^k.",
    code: `public class MasterArmstrong {
    public static boolean isArmstrong(int n) {
        int orig = n, k = String.valueOf(n).length();
        long sum = 0, t = n;
        while (t > 0) { sum += Math.round(Math.pow(t % 10, k)); t /= 10; }
        return sum == orig;
    }
    public static void main(String[] args) { System.out.println(isArmstrong(371)); }
}`,
    dryRun: "3^3 + 7^3 + 1^3 = 27 + 343 + 1 = 371.",
    timeComplexity: "O(log10 N).",
    spaceComplexity: "O(1).",
    edgeCases: "Single digit numbers."
  },
  {
    num: 5,
    title: "Fibonacci Series",
    topic: "Mathematics",
    statement: "Generate first n Fibonacci numbers.",
    example: "Input: 5 -> Output: [0, 1, 1, 2, 3]",
    approach: "Iterative sliding window.",
    code: `public class MasterFib {
    public static long[] fib(int n) {
        long[] f = new long[n];
        if (n > 0) f[0] = 0;
        if (n > 1) f[1] = 1;
        for (int i = 2; i < n; i++) f[i] = f[i-1] + f[i-2];
        return f;
    }
    public static void main(String[] args) { System.out.println(java.util.Arrays.toString(fib(5))); }
}`,
    dryRun: "0 1 1 2 3.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "n = 1."
  },
  {
    num: 6,
    title: "GCD and LCM",
    topic: "Mathematics",
    statement: "Compute GCD and LCM of two numbers.",
    example: "Input: 12, 18 -> Output: GCD=6, LCM=36",
    approach: "Euclidean algorithm + relation LCM = (a / gcd) * b.",
    code: `public class MasterGcdLcm {
    public static long gcd(long a, long b) { return b == 0 ? a : gcd(b, a % b); }
    public static long lcm(long a, long b) { return (a / gcd(a, b)) * b; }
    public static void main(String[] args) { System.out.println("GCD: " + gcd(12, 18) + ", LCM: " + lcm(12, 18)); }
}`,
    dryRun: "gcd(12, 18) = 6, lcm = (12/6)*18 = 36.",
    timeComplexity: "O(log(min(A, B))).",
    spaceComplexity: "O(1).",
    edgeCases: "Zero input."
  },
  {
    num: 7,
    title: "Second-Largest Element",
    topic: "Arrays",
    statement: "Find second-largest distinct element in array.",
    example: "Input: [12, 35, 1, 10, 34, 1] -> Output: 34",
    approach: "Maintain largest and secondLargest in single pass.",
    code: `public class MasterSecondLargest {
    public static int secondLargest(int[] a) {
        int l = Integer.MIN_VALUE, s = Integer.MIN_VALUE;
        for (int x : a) {
            if (x > l) { s = l; l = x; }
            else if (x < l && x > s) { s = x; }
        }
        return s == Integer.MIN_VALUE ? -1 : s;
    }
    public static void main(String[] args) { System.out.println(secondLargest(new int[]{12, 35, 1, 10, 34, 1})); }
}`,
    dryRun: "34 is second-largest.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "All identical."
  },
  {
    num: 8,
    title: "Find the Missing Number",
    topic: "Arrays",
    statement: "Find missing integer in range 0 to n.",
    example: "Input: [3, 0, 1] -> Output: 2",
    approach: "XOR index with values.",
    code: `public class MasterMissing {
    public static int missingNumber(int[] nums) {
        int x = 0;
        for (int i = 0; i <= nums.length; i++) x ^= i;
        for (int num : nums) x ^= num;
        return x;
    }
    public static void main(String[] args) { System.out.println(missingNumber(new int[]{3, 0, 1})); }
}`,
    dryRun: "(0^1^2^3) ^ (3^0^1) = 2.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Missing 0."
  },
  {
    num: 9,
    title: "Find Duplicates",
    topic: "Arrays",
    statement: "Find duplicate values in array.",
    example: "Input: [4, 3, 2, 7, 8, 2, 3, 1] -> Output: [2, 3]",
    approach: "HashSet lookup for seen elements.",
    code: `import java.util.*;

public class MasterDuplicates {
    public static List<Integer> findDuplicates(int[] nums) {
        Set<Integer> seen = new HashSet<>(), dups = new LinkedHashSet<>();
        for (int x : nums) if (!seen.add(x)) dups.add(x);
        return new ArrayList<>(dups);
    }
    public static void main(String[] args) { System.out.println(findDuplicates(new int[]{4, 3, 2, 7, 8, 2, 3, 1})); }
}`,
    dryRun: "[2, 3] duplicate.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "No duplicates."
  },
  {
    num: 10,
    title: "Move Zeros to the End",
    topic: "Arrays",
    statement: "Move all zeros to end in-place.",
    example: "Input: [0, 1, 0, 3, 12] -> Output: [1, 3, 12, 0, 0]",
    approach: "Two-pointer write non-zeros to front, fill tail with zeros.",
    code: `public class MasterMoveZeros {
    public static void moveZeroes(int[] nums) {
        int p = 0;
        for (int x : nums) if (x != 0) nums[p++] = x;
        while (p < nums.length) nums[p++] = 0;
    }
    public static void main(String[] args) {
        int[] a = {0, 1, 0, 3, 12}; moveZeroes(a);
        System.out.println(java.util.Arrays.toString(a));
    }
}`,
    dryRun: "[1, 3, 12, 0, 0].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "All zeros."
  },
  {
    num: 11,
    title: "Rotate Array by K",
    topic: "Arrays",
    statement: "Rotate array to right by k steps.",
    example: "Input: [1, 2, 3, 4, 5, 6, 7], k = 3 -> Output: [5, 6, 7, 1, 2, 3, 4]",
    approach: "Reverse all, reverse 0..k-1, reverse k..n-1.",
    code: `public class MasterRotate {
    public static void rotate(int[] a, int k) {
        k %= a.length;
        rev(a, 0, a.length - 1); rev(a, 0, k - 1); rev(a, k, a.length - 1);
    }
    private static void rev(int[] a, int l, int r) {
        while (l < r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; }
    }
    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5, 6, 7}; rotate(a, 3);
        System.out.println(java.util.Arrays.toString(a));
    }
}`,
    dryRun: "[5, 6, 7, 1, 2, 3, 4].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "k = 0."
  },
  {
    num: 12,
    title: "Remove Duplicates from Sorted Array",
    topic: "Arrays",
    statement: "Remove duplicates in-place from sorted array, return unique count.",
    example: "Input: [1, 1, 2] -> Output: 2, arr = [1, 2, ...]",
    approach: "Two-pointer write.",
    code: `public class MasterRemoveDupsSorted {
    public static int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int idx = 0;
        for (int i = 1; i < nums.length; i++) if (nums[i] != nums[idx]) nums[++idx] = nums[i];
        return idx + 1;
    }
    public static void main(String[] args) {
        int[] a = {1, 1, 2};
        System.out.println(removeDuplicates(a)); // 2
    }
}`,
    dryRun: "Unique count 2.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Single element."
  },
  {
    num: 13,
    title: "Two Sum",
    topic: "Hashing",
    statement: "Return indices of two elements adding up to target.",
    example: "Input: nums = [2, 7, 11, 15], target = 9 -> Output: [0, 1]",
    approach: "HashMap complement lookup.",
    code: `import java.util.*;

public class MasterTwoSum {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int c = target - nums[i];
            if (map.containsKey(c)) return new int[]{map.get(c), i};
            map.put(nums[i], i);
        }
        return new int[0];
    }
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9))); // [0, 1]
    }
}`,
    dryRun: "Complement found at index 0.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Negative values."
  },
  {
    num: 14,
    title: "Maximum Subarray Sum",
    topic: "Kadane's algorithm",
    statement: "Find largest contiguous subarray sum.",
    example: "Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4] -> Output: 6",
    approach: "Kadane's algorithm.",
    code: `public class MasterKadane {
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
    dryRun: "Max sum is 6.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "All negative."
  },
  {
    num: 15,
    title: "Sort 0s, 1s and 2s",
    topic: "Two pointers",
    statement: "Sort array of 0, 1, 2 in-place in O(N).",
    example: "Input: [2, 0, 2, 1, 1, 0] -> Output: [0, 0, 1, 1, 2, 2]",
    approach: "Dutch National Flag (low, mid, high).",
    code: `public class MasterSortColors {
    public static void sortColors(int[] a) {
        int l = 0, m = 0, h = a.length - 1;
        while (m <= h) {
            if (a[m] == 0) { int t = a[l]; a[l++] = a[m]; a[m++] = t; }
            else if (a[m] == 1) m++;
            else { int t = a[m]; a[m] = a[h]; a[h--] = t; }
        }
    }
    public static void main(String[] args) {
        int[] a = {2, 0, 2, 1, 1, 0}; sortColors(a);
        System.out.println(java.util.Arrays.toString(a));
    }
}`,
    dryRun: "[0, 0, 1, 1, 2, 2].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Already sorted."
  },
  {
    num: 16,
    title: "Merge Two Sorted Arrays",
    topic: "Arrays",
    statement: "Merge two sorted arrays into one.",
    example: "Input: [1, 2, 3] and [2, 5, 6] -> Output: [1, 2, 2, 3, 5, 6]",
    approach: "Two pointers stepping through arrays.",
    code: `public class MasterMergeSorted {
    public static int[] merge(int[] a, int[] b) {
        int[] res = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) res[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
        while (i < a.length) res[k++] = a[i++];
        while (j < b.length) res[k++] = b[j++];
        return res;
    }
    public static void main(String[] args) {
        System.out.println(java.util.Arrays.toString(merge(new int[]{1, 2, 3}, new int[]{2, 5, 6})));
    }
}`,
    dryRun: "[1, 2, 2, 3, 5, 6].",
    timeComplexity: "O(A + B).",
    spaceComplexity: "O(A + B).",
    edgeCases: "Empty array."
  },
  {
    num: 17,
    title: "Check If Array is Sorted",
    topic: "Arrays",
    statement: "Return true if array is non-decreasing.",
    example: "Input: [1, 2, 3, 4, 5] -> Output: true",
    approach: "Linear scan verifying arr[i] <= arr[i+1].",
    code: `public class MasterCheckSorted {
    public static boolean isSorted(int[] a) {
        for (int i = 0; i < a.length - 1; i++) if (a[i] > a[i + 1]) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isSorted(new int[]{1, 2, 3, 4, 5})); // true
    }
}`,
    dryRun: "All adjacent elements in order.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Length 0 or 1."
  },
  {
    num: 18,
    title: "Reverse a String",
    topic: "Strings",
    statement: "Reverse characters of string in-place on char array.",
    example: "Input: \"hello\" -> Output: \"olleh\"",
    approach: "Two-pointer swap.",
    code: `public class MasterRevString {
    public static String reverse(String s) {
        char[] ca = s.toCharArray();
        int l = 0, r = ca.length - 1;
        while (l < r) { char t = ca[l]; ca[l++] = ca[r]; ca[r--] = t; }
        return new String(ca);
    }
    public static void main(String[] args) { System.out.println(reverse("hello")); }
}`,
    dryRun: "\"hello\" -> \"olleh\".",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Single char."
  },
  {
    num: 19,
    title: "Check Anagrams",
    topic: "Strings",
    statement: "Determine if two strings are anagrams.",
    example: "Input: \"listen\", \"silent\" -> Output: true",
    approach: "26 bucket frequency check.",
    code: `public class MasterAnagram {
    public static boolean isAnagram(String a, String b) {
        if (a.length() != b.length()) return false;
        int[] f = new int[26];
        for (int i = 0; i < a.length(); i++) {
            f[a.charAt(i) - 'a']++; f[b.charAt(i) - 'a']--;
        }
        for (int x : f) if (x != 0) return false;
        return true;
    }
    public static void main(String[] args) { System.out.println(isAnagram("listen", "silent")); }
}`,
    dryRun: "Counts match.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Lengths differ."
  },
  {
    num: 20,
    title: "Reverse Words in a Sentence",
    topic: "Strings",
    statement: "Reverse word sequence in sentence.",
    example: "Input: \"the sky is blue\" -> Output: \"blue is sky the\"",
    approach: "Split by space, traverse in reverse.",
    code: `public class MasterReverseWords {
    public static String reverseWords(String s) {
        String[] w = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = w.length - 1; i >= 0; i--) sb.append(w[i]).append(i == 0 ? "" : " ");
        return sb.toString();
    }
    public static void main(String[] args) { System.out.println(reverseWords("the sky is blue")); }
}`,
    dryRun: "Words reversed.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Multiple spaces."
  },
  {
    num: 21,
    title: "Count Character Frequencies",
    topic: "Hashing",
    statement: "Count frequency of every character.",
    example: "Input: \"banana\" -> Output: b:1, a:3, n:2",
    approach: "LinkedHashMap for order preservation.",
    code: `import java.util.*;

public class MasterCharFreq {
    public static void printFreq(String s) {
        Map<Character, Integer> m = new LinkedHashMap<>();
        for (char c : s.toCharArray()) m.put(c, m.getOrDefault(c, 0) + 1);
        for (Map.Entry<Character, Integer> e : m.entrySet()) System.out.print(e.getKey() + ":" + e.getValue() + " ");
        System.out.println();
    }
    public static void main(String[] args) { printFreq("banana"); }
}`,
    dryRun: "b:1 a:3 n:2.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(K).",
    edgeCases: "Special chars."
  },
  {
    num: 22,
    title: "First Non-Repeating Character",
    topic: "Hashing",
    statement: "Find index of first unique character in string.",
    example: "Input: \"leetcode\" -> Output: 0 ('l')",
    approach: "Frequency count array + second scan.",
    code: `public class MasterFirstUnique {
    public static int firstUniqChar(String s) {
        int[] f = new int[26];
        for (char c : s.toCharArray()) f[c - 'a']++;
        for (int i = 0; i < s.length(); i++) if (f[s.charAt(i) - 'a'] == 1) return i;
        return -1;
    }
    public static void main(String[] args) { System.out.println(firstUniqChar("leetcode")); } // 0
}`,
    dryRun: "'l' has frequency 1 at index 0.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "No unique characters."
  },
  {
    num: 23,
    title: "Longest Common Prefix",
    topic: "Strings",
    statement: "Find longest common prefix among array of strings.",
    example: "Input: [\"flower\", \"flow\", \"flight\"] -> Output: \"fl\"",
    approach: "Horizontal scanning trimming prefix.",
    code: `public class MasterLCP {
    public static String longestCommonPrefix(String[] strs) {
        if (strs.length == 0) return "";
        String p = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (strs[i].indexOf(p) != 0) {
                p = p.substring(0, p.length() - 1);
                if (p.isEmpty()) return "";
            }
        }
        return p;
    }
    public static void main(String[] args) { System.out.println(longestCommonPrefix(new String[]{"flower", "flow", "flight"})); }
}`,
    dryRun: "\"flower\" -> \"flow\" -> \"fl\".",
    timeComplexity: "O(S).",
    spaceComplexity: "O(1).",
    edgeCases: "No common prefix."
  },
  {
    num: 24,
    title: "Binary Search",
    topic: "Searching",
    statement: "Search sorted array in O(log N).",
    example: "Input: [-1, 0, 3, 5, 9, 12], target = 9 -> Output: 4",
    approach: "Divide and conquer mid calculation.",
    code: `public class MasterBinarySearch {
    public static int search(int[] a, int t) {
        int l = 0, h = a.length - 1;
        while (l <= h) {
            int m = l + (h - l) / 2;
            if (a[m] == t) return m;
            if (a[m] < t) l = m + 1; else h = m - 1;
        }
        return -1;
    }
    public static void main(String[] args) { System.out.println(search(new int[]{-1, 0, 3, 5, 9, 12}, 9)); } // 4
}`,
    dryRun: "Binary search finds 9 at index 4.",
    timeComplexity: "O(log N).",
    spaceComplexity: "O(1).",
    edgeCases: "Not found."
  },
  {
    num: 25,
    title: "First and Last Occurrence of Element in Sorted Array",
    topic: "Binary Search",
    statement: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value in O(log N) time. If target is not found, return [-1, -1].",
    example: "Input: nums = [5, 7, 7, 8, 8, 10], target = 8\nOutput: [3, 4]",
    approach: "Two Binary Searches:\n1. findBound(nums, target, true): When nums[mid] == target, save mid as candidate and search LEFT (high = mid - 1) to find first occurrence.\n2. findBound(nums, target, false): When nums[mid] == target, save mid as candidate and search RIGHT (low = mid + 1) to find last occurrence.",
    code: `import java.util.Arrays;

public class FirstAndLastOccurrence {
    public static int[] searchRange(int[] nums, int target) {
        int first = findBound(nums, target, true);
        if (first == -1) return new int[]{-1, -1};
        int last = findBound(nums, target, false);
        return new int[]{first, last};
    }

    private static int findBound(int[] nums, int target, boolean isFirst) {
        int low = 0, high = nums.length - 1;
        int ans = -1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) {
                ans = mid;
                if (isFirst) high = mid - 1; // Keep searching left
                else low = mid + 1;         // Keep searching right
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return ans;
    }

    public static void main(String[] args) {
        int[] nums = {5, 7, 7, 8, 8, 10};
        System.out.println("Range: " + Arrays.toString(searchRange(nums, 8))); // [3, 4]
    }
}`,
    dryRun: "target 8: first binary search stops at index 3; second stops at index 4 -> [3, 4].",
    timeComplexity: "O(log N) — two logarithmic passes.",
    spaceComplexity: "O(1) extra space.",
    edgeCases: "Target not present [-1, -1]; target occurs once [i, i]; all elements match target [0, n-1]."
  },
  {
    num: 26,
    title: "Merge Sort",
    topic: "Sorting",
    statement: "Implement Merge Sort.",
    example: "Input: [12, 11, 13, 5, 6, 7] -> Output: [5, 6, 7, 11, 12, 13]",
    approach: "Divide at mid, conquer recursively, merge with buffer.",
    code: `public class MasterMergeSort {
    public static void sort(int[] a, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(a, l, m); sort(a, m + 1, r);
            merge(a, l, m, r);
        }
    }
    private static void merge(int[] a, int l, int m, int r) {
        int[] t = new int[r - l + 1];
        int i = l, j = m + 1, k = 0;
        while (i <= m && j <= r) t[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i <= m) t[k++] = a[i++];
        while (j <= r) t[k++] = a[j++];
        for (int p = 0; p < t.length; p++) a[l + p] = t[p];
    }
    public static void main(String[] args) {
        int[] a = {12, 11, 13, 5, 6, 7}; sort(a, 0, a.length - 1);
        System.out.println(java.util.Arrays.toString(a));
    }
}`,
    dryRun: "Sorted to [5, 6, 7, 11, 12, 13].",
    timeComplexity: "O(N log N).",
    spaceComplexity: "O(N).",
    edgeCases: "Single element."
  },
  {
    num: 27,
    title: "Reverse a Linked List",
    topic: "Linked List",
    statement: "Reverse singly linked list in O(1) space.",
    example: "Input: 1 -> 2 -> 3 -> null -> Output: 3 -> 2 -> 1 -> null",
    approach: "Pointer reversal (prev, curr, next).",
    code: `public class MasterReverseLL {
    static class Node { int v; Node n; Node(int v) { this.v = v; } }
    public static Node reverse(Node h) {
        Node p = null, c = h;
        while (c != null) { Node next = c.n; c.n = p; p = c; c = next; }
        return p;
    }
    public static void main(String[] args) {
        Node h = new Node(1); h.n = new Node(2); h.n.n = new Node(3);
        Node r = reverse(h);
        while (r != null) { System.out.print(r.v + " "); r = r.n; } // 3 2 1
    }
}`,
    dryRun: "Reversed.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Empty list."
  },
  {
    num: 28,
    title: "Find Middle of Linked List",
    topic: "Linked List",
    statement: "Return middle node of linked list.",
    example: "Input: 1 -> 2 -> 3 -> 4 -> 5 -> Output: 3",
    approach: "Tortoise and Hare fast/slow pointers.",
    code: `public class MasterMiddleLL {
    static class Node { int v; Node n; Node(int v) { this.v = v; } }
    public static Node middle(Node h) {
        Node s = h, f = h;
        while (f != null && f.n != null) { s = s.n; f = f.n.n; }
        return s;
    }
    public static void main(String[] args) {
        Node h = new Node(1); h.n = new Node(2); h.n.n = new Node(3);
        System.out.println(middle(h).v); // 2
    }
}`,
    dryRun: "Middle node found.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Even number of nodes."
  },
  {
    num: 29,
    title: "Detect Linked-List Cycle",
    topic: "Linked List",
    statement: "Determine if linked list has a cycle.",
    example: "Input: 3 -> 2 -> 0 -> -4 (connects back to 2) -> Output: true",
    approach: "Floyd's cycle detection (slow advances 1, fast advances 2).",
    code: `public class MasterDetectCycle {
    static class Node { int v; Node n; Node(int v) { this.v = v; } }
    public static boolean hasCycle(Node h) {
        Node s = h, f = h;
        while (f != null && f.n != null) {
            s = s.n; f = f.n.n;
            if (s == f) return true;
        }
        return false;
    }
    public static void main(String[] args) {
        Node h = new Node(1); h.n = new Node(2); h.n.n = h;
        System.out.println(hasCycle(h)); // true
    }
}`,
    dryRun: "Fast catches slow -> true.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "No cycle."
  },
  {
    num: 30,
    title: "Valid Parentheses",
    topic: "Stack",
    statement: "Verify bracket nesting and closing.",
    example: "Input: \"()[]{}\" -> Output: true",
    approach: "Stack push closing counterparts.",
    code: `import java.util.Stack;

public class MasterValidParens {
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
    public static void main(String[] args) { System.out.println(isValid("()[]{}")); }
}`,
    dryRun: "Valid.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Mismatched."
  },
  {
    num: 31,
    title: "Next Greater Element",
    topic: "Monotonic Stack",
    statement: "Find first greater element to right.",
    example: "Input: [4, 5, 2, 25] -> Output: [5, 25, 25, -1]",
    approach: "Monotonic stack right to left.",
    code: `import java.util.*;

public class MasterNGE {
    public static int[] nge(int[] a) {
        int[] res = new int[a.length];
        Stack<Integer> st = new Stack<>();
        for (int i = a.length - 1; i >= 0; i--) {
            while (!st.isEmpty() && st.peek() <= a[i]) st.pop();
            res[i] = st.isEmpty() ? -1 : st.peek();
            st.push(a[i]);
        }
        return res;
    }
    public static void main(String[] args) { System.out.println(Arrays.toString(nge(new int[]{4, 5, 2, 25}))); }
}`,
    dryRun: "[5, 25, 25, -1].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Decreasing sequence."
  },
  {
    num: 32,
    title: "Implement Stack Using Queues",
    topic: "Queue / Stack",
    statement: "Implement a last-in-first-out (LIFO) stack using only standard Queue operations (offer, poll, peek, isEmpty).",
    example: "MyStack s = new MyStack(); s.push(1); s.push(2); s.top(); // 2; s.pop(); // 2",
    approach: "Single Queue Approach:\nWhen pushing an element x into queue q:\n1. Note current size = q.size().\n2. Add x to q.\n3. Rotate the preceding 'size' elements by dequeuing and enqueuing them back behind x. Now x is at the front of the queue, ready for O(1) pop and top!",
    code: `import java.util.LinkedList;
import java.util.Queue;

public class StackUsingQueues {
    static class MyStack {
        private Queue<Integer> q = new LinkedList<>();

        public void push(int x) {
            int size = q.size();
            q.add(x);
            for (int i = 0; i < size; i++) {
                q.add(q.poll());
            }
        }

        public int pop() { return q.poll(); }
        public int top() { return q.peek(); }
        public boolean empty() { return q.isEmpty(); }
    }

    public static void main(String[] args) {
        MyStack st = new MyStack();
        st.push(1); st.push(2);
        System.out.println("Top: " + st.top()); // 2
        System.out.println("Pop: " + st.pop()); // 2
        System.out.println("Empty? " + st.empty()); // false
    }
}`,
    dryRun: "push(1): q=[1]. push(2): q=[1, 2] -> rotate 1: q=[2, 1]. pop() yields 2 (LIFO).",
    timeComplexity: "push: O(N); pop/top/empty: O(1).",
    spaceComplexity: "O(N) memory.",
    edgeCases: "Single element."
  },
  {
    num: 33,
    title: "Implement Queue Using Stacks",
    topic: "Queue / Stack",
    statement: "Implement FIFO queue using two stacks.",
    example: "push(1), push(2), pop() -> 1",
    approach: "In-stack and out-stack with amortized O(1) transfer.",
    code: `import java.util.Stack;

public class MasterQueueUsingStacks {
    static class Queue {
        Stack<Integer> in = new Stack<>(), out = new Stack<>();
        void push(int x) { in.push(x); }
        int pop() { peek(); return out.pop(); }
        int peek() {
            if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop());
            return out.peek();
        }
    }
    public static void main(String[] args) {
        Queue q = new Queue(); q.push(1); q.push(2);
        System.out.println(q.pop()); // 1
    }
}`,
    dryRun: "Elements reversed on transfer giving FIFO.",
    timeComplexity: "Amortized O(1).",
    spaceComplexity: "O(N).",
    edgeCases: "Empty queue."
  },
  {
    num: 34,
    title: "Binary Tree Traversals",
    topic: "Binary Trees",
    statement: "Implement Inorder, Preorder, and Postorder tree traversals.",
    example: "Inorder: Left Root Right; Preorder: Root Left Right; Postorder: Left Right Root",
    approach: "Recursive DFS tree functions.",
    code: `public class MasterTreeTraversals {
    static class Node { int v; Node l, r; Node(int v) { this.v = v; } }
    public static void inorder(Node root) {
        if (root == null) return;
        inorder(root.l); System.out.print(root.v + " "); inorder(root.r);
    }
    public static void main(String[] args) {
        Node r = new Node(1); r.r = new Node(2); r.r.l = new Node(3);
        System.out.print("Inorder: "); inorder(r); System.out.println(); // 1 3 2
    }
}`,
    dryRun: "Traversals execute recursively.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(H).",
    edgeCases: "null tree."
  },
  {
    num: 35,
    title: "Height of Binary Tree",
    topic: "Binary Trees",
    statement: "Compute maximum depth of binary tree.",
    example: "Input: tree of 3 levels -> Output: 3",
    approach: "height(root) = 1 + max(height(l), height(r)).",
    code: `public class MasterTreeHeight {
    static class Node { int v; Node l, r; Node(int v) { this.v = v; } }
    public static int height(Node root) {
        if (root == null) return 0;
        return 1 + Math.max(height(root.l), height(root.r));
    }
    public static void main(String[] args) {
        Node r = new Node(1); r.l = new Node(2); r.r = new Node(3);
        System.out.println("Height: " + height(r)); // 2
    }
}`,
    dryRun: "1 + max(1, 1) = 2.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(H).",
    edgeCases: "Empty tree."
  },
  {
    num: 36,
    title: "BFS and DFS",
    topic: "Graphs",
    statement: "Implement graph BFS using Queue and DFS using recursion.",
    example: "BFS: level order; DFS: deep branch exploration.",
    approach: "Queue + visited array for BFS; recursion + visited for DFS.",
    code: `import java.util.*;

public class MasterGraphBFSDFS {
    public static void bfs(int s, List<List<Integer>> adj, int V) {
        boolean[] vis = new boolean[V];
        Queue<Integer> q = new LinkedList<>();
        vis[s] = true; q.add(s);
        System.out.print("BFS: ");
        while (!q.isEmpty()) {
            int u = q.poll(); System.out.print(u + " ");
            for (int v : adj.get(u)) if (!vis[v]) { vis[v] = true; q.add(v); }
        }
        System.out.println();
    }
    public static void main(String[] args) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < 3; i++) adj.add(new ArrayList<>());
        adj.get(0).add(1); adj.get(1).add(2);
        bfs(0, adj, 3); // 0 1 2
    }
}`,
    dryRun: "Queue visits layers.",
    timeComplexity: "O(V + E).",
    spaceComplexity: "O(V).",
    edgeCases: "Disconnected."
  },
  {
    num: 37,
    title: "Climbing Stairs",
    topic: "Dynamic Programming",
    statement: "Count distinct ways to climb n stairs taking 1 or 2 steps.",
    example: "Input: 3 -> Output: 3 (1+1+1, 1+2, 2+1)",
    approach: "Fibonacci recurrence in O(N) time and O(1) space.",
    code: `public class MasterClimbingStairs {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
        return b;
    }
    public static void main(String[] args) { System.out.println(climbStairs(3)); } // 3
}`,
    dryRun: "n=3 -> 3.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "n = 1."
  },
  {
    num: 38,
    title: "Best Time to Buy and Sell Stock",
    topic: "Greedy",
    statement: "Find maximum profit from 1 buy and 1 sell.",
    example: "Input: [7, 1, 5, 3, 6, 4] -> Output: 5",
    approach: "Single pass tracking minimum price and maximum profit.",
    code: `public class MasterStock {
    public static int maxProfit(int[] p) {
        int min = Integer.MAX_VALUE, max = 0;
        for (int x : p) {
            if (x < min) min = x;
            else if (x - min > max) max = x - min;
        }
        return max;
    }
    public static void main(String[] args) { System.out.println(maxProfit(new int[]{7, 1, 5, 3, 6, 4})); } // 5
}`,
    dryRun: "Buy at 1, sell at 6 = 5.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Decreasing prices."
  },
  {
    num: 39,
    title: "Coin Change",
    topic: "Dynamic Programming",
    statement: "Find minimum coins to make amount.",
    example: "Input: [1, 2, 5], amount = 11 -> Output: 3",
    approach: "1D DP: dp[i] = min(dp[i], 1 + dp[i-c]).",
    code: `import java.util.Arrays;

public class MasterCoinChange {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) if (c <= i) dp[i] = Math.min(dp[i], 1 + dp[i - c]);
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
    public static void main(String[] args) { System.out.println(coinChange(new int[]{1, 2, 5}, 11)); } // 3
}`,
    dryRun: "3 coins.",
    timeComplexity: "O(amount * coins.length).",
    spaceComplexity: "O(amount).",
    edgeCases: "amount = 0."
  },
  {
    num: 40,
    title: "Longest Common Subsequence",
    topic: "Dynamic Programming",
    statement: "Compute length of longest common subsequence between two strings.",
    example: "Input: \"abcde\", \"ace\" -> Output: 3",
    approach: "2D DP matrix table.",
    code: `public class MasterLCS {
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
    public static void main(String[] args) { System.out.println(lcs("abcde", "ace")); } // 3
}`,
    dryRun: "\"ace\" of length 3.",
    timeComplexity: "O(M * N).",
    spaceComplexity: "O(M * N).",
    edgeCases: "Empty strings."
  }
];
