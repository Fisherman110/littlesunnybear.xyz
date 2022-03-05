# spring框架概述

# 概述

- Spring 是一个开源框架
- Spring 为简化企业级开发而生，使用 Spring，JavaBean 就可以实现很多以前要靠 EJB 才能实现的功能。同样的功能，在 EJB 中要通过繁琐的配置和复杂的代码才能够实现，而在 Spring 中却非常的优雅和简洁。
- Spring 是一个 **IOC**(DI)和 **AOP** 容器框架。
- Spring 的优良特性
  - 非侵入式：基于 Spring 开发的应用中的对象可以不依赖于 Spring 的 API
  - 依赖注入：DI——Dependency Injection，反转控制(IOC)最经典的实现。
  - 面向切面编程：Aspect Oriented Programming——AOP
  - 容器：Spring 是一个容器，因为它包含并且管理应用对象的生命周期
  - 组件化：Spring 实现了使用简单的组件配置组合成一个复杂的应用。在 Spring 中可以使用 XML 和 Java 注解组合这些对象。
- 一站式：在 IOC 和 AOP 的基础上可以整合各种企业应用的开源框架和优秀的第三方类库（实际上 Spring 自身也提供了表述层的 SpringMVC 和持久层的 Spring JDBC）。



### 使用 Spring 框架的好处

下面列出的是使用 Spring 框架主要的好处：

- 代码简单易懂、轻量级、开发人员多、维护成本低； 
- 方便解耦，利于开发。譬如说类A需要使用B的对象，通常通过new B()来获取B的对象。通过Spring，new B()后的对象放在Spring容器中，需要的时候从容器中拿就行了；
- 避免重复造轮子，Spring提供了很多企业级的模块和功能，同时能够很好的集成其他的框架。





### IOC容器

IOC(Inversion of Control)： 反转控制(控制反转)

在应用程序中的组件需要获取资源时，传统的方式是组件主动的从容器中获取所需要的资源，在这样的模式下开发人员往往需要知道在具体容器中特定资源的获取方式，增加了学习成本，同时降低了开发效率。

反转控制的思想完全颠覆了应用程序组件获取资源的传统方式：反转了资源的获取方向——改由容器主动的将资源推送给需要的组件，开发人员不需要知道容器是如何创建资源对象的，只需要提供接收资源的方式即可，极大的降低了学习成本，提高了开发的效率。这种行为也称为查找的被动形式。

DI(Dependency Injection)：依赖注入

IOC 的另一种表述方式：即组件以一些预先定义好的方式(例如：setter 方法)接受来自于容器的资源注入。相对于 IOC 而言，这种表述更直接。

IOC 容器在 Spring 中的实现

- 在通过 IOC 容器读取 Bean 的实例之前，需要先将 IOC 容器本身实例化。
- Spring 提供了 IOC 容器的两种实现方式
  - BeanFactory：IOC 容器的基本实现，是 Spring 内部的基础设施，是面向Spring 本身的，不是提供给开发人员使用的。
  - ApplicationContext：BeanFactory 的子接口，提供了更多高级特性。面向Spring 的使用者，几乎所有场合都使用 ApplicationContext 而不是底层的BeanFactory。
- ApplicationContext 的主要实现类
  - ClassPathXmlApplicationContext：对应类路径下的 XML 格式的配置文件
  - FileSystemXmlApplicationContext：对应文件系统中的 XML 格式的配置文件



**使用ioc容器的一个实例：**

创建实体类：

```java
class Student{
    private int studentId;
    private String studentName;
    private int age;
    //构造getter，setter忽略
}
```

在配置文件里面通过bean的构造器赋值：

```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd">
    <!-- 使用bean元素定义一个由IOC容器创建的对象 -->
    <!-- class属性指定用于创建bean的全类名 -->
    <!-- id属性指定用于引用bean实例的标识 -->
    <bean id="student" class="com.helloworld.bean.Student">
        <!-- 使用property子元素为bean的属性赋值 -->
        <property name="studentId" value="1001"/>
        <property name="stuName" value="Tom2015"/>
        <property name="age" value="20"/>
    </bean>
</beans>
```

通过spring的IOC容器创建Student实例

```java
//1.创建IOC容器对象
ApplicationContext iocContainer =new ClassPathXmlApplicationContext("helloworld.xml");
//2.根据id值获取bean实例对象
Student student = (Student) iocContainer.getBean("student");
//3.打印bean
System.out.println(student);
```

