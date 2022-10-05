<template>
  <v-layout column class="calendar-font">
    <v-layout justify-space-between class="py-3 pl-4 pr-3">
      <h5 class="text-capitalize">
        {{ $t('advanceSearch') }}
      </h5>
      <v-icon @click="closeDialog">mdi-close</v-icon>
    </v-layout>
    <v-divider class="mb-4"></v-divider>
    <v-layout column class="scroll-advance-search-options overflow-y-auto px-6">
      <!-- ten lich -->
      <v-layout column>
        <label class="calendar-text--body-4 text-uppercase">
          {{ $t('calendar.createMeeting.meetingTitle') }}
        </label>
        <validation-provider name="contractName">
          <v-text-field
            v-model="formdata.meetingTitle"
            outlined
            dense
            clearable
            hide-details
            maxlength="200"
            counter="200"
            class="calendar-text--body-4"
            autofocus
            :placeholder="$t('Nhập tên lịch họp')"
            @change="formdata.meetingTitle = trimSpace(formdata.meetingTitle)"
          >
          </v-text-field>
        </validation-provider>
        <v-divider class="my-2"></v-divider>
      </v-layout>

      <!-- phong hop -->
      <v-layout column class="search-item">
        <label class="calendar-text--body-4 text-uppercase">
          {{ $t('calendar.createMeeting.roomMeeting') }}
        </label>
        <v-text-field
          v-model="roomName"
          :placeholder="$t('calendar.placeholder.roomMeeting')"
          outlined
          dense
          required
          maxlength="255"
          class="calendar-text--body-4"
          @click:clear="clearRoom"
          @input="onInputSearchRoom"
          @blur="closeFilterRoom"
          @change="roomName = trimSpace(roomName)"
          @click="selectRoom()"
        >
          <vue-feather slot="append" type="search" />
        </v-text-field>
        <div v-show="showFilterRoom" class="wrap-list-search-item search-room">
          <v-list dense>
            <v-list-item-group v-model="selectedRoom" color="primary">
              <v-list-item
                v-for="(room, idx) in lstMeetingRoom"
                :key="idx"
                two-line
                class="py-0"
              >
                <v-list-item-content class="py-0">
                  <v-list-item-title>{{ room.roomName }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
        <v-divider class="my-2"></v-divider>
      </v-layout>

      <!-- TRANG THAI -->
      <v-layout column>
        <label class="calendar-text--body-4 text-uppercase mb-3">
          {{ $t('calendar.advanceSearch.status') }}
        </label>
        <v-container>
          <v-row>
            <v-card
              v-for="(item, index) in lstStatus"
              :key="index"
              style="
                border-radius: 4px !important;
                width: 120px;
                box-shadow: 1px 2px 12px rgba(0, 0, 0, 0.15);
              "
              :class="
                listIndexState.includes(item.value) ? 'border-blue-status' : ''
              "
              class="pa-2 mr-3 mb-3"
              @click="chooseState(item.value)"
            >
              <v-layout align-center class="justify-center">
                <v-avatar
                  :color="getColorDotByStatus(item.value)"
                  size="15"
                  class="mr-1"
                >
                </v-avatar>
                <span
                  class="text--overlined-1 text-center"
                  :class="getColorTextByStatus(item.value)"
                  v-html="getTextByStatus(item.value)"
                >
                </span>
              </v-layout>
            </v-card>
          </v-row>
        </v-container>
        <v-divider class="mt-1 mb-2"></v-divider>
      </v-layout>

      <!-- loai lich -->
      <v-layout column>
        <label class="calendar-text--body-4 text-uppercase mb-3">
          {{ $t('calendar.advanceSearch.calendarType') }}
        </label>
        <v-container>
          <v-row>
            <v-col
              cols="5"
              class="pa-0"
            ><div
              style="
                border-radius: 4px !important;
                box-shadow: 1px 2px 12px rgba(0, 0, 0, 0.15);
              "
              class="pa-2 d-flex justify-center"
              :class="
                meetingSchedule ? 'border-blue-status' : ''
              "
            >
              <v-checkbox
                v-model="meetingSchedule"
                hide-details
                append-icon
                :label="$t('calendar.advanceSearch.calendarMeeting')"
                color="#0FAFE4"
                class="mt-0 pt-0"
              /></div></v-col>
            <v-col cols="2" class="pa-0" />
            <v-col cols="5" class="pa-0">
              <div
                style="
                border-radius: 4px !important;
                box-shadow: 1px 2px 12px rgba(0, 0, 0, 0.15);"
                class="pa-2 d-flex justify-center"
                :class="
                  onCallSchedule ? 'border-blue-status' : ''
                "
              >
                <v-checkbox
                  v-model="onCallSchedule"
                  hide-details
                  append-icon
                  :label="$t('calendar.advanceSearch.calendarOn')"
                  color="#0FAFE4"
                  class="mt-0 pt-0"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-divider class="mt-1 mb-4"></v-divider>
      </v-layout>

      <!-- THOI GIAN-->
      <v-layout column>
        <label class="calendar-text--body-4 text-uppercase mb-3">
          {{ $t('calendar.advanceSearch.timeMeeting') }}
        </label>
        <v-layout justify-space-between>
          <div>
            <v-layout column>
              <label class="calendar-text--body-4 text-uppercase">
                {{ $t('calendar.advanceSearch.fromDate') }}
              </label>
              <v-menu
                v-model="menuMeetingStartTime"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="270px"
                max-width="270px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="meetingStartTimeValue"
                    outlined
                    placeholder="DD/MM/YYYY"
                    dense
                    v-bind="attrs"
                    class="calendar-text--body-4 mw-175"
                    :error-messages="$t(errorMeetingStartTime)"
                    v-on="on"
                    @click:append="menuMeetingStartTime = !menuMeetingStartTime"
                  >
                    <template v-slot:append>
                      <i
                        class="app-icon icon-calendar darken"
                        @click="menuMeetingStartTime = !menuMeetingStartTime"
                      ></i>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="meetingStartTimePicker"
                  :locale="localDate"
                  no-title
                  show-adjacent-months
                  @input="menuMeetingStartTime = false"
                />
              </v-menu>
            </v-layout>
          </div>
          <div>
            <v-layout column>
              <label class="calendar-text--body-4 text-uppercase">
                {{ $t('calendar.advanceSearch.toDate') }}
              </label>
              <v-menu
                v-model="menuMeetingEndTime"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="270px"
                max-width="270px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="meetingEndTimeValue"
                    outlined
                    placeholder="DD/MM/YYYY"
                    dense
                    v-bind="attrs"
                    class="calendar-text--body-4 mw-175"
                    :error-messages="$t(errorMeetingEndTime)"
                    v-on="on"
                    @click:append="menuMeetingEndTime = !menuMeetingEndTime"
                  >
                    <template v-slot:append>
                      <i
                        class="app-icon icon-calendar darken"
                        @click="menuMeetingEndTime = !menuMeetingEndTime"
                      ></i>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="meetingEndTimePicker"
                  :locale="localDate"
                  no-title
                  show-adjacent-months
                  @input="menuMeetingEndTime = false"
                />
              </v-menu>
            </v-layout>
          </div>
        </v-layout>
      </v-layout>
      <v-divider class="my-2"></v-divider>

      <!-- THANH PHAN THAM GIA -->
      <v-layout column class="participant-item">
        <label class="calendar-text--body-4 text-uppercase">
          {{ $t('calendar.createMeeting.meetingParticipants') }}
        </label>
        <v-text-field
          v-model="participantName"
          class="calendar-text--body-4"
          outlined
          maxlength="255"
          dense
          :placeholder="$t('calendar.placeholder.participan')"
          @change="
            participantName = trimSpace(participantName)
          "
          @input="onInputSearchCustomer"
          @click:clear="clearSignerName"
          @click="selectSigner()"
          @blur="closeFilterCustomer"
          @keyup.enter="addSigner()"
        >
          <vue-feather slot="append" type="search" />
        </v-text-field>
        <div v-show="showFilterCustomer" class="wrap-list-search-user">
          <v-list :autofocus="true" dense>
            <v-list-item-group v-model="selectedCustomer" color="primary">
              <v-list-item
                v-for="(user, idx) in listCustomer"
                :key="idx"
                two-line
                class="py-0"
              >
                <v-list-item-content class="py-0">
                  <v-list-item-title v-if="user.userId">
                    {{ user.participantName }}
                    ({{ user.username }})
                  </v-list-item-title>
                  <v-list-item-title v-else>{{
                    user.participantName
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ genEmailAndPhone(user) }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{ genPositionName(user) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-layout>

      <!-- lich dinh ky -->
      <v-layout column>
        <label class="calendar-text--body-4 text-uppercase">
          {{ $t('calendar.advanceSearch.calendarCycle') }}
        </label>
        <v-select
          v-model="cycleText"
          :no-data-text="$t('noData')"
          :placeholder="$t('calendar.placeholder.daily')"
          outlined
          dense
          hide-selected
          hide-details
          floating
          solo
          :menu-props="{
            top: true,
            offsetY: true
          }"
          :items="lstCycleType"
          item-text="name"
          item-value="code"
          attach
          class="calendar-text--body-4"
        >
        </v-select>
        <v-divider v-if="false" class="my-4"></v-divider>
      </v-layout>

      <!-- bien ban hop -->
      <v-layout v-if="false" column>
        <label class="calendar-text--body-4 text-uppercase">
          {{ $t('calendar.advanceSearch.hasMeetingMinute') }}
        </label>
        <v-select
          v-model="participants"
          outlined
          dense
          hide-selected
          hide-details
          floating
          solo
          class="calendar-text--body-4"
          :items="listParticipant"
          item-text="fullName"
          chips
          deletable-chips
          attach
        >
        </v-select>
      </v-layout>
    </v-layout>

    <!-- ACTIONS -->
    <v-divider class="my-2"></v-divider>
    <v-layout column class="px-6">
      <v-layout justify-space-around class="mt-1 mb-4">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-150 py-5 mr-4 text--button"
          elevation="0"
          @click="clearFilter"
        >
          {{ $t('calendar.advanceSearch.clearSearch') }}
        </v-btn>
        <v-btn
          rounded
          color="primary"
          class="w-150 py-5 text--button"
          elevation="0"
          :disabled="!isComplete"
          @click="onSubmit"
        >
          {{ $t('calendar.advanceSearch.submit') }}
        </v-btn>
      </v-layout>
    </v-layout>
  </v-layout>
</template>
<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import filterItems from '@/mixins/filterItems.js'
import { CalendarService } from '@/modules/calendar/services/calendarService'
import roomCalendar from '@/modules/calendar/views/mixin/roomCalendar'
import { isNull } from 'lodash'

export default {
  name: 'SearchAdvanceCalendar',
  mixins: [filterItems, roomCalendar],
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    listParticipant: {
      type: Array,
      default: undefined
    },
    showAdvance: {
      type: Boolean,
      default: false
    },
    searchingType: {
      type: String,
      default: null
    },
    meetingStartTime: {
      type: String,
      default: null
    },
    meetingEndTime: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isComplete: false,

      menuCreateDateFrom: false,
      createDateFromFm: null,
      createDateFrom: null,
      errorCreateDateFrom: null,

      menuCreateDateTo: false,
      createDateToFm: null,
      createDateTo: null,
      errorCreateDateTo: null,
      isChooseDate: false,
      lstCycleType: [], // danh sach lich dinh ky
      lstStatus: [
        {
          name: 'Chờ duyệt',
          value: 'PENDING'
        },
        {
          name: 'Đã duyệt',
          value: 'APPROVED'
        },
        {
          name: 'Từ chối',
          value: 'REJECTED'
        },
        {
          name: 'Hủy',
          value: 'CANCELED'
        },
        {
          name: 'Hết hạn duyệt',
          value: 'EXPIRED'
        }
      ],
      chooseStatus: [],

      participants: null,
      cycleText: '',

      // thoi hop tao from.
      menuMeetingStartTime: null,
      errorMeetingStartTime: null,
      meetingStartTimePicker: null,
      meetingStartTimeValue: null,

      // thoi hop tao to.
      menuMeetingEndTime: null,
      errorMeetingEndTime: null,
      meetingEndTimePicker: null,
      meetingEndTimeValue: null,

      listIndexState: [], // danh sach trang thai actice

      selectedCustomer: null,
      tempCustomer: null,
      listCustomer: [],
      participantName: null,
      keywordTemp: null,
      groupId: null,
      userId: null,
      showFilterCustomer: false,

      meetingSchedule: false,
      onCallSchedule: false,

      meetingStartTimeValueDefault: null,
      meetingEndTimeValueDefault: null,
    }
  },
  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    }
  },
  watch: {

    showAdvance() {
      if (this.showAdvance) {
        this.initDate()
      }
    },
    selectedCustomer() {
      if (this.selectedCustomer == null) {
        return
      }
      var item = this.listCustomer[this.selectedCustomer]
      if (item) {
        this.tempCustomer = item
      }
      this.groupId = this.tempCustomer.groupId
      this.userId = this.tempCustomer.userId
      this.participantName = this.tempCustomer.participantName

      this.closeFilterCustomer()
    },

    // thoi gian hop

    meetingStartTimePicker(date) {
      if (date) this.meetingStartTimeValue = this.formatDate(date)
    },

    meetingEndTimePicker(date) {
      if (date) this.meetingEndTimeValue = this.formatDate(date)
    },

    meetingStartTimeValue() {
      if (this.meetingStartTimeValue) {
        this.validateMeetingStartTime()
        if (this.meetingEndTimeValue) this.validateMeetingEndTime()
      } else {
        this.meetingStartTimePicker = null
        this.errorMeetingStartTime = null
      }
      this.checkDisbaleButton()
    },

    meetingEndTimeValue() {
      if (this.meetingEndTimeValue) {
        if (this.meetingStartTimeValue) this.validateMeetingStartTime()
        this.validateMeetingEndTime()
      } else {
        this.meetingEndTimePicker = null
        this.errorMeetingEndTime = null
      }
      this.checkDisbaleButton()
    },

    roomName() {
      this.checkDisbaleButton()
    },
    cycleText() {
      this.checkDisbaleButton()
    },
    participantName() {
      this.checkDisbaleButton()
    },
    listIndexState() {
      this.checkDisbaleButton()
    }
  },
  async created() {
    this.loadCycleTypes()
    await this.initDate()
    if (this.showAdvance) {
      this.initData()
    }
  },
  methods: {
    ...mapActions('layout', ['setNotify']),

    genEmailAndPhone(user) {
      if (user.phone) {
        return `${user.email} - ${user.phone}`
      }
      return user.email
    },
    genPositionName(user) {
      if (user.positionName) {
        return `${user.positionName} - ${user.groupPathName}`
      }
      return user.groupPathName ? `${user.groupPathName}` : ''
    },
    closeFilterCustomer() {
      setTimeout(() => {
        this.showFilterCustomer = false
      }, 200)
    },
    clearSignerName() {
      this.groupId = ''
      this.phone = ''
      this.participantName = ''
      this.participantId = ''
      this.userId = ''
    },
    // nhap de tim kiem nguoi ky
    onInputSearchCustomer() {
      this.selectedCustomer = null
      this.userId = null
      this.groupId = null
      setTimeout(() => {
        this.searchCustomer()
      }, 200)
    },

    // click chon ten nguoi ky
    selectSigner() {
      this.keywordTemp = null
      this.searchCustomer()
    },

    async searchCustomer() {
      if (
        this.participantName &&
        this.participantName.trim() === this.keywordTemp
      ) {
        return
      }
      this.keywordTemp = this.participantName && this.participantName.trim()

      const params = {
        keyword: this.participantName
      }

      const response = await CalendarService.searchParticipant(params)
      if (response.success) {
        this.listCustomer = response.data ? response.data : []
        // this.filterCustomers()
      } else {
        console.log(response.messages)
      }
      this.showFilterCustomer = this.listCustomer.length > 0
    },

    initData() {
      this.listIndexState = this.formdata.status
      this.selectedCustomer = null
      this.tempCustomer = null
      this.listCustomer = []
      this.participantName = null
      this.keywordTemp = null
      this.groupId = null
      this.userId = null
      this.showFilterCustomer = false

      this.onCallSchedule = false
      this.meetingSchedule = false
    },

    checkDisbaleButton() {
      this.isComplete =
        isNull(this.errorMeetingStartTime) &&
        isNull(this.errorMeetingEndTime)
    },
    // validate thoi gian hop
    validateMeetingStartTime() {
      var isValid = moment(
        this.meetingStartTimeValue,
        'DD/MM/YYYY',
        true
      ).isValid()

      if (!isValid) {
        this.errorMeetingStartTime = 'calendar.messError.dateMeetingInvalid'
        this.meetingStartTimePicker = null
        return
      }

      if (isValid) {
        this.meetingStartTimePicker = moment(
          this.meetingStartTimeValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')

        const dateTo = moment(this.meetingEndTimeValue, 'DD/MM/YYYY')
        const dateFrom = moment(this.meetingStartTimeValue, 'DD/MM/YYYY')
        const diff = dateTo.diff(dateFrom, 'days')
        this.errorMeetingStartTime = null

        if (
          this.meetingEndTimeValue &&
          !moment(this.meetingEndTimeValue, 'DD/MM/YYYY', true).isValid()
        ) {
          this.errorMeetingEndTime = 'calendar.messError.dateMeetingInvalid'
          return
        }

        if (diff < 0) {
          this.errorMeetingEndTime = 'messError.compareDate'
          this.meetingStartTimePicker = ''
          return
        }

        if (diff > 365) {
          this.errorMeetingEndTime = 'messError.dateExpire'
          this.meetingStartTimePicker = ''
          return
        }

        this.errorMeetingStartTime = null
        this.errorMeetingEndTime = null

        if (this.meetingEndTimePicker) this.errorMeetingEndTime = null
      }
    },
    validateMeetingEndTime() {
      var isValid = moment(
        this.meetingEndTimeValue,
        'DD/MM/YYYY',
        true
      ).isValid()

      if (!isValid) {
        this.errorMeetingEndTime = 'calendar.messError.dateMeetingInvalid'
        this.meetingEndTimePicker = null
        return
      }

      if (isValid) {
        this.meetingEndTimePicker = moment(
          this.meetingEndTimeValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')

        const dateTo = moment(this.meetingEndTimeValue, 'DD/MM/YYYY')
        const dateFrom = moment(this.meetingStartTimeValue, 'DD/MM/YYYY')
        const diff = dateTo.diff(dateFrom, 'days')
        this.errorMeetingEndTime = null

        if (
          this.meetingStartTimeValue &&
          !moment(this.meetingStartTimeValue, 'DD/MM/YYYY', true).isValid()
        ) {
          this.errorMeetingStartTime = 'calendar.messError.dateMeetingInvalid'
          return
        }

        if (diff < 0) {
          this.errorMeetingEndTime = 'messError.compareDate'
          this.meetingEndTimePicker = ''
          return
        }

        if (diff > 365) {
          this.errorMeetingEndTime = 'messError.dateExpire'
          this.meetingEndTimePicker = ''
          return
        }

        if (this.meetingStartTimePicker) this.errorMeetingStartTime = null
      }
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    initDate() {
      this.meetingStartTimeValue = this.meetingStartTime ? moment(this.meetingStartTime, 'DD/MM/YYYY').format("DD/MM/YYYY") : null
      this.meetingEndTimeValue = this.meetingEndTime ? moment(this.meetingEndTime, 'DD/MM/YYYY').format("DD/MM/YYYY") : null

      // set time default
      this.meetingStartTimeValueDefault = this.meetingStartTimeValue.replaceAll('/', '')
      this.meetingEndTimeValueDefault = this.meetingEndTimeValue.replaceAll('/', '')
    },

    // load danh sach lich dinh ky
    async loadCycleTypes() {
      try {
        const result = await CalendarService.loadCycleTypes()
        if (result) {
          this.lstCycleType = result.data
          this.lstCycleType.unshift({ name: 'Tất cả', code: '' })
        }
      } catch (error) {
        console.log(error)
      }
    },

    chooseState(value) {
      if (this.listIndexState.includes(value)) {
        const new_arr = this.listIndexState.filter(item => item !== value)
        this.listIndexState = new_arr
      } else {
        this.listIndexState.push(value)
      }
    },

    getColorDotByStatus(status) {
      switch (status) {
        case 'PENDING':
          return 'customer-status-pending'
        case 'APPROVED':
          return 'customer-status-appored'
        case 'REJECTED':
          return 'customer-status-expired'
        case 'CANCELED':
          return 'customer-status-cancel'
        case 'EXPIRED':
          return 'customer-status-expired'
        default:
          return 'customer-status-draft'
      }
    },
    getColorTextByStatus(status) {
      switch (status) {
        case 'PENDING':
          return 'customer-status-pending-text'
        case 'APPROVED':
          return 'customer-status-appored-text'
        case 'REJECTED':
          return 'customer-status-expired-text'
        case 'CANCELED':
          return 'customer-status-cancel-text'
        case 'EXPIRED':
          return 'customer-status-expired-text'
        default:
          return 'customer-status-draft-text'
      }
    },
    getTextByStatus(status) {
      switch (status) {
        case 'PENDING':
          return this.$t('calendar.status.pending')
        case 'APPROVED':
          return this.$t('calendar.status.approve')
        case 'REJECTED':
          return this.$t('calendar.status.reject')
        case 'CANCELED':
          return this.$t('calendar.status.cancel')
        case 'EXPIRED':
          return this.$t('calendar.status.expired')
        default:
          return this.$t('calendar.status.draft')
      }
    },
    trimSpace(val) {
      return val ? val.trim() : ''
    },
    clearFilter() {
      this.lstStatus = this.lstStatus.map(item => {
        return {
          name: item.name,
          value: item.value
        }
      })
      this.roomName = null
      this.roomId = null
      this.initDate()
      this.listIndexState = this.searchingType === 'APPROVE' ? ['PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'EXPIRED'] : ['APPROVED']
      this.cycleText = ''
      this.selectedCustomer = null
      this.tempCustomer = null
      this.listCustomer = []
      this.participantName = null
      this.keywordTemp = null
      this.groupId = null
      this.userId = null
      this.showFilterCustomer = false

      this.onCallSchedule = false
      this.meetingSchedule = false
    },
    closeDialog() {
      // this.clearFilter()
      this.$emit('close-dialog')
    },
    onSubmit() {
      const params = {
        keyword: '',
        meetingStartTime:
          this.meetingStartTimeValue ? this.meetingStartTimeValue.replaceAll('/', '') : null, // thoi gian bat dau hop
        meetingEndTime: this.meetingEndTimeValue ? this.meetingEndTimeValue.replaceAll('/', '') : null, // Thoi gian ket thuc hop
        createStartTime: this.createStartTimeValue ? this.createStartTimeValue.replaceAll('/', '') : null, // thoi gian tao tu
        createEndTime: this.createEndTimeValue ? this.createEndTimeValue.replaceAll('/', '') : null, // Thoi gian tao den
        status: this.listIndexState.length > 0 ? this.listIndexState : ['PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'EXPIRED'], // trang thai: DELETED, DRAFT, PENDING ,APPROVED, REJECTED, CANCELED, EXPIRED
        meetingTitle: this.formdata.meetingTitle,
        meetingTypes: this.genTypeCalenar(),
        calendarTypes: this.genTypeCalenar(), // loai lich: MEETING_SCHEDULE, ON_CALL_SCHEDULE
        roomId: this.roomId || null, // Id phong hop
        roomName: this.roomName || null, // ten phong hop
        userId: this.userId || null, // tim user tham gia hop
        groupId: this.groupId || null, // tim group tham gia hop
        participantName: this.participantName || null, // Tim thanh phan tham gia
        cycleType: this.cycleText || null, // lich dinh ky: CYCLE_TYPE, ONCE, DAILY, WEEKLY, MONTHLY, QUARTERLY
        searchingType: null // PARTICIPATING: toi tham gia, GROUP: lich don vi, APPROVE: toi duyet, CREATE: toi tao
      }

      // check searching
      let isSearching = false

      if (this.meetingStartTimeValueDefault !== params.meetingStartTime ||
          this.meetingEndTimeValueDefault !== params.meetingEndTime ||
          params.roomId ||
          params.roomName ||
          (params.meetingTypes && params.meetingTypes.length !== 0) ||
          (params.calendarTypes && params.calendarTypes.length !== 0) ||
          params.participantName ||
          params.cycleType) isSearching = true
      // man toi tham gia, lich don vi
      if (this.searchingType === 'PARTICIPATING' || this.searchingType === 'GROUP') {
        if (params.status && params.status.length === 1 && params.status[0] === 'APPROVED'
        ) isSearching = false
        else isSearching = true
      }

      // man toi duyet
      if (this.searchingType === 'APPROVE') {
        if (params.status && params.status.length !== 5
        ) isSearching = true
      }

      this.$emit('change-date', this.meetingStartTimeValue, this.meetingEndTimeValue)
      this.$emit('submit-dialog', params, this.listIndexState, isSearching)
      this.$emit('close-dialog')
    },

    genTypeCalenar() {
      const types = []
      if (this.meetingSchedule) {
        types.push('MEETING_SCHEDULE')
      }
      if (this.onCallSchedule) {
        types.push('ON_CALL_SCHEDULE')
      }
      return types
    },
    formatDateView(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    getStatus(value, type) {
      this.lstStatus = this.lstStatus.map(item => {
        if (item.value === value) {
          if (
            (item.isClicked && this.chooseStatus.length === 0) ||
            !item.isClicked
          ) {
            this.chooseStatus.push(value)
          } else {
            this.chooseStatus = this.chooseStatus.filter(x => x !== value)
          }
          return {
            value: item.value,
            isClicked: !item.isClicked
          }
        } else {
          return {
            value: item.value,
            isClicked: item.isClicked
          }
        }
      })
      this.$emit('get-status', this.chooseStatus, type)
    }
  }
}
</script>

<style lang="scss" scoped>
.participant-item {
  position: relative;
  .wrap-list-search-user {
    border-radius: 8px;
    position: absolute;
    border: 1px solid #c4c4c4;
    z-index: 9;
    width: 100%;
    top: 70px;
    max-height: 220px;
    overflow-y: auto;
    .v-list-item {
      min-height: 45px !important;
      padding: 5px !important;
    }
  }
}
</style>
