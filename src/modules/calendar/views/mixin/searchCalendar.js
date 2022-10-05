import moment from 'moment'

export default {
  data() {
    return {
      loading: false,

      showDialog: false,
      lstMeetingDefault: [],
      lstMeeting: [],
      headers: [
        {
          text: 'Thời gian',
          sortable: false,
          value: 'startTime',
          class: 'text--body-5 gray--text',
          align: 'center',
          width: '12%'
        },
        {
          text: ' ',
          sortable: false,
          align: "center",
          width: "3%",
        },
        {
          text: 'Địa điểm',
          sortable: false,
          value: 'roomName',
          class: 'text--body-5 gray--text',
          width: '20%'
        },
        {
          text: 'Tên lịch',
          sortable: false,
          value: 'title',
          class: 'text--body-5 gray--text',
          width: '20%'
        },
        {
          text: 'Trạng thái',
          sortable: false,
          value: 'status',
          class: 'text--body-5 gray--text',
          width: '10%'
        },
        {
          text: 'Chủ trì',
          sortable: false,
          value: 'chairman',
          class: 'text--body-5 gray--text',
          width: '13%'
        },
        {
          text: 'Người tham gia',
          sortable: false,
          value: 'participants',
          class: 'text--body-5 gray--text',
          width: '13%'
        },
        {
          text: 'Thao tác',
          sortable: false,
          value: 'action',
          class: 'text--body-5 gray--text',
          align: 'center',
          width: '8%'
        }
      ],

      page: 1,
      pageSize: 100000,

      params: null,
      showAdvance: false,

      timeoutOnScroll: null,
      totalCount: 0,
      removeEvent: false,
      meetingStartTime: null,
      meetingEndTime: null
    }
  },
  computed: {
    isExpired: {
      get() {
        return this.listIndexState.includes("EXPIRED")
      }
    },
    isPending: {
      get() {
        return this.listIndexState.includes("PENDING")
      }
    },
    isApprove: {
      get() {
        return this.listIndexState.includes("APPROVED")
      }
    },
    isReject: {
      get() {
        return this.listIndexState.includes("REJECTED")
      }
    },
    isCancel: {
      get() {
        return this.listIndexState.includes("CANCELED")
      }
    },
    countListMeeting() {
      return this.lstMeeting.length
    },
  },

  updated() {
    const table = this.$refs.tableParticipant;
    if (!table) return
    const keys = Object.keys(table.$vnode.componentInstance.openCache);
    if (keys.length > 0) {
      keys.forEach(x => {
        if (!this.checkDayCurrent(x)) table.$vnode.componentInstance.openCache[x] = false;
      })
    }
  },
  async created() {
    await this.initDate()
    this.search()
  },
  methods: {
    initDate() {
      this.meetingStartTime = moment().clone().startOf("isoWeek").format("DD/MM/YYYY")
      this.meetingEndTime = moment().clone().endOf("isoWeek").format("DD/MM/YYYY")
      this.formdata.meetingStartTime = this.meetingStartTime.replaceAll('/', '')
      this.formdata.meetingEndTime = this.meetingEndTime.replaceAll('/', '')
    },
    showDialogSave() {
      this.showDialog = true
    },
    closeDialogSave(status) {
      if (status) {
        this.lstMeetingDefault = []
        this.search()
      } else {
        this.removeEvent = true;
      }
      this.showDialog = false
    },
    searchDate(from, to) {
      this.formdata.meetingStartTime = from.replaceAll('/', '')
      this.formdata.meetingEndTime = null
      if (to) this.formdata.meetingEndTime = to.replaceAll('/', '')

      this.showAdvance = true
      this.search()
    },
    advanceSearch(params, listIndexState) {
      this.formdata = params
      this.showAdvance = true
      this.listIndexState = listIndexState
      this.page = 1
      this.search()
    },
    quickSearch() {
      this.showAdvance = true
      this.page = 1
      this.search()
    },
    genDateTime(item) {
      let startTime = ''
      let endTime = ''
      if (item.startTime) {
        if (item.startTime.includes(' ')) {
          const dateValue = item.startTime.split(' ')
          startTime = dateValue[0]
        }
      } else {
        return null
      }
      if (item.endTime) {
        if (item.endTime.includes(' ')) {
          const dateValue = item.endTime.split(' ')
          endTime = dateValue[0]
        }
      } else {
        return null
      }
      return `${startTime} - ${endTime}`
    },
    genDateValue(date) {
      const dateValue = moment(date, 'MM/DD/YYYY').lang('vi').format('dddd')
      return dateValue
    },
    genDate(date) {
      const dateValue = moment(date, 'MM/DD/YYYY').format('DD/MM/YYYY')
      return dateValue || ''
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    checkDayCurrent(date) {
      return moment(date, 'MM/DD/YYYY').diff(moment().format('MM/DD/YYYY'), 'days') === 0
    }

  }
}
