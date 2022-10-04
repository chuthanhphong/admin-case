import { BaseService } from '@/services/baseService'
import apiTickets from './apiTickets'

export class PublicTicketService extends BaseService {
  static get entity() {
    return 'public'
  }

  static async ticketStatus() {
    try {
      const response = await this.request({ auth: true }).post(
        apiTickets.PublicApis.TICKET_STATUS,
        { pageSize: 1000 }
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getPriority() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.PublicApis.GET_PRIORITY
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getSourceType() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.PublicApis.GET_SOURCE_TYPE
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getReferType() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.PublicApis.GET_REFER_TYPE
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
}
