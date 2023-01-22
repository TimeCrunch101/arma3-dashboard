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
    },
    {
      path: '/server-presets',
      name: 'Server Presets',
      component: () => import('../views/ServerPresets.vue')
    },
    {
      path: '/server-missions',
      name: 'Server Missions',
      component: () => import('../views/ServerMissions.vue')
    },
  ]
})

export default router
