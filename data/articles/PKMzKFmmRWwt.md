# 双指针法

## 1.有序数组的平方

给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。

 

示例 1：

输入：nums = [-4,-1,0,3,10]
输出：[0,1,9,16,100]
解释：平方后，数组变为 [16,1,0,9,100]
排序后，数组变为 [0,1,9,16,100]

示例 2：

输入：nums = [-7,-3,2,3,11]
输出：[4,9,9,49,121]



## 思路： 双指针法

数组其实是有序的， 只不过负数平方之后可能成为最大数了。

那么数组平方的最大值就在数组的两端，不是最左边就是最右边，不可能是中间。

此时可以考虑双指针法了，i指向起始位置，j指向终止位置。

定义一个新数组result，和A数组一样的大小，让k指向result数组终止位置。

如果`A[i] * A[i] < A[j] * A[j]`  那么`result[k--] = A[j] * A[j];`  。

如果`A[i] * A[i] >= A[j] * A[j]` 那么`result[k--] = A[i] * A[i];` 。

## 代码：

class Solution {

public:

  vector<int> sortedSquares(vector<int>& nums) {

​    int i=0;

​    int j=nums.size()-1;

​    int k=nums.size()-1;

​    //int temp[nums.size()];

​    vector<int> temp(nums.size(),0);

​    while(i<=j){

​      if(nums[i]*nums[i]<nums[j]*nums[j]){

​        temp[k]=nums[j]*nums[j];

​        j--;

​        k--;

​      }else{

​        temp[k]=nums[i]*nums[i];

​        i++;

​        k--;

​      }

​    }

​    return temp;



  }

};





## 2.轮转数组

给你一个数组，将数组中的元素向右轮转 k 个位置，其中 k 是非负数。

 

示例 1:

输入: nums = [1,2,3,4,5,6,7], k = 3
输出: [5,6,7,1,2,3,4]
解释:
向右轮转 1 步: [7,1,2,3,4,5,6]
向右轮转 2 步: [6,7,1,2,3,4,5]
向右轮转 3 步: [5,6,7,1,2,3,4]

示例 2:

输入：nums = [-1,-100,3,99], k = 2
输出：[3,99,-1,-100]
解释: 
向右轮转 1 步: [99,-1,-100,3]
向右轮转 2 步: [3,99,-1,-100]

## 思路：

该方法基于如下的事实：当我们将数组的元素向右移动 kkk 次后，尾部 k mod nk\bmod nkmodn 个元素会移动至数组头部，其余元素向后移动 k mod nk\bmod nkmodn 个位置。

该方法为数组的翻转：我们可以先将所有元素翻转，这样尾部的 k mod nk\bmod nkmodn 个元素就被移至数组头部，然后我们再翻转 [0,k mod n−1][0, k\bmod n-1][0,kmodn−1] 区间的元素和 [k mod n,n−1][k\bmod n, n-1][kmodn,n−1] 区间的元素即能得到最后的答案。

我们以 n=7n=7n=7，k=3k=3k=3 为例进行如下展示：

操作 	结果
原始数组 	1 2 3 4 5 6 71~2~3~4~5~6~71 2 3 4 5 6 7
翻转所有元素 	7 6 5 4 3 2 17~6~5~4~3~2~17 6 5 4 3 2 1
翻转 [0,k mod n−1][0, k\bmod n - 1][0,kmodn−1] 区间的元素 	5 6 7 4 3 2 15~6~7~4~3~2~15 6 7 4 3 2 1
翻转 [k mod n,n−1][k\bmod n, n - 1][kmodn,n−1] 区间的元素 	5 6 7 1 2 3 45~6~7~1~2~3~45 6 7 1 2 3 4



## 代码

class Solution {

public:

   void reverse(vector<int>& nums, int start, int end) {

​    while (start < end) {

​      swap(nums[start], nums[end]);

​      start += 1;

​      end -= 1;

​    }

  }



  void rotate(vector<int>& nums, int k) {

​    k %= nums.size();

​    reverse(nums, 0, nums.size() - 1);

​    reverse(nums, 0, k - 1);

​    reverse(nums, k, nums.size() - 1);

  }

};



## 3.移动零

给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

请注意 ，必须在不复制数组的情况下原地对数组进行操作。

 

示例 1:

输入: nums = [0,1,0,3,12]
输出: [1,3,12,0,0]

示例 2:

输入: nums = [0]
输出: [0]

## 思路

思路及解法

使用双指针，左指针指向当前已经处理好的序列的尾部，右指针指向待处理序列的头部。

右指针不断向右移动，每次右指针指向非零数，则将左右指针对应的数交换，同时左指针右移。

注意到以下性质：

    左指针左边均为非零数；
    
    右指针左边直到左指针处均为零。

因此每次交换，都是将左指针的零与右指针的非零数交换，且非零数的相对顺序并未改变。

## 代码

class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int n = nums.size(), left = 0, right = 0;
        while (right < n) {
            if (nums[right]) {
                swap(nums[left], nums[right]);
                left++;
            }
            right++;
        }
    }
};

## 4. 两数之和 II - 输入有序数组

给你一个下标从 1 开始的整数数组 numbers ，该数组已按 非递减顺序排列  ，请你从数组中找出满足相加之和等于目标数 target 的两个数。如果设这两个数分别是 numbers[index1] 和 numbers[index2] ，则 1 <= index1 < index2 <= numbers.length 。

以长度为 2 的整数数组 [index1, index2] 的形式返回这两个整数的下标 index1 和 index2。

你可以假设每个输入 只对应唯一的答案 ，而且你 不可以 重复使用相同的元素。

你所设计的解决方案必须只使用常量级的额外空间。


示例 1：

输入：numbers = [2,7,11,15], target = 9
输出：[1,2]
解释：2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。返回 [1, 2] 。

示例 2：

输入：numbers = [2,3,4], target = 6
输出：[1,3]
解释：2 与 4 之和等于目标数 6 。因此 index1 = 1, index2 = 3 。返回 [1, 3] 。

## 代码

class Solution {

public:

  vector<int> twoSum(vector<int>& numbers, int target) {

​    int index_low=0;

​    int index_high=numbers.size()-1;



​    vector<int> result(2);



​    int temp=0;

​    while(index_low<index_high){



​      temp=target-numbers[index_low];



  

​      while(numbers[index_high]>temp){

​        index_high--;

​      }



​      if(numbers[index_high]==temp){

​        break;

​      }



​      index_low++;



​    }



​    result[0]=++index_low;

​    result[1]=++index_high;



​    return result;



  }

};

## 反转字符串

编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出。

不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。

 

示例 1：

输入：s = ["h","e","l","l","o"]
输出：["o","l","l","e","h"]

示例 2：

输入：s = ["H","a","n","n","a","h"]
输出：["h","a","n","n","a","H"]

## 思路

这题比较简单，就是一个双指针，熟悉swap函数

## 代码

class Solution {

public:

  void reverseString(vector<char>& s) {

​    int index_low=0;

​    int index_high=s.size()-1;



​    while(index_low<index_high){

​      swap(s[index_low],s[index_high]);

​      index_low++;

​      index_high--;

​    }

  }

};
