<template>
  <v-container fill-height>
    <v-layout row justify-center>
      <v-flex xs10 lg6>
        <v-card>
          <v-img :src="profile.profileImageUrl" class='img'>
            <v-layout column fill-height>
              <v-spacer></v-spacer>
              <v-card-title class='white--text pl-5 pt-5'>
                <div class='display-1'>{{profile.firstName}} {{profile.lastName}}</div>
              </v-card-title>
            </v-layout>
          </v-img>

          <v-list two-line>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color='white'>mail</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{profile.email}}</v-list-tile-title>
                <v-list-tile-sub-title>Email</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color='white'>date_range</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{profile.birthDate}}</v-list-tile-title>
                <v-list-tile-sub-title>Birth Date</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color='white'>location_on</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{profile.adress}}</v-list-tile-title>
                <v-list-tile-sub-title>{{profile.city}}, {{profile.state}} {{profile.zip}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>

            <v-list-tile>
              <v-list-tile-content>
                <v-flex column align-self-center class='editProfile'>
                  
                </v-flex>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>
                <v-flex column align-self-center>
                  <v-btn
                  @click.native="selectFile"
                  class='editPicture'
                  color='red'
                  dark
                >Edit Picture</v-btn>
                  <input
                    id="files"
                    type="file"
                    name="file"
                    ref="uploadInput"
                    accept="image/*"
                    style='display: none'
                    :multiple="false"
                    @change="detectFiles($event)"
                  />
                </v-flex>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  data: () => ({
    fileName: '',
  }),
  computed: {
      profile () {
          return this.$store.getters.user
      }
  },
  methods: {
    selectFile () {
      this.$refs.uploadInput.click()
    },
    detectFiles (e) {
      let fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        const fileInfo = {
            name: fileList[x].name,
            file: fileList[x]
        }
        this.$store.dispatch('uploadProfileImage', fileInfo)
      })
    },
    // upload (file) {
    //   this.fileName = file.name
    //   const fileInfo = {
    //       name: file.name,
    //       file: file
    //   }
    //   this.$store.dispatch('uploadProfileImage', fileInfo)
    // }
  },
}
</script>

<style scoped>
.editProfile {
  margin-top: 35px;
}

.editPicture {
  margin-top: 10px;
}

.img {
  max-width: 300px;
  max-height: 300px;
}
</style>