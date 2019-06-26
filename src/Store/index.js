import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import slugify from 'slugify'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: null,
    error: null,
    loadedDonations: []
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    updateUserProfile(state, payload) {
      state.user.firstName = payload.firstName
      state.user.lastName = payload.lastName
      state.user.birthDate = payload.birthDate
      state.user.email = payload.email
      state.user.address = payload.address
      state.user.city = payload.city
      state.user.state = payload.state
      state.user.zip = payload.zip
    },
    setLoadedDonations (state, payload) {
      state.loadedDonations = payload
    },
    addDonation (state, payload) {
      state.loadedDonations.push(payload)
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
          .then((cred) => {
            const userId = cred.user.uid
            firebase.database().ref('users').orderByChild('userId').equalTo(userId).on("value", function(snapshot) {
              snapshot.forEach( (data) => {
                const newObj = data.val()
                commit('setUser', newObj)
              })
            })
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
    autoSignIn ({commit}, payload){
      
      let userId = payload.uid
      firebase.database().ref('users').orderByChild('userId').equalTo(userId).on("value", function(snapshot) {
        snapshot.forEach( (data) => {
          const newObj = data.val()
          commit('setUser', newObj) 
        })
      })
    },
    saveProfileChanges({commit, getters}, payload) {
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
      firebase.database().ref('users/' + userName).update(savedProfileChanges).then( () => {
        commit('updateUserProfile', payload)
        commit('setLoading', false)
      })
      .catch( (error) => {
        commit('setLoading', false)
        commit('setError', error)
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
        .catch( (error) => {
          commit('setLoading', false)
          commit('setError', error)
        })
    },
    loadDonations({commit}) {
      commit('setLoading', true)
      firebase.database().ref('donations').once('value')
        .then((data) => {
          const donations = []
          const obj = data.val()
          for (let key in obj) {
            donations.push({
              adress: obj[key].adress,
              city: obj[key].city,
              state: obj[key].state,
              pets: obj[key].pets,
              isFamilyFriendly: obj[key].isFamilyFriendly,
              hasPubTransport: obj[key].hasPubTransport,
              laundromat: obj[key].laundromat,
              hasKitchen: obj[key].hasKitchen,
              occupancy: obj[key].occupancy,
              zipcode: obj[key].zipcode,
              owner: obj[key].owner
            })
          }
          commit('setLoading', false)
          commit('setLoadedDonations', donations)
        })
        .catch((error) => { 
          console.log(error)
          commit('setLoading', false)
        })
    },
    addDonation({commit}, payload) {
      let key
      let imageUrl
      const newDonation = {
        adress: payload.adress,
        city: payload.city,
        state: payload.state,
        pets: payload.pets,
        isFamilyFriendly: payload.isFamilyFriendly,
        hasPubTransport: payload.hasPubTransport,
        laundromat: payload.laundromat,
        hasKitchen: payload.hasKitchen,
        occupancy: payload.occupancy,
        zipcode: payload.zipcode,
        owner: payload.owner
      }
      firebase.database().ref('/donations/').push(newDonation)
        .then((data) => {
          key = data.key
          return key
        })
        .then((key) => {
          const fileName = payload.image.name
          const ext = fileName.slice(fileName.lastIndexOf('.'))
          return firebase.storage().ref('donations/' + key + '.' + ext).put(payload.image)
        })
        .then( data => {
          return data.ref.getDownloadURL()
            .then( downloadURL => {
              imageUrl = downloadURL
              return firebase.database().ref('meetups').child(key).update({imageUrl: downloadURL})
            })
        })
        .then (() => {
          commit('addDonation', {
            ...payload, 
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch( (error) => {
          console.log(error)
          commit('setLoading', false)
          commit('setError', error)
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
