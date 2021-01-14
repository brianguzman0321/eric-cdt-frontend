<template>
  <base-material-card
    color="primary"
    title="General Information"
  >
    <v-progress-linear
      v-if="!!loading"
      indeterminate
    />
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="editedItem.name"
            label="Name: *"
            prepend-icon="mdi-domain"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="editedItem.plan_number"
            label="Plan Number"
            prepend-icon="mdi-counter"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="editedItem.phone"
            label="Phone Number"
            prepend-icon="mdi-phone"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="editedItem.fax"
            label="Fax"
            prepend-icon="mdi-fax"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="editedItem.email"
            label="E-mail *"
            prepend-icon="mdi-email"
          />
        </v-col>
        <v-col
          v-if="adminDutyQi(role && role.id)"
          cols="12"
          sm="6"
        >
          <v-autocomplete
            v-model="editedItem.qi_id"
            :items="qiItems"
            item-text="name"
            item-value="id"
            label="QI Company"
            prepend-icon="mdi-clipboard-account"
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-autocomplete
            v-model="editedItem.plan_preparer_id"
            label="Plan Preparer"
            :items="planPreparers"
            item-text="name"
            item-value="id"
            clearable
            prepend-icon="mdi-typewriter"
          />
        </v-col>
        <v-col
          v-if="adminDutyQi(role && role.id)"
          cols="12"
          sm="6"
        >
          <v-autocomplete
            v-model="editedItem.operating_company_id"
            :items="companyItems"
            item-text="name"
            item-value="id"
            label="Operating Company"
            prepend-icon="mdi-domain"
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="editedItem.website"
            label="Website"
            prepend-icon="mdi-web"
          />
        </v-col>
        <!-- <v-col
          cols="12"
          sm="6"
        >
          <v-autocomplete
            v-model="editedItem.company_poc_id"
            :items="pocItems"
            item-text="name"
            item-value="id"
            label="Company POC:"
            prepend-icon="mdi-account-star"
            :readonly="!edit"
          />
        </v-col> -->
        <v-col cols="12">
          <v-textarea
            v-model="editedItem.description"
            label="About:"
            prepend-icon="mdi-information"
            class="input-field"
          />
        </v-col>
      </v-row>
      <v-btn
        color="success"
        @click="saveEdit"
      >
        Save
      </v-btn>
      <v-btn
        color="error"
        @click="deleteCompany"
      >
        Delete
      </v-btn>
    </v-card-text>
  </base-material-card>
</template>

<script>
  import axios from 'axios'
  import { qiItemsDownload } from '@/mixins/menuItemsDownload/qiItemsDownload'
  // import { pocItemsDownload } from '@/mixins/menuItemsDownload/pocItemsDownload'
  import { companyItemsDownload } from '@/mixins/menuItemsDownload/companyItemsDownload'
  import { planPreparerDownload } from '@/mixins/menuItemsDownload/planPreparerDownload'
  import { checkCUD, adminDutyQi } from '@/shared/management'
  import { mapState } from 'vuex'

  export default {
    mixins: [
      qiItemsDownload,
      // pocItemsDownload,
      companyItemsDownload,
      planPreparerDownload,
    ],
    data: () => ({
      loading: 0,
      editedItem: {},
      adminDutyQi,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
    },
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
        this.loading++
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            this.loading--
          })
      },
      saveEdit () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('companies/' + this.$route.params.id, this.editedItem)
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          })
      },
      deleteCompany () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm(`Please confirm that you would like to delete the following company: <b>${this.editedItem.name}</b>`, { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete('companies/' + this.editedItem.id + '/destroy')
                .then(res => {
                  this.$router.push('/companies')
                })
            }
          })
      },
    },
  }
</script>

<style lang="sass">
  .input-container
    margin-top: 1rem
  .input-label
    font-size: 18px
    font-weight: 300
    color: black
    .v-icon
      font-size: 20px !important
  .input-field
    padding: 0
</style>
