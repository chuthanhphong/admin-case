import routeCommon from '@/router/routePaths'

export default {
  methods: {
    goBackStep() {
      if (window.history.length > 2) {
        window.location.reload()
        history.back()
      } else {
        this.$router.replace(routeCommon.DASHBOARD_HOME_PATH)
      }
    }
  }
}
