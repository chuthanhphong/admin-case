import { BaseService } from './baseService'
import { ErrorWrapper, ResponseWrapper } from './util'
import Apis from './apis'

export class RoleService extends BaseService {
  // Lay danh sach role
  static async getList() {
    try {
      const response = await this.request({ auth: true }).get(Apis.ROLES.LIST)
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async loadModulePermision() {
    try {
      const response = await this.requestAuth({ auth: true }).get(Apis.LOGIN.LOAD_GLOBAL_MODULES)
      const roleModule = response.data && response.data.data ? response.data.data.map(item => item.id) : []
      return roleModule
    } catch (error) {
      console.log(error)
      return []
    }
  }
}
