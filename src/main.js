import { createApp, VueElement } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "./assets/main.css"
import axios from 'axios'
// axios.defaults.withCredentials = true
// if (process.env.NODE_ENV === 'development') {
// } else {
//     axios.defaults.baseURL = 'https://192.168.60.103:8443'
// }
axios.defaults.baseURL = 'https://192.168.60.103:8443'
axios.defaults.withCredentials

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')