<template>
  <div class="py-4 pb-0 edocument-font" :class="claszz ? 'd-none' : ''">
    <!-- don vi xay dung -->
    <v-row class="ma-0 justify-space-around">
      <div class="col-md-5 wrap-item-search-edocument pa-0 pr-4">
        <label class="text--label edoc-text--body-4">
          {{ $t('constructionGroup') }}
        </label>
        <v-autocomplete
          v-model="formdata.buildGroupId"
          :no-data-text="$t('noData')"
          :placeholder="$t('libraries.placeholder.selectGroup')"
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
          :items="listGroup"
          :item-text="(item) => $t(item.groupName)"
          item-value="groupId"
          class="edoc-text--body-4"
          @change="onchangedSearch()"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
          <template v-slot:item="data">
            <div class="select-item flex-column d-flex">
              <div class="title-item">
                {{ data.item.groupName }}
              </div>
              <div class="desc-item">
                {{ data.item.parentPathName }}
              </div>
            </div>
          </template>
        </v-autocomplete>

      </div>

      <!-- pham vi ap dung -->
      <div class="col-md-5 wrap-item-search-edocument pa-0 pl-2 pr-3">
        <label class="text--label edoc-text--body-4">
          {{ $t('libraries.listLibrary.scopeUser') }}
        </label>

        <v-autocomplete
          v-model="formdata.groupScopeId"
          :no-data-text="$t('noData')"
          :placeholder="$t('libraries.placeholder.selectGroup')"
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
          :items="listGroupScope"
          :item-text="(item) => $t(item.groupName)"
          item-value="groupId"
          class="edoc-text--body-4"
          @change="onchangedSearch()"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
          <template v-slot:item="data">
            <div class="select-item flex-column d-flex">
              <div class="title-item">
                {{ data.item.groupName }}
              </div>
              <div class="desc-item">
                {{ data.item.pathName }}
              </div>
            </div>
          </template>
        </v-autocomplete>
      </div>
    </v-row>
    <v-row class="ma-0 justify-space-around">
      <!-- trang thai hieu luc -->
      <div class="col-md-5 wrap-item-search-edocument pa-0 pr-3">
        <label class="text--label edoc-text--body-4">
          {{ $t('libraries.listLibrary.effectStatus') }}
        </label>
        <v-select
          v-model="formdata.expiredStatus"
          :items="listEffectStatus"
          :item-text="(item) => $t(item.name)"
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
          @change="onchangedSearch()"
        />

      </div>
      <!-- van ban thay the -->
      <div class="col-md-5 wrap-item-search-edocument pa-0 pr-3 pl-3">
        <label class="text--label edoc-text--body-4">
          {{ $t('libraries.listLibrary.replaceDocument') }}
        </label>
        <v-select
          v-model="formdata.replacementDocumentStatus"
          :items="listReplaceDocument"
          :item-text="(item) => $t(item.name)"
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
          @change="onchangedSearch()"
        />
      </div>
    </v-row>
  </div>
</template>

<script>
import filterItems from '@/mixins/filterItems.js'
import { DocumentService } from '@/modules/edocument/services/documentService.js'
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
      listEffectStatus: [],
      listReplaceDocument: [],
      listGroup: [],
      listGroupScope: []
    }
  },

  watch: {
    showAdvance() {
      if (!this.showAdvance) {
        this.formdata.buildGroupId = null
        this.formdata.groupScopeId = null
        this.formdata.replacementDocumentStatus = null
        this.formdata.expiredStatus = 'EDOCUMENT_EFFECT'
        this.searchDocument()
      }
    }
  },

  async mounted() {
    await Promise.all([
      this.getEffectStatus(),
      this.getReplaceDocument(),
      this.searchGroup(),
      this.getGroupScope()
    ])
  },
  methods: {

    async getEffectStatus() {
      try {
        const response = await DocumentService.getEffectStatus()
        this.listEffectStatus = response.data
        if (this.listEffectStatus) {
          this.listEffectStatus.unshift({ name: 'all', code: null })
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getReplaceDocument() {
      try {
        const response = await DocumentService.getReplaceDocument()
        this.listReplaceDocument = response.data
        if (this.listReplaceDocument) {
          this.listReplaceDocument.unshift({ name: 'all', code: null })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getGroupScope() {
      try {
        const response = await DocumentService.getGroupScope()
        this.listGroupScope = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async searchGroup() {
      try {
        const params = {
          groupType: constants.GROUPS.INTERNAL
        }
        const response = await DocumentService.searchGroupDocumentManager(params)
        this.listGroup = response.data.data
      } catch (error) {
        console.log(error)
      }
    },

    onchangedFilter(val) {
      this.searchDocument()
    },

    onchangedSearch(val) {
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
  }
}
</script>

<style lang="scss" scoped>
</style>
