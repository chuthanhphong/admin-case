<template>
  <div class="wwrap-advance-search-esignature px-2 py-4 pb-0 mt-8" :class="claszz ? 'd-none' : ''">
    <v-row justify="space-around">
      <!-- Hinh thuc van ban -->
      <div
        class="d-flex align-start flex-column flex-md-row align-md-center justify-end"
      >
        <div class="d-flex flex-column form-group">
          <label class="color--label text--label-1 font--bold">
            {{ $t('electronicSign.create.documentForm') }}
          </label>

          <v-autocomplete
            v-model="formulaTypeId"
            dense
            :placeholder="$t('document.placeholder.documentForm')"
            outlined
            attach
            :no-data-text="$t('noData')"
            required
            :filter="filterItems"
            :menu-props="{
              bottom: true,
              offsetY: true
            }"
            class="text--body-1"
            :items="lstContractType"
            :item-text="(item) => $t(item.name)"
            item-value="id"
            @change="onchangeSelectFormula(formulaTypeId)"
          >
            <vue-feather slot="append" class="grey--text" type="search" />
          </v-autocomplete>
        </div>
      </div>

      <!-- Trang thai van ban -->
      <div
        class="d-flex align-start flex-column flex-md-row align-md-center justify-end"
      >
        <div class="d-flex flex-column form-group">
          <label class="color--label text--label-1 font--bold">
            {{ $t('document.label.contractStatus') }}
          </label>

          <v-select
            v-model="selectDocState"
            :items="lstDocStates"
            :item-text="(item) => $t(item.label)"
            item-value="value"
            attach
            class="text--body-1"
            :menu-props="{
              bottom: true,
              offsetY: true
            }"
            return-object
            outlined
            dense
            :placeholder="$t('electronicSign.textStatus')"
            @change="onchangeSelect(`${selectDocState.value}`)"
          />
        </div>
      </div>

      <!-- ngay tao date from -->
      <div
        class="d-flex align-start flex-column flex-md-row align-md-center justify-end"
      >
        <div class="d-flex flex-column form-group">
          <label class="color--label text--label-1 font--bold">{{ $t('submissionDate') }} <span class="red--text">*</span>
          </label>
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
        </div>
      </div>

      <!-- ngay tao date to -->
      <div
        class="d-flex align-start flex-column flex-md-row align-md-center justify-end"
      >
        <div class="d-flex flex-column form-group">
          <label class="color--label text--label-1 font--bold">{{ $t('dateTo') }}<span class="red--text">*</span>
          </label>
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
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
import constants from '@/constants'
import moment from 'moment'
import { DocumentService } from '@/modules/esignature/services/documentService'
import filterItems from '@/mixins/filterItems.js'

export default {
  name: 'AdvanceSearch',
  mixins: [filterItems],
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
          label: 'electronicSign.docState.complete',
          value: constants.DOC_STATES.COMPLETE
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
      nameDate: 'document.label.dateFormProcess', // Ten date
      formulaTypeId: '',
      lstContractType: []
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
        this.formulaTypeId = ''
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
  created() {
    this.getDocFormula()
  },
  mounted() {
    this.initDateRecived()
  },
  methods: {
    validateDateFrom() {
      let isValid = true
      if (!moment(this.dateReceivedFromValue, 'DD/MM/YYYY', true).isValid()) {
        this.formdata.fromDate = this.dateReceivedFromValue.replaceAll('/', '')
        this.errorDateReceivedFrom = this.$t('electronicSign.dateInvalid', {
          name: this.$t('electronicSign.submissionDate')
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
            name: this.$t('electronicSign.submissionDate')
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
          name: this.$t('electronicSign.submissionDate')
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

        if (
          !moment(this.dateReceivedFromValue, 'DD/MM/YYYY', true).isValid()
        ) {
          this.errorDateReceivedFrom = this.$t('electronicSign.dateInvalid', {
            name: this.$t('electronicSign.submissionDate')
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
    async getDocFormula() {
      try {
        const response = await DocumentService.getDocFormula()
        this.lstContractType = response.data
        if (this.lstContractType) {
          this.lstContractType.unshift({
            name: 'electronicSign.docState.all',
            id: ''
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    onchangeSelectFormula(value) {
      this.formdata.formulaTypeId = value || ''
      this.searchDocument()
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
></style>
