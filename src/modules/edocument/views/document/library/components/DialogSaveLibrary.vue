<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="760"
    content-class="dialog-save-lib"
  >
    <div v-if="showDialog" class="wrap-dialog-save-lib edocument-font">
      <!-- Title -->
      <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      <h3 class="text-center text-capitalize pt-6 d-block">
        {{ $t(infoSaveLib) }}
      </h3>
      <p
        v-if="documentCurrent"
        class="text-center text-capitalize edoc-text--body-8 mb-0"
      >
        {{ documentCurrent.documentTitle }}
      </p>

      <div class="wrap-content-save-lib">
        <validation-observer ref="observer">
          <v-row class="ma-0 px-10 pt-3">
            <!-- Don vi xay dung -->
            <v-col cols="6" class="pr-7 pb-1">
              <label class="text--label edoc-text--body-4">
                {{ $t('constructionGroup') }}
              </label>
              <span class="red-1"> *</span>
              <validation-provider
                v-slot="{ errors }"
                name="constructionGroup"
                rules="required"
              >
                <v-autocomplete
                  v-model="buildGroupId"
                  :no-data-text="$t('noData')"
                  :placeholder="$t('selectConstructionGroup')"
                  outlined
                  attach
                  dense
                  autofocus
                  required
                  :filter="filterItems"
                  maxlength="255"
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    maxHeight: 220
                  }"
                  :items="lstGroup"
                  item-text="groupName"
                  :error-messages="errors"
                  item-value="groupId"
                  class="edoc-text--body-4"
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
              </validation-provider>
            </v-col>

            <!-- Ngay het hieu luc -->
            <v-col cols="6" class="date-picker pl-7">
              <label class="text--label edoc-text--body-4">
                {{ $t('users.addSignature.timeExpired') }}
              </label>

              <v-menu
                v-model="menuDateExpired"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="270px"
                max-width="270px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateExpiredValue"
                    outlined
                    placeholder="DD/MM/YYYY"
                    dense
                    v-bind="attrs"
                    append-icon="mdi-calendar-range"
                    :error-messages="$t(errorDateExpired)"
                    class="edoc-text--body-4"
                    v-on="on"
                    @click:append="menuDateExpired = !menuDateExpired"
                  />
                </template>
                <v-date-picker
                  v-model="dateExpiredPicker"
                  format="DD/MM/YYYY"
                  :locale="localDate"
                  no-title
                  @input="menuDateExpired = false"
                />
              </v-menu>
            </v-col>
          </v-row>

          <!-- Pham vi ap dung -->
          <v-row class="ma-0 px-10">
            <v-col cols="6" class="pr-7 py-0">
              <label class="text--label edoc-text--body-4">
                {{ $t('libraries.create.scopeUse') }}
              </label>
              <span class="red-1"> *</span>

              <v-autocomplete
                v-model="idScope"
                :no-data-text="$t('noData')"
                :placeholder="$t('libraries.placeholder.selectScope')"
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
                :items="lstScope"
                item-text="groupName"
                :error-messages="$t(errorsScoped)"
                item-value="groupId"
                class="edoc-text--body-4"
                @change="onChangeScope(idScope)"
                @click="validateScope(idScope)"
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

              <!-- List pham vi su dung -->
              <div v-if="lstScopeSelected.length > 0" class="wrap-list-scope">
                <div
                  v-for="(child, i) in lstScopeSelected"
                  :key="`scope-${i}`"
                  class="pb-3"
                >
                  <div class="wrap-item-scope">
                    <span class="text-group-name maxline2">
                      {{ i + 1 }}. {{ child.groupName }}</span>

                    <v-btn
                      icon
                      small
                      color="#ff4a55"
                      @click="onRemoveScope(child.groupId)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                  <div>
                    <span class="text-group-path maxline2">
                      {{ child.parentPathName }}
                    </span>
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="6" class="date-picker pl-7" />
          </v-row>
        </validation-observer>

        <!-- Van ban thay the -->
        <label class="text--label edoc-text--body-4 px-13 pt-5">
          {{ $t('alternativeDoc') }}
        </label>
        <div
          class="wrap-replace-doc mx-13 hover--pointer"
          @click="selectReplaceDoc()"
        >
          <v-row class="ma-0 justify-center align-center">
            <span class="mr-3 text--label2">{{
              $t('selectAlternativeDoc')
            }}</span>
            <v-icon color="#22242C"> mdi-plus-circle-outline </v-icon>
          </v-row>
        </div>

        <!-- list VB thay the -->
        <div
          v-show="lstSelectedReplaceDoc.length > 0"
          class="wrap-lst-replace-doc px-13 mt-1"
        >
          <v-simple-table dense fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center" style="width: 10%">STT</th>
                  <th class="text-left" style="width: 20%">
                    {{ $t('numSymbol2') }}
                  </th>
                  <th class="text-left" style="width: 48%">
                    {{ $t('docName') }}
                  </th>
                  <th class="text-left" style="width: 12%">
                    {{ $t('expiryDate') }}
                  </th>
                  <th class="text-left" style="width: 10%">
                    {{ $t('action1') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in lstSelectedReplaceDoc" :key="index">
                  <!-- STT -->
                  <td class="text-center">
                    <div class="my-2">{{ index + 1 }}</div>
                  </td>

                  <!-- So ky hieu -->
                  <td class="text-left">
                    <div class="maxline2">
                      {{ item.code }}
                    </div>
                  </td>

                  <!-- Ten van ban -->
                  <td class="text-left">
                    <div class="btn d-flex">
                      <v-tooltip
                        top
                        content-class="tooltip-top"
                        max-width="30%"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" class="maxline2" v-on="on">
                            {{ item.documentTitle }}
                          </div>
                        </template>
                        <span>{{ item.documentTitle }}</span>
                      </v-tooltip>
                    </div>
                    <div class="txt-caption black-1">
                      {{ item.formulaName }}
                    </div>
                  </td>

                  <!-- Het hieu luc -->
                  <td class="text-left">
                    {{ item.expireDate }}
                  </td>

                  <!-- Thao tac -->
                  <td class="text-center">
                    <v-btn
                      icon
                      small
                      color="#ff4a55"
                      @click="deleteReplaceItem(item.documentId)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>

        <!-- Mo ta -->
        <label class="text--label edoc-text--body-4 px-13 pt-5">
          {{ $t('libraries.detail.description') }}
        </label>
        <v-textarea
          v-model="description"
          rows="3"
          outlined
          maxlength="500"
          counter="500"
          name="note"
          :placeholder="$t('tickets.placeholders.describe')"
          class="edoc-text--body-2 mx-13"
          @change="trimSpaceDescription"
        />
      </div>

      <!-- Bottom button -->
      <v-row class="ma-0 justify-center py-7">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-150 py-5 text--button mr-7"
          @click="closeDialog"
        >
          {{ $t('cancelLabel') }}
        </v-btn>

        <v-btn
          rounded
          color="primary"
          class="w-150 py-5 text--button"
          :disabled="disableSaveLib"
          @click="showConfirm"
        >
          {{ $t(saveUpdateLibrary) }}
        </v-btn>
      </v-row>
    </div>

    <DialogSelectReplaceDoc
      :show-dialog="showDialogSelectReplaceDoc"
      :build-group-id="buildGroupId"
      :lst-selected-replace-doc="lstSelectedReplaceDoc"
      :document-id="documentId"
      @selectedReplaceDoc="selectedReplaceDoc"
      @close-dialog="showDialogSelectReplaceDoc = false"
    />

    <DialogConfirmSave
      :title-confirm="updateLibrary ? 'messUpdateLib' : 'messSaveLib'"
      :show-dialog="showConfirmSaveLib"
      @close-dialog="showConfirmSaveLib = false"
      @accept-action="saveLibrary"
    />
    <base-preload :dialog="loading" />
  </v-dialog>
</template>

<script>
import filterItems from '@/mixins/filterItems.js'
import rules from '@/mixins/rules'
import moment from 'moment'
import { DocumentService } from '@/modules/edocument/services/documentService'
import DialogSelectReplaceDoc from '@/modules/edocument/views/document/library/components/DialogSelectReplaceDoc'
import DialogConfirmSave from '@/modules/edocument/views/components/DialogConfirmSave'
import { mapActions } from 'vuex'

export default {
  name: 'DialogSaveLibrary',

  components: {
    DialogSelectReplaceDoc,
    DialogConfirmSave
  },

  mixins: [filterItems, rules],

  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    documentId: {
      type: Number,
      default: 0
    },
    documentCurrent: {
      type: Object,
      default: null
    },
    updateLibrary: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      lstGroup: [],
      buildGroupId: null,

      lstScope: [],
      idScope: null,
      lstScopeSelected: [],

      // Date expired.
      menuDateExpired: null,
      errorDateExpired: null,
      dateExpiredPicker: null,
      dateExpiredValue: null,

      description: '',
      showDialogSelectReplaceDoc: false,
      disableSaveLib: true,
      showConfirmSaveLib: false,
      lstSelectedReplaceDoc: [],
      errorsScoped: null,
      libraryInfo: null,
      firstShow: true
    }
  },

  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },
    infoSaveLib() {
      if (this.updateLibrary) return 'updateSaveLib'
      return 'infoSaveLib'
    },
    saveUpdateLibrary() {
      if (this.updateLibrary) return 'document.tooltip.saveUpdateLibrary'
      return 'document.tooltip.saveLibrary'
    }
  },

  watch: {
    async showDialog() {
      if (this.showDialog) {
        await this.initData()
        await this.loadChildrenGroups()

        if (this.updateLibrary) {
          await this.getLibraryInfo()
        } else {
          this.dateExpiredValue =
          this.documentCurrent && this.documentCurrent.promulgateDate
            ? this.documentCurrent.expireDate
            : null
          this.dateExpiredPicker = this.dateExpiredValue
            ? moment(this.dateExpiredValue, 'DD/MM/YYYY').format('YYYY-MM-DD')
            : null
        }
      }
    },

    dateExpiredPicker(date) {
      if (date) this.dateExpiredValue = this.formatDate(date)
      this.checkDisableSaveLib()
    },

    dateExpiredValue() {
      this.errorDateExpired = null
      this.dateExpiredPicker = ''
      if (this.dateExpiredValue) {
        let isValid = true
        if (!moment(this.dateExpiredValue, 'DD/MM/YYYY', true).isValid()) {
          this.errorDateExpired = this.$t('contract.expireDateInvalid')
          isValid = false
          this.dateExpiredPicker = ''
        }

        if (isValid) {
          var dateNowValue = moment().format('DD/MM/YYYY')

          const dateNow = moment(dateNowValue, 'DD/MM/YYYY')
          const timeExpired = moment(this.dateExpiredValue, 'DD/MM/YYYY')
          const diff = timeExpired.diff(dateNow, 'days')
          this.errorDateExpired = null
          this.dateExpiredPicker = moment(
            this.dateExpiredValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
          if (diff <= 0) {
            this.errorDateExpired = 'contract.expireDateAndNow'
            return
          }
        }
      }
      this.checkDisableSaveLib()
    },

    lstScopeSelected() {
      this.validateScope()
      this.checkDisableSaveLib()
    },

    buildGroupId() {
      this.checkDisableSaveLib()
    }
  },

  methods: {
    ...mapActions('layout', ['setNotify']),

    async initData() {
      this.lstGroup = []
      this.lstScope = []
      this.libraryInfo = null
      this.firstShow = true
      this.errorsScoped = null
      this.buildGroupId = null
      this.idScope = null
      this.menuDateExpired = null
      this.errorDateExpired = null
      this.dateExpiredValue = null
      this.dateExpiredPicker = null
      this.description = null
      this.lstScopeSelected = []
      this.lstSelectedReplaceDoc = []
    },

    async getLibraryInfo() {
      try {
        this.loading = true
        const response = await DocumentService.getLibraryInfo(this.documentId)
        this.libraryInfo = response.data
        if (this.libraryInfo) {
          const groupExist = this.lstGroup.find(
            item => item.groupId === this.libraryInfo.submissionGroupId
          )
          if (groupExist) {
            this.buildGroupId = groupExist.groupId
          }

          this.dateExpiredValue = this.libraryInfo.expireDate
          this.lstSelectedReplaceDoc = this.libraryInfo.replaceDocuments
          this.description = this.libraryInfo.note
          if (
            this.libraryInfo.groupScopes &&
            this.libraryInfo.groupScopes.length > 0
          ) {
            this.libraryInfo.groupScopes.filter(item => {
              this.onChangeScope(item.groupId)
            })
          }
          this.loading = false
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },

    validateScope() {
      this.errorsScoped = 'libraries.create.errorsScoped'
      if (this.lstScopeSelected && this.lstScopeSelected.length > 0) {
        this.errorsScoped = null
      }
      if (this.firstShow) this.errorsScoped = null
      this.firstShow = false
    },

    closeDialog() {
      this.$refs.observer.reset()
      this.$emit('close-dialog', false)
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    trimSpaceDescription() {
      this.description = this.description.trim()
    },

    async loadChildrenGroups() {
      try {
        const response = await DocumentService.getLoadChildrenGroup()
        this.lstGroup = response.data
        if (this.lstGroup.length > 0 && !this.updateLibrary) {
          this.buildGroupId = this.lstGroup[0].groupId
        }
        this.lstScope = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async selectReplaceDoc() {
      this.showDialogSelectReplaceDoc = true
    },

    checkDisableSaveLib() {
      this.disableSaveLib = true
      if (
        this.buildGroupId &&
        this.lstScopeSelected.length > 0 &&
        !this.errorDateExpired
      ) {
        this.disableSaveLib = false
      }
    },

    onChangeScope(idScope) {
      if (idScope) {
        const scope = this.lstScope.find(item => {
          return item.groupId === idScope
        })

        if (scope) {
          this.lstScopeSelected.push(scope)

          var lst = []
          lst = this.lstScope.filter(item => {
            return item.groupId !== idScope
          })

          this.lstScope = lst
          this.$nextTick(() => {
            this.idScope = null
          })
        }
      }
    },

    onRemoveScope(groupId) {
      this.lstScopeSelected = this.lstScopeSelected.filter(item => {
        return item.groupId !== groupId
      })

      const lstScopeSelectedId = []
      this.lstScopeSelected.map(item => {
        lstScopeSelectedId.push(item.groupId)
      })

      this.lstScope = this.lstGroup.filter(item => {
        return !lstScopeSelectedId.includes(item.groupId)
      })
    },

    showConfirm() {
      this.showConfirmSaveLib = true
    },

    async saveLibrary() {
      if (this.buildGroupId && this.lstScopeSelected.length > 0) {
        try {
          const lstScopeSelectedId = []
          this.lstScopeSelected.map(item => {
            lstScopeSelectedId.push(item.groupId)
          })

          var replaceDocIds = []
          this.lstSelectedReplaceDoc.map(item => {
            replaceDocIds.push(item.documentId)
          })
          var formData = {
            note: this.description,
            expireDate: this.dateExpiredValue
              ? this.dateExpiredValue.replaceAll('/', '')
              : null,
            documentId: this.documentId,
            submissionGroupId: this.buildGroupId,
            documentScope: lstScopeSelectedId,
            replaceDocumentIds: replaceDocIds,

            proclaimId: this.updateLibrary
              ? this.documentCurrent.proclaimId
              : null
          }

          await DocumentService.saveLibrary(formData)

          var message = this.updateLibrary
            ? 'mess_update_lib_success'
            : 'mess_save_lib_success'
          const typeAlert = 'success'
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message)
          })

          this.$refs.observer.reset()
          this.$emit('close-dialog', true)
        } catch (e) {
          const typeAlert = 'error'
          const message = e.message
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message)
          })
        }
      }
    },

    deleteReplaceItem(docId) {
      this.lstSelectedReplaceDoc = this.lstSelectedReplaceDoc.filter(
        item => item.documentId !== docId
      )
    },

    selectedReplaceDoc(val) {
      this.lstSelectedReplaceDoc = val
    }
  }
}
</script>

<style lang="scss">
.dialog-save-lib {
  border-radius: 20px !important;
}

.wrap-dialog-save-lib {
  position: relative;
  background-color: white;
  border-radius: 20px !important;

  .close-dialog {
    position: absolute !important;
    right: 15px;
    top: 10px;
  }

  .text--label {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #4e5056;
    text-transform: uppercase;
  }

  .text--label2 {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #4e5056;
  }

  .date-picker {
    position: relative;
  }

  .col {
    padding-bottom: 0px !important;
  }

  .wrap-replace-doc {
    border: 1px dashed #252733;
    border-radius: 5px;
    padding: 18px 0px;
  }

  .wrap-list-scope {
    max-height: 120px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .wrap-item-scope {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    justify-items: center;
    align-items: center;

    .text-group-name {
      font-weight: 600;
      font-size: 14px;
      line-height: 18px;
      color: #22242c;
    }
  }
  .text-group-path {
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    color: #8e8ea1;
  }
  .txt-caption {
    color: #8e8ea1;
    font-size: 11px;
  }
}

.wrap-lst-replace-doc {
  .v-data-table > .v-data-table__wrapper {
    height: auto !important;
    max-height: 215px !important;
    min-height: 100px !important;
  }
  .v-data-table__wrapper table thead th {
    color: #4e5056 !important;
    font-weight: 700 !important;
    font-size: 12px !important;
  }
  .v-data-table__wrapper table tbody tr td {
    color: #22242c !important;
    font-weight: 600 !important;
    font-size: 12px !important;
  }
}

.wrap-content-save-lib {
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}
</style>
