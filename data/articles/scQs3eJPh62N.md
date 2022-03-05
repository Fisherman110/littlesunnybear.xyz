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

```html
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



2，显示切换，属性绑定

v-show：根据表达式值的真假，切换元素的显示和隐藏，原理是修改元素的display，指令后面的内容，最终都会解析为布尔值

```html
<div id="app">
<p v-show="isShow">djfkdjkd</p>
<p v-show="age>18">dsjfkdk </p>
</div>

var app=new Vue({
el:"#app",
data:{
content:"<a href='https://littlesunnybear.com'>hello</a>",
isShow:false;
age:16,
}
})
```



v-if：根据表达式的真假切换元素的显示状态，本质是通过操纵dom元素来切换显示状态

表达式为true时，元素存在于dom树中，为false时，从dom树中移除

```html
<div id="app">
<p v-if="isShow">v-if</p>
</div>

var app=new Vue({
el:"#app",
data:{
content:"<a href='https://littlesunnybear.com'>hello</a>",
isShow:false,
}
})
```



v-bind：设置元素的属性（比如：src,title,class）(v-bin可以省略，只留下冒号)

```html
<div id="app">
<img v-bind:src="imgSrc"></img>
<img v-bind:title="imgTitle+'!'"></img>
<img v-bind:class="isShow?'show':''"></img>
</div>

var app=new Vue({
el:"#app",
data:{
isShow:false,
imgSrc:"../img.jpg",
imgTitle:"img2343",
}
})
```

3，列表循环，表单元素绑定

v-for：根据数据生成列表结构，数组经常和v-for结合使用

```html
<div id="app">
<ul>
    <li v-for:"{item,index} in arr"> 你好 {{ item }}</li>
    </ul>
</div>

var app=new Vue({
el:"#app",
data:{
//如果数组内容改变，标签会同步渲染，是响应式的
arr:[1,2,3,4,5]
}
})
```



v-on：事件绑定的方法携程函数调用的形式，可以传入自定义参数。定义方法时需要定义形式参数接收传入的实参，事件的后面跟上.修饰符可以对事件进行限制。.enter可以限制触发的按键为回车

```html
<div id="app">
    <input type="button" value="点击" @click="clicked(666,"老铁")"></input>
	<input type="text" @keyup.enter="sayHi" ></input>
</div>

var app=new Vue({
el:"#app",
data:{
},
methods:{
clicked:function(p1,p2){
console.log(p1);
console.log(p2);
},j
sayHi:function(){
alert("hello");
}
}
})
```



v-model：获取和设置表单元素的值（双向数据绑定）

```html
<div id="app">
    <input type="text" v-model="message"></input>
</div>

var app=new Vue({
el:"#app",
data:{
//双向绑定，变量改变，标签内容更新。标签内容改变，变量更新
message:"hello",
},
methods:{
}
})
```



### 网络应用

**axios**  功能强大的网络请求库

引入库：< script src="https://unpkg,com/axios/dist/axios.min.js" > < /script >

使用方法：

```javascript
	< script src="https://unpkg,com/axios/dist/axios.min.js" > < /script >
//get方法
	axios.get('http://127.0.0.1:8080/test/delUser?userId='+id)
      .then((response) => {
        console.log(response.data);//请求的返回体
      })
      .catch((error) => {
        console.log(error);//异常
      });
      
      //post方法
     axios.post('http://127.0.0.1:8080/test/login', {
            name: "admin",
            pwd: "123456"
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
```









参考教程：https://www.bilibili.com/video/BV12J411m7MG

参考网站：https://cn.vuejs.org/v2/guide/