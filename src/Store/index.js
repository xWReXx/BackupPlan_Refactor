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
    updateUserProfile(state, payload) {
      console.log('saving profile changes in vuex')
      state.user.firstName = payload.firstName
      state.user.lastName = payload.lastName
      state.user.birthDate = payload.birthDate
      state.user.email = payload.email
      state.user.address = payload.address
      state.user.city = payload.city
      state.user.state = payload.state
      state.user.zip = payload.zip
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
      return new Promise( (resolve) => { 
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
            commit('setError', newError)
            resolve()
          } else {
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
              cred => {
                  newUser = {
                  userId: cred.user.uid,
                  userName: slug,
                  firstName: payload.firstName,
                  lastName: payload.lastName,
                  birthDate: payload.birthDate,
                  address: payload.address,
                  city: payload.city,
                  state: payload.state,
                  zip: payload.zip,
                  email: payload.email,
                  profileImageUrl: 'https://firebasestorage.googleapis.com/v0/b/backupplan-ab4c1.appspot.com/o/default-profile-pic.png?alt=media&token=9c25dd85-a2cb-4daf-bfd4-278ce580e368'
                }
                commit('setUser', newUser)
                firebase.database().ref('/users/' + slug).set(newUser)
                  .then( () => {
                  commit('setLoading', false)
                  resolve()
                })
                .catch( error => {
                  commit('setError', error)
                  resolve()
                })
              }
            )
            .catch(
              error => {
                commit('setLoading', false)
                commit('setError', error)
                resolve()
              }
            )
          }
        })
      })
      
    },
    signUserIn ({commit}, payload) {
      return new Promise( (resolve) => {
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
    autoSignIn ({commit, getters}, payload){
      firebase.database().ref('users').orderByChild('userId').equalTo(payload.uid).on("value", function(snapshot) {
        snapshot.forEach( (data) => {
          const newObj = data.val()
          commit('setUser', newObj)
          console.log(getters.user)
        })
    })
    },
    saveProfileChanges({commit, getters}, payload) {
      console.log('setting profile changes')
      commit('setLoading', true)
      commit('clearError')
      const userName = getters.user.userName
      const savedProfileChanges = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        birthDate: payload.birthDate,
        email: payload.email,
        address: payload.address,
        city: payload.city,
        state: payload.state,
        zip: payload.zip
      }
      console.log('updating profile changes')
      firebase.database().ref('users/' + userName).update(savedProfileChanges).then( () => {
        commit('updateUserProfile', payload)
        commit('setLoading', false)
        console.log('profile changes sucess')
      })
      .catch( (error) => {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      })
    },
    uploadProfileImage ({getters}, payload) {
      let imageUrl
      firebase.storage().ref('/' + getters.user.userName + '/profilePicture/' + payload.name).put(payload.file)
        .then(uploadTaskSnapshot => {
          return uploadTaskSnapshot.ref.getDownloadURL()
        })
        .then(downloadUrl => {
          imageUrl = downloadUrl
          const userName = getters.user.userName
          firebase.database().ref('users/' + userName).update({profileImageUrl: imageUrl})
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
