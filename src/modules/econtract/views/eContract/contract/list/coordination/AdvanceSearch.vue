<template>
  <div class="wrap-advance-search px-2 py-4 pb-0 mt-3">
    <v-row justify="space-between" align="start" class="">
      <!-- Trang thai xu ly -->
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">{{
            $t('contract.label.processStatus')
          }}</label>
          <v-select
            v-model="selectProcessStatus"
            :no-data-text="$t('users.itemGroupName')"
            :items="listProcessByProcessType"
            :item-text="item => $t(item.label)"
            item-value="value"
            return-object
            outlined
            class="text--body-5"
            dense
            :placeholder="$t('contract.label.optionStatus')"
            @change="
              onchangeSelectProcessStatus(`${selectProcessStatus.value}`)
            "
          >
            <template v-slot:append>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-select>
        </div>
      </div>
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label
            class="text--body-5"
          >{{ $t(dateForm) }}<span class="red--text">*</span>:
            {{ $t('contract.label.from') }}</label>
          <v-menu
            v-model="menuDateRecievedFrom"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                ref="dateReceivedFromValue"
                v-model="dateReceivedFromValue"
                outlined
                class="text--body-5"
                placeholder="DD/MM/YYYY"
                dense
                v-bind="attrs"
                :error-messages="$t(errorDateReceivedFrom)"
                v-on="on"
                @click:append="menuDateRecievedFrom = !menuDateRecievedFrom"
              >
                <template v-slot:append>
                  <img
                    src="@/assets/icons/calendar.svg"
                    alt=""
                    class="hover--pointer"
                    @click="menuDateRecievedFrom = !menuDateRecievedFrom"
                  >
                </template>
              </v-text-field>
              <!-- @change="changeMinToDate" -->
            </template>
            <v-date-picker
              v-model="dateReceivedFromPicker"
              format="DD/MM/YYYY"
              :locale="localDate"
              no-title
              show-adjacent-months
              @input="menuDateRecievedFrom = false"
            />
          </v-menu>
        </div>
      </div>
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label
            class="text--body-5"
          >{{ $t('contract.label.to')
          }}<span class="red--text">*</span></label>
          <v-menu
            v-model="menuDateRecivedTo"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                ref="dateReceivedToValue"
                v-model="dateReceivedToValue"
                outlined
                placeholder="DD/MM/YYYY"
                dense
                class="text--body-5"
                :error-messages="$t(errorDateReceivedTo)"
                v-bind="attrs"
                v-on="on"
                @click:append="menuDateRecivedTo = !menuDateRecivedTo"
              >
                <template v-slot:append>
                  <img
                    src="@/assets/icons/calendar.svg"
                    alt=""
                    class="hover--pointer"
                    @click="menuDateRecivedTo = !menuDateRecivedTo"
                  >
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="dateReceivedToPicker"
              format="DD/MM/YYYY"
              :locale="localDate"
              no-title
              show-adjacent-months
              @input="menuDateRecivedTo = false"
            />
          </v-menu>
        </div>
      </div>
    </v-row>
    <v-row justify="space-between" align="start">
      <!-- Trang thai hop dong -->
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">{{
            $t('contract.label.contractStatus')
          }}</label>
          <v-select
            v-model="select"
            :items="lstDocStates"
            :item-text="item => $t(item.label)"
            item-value="value"
            return-object
            outlined
            class="text--body-5"
            dense
            :placeholder="$t('contract.label.contractStatus')"
            @change="onchangeSelect(`${select.value}`)"
          >
            <template v-slot:append>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-select>
        </div>
      </div>

      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label
            class="text--body-5"
          >{{ $t('contract.label.expired') }}:
            {{ $t('contract.label.from') }}
          </label>
          <v-menu
            v-model="menuExpiredFrom"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
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
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="text--body-5">{{ $t('contract.label.to') }}</label>
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
    </v-row>
  </div>
</template>

<script>
import moment from 'moment'
import constants from '@/constants'
import advanceSearchMixin from '@/modules/econtract/views/eContract/contract/list/mixins/advanceSearchMixin'
const docStates = constants.DOC_STATES
export default {
  mixins: [advanceSearchMixin],
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
      listProcessByProcessType: [
        { label: 'contract.label.docStates.all', value: 'ALL' },
        {
          label: 'contract.label.coordinateProcess.unprocessed',
          value: constants.SIGN_PROCCESS_STATUS.UNPROCESSED
        },
        {
          label: 'contract.label.coordinateProcess.processed',
          value: constants.SIGN_PROCCESS_STATUS.PROCESSED
        },
        {
          label: 'contract.label.coordinateProcess.rejected',
          value: constants.SIGN_PROCCESS_STATUS.REJECTED
        }
      ],
      selectProcessStatus: { value: 'ALL' },
      selectTypeContract: { value: 'ALL' },
      select: { value: 'ALL' },
      // trang thai hop dong
      lstDocStates: [
        { label: 'contract.label.docStates.all', value: 'ALL' },
        { label: 'contract.label.docStates.draft', value: docStates.DRAFT },
        {
          label: 'contract.label.docStates.in_progress',
          value: docStates.IN_PROGRESS
        },
        {
          label: 'contract.label.docStates.complete',
          value: docStates.COMPLETE
        },
        { label: 'contract.label.docStates.reject', value: docStates.REJECT },
        { label: 'contract.label.docStates.cancel', value: docStates.CANCEL }
      ],
      // trang thai hop dong dang xu ly
      lstDocStatesProcess: [
        { label: 'contract.label.docStates.all', value: 'ALL' },
        {
          label: 'contract.label.docStates.in_progress',
          value: docStates.IN_PROGRESS
        },
        {
          label: 'contract.label.docStates.complete',
          value: docStates.COMPLETE
        },
        { label: 'contract.label.docStates.reject', value: docStates.REJECT },
        { label: 'contract.label.docStates.cancel', value: docStates.CANCEL }
      ],
      // Menu date
      menuDateRecievedFrom: null,
      menuDateRecivedTo: null,
      dateReceivedFromPicker: null,
      dateReceivedToPicker: null,
      // Input date value
      dateReceivedFromValue: null,
      dateReceivedToValue: null,

      menuExpiredFrom: null,
      menuExpiredTo: null,

      expiredFromPicker: null,
      expiredToPicker: null,

      expiredFromValue: null,
      expiredToValue: null,

      minDateReceived: null,
      maxDateReceived: null,

      errorDateReceivedFrom: null,
      errorDateReceivedTo: null,
      errorDateExpiredFrom: null,
      errorDateExpiredTo: null
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
      let text = 'contract.label.dateArrival'
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
        this.selectProcessStatus = { value: 'ALL' }
        this.selectTypeContract = { value: 'ALL' }
        this.select = { value: 'ALL' }
        this.formdata.processStatus = ''
        this.formdata.docState = ''
        this.searchContract()
      }
    }
  },
  created() {
    const { docState } = this.$route.query
    if (docState) {
      this.select = { value: docState }
      this.onchangeSelect(docState)
    }
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
      this.minDateReceived = moment(yearBefore, 'DD/MM/YYYY', true).format(
        'YYYY-DD-MM'
      )
      this.maxDateReceived = moment(currentDate, 'DD/MM/YYYY', true).format(
        'YYYY-DD-MM'
      )
      // this.dateReceivedFromPicker = this.minDateReceived
      // this.dateReceivedToPicker = this.maxDateReceived
      this.dateReceivedFromValue = yearBefore
      this.dateReceivedToValue = currentDate
    },

    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },

    onchangeSelectProcessStatus(value) {
      this.formdata.processStatus = value === 'ALL' ? '' : value
      this.searchContract()
    },
    onchangeSelect(value) {
      this.formdata.docState = value === 'ALL' ? '' : value
      this.searchContract()
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  label {
    width: 180px !important;
  }
}
</style>
