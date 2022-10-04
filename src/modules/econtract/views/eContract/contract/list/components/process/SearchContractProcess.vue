<template>
  <div class="wrap-search px-5">
    <div
      class="d-flex align-md-center align-start flex-column flex-md-row justify-space-between align-center pt-3"
    >
      <div>
        <div v-if="showAdvance" class="d-flex align-center">
          <v-icon>mdi-alert-circle-outline</v-icon>
          <b class="notice--text pl-2 text--body-3">{{ $t('searchAdvanceNote') }}</b>
        </div>
      </div>

      <div class="d-flex align-right justify-end">
        <v-text-field
          id="txt-search"
          v-model="formdata.keyword"
          :placeholder="$t('contract.label.searchContract')"
          outlined
          dense
          clearable
          hide-details
          class="text--body-5"
          name="txtSearch"
          @change="formdata.keyword = trimSpace(formdata.keyword)"
          @keyup.enter="searchContractKeyword"
          @click:clear="resetSearch"
        >
          <vue-feather
            slot="prepend-inner"
            class="grey--text"
            type="search"
            size="20"
          />
        </v-text-field>
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
              {{ $t('contract.label.advanceSearch') }}
            </div>
          </v-tooltip>
        </div>
      </div>
    </div>
    <advance-search-process
      v-show="showAdvance"
      :formdata="formdata"
      :show-advance="showAdvance"
      :search-contract="searchContract"
      @submission-date-from-change="submissionDateFromChange"
      @submission-date-to-change="submissionDateToChange"
      @expired-from-change="expiredFromChange"
      @expired-to-change="expiredToChange"
    />
  </div>
</template>

<script>
import AdvanceSearchProcess from './AdvanceSearchProcess.vue'
import econtractRoute from '@/modules/econtract/router/routePaths'

export default {
  components: {
    AdvanceSearchProcess
  },
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    searchContract: {
      type: Function,
      default: undefined
    },
    changeShowAdvance: {
      type: Function,
      default: undefined
    },
    iCreatedContrac: {
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
    changeShow() {
      this.showAdvance = !this.showAdvance
      this.changeShowAdvance(this.showAdvance)
      return this.showAdvance
    },
    submissionDateFromChange(value) {
      this.formdata.fromDate = value && value.replaceAll('/', '')
      this.searchContract()
    },
    submissionDateToChange(value) {
      this.formdata.toDate = value && value.replaceAll('/', '')
      this.searchContract()
    },
    expiredFromChange(value) {
      this.formdata.effectDateFrom = value && value.replaceAll('/', '')
      this.searchContract()
    },
    // Tim kiem theo tu khoa
    searchContractKeyword() {
      let keyword = this.formdata.keyword
      keyword = keyword.trim().length > 0 ? keyword : ''
      this.formdata.keyword = keyword
      this.searchContract()
    },
    resetSearch() {
      this.formdata.keyword = ''
      this.searchContractKeyword()
    },
    expiredToChange(value) {
      this.formdata.effectDateTo = value && value.replaceAll('/', '')
      this.searchContract()
    },
    createContract() {
      this.$router.push(`${econtractRoute.CREATE_CONTRACT_PATH}`)
    }
  }
}
</script>

<style lang="scss" scoped></style>
