import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import Profile from './views/Profile.vue'
import Donations from './views/Donations.vue'
import MyDonations from './views/MyDonations.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/donations',
      name: 'Donations',
      component: Donations
    },
    {
      path: '/mydonations',
      name: 'MyDonations',
      component: MyDonations
    },
  ]
})
