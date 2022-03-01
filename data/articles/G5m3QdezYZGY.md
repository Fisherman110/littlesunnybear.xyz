# c++的STL

STL是c++的标准模板库，主要包含容器，算法和迭代器三大部分

### 迭代器：

要访问顺序容器和关联容器中的元素，需要通过“迭代器（iterator）”进行。迭代器是一个变量，相当于容器和操纵容器的算法之间的中介。迭代器可以指向容器中的某个元素，通过迭代器就可以读写它指向的元素。从这一点上看，迭代器和指针类似。

 迭代器按照定义方式分成以下四种。

1) 正向迭代器，定义方法如下：

容器类名::iterator 迭代器名;

2) 常量正向迭代器，定义方法如下：

容器类名::const_iterator 迭代器名;

3) 反向迭代器，定义方法如下：

容器类名::reverse_iterator 迭代器名;

4) 常量反向迭代器，定义方法如下：

容器类名::const_reverse_iterator 迭代器名;

### 迭代器用法示例

通过迭代器可以读取它指向的元素，`*迭代器名`就表示迭代器指向的元素。通过非常量迭代器还能修改其指向的元素。

 迭代器都可以进行`++`操作。反向迭代器和正向迭代器的区别在于：

- 对正向迭代器进行`++`操作时，迭代器会指向容器中的后一个元素；
- 而对反向迭代器进行`++`操作时，迭代器会指向容器中的前一个元素。

实例：

```c++
    #include <iostream>
    #include <vector>
    using namespace std;
    int main()
    {
        vector<int> v;  //v是存放int类型变量的可变长数组，开始时没有元素
        for (int n = 0; n<5; ++n)
            v.push_back(n);  //push_back成员函数在vector容器尾部添加一个元素
        vector<int>::iterator i;  //定义正向迭代器
        for (i = v.begin(); i != v.end(); ++i) {  //用迭代器遍历容器
            cout << *i << " ";  //*i 就是迭代器i指向的元素
            *i *= 2;  //每个元素变为原来的2倍
        }
        cout << endl;
        //用反向迭代器遍历容器
        for (vector<int>::reverse_iterator j = v.rbegin(); j != v.rend(); ++j)
            cout << *j << " ";
        return 0;
    }
```





### C++的集合/容器(set,vector,map)介绍



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



### list 

定义：list是一个双向链表，每次插入或删除一个元素就配置或释放一个元素空间

常用函数模板：

**2.list中常用的函数**

**2.1list中的构造函数：**

list() 声明一个空列表；

list(const list &) 拷贝构造函数模板

list(n) 声明一个有n个元素的列表，每个元素都是由其默认构造函数T()构造出来的

list(n,val) 声明一个由n个元素的列表，每个元素都是由其复制构造函数T(val)得来的

list(n,val) 声明一个和上面一样的列表

list(first,last) 声明一个列表，其元素的初始值来源于由区间所指定的序列中的元素

------

**2.2 begin()和end()：**通过调用list容器的成员函数begin()得到一个指向容器起始位置的iterator，可以调用list容器的 end() 函数来得到list末端下一位置，相当于：int  a[n]中的第n+1个位置a[n]，实际上是不存在的，不能访问，经常作为循环结束判断结束条件使用。

------

**2.3 push_back() 和push_front()：**使用list的成员函数push_back和push_front插入一个元素到list中。其中push_back()从list的末端插入，而 push_front()实现的从list的头部插入。

------

**2.4 empty()：**利用empty() 判断list是否为空。

------

**2.5 resize()：** 如果调用resize(n)将list的长度改为只容纳n个元素，超出的元素将被删除，如果需要扩展那么调用默认构造函数T()将元素加到list末端。如果调用resize(n,val)，则扩展元素要调用构造函数T(val)函数进行元素构造，其余部分相同。

------

**2.6 clear()：** 清空list中的所有元素。

------

**2.7 front()和back()：** 通过front()可以获得list容器中的头部元素，通过back()可以获得list容器的最后一个元素。但是有一点要注意，就是list中元素是空的时候，这时候调用front()和back()会发生什么呢？实际上会发生不能正常读取数据的情况，但是这并不报错，那我们编程序时就要注意了，个人觉得在使用之前最好先调用empty()函数判断list是否为空。

------

**2.8 pop_back和pop_front()：**通过删除最后一个元素，通过pop_front()删除第一个元素；序列必须不为空，如果当list为空的时候调用pop_back()和pop_front()会使程序崩掉。

------

**2.9 assign()：**具体和vector中的操作类似，也是有两种情况，第一种是：l1.assign(n,val)将  l1中元素变为n个T(val）。第二种情况是：l1.assign(l2.begin(),l2.end())将l2中的从l2.begin()到l2.end()之间的数值赋值给l1。

------

**2.10 swap()：**交换两个链表(两个重载)，一个是l1.swap(l2); 另外一个是swap(l1,l2)，都可能完成连个链表的交换。

------

**2.11 reverse()：**通过reverse()完成list的逆置。



**2.12 merge()：**合并两个链表并使之默认升序(也可改)，l1.merge(l2，greater<int>()); 调用结束后l2变为空，l1中元素包含原来l1 和  l2中的元素，并且排好序，升序。其实默认是升序，greater<int>()可以省略，另外greater<int>()是可以变的，也可以不按升序排列。

**2.13 insert()：**在指定位置插入一个或多个元素(三个重载)：

l1.insert(l1.begin(),100); 在l1的开始位置插入100。

l1.insert(l1.begin(),2,200); 在l1的开始位置插入2个100。

l1.insert(l1.begin(),l2.begin(),l2.end());在l1的开始位置插入l2的从开始到结束的所有位置的元素。



**2.14 erase()：**删除一个元素或一个区域的元素(两个重载)

l1.erase(l1.begin()); 将l1的第一个元素删除。

l1.erase(l1.begin(),l1.end()); 将l1的从begin()到end()之间的元素删除。



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

