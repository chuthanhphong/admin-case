import { BaseService } from '@/services/baseService'
import apiTickets from './apiTickets'

export class TicketService extends BaseService {
  static async create(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.CREATE,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async update(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.EDIT,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async accepted(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.ACCEPTED,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async detail(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.DETAIL,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async send(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.SEND,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async approvedSending(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.APPOVED_SENDING,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async rejectedSending(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.REJECT_SENDING,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async reject(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.REJECT,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async cancel(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.CANCEL,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async close(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.CLOSE,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async delete(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.DELETE,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async complete(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.COMPLETE,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async rejectFinish(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.REJECT_FINISH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async approveFinish(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.APPROVE_FINISH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async search(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.SEARCH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findTicketByRequest(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FIND_TICKET_BY_REQUEST,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async forwardTicketGroup(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FORWARD_TICKET_GROUP,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async denyForwardGroup(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.DENY_FORWARD_GROUP,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async acceptForwardGroup(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.ACCEPT_FORWARD_GROUP,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async forwardTicketUser(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FORWARD_TICKET_USER,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findCreateTicket(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FIND_CREATE_TICKET,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findTicketEmploy(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FIND_TICKET_EMPLOY,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async updateProgressTicket(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.UPDATE_PROGRESS_TICKET,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async updateProgressTicketComplete(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.UPDATE_PROGRESS_TICKET_COMPLETE,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findPerformTicket(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FIND_PERFORM_TICKET,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findTicketRequireOfGroup(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FIND_TICKET_REQUIRE_OF_GROUP,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async updateMonitorUserOfTicket(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.UPDATE_MONITOR_USER_OF_TICKET,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findMoniterTicket(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FIND_MONITOR_TICKET,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findApproveTicket(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FIND_APPROVE_TICKET,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findTicketsOfUserBelongGroup(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FIND_TICKETS_OF_GROUP_PERFORM,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findTicketsOfUserBelongCreateGroup(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FIND_TICKETS_OF_GROUP_CREATED,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async findDetailTicketsOfUser(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.FIND_DETAIL_TICKETS_OF_USER,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async getListCompleteTime() {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        apiTickets.TicketApis.GET_LIST_COMPLETE_TIME
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async getListUnitDashboard(data) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        apiTickets.DashboardApis.GET_LIST_UNIT,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async getTicketDashboard() {
    try {
      const response = await this.requestContract({ auth: true }).get(apiTickets.DashboardApis.GET_TICKET_DASHBOARD)
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async advanceSearchMyPerform(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.MY_PERFORM_ADVANCE_SEARCH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async advanceSearchMyRequest(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.MY_REQUEST_ADVANCE_SEARCH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async advanceSearchMyFollow(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.MY_FOLLOW_ADVANCE_SEARCH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async advanceSearchMyApprove(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.MY_APPROVE_ADVANCE_SEARCH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async advanceSearchTaskCenter(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.TASK_CENTER_ADVANCE_SEARCH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async advanceSearchBelongGroup(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.BELONG_GROUP_ADVANCE_SEARCH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async advanceSearchBelongCreateGroup(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.TicketApis.BELONG_CREATE_GROUP_ADVANCE_SEARCH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async getListJobs(data) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        apiTickets.TicketApis.GET_LIST_JOBS,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async addSourceTicket(ticketId, formData) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        `${apiTickets.AssociationApis.ADD_SOURCE}/${ticketId}`,
        formData
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async removeSouceTicKet(ticketId) {
    try {
      const response = await this.requestTicket({ auth: true }).delete(
        `${apiTickets.AssociationApis.REMOVE_SOURCE}/${ticketId}`,
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
}
