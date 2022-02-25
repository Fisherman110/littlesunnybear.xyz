# C++的集合/容器(set,vector,map)介绍

## set

包含头文件 #include < set>

构造方法：
 set< T > name;
 就构造了一个存储数据T的的集合name

### 注意点：

map和set的插入删除效率比其他序列容器高。因为set容器的所有元素都是以节点的方式来存储，其节点结构和链表差不多，所以插入删除效率很高。

在插入之后，以前的iterator不会失效，因为iterator相当于指向节点的指针，内存没有边，指针不会失效（只有删除的那个元素本身失效了），vector的每一次删除和插入，迭代其都可能失效（容器空间不够了，需要申请更大的内存，只能把以前的内存释放，复制已有数据元素到新的内存，不要使用过期的iterator）

数据元素增多的时候，set查找也很快，set中使用的是二分查找。

### 基本操作：

插入：name.insert(T) ;
 意为：向name集合里存入数据T
 **注意如果集合中已经存在了某个元素，再次插入不会产生任何效果，集合中是不会出现重复元素的。**

删除：name.erase（T）；
 意为：把name里的T删除
 **注意如果集合里面没有T元素将不会有任何效果！**

返回第一个元素：T  name.begin()

判断元素存在：name.count(T);
 意为：如果集合里有元素T，返回true，否则返回false
 **注意这个查找的时间复杂度大概在O(log(n))，因为它是一种线性数据结构所以能够比较快速地查出这个元素**

返回set容器中的元素个数：name.size()

清空，删除所有元素：name.clear()

#### 遍历

这个写法比较固定：

```delphi
for(set< T >::iterator it=name.begin();it!=name.end();it++)
```

（it是一个指针）

可以当做模板背一下！





## vector容器

包含：#include< vector>

定义：向量（Vector）是一个封装了动态大小数组的顺序容器（Sequence Container）。跟任意其它类型容器一样，它能够存放各种类型的对象。可以简单的认为，向量是一个能够存放任意类型的动态数组。

特性：

1.顺序容器中的元素按照严格的线性顺序排序。可以通过元素在序列中的位置访问对应的元素。

2.支持对序列中的任意元素进行快速直接访问，甚至可以通过指针算述进行该操作。操供了在序列末尾相对快速地添加/删除元素的操作。

3.容器使用一个内存分配器对象来动态地处理它的存储需求。

### 基本实现

### 1.构造函数

- `vector()`:创建一个空vector
- `vector(int nSize)`:创建一个vector,元素个数为nSize
- `vector(int nSize,const t& t)`:创建一个vector，元素个数为nSize,且值均为t
- `vector(const vector&)`:复制构造函数
- `vector(begin,end)`:复制[begin,end)区间内另一个数组的元素到vector中

### 2.增加函数

- `void push_back(const T& x)`:向量尾部增加一个元素X
- `iterator insert(iterator it,const T& x)`:向量中迭代器指向元素前增加一个元素x
- `iterator insert(iterator it,int n,const T& x)`:向量中迭代器指向元素前增加n个相同的元素x
- `iterator insert(iterator it,const_iterator first,const_iterator last)`:向量中迭代器指向元素前插入另一个相同类型向量的[first,last)间的数据

### 3.删除函数

- `iterator erase(iterator it)`:删除向量中迭代器指向元素
- `iterator erase(iterator first,iterator last)`:删除向量中[first,last)中元素
- `void pop_back()`:删除向量中最后一个元素
- `void clear()`:清空向量中所有元素

### 4.遍历函数

- `reference at(int pos)`:返回pos位置元素的引用
- `reference front()`:返回首元素的引用
- `reference back()`:返回尾元素的引用
- `iterator begin()`:返回向量头指针，指向第一个元素
- `iterator end()`:返回向量尾指针，指向向量最后一个元素的下一个位置
- `reverse_iterator rbegin()`:反向迭代器，指向最后一个元素
- `reverse_iterator rend()`:反向迭代器，指向第一个元素之前的位置

### 5.判断函数

- `bool empty() const`:判断向量是否为空，若为空，则向量中无元素

### 6.大小函数

- `int size() const`:返回向量中元素的个数
- `int capacity() const`:返回当前向量所能容纳的最大元素值
- `int max_size() const`:返回最大可允许的 vector 元素数量值

### 7.其他函数

- `void swap(vector&)`:交换两个同类型向量的数据
- `void assign(int n,const T& x)`:设置向量中前n个元素的值为x
- `void assign(const_iterator first,const_iterator last)`:向量中[first,last)中元素设置成当前向量元素

演示：

```c++
#include<iostream>
#include<vector>

using namespace std;
int main(){
	
	vector< vector<int> > target;
	vector<int> row1;
	
	for(int i=0;i<10;i++) row1.push_back(i);
	
	vector<int>::iterator it;
	for(it=row1.begin();it!=row1.end();it++) cout<<*it<<endl;
	
	cout<<"-----------------"<<endl;
	vector<int>::iterator it1;
	//for(int i=0;i<4;i++) it1++;
	row1.erase(row1.begin()+3);
	//for(it=row1.begin();it!=row1.end();it++) cout<<*it<<endl;
	for(int i=0;i<row1.size();i++){
		cout<<row1[i]<<endl;
	}
	
	
	cout<<"helloworld"<<endl;
}
```

**这里有个坑，直接 row1.erase(it++)会出现后面无法遍历容器的情况，只能row1.erase(row1.begin()+3)这种形式，具体原因我还没弄清楚**

**已经弄清楚了，vector在插入删除元素之后，迭代器会失效，不要使用过期的iterator**

### Map

导入头文件 #include < map> //stl头文件没有拓展名

### 介绍：

C++ 中 map 提供的是一种键值对容器，里面的数据都是成对出现的,如下图：每一对中的第一个值称之为关键字(key)，每个关键字只能在 map 中出现一次；第二个称之为该关键字的对应值。在一些程序中建立一个 map 可以起到事半功倍的效果。map中的元素自动按照key升序排序，不能使用sort函数

### 基本使用：

构造： map < int ,string> person;

添加数据(pair类型)： person.insert(pair < int ,string > (1,"zhangsan"));

添加value_type数据：person.insert(value_type(2,"lisi"));

用数组方式插入数据：person[3]="wangwu";

遍历：

```
map <int ,string> person;
map::iterator it;
it=person.begin();
while(it!=person.end()){
	cout<<it->sirse<<" "<<it->second<<endl;
	it++;
}
```

查找： iterator person.find(2)；

find()函数返回一个迭代器指向间值为key的元素，如果没有找到就返回map尾部的迭代器

删除：erase(iterator it) //通过一个条目对象删除 /erase (const Key&key)关键字删除

交换：map1.swap(map2) /swap不是一个容器中的元素交换，而是两个容器交换

