module.exports = [
  {
    num: 1,
    title: "Find the Missing Number",
    topic: "Arrays",
    targetLevel: "Easy",
    statement: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    example: "Input: nums = [9,6,4,2,3,5,7,0,1]\nOutput: 8",
    approach: "Use XOR bitwise logic or Gauss summation sum = n*(n+1)/2 - sum(nums). XOR is preferred to avoid 32-bit integer overflow.",
    code: `public class InfosysMissingNumber {
    public static int missingNumber(int[] nums) {
        int xor = 0;
        for (int i = 0; i <= nums.length; i++) xor ^= i;
        for (int num : nums) xor ^= num;
        return xor;
    }

    public static void main(String[] args) {
        int[] nums = {9, 6, 4, 2, 3, 5, 7, 0, 1};
        System.out.println("Missing Number: " + missingNumber(nums)); // 8
    }
}`,
    dryRun: "All numbers from 0 to 9 XORed with array elements -> all match except 8. Output: 8.",
    timeComplexity: "O(N) — single pass.",
    spaceComplexity: "O(1) extra space.",
    edgeCases: "Missing 0; missing n; n = 1."
  },
  {
    num: 2,
    title: "Remove Duplicates from an Array",
    topic: "Arrays",
    targetLevel: "Easy",
    statement: "Given a sorted integer array nums, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements k.",
    example: "Input: nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]\nOutput: k = 5, nums = [0, 1, 2, 3, 4, ...]",
    approach: "Two pointers: 'insertIdx' points to the position of the next unique element. Traverse 'i' from 1 to n-1. If nums[i] != nums[insertIdx], increment insertIdx and set nums[insertIdx] = nums[i].",
    code: `import java.util.Arrays;

public class RemoveDuplicatesSorted {
    public static int removeDuplicates(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        int insertIdx = 0;

        for (int i = 1; i < nums.length; i++) {
            if (nums[i] != nums[insertIdx]) {
                insertIdx++;
                nums[insertIdx] = nums[i];
            }
        }
        return insertIdx + 1;
    }

    public static void main(String[] args) {
        int[] nums = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
        int k = removeDuplicates(nums);
        System.out.println("Unique count: " + k);
        System.out.println("Array slice: " + Arrays.toString(Arrays.copyOfRange(nums, 0, k)));
    }
}`,
    dryRun: "nums=[0,0,1,1,1,2,2,3,3,4]. Unique elements placed at index 0..4: [0, 1, 2, 3, 4]. Return 5.",
    timeComplexity: "O(N) — linear scan.",
    spaceComplexity: "O(1) in-place.",
    edgeCases: "Array of length 0 or 1; all elements identical; no duplicates."
  },
  {
    num: 3,
    title: "Two Sum",
    topic: "Arrays / Hashing",
    targetLevel: "Easy",
    statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example: "Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]",
    approach: "Hash map lookup: For each element x at index i, complement = target - x. Check if complement exists in map; if so return [map.get(complement), i].",
    code: `import java.util.*;

public class InfosysTwoSum {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[]{map.get(comp), i};
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        System.out.println(Arrays.toString(twoSum(nums, 9))); // [0, 1]
    }
}`,
    dryRun: "nums=[2, 7, 11, 15], target=9 -> 9-7=2 in map -> [0, 1].",
    timeComplexity: "O(N).",
    spaceComplexity: "O(N).",
    edgeCases: "Duplicate numbers; negative numbers."
  },
  {
    num: 4,
    title: "Maximum Subarray Sum",
    topic: "Kadane's algorithm",
    targetLevel: "Easy–Medium",
    statement: "Find the contiguous subarray within an array (containing at least one number) which has the largest sum.",
    example: "Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6",
    approach: "Kadane's algorithm: curr = max(num, curr + num), max = max(max, curr).",
    code: `public class InfosysMaxSubarray {
    public static int maxSubArray(int[] nums) {
        int curr = nums[0], max = nums[0];
        for (int i = 1; i < nums.length; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            max = Math.max(max, curr);
        }
        return max;
    }

    public static void main(String[] args) {
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println("Max Subarray Sum: " + maxSubArray(nums)); // 6
    }
}`,
    dryRun: "Subarray [4, -1, 2, 1] yields maximum sum = 6.",
    timeComplexity: "O(N).",
    spaceComplexity: "O(1).",
    edgeCases: "All negative numbers [-8, -3, -6, -2] (returns -2)."
  },
  {
    num: 5,
    title: "Longest Substring Without Repeating Characters",
    topic: "Sliding Window",
    targetLevel: "Medium",
    statement: "Given a string s, find the length of the longest substring without repeating characters.",
    example: "Input: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with length 3.",
    approach: "Sliding window with two pointers left and right, and a HashMap or index array tracking the most recent index of each character. When s[right] is seen at index idx >= left, advance left to idx + 1. Update maxLen = max(maxLen, right - left + 1).",
    code: `import java.util.*;

public class LongestSubstringUnique {
    public static int lengthOfLongestSubstring(String s) {
        int[] lastSeen = new int[256];
        Arrays.fill(lastSeen, -1);
        int maxLen = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen[c] >= left) {
                left = lastSeen[c] + 1;
            }
            lastSeen[c] = right;
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println("Length: " + lengthOfLongestSubstring("abcabcbb")); // 3
        System.out.println("Length: " + lengthOfLongestSubstring("pwwkew"));   // 3
    }
}`,
    dryRun: "\"abcabcbb\": window expands \"abc\" (len 3). At 'a', left moves to 1 (\"bca\"). Maximum length remains 3.",
    timeComplexity: "O(N) — right pointer moves N times.",
    spaceComplexity: "O(1) — constant size 256 array.",
    edgeCases: "Empty string (0); all characters identical \"bbbbb\" (1); all unique \"abcdef\" (6)."
  },
  {
    num: 6,
    title: "Merge Overlapping Intervals",
    topic: "Intervals",
    targetLevel: "Medium",
    statement: "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals.",
    example: "Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]",
    approach: "1. Sort intervals by start time ascending.\n2. Iterate through intervals. If current interval starts <= previous interval's end, merge them: prev.end = max(prev.end, curr.end). Otherwise, append current interval as a new interval.",
    code: `import java.util.*;

public class MergeIntervals {
    public static int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length <= 1) return intervals;
        // Sort by start time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        int[] current = intervals[0];
        merged.add(current);

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] <= current[1]) {
                // Overlap: extend end time
                current[1] = Math.max(current[1], intervals[i][1]);
            } else {
                // Disjoint interval: start new segment
                current = intervals[i];
                merged.add(current);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }

    public static void main(String[] args) {
        int[][] intervals = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
        int[][] res = merge(intervals);
        for (int[] iv : res) System.out.print(Arrays.toString(iv) + " ");
        // [[1, 6], [8, 10], [15, 18]]
    }
}`,
    dryRun: "[1, 3] and [2, 6] overlap (2 <= 3) -> merged to [1, 6]. Next is [8, 10] (8 > 6) -> separate. Output: [1, 6], [8, 10], [15, 18].",
    timeComplexity: "O(N log N) — sorting dominates.",
    spaceComplexity: "O(N) for result list.",
    edgeCases: "All intervals overlap into one; no overlaps; intervals with identical start/end."
  },
  {
    num: 7,
    title: "Search in a Rotated Sorted Array",
    topic: "Binary Search",
    targetLevel: "Medium",
    statement: "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. Must run in O(log N) time.",
    example: "Input: nums = [4, 5, 6, 7, 0, 1, 2], target = 0\nOutput: 4",
    approach: "Modified binary search: in any rotated sorted array, dividing at mid always leaves AT LEAST ONE HALF strictly sorted.\n1. Check if left half [low..mid] is sorted (nums[low] <= nums[mid]). If so, test if target lies in [nums[low], nums[mid]].\n2. Otherwise, right half [mid..high] must be sorted. Test if target lies in [nums[mid], nums[high]].\n3. Adjust low or high accordingly.",
    code: `public class RotatedBinarySearch {
    public static int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;

            // Check if left half is sorted
            if (nums[low] <= nums[mid]) {
                if (target >= nums[low] && target < nums[mid]) {
                    high = mid - 1;
                } else {
                    low = mid + 1;
                }
            } else { // Right half is sorted
                if (target > nums[mid] && target <= nums[high]) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] nums = {4, 5, 6, 7, 0, 1, 2};
        System.out.println("Index of 0: " + search(nums, 0)); // 4
        System.out.println("Index of 3: " + search(nums, 3)); // -1
    }
}`,
    dryRun: "nums=[4, 5, 6, 7, 0, 1, 2], target=0\n- low=0, high=6, mid=3 (val=7). Left half [4..7] is sorted. 0 is not in [4, 7], so low = mid+1 = 4.\n- low=4, high=6, mid=5 (val=1). Right half [1..2] sorted. nums[4]=0 < 1, high = mid-1 = 4.\n- low=4, high=4, mid=4 (val=0) == target! Returns 4.",
    timeComplexity: "O(log N) logarithmic search.",
    spaceComplexity: "O(1) auxiliary space.",
    edgeCases: "Array not rotated (original sorted); target at pivot; 1 or 2 elements array."
  },
  {
    num: 8,
    title: "Count Inversions in an Array",
    topic: "Divide and Conquer",
    targetLevel: "Medium",
    statement: "Given an array of integers, count the number of inversions. Two elements arr[i] and arr[j] form an inversion if arr[i] > arr[j] and i < j.",
    example: "Input: arr = [2, 4, 1, 3, 5]\nOutput: 3\nExplanation: Inversions are (2, 1), (4, 1), and (4, 3).",
    approach: "Enhanced Merge Sort: When merging two sorted halves [left..mid] and [mid+1..right], if arr[i] > arr[j], then because the left subarray is sorted, every element from arr[i] through arr[mid] is strictly greater than arr[j]. We can add (mid - i + 1) to inversion count in O(1) time!",
    code: `public class CountInversions {
    public static long mergeSortAndCount(int[] arr, int[] temp, int left, int right) {
        long count = 0;
        if (left < right) {
            int mid = left + (right - left) / 2;
            count += mergeSortAndCount(arr, temp, left, mid);
            count += mergeSortAndCount(arr, temp, mid + 1, right);
            count += merge(arr, temp, left, mid, right);
        }
        return count;
    }

    private static long merge(int[] arr, int[] temp, int left, int mid, int right) {
        int i = left, j = mid + 1, k = left;
        long count = 0;

        while (i <= mid && j <= right) {
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
                count += (mid - i + 1); // Key inversion logic
            }
        }
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        for (i = left; i <= right; i++) arr[i] = temp[i];

        return count;
    }

    public static void main(String[] args) {
        int[] arr = {2, 4, 1, 3, 5};
        long inv = mergeSortAndCount(arr, new int[arr.length], 0, arr.length - 1);
        System.out.println("Inversion Count: " + inv); // 3
    }
}`,
    dryRun: "[2, 4] and [1, 3, 5]\nComparing 2 > 1 -> mid - i + 1 = 1 - 0 + 1 = 2 inversions ((2,1), (4,1)).\nComparing 4 > 3 -> 1 - 1 + 1 = 1 inversion ((4,3)). Total = 3.",
    timeComplexity: "O(N log N) — same as merge sort.",
    spaceComplexity: "O(N) for auxiliary temp buffer.",
    edgeCases: "Array sorted ascending (0 inversions); array sorted descending (N*(N-1)/2 inversions)."
  },
  {
    num: 9,
    title: "Generate All Subsets (Power Set)",
    topic: "Backtracking / Recursion",
    targetLevel: "Medium",
    statement: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    example: "Input: nums = [1, 2, 3]\nOutput: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]",
    approach: "Backtracking: At each index, decide whether to include nums[index] in the current subset. Add the current subset to results, then recurse for remaining elements.",
    code: `import java.util.*;

public class SubsetsGenerator {
    public static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private static void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current));

        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);
            backtrack(nums, i + 1, current, result);
            current.remove(current.size() - 1); // backtrack
        }
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        List<List<Integer>> allSubsets = subsets(nums);
        System.out.println("Total subsets: " + allSubsets.size()); // 8
        System.out.println(allSubsets);
    }
}`,
    dryRun: "nums=[1, 2, 3]\n[] -> [1] -> [1, 2] -> [1, 2, 3] -> [1, 3] -> [2] -> [2, 3] -> [3]. Total = 2^3 = 8 subsets.",
    timeComplexity: "O(N * 2^N) — 2^N subsets generated, each taking up to O(N) copy time.",
    spaceComplexity: "O(N) recursion call stack depth.",
    edgeCases: "Empty array (returns [[]]); single element array (returns [[], [x]])."
  },
  {
    num: 10,
    title: "Generate All Permutations",
    topic: "Backtracking",
    targetLevel: "Medium",
    statement: "Given an array nums of distinct integers, return all possible permutations.",
    example: "Input: nums = [1, 2, 3]\nOutput: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]",
    approach: "In-place swapping backtracking. Fix element at index 'start', then swap it with every element from start to n-1, recurse for start + 1, and backtrack by swapping back.",
    code: `import java.util.*;

public class PermutationsGenerator {
    public static List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, result);
        return result;
    }

    private static void backtrack(int[] nums, int start, List<List<Integer>> result) {
        if (start == nums.length) {
            List<Integer> perm = new ArrayList<>();
            for (int num : nums) perm.add(num);
            result.add(perm);
            return;
        }

        for (int i = start; i < nums.length; i++) {
            swap(nums, start, i);
            backtrack(nums, start + 1, result);
            swap(nums, start, i); // backtrack
        }
    }

    private static void swap(int[] nums, int i, int j) {
        int t = nums[i];
        nums[i] = nums[j];
        nums[j] = t;
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        System.out.println(permute(nums)); // 6 permutations
    }
}`,
    dryRun: "3! = 6 permutations generated by systematically swapping each position.",
    timeComplexity: "O(N! * N) — N! permutations, each taking O(N) to add to result.",
    spaceComplexity: "O(N) recursion stack.",
    edgeCases: "Single element array [1]; array with 2 elements [1, 2]."
  },
  {
    num: 11,
    title: "Subset Sum Problem",
    topic: "Dynamic Programming",
    targetLevel: "Medium",
    statement: "Given an array of non-negative integers nums and a value target, determine if there is a subset of the given set with sum equal to given target.",
    example: "Input: nums = [3, 34, 4, 12, 5, 2], target = 9\nOutput: true\nExplanation: Subset [4, 5] has sum 9.",
    approach: "0/1 Knapsack style 1D boolean DP array. dp[j] is true if sum j can be formed. Initialize dp[0] = true. For each num in nums, iterate j backwards from target down to num: dp[j] = dp[j] || dp[j - num]. Backwards iteration ensures each element is used at most once.",
    code: `public class SubsetSum {
    public static boolean canPartition(int[] nums, int target) {
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;

        for (int num : nums) {
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        return dp[target];
    }

    public static void main(String[] args) {
        int[] nums = {3, 34, 4, 12, 5, 2};
        System.out.println("Can make 9? " + canPartition(nums, 9)); // true
        System.out.println("Can make 30? " + canPartition(nums, 30)); // false
    }
}`,
    dryRun: "target = 9, num = 4 -> dp[4]=true. num = 5 -> dp[9] = dp[9] || dp[9-5] = dp[4] = true! Return true.",
    timeComplexity: "O(N * target) pseudo-polynomial time.",
    spaceComplexity: "O(target) using 1D space-optimized DP array.",
    edgeCases: "target = 0 (always true); sum of all elements < target (false)."
  },
  {
    num: 12,
    title: "0/1 Knapsack Problem",
    topic: "Dynamic Programming",
    targetLevel: "Medium",
    statement: "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack without breaking items.",
    example: "Input: values = [60, 100, 120], weights = [10, 20, 30], W = 50\nOutput: 220\nExplanation: Take items 1 (20kg, $100) and 2 (30kg, $120) -> total weight 50kg, total value 220.",
    approach: "1D DP array dp[w] storing maximum value for weight w. For each item (weight wt, value val), iterate w backwards from W down to wt: dp[w] = max(dp[w], val + dp[w - wt]).",
    code: `public class ZeroOneKnapsack {
    public static int knapSack(int W, int[] weights, int[] values) {
        int n = weights.length;
        int[] dp = new int[W + 1];

        for (int i = 0; i < n; i++) {
            int wt = weights[i];
            int val = values[i];
            for (int w = W; w >= wt; w--) {
                dp[w] = Math.max(dp[w], val + dp[w - wt]);
            }
        }
        return dp[W];
    }

    public static void main(String[] args) {
        int[] values = {60, 100, 120};
        int[] weights = {10, 20, 30};
        int W = 50;
        System.out.println("Max Value: " + knapSack(W, weights, values)); // 220
    }
}`,
    dryRun: "W = 50\nItem 1 (10, 60) -> dp[10..50] = 60\nItem 2 (20, 100) -> dp[30..50] = 160\nItem 3 (30, 120) -> dp[50] = max(160, 120 + dp[20]=100) = 220.",
    timeComplexity: "O(N * W).",
    spaceComplexity: "O(W) 1D optimized space.",
    edgeCases: "W = 0 (returns 0); all items heavier than W (returns 0)."
  },
  {
    num: 13,
    title: "Coin Change (Fewest Coins)",
    topic: "Dynamic Programming",
    targetLevel: "Medium",
    statement: "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount, or -1 if impossible.",
    example: "Input: coins = [1, 2, 5], amount = 11\nOutput: 3\nExplanation: 11 = 5 + 5 + 1",
    approach: "Bottom-up 1D DP: dp[i] = min number of coins for amount i. Initialize dp[0] = 0 and all other dp entries to amount + 1 (infinity). For i from 1 to amount, for each coin in coins: if i >= coin, dp[i] = min(dp[i], 1 + dp[i - coin]).",
    code: `import java.util.Arrays;

public class CoinChangeDP {
    public static int coinChange(int[] coins, int amount) {
        int max = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, max);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        int[] coins = {1, 2, 5};
        System.out.println("Fewest coins for 11: " + coinChange(coins, 11)); // 3
        System.out.println("Fewest coins for 3 with [2]: " + coinChange(new int[]{2}, 3)); // -1
    }
}`,
    dryRun: "dp[0]=0, dp[1]=1 (1), dp[2]=1 (2), dp[5]=1 (5), dp[10]=2 (5+5), dp[11]=3 (5+5+1).",
    timeComplexity: "O(amount * coins.length).",
    spaceComplexity: "O(amount).",
    edgeCases: "amount = 0 (returns 0); no coin fits (returns -1)."
  },
  {
    num: 14,
    title: "Longest Common Subsequence (LCS)",
    topic: "Dynamic Programming",
    targetLevel: "Medium",
    statement: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    example: "Input: text1 = \"abcde\", text2 = \"ace\"\nOutput: 3\nExplanation: The longest common subsequence is \"ace\" and its length is 3.",
    approach: "2D DP matrix dp[i][j]: LCS of text1[0..i-1] and text2[0..j-1].\n- If text1[i-1] == text2[j-1]: dp[i][j] = 1 + dp[i-1][j-1].\n- Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
    code: `public class LongestCommonSubsequence {
    public static int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }

    public static void main(String[] args) {
        System.out.println("LCS: " + longestCommonSubsequence("abcde", "ace")); // 3
    }
}`,
    dryRun: "Match 'a' -> 1. Match 'c' -> 2. Match 'e' -> 3. Output: 3.",
    timeComplexity: "O(M * N).",
    spaceComplexity: "O(M * N) (can be optimized to O(min(M, N))).",
    edgeCases: "No common characters; identical strings; empty string."
  },
  {
    num: 15,
    title: "Longest Increasing Subsequence (LIS)",
    topic: "Dynamic Programming / Patience Sorting",
    targetLevel: "Medium",
    statement: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    example: "Input: nums = [10, 9, 2, 5, 3, 7, 101, 18]\nOutput: 4\nExplanation: The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4.",
    approach: "Patience Sorting with Binary Search (O(N log N)):\nMaintain an array 'tails' where tails[i] stores the smallest tail of all increasing subsequences of length i + 1.\nFor each num in nums, use binary search (Arrays.binarySearch) to find its insertion position in tails. If it is larger than all elements, append it; otherwise replace the first element >= num.",
    code: `import java.util.Arrays;

public class LongestIncreasingSubsequence {
    public static int lengthOfLIS(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        int[] tails = new int[nums.length];
        int size = 0;

        for (int num : nums) {
            int i = 0, j = size;
            while (i != j) {
                int mid = (i + j) / 2;
                if (tails[mid] < num) {
                    i = mid + 1;
                } else {
                    j = mid;
                }
            }
            tails[i] = num;
            if (i == size) size++;
        }
        return size;
    }

    public static void main(String[] args) {
        int[] nums = {10, 9, 2, 5, 3, 7, 101, 18};
        System.out.println("LIS Length: " + lengthOfLIS(nums)); // 4
    }
}`,
    dryRun: "nums = [10, 9, 2, 5, 3, 7, 101, 18]\ntails progression: [10] -> [9] -> [2] -> [2, 5] -> [2, 3] -> [2, 3, 7] -> [2, 3, 7, 101] -> [2, 3, 7, 18]. Length = 4.",
    timeComplexity: "O(N log N) using binary search.",
    spaceComplexity: "O(N) for tails array.",
    edgeCases: "Array already sorted strictly increasing (len N); array sorted descending (len 1); duplicates."
  },
  {
    num: 16,
    title: "Number of Islands",
    topic: "Graphs / BFS & DFS",
    targetLevel: "Medium",
    statement: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
    example: "Input: grid = [\n  ['1','1','0','0','0'],\n  ['1','1','0','0','0'],\n  ['0','0','1','0','0'],\n  ['0','0','0','1','1']\n]\nOutput: 3",
    approach: "Iterate through every cell (r, c). When an unvisited land cell '1' is encountered, increment island count and trigger a DFS/BFS sink operation: recursively mark all connected land neighbors as '0' (visited) in all 4 cardinal directions.",
    code: `public class NumberOfIslands {
    public static int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        int rows = grid.length, cols = grid[0].length;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }

    private static void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') {
            return;
        }
        grid[r][c] = '0'; // Sink island
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }

    public static void main(String[] args) {
        char[][] grid = {
            {'1','1','0','0','0'},
            {'1','1','0','0','0'},
            {'0','0','1','0','0'},
            {'0','0','0','1','1'}
        };
        System.out.println("Islands: " + numIslands(grid)); // 3
    }
}`,
    dryRun: "Grid has 3 disconnected connected components of '1's. DFS completely sinks each component upon discovery. Total = 3.",
    timeComplexity: "O(M * N) — each cell visited constant times.",
    spaceComplexity: "O(M * N) in worst case recursion stack (e.g. grid completely full of '1's).",
    edgeCases: "Grid with only water '0's (returns 0); grid with all land '1's (returns 1); 1x1 grid."
  },
  {
    num: 17,
    title: "BFS and DFS Traversal of Graph",
    topic: "Graphs",
    targetLevel: "Medium",
    statement: "Given an undirected graph represented by an adjacency list and a starting source vertex 0, output its Breadth First Search (BFS) and Depth First Search (DFS) traversals.",
    example: "Input: V = 5, edges = [[0,1], [0,2], [0,3], [2,4]]\nOutput BFS: 0, 1, 2, 3, 4\nOutput DFS: 0, 1, 2, 4, 3",
    approach: "BFS uses a Queue: mark source visited, enqueue, and while queue is not empty, dequeue u, visit all unvisited neighbors, mark them visited, and enqueue.\nDFS uses Recursion (Stack): visit u, mark visited, recursively call DFS on each unvisited neighbor.",
    code: `import java.util.*;

public class GraphTraversals {
    public static List<Integer> bfs(int V, List<List<Integer>> adj) {
        List<Integer> bfsOrder = new ArrayList<>();
        boolean[] visited = new boolean[V];
        Queue<Integer> queue = new LinkedList<>();

        visited[0] = true;
        queue.add(0);

        while (!queue.isEmpty()) {
            int u = queue.poll();
            bfsOrder.add(u);
            for (int v : adj.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    queue.add(v);
                }
            }
        }
        return bfsOrder;
    }

    public static List<Integer> dfs(int V, List<List<Integer>> adj) {
        List<Integer> dfsOrder = new ArrayList<>();
        boolean[] visited = new boolean[V];
        dfsHelper(0, adj, visited, dfsOrder);
        return dfsOrder;
    }

    private static void dfsHelper(int u, List<List<Integer>> adj, boolean[] visited, List<Integer> res) {
        visited[u] = true;
        res.add(u);
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                dfsHelper(v, adj, visited, res);
            }
        }
    }

    public static void main(String[] args) {
        int V = 5;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        adj.get(0).addAll(Arrays.asList(1, 2, 3));
        adj.get(1).add(0);
        adj.get(2).addAll(Arrays.asList(0, 4));
        adj.get(3).add(0);
        adj.get(4).add(2);

        System.out.println("BFS: " + bfs(V, adj));
        System.out.println("DFS: " + dfs(V, adj));
    }
}`,
    dryRun: "BFS explores layer by layer: 0 -> {1, 2, 3} -> {4}. DFS explores deeply along branch 0->2->4 before backtracking to 3.",
    timeComplexity: "O(V + E) for both BFS and DFS.",
    spaceComplexity: "O(V) for visited array and queue/stack.",
    edgeCases: "Disconnected graph components; graph with cycles; single node graph."
  },
  {
    num: 18,
    title: "Dijkstra's Shortest Path Algorithm",
    topic: "Graphs / Shortest Path",
    targetLevel: "Medium–Hard",
    statement: "Given a weighted, directed/undirected graph and a source vertex src, find the shortest path distances from src to all other vertices. All edge weights are non-negative.",
    example: "Input: V = 4, edges = [[0,1,4], [0,2,1], [2,1,2], [1,3,1]], src = 0\nOutput distances: [0, 3, 1, 4]\nExplanation: Path 0->2 (wt 1), 0->2->1 (wt 1+2=3), 0->2->1->3 (wt 1+2+1=4).",
    approach: "Greedy algorithm with a Min-PriorityQueue of pairs (distance, vertex):\n1. Initialize dist[] to infinity, dist[src] = 0.\n2. Insert (0, src) into PQ.\n3. While PQ is not empty, extract vertex u with minimum distance. If distance is stale (d > dist[u]), skip.\n4. For each edge (u, v, weight), relax: if dist[u] + weight < dist[v], update dist[v] and insert (dist[v], v) into PQ.",
    code: `import java.util.*;

public class DijkstraShortestPath {
    static class Edge {
        int to, weight;
        Edge(int to, int weight) {
            this.to = to;
            this.weight = weight;
        }
    }

    static class Node implements Comparable<Node> {
        int vertex, dist;
        Node(int vertex, int dist) {
            this.vertex = vertex;
            this.dist = dist;
        }
        public int compareTo(Node other) {
            return Integer.compare(this.dist, other.dist);
        }
    }

    public static int[] dijkstra(int V, List<List<Edge>> adj, int src) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.add(new Node(src, 0));

        while (!pq.isEmpty()) {
            Node curr = pq.poll();
            int u = curr.vertex;
            int d = curr.dist;

            if (d > dist[u]) continue;

            for (Edge edge : adj.get(u)) {
                int v = edge.to;
                int weight = edge.weight;
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.add(new Node(v, dist[v]));
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        int V = 4;
        List<List<Edge>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        adj.get(0).add(new Edge(1, 4));
        adj.get(0).add(new Edge(2, 1));
        adj.get(2).add(new Edge(1, 2));
        adj.get(1).add(new Edge(3, 1));

        int[] res = dijkstra(V, adj, 0);
        System.out.println("Distances from 0: " + Arrays.toString(res)); // [0, 3, 1, 4]
    }
}`,
    dryRun: "dist=[0, inf, inf, inf]\n- u=0: dist[2]=1, dist[1]=4\n- u=2: dist[2]+2=3 < dist[1]=4 -> dist[1]=3\n- u=1: dist[1]+1=4 -> dist[3]=4\nFinal: [0, 3, 1, 4].",
    timeComplexity: "O((V + E) log V) with binary heap PriorityQueue.",
    spaceComplexity: "O(V + E) for adjacency list and dist array.",
    edgeCases: "Unreachable vertex (distance remains Integer.MAX_VALUE); zero-weight edges; source vertex has no outgoing edges."
  }
];
