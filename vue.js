import Observer from "./observer.js"
import Compiler from "./compiler.js"

/*
*包括vue的构造函数，接收各种参数配置等等
*/
export default class Vue {
    // vue的配置(data，methods....)
    constructor(options = {}) {
        this.$options = options
        this.$data = options.data
        this.$methods = options.methods
        this.initRootElement(options)
        this._proxyDataInThis(this.$data)

        //实例化observer，监听数据变化
        new Observer(this.$data)
        // 解析模板表达式
        new Compiler(this)
    }

    /*
    *初始化根元素存储到vue实例。检查传入的element是否规范
    */
    initRootElement(options) {
        // 如果传入的是一个string，简单的认为是一个id或者class
        if (typeof options.el === 'string') {
            this.$el = document.querySelector(options.el)
        } else if (options.el instanceof HTMLElement) {
            //如果传入的是一个真实的html元素
            this.$el = options.el
        }
        if (!this.$el) {
            throw new Error('请传入合法的根元素')
        }
    }

    /*
    *利用Object.defineProperty将data注入到vue实例中，
    *实现通过this获取data里面的属性
    */
    _proxyDataInThis(data) {
        // 遍历data中所有的key
        Object.keys(data).forEach(key => {
            //当前this中是没有key的，通过Object.defineProperty改变this上的key
            Object.defineProperty(this, key, {
                enumerable: true,//可枚举的对象
                configurable: true,//可修改，可删除
                get() {
                    return data[key]
                },
                set(newVal) {
                    //如果数据没变化，不设置
                    if (data[key] === newVal) return
                    data[key] = newVal
                }
            })
        })
    }
}