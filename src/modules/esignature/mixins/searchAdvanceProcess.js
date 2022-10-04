import moment from 'moment'
import constants from '@/constants'

export default {
  data() {
    return {
      // Trang thai van ban toi tao
      selectDocState: { value: constants.ALL },
      lstDocStates: [
        { label: 'electronicSign.docState.all', value: constants.ALL },
        {
          label: 'electronicSign.docState.in_progress',
          value: constants.DOC_STATES.IN_PROGRESS
        },
        {
          label: 'electronicSign.docState.cancel',
          value: constants.DOC_STATES.CANCEL
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
      showProcessStatus: false,
      nameDate: 'document.label.dateFormProcess' // Ten date
    }
  },
  watch: {
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

  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    }
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
    },

    onchangeSelectProcessStatus(val) {
      this.formdata.processStatus = val.value === constants.ALL ? '' : val.value
      this.searchDocument()
    }
  }
}
