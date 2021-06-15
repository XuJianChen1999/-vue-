import Watcher from "./watcher.js"

/**
* 编译器，解析各种指令
*/
export default class Compiler {
    constructor(vm) {
        console.log(vm)
        this.vm = vm
        this.el = vm.$el
        // 很多click事件是在methods里面的，所以要拿到methods
        this.methods = vm.$methods
        this.compile(vm.$el)
    }

    // 编译模板；el：根元素
    compile(el) {
        //获取子节点；childNodes是一个伪数组，所以要先利用Array.from转为真数组
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            // 文本节点
            if (this.isTextNode(node)) {
                this.compileTextNode(node)
            } else if (this.isElementNode(node)) {
                // 元素节点
                this.compileElementNode(node)
            }

            // 有子节点，递归调用
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
            
        })
    }

    // 是否是文本节点：{{xxxxxxx}}
    isTextNode(node) {
        return node.nodeType === 3
    }

    // 是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }

    //编译文本节点：// {{xxxxxx}}
    compileTextNode(node) {
        // 获取key和value
        const reg = /\{\{(.+?)}\}/
        const value = node.textContent

        if (reg.test(value)) {
            //拿到里面小括号里面的内容并替换内容
            const key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            // 添加watcher，响应式更新视图
            new Watcher(this.vm, key, newVal => {
                node.textContent = newVal
            })
        }
    }

    // 编译元素节点
    compileElementNode(node) {
        if (node.attributes.length) {
            // 遍历元素节点的所有属性
            Array.from(node.attributes).forEach(attr  => {
                const attrName = attr.name
                if (this.isDireactive(attrName)) {
                    // 判断是什么指令：v-model、v-show、v-on:click
                    // 以：开头的指令截取前5位，否则截取前两位
                    let direactiveName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2)
                    //获取值
                    let key = attr.value
                    // 更新元素节点
                    this.update(node, key, direactiveName)
                }
            })
        }
    }

    // 判断元素属性是否是指令
    isDireactive(attrName) {
        //v-xxxxxx
        return attrName.startsWith('v-')
    }

    update(node, key, direactiveName) {
        const updateFn = this[`${direactiveName}Updater`]
        // updateFn可能存在于任何地方，需要重新绑定this
        updateFn && updateFn.call(this, node, this.vm[key], key, direactiveName)
    }

    // 解析v-text
    textUpdater(node, value, key) {
        // 更新文本内容
        node.textContent = value
        new Watcher(this.vm, key, newVal => {
            node.textContent = newVal
        })
    }

    // 解析v-model
    modelUpdater(node, value, key) {
        //主要针对的是input，input可以通过e.detail.value来获取到值
        node.value = value 
        console.log(key)
        new Watcher(this.vm, key, newVal => {
            node.value = newVal
        })
        
        //监听输入
        node.addEventListener('input', (e) => {
            // 更新当前data值
            this.vm[key] = node.value
        })
    }

    // 解析v-html
    htmlUpdater(node, value, key) {
        node.innerHTML = value
        new Watcher(this.vm, key, newVal => {
            node.innerHTML = newVal
        })
    }

    // 解析点击事件
    clickUpdater(node, value, key, direactiveName) {
        node.addEventListener(direactiveName, this.methods[key])
    }
}