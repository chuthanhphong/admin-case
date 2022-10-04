import { BaseService } from '@/services/baseService'
import { ErrorWrapper, ResponseWrapper } from '@/services/util'
import Apis from './apis'
import { formatQuery } from '@/helpers/utils'
import { FileService } from '@/modules/esignature/services/fileService'
export class ContractService extends BaseService {
  static get entity() {
    return 'contract'
  }

  // Lay danh sach hop dong
  static async getList() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.CONTRACT.LIST
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Luu hop dong
  static async saveContract(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.CONTRACT.SAVE_DOCUMENT,
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
  // Dem so luong
  static async getCount() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.CONTRACT.GET_COUNT_CONTRACT
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay hop dong cho ky
  static async getRelateDocument(groupData) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.RELASTE_DOCUMENT}?${formatQuery(groupData)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay lich su hop dong
  static async getContractHistory(contractId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.CONTRACT_HISTORY}/${contractId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay lich su luong mau
  static async getFlowtHistory(contractId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.FLOW_HISTORY}/${contractId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay file ky
  static async getFileSign(contractId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.FILE_SIGN}/${contractId}`,
        {
          responseType: 'blob'
        }
      )
      const blob = new Blob([response.data], {
        type: 'application/pdf'
      })

      const url = await FileService.toBase64(blob)
      return url
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay danh sach chan ky
  static async getSignatureSign(contractId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.SIGNATURES_SIGN}/${contractId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // lay danh sach hop dong theo dieu kien tim kiem
  static async searchContract(data = {}) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.SEARCH_DOCUMENT}?${formatQuery(data)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Tim kiem danh luong mau
  static async searchFlow(data = {}) {
    try {
      if (!data.documentFormulaId) {
        delete data.documentFormulaId
      }
      if (!data.groupDocScopeIds) {
        delete data.groupDocScopeIds
      }
      if (data.page === 0) {
        data.page = 1
      }
      const response = await this.requestContract({ auth: true }).post(
        Apis.CONTRACT.SEARCH_FLOW,
        data
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Tim kiem thong tin chi tiet hop dong
  static async searchDetailContract(contractId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.SEARCH_CONTRACT_DETAIL}/${contractId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Lay thong tin chi tiet hop dong
  static async getDetailContract(contractId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.GET_CONTRACT_DETAIL}/${contractId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Ky hop dong
  static async signContract(data = {}, contactId) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.CONTRACT.SIGN_CONTRACT}/${contactId}`,
        data
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Dieu phoi hop dong
  static async coordinationContract(data = {}, contactId) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.CONTRACT.COORDINATION_CONTRACT}/${contactId}`,
        data
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Them ky nhay
  static async additionalSigner(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.CONTRACT.ADD_ADDITIONAL_SIGNERS,
        formData
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Tim kiem user
  static async searchUserSigner(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.FIND_ADDITIONAL_SIGNERS}?${formatQuery(documentId)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }

  // get action contract
  static async getAdditionalSigner(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.GET_ADDITIONAL_SIGNERS}?${formatQuery(documentId)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // get image CA
  static async getImageCA(dataCA = {}) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.GET_CA_IMAGE}?${formatQuery(dataCA)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Xoa hop dong
  static async deleteContract(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.DELETE_CONTRACT}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Huy luong
  static async cancelContract(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.CANCEL_CONTRACT}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Xoa ky nhay, nguoi xem xet
  static async removeAdditionalSigner(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.CONTRACT.REMOVE_ADDITIONAL_SIGNERS,
        formData
      )
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // Doi nguoi ky, nguoi xem xet
  static async changeSigner(data = {}, documentId) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.CONTRACT.CHANGE_ADDITIONAL_SIGNERS}/${documentId}`,
        data
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Gui hop dong
  static async sendDocument(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.CONTRACT.SEND_CONTRACT}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Tu choi dieu phoi
  static async rejectCoordinatingContract(data = {}, contractId) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.CONTRACT.REJECT_COORDINATING_CONTRACT}/${contractId}`,
        data
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
  // Tim kiem bao cao
  static async searchReport(params) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.REPORT}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.data.message
      throw new ErrorWrapper(error, message)
    }
  }
}
