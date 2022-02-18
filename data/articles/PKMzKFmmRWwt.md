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





## 轮转数组

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

