import econtractRoute from '@/modules/econtract/router/routePaths'
// http://localhost:3000/home/econtract/app/contract/5146/sign?idDoc=5146&loginType=INTERNAL

export default {
  methods: {
    goBackStep() {
      const loginType = localStorage.getItem('LOGIN_TYPE')
      const pathName = window.location.pathname
      if (window.history.length > 2) {
        if (!pathName.includes('contracts') && ['AGENT', 'IN'].includes(loginType) && (pathName.includes('/sign') || pathName.includes('/coordination') || pathName.includes('/update'))) {
          this.$router.push(econtractRoute.ECONTRACT_DASHBOARD_PATH)
        } else {
          window.location.reload()
          history.back()
        }
      } else {
        this.$router.replace(`${econtractRoute.ECONTRACT_DASHBOARD_PATH}`)
      }
    }
  }
}
