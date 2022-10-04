// Libs
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
// Constants
import constants from '@/constants'
//  Mixins
import rules from '@/mixins/rules'
import fileMixin from '@/modules/econtract/mixins/fileMixin'
import alertMixin from '@/mixins/alert'
import checkRoles from '@/mixins/checkRoles'
import goBackMethod from '@/modules/econtract/mixins/goBackMethod'
import econtractRoute from '@/modules/econtract/router/routePaths'

// Services
import { FileService } from '@/modules/econtract/services/fileService'
import { ContractService } from '@/modules/econtract/services/contractService'
const signerGroupType = [
  { name: 'contract.group', value: constants.GROUPS.GROUP },
  { name: 'contract.personal', value: constants.GROUPS.PERSONAL }
]
const initSignerData = {
  groupId: '',
  groupName: '',
  signerName: '',
  signerId: '',
  email: '',
  phoneNumber: '',
  signerType: signerGroupType[0]['value'],
  signingStep: ''
}
export default {
  data() {
    return {
      // Date
      menuEffectiveDate: false,
      effectiveDateValue: '',
      effectiveDatePicker: '',

      menuTimeExpDate: false,
      expirationDateValue: '',
      expirationDatePicker: '',

      showDialogCancel: false,
      showConfirmContract: false,
      isShowAlert: false,
      showIcon: true,
      message: '',
      contractName: '',
      contractType: '',
      groups: [],
      groupIds: [],
      lstContractType: [],
      listSigner: [{ ...initSignerData }],
      fileContract: null,
      uploadingFile: false,
      uploadingFileAttatch: false,
      fileAttachs: [],
      nameFileAttachs: [],
      errorEffectiveDateValue: '',
      formdata: {
        contractId: null,
        title: '',
        formulaTypeId: null,
        contractCode: '',
        ownerGroupId: null,
        expirationDate: null,
        effectDate: null,
        externalSigners: [{ ...initSignerData }],
        fileMainSign: {},
        fileAttachments: [],
        processType: ''
      },
      loading: false,
      tmpFileContract: null
    }
  },
  mixins: [alertMixin, goBackMethod, checkRoles, rules, fileMixin],
  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },

    fileStyle() {
      return {
        opacity: this.fileContract != null ? 1 : 0
      }
    },
    fileAttachStyle() {
      return { opacity: this.fileAttachs.length > 0 ? 1 : 0 }
    },
    showBtnAdd() {
      return this.formdata.externalSigners.length < 10
    },
    ...mapState('contract', ['fileContractUploaded', 'fileAttachsUploaded'])
  },
  created() {
    this.hasPermission([constants.USER_ROLE.HDDT])
  },
  watch: {
    effectiveDatePicker(date) {
      if (date) {
        this.formdata.effectDate = this.formatDate(date)
        this.effectiveDateValue = this.formatDate(date)
      }
    },
    expirationDatePicker(date) {
      if (date) {
        this.expirationDateValue = this.formatDate(date)
        this.formdata.expirationDate = this.formatDate(date)
      }
    },
    // Validate
    effectiveDateValue() {
      this.errorEffectiveDateValue = ''
      if (this.effectiveDateValue.length > 0) {
        const isValid = moment(
          this.effectiveDateValue,
          'DD/MM/YYYY',
          true
        ).isValid()
        if (isValid) {
          this.effectiveDatePicker = moment(
            this.effectiveDateValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
        }
        this.errorEffectiveDateValue = isValid
          ? ''
          : this.$t('contract.dateInvalid', {
            name: this.$t('users.addSignature.time')
          })
        this.validateDateEffect()
      } else {
        this.formdata.effectDate = null
        this.errorEffectiveDateValue = this.$t('contract.fieldRequired', {
          name: this.$t('users.addSignature.time')
        })
      }
    },
    expirationDateValue() {
      this.validateDateEffect()
    }
  },
  methods: {
    ...mapActions('contract', ['setFileContract', 'setFileAttachs']),
    ...mapActions('layout', ['setNotify']),
    validateDateEffect() {
      const expiredDate = moment(this.expirationDateValue, 'DD/MM/YYYY')
      const isValidExpiredDate = moment(
        this.expirationDateValue,
        'DD/MM/YYYY',
        true
      ).isValid()
      if (isValidExpiredDate) {
        this.expirationDatePicker = moment(
          this.expirationDateValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')
      }
      const isValid = moment(
        this.effectiveDateValue,
        'DD/MM/YYYY',
        true
      ).isValid()
      if (!this.expirationDateValue && isValid) {
        this.errorEffectiveDateValue = ''
        return true
      }
      if (isValid) {
        this.effectiveDatePicker = moment(
          this.effectiveDateValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')
      }
      if (!isValid) {
        return false
      }
      if (!this.effectiveDateValue || !this.expirationDateValue) {
        return true
      }
      const effectDate = moment(this.effectiveDateValue, 'DD/MM/YYYY')
      const diff = expiredDate.diff(effectDate, 'days')
      if (diff < 0) {
        this.errorEffectiveDateValue = this.$t(
          'contract-manager.messages.expiredDateMustGreathanEffectDate'
        )
        return false
      } else {
        this.errorEffectiveDateValue = ''
        return true
      }
    },
    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },
    goBack() {
      this.goBackStep()
    },
    showAlert(data) {
      this.message = data.message
      this.typeAlert = data.typeAlert
      this.isShowAlert = true
      if (!data.showIcon) {
        this.showIcon = data.showIcon
      } else {
        this.showIcon = true
      }
    },
    // Lay danh sach don vi
    async getListGroups() {
      try {
        const {
          data: { data }
        } = await ContractService.getListGroupContractManager()
        this.groups = data
      } catch (error) {
        console.log(error.message)
      }
    },
    // Lay danh sach loai hop dong
    async getListFormulaType() {
      try {
        const { data } = await ContractService.getListFormulaType()
        this.lstContractType = data
      } catch (error) {
        console.log(error.message)
      }
    },
    // Them ben ky
    addSigner() {
      this.formdata.externalSigners.push({ ...initSignerData })
    },

    // Xoa ben ky
    removeSigner(index) {
      this.formdata.externalSigners.splice(index, 1)
    },

    // Xoa tai lieu dinh kem
    removeFileAttach(index) {
      var fileBuffer = new DataTransfer()
      document.getElementById('fileAttachsInput').files = fileBuffer.files
      this.fileAttachs.splice(index, 1)
      this.nameFileAttachs.splice(index, 1)
      this.formdata.fileAttachments = this.nameFileAttachs
      this.setFileAttachs(this.nameFileAttachs)
    },
    resetFileSign() {
      this.$refs.fileContract.value = null
      this.tmpFileContract = null
      this.fileContract = null
      this.formdata.fileMainSign = null
    },
    // Upload file ky
    async uploadContractSigned() {
      try {
        if (!this.fileContract || this.fileContract === undefined) {
          this.$refs.fileContract.value = null
          this.fileContract = this.tmpFileContract
          return
        }
        if (this.fileContract === this.tmpFileContract) {
          return
        }

        const { valid } = await this.$refs.contractSignedProvider.validate(
          this.fileContract
        )
        if (!valid) {
          const message = this.$refs.contractSignedProvider.errors[0]
          const typeAlert = 'warning'
          this.setNotify({
            show: true,
            type: typeAlert,
            content: message
          })
          // // check xoa file
          // if (this.fileContract || this.fileContract === undefined) {
          //   this.fileContract = this.tmpFileContract
          // } else {
          //   // neu xoa thi dat gia tri ve null
          //   this.fileContract = null
          //   this.tmpFileContract = null
          // }
          this.fileContract = null
          this.tmpFileContract = null
          this.$refs.fileContract.type = 'text'
          this.$refs.fileContract.type = 'file'
          return
        }
        this.formdata.fileMainSign = null

        this.tmpFileContract = this.fileContract
        this.uploadingFile = true
        // Upload file
        var formData = new FormData()
        formData.append('file', this.fileContract)
        formData.append('fileType', constants.FILE_TYPES.FILE_MAIN)
        const response = await FileService.upload(formData, false)

        if (response.success) {
          this.formdata.fileMainSign = response.data
          this.setFileContract(response.data)
        }
      } catch (error) {
        this.fileContract = null
        this.tmpFileContract = null
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.uploadingFile = false
      }
    },

    // Trigger mo form upload
    uploadContract() {
      console.log('open file upload')
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
        this.fileAttachs.map(file => {
          if (file.name) {
            formData.append('files', file)
          }
        })
        const response = await FileService.upload(formData, true, true)
        if (response.success) {
          const { data } = response
          const lstFileName = this.nameFileAttachs.map(
            file => file.fileName || file.name
          )
          const lstFileNameWithId = this.nameFileAttachs.map(file => {
            return { id: file.id, name: file.fileName || file.name }
          })
          data.forEach(file => {
            if (this.isUpdate) {
              const isExited = lstFileNameWithId.some(
                f => !f.id && f.name === file.fileName
              )
              if (!isExited) {
                this.nameFileAttachs.push(file)
              } else {
                const index = this.nameFileAttachs.findIndex(
                  x => x.fileName === file.fileName && !x.id
                )
                this.nameFileAttachs[index] = file
              }
            } else {
              if (!lstFileName.includes(file.fileName)) {
                this.nameFileAttachs.push(file)
              } else {
                const index = this.nameFileAttachs.findIndex(
                  x => x.fileName === file.fileName
                )
                this.nameFileAttachs[index] = file
              }
            }
          })
          this.formdata.fileAttachments = this.nameFileAttachs
          this.setFileAttachs(this.nameFileAttachs)
        }
      } catch (error) {
        this.fileAttachs = this.fileAttachs.filter(file => file.fileName)
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
    // Luu hop dong
    async saveContract(isUpdate) {
      try {
        this.loading = true
        await ContractService.saveContractManager(this.formdata)
        this.showAlert({
          message: isUpdate
            ? this.$t('contract-manager.messages.updateContractSuccess')
            : this.$t('contract-manager.messages.addContractSuccess'),
          typeAlert: 'success'
        })
        setTimeout(() => {
          this.$router.replace(`${econtractRoute.LIST_CONTRACT_DIGIT_PATH}`)
        }, 1500)
      } catch (error) {
        this.showAlert({
          message: error.message,
          typeAlert: 'error'
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
    // Trimspace contract name
    trimSpaceContractName() {
      this.formdata.title = this.trimSpace(this.formdata.title)
    },
    // Trimspace contract name
    trimSpaceContracCode() {
      this.formdata.contractCode = this.trimSpace(this.formdata.contractCode)
    },
    validateDuplicates() {
      const lstMsgError = []
      const validateDuplicateEmail = this.isDuplicate('email')
      if (validateDuplicateEmail.isDuplicate) {
        lstMsgError.push(
          `<li>
            Email ${validateDuplicateEmail.value[0]['k']} 
            ${this.$t('contract.duplicateEmail')}
          </li>`
        )
      }
      const validateDuplicateGroupName = this.isDuplicate('groupName')
      if (validateDuplicateGroupName.isDuplicate) {
        lstMsgError.push(
          `<li>
          ${this.$t('contract.companyName')} 
          ${validateDuplicateGroupName.value[0]['k']} 
          ${this.$t('contract.duplicateEmail')}
          </li>`
        )
      }
      const validateDuplicatePhone = this.isDuplicate('phoneNumber')
      if (validateDuplicatePhone.isDuplicate) {
        lstMsgError.push(
          `<li>
          ${this.$t('contract.label.phone')}
          ${validateDuplicatePhone.value[0]['k']} 
          ${this.$t('contract.duplicateEmail')}
          </li>`
        )
      }
      if (lstMsgError.length > 0) {
        this.showAlert({
          message: `<ul>${lstMsgError.join('')}</ul>`,
          typeAlert: 'error'
        })
      }
      return lstMsgError.length === 0
    },
    // validate duplicate email
    validateDuplicateEmail() {
      const validateDuplicate = this.isDuplicate('email')
      if (validateDuplicate.isDuplicate) {
        this.showAlert({
          message: `Email ${this.$t('contract.duplicateEmail')}`,
          typeAlert: 'error'
        })
      }
    },
    // validate duplicate phone
    validateDuplicatePhone() {
      const validateDuplicate = this.isDuplicate('phoneNumber')
      if (validateDuplicate.isDuplicate) {
        this.showAlert({
          message: `${this.$t('contract.label.phone')} ${this.$t(
            'contract.duplicateEmail'
          )}`,
          typeAlert: 'error'
        })
      }
    },
    // validate duplicate dai dien khach hang
    validateDuplicateSignerName() {
      const validateDuplicate = this.isDuplicate('signerName')
      if (validateDuplicate.isDuplicate) {
        this.showAlert({
          message: `${this.$t('contract.customerRepresentative')} ${this.$t(
            'contract.duplicateEmail'
          )}`,
          typeAlert: 'error'
        })
      }
    },
    // Check duplicate email, groupName, phone
    isDuplicate(type) {
      const dataCompare = this.formdata.externalSigners.filter(
        e => e[type] !== ''
      )
      const dataDuplicate = []
      const groupKey = _.groupBy(dataCompare, type)
      const keys = Object.keys(groupKey)
      keys.map(k => {
        if (groupKey[k].length > 1 && k !== 'null') {
          dataDuplicate.push({ k, val: groupKey[k][0] })
        }
      })

      return { isDuplicate: dataDuplicate.length > 0, value: dataDuplicate }
    }
  }
}
