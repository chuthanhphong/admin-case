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
      v-slot="{ errors }"
      name="attributeValue"
      :rules="computedRules"
      :vid="`attributeValue-${index}`"
    >
      <v-text-field
        v-if="confirmTypeValue(definedValueType.input)"
        v-model="typeAttributes.attributeValue"
        outlined
        dense
        color="#7B8794"
        background-color="white"
        :maxlength="maximumSmallText"
        :placeholder="$t('tickets.placeholders.is-input')"
        :error-messages="errors"
      />

      <v-text-field
        v-if="confirmTypeValue(definedValueType.number)"
        v-model="typeAttributes.attributeValue"
        outlined
        dense
        color="#7B8794"
        background-color="white"
        :maxlength="maximumSmallText"
        :placeholder="$t('tickets.placeholders.is-number')"
        :error-messages="errors"
        @keypress="isNumber($event)"
        @paste.prevent="onPasteNumber($event)"
      />

      <v-select
        v-if="confirmTypeValue(definedValueType.selectBox)"
        v-model="typeAttributes.attributeValue"
        outlined
        dense
        :placeholder="$t('tickets.placeholders.is-select')"
        :error-messages="errors"
        :items="computedValueItems"
      />

      <v-layout
        v-if="confirmTypeValue(definedValueType.checkBox)"
        column
        class="mb-4"
      >
        <v-list-item-group v-for="(item, idx) in computedValueItems" :key="idx">
          <v-list-item>
            <v-checkbox
              v-model="checkSelected"
              :value="item"
              :label="item"
              hide-details
              class="mt-0"
            >
            </v-checkbox>
          </v-list-item>
        </v-list-item-group>
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
      <template v-slot:activator="{ on, attrs }">
        <validation-provider
          v-slot="{ errors }"
          name="attributeValue"
          :rules="computedRules"
          :vid="`attributeValue-${index}`"
        >
          <v-text-field
            v-model="attributeDateFm"
            outlined
            dense
            readonly
            clearable
            :placeholder="$t('tickets.placeholders.is-calendar')"
            :error-messages="errors"
            v-bind="attrs"
            v-on="on"
          >
            <template slot="append">
              <!-- <i class="app-icon icon-calendar darken icon-size-24" /> -->
              <v-img
                :src="require('@/assets/icons/task/createTask/calendar.png')"
                class="hover--pointer"
                v-on="on"
              />
            </template>
          </v-text-field>
        </validation-provider>
      </template>
      <v-date-picker
        v-model="attributeDate"
        no-title
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
      <template v-slot:activator="{ on, attrs }">
        <validation-provider
          v-slot="{ errors }"
          name="attributeValue"
          :rules="computedRules"
          :vid="`attributeValue-${index}`"
        >
          <v-text-field
            v-model="typeAttributes.attributeValue"
            outlined
            dense
            readonly
            clearable
            :placeholder="$t('tickets.placeholders.is-clock')"
            :error-messages="errors"
            v-bind="attrs"
            v-on="on"
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
        @click:minute="$refs.menuTime.save(typeAttributes.attributeValue)"
      ></v-time-picker>
    </v-menu>

    <v-layout
      v-if="confirmTypeValue(definedValueType.file)"
      column
      class="mb-4"
    >
      <validation-provider
        v-if="hasRequired"
        ref="attributeValue"
        :rules="computedRules"
        :vid="`attributeValue-${index}`"
      >
        <v-text-field
          v-model="typeAttributes.attributeValue"
          hide-details
          hidden
        ></v-text-field>
      </validation-provider>

      <validation-provider
        ref="providerFileAttachs"
        :rules="ruleFileAttachsTicket"
        name="fileAttachs"
        :vid="`attributeValueFile-${index}`"
      >
        <input
          ref="fileAttachsInput"
          type="file"
          accept=".xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.jpeg"
          multiple
          hidden
          :loading="uploadingFileAttatch"
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
        <v-btn
          class="btn-upload"
          :loading="uploadingFileAttatch"
          @click="uploadAttachs"
        >
          <v-icon size="30">mdi-upload</v-icon>
        </v-btn>
      </v-layout>
    </v-layout>
  </v-layout>
</template>

<script>
import {
  definedValueType,
  formatDate,
  FORMAT_DATE_TICKET,
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
      uploadingFileAttatch: false,
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
        FORMAT_DATE_TICKET
      );
    },
    nameFileAttachs(val) {
      if (val.length === 0) {
        this.typeAttributes.attributeValue = null;
      } else {
        this.typeAttributes.attributeValue = val;
      }
    },
  },
  created() {
    if (
      this.confirmTypeValue(definedValueType.file) &&
      typeof this.typeAttributes.inputFileAttributes !== "undefined" &&
      this.typeAttributes.inputFileAttributes.length > 0
    ) {
      this.nameFileAttachs = this.typeAttributes.inputFileAttributes;
    }
  },
  methods: {
    confirmTypeValue(val) {
      return val === this.typeAttributes.valueType;
    },
    isNumber(evt) {
      return FormUtils.isNumberTicket(evt);
    },
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
