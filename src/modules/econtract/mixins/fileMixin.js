import { FileService } from '@/modules/econtract/services/fileService'
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
    async downloadFileAttach(file, activeLoading = true) {
      if (activeLoading) {
        this.loading = true
      } else {
        this.downloading = true
      }
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
        this.srcFilePdf = ''
      } finally {
        if (activeLoading) {
          this.loading = false
        } else {
          this.downloading = false
        }
      }
    },
    async downloadFileSign(file) {
      this.downloading = true
      try {
        await FileService.downloadFile({
          fileName: file.fileName,
          storage: file.storage,
          filePath: file.filePath
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.downloading = false
      }
    },
    async viewFilePdf(file) {
      try {
        const urlFile = await FileService.download({
          fileName: file.fileName,
          storage: file.storage,
          filePath: file.filePath
        })
        this.srcFilePdf = urlFile
      } catch (error) {
        this.srcFilePdf = null
      } finally {
        this.showDialogViewPdf = true
      }
    },
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
    // Hien thi ten file
    customFileName(file) {
      const fileName = file.name || file.fileName
      const fileSizeInput = file.size || file.fileSize
      const size = fileSizeInput / 1000
      const fileSize = formatFileSize({ size })

      var names = fileName.split('.')
      const extFile = names[names.length - 1]
      var name = names.splice(0, names.length - 1).join('')
      if (name.length > 25) {
        name = `${name.slice(0, 12)}...${name.slice(
          15,
          25
        )}.${extFile} (${fileSize})`
      } else {
        name += `.${extFile} (${fileSize})`
      }
      return name
    },
    truncateNameFile(fileName, length) {
      if (!fileName) {
        return ''
      }
      const ext = fileName.split('.').pop()
      var renameFile = fileName.replace(`.${ext}`, '')
      if (renameFile.length <= length) return fileName
      else {
        return renameFile.slice(0, length) + '...' + ext
      }
    },
    trimSpace(val) {
      const value = val ? val.toString().trim() : ''
      return value
    },
    dataURLtoFile(dataurl, filename) {
      try {
        var arr = dataurl.split(',')
        var mime = arr[0].match(/:(.*?);/)[1]
        var bstr = atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }

        return new File([u8arr], filename, { type: mime })
      } catch (error) {
        console.log(error)
        return null
      }
    }
  }
}
