import { FileService } from '../services/fileService'
export default {
  data() {
    return {
      srcFilePdf: '',
      showDialogViewPdf: false,
      loading: false,
      iconPdf: require('@/assets/icons/pdf.svg'),
      iconDoc: require('@/assets/icons/doc.svg'),
      iconXls: require('@/assets/icons/xls.svg')
    }
  },
  methods: {
    getIconFile(fileName) {
      if (fileName) {
        const extFile = fileName.split('.').pop().toLowerCase()
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

          default:
            icon = this.iconPdf
            break
        }
        return icon
      }
    },
    // format: file...doc.pdf
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
