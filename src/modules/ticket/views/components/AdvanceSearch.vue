<template>
  <v-layout column>
    <v-layout class="py-3 pl-4 pr-3" justify-space-between>
      <h5 class="text-capitalize">
        {{ $t("advanceSearch") }}
      </h5>
      <v-icon @click="closeDialog">mdi-close</v-icon>
    </v-layout>
    <v-divider class="mb-4"></v-divider>
    <v-layout class="scroll-advance-search-options overflow-y-auto px-6" column>
      <!-- ID TEN -->
      <v-layout column>
        <label class="text--body-5 text-uppercase">
          {{ $t("tickets.labels.name-search") }}
        </label>
        <validation-provider name="contractName" rules="required|max:200">
          <v-text-field
            v-model="formData.name"
            :placeholder="$t('tickets.placeholders.name-search')"
            autofocus
            class="text--body-5"
            clearable
            counter="200"
            dense
            hide-details
            maxlength="200"
            name="txtSearch"
            outlined
            @change="trimSpace"
          >
          </v-text-field>
        </validation-provider>
        <v-divider class="my-4"></v-divider>
      </v-layout>

      <!-- TRANG THAI -->
      <v-layout v-if="hasStatus && !isShowTaskCenterEl" column>
        <label class="text--body-5 text-uppercase mb-3">
          {{ $t("tickets.labels.ticket-status") }}
        </label>
        <v-container>
          <v-row v-if="!isShowCreatedEl">
            <v-card
              v-for="(item, index) in lstCreateStatus"
              :key="index"
              :class="item.isClicked ? 'border-blue' : ''"
              class="pa-2 mr-3 mb-3"
              @click="getStatus(item.value)"
            >
              <v-layout align-center>
                <v-avatar
                  :color="getColorDotByStatus(item.value)"
                  class="mr-1"
                  size="15"
                >
                </v-avatar>
                <span
                  :class="getColorTextByStatus(item.value)"
                  class="text--overlined-1 text-center"
                  v-html="getTextByStatus(item.value)"
                >
                </span>
              </v-layout>
            </v-card>
          </v-row>
          <v-row v-else-if="isShowCreatedEl && !isShowApproveEl">
            <v-card
              v-for="(item, index) in lstStatus"
              :key="index"
              :class="item.isClicked ? 'border-blue' : ''"
              class="pa-2 mr-3 mb-3"
              @click="getStatus(item.value)"
            >
              <v-layout align-center>
                <v-avatar
                  :color="getColorDotByStatus(item.value)"
                  class="mr-1"
                  size="15"
                >
                </v-avatar>
                <span
                  :class="getColorTextByStatus(item.value)"
                  class="text--overlined-1 text-center"
                  v-html="getTextByStatus(item.value)"
                >
                </span>
              </v-layout>
            </v-card>
          </v-row>
          <v-row v-else-if="isShowApproveEl">
            <v-card
              v-for="(item, index) in lstApproveStatus"
              :key="index"
              :class="item.isClicked ? 'border-blue' : ''"
              class="pa-2 mr-3 mb-3"
              @click="getStatus(item.value)"
            >
              <v-layout align-center>
                <v-avatar
                  :color="getColorDotByStatus(item.value)"
                  class="mr-1"
                  size="15"
                >
                </v-avatar>
                <span
                  :class="getColorTextByStatus(item.value)"
                  class="text--overlined-1 text-center"
                  v-html="getTextByStatus(item.value)"
                >
                </span>
              </v-layout>
            </v-card>
          </v-row>
        </v-container>
        <v-divider class="mt-1 mb-4"></v-divider>
      </v-layout>

      <!-- LOAI -->
      <v-layout column>
        <label class="text--body-5 text-uppercase">
          {{ $t("tickets.labels.ticket-type") }}
        </label>
        <v-select
          v-model="formData.type"
          :item-text="(item) => $t(item.name)"
          :item-value="(item) => item.id"
          :items="lstType"
          :no-data-text="$t('noData')"
          :placeholder="$t('tickets.placeholders.ticket-type')"
          class="text--body-5"
          dense
          hide-details
          outlined
        >
          <template v-slot:append>
            <v-icon>mdi-chevron-down</v-icon>
          </template>
        </v-select>
        <v-divider class="my-4"></v-divider>
      </v-layout>

      <!-- HAN THUC HIEN -->
      <v-layout column>
        <label class="text--body-5 text-uppercase mb-3">
          {{ $t("tickets.labels.exe-deadline") }}
        </label>
        <v-layout class="mb-3" column>
          <v-container>
            <v-row>
              <v-col
                v-for="(item, index) in lstOptionDeadline"
                :key="index"
                md="4"
              >
                <v-card
                  :class="item.isClicked ? 'border-blue' : ''"
                  class="pa-2 text-center"
                  @click="getDeadline(item.value)"
                >
                  <span
                    :class="item.value === 1 ? 'red--text' : ''"
                    class="text--overlined-1"
                  >
                    {{ $t(item.name) }}
                  </span>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-layout>
        <v-layout justify-space-between>
          <div>
            <v-layout column>
              <label class="text--body-5 text-uppercase">
                {{ $t("tickets.labels.from") }}
              </label>
              <v-menu
                v-model="menuDateDeadlineFrom"
                :close-on-content-click="false"
                min-width="auto"
                offset-y
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateDeadlineFromFm"
                    :error-messages="$t(errorDateDeadlinefrom)"
                    :placeholder="$t('tickets.placeholders.is-calendar')"
                    class="text--body-5 mw-175"
                    dense
                    hide-details="auto"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    @click:append="menuDateDeadlineFrom = !menuDateDeadlineFrom"
                  >
                    <template v-slot:append>
                      <i
                        class="app-icon icon-calendar darken"
                        @click="menuDateDeadlineFrom = !menuDateDeadlineFrom"
                      ></i>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="dateDeadlineFrom"
                  :format="formatDate"
                  :locale="localDate"
                  no-title
                  show-adjacent-months
                  @input="menuDateDeadlineFrom = false"
                />
              </v-menu>
            </v-layout>
          </div>
          <div>
            <v-layout column>
              <label class="text--body-5 text-uppercase">
                {{ $t("tickets.labels.to") }}
              </label>
              <v-menu
                v-model="menuDateDeadlineTo"
                :close-on-content-click="false"
                min-width="auto"
                offset-y
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateDeadlineToFm"
                    :error-messages="$t(errorDateDeadlineTo)"
                    :placeholder="$t('tickets.placeholders.is-calendar')"
                    class="text--body-5 mw-175"
                    dense
                    hide-details="auto"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    @click:append="menuDateDeadlineTo = !menuDateDeadlineTo"
                  >
                    <template v-slot:append>
                      <i
                        class="app-icon icon-calendar darken"
                        @click="menuDateDeadlineTo = !menuDateDeadlineTo"
                      ></i>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="dateDeadlineTo"
                  :format="formatDate"
                  :locale="localDate"
                  no-title
                  show-adjacent-months
                  @input="menuDateDeadlineTo = false"
                />
              </v-menu>
            </v-layout>
          </div>
        </v-layout>
        <v-divider class="my-4"></v-divider>
      </v-layout>

      <!-- NGAY TAO -->
      <v-layout column>
        <v-layout justify-space-between>
          <div>
            <v-layout column>
              <label class="text--body-5 text-uppercase">
                {{ $t("dateCreatedFrom") }}
              </label>
              <v-menu
                v-model="menuCreateDateFrom"
                :close-on-content-click="false"
                min-width="auto"
                offset-y
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="createDateFromFm"
                    :error-messages="$t(errorCreateDateFrom)"
                    :placeholder="$t('tickets.placeholders.is-calendar')"
                    class="text--body-5 mw-175"
                    dense
                    hide-details="auto"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    @click:append="menuCreateDateFrom = !menuCreateDateFrom"
                  >
                    <template v-slot:append>
                      <i
                        class="app-icon icon-calendar darken"
                        @click="menuCreateDateFrom = !menuCreateDateFrom"
                      ></i>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="createDateFrom"
                  :allowed-dates="allowedDates"
                  :format="formatDate"
                  :locale="localDate"
                  no-title
                  show-adjacent-months
                  @input="menuCreateDateFrom = false"
                />
              </v-menu>
            </v-layout>
          </div>
          <div>
            <v-layout column>
              <label class="text--body-5 text-uppercase">
                {{ $t("tickets.labels.to") }}
              </label>
              <v-menu
                v-model="menuCreateDateTo"
                :close-on-content-click="false"
                min-width="auto"
                offset-y
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="createDateToFm"
                    :error-messages="$t(errorCreateDateTo)"
                    :placeholder="$t('tickets.placeholders.is-calendar')"
                    class="text--body-5 mw-175"
                    dense
                    hide-details="auto"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    @click:append="menuCreateDateTo = !menuCreateDateTo"
                  >
                    <template v-slot:append>
                      <i
                        class="app-icon icon-calendar darken"
                        @click="menuCreateDateTo = !menuCreateDateTo"
                      ></i>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="createDateTo"
                  :format="formatDate"
                  :locale="localDate"
                  no-title
                  show-adjacent-months
                  @input="menuCreateDateTo = false"
                />
              </v-menu>
            </v-layout>
          </div>
        </v-layout>
        <v-divider class="my-4"></v-divider>
      </v-layout>

      <!-- ĐO UU TIEN -->
      <v-layout column>
        <label class="text--body-5 text-uppercase mb-3">
          {{ $t("tickets.labels.priority-lb") }}
        </label>
        <v-layout justify-space-between>
          <v-chip
            v-for="(item, index) in lstPriority"
            :key="index"
            :class="item.isClicked ? 'border-blue' : ''"
            :color="getColorChipByPriority(item.value)"
            class="w-110 pa-2 rounded-lg"
            label
            @click="getPriority(item.value)"
          >
            <i
              :class="getColorByPriority(item.value)"
              class="app-icon icon-flash"
            ></i>
            <label :class="getColorTextByPriority(item.value)">
              {{ $t(getKeyTextByPriority(item.value)) }}
            </label>
          </v-chip>
        </v-layout>
        <v-divider class="my-4"></v-divider>
      </v-layout>

      <!-- NGUOI TAO -->
      <v-layout v-if="isShowCreatedEl || isShowRequestUnitEl" column>
        <label class="text--body-5 text-uppercase">
          {{ $t("tickets.labels.created") }}
        </label>
        <v-autocomplete
          v-model="formData.createdSelected"
          :filter="filterItems"
          :items="lstCreated"
          :menu-props="{
            bottom: true,
            offsetY: true,
          }"
          :no-data-text="$t('noData')"
          :placeholder="$t('tickets.placeholders.created')"
          chips
          class="text--body-5"
          deletable-chips
          dense
          elevation="0"
          floating
          hide-details
          hide-selected
          item-text="name"
          item-value="id"
          maxlength="50"
          multiple
          outlined
        >
          <vue-feather slot="append" class="grey--text" type="search" />
          <!-- <template v-slot:item="data">
            <div class="select-item flex-column d-flex">
              <div class="title-item">
                <span>{{
                  data.item.objectType === "USER"
                    ? data.item.userFullName
                    : data.item.groupPathName
                }}</span>
                <span class="ml-1 desc-item">
                  (
                  {{
                    data.item.objectType === "USER"
                      ? data.item.username
                      : data.item.groupName
                  }}
                  )
                </span>
              </div>
              <div class="desc-item">
                {{
                  data.item.objectType === "USER" ? data.item.positionName : ""
                }}
              </div>
            </div>
          </template> -->
        </v-autocomplete>
        <v-divider class="my-4"></v-divider>
      </v-layout>

      <!-- NGUOI THUC HIEN -->
      <v-layout v-if="isShowPerformerEl" column>
        <label class="text--body-5 text-uppercase">
          {{ $t("tickets.labels.performer") }}
        </label>
        <v-autocomplete
          v-model="formData.performerSelected"
          :filter="filterItems"
          :items="lstPerformer"
          :label="$t('tickets.placeholders.performer')"
          :menu-props="{
            bottom: true,
            offsetY: true,
          }"
          :no-data-text="$t('noData')"
          :placeholder="$t('tickets.placeholders.performer')"
          chips
          class="text--body-5"
          deletable-chips
          dense
          elevation="0"
          floating
          hide-details
          hide-selected
          item-text="name"
          item-value="id"
          maxlength="50"
          multiple
          outlined
          solo
        >
          <vue-feather slot="append" class="grey--text" type="search" />
          <!-- <template v-slot:item="data">
            <div class="select-item flex-column d-flex">
              <div class="title-item">
                <span>{{
                  data.item.objectType === "USER"
                    ? data.item.userFullName
                    : data.item.groupPathName
                }}</span>
                <span class="ml-1 desc-item">
                  (
                  {{
                    data.item.objectType === "USER"
                      ? data.item.username
                      : data.item.groupName
                  }}
                  )
                </span>
              </div>
              <div class="desc-item">
                {{
                  data.item.objectType === "USER" ? data.item.positionName : ""
                }}
              </div>
            </div>
          </template> -->
        </v-autocomplete>
        <v-divider class="my-4"></v-divider>
      </v-layout>

      <!-- DON VI THUC HIEN -->
      <!-- <v-layout v-if="isShowPerformGroupEl" column>
        <label class="text--body-5 text-uppercase">
          {{ $t("tickets.labels.perform-group") }}
        </label>
        <v-autocomplete
          v-model="formData.performGroupSelected"
          :filter="filterItems"
          :items="lstPerformGroup"
          :label="$t('tickets.placeholders.perform-group')"
          :menu-props="{
            bottom: true,
            offsetY: true,
          }"
          :no-data-text="$t('noData')"
          :placeholder="$t('tickets.placeholders.perform-group')"
          chips
          class="text--body-5"
          deletable-chips
          dense
          elevation="0"
          floating
          hide-details
          hide-selected
          item-text="name"
          item-value="id"
          maxlength="50"
          outlined
          multiple
          solo
        >
          <vue-feather slot="append" class="grey--text" type="search" />
        </v-autocomplete>
        <v-divider class="my-4"></v-divider>
      </v-layout> -->

      <!-- NGUOI THEO DOI -->
      <v-layout v-if="isShowFollowerEl" column>
        <label class="text--body-5 text-uppercase">
          {{ $t("tickets.labels.follower") }}
        </label>
        <v-autocomplete
          v-model="formData.followerSelected"
          :filter="filterItems"
          :items="lstFollower"
          :label="$t('tickets.placeholders.follower')"
          :menu-props="{
            bottom: true,
            offsetY: true,
          }"
          :no-data-text="$t('noData')"
          :placeholder="$t('tickets.placeholders.follower')"
          chips
          class="text--body-5"
          deletable-chips
          dense
          elevation="0"
          floating
          hide-details
          hide-selected
          item-text="fullName"
          item-value="userId"
          maxlength="50"
          multiple
          outlined
          solo
        >
          <vue-feather slot="append" class="grey--text" type="search" />
          <template v-slot:item="data">
            <v-list-item-avatar>
              <v-icon color="primary"> mdi-account-circle </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                v-html="data.item.fullName"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-html="data.item.email"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-layout>
    </v-layout>

    <!-- ACTIONS -->
    <v-layout class="px-6" column>
      <v-divider class="my-4"></v-divider>
      <v-layout class="mt-1 mb-4" justify-space-around>
        <v-btn
          class="w-150 py-5 mr-4 text--button"
          color="primary"
          elevation="0"
          outlined
          rounded
          @click="clearFilter"
        >
          {{ $t("tickets.labels.clear-filter") }}
        </v-btn>
        <v-btn
          class="w-150 py-5 text--button"
          color="primary"
          elevation="0"
          rounded
          @click="onSubmit"
        >
          {{ $t("tickets.labels.apply") }}
        </v-btn>
      </v-layout>
    </v-layout>
  </v-layout>
</template>
<script>
import moment from "moment";
import constants from "@/constants";
import { mapActions } from "vuex";
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import { definedStatus, FORMAT_DATE_TICKET, formatDate, getDateNow, } from "@/modules/ticket/helpers/ticketUtils";
import filterItems from "@/mixins/filterItems.js";
import { TicketService } from "@/modules/ticket/services/ticketService";

// const initFormData = {
//   name: "",
//   status: [],
//   type: null,
//   optionDeadline: null,
//   dateDeadlineFrom: null,
//   dateDeadlineTo: null,
//   createDateFrom: null,
//   createDateTo: null,
//   optionClosed: null,
//   dateClosedFrom: null,
//   dateClosedTo: null,
//   prioritySelected: [],
//   createdSelected: [],
//   performerSelected: [],
//   performGroupSelected: [],
//   followerSelected: [],
// };

export default {
  mixins: [mixinStatusAndPriority, filterItems],
  props: {
    formData: {
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
    isShowTaskCenterEl: {
      type: Boolean,
      default: undefined,
    },
    isShowRequestUnitEl: {
      type: Boolean,
      default: undefined,
    },
    isClearDataSearch: {
      type: Boolean,
      default: undefined,
    },
    isAcceptBtnSearch: {
      type: Boolean,
      default: undefined,
    }
  },
  data() {
    return {
      // status
      lstIndexStatus: [],

      // han thuc hien
      idxActiveOptionDeadline: "",

      formatDate: FORMAT_DATE_TICKET,

      menuDateDeadlineFrom: false,
      dateDeadlineFromFm: null,
      dateDeadlineFrom: null,
      errorDateDeadlinefrom: null,

      menuDateDeadlineTo: false,
      dateDeadlineToFm: null,
      dateDeadlineTo: null,
      errorDateDeadlineTo: null,

      menuCreateDateFrom: false,
      createDateFromFm: null,
      createDateFrom: null,
      errorCreateDateFrom: null,

      menuCreateDateTo: false,
      createDateToFm: null,
      createDateTo: null,
      errorCreateDateTo: null,
      isChooseDate: false,
      idxActiveOptionClosed: "",

      menuDateClosedFrom: false,
      dateClosedFromFm: null,
      dateClosedFrom: null,
      errorDateClosedFrom: null,

      menuDateClosedTo: false,
      dateClosedToFm: null,
      dateClosedTo: null,
      errorDateClosedTo: null,

      deadLineValue: null,
      priorityValue: null,
      statusValue: null,

      lstStatus: [
        { value: definedStatus.processing, isClicked: false },
        { value: definedStatus.waiting_close, isClicked: false },
        { value: definedStatus.closed, isClicked: false },
        { value: definedStatus.forward, isClicked: false },
        { value: definedStatus.result_approve, isClicked: false },
        { value: definedStatus.refuse_close, isClicked: false },
      ],
      lstCreateStatus: [
        { value: definedStatus.processing, isClicked: false },
        { value: definedStatus.waiting_close, isClicked: false },
        { value: definedStatus.closed, isClicked: false },
        { value: definedStatus.forward, isClicked: false },
        { value: definedStatus.result_approve, isClicked: false },
        { value: definedStatus.waiting_review, isClicked: false },
        { value: definedStatus.draft, isClicked: false },
        { value: definedStatus.reject_review, isClicked: false },
        { value: definedStatus.refuse_close, isClicked: false },
        { value: definedStatus.cancelled, isClicked: false },
      ],
      lstApproveStatus: [
        { value: definedStatus.forward, isClicked: false },
        { value: definedStatus.result_approve, isClicked: false },
        { value: definedStatus.waiting_review, isClicked: false },
      ],
      chooseStatus: [],
      // do uu tien
      lstPriority: [
        { value: 1, isClicked: false },
        { value: 2, isClicked: false },
        { value: 3, isClicked: false },
      ],
      lstOptionDeadline: [],
    };
  },
  computed: {
    localDate() {
      return this.$i18n.locale === "vi" ? "vi-VN" : "en-US";
    },
    hasStatus() {
      return typeof this.lstStatus !== "undefined" && this.lstStatus.length > 0;
    },
  },
  watch: {
    isClearDataSearch() {
      this.clearFilter();
      this.onSubmit();
    },
    dateDeadlineFrom(val) {
      if (val) {
        this.dateDeadlineFromFm = this.formatDateView(val);
      }

      // validate dates
      this.createDateFromFm = [];
      if (val.length > 0) {
        val.forEach((item) => {
          const newItem = formatDate(item, constants.FORMAT_DATE_TICKET);
          this.createDateFromFm.push(newItem);
        });
      }
    },
    dateDeadlineTo(val) {
      if (val) {
        this.dateDeadlineToFm = this.formatDateView(val);
      }
    },
    dateDeadlineFromFm() {
      this.errorDateDeadlinefrom = "";
      this.errorDateDeadlineTo = "";
      if (this.dateDeadlineFromFm.length > 0) {
        this.isChooseDate = true;
        this.formData.estimateEndFromDate = this.dateDeadlineFromFm;
        const isValid = moment(
          this.dateDeadlineFromFm,
          constants.FORMAT_DATE_TICKET,
          true
        ).isValid();
        this.errorDateDeadlinefrom = isValid
          ? ""
          : this.$t("task-manager.dateInvalid", { name: this.$t("task-manager.label.dateFrom"), });
        if (isValid) {
          this.dateDeadlineFrom = moment(
            this.dateDeadlineFromFm,
            constants.FORMAT_DATE_TICKET
          ).format(constants.FORMAT_DATE_ISO);
          const selectDate = moment(
            this.dateDeadlineToFm,
            constants.FORMAT_DATE_TICKET
          );
          const timeExprired = moment(
            this.dateDeadlineFromFm,
            constants.FORMAT_DATE_TICKET
          );
          const diff = selectDate.diff(timeExprired, "days");
          this.formData.estimateEndFromDate =
              this.dateDeadlineFromFm &&
              this.dateDeadlineFromFm.replaceAll("/", "");
          this.formData.deadlineTaskTimeType = null;
          this.indexDate = "";
          if (diff < 0) {
            this.errorDateDeadlinefrom = "task-manager.compareDate";
            this.errorDateDeadlineTo = "";
          } else if (diff > 365) {
            this.errorDateDeadlineTo = "";
            this.errorDateDeadlineTo = "task-manager.dateExpire";
          } else {
            this.errorDateDeadlinefrom = "";
            this.errorDateDeadlineTo = "";
          }
        } else {
          this.dateDeadlineFrom = null;
          this.formData.estimateEndFromDate = null;
        }
      } else {
        this.dateDeadlineFrom = null;
        this.formData.estimateEndFromDate = null;
      }
    },
    dateDeadlineToFm() {
      this.errorDateDeadlinefrom = "";
      this.errorDateDeadlineTo = "";
      if (this.dateDeadlineToFm.length > 0) {
        this.isChooseDate = true;
        this.formData.estimateEndToDate = this.dateDeadlineToFm;
        const isValid = moment(
          this.dateDeadlineToFm,
          constants.FORMAT_DATE_TICKET,
          true
        ).isValid();
        this.errorDateDeadlineTo = isValid
          ? ""
          : this.$t("task-manager.dateInvalid", { name: this.$t("task-manager.label.dateTo"), });
        if (isValid) {
          this.dateDeadlineTo = moment(
            this.dateDeadlineToFm,
            constants.FORMAT_DATE_TICKET
          ).format(constants.FORMAT_DATE_ISO);
          const selectDate = moment(
            this.dateDeadlineToFm,
            constants.FORMAT_DATE_TICKET
          );
          const timeExprired = moment(
            this.dateDeadlineFromFm,
            constants.FORMAT_DATE_TICKET
          );
          const diff = selectDate.diff(timeExprired, "days");
          this.formData.estimateEndToDate =
              this.dateDeadlineToFm && this.dateDeadlineToFm.replaceAll("/", "");
          this.formData.deadlineTaskTimeType = null;
          this.indexDate = "";
          if (diff < 0) {
            this.errorDateDeadlineTo = "task-manager.compareDate";
            this.errorDateDeadlinefrom = "";
          } else if (diff > 365) {
            this.errorDateDeadlineTo = "task-manager.dateExpire";
            this.errorDateDeadlinefrom = "";
          } else {
            this.errorDateDeadlineTo = "";
            this.errorDateDeadlinefrom = "";
          }
        } else {
          this.dateDeadlineTo = null;
          this.formData.estimateEndToDate = null;
        }
      } else {
        this.dateDeadlineTo = null;
        this.formData.estimateEndToDate = null;
      }
    },
    createDateFrom(val) {
      if (val) {
        this.createDateFromFm = this.formatDateView(val);
      }
    },
    createDateTo(val) {
      if (val) {
        this.createDateToFm = this.formatDateView(val);
      }
    },
    createDateFromFm() {
      this.errorCreateDateFrom = "";
      this.errorCreateDateTo = "";
      if (this.createDateFromFm.length > 0) {
        this.isChooseDate = true;
        this.formData.estimateEndFromDate = this.createDateFromFm;
        const isValid = moment(
          this.createDateFromFm,
          constants.FORMAT_DATE_TICKET,
          true
        ).isValid();
        this.errorCreateDateFrom = isValid
          ? ""
          : this.$t("task-manager.dateInvalid", { name: this.$t("task-manager.label.dateFrom"), });
        if (isValid) {
          this.createDateFrom = moment(
            this.createDateFromFm,
            constants.FORMAT_DATE_TICKET
          ).format(constants.FORMAT_DATE_ISO);
          const selectDate = moment(
            this.createDateToFm,
            constants.FORMAT_DATE_TICKET
          );
          const timeExprired = moment(
            this.createDateFromFm,
            constants.FORMAT_DATE_TICKET
          );
          const diff = selectDate.diff(timeExprired, "days");
          this.formData.estimateEndFromDate =
              this.createDateFromFm && this.createDateFromFm.replaceAll("/", "");
          this.formData.deadlineTaskTimeType = null;
          this.indexDate = "";
          if (diff < 0) {
            this.errorCreateDateFrom = "task-manager.compareDate";
            this.errorCreateDateTo = "";
          } else if (diff > 365) {
            this.errorCreateDateTo = "";
            this.errorCreateDateTo = "task-manager.dateExpire";
          } else {
            this.errorCreateDateFrom = "";
            this.errorCreateDateTo = "";
          }
        } else {
          this.createDateFrom = null;
          this.formData.estimateEndFromDate = null;
        }
      } else {
        this.createDateFrom = null;
        this.formData.estimateEndFromDate = null;
      }
    },
    createDateToFm() {
      this.errorCreateDateFrom = "";
      this.errorCreateDateTo = "";
      if (this.createDateToFm.length > 0) {
        this.isChooseDate = true;
        this.formData.estimateEndToDate = this.createDateToFm;
        const isValid = moment(
          this.createDateToFm,
          constants.FORMAT_DATE_TICKET,
          true
        ).isValid();
        this.errorCreateDateTo = isValid
          ? ""
          : this.$t("task-manager.dateInvalid", { name: this.$t("task-manager.label.dateTo"), });
        if (isValid) {
          this.createDateTo = moment(
            this.createDateToFm,
            constants.FORMAT_DATE_TICKET
          ).format(constants.FORMAT_DATE_ISO);
          const selectDate = moment(
            this.createDateToFm,
            constants.FORMAT_DATE_TICKET
          );
          const timeExprired = moment(
            this.createDateFromFm,
            constants.FORMAT_DATE_TICKET
          );
          const diff = selectDate.diff(timeExprired, "days");
          this.formData.estimateEndToDate =
              this.createDateToFm && this.createDateToFm.replaceAll("/", "");
          this.formData.deadlineTaskTimeType = null;
          this.indexDate = "";
          if (diff < 0) {
            this.errorCreateDateTo = "task-manager.compareDate";
            this.errorCreateDateFrom = "";
          } else if (diff > 365) {
            this.errorCreateDateTo = "task-manager.dateExpire";
            this.errorCreateDateFrom = "";
          } else {
            this.errorCreateDateTo = "";
            this.errorCreateDateFrom = "";
          }
        } else {
          this.createDateTo = null;
          this.formData.estimateEndToDate = null;
        }
      } else {
        this.createDateTo = null;
        this.formData.estimateEndToDate = null;
      }
    },

    dateClosedFrom(val) {
      if (val) {
        this.dateClosedFromFm = this.formatDateView(val);
      }
    },
    dateClosedTo(val) {
      if (val) {
        this.dateClosedToFm = this.formatDateView(val);
      }
    },
  },
  created() {
    this.getListCompleteTime();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    trimSpace() {
      if (this.formData.name) {
        this.formData.name = this.formData.name.trim();
      }
    },
    async getListCompleteTime() {
      const response = await TicketService.getListCompleteTime();
      response.data.forEach((x) => {
        this.lstOptionDeadline.push({
          name: x.name,
          value: x.value,
          isClicked: false,
        });
      });
    },
    clearFilter() {
      this.lstStatus = this.lstStatus.map((item) => {
        return {
          value: item.value,
          isClicked: false,
        };
      });
      if (
        this.formData.name ||
          this.dateDeadlineFrom ||
          this.dateDeadlineTo ||
          this.createDateFrom ||
          this.createDateTo ||
          this.deadLineValue ||
          this.chooseStatus.length ||
          this.formData.performerSelected ||
          this.formData.performGroupSelected ||
          this.formData.followerSelected ||
          this.formData.type
      ) {
        this.formData = {};
        this.deadLineValue = null;
        this.createDateFromFm = null;
        this.createDateFrom = null;
        this.createDateToFm = null;
        this.createDateTo = null;
        this.dateDeadlineFromFm = null;
        this.dateDeadlineFrom = null;
        this.dateDeadlineToFm = null;
        this.dateDeadlineTo = null;
        this.chooseStatus = [];
        this.lstOptionDeadline = this.lstOptionDeadline.map((item) => {
          return {
            name: item.name,
            value: item.value,
            isClicked: false,
          };
        });
        this.lstPriority = this.lstPriority.map((item) => {
          return {
            value: item.value,
            isClicked: false,
          };
        });
        this.lstCreateStatus = this.lstCreateStatus.map((item) => {
          return {
            value: item.value,
            isClicked: false,
          };
        });
        // this.lstStatus = this.lstStatus.map((item) => {
        //   return {
        //     value: item.value,
        //     isClicked: false,
        //   };
        // });
        this.lstApproveStatus = this.lstApproveStatus.map((item) => {
          return {
            value: item.value,
            isClicked: false,
          };
        });
        this.$emit("clear-search");
      } else {
        this.$emit("close-dialog");
      }
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    onSubmit() {
      this.formData.deadlineFrom = this.dateDeadlineFrom;
      this.formData.deadlineTo = this.dateDeadlineTo;
      this.formData.createDateFrom = this.createDateFrom;
      this.formData.createDateTo = this.createDateTo;
      this.$emit("submit-dialog");
      this.$emit("close-dialog");
    },
    allowedDates(val) {
      return val <= getDateNow();
    },
    formatDateView(date) {
      return formatDate(date, FORMAT_DATE_TICKET);
    },
    getStatus(value) {
      if (!this.isShowCreatedEl) {
        this.lstCreateStatus = this.lstCreateStatus.map((item) => {
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
      } else if (this.isShowCreatedEl && !this.isShowApproveEl) {
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
      } else if (this.isShowApproveEl) {
        this.lstApproveStatus = this.lstApproveStatus.map((item) => {
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
      }
      this.statusValue = null;
      this.$emit("get-status", this.chooseStatus);
    },
    getDeadline(value) {
      this.lstOptionDeadline = this.lstOptionDeadline.map((item) => {
        if (item.value === value) {
          return {
            name: item.name,
            value: item.value,
            isClicked: !item.isClicked,
          };
        } else {
          return {
            name: item.name,
            value: item.value,
            isClicked: false,
          };
        }
      });
      if (this.lstOptionDeadline.filter((x) => x.isClicked === true).length > 0) {
        this.deadLineValue = value;
        this.$emit("get-deadline", value);
      } else {
        this.$emit("get-deadline", null);
      }
    },
    getPriority(value) {
      this.lstPriority = this.lstPriority.map((item) => {
        if (item.value === value) {
          return {
            value: item.value,
            isClicked: true,
          };
        } else {
          return {
            value: item.value,
            isClicked: false,
          };
        }
      });
      this.priorityValue = null;
      this.$emit("get-priority", value);
    },
  },
};
</script>
