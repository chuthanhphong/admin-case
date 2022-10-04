<template>
  <div class="px-5">
    <div class="d-flex flex-row justify-end mt-4">
      <v-text-field
        id="txt-search"
        v-model="formdata.keyword"
        :placeholder="$t('managerDoc')"
        outlined
        dense
        autofocus
        clearable
        hide-details
        class="w-270 max-width270"
        @change="formdata.keyword = trimSpace(formdata.keyword)"
        @keyup.enter="searchDocument"
      >
        <vue-feather
          slot="prepend-inner"
          class="grey-1"
          type="search"
          size="20"
        />
      </v-text-field>

      <!-- Btn advance search -->
      <v-tooltip top content-class="tooltip-top">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            outlined
            color="primary"
            class="btn-advance"
            v-on="on"
            @click="changeShow"
          >
            <img src="@/assets/icons/icon-advance.svg" alt="advance" />
          </v-btn>
        </template>
        {{ $t('contract.label.advanceSearch') }}
      </v-tooltip>
    </div>

    <!-- tim kiem nang cao -->
    <AdvanceSearchReplace
      v-show="showAdvance"
      :formdata="formdata"
      :show-advance="showAdvance"
      :search-document="searchDocument"
      @submission-date-promulgate-from-change="
        submissionDatePromulgateFromChange
      "
      @submission-date-promulgate-to-change="submissionDatePromulgateToChange"
      @submission-date-proclaim-from-change="submissionDateProclaimFromChange"
      @submission-date-proclaim-to-change="submissionDateProclaimToChange"
    />
    <!-- <AdvanceSearch
      v-show="showAdvance"
      :formdata="formdata"
      :claszz="claszz"
      :show-advance="showAdvance"
      :search-document="searchDocument"
      @submission-date-from-change="submissionDateFromChange"
      @submission-date-to-change="submissionDateToChange"
      @submission-date-proclaim-from-change="submissionDateProclaimFromChange"
      @submission-date-proclaim-to-change="submissionDateProclaimToChange"
    /> -->
  </div>
</template>

<script>
import AdvanceSearchReplace from '@/modules/edocument/views/document/library/components/AdvanceSearchReplace'

export default {
  name: 'SearchReplaceDoc',
  components: {
    AdvanceSearchReplace
  },

  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    searchDocument: {
      type: Function,
      default: undefined
    },
    changeShowAdvance: {
      type: Function,
      default: undefined
    }
  },

  data() {
    return {
      showAdvance: false
    }
  },

  methods: {
    trimSpace(val) {
      return val ? val.trim() : ''
    },

    changeShow() {
      this.showAdvance = !this.showAdvance
      this.changeShowAdvance(this.showAdvance)
      return this.showAdvance
    },

    closeAdvanceSearch() {
      this.showAdvance = false
    },

    // Change Date.
    submissionDatePromulgateFromChange(value) {
      this.formdata.promulgateFromDate = value && value.replaceAll('/', '')
      this.searchDocument()
    },
    submissionDatePromulgateToChange(value) {
      this.formdata.promulgateToDate = value && value.replaceAll('/', '')
      this.searchDocument()
    },

    // Change Date proclaim.
    submissionDateProclaimFromChange(value) {
      this.formdata.proclaimFromDate = value && value.replaceAll('/', '')
      this.searchDocument()
    },
    submissionDateProclaimToChange(value) {
      this.formdata.proclaimToDate = value && value.replaceAll('/', '')
      this.searchDocument()
    }
  }
}
</script>

<style lang="scss">
.btn-advance {
  width: 40px !important;
  height: 40px !important;
  min-width: unset !important;
  margin-left: 20px;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15));
  background-color: white;
}

.max-width270 {
  max-width: 270px;
}
</style>
