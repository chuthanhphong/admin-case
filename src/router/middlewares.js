import $store from '../store'
import { AuthService } from '@/services/authService'
import constants from '@/constants'
import routeNames from './routeNames'
import routeNamesEcontract from '../modules/econtract/router/routeNames'
import routeNamesEsignature from '../modules/esignature/router/routeNames'
import routeNamesEdocument from '../modules/edocument/router/routeNames'

/**
 * Current user state initialization
 * @WARN Must be always first in middleware chain
 */
function loginByEmail(loginType) {
  return loginType === 'EXTERNAL' || loginType === 'INTERNAL'
}

export async function initCurrentUserStateMiddleware(to, from, next) {
  // User chua login -> redirect LOGIN
  // User ngoai he thong chua login -< redirect LOGIN_AGENT
  // vao chi tiet ky dien tu
  if (to.name === routeNamesEdocument.MANAGEMENT_DOC_DETAIL) {
    localStorage.setItem(routeNamesEdocument.MANAGEMENT_DOC_DETAIL, to.fullPath)
  }
  if (to.name === routeNamesEsignature.DOCUMENT_DETAIL) {
    localStorage.setItem(routeNamesEsignature.DOCUMENT_DETAIL, to.fullPath)
  }
  if (
    to.query &&
    loginByEmail(to.query.loginType) &&
    to.name !== routeNames.FORGOT_PASSWORD &&
    localStorage.getItem(constants.TOKEN) === null
  ) {
    if (to.query.idDoc) {
      if (to.name === routeNamesEcontract.SIGN_CONTRACT) {
        localStorage.setItem(constants.CONTRACT_ID, to.query.idDoc)
        localStorage.setItem(constants.LIST_CONTRACT_ROOT, 'process')
      }
      if (to.name === routeNamesEcontract.COORDINATION_CONTRACT) {
        localStorage.setItem(constants.COORDINATION_ID, to.query.idDoc)
        localStorage.setItem(constants.LIST_CONTRACT_ROOT, 'coordination')
      }
      if (to.name === routeNamesEcontract.UPDATE_CONTRACT) {
        localStorage.setItem(constants.CONTRACT_UPDATE_ID, to.query.idDoc)
        localStorage.setItem(constants.LIST_CONTRACT_ROOT, 'process')
      }
    }
    if (to.query.loginType === 'INTERNAL') {
      return next({ name: routeNames.LOGIN })
    }
    return next({ name: routeNames.LOGIN_AGENT })
  }

  if (
    to.name !== routeNames.LOGIN &&
    to.name !== routeNames.LOGIN_AGENT &&
    to.name !== routeNames.FORGOT_PASSWORD &&
    localStorage.getItem(constants.TOKEN) === null
  ) {
    return next({ name: routeNames.LOGIN })
  }

  // User da login ko vao page LOGIN dc -> auto redirect DASHBOARD
  if (
    (to.name === routeNames.LOGIN ||
      to.name === routeNames.LOGIN_AGENT ||
      to.name === routeNames.FORGOT_PASSWORD) &&
    localStorage.getItem(constants.TOKEN) !== null
  ) {
    return next({ name: routeNames.DASHBOARD })
  }

  // check timeout token
  if (AuthService.checkTokenTimeout()) {
    return next({ name: routeNames.LOGIN })
  }
  next()
}

/**
 * Check access permission to auth routes
 */
export function checkAccessMiddleware(to, from, next) {
  const currentUserId = $store.state.user.currentUser.id
  const isAuthRoute = to.matched.some(item => item.meta.isAuth)

  if (isAuthRoute && currentUserId) return next()
  if (isAuthRoute) return next({ name: routeNames.LOGIN })
  next()
}

export function setPageTitleMiddleware(to, from, next) {
  const pageTitle = to.matched.find(item => item.meta.title)

  if (pageTitle) window.document.title = pageTitle.meta.title
  next()
}
