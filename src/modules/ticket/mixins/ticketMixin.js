// Libs
import { mapActions } from 'vuex'

// Mixins
import rules from '@/mixins/rules'
import filterItems from '@/mixins/filterItems'
// Service
import TicketService from '@/modules/ticket/services/ticketService'

export default {
  mixins: [rules, filterItems],
  data() {
    return {
      // Date
      menuTimeExpDate: false,
      expirationDateValue: '',
      expirationDatePicker: '',

      uploadingFileAttatch: false,
      fileAttachs: [],
      nameFileAttachs: [],
      errorEffectiveDateValue: '',
      formdata: {},
      loading: false
    }
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    // Trigger mo form dinh kem
    uploadAttachs() {
      document.getElementById('fileAttachsInput').click()
    },

    // Luu hop dong
    async saveTicket(isUpdate) {
      try {
        this.loading = true
        await TicketService.saveTicket(this.formdata)
        this.setNotify({
          show: true,
          type: 'success',
          content: isUpdate
            ? 'Cập nhật Yêu cầu thành công!'
            : 'Thêm mới Yêu cầu thành công!'
        })
        // setTimeout(() => {
        //   this.$router.replace(
        //     `${constants.ROOT_PATH}app/contracts/digitzations`
        //   )
        // }, 1500)
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.loading = false
      }
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
          this.fileAttachs.map((fileAttach) => {
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
          listIndexRemove.map((index) => {
            this.removeFileAttach(index)
          })
        }
        // validate file
        const lstFileValidate = this.fileAttachs.filter((file) => file.name)
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
    }
  }
}
