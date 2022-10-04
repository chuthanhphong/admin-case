<template>
  <div>
    <v-style>
      <!-- do dai time line se tru di do dai cua top va bottom -->
      .v-timeline:before { height:
      {{ timeLineHeight - bottomLineHeight - topLineHeight }}px; top:
      {{ topLineHeight }}px;}
    </v-style>
    <div class="header-timeline mt-2">
      <span>{{ $t('timeline.header.signer') }}</span>
      <span>{{ $t('timeline.header.action') }}</span>
    </div>
    <v-timeline dense class="history-timeline pr-4">
      <v-timeline-item
        v-for="(item, i) in items"
        :key="i"
        :color="item.color"
        :icon="item.icon"
        fill-dot
        :small="item.small"
        class="history-item"
        :class="[{'dot-border': item.icon == ''},item.opacity ? 'opacity' : null]"
      >
        <template v-slot:icon>
          <img
            v-if="item.icon === 'mdi-timer-sand'"
            src="@/assets/icons/hourglass.svg"
            width="35"
          >
          <v-icon v-else color="white">{{ item.icon }}</v-icon>
        </template>
        <v-card ref="itemPanel" class="content-history-item">
          <v-card-title class="py-0 d-block">
            <v-list>
              <v-list-item>
                <v-tooltip
                  :disabled="isShowTooltip(item)"
                  left
                  content-class="tooltip-left"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-avatar
                      v-bind="attrs"
                      :class="[{
                        'bg-process': item.icon === 'mdi-timer-sand'
                      }, {'bg-danger': item.icon === 'mdi-close'}]"
                      v-on="on"
                    >
                      {{ getFirstCharacter(item) }}
                    </v-list-item-avatar>
                  </template>
                  <div>
                    <span v-if="item.fullName"> {{ item.fullName }}</span>
                  </div>
                  <div>
                    <small v-if="item.email" style="opacity: 60%">
                      {{ item.email }}</small>
                  </div>
                  <div>
                    <small v-if="item.phone" style="opacity: 60%">
                      {{ item.phone }}</small>
                  </div>
                </v-tooltip>

                <v-list-item-content>
                  <v-list-item-title
                    v-if="item.fullName"
                    v-html="item.fullName"
                  />
                  <v-list-item-title v-else v-html="item.positionName" />
                  <v-list-item-subtitle>
                    <div class="text-wrap">
                      <span v-if="item.fullName">
                        {{ renderSignerPosition(item) }}</span>
                    </div>
                    <div v-if="item.groupPathName" class="text-wrap pt-1">
                      {{ item.groupPathName }}
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <b class="text-signer">{{ $t(item.signUserType) }}</b>
                <div
                  v-if="item.showIcons && item.showIcons.length > 0"
                  class="history-action"
                >
                  <div v-for="action in item.showIcons" :key="action">
                    <v-tooltip top content-class="tooltip-top">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          icon
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="showDialog(item, action, i)"
                        >
                          <img src="@/assets/imgs/refresh.png" alt="">
                        </v-btn>
                      </template>
                      <span>{{ $t(renderHistoryAction(action)) }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </v-card-title>
          <v-divider v-if="showHistory(item)" class="border-signer" />
          <v-card-text v-if="showHistory(item)" class="py-1 history-items">
            <div
              v-for="(history, index) in item.histories"
              :key="index"
              class="history-item-detail"
              :class="classHistory(history)"
            >
              <div>
                <span>{{ history.date }}</span>
                <span class="ml-5 text-black">{{ $t(history.type) }}</span>
              </div>
              <div class="history-content-esignature">
                <span v-if="history.note" class="pl-1 tooltip-note">
                  <v-tooltip left content-class="tooltip-left tooltip-note">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        size="20"
                        color="#4B506D"
                        v-bind="attrs"
                        v-on="on"
                      >mdi-information-outline</v-icon>
                    </template>
                    <div>
                      <div>{{ $t('document.label.note') }}:</div>
                      <span v-html="history.note" />
                    </div>
                  </v-tooltip>
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>

    <!-- Dialog doi nguoi ky, ky nhay, xem xet -->
    <dialog-change-signer
      :title-confirm="titleConfirm"
      :show-dialog="showDialogChangeSigner"
      :list-users="listUsers"
      :doc-id="documentId"
      :group-id="signGroupId"
      :group-name="groupPathName"
      @accept="showDialogConfirm"
      @close-dialog="showDialogChangeSigner = false"
    />

    <!-- Dialog xac nhan doi nguoi ky, nguoi xem xet-->
    <dialog-confirm-change-signer
      :title-confirm="titleConfirmChange"
      :form-data="formData"
      :show-dialog="showConfirmChangeSigner"
      @close-dialog="showConfirmChangeSigner = false"
      @accept-action="acceptChange"
    />
  </div>
</template>

<script>
import constants from '@/constants'
import DialogChangeSigner from '@/modules/esignature/views/sign/components/DialogChangeSigner.vue'
import DialogConfirmChangeSigner from '@/modules/esignature/views/components/DialogConfirm.vue'
import { DocumentService } from '@/modules/esignature/services/documentService'
import { mapActions } from 'vuex'

export default {
  name: 'DocumentSigners',
  components: {
    DialogChangeSigner,
    DialogConfirmChangeSigner
  },
  props: {
    histories: {
      type: Array,
      default: undefined
    },
    documentId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      signProcessId: null,
      signGroupId: null,
      groupPathName: null,
      titleConfirm: '',
      formData: null,
      signTypeTmp: null,
      items: [],
      signGroupType: null,
      timeLineHeight: 0,
      bottomLineHeight: 0,
      topLineHeight: 0,
      showDialogChangeSigner: false,
      showConfirmChangeSigner: false,
      titleConfirmChange: null,
      listUsers: [] // list user change signer or reviewer
    }
  },
  watch: {
    histories() {
      this.initHistotiesLayout()
      setTimeout(() => {
        this.setHeightHistory()
      }, 100)
    }
  },
  mounted() {
    this.initHistotiesLayout()
    setTimeout(() => {
      this.setHeightHistory()
    }, 100)
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    showHistory(item) {
      return item.histories.length > 0
    },
    // Lay ky tu dau tien cua username
    getFirstCharacter(item) {
      if (!item) return ''
      if (item.fullName) {
        return this.genAvatar(item.fullName)
      }
      return this.genAvatar(item.positionName)
    },
    genAvatar(name) {
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },

    initHistotiesLayout() {
      this.items = []
      if (this.histories && this.histories.length > 0) {
        this.histories.map((his) => {
          const docsHistories = []
          if (his.processDateFormat) {
            docsHistories.push({
              date: his.processDateFormat || '',
              note: this.genComment(his.signerComment),
              type: this.renderType(his.processStatus, his.signUserType)
            })
          }
          const data = {
            ...this.getIconHistory(his),
            fullName: his.fullName,
            email: his.email,
            phone: his.phone,
            groupPathName: his.groupPathName,
            histories: docsHistories,
            showIcons: his.showIcons,
            positionName: his.positionName,
            signProcessType: his.signProcessType,
            signGroupId: his.signGroupId,
            signProcessId: his.signProcessId,
            signUserType: this.getSignUserType(his.signUserType)
          }
          this.items.push(data)
        })
      }
    },
    genComment(value) {
      if (value.includes('\n')) {
        return value.replaceAll('\n', '<br />')
      }
      return value
    },
    renderType(processStatus, signUserType) {
      let processed = 'processed'
      if (processStatus === constants.SIGN_PROCCESS_STATUS.REJECTED) {
        processed = 'reject'
      }
      switch (signUserType) {
        case constants.SIGN_USER_TYPE.MAIN:
          return `document.statusMain.${processed}`
        case constants.SIGN_USER_TYPE.FLASHES:
          return `document.statusFlashes.${processed}`
        default:
          return `document.statusReviewer.${processed}`
      }
    },
    getSignUserType(signUserType) {
      switch (signUserType) {
        case constants.SIGN_USER_TYPE.MAIN:
          return 'document.label.signUserType.main'
        case constants.SIGN_USER_TYPE.REVIEWER:
          return 'document.label.signUserType.reviewer'
        case constants.SIGN_USER_TYPE.FLASHES:
          return 'document.label.signUserType.flashes'
        case constants.SIGN_USER_TYPE.CREATOR:
          return 'document.label.signUserType.creator'
      }
    },
    getIconHistory(his) {
      if (his.processStatus === constants.SIGN_PROCCESS_STATUS.REJECTED) {
        return { color: '#FF4A55', icon: 'mdi-close' }
      }
      if (
        his.groupLevel < his.currentStep ||
        +his.step === 0 ||
        his.processStatus === constants.SIGN_PROCCESS_STATUS.PROCESSED
      ) {
        return { icon: 'mdi-check', color: '#0FAFE4' }
      }
      if (
        his.groupLevel === his.currentStep &&
        (his.state === constants.DOC_STATES.REJECT ||
          his.state === constants.DOC_STATES.CANCEL)
      ) {
        return { icon: 'mdi-timer-sand', color: '#FFAF2E', opacity: true }
      }
      if (his.groupLevel === his.currentStep) {
        return { icon: 'mdi-timer-sand', color: '#FFAF2E' }
      }
      if (his.groupLevel > his.currentStep) {
        return { icon: '', color: '#fff', small: true }
      }
    },
    showExpandIcon(histories) {
      return histories && histories.length > 0
    },
    showDialog(item, action, index) {
      this.signGroupId = item.signGroupId
      this.groupPathName = item.groupPathName
      this.signProcessId = item.signProcessId
      this.signTypeTmp = action
      this.index = index
      this.titleConfirm = ''
      this.showDialogChangeSigner = true
      switch (action) {
        case constants.HISTORY_ACTIONS.CHANGE_MAIN:
          this.titleConfirm = 'document.label.changeSigner'
          break
        case constants.HISTORY_ACTIONS.CHANGE_REVIEW:
          this.titleConfirm = 'document.label.changeReviewer'
          break
        case constants.HISTORY_ACTIONS.CHANGE_FLASH:
          this.titleConfirm = 'document.label.changeSignerFlash'
          break
      }
    },
    renderHistoryAction(action) {
      var tooltip = ''
      switch (action) {
        case constants.HISTORY_ACTIONS.CHANGE_MAIN:
          tooltip = 'document.label.changeSigner'
          break
        case constants.HISTORY_ACTIONS.CHANGE_REVIEW:
          tooltip = 'document.label.changeReviewer'
          break
        case constants.HISTORY_ACTIONS.CHANGE_FLASH:
          tooltip = 'document.label.changeSignerFlash'
          break
      }
      return tooltip
    },
    setHeightHistory() {
      setTimeout(() => {
        const lstItem = this.$refs.itemPanel
        let totalHeight = 0
        let height = 0
        if (!lstItem && lstItem.length < 1) return
        for (const i of lstItem) {
          // tinh height cua tat ca nguoi ky, border
          totalHeight += i.$el.clientHeight + 2
          // tinh height cua nguoi ky cuoi cung, padding, border
          height = (i.$el.clientHeight + 38) / 2
        }
        // tinh height cua nguoi ky dau tien, padding, border
        this.topLineHeight = (lstItem[0].$el.clientHeight + 38) / 2
        this.bottomLineHeight = height
        // tinh do dai time line bang tong nguoi ky, padding
        this.timeLineHeight = totalHeight + (lstItem.length + 1) * 24
      }, 50)
    },
    classHistory(his) {
      if (his.type && his.type === 'sign') {
        return 'cyan--text'
      }
      if (his.type && his.type === 'transfer') {
        return 'grey--text'
      }
    },

    // xac nhan change nguoi ky hoac nguoi xem xet.
    showDialogConfirm(params) {
      this.formData = params
      this.titleConfirmChange = 'document.titleConfirm.changeSignerTitle'

      if (!this.items) return
      if (
        this.items[this.index].showIcons.includes(
          constants.HISTORY_ACTIONS.CHANGE_REVIEW
        )
      ) {
        this.titleConfirmChange = 'document.titleConfirm.changeReviewerTitle'
      }

      if (
        this.items[this.index].showIcons.includes(
          constants.HISTORY_ACTIONS.CHANGE_FLASH
        )
      ) {
        this.titleConfirmChange = 'document.titleConfirm.changeFlashesTitle'
      }

      this.showConfirmChangeSigner = true
    },

    // accept change nguoi ky, nguoi xem xet
    async acceptChange() {
      this.showDialogChangeSigner = false
      try {
        this.formData['documentId'] = parseInt(this.documentId)
        this.formData['signProcessId'] = parseInt(this.signProcessId)

        const response = await DocumentService.changeSignerByCreator(
          this.formData
        )
        if (response.status === 200) {
          var message = 'document.titleConfirm.changeSignerDetailSuccess'
          if (this.signTypeTmp === constants.HISTORY_ACTIONS.CHANGE_REVIEW) {
            message = 'document.titleConfirm.changeReviewerDetailSuccess'
          }
          if (this.signTypeTmp === constants.HISTORY_ACTIONS.CHANGE_FLASH) {
            message = 'document.titleConfirm.changeFlashDetailSuccess'
          }
          this.getNotifySucces(message)
          this.$emit('close-dialog', this.documentId)
        }
      } catch (error) {
        this.getNotifyError(error)
      }
    },
    getNotifyError(error) {
      const typeAlert = 'error'
      const message = error.message
      this.setNotify({
        show: true,
        type: typeAlert,
        content: this.$t(message)
      })
    },
    getNotifySucces(message) {
      const typeAlert = 'success'
      this.setNotify({
        show: true,
        type: typeAlert,
        content: this.$t(message)
      })
    },

    isShowTooltip(item) {
      return !item.fullName && !item.phone && !item.email
    },

    renderSignerPosition(signer) {
      let signerPositionName = signer.positionName
      if (parseInt(signer.signProcessType) !== 1) {
        signerPositionName =
          signerPositionName +
          ' (' +
          this.$t('document.signaturePosition') +
          ')'
      }
      return signerPositionName
    }
  }
}
</script>

<style></style>
