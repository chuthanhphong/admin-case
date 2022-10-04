<template>
  <div class="wrap-advance-search px-2 py-4 pb-0 mt-3">
    <v-row justify="end" align="start" class="">
      <!-- loai xu ly -->
      <div
        v-if="checkProcessContract"
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="">{{ $t('contract.label.processType') }}</label>
          <v-select
            v-model="selectTypeContract"
            :items="listTypeContract"
            :item-text="item => $t(item.label)"
            item-value="value"
            return-object
            outlined
            class="text--label-1"
            dense
            :placeholder="$t('contract.label.contractStatus')"
            @change="onchangeSelectTypeContract(`${selectTypeContract.value}`)"
          />
        </div>
      </div>
      <!-- Trang thai xu ly -->
      <div
        v-if="checkProcessContract"
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="">{{ $t('contract.label.processStatus') }}</label>
          <v-select
            v-model="selectProcessStatus"
            :no-data-text="$t('users.itemGroupName')"
            :items="listProcessByProcessType"
            :item-text="item => $t(item.label)"
            item-value="value"
            return-object
            outlined
            class="text--label-1"
            :disabled="listProcessByProcessType.length == 0"
            dense
            :placeholder="$t('contract.label.optionStatus')"
            @change="
              onchangeSelectProcessStatus(`${selectProcessStatus.value}`)
            "
          />
        </div>
      </div>
      <!-- Trang thai hop dong -->
      <div
        v-if="!checkProcessContract"
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="">{{ $t('contract.label.contractStatus') }}</label>
          <v-select
            v-if="checkProcessContract"
            v-model="select"
            :items="lstDocStatesProcess"
            :item-text="item => $t(item.label)"
            item-value="value"
            return-object
            outlined
            class="text--label-1"
            dense
            :placeholder="$t('contract.label.contractStatus')"
            @change="onchangeSelect(`${select.value}`)"
          />
          <v-select
            v-else
            v-model="select"
            :items="lstDocStates"
            :item-text="item => $t(item.label)"
            item-value="value"
            class="text--label-1"
            return-object
            outlined
            dense
            :placeholder="$t('contract.label.contractStatus')"
            @change="onchangeSelect(`${select.value}`)"
          />
        </div>
      </div>
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label
            class=""
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
                placeholder="DD/MM/YYYY"
                dense
                class="text--label-1"
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
            class=""
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
                class="text--label-1"
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
    <v-row justify="end" align="start">
      <!-- Trang thai hop dong -->
      <div
        v-if="checkProcessContract"
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="">{{ $t('contract.label.contractStatus') }}</label>
          <v-select
            v-if="checkProcessContract"
            v-model="select"
            :items="lstDocStatesProcess"
            :item-text="item => $t(item.label)"
            item-value="value"
            return-object
            class="text--label-1"
            outlined
            dense
            :placeholder="$t('contract.label.contractStatus')"
            @change="onchangeSelect(`${select.value}`)"
          />
          <v-select
            v-else
            v-model="select"
            :items="lstDocStates"
            :item-text="item => $t(item.label)"
            item-value="value"
            return-object
            outlined
            dense
            :placeholder="$t('contract.label.contractStatus')"
            @change="onchangeSelect(`${select.value}`)"
          />
        </div>
      </div>

      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label
            class=""
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
                class="text--label-1"
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
          <label class="">{{ $t('contract.label.to') }}</label>
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
                class="text--label-1"
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
              @input="menuExpiredTo = false"
            />
          </v-menu>
        </div>
      </div>
    </v-row>
    <v-row class="d-flex justify-end mt-0">
      <div class="d-flex align-center">
        <v-icon>mdi-alert-circle-outline</v-icon>
        <b class="notice--text pl-2">{{ $t('searchAdvanceNote') }}</b>
      </div>
    </v-row>
  </div>
</template>

<script>
import moment from 'moment'
import constants from '@/constants'

const docStates = constants.DOC_STATES
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
      // loai xu ly
      listTypeContract: [
        { label: 'contract.label.docStates.all', value: 'ALL' },
        {
          label: 'contract.signType.main',
          value: constants.SIGN_USER_TYPE.MAIN
        },
        {
          label: 'contract.signType.flashes',
          value: constants.SIGN_USER_TYPE.FLASHES
        },
        {
          label: 'contract.signType.reviewer',
          value: constants.SIGN_USER_TYPE.REVIEWER
        }
      ],
      selectProcessStatus: { value: '' },
      selectTypeContract: { value: 'ALL' },
      select: { value: 'ALL' },
      // trang thai hop dong toi tao
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
        this.selectProcessStatus = { value: 'ALL' }
        this.selectTypeContract = { value: 'ALL' }
        this.select = { value: 'ALL' }
      }
    },
    dateReceivedFromPicker(date) {
      this.dateReceivedFromValue = this.formatDate(date)
    },
    dateReceivedToPicker(date) {
      this.dateReceivedToValue = this.formatDate(date)
    },
    expiredFromPicker(date) {
      this.expiredFromValue = this.formatDate(date)
    },
    expiredToPicker(date) {
      this.expiredToValue = this.formatDate(date)
    },
    dateReceivedFromValue() {
      if (this.dateReceivedFromValue.length > 0) {
        this.formdata.fromDate = this.dateReceivedFromValue.replaceAll('/', '')
        const isValid = moment(
          this.dateReceivedFromValue,
          'DD/MM/YYYY',
          true
        ).isValid()
        this.errorDateReceivedFrom = isValid
          ? ''
          : this.$t('contract.dateInvalid', { name: this.$t(this.dateForm) })
        if (isValid) {
          this.dateReceivedFromPicker = moment(
            this.dateReceivedFromValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
          // this.formdata.fromDate = this.dateReceivedToValue
          const selectDate = moment(this.dateReceivedToValue, 'DD/MM/YYYY')
          const timeExpired = moment(this.dateReceivedFromValue, 'DD/MM/YYYY')
          const diff = selectDate.diff(timeExpired, 'days')
          if (diff < 0) {
            this.errorDateReceivedFrom = 'contract.compareDate'
          } else if (diff > 365) {
            this.errorDateReceivedTo = 'contract.dateExpire'
          } else {
            this.$emit(
              'submission-date-from-change',
              this.dateReceivedFromValue
            )
            this.errorDateReceivedTo = ''
          }
        }
      } else {
        this.formdata.fromDate = null
        this.errorDateReceivedFrom = 'contract.dateRequired'
      }
    },
    dateReceivedToValue() {
      if (this.dateReceivedToValue.length > 0) {
        this.formdata.toDate = this.dateReceivedToValue.replaceAll('/', '')
        const isValid = moment(
          this.dateReceivedToValue,
          'DD/MM/YYYY',
          true
        ).isValid()
        this.errorDateReceivedTo = isValid
          ? ''
          : this.$t('contract.dateInvalid', { name: this.$t(this.dateForm) })
        if (isValid) {
          this.dateReceivedToPicker = moment(
            this.dateReceivedToValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
          const selectDate = moment(this.dateReceivedToValue, 'DD/MM/YYYY')
          const timeExpired = moment(this.dateReceivedFromValue, 'DD/MM/YYYY')
          const diff = selectDate.diff(timeExpired, 'days')
          if (diff < 0) {
            this.errorDateReceivedTo = 'contract.compareDate'
          } else if (diff > 365) {
            this.errorDateReceivedTo = 'contract.dateExpire'
          } else {
            this.$emit('submission-date-to-change', this.dateReceivedToValue)
          }
        }
      } else {
        this.formdata.toDate = null
        this.errorDateReceivedTo = 'contract.dateRequired'
      }
    },
    expiredFromValue() {
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
          this.formdata.effectDateFrom = null
        }
      } else {
        this.formdata.effectDateFrom = null
        this.errorDateExpiredFrom = ''
        this.$emit('expired-from-change', this.expiredFromValue)
      }
    },
    expiredToValue() {
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
              this.formdata.effectDateFrom
              this.$emit('expired-to-change', this.expiredToValue)
            } else {
              this.errorDateExpiredTo = 'contract.compareDate'
            }
          } else {
            this.$emit('expired-to-change', this.expiredToValue)
          }
        } else {
          this.formdata.effectDateTo = null
        }
      } else {
        this.formdata.effectDateTo = null
        this.errorDateExpiredTo = ''
        this.$emit('expired-to-change', this.expiredToValue)
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
    onchangeSelectTypeContract(value) {
      this.formdata.typeContract = value === 'ALL' ? '' : value
      switch (this.formdata.typeContract) {
        case constants.SIGN_USER_TYPE.MAIN:
          this.listProcessByProcessType = this.listProcessStatus.main
          break
        case constants.SIGN_USER_TYPE.REVIEWER:
          this.listProcessByProcessType = this.listProcessStatus.reviewer
          break
        case constants.SIGN_USER_TYPE.FLASHES:
          this.listProcessByProcessType = this.listProcessStatus.flashes
          break
        default:
          this.listProcessByProcessType = []
      }
      this.searchContract()
    },
    onchangeSelect(value) {
      this.formdata.docState = value === 'ALL' ? '' : value
      this.searchContract()
    }
  }
}
</script>

<style lang="scss" scoped></style>
