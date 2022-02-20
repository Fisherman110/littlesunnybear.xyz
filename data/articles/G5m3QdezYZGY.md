# C++的集合介绍

## set

包含头文件 #include<set>

构造方法：
 set< T > name;
 就构造了一个存储数据T的的集合name

基本操作：

#### 插入：

name.insert(T) ;
 意为：向name集合里存入数据T
 **注意如果集合中已经存在了某个元素，再次插入不会产生任何效果，集合中是不会出现重复元素的。**

#### 删除：

name.erase（T）；
 意为：把name里的T删除
 **注意如果集合里面没有T元素将不会有任何效果！**

#### 查找：

name.count(T);
 意为：如果集合里有元素T，返回true，否则返回false
 **注意这个查找的时间复杂度大概在O(log(n))，因为它是一种线性数据结构所以能够比较快速地查出这个元素**

#### 遍历

这个写法比较固定：

```delphi
for(set< T >::iterator it=name.begin();it!=name.end();it++)
```

（it是一个指针）

可以当做模板背一下！

### 清空

name.clear(T);