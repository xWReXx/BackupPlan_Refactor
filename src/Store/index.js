import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import slugify from 'slugify'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: null,
    error: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    signUserUp({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      let slug = null
      console.log(payload)
      if (payload.userName && payload.email && payload.password) {
        slug = slugify(payload.userName, {
          replacement: '-',
          remove: /[$*_=~.()''!\-:@]/g,
          lower: true
        })
        console.log(slug)
        firebase.database().ref('users/' + slug).once('value')
          .then(data => {
            console.log(data)
          })
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then(
            cred => {
              commit('setLoading', false)
              console.log('succesfull')
              const newUser = {
                userId: cred.user.uid,
                userName: payload.userName,
                firstName: payload.firstName,
                lastName: payload.firstName,
                birthDate: payload.birthDate,
                adress: payload.adress,
                city: payload.city,
                state: payload.state,
                zip: payload.zip,
                email: payload.email
              }
              commit('setUser', newUser)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              commit('setError', error)
              console.log(error)
            }
          )
      }
    }
  },
  getters: {

  }
})
