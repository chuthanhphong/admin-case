import { ResponseWrapper, ErrorWrapper } from './util'
import $store from '../store'
import { BaseService } from './baseService'
// import $router from '../router'
import moment from 'moment'
import contants from '@/constants'
import Apis from './apis'
let BEARER = ''

export class AuthService extends BaseService {
  /**
   ******************************
   * @API
   ******************************
   */

  static async makeLogin({ email, password }) {
    try {
      const response = await this.request().post(
        Apis.LOGIN.LOGIN,
        {
          email,
          password
        },
        { crossDomain: true }
      )
      //   _setAuthData({
      //     accessToken: response.data.data.accessToken,
      //     exp: _parseTokenData(response.data.data.accessToken).exp,
      //   });
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      throw new ErrorWrapper(error)
    }
  }

  static async login(data = {}, isAgent = false) {
    try {
      const urlLogin = isAgent ? Apis.LOGIN.LOGIN_AGENT : Apis.LOGIN.LOGIN
      const response = await this.requestAuth().post(urlLogin, data)
      const dataResponse = response.data.data
      const expDate = moment()
        .add(+dataResponse.tokenTimeout, 'seconds')
        .format(contants.format)
      // Luu token vs exp vao localStorage
      localStorage.setItem(contants.TOKEN, dataResponse.token)
      localStorage.setItem(contants.TOKEN_EXP, expDate)

      return new ResponseWrapper(response, response.data)
    } catch (error) {
      throw new ResponseWrapper(error, error.response.data)
    }
  }

  static async reCaptcha(guid) {
    try {
      const response = await this.requestAuth().get(
        Apis.LOGIN.RECAPCHAT + `/${guid}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      throw new ErrorWrapper(error)
    }
  }
  static async renewCode(params) {
    try {
      const data = { email: params.email, oldVerificationCode: params.code }
      const response = await this.requestContract().post(
        Apis.CONTRACT.RENEW_CODE,
        JSON.stringify(data)
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async forgotPassword(data = {}) {
    try {
      const response = await this.request().post(
        Apis.LOGIN.FORGOT_PASSWORD,
        data
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // function call api để login
  // static async login(data) {
  //   try {
  //     console.log(data)
  //     const response = await this.request().post('/auth/login', data)
  //     return response.data
  //   } catch (error) {
  //     throw new ErrorWrapper(error)
  //   }
  // }
  //   static async makeLogout() {
  //     try {
  //       const response = await new Http({ auth: true }).post(
  //         "auth/logout",
  //         {},
  //         { withCredentials: true }
  //       );
  //       _resetAuthData();
  //       $router.push({ name: "login" }).catch(() => {});
  //       return new ResponseWrapper(response, response.data.data);
  //     } catch (error) {
  //       throw new ErrorWrapper(error);
  //     }
  //   }

  static debounceRefreshTokens = this._debounce(() => {
    return this.refreshTokens()
  }, 100)

  /**
   ******************************
   * @METHODS
   ******************************
   */

  static isAccessTokenExpired() {
    const accessTokenExpDate = $store.state.auth.accessTokenExpDate - 10
    const nowTime = Math.floor(new Date().getTime() / 1000)

    return accessTokenExpDate <= nowTime
  }

  static checkTokenTimeout() {
    // Validate exp token
    const expDate = localStorage.getItem(contants.TOKEN_EXP)
    const currentDate = moment().format()
    const checkTime = moment(currentDate).diff(moment(expDate), 'seconds')

    // Kiem tra thoi gian hien tai > thoi gian timeout return false
    if (checkTime >= 0) {
      localStorage.clear()
      return true
      // $router.push('/login')
    }
    return false
  }

  static hasRefreshToken() {
    return Boolean(localStorage.getItem(contants.REFRESH_TOKEN))
  }

  static setRefreshToken(status) {
    if (!['', 'true'].includes(status)) {
      throw new Error(
        `setRefreshToken: invalid value ${status}; Expect one of ['', 'true']`
      )
    }

    localStorage.setItem(contants.REFRESH_TOKEN, status)
  }

  static getBearer() {
    return BEARER
  }

  static setBearer(accessToken) {
    BEARER = `Bearer ${accessToken}`
  }

  /**
   * https://stackoverflow.com/questions/35228052/debounce-function-implemented-with-promises
   * @param inner
   * @param ms
   * @returns {function(...[*]): Promise<unknown>}
   * @private
   */
  static _debounce(inner, ms = 0) {
    let timer = null
    let resolves = []

    return function() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const result = inner()
        resolves.forEach(r => r(result))
        resolves = []
      }, ms)

      return new Promise(resolve => resolves.push(resolve))
    }
  }
}

/**
 ******************************
 * @private_methods
 ******************************
 */

// function _parseTokenData(accessToken) {
//   let payload = ''
//   let tokenData = {}

//   try {
//     payload = accessToken.split('.')[1]
//     tokenData = JSON.parse(atob(payload))
//   } catch (error) {
//     throw new Error(error)
//   }

//   return tokenData
// }

// function _resetAuthData() {
//   // reset userData in store
//   $store.commit("user/SET_CURRENT_USER", {});
//   $store.commit("auth/SET_ATOKEN_EXP_DATE", null);
//   // reset tokens
//   AuthService.setRefreshToken("");
//   AuthService.setBearer("");
// }

// function _setAuthData({ accessToken, exp } = {}) {
//   AuthService.setBearer(accessToken)
//   $store.commit('auth/SET_ATOKEN_EXP_DATE', exp)
// }
