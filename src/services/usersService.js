import { BaseService } from './baseService'
import { ErrorWrapper, ResponseWrapper } from './util'
import Apis from './apis'
import { formatQuery } from '../helpers/utils'

export class UsersService extends BaseService {
  static get entity() {
    return 'users'
  }

  static async getCurrent() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.UserApis.LIST
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async createUser(data = {}) {
    try {
      const response = await this.request({ auth: true }).post(
        Apis.UserApis.ADD,
        data
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async readNotifi(data = {}) {
    try {
      const response = await this.request({ auth: true }).post(
        Apis.NOTFICATIONS.NOTFICATION_UPDATE_READ_STATUS,
        data
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async updateUser(id, data = {}) {
    try {
      const response = await this.request({ auth: true }).put(
        `${Apis.UserApis.UPDATE}/${id}`,
        data
      )
      console.log(response)
      return new ResponseWrapper(response, response.data, response.message)
    } catch (error) {
      console.log(error)
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async getUserInfo(id) {
    try {
      const response = await this.request({ auth: true }).get(
        `${Apis.UserApis.GETINFO}/${id}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async searchUser(data = {}) {
    try {
      const response = await this.request({ auth: true }).get(
        `${Apis.UserApis.SEARCH}?${formatQuery(data)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async changePassword(data = {}) {
    try {
      const response = await this.request({ auth: true }).post(
        Apis.UserApis.CHANGE_PASSWORD,
        data
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async getUserProFile() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.UserApis.GET_PROFILE
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async updateFirstLogin() {
    try {
      const response = await this.request({ auth: true }).post(
        Apis.UserApis.UPDATE_FIRST_LOGIN
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // lock or unloc user
  static async lockOrUnlock(id) {
    try {
      const response = await this.request({ auth: true }).put(
        `${Apis.UserApis.LOCK_OR_UNLOCK}/${id}`
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async uploadImageProfile(formData) {
    try {
      const response = await this.request({ auth: true }).post(
        Apis.UserApis.UPLOAD_IMAGE_PROFILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async deleteImageProfile(id) {
    try {
      const response = await this.request({ auth: true }).put(
        `${Apis.UserApis.DELETE_IMAGE_PROFILE}/${id}`
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // load danh sach chuc danh
  static async getListPosition() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.UserApis.GET_LIST_POSITION
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  static async findUsers(data = {}) {
    try {
      const response = await this.request({ auth: true }).get(
        `${Apis.UserApis.FIND_USERS}?${formatQuery(data)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // tim kiem chuc danh
  static async findListPosition(data = {}) {
    try {
      const response = await this.request({ auth: true }).get(
        `${Apis.UserApis.FIND_POSITION}?${formatQuery(data)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async findUserNotifications(data = {}) {
    try {
      const params = {
        pageSize: data && data.pageSize ? data.pageSize : 10,
        page: data.page && data.page ? data.page : 1,
        title: data.searchKeyword && data.searchKeyword ? data.searchKeyword : "",
        actionModule: data.selectedType && data.selectedType ? data.selectedType : "",
        readStatus: data.selectedRead && data.selectedRead ? data.selectedRead : "",
      }
      const response = await this.request({ auth: true }).get(
        `${Apis.NOTFICATIONS.NOTFICATION_LIST}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async saveFcmToken(data = {}) {
    try {
      const response = await this.request({ auth: true }).post(
        `${Apis.NOTFICATIONS.NOTFICATION_SAVE_FCM_TOKEN}`,
        data
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async loadUnreadNotifications() {
    try {
      const response = await this.request({ auth: true }).get(
        `${Apis.NOTFICATIONS.NOTFICATION_UNREAD}`
      )
      // console.log('loadUnreadNotifications:', response.data.data);
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  static async updateReadNotifications(notificationIds = []) {
    try {
      if (notificationIds && notificationIds.length > 0) {
        const response = await this.request({ auth: true }).get(
          `${Apis.NOTFICATIONS.NOTFICATION_UPDATE_READ_STATUS}`
        )
        return new ResponseWrapper(response, response.data.data)
      }
      return []
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
}
