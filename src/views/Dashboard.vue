<template>
  <v-container fluid ma-0 pa-0 fill-height>
    <v-layout text-xs-center wrap justify-center>
      <v-flex xs12>
        <v-img max-height='400' :src="require('../assets/hurricane.png')" class='my-3' contain></v-img>
      </v-flex>
      <v-flex mb-4 xs6>
        <h2 class='display-1 font-weight-bold mb-2'>Dashboard</h2>
        <v-btn block color="red" to='/donations' dark>SEARCH FOR A PLAN</v-btn>
        <v-btn block color="red" to='/mydonations' dark>DONATE SOME SPACE</v-btn>
        <v-btn block color="red" dark to="/profile">YOUR PROFILE</v-btn>
        <v-btn block color="red" dark>INSTALL</v-btn>
        <v-btn block color="red" dark @click='logout'>LOGOUT</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
    methods: {
        logout() {
            this.$store.dispatch('logout').then( () => {
                this.$router.replace('/')
            })
        }
    }
}
</script>
