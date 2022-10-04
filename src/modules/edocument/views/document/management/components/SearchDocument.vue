<template>
  <div class="px-5">
    <div
      class="d-flex flex-column flex-md-row pt-3 justify-space-between align-center"
    >
      <!-- Text notify -->
      <div>
        <div v-if="showAdvance" class="d-flex align-center">
          <v-icon color="#8E8EA1">mdi-alert-circle-outline</v-icon>
          <b class="notice--text pl-2">
            {{ $t('searchAdvanceNote') }}
          </b>
        </div>
      </div>

      <div class="d-flex flex-row justify-end">
        <v-text-field
          id="txt-search"
          v-model="formdata.keyword"
          :placeholder="$t('managerDoc')"
          outlined
          dense
          autofocus
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

        <!-- Btn advance search -->
        <v-tooltip top content-class="tooltip-top">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              outlined
              color="primary"
              class="btn-advance"
              v-on="on"
              @click="changeShow"
            >
              <img src="@/assets/icons/icon-advance.svg" alt="advance">
            </v-btn>
          </template>
          {{ $t('contract.label.advanceSearch') }}
        </v-tooltip>

        <!-- Btn vao so den -->
        <v-btn color="#0FAFE4" class="btn-create" @click="createContract">
          <span class="pr-2 text-capitalize text--button">
            {{ $t('managementDoc.dashboards.document') }}
          </span>
          <vue-feather type="plus-circle" class="pr-2" size="25" />
        </v-btn>
      </div>
    </div>

    <!-- tim kiem nang cao -->
    <AdvanceSearch
      v-show="showAdvance"
      :formdata="formdata"
      :claszz="claszz"
      :show-advance="showAdvance"
      :search-document="searchDocument"
      @submission-date-from-change="submissionDateFromChange"
      @submission-date-to-change="submissionDateToChange"
      @submission-date-proclaim-from-change="submissionDateProclaimFromChange"
      @submission-date-proclaim-to-change="submissionDateProclaimToChange"
    />
  </div>
</template>

<script>
import AdvanceSearch from './AdvanceSearch.vue'
import edocumentRoute from '@/modules/edocument/router/routePaths'

export default {
  name: 'SearchDocument',
  components: {
    AdvanceSearch
  },

  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    changeShowAdvance: {
      type: Function,
      default: undefined
    },
    searchDocument: {
      type: Function,
      default: undefined
    },
    claszz: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      showAdvance: false
    }
  },
  created() {
    const { searchCriteria } = this.$route.query
    if (searchCriteria) {
      this.changeShow()
    }
  },
  methods: {
    trimSpace(val) {
      return val ? val.trim() : ''
    },

    changeShow() {
      this.showAdvance = !this.showAdvance
      this.changeShowAdvance(this.showAdvance)
      return this.showAdvance
    },

    // Change Date.
    submissionDateFromChange(value) {
      this.formdata.fromDate = value && value.replaceAll('/', '')
      this.searchDocument()
    },
    submissionDateToChange(value) {
      this.formdata.toDate = value && value.replaceAll('/', '')
      this.searchDocument()
    },

    // Change Date proclaim.
    submissionDateProclaimFromChange(value) {
      this.formdata.promulgateFromDate = value && value.replaceAll('/', '')
      this.searchDocument()
    },
    submissionDateProclaimToChange(value) {
      this.formdata.promulgateToDate = value && value.replaceAll('/', '')
      this.searchDocument()
    },

    // tao moi
    createContract() {
      this.$router.push(`${edocumentRoute.CREATE_MANAGEMENT_DOC_PATH}`)
    }
  }
}
</script>

<style></style>
