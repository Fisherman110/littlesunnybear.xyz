

# mysql基本操作

使用root账号密码验证登录mysql:

```
mysql -u root -p
```

查看数据库（只能查看有权限的数据库）：

```
show database;
```

查看数据表（需要已经打开了一个数据库）：

```
show datatable
```

打开/使用数据库：

```
use xxx;
```

新增用户：

```
create user ‘abc’@’localhost’ identified by ‘123456’;
```

授予用户(abc)某个数据库(test)的全部权限：

```
grant all privileges on test.* to ‘abc’@’%’ ;
```

数据类型：
date:2021-1-25 time:12:38:41，在/etc/mysql/mysql.conf.d里面更改数据库最大连接数量

指定端口远程登陆mysql:

```
mysql -h 192.168.1.1 -u abc -p -P 3306
```

从另一个数据库（source)复制一个表(formtable)到数据库(destination),需要用户对这两个数据库都有权限：

```
create table fromtable select * from source.fromtable;
```

插入一条数据（需要指明表名，字段名）：

```
insert into table（字段名1，字段名2，…） values（值1，值2，…）；
```

删除一条数据：

```
delete  from table where id=7;
```

更改一条数据：

```
update table set 字段名1=值1，[ ，字段名2=值2，…][ where 条件表达式 ]
```

查询数据：

```
select id,grade,gender ,name  from table [where条件表达式];
```

创建数据表：

```
create table if not exist `runoob_tbl`(
   `runoob_id` INT UNSIGNED AUTO_INCREMENT,
   `runoob_title` VARCHAR(100) NOT NULL,
   `runoob_author` VARCHAR(40) NOT NULL,
   `submission_date` DATE,
   PRIMARY KEY ( `runoob_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

收回某个用户对于数据库的权限:

```
revoke 权限1，权限2… on 数据库名.* from 用户名 @ip地址或者%
```

导出和导入数据库，数据表：

导出：

```
mysqldump -u 用户名 -p  数据库名  数据表名（如果导出数据表，则在数据库后面加数据表名） > 要导出的文件名；
```

导入：

```
source  导入的文件名；
```

查看数据表的结构：

```
desc table
```



