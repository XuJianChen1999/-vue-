import Dep from "./dep.js"

// 获取到更改前的值存储起来，然后进行更新
export default class Watcher {
    /**
    * @param {*} vm: 当前vue的实例 
    * @param {*} key: data中的属性名
    * @param {*} callback: 更新视图的回调
    */
    constructor(vm, key, callback) {
        this.vm = vm
        this.key = key
        this.callback = callback

        // 将this赋值给Dep用来获取旧值
        Dep.target = this
        /**
        * 当Watcher初始化的时候，vm里面的就是旧的值，触发get()
        * 实例中的每一个值，都会被数据劫持，赋予get、set方法
        */
        this.oldVal = vm[key]
        // 避免重复添加watcher，只维护一个
        Dep.target = null
    }

    // 数据变化时，更新dom
    update() {
        //获取新的值
        let newVal = this.vm[this.key]
        //如果值没有发生改变
        console.log(newVal)
        if (this.oldVal === newVal) return
        
        this.callback(newVal)
    }
}

// Watcher初始化获取oldVal的时候，触发get方法，在get方法里面会去做哪些操作？？
    // 会去添加一些依赖


// 通过vm[key]获取oldVal前，为什么将当前实例挂在Dep上？？最后为什么又设置为null？？
    // 在添加的时候需要收集依赖，而依赖收集其实就是watcher，需要暂存当前的watcher
    // 在用完之后，加进去了，就可以设置为null了


// update在什么时候执行？？ --------》Dep.notify()