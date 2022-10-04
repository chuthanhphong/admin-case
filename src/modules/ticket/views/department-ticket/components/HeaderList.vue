<template>
  <v-layout column class="px-3">
    <v-layout class="mb-2">
      <v-layout>
        <v-select
          v-model="formSearch.groupTicketSelected"
          outlined
          dense
          hide-details
          class="mw-200 mr-3 text--body-5"
          :items="selectGroupTicketItems"
          item-text="name"
          @change="onSearch"
        >
          <template slot="append">
            <i class="app-icon icon-chevron-down"></i>
          </template>
        </v-select>

        <v-text-field
          v-if="groupsOfUser.length > 1"
          v-model="formSearch.groupSelected.groupName"
          class="mw-225 text--body-5 hover--pointer"
          dense
          outlined
          readonly
          hide-details
          @click="onShowTreeView"
        >
          <template slot="append">
            <i class="app-icon icon-chevron-down"> </i>
          </template>
        </v-text-field>
      </v-layout>
    </v-layout>
    <div class="header-list-ticket d-flex justify-space-between align-center">
      <v-layout>
        <v-select
          v-model="menuSelected"
          outlined
          dense
          hide-details
          class="mw-200 mr-3 text--body-5"
          :items="menuItems"
          item-text="name"
          return-object
          @change="changeMenuStatusSearch"
        >
          <template slot="append">
            <i class="app-icon icon-select-checked darken"></i>
          </template>
        </v-select>
        <v-menu
          ref="menuDateFromTo"
          v-model="menuDateFromTo"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
          max-width="250"
          attach
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              outlined
              placeholder="DD/MM/YYYY - DD/MM/YYYY"
              dense
              v-bind="attrs"
              hide-details="auto"
              append-icon="mdi-calendar-range"
              class="text--body-5 box--date mw-210"
              :error-messages="$t(errorDateFromTo)"
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
            fomat="DD/MM/YYYY"
            :locale="localDate"
            :allowed-dates="allowedDates"
            range
            no-title
            @click:date="onChangeDates"
          />
        </v-menu>
      </v-layout>
      <div class="box-search">
        <v-text-field
          v-model="formSearch.name"
          outlined
          dense
          hide-details
          class="text--body-5 mr-3"
          :placeholder="$t('tickets.placeholders.my-request-search')"
          @keypress="callSearchWithKeyEnter"
        >
          <vue-feather
            slot="append"
            class="darken--text"
            type="search"
            size="20"
          />
        </v-text-field>
      </div>

      <!-- AN DO BUIL PRODUCT -->
      <v-menu
        v-model="menuAdvancesSearch"
        offset-x
        offset-y
        left
        attach
        :close-on-content-click="false"
        min-width="440px"
        max-width="440px"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on: menuState, attrs }">
          <v-tooltip top content-class="tooltip-top">
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                v-bind="attrs"
                outlined
                class="btn-show-advance mx-0 mr-3"
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
          :lst-type="lstType"
          :lst-created="lstCreated"
          :lst-performer="lstPerformer"
          :lst-perform-group="lstPerformGroup"
          :lst-follower="lstFollower"
          :is-show-created-el="isShowCreatedEl"
          :is-show-performer-el="isShowPerformerEl"
          :is-show-perform-group-el="isShowPerformGroupEl"
          :is-show-follower-el="isShowFollowerEl"
          :is-show-approve-el="isShowApproveEl"
          :is-show-request-unit-el="isShowRequestUnitEl"
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
        offset-x
        offset-y
        left
        attach
        :close-on-content-click="false"
        min-width="440px"
        max-width="440px"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on: menuState, attrs }">
          <v-tooltip top content-class="tooltip-top">
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                v-bind="attrs"
                outlined
                class="btn-show-advance mx-0 mr-3"
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
      <v-btn
        v-if="!isAdminTicket"
        color="primary"
        :disabled="disabledCreate"
        @click="showDialogAddNew"
      >
        <span class="pr-3 text-capitalize text--button">{{
          $t("tickets.labels.create")
        }}</span>
        <vue-feather type="plus-circle" size="25" />
      </v-btn>
    </div>

    <!-- dialog tree view -->
    <DialogTreeView
      v-model="showDialogTreeView"
      :title="$t('tickets.labels.group-list')"
      :group-id="formSearch.groupSelected.groupId"
      :all-groups="groupsOfUser"
      @selected-group="selectedGroup"
    />
  </v-layout>
</template>
<script>
// components
import AdvanceSearch from "@/modules/ticket/views/components/AdvanceSearch.vue";
import PopupDisplaySetting from "@/modules/ticket/views/components/popup-display-settings/PopupDisplaySetting.vue";
import DialogTreeView from "@/modules/ticket/views/components/DialogTreeView.vue";

import moment from "moment";
import constants from "@/constants";
import {
  getDateNow,
  formatDate,
  selectGroupTicketType,
  PERIOD_DAYS,
  mapStatusSearchOptions,
} from "@/modules/ticket/helpers/ticketUtils";
import mixinFindUserRole from "@/modules/ticket/mixins/mixinFindUserRole";

export default {
  name: "HeaderList",
  components: { AdvanceSearch, PopupDisplaySetting, DialogTreeView },
  mixins: [mixinFindUserRole],
  props: {
    formSearch: {
      type: Object,
      default: undefined,
    },
    lstOptionDeadline: {
      type: Array,
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
    groupsOfUser: {
      type: Array,
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
    isShowApproveEl: {
      type: Boolean,
      default: undefined,
    },
    isShowRequestUnitEl: {
      type: Boolean,
      default: undefined,
    },
    settingHeaders: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      selectGroupTicketItems: [
        {
          value: selectGroupTicketType.receive,
          name: this.$t("tickets.labels.request-receive"),
        },
        {
          value: selectGroupTicketType.send,
          name: this.$t("tickets.labels.request-sent"),
        },
      ],
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

      // tree
      showDialogTreeView: false,
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
      if (this.isAdminTicket) {
        this.menuItems[0].value.splice(0, 1);
        this.menuItems[2].value.splice(0, 1);
      }

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
      this.$emit("get-status", value);
    },
    getDeadline(value) {
      this.$emit("get-deadline", value);
    },
    getPriority(value) {
      this.$emit("get-priority", value);
    },
    onSubmitAdvanceSearch() {
      this.$emit("advance-search");
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
    onClosePopupDisplaySettings() {
      this.menuDisplaySettings = false;
    },

    // tree
    onShowTreeView() {
      this.showDialogTreeView = true;
    },
    selectedGroup(val) {
      this.formSearch.groupSelected = val[0];
      this.onSearch();
    },
  },
};
</script>
