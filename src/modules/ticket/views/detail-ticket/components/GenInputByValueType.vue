<template>
  <v-layout v-if="typeAttributes.valueType" column>
    <label
      :class="
        confirmTypeValue(definedValueType.title) ? 'mb-4' : 'text-uppercase'
      "
      class="text--body-5 darken--text"
    >
      {{ typeAttributes.name }}
      <span v-if="hasRequired">*</span>
    </label>
    <v-text-field
      v-if="confirmTypeValue(definedValueType.input)"
      v-model="typeAttributes.attributeValue"
      class="white no-border"
      dense
      disabled
      outlined
    />

    <v-text-field
      v-if="confirmTypeValue(definedValueType.number)"
      v-model="typeAttributes.attributeValue"
      class="white no-border"
      dense
      disabled
      outlined
    />

    <v-select
      v-if="confirmTypeValue(definedValueType.selectBox)"
      v-model="typeAttributes.attributeValue"
      :items="computedValueItems"
      append-icon=""
      class="white no-border"
      dense
      disabled
      outlined
    >
    </v-select>

    <v-layout
      v-if="confirmTypeValue(definedValueType.checkBox)"
      class="mb-4"
      column
    >
      <v-list-item-group v-for="(item, idx) in computedValueItems" :key="idx">
        <v-list-item>
          <v-checkbox
            v-model="checkSelected"
            :label="item"
            :value="item"
            class="mt-0 bg-transparent"
            disabled
            hide-details
          >
          </v-checkbox>
        </v-list-item>
      </v-list-item-group>
    </v-layout>

    <v-text-field
      v-if="confirmTypeValue(definedValueType.calendar)"
      v-model="attributeDateFm"
      class="white no-border"
      dense
      disabled
      outlined
    >
      <template slot="append">
      </template>
    </v-text-field>

    <v-text-field
      v-if="confirmTypeValue(definedValueType.clock)"
      v-model="typeAttributes.attributeValue"
      class="white no-border"
      dense
      disabled
      outlined
    >
      <template slot="append">
      </template>
    </v-text-field>

    <v-layout
      v-if="
        confirmTypeValue(definedValueType.file) && hasAttributeFileAttributes
      "
      class="mb-4"
      column
    >
      <v-layout justify-space-between>
        <v-layout column justify-end>
          <ul class="list-files text--caption">
            <li
              v-for="(item, idxFile) in typeAttributes.inputFileAttributes"
              :key="idxFile"
              @click="downloadFileAttach(item)"
            >
              <img :src="getIconFile(`${item.fileName}`)" class="mr-2" />
              <a class="text-decoration-underline">{{ item.fileName }}</a>
            </li>
          </ul>
        </v-layout>
      </v-layout>
    </v-layout>
    <base-preload :dialog="loading" />
  </v-layout>
</template>

<script>
import {
  definedValueType,
  formatDate,
} from "@/modules/ticket/helpers/ticketUtils";
// import moment from "moment";
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
      loading: false,
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
    checkSelected() {
      return this.typeAttributes.attributeValue.split(",");
    },
    attributeDateFm() {
      return formatDate(
        this.typeAttributes.attributeValue,
        constants.FORMAT_DATE_TICKET,
      )
    },
    hasAttributeFileAttributes() {
      return typeof this.typeAttributes.inputFileAttributes !== "undefined";
    },
  },
  methods: {
    confirmTypeValue(val) {
      return val === this.typeAttributes.valueType;
    },
  },
};
</script>
