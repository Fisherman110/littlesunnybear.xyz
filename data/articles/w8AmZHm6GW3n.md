### 1.集合概述

Java 集合就像一种容器，可以把**多个对象的引用**放入容器中。

Java 集合类可以用于存储数量不等的多个对象，还可用于保存具有映射关系的关联数组

Java 集合可分为 Set、List 和 Map 三种体系

Set：无序、不可重复的集合

List：有序，可重复的集合

Map：具有映射关系的集合

Collection 接口是 List、Set 和 Queue 接口的父接口，该接口里定义的方法既可用于操作 Set 集合，也可用于操作 List 和 Queue 集合：

### 2.List接口

1).List接口简介

List接口为Collection直接接口。List所代表的是有序的Collection，即它用某种特定的插入顺序来维护元素顺序。用户可以对列表中每个元素的插入位置进行精确地控制，

同时可以根据元素的整数索引（在列表中的位置）访问元素，并搜索列表中的元素。实现List接口的集合主要有：ArrayList、LinkedList、Vector、Stack。

2).List集合中根据索引来操作集合元素的方法。

void add(int index, Object ele): 在index 位置插入ele 元素
boolean addAll(int index, Collection eles): 从index 位置开始将eles中的所有元素添加进来
Object get(int index): 获取指定index 位置的元素
int indexOf(Object obj): 返回obj 在集合中首次出现的位置
int lastIndexOf(Object obj): 返回obj 在当前集合中末次出现的位置
Object remove(int index): 移除指定index 位置的元素，并返回此元素
Object set(int index, Object ele): 设置指定index 位置的元素为ele
List subList(int fromIndex, int toIndex): 返回从fromIndex 到toIndex位置的子集合

2).ArrayList集合

ArrayList内部是通过数组实现的，它允许对元素进行快速随机访问。数组的缺点是每个元素之间不能有间隔，当数组大小不满足时需要增加存储能力，就要将已经有数组的数据复制到新的存储空间中。

当从ArrayList的中间位置插入或者删除元素时，需要对数组进行复制、移动、代价比较高（ArrayList在内存不够时默认是扩展50% + 1个）。因此，它适合随机查找和遍历，不适合插入和删除。

```java
public class Test3 {
    public static void main(String[] args) {
        List<String > list=new ArrayList<>();
        list.add("456");//追加到末尾
        list.add("hello");
        list.add("12311");
        list.add("12322");
        //1.for
        for(int i=0;i<list.size();i++){
            System.out.println(list.get(i));
        }
        //2.foreach
        for(String s:list){
            System.out.println(s);
        }
        //3.迭代器
        System.out.println("=============");
        Iterator<String> it = list.iterator();
        /*while (true){
            boolean b = it.hasNext();
            if(!b){
                break;
            }
            System.out.println(it.next());
        }*/
        while (it.hasNext()){
            System.out.println(it.next());
        }
    }
}
```

3).LinkedList集合

LinkedList是用双向链表结构存储数据的，很适合数据的动态插入和删除，随机访问和遍历速度比较慢。另外，他还提供了List接口中没有定义的方法，专门用于操作表头和表尾元素，可以当作堆栈、队列和双向队列使用。

新增方法：

void addFirst(Object obj)
void addLast(Object obj)
Object getFirst()
Object getLast()
Object removeFirst()
Object removeLast()

4).Vector集合

​        Vector集合底层数据结构是数组实现的，其操作和ArrayList一致，查询快，增删慢，但是其内部是线程安全，效率低。

### 3.Set接口

1).Set接口介绍

Set是Collection子接口；

Set和Collection基本上一样，一点除外：Set无法记住添加的顺序，不允许包含重复的元素。

当试图添加两个相同元素进Set集合，添加操作失败，add()方法返回false。

Set如何判断两个对象是否相等？HashSet 集合的add()方法底层依赖于双列集合Hash[Map](https://www.baidu.com/s?wd=Map&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd), 它依赖于两个方法 equals()和hashCode(); 先比较元素hashCoed的值, 再比较equals().

也就是说两个对象equals比较返回true，Set集合是不会接受这个两个对象的。

常用子类：

HashSet:散列存放

TreeSet:有序存放



2).HashSet集合

HashSet 是 Set 接口的典型实现，大多数时候使用 Set 集合时都使用这个实现类。

HashSet 按 **Hash** **算法**来存储集合中的元素，因此具有很好的存取和查找性能。

HashSet 具有以下特点：

**不能保证元素的排列顺序**

**HashSet** **不是线程安全的**

**集合元素可以是** **null**

当向 HashSet 集合中存入一个元素时，HashSet 会调用该对象的 hashCode() 方法来得到该对象的 hashCode 值，然后根据 hashCode 值决定该对象在 HashSet 中的存储位置。如果两个元素的 equals() 方法返回 true，但它们的  hashCode() 返回值不相等，hashSet 将会把它们存储在不同的位置，但依然可以添加成功。

重写 hashCode() 方法的基本原则

在程序运行时，同一个对象多次调用 hashCode() 方法应该返回相同的值。
当两个对象的 equals() 方法比较返回 true 时，这两个对象的 hashCode()方法的返回值也应相等。
对象中用作 equals() 方法比较的 Field，都应该用来计算 hashCode 值。

重写 equals() 方法的基本原则

当一个类有自己特有的“逻辑相等”概念,当改写equals()的时候，总是要改写hashCode()，根据一个类的equals方法（改写后），两个截然不同的实例有可能在逻辑上是相等的，但是，根据Object.hashCode()方法，它们仅仅是两个对象。
因此，违反了“相等的对象必须具有相等的散列码”。
结论：复写equals方法的时候一般都需要同时复写hashCode方法。通常参与计算hashCode 的对象的属性也应该参与到equals()

3).LinkedHashSet

LinkedHashSet 是 HashSet 的子类
LinkedHashSet 根据元素的 hashCode 值来决定元素的存储位置，但它同时使用双向链表维护元素的次序，这使得元素看起来是以插入顺序保存的。
LinkedHashSet插入性能略低于 HashSet，但在迭代访问 Set 里的全部元素时有很好的性能。
LinkedHashSet 不允许集合元素重复。

4).TreeSet集合

TreeSet 是 SortedSet 接口的实现类，**TreeSet** **可以确保集合元素处于排序状态**。

TreeSet底层使用 红黑树结构存储数据
新增的方法如下： (了解)

Comparator comparator()
Object first()
Object last()
Object lower(Object e)
Object higher(Object e)
SortedSet subSet(fromElement, toElement)
SortedSet headSet(toElement)
SortedSet tailSet(fromElement)

**TreeSet** **支持两种排序方法：自然排序和定制排序**。**默认情况下，****TreeSet** **采用自然排序**。

自然排序

**TreeSet** **会调用集合元素的** **compareTo****(Object** **obj****)** **方法来比较元素之间的大小关系，然后将集合元素按升序排列**

**如果试图把一个对象添加到** **TreeSet** **时，则该对象的类必须实现** **Comparable** **接口。**

实现 Comparable 的类必须实现 compareTo(Object obj) 方法，两个对象即通过 compareTo(Object obj) 方法的返回值来比较大小。

Comparable 的典型实现：

BigDecimal、BigInteger 以及所有的数值型对应的包装类：按它们对应的数值大小进行比较

Character：按字符的 UNICODE 值来进行比较

Boolean：true 对应的包装类实例大于 false 对应的包装类实例

String：按字符串中字符的 UNICODE 值进行比较

Date、Time：后边的时间、日期比前面的时间、日期大

自然排序步骤：

1.让元素自身具备比较性，

2.实现Compareable接口，覆盖其CompareTo方法

**定制****排序**

如果需要实现定制排序，则需要在创建 TreeSet 集合对象时，提供一个 Comparator 接口的实现类对象。由该 Comparator 对象负责集合元素的排序逻辑

定制排序步骤：

​        1）创建比较器,实现comparator接口

​        2）复写compare方法

​        3）在创建TreeSet集合对象时,提供一个一个Comparator对象

### 4.Map接口

1).Map接口介绍

Map 用于保存具有映射关系的数据，因此 Map 集合里保存着两组值，一组值用于保存 Map 里的 Key，另外一组用于保存 Map 里的 Value

Map 中的 key 和 value 都可以是任何引用类型的数据

**Map** **中的** **Key** **不允许重复**，即同一个 Map 对象的任何两个 Key 通过 equals 方法比较中返回 false

Key 和 Value 之间存在单向一对一关系，即通过指定的 Key 总能找到唯一的，确定的 Value。

Map接口的常用实现类：HashMap、TreeMap、LinkedHashMap和Properties。

2).HashMap集合

HashMap是 Map 接口使用频率最高的实现类。

HashMap 是基于哈希表的 Map 接口的非同步实现。此实现提供所有可选的映射操作，并允许使用 null 值和 null 键。与HashSet一样，此类不保证映射的顺序，特别是它不保证该顺序恒久不变。

HashMap 判断两个 key 相等的标准是：两个 key 通过 equals() 方法返回 true，hashCode 值也相等。

HashMap 判断两个 value相等的标准是：两个 value 通过 equals() 方法返回 true。

3).遍历HashMap

①Map集合遍历键找值方式：即通过元素中的键，获取键所对应的值

操作步骤：

1.获取Map集合中所有的键，由于键是唯一的，所以返回一个Set集合存储所有的键。

2.遍历键的Set集合，得到每一个键

3.根据键，获取键所对应的值

②Map集合遍历键值对方式：即通过集合中每个键值对（Entry）对象，获取键值对对象中的键与值

操作步骤：

1.获取Map集合中，所有的键值对(Entry)对象，以Set集合形式返回。

2.遍历包含键值对(Entry)对象的Set集合，得到每一个键值对(Entry)对象

3.通过键值对(Entry)对象，获取Entry对象中的键与值。



HashSet元素如何添加？

当向HashSet集合中存入一个元素时，HashSet会调用该对象的hashCode()方法来得到该对象的hashCode值,判断已经存储在集合中的对象的hashCode值是否与添加的对象的hashCode值一致:若不一致:直接添加进去;若一致,再进行equals方法比较,equals方法如果返回true,表明对象已经添加进去了,就不会再添加新的对象了,否则添加进去;如果我们重写了equals方法,也要重写hashCode方法,反之亦然;。

HashSet集合判断两个元素相等的标准是两个对象通过equals方法比较相等，并且两个对象的hashCode方法返回值也相等。