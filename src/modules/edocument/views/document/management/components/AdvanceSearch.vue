<template>
  <div class="py-4 pb-0 edocument-font" :class="claszz ? 'd-none' : ''">
    <v-row class="ma-0">
      <!-- Bo loc -->
      <div class="wrap-item-search-edocument pa-0 pr-4">
        <label class="text--label edoc-text--body-4">
          {{ $t('filter') }}
        </label>

        <v-select
          v-model="formdata.searchCriteria"
          :items="lstfilter"
          :item-text="item => $t(item.name)"
          item-value="code"
          outlined
          attach
          dense
          :menu-props="{
            bottom: true,
            offsetY: true,
            maxHeight: 220
          }"
          class="edoc-text--body-4"
          @change="onchangedFilter"
        />
      </div>

      <!-- Loai van ban -->
      <div class="wrap-item-search-edocument pa-0 pl-2 pr-3">
        <label class="text--label edoc-text--body-4">
          {{ $t('typeDoc') }}
        </label>

        <v-select
          v-model="formdata.docType"
          :items="lstTypeDoc"
          :item-text="item => $t(item.name)"
          item-value="code"
          outlined
          attach
          dense
          :menu-props="{
            bottom: true,
            offsetY: true,
            maxHeight: 220
          }"
          class="edoc-text--body-4"
          @change="onchangedTypeDoc"
        />
      </div>

      <!-- Hinh thuc van ban -->
      <div class="wrap-item-search-edocument pa-0 pr-3 pl-3">
        <label class="text--label edoc-text--body-4">
          {{ $t('formulaType') }}
        </label>
        <v-autocomplete
          v-model="formulaTypeId"
          :no-data-text="$t('noData')"
          :placeholder="$t('selectDocType')"
          outlined
          attach
          dense
          required
          :filter="filterItems"
          maxlength="255"
          :menu-props="{
            bottom: true,
            offsetY: true,
            maxHeight: 220
          }"
          :items="lstFormulaType"
          :item-text="item => $t(item.name)"
          item-value="id"
          class="edoc-text--body-4"
          @change="onchangedFormulaType(formulaTypeId)"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
        </v-autocomplete>
      </div>

      <!-- Don vi ban hanh -->
      <div class="wrap-item-search-edocument list-signer pa-0 pl-4">
        <label class="text--label edoc-text--body-4">
          {{ $t('proclaimGroup') }}
        </label>
        <v-text-field
          v-model="promulgateGroupName"
          outlined
          maxlength="255"
          dense
          :placeholder="$t('managementDoc.placeholder.groupName')"
          class="edoc-text--body-4"
          @input="onInputSearchGroup"
          @blur="closeFilterGroup"
          @keyup.enter="searchDocumentByGroup()"
          @click="selectPromulgateGroup()"
          @change="promulgateGroupName = trimSpace(promulgateGroupName)"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
        </v-text-field>
        <div v-show="showFilterGroup" class="wrap-list-search">
          <v-list dense>
            <v-list-item-group v-model="selectedGroup" color="primary">
              <v-list-item
                v-for="(group, idx) in lstGroup"
                :key="idx"
                two-line
                class="py-0"
              >
                <v-list-item-content class="py-0">
                  <v-list-item-title>{{ group.groupName }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t(genGroupName(group)) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </div>

      <!-- Nguoi ky -->
      <div class="wrap-item-search-edocument list-signer pa-0 pl-4">
        <label class="text--label edoc-text--body-4">
          {{ $t('contract.signer') }}
        </label>
        <v-text-field
          v-model="keyword"
          outlined
          maxlength="255"
          dense
          :placeholder="$t('managementDoc.placeholder.signerName')"
          class="edoc-text--body-4"
          @input="onInputSearchCustomer"
          @blur="closeFilterCustomer"
          @keyup.enter="searchDocumentBySigner()"
          @click="selectSigner()"
          @change="keyword = trimSpace(keyword)"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
        </v-text-field>
        <div v-show="showFilterCustomer" class="wrap-list-search">
          <v-list dense>
            <v-list-item-group v-model="selectedCustomer" color="primary">
              <v-list-item
                v-for="(user, idx) in lstSigner"
                :key="idx"
                two-line
                class="py-0"
              >
                <v-list-item-content class="py-0">
                  <v-list-item-title>{{ user.fullName }}
                    <small>({{ user.userName }})</small>
                  </v-list-item-title>
                  <v-list-item-subtitle v-html="genEmail(user)" />
                  <v-list-item-subtitle>
                    {{ user.groupPathName }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </div>
    </v-row>

    <v-row class="ma-0">
      <!-- Ngay ban hanh -->
      <v-col cols="3" class="wrap-item-search-edocument pa-0 pr-4 date-picker">
        <label class="text--label edoc-text--body-4">
          {{ $t('datePromulage') }}
        </label>

        <v-menu
          v-model="menuDateProclaimFrom"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateProclaimFromValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              :error-messages="$t(errorDateProclaimFrom)"
              class="edoc-text--body-4"
              v-on="on"
              @click:append="menuDateProclaimFrom = !menuDateProclaimFrom"
            />
          </template>
          <v-date-picker
            v-model="dateProclaimFromPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="menuDateProclaimFrom = false"
          />
        </v-menu>
      </v-col>

      <!-- Den ngay -->
      <v-col
        cols="3"
        class="wrap-item-search-edocument pa-0 pl-2 pr-3 date-picker"
      >
        <label class="text--label edoc-text--body-4">
          {{ $t('contract-manager.labels.dateTo') }}
        </label>

        <v-menu
          v-model="menuDateProclaimTo"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateProclaimToValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              :error-messages="$t(errorDateProclaimTo)"
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              class="edoc-text--body-4"
              v-on="on"
              @click:append="menuDateProclaimTo = !menuDateProclaimTo"
            />
          </template>
          <v-date-picker
            v-model="dateProclaimToPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="menuDateProclaimTo = false"
          />
        </v-menu>
      </v-col>

      <!-- Ngay tao -->
      <v-col
        cols="3"
        class="wrap-item-search-edocument pa-0 pr-3 pl-3 date-picker"
      >
        <label class="text--label edoc-text--body-4">
          {{ $t('dateCreatedFrom') }}
        </label>
        <span class="red-1"> *</span>

        <v-menu
          v-model="menuDateFrom"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFromValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              :error-messages="$t(errorDateFrom)"
              class="edoc-text--body-4"
              v-on="on"
              @click:append="menuDateFrom = !menuDateFrom"
            />
          </template>
          <v-date-picker
            v-model="dateFromPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="menuDateFrom = false"
          />
        </v-menu>
      </v-col>

      <!-- Den ngay -->
      <v-col
        cols="3"
        class="wrap-item-search-edocument pa-0 pr-2 pl-3 date-picker"
      >
        <label class="text--label edoc-text--body-4">
          {{ $t('contract-manager.labels.dateTo') }}
        </label>
        <span class="red-1"> *</span>

        <v-menu
          v-model="menuDateTo"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateToValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              :error-messages="$t(errorDateTo)"
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              class="edoc-text--body-4"
              v-on="on"
              @click:append="menuDateTo = !menuDateTo"
            />
          </template>
          <v-date-picker
            v-model="dateToPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="menuDateTo = false"
          />
        </v-menu>
      </v-col>

      <v-col cols="3" class="wrap-item-search-edocument pa-0 pl-4" />
    </v-row>
  </div>
</template>

<script>
import filterItems from '@/mixins/filterItems.js'
import { DocumentService } from '@/modules/edocument/services/documentService.js'
import moment from 'moment'
import constants from '@/constants'
import rules from '@/mixins/rules'

export default {
  name: 'AdvanceSearch',
  mixins: [filterItems, rules],

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
    claszz: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      promulgateGroupName: null,
      tempGroup: null,
      selectedGroup: null,
      showFilterGroup: false,

      tempCustomer: null,
      selectedCustomer: null,
      showFilterCustomer: false,
      keyword: null,
      // List bo loc.
      lstfilter: [],

      // List loai van ban.
      lstTypeDoc: [],

      // List hinh thuc van ban.
      lstFormulaType: [],

      // List don vi ban hanh.
      lstGroup: [],

      // List nguoi ky.
      lstSigner: [],

      // Date proclaim from.
      menuDateProclaimFrom: null,
      errorDateProclaimFrom: null,
      dateProclaimFromPicker: null,
      dateProclaimFromValue: null,

      // Date proclaim to.
      menuDateProclaimTo: null,
      errorDateProclaimTo: null,
      dateProclaimToPicker: null,
      dateProclaimToValue: null,

      // Date from.
      menuDateFrom: null,
      errorDateFrom: null,
      dateFromPicker: null,
      dateFromValue: null,

      // Date to.
      menuDateTo: null,
      errorDateTo: null,
      dateToPicker: null,
      dateToValue: null,

      keywordTemp: null,
      promulgateGroupNameTemp: null,

      formulaTypeId: ''
    }
  },

  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    }
  },

  watch: {
    showAdvance() {
      this.initDate()
      if (!this.showAdvance) {
        this.formulaTypeId = ''
        this.formdata.promulgateGroupId = null
        this.formdata.promulgateGroupName = null
        this.formdata.signerId = null
        this.formdata.searchCriteria = null
        this.formdata.promulgateFromDate = null
        this.formdata.promulgateToDate = null
        this.formdata.docType = null
        this.formdata.signerInfo = null
        this.dateProclaimFromValue = null
        this.dateProclaimToValue = null
        this.keyword = null
        this.promulgateGroupName = null
        this.searchDocument()
      }
    },

    dateFromPicker(date) {
      if (date) this.dateFromValue = this.formatDate(date)
    },

    dateToPicker(date) {
      if (date) this.dateToValue = this.formatDate(date)
    },

    dateFromValue() {
      if (this.dateFromValue) {
        this.validateFromDate()
        this.validateToDate()
        this.$emit('submission-date-from-change', this.dateFromValue)
      } else {
        this.formdata.fromDate = null
        this.dateFromPicker = null
        this.errorDateFrom = 'messError.dateRequired'
      }
    },

    dateToValue() {
      if (this.dateToValue) {
        this.validateFromDate()
        this.validateToDate()
        this.$emit('submission-date-to-change', this.dateToValue)
      } else {
        this.formdata.toDate = null
        this.dateToPicker = null
        this.errorDateTo = 'messError.dateRequired'
      }
    },

    // Date proclaim.
    dateProclaimFromPicker(date) {
      if (date) this.dateProclaimFromValue = this.formatDate(date)
    },

    dateProclaimToPicker(date) {
      if (date) this.dateProclaimToValue = this.formatDate(date)
    },

    dateProclaimFromValue() {
      this.errorDateProclaimFrom = ''
      if (this.dateProclaimFromValue) {
        this.validateFromDateProc()
        if (this.dateProclaimToValue) {
          this.validateToDateProc()
        }

        if (!this.errorDateProclaimFrom && !this.errorDateProclaimTo) {
          this.$emit(
            'submission-date-proclaim-from-change',
            this.dateProclaimFromValue
          )
        }
      } else {
        if (!moment(this.dateProclaimToValue, 'DD/MM/YYYY', true).isValid()) {
          if (this.dateProclaimToValue) {
            this.errorDateProclaimTo = this.$t('messError.dateProclaimInvalid')
            return
          }
        } else {
          this.errorDateProclaimTo = ''
        }
        this.errorDateProclaimFrom = ''
        this.formdata.promulgateFromDate = null
        this.dateProclaimFromPicker = null
        if (this.showAdvance && !this.errorDateFrom && !this.errorDateTo) {
          this.searchDocument()
        }
      }
    },

    dateProclaimToValue() {
      if (this.dateProclaimToValue) {
        if (this.dateProclaimFromValue) {
          this.validateFromDateProc()
        }
        this.validateToDateProc()
        if (!this.errorDateProclaimFrom && !this.errorDateProclaimTo) {
          this.$emit(
            'submission-date-proclaim-to-change',
            this.dateProclaimToValue
          )
        }
      } else {
        if (!moment(this.dateProclaimFromValue, 'DD/MM/YYYY', true).isValid()) {
          if (this.dateProclaimFromValue) {
            this.errorDateProclaimFrom = this.$t(
              'messError.dateProclaimInvalid'
            )
            return
          }
        } else {
          this.errorDateProclaimFrom = ''
        }
        this.errorDateProclaimTo = ''
        this.formdata.promulgateToDate = null
        this.dateProclaimToPicker = null
        if (this.showAdvance && !this.errorDateFrom && !this.errorDateTo) {
          this.searchDocument()
        }
      }
    },
    keyword() {
      if (this.showAdvance) {
        this.formdata.signerInfo = this.keyword.trim()
      }
    },
    // chon nguoi ky
    async selectedCustomer() {
      if (this.selectedCustomer == null) {
        return
      }
      var item = this.lstSigner[this.selectedCustomer]
      if (item) {
        this.tempCustomer = item
      }
      this.keyword = this.tempCustomer.fullName
      this.formdata.signerId = this.tempCustomer.userId
      this.formdata.signerInfo = null
      await this.searchDocument()
    },
    // don vi ban hanh
    promulgateGroupName() {
      if (this.showAdvance) {
        this.formdata.promulgateGroupName = this.promulgateGroupName.trim()
      }
    },
    // chon don vi
    async selectedGroup() {
      if (this.selectedGroup == null) {
        return
      }
      var item = this.lstGroup[this.selectedGroup]
      if (item) {
        this.tempGroup = item
      }
      this.promulgateGroupName = this.tempGroup.groupName
      this.formdata.promulgateGroupId = this.tempGroup.groupId
      this.formdata.promulgateGroupName = null
      await this.searchDocument()
    }
  },

  async mounted() {
    this.initDate()
    await Promise.all([
      this.getDocFormula(),
      this.getCriteria(),
      this.getDocType()
    ])
  },
  created() {
    const { searchCriteria } = this.$route.query
    if (searchCriteria) {
      this.formdata.searchCriteria = searchCriteria
      this.onchangedFilter()
    }
  },
  methods: {
    validateFromDate() {
      var isValid = moment(this.dateFromValue, 'DD/MM/YYYY', true).isValid()

      if (!isValid) {
        this.formdata.fromDate = this.dateFromValue.replaceAll('/', '')
        this.errorDateFrom = 'dateCreatedInvalid'
        this.dateFromPicker = null
        return
      }

      if (isValid) {
        this.formdata.fromDate = this.dateFromValue.replaceAll('/', '')

        this.dateFromPicker = moment(this.dateFromValue, 'DD/MM/YYYY').format(
          'YYYY-MM-DD'
        )

        const dateTo = moment(this.dateToValue, 'DD/MM/YYYY')
        const dateFrom = moment(this.dateFromValue, 'DD/MM/YYYY')
        const diff = dateTo.diff(dateFrom, 'days')
        this.errorDateFrom = ''

        if (!moment(this.dateToValue, 'DD/MM/YYYY', true).isValid()) {
          this.errorDateTo = 'dateCreatedInvalid'

          if (!this.dateToValue) this.errorDateTo = 'messError.dateRequired'
          return
        }

        if (diff < 0) {
          this.errorDateTo = 'messError.compareDate'
          this.dateFromPicker = ''
          this.formdata.fromDate = null
          return
        }

        if (diff > 365) {
          this.errorDateTo = 'messError.dateExpire'
          this.dateFromPicker = ''
          this.formdata.fromDate = null
          return
        }

        this.errorDateFrom = ''
        this.errorDateTo = ''

        if (this.dateToPicker) this.errorDateTo = ''
      }
    },
    validateToDate() {
      var isValid = moment(this.dateToValue, 'DD/MM/YYYY', true).isValid()

      if (!isValid) {
        this.formdata.toDate = this.dateToValue.replaceAll('/', '')
        this.errorDateTo = 'dateCreatedInvalid'
        this.dateToPicker = null
        return
      }

      if (isValid) {
        this.formdata.toDate = this.dateToValue.replaceAll('/', '')

        this.dateToPicker = moment(this.dateToValue, 'DD/MM/YYYY').format(
          'YYYY-MM-DD'
        )

        const dateTo = moment(this.dateToValue, 'DD/MM/YYYY')
        const dateFrom = moment(this.dateFromValue, 'DD/MM/YYYY')
        const diff = dateTo.diff(dateFrom, 'days')
        this.errorDateTo = ''

        if (!moment(this.dateFromValue, 'DD/MM/YYYY', true).isValid()) {
          this.errorDateFrom = 'dateCreatedInvalid'

          if (!this.dateFromValue) {
            this.errorDateFrom = 'messError.dateRequired'
          }
          return
        }

        if (diff < 0) {
          this.errorDateTo = 'messError.compareDate'
          this.dateToPicker = ''
          this.formdata.toDate = null
          return
        }

        if (diff > 365) {
          this.errorDateTo = 'messError.dateExpire'
          this.dateToPicker = ''
          this.formdata.toDate = null
          return
        }

        if (this.dateFromPicker) this.errorDateFrom = ''
      }
    },
    validateFromDateProc() {
      let isValid = true
      if (!moment(this.dateProclaimFromValue, 'DD/MM/YYYY', true).isValid()) {
        this.formdata.promulgateFromDate = this.dateProclaimFromValue
        this.errorDateProclaimFrom = this.$t('messError.dateProclaimInvalid')
        isValid = false
        this.dateProclaimFromPicker = ''
      }
      if (isValid) {
        this.formdata.promulgateFromDate =
          this.dateProclaimFromValue.replaceAll('/', '')
        this.dateProclaimFromPicker = moment(
          this.dateProclaimFromValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')
        const selectDate = moment(this.dateProclaimToValue, 'DD/MM/YYYY')
        const timeExpired = moment(this.dateProclaimFromValue, 'DD/MM/YYYY')
        const diff = selectDate.diff(timeExpired, 'days')

        if (!moment(this.dateProclaimToValue, 'DD/MM/YYYY', true).isValid()) {
          if (this.dateProclaimToValue) {
            this.errorDateProclaimTo = this.$t('messError.dateProclaimInvalid')
            return
          }
        }

        if (diff < 0) {
          this.errorDateProclaimTo = 'messError.compareDate'
          this.dateProclaimFromPicker = ''
          this.formdata.promulgateFromDate = 'false'
          return
        }
        this.errorDateProclaimFrom = ''
        this.errorDateProclaimTo = ''

        if (this.dateProclaimToPicker) this.errorDateProclaimTo = ''
      }
    },
    validateToDateProc() {
      let isValid = true
      if (!moment(this.dateProclaimToValue, 'DD/MM/YYYY', true).isValid()) {
        this.formdata.promulgateToDate = this.dateProclaimToValue
        this.errorDateProclaimTo = this.$t('messError.dateProclaimInvalid')
        isValid = false
        this.dateProclaimToPicker = ''
      }
      if (isValid) {
        this.formdata.promulgateToDate = this.dateProclaimToValue.replaceAll(
          '/',
          ''
        )
        this.dateProclaimToPicker = moment(
          this.dateProclaimToValue,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')
        const selectDate = moment(this.dateProclaimToValue, 'DD/MM/YYYY')
        const timeExpired = moment(this.dateProclaimFromValue, 'DD/MM/YYYY')
        const diff = selectDate.diff(timeExpired, 'days')
        this.errorDateProclaimTo = ''

        if (!moment(this.dateProclaimFromValue, 'DD/MM/YYYY', true).isValid()) {
          if (this.dateProclaimFromValue) {
            this.errorDateProclaimFrom = this.$t(
              'messError.dateProclaimInvalid'
            )
            return
          }
        }

        if (diff < 0) {
          this.errorDateProclaimTo = 'messError.compareDate'
          this.dateProclaimToPicker = ''
          this.formdata.promulgateToDate = 'false'
          return
        }

        if (this.dateProclaimFromPicker) this.errorDateProclaimFrom = ''
      }
    },
    genGroupName(group) {
      let groupName = 'group.partnerLabel'
      if (group.groupType === constants.GROUPS.INTERNAL) {
        groupName = group.parentPathName
      }
      return groupName
    },
    trimSpace(val) {
      return val ? val.trim() : ''
    },

    selectPromulgateGroup() {
      this.promulgateGroupNameTemp = null
      this.searchGroup()
    },
    selectSigner() {
      this.keywordTemp = null
      this.searchCustomer()
    },
    // gen email va so dien thoai
    genEmail(user) {
      if (user.phone) {
        return `${user.email} - ${user.phone}`
      }
      return user.email
    },
    // enter tim kiem document theo nguoi ky
    async searchDocumentBySigner() {
      this.formdata.signerId = null
      this.formdata.signerInfo = this.keyword.trim()
      this.keyword = this.keyword.trim()
      await this.searchDocument()
      this.showFilterCustomer = false
    },
    // tim kiem nguoi kys
    async searchCustomer(status) {
      if (this.keyword && this.keyword.trim() === this.keywordTemp) {
        return
      }
      const keyword = this.keyword && this.keyword.trim()
      this.keywordTemp = keyword
      const params = {
        keyword: keyword,
        searchAllRoles: 'false',
        restrictHierarchy: true
      }
      const response = await DocumentService.searchSignerDocumentBook(params)
      if (response.success) {
        this.lstSigner = response.data ? response.data : []
        this.showFilterCustomer = this.lstSigner.length > 0
      } else {
        console.log(response.messages)
      }
    },
    // bat su kien nhap input nguoi ky
    onInputSearchCustomer() {
      this.formdata.signerId = null
      this.selectedCustomer = null
      setTimeout(() => {
        this.searchCustomer(false)
      }, 200)
    },
    // dong popup danh sach nguoi ky
    async closeFilterCustomer() {
      setTimeout(() => {
        this.showFilterCustomer = false
      }, 200)
    },
    // don vi ban hanh
    async searchDocumentByGroup() {
      this.formdata.promulgateGroupId = null
      this.formdata.promulgateGroupName = this.promulgateGroupName.trim()
      this.promulgateGroupName = this.promulgateGroupName.trim()
      await this.searchDocument()
      this.showFilterGroup = false
    },
    // tim kiem don vi ban hanh
    async searchGroup(status) {
      if (
        this.promulgateGroupName &&
        this.promulgateGroupName.trim() === this.promulgateGroupNameTemp
      ) {
        return
      }
      const keyword =
        this.promulgateGroupName && this.promulgateGroupName.trim()
      this.promulgateGroupNameTemp = keyword
      const params = {
        groupName: keyword,
        pageSize: 1000000,
        restrictHierarchy: 'false'
      }
      const response = await DocumentService.search(params)
      if (response.success) {
        this.lstGroup = response.data ? response.data.data : []
        this.showFilterGroup = this.lstGroup.length > 0
      } else {
        console.log(response.messages)
      }
    },
    // bat su kien nhap don vi ban hanh
    onInputSearchGroup() {
      this.formdata.promulgateGroupId = null
      this.selectedGroup = null
      setTimeout(() => {
        this.searchGroup(false)
      }, 200)
    },
    // don popup don vi ban hanh
    async closeFilterGroup() {
      setTimeout(() => {
        this.showFilterGroup = false
      }, 200)
    },
    async getDocFormula() {
      try {
        const response = await DocumentService.getDocFormula()
        this.lstFormulaType = response.data
        if (this.lstFormulaType) {
          this.lstFormulaType.unshift({ name: 'all', id: '' })
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getCriteria() {
      try {
        const response = await DocumentService.getCriteria()
        this.lstfilter = response.data
        if (this.lstfilter) {
          this.lstfilter.unshift({ name: 'all', code: null })
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getDocType() {
      try {
        const response = await DocumentService.getDocType()
        this.lstTypeDoc = response.data
        if (this.lstTypeDoc) {
          this.lstTypeDoc.unshift({ name: 'all', code: null })
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getGroups() {
      try {
        const param = {
          pageSize: 1000000,
          restrictHierarchy: 'false'
        }
        const response = await DocumentService.search(param)
        this.lstGroup = response.data.data
      } catch (error) {
        console.log(error)
      }
    },

    onchangedFilter(val) {
      this.searchDocument()
    },

    onchangedTypeDoc(val) {
      this.searchDocument()
    },

    onchangedFormulaType(value) {
      this.formdata.formulaTypeId = value || ''
      this.searchDocument()
    },

    onchangedPromulgateGroup(val) {
      this.searchDocument()
    },

    onchangedSigner(val) {
      this.searchDocument()
    },

    initDate() {
      this.dateFromValue = moment().subtract(365, 'days').format('DD/MM/YYYY')
      this.dateToValue = moment().format('DD/MM/YYYY')
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-item-search-edocument {
  flex: 0 0 20% !important;
}
</style>
