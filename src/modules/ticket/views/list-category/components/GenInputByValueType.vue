<template>
  <v-layout v-if="typeAttributes.valueType" column>
    <label
      class="text--body-5 darken--text"
      :class="
        confirmTypeValue(definedValueType.title) ? 'mb-4' : 'text-uppercase'
      "
    >
      {{ typeAttributes.name }}
      <span v-if="hasRequired">*</span>
    </label>
    <validation-provider
      name="attributeValue"
      :rules="computedRules"
      :vid="`attributeValue-${index}`"
      class=""
    >
      <v-text-field
        v-if="confirmTypeValue(definedValueType.input)"
        v-model="typeAttributes.attributeValue"
        outlined
        dense
        disabled
        class="white"
        background-color="white"
      />

      <v-text-field
        v-if="confirmTypeValue(definedValueType.number)"
        v-model="typeAttributes.attributeValue"
        outlined
        dense
        disabled
        class="white"
        background-color="white"
      />

      <v-select
        v-if="confirmTypeValue(definedValueType.selectBox)"
        v-model="typeAttributes.attributeValue"
        outlined
        chips
        dense
        disabled
        class="white"
        :items="computedValueItems"
      />

      <v-layout
        v-if="confirmTypeValue(definedValueType.checkBox)"
        column
        class=" "
      >
        <v-layout v-for="(item, idx) in computedValueItems" :key="idx" align-center class="text--subtitle-3 ">
          <v-icon>mdi-checkbox-blank-outline</v-icon>
          <label class="ma-2" style="font-size: 14px">{{ item }}</label>
        </v-layout>

        <!-- <v-list-item-group v-for="(item, idx) in computedValueItems" :key="idx">
          <v-list-item>
            <v-checkbox
              v-model="checkSelected"
              :value="item"
              :label="item"
              hide-details
              readonly
              class="mt-0"
            >
            </v-checkbox>
          </v-list-item>
        </v-list-item-group> -->
      </v-layout>
    </validation-provider>

    <v-menu
      v-if="confirmTypeValue(definedValueType.calendar)"
      ref="menuDate"
      :v-model="`menuDate_${index}`"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ attrs }">
        <validation-provider
          name="attributeValue"
          :rules="computedRules"
          :vid="`attributeValue-${index}`"
        >
          <v-text-field
            v-model="attributeDateFm"
            outlined
            dense
            disabled
            clearable
            class="white"
            v-bind="attrs"
          >
            <template slot="append">
              <i class="app-icon icon-calendar darken icon-size-24" />
            </template>
          </v-text-field>
        </validation-provider>
      </template>
      <v-date-picker
        v-model="attributeDate"
        no-title
        :allowed-dates="allowedDates"
        @click:date="$refs.menuDate.save(attributeDate)"
      >
      </v-date-picker>
    </v-menu>

    <v-menu
      v-if="confirmTypeValue(definedValueType.clock)"
      ref="menuTime"
      :v-model="`menuTime_${index}`"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="typeAttributes.attributeValue"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ attrs }">
        <validation-provider
          name="attributeValue"
          :rules="computedRules"
          :vid="`attributeValue-${index}`"
        >
          <v-text-field
            v-model="typeAttributes.attributeValue"
            outlined
            dense
            disabled
            clearables
            class="white"
            v-bind="attrs"
          >
            <template slot="append">
              <i class="app-icon icon-clock darken icon-size-24" />
            </template>
          </v-text-field>
        </validation-provider>
      </template>
      <v-time-picker
        v-model="typeAttributes.attributeValue"
        full-width
        format="24hr"
        readonly
        @click:minute="$refs.menuTime.save(typeAttributes.attributeValue)"
      ></v-time-picker>
    </v-menu>

    <v-layout
      v-if="confirmTypeValue(definedValueType.file)"
      column
      class="mb-4"
    >
      <validation-provider
        ref="providerFileAttachs"
        :rules="ruleFileAttachsTicket"
        name="fileAttachs"
      >
        <input
          ref="fileAttachsInput"
          type="file"
          hidden
          accept=".xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.jpeg"
          disabled
          @change="selectAttachs"
        />
      </validation-provider>

      <v-layout justify-space-between>
        <v-layout column justify-end>
          <ul class="list-files text--caption">
            <li v-for="(file, idxFile) in nameFileAttachs" :key="idxFile">
              <img :src="getIconFile(`${file.fileName}`)" class="mr-2" />
              <span>{{ customFileName(file) }}</span>
              <span class="remove-attach" @click="removeFileAttach(idxFile)">
                <v-icon>mdi-close</v-icon>
              </span>
            </li>
          </ul>
          <label>
            {{ $t("ticket-types.format-file-valid") }}
          </label>
          <label class="error--text">
            {{ $t("ticket-types.maximum-file-size") }}
          </label>
        </v-layout>
        <v-item class="btn-upload">
          <v-icon size="30" style="border-radius:8px">mdi-upload</v-icon>
        </v-item>
      </v-layout>
    </v-layout>
  </v-layout>
</template>

<script>
import {
  definedValueType,
  getDateNow,
  formatDate,
} from "@/modules/ticket/helpers/ticketUtils";
import { FormUtils } from "@/helpers/formUtils";

import constants from "@/constants";
import rules from "@/mixins/rules";
import mixinUploadFiles from "@/modules/ticket/mixins/mixinUploadFiles";

export default {
  mixins: [rules, mixinUploadFiles],
  props: {
    typeAttributes: {
      type: Object,
      default: undefined,
    },
    index: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      definedValueType: definedValueType,
      maximumSmallText: constants.MAXIMUM_SMALL_TEXT,
      checkSelected: [],
      attributeDate: null,
      attributeDateFm: "",
      attributeTime: "",
      files: [],
      rules: {
        required: true,
      },
    };
  },
  computed: {
    computedRules() {
      if (this.hasRequired) {
        return "required";
      }
      return "";
    },
    hasRequired() {
      return this.typeAttributes.inputType === 1;
    },
    computedValueItems() {
      return this.typeAttributes.value.split(",");
    },
  },
  watch: {
    checkSelected() {
      this.typeAttributes.attributeValue = this.checkSelected.join(",");
    },
    attributeDate(val) {
      this.typeAttributes.attributeValue = val;
      this.attributeDateFm = formatDate(
        this.typeAttributes.attributeValue,
        "DD/MM/yyyy"
      );
    },
    nameFileAttachs() {
      this.typeAttributes.attributeValue = this.nameFileAttachs;
    },
  },
  created() {},
  methods: {
    confirmTypeValue(val) {
      return val === this.typeAttributes.valueType;
    },
    isNumber(evt) {
      return FormUtils.isNumberTicket(evt);
    },
    allowedDates(val) {
      return val >= getDateNow();
    },
    isToday(date) {
      if (getDateNow() === date) {
        return true;
      }
      return false;
    },
    allowedMinutes() {},
    onPasteNumber(evt) {
      const val = FormUtils.isOnPasteOnlyNumberAndMaximum(
        evt,
        this.maximumSmallText
      );
      if (val !== null) {
        this.typeAttributes.attributeValue = val;
      }
    },
  },
};
</script>
