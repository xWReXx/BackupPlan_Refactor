<template>
  <v-layout row>
    <v-dialog v-model='donateModal' persistent max-width='600px'>
      <v-btn slot='activator' flat color='red' dark>Edit Listing</v-btn>
      <v-card>
        <v-card-title>
          <span class='headline'>Donate Living Space</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model='adress' label='Adress*' required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model='city' label='City*' persistent-hint required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model='state' label='State*' required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model='zipcode' label='Zipcode*' required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model='occupancy' label='Max Occupancy*' required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-checkbox v-model="pets" label='Pets' value='Pets'></v-checkbox>
                <v-checkbox v-model="isFamilyFriendly" label='Family Friendly' value='Family Friendly'></v-checkbox>
                <v-checkbox v-model="hasPubTransport" label='Public Transportation' value='Public Transportation'></v-checkbox>
                <v-checkbox v-model="hAccess" label='Handicapped Acces' value='Handicapped Acces'></v-checkbox>
                <v-checkbox v-model="hasWasherDryer" label='Washer Dryer' value='Washer Dryer'></v-checkbox>
                <v-checkbox v-model="laundromat" label='Laundromat Near by' value='Laundromat Near by'></v-checkbox>
                <v-checkbox v-model="hasKitchen" label='Kitchen Access' value='Kitchen Access'></v-checkbox>
              </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                    <v-btn raised class="primary" @click="onPickFile">Upload Image</v-btn>
                    <input
                        type="file"
                        style="display: none"
                        ref="fileInput"
                        accept="image/*"
                        @change="onFilePicked"
                    >
                </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required fields</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color='red' to="/donate1" flat @click='donateModal = false'>Save Changes</v-btn>
          <v-btn color='red' flat @click='donateModal = false'>Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {

    data: () => ({
        donateModal: false,
        adress: '',
        city: '',
        state: '',
        pets: false,
        isFamilyFriendly: false,
        hasPubTransport: false,
        hAccess: false,
        hasWasherDryer: false,
        laundromat: false,
        hasKitchen: false,
        occupancy: '',
        zipcode: ''
    }),
    methods: {
        onSubmit() {
        const newDonation = {
            adress: this.adress,
            city: this.city,
            state: this.state,
            pets: this.pets,
            isFamilyFriendly: this.isFamilyFriendly,
            hasPubTransport: this.hasPubTransport,
            laundromat: this.laundromat,
            hasKitchen: this.hasKitchen,
            occupancy: this.occupancy,
            zipcode: this.zipcode,
            owner: this.userName
        }
        this.$store.dispatch('addDonation', newDonation)
        },
        onPickFile() {
            this.$refs.fileInput.click()
        },
        onFilePicked(event) {
            const files = event.target.files
            let filename = files[0].name
            if (filename.lastIndexOf(".") <= 0) {
                return alert("Please add a valid file!")
            }
            const fileReader = new FileReader()
            fileReader.addEventListener("load", () => {
                this.imageUrl = fileReader.result
            })
            fileReader.readAsDataURL(files[0])
            this.image = files[0]
        }
    }
}
</script>