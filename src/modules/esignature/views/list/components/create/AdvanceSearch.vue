<template>
  <div
    class="wrap-advance-search-esignature px-2 pb-0"
    :class="claszz ? 'd-none' : ''"
  >
    <v-row class="ma-0">
      <!-- Trang thai van ban -->
      <v-col class="pa-0 pr-7 md-4">
        <span class="color--label text--label-1 font--bold">
          {{ $t('electronicSign.textStatus') }}
        </span>

        <v-select
          v-model="selectDocState"
          :items="lstDocStates"
          :item-text="item => $t(item.label)"
          item-value="value"
          return-object
          outlined
          attach
          :menu-props="{
            bottom: true,
            offsetY: true
          }"
          class="text--body-1"
          dense
          :placeholder="$t('electronicSign.textStatus')"
          @change="onchangeSelect(`${selectDocState.value}`)"
        />
      </v-col>

      <!-- ngay tao date from -->
      <v-col class="pa-0 px-4 md-4">
        <span
          class="color--label text--label-1 font--bold"
        >{{ $t('electronicSign.dateFrom') }} <span class="red--text">*</span>
        </span>
        <v-menu
          v-model="menuDateRecievedFrom"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              ref="dateReceivedFromValue"
              v-model="dateReceivedFromValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              class="text--body-1"
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              :error-messages="$t(errorDateReceivedFrom)"
              v-on="on"
              @click:append="menuDateRecievedFrom = !menuDateRecievedFrom"
            />
          </template>
          <v-date-picker
            v-model="dateReceivedFromPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="menuDateRecievedFrom = false"
          />
        </v-menu>
      </v-col>

      <!-- ngay tao date to -->
      <v-col class="pa-0 pl-7 md-4">
        <span
          class="color--label text--label-1 font--bold"
        >{{ $t('dateTo') }}<span class="red--text">*</span>
        </span>
        <v-menu
          v-model="menuDateRecivedTo"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              ref="dateReceivedToValue"
              v-model="dateReceivedToValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              class="text--body-1"
              :error-messages="$t(errorDateReceivedTo)"
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              v-on="on"
              @click:append="menuDateRecivedTo = !menuDateRecivedTo"
            />
          </template>
          <v-date-picker
            v-model="dateReceivedToPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="menuDateRecivedTo = false"
          />
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import constants from '@/constants'
import moment from 'moment'
export default {
  name: 'AdvanceSearch',
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    searchDocument: {
      type: Function,
      default: undefined
    },
    showAdvance: {
      type: Boolean,
      default: undefined
    },
    searchType: {
      type: String,
      default: undefined
    },
    claszz: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // Trang thai van ban toi tao
      selectDocState: { value: constants.ALL },
      lstDocStates: [
        { label: 'electronicSign.docState.all', value: constants.ALL },
        {
          label: 'electronicSign.docState.draft',
          value: constants.DOC_STATES.DRAFT
        },
        {
          label: 'electronicSign.docState.in_progress',
          value: constants.DOC_STATES.IN_PROGRESS
        },
        {
          label: 'electronicSign.docState.complete',
          value: constants.DOC_STATES.COMPLETE
        },
        {
          label: 'electronicSign.docState.reject',
          value: constants.DOC_STATES.REJECT
        },
        {
          label: 'electronicSign.docState.cancel',
          value: constants.DOC_STATES.CANCEL
        },
        {
          label: 'electronicSign.docState.promulgate',
          value: constants.DOC_STATES.PROMULGATE
        },
        {
          label: 'electronicSign.docState.cancelPromulgate',
          value: constants.DOC_STATES.PROMULGATE_CANCEL
        }
      ],
      menuDateRecievedFrom: null,
      menuDateRecivedTo: null,
      dateReceivedFromPicker: null,
      dateReceivedToPicker: null,
      errorDateReceivedFrom: null,
      errorDateReceivedTo: null,
      // Input date value
      dateReceivedFromValue: null,
      dateReceivedToValue: null,
      nameDate: 'electronicSign.dateCreate' // Ten date
    }
  },
  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    }
  },
  watch: {
    showAdvance() {
      this.initDateRecived()
      if (!this.showAdvance) {
        this.selectDocState = { value: constants.ALL }
        this.searchDocument()
      }
    },
    dateReceivedFromPicker(date) {
      if (date) {
        this.dateReceivedFromValue = this.formatDate(date)
      }
    },
    dateReceivedToPicker(date) {
      if (date) {
        this.dateReceivedToValue = this.formatDate(date)
      }
    },
    dateReceivedFromValue() {
      this.errorDateReceivedFrom = ''
      if (this.dateReceivedFromValue.length > 0) {
        this.validateDateFrom()
        this.validateDateTo()
        this.$emit('submission-date-from-change', this.dateReceivedFromValue)
      } else {
        this.formdata.fromDate = null
        this.dateReceivedFromPicker = null
        this.errorDateReceivedFrom = 'electronicSign.dateRequired'
      }
    },
    dateReceivedToValue() {
      if (this.dateReceivedToValue.length > 0) {
        this.validateDateFrom()
        this.validateDateTo()
        this.$emit('submission-date-to-change', this.dateReceivedToValue)
      } else {
        this.formdata.toDate = null
        this.dateReceivedToPicker = null
        this.errorDateReceivedTo = 'electronicSign.dateRequired'
      }
    }
  },
  created() {},
  mounted() {
    this.initDateRecived()
  },
  methods: {
    validateDateFrom() {
      let isValid = true

      if (!moment(this.dateReceivedFromValue, 'DD/MM/YYYY', true).isValid()) {
        this.formdata.fromDate = this.dateReceivedFromValue.replaceAll('/', '')
        this.errorDateReceivedFrom = this.$t('electronicSign.dateInvalid', {
          name: this.$t('electronicSign.dateCreate')
        })
        isValid = false
        this.dateReceivedFromPicker = ''
      }
      if (isValid) {
        this.formdata.fromDate = this.dateReceivedFromValue.replaceAll('/', '')
        this.dateReceivedFromPicker = moment(
          this.dateReceivedFromValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')
        const selectDate = moment(this.dateReceivedToValue, 'DD/MM/YYYY')
        const timeExpired = moment(this.dateReceivedFromValue, 'DD/MM/YYYY')
        const diff = selectDate.diff(timeExpired, 'days')

        this.errorDateReceivedFrom = ''
        if (!moment(this.dateReceivedToValue, 'DD/MM/YYYY', true).isValid()) {
          this.errorDateReceivedTo = this.$t('electronicSign.dateInvalid', {
            name: this.$t('electronicSign.dateCreate')
          })

          if (!this.dateReceivedToValue) {
            this.errorDateReceivedTo = 'electronicSign.dateRequired'
          }
          return
        }
        if (diff < 0) {
          this.errorDateReceivedTo = 'electronicSign.compareDate'
          this.formdata.fromDate = null
          return
        }
        if (diff > 365) {
          this.errorDateReceivedTo = 'electronicSign.dateExpire'
          this.formdata.fromDate = null
          return
        }
        this.errorDateReceivedFrom = ''
        this.errorDateReceivedTo = ''

        if (this.dateReceivedToPicker) this.errorDateReceivedTo = ''
      }
    },

    validateDateTo() {
      let isValid = true

      if (!moment(this.dateReceivedToValue, 'DD/MM/YYYY', true).isValid()) {
        this.formdata.toDate = this.dateReceivedToValue.replaceAll('/', '')
        this.errorDateReceivedTo = this.$t('electronicSign.dateInvalid', {
          name: this.$t('electronicSign.dateCreate')
        })
        isValid = false
        this.dateReceivedToPicker = ''
      }
      if (isValid) {
        this.formdata.toDate = this.dateReceivedToValue.replaceAll('/', '')
        this.dateReceivedToPicker = moment(
          this.dateReceivedToValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')
        const selectDate = moment(this.dateReceivedToValue, 'DD/MM/YYYY')
        const timeExpired = moment(this.dateReceivedFromValue, 'DD/MM/YYYY')
        const diff = selectDate.diff(timeExpired, 'days')
        this.errorDateReceivedTo = ''

        if (!moment(this.dateReceivedFromValue, 'DD/MM/YYYY', true).isValid()) {
          this.errorDateReceivedFrom = this.$t('electronicSign.dateInvalid', {
            name: this.$t('electronicSign.dateCreate')
          })
          if (!this.dateReceivedFromValue) {
            this.errorDateReceivedFrom = 'electronicSign.dateRequired'
          }
          return
        }
        if (diff < 0) {
          this.errorDateReceivedTo = 'electronicSign.compareDate'
          this.formdata.toDate = null
          return
        }
        if (diff > 365) {
          this.errorDateReceivedTo = 'electronicSign.dateExpire'
          this.formdata.toDate = null
          return
        }

        if (this.dateReceivedFromPicker) this.errorDateReceivedFrom = ''
      }
    },

    onchangeSelect(value) {
      this.formdata.docState = value === constants.ALL ? '' : value
      this.searchDocument()
    },
    initDateRecived() {
      const yearBefore = moment().subtract(365, 'days').format('DD/MM/YYYY')
      const currentDate = moment().format('DD/MM/YYYY')
      this.dateReceivedFromValue = yearBefore
      this.dateReceivedToValue = currentDate
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    }
  }
}
</script>

<style
  lang="scss"
  src="@/modules/esignature/views/list/ListDocumentCreated.scss"
>
</style>
