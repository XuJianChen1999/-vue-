/**
* 发布订阅模式；存储所有观察者，通知相关；
* 每个watcher都有一个update
* 数据改变的时候，通知subs里面的每个watcher实例，触发update()
*/
export default class Dep {
    constructor() {
        //存储所有观察者
        this.subs = []
    }

    // 添加观察者
    addSub(watcher) {
        // 如果有watcher并且存在update方法
        if (watcher && watcher.update) {
            this.subs.push(watcher)
        }
    }

    //发送通知
    notify() {
        this.subs.forEach(watcher => {
            // 通知subs里面的每个watcher实例，触发update(),更新视图
            watcher.update()
        })
    }
}

// Dep在哪里实例化？在哪里addSubs？
    // Dep是在Observer类里面实例化的
    // 在getter的时候收集依赖----》addSubs
    // 在setter的时候派发更新----》notify


// Dep notify在哪里调用？
    // 在setter里面调用