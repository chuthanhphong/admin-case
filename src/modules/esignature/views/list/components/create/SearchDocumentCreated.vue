<template>
  <div class="wrap-search px-5">
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
        <div class="d-flex align-right justify-end">
          <v-text-field
            id="txt-search"
            v-model="formdata.keyword"
            :placeholder="$t('electronicSign.labelSearch')"
            outlined
            dense
            autofocus
            clearable
            hide-details
            name="txtSearch"
            @change="formdata.keyword = trimSpace(formdata.keyword)"
            @keyup.enter="searchDocumentKeyword"
          >
            <vue-feather
              slot="prepend-inner"
              class="grey--text"
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
                  v-on="on"
                  @click="changeShow"
                >
                  <img src="@/assets/icons/icon-advance.svg" alt="">
                </v-btn>
              </template>
              <div>
                {{ $t('electronicSign.advanceSearch') }}
              </div>
            </v-tooltip>
          </div>

          <!-- btn tao moi -->
          <v-btn color="primary" @click="createDocument">
            <span
              class="pr-3 text-capitalize"
            >{{ $t('dashboards.create') }}
            </span>
            <vue-feather type="plus-circle" size="25" />
          </v-btn>
        </div>
      </div>
    </div>

    <!-- tim kiem nang cao -->
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
// import constants from '@/constants'
import routeEsignature from '@/modules/esignature/router/routePaths'
export default {
  name: 'SearchDocumentCreated',
  components: { AdvanceSearch },
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
    const { docState } = this.$route.query
    if (docState) {
      this.changeShow()
    }
  },
  methods: {
    trimSpace(val) {
      const value = val ? val.trim() : ''
      return value
    },
    searchDocumentKeyword() {
      let keyword = this.formdata.keyword
      keyword = keyword.trim().length > 0 ? keyword : ''
      this.formdata.keyword = keyword
      this.searchDocument()
    },
    changeShow() {
      this.showAdvance = !this.showAdvance
      this.changeShowAdvance(this.showAdvance)
      return this.showAdvance
    },
    createDocument() {
      this.$router.push(routeEsignature.CREATE_DOCUMENT_PATH)
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

<style></style>
