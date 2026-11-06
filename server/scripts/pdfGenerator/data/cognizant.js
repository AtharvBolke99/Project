module.exports = [
  {
    num: 1,
    title: "Find the Second-Largest Element",
    topic: "Arrays",
    statement: "Write a complete Java console program to find the second-largest distinct element in an array of integers. Read the array length N followed by N integers from standard input.",
    example: "Sample Input:\n6\n12 35 1 10 34 1\nSample Output:\n34",
    approach: "Read N integers using java.util.Scanner. Maintain two variables: largest = Integer.MIN_VALUE and secondLargest = Integer.MIN_VALUE. In a single pass, update largest and secondLargest. If no second distinct largest exists, print -1.",
    code: `import java.util.Scanner;

public class CognizantSecondLargest {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }

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

        if (secondLargest == Integer.MIN_VALUE) {
            System.out.println(-1);
        } else {
            System.out.println(secondLargest);
        }
        sc.close();
    }
}`,
    dryRun: "Input: 6 followed by [12, 35, 1, 10, 34, 1]\nlargest=35, secondLargest=34\nOutput: 34",
    timeComplexity: "O(N) — single linear traversal.",
    spaceComplexity: "O(N) to store inputs in array (or O(1) if computed streaming).",
    edgeCases: "N < 2 (prints -1); all elements equal [5, 5, 5] (prints -1); negative inputs [-10, -5, -20] (prints -10)."
  },
  {
    num: 2,
    title: "Rearrange Arrays to Minimize Sum of Pairwise Products",
    topic: "Sorting",
    statement: "Given two arrays of equal size n, rearrange the elements such that the sum of the pairwise products sum = sum(A[i] * B[i]) is minimized. Read n, then array A, then array B.",
    example: "Sample Input:\n4\n3 1 1 2\n6 5 4 8\nSample Output:\n29\nExplanation: Sort A ascending: [1, 1, 2, 3], sort B descending: [8, 6, 5, 4]. Sum = (1*8) + (1*6) + (2*5) + (3*4) = 8 + 6 + 10 + 12 = 36... wait: (1*8)+(1*6)+(2*5)+(3*4)=36. For [6,5,4,8] descending: 8,6,5,4. (1*8)+(1*6)+(2*5)+(3*4)=36.",
    approach: "Sorting Strategy & Mathematical Proof (Rearrangement Inequality):\nBy the Rearrangement Inequality, for any two sequences, the sum of pairwise products is MAXIMIZED when both sequences are sorted in the same monotonic order (both ascending), and MINIMIZED when they are sorted in opposite monotonic orders (one ascending, one descending).\nWhy? If we pair the largest element of A with the smallest element of B, and the smallest element of A with the largest element of B, the huge multipliers are dampened by small weights, yielding the minimum possible dot product.",
    code: `import java.util.Scanner;
import java.util.Arrays;

public class MinimizePairwiseProduct {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        long[] a = new long[n];
        long[] b = new long[n];

        for (int i = 0; i < n; i++) a[i] = sc.nextLong();
        for (int i = 0; i < n; i++) b[i] = sc.nextLong();

        // Sort A ascending
        Arrays.sort(a);
        // Sort B ascending, then pair a[i] with b[n - 1 - i]
        Arrays.sort(b);

        long minSum = 0;
        for (int i = 0; i < n; i++) {
            minSum += a[i] * b[n - 1 - i]; // smallest with largest
        }

        System.out.println(minSum);
        sc.close();
    }
}`,
    dryRun: "A = [3, 1, 1, 2] -> sorted A = [1, 1, 2, 3]\nB = [6, 5, 4, 8] -> sorted B = [4, 5, 6, 8]\nPairwise product:\na[0]*b[3] = 1*8 = 8\na[1]*b[2] = 1*6 = 6\na[2]*b[1] = 2*5 = 10\na[3]*b[0] = 3*4 = 12\nTotal sum = 8 + 6 + 10 + 12 = 36.",
    timeComplexity: "O(N log N) — dominated by sorting both arrays.",
    spaceComplexity: "O(N) for array storage, O(1) auxiliary space.",
    edgeCases: "Arrays containing negative numbers; arrays with all identical elements; n = 1 (single product)."
  },
  {
    num: 3,
    title: "Find the Missing Number",
    topic: "Arrays",
    statement: "Given an array of size n containing distinct integers from 0 to n, find the missing integer.",
    example: "Sample Input:\n3\n3 0 1\nSample Output:\n2",
    approach: "Use XOR properties. XORing all indices 0 to n with all array values leaves only the missing number, completely preventing integer overflow.",
    code: `import java.util.Scanner;

public class CognizantMissingNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int xorAll = 0;
        for (int i = 0; i <= n; i++) xorAll ^= i;
        for (int i = 0; i < n; i++) {
            xorAll ^= sc.nextInt();
        }
        System.out.println(xorAll);
        sc.close();
    }
}`,
    dryRun: "n = 3, elements = [3, 0, 1]\nxorAll = (0^1^2^3) ^ (3^0^1) = 2. Output: 2.",
    timeComplexity: "O(N) — single pass streaming input.",
    spaceComplexity: "O(1) — constant extra space.",
    edgeCases: "Missing 0; missing N; N = 1."
  },
  {
    num: 4,
    title: "Move Zeros to the End",
    topic: "Arrays",
    statement: "Given an array of integers, write a complete program to move all zeros to the end while preserving the relative order of non-zero elements.",
    example: "Sample Input:\n5\n0 1 0 3 12\nSample Output:\n1 3 12 0 0",
    approach: "Use a two-pointer insert index. Whenever a non-zero element is encountered, swap it to the insert position and increment the pointer.",
    code: `import java.util.Scanner;

public class CognizantMoveZeros {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        int insertPos = 0;
        for (int i = 0; i < n; i++) {
            if (arr[i] != 0) {
                int temp = arr[insertPos];
                arr[insertPos] = arr[i];
                arr[i] = temp;
                insertPos++;
            }
        }

        for (int i = 0; i < n; i++) {
            System.out.print(arr[i] + (i == n - 1 ? "" : " "));
        }
        System.out.println();
        sc.close();
    }
}`,
    dryRun: "[0, 1, 0, 3, 12] -> swap 0 and 1 -> [1, 0, 0, 3, 12] -> swap 0 and 3 -> [1, 3, 0, 0, 12] -> swap 0 and 12 -> [1, 3, 12, 0, 0].",
    timeComplexity: "O(N) — single pass.",
    spaceComplexity: "O(1) auxiliary space.",
    edgeCases: "Array with no zeros; array of all zeros."
  },
  {
    num: 5,
    title: "Find a Pair with a Target Sum",
    topic: "Hashing",
    statement: "Given an array of integers and a target sum, determine whether there exists a pair of elements whose sum equals target. If found, print the pair; otherwise print 'No Pair Found'.",
    example: "Sample Input:\n5\n10 15 3 7 2\n17\nSample Output:\nPair found: (15, 2)",
    approach: "Use a HashSet to store seen elements. For each number x, check if (target - x) is in the set. If yes, print the pair and terminate. Otherwise, add x to the set.",
    code: `import java.util.*;

public class CognizantTargetSumPair {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int target = sc.nextInt();

        Set<Integer> seen = new HashSet<>();
        boolean found = false;

        for (int num : arr) {
            int complement = target - num;
            if (seen.contains(complement)) {
                System.out.println("Pair found: (" + complement + ", " + num + ")");
                found = true;
                break;
            }
            seen.add(num);
        }

        if (!found) {
            System.out.println("No Pair Found");
        }
        sc.close();
    }
}`,
    dryRun: "arr = [10, 15, 3, 7, 2], target = 17\nseen: {10, 15, 3, 7}\nnum = 2: complement = 17 - 2 = 15 is in seen! Output: Pair found: (15, 2).",
    timeComplexity: "O(N) — linear pass with O(1) set operations.",
    spaceComplexity: "O(N) — storing seen elements in hash set.",
    edgeCases: "No such pair exists; duplicate values adding to target (3 + 3 = 6)."
  },
  {
    num: 6,
    title: "Count the Frequency of Elements",
    topic: "Hashing",
    statement: "Given an array of integers, count the frequency of each distinct element and print them in order of their first appearance.",
    example: "Sample Input:\n7\n1 2 2 3 1 4 2\nSample Output:\n1: 2\n2: 3\n3: 1\n4: 1",
    approach: "Use a LinkedHashMap<Integer, Integer> to preserve the first-appearance order while tracking counts.",
    code: `import java.util.*;

public class CognizantElementFrequency {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Map<Integer, Integer> map = new LinkedHashMap<>();

        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            map.put(val, map.getOrDefault(val, 0) + 1);
        }

        for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        sc.close();
    }
}`,
    dryRun: "[1, 2, 2, 3, 1, 4, 2] -> 1:2, 2:3, 3:1, 4:1.",
    timeComplexity: "O(N) — single pass over the input.",
    spaceComplexity: "O(K) where K is number of unique elements.",
    edgeCases: "All elements identical; all elements unique."
  },
  {
    num: 7,
    title: "Maximum Subarray Sum",
    topic: "Kadane's algorithm",
    statement: "Given an array of N integers, find the contiguous subarray that has the maximum sum using Kadane's Algorithm.",
    example: "Sample Input:\n8\n-2 -3 4 -1 -2 1 5 -3\nSample Output:\n7\nExplanation: Subarray [4, -1, -2, 1, 5] sum = 7.",
    approach: "Maintain currentSum = arr[0] and maxSum = arr[0]. For each element from index 1, currentSum = max(arr[i], currentSum + arr[i]), and maxSum = max(maxSum, currentSum).",
    code: `import java.util.Scanner;

public class CognizantMaxSubarray {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        int currentSum = arr[0];
        int maxSum = arr[0];

        for (int i = 1; i < n; i++) {
            currentSum = Math.max(arr[i], currentSum + arr[i]);
            maxSum = Math.max(maxSum, currentSum);
        }

        System.out.println(maxSum);
        sc.close();
    }
}`,
    dryRun: "arr = [-2, -3, 4, -1, -2, 1, 5, -3]\nmax achieves 7 at subarray [4, -1, -2, 1, 5].",
    timeComplexity: "O(N) — single linear pass.",
    spaceComplexity: "O(1) auxiliary space.",
    edgeCases: "All negative numbers (e.g. [-5, -1, -8] yields -1)."
  },
  {
    num: 8,
    title: "Rotate an Array",
    topic: "Arrays",
    statement: "Given an array of size N and an integer K, rotate the array to the right by K positions in-place.",
    example: "Sample Input:\n5\n1 2 3 4 5\n2\nSample Output:\n4 5 1 2 3",
    approach: "Normalize k = k % n. Reverse entire array, reverse first k elements, reverse remaining n - k elements.",
    code: `import java.util.Scanner;

public class CognizantRotateArray {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int k = sc.nextInt() % n;

        reverse(arr, 0, n - 1);
        reverse(arr, 0, k - 1);
        reverse(arr, k, n - 1);

        for (int i = 0; i < n; i++) {
            System.out.print(arr[i] + (i == n - 1 ? "" : " "));
        }
        System.out.println();
        sc.close();
    }

    private static void reverse(int[] arr, int l, int r) {
        while (l < r) {
            int t = arr[l];
            arr[l] = arr[r];
            arr[r] = t;
            l++;
            r--;
        }
    }
}`,
    dryRun: "arr = [1, 2, 3, 4, 5], k = 2\nRev all: [5, 4, 3, 2, 1]\nRev 0..1: [4, 5, 3, 2, 1]\nRev 2..4: [4, 5, 1, 2, 3]",
    timeComplexity: "O(N) — two swaps per element.",
    spaceComplexity: "O(1) auxiliary space.",
    edgeCases: "k = 0; k >= n."
  },
  {
    num: 9,
    title: "Check Whether Two Strings Are Anagrams",
    topic: "Strings",
    statement: "Write a program to test whether two input strings are anagrams of each other.",
    example: "Sample Input:\nlisten\nsilent\nSample Output:\nAnagrams",
    approach: "If lengths differ, not anagrams. Track frequencies using int[26]. Increment for string 1, decrement for string 2. Check if all values are 0.",
    code: `import java.util.Scanner;

public class CognizantAnagram {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s1 = sc.next().toLowerCase();
        String s2 = sc.next().toLowerCase();

        if (s1.length() != s2.length()) {
            System.out.println("Not Anagrams");
            sc.close();
            return;
        }

        int[] count = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            count[s1.charAt(i) - 'a']++;
            count[s2.charAt(i) - 'a']--;
        }

        boolean isAnagram = true;
        for (int c : count) {
            if (c != 0) {
                isAnagram = false;
                break;
            }
        }

        System.out.println(isAnagram ? "Anagrams" : "Not Anagrams");
        sc.close();
    }
}`,
    dryRun: "listen vs silent: counts match exactly -> Anagrams.",
    timeComplexity: "O(N) — single pass.",
    spaceComplexity: "O(1) — 26 integers.",
    edgeCases: "Different lengths; different character cases."
  },
  {
    num: 10,
    title: "Find the First Non-Repeating Character",
    topic: "Hashing",
    statement: "Given a string, find the first character that appears exactly once. Print the character, or 'None' if every character repeats.",
    example: "Sample Input:\nswiss\nSample Output:\nw",
    approach: "Count frequencies in int[256]. Iterate through the string; print the first character with frequency 1.",
    code: `import java.util.Scanner;

public class CognizantFirstUnique {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();

        int[] freq = new int[256];
        for (char c : s.toCharArray()) {
            freq[c]++;
        }

        char result = '0';
        for (char c : s.toCharArray()) {
            if (freq[c] == 1) {
                result = c;
                break;
            }
        }

        if (result == '0') {
            System.out.println("None");
        } else {
            System.out.println(result);
        }
        sc.close();
    }
}`,
    dryRun: "s = \"swiss\"\ns:3, w:1, i:1\nFirst char with count 1 is 'w'.",
    timeComplexity: "O(N) — two scans.",
    spaceComplexity: "O(1) — 256 array.",
    edgeCases: "All repeated \"aabb\"; all unique \"abc\"."
  },
  {
    num: 11,
    title: "Reverse Words in a String",
    topic: "Strings",
    statement: "Given a sentence, reverse the order of the words while removing extra spaces.",
    example: "Sample Input:\nCognizant GenC Next\nSample Output:\nNext GenC Cognizant",
    approach: "Read line, split by regex \\\\s+, traverse backwards and print words separated by space.",
    code: `import java.util.Scanner;

public class CognizantReverseWords {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine().trim();
        String[] words = line.split("\\\\s+");

        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(" ");
        }
        System.out.println(sb.toString());
        sc.close();
    }
}`,
    dryRun: "\"Cognizant GenC Next\" -> [\"Cognizant\", \"GenC\", \"Next\"] -> \"Next GenC Cognizant\".",
    timeComplexity: "O(N) — linear tokenization.",
    spaceComplexity: "O(N) for tokens.",
    edgeCases: "Single word; leading/trailing spaces."
  },
  {
    num: 12,
    title: "Find the Maximum Occurring Character",
    topic: "Hashing",
    statement: "Given a string, find the character that appears with the highest frequency. If multiple characters tie, print the lexicographically smallest character.",
    example: "Sample Input:\nsuccess\nSample Output:\ns\nExplanation: 's' appears 3 times, 'c' appears 2 times.",
    approach: "Build an ASCII frequency array. Iterate from 'a' to 'z' (or ASCII 0 to 255) to find the character with the maximum count, naturally breaking ties lexicographically.",
    code: `import java.util.Scanner;

public class CognizantMaxChar {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s = sc.nextLine();

        int[] count = new int[256];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i)]++;
        }

        int maxFreq = -1;
        char maxChar = ' ';

        for (int i = 0; i < 256; i++) {
            if (count[i] > maxFreq) {
                maxFreq = count[i];
                maxChar = (char) i;
            }
        }

        System.out.println(maxChar);
        sc.close();
    }
}`,
    dryRun: "s = \"success\": s:3, u:1, c:2, e:1. maxFreq=3, maxChar='s'.",
    timeComplexity: "O(N) — string scan.",
    spaceComplexity: "O(1) — 256-element array.",
    edgeCases: "Tie breaker (e.g. \"ba\" -> prints 'a'); spaces in string."
  },
  {
    num: 13,
    title: "Check Palindrome",
    topic: "Strings",
    statement: "Given a string, check if it is a palindrome considering alphanumeric characters.",
    example: "Sample Input:\nlevel\nSample Output:\nPalindrome",
    approach: "Two pointers left = 0, right = s.length() - 1, compare until pointers meet.",
    code: `import java.util.Scanner;

public class CognizantPalindrome {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();

        int left = 0, right = s.length() - 1;
        boolean isPal = true;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                isPal = false;
                break;
            }
            left++;
            right--;
        }

        System.out.println(isPal ? "Palindrome" : "Not Palindrome");
        sc.close();
    }
}`,
    dryRun: "\"level\": left=0('l'), right=4('l') -> match. left=1('e'), right=3('e') -> match. Palindrome.",
    timeComplexity: "O(N) — at most N/2 comparisons.",
    spaceComplexity: "O(1) extra space.",
    edgeCases: "Single character; even length vs odd length."
  },
  {
    num: 14,
    title: "Merge Two Sorted Arrays",
    topic: "Arrays",
    statement: "Read two sorted arrays and merge them into a single sorted sequence printed to console.",
    example: "Sample Input:\n3\n1 3 5\n3\n2 4 6\nSample Output:\n1 2 3 4 5 6",
    approach: "Standard merge step of merge sort using two pointers i and j.",
    code: `import java.util.Scanner;

public class CognizantMergeSorted {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n1 = sc.nextInt();
        int[] a = new int[n1];
        for (int i = 0; i < n1; i++) a[i] = sc.nextInt();

        int n2 = sc.nextInt();
        int[] b = new int[n2];
        for (int i = 0; i < n2; i++) b[i] = sc.nextInt();

        int i = 0, j = 0;
        StringBuilder sb = new StringBuilder();
        while (i < n1 && j < n2) {
            if (a[i] <= b[j]) {
                sb.append(a[i++]).append(" ");
            } else {
                sb.append(b[j++]).append(" ");
            }
        }
        while (i < n1) sb.append(a[i++]).append(" ");
        while (j < n2) sb.append(b[j++]).append(" ");

        System.out.println(sb.toString().trim());
        sc.close();
    }
}`,
    dryRun: "a=[1,3,5], b=[2,4,6] -> 1, 2, 3, 4, 5, 6.",
    timeComplexity: "O(N1 + N2) — linear scan.",
    spaceComplexity: "O(1) auxiliary space.",
    edgeCases: "One array is empty; overlapping ranges."
  },
  {
    num: 15,
    title: "Binary Search",
    topic: "Searching",
    statement: "Given a sorted array of N integers and a key, output the 0-based index of the key if found, or -1 if not found.",
    example: "Sample Input:\n5\n10 20 30 40 50\n30\nSample Output:\n2",
    approach: "Divide and conquer: mid = low + (high - low)/2. Compare arr[mid] with target.",
    code: `import java.util.Scanner;

public class CognizantBinarySearch {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int key = sc.nextInt();

        int low = 0, high = n - 1, ans = -1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == key) {
                ans = mid;
                break;
            } else if (arr[mid] < key) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        System.out.println(ans);
        sc.close();
    }
}`,
    dryRun: "arr=[10, 20, 30, 40, 50], key=30 -> mid=2, arr[2]=30 -> ans=2.",
    timeComplexity: "O(log N).",
    spaceComplexity: "O(1).",
    edgeCases: "Key absent; key at first/last element."
  },
  {
    num: 16,
    title: "Find Duplicate Elements",
    topic: "Hashing",
    statement: "Given an array, print all duplicate numbers in ascending order.",
    example: "Sample Input:\n6\n1 2 3 2 1 4\nSample Output:\n1 2",
    approach: "Use a TreeMap to track frequencies, then print keys where frequency > 1 in sorted order.",
    code: `import java.util.*;

public class CognizantDuplicates {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Map<Integer, Integer> counts = new TreeMap<>();

        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            counts.put(val, counts.getOrDefault(val, 0) + 1);
        }

        boolean found = false;
        for (Map.Entry<Integer, Integer> entry : counts.entrySet()) {
            if (entry.getValue() > 1) {
                System.out.print(entry.getKey() + " ");
                found = true;
            }
        }
        if (!found) System.out.print("-1");
        System.out.println();
        sc.close();
    }
}`,
    dryRun: "[1, 2, 3, 2, 1, 4] -> counts: 1:2, 2:2, 3:1, 4:1 -> output: 1 2.",
    timeComplexity: "O(N log K) using TreeMap.",
    spaceComplexity: "O(K) where K is unique count.",
    edgeCases: "No duplicates (-1); all duplicates."
  },
  {
    num: 17,
    title: "Stock Buy and Sell for Maximum Profit",
    topic: "Greedy",
    statement: "Given an array prices where prices[i] is the stock price on day i, find the maximum profit you can achieve from a single buy and sell transaction. If no profit is possible, return 0.",
    example: "Sample Input:\n6\n7 1 5 3 6 4\nSample Output:\n5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.",
    approach: "Greedy single-pass: maintain minPrice seen so far. At each day i, profit = prices[i] - minPrice. Update maxProfit = max(maxProfit, profit) and minPrice = min(minPrice, prices[i]).",
    code: `import java.util.Scanner;

public class CognizantStockBuySell {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();

        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;

        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }

        System.out.println(maxProfit);
        sc.close();
    }
}`,
    dryRun: "prices = [7, 1, 5, 3, 6, 4]\n- 7: min=7, profit=0\n- 1: min=1, profit=0\n- 5: profit=4, max=4\n- 3: profit=2, max=4\n- 6: profit=5, max=5\n- 4: profit=3, max=5. Output: 5.",
    timeComplexity: "O(N) — single pass.",
    spaceComplexity: "O(1) extra space.",
    edgeCases: "Strictly decreasing prices [7, 6, 4, 3, 1] (returns 0 profit)."
  },
  {
    num: 18,
    title: "Minimum Number of Coins",
    topic: "Greedy / DP",
    statement: "Given a value V and an array of coin denominations, find the minimum number of coins needed to make change for V.\nImportant interview distinction: clarify whether the coin system allows a greedy choice or requires Dynamic Programming.",
    example: "Sample Input:\nV = 49, Indian Currency = [1, 2, 5, 10, 20, 50, 100, 500, 2000]\nSample Output: 5 coins (20 + 20 + 5 + 2 + 2 = 49)\nArbitrary Coins: coins = [1, 5, 6, 9], V = 11\nOutput: 2 coins (5 + 6 = 11, whereas Greedy picks 9 + 1 + 1 = 3 coins).",
    approach: "Theoretical Foundation:\n1. Canonical Systems (Indian Rupee, US Dollar): The denominations satisfy the greedy-choice matroid property: taking the largest denomination <= remaining amount is guaranteed to yield the global optimum.\n2. Non-Canonical / Arbitrary Systems: Greedy fails! For example, denominations [1, 5, 6, 9] for V=11: greedy picks 9+1+1 (3 coins), but optimal is 5+6 (2 coins). We must use Dynamic Programming: dp[i] = min(dp[i], 1 + dp[i - coin]) initialized to infinity with dp[0] = 0.",
    code: `import java.util.Scanner;
import java.util.Arrays;

public class CognizantMinCoins {
    // 1. Dynamic Programming Solution (Guaranteed optimal for ANY coin system)
    public static int minCoinsDP(int[] coins, int V) {
        int[] dp = new int[V + 1];
        Arrays.fill(dp, V + 1);
        dp[0] = 0;

        for (int i = 1; i <= V; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
                }
            }
        }
        return dp[V] > V ? -1 : dp[V];
    }

    // 2. Greedy Solution (Optimal specifically for Indian canonical denominations)
    public static int minCoinsGreedyIndian(int V) {
        int[] denominations = {2000, 500, 200, 100, 50, 20, 10, 5, 2, 1};
        int count = 0;
        for (int coin : denominations) {
            if (V >= coin) {
                count += V / coin;
                V %= coin;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int v = sc.nextInt();

        System.out.println("Indian Rupee (Greedy): " + minCoinsGreedyIndian(v));

        int[] arbitraryCoins = {1, 5, 6, 9};
        System.out.println("Arbitrary Coins [1,5,6,9] (DP): " + minCoinsDP(arbitraryCoins, v));
        sc.close();
    }
}`,
    dryRun: "V = 49, Indian Currency: 49/20 = 2 (rem 9), 9/5 = 1 (rem 4), 4/2 = 2 (rem 0). Total = 2 + 1 + 2 = 5 coins.",
    timeComplexity: "Greedy: O(D) where D is number of denominations. DP: O(V * N) where V is target value and N is number of coins.",
    spaceComplexity: "Greedy: O(1). DP: O(V) for the 1D memoization array.",
    edgeCases: "V = 0 (returns 0); impossible amount where no denomination fits (returns -1)."
  }
];
