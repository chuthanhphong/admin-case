import { FileService } from '@/modules/edocument/services/fileService'
import { formatFileSize } from '@/helpers/utils'
export default {
  data() {
    return {
      srcFilePdf: '',
      showDialogViewPdf: false,
      loading: false,
      iconPdf: require('@/assets/icons/pdf.svg'),
      iconDoc: require('@/assets/icons/doc.svg'),
      iconXls: require('@/assets/icons/xls.svg'),
      iconPng: require('@/assets/icons/png.svg'),
      iconTxt: require('@/assets/icons/txt.svg'),
      iconMsg: require('@/assets/icons/msg.svg'),
      iconZip: require('@/assets/icons/zip.svg'),
      iconRar: require('@/assets/icons/rar.svg'),
      iconJpg: require('@/assets/icons/jpg.svg')
    }
  },
  methods: {
    getIconFile(fileName) {
      if (fileName) {
        const extFile = fileName
          .split('.')
          .pop()
          .toLowerCase()
        var icon = ''
        switch (extFile) {
          case 'pdf':
            icon = this.iconPdf
            break
          case 'doc':
          case 'docx':
            icon = this.iconDoc
            break

          case 'csv':
          case 'xls':
          case 'xlsx':
            icon = this.iconXls
            break
          case 'jpg':
            icon = this.iconJpg
            break
          case 'png':
            icon = this.iconPng
            break
          case 'txt':
            icon = this.iconTxt
            break
          case 'msg':
            icon = this.iconMsg
            break
          case 'zip':
            icon = this.iconZip
            break
          case 'rar':
            icon = this.iconRar
            break
          default:
            icon = this.iconPdf
            break
        }
        return icon
      }
    },
    // format: file...doc.pdf
    customFileNameUpload(file) {
      const fileName = file.name || file.fileName
      const fileSizeInput = file.size || file.fileSize
      const size = fileSizeInput / 1000
      const fileSize = formatFileSize({ size })

      var names = fileName.split('.')
      const extFile = names[names.length - 1]
      var name = names.splice(0, names.length - 1).join('')
      if (name.length > 25) {
        name = `${name.slice(0, 12)}...${name.slice(
          name.length - 10,
          name.length
        )}.${extFile} (${fileSize})`
      } else {
        name += `.${extFile} (${fileSize})`
      }
      return name
    },

    customFileName(file) {
      const fileName = file.name || file.fileName
      var names = fileName.split('.')
      const extFile = names[names.length - 1]
      var name = names.splice(0, names.length - 1).join('')
      if (name.length > 25) {
        name = `${name.slice(0, 12)}...${name.slice(
          name.length - 10,
          name.length
        )}.${extFile}`
      } else {
        name += `.${extFile}`
      }
      return name
    },

    customFileNameHeader(file) {
      const fileName = file.name || file.fileName

      var names = fileName.split('.')
      const extFile = names[names.length - 1]
      var name = names.splice(0, names.length - 1).join('')
      if (name.length > 20) {
        name = `${name.slice(0, 12)}...${name.slice(
          name.length - 10,
          name.length
        )}.${extFile}`
      } else {
        name += `.${extFile}`
      }
      return name
    },
    customDocumentTitle(title) {
      if (title.length > 60) {
        title = `${title.slice(0, 50)}...`
      }
      return title
    },

    // format: fileDocument...pdf
    customFileName2(fileName) {
      if (!fileName) return ''
      if (fileName.length < 12) return fileName
      return fileName.substring(0, 9) + '...pdf'
    },

    async viewFilePdf(file) {
      if (!file.url) {
        const urlFile = await FileService.download({
          fileName: file.fileName,
          storage: file.storage,
          filePath: file.filePath
        })
        this.srcFilePdf = urlFile
      } else {
        this.srcFilePdf = file.url
      }
      this.showDialogViewPdf = true
    },
    // Tai file dinh kem
    async downloadFile(file) {
      this.loading = true
      try {
        if (file.fileName.includes('.pdf')) {
          await this.viewFilePdf(file)
        } else {
          await FileService.downloadFile({
            fileName: file.fileName,
            storage: file.storage,
            filePath: file.filePath
          })
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.loading = false
      }
    }
  }
}
