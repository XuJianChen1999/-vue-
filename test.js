import Vue from './vue.js'

const vm = new Vue({
    el: '#app',
    data: {
        msg: 'hello word',
        name: 'tom',
        number: '10',
        testHtml: `<ul>
            <li>111</li>
            <li>222</li>
            <li>333</li>
        </ul>`,
        obj: {
            sex: '111',
            other: {
                address: '222'
            }
        }
    },
    methods: {
        onClickBtn() {
            alert('点击事件指令：v-on:click成功了，哈哈哈')
        }
    }
})
