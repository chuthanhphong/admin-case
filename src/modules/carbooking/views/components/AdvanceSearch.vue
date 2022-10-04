<template>
  <v-layout column>
    <v-layout justify-space-between class="py-3 pl-4 pr-3">
      <h5 class="text-capitalize">
        {{ $t("advanceSearch") }}
      </h5>
      <v-icon @click="closeDialog">mdi-close</v-icon>
    </v-layout>
    <v-divider class="mb-4"></v-divider>
    <v-layout column class="scroll-advance-search-options overflow-y-auto px-6">
      <!-- TEN DAT XE -->
      <v-layout column>
        <label class="text--body-5 text-uppercase">
          {{ $t("booking.labels.name-booking-car") }}
        </label>
        <validation-provider name="contractName" rules="required|max:200">
          <v-text-field
            v-model="formData.name"
            outlined
            dense
            clearable
            hide-details
            maxlength="200"
            counter="200"
            class="text--body-5"
            name="txtSearch"
            autofocus
            :placeholder="$t('booking.placeholders.name-booking-car')"
            @change="trimSpace"
          >
          </v-text-field>
        </validation-provider>
        <v-divider class="my-4"></v-divider>
      </v-layout>

      <!-- TRANG THAI -->
      <v-layout column>
        <label class="text--body-5 text-uppercase mb-3">
          {{ $t("booking.labels.booking-status") }}
        </label>
        <v-container>
          <v-row>
            <v-card
              v-for="(item, index) in lstStatus"
              :key="index"
              style="border-radius: 4px !important"
              :class="item.isClicked ? 'active-status' : ''"
              class="pa-2 mr-3 mb-3"
              @click="getStatus(item.value, item.type)"
            >
              <v-layout align-center>
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
        <v-divider class="mt-1 mb-4"></v-divider>
      </v-layout>

      <!-- THOI GIAN DAT XE -->
      <v-layout column>
        <v-layout justify-space-between class="gap-10">
          <v-layout column style="max-width: 50%">
            <label class="text--body-5 text-uppercase">
              {{ $t("booking.labels.start-date-from") }}
            </label>
            <base-datetime-picker
              v-model="startTime"
              :persistent="true"
              :clear-text="$t('cancel')"
              :ok-text="$t('selectLabel')"
              :error-message="$t(errorStartTime)"
              :is-clear-date-time="isClearDateTime"
              date-format="dd/MM/yyyy"
              :text-field-props="textFieldProps"
              :time-picker-props="timePickerProps"
              @input-date="changeDurationDate"
              @input-time="updateDurationHour"
            />
          </v-layout>
          <v-layout column style="max-width: 50%">
            <label class="text--body-5 text-uppercase">
              {{ $t("tickets.labels.to") }}
            </label>
            <base-datetime-picker
              v-model="endTime"
              :persistent="true"
              :clear-text="$t('cancel')"
              :ok-text="$t('selectLabel')"
              :error-message="$t(errorEndTime)"
              :is-clear-date-time="isClearDateTime"
              date-format="dd/MM/yyyy"
              :text-field-props="textFieldProps"
              :time-picker-props="timePickerProps"
              @input-date="changeDurationDate"
              @input-time="updateDurationHour"
            />
          </v-layout>
        </v-layout>
        <v-divider class="my-4"></v-divider>
      </v-layout>

      <!-- THANH PHAN THAM GIA -->
      <v-layout column>
        <label class="text--body-5 text-uppercase">
          {{ $t("booking.labels.participants") }}
        </label>
        <v-autocomplete
          v-model="formData.participants"
          outlined
          dense
          hide-selected
          hide-details
          floating
          solo
          class="text--body-5"
          :placeholder="$t('booking.placeholders.participants')"
          :label="$t('tickets.placeholders.performer')"
          :items="listParticipant"
          item-text="fullName"
          chips
          deletable-chips
          attach
        >
          <vue-feather slot="append" class="grey--text" type="search" />
        </v-autocomplete>
        <v-divider class="my-4"></v-divider>
      </v-layout>

      <!-- ACTIONS -->
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
            {{ $t("tickets.labels.clear-filter") }}
          </v-btn>
          <v-btn
            rounded
            color="primary"
            class="w-150 py-5 text--button"
            elevation="0"
            @click="onSubmit"
          >
            {{ $t("tickets.labels.apply") }}
          </v-btn>
        </v-layout>
      </v-layout>
    </v-layout>
  </v-layout>
</template>
<script>
import moment from "moment";
import constants from "@/constants";
import { mapState, mapActions } from "vuex";
import mixinStatusAndPriority from "@/modules/carbooking/mixins/mixinStatusAndPriority";
import {
  getDateNow,
  FORMAT_DATE_TICKET,
  FORMAT_TIME_TICKET,
  formatDate,
} from "@/modules/carbooking/helpers/bookingUtils";
import filterItems from "@/mixins/filterItems.js";
import { BookingService } from "@/modules/carbooking/services/bookingService";

export default {
  mixins: [mixinStatusAndPriority, filterItems],
  props: {
    formData: {
      type: Object,
      default: undefined,
    },
    listParticipant: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      formatDate: FORMAT_DATE_TICKET,
      isChooseDate: false,

      lstStatus: [],
      chooseStatus: [],
      durationDateVal: null,
      startTime: null,
      endTime: null,
      errorStartTime: null,
      errorEndTime: null,
      textFieldProps: {
        appendIcon: "app-icon icon-calendar darken",
        outlined: true,
        dense: true,
        placeholder: "DD/MM/YYYY HH:mm",
      },
      timePickerProps: {
        format: "24hr",
        noTitle: true,
      },
      isClearDateTime: false,
    };
  },
  computed: {
    localDate() {
      return this.$i18n.locale === "vi" ? "vi-VN" : "en-US";
    },
    ...mapState("layout", ["isClearAdvance"]),
  },
  watch: {
    isClearAdvance() {
      if (this.isClearAdvance) {
        this.clearFilter();
      }
    },
    startTime(val) {
      this.errorStartTime = null;
      this.errorEndTime = null;
      this.formData.startTime = moment(val).format("YYYY-MM-DD HH:mm");
      const selectDate = moment(this.endTime, constants.FORMAT_DATE_TICKET);
      const dateExpired = moment(this.startTime, constants.FORMAT_DATE_TICKET);
      const dateDiff = selectDate.diff(dateExpired, "days");
      if (dateDiff < 0) {
        this.errorStartTime = "task-manager.compareDate";
      } else if (dateDiff === 0) {
        const selectTime = moment(this.endTime, FORMAT_TIME_TICKET);
        const timeExpired = moment(this.startTime, FORMAT_TIME_TICKET);
        const timeDiff = selectTime.diff(timeExpired, "hours");
        if (timeDiff < 0) {
          this.errorStartTime = "task-manager.compareDate";
        } else if (timeDiff === 0) {
          const minuteDiff = selectTime.diff(timeExpired, "minutes");
          if (minuteDiff < 0) {
            this.errorStartTime = "task-manager.compareDate";
          }
        }
      }
    },
    endTime(val) {
      this.errorStartTime = null;
      this.errorEndTime = null;
      this.formData.endTime = moment(val).format("YYYY-MM-DD HH:mm");
      const selectDate = moment(this.endTime, constants.FORMAT_DATE_TICKET);
      const dateExpired = moment(this.startTime, constants.FORMAT_DATE_TICKET);
      const dateDiff = selectDate.diff(dateExpired, "days");
      if (dateDiff < 0) {
        this.errorEndTime = "task-manager.compareDate";
      } else if (dateDiff === 0) {
        const selectTime = moment(this.endTime, FORMAT_TIME_TICKET);
        const timeExpired = moment(this.startTime, FORMAT_TIME_TICKET);
        const timeDiff = selectTime.diff(timeExpired, "hours");
        if (timeDiff < 0) {
          this.errorEndTime = "task-manager.compareDate";
        } else if (timeDiff === 0) {
          const minuteDiff = selectTime.diff(timeExpired, "minutes");
          if (minuteDiff < 0) {
            this.errorEndTime = "task-manager.compareDate";
          }
        }
      }
    },
  },
  created() {
    this.getListStatus();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    trimSpace() {
      if (this.formData.name) {
        this.formData.name = this.formData.name.trim();
      }
    },
    async getListStatus() {
      const response = await BookingService.getListStatus();
      response.data
        .filter((x) => x.value !== -1 && x.value !== 0 && x.value !== 5)
        .forEach((x) => {
          this.lstStatus.push({
            name: x.name,
            value: x.value,
            isClicked: false,
          });
        });
    },
    clearFilter() {
      this.lstStatus = this.lstStatus.map((item) => {
        return {
          name: item.name,
          value: item.value,
          isClicked: false,
        };
      });
      if (
        this.chooseStatus.length ||
        this.formData.startTime ||
        this.formData.endTime ||
        this.formData.name ||
        this.formData.participants
      ) {
        this.formData.startTime = null;
        this.formData.endTime = null;
        this.isClearDateTime = true;
        this.chooseStatus = [];
        this.$emit("clear-search");
      } else {
        this.isClearDateTime = false;
        this.$emit("close-dialog");
      }
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    onSubmit() {
      this.isClearDateTime = false;
      this.$emit("submit-dialog");
      this.$emit("close-dialog");
    },
    formatDateView(date) {
      return formatDate(date, FORMAT_DATE_TICKET);
    },
    getStatus(value, type) {
      this.lstStatus = this.lstStatus.map((item) => {
        if (item.value === value) {
          if (
            (item.isClicked && this.chooseStatus.length === 0) ||
            !item.isClicked
          ) {
            this.chooseStatus.push(value);
          } else {
            this.chooseStatus = this.chooseStatus.filter((x) => x !== value);
          }
          return {
            value: item.value,
            isClicked: !item.isClicked,
          };
        } else {
          return {
            value: item.value,
            isClicked: item.isClicked,
          };
        }
      });
      this.$emit("get-status", this.chooseStatus, type);
    },
    allowedDateDuration(val) {
      return val >= getDateNow();
    },
    changeDurationDate(val) {
      this.durationDateVal = val;
    },
    updateDurationHour(val) {
      if (val) {
        const hour = val.split(":")[0];
        this.durationHourVal = parseInt(hour);
      } else {
        this.durationHourVal = 0;
      }
    },
    allowedHourDuration(val) {
      if (this.isToday(this.durationDateVal)) {
        const today = new Date();
        var hour = today.getHours();
        var minutes = today.getMinutes();
        if (minutes === 59) {
          return val > hour;
        } else {
          return val >= hour;
        }
      }

      return true;
    },
    isToday(date) {
      if (getDateNow() === date) {
        return true;
      }
      return false;
    },
    allowedMinutesDuration(val) {
      if (this.isToday(this.durationDateVal)) {
        const today = new Date();
        var hour = today.getHours();
        var minutes = today.getMinutes();
        if (this.durationHourVal === hour) {
          return minutes >= 59 ? true : val > minutes;
        } else {
          return true;
        }
      }

      return true;
    },
  },
};
</script>
