<template>
  <div class="col-12 col-md-4">
    <!-- thông tin chung -->
    <label class="text--subtitle font-weight-bold">
      <no-icon no="1" />
      {{ $t("general-info") }}
    </label>
    <!-- ten loai yeu cau -->
    <div class="form-group mt-1">
      <label class="text--body-5 text-uppercase">
        {{ $t("ticket-types.name") }}
        <span>*</span>
      </label>
      <validation-provider
        v-slot="{ errors }"
        name="ticketTypeName"
        :rules="textInputRequired"
      >
        <v-text-field
          v-model="formData.name"
          outlined
          dense
          clearable
          color="#7B8794"
          background-color="white"
          class="unset-mb-error"
          counter
          :maxlength="maximumExText"
          :placeholder="$t('placeholder.ticket-type-name')"
          :error-messages="errors"
        />
      </validation-provider>
    </div>
    <!-- mo ta -->
    <div class="form-group mt-1">
      <label class="text--body-5 text-uppercase">
        {{ $t("description") }}
      </label>
      <validation-provider v-slot="{ errors }" name="ticketDescription">
        <v-text-field
          v-model="formData.description"
          outlined
          dense
          clearable
          color="#7B8794"
          background-color="white"
          class="unset-mb-error"
          counter
          :maxlength="maximumSmallText"
          :placeholder="$t('placeholder.description-plus')"
          :error-messages="errors"
        />
      </validation-provider>
    </div>
    <!-- don vi xu ly -->
    <div class="form-group mt-1">
      <label class="text--body-5 text-uppercase">
        {{ $t("tickets.labels.department-processing") }}
        <span>*</span>
      </label>
      <validation-provider
        v-slot="{ errors }"
        name="ticketGroupId"
        :rules="textInputRequired"
      >
        <v-text-field
          v-model="formData.groupName"
          outlined
          dense
          clearable
          color="#7B8794"
          background-color="white"
          class="unset-mb-error"
          readonly
          :maxlength="maximumSmallText"
          :placeholder="$t('tickets.placeholders.department-processing')"
          :error-messages="errors"
          @click="onShowTreeView"
          @input="onClearableGroup"
        >
          <vue-feather slot="append" class="darken--text" type="search" />
        </v-text-field>
      </validation-provider>
    </div>
    <!-- dong yeu cau -->
    <div class="form-group mt-1">
      <v-layout justify-space-between class="pr-4">
        <label class="text--body-5 text-uppercase">
          {{ $t("close-request") }}
          <span>*</span>
        </label>
        <v-tooltip top max-width="250" class="box-shadow">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="darken"
              small
              v-bind="attrs"
              style="top: -2px"
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <v-layout column>
            <span>
              {{ $t("tooltip-close-request-1") }}
            </span>
            <span>
              <span class="font-weight-bold">
                - {{ $t("close-requests.created") }}:
              </span>
              {{ $t("tooltip-close-request-2") }}
            </span>
            <span>
              <span class="font-weight-bold">
                - {{ $t("close-requests.auto") }}:
              </span>
              {{ $t("tooltip-close-request-3") }}
            </span>
            <!-- <span>
              <span class="font-weight-bold">
                - {{ $t("close-requests.auto-time") }}:
              </span>
              {{ $t("tooltip-close-request-4") }}
            </span> -->
          </v-layout>
        </v-tooltip>
      </v-layout>
      <v-select
        v-model="formData.closeDurationType"
        dense
        outlined
        color="#7B8794"
        background-color="white"
        class="unset-mb-error"
        :menu-props="{
          bottom: true,
          offsetY: true,
        }"
        :placeholder="$t('placeholder.close-request')"
        item-text="name"
        item-value="value"
        :items="closeDurationTypes"
        @change="updateCloseDurationType"
      >
        <template v-slot:append>
          <v-icon color="darken">mdi-chevron-down</v-icon>
        </template>
      </v-select>
    </div>
    <!-- tu dong sau -->
    <!-- <div v-if="isShowSelfCloseTimeEL" class="form-group mt-1">
      <v-layout justify-space-between class="pr-4">
        <label class="text--body-5 text-uppercase mb-1">
          {{ $t("self-close-after") }}
        </label>
        <v-tooltip top max-width="250" class="box-shadow">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="darken"
              small
              v-bind="attrs"
              style="top: -2px"
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>
            {{ $t("tickets.tooltips.auto-close") }}
          </span>
        </v-tooltip>
      </v-layout>
      <validation-provider v-slot="{ errors }">
        <v-text-field
          v-model="formData.closeDuration"
          outlined
          dense
          color="#7B8794"
          background-color="white"
          class="unset-mb-error"
          pattern="\d*"
          :maxlength="maximumHourNumber"
          :suffix="$t('hour')"
          :placeholder="$t('placeholder.time')"
          :error-messages="errors"
          @keypress="isNumber($event)"
          @paste.prevent="onPasteCloseDuration($event)"
        />
      </validation-provider>
    </div> -->
    <!-- chon phe duyet khi -->
    <div v-if="isShowSelectApproveEl" class="form-group mt-1">
      <v-layout justify-space-between class="pr-4">
        <label class="text--body-5 text-uppercase mb-1">
          {{ $t("select-approve") }}
        </label>
        <v-tooltip top max-width="250" class="box-shadow">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="darken"
              small
              v-bind="attrs"
              style="top: -2px"
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <v-layout column>
            <span> {{ $t("tickets.tooltips.approval-configuration") }}: </span>
            <span>
              <span class="font-weight-bold"> - {{ $t("create-new") }}:</span>
              {{ $t("tickets.tooltips.approval-create-new") }}
            </span>
            <span>
              <span class="font-weight-bold">
                - {{ $t("move-department") }}:
              </span>
              {{ $t("tickets.tooltips.approval-move-department") }}
            </span>
            <span>
              <span class="font-weight-bold"> - {{ $t("completed") }}:</span>
              {{ $t("tickets.tooltips.approval-completed") }}
            </span>
          </v-layout>
        </v-tooltip>
      </v-layout>
      <v-container fluid>
        <v-row>
          <v-col cols="3" class="pa-0">
            <v-layout justify-center align-center>
              <v-spacer />
              <v-checkbox
                v-model="formData.sendFlag"
                hide-details
                class="mt-0 pt-0 unset-mr-check"
              />
              <v-divider />
            </v-layout>
          </v-col>
          <v-col cols="6" class="pa-0">
            <v-layout justify-center align-center>
              <v-divider />
              <v-checkbox
                v-model="formData.forwardFlag"
                hide-details
                class="mt-0 pt-0 unset-mr-check"
              />
              <v-divider />
            </v-layout>
          </v-col>
          <v-col cols="3" class="pa-0">
            <v-layout justify-center align-center>
              <v-divider />
              <v-checkbox
                v-model="formData.finishFlag"
                hide-details
                class="mt-0 pt-0 unset-mr-check"
              />
              <v-spacer />
            </v-layout>
          </v-col>
        </v-row>
        <v-row class="light--text">
          <v-col cols="3" class="px-0">
            <v-layout justify-center>{{ $t("create-new") }}</v-layout>
          </v-col>
          <v-col cols="6" class="px-0">
            <v-layout justify-center>{{ $t("move-department") }}</v-layout>
          </v-col>
          <v-col cols="3" class="px-0">
            <v-layout justify-center>{{ $t("completed") }}</v-layout>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!-- thoi han tiep nhan -->
    <!-- <div v-if="isShowEstDurationEl" class="form-group mt-1">
      <v-layout justify-space-between class="pr-4">
        <label class="text--body-5 text-uppercase">
          {{ $t('receipt-deadline') }}
        </label>
        <v-tooltip top max-width="250" class="box-shadow">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="darken"
              small
              v-bind="attrs"
              style="top: -2px"
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>
            {{ $t('') }}
          </span>
        </v-tooltip>
      </v-layout>
      <validation-provider
        v-slot="{ errors }"
        name="ticketDescription"
        :rules="textInputRequired"
      >
        <v-text-field
          v-model="formData.receiveDuration"
          outlined
          dense
          color="#7B8794"
          background-color="white"
          class="unset-mb-error"
          pattern="\d*"
          :maxlength="maximumHourNumber"
          :suffix="$t('hour')"
          :placeholder="$t('placeholder.time')"
          :error-messages="errors"
          @keypress="isNumber($event)"
        />
      </validation-provider>
    </div> -->

    <!-- thoi han thuc hien -->
    <div v-if="isShowEstDurationEl" class="form-group mt-1">
      <v-layout justify-space-between class="pr-4">
        <label class="text--body-5 text-uppercase">
          {{ $t("time-limit") }}
        </label>
        <v-tooltip top max-width="250" class="box-shadow">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="darken"
              small
              v-bind="attrs"
              style="top: -2px"
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>
            {{ $t("tickets.tooltips.time-limit") }}
          </span>
        </v-tooltip>
      </v-layout>
      <validation-provider v-slot="{ errors }" name="estDuration">
        <v-text-field
          v-model="formData.estDuration"
          outlined
          dense
          color="#7B8794"
          background-color="white"
          class="unset-mb-error"
          pattern="\d*"
          :maxlength="maximumHourNumber"
          :suffix="$t('hour')"
          :placeholder="$t('placeholder.time')"
          :error-messages="errors"
          @keypress="isNumber($event)"
          @paste.prevent="onPasteEstDuration($event)"
        />
      </validation-provider>
    </div>
    <!-- hinh thuc giao ca nhan thuc hien -->
    <div v-if="isShowAssignToMethodEl" class="form-group mt-1">
      <v-layout justify-space-between class="pr-4">
        <label class="text--body-5 text-uppercase">
          {{ $t("personal-assignment") }}
        </label>
        <v-tooltip top max-width="250" class="box-shadow">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="darken"
              small
              v-bind="attrs"
              style="top: -2px"
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>
            {{ $t("tickets.tooltips.personal-assignment") }}
          </span>
        </v-tooltip>
      </v-layout>
      <v-select
        dense
        outlined
        color="#7B8794"
        background-color="white"
        class="unset-mb-error"
        :menu-props="{
          bottom: true,
          offsetY: true,
        }"
        :placeholder="$t('placeholder.personal-assignment')"
        item-text="name"
        item-value="value"
        :items="assignToMethods"
        @change="updateAssignToMethod"
      >
        <template v-slot:append>
          <v-icon color="darken">mdi-chevron-down</v-icon>
        </template>
      </v-select>
    </div>
    <!-- phan quyen xem quy trinh -->
    <div v-if="isShowPermissionViewEl" class="form-group mt-1">
      <v-layout justify-space-between class="pr-4">
        <label class="text--body-5 text-uppercase">
          {{ $t("permission-view-process") }}
        </label>
        <v-tooltip top max-width="250" class="box-shadow">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="darken"
              small
              v-bind="attrs"
              style="top: -2px"
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>
            {{ $t("") }}
          </span>
        </v-tooltip>
      </v-layout>
      <v-select
        dense
        outlined
        color="#7B8794"
        background-color="white"
        class="unset-mb-error"
        :menu-props="{
          bottom: true,
          offsetY: true,
        }"
        :placeholder="$t('placeholder.permission-view-process')"
        item-text="name"
        item-value="value"
        :items="viewPermissions"
        @change="updateViewPermission"
      >
        <template v-slot:append>
          <v-icon color="darken">mdi-chevron-down</v-icon>
        </template>
      </v-select>
    </div>
  </div>
</template>

<script>
// Libs
import { mapActions } from "vuex";
import rules from "@/mixins/rules";
import filterItems from "@/mixins/filterItems";
import constants from "@/constants";

// Components
import NoIcon from "./NoIcon.vue";

// Services
import { CategoryService } from "@/modules/ticket/services/categoryService";

// utils
import { FormUtils } from "@/helpers/formUtils";
import { formatNumber } from "@/modules/ticket/helpers/ticketUtils";

export default {
  components: { NoIcon },
  mixins: [rules, filterItems],
  props: {
    formData: {
      type: Object,
      default: undefined,
    },
    isShowSelectApproveEl: {
      type: Boolean,
      default: false,
    },
    isShowEstDurationEl: {
      type: Boolean,
      default: false,
    },
    isShowAssignToMethodEl: {
      type: Boolean,
      default: false,
    },
    isShowPermissionViewEl: {
      type: Boolean,
      default: false,
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      maximumExText: constants.MAXIMUM_EX_TEXT,
      maximumSmallText: constants.MAXIMUM_SMALL_TEXT,
      maximumHourNumber: constants.MAXIMUN_HOUR_NUMBER,

      closeDurationTypes: [],
      assignToMethods: [],
      viewPermissions: [],
      isShowSelfCloseTimeEL: false,
    };
  },
  computed: {},
  watch: {
    isUpdate(val) {
      if (val) {
        this.updateCloseDurationType(this.formData.closeDurationType);
      }
    },
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    updateCloseDurationType(val) {
      if (val === 2) {
        this.isShowSelfCloseTimeEL = true;
      } else {
        this.isShowSelfCloseTimeEL = false;
      }
    },
    updateAssignToMethod(val) {
      console.log(val);
    },
    updateViewPermission(val) {
      console.log(val);
    },
    initData() {
      this.getCloseDurationType();
    },
    async getCloseDurationType() {
      const results = await CategoryService.getCloseDurationType();
      if (results) {
        this.closeDurationTypes = results.data;
      } else {
        this.closeDurationTypes = [];
      }
    },
    onShowTreeView() {
      this.$emit("show-dialog-tree-view");
    },
    onClearableGroup(val) {
      if (!val) {
        this.formData.groupId = null;
      }
    },
    isNumber(evt) {
      return FormUtils.isNumber(evt);
    },
    onPasteCloseDuration(evt) {
      const val = FormUtils.isOnPasteOnlyNumberAndMaximum(
        evt,
        this.maximumHourNumber
      );
      if (val !== null) {
        this.formData.closeDuration = formatNumber(val);
      }
    },
    onPasteEstDuration(evt) {
      const val = FormUtils.isOnPasteOnlyNumberAndMaximum(
        evt,
        this.maximumHourNumber
      );
      if (val !== null) {
        this.formData.estDuration = formatNumber(val);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
