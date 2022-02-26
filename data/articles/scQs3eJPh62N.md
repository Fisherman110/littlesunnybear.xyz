# VUE入门

介绍：vue是一个javascript框架，可以简化dom操作（学习vue需要有html,css,js的基础），vue是响应式数据驱动

演示一个vue的helloworld程序：

```html
<!DOCTYPE html>
<html>
    <head lang="en">
        <meta charset="UTF-8">
        <title>helloworld</title>
        <script href src=""></script>
        <link rel="stylesheet" type="text/css" href="demo.css">
        <style type="text/css">
        p{
            margin-left: 20px;
            color: aquamarine;
        }
        </style>
    </head>
    <body>
        <div id="hello">{{message}}</div>
 
    </body>
    <!--引入开发版本的vue依赖 -->
    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
    <script>
        var hello=new Vue({
            //挂载点，绑定数据到元素
            el:'#hello',
            data:{
                message:"helloworld"
            }
        })
        //alert("helloworld");
    </script>
</html>
```

vue语法：

1，内容绑定，事件绑定

v-text：设置标签的文本值，会覆盖文本标签所有的值

```
<div id="app">
<h2 v-text="message+‘123"></h2>
<h2>{{message}}+"dfjsk"</h2>
</div>

var app=new Vue({
el:"#app",
data:{
message:"hello vue!"
}
})
```

v-html：设置标签的innerHTML，如果绑定了的内容是html标签，会被解析成html标签

```html
<div id="app">
<p v-html="content"></p>
</div>

var app=new Vue({
el:"#app",
data:{
content:"<a href='https://littlesunnybear.com'>hello</a>"
}
})
```

v-on：为元素绑定事件

```
<div id="app">
<input type="button" value="绑定鼠标点击事件" v-on:click="click"></input>
<input type="button" value="绑定鼠标移入事件" v-on:mouseenter="click"></input>
<input type="button" value="绑定鼠标双击事件" v-on:dblclick="click"></input>
<a>{{ food }}</a>
</div>

var app=new Vue({
el:"#app",
data:{
food:"苹果",
},
methods:{
click:function(){
alert("click");
//vue绑定的数据可以动态更新，重点可以不放在更改dom元素上面
this.food="香蕉";
}
},
})
```



-p10

2，显示切换，属性绑定

v-show

v-if

v-bind

3，列表循环，表单元素绑定

v-for

v-on

v-model