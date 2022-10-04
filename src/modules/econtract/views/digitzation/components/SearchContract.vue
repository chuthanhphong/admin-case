<template>
  <div class="wrap-search px-5">
    <div
      class="d-flex align-md-center flex-column flex-md-row pt-3 justify-space-between search-top"
    >
      <div>
        <div v-if="showAdvance" class="d-flex align-center">
          <v-icon>mdi-alert-circle-outline</v-icon>
          <b class="notice--text pl-2 text--body-3">{{
            $t('searchAdvanceNote')
          }}</b>
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row justify-end">
        <div class="d-flex align-right justify-end">
          <v-text-field
            id="txt-search"
            v-model="formdata.keyword"
            :placeholder="$t('contract-manager.labels.placeholderSearch')"
            outlined
            dense
            clearable
            class="contract-manager"
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
            <v-tooltip top content-class="">
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
          <div>
            <v-tooltip v-if="showBtnImportFile" top>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-btn
                    v-bind="attrs"
                    outlined
                    color="primary"
                    class="btn-show-advance"
                    v-on="on"
                    @click="showDialogUpload"
                  >
                    <img src="@/assets/icons/icon-up.svg" alt="">
                  </v-btn>
                </div>
              </template>
              <div>
                {{ $t('contract-manager.dialogs.titleUploadContract') }}
              </div>
            </v-tooltip>
          </div>
          <v-btn v-if="showBtnCreate" color="primary" @click="createContract">
            <span
              class="pr-3 text-capitalize text--button"
            >{{ $t('contract.name') }}
            </span>
            <vue-feather type="plus-circle" size="25" />
          </v-btn>
        </div>
      </div>
    </div>
    <advance-search
      v-show="showAdvance"
      :formdata="formdata"
      :show-advance="showAdvance"
      :search-contract="searchContract"
      @create-date-from-change="createDateFromChange"
      @create-date-to-change="createDateToChange"
      @expired-from-change="expiredFromChange"
      @expired-to-change="expiredToChange"
    />
  </div>
</template>

<script>
// Constants
import constants from '@/constants'
import econtractRoute from '@/modules/econtract/router/routePaths'
// Mixins
import checkRoles from '@/mixins/checkRoles'

// Components
import AdvanceSearch from './AdvanceSearch.vue'

export default {
  components: {
    AdvanceSearch
  },
  mixins: [checkRoles],
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
    }
  },
  data() {
    return {
      showAdvance: false
    }
  },
  computed: {
    showBtnCreate() {
      return this.showActionCreate([constants.USER_ROLE.HDDT])
    },

    showBtnImportFile() {
      const user = JSON.parse(localStorage.getItem(constants.USER_INFO))

      return (
        user.roles &&
        user.roles.includes(constants.USER_ROLE.HDDT)
      )
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
    showDialogUpload() {
      this.$emit('show-dialog-upload')
    },
    changeShow() {
      this.showAdvance = !this.showAdvance
      this.changeShowAdvance(this.showAdvance)
      return this.showAdvance
    },
    createDateFromChange(value) {
      this.formdata.fromDate = value && value.replaceAll('/', '')
      this.searchContract()
    },
    createDateToChange(value) {
      this.formdata.toDate = value && value.replaceAll('/', '')
      this.searchContract()
    },
    expiredFromChange(value) {
      this.formdata.effectDateFrom = value && value.replaceAll('/', '')
      this.searchContract()
    },
    expiredToChange(value) {
      this.formdata.effectDateTo = value && value.replaceAll('/', '')
      this.searchContract()
    },
    // Tim kiem theo tu khoa
    searchContractKeyword() {
      if (this.formdata.keyword.length === 0) {
        this.formdata.keyword = ''
      }
      this.searchContract()
    },
    resetSearch() {
      this.formdata.keyword = ''
      this.searchContractKeyword()
    },
    createContract() {
      this.$router.push(
        `${econtractRoute.CREATE_CONTRACT_DIGIT_PATH}`
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
