<template>
  <v-dialog
    v-model="showDialog"
    max-width="70%"
    persistent
    content-class="border--dialog-20"
  >
    <div class="wrap--dialog-proclaim">
      <v-row class="ma-0">
        <v-spacer />
        <v-icon class="icon-close" @click="closeDialog()">
          mdi-window-close
        </v-icon>
      </v-row>

      <!-- Tittle dialog -->
      <h5 class="text-center text-capitalize">{{ $t('infoProclaim') }}</h5>
      <div class="esignature-dialog-proclaim-content">
        <!-- Icon close dialog -->

        <validation-observer ref="observer">
          <v-row class="px-7 pt-8 ma-0">
            <v-col cols="4" class="pa-0 pr-6">
              <!-- So dang ky -->
              <span class="text--label color--label">
                {{ $t('numRegisterProclaim') }}
              </span>
              <v-text-field
                v-model="formdata.numRegister"
                dense
                outlined
                maxlength="255"
                flat
                solo
                disabled
                class="text--body-1"
                @change="formdata.numRegister = trimSpace(formdata.numRegister)"
              />
            </v-col>

            <v-col cols="4" class="pa-0 px-3">
              <!-- Don vi ban hanh -->
              <span class="color--label text--label">
                {{ $t('electronicSign.create.issueGroup') }}
              </span>
              <span class="color--required"> *</span>
              <validation-provider
                name="issueGroup"
                rules="required"
                vid="issueGroup1"
              >
                <v-autocomplete
                  v-model="formdata.promulgateGroupId"
                  :no-data-text="$t('noData')"
                  :placeholder="$t('document.placeholder.issueGroup')"
                  :items="lstGroupProclaim"
                  item-text="groupName"
                  item-value="groupId"
                  outlined
                  attach
                  dense
                  disabled
                  class="text--body-1"
                />
              </validation-provider>
            </v-col>

            <v-col cols="4" class="pa-0 pl-6">
              <!-- Hinh thuc van ban -->
              <span class="color--label text--label">
                {{ $t('electronicSign.create.documentForm') }}
              </span>
              <span class="color--required"> *</span>
              <validation-provider
                v-slot="{ errors }"
                name="documentType"
                rules="required"
              >
                <v-autocomplete
                  v-model="formdata.formulaTypeId"
                  dense
                  :placeholder="$t('document.placeholder.documentForm')"
                  outlined
                  attach
                  :no-data-text="$t('noData')"
                  required
                  :error-messages="errors"
                  :filter="filterItems"
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :items="lstDocType"
                  :item-text="item => $t(item.name)"
                  item-value="id"
                  class="text--body-1"
                  @change="selectFormula(formdata.formulaTypeId)"
                >
                  <vue-feather slot="append" class="grey--text" type="search" />
                </v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>

          <v-row class="px-7 ma-0">
            <v-col cols="4" class="pa-0 pr-6">
              <!-- So van ban -->
              <span class="color--label text--label">
                {{ $t('numDoc') }}
              </span>
              <span class="color--required"> *</span>
              <v-text-field
                v-model="formdata.documentNumber"
                dense
                outlined
                :placeholder="$t('enterNumDoc')"
                flat
                solo
                class="text--body-1"
                :error-messages="$t(messageError)"
                maxlength="10"
                oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
                @input="onInputRegister()"
              />
            </v-col>

            <v-col cols="4" class="pa-0 px-3">
              <!-- So ky hieu van ban -->
              <span class="color--label text--label">
                {{ $t('numDoc2') }}
              </span>
              <span class="color--required"> *</span>
              <validation-provider
                v-slot="{ errors }"
                name="symbolDoc"
                rules="required"
              >
                <v-text-field
                  v-model="formdata.code"
                  dense
                  outlined
                  maxlength="100"
                  :placeholder="$t('enterNumDoc2')"
                  flat
                  solo
                  class="text--body-1"
                  :error-messages="errors"
                  required
                  @change="formdata.code = trimSpace(formdata.code)"
                />
              </validation-provider>
            </v-col>

            <v-col cols="4" class="pa-0 pl-6">
              <!-- Nganh -->
              <span class="color--label text--label">
                {{ $t('branch') }}
              </span>
              <v-select
                v-model="formdata.occupationId"
                dense
                :placeholder="$t('enterBranch')"
                outlined
                attach
                :no-data-text="$t('noData')"
                :menu-props="{
                  bottom: true,
                  offsetY: true
                }"
                class="text--body-1"
                :items="lstOccupation"
                item-text="name"
                item-value="id"
              >
                <template v-slot:append>
                  <v-icon>mdi-chevron-down</v-icon>
                </template>
              </v-select>
            </v-col>
          </v-row>

          <v-row class="px-7 ma-0">
            <v-col cols="4" class="pa-0 pr-6">
              <!-- Do mat -->
              <span class="color--label text--label">
                {{ $t('density') }}
              </span>
              <span class="color--required"> *</span>
              <validation-provider
                v-slot="{ errors }"
                name="density"
                rules="required"
              >
                <v-select
                  v-model="formdata.secureTypeId"
                  dense
                  :placeholder="$t('enterDensity')"
                  outlined
                  attach
                  :error-messages="errors"
                  :no-data-text="$t('noData')"
                  required
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :items="lstSecurity"
                  item-text="name"
                  item-value="id"
                  class="text--body-1"
                  @change="selectSecure(formdata.secureTypeId)"
                >
                  <template v-slot:append>
                    <v-icon>mdi-chevron-down</v-icon>
                  </template>
                </v-select>
              </validation-provider>
            </v-col>

            <v-col cols="4" class="pa-0 px-3">
              <!-- Do khan -->
              <span class="color--label text--label">
                {{ $t('electronicSign.urgency') }}
              </span>
              <span class="color--required"> *</span>
              <validation-provider
                v-slot="{ errors }"
                name="urgency"
                rules="required"
              >
                <v-select
                  v-model="formdata.priorityId"
                  dense
                  :placeholder="$t('document.placeholder.urgency')"
                  outlined
                  attach
                  :error-messages="errors"
                  :no-data-text="$t('noData')"
                  required
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :items="lstUrgency"
                  item-text="name"
                  item-value="id"
                  class="text--body-1"
                >
                  <template v-slot:append>
                    <v-icon>mdi-chevron-down</v-icon>
                  </template>
                </v-select>
              </validation-provider>
            </v-col>

            <v-col cols="4" class="pa-0 pl-6">
              <!-- Noi nhan van ban -->
              <span class="text--label color--label">
                {{ $t('receiveDoc') }}
              </span>
              <v-text-field
                v-model="formdata.receivePlace"
                dense
                outlined
                maxlength="500"
                :placeholder="$t('enterReceiveDoc')"
                flat
                solo
                class="text--body-1"
                @change="
                  formdata.receivePlace = trimSpace(formdata.receivePlace)
                "
              />
            </v-col>
          </v-row>

          <v-row class="px-7 ma-0">
            <v-col cols="4" class="pa-0 pr-6">
              <!-- Ngay ban hanh -->
              <span class="color--label text--label">
                {{ $t('dateProclaim') }}
              </span>
              <span class="color--required"> *</span>
              <v-menu
                v-model="openDateProclaim"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                top
                min-width="270px"
                max-width="270px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateProclaimValue"
                    outlined
                    placeholder="DD/MM/YYYY"
                    dense
                    v-bind="attrs"
                    append-icon="mdi-calendar-range"
                    class="text--body-1"
                    :error-messages="$t(errorDateProclaim)"
                    v-on="on"
                    @click:append="openDateProclaim = !openDateProclaim"
                  />
                </template>
                <v-date-picker
                  v-model="dateProclaimPicker"
                  format="DD/MM/YYYY"
                  :locale="localDate"
                  no-title
                  @input="openDateProclaim = false"
                />
              </v-menu>
            </v-col>

            <v-col cols="4" class="pa-0 px-3">
              <!-- Han xu ly -->
              <span class="color--label text--label">
                {{ $t('document.timeExpired') }}
              </span>
              <v-menu
                v-model="openProcessing"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                top
                min-width="270px"
                max-width="270px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="processingValue"
                    outlined
                    placeholder="DD/MM/YYYY"
                    dense
                    v-bind="attrs"
                    append-icon="mdi-calendar-range"
                    :error-messages="$t(errorProcessing)"
                    class="text--body-1"
                    v-on="on"
                    @click:append="openProcessing = !openProcessing"
                  />
                </template>
                <v-date-picker
                  v-model="processingPicker"
                  format="DD/MM/YYYY"
                  :locale="localDate"
                  no-title
                  @input="openProcessing = false"
                />
              </v-menu>
            </v-col>

            <v-col cols="4" class="pa-0 pl-6">
              <!-- NUll -->
            </v-col>
          </v-row>

          <!-- Ten van ban trinh ky -->
          <div class="px-7">
            <span class="text--label color--label">
              {{ $t('electronicSign.nameDocument') }}
            </span>
            <span class="color--required"> *</span>
            <validation-provider
              v-slot="{ errors }"
              name="documentName"
              rules="required"
            >
              <v-text-field
                v-model="formdata.title"
                dense
                outlined
                maxlength="500"
                flat
                solo
                :error-messages="errors"
                required
                class="text--body-1"
                @change="formdata.title = trimSpace(formdata.title)"
              />
            </validation-provider>
          </div>
        </validation-observer>
      </div>

      <!-- Button -->
      <v-row class="ma-0 pb-6 pt-1" justify="center">
        <v-btn
          class="btn--cancel mr-7"
          color="#0FAFE4"
          outlined
          rounded
          @click="closeDialog"
        >
          <span class="text--button"> {{ $t('cancelLabel') }}</span>
        </v-btn>

        <v-btn
          class="btn--save"
          color="#0FAFE4"
          rounded
          @click="saveProclaimDoc"
        >
          <span class="text--button"> {{ $t('proclaim') }}</span>
        </v-btn>
      </v-row>

      <base-preload :dialog="loading" />
    </div>
  </v-dialog>
</template>

<script>
import { DocumentService } from '@/modules/esignature/services/documentService'
import rules from '@/mixins/rules'
import filterItems from '@/mixins/filterItems.js'
import { GroupService } from '@/services/groupService'
import constants from '@/constants'
import moment from 'moment'

const initFormData = {
  formulaTypeId: null, // Hinh thuc van ban.
  promulgateGroupId: null, // Don vi ban hanh.
  promulgateGroupName: null, // Ten don vi ban hanh.
  documentNumber: '', // So van ban.
  code: '', // So, ky hieu van ban.
  occupationId: null, // Nganh.
  secureTypeId: null, // Do mat.
  priorityId: null, // Do khan.
  receivePlace: '', // Noi nhan van ban.
  promulgateDate: null, // Ngay ban hanh.
  expireDate: null, // Han xu ly.
  title: '', // Ten van ban.
  numRegister: null,
  suggestNumber: 1,
  formulaTypeCode: '',
  promulgateGroupCode: ''
}

export default {
  name: 'DialogProclaim',
  mixins: [rules, filterItems],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    proclaim: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      formdata: {
        ...initFormData
      },
      lstDocType: [],
      lstGroupProclaim: [],
      lstUrgency: [],
      lstOccupation: [],
      lstSecurity: [],
      groupProclaim: null,
      occupation: null,
      docType: null,
      security: null,
      urgency: null,

      // Date Proclaim.
      openDateProclaim: false,
      errorDateProclaim: null,
      dateProclaimValue: null,
      dateProclaimPicker: null,

      // Processing deadline.
      openProcessing: false,
      errorProcessing: null,
      processingValue: null,
      processingPicker: null,

      isFirstLoad: false,
      loading: false,
      messageError: null,
      isGetSugget: false
    }
  },

  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    }
  },
  watch: {
    async showDialog() {
      if (this.showDialog) {
        this.loading = true
        this.formdata = { ...initFormData }
        this.processingValue = null
        this.processingPicker = null
        this.initDate()
        await Promise.all([
          this.getDocFormula(),
          this.getGroups(),
          this.getDocPriority(),
          this.getListSecurity(),
          this.getListOccupation()
        ])
        this.errorDateProclaim = null
        this.formdata.numRegister = this.proclaim.registerNumber
        this.formdata.title = this.proclaim.documentTitle || this.proclaim.title
        this.formdata.formulaTypeId = this.proclaim.formulaTypeId
        this.formdata.priorityId = this.proclaim.priorityId
        this.formdata.promulgateGroupId = this.proclaim.promulgateGroupId
        this.formdata.promulgateGroupName = this.proclaim.promulgateGroupName
        this.messageError = null

        await this.getSuggestDocNum()
        this.suggetCodeDocument()
        this.loading = false
      }
    },

    async dateProclaimPicker(date) {
      if (date) {
        this.dateProclaimValue = this.formatDate(date)
        if (this.formdata.promulgateGroupId) {
          await this.getSuggestDocNum()
        }

        this.suggetCodeDocument()
      }
    },

    dateProclaimValue() {
      if (this.dateProclaimValue) {
        var isValid = moment(
          this.dateProclaimValue,
          'DD/MM/YYYY',
          true
        ).isValid()

        if (!isValid) {
          this.errorDateProclaim = 'dateProclaimInvalid'
          this.dateProclaimPicker = null
          return
        } else {
          this.dateProclaimPicker = moment(
            this.dateProclaimValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')

          // Check (Han xu ly < Ngay ban hanh)
          const dateProclaim = moment(this.dateProclaimValue, 'DD/MM/YYYY')
          const dateProcessing = moment(this.processingValue, 'DD/MM/YYYY')
          this.errorProcessing = null
          if (dateProclaim > dateProcessing) {
            this.errorProcessing = 'prcessingError1'
          }

          this.errorDateProclaim = null
          return
        }
      } else {
        this.errorDateProclaim = 'errorDateProclaim'
      }
    },

    processingPicker(date) {
      if (date) {
        this.processingValue = this.formatDate(date)
      }
    },

    processingValue() {
      if (this.processingValue) {
        var isValidDate = moment(
          this.processingValue,
          'DD/MM/YYYY',
          true
        ).isValid()

        if (!isValidDate) {
          this.errorProcessing = 'document.dateExpireInvalid'
          this.processingPicker = null
          return
        } else {
          this.processingPicker = moment(
            this.processingValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')

          // Check (Han xu ly < Ngay ban hanh)
          const dateProclaim = moment(this.dateProclaimValue, 'DD/MM/YYYY')
          const dateProcessing = moment(this.processingValue, 'DD/MM/YYYY')
          if (dateProclaim > dateProcessing) {
            this.errorProcessing = 'prcessingError1'
            return
          }

          this.errorProcessing = null
          return
        }
      } else {
        this.errorProcessing = null
      }
    }
  },

  methods: {
    onInputRegister() {
      this.messageError = null
      this.suggetCodeDocument()
      if (this.formdata.documentNumber && this.formdata.documentNumber <= 0) {
        this.messageError = 'document.documentNumber'
        return this.messageError
      }
      if (!this.formdata.documentNumber) {
        this.messageError = 'document.documentNumberInvalid'
        return this.messageError
      }
    },
    async selectFormula(groupId) {
      const group = this.lstDocType.find(g => g.id === groupId)
      if (group) {
        this.formdata.formulaTypeId = group.id
        this.formdata.formulaTypeCode = group.code
        await this.getSuggestDocNum()
        this.suggetCodeDocument()
      }
    },
    async selectSecure(value) {
      const group = this.lstSecurity.find(g => g.id === value)
      if (group) {
        this.formdata.secureTypeId = group.id
        await this.getSuggestDocNum()
        this.suggetCodeDocument()
      }
    },
    suggetCodeDocument() {
      var groupCode = this.formdata.promulgateGroupCode.toUpperCase()
      var formulgateCode = this.formdata.formulaTypeCode.toUpperCase()
      this.formdata.code = `${this.formdata.documentNumber}/${formulgateCode}-${groupCode}`
    },
    closeDialog() {
      this.resetData()
      this.$refs.observer.reset()
      this.$emit('close-dialog')
    },

    trimSpace(val) {
      return val.trim()
    },

    async getDocFormula() {
      try {
        const response = await DocumentService.getDocFormula()
        this.lstDocType = response.data
        if (this.proclaim.formulaTypeId) {
          const group = this.lstDocType.find(
            g => g.id === this.proclaim.formulaTypeId
          )
          if (group) {
            this.formdata.formulaTypeCode = group.code
          }
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getGroups() {
      try {
        const param = {
          pageSize: 1000,
          restrictHierarchy: 'false',
          groupType: constants.GROUPS.INTERNAL
        }
        const response = await GroupService.search(param)
        this.lstGroupProclaim = response.data.data

        if (this.proclaim.promulgateGroupId) {
          const group = this.lstGroupProclaim.find(
            g => g.groupId === this.proclaim.promulgateGroupId
          )
          if (group) {
            this.formdata.promulgateGroupCode = group.groupCode
          }
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getDocPriority() {
      try {
        const response = await DocumentService.getDocPriority()
        this.lstUrgency = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async getListSecurity() {
      try {
        const response = await DocumentService.getListSecurity()
        this.lstSecurity = response.data
        if (this.lstSecurity.length > 0) {
          this.formdata.secureTypeId = this.lstSecurity[0].id
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getListOccupation() {
      try {
        const response = await DocumentService.getListOccupation()
        this.lstOccupation = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async getSuggestDocNum() {
      try {
        var formRequest = {
          formulaTypeId: null,
          promulgateGroupId: null,
          securityTypeId: null,
          promulgateDate: null,
          docType: 1
        }

        if (this.formdata.formulaTypeId) {
          formRequest.formulaTypeId = this.formdata.formulaTypeId
        }
        if (this.formdata.promulgateGroupId) {
          formRequest.promulgateGroupId = this.formdata.promulgateGroupId
        }
        if (this.formdata.secureTypeId) {
          formRequest.securityTypeId = this.formdata.secureTypeId
        }
        if (this.dateProclaimValue) {
          formRequest.promulgateDate = this.dateProclaimValue.replaceAll(
            '/',
            ''
          )
        }
        const response = await DocumentService.getSuggestDocNum(formRequest)
        if (response.data) {
          this.formdata.documentNumber = response.data
          this.onInputRegister()
        }
      } catch (error) {
        console.log(error)
      }
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    initDate() {
      this.dateProclaimValue = moment().format('DD/MM/YYYY')
    },

    async saveProclaimDoc() {
      const isValid = await this.$refs.observer.validate()
      if (isValid && !this.messageError) {
        this.formdata.promulgateDate = this.dateProclaimValue
        this.formdata.expireDate = this.processingValue
        this.formdata.suggestNumber = this.formdata.documentNumber
        this.$emit('accept-action', this.formdata)
      }
    },

    resetData() {
      this.groupProclaim = null
      this.occupation = null
      this.docType = null
      this.security = null
      this.urgency = null
      this.isFirstLoad = false
    }
  }
}
</script>

<style lang="scss">
.wrap--dialog-proclaim {
  @media (max-width: 1440px) {
    .esignature-dialog-proclaim-content {
      height: 65vh;
      overflow-y: auto;
    }
  }
  background-color: white;
  border-radius: 20px;
  .icon-close {
    color: #8e8ea1;
    top: 12px;
    right: 12px;
  }

  .color--label {
    color: #4e5056;
    text-transform: uppercase;
  }

  .color--required {
    color: #f15642;
  }

  .theme--light.v-input input,
  .theme--light.v-input textarea {
    color: #22242c;
  }

  .v-text-field input::placeholder {
    color: #d3d3d5 !important;
  }

  .btn--save {
    width: 160px;
    height: 46px !important;
    color: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);

    @media (max-width: 1336px) {
      width: 147px;
      height: 36px !important;
    }
  }

  .btn--cancel {
    width: 160px;
    height: 46px !important;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    @media (max-width: 1336px) {
      width: 147px;
      height: 36px !important;
    }
  }
}
</style>
