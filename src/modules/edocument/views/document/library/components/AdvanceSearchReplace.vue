<template>
  <div class="py-4 pb-0">
    <v-row class="ma-0">
      <!-- Loai van ban -->
      <v-col cols="3" class="pa-0 pr-6">
        <span class="text--label edoc-text--body-4">
          {{ $t("docType2") }}
        </span>
        <v-select
          v-model="formdata.docType"
          :items="lstTypeDoc"
          :item-text="(item) => $t(item.name)"
          item-value="code"
          outlined
          attach
          dense
          :menu-props="{
            bottom: true,
            offsetY: true,
            maxHeight: 220,
          }"
          class="edoc-text--body-4"
          @change="onchangedTypeDoc"
        />
      </v-col>

      <!-- Hinh thuc van ban -->
      <v-col cols="3" class="pa-0 px-3">
        <span class="text--label edoc-text--body-4">
          {{ $t("docType") }}
        </span>
        <v-autocomplete
          v-model="formdata.formulaTypeId"
          :no-data-text="$t('noData')"
          :placeholder="$t('selectDocType')"
          outlined
          attach
          dense
          required
          :filter="filterItems"
          maxlength="255"
          :menu-props="{
            bottom: true,
            offsetY: true,
            maxHeight: 220,
          }"
          :items="lstFormulaType"
          :item-text="(item) => $t(item.name)"
          item-value="id"
          class="edoc-text--body-4"
          @change="onchangedFormulaType"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
        </v-autocomplete>
      </v-col>

      <!-- Don vi ban hanh -->
      <v-col cols="3" class="pa-0 list-signer px-3">
        <label class="text--label edoc-text--body-4">
          {{ $t("proclaimGroup") }}
        </label>

        <v-text-field
          v-model="promulgateGroupName"
          outlined
          maxlength="255"
          dense
          :placeholder="$t('managementDoc.placeholder.groupName')"
          class="edoc-text--body-4"
          @input="onInputSearchGroup"
          @blur="closeFilterGroup"
          @keyup.enter="searchDocumentByGroup()"
          @click="selectPromulgateGroup()"
          @change="promulgateGroupName = trimSpace(promulgateGroupName)"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
        </v-text-field>
        <div v-show="showFilterGroup" class="wrap-list-search">
          <v-list dense>
            <v-list-item-group v-model="selectedGroup" color="primary">
              <v-list-item
                v-for="(group, idx) in lstGroup"
                :key="idx"
                two-line
                class="py-0"
              >
                <v-list-item-content class="py-0">
                  <v-list-item-title>{{ group.groupName }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t(genGroupName(group)) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-col>

      <!-- Nguoi ky -->
      <v-col cols="3" class="pa-0 list-signer pl-6">
        <label class="text--label edoc-text--body-4">
          {{ $t("contract.signer") }}
        </label>

        <v-text-field
          v-model="keyword"
          outlined
          maxlength="255"
          dense
          :placeholder="$t('managementDoc.placeholder.signerName')"
          class="edoc-text--body-4"
          @input="onInputSearchCustomer"
          @blur="closeFilterCustomer"
          @keyup.enter="searchDocumentBySigner()"
          @click="selectSigner()"
          @change="keyword = trimSpace(keyword)"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
        </v-text-field>
        <div v-show="showFilterCustomer" class="wrap-list-search">
          <v-list dense>
            <v-list-item-group v-model="selectedCustomer" color="primary">
              <v-list-item
                v-for="(user, idx) in lstSigner"
                :key="idx"
                two-line
                class="py-0"
              >
                <v-list-item-content class="py-0">
                  <v-list-item-title>{{ user.fullName }}
                    <small>({{ user.userName }})</small>
                  </v-list-item-title>
                  <v-list-item-subtitle v-html="genEmail(user)" />
                  <v-list-item-subtitle>
                    {{ user.groupPathName }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-col>
    </v-row>

    <v-row class="ma-0">
      <!-- Ngay ban hanh -->
      <v-col cols="3" class="pa-0 pr-6">
        <span class="text--label edoc-text--body-4">
          {{ $t("dateProclaim") }}
        </span>

        <v-menu
          v-model="menuDateProclaimFrom"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateProclaimFromValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              :error-messages="$t(errorDateProclaimFrom)"
              class="edoc-text--body-4"
              v-on="on"
              @click:append="menuDateProclaimFrom = !menuDateProclaimFrom"
            />
          </template>
          <v-date-picker
            v-model="dateProclaimFromPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="menuDateProclaimFrom = false"
          />
        </v-menu>
      </v-col>

      <!-- Den ngay -->
      <v-col cols="3" class="pa-0 px-3">
        <span class="text--label edoc-text--body-4">
          {{ $t("contract-manager.labels.dateTo") }}
        </span>

        <v-menu
          v-model="menuDateProclaimTo"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateProclaimToValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              :error-messages="$t(errorDateProclaimTo)"
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              class="edoc-text--body-4"
              v-on="on"
              @click:append="menuDateProclaimTo = !menuDateProclaimTo"
            />
          </template>
          <v-date-picker
            v-model="dateProclaimToPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="menuDateProclaimTo = false"
          />
        </v-menu>
      </v-col>

      <!-- Ngay luu thu vien tu -->
      <v-col cols="3" class="pa-0 px-3">
        <span class="text--label edoc-text--body-4">
          {{ $t("dateSaveLib") }}
        </span>

        <v-menu
          v-model="menuDateSaveLibFrom"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateSaveLibFromValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              :error-messages="$t(errorDateSaveLibFrom)"
              class="edoc-text--body-4"
              v-on="on"
              @click:append="menuDateSaveLibFrom = !menuDateSaveLibFrom"
            />
          </template>
          <v-date-picker
            v-model="dateSaveLibFromPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="menuDateSaveLibFrom = false"
          />
        </v-menu>
      </v-col>

      <!-- Den ngay -->
      <v-col cols="3" class="pa-0 pl-6">
        <span class="text--label edoc-text--body-4">
          {{ $t("contract-manager.labels.dateTo") }}
        </span>

        <v-menu
          v-model="menuDateSaveLibTo"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateSaveLibToValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              :error-messages="$t(errorDateSaveLibTo)"
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              class="edoc-text--body-4"
              v-on="on"
              @click:append="menuDateSaveLibTo = !menuDateSaveLibTo"
            />
          </template>
          <v-date-picker
            v-model="dateSaveLibToPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="menuDateSaveLibTo = false"
          />
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import filterItems from "@/mixins/filterItems.js";
import moment from "moment";
import { DocumentService } from "@/modules/edocument/services/documentService.js";
import constants from "@/constants";

export default {
  name: "AdvanceSearchReplace",

  mixins: [filterItems],

  props: {
    formdata: {
      type: Object,
      default: undefined,
    },
    searchDocument: {
      type: Function,
      default: undefined,
    },
    showAdvance: {
      type: Boolean,
      default: undefined,
    },
  },

  data() {
    return {
      // List loai van ban.
      lstTypeDoc: [],

      // List hinh thuc van ban.
      lstFormulaType: [],

      // List don vi ban hanh.
      lstGroup: [],

      // List nguoi ky.
      lstSigner: [],

      promulgateGroupName: null,
      tempGroup: null,
      selectedGroup: null,
      showFilterGroup: false,
      keyword: null,

      tempCustomer: null,
      selectedCustomer: null,
      showFilterCustomer: false,
      keywordTemp: null,
      promulgateGroupNameTemp: null,

      // Date proclaim from.
      menuDateProclaimFrom: null,
      errorDateProclaimFrom: null,
      dateProclaimFromPicker: null,
      dateProclaimFromValue: null,

      // Date proclaim to.
      menuDateProclaimTo: null,
      errorDateProclaimTo: null,
      dateProclaimToPicker: null,
      dateProclaimToValue: null,

      // Date save lib from.
      menuDateSaveLibFrom: null,
      errorDateSaveLibFrom: null,
      dateSaveLibFromPicker: null,
      dateSaveLibFromValue: null,

      // Date save lib to.
      menuDateSaveLibTo: null,
      errorDateSaveLibTo: null,
      dateSaveLibToPicker: null,
      dateSaveLibToValue: null,
    };
  },

  computed: {
    localDate() {
      return this.$i18n.locale === "vi" ? "vi-VN" : "en-US";
    },
  },

  watch: {
    showAdvance() {
      if (!this.showAdvance) {
        this.formdata.proclaimFromDate = null;
        this.formdata.proclaimToDate = null;
        this.formdata.docType = null;
        this.formdata.formulaTypeId = null;
        this.formdata.promulgateFromDate = null;
        this.formdata.promulgateToDate = null;
        this.formdata.promulgateGroupId = null;
        this.formdata.promulgateGroupName = null;
        this.formdata.signerId = null;
        this.formdata.signerInfo = null;
        this.dateSaveLibFromValue = null;
        this.dateSaveLibToValue = null;
        this.dateProclaimFromValue = null;
        this.dateProclaimToValue = null;
        this.keyword = null;
        this.keywordTemp = null;
        this.promulgateGroupName = null;
        this.searchDocument();
      }
    },

    // don vi ban hanh
    promulgateGroupName() {
      if (this.showAdvance) {
        this.formdata.promulgateGroupName = this.promulgateGroupName.trim();
      }
    },

    // chon don vi
    async selectedGroup() {
      if (this.selectedGroup == null) {
        return;
      }
      var item = this.lstGroup[this.selectedGroup];
      if (item) {
        this.tempGroup = item;
      }
      this.promulgateGroupName = this.tempGroup.groupName;
      this.formdata.promulgateGroupId = this.tempGroup.groupId;
      this.formdata.promulgateGroupName = null;
      await this.searchDocument();
    },

    // chon nguoi ky
    async selectedCustomer() {
      if (this.selectedCustomer == null) {
        return;
      }
      var item = this.lstSigner[this.selectedCustomer];
      if (item) {
        this.tempCustomer = item;
      }
      this.keyword = this.tempCustomer.fullName;
      this.formdata.signerId = this.tempCustomer.userId;
      this.formdata.signerInfo = null;
      await this.searchDocument();
    },

    keyword() {
      if (this.showAdvance) {
        this.formdata.signerInfo = this.keyword.trim();
      }
    },

    // Date proclaim.
    dateProclaimFromPicker(date) {
      if (date) this.dateProclaimFromValue = this.formatDate(date);
    },

    dateProclaimToPicker(date) {
      if (date) this.dateProclaimToValue = this.formatDate(date);
    },

    dateProclaimFromValue() {
      this.errorDateProclaimFrom = "";
      if (this.dateProclaimFromValue) {
        this.validateFromDateProc();
        if (this.dateProclaimToValue) {
          this.validateToDateProc();
        }

        if (!this.errorDateProclaimFrom && !this.errorDateProclaimTo) {
          this.$emit(
            "submission-date-promulgate-from-change",
            this.dateProclaimFromValue
          );
        }
      } else {
        if (!moment(this.dateProclaimToValue, "DD/MM/YYYY", true).isValid()) {
          if (this.dateProclaimToValue) {
            this.errorDateProclaimTo = this.$t("messError.dateProclaimInvalid");
            return;
          }
        } else {
          this.errorDateProclaimTo = "";
        }
        this.errorDateProclaimFrom = "";
        this.formdata.promulgateFromDate = null;
        this.dateProclaimFromPicker = null;
        if (this.showAdvance && !this.errorDateFrom && !this.errorDateTo) {
          this.searchDocument();
        }
      }
    },

    dateProclaimToValue() {
      if (this.dateProclaimToValue) {
        if (this.dateProclaimFromValue) {
          this.validateFromDateProc();
        }
        this.validateToDateProc();
        if (!this.errorDateProclaimFrom && !this.errorDateProclaimTo) {
          this.$emit(
            "submission-date-promulgate-to-change",
            this.dateProclaimToValue
          );
        }
      } else {
        if (!moment(this.dateProclaimFromValue, "DD/MM/YYYY", true).isValid()) {
          if (this.dateProclaimFromValue) {
            this.errorDateProclaimFrom = this.$t(
              "messError.dateProclaimInvalid"
            );
            return;
          }
        } else {
          this.errorDateProclaimFrom = "";
        }
        this.errorDateProclaimTo = "";
        this.formdata.promulgateToDate = null;
        this.dateProclaimToPicker = null;
        if (this.showAdvance && !this.errorDateFrom && !this.errorDateTo) {
          this.searchDocument();
        }
      }
    },

    // Date save library.
    dateSaveLibFromPicker(date) {
      if (date) this.dateSaveLibFromValue = this.formatDate(date);
    },

    dateSaveLibToPicker(date) {
      if (date) this.dateSaveLibToValue = this.formatDate(date);
    },

    dateSaveLibFromValue() {
      this.errorDateSaveLibFrom = "";
      if (this.dateSaveLibFromValue) {
        this.validateFromDateSaveLib();
        if (this.dateSaveLibToValue) {
          this.validateToDateSaveLib();
        }

        if (!this.errorDateSaveLibFrom && !this.errorDateSaveLibTo) {
          this.$emit(
            "submission-date-proclaim-from-change",
            this.dateSaveLibFromValue
          );
        }
      } else {
        if (!moment(this.dateSaveLibToValue, "DD/MM/YYYY", true).isValid()) {
          if (this.dateSaveLibToValue) {
            this.errorDateSaveLibTo = this.$t("messError.dateProclaimInvalid");
            return;
          }
        } else {
          this.errorDateSaveLibTo = "";
        }
        this.errorDateSaveLibFrom = "";
        this.formdata.proclaimFromDate = null;
        this.dateSaveLibFromPicker = null;
        if (
          this.showAdvance &&
          !this.errorDateSaveLibFrom &&
          !this.errorDateSaveLibTo
        ) {
          this.searchDocument();
        }
      }
    },

    dateSaveLibToValue() {
      if (this.dateSaveLibToValue) {
        if (this.dateSaveLibFromValue) {
          this.validateFromDateSaveLib();
        }
        this.validateToDateSaveLib();
        if (!this.errorDateSaveLibFrom && !this.errorDateSaveLibTo) {
          this.$emit(
            "submission-date-proclaim-to-change",
            this.dateSaveLibToValue
          );
        }
      } else {
        if (!moment(this.dateSaveLibFromValue, "DD/MM/YYYY", true).isValid()) {
          if (this.dateSaveLibFromValue) {
            this.errorDateSaveLibFrom = this.$t(
              "messError.dateProclaimInvalid"
            );
            return;
          }
        } else {
          this.errorDateSaveLibFrom = "";
        }
        this.errorDateSaveLibTo = "";
        this.formdata.proclaimToDate = null;
        this.dateSaveLibToPicker = null;
        if (
          this.showAdvance &&
          !this.errorDateSaveLibFrom &&
          !this.errorDateSaveLibTo
        ) {
          this.searchDocument();
        }
      }
    },
  },

  async mounted() {
    await Promise.all([this.getDocType(), this.getDocFormula()]);
  },

  methods: {
    trimSpace(val) {
      return val ? val.trim() : "";
    },

    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },

    async getDocType() {
      try {
        const response = await DocumentService.getDocType();
        this.lstTypeDoc = response.data;
        if (this.lstTypeDoc) {
          this.lstTypeDoc.unshift({ name: "all", code: null });
        }
      } catch (error) {
        console.log(error);
      }
    },

    onchangedTypeDoc(val) {
      this.searchDocument();
    },

    async getDocFormula() {
      try {
        const response = await DocumentService.getDocFormula();
        this.lstFormulaType = response.data;
        if (this.lstFormulaType) {
          this.lstFormulaType.unshift({ name: "all", id: null });
        }
      } catch (error) {
        console.log(error);
      }
    },

    onchangedFormulaType(value) {
      this.searchDocument();
    },

    // tim kiem don vi ban hanh
    async searchGroup(status) {
      if (
        this.promulgateGroupName &&
        this.promulgateGroupName.trim() === this.promulgateGroupNameTemp
      ) {
        return;
      }
      const keyword =
        this.promulgateGroupName && this.promulgateGroupName.trim();
      this.promulgateGroupNameTemp = keyword;
      const params = {
        groupName: keyword,
        pageSize: 1000000,
        restrictHierarchy: "false",
      };
      const response = await DocumentService.search(params);
      if (response.success) {
        this.lstGroup = response.data ? response.data.data : [];
        this.showFilterGroup = this.lstGroup.length > 0;
      } else {
        console.log(response.messages);
      }
    },

    // tim kiem nguoi kys
    async searchCustomer(status) {
      if (this.keyword && this.keyword.trim() === this.keywordTemp) {
        return;
      }
      const keyword = this.keyword && this.keyword.trim();
      this.keywordTemp = keyword;
      const params = {
        keyword: keyword,
        searchAllRoles: 'false',
        restrictHierarchy: true,
      };
      const response = await DocumentService.searchSignerDocumentBook(params);
      if (response.success) {
        this.lstSigner = response.data ? response.data : [];
        this.showFilterCustomer = this.lstSigner.length > 0;
      } else {
        console.log(response.messages);
      }
    },

    // bat su kien nhap don vi ban hanh
    onInputSearchGroup() {
      this.formdata.promulgateGroupId = null;
      this.selectedGroup = null;
      setTimeout(() => {
        this.searchGroup(false);
      }, 200);
    },

    // don popup don vi ban hanh
    async closeFilterGroup() {
      setTimeout(() => {
        this.showFilterGroup = false;
      }, 200);
    },

    // don vi ban hanh
    async searchDocumentByGroup() {
      this.formdata.promulgateGroupId = null;
      this.formdata.promulgateGroupName = this.promulgateGroupName.trim();
      this.promulgateGroupName = this.promulgateGroupName.trim();
      await this.searchDocument();
      this.showFilterGroup = false;
    },

    selectPromulgateGroup() {
      this.promulgateGroupNameTemp = null;
      this.searchGroup();
    },

    genGroupName(group) {
      let groupName = "group.partnerLabel";
      if (group.groupType === constants.GROUPS.INTERNAL) {
        groupName = group.parentPathName;
      }
      return groupName;
    },

    // bat su kien nhap input nguoi ky
    onInputSearchCustomer() {
      this.formdata.signerId = null;
      this.selectedCustomer = null;
      setTimeout(() => {
        this.searchCustomer(false);
      }, 200);
    },

    // dong popup danh sach nguoi ky
    async closeFilterCustomer() {
      setTimeout(() => {
        this.showFilterCustomer = false;
      }, 200);
    },

    // enter tim kiem document theo nguoi ky
    async searchDocumentBySigner() {
      this.formdata.signerId = null;
      this.formdata.signerInfo = this.keyword.trim();
      this.keyword = this.keyword.trim();
      await this.searchDocument();
      this.showFilterCustomer = false;
    },

    selectSigner() {
      this.keywordTemp = null;
      this.searchCustomer();
    },

    // gen email va so dien thoai
    genEmail(user) {
      if (user.phone) {
        return `${user.email} - ${user.phone}`;
      }
      return user.email;
    },

    validateFromDateProc() {
      let isValid = true;
      if (!moment(this.dateProclaimFromValue, "DD/MM/YYYY", true).isValid()) {
        this.formdata.promulgateFromDate = this.dateProclaimFromValue;
        this.errorDateProclaimFrom = this.$t("messError.dateProclaimInvalid");
        isValid = false;
        this.dateProclaimFromPicker = "";
      }
      if (isValid) {
        this.formdata.promulgateFromDate =
          this.dateProclaimFromValue.replaceAll("/", "");
        this.dateProclaimFromPicker = moment(
          this.dateProclaimFromValue,
          "DD/MM/YYYY"
        ).format("YYYY-MM-DD");
        const selectDate = moment(this.dateProclaimToValue, "DD/MM/YYYY");
        const timeExpired = moment(this.dateProclaimFromValue, "DD/MM/YYYY");
        const diff = selectDate.diff(timeExpired, "days");

        if (!moment(this.dateProclaimToValue, "DD/MM/YYYY", true).isValid()) {
          if (this.dateProclaimToValue) {
            this.errorDateProclaimTo = this.$t("messError.dateProclaimInvalid");
            return;
          }
        }

        if (diff < 0) {
          this.errorDateProclaimTo = "messError.compareDate";
          this.dateProclaimFromPicker = "";
          this.formdata.promulgateFromDate = "false";
          return;
        }
        this.errorDateProclaimFrom = "";
        this.errorDateProclaimTo = "";

        if (this.dateProclaimToPicker) this.errorDateProclaimTo = "";
      }
    },

    validateToDateProc() {
      let isValid = true;
      if (!moment(this.dateProclaimToValue, "DD/MM/YYYY", true).isValid()) {
        this.formdata.promulgateToDate = this.dateProclaimToValue;
        this.errorDateProclaimTo = this.$t("messError.dateProclaimInvalid");
        isValid = false;
        this.dateProclaimToPicker = "";
      }
      if (isValid) {
        this.formdata.promulgateToDate = this.dateProclaimToValue.replaceAll(
          "/",
          ""
        );
        this.dateProclaimToPicker = moment(
          this.dateProclaimToValue,
          "DD/MM/YYYY"
        ).format("YYYY-MM-DD");
        const selectDate = moment(this.dateProclaimToValue, "DD/MM/YYYY");
        const timeExpired = moment(this.dateProclaimFromValue, "DD/MM/YYYY");
        const diff = selectDate.diff(timeExpired, "days");
        this.errorDateProclaimTo = "";

        if (!moment(this.dateProclaimFromValue, "DD/MM/YYYY", true).isValid()) {
          if (this.dateProclaimFromValue) {
            this.errorDateProclaimFrom = this.$t(
              "messError.dateProclaimInvalid"
            );
            return;
          }
        }

        if (diff < 0) {
          this.errorDateProclaimTo = "messError.compareDate";
          this.dateProclaimToPicker = "";
          this.formdata.promulgateToDate = "false";
          return;
        }

        if (this.dateProclaimFromPicker) this.errorDateProclaimFrom = "";
      }
    },

    validateFromDateSaveLib() {
      let isValid = true;
      if (!moment(this.dateSaveLibFromValue, "DD/MM/YYYY", true).isValid()) {
        this.formdata.proclaimFromDate = this.dateSaveLibFromValue;
        this.errorDateSaveLibFrom = this.$t("errorDateSaveLib");
        isValid = false;
        this.dateSaveLibFromPicker = "";
      }
      if (isValid) {
        this.formdata.proclaimFromDate = this.dateSaveLibFromValue.replaceAll(
          "/",
          ""
        );
        this.dateSaveLibFromPicker = moment(
          this.dateSaveLibFromValue,
          "DD/MM/YYYY"
        ).format("YYYY-MM-DD");
        const selectDate = moment(this.dateSaveLibToValue, "DD/MM/YYYY");
        const timeExpired = moment(this.dateSaveLibFromValue, "DD/MM/YYYY");
        const diff = selectDate.diff(timeExpired, "days");

        if (!moment(this.dateSaveLibToValue, "DD/MM/YYYY", true).isValid()) {
          if (this.dateSaveLibToValue) {
            this.errorDateSaveLibTo = this.$t("errorDateSaveLib");
            return;
          }
        }

        if (diff < 0) {
          this.errorDateSaveLibTo = "messError.compareDate";
          this.dateSaveLibFromPicker = "";
          this.formdata.proclaimFromDate = "false";
          return;
        }
        this.errorDateSaveLibFrom = "";
        this.errorDateSaveLibTo = "";

        if (this.dateSaveLibToPicker) this.errorDateSaveLibTo = "";
      }
    },

    validateToDateSaveLib() {
      let isValid = true;
      if (!moment(this.dateSaveLibToValue, "DD/MM/YYYY", true).isValid()) {
        this.formdata.proclaimToDate = this.dateSaveLibToValue;
        this.errorDateSaveLibTo = this.$t("errorDateSaveLib");
        isValid = false;
        this.dateSaveLibToPicker = "";
      }
      if (isValid) {
        this.formdata.proclaimToDate = this.dateSaveLibToValue.replaceAll(
          "/",
          ""
        );
        this.dateSaveLibToPicker = moment(
          this.dateSaveLibToValue,
          "DD/MM/YYYY"
        ).format("YYYY-MM-DD");
        const selectDate = moment(this.dateSaveLibToValue, "DD/MM/YYYY");
        const timeExpired = moment(this.dateSaveLibFromValue, "DD/MM/YYYY");
        const diff = selectDate.diff(timeExpired, "days");
        this.errorDateSaveLibTo = "";

        if (!moment(this.dateSaveLibFromValue, "DD/MM/YYYY", true).isValid()) {
          if (this.dateSaveLibFromValue) {
            this.errorDateSaveLibFrom = this.$t("errorDateSaveLib");
            return;
          }
        }

        if (diff < 0) {
          this.errorDateSaveLibTo = "messError.compareDate";
          this.dateSaveLibToPicker = "";
          this.formdata.proclaimToDate = "false";
          return;
        }

        if (this.dateSaveLibFromPicker) this.errorDateSaveLibFrom = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
