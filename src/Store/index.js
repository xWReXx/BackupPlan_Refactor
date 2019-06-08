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
      return new Promise( (resolve, reject) => { 
        commit('setLoading', true)
        commit('clearError')
        let slug = null
        let newUser = {}
        let newError = {
          test: 'test',
          message: 'User Name is already taken, please chose another.'
        }
        slug = slugify(payload.userName, {
        replacement: '-',
        remove: /[$*_=~.()''!\-:@]/g,
        lower: true
        })
        firebase.database().ref('users/' + slug).once('value', snapshot => {
          if (snapshot.exists()){
            console.log('name exists')
            commit('setError', newError)
            resolve()
          } else {
            console.log('user does not exist')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
              cred => {
                  newUser = {
                  userId: cred.user.uid,
                  userName: slug,
                  firstName: payload.firstName,
                  lastName: payload.firstName,
                  birthDate: payload.birthDate,
                  adress: payload.adress,
                  city: payload.city,
                  state: payload.state,
                  zip: payload.zip,
                  email: payload.email
                }
                console.log(newUser)
                commit('setUser', newUser)
                console.log('sign up complete')
                firebase.database().ref('/users/' + slug).set(newUser)
                  .then( () => {
                  commit('setLoading', false)
                  console.log('user profile uploaded')
                  resolve()
                })
                .catch( error => {
                  console.log(error)
                  resolve()
                })
              }
            )
            .catch(
              error => {
                commit('setLoading', false)
                commit('setError', error)
                console.log(error)
                resolve()
              }
            )
          }
        })
      })
      
    },
    signUserIn ({commit}, payload) {
      return new Promise( (resolve, reject) => {
        commit('setLoading', true)
        commit('clearError')
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then( () => {
              commit('setLoading', false)
              resolve()  
          })
          .catch(
            error => {
              commit('setLoading', false)
              commit('setError', error)
              console.log(error)
              resolve()  
          }
        )
        
      })  
    },
    logout({commit}) {
      firebase.auth().signOut()
      .then(() => {
        commit('setUser', null)
      })
    },
    autoSignIn ({commit}, payload){
      firebase.database().ref('users').orderByChild('userId').equalTo(payload.uid).on("value", function(snapshot) {
        snapshot.forEach( (data) => {
          const newObj = data.val()
          commit('setUser', newObj)
        })
    })
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
})
