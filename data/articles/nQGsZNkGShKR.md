# 滑动窗口

### 1.无重复字符的最长字串

给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

示例 1:

输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

示例 2:

输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

示例 3:

输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。

### 思路

滑动窗口：

我们使用两个指针表示字符串中的某个子串（或窗口）的左右边界，其中左指针代表着「枚举子串的起始位置」，而右指针为 rkr_krK；

在每一步的操作中，我们会将左指针向右移动一格，表示 我们开始枚举下一个字符作为起始位置，然后我们可以不断地向右移动右指针，但需要保证这两个指针对应的子串中没有重复的字符。在移动结束后，这个子串就对应着 以左指针开始的，不包含重复字符的最长子串。我们记录下这个子串的长度；

在枚举结束后，我们找到的最长的子串的长度即为答案。

判断重复字符

在上面的流程中，我们还需要使用一种数据结构来判断 是否有重复的字符，常用的数据结构为哈希集合（即 C++ 中的 std::unordered_set，Java 中的 HashSet，Python 中的 set, JavaScript 中的 Set）。在左指针向右移动的时候，我们从哈希集合中移除一个字符，在右指针向右移动的时候，我们往哈希集合中添加一个字符。

### 代码

```c++
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> occ;
        int n=s.size();

        int rk=-1,ans=0;
        for(int i=0;i<n;i++){
            if(i!=0){
                occ.erase(s[i-1]);
            }

            while(rk+1<n && !occ.count(s[rk+1])){
                occ.insert(s[rk+1]);
                ++rk;
            }
            ans=max(ans,rk-i+1);

        }
        return ans;

    }
};
```



### 字符串的排列

给你两个字符串 s1 和 s2 ，写一个函数来判断 s2 是否包含 s1 的排列。如果是，返回 true ；否则，返回 false 。

换句话说，s1 的排列之一是 s2 的 子串 。

 

示例 1：

输入：s1 = "ab" s2 = "eidbaooo"
输出：true
解释：s2 包含 s1 的排列之一 ("ba").

示例 2：

输入：s1= "ab" s2 = "eidboaoo"
输出：false

### 代码

```c++
class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        
         int len = s1.length();
        if(len > s2.length())   return false;
        vector<int> res1(26, 0);
        vector<int> res2(26, 0);
        for(int i = 0; i < len; i++)
        {
            ++res1[s1[i] - 'a'];
            ++res2[s2[i] - 'a'];
        }
        if(res1 == res2)    return true;
        for(int i = len; i < s2.length(); i++)
        {
            --res2[s2[i - len] - 'a'];
            ++res2[s2[i] - 'a'];
            if(res1 == res2)    return true;
        }
        return false;
        }


        

    };

```

