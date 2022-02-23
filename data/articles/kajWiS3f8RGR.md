# JAVA多线程

### 1.线程概述

1).进程

程序（program）是对数据描述与操作的代码的集合，是应用程序执行的脚本。

进程（process）是程序的一次执行过程，是系统运行程序的基本单位。程序是静态的，进程是动态的。系统运行一个程序即是一个进程从创建、运行到消亡的过程。

多任务（multi task）在一个系统中可以同时运行多个程序，即有多个独立运行的任务，每个任务对应一个进程。

2).线程

线程（thread）：比进程更小的运行单位，是程序中单个顺序的流控制。一个进程中可以包含多个线程。

简单来讲，线程是一个独立的执行流，是进程内部的一个独立执行单元，相当于一个子程序。

一个进程中的所有线程都在该进程的虚拟地址空间中，使用该进程的全局变量和系统资源。

操作系统给每个线程分配不同的CPU时间片，在某一时刻，CPU只执行一个时间片内的线程，多个时间片中的相应线程在CPU内轮流执行。

3).多线程应用场景

VNC同时共享屏幕给多个电脑

迅雷开启多条线程一起下载

QQ同时和多个人一起视频

服务器同时处理多个客户端请求

4).并行和并发

并行就是两个任务同时运行，就是甲任务进行的同时，乙任务也在进行。(需要多核CPU)

并发是指两个任务都请求运行，而处理器只能按受一个任务，就把这两个任务安排轮流进行，由于间时间隔较短，使人感觉两个任务都在运行

5).Java程序运行原理

Java命令会启动java虚拟机(JVM)，等于启动了一个应用程序，也就是启动了一个进程。

该进程会自动启动一个 “主线程” ，然后主线程去调用某个类的 main 方法

一个应用程序有且只有一个主线程,程序员不能New主线程，可以New子线程。

6).思考:JVM启动的是多线程吗？

JVM启动至少启动了**垃圾回收线程**和**主线程**，所以是多线程的



### 2.线程的创建

每个Java程序启动后，虚拟机将自动创建一个主线程,可以通过以下两种(其实有三种)方式自定义线程类：

### 方式一:继承Thread类

**实现步骤：**

1.定义类继承Thread类

2.重写run方法

3.把新线程要做的事写在run方法中

4.创建线程对象

5.开启新线程, 内部会自动执行run方法

```java
class MyThread extends Thread{
    @Override
    public void run() {
        System.out.println("子线程任务");
    }
}
 
 
public class Demo01 {
    public static void main(String[] args) {
        /*主线程，程序员不能创建，程序员只能创建子线程*/
         
        //1.创建子线程对象
        MyThread t1 = new MyThread();
        //2.启动子线程
        t1.start();
  }
}
```

### 方式二:实现Runnable接口

**实现步骤：**

1.定义类实现Runnable接口

2.实现run方法

3.把新线程要做的事写在run方法中

4.创建自定义的Runnable的子类对象,创建Thread对象传入Runnable

5.调用start()开启新线程, 内部会自动调用Runnable的run()方法

```java
class  MyThread  implements Runnable{
    @Override
    public void run() {
        System.out.println("子线程任务");
    }
}
 
 
 
public class Demo01 {
    public static void main(String[] args) {
/*  线程实现的方式 (2) - 定义类实现Runnable接口*/
        //1.创建runable对象
        MyThread  task = new MyThread  ();
         
        //2.创建Thread对象
        Thread t1 = new Thread(task);
         
        //3.启动线程
        t1.start();
  }
}
```

### 3.匿名内部类实现线程的两种方式

```java
public static void main(String[] args) {
        new Thread(){
            public void run() {
                System.out.println("任务1...." + Thread.currentThread());
            };
        }.start();
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("任务2...." + Thread.currentThread());
            }
        }).start();
    }
}
```

### 4.线程的常用方法

1).获取当前线程的对象

currentThread()方法用于获取当前线程对象

在不同的方法中，获取的线程对象名称是有可能不一样的

在main中获取的是**主线程对象**

在子线程的run方法中获取的是**子线程对象**

2).获取线程名字和设置名字

通过Thread的getName()方法获取线程对象的名字

通过setName(String)方法可以设置线程对象的名字

通过构造函数可以传入String类型的名字

每个线程系统都会默认分配个名字,**主线程：main,****子线程thread-0 ....**

3).线程休眠

Thread.sleep(毫秒), 控制当前线程休眠若干毫秒

1秒= 1000毫秒

1秒 = 1000毫秒* 1000微妙 * 1000纳秒（1000000000 ）

4).守护线程

setDaemon(), 设置一个线程为守护线程, 该线程不会单独执行, 当其他非守护线程都执行结束后, 自动退出.

特点：男守护女，女的死，男的也不想活了

5).加入线程

join(), 当前线程暂停, 等待指定的线程执行结束后, 当前线程再继续

join(int), 可以等待指定的毫秒之后继续

6).线程让出

yield() 让出cpu

7).线程优先级

setPriority()设置线程的优先级

默认优先级是5，最小优先级1，最高优先级10

可以设置2，3，4

Thread里面有静态常量