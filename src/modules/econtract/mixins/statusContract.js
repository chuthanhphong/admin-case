import constants from '@/constants'
import econtractRoute from '@/modules/econtract/router/routePaths'
import { ContractService } from '@/modules/econtract/services/contractService'

export default {
  methods: {
    getFirstCharacter(name) {
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
    contractState(state, isCoordinate = false) {
      switch (state) {
        case constants.DOC_STATES.DRAFT:
          return `<span class="state-draft state-contract">${this.$t(
            'contract.states.draft'
          )}</span>`
        case constants.DOC_STATES.REJECT:
          return `<span class="state-reject state-contract">${this.$t(
            'contract.states.reject'
          )}</span>`
        case constants.DOC_STATES.IN_PROGRESS:
          return `<span class="state-in-process state-contract">${this.$t(
            'contract.states.inProcess'
          )}</span>`
        case constants.DOC_STATES.COMPLETE:
          return `<span class="state-complete state-contract">${this.$t(
            'contract.states.complete'
          )}</span>`
        case constants.DOC_STATES.CANCEL:
          return `<span class="state-cancel state-contract">${this.$t(
            'contract.states.cancel'
          )}</span>`
      }
    },
    renderAvatar(state, customer) {
      switch (state) {
        case constants.DOC_STATES.DRAFT:
          return `<span class="customer-state-draft customer-avatar">${customer[0]}</span>`
        case constants.DOC_STATES.REJECT:
          return `<span class="customer-state-reject customer-avatar">${customer[0]}</span>`
        case constants.DOC_STATES.IN_PROGRESS:
          return `<span class="customer-state-in-process customer-avatar">${customer[0]}</span>`
        case constants.DOC_STATES.COMPLETE:
          return `<span class="customer-state-complete customer-avatar">${customer[0]}</span>`
        case constants.DOC_STATES.CANCEL:
          return `<span class="customer-state-cancel customer-avatar">${customer[0]}</span>`
      }
    },
    renderAction(action, id) {
      // EDIT, DELETE, SEND, TEMPLATE, DELETE_TEMPLATE, CANCEL, DOWNLOAD, SIGN, DELETE_COORDINATE
      switch (action) {
        case constants.LIST_ACTIONS_DETAIL.EDIT: // Sua hop dong
          return this.action('pencil', 'contract.tooltip.edit')
        case constants.LIST_ACTIONS_DETAIL.DELETE: // Xoa hop dong
          return this.action(
            'delete-forever-outline',
            'contract.tooltip.delete'
          )
        case constants.LIST_ACTIONS_DETAIL.SEND: // Gui hop dong
          return this.action('send', 'contract.tooltip.send')
        case constants.LIST_ACTIONS_DETAIL.TEMPLATE: // Luu vs huy mau
          return this.action('clipboard-plus', 'contract.tooltip.save')
        case constants.LIST_ACTIONS_DETAIL.DELETE_TEMPLATE: // huy mau
          return this.action(
            'clipboard-remove',
            'contract.tooltip.cancelTemplate'
          )
        case constants.LIST_ACTIONS_DETAIL.CANCEL: // Huy luong
          return this.action('close-circle-outline', 'contract.tooltip.cancel')
        case constants.LIST_ACTIONS_DETAIL.DOWNLOAD: // Tai file hop dong
          return this.action('tray-arrow-down', 'contract.tooltip.download')
        case constants.LIST_ACTIONS_DETAIL.SIGN: // Ky
          return this.action('draw-pen', 'contract.tooltip.sign')
      }
    },
    action(icon, title) {
      return `
          <div class="btn-action">
            <i class='v-icon notranslate mdi mdi-${icon}'></i> 
            <span>${this.$t(title)}</span>
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
      let check = false
      if (
        item.showIcons &&
        item.showIcons.includes(constants.LIST_ACTIONS_DETAIL.SIGN)
      ) {
        check = true
      }
      return check
    },
    showNotify(type = 'success', content) {
      this.setNotify({
        show: true,
        type,
        content
      })
    },
    async getFileSign(item) {
      try {
        const fileSign = await ContractService.getFileSign(item.documentId)
        this.downloadFile(fileSign, item.fileName)
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
    async downloadFile(fileSign, fileName) {
      const downloadLink = document.createElement('a')
      document.body.appendChild(downloadLink)

      downloadLink.href = fileSign
      downloadLink.target = '_self'
      downloadLink.download = fileName
      downloadLink.click()
    },
    async clickAction(action, item) {
      // Tai file hop dong
      if (action === constants.LIST_ACTIONS_DETAIL.DOWNLOAD) {
        this.getFileSign(item)
      }
      // Gui hop dong
      if (action === constants.LIST_ACTIONS_DETAIL.SEND) {
        try {
          await ContractService.sendDocument(item.documentId)
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('contract.tooltip.send')
            })
          )
          // Goi lai danh sach
          this.searchContract()
        } catch (error) {
          this.showNotify('error', error.message)
        }

        return
      }
      // kY hop dong
      if (action === constants.LIST_ACTIONS_DETAIL.SIGN) {
        return this.$router.push(`${econtractRoute.SIGN_CONTRACT_PATH.replaceAll(':contractId', item.documentId)}`)
      }
      // Sua hop dong
      if (action === constants.LIST_ACTIONS_DETAIL.EDIT) {
        return this.$router.push(`${econtractRoute.UPDATE_CONTRACT_PATH.replaceAll(':contractId', item.documentId)}`)
      }
      // Dieu phoi hop dong
      if (action === constants.LIST_ACTIONS_DETAIL.COORDINATE) {
        return this.$router.push(`${econtractRoute.COORDINATION_CONTRACT_PATH.replaceAll(':contractId', item.documentId)}`)
      }

      // Xoa hop dong
      if (action === constants.LIST_ACTIONS_DETAIL.DELETE) {
        try {
          await ContractService.deleteContract(item.documentId)
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('contract.tooltip.delete')
            })
          )
          // Goi lai danh sach
          this.searchContract()
        } catch (error) {
          this.showNotify('error', error.message)
        }

        return
      }
      // Huy luong
      if (action === constants.LIST_ACTIONS_DETAIL.CANCEL) {
        try {
          await ContractService.cancelContract(item.documentId)
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('contract.tooltip.cancel')
            })
          )
          // Goi lai danh sach
          this.searchContract()
        } catch (error) {
          this.showNotify('error', error.message)
        }

        return
      }
    }
  }
}
