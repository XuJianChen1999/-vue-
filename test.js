import Vue from './vue.js'

const vm = new Vue({
    el: '#app',
    data: {
        msg: 'hello word',
        name: 'tom',
        obj: {
            sex: '111',
            other: {
                address: '222'
            }
        }
    },
    methods: {
        onMsg() {
            alert('哈哈哈')
        }
    }
})

console.log(vm)