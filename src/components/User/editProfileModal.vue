<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-btn slot="activator" color="red" dark>Edit Profile</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">Edit Profile</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-text-field label="Legal first name*" required :value='this.profile.firstName' v-model='firstName'></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field label="Legal last name*" persistent-hint required :value='this.profile.lastName' v-model='lastName'></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-menu
                      ref="menu"
                      :close-on-content-click="false"
                      v-model="menu"
                      :nudge-right="40"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="birthDate"
                        label="Birthday date"
                        prepend-icon="event"
                        :value='this.profile.birthDate'
                        readonly
                      ></v-text-field>
                      <v-date-picker
                        ref="picker"
                        v-model="birthDate"
                        :max="new Date().toISOString().substr(0, 10)"
                        min="1950-01-01"
                        @change="save"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Email*" required :value='this.profile.email' v-model='email'></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Address*" required :value='this.profile.address' v-model='address'></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field label="City*" persistent-hint required :value='this.profile.city' v-model='city'></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-autocomplete
                      v-model="state"
                      :value='this.profile.state'
                      :items="states"
                      label="State"
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field label="Zip*" required :value='this.profile.zip' v-model='zip'></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" flat @click="dialog = false">Cancel</v-btn>
              <v-btn color="red" flat @click="saveProfileChanges">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
</template>

<script>

export default {
    props: ['profile'],
  data: () => ({
    dialog: false,
    menu: false,
    message: '',
    userName: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    password: '',
    isEditing: false,
    states: [
      'Alabama', 'Alaska', 'American Samoa', 'Arizona',
      'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware', 'District of Columbia', 'Federated States of Micronesia',
      'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho',
      'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Marshall Islands', 'Maryland',
      'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
      'Missouri', 'Montana', 'Nebraska', 'Nevada',
      'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio',
      'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
      'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia',
      'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ]
  }),
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date)
    },
    saveProfileChanges () {
        const profileChanges = {
            userName: this.userName,
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate,
            address: this.address,
            city: this.city,
            state: this.state,
            zip: this.zip,
            email: this.email
        }
        this.$store.dispatch('saveProfileChanges', profileChanges)
        this.dialog = false
    }
  }
}
</script>