import { BaseService } from '@/services/baseService'
import { ErrorWrapper, ResponseWrapper } from '@/services/util'
import Apis from './apis'
import { formatQuery } from '@/helpers/utils'

export class DocumentService extends BaseService {
  // Lay hinh thuc van ban
  static async getDocFormula() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.DOCUMENT.FORMULA_TYPE
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay do khan
  static async getDocPriority() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.DOCUMENT.PRIORITY
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async search(data = {}) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.SEARCH}?${formatQuery(data)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async saveDocument(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.DOCUMENT.SAVE_DOCUMENT,
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

  // load thong tin van ban
  static async loadDocument(documentId) {
    try {
      const data = { documentId: documentId }
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.LOAD_DOCUMENT}?${formatQuery(data)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Trinh ky van ban
  static async sendDocument(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.DOCUMENT.SEND_DOCUMENT}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Xoa van ban trinh ky
  static async removeDocument(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).delete(
        `${Apis.DOCUMENT.REMOVE_DOCUMENT}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async getDetailDocument(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.DETAIL_DOCUMENT}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // View file sign document
  static async viewDocumentInfo(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.VIEW_DOCUMENT_INFO}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // ky van ban
  static async signDocument(documentId, formData) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.DOCUMENT.SIGN_DOCUMENT}/${documentId}`,
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

  // dem so luong van ban
  static async countUnprocessed() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.DOCUMENT.COUNT_DOCUMENT
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Count dashboard.
  static async getCountDocByState() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.DOCUMENT.COUNT_DOC_BY_STATE
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // List document dashboard.
  static async getListDocDashBoard(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.FIND_PENDING_DOC}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Huy luong van ban trinh ky
  static async cancelDocument(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.CANCEL_DOCUMENT}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // get image CA
  static async getImageCA(dataCA = {}) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.GET_CA_IMAGE}?${formatQuery(dataCA)}`
      )
      return new ResponseWrapper(response, response.data.data, response.message)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // change signer by creator
  static async changeSignerByCreator(formData = {}) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.DOCUMENT.CHANGE_SIGNER_BY_CREATOR}`,
        formData
      )
      return new ResponseWrapper(response, response.data.data, response.message)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // change signer by signer
  static async changeSignerBySigner(formData = {}) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.DOCUMENT.CHANGE_SIGNER_BY_SIGNER}`,
        formData
      )
      return new ResponseWrapper(response, response.data.data, response.message)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // Add flasher
  static async addFlasher(formData = {}) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.DOCUMENT.ADD_FLASHER}`,
        formData
      )
      return new ResponseWrapper(response, response.data.data, response.message)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // Add reviewer
  static async addReviewer(formData = {}) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.DOCUMENT.ADD_REVIEWER}`,
        formData
      )
      return new ResponseWrapper(response, response.data.data, response.message)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // Lay list nguoi thao tac
  static async getAdditionalSigner(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.LOAD_ADDITIONAL_SIGNER}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Remove Flasher.
  static async removeFlasher(documentId, signProcessId) {
    try {
      const data = { documentId: documentId, signProcessId: signProcessId }
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.DOCUMENT.REMOVE_FLASHER}`,
        data
      )
      return new ResponseWrapper(
        response,
        response.data.data,
        response.data.message
      )
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // Remove Reviewer.
  static async removeReviewer(documentId, signProcessId) {
    try {
      const data = { documentId: documentId, signProcessId: signProcessId }
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.DOCUMENT.REMOVE_REVIEWER}`,
        data
      )
      return new ResponseWrapper(
        response,
        response.data.data,
        response.data.message
      )
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // Lay list ban hanh
  static async getListPromulgate(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.LIST_PROMULGATE_DOCUMENT}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay do mat
  static async getListSecurity() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.DOCUMENT.SECURITY_TYPE
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay nganh
  static async getListOccupation() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.DOCUMENT.OCCUPATION
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Lay list don vi su dung
  static async getListPromulgateTemplate() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.DOCUMENT.GET_SCOPE_TEMPLATE
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Ban hanh van ban
  static async saveDocumentPromulgate(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.DOCUMENT.PROMULGATE_DOCUMENT,
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

  // Lay so van ban
  static async getSuggestDocNum(formData) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.SUGGEST_DOC_NUM}?${formatQuery(formData)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Huy van ban ban hanh
  static async cancelPromulgateDocument(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.DOCUMENT.CANCEL_PROMULGATE_DOCUMENT,
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

  // luu luong mau
  static async saveDocumentTemplate(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.DOCUMENT.SAVE_DOCUMENT_TEMPLATE,
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

  // danh sach luong mau
  static async getListTemplate(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.LIST_DOCUMENT_TEMPLATE}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // doi don vi ban hanh
  static async changePromulgate(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.DOCUMENT.CHANGE_PROMULGATE,
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

  // canh bao trung so van ban
  static async warningPromulgate(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.DOCUMENT.WARNING_PROMULGATE,
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
  // thong tin van ban ban hanh
  static async getPromulgateInfo(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.GET_PROMULGATE_INFORMATION}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // load thong tin luong mau
  static async getDocTemplate(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.LOAD_DOCUMENT_TEMPLATE}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // load thong tin luong mau
  static async getDetailDocTemplate(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.GET_DETAIL_DOCUMENT_TEMPLATE}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // load thong tin copy document.
  static async getCopyDoc(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.LOAD_COPY_DOCUMENT}?documentId=${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Remove template flow
  static async removeTemplateFlow(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).delete(
        `${Apis.DOCUMENT.REMOVE_TEMPLATE}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
}
