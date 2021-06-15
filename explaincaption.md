
# 1、关于项目
在本地项目中的html文件引入js文件会跨域，vscode开发的话，只需要安装一个插件：`live service`,然后右键`open with live service`即可


# 2、vue响应式原理

了解vue的三个核心类：（class类）

**Observer**：给对象的属性添加getter、setter；用于依赖收集和派发更新

**Dep**：收集当前响应式对象 的依赖关系，每个响应式对象都有一个Dep实例。`dep.subs = watcher[]`

​			当数据发生变更的时候，通过`dep.notify()`通知各个watcher

**Watcher**：观察者对象；比如render watcher、computed watcher、user watcher



**依赖收集**

1、在初始化state，对computed属性进行初始化，会触发computed watcher 依赖收集

2、initState，对属性监听初始化的时候，会触发user watcher（自己添加的watch监听）

3、render，触发render watcher  依赖收集



**派发更新**

Object.defineProperty

1、组件中的响应数据进行修改时，会触发setter

2、数据发生变化，调用dep.notify()

3、各个wacther遍历所有的subs，调用每一个watcher的update方法



**总结原理**：**当创建vue实例的时候，vue会遍历data里面的属性，利用Object.defineProperty为属性添加getter和setter对数据读取进行劫持**

getter：依赖收集            setter：派发更新             每个组件的实例都会有对应的watcher实例



# 3、计算属性的实现原理

computed watcher计算属性的监听器，持有一个dep实例，通过dirty属性标记计算属性是否需要重新求值，当computed依赖值改变后，就会通知订阅的watcher重新更新，对于computed watcher会将dirty属性设置为true，并进行计算属性方法的调用



## 1、computed所谓的缓存是什么

计算属性是基于他的响应式依赖进行缓存的，只有依赖发生改变的时候才会重新求值



## 2、实际运用的缓存（什么时候使用）

假设有2000条数据，我们只需要出id为1的那条数据，这时候使用计算属性就可以避免重复的数据操作

```
const arr = [
	{...},
	{...},
	{...},
	{...},
	{...},
]//共2000个
data() {
	return { id: 1 }
}
computed: {
	current() {
		return arr.find(item => item.id === this.is)
	}
	//尤大建议更多的时候希望用它做一些类型或者格式的转换
	toStringId() {
		return String(this.id)
	}
}
```



## 3、以下情况，computed可用监听数据变化吗

```
<template>
	{{localMsg}}
</template>

computed: {
	getMsg() {
		return localStorage.getItem('xxx')
	}
},
onClick() {
	localStorage.setItem('xxx', 1212)
}
```

肯定是不行的，只有在data中初始化的响应式，并且经过Observer数据才能监听



## 4、watch和computed区别



computed：多是用来做一些格式的转换、格式化之类的；不适合做一些太过复杂的操作

watch： 当我监听到某个属性的时候，接下来要做什么（比如调用一些方法）；里面没有任何的缓存



# 4、nextTick原理



Vue是异步更新dom的，一旦观察到数据的变化不会立即更新，会开启一个异步的队列，把同一个event loop中观察数据变化地watcher推送进这个队列（当有多个相同的wacther的时候，只会推进一个）

在下一次事件循环的时候，Vue会清空异步队列，进行dom更新，所以dom更新是在下一次事件循环里面的(异步队列被清除时)

**Vue中异步队列的优先级**

Promise.then     >      MutationObserver      >       setImmediate        >        setTimeout



**一般时候用到？？**

在数据变化后需要执行某个操作、调用某些函数，而这个操作依赖因你数据改变而改变的dom

```
<template>
	<div v-if="loading" ref="load"></div>
	
	async showLoad() {
		this.loading = true
		console.log(this.$refs.load)//undefined，获取不到
		
		//可使用nextTick获取,也可以放在回调里面
		await Vue.nextTick()
		console.log(this.$refs.load)
	}
</template>
```



# 5、手写一个简单的vue，实现响应式原理



index.html：主页面

vue.js：vue主文件

compiler.js：编译模板，解析指令   v-if、v-show、v-model

dep.js：收集依赖关系、发布订阅

observer.js：数据劫持

watcher.js：观察者对象类
