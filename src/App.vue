<template>
  <v-app id='inspire' dark>
    <v-navigation-drawer v-model='drawer' fixed clipped app>
      <v-list dense>
        <v-list-tile v-for='item in items' :key='item.text' :to="item.url">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-btn v-if='user' color='red' dark>Signout</v-btn>
    </v-navigation-drawer>
    <v-toolbar color='red' dense fixed clipped-left app>
      <v-toolbar-side-icon @click.stop='drawer = !drawer'></v-toolbar-side-icon>
      <v-icon dark class='mx-3'>fab fa-youtube</v-icon>
      <v-toolbar-title  class='mr-5 align-center'>
        <span to="/#" class='title white--text'>Backup Plan</span>
      </v-toolbar-title>
      <v-layout row align-center style='max-width: 650px'></v-layout>
    </v-toolbar>
    <v-content>
      <v-container fill-height pa-0 ma-a>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    user: null,
    items: [
      { icon: 'account_box', text: 'Profile', url: '/profile' },
      { icon: 'group_add', text: 'My Donations', url: '/mydonations' },
      { icon: 'public', text: 'Update Public Status', url: '/status/:id' },
      { icon: 'directions_run', text: 'Make Backup Plans', url: '/donations' },
      { icon: 'settings', text: 'Dashboard', url: '/dashboard' }
    ]
  }),
}
</script>

<style>
  a:active {
  background-color: red !important;
  }
  .primary--text {
    color: red !important;
  }
</style>
