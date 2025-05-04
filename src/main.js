import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/base.css'
import '@/assets/css/login.css'
import '@/assets/css/index.css'
import '@/assets/css/my.css'
import '@/assets/font/iconfont.css'

createApp(App).use(ElementPlus, { size: 'small', zIndex: 3000 }).use(router).mount('#app')
