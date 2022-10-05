import constants from '@/constants'
// vuex
import { mapActions } from 'vuex'
import { CalendarService } from '@/modules/calendar/services/calendarService'

export default {
  data() {
    return {
      isBackList: false,
      isReloadData: false
    }
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    async actionMeeting(action, meetingId, formData) {
      this.isBackList = false
      this.isReloadData = false
      switch (action) {
        // sua
        case constants.CALENDAR_ACTION.EDIT:
          break
        // gui
        case constants.CALENDAR_ACTION.SEND:
          try {
            const response = await CalendarService.sentMeeting(
              meetingId
            )
            if (response.status === 200) {
              this.setNotify({
                show: true,
                type: 'success',
                content: this.$t('calendar.detailMeeting.success.sent')
              })
              this.isReloadData = true
            }
          } catch (error) {
            const message = error.message
            this.setNotify({
              show: true,
              type: 'error',
              content: this.$t(message)
            })
          }
          this.objConfirm.showDialogConfirm = false
          break
        // duyet
        case constants.CALENDAR_ACTION.APPROVE:
          try {
            const response = await CalendarService.approveMeeting(
              meetingId
            )
            if (response.status === 200) {
              this.setNotify({
                show: true,
                type: 'success',
                content: this.$t('calendar.detailMeeting.success.approve')
              })
              this.isReloadData = true
            }
          } catch (error) {
            const message = error.message
            this.setNotify({
              show: true,
              type: 'error',
              content: this.$t(message)
            })
          }
          this.objConfirm.showDialogConfirm = false
          break
        // tu choi
        case constants.CALENDAR_ACTION.REJECT:
          try {
            const response = await CalendarService.rejectMeeting(
              formData
            )
            if (response.status === 200) {
              this.setNotify({
                show: true,
                type: 'success',
                content: this.$t('calendar.detailMeeting.success.reject')
              })
              this.isReloadData = true
            }
          } catch (error) {
            const message = error.message
            this.setNotify({
              show: true,
              type: 'error',
              content: this.$t(message)
            })
          }
          this.objConfirm.showDialogConfirm = false
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
          try {
            const response = await CalendarService.notParticipant(
              formData
            )
            if (response.status === 200) {
              this.setNotify({
                show: true,
                type: 'success',
                content: this.$t('calendar.detailMeeting.success.not-participant')
              })
              this.isBackList = true
            }
          } catch (error) {
            const message = error.message
            this.setNotify({
              show: true,
              type: 'error',
              content: this.$t(message)
            })
          }
          this.objConfirm.showDialogConfirm = false
          break
        // huy
        case constants.CALENDAR_ACTION.CANCEL:
          try {
            const response = await CalendarService.cancelMeeting(
              formData
            )
            if (response.status === 200) {
              this.setNotify({
                show: true,
                type: 'success',
                content: this.$t('calendar.detailMeeting.success.cancel')
              })
              this.isReloadData = true
            }
          } catch (error) {
            const message = error.message
            this.setNotify({
              show: true,
              type: 'error',
              content: this.$t(message)
            })
          }
          this.objConfirm.showDialogConfirm = false
          break
        // xoa
        case constants.CALENDAR_ACTION.DELETE:
          try {
            const response = await CalendarService.deleteMeeting(
              meetingId
            )
            if (response.status === 200) {
              this.setNotify({
                show: true,
                type: 'success',
                content: this.$t('calendar.detailMeeting.success.delete')
              })
              this.isBackList = true
            }
          } catch (error) {
            const message = error.message
            this.setNotify({
              show: true,
              type: 'error',
              content: this.$t(message)
            })
          }
          this.objConfirm.showDialogConfirm = false
          break
        default:
          break
      }
    }
  }
}
