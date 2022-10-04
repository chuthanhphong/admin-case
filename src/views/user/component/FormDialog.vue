<template>
  <div class="wrap-form-dialog">
    <div class="dialog-form">
      <v-container>
        <v-row class="form-group">
          <v-col md="4">
            <label class="text--label">
              {{ $t('users.addSignature.typeImage') }}</label>
            <v-select
              v-model="formData.userId"
              outlined
              :no-data-text="$t('users.itemGroupName')"
              maxlength="255"
              dense
              :menu-props="{
                bottom: true,
                offsetY: true,
                maxWidth: 409
              }"
              :placeholder="$t('contract.inputName')"
            />
          </v-col>
          <v-col md="4">
            <label class="text--label">
              {{ $t('users.addSignature.formality') }}
            </label>
            <v-select
              v-model="formData.email"
              outlined
              :no-data-text="$t('users.itemGroupName')"
              maxlength="255"
              dense
              :menu-props="{
                bottom: true,
                offsetY: true,
                maxWidth: 409
              }"
              :placeholder="$t('contract.inputName')"
            />
          </v-col>
        </v-row>
        <v-row class="form-group">
          <v-col md="4">
            <v-menu
              v-model="menuExpiredFrom"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <label class="text--label">
                  {{ $t('users.addSignature.time') }}
                </label>
                <v-text-field
                  v-model="expiredFromValue"
                  outlined
                  placeholder="DD/MM/YYYY"
                  dense
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
          </v-col>
          <v-col md="4">
            <v-menu
              v-model="menuExpiredTo"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <label class="text--label">
                  {{ $t('users.addSignature.timeExpired') }}
                </label>
                <v-text-field
                  v-model="expiredToValue"
                  outlined
                  placeholder="DD/MM/YYYY"
                  dense
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
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import rules from '@/mixins/rules'

export default {
  mixins: [rules],
  props: {
    formData: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      menuExpiredFrom: null,
      menuExpiredTo: null,

      expiredFromPicker: null,
      expiredToPicker: null,

      expiredFromValue: null,
      expiredToValue: null,

      errorDateExpiredFrom: null,
      errorDateExpiredTo: null
    }
  },
  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    }
  },
  watch: {
    expiredFromPicker(date) {
      this.expiredFromValue = this.formatDate(date)
    },
    expiredToPicker(date) {
      this.expiredToValue = this.formatDate(date)
    },
    expiredFromValue() {
      this.errorDateExpiredFrom = ''
      this.errorDateExpiredTo = ''

      if (this.expiredFromValue.length > 0) {
        this.formData.effectDateFrom = this.expiredFromValue.replaceAll('/', '')
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
            }
          } else {
            this.formData.effectDateFrom = null
            this.errorDateExpiredTo = ''
          }
        } else {
          this.formData.effectDateFrom = null
          this.formData.effectDateFrom = null
        }
      } else {
        this.formData.effectDateFrom = null
        this.errorDateExpiredFrom = ''
      }
    },
    expiredToValue() {
      this.errorDateExpiredFrom = ''
      this.errorDateExpiredTo = ''

      if (this.expiredToValue.length > 0) {
        this.formData.effectDateTo = this.expiredToValue.replaceAll('/', '')
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
              this.formData.effectDateFrom
            } else {
              this.errorDateExpiredTo = 'contract.compareDate'
            }
          }
        } else {
          this.expiredToPicker = null
          this.formData.effectDateTo = null
        }
      } else {
        this.formData.effectDateTo = null
        this.errorDateExpiredTo = ''
      }
    }
  },
  created() {},
  methods: {
    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
    async accept() {
      this.$emit('accept', this.formData)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-form {
  margin: 0 20px;
  .form-group {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    label {
      font-size: 12px;
      width: 130px;
      position: relative;
      font-weight: bold;
      text-align: right;
      padding-right: 30px;
    }
    .col {
      padding: 12px 0 0 0;
    }
    .wrap-users-list {
      position: relative;
      .wrap-users {
        position: absolute;
        width: 100%;
        top: 50px;
        max-height: 300px;
        overflow-y: auto;
        border-radius: 5px;
        border: 1px solid #ccc;
        margin-top: 2px;
        z-index: 1;
        background: #fff;
      }
    }
  }
}
</style>
