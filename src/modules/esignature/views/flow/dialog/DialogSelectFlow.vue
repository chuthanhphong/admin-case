<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="80%"
    :content-class="showDialogSign ? 'dialog-template' : ''"
  >
    <v-card class="px-4">
      <div class="wrap--dialog-select-flow px-5">
        <v-card-title class="d-flex justify-center">
          <h4 class="text-center font--bold text-capitalize">
            {{ $t('document.selectTemplate') }}
          </h4>
          <v-icon
            class="close-dialog"
            @click="cancelSelectFlow"
          >mdi-close</v-icon>
        </v-card-title>

        <!-- Search -->
        <div class="wrap-template">
          <v-row class="ma-0 align-center">
            <v-col class="py-0">
              <SearchFlow
                class="py-0"
                :formdata="formdata"
                :search-document="searchDocument"
                :change-show-advance="changeShowAdvance"
                :show-btn-create="false"
              />
            </v-col>
          </v-row>
          <v-radio-group v-model="flow">
            <div class="content-template">
              <v-simple-table
                dense
                fixed-header
              >
                <template v-slot:default>
                  <thead class="text--body-3">
                    <tr>
                      <th class="text-center stt" style="width: 4%">Stt</th>
                      <th class="text-left" style="width: 26%">
                        {{ $t('electronicSign.labelSearch') }}
                      </th>
                      <th class="text-left" style="width: 10%">
                        {{ $t('electronicSign.textForm') }}
                      </th>
                      <th class="text-left" style="width: 20%">
                        {{ $t('document.label.scopeUse') }}
                      </th>
                      <th class="text-left" style="width: 15%">
                        {{ $t('electronicSign.dateCreated') }}
                      </th>
                      <th class="text-left" style="width: 15%">
                        {{ $t('signUserType') }}
                      </th>
                      <th class="text-left" style="width: 10%">
                        {{ $t('electronicSign.signFile') }}
                      </th>
                    </tr>
                  </thead>

                  <tbody class="text--body-2 body-flow">
                    <div v-if="listFlow.length == 0">
                      <div class="no-data-table text-center">
                        {{ $t('noData') }}
                      </div>
                    </div>
                    <tr
                      v-for="(item, index) in listFlow"
                      :key="index"
                      @click="selectRow(item.id)"
                    >
                      <!-- Radio, Stt -->
                      <td class="text-center">
                        <v-radio
                          class="radio-select-template"
                          :label="`${index + 1}`"
                          :value="item.id"
                          color="black"
                        />
                      </td>

                      <!-- Ten van ban-->
                      <td class="text-left text-link">
                        <div class="d-flex">
                          <v-tooltip top content-class="tooltip-top">
                            <template v-slot:activator="{ on, attrs }">
                              <div v-bind="attrs" class="maxline2" v-on="on">
                                {{ item.documentTitle }}
                              </div>
                            </template>
                            {{ item.documentTitle }}
                          </v-tooltip>
                        </div>
                      </td>

                      <!-- Hinh thuc -->
                      <td class="text-left">
                        {{ item.formulaName }}
                      </td>

                      <!-- Pham vi su dung -->
                      <td class="text-left">
                        <div v-html="renderScopes(item.groupDocumentScopes)" />
                      </td>

                      <!-- Ngay tao -->
                      <td class="text-left">{{ item.createdDate }}</td>

                      <!-- Nguoi tao -->
                      <td class="text-left">
                        {{ item.creatorFullName }}
                      </td>

                      <!-- File ky -->
                      <td class="text-left">
                        <v-container>
                          <v-row>
                            <div class="lg-4">
                              <!-- Icon file pdf -->
                              <v-tooltip
                                v-if="item.mainFiles"
                                left
                                content-class="tooltip-left"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="gotoSign(item.id)"
                                  >
                                    <img
                                      src="@/assets/icons/pdf.svg"
                                      alt=""
                                      srcset=""
                                    >
                                  </v-btn>
                                </template>
                                <span>{{ item.mainFiles[0].fileName }}</span>
                              </v-tooltip>
                            </div>
                            <div class="lg-4" style="width: 20%">
                              <!-- show list khi co nhieu file trinh ky -->
                              <span class="file-signer-show">
                                <v-menu
                                  v-if="
                                    item.mainFiles && item.mainFiles.length > 1
                                  "
                                  v-model="item.showMenu"
                                  :close-on-content-click="true"
                                  offset-x
                                  left
                                  rounded="lg"
                                  :nudge-width="300"
                                >
                                  <template
                                    v-slot:activator="{ on: menu, attrs }"
                                  >
                                    <v-btn v-bind="attrs" icon v-on="menu">
                                      <v-icon> mdi-menu-down </v-icon>
                                    </v-btn>
                                  </template>

                                  <v-card max-width="500px">
                                    <v-card-title
                                      class="d-flex justify-space-between px-3 py-1"
                                    >
                                      <h6 class="black--text pt-0">
                                        {{ $t('document.listSignDocFile') }}
                                        ({{ item.mainFiles.length }})
                                      </h6>
                                      <v-icon
                                        class="close-dialog ml-3"
                                        color="black"
                                        @click="onCloseMenu(item)"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </v-card-title>
                                    <v-divider />
                                    <v-list class="pa-0 list-scroll">
                                      <v-list-item
                                        v-for="(file, i) in item.mainFiles"
                                        :key="`${i}-${file.id}`"
                                        class="py-0"
                                        @click="clickFileDoc(i, item.id)"
                                      >
                                        <v-tooltip
                                          top
                                          content-class="tooltip-top"
                                        >
                                          <template
                                            v-slot:activator="{ on, attrs }"
                                          >
                                            <span
                                              class="doc-text-file"
                                              v-bind="attrs"
                                              v-on="on"
                                            >
                                              {{ i + 1 }}.
                                              {{ customFileName(file) }}
                                            </span>
                                          </template>
                                          <span>{{ file.fileName }}</span>
                                        </v-tooltip>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-menu>
                              </span>
                            </div>
                          </v-row>
                        </v-container>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
          </v-radio-group>

          <v-divider class="mx-6" />

          <!-- Button -->
          <v-row class="ma-0 mx-6 py-5 justify-end">
            <v-btn
              rounded
              outlined
              color="primary"
              class="btn-close text--button mr-5"
              @click="cancelSelectFlow"
            >
              {{ $t('cancelLabel') }}
            </v-btn>

            <v-btn
              :disabled="!flow"
              rounded
              color="primary"
              class="btn-close text--button"
              @click="accept"
            >
              {{ $t('selectLabel') }}
            </v-btn>
          </v-row>
        </div>
      </div>
    </v-card>
    <!-- Dialog ky van ban-->
    <DialogSign
      :show-dialog="showDialogSign"
      :document-id="documentIdSign"
      :index-open-file-doc="indexOpenFileDoc"
      @close-dialog="closeDialogSign"
    />
  </v-dialog>
</template>

<script>
import SearchFlow from '@/modules/esignature/views/flow/list/components/SearchFlow.vue'
import { DocumentService } from '@/modules/esignature/services/documentService'
import moment from 'moment'
import renderUtils from '@/mixins/renderUtils'
import constants from '@/constants'
import DialogSign from '@/modules/esignature/views/sign/SignDocument.vue'
import customsFile from '@/modules/esignature/mixins/customsFile'

export default {
  name: 'DialogSelectFlow',
  components: {
    SearchFlow,
    DialogSign
  },
  mixins: [renderUtils, customsFile],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formdata: {
        page: 1,
        pageSize: 10000,
        fromDate: null,
        toDate: null,
        keyword: '',
        documentScopeIds: null,
        formulaTypeId: '', // Hinh thuc van ban.
        docScopeType: ''
      },
      showAdvanceSearch: false,
      listFlow: [],
      flow: null,
      loading: false,
      showDialogSign: false,
      documentIdSign: null,
      indexOpenFileDoc: 0
    }
  },

  watch: {
  },

  methods: {
    closeDialog() {
      this.flow = null
      this.$emit('close-dialog')
    },

    accept() {
      this.$emit('accept', this.flow)
      this.closeDialog()
    },
    cancelSelectFlow() {
      this.$emit('cancel-select-flow')
      this.closeDialog()
    },
    trimSpace(val) {
      return val ? val.trim() : ''
    },

    changeShowAdvanceSearch() {
      this.showAdvanceSearch = !this.showAdvanceSearch
    },

    searchFlow() {},

    selectRow(id) {
      this.flow = id
    },

    changeShowAdvance(value) {
      this.showAdvance = value
    },

    searchDocument() {
      this.formdata.page = ''
      this.search()
    },
    // View file ky (click icon pdf and icon sign)
    gotoSign(docId) {
      this.indexOpenFileDoc = 0
      this.documentIdSign = docId
      this.showDialogSign = true
    },

    // Click item file sign.
    clickFileDoc(index, docId) {
      this.indexOpenFileDoc = index
      this.documentIdSign = docId
      this.showDialogSign = true
    },

    isValidDate(strDate) {
      return moment(strDate, 'DDMMYYYY', true).isValid()
    },
    // Dong dialog ky van ban
    closeDialogSign() {
      this.showDialogSign = false
    },
    async search() {
      try {
        this.loading = true
        if (!this.showAdvance) {
          this.formdata.formulaTypeId = ''
          this.formdata.docScopeType = constants.ALL
        }
        const validFromDate = this.isValidDate(this.formdata.fromDate)
        const validToDate = this.isValidDate(this.formdata.toDate)
        if (!validFromDate || !validToDate) return

        const response = await DocumentService.getListTemplate(this.formdata)
        const dataResponse = response.data
        this.listFlow = dataResponse.data
        this.renderPaging(dataResponse)
      } catch (error) {
        this.isShowAlert = true
        this.messages = error
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
.dialog-template {

  @media (max-width: 1336px) {
    max-width: 90% !important;
  }
  height: inherit !important;
  .esignature-wrap-sign {
    background-color: #fff;
    padding: 0;
    margin-left: 0 !important;
    border-top-left-radius: 0 !important;
  }
}
.body-flow {
    width: 100%;
    position: relative;
  }
  .no-data-table {
    position: absolute;
    width: 100%;
  }
.wrap--dialog-select-flow {
  .esignature-content-list, .v-data-table>.v-data-table__wrapper, .wrap-empty-list {
    height: calc(100vh - 300px)!important;
  }
  .v-input--selection-controls {
    margin-top: 8px !important;
  }
  .wrap-template {
  .radio-select-template {
    .v-input--selection-controls__input {
      transform: scale(0.7);
    }
  }
}

  background-color: white;
  border-radius: 20px;

  .close-dialog {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .margein-right-6 {
    margin-right: 6px;
  }

  .width-field-search {
    width: 360px !important;
    max-width: 360px !important;

    @media (max-width: 960px) {
      width: 260px !important;
      max-width: 260px !important;
    }
  }

  .btn-advance-search {
    width: 40px !important;
    height: 40px !important;
    min-width: unset !important;
    margin-left: 16px;
  }

  .content-template {
    margin: 0 32px 0 36px;
    max-height: 400px;
    .v-data-table > .v-data-table__wrapper {
      max-height: 400px;
      min-height: unset;
    }
  }

  .btn-close {
    width: 240px;
    height: 40px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  }
  .color--icon-search {
    color: #8e8ea1 !important;
    caret-color: #8e8ea1 !important;
  }
}
</style>
