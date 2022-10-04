// mixins
import rules from '@/mixins/rules'
import alertMixin from '@/mixins/alert'
import fileMixin from '@/modules/econtract/mixins/fileMixin'
import customsFile from "@/modules/calendar/mixins/customsFile";
import { mapActions, mapState } from 'vuex'

// service
import { FileService } from '@/modules/calendar/services/fileService'

import constants from '@/constants'

export default {
  name: 'MixinFileCalendar',
  components: {},
  mixins: [fileMixin, rules, alertMixin, customsFile],
  data() {
    return {
      fileAttachments: [],
      uploadingFileAttatch: false,
      nameFileAttachs: [],
      fileAttachs: []
    }
  },
  watch: {

  },
  computed: {
    ...mapState('document', ['fileDocumentUploaded', 'fileAttachsUploaded'])
  },
  created() {

  },
  beforeDestroy() {
    this.resetDataState()
  },
  methods: {
    ...mapActions('document', [
      'setFileAttachs',
      'resetDataState'
    ]),
    ...mapActions('layout', ['setNotify']),
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
          this.setNotify({
            show: true,
            type: 'warning',
            content: this.$t(message)
          })
          return
        } else {
          await this.uploadFileAttachs()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async initFileAttachs(data) {
      if (data.fileAttachments) {
        data.fileAttachments.map((file) => {
          file.name = file.fileName
          file.size = file.fileSize
        })
        await this.setFileAttachs(data.fileAttachments)
        this.nameFileAttachs = data.fileAttachments
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
    }
  }
}
