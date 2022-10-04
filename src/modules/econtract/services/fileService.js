import { BaseService } from '@/services/baseService'
import { ErrorWrapper, ResponseWrapper } from '@/services/util'
import Apis from '@/services/apis'
import { formatQuery } from '@/helpers/utils'
import fileDownload from 'js-file-download'
import constants from '@/constants'

export class FileService extends BaseService {
  // Upload file
  static async upload(formData, isMultiple = false, isDigitzation = false) {
    try {
      const url = isMultiple ? (isDigitzation ? Apis.CONTRACT.UPLOAD_FILE_EXTERNAL : Apis.CONTRACT.UPLOAD_MUTIPLE)
        : (constants.FILE_TYPES.FILE_IMAGE_SIGNATURE === formData.get('fileType') ? Apis.CONTRACT.UPLOAD_IMAGE_SIGN : Apis.CONTRACT.UPLOAD)
      console.log(url)
      const response = await this.requestContract({ auth: true }).post(
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
  static async uploadFileExcel(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.CONTRACT.MANAGER_UPLOAD_EXCEL,
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
  static async toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  static async downloadImage(formData, type = 'image/png') {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.FileApis.DOWNLOAD}?${formatQuery(formData)}`,
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
  // Download file
  static async download(formData, type = 'application/pdf') {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.FileApis.DOWNLOAD}?${formatQuery(formData)}`,
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
  static async downloadFile(formData) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.FileApis.DOWNLOAD}?${formatQuery(formData)}`,
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
  static async downloadFileExcelTemplate() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CONTRACT.MANAGER_EXCEL_TEMPLATE}`,
        {
          responseType: 'blob'
        }
      )
      fileDownload(response.data, 'TemplateListContract.xlsx')
    } catch (error) {
      console.log(error.message)
      return null
    }
  }
}
