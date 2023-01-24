import { createApp, VueElement } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "./assets/main.css"
import axios from 'axios'

if (process.env.NODE_ENV !== 'production') {
    axios.defaults.baseURL = 'http://localhost:8080'
}
axios.defaults.withCredentials = true

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')