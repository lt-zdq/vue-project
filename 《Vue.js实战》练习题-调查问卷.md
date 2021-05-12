# 《Vue.js实战》练习题-调查问卷

> Lilian-2021-5-12
>
> 完整代码已上传至github，直接使用的话需要修改js文件的路径

### 项目要求

##### <img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20210512101248394.png" alt="image-20210512101248394" style="zoom:33%;" />

##### 附加功能

1. 对数据校验，单选必选，多选选择两个或三个，文本输入多于10个字（原本的要求时100个），不满足这些条件时，”下一步“按钮置灰。



### 需求分析的过程

> 我也是vue的初学者，这里把自己完成项目的思路和踩过的坑分享一下。
#### 问题展示
> 有思考过把问题写在js的对象中，使用v-for动态展示出来，但是有很多问题。比如问题的类型不一样，代码的逻辑会很麻烦，工作量会很大。

但是回过头来想一下，html本来就是文本描述语言，直接在html中写问题即方便又快捷，何乐而不为呢。

代码如下，head中引入了bootstrap和vue，body中主要是问题的描述、数据绑定和后面要用到的button-group组件，然后引入了要用到的js代码。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>questionnaier practice</title>
        <!--import bootstrap-->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        <!-- 引入vue。开发环境版本，包含了有帮助的命令行警告 -->
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
        <style>
            [v-cloak]{
                display: block;
            }
        </style>
    </head>
    <body>
        <div class="container bg-light w-75 mt-5" id="app" v-cloak>
            <!--
                first page
            -->
            <div class="bg-white" v-if="pageNumber===1">
                <div class="mb-5">
                    <legend>{{pageNumber}}. Your gender:</legend>
                    <input type="radio" id="male" v-model="gender" value="male" />
                    <label for="male">Male</label>
                    <input type="radio" id="female" v-model="gender" value="female" />
                    <label for="female">Female</label>
                </div>
                <button-group v-model="pageNumber" :total="total" :not-next-page="notNextPage" :not-submit="notSubmit"></button-group>
            </div>
            <!--
                middle page
            -->
            <template class="bg-white" v-if="pageNumber !== 1 && pageNumber !== total">
                <div class="mb-5">
                    <legend>{{pageNumber}}. What fruits do you like? (choose two or three fruits)</legend>
                    <label for="o1">apple</label>
                    <input type="checkbox" id="o1" v-model="fruits" value="apple">
                    <label for="o2">peach</label>
                    <input type="checkbox" id="o2" v-model="fruits" value="peach">
                    <label for="o3">orange</label>
                    <input type="checkbox" id="o3" v-model="fruits" value="orange">
                    <label for="o4">grape</label>
                    <input type="checkbox" id="o4" v-model="fruits" value="grape">
                    <label for="o5">banana</label>
                    <input type="checkbox" id="o5" v-model="fruits" value="banana">
                </div>
                <button-group v-model="pageNumber" :total="total" :not-next-page="notNextPage" :not-submit="notSubmit"></button-group>
            </template>
            <!--
                last page
            -->
            <template class="bg-white" v-if="pageNumber === total">
                <div class="mb-5">
                    <legend>{{pageNumber}}. Introduct your self. (at least 10 words)</legend>
                    <input type="text" v-model="introduce">
                </div>
                <button-group v-model="pageNumber" :total="total" :not-next-page="notNextPage" :not-submit="notSubmit"></button-group>
            </template>
        </div>
        <script src="./src/JS/button-group.js"></script>
        <script src="./src/JS/questionnaier.js"></script>
    </body>
    </html>
```

> 补充以下v-cloak的用法：
>
> 这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 [v-cloak] { display: none } 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。
>
> 刚开始的时候没有写js部分代码，测试的时候页面怎么都显示不出来，原来是因为浏览器在等待app实例加载结束，display:none才会失效。

### 按钮

##### 按钮样式

> 首页和尾页的按钮数目和种类特殊，想过单独设置首页和尾页的按钮组件，但那样会有很多重复代码，所以使用value和total变量，来控制是否是首页或者尾页。
>
> value变量控制当前页数，使用v-model将其与子组件双向绑定

代码如下：

```html
props: {
        value: {
            type: Number,
            required: true,
            default: 1,
        },
        total: {
            type: Number,
            required: true,
        },
	  },
template: '\

    <div> \

​    <button v-show="value!==1" class="btn btn-primary mr-2" @click="lastP">上一步</button> \

​    <button v-show="value!==total" :disabled="notNextPage" class="btn btn-primary mr-2" @click="nextP">下一步</button> \

​    <button class="btn btn-primary mr-2" @click="reset">重置</button> \

​    <button v-show="value===total" :disabled="notSubmit" class="btn btn-primary mr-2" @click="submit">提交</button> \

  </div> \

​    ',
```

##### 按钮功能

翻页按钮

页数由父组件的value确定，由于子组件需要修改页数，所以在子组件中设置currentValue变量，currentValue变化时需要告知父组件

代码如下

```javascript
methods: {
        nextP: function() {
            this.currentValue++;
        },
        lastP: function() {
            this.currentValue--;
        },
      }
watch: {
        currentValue: function (val) {
            this.$emit('input', val);
        },
    },
```

提交按钮

需要将用户输入保存下来，在父组件中新加所需要的data，用v-model+value来与表单绑定，submit时读取父组件的数据。

代码如下：

```javascript
data: {
        pageNumber: 1,
        total: 3,
        gender: '',
        fruits: [],
        introduce: '',
    },
        
// 子组件methods
        submit: function () {
            let gender = this.$parent.gender;
            let fruits = this.$parent.fruits;
            let info = this.$parent.introduce;
            alert("Information:\r"+"gender: "+gender+"\rLike fruits: "+fruits+"\rIntroduce: "+info);
        },
```

重置按钮：

利用value获取当前是哪个问题，将对应的父组件数据置空

代码

```javascript
// 组件的methods
reset: function() {
            if (this.currentValue === 1) {
                this.$parent.gender = '';
            }
            if (this.currentValue === 2) {
                this.$parent.fruits = [];
            }
            if (this.currentValue === 3) {
                this.$parent.introduce = '';
            }
        },
```

##### 数据检验

用户填写的表单是在父组件中的，所以直接在父组件中验证，但是按钮是子组件，所以需要将验证结果传递给子组件，新增props notNextPage和notSubmit，将对应按钮的disable属性v-bind即可

> 这里有一个巨坑，html大小写不敏感，所以js中的notNextPage在v-bind时要写成	:not-next-page="notNextPage"，用 - 分隔，否则传递不成功。

然后在父组件中监听需要验证的数据，根据数据情况改变notNextPage和notSubmit的值

还有，在翻到新问题时“下一步”按钮需要置灰，可以在子组件的created生命周期中改变notNextPage来实现，同时更新父组件的对应变量。

代码：

```javascript
// 子组件props
notNextPage: {
            type: Boolean,
            required: true,
            default: true,
        },
        notSubmit: {
            type: Boolean,
            required: true,
            default: true,
        },
created: function () {  //每次将下一步按钮先置灰，然后更新父组件的数据，否则父组件又给改回去了
        this.currentNotNext = true;
        this.$parent.notNextPage = true;
    },
       
// 父组件data
notNextPage: true,
notSubmit: true,
// 父组件watch
watch: {
        gender: function (val) {
            if(val) {
                this.notNextPage = false;
            } else {
                this.notNextPage = true;
            }
        },
        fruits: function (val) {
            if (val.length === 2 || val.length === 3) {
                this.notNextPage = false;
            } else {
                this.notNextPage = true;
            }
        },
        introduce: function(val) {
            if (val.length >= 10) {
                this.notSubmit = false;
            } else {
                this.notSubmit = true;
            }
        },
    }
```

### 大功告成~