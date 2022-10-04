// mixins
import filterItems from '@/mixins/filterItems.js'
import rules from '@/mixins/rules'
import alertMixin from '@/mixins/alert'
import fileMixin from '@/modules/econtract/mixins/fileMixin'
import customsFile from "@/modules/edocument/mixins/customsFile";

// service
import { FileService } from '@/modules/edocument/services/fileService'
import { DocumentService } from '@/modules/edocument/services/documentService'

import { mapActions, mapState } from 'vuex'
import edocumentRoute from '@/modules/edocument/router/routePaths'
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'

import constants from '@/constants'
// dialog

import DialogCancel from '@/modules/edocument/views/components/DialogCancel'
import DialogConfirmSave from '@/modules/edocument/views/components/DialogConfirmSave'

import { isNull, isEmpty } from 'lodash'

export default {
  name: 'CreateManagementDoc',
  components: {
    Breadcrumbs,
    DialogCancel,
    DialogConfirmSave
  },
  mixins: [fileMixin, rules, alertMixin, filterItems, customsFile],
  data() {
    return {
      loading: false,
      showConfirmContract: false,
      showDialogCancel: false,
      isShowAlert: false,
      message: '',
      isUpdate: false,
      lstDocType: null,
      contractId: null,
      documentTitle: null,
      formulaTypeId: null,
      contractCode: '',
      ownerGroupId: null,
      fileMainSigns: [],
      fileAttachments: [],
      processType: '',
      uploadingFile: false,
      uploadingFileAttatch: false,
      fileContract: null,
      nameFileAttachs: [],
      fileAttachs: [],
      nameFileDocuments: [],
      fileDocuments: [],
      completed: false
    }
  },
  watch: {
    documentTitle() {
      this.isValidStep()
    },
    formulaTypeId() {
      this.isValidStep()
    },
    fileContract() {
      this.isValidStep()
    },
    fileDocuments() {
      this.isValidStep()
    },
    nameFileDocuments() {
      this.isValidStep()
    },
    uploadingFile() {
      this.isValidStep()
    }
  },
  computed: {
    fileStyle() {
      return {
        opacity: this.fileContract != null ? 1 : 0
      }
    },
    ...mapState('document', ['fileDocumentUploaded', 'fileAttachsUploaded'])
  },
  created() {
    this.getDocFormula()
  },
  beforeDestroy() {
    this.resetDataState()
  },
  methods: {
    ...mapActions('document', [
      'setFileDocument',
      'setFileAttachs',
      'resetDataState'
    ]),
    ...mapActions('layout', ['setNotify']),
    isValidStep() {
      this.completed =
        !this.uploadingFile &&
        !isEmpty(this.documentTitle) &&
        !isNull(this.formulaTypeId) &&
        this.isValidArray()
    },
    isValidArray() {
      return this.nameFileDocuments.length > 0
    },
    async getDocFormula() {
      try {
        const response = await DocumentService.getDocFormula()
        this.lstDocType = response.data
      } catch (error) {
        console.log(error)
      }
    },
    showAlert(data) {
      this.message = data.message
      this.typeAlert = data.typeAlert
      this.isShowAlert = true
    },
    trimSpaceContractName() {
      this.documentTitle = this.trimSpace(this.documentTitle)
    },
    // Chon file dinh kem
    async selectAttachs() {
      try {
        this.fileAttachs = [...this.$refs.fileAttachsInput.files]
        // bien chua index de xoa
        const listIndexRemove = []
        // lap de tim cac ten file trung nhau
        this.nameFileAttachs.map((file, index) => {
          let count = 0
          this.fileAttachs.map(fileAttach => {
            if (file.name === fileAttach.name) {
              count++
            }
          })
          if (count > 1) {
            listIndexRemove.push(index)
          }
        })
        // xoa file cu khi bi trung ten file
        if (listIndexRemove.length > 0) {
          listIndexRemove.map(index => {
            this.removeFileAttach(index)
          })
        }
        // validate file
        const lstFileValidate = this.fileAttachs.filter(file => file.name)
        const { valid } = await this.$refs.providerFileAttachs.validate(
          lstFileValidate
        )

        if (!valid) {
          if (this.fileAttachs) {
            this.fileAttachs = this.nameFileAttachs
          } else {
            // neu xoa thi dat gia tri ve null
            this.fileAttachs = []
            this.nameFileAttachs = []
          }
          this.$refs.fileAttachsInput.type = 'text'
          this.$refs.fileAttachsInput.type = 'file'

          const message = this.$refs.providerFileAttachs.errors[0]
          const typeAlert = 'warning'
          this.showAlert({
            message,
            typeAlert
          })
          return
        } else {
          await this.uploadFileAttachs()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // Xoa tai lieu dinh kem
    removeFileAttach(index) {
      var fileBuffer = new DataTransfer()
      document.getElementById('fileAttachsInput').files = fileBuffer.files
      this.fileAttachs.splice(index, 1)
      this.nameFileAttachs.splice(index, 1)
      this.setFileAttachs(this.nameFileAttachs)
    },
    // Upload file ky
    async uploadFileDocument() {
      if (this.fileDocuments.length === 0) {
        return
      }
      try {
        this.uploadingFile = true
        var formData = new FormData()
        this.fileDocuments.map((file) => {
          formData.append('files', file)
        })
        formData.append('fileType', constants.FILE_TYPES.FILE_MAIN)
        const response = await FileService.uploadFileMain(formData, true)
        if (response.success) {
          const { data } = response
          const lstFileName = this.nameFileDocuments.map(
            (file) => file.fileName || file.name
          )
          data.forEach((file) => {
            if (!lstFileName.includes(file.fileName)) {
              this.nameFileDocuments.push(file)
            } else {
              const index = this.nameFileDocuments.findIndex(
                (x) => x.fileName === file.fileName
              )
              this.nameFileDocuments[index] = file
            }
          })
          await this.setFileDocument(this.nameFileDocuments)
        }
      } catch (error) {
        // xoa item khi call api loi
        this.fileDocuments = this.fileDocuments.filter((file) => file.fileName)
        var fileBuffer = new DataTransfer()
        document.getElementById('fileContract').files = fileBuffer.files
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.uploadingFile = false
      }
    },
    // Xoa file
    removeFileDocument(index) {
      // xoa file trong the <input>
      var fileBuffer = new DataTransfer()
      document.getElementById('fileContract').files = fileBuffer.files
      this.fileDocuments.splice(index, 1)
      var fileUpload = this.fileDocumentUploaded
      fileUpload.splice(index, 1)
      this.setFileDocument(fileUpload)
    },
    async downloadFileDocument(index) {
      const documentFile = this.nameFileDocuments[index]
      const file = await FileService.download({
        filePath: documentFile.filePath,
        storage: documentFile.storage,
        fileName: documentFile.fileName
      })
      this.downloadFile(file, documentFile.fileName)
    },
    // Tai file
    downloadFile(file, fileName) {
      const downloadLink = document.createElement('a')
      document.body.appendChild(downloadLink)
      downloadLink.href = file
      downloadLink.target = '_self'
      downloadLink.download = fileName
      downloadLink.click()
    },
    // Chon file
    async selectDocumentFile() {
      try {
        this.fileDocuments = [...this.$refs.fileContract.files]
        // bien chua index de xoa
        const listIndexRemove = []
        // lap de tim cac ten file trung nhau
        this.nameFileDocuments.map((file, index) => {
          let count = 0
          this.fileDocuments.map((fileDocument) => {
            if (file.fileName.includes(fileDocument.name)) {
              count++
            }
          })
          if (count > 1) {
            listIndexRemove.push(index)
          }
        })

        // xoa file cu khi bi trung ten file
        if (listIndexRemove.length > 0) {
          listIndexRemove.map((index) => {
            this.removeFileDocument(index)
          })
        }
        // validate file
        const lstFileValidate = this.fileDocuments.filter((file) => file.name)
        const { valid } = await this.$refs.contractSignedProvider.validate(
          lstFileValidate
        )
        if (!valid) {
          if (this.fileDocuments) {
            // neu xoa thi dat gia tri ve null
            this.fileDocuments = this.nameFileDocuments
          } else {
            this.fileDocuments = []
            this.nameFileDocuments = []
          }
          this.$refs.fileContract.type = 'text'
          this.$refs.fileContract.type = 'file'
          const message = this.$refs.contractSignedProvider.errors[0]
          const typeAlert = 'warning'
          this.showAlert({
            message,
            typeAlert
          })

          return
        } else {
          await this.uploadFileDocument()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // Trigger mo form upload
    uploadContract() {
      document.getElementById('fileContract').click()
    },

    // Trigger mo form dinh kem
    uploadAttachs() {
      document.getElementById('fileAttachsInput').click()
    },

    // Upload file dinh kem
    async uploadFileAttachs() {
      if (this.fileAttachs.length === 0) {
        return
      }
      try {
        this.uploadingFileAttatch = true
        var formData = new FormData()
        this.fileAttachs.map((file) => {
          formData.append('files', file)
        })
        formData.append('fileType', constants.FILE_TYPES.FILE_EXTRA)
        const response = await FileService.uploadFileMain(formData, false)

        if (response.success) {
          const { data } = response
          const lstFileName = this.nameFileAttachs.map(
            (file) => file.fileName || file.name
          )
          data.forEach((file) => {
            if (!lstFileName.includes(file.fileName)) {
              this.nameFileAttachs.push(file)
            } else {
              const index = this.nameFileAttachs.findIndex(
                (x) => x.fileName === file.fileName
              )
              this.nameFileAttachs[index] = file
            }
          })
          this.fileAttachments = this.nameFileAttachs
          this.setFileAttachs(this.nameFileAttachs)
        }
      } catch (error) {
        // xoa item khi call api loi
        this.fileAttachs = this.fileAttachs.filter((file) => file.fileName)
        var fileBuffer = new DataTransfer()
        document.getElementById('fileAttachsInput').files = fileBuffer.files
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.uploadingFileAttatch = false
      }
    },
    // luu van ban ca nhan
    async saveManagementDoc(isUpdate, documentId) {
      const formData = {}
      formData.documentId = documentId
      formData.documentTitle = this.documentTitle
      formData.formulaTypeId = this.formulaTypeId
      formData.fileAttachments = this.fileAttachsUploaded
      formData.fileMainSigns = this.fileDocumentUploaded
      formData.fileMainSigns.map((fileMainSign) => {
        delete fileMainSign.url
      })
      try {
        this.loading = true
        await DocumentService.saveManagementDoc(formData)
        var message = isUpdate ? 'managementDoc.messageSuccess.updateDocument' : 'managementDoc.messageSuccess.saveDocument'
        const typeAlert = 'success'
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message)
        })
        setTimeout(() => {
          this.$router.replace(`${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}`)
        }, 1500)
      } catch (e) {
        const typeAlert = 'error'
        const message = e.message
        this.$emit('show-alert', { message, typeAlert })
      } finally {
        this.loading = false
      }
    }
  }
}
