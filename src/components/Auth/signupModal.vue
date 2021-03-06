<template>
  <v-dialog v-model='signupModal' persistent max-width='600px'>
    <v-btn slot='activator' color='red' dark>Sign Up</v-btn>
    <v-card>
      <v-card-title>
        <span class='headline'>Create Account</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model='userName' label='User Name*' required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model='firstName' label='Legal first name' required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model='lastName' label='Legal last name' persistent-hint required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model='email' label='Email*' required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type='password'
                prepend-icon='lock'
                v-model='password'
                label='Password*'
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-menu
                ref='menu'
                :close-on-content-click='false'
                v-model='menu'
                :nudge-right='40'
                lazy
                transition='scale-transition'
                offset-y
                full-width
                min-width='290px'
              >
                <v-text-field
                  slot='activator'
                  v-model='birthDate'
                  label='Birthday date'
                  prepend-icon='event'
                  readonly
                ></v-text-field>
                <v-date-picker
                  ref='picker'
                  v-model='birthDate'
                  :max='new Date().toISOString().substr(0, 10)'
                  min='1950-01-01'
                  @change='save'
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model='address' label='Address' required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model='city' label='City' required></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-autocomplete
                v-model="state"
                :items="states"
                label="State"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model='zip' label='Zipcode' required></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <p class='feedback' v-if='feedback'>{{feedback}}</p>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color='red' flat @click='signupModal = false'>Cancel</v-btn>
        <v-btn color='red' flat @click.prevent='signup'>Sign Up</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
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
    signupModal: false,
    menu: false,
    slug: null,
    feedback: null,
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
  computed: {
    error () {
      return this.$store.getters.error
    }
  },
  methods: {
    signup () {
      const userProfile = {
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
        birthDate: this.birthDate,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        email: this.email
      }
      if (this.email && this.password && this.userName) {
        this.$store.dispatch('signUserUp', userProfile)
          .then( () => {
            if (this.error) {
              return this.feedback = this.error.message
            } else {
                return this.$router.replace('/dashboard')
            }
        })
      } else {
        return this.feedback = 'Please enter all required fields'
      }
    },
    save (date) {
      this.$refs.menu.save(date)
    }
  },
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  }
}
</script>

<style>
.feedback {
  text-align: center;
  padding: 10px;
}
</style>
