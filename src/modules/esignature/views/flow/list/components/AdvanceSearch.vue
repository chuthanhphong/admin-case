<template>
  <div class="wrap--advance-search-flow" :class="claszz ? 'd-none' : ''">
    <v-row class="ma-0">
      <v-col cols="4" class="pa-0 pr-7">
        <!-- Hinh thuc van ban -->
        <span class="color--label text--label-1 font--bold">
          {{ $t('electronicSign.create.documentForm') }}
        </span>
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
          :items="lstDocType"
          :item-text="(item) => $t(item.name)"
          item-value="id"
          @change="onchangeSelectFormula(formulaTypeId)"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
        </v-autocomplete>
      </v-col>

      <v-col cols="4" class="pa-0 px-4">
        <!-- Ngay tao tu -->
        <span class="color--label text--label-1 font--bold">
          {{ $t('electronicSign.dateFrom') }}
        </span>
        <span class="color--required"> *</span>

        <v-menu
          v-model="openDateFrom"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateReceivedFromValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              :error-messages="$t(errorDateReceivedFrom)"
              class="text--body-1"
              v-on="on"
              @click:append="openDateFrom = !openDateFrom"
            />
          </template>
          <v-date-picker
            v-model="dateReceivedFromPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="openDateFrom = false"
          />
        </v-menu>
      </v-col>

      <v-col cols="4" class="pa-0 pl-7">
        <!-- Den -->
        <span class="color--label text--label-1 font--bold">
          {{ $t('dateTo') }}
        </span>
        <span class="color--required"> *</span>

        <v-menu
          v-model="openDateTo"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="270px"
          max-width="270px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateReceivedToValue"
              outlined
              placeholder="DD/MM/YYYY"
              dense
              v-bind="attrs"
              append-icon="mdi-calendar-range"
              :error-messages="$t(errorDateReceivedTo)"
              class="text--body-1"
              v-on="on"
              @click:append="openDateTo = !openDateTo"
            />
          </template>
          <v-date-picker
            v-model="dateReceivedToPicker"
            format="DD/MM/YYYY"
            :locale="localDate"
            no-title
            @input="openDateTo = false"
          />
        </v-menu>
      </v-col>
    </v-row>

    <v-row class="ma-0">
      <v-col cols="4" class="pa-0 pr-7">
        <!-- Hinh thuc van ban -->
        <span class="color--label text--label-1 font--bold">
          {{ $t('document.label.scopeUse') }}
        </span>

        <v-select
          v-model="scope"
          dense
          :placeholder="$t('document.placeholder.documentForm')"
          outlined
          attach
          :no-data-text="$t('noData')"
          required
          :menu-props="{
            bottom: true,
            offsetY: true
          }"
          :items="lstScope"
          :item-text="(item) => $t(item.label)"
          item-value="value"
          class="text--body-1"
          return-object
          @change="onChangeScope(scope.value)"
        >
          <template v-slot:append>
            <v-icon>mdi-chevron-down</v-icon>
          </template>
        </v-select>
      </v-col>
      <v-col cols="4" class="pa-0 px-4">
        <!-- Hinh thuc van ban -->
        <span class="color--label text--label-1 font--bold">
          {{ $t('unitUse') }}
        </span>

        <v-autocomplete
          v-model="selectedGroup"
          :search-input.sync="search"
          class="text--body-1"
          outlined
          :no-data-text="$t('users.itemGroupName')"
          hide-selected
          hide-details
          maxlength="255"
          floating
          solo
          attach
          dense
          :filter="filterItems"
          elevation="0"
          :menu-props="{
            bottom: true,
            offsetY: true
          }"
          :disabled="!checkDisabled"
          :label="$t('enterUnitUse')"
          :items="groups"
          :item-text="(item) => genGroupName(item.groupName)"
          item-value="groupId"
          chips
          deletable-chips
          multiple
          @change="onChangeSelectedGroup"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
          <template v-slot:item="data">
            <div class="select-item flex-column d-flex">
              <div class="title-item">{{ data.item.groupName }}</div>
              <div class="desc-item">
                {{ data.item.pathName }}
              </div>
            </div>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="4" class="pa-0" />
    </v-row>
  </div>
</template>

<script>
import { DocumentService } from '@/modules/esignature/services/documentService'
import moment from 'moment'
import constants from '@/constants'
import filterItems from '@/mixins/filterItems.js'

const types = {
  GROUPS: 'GROUPS',
  PERSONAL: 'PERSONAL'
}

export default {
  name: 'AdvancceSearch',
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
    claszz: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      selectedGroup: null,
      lstDocType: [],
      formulaTypeId: '',
      groups: null,
      search: '',

      // Pham vi su dung.
      lstScope: [
        { label: 'electronicSign.docState.all', value: constants.ALL },
        {
          label: 'document.personal',
          value: types.PERSONAL
        },
        {
          label: 'document.unit',
          value: types.GROUPS
        }
      ],
      scope: { value: constants.ALL },

      // Date from.
      openDateFrom: false,
      errorDateReceivedFrom: null,
      dateReceivedFromValue: null,
      dateReceivedFromPicker: null,

      // Date to.
      openDateTo: false,
      errorDateReceivedTo: null,
      dateReceivedToValue: null,
      dateReceivedToPicker: null
    }
  },

  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },
    checkDisabled() {
      return this.scope.value === types.GROUPS
    }
  },

  watch: {
    showAdvance() {
      this.initDateRecived()
      if (!this.showAdvance) {
        this.scope = { value: constants.ALL }
        this.selectedGroup = null
        this.formulaTypeId = ''
        this.formdata.documentScopeIds = ''
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
  mounted() {
    this.initDateRecived()
    this.getDocFormula()
    this.getScopeTemplate()
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

        if (
          !moment(this.dateReceivedFromValue, 'DD/MM/YYYY', true).isValid()
        ) {
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
    genGroupName(groupName) {
      if (groupName.length > 30) {
        groupName = `${groupName.slice(0, 30)}...`
      }
      return groupName
    },
    onChangeScope(value) {
      this.selectedGroup = ''
      this.formdata.documentScopeIds = ''
      this.formdata.docScopeType = value
      this.searchDocument()
    },
    async getScopeTemplate() {
      try {
        const response = await DocumentService.getListPromulgateTemplate()
        this.groups = response.data
      } catch (error) {
        console.log(error)
      }
    },
    onChangeSelectedGroup() {
      this.formdata.documentScopeIds = this.selectedGroup
      this.searchDocument()
      this.search = ''
    },
    initDateRecived() {
      const yearBefore = moment().subtract(365, 'days').format('DD/MM/YYYY')
      const currentDate = moment().format('DD/MM/YYYY')
      this.dateReceivedFromValue = yearBefore
      this.dateReceivedToValue = currentDate
    },
    onchangeSelectFormula(value) {
      this.formdata.formulaTypeId = value || ''
      this.searchDocument()
    },
    async getDocFormula() {
      try {
        const response = await DocumentService.getDocFormula()
        this.lstDocType = response.data
        if (this.lstDocType) {
          this.lstDocType.unshift({
            name: 'electronicSign.docState.all',
            id: ''
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    initDate() {
      this.dateFromValue = moment().subtract(365, 'days').format('DD/MM/YYYY')
      this.dateToValue = moment().format('DD/MM/YYYY')
    }
  }
}
</script>

<style lang="scss">
.wrap--advance-search-flow {
  .color--label {
    color: #4e5056;
    text-transform: uppercase;
  }

  .color--required {
    color: #f15642;
  }
}
</style>
