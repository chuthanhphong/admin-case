<template>
  <div class="col-12 d-flex align-center justify-end">
    <v-menu
      v-if="listActionOther.length !== 0 && listActionOther"
      top
      :offset-y="true"
      content-class="arrow-center-list"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-200 py-5 mr-4 text--button btn-box-shadow"
          elevation="0"
          v-bind="attrs"
          v-on="on"
        >
          {{ $t('calendar.detailMeeting.other-action') }}
          <img src="@/assets/icons/calendar/other-action.png">
        </v-btn>
      </template>

      <v-list>
        <div
          v-for="(action, id) in listActionOther"
          :key="id"
          class="px-2 my-2 item-action cursor-pointer"
          @click="onBtnAction(action)"
        >
          <div
            v-html="
              renderAction(`${action}`)
            "
          />
        </div>
      </v-list>
    </v-menu>
    <v-btn
      rounded
      outlined
      color="primary"
      class="w-150 py-5 mr-4 text--button btn-box-shadow"
      elevation="0"
      @click="onBack()"
    >
      {{ $t('calendar.detailMeeting.back') }}
    </v-btn>
    <v-btn
      v-for="(action, index) in listActionShow"
      :key="index"
      rounded
      outlined
      :color="isCancelMeeting(action) ? '#FF4A55' : 'primary'"
      class="w-150 py-5 mr-4 text--button btn-box-shadow"
      elevation="0"
      @click="onBtnAction(action)"
    >
      {{ $t(textBtnAction(action)) }}
    </v-btn>
    <dialog-confirm
      :loading="loading"
      :obj-confirm="objConfirm"
      @accept-action="acceptAction"
      @close-dialog="closeDialogConfirm"
    />
  </div>
</template>
<script>
import constants from '@/constants'
import statusCalender from '@/modules/calendar/mixins/statusCalender'

// router
import calendarRoute from '@/modules/calendar/router/routePaths'

import DialogConfirm from '@/modules/calendar/views/components/DialogConfirm'

// mixins
import actionCalendar from '@/modules/calendar/mixins/actionCalendar'

export default {
  components: { DialogConfirm },
  mixins: [statusCalender, actionCalendar],
  props: {
    listAction: {
      type: Array,
      default: undefined
    },
    meetingId: {
      type: Number,
      default: undefined
    },
    status: {
      type: String,
      default: undefined
    },
    isOnlineMeeting: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      listActionOther: [],
      listActionShow: [],
      loading: false,
      objConfirm: {
        showDialogConfirm: false,
        titleConfirm: '',
        isReason: false,
        isNull: false,
        reason: ''
      },
      actionActive: null,
      formData: {
        meetingId: null,
        reason: ''
      }
    }
  },
  watch: {
  },
  mounted() {
    this.actionShow()
    this.actionsOther()
  },
  methods: {

    actionShow() {
      this.listActionShow = []
      // nhap
      if (this.status === constants.CALENDAR_STATUS.DRAFT) {
        this.listAction.filter(item => {
          if (item === constants.CALENDAR_ACTION.APPROVE) {
            this.listActionShow.push(item)
          }
        })
      }
      // cho duyet
      if (this.status === constants.CALENDAR_STATUS.DRAFT) {
        const arr = [
          constants.CALENDAR_ACTION.APPROVE,
          constants.CALENDAR_ACTION.REJECT
        ]
        this.listAction.filter(item => {
          if (arr.includes(item)) {
            this.listActionShow.push(item)
          }
        })
      }
      // da duyet co phong online
      if (this.status === constants.CALENDAR_STATUS.APPROVED && this.isOnlineMeeting) {
        const arr = [
          constants.CALENDAR_ACTION.PARTICIPATE,
          constants.CALENDAR_ACTION.CANCEL,
          constants.CALENDAR_ACTION.ADD_PARTICIPANT
        ]
        this.listAction.filter(item => {
          if (arr.includes(item)) {
            this.listActionShow.push(item)
          }
        })
      }
      // da duyet co phong offline
      if (this.status === constants.CALENDAR_STATUS.APPROVED && !this.isOnlineMeeting) {
        const arr = [
          constants.CALENDAR_ACTION.CANCEL,
          constants.CALENDAR_ACTION.ADD_PARTICIPANT
        ]
        this.listAction.filter(item => {
          if (arr.includes(item)) {
            this.listActionShow.push(item)
          }
        })
      }
      // tu choi + huy + qua han
      const arrStatus = [
        constants.CALENDAR_STATUS.REJECTED,
        constants.CALENDAR_STATUS.CANCELED,
        constants.CALENDAR_STATUS.EXPIRED,
      ]
      if (arrStatus.includes(this.status)) {
        this.listAction.filter(item => {
          if (item === constants.CALENDAR_ACTION.COPY) {
            this.listActionShow.push(item)
          }
        })
      }
    },
    actionsOther() {
      this.listActionOther = []
      // tru di list action show
      this.listActionOther = this.listAction.filter(item => !this.listActionShow.includes(item))
    },
    isCancelMeeting(action) {
      if (action === constants.CALENDAR_ACTION.CANCEL) {
        return true
      }
      return false
    },
    onBack() {
      this.$router.push(`${calendarRoute.CALENDAR_MANAGEMENT_MEETING_PATH}`)
    },
    onBtnAction(action) {
      this.objConfirm.titleConfirm = ''
      this.objConfirm.reason = ''
      this.objConfirm.isReason = false
      this.objConfirm.isNull = false
      switch (action) {
        // sua
        case constants.CALENDAR_ACTION.EDIT:
          break
        // gui
        case constants.CALENDAR_ACTION.SEND:
          this.objConfirm.titleConfirm = 'calendar.detailMeeting.confirm.sent'
          this.objConfirm.showDialogConfirm = true
          this.actionActive = constants.CALENDAR_ACTION.SEND
          break
        // duyet
        case constants.CALENDAR_ACTION.APPROVE:
          this.objConfirm.titleConfirm = 'calendar.detailMeeting.confirm.approve'
          this.objConfirm.showDialogConfirm = true
          this.actionActive = constants.CALENDAR_ACTION.APPROVE
          break
        // tu choi
        case constants.CALENDAR_ACTION.REJECT:
          this.objConfirm.titleConfirm = 'calendar.detailMeeting.confirm.reject'
          this.objConfirm.showDialogConfirm = true
          this.objConfirm.isReason = true
          this.objConfirm.isNull = true
          this.actionActive = constants.CALENDAR_ACTION.REJECT
          break
        // tham gia online
        case constants.CALENDAR_ACTION.JOIN_ONLINE_MEETING:
          break
        // them nguoi tham gia
        case constants.CALENDAR_ACTION.ADD_PARTICIPANT:
          break
        // them nguoi theo doi
        case constants.CALENDAR_ACTION.ADD_FOLLOWER:
          break
        // sao chep
        case constants.CALENDAR_ACTION.COPY:
          break
        // gui lai thong bao
        case constants.CALENDAR_ACTION.RESEND_NOTIFY:
          break
        // them thoi gian cuoc hop
        case constants.CALENDAR_ACTION.ADD_MEETING_MINUTE:
          break
        // tham gia
        case constants.CALENDAR_ACTION.PARTICIPATE:
          break
        // khong tham gia
        case constants.CALENDAR_ACTION.NOT_PARTICIPATE:
          this.objConfirm.titleConfirm = 'calendar.detailMeeting.confirm.not-participant'
          this.objConfirm.showDialogConfirm = true
          this.objConfirm.isReason = true
          this.objConfirm.isNull = false
          this.actionActive = constants.CALENDAR_ACTION.NOT_PARTICIPATE
          break
        // huy
        case constants.CALENDAR_ACTION.CANCEL:
          this.objConfirm.titleConfirm = 'calendar.detailMeeting.confirm.cancel'
          this.objConfirm.showDialogConfirm = true
          this.objConfirm.isReason = true
          this.objConfirm.isNull = true
          this.actionActive = constants.CALENDAR_ACTION.CANCEL
          break
        // xoa
        case constants.CALENDAR_ACTION.DELETE:
          this.objConfirm.titleConfirm = 'calendar.detailMeeting.confirm.delete'
          this.objConfirm.showDialogConfirm = true
          this.objConfirm.isNull = true
          this.actionActive = constants.CALENDAR_ACTION.DELETE
          break
        default:
          break
      }
    },
    async acceptAction() {
      this.formData.meetingId = this.meetingId
      this.formData.reason = this.objConfirm.reason
      await this.actionMeeting(this.actionActive, this.meetingId, this.formData)
      if (this.isBackList) {
        this.$router.push(`${calendarRoute.CALENDAR_MANAGEMENT_MEETING_PATH}`)
      }
      if (this.isReloadData) {
        this.$emit('reload-data')
      }
      this.closeDialogConfirm()
    },
    closeDialogConfirm() {
      this.objConfirm.reason = ''
      this.objConfirm.isReason = false
      this.objConfirm.isNull = false
      this.objConfirm.showDialogConfirm = false
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-action-other {
  min-width: 120px !important;

  .v-list {
    background: #252733 !important;
    color: #fff !important;
    font-family: 'Mulish';
    font-size: 14px;

    .btn-action {
      cursor: pointer;
      padding: 5px 0;
    }
  }
}

.arrow-bottom {
  contain: initial !important;
  overflow: visible !important;

  &:before {
    content: '';
    background: url('../../../../../assets/icons/arrow-up.png') no-repeat;
    width: 24px;
    height: 30px;
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.menu-action {
    box-shadow: none !important;

    .v-sheet.v-list {
      border-radius: 8px !important;
    }

    margin-top: 10px;

    &:before {
      content: '';
      background: url('../../../../../assets/icons/arrow-up-dark.png') no-repeat;
      width: 10px;
      height: 10px;
      position: absolute;
      top: -5px;
      right: 8px;
      left: unset;
    }
  }
}
</style>
