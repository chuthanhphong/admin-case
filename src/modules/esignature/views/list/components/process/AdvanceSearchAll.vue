<template>
  <div class="wrap-advance-search-esignature px-2 py-4 pb-0 mt-3" :class="claszz ? 'd-none' : ''">
    <v-row justify="space-between" align="start" class="">
      <!-- Trang thai xu ly -->
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
        <div class="d-flex align-start form-group flex-column">
          <label class="color--label text--label-1 font--bold">
            {{ $t('electronicSign.textStatus') }}
          </label>
          <v-select
            v-model="selectDocState"
            :items="lstDocStates"
            :item-text="(item) => $t(item.label)"
            item-value="value"
            attach
            :menu-props="{
              bottom: true,
              offsetY: true
            }"
            return-object
            outlined
            class="text--body-1"
            dense
            :placeholder="$t('electronicSign.textStatus')"
            @change="onchangeSelect(`${selectDocState.value}`)"
          />
        </div>
      </div>

      <!-- ngay tao date from -->
      <div
        class="d-flex align-start flex-column flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
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
        <div class="d-flex align-start form-group flex-column">
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
import searchAdvanceProcess from '@/modules/esignature/mixins/searchAdvanceProcess'
import { DocumentService } from '@/modules/esignature/services/documentService'
import filterItems from '@/mixins/filterItems.js'

export default {
  name: 'AdvanceSearchAll',
  mixins: [searchAdvanceProcess, filterItems],
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
      formulaTypeId: '',
      lstContractType: []
    }
  },
  watch: {
    showAdvance() {
      this.initDateRecived()
      if (!this.showAdvance) {
        this.formulaTypeId = ''
        this.selectDocState = { value: constants.ALL }
        this.selectProcessStatus = { value: constants.ALL }
        this.searchDocument()
      }
    }
  },
  created() {
    this.getDocFormula()
    const { docState } = this.$route.query
    if (docState) {
      this.selectDocState = { value: docState }
      this.formdata.signUserTypes = [
        constants.SIGN_USER_TYPE.MAIN,
        constants.SIGN_USER_TYPE.FLASHES,
        constants.SIGN_USER_TYPE.REVIEWER
      ]
      this.onchangeSelect(docState)
      this.$router.replace({ query: {}})
    }
  },
  methods: {
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
    } }
}
</script>

<style
  lang="scss"
  src="@/modules/esignature/views/list/ListDocumentCreated.scss"
></style>
