import Vue from 'vue'
import componentTemp from './index.vue'
class customComponent {
    constructor () {
        this.com = null
        this.isInit = false
    }

    init (dom, configKv) {
    // 防止二次创建
        if (this.isInit) {
            this.com.configKv = configKv
            return
        }
        const id = `container-${dom.id}`
        const container = `<div id=${id} class="screen-main"></div>`

        dom.insertAdjacentHTML('beforeend', container)
        const parentNode = new Vue({
            el: `#${id}`,
            render: (h) => h(componentTemp)
        })
        this.com = parentNode.$children[0]
        this.com.id = dom.id
        this.com.configKv = configKv
        this.com.init()
        this.isInit = true
    }

    resize () {
        this.com.resize()
    }

    setStyle (key, value) {
        this.com.setStyle(key, value)
    }

    setData (data) {
        this.com.setData(data)
    }

    destroy () {
        this.com.destroy()
    }
}

export default customComponent
