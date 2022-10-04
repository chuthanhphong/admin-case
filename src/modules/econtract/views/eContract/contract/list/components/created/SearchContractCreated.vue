<template>
  <div class="wrap-search px-5">
    <div
      class="d-flex align-md-center flex-column flex-md-row pt-3 justify-space-between search-top"
    >
      <div>
        <div v-if="showAdvance" class="d-flex align-center">
          <v-icon>mdi-alert-circle-outline</v-icon>
          <b class="notice--text pl-2 text--body-3">{{ $t('searchAdvanceNote') }}</b>
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row justify-end">
        <div class="d-flex align-right justify-end">
          <v-text-field
            id="txt-search"
            v-model="formdata.keyword"
            :placeholder="$t('contract.label.searchContract')"
            outlined
            dense
            clearable
            class="text--body-5"
            hide-details
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
              <div class="text--label">
                {{ $t('contract.label.advanceSearch') }}
              </div>
            </v-tooltip>
          </div>
          <v-btn color="primary" @click="createContract">
            <span class="pr-3 text-capitalize text--button">{{ $t('contract.new') }} </span>
            <vue-feather type="plus-circle" size="25" />
          </v-btn>
        </div>
      </div>
    </div>
    <advance-search-created
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
import AdvanceSearchCreated from './AdvanceSearchCreated.vue'
import econtractRoute from '@/modules/econtract/router/routePaths'

export default {
  components: {
    AdvanceSearchCreated
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
