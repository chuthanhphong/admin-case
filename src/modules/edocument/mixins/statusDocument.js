import constants from '@/constants'
import { DocumentService } from '@/modules/edocument/services/documentService'
import edocumentRoute from '@/modules/edocument/router/routePaths'
import moment from 'moment'

export default {
  methods: {
    createdDate(date) {
      return moment(date, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')
    },
    valueProgress(item) {
      return (item.totalSignerProcessed / item.totalSigner) * 100
    },
    colorProgess(item) {
      switch (item) {
        case constants.DOC_STATES.DRAFT:
          return '#C1C9D2'
        case constants.DOC_STATES.IN_PROGRESS:
          return '#ffaf2e'
        case constants.DOC_STATES.COMPLETE:
          return '#0FAFE4'
        case constants.DOC_STATES.CANCEL:
          return '#F028A0'
        case constants.DOC_STATES.PROMULGATE:
          return '#1c49e9'
        default:
          return '#FF4A55'
      }
    },
    colorFile(fileName) {
      if (!fileName) {
        return
      }
      const type = fileName.split('.').pop()
      let icon = 'icon-file-pdf'
      if (type === 'doc' || type === 'docx') {
        icon = 'icon-file-doc'
      }
      if (type === 'xls' || type === 'xlsx') {
        icon = 'icon-file-excel'
      }
      return icon
    },
    iconFile(fileName) {
      if (!fileName) {
        return
      }
      const type = fileName.split('.').pop()
      let icon = 'mdi-file-pdf-box'
      if (type === 'doc' || type === 'docx') {
        icon = 'mdi-file-word-outline'
      }
      if (type === 'xls' || type === 'xlsx') {
        icon = 'mdi-file-excel-outline'
      }
      return icon
    },
    rednderIcon(item) {
      if (item.groupLevel > item.currentStep) {
        return ''
      }
      switch (item.processStatus) {
        case constants.SIGN_PROCCESS_STATUS.REJECTED:
          return `<button class="icon-docstate v-btn v-btn--icon v-btn--outlined v-btn--round v-size--x-small btn-reject">
          <i class='v-icon mdi mdi-close v-size--x-small'></i>
        </button>`
        case constants.SIGN_PROCCESS_STATUS.PROCESSED:
          return `<button class="icon-docstate v-btn v-btn--icon v-btn--outlined v-btn--round v-size--x-small btn-complete">
          <i class='v-icon mdi mdi-check v-size--x-small'></i>
        </button>`
        default:
          return `<button class="icon-docstate v-btn v-btn--icon v-btn--outlined v-btn--round v-size--x-small">
          <i class='v-icon mdi mdi-timer-sand v-size--x-small'></i>
        </button>`
      }
    },
    documentState(state) {
      switch (state) {
        case constants.DOC_STATES.DRAFT:
          return `<span class="state-draft state-contract">${this.$t(
            'document.states.draft'
          )}</span>`
        case constants.DOC_STATES.REJECT:
          return `<span class="state-reject state-contract">${this.$t(
            'document.states.reject'
          )}</span>`
        case constants.DOC_STATES.IN_PROGRESS:
          return `<span class="state-in-process state-contract">${this.$t(
            'document.states.inProcess'
          )}</span>`
        case constants.DOC_STATES.COMPLETE:
          return `<span class="state-complete state-contract">${this.$t(
            'document.states.complete'
          )}</span>`
        case constants.DOC_STATES.CANCEL:
          return `<span class="state-cancel state-contract">${this.$t(
            'document.states.cancel'
          )}</span>`
        case constants.DOC_STATES.PROMULGATE:
          return `<span class="state-proclaim state-contract">${this.$t(
            'electronicSign.docState.promulgate'
          )}</span>`
        case constants.DOC_STATES.PROMULGATE_CANCEL:
          return `<span class="state-unproclaim state-contract">${this.$t(
            'electronicSign.docState.cancelPromulgate'
          )}</span>`
      }
    },
    renderAction(action, type) {
      // EDIT, DELETE, SEND, TEMPLATE, DELETE_TEMPLATE, CANCEL, DOWNLOAD, SIGN, DELETE_COORDINATE
      switch (action) {
        case constants.LIST_ACTIONS_DETAIL.EDIT: // Sua hop dong
          return this.action('pencil', 'document.tooltip.edit')
        case constants.LIST_ACTIONS_DETAIL.DELETE: // Xoa hop dong
          return this.action('trash-can-outline', 'document.tooltip.delete')
        case constants.LIST_ACTIONS_DETAIL.SEND: // Gui hop dong
          return this.action('send', 'document.tooltip.send')
        case constants.LIST_ACTIONS_DETAIL.TEMPLATE: // Luu vs huy mau
          return this.action('clipboard-plus', 'document.tooltip.save')
        case constants.LIST_ACTIONS_DETAIL.DELETE_TEMPLATE: // huy mau
          return this.action(
            'clipboard-remove',
            'document.tooltip.cancelTemplate'
          )
        case constants.LIST_ACTIONS_DETAIL.CANCEL: // Huy luong
          return this.action('close-circle-outline', 'document.tooltip.cancel')
        // case constants.LIST_ACTIONS_DETAIL.DOWNLOAD: // Tai file hop dong
        //   return this.action('tray-arrow-down', 'document.tooltip.download')
        case constants.LIST_ACTIONS_DETAIL.SIGN: // Ky
          return this.actionSign('draw-pen', type)

        case constants.LIST_ACTIONS_DETAIL.COPY: // Sao chep
          return this.action('file-multiple-outline', 'document.tooltip.copy')
        case constants.LIST_ACTIONS_DETAIL.SUBMIT: // Trinh ky
          return this.action('send', 'document.tooltip.submit')
        case constants.LIST_ACTIONS_DETAIL.TRANSFER: // chuyen van ban
          return this.actionProclaim(
            require('@/assets/imgs/transfer-proclaim.png'),
            'document.tooltip.transfer'
          )

        case constants.LIST_ACTIONS_DETAIL.PROMULGATE: // Ban hanh
          return this.actionProclaim(
            require('@/assets/imgs/promulgate.png'),
            'proclaim'
          )
        case constants.LIST_ACTIONS_DETAIL.PROMULGATE_CANCEL: // Huy ban hanh
          return this.actionProclaim(
            require('@/assets/imgs/cancel-promulgate.png'),
            'cancelProclaim'
          )

        case constants.LIST_ACTIONS_DETAIL.SUBMIT2: // Them vao ho so
          return this.action('send', 'document.tooltip.addProfile')
        case constants.LIST_ACTIONS_DETAIL.SUBMIT3: // Ban giao
          return this.action('send', 'document.tooltip.handOver')

        case constants.LIST_ACTIONS_DETAIL.SAVE_LIBRARY: // Luu thu vien
          return this.actionProclaim(
            require('@/assets/icons/ic_save_lib.svg'),
            'document.tooltip.saveLibrary'
          )
        case constants.LIST_ACTIONS_DETAIL.EDIT_LIBRARY: // Sua thong tin thu vien
          return this.actionProclaim(
            require('@/assets/icons/ic_edit_lib.svg'),
            'document.tooltip.editLibrary'
          )
        case constants.LIST_ACTIONS_DETAIL.DELETE_LIBRARY: // Go thu vien
          return this.actionProclaim(
            require('@/assets/icons/ic_delete_lib.svg'),
            'document.tooltip.deleteLibrary'
          )
      }
    },
    actionSign(icon, type) {
      let title = 'document.tooltip.sign'
      if (type === constants.SIGN_USER_TYPE.FLASHES) {
        title = 'document.signType.flashes'
      }
      if (type === constants.SIGN_USER_TYPE.REVIEWER) {
        title = 'document.signType.reviewer'
      }
      return `
          <div class="btn-action">
            <i class='v-icon notranslate mdi mdi-${icon}'></i> 
            <span>${this.$t(title)}</span>
          </div>`
    },
    action(icon, title) {
      return `
          <div class="btn-action">
            <i class='v-icon notranslate mdi mdi-${icon}'></i> 
            <span>${this.$t(title)}</span>
          </div>`
    },

    actionProclaim(icon, title) {
      return `
          <div class="btn-action d-flex align-center">
            <img src="${icon}" alt="proclaim" width="24" height="24">
            <span class="ml-1">${this.$t(title)}</span>
          </div>`
    },

    viewDetail() {
      return `
      <div class="btn-action">
        <i class='v-icon notranslate mdi mdi-eye-outline'></i> 
        <span>${this.$t('document.tooltip.view')}</span>
      </div>`
    },
    signProcessStatus(status) {
      switch (status) {
        case constants.SIGN_PROCCESS_STATUS.UNPROCESSED:
          return `${this.$t('contract.signProcessStatus.unprocessed')}`
        case constants.SIGN_PROCCESS_STATUS.PROCESSED:
          return `${this.$t('contract.signProcessStatus.processed')}`
        case constants.SIGN_PROCCESS_STATUS.REJECT:
          return `${this.$t('contract.signProcessStatus.reject')}`
      }
    },
    checkIcon(item) {
      return (
        item.showIcons &&
        item.showIcons.includes(constants.LIST_ACTIONS_DETAIL.SIGN)
      )
    },
    showNotify(type = 'success', content) {
      this.setNotify({
        show: true,
        type,
        content
      })
    },

    async downloadFile(fileSign, fileName) {
      const downloadLink = document.createElement('a')
      document.body.appendChild(downloadLink)

      downloadLink.href = fileSign
      downloadLink.target = '_self'
      downloadLink.download = fileName
      downloadLink.click()
    },
    async clickAction(action, item, documentName) {
      localStorage.setItem(constants.SEARCH_TYPE_DOCUMENT.SEARCH_TYPE_DOC, documentName)
      switch (action) {
        case constants.LIST_ACTIONS_DETAIL.EDIT:
          if (item.edocumentType && item.edocumentType === 'EXTERNAL_DOCUMENT') {
            this.$router.push(
              `${edocumentRoute.UPDATE_BOOK_DOC_PATH.replaceAll(
                ':documentId',
                item.documentId
              )}`
            )
          }
          if (item.edocumentType && item.edocumentType === 'INTERNAL_DOCUMENT') {
            if (documentName === constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_BOOK_GO) {
              return this.$router.push(
                `${edocumentRoute.UPDATE_BOOK_DOC_GO_PATH.replaceAll(
                  ':documentId',
                  item.documentId
                ).replaceAll(':documentType', item.edocumentType)}`
              )
            }
            return this.$router.push(
              `${edocumentRoute.UPDATE_MANAGEMENT_DOC_GO_PATH.replaceAll(
                ':documentId',
                item.documentId
              ).replaceAll(':documentType', item.edocumentType)}`
            )
          }

          if (item.edocumentType && item.edocumentType === 'PERSONAL_DOCUMENT') {
            this.$router.push(
              `${edocumentRoute.UPDATE_MANAGEMENT_DOC_PATH.replaceAll(
                ':documentId',
                item.documentId
              )}`
            )
          }
          break
        case constants.LIST_ACTIONS_DETAIL.DELETE:
          try {
            await DocumentService.removeDocument(item.documentId)
            this.showNotify(
              'success',
              this.$t('managementDoc.messageSuccess.deleteDocument')
            )
            setTimeout(() => {
              // Goi lai danh sach
              this.searchDocument()
            }, 350)
          } catch (error) {
            this.showNotify('error', error.message)
          }

          break
        case constants.LIST_ACTIONS_DETAIL.CANCEL:
          try {
            await DocumentService.cancelDocument(item.documentId)
            this.showNotify(
              'success',
              this.$t('document.messageSuccess.cancelDocument')
            )
            setTimeout(() => {
              // Goi lai danh sach
              this.searchDocument()
            }, 350)
          } catch (error) {
            this.showNotify('error', error.message)
          }

          break
        case constants.LIST_ACTIONS_DETAIL.COPY:
          this.$router.push(
            `${constants.ROOT_PATH}app/document/copy/${item.documentId}`
          )
          break
        case constants.LIST_ACTIONS_DETAIL.SUBMIT:
          try {
            await DocumentService.sendDocument(item.documentId)
            this.showNotify(
              'success',
              this.$t('document.messageSuccess.proclaimDoc')
            )
            setTimeout(() => {
              // Goi lai danh sach
              this.searchDocument()
            }, 350)
          } catch (error) {
            this.showNotify('error', error.message)
          }
          break
        case constants.LIST_ACTIONS_DETAIL.TRANSFER:
          // code block
          break
        default:
          break
      }
    },
    renderTextStatus(processStatus, status) {
      switch (processStatus) {
        case constants.SIGN_PROCCESS_STATUS.UNPROCESSED: // Cho ky
          return `document.${status}.unprocessed`
        case constants.SIGN_PROCCESS_STATUS.PROCESSED: // Da ky
          return `document.${status}.processed`
        case constants.SIGN_PROCCESS_STATUS.REJECTED: // Tu choi
          return `document.${status}.reject`
        default:
          return ''
      }
    },
    renderStatus(status) {
      if (status.groupLevel > status.currentStep) {
        return ''
      }
      let statusText = 'statusFlashes'
      if (status.signUserType === constants.SIGN_USER_TYPE.MAIN) {
        statusText = 'statusMain'
      }
      return this.renderTextStatus(status.processStatus, statusText)
    },
    renderStatusProcess(item) {
      if (item.groupLevel > item.currentStep) {
        return ''
      }
      switch (item.signUserType) {
        case constants.SIGN_USER_TYPE.MAIN: // ky
          return `document.statusProcess.main`
        case constants.SIGN_USER_TYPE.FLASHES: // ky nhay
          return `document.statusProcess.flashes`
        default:
          return `document.statusProcess.reviewer` // xem xet
      }
    }
  }
}
