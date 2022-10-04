import { BaseService } from '@/services/baseService'
import { ErrorWrapper, ResponseWrapper } from '@/services/util'
import apiTasks from './apiTasks'
import { formatQuery } from '@/helpers/utils'
import fileDownload from "js-file-download";

export class TaskService extends BaseService {
  static get entity() {
    return 'task'
  }

  // lay ra danh sach nhom
  static async getListGroups() {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_LIST_GROUPS}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ResponseWrapper(error, message)
    }
  }

  // lay ra cong viec chi tiet
  static async getDetailTask(taskId) {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_TASK_DETAIL}/${taskId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // lay danh sach loai cong viec
  static async getWorkType() {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_TYPE_WORK}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // search danh sach cong viec
  static async searchCreatTask(params) {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_LIST_TASK}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async getTaskDashboard() {
    try {
      const response = await this.requestTask({ auth: true }).get(`${apiTasks.TaskApis.GET_TASK_DASHBOARD}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Lay danh sach nguoi tham gia

  static async getPersonParticipation(type) {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_PATICIPATION}=${type}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // tao moi cong viec
  static async createTask(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.POST_NEW_TASK,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // uploadfile cong viec
  static async upload(formData) {
    try {
      const url = apiTasks.TaskApis.UP_LOAD_FILE
      const response = await this.requestTask({ auth: true }).post(
        url,
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
  // lay ra sanh sach nguoi ( nguoi thuc hien, nguoi theo doi, nguoi phoi hop )
  static async getListCustomer(participantType) {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_PATICIPATION}=${participantType}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // lay ra danh sach nguoi va nhom viec toi giao theo user
  static async getListAssignCurrentUser(params) {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_LIST_USERS_CURRENT_USER}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // lay ra danh sach nguoi dung viec toi giao theo group
  static async getListUserAssignCurrentGroup(params) {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_LIST_USERS_ASSIGNED_CURRENT_GROUP}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // lay ra danh sach nhom viec toi giao theo group
  static async getListGroupAssignCurrentGroup(params) {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_LIST_GROUPS_ASSIGNED_CURRENT_GROUP}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // cap nhat task
  static async updateTask(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.PUT_TASK_DETAIL,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // cap nhat task man hinh edit

  static async updateTaskDraff(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.PUT_TASK,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // cap nhat tien do
  static async updateProgress(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.UPDATE_PROGRESS,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // danh sach loai cong viec
  static async getListTaskType() {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_LIST_TASK_TYPE}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // phe duyet, huy phe duyet , huy cong viec
  static async approvalTask(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.APPROVE_TASK,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // gui lai yeu cau
  static async resentApprovalTask(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.RESENT_APPROVE_TASK,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // cap nhat trang thai
  static async updateStatus(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.UPDATE_STATUS,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // danh sach nguon goc lien ket
  static async getListAssociation(param) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        `${apiTasks.TaskApis.GET_LIST_ASSOCIATION}`,
        param
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // danh sach nhom nguoi dung
  static async getGroupByCurrentUser() {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_GROUP_BY_CURRENT_USER}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // xoa cong viec
  static async deleteTask(taskId) {
    try {
      const response = await this.requestTask({ auth: true }).delete(
        `${apiTasks.TaskApis.DELETE_TASK}/${taskId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // huy cong viec
  static async cancelTask(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.CANCEL_TASK,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // tam dung cong viec
  static async pauseTask(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.PAUSE_TASK,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // tai file
  static async downloadFile(formData) {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.DOWNLOAD_FILE}?${formatQuery(formData)}`,
        {
          responseType: 'blob'
        }
      )
      fileDownload(response.data, formData.fileName)
    } catch (error) {
      console.log(error.message)
      return null
    }
  }

  // get list type task
  static async getListTypeTask(params) {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_LIST_TYPE_TASK}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // tao moi loai cong viec
  static async createTypeTask(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.CREATE_TYPE_TASK,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // cap nhat loai cong viec
  static async updateTypeTask(formData) {
    try {
      const response = await this.requestTask({ auth: true }).post(
        apiTasks.TaskApis.UPDATE_TYPE_TASK,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // xoa loai cong viec
  static async deleteTypeTask(typeTaskId) {
    try {
      const response = await this.requestTask({ auth: true }).delete(
        `${apiTasks.TaskApis.DELETE_TYPE_TASK}/${typeTaskId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // lay danh sach dashboard
  static async getModuleTaskDashboard(params) {
    try {
      const response = await this.requestTask({ auth: true }).get(
        `${apiTasks.TaskApis.GET_MODULE_TASK_DASHBOARD}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
}
