import { BaseService } from '@/services/baseService'
import { ErrorWrapper, ResponseWrapper } from '@/services/util'
import Apis from './api'
import { formatQuery } from '@/helpers/utils'

export class DocumentService extends BaseService {
  // Lay hinh thuc van ban
  static async getDocFormula() {
    try {
      const response = await this.requestContract({ auth: true }).get(
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

  // Get bo loc
  static async getCriteria() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.DOCUMENT.SEARCH_CRITERIA
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Get bo loc van ban di den.
  static async getCriteriaBook() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.DOCUMENT.SEARCH_CRITERIA_BOOK
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Get loai van ban
  static async getDocType() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.DOCUMENT.DOCUMENT_TYPE
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Get nguoi ky
  static async getSigner() {
    try {
      const response = await this.request({ auth: true }).get(
        Apis.DOCUMENT.SEARCH_USER
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Lay list DOCUMENT
  static async getListDocument(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.SEARCH_DOCUMENT}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Lay list van ban di den.
  static async getListBook(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.SEARCH_SEND_RECEIVE_DOC}?${formatQuery(searchForm)}`
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

  // So thuoc van ban
  static async getBookGroup() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.DOCUMENT.BOOK_GROUP
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // List don vi ban hanh
  static async search(groupData) {
    try {
      const response = await this.request({ auth: true }).get(
        `${Apis.DOCUMENT.SEARCH}?${formatQuery(groupData)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // luu van ban ca nhan
  static async saveManagementDoc(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.MANAGEMENT.SAVE_MANAGEMENT,
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

  // Lay thong tin vb ca nhan
  static async getInfoDocPersonal(docId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.LOAD_MANAGEMENT}?documentId=${docId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Tim kiem don vi -> quan ly van ban
  static async searchGroupDocumentManager(params) {
    try {
      const defaultParams = {
        restrictHierarchy: 'false',
        pageSize: 100000
      }
      params = { ...params, ...defaultParams }
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.MANAGER_SEARCH_COMPANY}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Tim kiem nguoi ky -> quan ly van ban
  static async searchSignerDocumentManager(params) {
    try {
      const defaultParams = {
        pageSize: 100000
      }
      params = { ...params, ...defaultParams }
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.MANAGER_SEARCH_CUSTOMER}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Tim kiem nguoi ky -> quan ly van ban
  static async searchSignerDocumentBook(params) {
    try {
      const defaultParams = {
        pageSize: 100000
      }
      params = { ...params, ...defaultParams }
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.SEARCH_USER_BOOK}?${formatQuery(params)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Lay suggest number ban hanh.
  static async suggestNumber(data) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.SUGGEST_NUMBER}?${formatQuery(data)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // warning promulgate register number.
  static async warningPromulgateNumber(data) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.DOCUMENT.WARNING_NUMBER,
        data
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Lay thong tin vb ky.
  static async getInfoDocSignature(docId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.LOAD_SIGNATURE_DOCUMENT}?documentId=${docId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Luu vb ky.
  static async saveSignatureDoc(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.DOCUMENT.SAVE_SIGNATURE_DOCUMENT,
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

  // Xoa van ban
  static async removeDocument(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).delete(
        `${Apis.MANAGEMENT.DELETE_DOCUEMENT}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // danh sach don vi chuyen
  static async getTransferGroup(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.LOAD_TRANSFER_GROUP}?documentId=${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // danh sach user chuyen
  static async getTransferUser(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.LOAD_TRANSFER_USER}?documentId=${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // danh sach user role vt,ld,gd
  static async getListUserRole(formData) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.LOAD_LIST_USER_ROLE}?${formatQuery(formData)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // chuyen van ban
  static async saveTransferDoc(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.MANAGEMENT.SAVE_TRANSFER_DOCUMENT,
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
  // chi tiet van ban quan ly
  static async getDetailDocument(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.DETAIL_MANAGEMENT}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // load danh sach user duoc chuyen van ban
  static async getListTransferUser(formData) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.SEARCH_TRANSFER_USERS}?${formatQuery(formData)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // List edocument dashboard.
  static async getListDocDashBoard(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.FIND_WAITING_PROCESSL}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // List count dashboard.
  static async getCountDashBoard() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.MANAGEMENT.COUNT_DASHBOARD
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // chi tiet van ban quan ly
  static async viewDocumentInfo(fileId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.VIEW_FILE_DOCUMENT}/${fileId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // update da doc van ban
  static async updateReadDoc(documentId) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.MANAGEMENT.UPDATE_READ_DOC}/${documentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // update da doc van ban
  static async revokeDocument(formData) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        Apis.MANAGEMENT.REVOKE_DOCUMENT,
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

  // List group
  static async getListGroup(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.SEARCH_GROUP}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // luu van ban di den
  static async saveExternalDoc(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.BOOK.SAVE_EXTERNAL_DOCUMENT,
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

  // cay luan chuyen
  static async getTransferTree(documnentId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.TREE_TRANSFER}/${documnentId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // danh sach nhan van ban
  static async getListReceiveUser(formData) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.MANAGEMENT.RECEIVE_USER}?${formatQuery(formData)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // cay hinh thuc
  static async getFormulaTree() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.LIBRARY.LOAD_TREE_FORMULA
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // load trang thai hieu luc
  static async getEffectStatus() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.LIBRARY.LOAD_EFFECT_STATUS
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // load van ban thay the
  static async getReplaceDocument() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.LIBRARY.LOAD_REPLACE_DOCUMENT
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  static async getLoadChildrenGroup() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.LIBRARY.LOAD_CHILDREN_GROUPS
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Get VB thay the
  static async getDocReplace(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.LIBRARY.SEARCH_REPLACEMENT_DOCUMENT}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // load pham vi su dung
  static async getGroupScope() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.LIBRARY.LOAD_GROUP_SCOPE
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Luu thong tin thu vien
  static async saveLibrary(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.LIBRARY.SAVE_DOCUMENT_PROCLAIM,
        formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.message
        .split('|')
        .map(msg => `<div>${msg}</div>`)
        .join('')
      throw new ErrorWrapper(error, message)
    }
  }
  // danh sach thu vien
  static async getListLibrary(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.LIBRARY.SEARCH_PROCLAIM_DOCUMENT}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // Go thu vien.
  static async deleteLibrary(docId) {
    try {
      const response = await this.requestContract({ auth: true }).delete(
        `${Apis.LIBRARY.DELETE_LIBRARY}${docId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // load thong tin thu vien
  static async getLibraryInfo(docId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.LIBRARY.LOAD_LIBRARY_INFO
        }/${docId}`
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
