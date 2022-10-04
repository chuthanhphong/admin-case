<template>
  <div class="wrap-advance-search-esignature px-2 py-4 pb-0 mt-3" :class="claszz ? 'd-none' : ''">
    <v-row justify="space-between" align="start" class="">
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
            return-object
            class="text--body-1"
            attach
            :menu-props="{
              bottom: true,
              offsetY: true
            }"
            outlined
            dense
            :placeholder="$t('electronicSign.textStatus')"
            @change="onchangeSelect(`${selectDocState.value}`)"
          />
        </div>
      </div>
      <!-- loai xu ly -->
      <div
        class="d-flex align-start flex-column flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="color--label text--label-1 font--bold">{{ $t('document.label.actions') }}</label>
          <v-select
            v-model="selectTypeDocument"
            :items="listTypeDocument"
            :item-text="(item) => $t(item.label)"
            item-value="value"
            return-object
            outlined
            class="text--body-1"
            attach
            :menu-props="{
              bottom: true,
              offsetY: true
            }"
            dense
            :placeholder="$t('document.label.contractStatus')"
            @change="onchangeSelectTypeDocument(`${selectTypeDocument.value}`)"
          >
            <template v-slot:append>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-select>
        </div>
      </div>

      <!-- Trang thai xu ly -->
      <div
        class="d-flex align-start flex-column flex-sm-row align-sm-center justify-end"
      >
        <div class="d-flex align-start form-group flex-column">
          <label class="color--label text--label-1 font--bold">{{ $t('document.label.processStatus') }} </label>

          <v-select
            v-model="selectProcessStatus"
            :items="listProcessByProcessType"
            :disabled="listProcessByProcessType.length == 0"
            :item-text="(item) => $t(item.label)"
            item-value="value"
            return-object
            attach
            class="text--body-1"
            :menu-props="{
              bottom: true,
              offsetY: true
            }"
            outlined
            dense
            :placeholder="$t('document.label.processStatus')"
            @change="onchangeSelectProcessStatus(selectProcessStatus)"
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
                :error-messages="$t(errorDateReceivedTo)"
                v-bind="attrs"
                class="text--body-1"
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

export default {
  name: 'AdvanceSearch',
  mixins: [searchAdvanceProcess],
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
      // loai xu ly
      selectTypeDocument: { value: constants.ALL },
      listTypeDocument: [
        { label: 'document.label.docStates.all', value: constants.ALL },
        {
          label: 'document.signType.main',
          value: constants.SIGN_USER_TYPE.MAIN
        },
        {
          label: 'document.signType.flashes',
          value: constants.SIGN_USER_TYPE.FLASHES
        }
      ],
      listProcessStatus: {
        main: [
          // Ky
          { label: 'document.label.docStates.all', value: constants.ALL },
          {
            label: 'document.statusMain.unprocessed',
            value: constants.SIGN_PROCCESS_STATUS.UNPROCESSED
          },
          {
            label: 'document.statusMain.processed',
            value: constants.SIGN_PROCCESS_STATUS.PROCESSED
          },
          {
            label: 'document.statusMain.reject',
            value: constants.SIGN_PROCCESS_STATUS.REJECTED
          }
        ],
        flashes: [
          // ky nhay
          { label: 'document.label.docStates.all', value: constants.ALL },
          {
            label: 'document.statusFlashes.unprocessed',
            value: constants.SIGN_PROCCESS_STATUS.UNPROCESSED
          },
          {
            label: 'document.statusFlashes.processed',
            value: constants.SIGN_PROCCESS_STATUS.PROCESSED
          },
          {
            label: 'document.statusFlashes.reject',
            value: constants.SIGN_PROCCESS_STATUS.REJECTED
          }
        ]
      },
      selectProcessStatus: null,
      listProcessByProcessType: []
    }
  },
  watch: {
    showAdvance() {
      this.initDateRecived()
      if (!this.showAdvance) {
        this.selectTypeDocument = { value: constants.ALL }
        this.selectDocState = { value: constants.ALL }
        this.selectProcessStatus = null
        this.listProcessByProcessType = []
        this.searchDocument()
      }
    }
  },
  created() {
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
    // Change typeDoc by tab.
    onchangeSelectTypeDocument(value) {
      this.formdata.signUserTypes =
        value === constants.ALL
          ? [constants.SIGN_USER_TYPE.MAIN, constants.SIGN_USER_TYPE.FLASHES]
          : value

      // set gia tri cho select khi chon loai xu ly
      this.selectProcessStatus = { value: constants.ALL }
      this.formdata.processStatus = null
      // set gia tri cho list process neu chon loai xu ly la ky chinh
      if (value === constants.SIGN_USER_TYPE.MAIN) {
        this.listProcessByProcessType = this.listProcessStatus.main
      }
      // set gia tri cho list process neu chon loai xu ly la ky nhay
      if (value === constants.SIGN_USER_TYPE.FLASHES) {
        this.listProcessByProcessType = this.listProcessStatus.flashes
      }
      // neu chon tat ca reset gia tri cua combobox trang thai xu ly
      if (value === constants.ALL) {
        this.selectProcessStatus = null
        this.listProcessByProcessType = []
      }
      this.searchDocument()
    }
  }
}
</script>

<style
  lang="scss"
  src="@/modules/esignature/views/list/ListDocumentCreated.scss"
></style>
