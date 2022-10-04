<template>
  <div
    class="header-list-ticket d-flex justify-space-between align-center px-3"
  >
    <v-layout>
      <v-select
        v-if="isShowSelectGroup"
        v-model="formSearch.groupSelected"
        :items="groupsByUserId"
        class="mw-300 mr-3"
        dense
        hide-details
        item-text="groupName"
        item-value="groupId"
        outlined
        return-object
        @change="onChangeGroupSearch"
      >
        <template slot="append">
          <i class="app-icon icon-select-checked darken"></i>
        </template>
      </v-select>
    </v-layout>
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
        :is-show-task-center-el="isShowTaskCenterEl"
        :lst-type="lstType"
        :lst-created="lstCreated"
        :lst-performer="lstPerformer"
        :lst-perform-group="lstPerformGroup"
        :lst-follower="lstFollower"
        @close-dialog="onClosePopupAdvanceSearch"
        @submit-dialog="onSubmitAdvanceSearch"
        @clear-search="clearSearch"
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
      <span class="pr-3 text-capitalize text--button">{{
        $t("tickets.labels.create")
      }}</span>
      <vue-feather size="25" type="plus-circle" />
    </v-btn>
  </div>
</template>
<script>
// components
import AdvanceSearch from "@/modules/ticket/views/components/AdvanceSearch.vue";
import PopupDisplaySetting from "@/modules/ticket/views/components/popup-display-settings/PopupDisplaySetting.vue";

import { getTextTruncate } from "@/modules/ticket/helpers/ticketUtils";

export default {
  name: "HeaderList",
  components: { AdvanceSearch, PopupDisplaySetting },
  props: {
    formSearch: {
      type: Object,
      default: undefined,
    },
    groupsByUserId: {
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
    totalCount: {
      type: Number,
      default: undefined,
    },
    isShowCreatedEl: {
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
    isShowTaskCenterEl: {
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
      menuAdvancesSearch: false,
      menuDisplaySettings: false,
    };
  },
  computed: {
    isShowSelectGroup() {
      return this.groupsByUserId && this.groupsByUserId.length > 1;
    },
  },
  methods: {
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
    getDeadline(value) {
      this.$emit("get-deadline", value);
    },
    getPriority(value) {
      this.$emit("get-priority", value);
    },
    onSubmitAdvanceSearch() {
      this.$emit("advance-search");
    },
    onChangeGroupSearch() {
      this.$emit("on-change-group");
    },
    getTextTruncateView(val, size) {
      return getTextTruncate(val, size);
    },
    onClosePopupAdvanceSearch() {
      this.menuAdvancesSearch = false;
    },
    onClosePopupDisplaySettings() {
      this.menuDisplaySettings = false;
    },
  },
};
</script>
