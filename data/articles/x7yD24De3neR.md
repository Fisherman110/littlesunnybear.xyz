# 二分查找

## 给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。



<code>

  int search(vector<int>& nums, int target) {

​     int low = 0, high = nums.size() - 1;

​    while (low <= high) {

​      int mid = (high - low) / 2 + low;

​      int num = nums[mid];

​      if (num == target) {

​        return mid;

​      } else if (num > target) {

​        high = mid - 1;

​      } else {

​        low = mid + 1;

​      }

​    }

​    return -1;

  }</code>



## 你是产品经理，目前正在带领一个团队开发新的产品。不幸的是，你的产品的最新版本没有通过质量检测。由于每个版本都是基于之前的版本开发的，所以错误的版本之后的所有版本都是错的。

假设你有 n 个版本 [1, 2, ..., n]，你想找出导致之后所有版本出错的第一个错误的版本。

你可以通过调用 bool isBadVersion(version) 接口来判断版本号 version 是否在单元测试中出错。实现一个函数来查找第一个错误的版本。你应该尽量减少对调用 API 的次数。

<code>

public:

  int firstBadVersion(int n) {

   int left = 1, right = n, mid = 0;

  while (left <= right)

  {

​    mid = left + ((right - left) >> 1);

​    if (isBadVersion(mid) == true)

​    {

​      if (isBadVersion(mid - 1) != true)

​        return mid;// 前一个不为bad的时候，直接返回结果

​      else

​        right = mid - 1;// 移动右指针

​    }

​    else

​      left = mid + 1;//移动左指针

  }

  return mid;//都不满足返回中间的点

  }

</code>

## 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 O(log n) 的算法。

  int searchInsert(vector<int>& nums, int target) {

​        int n = nums.size();

​    int left = 0;

​    int right = n - 1; // 定义target在左闭右闭的区间里，[left, right]

​    while (left <= right) { // 当left==right，区间[left, right]依然有效

​      int middle = left + ((right - left) / 2);// 防止溢出 等同于(left + right)/2

​      if (nums[middle] > target) {

​        right = middle - 1; // target 在左区间，所以[left, middle - 1]

​      } else if (nums[middle] < target) {

​        left = middle + 1; // target 在右区间，所以[middle + 1, right]

​      } else { // nums[middle] == target

​        return middle;

​      }

​    }

​    // 分别处理如下四种情况

​    // 目标值在数组所有元素之前 [0, -1]

​    // 目标值等于数组中某一个元素 return middle;

​    // 目标值插入数组中的位置 [left, right]，return right + 1

​    // 目标值在数组所有元素之后的情况 [left, right]， return right + 1

​    return right + 1;

  }