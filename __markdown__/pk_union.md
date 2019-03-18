# 联合主键和复合主键

## 联合主键

当两个数据表形成的是多对多的关系，那么需要通过两个数据表的主键来组成联合主键，就可以确定每个数据表的其中一条记录了

学生表

``` sql
create teble student (
	id mediumint auto_increment comment '主键',
	name varchar(30) comment '姓名',
	age smallint comment '年龄',
	pirmary key(id)
)
engine = myisam,
charset = utf8,
comment = '学生'
```

``` sql
create table course(
id mediumint  auto_increment comment '主键id',
name varchar(30) comment '课程名称',
primary key(id)
)
engine = myisam,
charset = utf8,
comment = '课程'
```

``` sql
create table IF NOT EXISTS stu_cour(
id mediumint  auto_increment comment '主键id',
stu_id mediumint comment '学生表id',
cour_id mediumint comment '课程表id',
primary key(id)
)
engine = myisam,
charset = utf8,
comment = '学生课程表'
```

此时，就可以通过学生课程表的id来获取对应的学生表和课程表的一条记录信息，此时，学生课程表的id就是联合主键的结果

## 复合主键

在一个数据表中通过多个字段作为主键来确定一条记录，那么，多个字段组成的就是复合主键 
例：

``` sql
create table student(
name varchar(30) comment '姓名',
age smallint comment '年龄',
sex enum('男','女') comment '性别',
primary key(name,age)
)
engine = myisam,
charset = utf8,
comment = '学生'
```

以上信息如果用姓名或年龄来确定都可能出现同名和同龄的情况，但是加入把他们都设置成主键的话，意味着既要同龄也要同名，这张情况就很少了，所以以这两个字段作为复合主键来使用。


