# c++的string类型

## 包含头文件

#include<string>

## 初始化

```c++
string  s;
string  s1= “helllo world”;
string s2(5,'s');
```

## 输入输出

cin>>s;

cout<<s<<endl;

## 访问

string s=’hello world";

cout<<s[3];

## 拼接

```c++
string s1 = "first ";    
string s2 = "second ";    
char *s3 = "third ";    
char s4[] = "fourth ";   
char ch = '@';    
string s5 = s1 + s2;    
string s6 = s1 + s3;    
string s7 = s1 + s4;    
string s8 = s1 + ch;
```

## 增删查改

1.插入字符（ insert (size_t pos, const string& str)）

```c++
string s1,s2,s3;
s1=s2="1234567890";
s3="aaa";
s1.insert(5,s3);
cout<<s1<<endl;
s2.insert(5,"bbb");
```

2.删除字符串( erase (size_t pos = 0, size_t len = npos);)

pos 表示要删除的子字符串的起始下标，len 表示要删除子字符串的长度。如果不指明 len 的话，那么直接删除从 pos 到字符串结束处的所有字符（此时 len = str.length - pos）

```c++
string s1,s2,s3;
s1=s2=s3"1234567890";
s2.erase(5);
s3.erase(5,3);
```

3.提取子字符串（string substr (size_t pos = 0, size_t len = npos) const;）

```
string s1="first second third";
string s2;
s2=s1.substr(6,6);
```

越界会抛出异常

4.字符串查找（size_t find (const string& str, size_t pos = 0) const;
 size_t find (const char* s, size_t pos = 0) const;）

第一个参数为待查找的子字符串，它可以是 string 字符串，也可以是C风格的字符串。第二个参数为开始查找的位置（下标）；如果不指明，则从第0个字符开始查找。

```c++
string s1="first second third";
string s2="second";
int index=s1.find(s2,5);
```

#### 3) find_first_of() 函数

find_first_of() 函数用于查找子字符串和字符串共同具有的字符在字符串中首次出现的位置。请看下面的代码：

```c++
    string s1 = "first second second third";    
    string s2 = "asecond";    
    int index = s1.find_first_of(s2);
```