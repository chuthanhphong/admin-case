<template>
  <div>
    <v-style>
      <!-- do dai time line se tru di do dai cua top va bottom -->
      .v-timeline:before { height:
      {{ timeLineHeight - bottomLineHeight - topLineHeight }}px; top:
      {{ topLineHeight }}px;}
    </v-style>
    <div class="header-timeline">
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
        :class="item.opacity ? 'opacity' : null"
      >
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
                      :color="item.color"
                      v-on="on"
                    >
                      {{ getFirstCharacter(item) }}
                    </v-list-item-avatar>
                  </template>
                  <div>
                    <span v-if="item.fullName && item.userName"> {{ item.fullName }} ({{ item.userName }})</span>
                    <span v-else> {{ item.fullName }}</span>
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
                  <v-list-item-title>
                    <div class="text-wrap pt-1">
                      {{ item.fullName }}
                    </div>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <div v-if="item.positionName" class="text-wrap pt-1">
                      {{ item.positionName }}
                    </div>
                    <div v-if="item.groupPathName" class="text-wrap pt-1">
                      {{ item.groupPathName }}
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <b class="text-signer">{{ $t(item.signUserType) }}</b>
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
                <span class="ml-5 text--black">{{ $t(history.type) }}</span>
              </div>
              <div class="history-content">
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
                      <div>{{ $t('contract.note') }}:</div>
                      <span>{{ genComment(history.note) }}</span>
                    </div>
                  </v-tooltip>
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import constants from '@/constants'
import { mapActions } from 'vuex'

export default {
  name: 'DocumentSigners',
  components: {},
  props: {
    histories: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      signProcessId: null,
      signGroupId: null,
      groupPathName: null,
      titleConfirm: '',
      signTypeTmp: null,
      items: [],
      signGroupType: null,
      timeLineHeight: 0,
      bottomLineHeight: 0,
      topLineHeight: 0
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
        this.histories.map(his => {
          const docsHistories = []
          if (his.processDate) {
            docsHistories.push({
              date: his.processDate || '',
              note: his.signerComment,
              type: this.renderType(his.processStatus, his.signUserType)
            })
          }
          const data = {
            ...this.getIconHistory(his),
            userName: his.signUserName,
            fullName: his.signFullName,
            email: his.email,
            phone: his.phone,
            groupPathName: his.groupPathName,
            histories: docsHistories,
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
          return `contract.statusMain.${processed}`
        case constants.SIGN_USER_TYPE.FLASHES:
          return `contract.statusFlashes.${processed}`
        default:
          return `contract.statusReviewer.${processed}`
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
      }
    },
    getIconHistory(his) {
      if (his.processStatus === constants.SIGN_PROCCESS_STATUS.REJECTED) {
        return { color: '#FF4A55', icon: 'mdi-close' }
      }
      return { icon: 'mdi-check', color: '#0FAFE4' }
    },
    showExpandIcon(histories) {
      return histories && histories.length > 0
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
