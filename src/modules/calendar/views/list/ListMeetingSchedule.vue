<template>
  <div
    class="wrap--list--common--calendar calendar-font wrap-content-calendar-search"
  >
    <div class="breadcrumb-text">
      <breadcrumbs :items="breadcrumbs" clazz="breadcrumb-text-calendar" />
    </div>

    <div class="wrap--content" style="height: 90vh">
      <SearchDocument :formdata="formdata" @show-dialog-save="showDialogSave" @advance-search="advanceSearch" />
      <div class="calendar-content-list mt-4">
        <v-data-table
          id="virtual-scroll-table"
          v-scroll:#virtual-scroll-table="onScroll"
          hide-default-footer
          fixed-header
          group-by="dateValue"
          :no-data-text="$t('noData')"
          :headers="headers"
          :items="lstMeeting"
          :items-per-page="countListMeeting"
          :class="{ 'disable-hover': activeIndex != null }"
        >
          <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
            <th
              colspan="2"
              class="date-header"
              style="border-bottom: none !important"
              @click="toggle"
            >
              <div class="d-flex justify-space-around my-2 py-1 date-value">
                <div
                  class="d-flex align-center calendar-date-text-1 text-capitalize"
                >
                  {{ genDateValue(items[0].dateValue) }}
                  {{ items[0].dateValue }} ({{ items.length }})
                </div>
                <v-icon>{{ isOpen ? '$expand' : 'mdi-chevron-up' }} </v-icon>
              </div>
            </th>
          </template>
          <!-- thoi gian hop -->
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center">
                {{ genDateTime(item) }}
              </td>
              <!-- dia diem -->
              <td class="text-left">
                {{ item.roomName }}
              </td>
              <!-- ten lich -->
              <td
                class="text-left"
                @click="onDetailMeeting(item)"
              >
                {{ item.title }}
              </td>
              <!-- trang thai -->
              <td class="text-left">
                <span v-html="calendarStatus(item.status)"></span>
              </td>
              <!-- Chu tri -->
              <td class="text-left">
                <div class="group-avatar-signer">
                  <div class="group-avatar d-flex align-center">
                    <avatar-signer
                      :lst-colors="lstColors"
                      :item="item"
                      :index-row="item.index"
                      class="list-signer"
                    />
                    <span class="render-signer-name">
                      {{ renderGroupName(item.chairman) }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- tham gia -->
              <td
                class="text-left link-hover"
                :class="{ 'popup-acvite': activeIndex == item.index }"
              >
                <div
                  v-if="item.participants.length === 1"
                  class="group-avatar-signer"
                >
                  <popup-signer
                    :list-show-popup="listShowPopup"
                    :lst-colors="lstColors"
                    :item="item"
                    :active-index="activeIndex"
                    :index="item.index"
                    @close-popup-signer="closePopupSigner"
                  />
                  <div class="group-avatar d-flex align-center">
                    <avatar-signer
                      :lst-colors="lstColors"
                      :item="item"
                      :index-row="item.index"
                      class="list-signer"
                      @active-show-popup-signer="activeShowPopupSigner"
                    />
                    <span class="render-signer-name">
                      {{ renderGroupName(item.participants[0]) }}
                    </span>
                  </div>
                </div>

                <div v-else class="group-avatar-signer">
                  <popup-signer
                    :list-show-popup="listShowPopup"
                    :lst-colors="lstColors"
                    :item="item"
                    :active-index="activeIndex"
                    :index="item.index"
                    @close-popup-signer="closePopupSigner"
                  />
                  <div class="group-avatar d-flex align-center">
                    <list-avatar-signer
                      :lst-colors="lstColors"
                      :item="item"
                      :index-row="item.index"
                      class="list-signer"
                      @active-show-popup-signer="activeShowPopupSigner"
                    />
                    <v-avatar
                      v-if="item.participants.length > 5"
                      size="32"
                      :color="lstColors[4]"
                      class="signer"
                      @click="activeShowPopupSigner(index)"
                    >
                      <span class="text-uppercase white--text">
                        {{ item.participants.length - 4 }}+
                      </span>
                    </v-avatar>
                  </div>
                </div>
              </td>

              <!-- Thao tac -->
              <td class="text-left">
                <div class="d-flex align-center justify-center">
                  <v-menu
                    v-if="item.showIcons && item.showIcons.length > 0"
                    :top="item.index > 5"
                    left
                    offset-y
                    transition="scroll-y-transition"
                    :content-class="
                      item.index <= 5
                        ? 'menu-action arrow-up'
                        : 'menu-action arrow-down-list'
                    "
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn text fab dense small v-bind="attrs" v-on="on">
                        <v-icon> mdi-dots-vertical </v-icon>
                      </v-btn>
                    </template>

                    <v-list class="px-2 item-action">
                      <div
                        @click="onDetailDoc(item)"
                        v-html="viewDetail(`${action}`, item.signUserType)"
                      />

                      <!-- RenAction -->
                      <div v-for="(action, id) in item.showIcons" :key="id">
                        <div
                          @click="showIconHandleDoc(`${action}`, item)"
                          v-html="renderAction(`${action}`, item.signUserType)"
                        />
                      </div>
                    </v-list>
                  </v-menu>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>
    <DialogSaveMeetingSchedule
      :show-dialog="showDialog"
      @close-dialog-save="closeDialogSave"
    />
  </div>
</template>
<script>
import calendarRoute from '@/modules/calendar/router/routePaths'
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import SearchDocument from '@/modules/calendar/views/list/components/SearchDocument'
import DialogSaveMeetingSchedule from '@/modules/calendar/views/create/DialogSaveMeetingSchedule'
import { CalendarService } from '@/modules/calendar/services/calendarService'
import statusCalender from '@/modules/calendar/mixins/statusCalender'
import customAvatar from '@/mixins/customAvatar'
import popupAvatar from '@/mixins/popupAvatar'
import PopupSigner from '@/modules/calendar/views/list/components/PopupSigner'
import ListAvatarSigner from '@/modules/calendar/views/list/components/ListAvatarSigner'
import AvatarSigner from '@/modules/calendar/views/list/components/AvatarSigner'
import { mapActions } from 'vuex'
import moment from 'moment'
import calendar from '@/modules/calendar/router/routePaths'

const initData = {
  keyword: '',
  meetingStartTime: null, // thoi gian bat dau hop
  meetingEndTime: null, // Thoi gian ket thuc hop
  createStartTime: null, // thoi gian tao tu
  createEndTime: null, // Thoi gian tao den
  status: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'EXPIRED'], // trang thai: DELETED, DRAFT, PENDING ,APPROVED, REJECTED, CANCELED, EXPIRED
  meetingTitle: null,
  calendarTypes: 'MEETING_SCHEDULE', // loai lich: MEETING_SCHEDULE, ON_CALL_SCHEDULE
  roomId: null, // Id phong hop
  roomName: null, // ten phong hop
  userId: null, // tim user tham gia hop
  groupId: null, // tim group tham gia hop
  participantName: null, // Tim thanh phan tham gia
  cycleType: null, // lich dinh ky: CYCLE_TYPE, ONCE, DAILY, WEEKLY, MONTHLY, QUARTERLY
  searchingType: 'CREATE' // PARTICIPATING: toi tham gia, GROUP: lich don vi, APPROVE: toi duyet, CREATE: toi tao
}

export default {
  components: {
    Breadcrumbs,
    SearchDocument,
    DialogSaveMeetingSchedule,
    PopupSigner,
    ListAvatarSigner,
    AvatarSigner
  },
  mixins: [statusCalender, customAvatar, popupAvatar],
  data: () => ({
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
        width: '10%'
      },
      {
        text: 'Địa điểm',
        sortable: false,
        value: 'roomName',
        class: 'text--body-5 gray--text',
        width: '15%'
      },
      {
        text: 'Tên lịch',
        sortable: false,
        value: 'title',
        class: 'text--body-5 gray--text',
        width: '15%'
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
        width: '15%'
      },
      {
        text: 'Người tham gia',
        sortable: false,
        value: 'participants',
        class: 'text--body-5 gray--text',
        width: '15%'
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
    breadcrumbs: [
      {
        text: 'menubar.calendar.moduleName',
        disabled: false,
        href: `${calendarRoute.CALENDAR_DASHBOARD}`
      },
      {
        text: 'menubar.calendar.meetingSchedule',
        disabled: true,
        href: ''
      }
    ],
    formdata: {
      ...initData
    },
    page: 1,
    pageSize: 10,

    params: null,
    showAdvance: false,

    timeoutOnScroll: null,
    totalCount: 0
  }),
  computed: {
    computedHeightTable() {
      const box = document.getElementById('virtual-scroll-table')
      return box.offsetHeight
    },
    countListMeeting() {
      return this.lstMeeting.length
    },
    isLoadMore() {
      return this.countListMeeting < this.totalCount
    }
  },
  async created() {
    await this.initDate()
    this.search()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),

    initDate() {
      this.formdata.createStartTime = moment()
        .subtract(365, 'days')
        .format('DD/MM/YYYY')
        .replaceAll('/', '')
      this.formdata.createEndTime = moment()
        .format('DD/MM/YYYY')
        .replaceAll('/', '')
      // this.formdata.meetingStartTime = moment().subtract(7, 'days').format('DD/MM/YYYY').replaceAll('/', '')
      // this.formdata.meetingEndTime = moment().format('DD/MM/YYYY').replaceAll('/', '')
    },
    showDialogSave() {
      this.showDialog = true
    },
    closeDialogSave(status) {
      if (status) {
        this.lstMeetingDefault = []
        this.search()
      }
      this.showDialog = false
    },
    advanceSearch(params) {
      this.formdata = params
      this.showAdvance = true
      this.search()
    },
    async search() {
      try {
        if (this.showAdvance) {
          this.lstMeetingDefault = []
        }
        const parms = { ...this.formdata }
        parms.page = this.page
        parms.pageSize = this.pageSize

        const response = await CalendarService.getListMeeting(parms)
        this.totalCount = response.data.totalElements

        response.data.data.map(item => {
          this.lstMeetingDefault.push(item)
        })

        // lay ra tat ca cac ngay trong list
        let index = 0
        this.lstMeeting = []
        this.lstMeetingDefault.filter(meeting => {
          meeting.index = index++
          if (meeting.startTime) {
            if (meeting.startTime.includes(' ')) {
              const dateValue = meeting.startTime.split(' ').pop()
              meeting.dateValue = dateValue
              this.lstMeeting.push(meeting)
            }
          }
        })
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      } finally {
        this.showAdvance = false
      }
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
      const dateValue = moment(date, 'DD/MM/YYYY').lang('vi').format('dddd')
      return dateValue
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    onScroll(e) {
      this.timeoutOnScroll && clearTimeout(this.timeoutOnScroll)
      this.timeoutOnScroll = setTimeout(() => {
        const heightContent = document.querySelector(
          '#virtual-scroll-table > .v-data-table__wrapper tbody'
        ).offsetHeight
        const heightHeader = 44
        const scrollTop =
          heightHeader + heightContent - this.computedHeightTable
        if (e.target.scrollTop >= scrollTop && this.isLoadMore) {
          this.page = this.page + 1
          this.search()
        }
      }, 20)
    },
    onDetailMeeting(item) {
      this.$router.push(
        `${calendar.CALENDAR_MEETING_DETAIL_PATH.replaceAll(
          ':meetingId',
          item.meetingId
        )}`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="./ListMeetingSchedule.scss"></style>
