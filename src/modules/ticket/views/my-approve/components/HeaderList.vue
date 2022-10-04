<template>
  <div class="d-flex justify-space-between">
    <v-select
      v-model="menuSelected"
      :items="menuItems"
      class="mw-200 pl-4"
      dense
      hide-details
      item-text="groupName"
      item-value="groupId"
      outlined
      return-object
      @change="changeMenuStatusSearch"
    >
      <template slot="append">
        <i class="app-icon icon-select-checked darken"></i>
      </template>
    </v-select>
    <div
      class="header-list-ticket d-flex justify-space-between align-center px-3"
    >
      <div class="box-search">
        <v-text-field
          v-model="formSearch.name"
          :placeholder="$t('tickets.placeholders.my-request-search')"
          class="text--body-5 mr-3"
          dense
          hide-details
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
          :is-show-approve-el="isShowApproveEl"
          :is-show-created-el="isShowCreatedEl"
          :is-show-follower-el="isShowFollowerEl"
          :is-show-perform-group-el="isShowPerformGroupEl"
          :is-show-performer-el="isShowPerformerEl"
          :lst-created="lstCreated"
          :lst-follower="lstFollower"
          :lst-perform-group="lstPerformGroup"
          :lst-performer="lstPerformer"
          :lst-type="lstType"
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

      <v-btn
        :disabled="disabledCreate"
        color="primary"
        @click="showDialogAddNew"
      >
        <span class="pr-3 text-capitalize text--button">{{
          $t("tickets.labels.create")
        }}</span>
        <vue-feather size="25" type="plus-circle" />
      </v-btn>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import constants from "@/constants";
import { formatDate } from "@/modules/ticket/helpers/ticketUtils";

import AdvanceSearch from "@/modules/ticket/views/components/AdvanceSearch.vue";
import PopupDisplaySetting from "@/modules/ticket/views/components/popup-display-settings/PopupDisplaySetting.vue";
import { GroupService } from "@/services/groupService";

export default {
  name: "HeaderList",
  components: { AdvanceSearch, PopupDisplaySetting },
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
    isShowApproveEl: {
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
      errorDateFromTo: "",
      datesPicker: [],
      datesPickerFm: [],
      startDateSearch: null,
      menuAdvancesSearch: false,
      menuDisplaySettings: false,
      menuSelected: null,
      menuItems: [],
    };
  },
  computed: {},
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
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      const response = await GroupService.getGroupsByApproveOfUser();
      if (response.status === 200) {
        this.menuItems = response.data;
        this.menuSelected = this.menuItems[0]
        this.formSearch.status = this.menuItems[0].groupId;
      }
      this.onSearch();
    },
    onClosePopupAdvanceSearch() {
      this.menuAdvancesSearch = false;
    },
    onClosePopupDisplaySettings() {
      this.menuDisplaySettings = false;
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
    changeMenuStatusSearch() {
      this.formSearch.status = this.menuSelected;
      this.onSearch();
    },
    onSubmitAdvanceSearch() {
      this.$emit("advance-search");
    },
  },
};
</script>
