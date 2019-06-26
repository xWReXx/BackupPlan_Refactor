<template>
  <v-container fluid ma-0 pa-0 fill-height>
      <v-layout v-if="loading">
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular
                    indeterminate
                    :width="7"
                    :size="70"
                    color="primary"
                ></v-progress-circular>
            </v-flex>
        </v-layout>
    <v-layout text-xs-center wrap justify-center>
      <v-flex mt-4 mb-4>
        <h2 class='display-1 font-weight-bold mb-2'>My Donations</h2>
        <app-addDonation></app-addDonation>
      </v-flex>
      <v-flex mb-4 xs10>
          <v-layout v-for='item in myDonations' :key='item.id'>
            <v-flex mb-4 xs12 sm6 offset-sm3>
              <v-card >
                <v-img class='white--text' height='200px' :src="item.imageUrl">
                  <v-container fill-height fluid>
                  </v-container>
                </v-img>
                <v-card-title>
                  <div>
                    <span class='grey--text'>Number 10</span>
                    <br>
                    <span>{{item.address}}</span>
                    <br>
                    <span>{{item.city + ' '}}</span>
                    <span>{{item.state + ', '}}</span>
                    <span>{{item.zip}}</span>
                    <br>
                    <span> Space for {{item.occupancy}} people</span>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <app-editDonation :donationId='item.id'></app-editDonation>
                  <v-btn flat color='red'>Remove</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
    data: () => ({
        drawer: null,
    }),
    computed: {
        myDonations () {
            return this.$store.getters.myloadedDonations
        },
        loading () {
            return this.$store.getters.loading
        }
    },
    created () {
        this.$store.dispatch('loadMyDonations')
    }
}
</script>

<style>
    .test {
        text-align: left !important;
    }
</style>