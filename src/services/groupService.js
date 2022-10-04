import { BaseService } from './baseService'
import { ErrorWrapper, ResponseWrapper } from './util'
import Apis from './apis'
import apiTickets from '@/modules/ticket/services/apiTickets'
import { formatQuery } from '../helpers/utils'
export class GroupService extends BaseService {
  // Lay danh sach don vi
  static async getList() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.GroupApis.LIST
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Them moi don vi
  static async addGroup(groupData) {
    try {
      const response = await this.request({ auth: true }).post(
        Apis.GroupApis.ADD,
        groupData
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Sua don vi
  static async editGroup(id, groupData) {
    try {
      const response = await this.request({ auth: true }).put(
        `${Apis.GroupApis.EDIT}/${id}`,
        groupData
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // get info group
  static async getGroupInfo(id) {
    try {
      const response = await this.request({ auth: true }).get(
        `${Apis.GroupApis.GETINFO}/${id}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Cay don vi
  static async groupTree() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.GroupApis.TREE
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      return error.response.data
    }
  }
  // Tim kiem don vi
  static async search(groupData) {
    try {
      const response = await this.request({ auth: true }).get(
        `${Apis.GroupApis.SEARCH}?${formatQuery(groupData)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay danh sach don vi dai dien
  static async getRepresentGroup() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.GroupApis.REPRESENT
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay danh sach don vi dai dien luong mau
  static async getFlowGroup() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.GroupApis.FLOW_GROUP
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay danh sach don vi cho bao cao
  static async getGroupsReport() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.GroupApis.GROUP_REPORT
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Xoa don vi
  static async deleteGroup(groupIds) {
    try {
      const response = await this.request({ auth: true }).post(
        Apis.GroupApis.DELETE_GROUP,
        groupIds
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data.message
        .split('|')
        .map(msg => `<div>${msg}</div>`)
        .join('')
      throw new ErrorWrapper(error, message)
    }
  }

  static async getAllGroup() {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.GroupApis.GET_ALL_GROUP,
        { pageSize: 1000 }
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getDetailGroupById(id) {
    try {
      const url = `${apiTickets.GroupApis.GET_DETAIL_GROUP_BY_ID}/${id}`
      const response = await this.requestTicket({ auth: true }).get(
        url
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getGroupsByUserId() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.GroupApis.GET_GROUPS_BY_USER_ID
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getGroupsByRoleOfUser() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.GroupApis.GET_GROUPS_BY_ROLE_OF_USER
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getGroupsByApproveOfUser() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.GroupApis.GET_GROUPS_BY_APPROVE_USER
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
}
