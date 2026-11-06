module.exports = [
  {
    num: 1,
    title: "Find the Second-Largest Element",
    topic: "Arrays",
    statement: "Find the second-largest distinct element in an array of integers.",
    example: "Input: [12, 35, 1, 10, 34, 1]\nOutput: 34",
    approach: "Single-pass comparison updating largest and second-largest.",
    code: `public class CapgeminiSecondLargest {
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
    dryRun: "Largest: 35, Second: 34.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Identical elements."
  },
  {
    num: 2,
    title: "Find the Missing Number",
    topic: "Arrays",
    statement: "Find missing integer in range 0 to n.",
    example: "Input: [3, 0, 1]\nOutput: 2",
    approach: "XOR cancellation.",
    code: `public class CapgeminiMissingNumber {
    public static int findMissing(int[] nums) {
        int x = 0;
        for (int i = 0; i <= nums.length; i++) x ^= i;
        for (int num : nums) x ^= num;
        return x;
    }
    public static void main(String[] args) {
        System.out.println(findMissing(new int[]{3, 0, 1})); // 2
    }
}`,
    dryRun: "XOR yields 2.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Missing edge numbers."
  },
  {
    num: 3,
    title: "Remove Duplicate Elements",
    topic: "Arrays",
    statement: "Remove duplicates from array in-place.",
    example: "Input: [1, 1, 2, 3, 3]\nOutput: [1, 2, 3]",
    approach: "Two-pointer index copy.",
    code: `import java.util.Arrays;

public class CapgeminiRemoveDuplicates {
    public static int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int idx = 0;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] != nums[idx]) nums[++idx] = nums[i];
        }
        return idx + 1;
    }
    public static void main(String[] args) {
        int[] arr = {1, 1, 2, 3, 3};
        int len = removeDuplicates(arr);
        System.out.println(Arrays.toString(Arrays.copyOfRange(arr, 0, len))); // [1, 2, 3]
    }
}`,
    dryRun: "Unique count: 3.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "No duplicates."
  },
  {
    num: 4,
    title: "Left-Rotate an Array by D Positions",
    topic: "Arrays",
    statement: "Rotate array to left by D steps.",
    example: "Input: arr = [1, 2, 3, 4, 5], d = 2\nOutput: [3, 4, 5, 1, 2]",
    approach: "Reverse algorithm for LEFT rotation:\n1. d = d % n.\n2. Reverse first d elements (0 to d-1).\n3. Reverse remaining n-d elements (d to n-1).\n4. Reverse entire array (0 to n-1).",
    code: `import java.util.Arrays;

public class LeftRotateArray {
    public static void leftRotate(int[] arr, int d) {
        int n = arr.length;
        d %= n;
        reverse(arr, 0, d - 1);
        reverse(arr, d, n - 1);
        reverse(arr, 0, n - 1);
    }

    private static void reverse(int[] arr, int l, int r) {
        while (l < r) {
            int t = arr[l]; arr[l++] = arr[r]; arr[r--] = t;
        }
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        leftRotate(arr, 2);
        System.out.println(Arrays.toString(arr)); // [3, 4, 5, 1, 2]
    }
}`,
    dryRun: "[1, 2, 3, 4, 5], d=2\n- Rev 0..1: [2, 1, 3, 4, 5]\n- Rev 2..4: [2, 1, 5, 4, 3]\n- Rev 0..4: [3, 4, 5, 1, 2].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1) in-place.",
    edgeCases: "d = 0; d >= n."
  },
  {
    num: 5,
    title: "Find Leaders in an Array",
    topic: "Arrays",
    statement: "An element is a Leader if it is greater than or equal to all elements to its right. The rightmost element is always a leader. Find all leaders and return them in order of appearance.",
    example: "Input: arr = [16, 17, 4, 3, 5, 2]\nOutput: [17, 5, 2]",
    approach: "Scan the array backwards from right to left (index n-1 down to 0). Maintain maxFromRight = Integer.MIN_VALUE. If arr[i] >= maxFromRight, arr[i] is a leader! Add to result list and update maxFromRight. Reverse the list at the end to restore original order.",
    code: `import java.util.*;

public class LeadersInArray {
    public static List<Integer> findLeaders(int[] arr) {
        List<Integer> leaders = new ArrayList<>();
        int maxFromRight = Integer.MIN_VALUE;

        for (int i = arr.length - 1; i >= 0; i--) {
            if (arr[i] >= maxFromRight) {
                leaders.add(arr[i]);
                maxFromRight = arr[i];
            }
        }
        Collections.reverse(leaders);
        return leaders;
    }

    public static void main(String[] args) {
        int[] arr = {16, 17, 4, 3, 5, 2};
        System.out.println("Leaders: " + findLeaders(arr)); // [17, 5, 2]
    }
}`,
    dryRun: "arr = [16, 17, 4, 3, 5, 2]\n- i=5 (2): 2 >= MIN -> leader=2, max=2\n- i=4 (5): 5 >= 2 -> leader=5, max=5\n- i=3 (3): 3 < 5 -> skip\n- i=2 (4): 4 < 5 -> skip\n- i=1 (17): 17 >= 5 -> leader=17, max=17\n- i=0 (16): 16 < 17 -> skip\nReversed: [17, 5, 2].",
    timeComplexity: "O(N) — single backwards pass.",
    spaceComplexity: "O(N) for result list.",
    edgeCases: "Strictly increasing array [1, 2, 3, 4] (only 4 is leader); strictly decreasing array [4, 3, 2, 1] (all are leaders)."
  },
  {
    num: 6,
    title: "Sort 0s, 1s and 2s",
    topic: "Two pointers",
    statement: "Sort array of 0s, 1s, and 2s in-place.",
    example: "Input: [2, 0, 1]\nOutput: [0, 1, 2]",
    approach: "Dutch National Flag 3-pointer algorithm (low, mid, high).",
    code: `import java.util.Arrays;

public class CapgeminiSort012 {
    public static void sort012(int[] a) {
        int l = 0, m = 0, h = a.length - 1;
        while (m <= h) {
            if (a[m] == 0) {
                int t = a[l]; a[l] = a[m]; a[m] = t; l++; m++;
            } else if (a[m] == 1) {
                m++;
            } else {
                int t = a[m]; a[m] = a[h]; a[h] = t; h--;
            }
        }
    }
    public static void main(String[] args) {
        int[] a = {2, 0, 1};
        sort012(a);
        System.out.println(Arrays.toString(a)); // [0, 1, 2]
    }
}`,
    dryRun: "Arranged into [0, 1, 2].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Single element; all same."
  },
  {
    num: 7,
    title: "Maximum Subarray Sum",
    topic: "Kadane's algorithm",
    statement: "Find the maximum subarray sum using Kadane's algorithm.",
    example: "Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6",
    approach: "Kadane's algorithm.",
    code: `public class CapgeminiKadane {
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
    edgeCases: "Negative array."
  },
  {
    num: 8,
    title: "Find the Majority Element (Moore's Voting Algorithm)",
    topic: "Arrays / Voting",
    statement: "Given an array nums of size n, return the majority element (the element that appears more than ⌊n / 2⌋ times). Assume that the majority element always exists.",
    example: "Input: nums = [2, 2, 1, 1, 1, 2, 2]\nOutput: 2",
    approach: "Boyer-Moore Voting Algorithm:\nMaintain candidate and count = 0. Iterate through nums: if count == 0, candidate = num. If num == candidate, count++; else count--. The majority element has frequency > n/2, so its occurrences cancel out all other elements combined, leaving it as candidate.",
    code: `public class MajorityElement {
    public static int majorityElement(int[] nums) {
        int candidate = nums[0];
        int count = 0;

        for (int num : nums) {
            if (count == 0) {
                candidate = num;
            }
            count += (num == candidate) ? 1 : -1;
        }
        return candidate;
    }

    public static void main(String[] args) {
        int[] nums = {2, 2, 1, 1, 1, 2, 2};
        System.out.println("Majority Element: " + majorityElement(nums)); // 2
    }
}`,
    dryRun: "nums = [2, 2, 1, 1, 1, 2, 2]\n- num=2: cand=2, count=1\n- num=2: count=2\n- num=1: count=1\n- num=1: count=0\n- num=1: cand=1, count=1\n- num=2: count=0\n- num=2: cand=2, count=1.\nFinal candidate = 2.",
    timeComplexity: "O(N) — single pass.",
    spaceComplexity: "O(1) auxiliary space.",
    edgeCases: "Array of size 1; all elements identical."
  },
  {
    num: 9,
    title: "Check Palindrome",
    topic: "Strings",
    statement: "Determine whether a string is a palindrome.",
    example: "Input: \"radar\"\nOutput: true",
    approach: "Two pointers inwards.",
    code: `public class CapgeminiPalindrome {
    public static boolean isPal(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isPal("radar")); // true
    }
}`,
    dryRun: "r=r, a=a, d=d -> true.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Single character."
  },
  {
    num: 10,
    title: "Check Anagrams",
    topic: "Strings",
    statement: "Check if two strings are anagrams of each other.",
    example: "Input: \"debitcard\", \"badcredit\"\nOutput: true",
    approach: "Frequency counter of 26 letters.",
    code: `public class CapgeminiAnagram {
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
        System.out.println(isAnagram("debitcard", "badcredit")); // true
    }
}`,
    dryRun: "All letter frequencies match.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "Length mismatch."
  },
  {
    num: 11,
    title: "Count the Frequency of Each Character",
    topic: "Hashing",
    statement: "Count occurrences of every character in order of appearance.",
    example: "Input: \"capgemini\"\nOutput: c:1, a:1, p:1, g:1, e:1, m:1, i:2, n:1",
    approach: "LinkedHashMap for order preservation.",
    code: `import java.util.*;

public class CapgeminiCharFreq {
    public static void printFrequencies(String s) {
        Map<Character, Integer> map = new LinkedHashMap<>();
        for (char c : s.toCharArray()) map.put(c, map.getOrDefault(c, 0) + 1);
        for (Map.Entry<Character, Integer> e : map.entrySet()) {
            System.out.print(e.getKey() + ":" + e.getValue() + " ");
        }
        System.out.println();
    }
    public static void main(String[] args) {
        printFrequencies("capgemini"); // c:1 a:1 p:1 g:1 e:1 m:1 i:2 n:1
    }
}`,
    dryRun: "'i' appears twice, others once.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(K).",
    edgeCases: "Empty string."
  },
  {
    num: 12,
    title: "Remove Spaces and Special Characters",
    topic: "Strings",
    statement: "Given a string s, remove all spaces and special characters, leaving only lowercase/uppercase English letters and digits.",
    example: "Input: \"Capgemini @ 2026 # Exceller!\"\nOutput: \"Capgemini2026Exceller\"",
    approach: "Traverse characters and append to StringBuilder only if Character.isLetterOrDigit(c) is true.",
    code: `public class CleanString {
    public static String clean(String s) {
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        String s = "Capgemini @ 2026 # Exceller!";
        System.out.println("Cleaned: " + clean(s)); // Capgemini2026Exceller
    }
}`,
    dryRun: "Filters out ' ', '@', '#', '!'. Keeps only alphanumeric characters.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N) for output.",
    edgeCases: "String with no letters/digits (returns \"\"); already clean string."
  },
  {
    num: 13,
    title: "Find the First Non-Repeating Character",
    topic: "Hashing",
    statement: "Return index of first non-repeating character in string.",
    example: "Input: \"geeksforgeeks\"\nOutput: 5 ('f')",
    approach: "Count array + second pass.",
    code: `public class CapgeminiFirstUnique {
    public static int firstUniqChar(String s) {
        int[] freq = new int[256];
        for (char c : s.toCharArray()) freq[c]++;
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i)] == 1) return i;
        }
        return -1;
    }
    public static void main(String[] args) {
        System.out.println(firstUniqChar("geeksforgeeks")); // 5 ('f')
    }
}`,
    dryRun: "'f' at index 5 is first unique character.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "All repeating."
  },
  {
    num: 14,
    title: "Reverse Words in a Sentence",
    topic: "Strings",
    statement: "Reverse words in sentence.",
    example: "Input: \"Consulting Technology Services\"\nOutput: \"Services Technology Consulting\"",
    approach: "Split by space, traverse in reverse.",
    code: `public class CapgeminiReverseWords {
    public static String reverseWords(String s) {
        String[] w = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = w.length - 1; i >= 0; i--) {
            sb.append(w[i]).append(i == 0 ? "" : " ");
        }
        return sb.toString();
    }
    public static void main(String[] args) {
        System.out.println(reverseWords("Consulting Technology Services"));
    }
}`,
    dryRun: "Services Technology Consulting.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Single word."
  },
  {
    num: 15,
    title: "Binary Search",
    topic: "Searching",
    statement: "Search sorted array in O(log N).",
    example: "Input: [1, 3, 5, 7, 9], target = 7\nOutput: 3",
    approach: "low, high, mid calculation.",
    code: `public class CapgeminiBinarySearch {
    public static int search(int[] arr, int target) {
        int l = 0, h = arr.length - 1;
        while (l <= h) {
            int m = l + (h - l) / 2;
            if (arr[m] == target) return m;
            if (arr[m] < target) l = m + 1;
            else h = m - 1;
        }
        return -1;
    }
    public static void main(String[] args) {
        System.out.println(search(new int[]{1, 3, 5, 7, 9}, 7)); // 3
    }
}`,
    dryRun: "mid=2 (5) < 7 -> l=3. mid=3 (7) == 7 -> index 3.",
    timeComplexity: "O(log N).",
    spaceComplexity: "O(1).",
    edgeCases: "Not found (-1)."
  },
  {
    num: 16,
    title: "Merge Sort",
    topic: "Sorting",
    statement: "Implement Merge Sort algorithm using Divide and Conquer.",
    example: "Input: [38, 27, 43, 3, 9, 82, 10]\nOutput: [3, 9, 10, 27, 38, 43, 82]",
    approach: "Divide: recursively split array into two halves at mid.\nConquer: sort both halves.\nCombine: merge the two sorted halves using temporary buffer array in O(N) time.",
    code: `import java.util.Arrays;

public class MergeSortAlgorithm {
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        int[] L = new int[n1];
        int[] R = new int[n2];

        for (int i = 0; i < n1; i++) L[i] = arr[left + i];
        for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else arr[k++] = R[j++];
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(arr, 0, arr.length - 1);
        System.out.println("Sorted: " + Arrays.toString(arr));
        // [3, 9, 10, 27, 38, 43, 82]
    }
}`,
    dryRun: "Recursively divides down to single elements and merges up in sorted order.",
    timeComplexity: "O(N log N) in all cases (best, average, worst).",
    spaceComplexity: "O(N) auxiliary space.",
    edgeCases: "Already sorted array; reverse sorted; single element."
  },
  {
    num: 17,
    title: "Merge Two Sorted Arrays",
    topic: "Arrays",
    statement: "Merge two sorted arrays into one.",
    example: "Input: [1, 2, 4] and [1, 3, 4]\nOutput: [1, 1, 2, 3, 4, 4]",
    approach: "Two pointers stepping through sorted lists.",
    code: `import java.util.Arrays;

public class CapgeminiMergeArrays {
    public static int[] merge(int[] a, int[] b) {
        int[] res = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) res[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
        while (i < a.length) res[k++] = a[i++];
        while (j < b.length) res[k++] = b[j++];
        return res;
    }
    public static void main(String[] args) {
        System.out.println(Arrays.toString(merge(new int[]{1, 2, 4}, new int[]{1, 3, 4})));
    }
}`,
    dryRun: "[1, 1, 2, 3, 4, 4].",
    timeComplexity: "O(A + B).",
    spaceComplexity: "O(A + B).",
    edgeCases: "Empty array."
  },
  {
    num: 18,
    title: "Balanced Parentheses",
    topic: "Stack",
    statement: "Validate parentheses bracket matching.",
    example: "Input: \"{[()]}\"\nOutput: true",
    approach: "Stack push closing counterpart.",
    code: `import java.util.Stack;

public class CapgeminiBrackets {
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
        System.out.println(isValid("{[()]}")); // true
    }
}`,
    dryRun: "All brackets match -> true.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Mismatched types."
  },
  {
    num: 19,
    title: "Minimum Platforms Required",
    topic: "Greedy / Sorting",
    statement: "Given arrival and departure times of all trains that reach a railway station, find the minimum number of platforms required for the railway station so that no train is kept waiting.",
    example: "Input: arr = [900, 940, 950, 1100, 1500, 1800], dep = [910, 1200, 1120, 1130, 1900, 2000]\nOutput: 3\nExplanation: Maximum of 3 trains are at the station simultaneously between 9:50 and 11:00.",
    approach: "Greedy Interval Sweep:\n1. Sort arrival times ascending: arr[].\n2. Sort departure times ascending: dep[].\n3. Use two pointers i = 0 (arrivals) and j = 0 (departures).\n4. If a train arrives before previous departs (arr[i] <= dep[j]), we need an additional platform: platforms++, i++. Update maxPlatforms = max(maxPlatforms, platforms).\n5. If a train departs (arr[i] > dep[j]), a platform becomes free: platforms--, j++.",
    code: `import java.util.Arrays;

public class MinimumPlatforms {
    public static int findPlatform(int[] arr, int[] dep) {
        Arrays.sort(arr);
        Arrays.sort(dep);

        int n = arr.length;
        int platformsNeeded = 0;
        int maxPlatforms = 0;
        int i = 0, j = 0;

        while (i < n && j < n) {
            if (arr[i] <= dep[j]) {
                platformsNeeded++;
                maxPlatforms = Math.max(maxPlatforms, platformsNeeded);
                i++;
            } else {
                platformsNeeded--;
                j++;
            }
        }
        return maxPlatforms;
    }

    public static void main(String[] args) {
        int[] arr = {900, 940, 950, 1100, 1500, 1800};
        int[] dep = {910, 1200, 1120, 1130, 1900, 2000};
        System.out.println("Min Platforms: " + findPlatform(arr, dep)); // 3
    }
}`,
    dryRun: "Sorted arr: [900, 940, 950, 1100, 1500, 1800]\nSorted dep: [910, 1120, 1130, 1200, 1900, 2000]\nTrace: arr 900 (p=1) -> dep 910 (p=0) -> arr 940 (p=1) -> arr 950 (p=2) -> arr 1100 (p=3) -> peak = 3 platforms.",
    timeComplexity: "O(N log N) — dominated by sorting the two arrays.",
    spaceComplexity: "O(1) auxiliary space.",
    edgeCases: "Arrival and departure times equal (arr[i] <= dep[j] handles departure safely by allocating platform); single train (1 platform)."
  },
  {
    num: 20,
    title: "Longest Common Subsequence",
    topic: "Dynamic Programming",
    statement: "Compute the length of the longest common subsequence.",
    example: "Input: \"stone\", \"longest\"\nOutput: 3 (\"one\")",
    approach: "2D DP matrix dp[i][j].",
    code: `public class CapgeminiLCS {
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
        System.out.println(lcs("stone", "longest")); // 3 ("one")
    }
}`,
    dryRun: "Common subsequence \"one\" has length 3.",
    timeComplexity: "O(M * N).",
    spaceComplexity: "O(M * N).",
    edgeCases: "No matching characters."
  }
];
