<template>
  <div class="px-5">
    <div v-if="showSearch" class="d-flex pt-3 justify-space-between align-center">
      <div class="d-flex pt-3 justify-start align-center">
        <!-- selectBox day -->
        <div class="w-240 mr-4">
          <v-select
            v-model="type"
            outlined
            dense
            hide-selected
            hide-details
            floating
            solo
            :menu-props="{
              bottom: true,
              offsetY: true,
            }"
            :items="lstType"
            item-text="name"
            item-value="value"
            attach
            class="calendar-text--body-4"
            @change="changeTypeCalendar()"
          >
          </v-select>
        </div>

        <!-- Icon focus today -->
        <v-btn
          v-if="checkShow"
          elevation="2"
          class="mr-6 rounded-lg"
          icon
          @click="setFocusToday()"
        >
          <v-icon color="#22242C">mdi-cached</v-icon>
        </v-btn>

        <!-- Icon next -->
        <v-btn
          v-if="checkShow"
          small
          elevation="2"
          icon
          class="mr-2"
          @click="previousCalendar()"
        >
          <v-icon color="#22242C">mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn v-if="checkShow" small elevation="2" icon @click="nextCalendar()">
          <v-icon color="#22242C">mdi-chevron-right</v-icon>
        </v-btn>

        <span
          v-if="type === 'day'"
          class="text-calendar-time ml-3"
        >
          {{ dayNow }}
        </span>

        <span
          v-if="type === 'month'"
          class="text-calendar-time ml-3"
        >
          {{ monthNow }}
        </span>

        <span v-if="type === 'week' || type === 'all'" class="text-calendar-time ml-3"> {{ meetingStartTimeValue }} -  {{ meetingEndTimeValue }} </span>

      </div>
      <div class="d-flex pt-3 justify-end align-center">
        <v-text-field
          id="txt-search"
          v-model="formdata.meetingTitle"
          :placeholder="$t('calendar.meetingScheduleList.searchMeetingSchedule')"
          outlined
          dense
          autofocus
          class="mw-200 mr-3"
          clearable
          hide-details
          @change="formdata.meetingTitle = trimSpace(formdata.meetingTitle)"
          @keyup.enter="searchCalendar"
        >
          <vue-feather slot="append" type="search" size="20" />
        </v-text-field>

        <!-- Btn advance search -->
        <v-menu
          v-model="showAdvance"
          offset-x
          offset-y
          left
          attach
          :close-on-content-click="false"
          min-width="460px"
          max-width="460px"
          transition="slide-x-transition"
        >
          <template v-slot:activator="{ on: menuState, attrs }">
            <v-tooltip top content-class="tooltip-top">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  v-bind="attrs"
                  outlined
                  class="btn-show-advance mx-0 ml-1"
                  :color="isSearch ? 'primary' : ''"
                  v-on="{ ...menuState, ...tooltip }"
                >
                  <v-badge
                    v-if="isSearch"
                    color="info"
                    dot
                    bordered
                    value="true"
                  >
                    <i class="app-icon icon-advance darken" />
                  </v-badge>
                  <i v-else class="app-icon icon-advance darken" />
                </v-btn>
              </template>
              <div>
                {{ $t("calendar.advanceSearch.searchAdvanceNote") }}
              </div>
            </v-tooltip>
          </template>
          <AdvanceSearch
            :meeting-start-time="meetingStartTimeValue"
            :meeting-end-time="meetingEndTimeValue"
            :formdata="formdata"
            :show-advance="showAdvance"
            :searching-type="searchingType"
            @close-dialog="onClosePopupAdvanceSearch"
            @submit-dialog="onSubmitAdvanceSearch"
            @change-date="onChangeDates"
          />
        </v-menu>

        <div class="ml-5">
          <v-btn
            background-color="#fff"
            class="btn-room-empty"
            @click="emptyRoom"
          >
            <span class="pr-2 text-capitalize text--button">
              {{ $t("calendar.meetingScheduleList.roomEmpty") }}
            </span>
            <vue-feather type="search" class="pr-2" size="25" />
          </v-btn>
        </div>

        <!-- Btn vao so den -->
        <div class="ml-5">
          <v-tooltip top content-class="tooltip-top">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                color="#0FAFE4"
                class="btn-create"
                v-on="on"
                @click="createMeeting"
              >
                <vue-feather type="plus-circle" size="25" />
              </v-btn>
            </template>
            <div>
              {{ $t("calendar.meetingScheduleList.createMeetingSchedule") }}
            </div>
          </v-tooltip>
        </div>
      </div>
    </div>
    <div
      v-else
      class="d-flex pt-3 justify-end align-center"
    >
      <v-text-field
        id="txt-search"
        v-model="formdata.meetingTitle"
        :placeholder="
          $t('calendar.meetingScheduleList.searchMeetingSchedule')
        "
        outlined
        dense
        autofocus
        class="mw-200 mr-3"
        clearable
        hide-details
        @change="formdata.meetingTitle = trimSpace(formdata.meetingTitle)"
        @keyup.enter="searchCalendar"
      >
        <vue-feather
          slot="append"
          type="search"
          size="20"
        />
      </v-text-field>

      <!-- Btn advance search -->
      <v-menu
        v-model="showAdvance"
        offset-x
        offset-y
        left
        attach
        :close-on-content-click="false"
        min-width="460px"
        max-width="460px"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on: menuState, attrs }">
          <v-tooltip top content-class="tooltip-top">
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                v-bind="attrs"
                outlined
                :color="isSearch ? 'primary' : ''"
                class="btn-show-advance mx-0 ml-1"
                v-on="{ ...menuState, ...tooltip }"
              >
                <v-badge
                  v-if="isSearch"
                  color="info"
                  dot
                  bordered
                  value="true"
                >
                  <i class="app-icon icon-advance darken" />
                </v-badge>
                <i v-else class="app-icon icon-advance darken" />
              </v-btn>
            </template>
            <div>
              {{ $t("calendar.advanceSearch.searchAdvanceNote") }}
            </div>
          </v-tooltip>
        </template>
        <AdvanceSearch
          :formdata="formdata"
          :show-advance="showAdvance"
          :searching-type="searchingType"
          @close-dialog="onClosePopupAdvanceSearch"
          @submit-dialog="onSubmitAdvanceSearch"
        />
      </v-menu>

      <div class="ml-5">
        <v-btn background-color="#fff" class="btn-room-empty">
          <span class="pr-2 text-capitalize text--button">
            {{ $t('calendar.meetingScheduleList.roomEmpty') }}
          </span>
          <vue-feather type="search" class="pr-2" size="25" />
        </v-btn>
      </div>

      <!-- Btn vao so den -->
      <div class="ml-5">
        <v-tooltip top content-class="tooltip-top">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              color="#0FAFE4"
              class="btn-create"
              v-on="on"
              @click="createMeeting"
            >
              <vue-feather type="plus-circle" size="25" />
            </v-btn>
          </template>
          <div>
            {{ $t('calendar.meetingScheduleList.createMeetingSchedule') }}
          </div>
        </v-tooltip>
      </div>
    </div>

  </div>
</template>

<script>
import AdvanceSearch from "@/modules/calendar/views/list/components/AdvanceSearch.vue";
import moment from 'moment'

export default {
  name: 'SearchDocument',
  components: { AdvanceSearch },

  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    search: {
      type: Function,
      default: undefined
    },
    searchingType: {
      type: String,
      default: null
    },
    searchDate: {
      type: Function,
      default: undefined
    },
    showSearch: {
      type: Boolean,
      default: false,
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
      showAdvance: false,
      show: false,
      isSearch: false,

      type: "week",
      lstType: [
        {
          name: "Ngày",
          value: "day",
        },
        {
          name: "Tuần",
          value: "week",
        },
        {
          name: "Tháng",
          value: "month",
        },
        {
          name: "Tất cả",
          value: "all",
        }
      ],
      meetingStartTimeValue: null,
      meetingEndTimeValue: null,
      dayNow: null,
      monthNow: null,
      monthFormat: null
    }
  },
  computed: {
    checkShow() {
      return this.type !== 'all'
    }
  },
  mounted() {
    this.initDate()
  },
  methods: {
    initDate() {
      this.meetingStartTimeValue = this.meetingStartTime ? moment(this.meetingStartTime, 'DD/MM/YYYY').format("DD/MM/YYYY") : null
      this.meetingEndTimeValue = this.meetingEndTime ? moment(this.meetingEndTime, 'DD/MM/YYYY').format("DD/MM/YYYY") : null
    },
    setFocusToday() {
      if (this.type === "day") {
        this.dayNow = moment().format("DD/MM/YYYY")
        this.searchDate(this.dayNow, null)
      }
      if (this.type === "week") {
        this.meetingStartTimeValue = moment().clone().startOf("isoWeek").format("DD/MM/YYYY")
        this.meetingEndTimeValue = moment().clone().endOf("isoWeek").format("DD/MM/YYYY")
        this.searchDate(this.meetingStartTimeValue, this.meetingEndTimeValue)
      }
      if (this.type === "month") {
        this.monthFormat = moment().startOf("month").lang('vi')
        this.monthNow = this.monthFormat.format('MMMM/YYYY');
      }
    },
    previousCalendar() {
      if (this.type === "day") {
        this.dayNow = moment(this.dayNow, 'DD/MM/YYYY').subtract(1, 'days').format("DD/MM/YYYY")
        this.searchDate(this.dayNow, null)
      }
      if (this.type === "week") {
        const weekPrevious = moment(this.meetingStartTimeValue, 'DD/MM/YYYY').subtract(1, 'days').format("DD/MM/YYYY")
        this.meetingStartTimeValue = moment(weekPrevious, 'DD/MM/YYYY').clone().startOf("isoWeek").format("DD/MM/YYYY")
        this.meetingEndTimeValue = moment(weekPrevious, 'DD/MM/YYYY').clone().endOf("isoWeek").format("DD/MM/YYYY")
        this.searchDate(this.meetingStartTimeValue, this.meetingEndTimeValue)
      }
      if (this.type === "month") {
        this.monthFormat = moment(this.monthFormat).subtract(1, "month").startOf("month").lang('vi')
        this.monthNow = this.monthFormat.format('MMMM/YYYY');
      }
    },
    nextCalendar() {
      if (this.type === "day") {
        this.dayNow = moment(this.dayNow, 'DD/MM/YYYY').subtract(-1, 'days').format("DD/MM/YYYY")
        this.searchDate(this.dayNow, null)
      }
      if (this.type === "week") {
        const weekPrevious = moment(this.meetingEndTimeValue, 'DD/MM/YYYY').subtract(-1, 'days').format("DD/MM/YYYY")
        this.meetingStartTimeValue = moment(weekPrevious, 'DD/MM/YYYY').clone().startOf("isoWeek").format("DD/MM/YYYY")
        this.meetingEndTimeValue = moment(weekPrevious, 'DD/MM/YYYY').clone().endOf("isoWeek").format("DD/MM/YYYY")
        this.searchDate(this.meetingStartTimeValue, this.meetingEndTimeValue)
      }
      if (this.type === "month") {
        this.monthFormat = moment(this.monthFormat).subtract(-1, "month").startOf("month").lang('vi')
        this.monthNow = this.monthFormat.format('MMMM/YYYY');
      }
    },
    trimSpace(val) {
      return val ? val.trim() : ''
    },
    onClosePopupAdvanceSearch() {
      this.showAdvance = false;
    },

    // tao moi
    createMeeting() {
      this.$emit('show-dialog-save')
    },

    onSubmitAdvanceSearch(params, listIndexState, isSearching) {
      this.isSearch = isSearching
      this.$emit("advance-search", params, listIndexState)
    },
    searchCalendar() {
      this.search()
    },
    emptyRoom() {
      // this.$router.push(calendar.CALENDAR_VIEW_PATH);
    },
    changeTypeCalendar() {
      if (this.type === "day") {
        this.dayNow = moment().format("DD/MM/YYYY")
        this.searchDate(this.dayNow, null)
      }
      if (this.type === "week") {
        this.meetingEndTimeValue = this.meetingEndTime ? moment(this.meetingEndTime, 'DD/MM/YYYY').format("DD/MM/YYYY") : null
        this.searchDate(this.meetingStartTimeValue, this.meetingEndTimeValue)
      }
      if (this.type === "month") {
        this.monthFormat = moment().startOf("month").lang('vi')
        this.monthNow = this.monthFormat.format('MMMM/YYYY');
        this.searchDate(this.meetingStartTimeValue, this.meetingEndTimeValue)
      }
    },
    onChangeDates(from, to) {
      this.type = 'all'
      this.meetingStartTimeValue = from ? moment(from, 'DD/MM/YYYY').format('DD/MM/YYYY') : null
      this.meetingEndTimeValue = to ? moment(to, 'DD/MM/YYYY').format('DD/MM/YYYY') : null
    }
  }
}
</script>

<style></style>
