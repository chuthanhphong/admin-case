<template>
  <div class="wrap--search-flow px-5">
    <div
      class="d-flex align-md-center flex-column flex-md-row pt-3 justify-space-between search-top"
    >
      <div>
        <div v-if="showAdvance" class="d-flex align-center">
          <v-icon>mdi-alert-circle-outline</v-icon>
          <b class="notice--text pl-2">{{ $t('searchAdvanceNote') }}</b>
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row justify-end">
        <div class="d-flex align-right justify-end w-500">
          <v-text-field
            v-model="formdata.keyword"
            class="text-search"
            :placeholder="$t('labelSearchFlow')"
            outlined
            dense
            autofocus
            clearable
            hide-details
            @change="formdata.keyword = trimSpace(formdata.keyword)"
            @keyup.enter="searchFlowByKeyword"
            @click:clear="resetSearch"
          >
            <vue-feather
              slot="prepend-inner"
              class="color--icon-search"
              type="search"
              size="20"
            />
          </v-text-field>

          <!-- btn tim kiem nang cao -->
          <div>
            <v-tooltip top content-class="tooltip-top">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  outlined
                  color="primary"
                  class="btn-show-advance"
                  :class="!showBtnCreate ? 'mr-0' : ''"
                  v-on="on"
                  @click="changeShow"
                >
                  <img src="@/assets/icons/icon-advance.svg" alt="advance" />
                </v-btn>
              </template>
              <div>
                {{ $t('electronicSign.advanceSearch') }}
              </div>
            </v-tooltip>
          </div>

          <!-- btn tao moi -->
          <v-btn
            v-if="showBtnCreate"
            color="primary"
            @click="createFlow"
          >
            <span class="text-capitalize pr-3">
              {{ $t('dashboards.create') }}
            </span>
            <vue-feather type="plus-circle" size="25" />
          </v-btn>
        </div>
      </div>
    </div>

    <AdvanceSearch
      v-show="showAdvance"
      :claszz="claszz"
      :formdata="formdata"
      :show-advance="showAdvance"
      :search-document="searchDocument"
      @submission-date-from-change="submissionDateFromChange"
      @submission-date-to-change="submissionDateToChange"
    />
  </div>
</template>

<script>
import AdvanceSearch from './AdvanceSearch.vue'
import routeEsignature from '@/modules/esignature/router/routePaths'

export default {
  name: 'SearchFlow',
  components: {
    AdvanceSearch
  },

  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    searchDocument: {
      type: Function,
      default: undefined
    },
    changeShowAdvance: {
      type: Function,
      default: undefined
    },
    showBtnCreate: {
      type: Boolean,
      default: true
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

  methods: {
    trimSpace(val) {
      const value = val ? val.trim() : ''
      return value
    },

    changeShow() {
      this.showAdvance = !this.showAdvance
      this.changeShowAdvance(this.showAdvance)
      return this.showAdvance
    },

    resetSearch() {
      this.formdata.keyword = ''
      this.searchDocument()
    },

    searchFlowByKeyword() {
      let keyword = this.formdata.keyword
      keyword = keyword.trim().length > 0 ? keyword : ''
      this.formdata.keyword = keyword
      this.searchDocument()
    },

    createFlow() {
      this.$router.push(routeEsignature.CREATE_FLOW_PATH)
    },
    // Change Date.
    submissionDateFromChange(value) {
      this.formdata.fromDate = value && value.replaceAll('/', '')
      this.searchDocument()
    },
    submissionDateToChange(value) {
      this.formdata.toDate = value && value.replaceAll('/', '')
      this.searchDocument()
    }
  }
}
</script>

<style lang="scss">
.wrap--search-flow {
  .v-text-field.v-text-field--enclosed .v-text-field__details {
    padding: 0;
  }
  label {
    font-size: 16px !important;
    font-weight: 600 !important;
    color: #7A7C80 !important;
  }
}
</style>
