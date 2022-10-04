import constants from '@/constants'
import econtractRoute from '@/modules/econtract/router/routePaths'
export default {
  methods: {
    hasPermission(arrRoles) {
      const userInfo = JSON.parse(localStorage.getItem(constants.USER_INFO))
      if (userInfo) {
        const roles = userInfo.roles
        if (arrRoles.length > 2 && roles.length === 0) {
          return true
        }
        var havePermission = false
        roles.forEach(role => {
          if (arrRoles.includes(role)) {
            havePermission = true
          }
        })
        if (!havePermission) {
          this.$router.push(`${econtractRoute.ECONTRACT_DASHBOARD_PATH}`)
        }
      } else {
        this.$router.push(`${econtractRoute.ECONTRACT_DASHBOARD_PATH}`)
      }
    },
    showActionCreate(arrRoles) {
      const userInfo = JSON.parse(localStorage.getItem(constants.USER_INFO))
      if (userInfo) {
        const roles = userInfo.roles
        if (roles.length === 0) {
          return false
        }
        var havePermission = false
        roles.forEach(role => {
          if (arrRoles.includes(role)) {
            havePermission = true
          }
        })
        return havePermission
      } else {
        return false
      }
    }
  }
}
