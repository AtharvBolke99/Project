module.exports = [
  {
    num: 1,
    title: "Second-Largest Element in an Array",
    topic: "Arrays",
    statement: "Given an array of integers, find the second-largest distinct element in the array. If no distinct second-largest element exists (e.g., all elements are identical or array size is less than 2), return -1.",
    example: "Input: arr = [12, 35, 1, 10, 34, 1]\nOutput: 34\nExplanation: The largest element is 35 and the second-largest is 34.",
    approach: "Maintain two variables: 'largest' and 'secondLargest', initialized to Integer.MIN_VALUE. Iterate through the array once (single-pass O(N)): if current element is strictly greater than 'largest', update secondLargest = largest, then largest = element. Otherwise, if element is strictly less than largest but greater than secondLargest, update secondLargest = element. This eliminates the need for sorting (O(N log N)).",
    code: `import java.util.*;

public class SecondLargest {
    public static int findSecondLargest(int[] arr) {
        if (arr == null || arr.length < 2) return -1;
        int largest = Integer.MIN_VALUE;
        int secondLargest = Integer.MIN_VALUE;

        for (int num : arr) {
            if (num > largest) {
                secondLargest = largest;
                largest = num;
            } else if (num < largest && num > secondLargest) {
                secondLargest = num;
            }
        }
        return (secondLargest == Integer.MIN_VALUE) ? -1 : secondLargest;
    }

    public static void main(String[] args) {
        int[] arr = {12, 35, 1, 10, 34, 1};
        System.out.println("Second Largest: " + findSecondLargest(arr)); // Output: 34
    }
}`,
    dryRun: "arr = [12, 35, 1, 10, 34, 1]\n1. num=12: 12 > MIN -> second=MIN, largest=12\n2. num=35: 35 > 12 -> second=12, largest=35\n3. num=1: 1 < 35 and 1 < 12 -> no change\n4. num=10: 10 < 35 and 10 < 12 -> no change\n5. num=34: 34 < 35 and 34 > 12 -> second=34\n6. num=1: no change.\nResult: 34",
    timeComplexity: "O(N) — single traversal over the array of size N.",
    spaceComplexity: "O(1) — constant extra space using only two integer pointers.",
    edgeCases: "Empty array or array of length 1 (returns -1); all elements equal like [10, 10, 10] (returns -1); negative numbers array like [-5, -2, -8] (correctly identifies -5)."
  },
  {
    num: 2,
    title: "Find the Missing Number",
    topic: "Arrays",
    statement: "Given an array containing n distinct numbers taken from the range 0 to n (or 1 to n+1), find the one number that is missing from the range.",
    example: "Input: nums = [3, 0, 1] (n = 3, range [0, 3])\nOutput: 2\nExplanation: Range has length 3: {0, 1, 2, 3}. 2 is missing.",
    approach: "Use XOR bitwise operation. We know that a ^ a = 0 and a ^ 0 = a. XOR all indices from 0 to n, and XOR all array values. All matching values cancel out, leaving the missing number. Alternatively, use Gauss' summation formula sum = n*(n+1)/2 and subtract array sum, though XOR prevents potential integer overflow with large inputs.",
    code: `public class MissingNumber {
    public static int findMissing(int[] nums) {
        int n = nums.length;
        int xorVal = 0;
        // XOR all numbers from 0 to n
        for (int i = 0; i <= n; i++) {
            xorVal ^= i;
        }
        // XOR all elements in the array
        for (int num : nums) {
            xorVal ^= num;
        }
        return xorVal;
    }

    public static void main(String[] args) {
        int[] nums = {3, 0, 1};
        System.out.println("Missing Number: " + findMissing(nums)); // Output: 2
    }
}`,
    dryRun: "nums = [3, 0, 1], n = 3\nxorVal = (0 ^ 1 ^ 2 ^ 3) ^ (3 ^ 0 ^ 1)\nRearranging: (0 ^ 0) ^ (1 ^ 1) ^ (3 ^ 3) ^ 2 = 0 ^ 0 ^ 0 ^ 2 = 2.",
    timeComplexity: "O(N) — single linear pass to compute XOR values.",
    spaceComplexity: "O(1) — only one accumulator variable used.",
    edgeCases: "Missing 0 at the start [1, 2, 3]; missing n at the end [0, 1, 2]; single element array [0] (missing 1) or [1] (missing 0)."
  },
  {
    num: 3,
    title: "Move Zeros to the End",
    topic: "Arrays",
    statement: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. Must be done in-place without copying the array.",
    example: "Input: nums = [0, 1, 0, 3, 12]\nOutput: [1, 3, 12, 0, 0]",
    approach: "Use a two-pointer technique. Let 'insertPos' track the position where the next non-zero element should be placed. Traverse the array with pointer 'i'. Whenever nums[i] != 0, swap nums[insertPos] and nums[i], then increment insertPos. This keeps all non-zero elements in order and shifts zeros to the tail.",
    code: `import java.util.Arrays;

public class MoveZeros {
    public static void moveZeroes(int[] nums) {
        if (nums == null || nums.length <= 1) return;
        int insertPos = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                // Swap non-zero element to insertPos
                int temp = nums[insertPos];
                nums[insertPos] = nums[i];
                nums[i] = temp;
                insertPos++;
            }
        }
    }

    public static void main(String[] args) {
        int[] nums = {0, 1, 0, 3, 12};
        moveZeroes(nums);
        System.out.println("Modified: " + Arrays.toString(nums)); // [1, 3, 12, 0, 0]
    }
}`,
    dryRun: "nums = [0, 1, 0, 3, 12], insertPos = 0\n- i=0: nums[0]=0, skip\n- i=1: nums[1]=1 != 0, swap nums[0] & nums[1] -> [1, 0, 0, 3, 12], insertPos=1\n- i=2: nums[2]=0, skip\n- i=3: nums[3]=3 != 0, swap nums[1] & nums[3] -> [1, 3, 0, 0, 12], insertPos=2\n- i=4: nums[4]=12 != 0, swap nums[2] & nums[4] -> [1, 3, 12, 0, 0], insertPos=3.\nResult: [1, 3, 12, 0, 0]",
    timeComplexity: "O(N) — single pass through the array.",
    spaceComplexity: "O(1) — in-place modification with no extra array allocation.",
    edgeCases: "Array with no zeros [1, 2, 3]; array with all zeros [0, 0, 0]; single element [0]; zeros already at the end [1, 2, 0, 0]."
  },
  {
    num: 4,
    title: "Rotate an Array by K Positions",
    topic: "Arrays",
    statement: "Given an array, rotate the array to the right by k steps, where k is non-negative.",
    example: "Input: nums = [1, 2, 3, 4, 5, 6, 7], k = 3\nOutput: [5, 6, 7, 1, 2, 3, 4]",
    approach: "Three-step reversal algorithm:\n1. Normalize k: k = k % n.\n2. Reverse the entire array.\n3. Reverse the first k elements (index 0 to k-1).\n4. Reverse the remaining n-k elements (index k to n-1).\nThis achieves rotation in O(N) time and O(1) auxiliary space without buffer memory.",
    code: `import java.util.Arrays;

public class RotateArray {
    public static void rotate(int[] nums, int k) {
        if (nums == null || nums.length <= 1) return;
        int n = nums.length;
        k = k % n;
        if (k == 0) return;

        reverse(nums, 0, n - 1); // 1. Reverse all
        reverse(nums, 0, k - 1); // 2. Reverse first k
        reverse(nums, k, n - 1); // 3. Reverse rest
    }

    private static void reverse(int[] nums, int left, int right) {
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 4, 5, 6, 7};
        rotate(nums, 3);
        System.out.println("Rotated: " + Arrays.toString(nums)); // [5, 6, 7, 1, 2, 3, 4]
    }
}`,
    dryRun: "nums = [1, 2, 3, 4, 5, 6, 7], k = 3\n1. Reverse all: [7, 6, 5, 4, 3, 2, 1]\n2. Reverse 0 to 2: [5, 6, 7, 4, 3, 2, 1]\n3. Reverse 3 to 6: [5, 6, 7, 1, 2, 3, 4]\nFinal output: [5, 6, 7, 1, 2, 3, 4]",
    timeComplexity: "O(N) — each element is swapped twice.",
    spaceComplexity: "O(1) — in-place memory reversal.",
    edgeCases: "k = 0 or k = n (no change needed); k > n (handled by k % n); single element array [10]."
  },
  {
    num: 5,
    title: "Find Duplicate Elements in an Array",
    topic: "Arrays",
    statement: "Given an array of integers, find all duplicate elements that appear more than once in the array.",
    example: "Input: arr = [4, 3, 2, 7, 8, 2, 3, 1]\nOutput: [2, 3]",
    approach: "Use a HashSet to record numbers seen so far. As we iterate through each element, if the set already contains the element, add it to our duplicate result list. Alternatively, if elements are guaranteed to be in range [1, n], we can use element sign-negation in O(1) space.",
    code: `import java.util.*;

public class FindDuplicates {
    public static List<Integer> findDuplicates(int[] nums) {
        List<Integer> duplicates = new ArrayList<>();
        Set<Integer> seen = new HashSet<>();
        Set<Integer> added = new HashSet<>();

        for (int num : nums) {
            if (seen.contains(num)) {
                if (!added.contains(num)) {
                    duplicates.add(num);
                    added.add(num);
                }
            } else {
                seen.add(num);
            }
        }
        return duplicates;
    }

    public static void main(String[] args) {
        int[] arr = {4, 3, 2, 7, 8, 2, 3, 1};
        System.out.println("Duplicates: " + findDuplicates(arr)); // [2, 3]
    }
}`,
    dryRun: "nums = [4, 3, 2, 7, 8, 2, 3, 1]\n- seen={4, 3, 2, 7, 8}\n- next is 2: already in seen! Add 2 to duplicates.\n- next is 3: already in seen! Add 3 to duplicates.\n- next is 1: seen={4,3,2,7,8,1}.\nDuplicates list: [2, 3].",
    timeComplexity: "O(N) — linear scan with O(1) average lookup in HashSet.",
    spaceComplexity: "O(N) — hash sets storing up to N distinct elements.",
    edgeCases: "No duplicates [1, 2, 3, 4] (returns empty list); all identical elements [5, 5, 5, 5] (returns [5]); negative numbers handled properly."
  },
  {
    num: 6,
    title: "Reverse a Number",
    topic: "Mathematics",
    statement: "Given a 32-bit signed integer n, reverse its digits. If reversing causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], return 0.",
    example: "Input: n = 12345\nOutput: 54321\nInput: n = -123\nOutput: -321",
    approach: "Extract the last digit using modulo 10 (int pop = n % 10), then append it to the reversed number by multiplying previous result by 10 (rev = rev * 10 + pop). Before multiplying by 10, check for 32-bit overflow against Integer.MAX_VALUE / 10 and Integer.MIN_VALUE / 10.",
    code: `public class ReverseNumber {
    public static int reverse(int n) {
        int rev = 0;
        while (n != 0) {
            int pop = n % 10;
            n /= 10;
            // Check overflow before updating rev
            if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && pop > 7)) return 0;
            if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && pop < -8)) return 0;
            rev = rev * 10 + pop;
        }
        return rev;
    }

    public static void main(String[] args) {
        System.out.println("Reverse 12345: " + reverse(12345)); // 54321
        System.out.println("Reverse -123: " + reverse(-123));   // -321
    }
}`,
    dryRun: "n = 12345\n- pop=5, n=1234, rev=5\n- pop=4, n=123, rev=54\n- pop=3, n=12, rev=543\n- pop=2, n=1, rev=5432\n- pop=1, n=0, rev=54321. Done.",
    timeComplexity: "O(log10(N)) — number of digits in N, at most 10 iterations for 32-bit integer.",
    spaceComplexity: "O(1) — strictly constant extra space.",
    edgeCases: "Number ending with zero (120 -> 21); single-digit number (7 -> 7); negative numbers; overflow cases like 1534236469."
  },
  {
    num: 7,
    title: "Check Armstrong Number",
    topic: "Mathematics",
    statement: "An Armstrong number (narcissistic number) of order k is a number equal to the sum of its own digits each raised to the power of k, where k is the number of digits in n.",
    example: "Input: n = 153\nOutput: true\nExplanation: 153 has 3 digits. 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153.",
    approach: "1. Count the number of digits k in the given integer.\n2. In a loop, extract each digit using modulo 10 and compute Math.pow(digit, k).\n3. Sum these powered values and verify if total sum equals the original number.",
    code: `public class ArmstrongNumber {
    public static boolean isArmstrong(int n) {
        if (n < 0) return false;
        int original = n;
        int k = String.valueOf(n).length();
        long sum = 0;

        int temp = n;
        while (temp > 0) {
            int digit = temp % 10;
            sum += Math.round(Math.pow(digit, k));
            temp /= 10;
        }
        return sum == original;
    }

    public static void main(String[] args) {
        System.out.println("153 is Armstrong? " + isArmstrong(153)); // true
        System.out.println("370 is Armstrong? " + isArmstrong(370)); // true
        System.out.println("123 is Armstrong? " + isArmstrong(123)); // false
    }
}`,
    dryRun: "n = 153, k = 3\n- digit 3: 3^3 = 27, sum = 27\n- digit 5: 5^3 = 125, sum = 27 + 125 = 152\n- digit 1: 1^3 = 1, sum = 152 + 1 = 153\nsum (153) == original (153) -> true.",
    timeComplexity: "O(log10(N)) — proportional to the number of digits.",
    spaceComplexity: "O(1) — constant auxiliary space.",
    edgeCases: "Single digit numbers 0-9 (always true, e.g. 5^1=5); negative numbers (not Armstrong); 4-digit Armstrong like 1634 (1^4+6^4+3^4+4^4=1634)."
  },
  {
    num: 8,
    title: "Check Prime Number",
    topic: "Mathematics",
    statement: "Given an integer n, determine whether it is a prime number (a positive integer strictly greater than 1 that has no positive divisors other than 1 and itself).",
    example: "Input: n = 29\nOutput: true\nInput: n = 1\nOutput: false",
    approach: "Numbers <= 1 are not prime. 2 and 3 are prime. Any even number > 2 or multiple of 3 is not prime. For other numbers, test divisors up to sqrt(n) in steps of 6 (i.e. checking 6k - 1 and 6k + 1). This reduces comparisons by 66% compared to testing every odd number.",
    code: `public class PrimeCheck {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;

        for (int i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("29 is prime? " + isPrime(29)); // true
        System.out.println("49 is prime? " + isPrime(49)); // false
    }
}`,
    dryRun: "n = 29\n- n > 3, 29%2 != 0, 29%3 != 0\n- i=5: i*i=25 <= 29. 29%5 != 0, 29%(5+2=7) != 0\n- i becomes 11: i*i = 121 > 29 -> loop exits.\nReturns true.",
    timeComplexity: "O(sqrt(N)) — testing divisors only up to the square root of N.",
    spaceComplexity: "O(1) — constant extra space.",
    edgeCases: "n <= 1 (returns false); n = 2 (only even prime); n = 3; perfect squares like 25, 49 (correctly identified as non-prime)."
  },
  {
    num: 9,
    title: "Find GCD and LCM",
    topic: "Mathematics",
    statement: "Given two non-negative integers a and b, compute their Greatest Common Divisor (GCD) and Least Common Multiple (LCM).",
    example: "Input: a = 12, b = 18\nOutput: GCD = 6, LCM = 36",
    approach: "Use the Euclidean Algorithm for GCD: gcd(a, b) = gcd(b, a % b) until b becomes 0. Once GCD is found, compute LCM using the fundamental relation: LCM(a, b) = (|a * b|) / GCD(a, b). To prevent integer overflow, divide before multiplying: (a / gcd(a, b)) * b.",
    code: `public class GcdAndLcm {
    public static long gcd(long a, long b) {
        while (b != 0) {
            long temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    public static long lcm(long a, long b) {
        if (a == 0 || b == 0) return 0;
        return (a / gcd(a, b)) * b;
    }

    public static void main(String[] args) {
        long a = 12, b = 18;
        long g = gcd(a, b);
        long l = lcm(a, b);
        System.out.println("GCD: " + g + ", LCM: " + l); // GCD: 6, LCM: 36
    }
}`,
    dryRun: "a = 12, b = 18\n1. 12 % 18 = 12 -> a=18, b=12\n2. 18 % 12 = 6  -> a=12, b=6\n3. 12 % 6 = 0   -> a=6, b=0\nGCD = 6. LCM = (12 / 6) * 18 = 2 * 18 = 36.",
    timeComplexity: "O(log(min(A, B))) — Euclidean algorithm runs in logarithmic time with respect to the smaller operand.",
    spaceComplexity: "O(1) — iterative Euclidean calculation.",
    edgeCases: "One operand is 0 (GCD(0, b) = b, LCM = 0); identical numbers (GCD = LCM = a); prime numbers (GCD = 1, LCM = a*b)."
  },
  {
    num: 10,
    title: "Fibonacci Series",
    topic: "Mathematics",
    statement: "Generate the first n terms of the Fibonacci sequence, where each term is the sum of the preceding two terms: F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).",
    example: "Input: n = 7\nOutput: [0, 1, 1, 2, 3, 5, 8]",
    approach: "Use an iterative approach with two state variables (a = 0, b = 1). In each iteration, print 'a', compute next = a + b, and slide window: a = b, b = next. This achieves O(N) linear time and O(1) space, avoiding the exponential O(2^N) overhead of naive recursion.",
    code: `import java.util.Arrays;

public class Fibonacci {
    public static long[] generateFibonacci(int n) {
        if (n <= 0) return new long[0];
        long[] fib = new long[n];
        if (n >= 1) fib[0] = 0;
        if (n >= 2) fib[1] = 1;

        for (int i = 2; i < n; i++) {
            fib[i] = fib[i - 1] + fib[i - 2];
        }
        return fib;
    }

    public static void main(String[] args) {
        int n = 7;
        System.out.println("Fibonacci(" + n + "): " + Arrays.toString(generateFibonacci(n)));
        // Output: [0, 1, 1, 2, 3, 5, 8]
    }
}`,
    dryRun: "n = 7\ni=0: 0\ni=1: 1\ni=2: 0+1 = 1\ni=3: 1+1 = 2\ni=4: 1+2 = 3\ni=5: 2+3 = 5\ni=6: 3+5 = 8\nArray: [0, 1, 1, 2, 3, 5, 8]",
    timeComplexity: "O(N) — single linear loop up to N.",
    spaceComplexity: "O(N) to store output array (or O(1) if printing on the fly).",
    edgeCases: "n = 0 (empty); n = 1 ([0]); n = 2 ([0, 1]); large n up to 92 handled using 'long' data type to prevent 32-bit overflow."
  },
  {
    num: 11,
    title: "Check Palindrome String",
    topic: "Strings",
    statement: "Given a string s, determine whether it is a palindrome, considering only alphanumeric characters and ignoring cases.",
    example: "Input: s = \"A man, a plan, a canal: Panama\"\nOutput: true\nExplanation: \"amanaplanacanalpanama\" is a palindrome.",
    approach: "Use two pointers: 'left' at start (0) and 'right' at end (length - 1). Advance left if not alphanumeric; decrement right if not alphanumeric. When both point to valid characters, compare them case-insensitively. If mismatch occurs, return false. If pointers cross, return true.",
    code: `public class PalindromeString {
    public static boolean isPalindrome(String s) {
        if (s == null) return false;
        int left = 0, right = s.length() - 1;

        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        String s = "A man, a plan, a canal: Panama";
        System.out.println("Is Palindrome? " + isPalindrome(s)); // true
    }
}`,
    dryRun: "s = \"race a car\"\nCompare 'r' vs 'r' (ok)\nCompare 'a' vs 'a' (ok)\nCompare 'c' vs 'c' (ok)\nCompare 'e' vs 'a' -> mismatch! Return false.",
    timeComplexity: "O(N) — each character is visited at most once.",
    spaceComplexity: "O(1) — constant extra space; no new reversed string is created.",
    edgeCases: "Empty string \"\" or whitespace only (true); string with special symbols \"###\" (true); case differences \"Abba\" (true)."
  },
  {
    num: 12,
    title: "Check Whether Two Strings Are Anagrams",
    topic: "Strings",
    statement: "Given two strings s and t, return true if t is an anagram of s (contains the same characters with identical frequencies), and false otherwise.",
    example: "Input: s = \"anagram\", t = \"nagaram\"\nOutput: true\nInput: s = \"rat\", t = \"car\"\nOutput: false",
    approach: "If lengths differ, return false immediately. Use a fixed-size frequency array of 26 integers (or 256 for extended ASCII). For every character in s, increment its count; for every character in t, decrement its count. If all counts return to zero, strings are anagrams.",
    code: `public class AnagramCheck {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] freq = new int[26];

        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
            freq[t.charAt(i) - 'a']--;
        }

        for (int count : freq) {
            if (count != 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("anagram & nagaram: " + isAnagram("anagram", "nagaram")); // true
        System.out.println("rat & car: " + isAnagram("rat", "car")); // false
    }
}`,
    dryRun: "s = \"cat\", t = \"act\"\n- s[0]='c' (+1), t[0]='a' (-1) -> c:1, a:-1\n- s[1]='a' (+1), t[1]='c' (-1) -> a:0, c:0\n- s[2]='t' (+1), t[2]='t' (-1) -> t:0\nAll 26 buckets are 0 -> true.",
    timeComplexity: "O(N) — single pass of length N.",
    spaceComplexity: "O(1) — constant 26-element array regardless of input size.",
    edgeCases: "Different string lengths; strings with repeating characters like \"aacc\" and \"ccac\"; unicode/uppercase characters if applicable."
  },
  {
    num: 13,
    title: "Count Character Frequencies",
    topic: "Hashing",
    statement: "Given a string s, count the frequency of each character and display the counts in order of occurrence.",
    example: "Input: s = \"programming\"\nOutput: {p:1, r:2, o:1, g:2, a:1, m:2, i:1, n:1}",
    approach: "Use a LinkedHashMap<Character, Integer> to maintain insertion order while counting frequencies. Iterate through each character of the string and increment the count using map.put(ch, map.getOrDefault(ch, 0) + 1).",
    code: `import java.util.*;

public class CharacterFrequency {
    public static Map<Character, Integer> countFrequencies(String s) {
        Map<Character, Integer> freqMap = new LinkedHashMap<>();
        for (char c : s.toCharArray()) {
            freqMap.put(c, freqMap.getOrDefault(c, 0) + 1);
        }
        return freqMap;
    }

    public static void main(String[] args) {
        String s = "programming";
        Map<Character, Integer> result = countFrequencies(s);
        for (Map.Entry<Character, Integer> entry : result.entrySet()) {
            System.out.print(entry.getKey() + ":" + entry.getValue() + " ");
        }
        // Output: p:1 r:2 o:1 g:2 a:1 m:2 i:1 n:1
    }
}`,
    dryRun: "s = \"programming\"\n- 'p' -> 1\n- 'r' -> 1\n- 'o' -> 1\n- 'g' -> 1\n- 'r' -> 2\n- 'a' -> 1\n- 'm' -> 1\n- 'm' -> 2\n- 'i' -> 1\n- 'n' -> 1\n- 'g' -> 2",
    timeComplexity: "O(N) — linear pass across the string of length N.",
    spaceComplexity: "O(K) where K <= 256 is the number of unique characters.",
    edgeCases: "Empty string \"\"; string with spaces and punctuation; string with only 1 unique character \"aaaa\"."
  },
  {
    num: 14,
    title: "Reverse Words in a Sentence",
    topic: "Strings",
    statement: "Given an input string s, reverse the order of the words. Return a string of the words in reverse order concatenated by a single space, removing all extra leading, trailing, or multiple intervening spaces.",
    example: "Input: s = \"  the sky   is blue  \"\nOutput: \"blue is sky the\"",
    approach: "Trim leading and trailing spaces. Split the string by the regular expression \"\\\\s+\" (which matches one or more whitespace characters). Then, traverse the resulting words array from the last element to the first, appending each word to a StringBuilder separated by a single space.",
    code: `public class ReverseWords {
    public static String reverseWords(String s) {
        if (s == null) return "";
        String[] words = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();

        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(" ");
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        String s = "  the sky   is blue  ";
        System.out.println("Reversed: \\"" + reverseWords(s) + "\\"");
        // Output: "blue is sky the"
    }
}`,
    dryRun: "s = \"  the sky   is blue  \"\n1. trim() -> \"the sky   is blue\"\n2. split(\"\\\\s+\") -> [\"the\", \"sky\", \"is\", \"blue\"]\n3. Traverse backwards: \"blue\" + \" \" + \"is\" + \" \" + \"sky\" + \" \" + \"the\"\nResult: \"blue is sky the\".",
    timeComplexity: "O(N) — scanning and splitting the string takes linear time.",
    spaceComplexity: "O(N) — storing tokens and building output string.",
    edgeCases: "Multiple consecutive spaces; single word \"hello\"; string with only spaces \"   \"."
  },
  {
    num: 15,
    title: "Find the First Non-Repeating Character",
    topic: "Hashing",
    statement: "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
    example: "Input: s = \"loveleetcode\"\nOutput: 2\nExplanation: Character 'v' at index 2 is the first character that does not repeat.",
    approach: "Two-pass algorithm:\nPass 1: Traverse the string and build a frequency array (int[26]) of character counts.\nPass 2: Traverse the string again from left to right; the first character whose frequency is exactly 1 is our answer.",
    code: `public class FirstNonRepeating {
    public static int firstUniqChar(String s) {
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
        }
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i) - 'a'] == 1) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        String s = "loveleetcode";
        int idx = firstUniqChar(s);
        System.out.println("First non-repeating index: " + idx + " (char: " + s.charAt(idx) + ")"); // 2 ('v')
    }
}`,
    dryRun: "s = \"loveleetcode\"\nCounts: l:2, o:2, v:1, e:4, t:1, c:1, d:1\nSecond pass:\n- idx 0: 'l' count=2\n- idx 1: 'o' count=2\n- idx 2: 'v' count=1 -> Found! Return 2.",
    timeComplexity: "O(N) — two linear sweeps through the string.",
    spaceComplexity: "O(1) — constant size 26 array for English lowercase letters.",
    edgeCases: "All characters repeat \"aabbcc\" (returns -1); single character \"z\" (returns 0); string where last character is the only unique one \"aabbc\"."
  },
  {
    num: 16,
    title: "Two Sum",
    topic: "Hashing",
    statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.",
    example: "Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9.",
    approach: "Use a HashMap to store values and their indices. For each number x = nums[i], calculate the needed complement = target - x. If complement is already in the map, we have found our answer [map.get(complement), i]. Otherwise, put x and its index into the map.",
    code: `import java.util.*;

public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int[] res = twoSum(nums, 9);
        System.out.println("Indices: [" + res[0] + ", " + res[1] + "]"); // [0, 1]
    }
}`,
    dryRun: "nums = [2, 7, 11, 15], target = 9\n- i=0: num=2, complement = 9-2 = 7. Map empty. Put (2 -> 0).\n- i=1: num=7, complement = 9-7 = 2. Map contains 2! Return [0, 1].",
    timeComplexity: "O(N) — single pass with O(1) average hash map lookup.",
    spaceComplexity: "O(N) — storing up to N elements in the hash map.",
    edgeCases: "Negative numbers [ -3, 4, 3, 90 ], target = 0; duplicate values [ 3, 3 ], target = 6 (map handles duplicate correctly by checking complement before overwriting)."
  },
  {
    num: 17,
    title: "Maximum Subarray Sum (Kadane's Algorithm)",
    topic: "Kadane's algorithm",
    statement: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    example: "Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6\nExplanation: The subarray [4, -1, 2, 1] has the largest sum = 6.",
    approach: "Kadane's algorithm maintains two variables: 'currentSum' and 'maxSum'. At each element x, decide whether to add x to currentSum (extending previous subarray) or start a fresh subarray at x (currentSum = Math.max(x, currentSum + x)). Update maxSum = Math.max(maxSum, currentSum).",
    code: `public class KadaneMaxSubarray {
    public static int maxSubArray(int[] nums) {
        int currentSum = nums[0];
        int maxSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }

    public static void main(String[] args) {
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println("Maximum Subarray Sum: " + maxSubArray(nums)); // Output: 6
    }
}`,
    dryRun: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n- init: curr = -2, max = -2\n- 1: curr = max(1, -1) = 1, max = 1\n- -3: curr = max(-3, -2) = -2, max = 1\n- 4: curr = max(4, 2) = 4, max = 4\n- -1: curr = max(-1, 3) = 3, max = 4\n- 2: curr = max(2, 5) = 5, max = 5\n- 1: curr = max(1, 6) = 6, max = 6\n- -5: curr = max(-5, 1) = 1, max = 6\n- 4: curr = max(4, 5) = 5, max = 6. Output: 6",
    timeComplexity: "O(N) — single pass through the array.",
    spaceComplexity: "O(1) — constant auxiliary space.",
    edgeCases: "All negative numbers [-5, -2, -8, -1] (returns -1, correctly picks maximum single element); array of size 1; all positive numbers."
  },
  {
    num: 18,
    title: "Binary Search",
    topic: "Searching",
    statement: "Given a sorted array of integers nums and an integer target, write a function to search target in nums. If target exists, return its index; otherwise, return -1.",
    example: "Input: nums = [-1, 0, 3, 5, 9, 12], target = 9\nOutput: 4\nExplanation: 9 exists in nums and its index is 4.",
    approach: "Maintain two pointers: low = 0 and high = nums.length - 1. In each iteration, calculate mid = low + (high - low) / 2 to prevent integer overflow. If nums[mid] == target, return mid. If nums[mid] < target, search right half (low = mid + 1). If nums[mid] > target, search left half (high = mid - 1).",
    code: `public class BinarySearch {
    public static int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2; // Prevents overflow
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] nums = {-1, 0, 3, 5, 9, 12};
        System.out.println("Search 9: " + search(nums, 9)); // 4
        System.out.println("Search 2: " + search(nums, 2)); // -1
    }
}`,
    dryRun: "nums = [-1, 0, 3, 5, 9, 12], target = 9\n1. low=0, high=5, mid=2, nums[2]=3 < 9 -> low=3\n2. low=3, high=5, mid=4, nums[4]=9 == target -> Found at index 4.",
    timeComplexity: "O(log N) — halves search space on every iteration.",
    spaceComplexity: "O(1) — iterative search with constant memory.",
    edgeCases: "Target smaller than first element; target larger than last element; single element array; array with duplicate values."
  },
  {
    num: 19,
    title: "Merge Two Sorted Arrays",
    topic: "Arrays",
    statement: "Given two sorted integer arrays nums1 and nums2, merge nums2 into nums1 as one sorted array. nums1 has size m + n, where the first m elements are valid and the last n elements are 0.",
    example: "Input: nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3\nOutput: nums1 = [1, 2, 2, 3, 5, 6]",
    approach: "Three-pointer technique starting from the back. Set p1 = m - 1 (end of valid nums1), p2 = n - 1 (end of nums2), and p = m + n - 1 (end of buffer). Compare nums1[p1] and nums2[p2], place the larger at nums1[p], and decrement pointers. This avoids overwriting unexamined elements in nums1.",
    code: `import java.util.Arrays;

public class MergeSortedArrays {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        int p1 = m - 1;
        int p2 = n - 1;
        int p = m + n - 1;

        while (p1 >= 0 && p2 >= 0) {
            if (nums1[p1] > nums2[p2]) {
                nums1[p] = nums1[p1];
                p1--;
            } else {
                nums1[p] = nums2[p2];
                p2--;
            }
            p--;
        }

        // Copy remaining elements of nums2 if any
        while (p2 >= 0) {
            nums1[p] = nums2[p2];
            p2--;
            p--;
        }
    }

    public static void main(String[] args) {
        int[] nums1 = {1, 2, 3, 0, 0, 0};
        int[] nums2 = {2, 5, 6};
        merge(nums1, 3, nums2, 3);
        System.out.println("Merged: " + Arrays.toString(nums1)); // [1, 2, 2, 3, 5, 6]
    }
}`,
    dryRun: "nums1 = [1, 2, 3, 0, 0, 0], nums2 = [2, 5, 6]\n- p1=2 (3), p2=2 (6): 6 > 3 -> nums1[5] = 6, p2=1\n- p1=2 (3), p2=1 (5): 5 > 3 -> nums1[4] = 5, p2=0\n- p1=2 (3), p2=0 (2): 3 > 2 -> nums1[3] = 3, p1=1\n- p1=1 (2), p2=0 (2): 2 == 2 -> nums1[2] = 2, p2=-1\nLoop exits. Remaining nums1 already in place.\nResult: [1, 2, 2, 3, 5, 6].",
    timeComplexity: "O(M + N) — each element is moved exactly once.",
    spaceComplexity: "O(1) — in-place modification within nums1 buffer.",
    edgeCases: "nums2 is empty (n=0); nums1 is initially empty of valid elements (m=0, all in nums2); elements in nums2 all smaller than nums1."
  },
  {
    num: 20,
    title: "Sort 0s, 1s and 2s (Dutch National Flag Algorithm)",
    topic: "Two pointers",
    statement: "Given an array nums with n objects colored red, white, or blue (represented by integers 0, 1, and 2), sort them in-place so that objects of the same color are adjacent, with the colors in the order 0, 1, and 2.",
    example: "Input: nums = [2, 0, 2, 1, 1, 0]\nOutput: [0, 0, 1, 1, 2, 2]",
    approach: "Use Edsger Dijkstra's Dutch National Flag 3-pointer algorithm with low = 0, mid = 0, high = n - 1.\n- Invariant: [0...low-1] are 0s, [low...mid-1] are 1s, [high+1...n-1] are 2s.\n- If nums[mid] == 0: swap(nums[low], nums[mid]), low++, mid++.\n- If nums[mid] == 1: mid++.\n- If nums[mid] == 2: swap(nums[mid], nums[high]), high-- (do not increment mid because swapped element needs evaluation).",
    code: `import java.util.Arrays;

public class SortColors {
    public static void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums, low, mid);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else { // nums[mid] == 2
                swap(nums, mid, high);
                high--;
            }
        }
    }

    private static void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }

    public static void main(String[] args) {
        int[] nums = {2, 0, 2, 1, 1, 0};
        sortColors(nums);
        System.out.println("Sorted Colors: " + Arrays.toString(nums)); // [0, 0, 1, 1, 2, 2]
    }
}`,
    dryRun: "nums = [2, 0, 2, 1, 1, 0], low=0, mid=0, high=5\n- mid=0: val=2 -> swap(0, 5) -> [0, 0, 2, 1, 1, 2], high=4\n- mid=0: val=0 -> swap(0, 0) -> low=1, mid=1\n- mid=1: val=0 -> swap(1, 1) -> low=2, mid=2\n- mid=2: val=2 -> swap(2, 4) -> [0, 0, 1, 1, 2, 2], high=3\n- mid=2: val=1 -> mid=3\n- mid=3: val=1 -> mid=4 > high(3) -> Done!\nResult: [0, 0, 1, 1, 2, 2]",
    timeComplexity: "O(N) — single pass in-place.",
    spaceComplexity: "O(1) — constant extra space.",
    edgeCases: "Array with only one type of element [0, 0, 0]; already sorted [0, 1, 2]; reverse sorted [2, 2, 1, 0]."
  }
];
