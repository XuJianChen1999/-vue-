/**
* 递归遍历data中的属性，并劫持数据
*/

export default class Observer {
    constructor(data) {
        this.traverse(data)
    }

    // 递归遍历data中的所有属性
    traverse(data) {

    }

    /**
     * 给传入的数据设置getter、setter
     * @param {Object} obj:给哪个对象设置 
     * @param {String} key:对象的key
     * @param {any} val : 设置的值
     */
    defineReactiveData(obj, key, val) {
        //递归遍历
    }
}