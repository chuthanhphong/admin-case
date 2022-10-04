<template>
  <div
    class="header-list-ticket d-flex justify-end align-center px-3"
  >
    <!-- <v-layout>
      <v-select
        v-model="menuSelected"
        outlined
        dense
        hide-details
        class="mw-200 mr-3"
        :items="menuItems"
        item-text="name"
        return-object
        @change="changeMenuStatusSearch"
      >
        <template slot="append">
          <v-icon>mdi-chevron-down</v-icon>
        </template>
      </v-select>

    </v-layout> -->
    <div class="box-search">
      <validation-provider name="contractName" rules="required|max:200">
        <v-text-field
          v-model="formSearch.name"
          outlined
          dense
          hide-details
          maxlength="200"
          counter="200"
          class="text--body-5 mr-3"
          :placeholder="$t('booking.placeholders.my-request-search')"
          @keypress="callSearchWithKeyEnter"
          @change="trimSpace"
        >
          <vue-feather
            slot="append"
            class="darken--text"
            type="search"
            size="20"
          />
        </v-text-field>
      </validation-provider>
    </div>

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
              :class="isActiveAdvance ? 'border-blue' : ''"
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
        :list-participant="listParticipant"
        @close-dialog="onClosePopupAdvanceSearch"
        @submit-dialog="onSubmitAdvanceSearch"
        @clear-search="clearSearch"
        @get-status="getStatus"
      />
    </v-menu>
    <v-btn :disabled="disabledCreate" color="primary" @click="showDialogAddNew">
      <span class="pr-3 text-uppercase text--button">
        {{ $t("booking.labels.booking-car") }}
      </span>
      <vue-feather type="plus-circle" size="25" />
    </v-btn>
  </div>
</template>
<script>
// mixins
import mixinFindUserRole from "@/modules/ticket/mixins/mixinFindUserRole";
// libs
import moment from "moment";
import constants from "@/constants";
import {
  formatDate,
  mapStatusSearchOptions,
} from "@/modules/carbooking/helpers/bookingUtils";

import AdvanceSearch from "@/modules/carbooking/views/components/AdvanceSearch.vue";

export default {
  name: "HeaderList",
  components: { AdvanceSearch },
  mixins: [mixinFindUserRole],
  props: {
    formSearch: {
      type: Object,
      default: undefined,
    },
    listParticipant: {
      type: Array,
      default: undefined,
    },
    disabledCreate: {
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
      // menu status
      menuSelected: null,
      menuItems: [
        {
          key: 1,
          value: mapStatusSearchOptions.participate,
          name: this.$t("booking.status-search.participate"),
        },
        {
          key: 2,
          value: mapStatusSearchOptions.create,
          name: this.$t("booking.status-search.create"),
        },
        {
          key: 3,
          value: mapStatusSearchOptions.approve,
          name: this.$t("booking.status-search.approve"),
        },
      ],

      errorDateFromTo: "",
      datesPicker: [],
      datesPickerFm: [],
      startDateSearch: null,
      menuAdvancesSearch: false,
      isActiveAdvance: false,
      selectStatus: [],
    };
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
      this.onSearch();
    },
    async initStatus() {
      this.menuSelected = this.menuItems.find((o) => o.key === 1);
      this.formSearch.status = this.menuSelected.value;
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
    trimSpace() {
      if (this.formSearch.name) {
        this.formSearch.name = this.formSearch.name.trim();
      }
    },
    clearSearch() {
      this.selectStatus = [];
      this.isActiveAdvance = false;
      this.$emit("clear-search");
    },
    onSearch() {
      this.$emit("search");
    },
    getStatus(value, type) {
      this.selectStatus = value;
      this.$emit("get-status", value, type);
    },
    changeMenuStatusSearch() {
      this.formSearch.status = this.menuSelected.value;
      this.onSearch();
    },
    onClosePopupAdvanceSearch() {
      this.menuAdvancesSearch = false;
    },
    onSubmitAdvanceSearch() {
      if (this.selectStatus.length || this.formSearch.name || this.formSearch.startTime || this.formSearch.endTime || this.formSearch.participants) {
        this.isActiveAdvance = true;
      } else {
        this.isActiveAdvance = false;
      }
      this.$emit("advance-search");
    },
  },
};
</script>
