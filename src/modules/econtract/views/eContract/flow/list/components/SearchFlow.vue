<template>
  <div class="wrap-search px-5">
    <div class="d-flex flex-column flex-md-row justify-end pt-3">
      <div class="d-flex align-right justify-end">
        <v-text-field
          id="txt-search"
          v-model="formdata.keyword"
          class="text--label-5"
          :placeholder="$t('contract.label.searchContract')"
          outlined
          dense
          clearable
          hide-details
          name="txtSearch"
          @change="formdata.keyword = trimSpace(formdata.keyword)"
          @keyup.enter="searchFlowKeyword"
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
        <div class="d-flex align-center justify-end">
          <div class="d-flex align-center">
            <v-btn color="primary" class="text--button" @click="createFlow">
              <span
                class="pr-3 text-capitalize text--button"
              >{{ $t('flow.label.create') }}
              </span>
              <vue-feather type="plus-circle" size="20" />
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <advance-search
      v-show="showAdvance"
      :formdata="formdata"
      :show-advance="showAdvance"
      :search-flow="searchFlow"
    />
  </div>
</template>

<script>
import AdvanceSearch from './AdvanceSearch.vue'
import econtractRoute from '@/modules/econtract/router/routePaths'

export default {
  components: {
    AdvanceSearch
  },
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    searchFlow: {
      type: Function,
      default: undefined
    },
    changeShowAdvance: {
      type: Function,
      default: undefined
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
    // Tim kiem theo tu khoa
    searchFlowKeyword() {
      let keyword = this.formdata.keyword
      keyword = keyword.trim().length > 0 ? keyword : ''
      this.formdata.keyword = keyword
      this.searchFlow()
    },
    resetSearch() {
      this.formdata.keyword = ''
      this.searchFlowKeyword()
    },
    createFlow() {
      this.$router.push(`${econtractRoute.CREATE_FLOW_PATH}`)
    }
  }
}
</script>

<style lang="scss" scoped></style>
