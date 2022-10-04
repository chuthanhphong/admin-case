import { BaseService } from '@/services/baseService'
import apiTickets from './apiTickets'
import { formatQuery } from '@/helpers/utils'

export class AssociationService extends BaseService {
  static async getAssociations(param) {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        `${apiTickets.AssociationApis.GET_ASSOCIATIONS}?${formatQuery(param)}`
      );
      return this.handleSuccess(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}
