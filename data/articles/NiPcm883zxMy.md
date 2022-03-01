# c++智能指针

传统指针的使用：

```c++
void UseRawPointer()
{
    // Using a raw pointer -- not recommended.
    Song* pSong = new Song(L"Nothing on You", L"Bruno Mars"); 

    // Use pSong...

    // Don't forget to delete!
    delete pSong;   
}

```

智能指针：

```c++
void UseSmartPointer()
{
    // Declare a smart pointer on stack and pass it the raw pointer.
    unique_ptr<Song> song2(new Song(L"Nothing on You", L"Bruno Mars"));

    // Use song2...
    wstring s = song2->duration_;
    //...

} // song2 is deleted automatically here.
```

智能指针介绍：

- `unique_ptr`
   只允许基础指针的一个所有者。 除非你确信需要 `shared_ptr`，否则请将该指针用作 POCO 的默认选项。 可以移到新所有者（move方法），但不会复制或共享。 替换已弃用的 `auto_ptr`。 与 `boost::scoped_ptr` 比较。 `unique_ptr` 很小且高效;大小是一个指针，它支持用于从 c + + 标准库集合快速插入和检索的右值引用。 头文件：`<memory>`。 有关详细信息，请参阅 [如何：创建和使用 Unique_ptr 实例](https://docs.microsoft.com/zh-cn/cpp/cpp/how-to-create-and-use-unique-ptr-instances?view=msvc-170) 和 [unique_ptr 类](https://docs.microsoft.com/zh-cn/cpp/standard-library/unique-ptr-class?view=msvc-170)。
- `shared_ptr`
   采用引用计数的智能指针。 如果你想要将一个原始指针分配给多个所有者（例如，从容器返回了指针副本又想保留原始指针时），请使用该指针。 直至所有 `shared_ptr` 所有者超出了范围或放弃所有权，才会删除原始指针。 大小为两个指针；一个用于对象，另一个用于包含引用计数的共享控制块。 头文件：`<memory>`。 有关详细信息，请参阅 [如何：创建和使用 Shared_ptr 实例](https://docs.microsoft.com/zh-cn/cpp/cpp/how-to-create-and-use-shared-ptr-instances?view=msvc-170) 和 [shared_ptr 类](https://docs.microsoft.com/zh-cn/cpp/standard-library/shared-ptr-class?view=msvc-170)。
- `weak_ptr`
   结合 `shared_ptr` 使用的特例智能指针。 `weak_ptr` 提供对一个或多个 `shared_ptr` 实例拥有的对象的访问，但不参与引用计数。 如果你想要观察某个对象但不需要其保持活动状态，请使用该实例。 在某些情况下，需要断开 `shared_ptr` 实例间的循环引用。 头文件：`<memory>`。 有关详细信息，请参阅 [如何：创建和使用 Weak_ptr 实例](https://docs.microsoft.com/zh-cn/cpp/cpp/how-to-create-and-use-weak-ptr-instances?view=msvc-170) 和 [weak_ptr 类](https://docs.microsoft.com/zh-cn/cpp/standard-library/weak-ptr-class?view=msvc-170)。



参考链接：https://docs.microsoft.com/zh-cn/cpp/cpp/smart-pointers-modern-cpp?view=msvc-170