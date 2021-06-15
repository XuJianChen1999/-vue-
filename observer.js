import Dep from "./dep.js"
/**
* 递归遍历data中的属性，并劫持数据，给传入的数据添加getter、setter
*/
export default class Observer {
    constructor(data) {
        this.traverse(data)
    }

    // 递归遍历data中的所有属性
    traverse(data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            this.defineReactiveData(data, key, data[key])
        })
    }

    /**
     * 给传入的数据设置getter、setter
     * @param {Object} obj:给哪个对象设置 
     * @param {String} key:对象的key
     * @param {any} val : 设置的值
     */
    defineReactiveData(obj, key, val) {
        this.traverse(val)
        const that = this
        const dep = new Dep()
        // 通知所有的watcher更新
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get() {
                // 因为在watcher.js中，我们把watcher的实例赋给了Dep.target，所以这里的Dep.target就是当前值的watcher
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set(newVal) {
                if (newVal === val) return
                console.log(val)
                val = newVal
                //设置的时候可能设置的一个对象
                that.traverse(newVal)
                // 通知所有的watcher进行update 
                dep.notify()
            }
        })
    }
}