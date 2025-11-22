import Vue from 'vue'
import App from './App.vue'

const app = new Vue({
    el: '#app-container',
    components: {
        App
    },
    template: '<App/>'
})

window.appInstance = app
