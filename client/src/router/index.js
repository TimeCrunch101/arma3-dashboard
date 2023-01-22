import { createRouter, createWebHistory } from 'vue-router'
import axios from "axios"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      beforeEnter: () => {
        axios.get("/query/first-time-setup").then((res) => {
          if (res.data.serverStatus === false && res.data.error === null) {
            router.push("/first-time-setup")
          }
        }).catch((err) => {
          console.error(err.response.data)
        })
      }
    },
    {
      path: '/first-time-setup',
      name: 'FirstTimeSetup',
      component: () => import('../views/FirstTimeSetup.vue')
    }
  ]
})

export default router
