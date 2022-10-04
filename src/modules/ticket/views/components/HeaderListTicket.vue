<template>
  <div
    class="header-list-ticket d-flex justify-space-between align-center px-3"
  >
    <v-layout>
      <v-select
        v-model="menuSelected"
        :item-value="(item) => item.key"
        :items="menuItems"
        class="mw-200 mr-3"
        dense
        hide-details
        item-text="name"
        outlined
        return-object
        @change="changeMenuStatusSearch"
      >
        <template slot="append">
          <i class="app-icon icon-select-checked darken"></i>
        </template>
      </v-select>
      <!-- <v-menu
        ref="menuDateFromTo"
        v-model="menuDateFromTo"
        :close-on-content-click="false"
        attach
        max-width="272"
        min-width="auto"
        offset-y
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateRangeText"
            :error-messages="$t(errorDateFromTo)"
            append-icon="mdi-calendar-range"
            class="text--body-5 box--date mw-210"
            dense
            hide-details="auto"
            outlined
            placeholder="DD/MM/YYYY - DD/MM/YYYY"
            v-bind="attrs"
            v-on="on"
            @click:append="menuDateFromTo = !menuDateFromTo"
          >
            <template v-slot:append>
              <i
                class="app-icon icon-calendar darken"
                @click="menuDateFromTo = !menuDateFromTo"
              ></i>
            </template>
          </v-text-field>
        </template>
        <v-date-picker
          v-model="datesPicker"
          :allowed-dates="allowedDates"
          :locale="localDate"
          fomat="DD/MM/YYYY"
          no-title
          range
          @click:date="onChangeDates"
        />
      </v-menu> -->
      <!-- <v-tooltip content-class="tooltip-right" max-width="250" right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="ml-2"
            color="darken"
            size="20"
            v-bind="attrs"
            v-on="on"
          >
            mdi-information-outline
          </v-icon>
        </template>
        <v-layout>
          <span>
            <span class="font-weight-bold">
              {{ $t("tickets.tooltips.defaul-sort-list") }}:
            </span>
            {{ $t("tickets.tooltips.tooltip-sort-list") }}
          </span>
        </v-layout>
      </v-tooltip> -->
    </v-layout>
    <div class="box-search">
      <validation-provider name="contractName" rules="required|max:200">
        <v-text-field
          v-model="formSearch.name"
          :placeholder="$t('tickets.placeholders.my-request-search')"
          class="text--body-5 mr-3"
          counter="200"
          dense
          hide-details
          maxlength="200"
          outlined
          @keypress="callSearchWithKeyEnter"
        >
          <vue-feather
            slot="append"
            class="darken--text"
            size="20"
            type="search"
          />
        </v-text-field>
      </validation-provider>
    </div>

    <!-- AN DO BUIL PRODUCT -->
    <v-menu
      v-model="menuAdvancesSearch"
      :close-on-content-click="false"
      attach
      left
      max-width="440px"
      min-width="440px"
      offset-x
      offset-y
      transition="slide-x-transition"
    >
      <template v-slot:activator="{ on: menuState, attrs }">
        <v-tooltip content-class="tooltip-top" top>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="btn-show-advance mx-0 mr-3"
              outlined
              v-bind="attrs"
              v-on="{ ...menuState, ...tooltip }"
            >
              <i class="app-icon icon-advance darken" />
            </v-btn>
          </template>
          <div>
            {{ $t("tickets.labels.advance-search") }}
          </div>
        </v-tooltip>
      </template>
      <AdvanceSearch
        :form-data="formSearch"
        :is-show-created-el="isShowCreatedEl"
        :is-show-follower-el="isShowFollowerEl"
        :is-show-perform-group-el="isShowPerformGroupEl"
        :is-show-performer-el="isShowPerformerEl"
        :lst-created="lstCreated"
        :lst-follower="lstFollower"
        :lst-perform-group="lstPerformGroup"
        :lst-performer="lstPerformer"
        :lst-type="lstType"
        :is-clear-data-search="isClearDataSearch"
        @close-dialog="onClosePopupAdvanceSearch"
        @submit-dialog="onSubmitAdvanceSearch"
        @clear-search="clearSearch"
        @get-status="getStatus"
        @get-deadline="getDeadline"
        @get-priority="getPriority"
      />
    </v-menu>

    <v-menu
      v-model="menuDisplaySettings"
      :close-on-content-click="false"
      attach
      left
      max-width="440px"
      min-width="440px"
      offset-x
      offset-y
      transition="slide-x-transition"
    >
      <template v-slot:activator="{ on: menuState, attrs }">
        <v-tooltip content-class="tooltip-top" top>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="btn-show-advance mx-0 mr-3"
              outlined
              v-bind="attrs"
              v-on="{ ...menuState, ...tooltip }"
            >
              <i class="app-icon icon-view darken" />
            </v-btn>
          </template>
          <div>
            {{ $t("tickets.labels.view-setting") }}
          </div>
        </v-tooltip>
      </template>
      <PopupDisplaySetting
        :items="settingHeaders"
        @close-dialog="onClosePopupDisplaySettings"
      />
    </v-menu>
    <v-btn :disabled="disabledCreate" color="primary" @click="showDialogAddNew">
      <span class="pr-3 text-capitalize text--button">
        {{ $t("tickets.labels.create") }}
      </span>
      <vue-feather size="25" type="plus-circle" />
    </v-btn>
  </div>
</template>
<script>
// components
import AdvanceSearch from "./AdvanceSearch.vue";
import PopupDisplaySetting from "./popup-display-settings/PopupDisplaySetting.vue";
// mixins
import mixinFindUserRole from "@/modules/ticket/mixins/mixinFindUserRole";
// libs
import moment from "moment";
import constants from "@/constants";
import {
  formatDate,
  getDateNow,
  mapStatusSearchOptions,
  PERIOD_DAYS,
} from "@/modules/ticket/helpers/ticketUtils";

export default {
  name: "HeaderListTicket",
  components: { AdvanceSearch, PopupDisplaySetting },
  mixins: [mixinFindUserRole],
  props: {
    formSearch: {
      type: Object,
      default: undefined,
    },
    lstType: {
      type: Array,
      default: undefined,
    },
    lstCreated: {
      type: Array,
      default: undefined,
    },
    lstPerformer: {
      type: Array,
      default: undefined,
    },
    lstPerformGroup: {
      type: Array,
      default: undefined,
    },
    lstFollower: {
      type: Array,
      default: undefined,
    },
    disabledCreate: {
      type: Boolean,
      default: undefined,
    },
    isShowCreatedEl: {
      type: Boolean,
      default: undefined,
    },
    isShowPerformerEl: {
      type: Boolean,
      default: undefined,
    },
    isShowPerformGroupEl: {
      type: Boolean,
      default: undefined,
    },
    isShowFollowerEl: {
      type: Boolean,
      default: undefined,
    },
    settingHeaders: {
      type: Array,
      default: undefined,
    },
    isClearData: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
    return {
      // menu status
      isClearDataSearch: false,
      menuSelected: null,
      menuItems: [
        {
          key: 1,
          value: mapStatusSearchOptions.unfinish,
          name: this.$t("tickets.status-search.unfinish"),
        },
        {
          key: 2,
          value: mapStatusSearchOptions.closed,
          name: this.$t("tickets.status-search.closed.name"),
        },
        {
          key: 3,
          value: mapStatusSearchOptions.all,
          name: this.$t("tickets.status-search.all"),
        },
        {
          key: 4,
          value: mapStatusSearchOptions.cancelled,
          name: this.$t("tickets.status-search.cancelled"),
        },
      ],

      menuDateFromTo: false,
      errorDateFromTo: "",
      datesPicker: [],
      datesPickerFm: [],
      startDateSearch: null,
      menuAdvancesSearch: false,
      menuDisplaySettings: false,
    };
  },
  computed: {
    localDate() {
      return this.$i18n.locale === "vi" ? "vi-VN" : "en-US";
    },
    dateRangeText() {
      return this.datesPickerFm.join(" - ");
    },
    isAdminTicket() {
      const groupIds = this.findAdminGroupIds;
      if (groupIds && groupIds.length > 0) {
        return true;
      }
      return false;
    },
  },
  watch: {
    isClearData() {
      this.isClearDataSearch = this.isClearData
      if (this.isClearData) {
        this.clearSearch();
      }
    },
    datesPicker(val) {
      if (val.length === 1) {
        this.startDateSearch = val[0];
      } else {
        this.startDateSearch = null;
      }

      // validate dates
      this.errorDateFromTo = "";
      if (
        this.datesPicker[0] !== undefined &&
        this.datesPicker[1] !== undefined
      ) {
        const selectDate = moment(
          this.datesPicker[1],
          constants.FORMAT_DATE_ISO
        );
        const timeExprired = moment(
          this.datesPicker[0],
          constants.FORMAT_DATE_ISO
        );
        const diff = selectDate.diff(timeExprired, "days");
        if (diff < 0) {
          this.errorDateFromTo = "task-manager.compareDate";
          this.formSearch.dates = [];
        } else if (diff > 365) {
          this.errorDateFromTo = "task-manager.dateExpire";
          this.formSearch.dates = [];
        } else {
          this.errorDateFromTo = "";
        }
      }

      this.datesPickerFm = [];
      if (val.length > 0) {
        val.forEach((item) => {
          const newItem = formatDate(item, constants.FORMAT_DATE_TICKET);
          this.datesPickerFm.push(newItem);
        });
      }
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await this.initStatus();
      this.initDate();
    },
    async initStatus() {
      this.menuSelected = this.menuItems.find((o) => o.key === 1);
      this.formSearch.status = this.menuSelected.value;
    },
    initDate() {
      const sixMonthBefore = moment().subtract(PERIOD_DAYS, "days");
      const currentDate = getDateNow();
      this.datesPicker = [
        moment(sixMonthBefore).format(constants.FORMAT_DATE_ISO),
        moment(currentDate).format(constants.FORMAT_DATE_ISO),
      ];
      this.formSearch.dates = this.datesPicker;
      this.onSearch();
    },
    showDialogAddNew() {
      this.$emit("show-dialog-add-new");
    },
    callSearchWithKeyEnter(evt) {
      evt = evt || window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode === 13) {
        this.onSearch();
      }
    },
    clearSearch() {
      this.$emit("clear-search");
    },
    onSearch() {
      this.$emit("search");
    },
    getStatus(value) {
      if (value.length === 1) {
        const temp = value[0];
        switch (temp) {
          case -1: {
            this.menuSelected = 4;
            break;
          }
          case 0: {
            this.menuSelected = 3;
            break;
          }
          case 10: {
            this.menuSelected = 2;
            break;
          }
          default: {
            this.menuSelected = 1;
          }
        }
      } else if (value.length > 2) {
        this.menuSelected = 3;
      } else if (value.length === 2) {
        this.menuSelected = 1;
      }
      this.$emit("get-status", value);
    },
    getDeadline(value) {
      this.$emit("get-deadline", value);
    },
    getPriority(value) {
      this.$emit("get-priority", value);
    },
    changeMenuStatusSearch() {
      this.formSearch.status = this.menuSelected.value;
      this.onSearch();
    },
    allowedDates(val) {
      const currDate = getDateNow();
      if (this.startDateSearch) {
        return val >= this.startDateSearch && val <= currDate;
      } else {
        return val <= currDate;
      }
    },
    onChangeDates() {
      if (this.datesPicker.length === 2) {
        this.$refs.menuDateFromTo.save(this.datesPicker);
        this.formSearch.dates = this.datesPicker;
        this.onSearch();
      }
    },
    onClosePopupAdvanceSearch() {
      this.menuAdvancesSearch = false;
    },
    onSubmitAdvanceSearch() {
      this.$emit("advance-search");
    },
    onClosePopupDisplaySettings() {
      this.menuDisplaySettings = false;
    },
  },
};
</script>
