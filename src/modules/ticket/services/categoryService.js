import { BaseService } from '@/services/baseService'
import apiTickets from './apiTickets'

export class CategoryService extends BaseService {
  static get entity() {
    return 'category'
  }

  static async getAllTicketGroup() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.CategoryApis.GET_ALL_TICKET_GROUP
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async getAllValueType() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.CategoryApis.GET_ALL_VALUE_TYPE
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async getTicketCategoryByTicketGroup(groupId) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.CategoryApis.GET_TICKET_CATEGORY_BY_TICKET_GROUP,
        { id: groupId }
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async getAllLimitType() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.CategoryApis.GET_ALL_LIMIT_TYPE
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async createCategory(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.CategoryApis.CREATE_CATEGORY,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async editCategory(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.CategoryApis.EDIT_CATEGORY,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async deleteCategory(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.CategoryApis.DELETE_CATEGORY,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async inactiveCategory(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.CategoryApis.INACTIVE_CATEGORY,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async activeCategory(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.CategoryApis.ACTIVE_CATEGORY,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findTicketCategory(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.CategoryApis.FIND_TICKET_CATEGORY,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async findTicketCategoryActive(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.CategoryApis.FIND_TICKET_CATEGORY_ACTIVE,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async getCategoryDetail(id) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.CategoryApis.GET_CATEGORY_DETAIL,
        { id }
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getCloseDurationType() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.CategoryApis.GET_CLOSE_DURATION_TYPE
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
}
