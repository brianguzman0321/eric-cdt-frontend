/**
 * to manage the store.menuitems.companyInfo
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const companyInfoDownload = {
  computed: {
    ...mapState({
      companyInfo: state => state.menuitems.companyInfo,
    }),
  },

  mounted () {
    this.companyInfoDownload()
  },

  methods: {
    ...mapActions({
      getCompanyInfo: 'getCompanyInfo',
      showSnackBar: 'showSnackBar',
    }),

    companyInfoDownload () {
      if (this.companyInfo.length) return

      this.loading++
      this.getCompanyInfo()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Company Information download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
