import constants from '@/constants'

export default {
  methods: {
    renderAvatarText(customer) {
      return customer.signGroupName
        ? this.genAvatar(customer.signGroupName)
        : this.genAvatar(customer.signUserName);
    },
    genAvatar(name) {
      if (!name) return "";
      if (name.includes("+")) return name;
      if (name.includes(" ")) {
        // lay ky tu dau tien cua lastname.
        name = name.replaceAll(" ", " ").trim();
        const lastName = name.split(" ").pop();
        return lastName[0].toUpperCase();
      }
      return name[0].toUpperCase();
    },
    getFirstCharacter(name) {
      if (name.fullName.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.fullName.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name.fullName[0].toUpperCase()
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
    renderAvatar(status, customer) {
      switch (status) {
        case constants.CALENDAR_STATUS.DRAFT:
          return `<span class="customer-status-draft customer-avatar">${customer[0]}</span>`
        case constants.CALENDAR_STATUS.REJECTED:
          return `<span class="customer-status-reject customer-avatar">${customer[0]}</span>`
        case constants.CALENDAR_STATUS.DELETED:
          return `<span class="customer-status-deleted customer-avatar">${customer[0]}</span>`
        case constants.CALENDAR_STATUS.PENDING:
          return `<span class="customer-status-pending customer-avatar">${customer[0]}</span>`
        case constants.CALENDAR_STATUS.CANCELED:
          return `<span class="customer-status-cancel customer-avatar">${customer[0]}</span>`
        case constants.CALENDAR_STATUS.APPROVED:
          return `<span class="customer-status-appored customer-avatar">${customer[0]}</span>`
        case constants.CALENDAR_STATUS.EXPIRED:
          return `<span class="customer-status-expired customer-avatar">${customer[0]}</span>`
      }
    },
    calendarStatus(status) {
      switch (status) {
        case constants.CALENDAR_STATUS.DRAFT:
          return `<span class="state-calendar-draft state-calendar">${this.$t(
            'calendar.status.draft'
          )}</span>`
        case constants.CALENDAR_STATUS.PENDING:
          return `<span class="state-calendar-pending state-calendar">${this.$t(
            'calendar.status.pending'
          )}</span>`
        case constants.CALENDAR_STATUS.APPROVED:
          return `<span class="state-calendar-approve state-calendar">${this.$t(
            'calendar.status.approve'
          )}</span>`
        case constants.CALENDAR_STATUS.REJECTED:
          return `<span class="state-calendar-reject state-calendar">${this.$t(
            'calendar.status.reject'
          )}</span>`
        case constants.CALENDAR_STATUS.CANCELED:
          return `<span class="state-calendar-cancel state-calendar">${this.$t(
            'calendar.status.cancel'
          )}</span>`
        case constants.CALENDAR_STATUS.EXPIRED:
          return `<span class="state-calendar-expired state-calendar">${this.$t(
            'calendar.status.expired'
          )}</span>`
      }
    },
    renderAction(action, type) {
      // VIEW, EDIT, SEND,APPROVE,REJECT,JOIN_ONLINE_MEETING,ADD_PARTICIPANT,ADD_FOLLOWER,
      // COPY,RESEND_NOTIFY,ADD_MEETING_MINUTE,PARTICIPATE,NOT_PARTICIPATE,CANCEL,DELETE
      switch (action) {
        case constants.LIST_ACTIONS_DETAIL.EDIT: // Sua
          return this.action('pencil', 'calendar.tooltip.edit')
        case constants.LIST_ACTIONS_DETAIL.DELETE: // Xoa
          return this.action('trash-can-outline', 'calendar.tooltip.delete')
        case constants.LIST_ACTIONS_DETAIL.SEND: // Gui
          return this.action('send', 'calendar.tooltip.send')
        case constants.LIST_ACTIONS_DETAIL.CANCEL: // Huy
          return this.action('close-circle-outline', 'calendar.tooltip.cancel')
        case constants.LIST_ACTIONS_DETAIL.COPY: // Sao chep
          return this.action('file-multiple-outline', 'calendar.tooltip.copy')
        case constants.LIST_ACTIONS_DETAIL.APPROVE: // duyet
          return this.actionImage(
            require('@/assets/icons/calendar/approval.svg'),
            'calendar.tooltip.approve'
          )
        case constants.LIST_ACTIONS_DETAIL.REJECT: // tu choi
          return this.actionImage(
            require('@/assets/icons/calendar/approvaldeny.svg'),
            'calendar.tooltip.reject'
          )
        case constants.LIST_ACTIONS_DETAIL.JOIN_ONLINE_MEETING: // tham gia meet
          return this.action('send', 'calendar.tooltip.joinOnlineMeeting')
        case constants.LIST_ACTIONS_DETAIL.ADD_PARTICIPANT: // them tham gia
          return this.action('close-circle-outline', 'calendar.tooltip.addParticipant')
        case constants.LIST_ACTIONS_DETAIL.ADD_FOLLOWER: // them
          return this.action('file-multiple-outline', 'calendar.tooltip.copy')
        case constants.LIST_ACTIONS_DETAIL.RESEND_NOTIFY: // gui thong bao
          return this.action('pencil', 'calendar.tooltip.resendNotify')
        case constants.LIST_ACTIONS_DETAIL.ADD_MEETING_MINUTE: //
          return this.action('trash-can-outline', 'calendar.tooltip.delete')
        case constants.LIST_ACTIONS_DETAIL.PARTICIPATE: // Gui
          return this.action('send', 'calendar.tooltip.send')
        case constants.LIST_ACTIONS_DETAIL.NOT_PARTICIPATE: // bo tham gia
          return this.action('close-circle-outline', 'calendar.tooltip.notParticipant')
      }
    },
    action(icon, title) {
      return `
          <div class="btn-action">
            <i class='v-icon notranslate mdi mdi-${icon}'></i> 
            <span>${this.$t(title)}</span>
          </div>`
    },

    actionImage(icon, title) {
      return `
          <div class="btn-action d-flex">
            <img src="${icon}" alt="proclaim">
            <span class="ml-2">${this.$t(title)}</span>
          </div>`
    },

    viewDetail() {
      return `
      <div class="btn-action">
        <i class='v-icon notranslate mdi mdi-eye-outline'></i> 
        <span>${this.$t('document.tooltip.view')}</span>
      </div>`
    },

    textBtnAction(action) {
      let text = ''
      switch (action) {
        // sua
        case constants.CALENDAR_ACTION.EDIT:
          text = 'calendar.detailMeeting.edit'
          break
        // gui
        case constants.CALENDAR_ACTION.SEND:
          text = 'calendar.detailMeeting.send'
          break
        // duyet
        case constants.CALENDAR_ACTION.APPROVE:
          text = 'calendar.detailMeeting.approve'
          break
        // tu choi
        case constants.CALENDAR_ACTION.REJECT:
          text = 'calendar.detailMeeting.reject'
          break
        // tham gia online
        case constants.CALENDAR_ACTION.JOIN_ONLINE_MEETING:
          text = 'calendar.detailMeeting.join-online-meeting'
          break
        // them nguoi tham gia
        case constants.CALENDAR_ACTION.ADD_PARTICIPANT:
          text = 'calendar.detailMeeting.add-participation'
          break
        // them nguoi theo doi
        case constants.CALENDAR_ACTION.ADD_FOLLOWER:
          text = 'calendar.detailMeeting.add-follower'
          break
        // sao chep
        case constants.CALENDAR_ACTION.COPY:
          text = 'calendar.detailMeeting.copy'
          break
        // gui lai thong bao
        case constants.CALENDAR_ACTION.RESEND_NOTIFY:
          text = 'calendar.detailMeeting.resend-notify'
          break
        // them thoi gian cuoc hop
        case constants.CALENDAR_ACTION.ADD_MEETING_MINUTE:
          text = 'calendar.detailMeeting.add-meeting-minute'
          break
        // tham gia
        case constants.CALENDAR_ACTION.PARTICIPATE:
          text = 'calendar.detailMeeting.participate'
          break
        // khong tham gia
        case constants.CALENDAR_ACTION.NOT_PARTICIPATE:
          text = 'calendar.detailMeeting.not-participate'
          break
        // huy
        case constants.CALENDAR_ACTION.CANCEL:
          text = 'calendar.detailMeeting.cancel'
          break
        default:
          break
      }
      return text
    }
  }
}
