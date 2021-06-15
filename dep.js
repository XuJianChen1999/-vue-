/**
* 发布订阅模式；存储所有观察者，通知相关；
* 每个watcher都有一个update
* 数据改变的时候，通知subs里面的每个watcher实例，触发update
*/
export default class Dep {
    constructor() {
        //存储所有观察者
        this.subs = []
    }

    // 添加观察者
    addSubs(watcher) {
        // 如果有watcher并且存在update方法
        if (watcher && watcher.updated) {
            this.subs.push(watcher)
        }
    }

    //发送通知
    notify() {

    }
}