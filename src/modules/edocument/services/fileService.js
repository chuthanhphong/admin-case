import { BaseService } from '@/services/baseService'
import { ErrorWrapper, ResponseWrapper } from '@/services/util'
import Apis from './api'
import { formatQuery } from '@/helpers/utils'
import fileDownload from 'js-file-download'

export class FileService extends BaseService {
  // Upload file
  static async upload(formData, isMultiple = false) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        isMultiple ? Apis.FileApis.UPLOAD_MUTIPLE : Apis.FileApis.UPLOAD,
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

  // View sign file
  static async downloadSignFile(documentId, fileId, type = 'application/pdf') {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.DOCUMENT.VIEW_SIGN_FILE}/${documentId}/${fileId}`,
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

  // Upload image signature.
  static async uploadImgSign(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.FileApis.UPLOAD_IMG_SIGN,
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

  // Upload file main or file attachment.
  static async uploadFileMain(formData, isFileMain = true) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        isFileMain
          ? Apis.FileApis.UPLOAD_FILE_MAIN
          : Apis.FileApis.UPLOAD_FILE_ATTACHMENT,
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
}
