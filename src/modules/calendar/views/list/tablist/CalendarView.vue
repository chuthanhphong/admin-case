<template>
  <v-row class="fill-height ma-0 calendar-view">
    <v-col class="pa-0">
      <div class="d-flex pa-0 align-center pl-5 pb-2">
        <!-- selectBox day -->
        <div class="w-240 mr-4 pt-3">
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
        <v-tooltip top content-class="tooltip-top">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              elevation="2"
              class="mr-6 rounded-lg mt-3"
              icon
              v-on="on"
              @click="setFocusToday()"
            >
              <v-icon color="#22242C">mdi-cached</v-icon>
            </v-btn>
          </template>
          <div>
            {{ $t("calendar.today") }}
          </div>
        </v-tooltip>

        <!-- Icon next -->
        <v-btn
          small
          elevation="2"
          icon
          class="mr-2 mt-3"
          @click="previousCalendar()"
        >
          <v-icon color="#22242C">mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn class="mt-3" small elevation="2" icon @click="nextCalendar()">
          <v-icon color="#22242C">mdi-chevron-right</v-icon>
        </v-btn>

        <span class="text-calendar-time ml-3 pt-3"> {{ dateDisplay }} </span>

        <v-spacer></v-spacer>

        <SearchDocument
          :formdata="formdata"
          :search="search"
          @show-dialog-save="showDialogSave"
          @advance-search="advanceSearch"
        />
      </div>
      <v-sheet class="height-calendar">
        <!-- day of week in month -->
        <div v-if="type === 'month'" class="d-flex wrap-day-of-week">
          <div class="day-of-week" :class="getClassActiveInMonth('Monday')">
            {{ $t("calendar.monday") }}
          </div>
          <div class="day-of-week" :class="getClassActiveInMonth('Tuesday')">
            {{ $t("calendar.tuesday") }}
          </div>
          <div class="day-of-week" :class="getClassActiveInMonth('Wednesday')">
            {{ $t("calendar.wednesday") }}
          </div>
          <div class="day-of-week" :class="getClassActiveInMonth('Thursday')">
            {{ $t("calendar.thursday") }}
          </div>
          <div class="day-of-week" :class="getClassActiveInMonth('Friday')">
            {{ $t("calendar.friday") }}
          </div>
          <div class="day-of-week" :class="getClassActiveInMonth('Saturday')">
            {{ $t("calendar.saturday") }}
          </div>
          <div class="day-of-week" :class="getClassActiveInMonth('Sunday')">
            {{ $t("calendar.sunday") }}
          </div>
        </div>

        <!-- day of week in week -->
        <div v-if="type === 'week'" class="d-flex wrap-day-of-week ml-56">
          <div
            class="day-of-week day-week"
            :class="getClassActiveInMonth('Monday')"
            @click="viewDayInWeek(0)"
          >
            <p class="mb-3">{{ getDayOfWeek(0) }}</p>
            <p class="mb-0">{{ $t("calendar.monday") }}</p>
          </div>
          <div
            class="day-of-week day-week"
            :class="getClassActiveInMonth('Tuesday')"
            @click="viewDayInWeek(1)"
          >
            <p class="mb-3">{{ getDayOfWeek(1) }}</p>
            <p class="mb-0">{{ $t("calendar.tuesday") }}</p>
          </div>
          <div
            class="day-of-week day-week"
            :class="getClassActiveInMonth('Wednesday')"
            @click="viewDayInWeek(2)"
          >
            <p class="mb-3">{{ getDayOfWeek(2) }}</p>
            <p class="mb-0">{{ $t("calendar.wednesday") }}</p>
          </div>
          <div
            class="day-of-week day-week"
            :class="getClassActiveInMonth('Thursday')"
            @click="viewDayInWeek(3)"
          >
            <p class="mb-3">{{ getDayOfWeek(3) }}</p>
            <p class="mb-0">{{ $t("calendar.thursday") }}</p>
          </div>
          <div
            class="day-of-week day-week"
            :class="getClassActiveInMonth('Friday')"
            @click="viewDayInWeek(4)"
          >
            <p class="mb-3">{{ getDayOfWeek(4) }}</p>
            <p class="mb-0">{{ $t("calendar.friday") }}</p>
          </div>
          <div
            class="day-of-week day-week"
            :class="getClassActiveInMonth('Saturday')"
            @click="viewDayInWeek(5)"
          >
            <p class="mb-3">{{ getDayOfWeek(5) }}</p>
            <p class="mb-0">{{ $t("calendar.saturday") }}</p>
          </div>
          <div
            class="day-of-week day-week"
            :class="getClassActiveInMonth('Sunday')"
            @click="viewDayInWeek(6)"
          >
            <p class="mb-3">{{ getDayOfWeek(6) }}</p>
            <p class="mb-0">{{ $t("calendar.sunday") }}</p>
          </div>
        </div>

        <v-calendar
          ref="calendar"
          v-model="value"
          color="primary"
          :type="type"
          :events="events"
          :event-ripple="false"
          interval-height="120"
          :hide-header="true"
          :weekdays="weekday"
          event-overlap-mode="column"
          :event-more-text="`${$t('calendar.viewAll')} ({0})`"
          @click:more="onMoveEvent"
          @click:date="viewDay"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
          @click:event="showEvent"
          @mousedown:event="startDrag"
        >
          <!-- @mousedown:event="startDrag"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
          @mouseleave.native="cancelDrag" -->
          <template v-slot:event="{ event }">
            <v-menu
              :close-on-content-click="false"
              open-on-hover
              offset-y
              left
              top
              :disabled="event.disabled"
              transition="slide-x-transition"
              max-width="500px"
              max-height="400px"
            >
              <template v-slot:activator="{ on, attrs }">
                <div
                  v-if="showInfoMeetting(event.start, event.end)"
                  class="v-event-draggable"
                  v-bind="attrs"
                  v-on="on"
                >
                  <p
                    :style="{ color: event.colorTime }"
                    class="text-event-time hide-text-calendar mb-0"
                  >
                    {{ convertMillisecondsToDate(event.start) }}-
                    {{ convertMillisecondsToDate(event.end) }}
                  </p>
                  <p
                    v-show="!event.lock"
                    class="text-event-name hide-text-calendar"
                  >
                    {{ event.name }}
                  </p>
                  <p
                    v-show="!event.lock"
                    class="text-event-room hide-text-calendar"
                  >
                    {{ event.room }}
                  </p>
                  <v-icon v-show="event.lock" :color="event.colorTime">
                    mdi-lock-outline
                  </v-icon>
                </div>

                <div v-else class="v-event-draggable" v-bind="attrs" v-on="on">
                  <p
                    :style="{ color: event.colorTime }"
                    class="text-event-time hide-text-calendar"
                  >
                    {{ convertMillisecondsToDate(event.start) }}-
                    {{ convertMillisecondsToDate(event.end) }}
                  </p>
                </div>
              </template>
              <v-card max-width="500px" class="pt-5 pl-5 pr-5 pb-5">
                <v-row class="ma-0 align-center">
                  <div class="circle-event-time mr-4" />
                  <span class="span-event-time1">
                    {{ event.timeStart }}&nbsp;
                  </span>
                  <span class="span-event-time2"> {{ event.dateStart }}</span>
                  <span class="span-event-time1">&nbsp;-&nbsp;</span>
                  <span class="span-event-time1">
                    {{ event.timeEnd }}&nbsp;
                  </span>
                  <span class="span-event-time2">{{ event.dateEnd }}</span>
                </v-row>
                <p class="span-event-name">
                  {{ event.name }}
                </p>
                <div class="d-flex">
                  <v-avatar size="40" color="#00C3F9" class="ml-5 mr-2">
                    <span class="text-uppercase white--text">
                      {{ getFirstCharacter(event.chairman) }}
                    </span>
                  </v-avatar>
                  <div class="d-flex info-event-time">
                    <p class="mb-1 text-event-name">
                      {{ getFullName(event.chairman) }}
                    </p>
                    <p class="mb-0 info-address-time">
                      {{ getEmailAndPhone(event.chairman) }}
                    </p>
                  </div>
                </div>
              </v-card>
            </v-menu>
          </template>

          <!-- Divider current time -->
          <template v-slot:day-body="{ date, week }">
            <div
              class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            />
          </template>
        </v-calendar>
      </v-sheet>

      <DialogListMeetingCalendar
        :show-dialog="showDialogMeetingCalendar"
        :title="titleDialogMeetingCalendar"
        :list-metting="lstMettingDialog"
        @close-dialog="showDialogMeetingCalendar = false"
        @onDetailMeeting="onDetailMeeting"
      />
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";
import SearchDocument from "@/modules/calendar/views/list/components/SearchDocument";
import DialogListMeetingCalendar from "@/modules/calendar/views/components/DialogListMeetingCalendar";

export default {
  name: "CalendarView2",
  components: {
    SearchDocument,
    DialogListMeetingCalendar,
  },
  props: {
    listMetting: {
      type: Array,
      default: null,
    },
    showListData: {
      type: Boolean,
      default: true,
    },
    formdata: {
      type: Object,
      default: undefined,
    },
    search: {
      type: Function,
      default: undefined,
    },
    removeEvent: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    value: "",
    events: [],
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
    ready: false,
    dateDisplay: null,
    type: "day",
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
    ],
    meetingId: null,
    addEventWhenClickCalendar: false,
    weekday: [1, 2, 3, 4, 5, 6, 0],
    lstDayOfWeek: [],
    showDialogMeetingCalendar: false,
    titleDialogMeetingCalendar: "",
    lstMettingDialog: [],
  }),

  computed: {
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
  },

  watch: {
    value() {
      if (this.type === "month") {
        this.dateDisplay =
          this.$t("calendar.month") + moment(this.value).format("MM/YYYY");
        return;
      }

      if (this.type === "week") {
        this.lstDayOfWeek = this.selectWeek(this.value);
        var start = moment(this.lstDayOfWeek[0], "x").format("DD/MM/yyyy");
        var end = moment(this.lstDayOfWeek[6], "x").format("DD/MM/yyyy");
        this.dateDisplay = start + "-" + end;
        return;
      }

      this.dateDisplay = moment(this.value).format("DD/MM/YYYY");
    },

    listMetting() {
      if (!this.showListData) {
        this.scrollToTime();
        this.updateTime();
        this.initDateEventCalendar();
      }
    },

    removeEvent() {
      if (this.removeEvent) {
        this.events.pop();
        this.$emit("updateStateRemoveEvent");
      }
    },
  },

  mounted() {
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
    this.initDateEventCalendar();
    this.value = moment().format("YYYY-MM-DD");
    this.lstDayOfWeek = this.selectWeek(this.value);
  },

  methods: {
    // Divider current time.
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);

      this.cal.scrollToTime(first);
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
    getFirstCharacter(chairman) {
      if (!chairman) return;
      var name = chairman.fullName;
      if (!name) return "";
      if (name.includes(" ")) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(" ").pop();
        return lastName[0].toUpperCase();
      }
      return name[0].toUpperCase();
    },
    getEmailAndPhone(chairman) {
      if (!chairman) return;
      if (!chairman.email && !chairman.phone) return;
      if (!chairman.email) return chairman.phone;
      if (!chairman.phone) return chairman.email;
      return chairman.email + " - " + chairman.phone;
    },
    getFullName(chairman) {
      if (!chairman) return;
      if (!chairman.fullName) return;
      return chairman.fullName;
    },

    // Create meeting.
    showDialogSave() {
      this.$emit("show-dialog-save");
    },
    advanceSearch(params, listIndexState) {
      this.$emit("advance-search", params, listIndexState);
    },
    closeDialogSave(status) {
      if (status) {
        this.$emit("close-dialog-save", status);
      }
    },

    // Init data event calendar.
    initDateEventCalendar() {
      this.events = [];
      this.listMetting.map((item) => {
        var fotmatDateStart = moment(item.startTime, "HH:mm DD/MM/YYYY").format(
          "YYYY-MM-DD HH:mm"
        );
        var fotmatDateEnd = moment(item.endTime, "HH:mm DD/MM/YYYY").format(
          "YYYY-MM-DD HH:mm"
        );
        var dateStart1 = new Date(fotmatDateStart).getTime();
        var dateEnd1 = new Date(fotmatDateEnd).getTime();

        var timeStart = moment(item.startTime, "HH:mm DD/MM/YYYY").format(
          "HH:mm"
        );

        var dateStart = moment(item.startTime, "HH:mm DD/MM/YYYY").format(
          "DD/MM/YYYY"
        );

        var timeEnd = moment(item.endTime, "HH:mm DD/MM/YYYY").format("HH:mm");

        var dateEnd = moment(item.endTime, "HH:mm DD/MM/YYYY").format(
          "DD/MM/YYYY"
        );

        // Get color.
        var colorTime = "#00C3F9";
        var color = "#CCF3FE";

        if (item.status === "CANCELED") {
          colorTime = "#F028A0";
          color = "#FFE7F5";
        }

        if (item.status === "DRAFT") {
          colorTime = "#8E8EA1";
          color = "#E7ECF1";
        }

        if (item.status === "REJECTED" || item.status === "EXPIRED") {
          colorTime = "#FF4A55";
          color = "#FFE8E9";
        }

        if (item.status === "PENDING") {
          colorTime = "#4a50e2";
          color = "#dedfff";
        }

        this.events.push({
          name: item.title,
          color: color,
          start: dateStart1,
          end: dateEnd1,
          timed: true,
          colorTime: colorTime,
          room: item.meetingRooms[0].name,
          lock: false,
          status: item.status,
          timeStart: timeStart,
          dateStart: dateStart,
          timeEnd: timeEnd,
          dateEnd: dateEnd,
          chairman: item.chairman,
          showIcons: item.showIcons,
          meetingId: item.meetingId,
          disabled: false,
        });
      });
    },

    // Handle calendar.
    changeTypeCalendar() {
      if (this.type === "month") {
        this.dateDisplay =
          this.$t("calendar.month") + moment(this.value).format("MM/YYYY");
        return;
      }

      if (this.type === "day") {
        this.dateDisplay = moment(this.value).format("DD/MM/YYYY");
      }

      if (this.type === "week") {
        var lstDayOfWeek = this.selectWeek(this.value);
        var start = moment(lstDayOfWeek[0], "x").format("DD/MM/yyyy");
        var end = moment(lstDayOfWeek[6], "x").format("DD/MM/yyyy");
        this.dateDisplay = start + "-" + end;
      }

      setTimeout(() => {
        this.scrollToTime();
      }, 200);
    },
    previousCalendar() {
      this.$refs.calendar.prev();
      setTimeout(() => {
        this.scrollToTime();
      }, 200);
    },
    nextCalendar() {
      this.$refs.calendar.next();
      setTimeout(() => {
        this.scrollToTime();
      }, 200);
    },
    setFocusToday() {
      this.value = moment().format("YYYY-MM-DD");

      setTimeout(() => {
        this.scrollToTime();
      }, 200);
    },
    viewDay({ date }) {
      this.value = date;
      this.type = "day";
      setTimeout(() => {
        this.scrollToTime();
      }, 200);
    },
    convertMillisecondsToDate(time) {
      return moment(time, "x").format("hh:mm a");
    },
    showInfoMeetting(timeStart, timeEnd) {
      var difference = timeEnd - timeStart;
      var minutes = Math.round(difference / 60000);
      if ((this.type === "day" || this.type === "week") && minutes <= 15) {
        return false;
      }
      return true;
    },
    showEvent({ event }) {
      this.$emit("onDetailMeeting", event);
    },
    selectWeek(date) {
      return Array(7)
        .fill(new Date(date))
        .map(
          (el, idx) =>
            new Date(el.setDate(el.getDate() - el.getDay() + idx + 1))
        );
    },
    getClassActiveInMonth(day) {
      var monthCurent = moment().format("MM");
      var dayCurrent = moment().format("dddd");
      var monthValue = moment(this.value).format("MM");

      if (monthCurent === monthValue && dayCurrent === day) {
        return "day-active";
      }
      return "day-inactive";
    },
    getDayOfWeek(index) {
      var lstDayOfWeek = this.selectWeek(this.value);
      return moment(lstDayOfWeek[index], "x").format("DD");
    },
    viewDayInWeek(index) {
      this.value = this.lstDayOfWeek[index];
      this.type = "day";
      setTimeout(() => {
        this.scrollToTime();
      }, 200);
    },
    onMoveEvent(event) {
      var date = moment(event.date, "yyyy-MM-DD").format("DD/MM/yyyy");
      var day = moment(event.date, "yyyy-MM-DD").format("dddd").toLowerCase();

      this.lstMettingDialog = [];
      this.listMetting.map((item) => {
        if (item.startTime.includes(date)) {
          this.lstMettingDialog.push(item);
        }
      });

      this.titleDialogMeetingCalendar =
        this.$t(`calendar.${day}`) +
        " - " +
        date +
        " (" +
        this.lstMettingDialog.length +
        ")";
      this.showDialogMeetingCalendar = true;
    },
    onDetailMeeting(metting) {
      this.$emit("onDetailMeeting", metting);
    },

    // drag drop event.
    startDrag({ event, timed }) {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    startTime(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start;

        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);

        this.createEvent = {
          name: "",
          color: "#CCF3FE",
          colorTime: "#00C3F9",
          start: this.createStart,
          end: this.createStart,
          timed: true,
          disabled: true,
        };
        this.events.push(this.createEvent);
      }
    },
    extendBottom(event) {
      this.createEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms);

      if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);
        var start = moment(min, "x").format("DD/MM/yyyy");
        var end = moment(max, "x").format("DD/MM/yyyy");
        if (start !== end) return;

        this.createEvent.start = min;
        this.createEvent.end = max;
      }
    },
    endDrag() {
      if (this.createEvent && this.createStart !== null) {
        var start = moment(this.createEvent.start, "x").format(
          "HH:mm DD/MM/yyyy"
        );
        var end = moment(this.createEvent.end, "x").format("HH:mm DD/MM/yyyy");

        var date = moment(this.createEvent.end, "x").format("DD/MM/YYYY");
        this.$emit("showDialogSaveClickCalendar", start, end, date);
      }

      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal;
        } else {
          const i = this.events.indexOf(this.createEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
      }

      this.createEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    roundTime(time, down = true) {
      const roundTo = 15; // minutes
      const roundDownTime = roundTo * 60 * 1000;

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },
  },
};
</script>

<style lang="scss" scoped>
.calendar-view {
  .height-calendar {
    height: calc(100vh - 235px);
  }

  .v-event-draggable {
    padding-left: 6px;
  }

  .v-event-draggable {
    padding-left: 6px;
    height: 100%;
  }

  .v-event-timed {
    user-select: none;
    -webkit-user-select: none;
  }

  .v-event-drag-bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 4px;
    height: 4px;
    cursor: ns-resize;

    &::after {
      display: none;
      position: absolute;
      left: 50%;
      height: 4px;
      border-top: 1px solid white;
      border-bottom: 1px solid white;
      width: 16px;
      margin-left: -8px;
      opacity: 0.8;
      content: "";
    }

    &:hover::after {
      display: block;
    }
  }

  .v-current-time {
    height: 2px;
    background-color: #00c3f9;
    position: absolute;
    left: -1px;
    right: 0;
    pointer-events: none;

    &.first::before {
      content: "";
      position: absolute;
      background-color: #00c3f9;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: -5px;
      margin-left: -6.5px;
    }
  }

  //CSS event.
  .text-event-time {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }

  .text-event-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    text-transform: capitalize;
    color: #22242c;
    margin-bottom: 0 !important;
  }

  .text-event-room {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #22242c;
  }

  .v-calendar .v-event-timed {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
  }

  .v-event-timed-cus {
    position: absolute;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
    cursor: pointer;
    border-radius: 4px;
    pointer-events: all;
    box-shadow: 0px 4px 8px rgb(0 0 0 / 15%);
    border-radius: 8px;
  }
  .text-calendar-time {
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: #22242c;
  }

  .hide-text-calendar {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .day-of-week {
    width: 13.5%;
    height: 34px;
    border-radius: 8px;
    align-items: center;
    display: flex;
    justify-content: center;
    font-weight: 600;
    line-height: 18px;
  }

  .day-week {
    flex-direction: column;
    height: 66px !important;
    cursor: pointer;
  }

  .day-inactive {
    background-color: #f2f2fa;
    color: #22242c;
  }

  .day-active {
    background-color: #0fafe4;
    color: #ffffff;
  }

  .wrap-day-of-week {
    justify-content: space-evenly;
    margin-bottom: 10px;
  }
  .ml-56 {
    margin-left: 56px;
  }

  .v-calendar .v-event-more {
    text-align: center;
    color: #1c49e9;
    font-weight: 400 !important;
    text-decoration: underline;
  }
}

.circle-event-time {
  width: 10px;
  height: 10px;
  background-color: #00c3f9;
  border-radius: 10px;
}
.span-event-time1 {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #22242c;
}
.span-event-time2 {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #a7a7ab;
}
.span-event-name {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #22242c;
  margin-left: 27px;
  margin-top: 27px;
  margin-bottom: 24px !important;
}
.info-event-time {
  flex-direction: column;
}
.info-address-time {
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: #a7a7ab;
}
</style>
