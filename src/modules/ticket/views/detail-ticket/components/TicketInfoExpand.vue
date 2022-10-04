<template>
  <div>
    <v-expansion-panels v-model="expanded" class="rounded-xl rounded-t-0 pb-5">
      <v-expansion-panel class="rounded-xl rounded-t-0 pb-5">
        <v-expansion-panel-header color="overlay" class="rounded-0">
          <v-layout justify-space-between>
            <v-layout align-center>
              <v-avatar color="white" size="30" class="align-center mr-4">
                <i class="app-icon icon-information darken icon-size-22"></i>
              </v-avatar>
              <h6>{{ $t("tickets.labels.ticket-info") }}</h6>
            </v-layout>
          </v-layout>
          <template v-slot:actions>
            <v-icon color="darken"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content
          class="scroll-expand-detail-ticket-info overflow-y-auto pt-4"
        >
          <!-- show thoi han mong muon neu co -->
          <v-layout v-if="hasAttributeExpectEndDate" column>
            <label class="text--body-5 text-uppercase darken--text">
              {{ $t("tickets.labels.desired-deadline") }}
            </label>
            <v-text-field
              :value="formatDateView(detail.expectEndDate)"
              outlined
              dense
              disabled
              class="white no-border"
            >
              <template slot="append">
              </template>
            </v-text-field>
          </v-layout>

          <!-- show tai lieu dinh kem neu co -->
          <v-layout v-if="hasAttributeFileAttachments" column class="mb-4">
            <label class="text--body-5 text-uppercase darken--text">
              {{ $t("tickets.labels.attach-file") }}
            </label>
            <input
              ref="fileAttachsInput"
              type="file"
              hidden
              accept=".xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.jpeg"
            />
            <v-layout justify-space-between>
              <v-layout column justify-end>
                <ul class="list-files text--caption">
                  <li
                    v-for="(item, index) in detail.inputFileAttachments"
                    :key="index"
                    @click="downloadFileAttach(item)"
                  >
                    <img :src="getIconFile(`${item.fileName}`)" class="mr-2" />
                    <a class="text-decoration-underline">{{ item.fileName }}</a>
                  </li>
                </ul>
              </v-layout>
            </v-layout>
          </v-layout>

          <!-- show loai yeu cau neu co -->
          <v-layout column>
            <label class="text--body-5 darken--text text-uppercase">
              {{ $t("tickets.labels.ticket-type") }}
              <span>*</span>
            </label>
            <v-select
              v-model="selectedCategory"
              outlined
              dense
              solo
              disabled
              class="white no-border"
              append-icon=""
              :items="typesTicket"
            ></v-select>
          </v-layout>

          <!-- show don vi thuc hien neu co -->
          <v-layout column>
            <label class="text--body-5 darken--text text-uppercase">
              {{ $t("tickets.labels.department-processing") }}
            </label>

            <v-text-field
              v-model="selectedGroup"
              :items="allGroups"
              outlined
              dense
              solo
              disabled
              class="white no-border"
            >
              <!-- <vue-feather
                slot="append"
                class="darken--text"
                type="search"
                size="20"
              /> -->
            </v-text-field>
          </v-layout>

          <!-- generate category -->
          <div v-if="detail.categoryAttributeDtos.length > 0">
            <v-layout
              v-for="(typeAttributes, index) in detail.categoryAttributeDtos"
              :key="index"
              column
            >
              <GenInputByValueType
                :type-attributes="typeAttributes"
                :index="index"
              />
            </v-layout>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <base-preload :dialog="loading" />
  </div>
</template>

<script>
// components
import GenInputByValueType from "./GenInputByValueType";

import {
  formatDate,
  FORMAT_DATE_TIME_TICKET,
} from "@/modules/ticket/helpers/ticketUtils";
import mixinUploadFiles from "@/modules/ticket/mixins/mixinUploadFiles";

export default {
  components: { GenInputByValueType },
  mixins: [mixinUploadFiles],
  props: {
    detail: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      typesTicket: [],
      selectedCategory: "",
      allGroups: [],
      selectedGroup: "",
      expanded: 0,
      loading: false,
    };
  },
  computed: {
    hasAttributeExpectEndDate() {
      return typeof this.detail.expectEndDate !== "undefined";
    },
    hasAttributeFileAttachments() {
      return typeof this.detail.inputFileAttachments !== "undefined";
    },
  },
  watch: {
    detail(val, oldVal) {
      if (val.groupId !== oldVal.groupId) {
        this.bindSelectedGroup(val.groupName);
      }
    },
  },
  mounted() {
    this.parseDetailToView(this.detail);
  },
  methods: {
    // downloadFileAttach(val) {
    //   console.log(val);
    // },
    formatDateView(date) {
      return formatDate(date, FORMAT_DATE_TIME_TICKET);
    },
    parseDetailToView(data) {
      this.typesTicket = [];
      this.typesTicket.push(data.ticketCateName);
      this.selectedCategory = data.ticketCateName;

      if (typeof data.groupName !== "undefined") {
        this.bindSelectedGroup(data.groupName);
      }
    },
    bindSelectedGroup(groupName) {
      this.allGroups = [];
      this.allGroups.push(groupName);
      this.selectedGroup = groupName;
    },
  },
};
</script>
