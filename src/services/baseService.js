import qs from 'qs'
import { assert } from '@/core'
import config from '@/config'
import { ErrorWrapper, ResponseWrapper } from './util'
import axios from 'axios'
import constants from '../constants'

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    const pathName = window.location.pathname
    if (
      error.response.status === 401 &&
      !pathName.includes('login') &&
      !pathName.includes('login-agent')
    ) {
      localStorage.clear()
      localStorage.setItem('showSessionExpired', true)
      window.location.reload()
    }
    // return Promise.reject(error)
    return Promise.reject(error)
  }
)

export class BaseService {
  static get entity() {
    throw new Error('entity getter not defined')
  }
  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static request(status = { auth: false }) {
    const url = config.app.api.url
    return this.common(status, url)
  }
  static requestAuth(status = { auth: false }) {
    let url = config.app.api.url
    url = url.replace('core', 'common')
    console.log(url)
    return this.common(status, url)
  }

  static requestContract(status = { auth: false }) {
    const url = config.app.api.contract
    return this.common(status, url)
  }

  static requestTicket(status = { auth: false }) {
    const url = config.app.api.ticketUrl
    return this.common(status, url)
  }

  static requestTask(status = { auth: false }) {
    const url = config.app.api.task
    return this.common(status, url)
  }

  static common(status, url) {
    const lang = localStorage.getItem(constants.LANGUAGE)
    const domain = window.document.location.host

    axios.defaults.baseURL = url
    axios.defaults.headers = {
      domain:
        domain.includes('localhost') || domain.includes('192')
          ? 'mdoweb.bssd.vn'
          : domain,
      'content-type': 'application/json',
      'Accept-language': lang
    }
    if (status.auth) {
      const token = localStorage.getItem(constants.TOKEN)
      axios.defaults.headers['Authorization'] = `Bearer ${token}`
    }
    return axios
  }

  static responseWrapper(...rest) {
    return new ResponseWrapper(...rest)
  }

  static errorWrapper(...rest) {
    return new ErrorWrapper(...rest)
  }

  static querystring(obj) {
    return qs.stringify(obj, {
      encode: false
    })
  }

  /**
   * ------------------------------
   * @API_CALLS_PUBLIC
   * ------------------------------
   */

  static async getListPublic(parameters = {}) {
    assert.object(parameters)

    const params = { ...parameters }

    try {
      const response = await this.request().get(`${this.entity}`, { params })
      const data = {
        content: response.data.data,
        total: Number(response.headers['x-total-count'])
      }

      return new ResponseWrapper(response, data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async getByIdPublic(id) {
    assert.id(id, { required: true })

    try {
      const response = await this.request().get(`${this.entity}/${id}`)
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  /**
   * ------------------------------
   * @API_CALLS_PRIVATE
   * ------------------------------
   */

  static async getById(id) {
    assert.id(id, { required: true })

    try {
      const response = await this.request({ auth: true }).get(
        `${this.entity}/${id}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async create(data = {}) {
    assert.object(data, { required: true })

    try {
      const response = await this.request({ auth: true }).post(
        `${this.entity}`,
        data
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      throw new ErrorWrapper(error)
    }
  }

  static async update(id, data = {}) {
    assert.id(id, { required: true })
    assert.object(data, { required: true })

    try {
      const response = await this.request({ auth: true }).patch(
        `${this.entity}/${id}`,
        data
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      throw new ErrorWrapper(error)
    }
  }

  static async remove(id) {
    assert.id(id, { required: true })

    try {
      const response = await this.request({ auth: true }).delete(
        `${this.entity}/${id}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      throw new ErrorWrapper(error)
    }
  }

  static handleError(error) {
    const message = error.response.data
      ? error.response.data.error
      : error.response.statusText
    throw new ErrorWrapper(error, message)
  }
  static handleSuccess(response) {
    return new ResponseWrapper(response, response.data.data)
  }
}
