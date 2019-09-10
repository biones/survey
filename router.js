import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Survey from "@/components/Survey.vue"
import Surveyv2 from "@/components/Surveyv2.vue"
import Createsurvey from "./views/Createsurvey.vue"
import Edit from "@/components/Edit.vue"
import result from "@/views/result.vue"

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path:"/survey/:sid",
      component:Survey
    },
    {
      path:"/survey/v2/:sid",
      component:Surveyv2
    },
    {
      path:"/result",
      name:"result",
      component:result
    },
    {
      path:"/create",
      component:Createsurvey
    },
    {
      path:"/edit",
      name:"edit",
      component:Edit
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
