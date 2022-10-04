<template>
  <div class="wrap-advance-search px-2 py-4 pb-0 mt-3">
    <v-row justify="space-between" align="start" class="">
      <!--Bo loc -->
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">{{
            $t('contract-manager.labels.filter')
          }}</label>
          <v-select
            v-model="formdata.contractCondition"
            :items="positionsInContract"
            :item-text="item => $t(item.name)"
            :item-value="item => item.value"
            outlined
            class="text--body-5"
            dense
            :placeholder="$t('contract.label.contractStatus')"
            @change="searchContract"
          >
            <template v-slot:append>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-select>
        </div>
      </div>
      <!--Loai hop dong -->
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">{{ $t('contract.typeLabel') }}</label>
          <v-select
            v-model="formdata.contractType"
            :items="contractTypes"
            :item-text="item => $t(item.name)"
            item-value="id"
            outlined
            dense
            class="text--body-5"
            :placeholder="$t('contract.label.contractStatus')"
            @change="searchContract"
          >
            <template v-slot:append>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-select>
        </div>
      </div>
      <!-- Nhom khach hang -->
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">{{
            $t('contract-manager.labels.groupCustomer')
          }}</label>
          <v-select
            v-model="formdata.customerType"
            :items="userTypes"
            :item-text="item => $t(item.name)"
            item-value="value"
            outlined
            dense
            class="text--body-5"
            :placeholder="$t('contract.label.contractStatus')"
            @change="searchContract"
          >
            <template v-slot:append>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-select>
        </div>
      </div>
      <!-- Ten khach hang -->
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">{{
            $t('contract-manager.labels.customerName')
          }}</label>
          <v-text-field
            v-model="formdata.customerInfo"
            outlined
            clearable=""
            dense
            class="text--body-5"
            required
            :placeholder="$t('contract-manager.labels.customerNameSearch')"
            @keyup.enter="searchContract"
            @change="searchContract"
          >
            <vue-feather slot="append" class="grey--text" type="search" />
          </v-text-field>
        </div>
      </div>
    </v-row>
    <v-row justify="space-between" align="start" class="">
      <!-- Het hieu luc -->
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">
            {{ $t('contract.label.expired') }}:
            {{ $t('contract.label.from') }}
          </label>
          <v-menu
            v-model="menuExpiredFrom"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="expiredFromValue"
                outlined
                placeholder="DD/MM/YYYY"
                dense
                class="text--body-5"
                v-bind="attrs"
                :error-messages="$t(errorDateExpiredFrom)"
                v-on="on"
                @click:append="menuExpiredFrom = !menuExpiredFrom"
              >
                <template v-slot:append>
                  <img
                    src="@/assets/icons/calendar.svg"
                    alt=""
                    class="hover--pointer"
                    @click="menuExpiredFrom = !menuExpiredFrom"
                  >
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="expiredFromPicker"
              format="DD/MM/YYYY"
              :locale="localDate"
              no-title
              show-adjacent-months
              @input="menuExpiredFrom = false"
            />
          </v-menu>
        </div>
      </div>
      <!-- Den ngay -->
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">
            {{ $t('contract-manager.labels.dateTo') }}
          </label>
          <v-menu
            v-model="menuExpiredTo"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="expiredToValue"
                outlined
                placeholder="DD/MM/YYYY"
                dense
                class="text--body-5"
                :error-messages="$t(errorDateExpiredTo)"
                v-bind="attrs"
                v-on="on"
                @click:append="menuExpiredTo = !menuExpiredTo"
              >
                <template v-slot:append>
                  <img
                    src="@/assets/icons/calendar.svg"
                    alt=""
                    class="hover--pointer"
                    @click="menuExpiredTo = !menuExpiredTo"
                  >
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="expiredToPicker"
              format="DD/MM/YYYY"
              :locale="localDate"
              no-title
              show-adjacent-months
              @input="menuExpiredTo = false"
            />
          </v-menu>
        </div>
      </div>
      <!-- Ngay tao -->
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">
            {{ $t(dateForm) }}: {{ $t('contract.label.from') }}
            <span class="color-require ">*</span>
          </label>
          <v-menu
            v-model="menuDateCreatedFrom"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                ref="dateCreatedFromValue"
                v-model="dateCreatedFromValue"
                outlined
                placeholder="DD/MM/YYYY"
                dense
                class="text--body-5"
                v-bind="attrs"
                :error-messages="$t(errorDateCreatedFrom)"
                v-on="on"
                @click:append="menuDateCreatedFrom = !menuDateCreatedFrom"
              >
                <template v-slot:append>
                  <img
                    src="@/assets/icons/calendar.svg"
                    alt=""
                    class="hover--pointer"
                    @click="menuDateCreatedFrom = !menuDateCreatedFrom"
                  >
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="dateCreatedFromPicker"
              format="DD/MM/YYYY"
              :locale="localDate"
              no-title
              show-adjacent-months
              @input="menuDateCreatedFrom = false"
            />
          </v-menu>
        </div>
      </div>
      <!-- Den ngay -->
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">
            {{ $t('contract-manager.labels.dateTo') }}
            <span class="color-require ">*</span>
          </label>
          <v-menu
            v-model="menuDateCreatedTo"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                ref="dateCreatedToValue"
                v-model="dateCreatedToValue"
                outlined
                placeholder="DD/MM/YYYY"
                dense
                :error-messages="$t(errorDateReceivedTo)"
                v-bind="attrs"
                class="text--body-5"
                v-on="on"
                @click:append="menuDateCreatedTo = !menuDateCreatedTo"
              >
                <template v-slot:append>
                  <img
                    src="@/assets/icons/calendar.svg"
                    alt=""
                    class="hover--pointer"
                    @click="menuDateCreatedTo = !menuDateCreatedTo"
                  >
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="dateCreatedToPicker"
              format="DD/MM/YYYY"
              :locale="localDate"
              no-title
              show-adjacent-months
              @input="menuDateCreatedTo = false"
            />
          </v-menu>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
// Lib
import moment from 'moment'

// Constants
import constants from '@/constants'

// Services
import { ContractService } from '@/modules/econtract/services/contractService'

export default {
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    searchContract: {
      type: Function,
      default: undefined
    },
    showAdvance: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      // menuTimeSign: null,
      // timeSign: null,
      // timeSignValue: null,
      // trang thai xu ly
      listProcessByProcessType: [],
      listProcessStatus: {
        main: [
          // Ky
          { label: 'contract.label.docStates.all', value: 'ALL' },
          {
            label: 'contract.statusMain.unprocessed',
            value: constants.SIGN_PROCCESS_STATUS.UNPROCESSED
          },
          {
            label: 'contract.statusMain.processed',
            value: constants.SIGN_PROCCESS_STATUS.PROCESSED
          },
          {
            label: 'contract.statusMain.reject',
            value: constants.SIGN_PROCCESS_STATUS.REJECTED
          }
        ],
        reviewer: [
          // xem xet
          { label: 'contract.label.docStates.all', value: 'ALL' },
          {
            label: 'contract.statusReviewer.unprocessed',
            value: constants.SIGN_PROCCESS_STATUS.UNPROCESSED
          },
          {
            label: 'contract.statusReviewer.processed',
            value: constants.SIGN_PROCCESS_STATUS.PROCESSED
          },
          {
            label: 'contract.statusReviewer.reject',
            value: constants.SIGN_PROCCESS_STATUS.REJECTED
          }
        ],
        flashes: [
          // ky nhay
          { label: 'contract.label.docStates.all', value: 'ALL' },
          {
            label: 'contract.statusFlashes.unprocessed',
            value: constants.SIGN_PROCCESS_STATUS.UNPROCESSED
          },
          {
            label: 'contract.statusFlashes.processed',
            value: constants.SIGN_PROCCESS_STATUS.PROCESSED
          },
          {
            label: 'contract.statusFlashes.reject',
            value: constants.SIGN_PROCCESS_STATUS.REJECTED
          }
        ]
      },
      // Bo loc
      positionsInContract: [
        { name: 'contract.label.docStates.all', value: '' },
        {
          name: 'contract-manager.search.contractCreated',
          value: constants.POSITIONS_CONTRACT.CREATOR
        },
        {
          name: 'contract-manager.search.contractRecieved',
          value: constants.POSITIONS_CONTRACT.RECEIVER
        },
        {
          name: 'contract-manager.search.contractGroup',
          value: constants.POSITIONS_CONTRACT.ORGANIZATIONS
        },
        {
          name: 'contract-manager.search.contractDeleted',
          value: constants.POSITIONS_CONTRACT.DELETED
        },
        {
          name: 'contract-manager.search.contractExpired',
          value: constants.POSITIONS_CONTRACT.EXPIRED
        }
      ],
      userTypes: [
        { name: 'contract.label.docStates.all', value: '' },
        { name: 'contract.group', value: constants.GROUPS.ORGANIZATION },
        { name: 'contract.personal', value: constants.GROUPS.PERSONAL }
      ],
      select: { value: 'ALL' },
      //   "contractCreated": "Hợp đồng tôi tạo",
      // "contractRecieved": "Hợp đồng tôi nhận",
      // "contractGroup": "Hợp đồng đơn vị",
      // "contractDeleted": "Hợp đồng đã xóa",
      // "contractExpired": "Hợp đồng hết hiệu lực"
      // Loai hop dong
      contractTypes: [],
      // Menu date
      menuDateCreatedFrom: null,
      menuDateCreatedTo: null,
      dateCreatedFromPicker: null,
      dateCreatedToPicker: null,
      // Input date value
      dateCreatedFromValue: null,
      dateCreatedToValue: null,

      menuExpiredFrom: null,
      menuExpiredTo: null,

      expiredFromPicker: null,
      expiredToPicker: null,

      expiredFromValue: null,
      expiredToValue: null,

      errorDateCreatedFrom: null,
      errorDateReceivedTo: null,
      errorDateExpiredFrom: null,
      errorDateExpiredTo: null,
      isValidDate: true
    }
  },
  computed: {
    checkProcessContract() {
      return (
        this.formdata.searchType ===
        constants.SEARCH_TYPE_CONTRACT.PROCESS_CONTRACT
      )
    },
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },
    dateForm() {
      let text = 'contract.label.dateFrom'
      if (
        this.formdata.searchType ===
        constants.SEARCH_TYPE_CONTRACT.PROCESS_CONTRACT
      ) {
        text = 'contract.label.dateFormProcess'
      }
      return text
    }
  },
  watch: {
    showAdvance() {
      this.initDateRecived()
      if (!this.showAdvance) {
        this.formdata.contractType = ''
        this.formdata.contractCondition = ''
        this.formdata.effectDateFrom = ''
        this.formdata.effectDateTo = ''
        this.formdata.customerInfo = ''
        this.expiredFromValue = ''
        this.expiredToValue = ''
        this.formdata.toDate = moment().format('DD/MM/YYYY').replaceAll('/', '')

        this.searchContract()
      }
    },
    dateCreatedFromPicker(date) {
      if (date) this.dateCreatedFromValue = this.formatDate(date)
    },
    dateCreatedToPicker(date) {
      if (date) this.dateCreatedToValue = this.formatDate(date)
    },
    expiredFromPicker(date) {
      if (date) this.expiredFromValue = this.formatDate(date)
    },
    expiredToPicker(date) {
      if (date) this.expiredToValue = this.formatDate(date)
    },
    dateCreatedFromValue() {
      this.errorDateCreatedFrom = ''
      if (this.dateCreatedFromValue.length > 0) {
        const isValid = moment(
          this.dateCreatedFromValue,
          'DD/MM/YYYY',
          true
        ).isValid()
        this.errorDateCreatedFrom = isValid
          ? ''
          : this.$t('contract.dateInvalid', { name: this.$t(this.dateForm) })
        if (isValid) {
          this.dateCreatedFromPicker = moment(
            this.dateCreatedFromValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
          const selectDate = moment(this.dateCreatedToValue, 'DD/MM/YYYY')
          const timeExpired = moment(this.dateCreatedFromValue, 'DD/MM/YYYY')
          const diff = selectDate.diff(timeExpired, 'days')
          this.formdata.fromDate = this.dateCreatedFromValue.replaceAll('/', '')
          if (diff < 0) {
            this.errorDateCreatedFrom = 'contract.compareDate'
          } else if (diff > 365) {
            this.errorDateReceivedTo = 'contract.dateExpire'
          } else {
            this.errorDateReceivedTo = ''
            this.$emit('create-date-from-change', this.dateCreatedFromValue)
          }
        } else {
          this.dateCreatedFromPicker = null
          this.formdata.fromDate = null
        }
      } else {
        this.formdata.fromDate = null
        this.dateCreatedFromPicker = null
        this.errorDateCreatedFrom = 'contract.dateRequired'
      }
    },
    dateCreatedToValue() {
      this.errorDateReceivedTo = ''
      if (this.dateCreatedToValue.length > 0) {
        const isValid = moment(
          this.dateCreatedToValue,
          'DD/MM/YYYY',
          true
        ).isValid()
        this.errorDateReceivedTo = isValid
          ? ''
          : this.$t('contract.dateInvalid', { name: this.$t(this.dateForm) })
        if (isValid) {
          this.dateCreatedToPicker = moment(
            this.dateCreatedToValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
          const selectDate = moment(this.dateCreatedToValue, 'DD/MM/YYYY')
          const timeExpired = moment(this.dateCreatedFromValue, 'DD/MM/YYYY')
          this.formdata.toDate = this.dateCreatedToValue.replaceAll('/', '')
          const diff = selectDate.diff(timeExpired, 'days')
          if (diff < 0) {
            this.errorDateReceivedTo = 'contract.compareDate'
          } else if (diff > 365) {
            this.errorDateReceivedTo = 'contract.dateExpire'
          } else {
            this.errorDateCreatedFrom = ''
            this.$emit('create-date-to-change', this.dateCreatedToValue)
          }
        } else {
          this.dateCreatedToPicker = null
          this.formdata.toDate = null
        }
      } else {
        this.dateCreatedToPicker = null
        this.formdata.toDate = null
        this.errorDateReceivedTo = 'contract.dateRequired'
      }
    },
    expiredFromValue() {
      this.errorDateExpiredFrom = ''
      this.errorDateExpiredTo = ''

      if (this.expiredFromValue.length > 0) {
        this.formdata.effectDateFrom = this.expiredFromValue.replaceAll('/', '')
        const isValid = moment(
          this.expiredFromValue,
          'DD/MM/YYYY',
          true
        ).isValid()
        this.errorDateExpiredFrom = isValid ? '' : 'contract.dateExpireInvalid'
        if (isValid) {
          this.expiredFromPicker = moment(
            this.expiredFromValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
          if (this.expiredToValue) {
            const selectDate = moment(this.expiredToValue, 'DD/MM/YYYY')
            const timeExpired = moment(this.expiredFromValue, 'DD/MM/YYYY')
            const diff = selectDate.diff(timeExpired, 'days')
            if (diff < 0) {
              this.errorDateExpiredTo = 'contract.compareDate'
            } else {
              this.errorDateExpiredTo = ''
              this.$emit('expired-from-change', this.expiredFromValue)
            }
          } else {
            this.errorDateExpiredTo = ''
            this.$emit('expired-from-change', this.expiredFromValue)
          }
        } else {
          this.expiredFromPicker = null
          this.formdata.effectDateFrom = null
        }
      } else {
        this.expiredFromPicker = null
        this.formdata.effectDateFrom = null
        this.errorDateExpiredFrom = ''
      }
    },
    expiredToValue() {
      this.errorDateExpiredFrom = ''
      this.errorDateExpiredTo = ''
      if (this.expiredToValue.length > 0) {
        this.formdata.effectDateTo = this.expiredToValue.replaceAll('/', '')
        const isValid = moment(
          this.expiredToValue,
          'DD/MM/YYYY',
          true
        ).isValid()
        this.errorDateExpiredTo = isValid ? '' : 'contract.dateExpireInvalid'
        if (isValid) {
          this.expiredToPicker = moment(
            this.expiredToValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
          if (this.expiredFromValue) {
            const selectDate = moment(this.expiredToValue, 'DD/MM/YYYY')
            const timeExpired = moment(this.expiredFromValue, 'DD/MM/YYYY')
            const diff = selectDate.diff(timeExpired, 'days')
            if (diff >= 0) {
              this.$emit('expired-to-change', this.expiredToValue)
            } else {
              this.errorDateExpiredTo = 'contract.compareDate'
            }
          } else {
            this.$emit('expired-to-change', this.expiredToValue)
          }
        } else {
          this.expiredToPicker = null
          this.formdata.effectDateTo = null
        }
      } else {
        this.expiredToPicker = null
        this.formdata.effectDateTo = null
        this.errorDateExpiredTo = ''
        this.$emit('expired-to-change', this.expiredToValue)
      }
    }
  },
  created() {
    this.getListContractType()
  },
  mounted() {
    this.initDateRecived()
  },
  methods: {
    initDateRecived() {
      const yearBefore = moment()
        .subtract(365, 'days')
        .format('DD/MM/YYYY')
      const currentDate = moment().format('DD/MM/YYYY')

      this.dateCreatedFromValue = yearBefore
      this.dateCreatedToValue = currentDate
    },

    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },

    // Lay danh sach loai hop dong
    async getListContractType() {
      try {
        const { data } = await ContractService.getListFormulaType()
        this.contractTypes = data
        this.contractTypes.unshift({
          name: 'contract.label.docStates.all',
          id: ''
        })
      } catch (error) {
        console.log(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
