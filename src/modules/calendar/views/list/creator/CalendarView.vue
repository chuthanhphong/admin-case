<template>
  <v-row class="fill-height ma-0">
    <v-col>
      <v-row class="ma-0 mb-2 align-center">
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
          elevation="2"
          class="mr-6 rounded-lg"
          icon
          @click="setFocusToday()"
        >
          <v-icon color="#22242C">mdi-cached</v-icon>
        </v-btn>

        <!-- Icon next -->
        <v-btn
          small
          elevation="2"
          icon
          class="mr-2"
          @click="previousCalendar()"
        >
          <v-icon color="#22242C">mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn small elevation="2" icon @click="nextCalendar()">
          <v-icon color="#22242C">mdi-chevron-right</v-icon>
        </v-btn>

        <span
          v-if="$refs.calendar && type !== 'day'"
          class="text-calendar-time ml-3"
        >
          {{ $refs.calendar.title }}
        </span>

        <span v-else class="text-calendar-time ml-3"> {{ dateNow }} </span>

        <v-spacer></v-spacer>

        <SearchDocument
          :formdata="formdata"
          :search="search"
          @show-dialog-save="showDialogSave"
          @advance-search="advanceSearch"
        />
      </v-row>
      <v-sheet class="height-calendar">
        <v-calendar
          ref="calendar"
          v-model="value"
          color="primary"
          :type="type"
          :events="events"
          :event-ripple="false"
          interval-height="120"
          :hide-header="hideHeader"
          :locale="localDate"
          event-overlap-mode="column"
          @click:more="viewDay"
          @click:date="viewDay"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
        >
          <!-- @click:event="showEvent"
          @mousedown:event="startDrag"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
          @mouseleave.native="cancelDrag" -->
          <template v-slot:event="{ event, timed }">
            <div
              v-if="showInfoMeetting(event.start, event.end)"
              class="v-event-draggable"
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

            <div v-else class="v-event-draggable">
              <p
                :style="{ color: event.colorTime }"
                class="text-event-time hide-text-calendar"
              >
                {{ convertMillisecondsToDate(event.start) }}-
                {{ convertMillisecondsToDate(event.end) }}
              </p>
            </div>
            <div
              v-if="timed"
              class="v-event-drag-bottom"
              @mousedown.stop="extendBottom(event)"
            ></div>
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
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-y
          left
          bottom
          transition="scale-transition"
          max-width="500px"
          max-height="400px"
        >
          <v-card max-width="500px" class="pt-5 pl-5 pr-5 pb-5">
            <v-row class="ma-0 align-center">
              <div class="circle-event-time mr-4" />
              <span class="span-event-time1">
                {{ selectedEvent.timeStart }}&nbsp;
              </span>
              <span class="span-event-time2">
                {{ selectedEvent.dateStart }}</span>
              <span class="span-event-time1">&nbsp;-&nbsp;</span>
              <span class="span-event-time1">
                {{ selectedEvent.timeEnd }}&nbsp;
              </span>
              <span class="span-event-time2">{{ selectedEvent.dateEnd }}</span>
            </v-row>
            <p class="span-event-name">
              {{ selectedEvent.name }}
            </p>
            <div class="d-flex">
              <v-avatar size="40" color="#00C3F9" class="ml-5 mr-2">
                <span class="text-uppercase white--text">
                  {{ getFirstCharacter(selectedEvent.chairman) }}
                </span>
              </v-avatar>
              <div class="d-flex info-event-time">
                <p class="mb-1 text-event-name">
                  {{ getFullName(selectedEvent.chairman) }}
                </p>
                <p class="mb-0 info-address-time">
                  {{ getEmailAndPhone(selectedEvent.chairman) }}
                </p>
              </div>
            </div>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";
import SearchDocument from "@/modules/calendar/views/list/creator/SearchDocument";

export default {
  name: "CalendarView",
  components: {
    SearchDocument,
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
  },
  data: () => ({
    value: "",
    events: [],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
    ready: false,
    dateNow: null,
    hideHeader: true,
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
    openFormCreateEvent: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    updateMeeting: false,
    meetingId: null,
    showDialogSaveMeeting: false,
  }),

  computed: {
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
    localDate() {
      return this.$i18n.locale === "vi" ? "vi-VN" : "en-US";
    },
  },

  watch: {
    value() {
      if (this.value === "") {
        this.dateNow = moment().format("DD/MM/YYYY");
        return;
      }
      this.dateNow = moment(this.value).format("DD/MM/YYYY");
    },

    listMetting() {
      if (!this.showListData) {
        this.scrollToTime();
        this.updateTime();
        this.initDateEventCalendar();
      }
    },
  },

  mounted() {
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
    this.initDateEventCalendar();
    this.dateNow = moment().format("DD/MM/YYYY");
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
        this.$emit("close-dialog-save", true);
      }
      this.showDialogSaveMeeting = false;
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
        });
      });
    },

    // Handle calendar.
    changeTypeCalendar() {
      this.hideHeader = false;
      if (this.type === "day") {
        this.hideHeader = true;
      }
      if (this.type === "day" || this.type === "week") {
        setTimeout(() => {
          this.scrollToTime();
        }, 200);
      }
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
      this.hideHeader = true;
      this.type = "day";
      this.value = "";
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
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
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
          name: `Event #${this.events.length}`,
          color: '#FF4A55',
          start: this.createStart,
          end: this.createStart,
          timed: true,
        };
        this.events.push(this.createEvent);
        this.openFormCreateEvent = true;
      }
    },
    extendBottom(event) {
      this.createEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start;
        const end = this.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;

        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);

        this.createEvent.start = min;
        this.createEvent.end = max;
      }
    },
    endDrag() {
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
    getEventColor(event) {
      const rgb = parseInt(event.color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      return event === this.dragEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event === this.createEvent
          ? `rgba(${r}, ${g}, ${b}, 0.7)`
          : event.color;
    },

    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    rndElement(arr) {
      return arr[this.rnd(0, arr.length - 1)];
    },
  },
};
</script>

<style lang="scss">
.height-calendar {
  height: calc(100vh - 225px);
}

.v-event-draggable {
  padding-left: 6px;
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
