
// service
import { DocumentService } from '@/modules/edocument/services/documentService.js'

import constants from '@/constants'
import { mapActions } from "vuex";
import { isNull, isEmpty } from 'lodash'
import groupBy from 'lodash/groupBy'
import moment from 'moment'

const initFormData = {
  documentId: null,
  documentTitle: null,
  formulaTypeId: null,
  promulgateGroupId: null,
  promulgateGroupName: null,
  promulgateDate: null,
  bookGroupId: null,
  documentNumber: null, // So van ban.
  code: null, // So, ky hieu van ban.
  securityTypeId: null, // Do mat.
  priorityId: null, // Do khan.
  occupationId: null, // Nganh.
  expiredDate: null, // Het hieu luc,
  receivePlace: null, // Noi nhan van ban.
  handCopyPlace: null,
  receiveDate: null, // ngay den
  fileMainSigns: [],
  fileAttachments: null
}

const initSignerData = {
  signGroupId: '',
  signGroupName: '',
  signUserName: '',
  signFullName: '',
  signUserId: '',
  email: '',
  phone: '',
  step: '',
  signUserType: constants.USER_ROLE.MAIN,
}

export default {
  name: 'BookMixins',
  components: {
  },
  data() {
    return {
      numberOfCopy: null,
      messageErrorCopy: null,
      showBtnAdd: true,

      docType: '',
      typeDocument: null,
      isUpdate: true,
      formdata: {
        ...initFormData
      },
      lstGroupProclaim: [],
      lstUrgency: [],
      lstOccupation: [],
      lstSecurity: [],
      lstGroupBook: [],

      // Date Proclaim.
      openDateProclaim: false,
      errorDateProclaim: null,
      dateProclaimValue: null,
      dateProclaimPicker: null,

      // receive Date
      openDateReceive: false,
      errorDateReceive: null,
      dateReceiveValue: null,
      dateReceivePicker: null,

      // Processing deadline.
      openProcessing: false,
      errorProcessing: null,
      processingValue: null,
      processingPicker: null,

      isFirstLoad: false,
      loading: false,
      messageError: null,
      isGetSugget: false,

      documentId: null,
      documentType: null,
      isComplete: false,

      formulaTypeId: null,
      bookGroupId: null,
      documentTitle: '',
      code: '',
      documentNumber: '',
      suggestNumber: '',
      showWarning: false,
      groupCode: '',
      groupName: '',
      formulaTypeCode: '',
      bookGroupCode: null,
      promulgateGroupId: null,
      securityTypeId: null, // Do mat.
      priorityId: null, // Do khan.
      promulgateGroupName: '',
      promulgateGroupNameTemp: null,
      selectedGroup: null,
      showFilterGroup: false
    }
  },
  watch: {
    async dateProclaimPicker(date) {
      if (date) {
        this.dateProclaimValue = this.formatDate(date)
        this.getSuggestNumber()
      }
    },

    dateProclaimValue() {
      if (this.dateProclaimValue) {
        this.validateProcDate()
        this.validateReceiveDate()
        if (this.processingValue) {
          this.validateProcessDate()
        }
      } else {
        this.dateProclaimPicker = null
        this.errorDateProclaim = 'managementDoc.validate.errorDateProclaim'
      }
    },

    async dateReceivePicker(date) {
      if (date) {
        this.dateReceiveValue = this.formatDate(date)
      }
    },

    dateReceiveValue() {
      if (this.dateReceiveValue) {
        this.validateReceiveDate()
        this.validateProcDate()
      } else {
        this.dateReceivePicker = null
        this.errorDateReceive = 'managementDoc.validate.errorDateReceive'
      }
    },

    processingPicker(date) {
      if (date) {
        this.processingValue = this.formatDate(date)
      }
    },

    processingValue() {
      if (this.processingValue) {
        this.validateProcessDate()
        this.validateProcDate()
      } else {
        this.processingPicker = null
        this.errorProcessing = null
      }
    },

    formulaTypeId() {
      this.isValidStep()
    },

    priorityId() {
      this.isValidStep()
    },

    promulgateGroupId() {
      this.isValidStep()
    },

    securityTypeId() {
      this.isValidStep()
    },

    bookGroupId() {
      this.isValidStep()
    },

    documentTitle() {
      this.isValidStep()
    },

    errorDateProclaim() {
      this.isValidStep()
    },

    errorProcessing() {
      this.isValidStep()
    },

    errorDateReceive() {
      this.isValidStep()
    },

    documentNumber() {
      this.isValidStep()
    },

    numberOfCopy() {
      this.isValidStep()
    },

    code() {
      this.isValidStep()
    },
    // don vi ban hanh
    promulgateGroupName() {
      this.isValidStep()
    },
    // chon don vi
    async selectedGroup() {
      if (this.selectedGroup === null) {
        return
      }
      var item = this.lstGroupProclaim[this.selectedGroup]
      if (item) {
        this.tempGroup = item
      }
      this.promulgateGroupName = this.tempGroup.groupName
      this.promulgateGroupId = this.tempGroup.groupId
    }
  },
  computed: {
  },
  async created() {
    this.formdata = {
      ...initFormData,
      signers: [{ ...initSignerData }]
    }
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),

    validateProcDate() {
      var isValid = moment(
        this.dateProclaimValue,
        'DD/MM/YYYY',
        true
      ).isValid()

      if (!isValid) {
        this.errorDateProclaim = 'managementDoc.validate.dateProclaimInvalid'
        this.dateProclaimPicker = null
        return
      } else {
        this.dateProclaimPicker = moment(
          this.dateProclaimValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')

        this.errorDateProclaim = null
        return
      }
    },
    validateReceiveDate() {
      var isValidDate = moment(
        this.dateReceiveValue,
        'DD/MM/YYYY',
        true
      ).isValid()

      if (!isValidDate) {
        this.errorDateReceive = 'managementDoc.validate.dateReceiveInvalid'
        this.dateReceivePicker = null
        return
      } else {
        this.dateReceivePicker = moment(
          this.dateReceiveValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')

        const dateProclaim = moment(this.dateProclaimValue, 'DD/MM/YYYY')
        const dateReceive = moment(this.dateReceiveValue, 'DD/MM/YYYY')
        // check ngay ban hanh dung dinh dang khong
        if (!moment(this.dateProclaimValue, 'DD/MM/YYYY', true).isValid()) {
          this.errorDateReceive = null
          this.errorDateReceivedTo = 'managementDoc.validate.dateProclaimInvalid'
          return
        }
        // Check (Han xu ly < Ngay ban hanh)
        if (dateProclaim > dateReceive) {
          this.errorDateReceive = 'managementDoc.validate.receiveError1'
          return
        }

        this.errorDateReceive = null
        return
      }
    },
    validateProcessDate() {
      var isValidDate = moment(
        this.processingValue,
        'DD/MM/YYYY',
        true
      ).isValid()

      if (!isValidDate) {
        this.errorProcessing = 'managementDoc.validate.dateExpireInvalid'
        this.processingPicker = null
        return
      } else {
        this.processingPicker = moment(
          this.processingValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')

        const dateProclaim = moment(this.dateProclaimValue, 'DD/MM/YYYY')
        const dateProcessing = moment(this.processingValue, 'DD/MM/YYYY')

        // check ngay ban hanh dung dinh dang khong
        if (!moment(this.dateProclaimValue, 'DD/MM/YYYY', true).isValid()) {
          this.errorProcessing = null
          this.errorDateReceivedTo = 'managementDoc.validate.dateProclaimInvalid'
          return
        }
        // Check (Han xu ly < Ngay ban hanh)
        if (dateProclaim > dateProcessing) {
          this.errorProcessing = 'managementDoc.validate.processingError1'
          return
        }

        this.errorProcessing = null
        return
      }
    },
    clearPromulgateGroupName() {
      this.promulgateGroupName = null
    },

    checkTitleDoc() {
      this.docType = this.$t('document.docGo')
      if (this.typeDocument === constants.DOC_TYPE.RECEIVE) {
        this.docType = this.$t('document.docTo')
      }
    },

    genGroupName(group) {
      let groupName = 'group.partnerLabel'
      if (group.groupType === constants.GROUPS.INTERNAL) {
        groupName = group.parentPathName
      }
      return groupName
    },
    // dong popup danh sach nguoi ky
    async closeFilterCustomer() {
      setTimeout(() => {
        this.showFilterCustomer = false
      }, 200)
    },
    selectPromulgateGroup() {
      this.promulgateGroupNameTemp = null
      this.searchGroup()
    },
    // don vi ban hanh
    async searchDocumentByGroup() {
      this.formdata.promulgateGroupId = null
      this.formdata.promulgateGroupName = this.promulgateGroupName.trim()
      this.promulgateGroupName = this.promulgateGroupName.trim()
      this.showFilterGroup = false
    },
    // tim kiem don vi ban hanh
    async searchGroup(status) {
      if (
        this.promulgateGroupName &&
        this.promulgateGroupName.trim() === this.promulgateGroupNameTemp
      ) {
        return
      }
      const keyword =
        this.promulgateGroupName && this.promulgateGroupName.trim()
      this.promulgateGroupNameTemp = keyword
      const params = {
        groupName: keyword,
        pageSize: 1000000,
        restrictHierarchy: 'false'
      }
      const response = await DocumentService.search(params)
      if (response.success) {
        this.lstGroupProclaim = response.data ? response.data.data : []
        this.showFilterGroup = this.lstGroupProclaim.length > 0
      } else {
        console.log(response.messages)
      }
    },
    // bat su kien nhap don vi ban hanh
    onInputSearchGroup() {
      this.promulgateGroupId = null
      this.selectedGroup = null
      setTimeout(() => {
        this.searchGroup(false)
      }, 200)
    },
    // don popup don vi ban hanh
    async closeFilterGroup() {
      setTimeout(() => {
        this.showFilterGroup = false
      }, 200)
    },

    selectBookGroup(bookId) {
      const book = this.lstGroupBook.find(item => {
        return item.groupId === bookId
      })
      if (book) {
        this.bookGroupCode = book.groupCode
      }
      this.suggetCodeDocument()
      this.getSuggestNumber()
    },
    onInputRegister() {
      this.messageError = null
      this.suggetCodeDocument()
      if (this.documentNumber && this.documentNumber <= 0) {
        this.messageError = 'managementDoc.validate.documentNumber'
        return this.messageError
      }
      if (!this.documentNumber) {
        this.messageError = 'managementDoc.validate.documentNumberInvalid'
        return this.messageError
      }
    },
    onInputCopy() {
      this.messageErrorCopy = null
      if (this.numberOfCopy && this.numberOfCopy <= 0) {
        this.messageErrorCopy = 'managementDoc.validate.numberOfCopy'
        return this.messageErrorCopy
      }
    },
    trimSpace(val) {
      return val ? val.trim() : ''
    },

    suggetCodeDocument() {
      if (this.formulaTypeCode && this.bookGroupCode) {
        this.code = `${
          this.documentNumber
        }/${this.formulaTypeCode.toUpperCase()}-${this.bookGroupCode.toUpperCase()}`
      }
    },

    selectFormula(val) {
      const group = this.lstDocType.find(g => g.id === val)
      if (group) {
        this.formulaTypeCode = group.code
      }
      this.suggetCodeDocument()
    },

    isValidStep() {
      this.isComplete =
        !this.uploadingFile &&
        !isNull(this.formulaTypeId) &&
        !isNull(this.bookGroupId) &&
        !isEmpty(this.documentTitle) &&
        isNull(this.errorDateProclaim) &&
        !isEmpty(this.code) &&
        isNull(this.messageError) &&
        !isNull(this.documentNumber) &&
        !isEmpty(this.promulgateGroupName) &&
        !isNull(this.securityTypeId) &&
        !isNull(this.priorityId) &&
        this.isValidArray() &&
        this.validateReceive() &&
        isNull(this.messageErrorCopy) &&
        isNull(this.errorProcessing)
    },

    validateReceive() {
      if (this.checkTypeDocument) {
        return isNull(this.errorDateReceive)
      }
      return true
    },

    isValidArray() {
      return this.nameFileDocuments.length > 0
    },

    async getDocType() {
      try {
        const response = await DocumentService.getDocType()
        this.lstTypeDoc = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async getSecurity() {
      try {
        const response = await DocumentService.getListSecurity()
        this.lstSecurity = response.data
        if (this.lstSecurity) {
          this.securityTypeId = this.lstSecurity[0].id
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getPriority() {
      try {
        const response = await DocumentService.getDocPriority()
        this.lstUrgency = response.data
        if (this.lstUrgency) {
          this.priorityId = this.lstUrgency[0].id
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getOccupation() {
      try {
        const response = await DocumentService.getListOccupation()
        this.lstOccupation = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async warningPromulgate() {
      try {
        const param = {
          docType: this.typeDocument,
          documentId: this.documentId,
          formulaTypeId: this.formulaTypeId,
          securityTypeId: this.securityTypeId,
          promulgateDate: this.dateProclaimValue.replaceAll('/', ''),
          documentNumber: this.documentNumber,
          bookGroupId: this.bookGroupId
        }
        const response = await DocumentService.warningPromulgateNumber(param)
        this.showWarning = response.data
      } catch (error) {
        console.log(error)
      }
    },
    buildParamSigner(signers) {
      var count = 0
      const representGroups = []
      signers.map((signator) => {
        if (!signator.signGroupId) {
          signator.signUserId = null
        }
        if (signator.signFullName) {
          signator.step = ++count
        }
        representGroups.push(signator)
      })
      return representGroups
    },

    validateDuplicates() {
      const lstMsgError = []
      const keyUserGroup = this.isDuplicate('keyUserGroup')
      if (keyUserGroup && keyUserGroup.isDuplicate) {
        lstMsgError.push(
          `<li>
            ${keyUserGroup.value[0]['val'].signFullName}
            (${keyUserGroup.value[0]['val'].signUserName})
            ${this.$t('managementDoc.validate.duplicate')}
            ${keyUserGroup.value[0]['val'].signGroupName}
          </li>`
        )
      }
      if (lstMsgError.length > 0) {
        this.setNotify({
          show: true,
          type: 'error',
          content: `<ul>${lstMsgError.join('')}</ul>`
        })
      }
      let checkUser = true
      const checkNull = this.formdata.signers.find(e =>
        (!e.signFullName || e.signFullName === '')
      )
      if (checkNull) {
        checkUser = false
      }
      return lstMsgError.length === 0 && checkUser
    },

    isDuplicate(type) {
      // check trung nguoi ky trong don vi
      this.formdata.signers.filter(e => {
        e[type] = ''
        if (e.signUserId && e.signGroupId) {
          e[type] = `${e.signGroupId}-${e.signUserId}`
        }
      })

      const dataCompare = this.formdata.signers.filter(
        e => e[type] !== ''
      )
      const dataDuplicate = []
      const groupKey = groupBy(dataCompare, type)
      const keys = Object.keys(groupKey)
      keys.map(k => {
        if (groupKey[k].length > 1 && k !== 'null') {
          dataDuplicate.push({ k, val: groupKey[k][0] })
        }
      })

      return { isDuplicate: dataDuplicate.length > 0, value: dataDuplicate }
    },

    // Xoa ben ky
    removeSigner(index) {
      this.formdata.signers.splice(index, 1)
    },

    // Them ben ky
    addSigner() {
      this.formdata.signers.push({ ...initSignerData })
      this.validateDuplicates()
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    initDate() {
      this.dateProclaimValue = moment().format('DD/MM/YYYY')
      this.dateReceiveValue = moment().format('DD/MM/YYYY')
    },

    changeSecurity(val) {
      this.getSuggestNumber()
    },

    async onShowDialogConfirmSave() {
      await this.warningPromulgate()
      this.showConfirmContract = true
    },

    saveDocument() {
      this.saveSignatureDocument()
    }

  }
}
