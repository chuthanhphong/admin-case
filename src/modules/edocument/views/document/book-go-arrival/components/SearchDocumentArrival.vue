<template>
  <div class="px-5">
    <div
      class="d-flex flex-column flex-md-row pt-3 justify-space-between align-center"
    >
      <!-- Text notify -->
      <div>
        <div v-if="showAdvance" class="d-flex align-center">
          <v-icon color="#8E8EA1">mdi-alert-circle-outline</v-icon>
          <b class="text--caption orange-1 pl-2">
            {{ $t("searchAdvanceNote") }}
          </b>
        </div>
      </div>

      <div class="d-flex flex-row justify-end">
        <v-text-field
          id="txt-search"
          v-model="formdata.keyword"
          :placeholder="$t('placeholder.searchDocTo')"
          outlined
          dense
          clearable
          hide-details
          class="w-270"
          @change="formdata.keyword = trimSpace(formdata.keyword)"
          @keyup.enter="searchDocument"
        >
          <vue-feather
            slot="prepend-inner"
            class="grey-1"
            type="search"
            size="20"
          />
        </v-text-field>

        <div class="wrap-btn-border">
          <!-- Btn advance search -->
          <v-tooltip top content-class="tooltip-top">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                outlined
                color="primary"
                class="btn-advance"
                v-on="on"
                @click="changeShowAdvance"
              >
                <img src="@/assets/icons/icon-advance.svg" alt="advance" />
              </v-btn>
            </template>
            {{ $t("advanceSearch") }}
          </v-tooltip>

          <!-- Btn upload hop dong tu excel -->
          <v-tooltip top content-class="tooltip-top">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                outlined
                color="primary"
                class="btn-advance ml-0"
                v-on="on"
                @click="uploadDocFromExcel"
              >
                <img src="@/assets/icons/up.svg" alt="upload" />
              </v-btn>
            </template>
            {{ $t("uploadDoc") }}
          </v-tooltip>
        </div>

        <!-- Btn vao so den -->
        <v-btn color="#0FAFE4" class="btn-create" @click="enrolBookTo">
          <span class="pr-2 text-capitalize text--button">
            {{ $t("enterBook") }}
          </span>
          <vue-feather type="plus-circle" size="25" />
        </v-btn>
      </div>
    </div>

    <!-- tim kiem nang cao -->
    <AdvanceSearchArrival
      v-show="showAdvance"
      :formdata="formdata"
      :show-advance="showAdvance"
      :search-document="searchDocument"
      @submission-date-from-change="submissionDateFromChange"
      @submission-date-to-change="submissionDateToChange"
    />
  </div>
</template>

<script>
import AdvanceSearchArrival from "./AdvanceSearchArrival.vue";
import edocumentRoute from "@/modules/edocument/router/routePaths";
export default {
  name: "SearchDocumentArrival",
  components: {
    AdvanceSearchArrival,
  },

  props: {
    formdata: {
      type: Object,
      default: undefined,
    },

    searchDocument: {
      type: Function,
      default: undefined,
    },
  },

  data() {
    return {
      showAdvance: false,
    };
  },

  methods: {
    trimSpace(val) {
      return val ? val.trim() : "";
    },

    changeShowAdvance() {
      this.showAdvance = !this.showAdvance;
    },

    // Change Date.
    submissionDateFromChange(value) {
      this.formdata.fromDate = value && value.replaceAll("/", "");
      this.searchDocument();
    },
    submissionDateToChange(value) {
      this.formdata.toDate = value && value.replaceAll("/", "");
      this.searchDocument();
    },

    uploadDocFromExcel() {},

    // Vao so den
    enrolBookTo() {
      this.$router.push(`${edocumentRoute.CREATE_BOOK_DOC_PATH}?document=RECEIVE`);
    },
  },
};
</script>

<style></style>
