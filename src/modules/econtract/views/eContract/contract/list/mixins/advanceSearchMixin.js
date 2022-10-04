import moment from 'moment'

export default {
  watch: {
    showAdvance() {
      this.initDateRecived()
      if (!this.showAdvance) {
        this.selectProcessStatus = { value: 'ALL' }
        this.selectTypeContract = { value: 'ALL' }
        this.select = { value: 'ALL' }
        this.formdata.effectDateFrom = ''
        this.effectDateFrom = ''
        this.expiredFromPicker = null
        this.expiredToPicker = null
        this.expiredFromValue = ''
        this.expiredToValue = ''
        this.formdata.toDate = moment().format('DD/MM/YYYY').replaceAll('/', '')

        this.searchContract()
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
    expiredFromPicker(date) {
      if (date) {
        this.expiredFromValue = this.formatDate(date)
      }
    },
    expiredToPicker(date) {
      if (date) {
        this.expiredToValue = this.formatDate(date)
      }
    },
    dateReceivedFromValue() {
      this.errorDateReceivedFrom = ''
      if (this.dateReceivedFromValue.length > 0) {
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
          this.formdata.fromDate = this.dateReceivedFromValue.replaceAll('/', '')
          if (diff < 0) {
            this.errorDateReceivedFrom = 'contract.compareDate'
          } else if (diff > 365) {
            this.errorDateReceivedTo = 'contract.dateExpire'
          } else {
            this.$emit(
              'submission-date-from-change',
              this.dateReceivedFromValue
            )
            this.errorDateReceivedFrom = ''
            this.errorDateReceivedTo = ''
          }
        } else {
          this.dateReceivedFromPicker = null
          this.formdata.fromDate = null
        }
      } else {
        this.dateReceivedFromPicker = null
        this.formdata.fromDate = null
        this.errorDateReceivedFrom = 'contract.dateRequired'
      }
    },
    dateReceivedToValue() {
      this.errorDateReceivedTo = ''
      if (this.dateReceivedToValue.length > 0) {
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
          this.formdata.toDate = this.dateReceivedToValue.replaceAll('/', '')
          if (diff < 0) {
            this.errorDateReceivedTo = 'contract.compareDate'
          } else if (diff > 365) {
            this.errorDateReceivedTo = 'contract.dateExpire'
          } else {
            this.$emit('submission-date-to-change', this.dateReceivedToValue)
            this.errorDateReceivedFrom = ''
            this.errorDateReceivedTo = ''
          }
        } else {
          this.dateReceivedToPicker = null
        }
      } else {
        this.formdata.toDate = null
        this.dateReceivedToPicker = null
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
          this.expiredFromPicker = null
          this.formdata.effectDateFrom = null
        }
      } else {
        this.formdata.effectDateFrom = null
        this.expiredFromPicker = null
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
          this.expiredToPicker = null
          this.formdata.effectDateTo = null
        }
      } else {
        this.formdata.effectDateTo = null
        this.expiredToPicker = null
        this.errorDateExpiredTo = ''
        this.$emit('expired-to-change', this.expiredToValue)
      }
    }
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
    }
  }
}
