import Vue from 'vue'
import App from './App.vue'
import store from './Store/index'
import router from './router'
import firebase from 'firebase'
import './plugins/vuetify'
import signupModal from  './components/Auth/signupModal'
import loginModal from  './components/Auth/loginModal'
import editProfileModal from  './components/User/editProfileModal'
import editDonaitonModal from  './components/Donations/EditDonaitonModal'
import addDonaitonModal from  './components/Donations/AddDonationModal'

Vue.config.productionTip = false
Vue.component('app-signUp', signupModal)
Vue.component('app-login', loginModal)
Vue.component('app-editProlfile', editProfileModal)
Vue.component('app-editDonation', editDonaitonModal)
Vue.component('app-addDonation', addDonaitonModal)

new Vue({
  store,
  router,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: "AIzaSyDsgz7B-bIYkZEgrPYUBqiJgh3NBd1iZ00",
      authDomain: "backupplan-ab4c1.firebaseapp.com",
      databaseURL: "https://backupplan-ab4c1.firebaseio.com",
      projectId: "backupplan-ab4c1",
      storageBucket: "backupplan-ab4c1.appspot.com",
      messagingSenderId: "523760993945",
      appId: "1:523760993945:web:a9a5e25f557c4763"
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('loadDonations')
      }
    })
  }
}).$mount('#app')
