import { BaseService } from '@/services/baseService'
import apiTickets from './apiTickets'

export class UserService extends BaseService {
  static async getUsersByGroupId() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.UserApis.GET_USER_BY_GROUP_ID
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getDetailUserById(id) {
    try {
      const url = `${apiTickets.UserApis.GET_DETAIL_USER_BY_ID}/${id}`
      const response = await this.requestTicket({ auth: true }).get(
        url
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getUsersFromGroupId(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.UserApis.GET_USERS_FROM_GROUP_ID,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getAllUserOfDomain() {
    try {
      const url = `${apiTickets.UserApis.GET_ALL_USER_OF_DOMAIN}/?page=1&pageSize=1000`
      const response = await this.requestTicket({ auth: true }).get(
        url
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
}
