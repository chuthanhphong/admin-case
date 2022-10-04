<template>
  <div>
    <v-style> .v-timeline:before { height:{{ timeLineHeight }}px; } </v-style>

    <div class="header-timeline mt-2">
      <span class="text--overlined-1">{{ $t('timeline.header.signer') }}</span>
      <span class="text--overlined-1">{{ $t('timeline.header.action') }}</span>
    </div>
    <v-timeline
      ref="historyTimeline"
      align-top
      dense
      class="history-timeline pr-4"
    >
      <v-timeline-item
        v-for="(item, i) in items"
        :key="i"
        :color="item.color"
        :icon="item.icon"
        fill-dot
        :small="item.small"
        class="history-item"
        :class="{ 'dot-border': item.icon == '' }"
      >
        <template v-slot:icon>
          <img
            v-if="item.icon === 'mdi-timer-sand'"
            src="@/assets/icons/hourglass.svg"
            width="35"
          >
          <v-icon v-else color="white">{{ item.icon }}</v-icon>
        </template>
        <div class="content-history-item">
          <div class="pa-2">
            <v-expansion-panels :readonly="!showExpandIcon(item.histories)">
              <v-expansion-panel ref="itemPanel" @click="setHeightHistory">
                <v-expansion-panel-header class="py-0" :hide-actions="true">
                  <v-list>
                    <v-list-item>
                      <v-list-item-avatar
                        :class="{
                          'bg-process': item.icon === 'mdi-timer-sand'
                        }"
                      >
                        {{ item.title ? item.title[0].toUpperCase() : '' }}
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title
                          class="text--body-1"
                          v-html="item.title"
                        />
                        <v-list-item-subtitle v-html="item.subtitle" />
                      </v-list-item-content>
                      <v-icon
                        v-if="showExpandIcon(item.histories)"
                        class="icon align-self-start icon-expand mr-2"
                      >$expand</v-icon>
                      <b class="text-signer">{{ $t(item.signUserType) }}</b>
                      <div class="history-action">
                        <div v-if="item.showIcons && item.showIcons.length > 0">
                          <div v-for="action in item.showIcons" :key="action">
                            <v-tooltip top content-class="tooltip-top">
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  color="primary"
                                  icon
                                  small
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="showDialogReview(action, i)"
                                >
                                  <img
                                    src="@/assets/icons/icon-refresh-active.svg"
                                    alt=""
                                  >
                                </v-btn>
                              </template>
                              <span>{{ $t(renderHistoryAction(action)) }}</span>
                            </v-tooltip>
                          </div>
                        </div>
                      </div>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card-text
                    v-if="item.histories"
                    class="pt-1 history-items pl-0"
                  >
                    <div
                      v-for="(history, index) in item.histories"
                      :key="index"
                      class="history-item-detail"
                      :class="classHistory(history)"
                    >
                      <span class="text-history-note">{{ history.date }}</span>
                      <div class="history-content text-history-note">
                        {{ history.content }}
                      </div>
                      <div v-if="history.note" class="pl-1 tooltip-note">
                        <v-tooltip
                          left
                          content-class="tooltip-left tooltip-note"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              size="20"
                              color="#4B506D"
                              v-bind="attrs"
                              v-on="on"
                            >mdi-alert-circle-outline</v-icon>
                          </template>
                          <div class="text-history-tooltip-note">
                            <div>{{ $t('contract.note') }}:</div>
                            <span> {{ history.note }}</span>
                          </div>
                        </v-tooltip>
                      </div>
                    </div>
                  </v-card-text>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </v-timeline-item>
    </v-timeline>
    <!-- Dialog doi nguoi xem xet -->
    <dialog-change-reviewer
      :form-data="formData"
      :show-dialog="showDialogChangeReviewer"
      :group-type="signGroupType"
      :group-id="signGroupId"
      :list-users="listUsers"
      :contract-id="contractId"
      @accept="showDialogConfirm"
      @close-dialog="closeDialogChangeReviewer"
    />
    <!-- Dialog doi nguoi ky -->
    <dialog-change-signer
      :form-data="formData"
      :show-dialog="showDialogChangeSigner"
      :group-type="signGroupType"
      :group-id="signGroupId"
      :list-users="listUsers"
      :contract-id="contractId"
      @accept="showDialogConfirm"
      @close-dialog="closeDialogChangeSinger"
    />
    <!-- Xac nhan doi nguoi ky, doi nguoi xem xet -->
    <dialog-confirm
      :show-dialog="showDialogChangeAdditional"
      :title-confirm="comfirmChange"
      @close-dialog="showDialogChangeAdditional = false"
      @accept="acceptChangeSigner"
    />
  </div>
</template>

<script>
import constants from '@/constants'
import moment from 'moment'
import { ContractService } from '@/modules/econtract/services/contractService'
import DialogChangeReviewer from './DialogChangeReviewer.vue'
import DialogConfirm from '@/modules/econtract/views/eContract/contract/sign/components/DialogConfirm.vue'
import DialogChangeSigner from './DialogChangeSigner.vue'
import { mapActions } from 'vuex'

const initData = {
  userId: '',
  userFullName: '',
  email: '',
  phone: '',
  note: '',
  groupId: '',
  groupName: ''
}
export default {
  components: {
    DialogChangeReviewer,
    DialogChangeSigner,
    DialogConfirm
  },
  props: {
    histories: {
      type: Array,
      default: undefined
    },
    documentId: {
      type: Number,
      default: undefined
    }
  },
  data: () => ({
    comfirmChange: null,
    timeLineHeight: 0,
    bottomLineHeight: 0,
    topLineHeight: 0,
    items: [],
    showDialogChangeSigner: false,
    showDialogChangeReviewer: false,
    signGroupType: null,
    signGroupId: null,
    listUsers: [],
    contractId: null,
    index: 0,
    showDialogChangeAdditional: false,
    param: null,
    formData: { ...initData },
    signProcessId: null,
    hasCoordinator: false
  }),
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
    closeDialogChangeReviewer() {
      this.showDialogChangeReviewer = false
      this.formData = { ...initData }
    },
    closeDialogChangeSinger() {
      this.showDialogChangeSigner = false
      this.formData = { ...initData }
    },
    // show dialog confirm dong y
    showDialogConfirm(param) {
      this.showDialogChangeAdditional = true
      this.comfirmChange = 'contract.titleConfirm.changeSignerTitle'
      if (
        this.histories[this.index].signUserType ===
        constants.SIGN_USER_TYPE.REVIEWER
      ) {
        this.comfirmChange = 'contract.titleConfirm.changeReviewerTitle'
      }
      this.param = param
    },
    // Xac nhan doi nguoi ky chinh, doi nguoi xem xet
    async acceptChangeSigner() {
      try {
        const formData = {
          signProcessId: this.histories[this.index].signProcessId,
          additionalSigner: this.param
        }
        const response = await ContractService.changeSigner(
          formData,
          this.documentId
        )
        if (response.status === 200) {
          let message = 'contract.titleConfirm.changeSignerSuccess'
          if (
            this.histories[this.index].signUserType ===
            constants.SIGN_USER_TYPE.REVIEWER
          ) {
            message = 'contract.titleConfirm.changeReviewerSuccess'
          }
          await Promise.all([
            this.getNotifySucces(message),
            this.closeDialogChangeReviewer(),
            this.closeDialogChangeSinger(),
            this.$emit('close-dialog')
          ])
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
    // show popup doi nguoi ky
    showDialogChangeSign() {
      this.showDialogChangeSigner = true
      this.getUsersByDocumentId()
    },
    // show popup doi nguoi xem xet
    showDialogChangeReview() {
      this.showDialogChangeReviewer = true
      this.getUsersByDocumentId()
    },
    showDialogReview(action, index) {
      this.index = index
      this.signGroupType = this.histories[this.index].groupType
      switch (action) {
        case constants.HISTORY_ACTIONS.CHANGE_MAIN:
          return this.showDialogChangeSign()
        case constants.HISTORY_ACTIONS.CHANGE_REVIEW:
          return this.showDialogChangeReview()
      }
    },
    // api load user trong he thong
    async getUsersByDocumentId() {
      try {
        if (!this.documentId) {
          return
        }
        const param = {
          documentId: this.documentId,
          signProcessId: this.histories[this.index].signProcessId
        }
        const response = await ContractService.searchUserSigner(param)
        if (response.success) {
          this.listUsers = response.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    showExpandIcon(histories) {
      return histories && histories.length > 0
    },
    renderHistoryAction(action) {
      var tooltip = ''
      switch (action) {
        case constants.HISTORY_ACTIONS.CHANGE_MAIN:
          tooltip = 'contract.label.changeSigner'
          break
        case constants.HISTORY_ACTIONS.CHANGE_REVIEW:
          tooltip = 'contract.label.changeReviewer'
          break
        case constants.HISTORY_ACTIONS.CHANGE_COORDINATOR:
          tooltip = 'contract.label.changeCoordinator'
          break
      }
      return tooltip
    },
    initHistotiesLayout() {
      this.hasCoordinator = false
      this.items = []
      if (this.histories != null && this.histories.length > 0) {
        this.histories.map(his => {
          const docsHistories = []
          if (his.docsHistory.length > 0) {
            his.docsHistory.map(doc => {
              const formatDateCreate = moment(
                doc.createdDate,
                'DD/MM/YYYY HH:mm'
              ).format('HH:mm DD/MM/YYYY')
              docsHistories.push({
                date: formatDateCreate,
                content: doc.description,
                note: doc.note,
                type: doc.actionType
              })
            })
          }
          const data = {
            ...this.getIconHistory(his),
            title: his.fullName,
            subtitle: `<div class="text-wrap">${his.emailPhone}</div><div class="text-wrap">${his.groupPathName}</div>`,
            signUserType: this.getSignUserType(his.signUserType),
            histories: docsHistories,
            showIcons: his.showIcons
          }
          this.items.push(data)
        })
      }
    },

    getIconHistory(his) {
      // console.log(
      //   `${his.processStatus} ${constants.SIGN_PROCCESS_STATUS.REJECTED}`
      // )
      if (his.processStatus === constants.SIGN_PROCCESS_STATUS.REJECTED) {
        return { color: '#F41941', icon: 'mdi-close', small: false }
      }
      if (
        his.signUserType === constants.SIGN_USER_TYPE.COORDINATOR &&
        his.processStatus === constants.SIGN_PROCCESS_STATUS.UNPROCESSED
      ) {
        if (!this.hasCoordinator) {
          this.hasCoordinator = true
          return { icon: 'mdi-timer-sand', color: '#FFAF2E', small: false }
        } else {
          return { icon: '', color: '#fff', small: true }
        }
      }
      if (
        his.userStep < his.docStep ||
        +his.userStep === 0 ||
        his.processStatus === constants.SIGN_PROCCESS_STATUS.PROCESSED
      ) {
        return { icon: 'mdi-check', color: '#0FAFE4', small: true }
      }
      if (his.userStep === his.docStep) {
        return { icon: 'mdi-timer-sand', color: '#FFAF2E', small: false }
      }
      if (his.userStep > his.docStep) {
        return { icon: '', color: '#fff', small: true }
      }
    },
    getSignUserType(signUserType) {
      switch (signUserType) {
        case constants.SIGN_USER_TYPE.MAIN:
          return 'contract.label.signUserType.main'
        case constants.SIGN_USER_TYPE.REVIEWER:
          return 'contract.label.signUserType.reviewer'
        case constants.SIGN_USER_TYPE.FLASHES:
          return 'contract.label.signUserType.flashes'
        case constants.SIGN_USER_TYPE.CREATOR:
          return 'contract.label.signUserType.creator'
        case constants.SIGN_USER_TYPE.COORDINATOR:
          return 'contract.label.signUserType.coordinator'
      }
    },
    setHeightHistory() {
      this.timeLineHeight = 0
      setTimeout(() => {
        const lstItem = this.$refs.itemPanel
        let totalHeight = 0
        let height = 0

        if (!lstItem || lstItem.length < 1) return
        for (const i of lstItem) {
          // tinh height cua tat ca nguoi ky, border
          totalHeight += i.$el.clientHeight + 2
          // tinh height cua nguoi ky cuoi cung, padding, border
          height = i.$el.clientHeight
        }
        // tinh do dai time line bang tong nguoi ky, padding
        this.timeLineHeight = totalHeight + lstItem.length * 40 - height - 50
      }, 250)
    },
    classHistory(his) {
      if (his.type && his.type === 'sign') {
        return 'cyan--text'
      }
      if (his.type && his.type === 'transfer') {
        return 'grey--text'
      }
    }
  }
}
</script>

<style lang="scss">
.wrap-history {
  .v-timeline-item__dot--small {
    height: 30px;
    width: 30px;
  }
}
.tooltip-note {
  max-width: 600px;
}
.history-item-detail > span {
  flex: 0 0 130px;
  float: left;
  margin-right: 5px;
}
.text-history-note {
  font-size: 12px;
  font-weight: 600;
}
.text-history-tooltip-note {
  font-size: 12px;
  font-weight: 400;
  @media (max-width: 1336px) {
    font-size: 10px;
    font-weight: 400;
  }
}
</style>
