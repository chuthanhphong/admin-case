import constants from '@/constants'
import moment from 'moment'
import config from '@/config'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      indexOpenFileDoc: null,
      documentIdSign: null,
      showAdvance: false,
      formdata: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keyword: '',
        fromDate: null,
        toDate: null,
        docState: null,
        searchType: constants.SEARCH_TYPE_DOCUMENT.PROCESS_DOCUMENT,
        processStatus: null,
        signUserTypes: [],
        type: null
      },
      listDocument: [],
      listSigner: [],
      dialogSigner: false,
      docName: '',
      showConfirmDialog: false,
      titleConfirmDialog: '',
      showDialogSign: false,
      docItem: null,
      docAction: null
    }
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    // Click item file sign.
    clickFileDoc(index, docId) {
      this.$emit('show-dialog-sign-file', index, docId)
    },

    gotoSign(docId) {
      this.$emit('show-dialog-sign', docId)
    },

    changeShowAdvance(value) {
      this.showAdvance = value
    },

    searchDocument() {
      this.formdata.page = ''
      this.search()
    },

    isValidDate(strDate) {
      return moment(strDate, 'DDMMYYYY', true).isValid()
    },
    // Avatar.
    async showDialogSigner(item) {
      var i = 0
      this.listSigner = item.signers
      for (const item of this.listSigner) {
        item.color = this.rdColor(i)
        i++
      }
      this.docName = item.documentTitle
      this.dialogSigner = true
    },

    onChangePage(page) {
      this.closePopupSigner()
      this.formdata.page = page
      this.page = page
      this.search()
    },

    // Dialog show confirm remove van ban trinh ky
    dialogConfirm() {
      this.showConfirmDialog = true
    },
    // accept remove van ban trinh ky
    async acceptConfirmDoc() {
      await this.clickAction(this.docAction, this.docItem)
      this.$emit('count-unprocess')
    },

    // show icon thao tac cua van ban
    showIconHandleDoc(action, item) {
      this.docItem = item
      this.docAction = action
      if (action === constants.LIST_ACTIONS_DETAIL.DELETE) {
        this.titleConfirmDialog =
          'document.titleComfirmRemove.comfirmRemoveContract'
        this.dialogConfirm()
        return
      }
      if (action === constants.LIST_ACTIONS_DETAIL.SUBMIT) {
        this.titleConfirmDialog = 'document.titleConfirm.confirmProclaimDoc'
        this.dialogConfirm()
        return
      }
      if (action === constants.LIST_ACTIONS_DETAIL.SIGN) {
        this.gotoSign(item.documentId)
        return
      }
      if (action === constants.LIST_ACTIONS_DETAIL.CANCEL) {
        this.titleConfirmDialog =
          'document.titleComfirmRemove.comfirmCancelContract'
        this.dialogConfirm()
        return
      }
      this.clickAction(action, item)
    },

    onCloseMenu(item) {
      return !item.showMenu
    }
  }
}
