import { BaseService } from '@/services/baseService'
import apiTickets from './apiTickets'
import { formatQuery } from '@/helpers/utils'
import fileDownload from 'js-file-download'

export class FileService extends BaseService {
  static async upload(formData) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.FileApis.UPLOAD_FILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async uploadMultiple(formData) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiTickets.FileApis.UPLOAD_MULTIPLE_FILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async viewFile(formData, type = 'application/pdf') {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        `${apiTickets.FileApis.DOWNLOAD}?${formatQuery(formData)}`,
        {
          responseType: 'blob'
        }
      )

      const blob = new Blob([response.data], {
        type
      })

      const url = await this.toBase64(blob)
      return url
    } catch (error) {
      console.log(error.message)
      return null
    }
  }

  static async toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  static async downloadFile(formData) {
    try {
      const response = await this.requestTicket({ auth: true }).get(
        `${apiTickets.FileApis.DOWNLOAD}?${formatQuery(formData)}`,
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
}
