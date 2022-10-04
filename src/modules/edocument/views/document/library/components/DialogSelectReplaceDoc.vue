<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="90%"
    height="800px"
    content-class="dialog-select-replace-doc"
  >
    <div class="wrap-dialog-select-replace-doc edocument-font">
      <!-- Title -->
      <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      <h5 class="text-center text-capitalize pt-4">
        {{ $t('selectAlternativeDoc') }}
      </h5>

      <!-- List -->
      <SearchReplaceDoc
        ref="searchReplaceDoc"
        :formdata="formdata"
        :search-document="searchDocument"
        :change-show-advance="changeShowAdvance"
      />

      <v-layout wrap>
        <div class="col-sm-12 px-0 pt-0">
          <div
            v-if="listDocument.length == 0 || loadingTable"
            class="col-md-5 col-12 mx-auto wrap-empty-list"
          >
            <EmptyBoxEdocumentReplace :loading="loadingTable" />
          </div>

          <div v-else class="text-center my-2 content-list-document">
            <v-scroll-y-transition>
              <v-simple-table v-show="showTable" dense fixed-header>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 4%">
                        <v-checkbox
                          v-model="checkboxAll"
                          :value="valCheckBoxAll"
                          :indeterminate="indeterminateAll"
                          @change="onChangeCheckBoxAll"
                        ></v-checkbox>
                      </th>
                      <th class="text-center" style="width: 3%">STT</th>
                      <th class="text-left" style="width: 8%">
                        {{ $t('numSymbol') }}
                      </th>
                      <th class="text-left" style="width: 30%">
                        {{ $t('docName') }}
                      </th>
                      <th class="text-left" style="width: 15%">
                        {{ $t('contract.signer') }}
                      </th>
                      <th class="text-left" style="width: 15%">
                        {{ $t('proclaimGroup') }}
                      </th>
                      <th class="text-left" style="width: 10%">
                        {{ $t('dateProclaim') }}
                      </th>
                      <th class="text-left" style="width: 10%">
                        {{ $t('contract.label.signUserType.creator') }}
                      </th>
                      <th class="text-left" style="width: 5%">
                        {{ $t('electronicSign.signFile') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody :class="{ 'disable-hover': activeIndex != null }">
                    <tr v-for="(item, index) in listDocument" :key="index">
                      <!-- CheckBox -->
                      <td class="text-center">
                        <v-checkbox
                          v-model="lstCheckBoxSelected"
                          :value="item.documentId"
                          @change="onChangeItemCheckBox(item.documentId)"
                        ></v-checkbox>
                      </td>

                      <!-- STT -->
                      <td class="text-center">
                        <div class="my-2">{{ index + fromRecord }}</div>
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
                        <div class="caption black-1">
                          {{ item.formulaName }}
                        </div>
                      </td>

                      <!-- Avatar -->
                      <td
                        class="text-left link-hover"
                        :class="{ 'popup-acvite': activeIndex == index }"
                      >
                        <div
                          v-if="item.signers.length === 1"
                          class="group-avatar-signer"
                        >
                          <popup-signer
                            :list-show-popup="listShowPopup"
                            :lst-colors="lstColors"
                            :item="item"
                            :active-index="activeIndex"
                            :index="index"
                            @close-popup-signer="closePopupSigner"
                          />
                          <div class="group-avatar d-flex align-center">
                            <avatar-signer
                              :lst-colors="lstColors"
                              :item="item"
                              :index-row="index"
                              class="list-signer"
                              @active-show-popup-signer="activeShowPopupSigner"
                            />
                            <span class="render-signer-name">
                              {{ renderGroupName(item.signers[0]) }}
                            </span>
                          </div>
                        </div>

                        <div v-else class="group-avatar-signer">
                          <popup-signer
                            :list-show-popup="listShowPopup"
                            :lst-colors="lstColors"
                            :item="item"
                            :active-index="activeIndex"
                            :index="index"
                            @close-popup-signer="closePopupSigner"
                          />
                          <div class="group-avatar d-flex align-center">
                            <list-avatar-signer
                              :lst-colors="lstColors"
                              :item="item"
                              :index-row="index"
                              class="list-signer"
                              @active-show-popup-signer="activeShowPopupSigner"
                            />
                            <v-avatar
                              v-if="item.signers.length > 5"
                              size="32"
                              :color="lstColors[4]"
                              class="signer"
                              @click="activeShowPopupSigner(index)"
                            >
                              <span class="text-uppercase white--text">
                                {{ item.signers.length - 4 }}+
                              </span>
                            </v-avatar>
                          </div>
                        </div>
                      </td>

                      <!-- Don vi ban hanh -->
                      <td class="text-left">
                        <div class="btn d-flex">
                          <v-tooltip
                            top
                            content-class="tooltip-top"
                            max-width="30%"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <div v-bind="attrs" class="maxline2" v-on="on">
                                {{ item.promulgateGroupName }}
                              </div>
                            </template>
                            <span>{{ item.promulgateGroupName }}</span>
                          </v-tooltip>
                        </div>
                      </td>

                      <!-- Ngay ban hanh -->
                      <td class="text-left">
                        {{ item.promulgateDate }}
                      </td>

                      <!-- Nguoi tao -->
                      <td class="text-left">
                        <span class="maxline2">{{ item.creatorName }}</span>
                      </td>

                      <!-- File ky -->
                      <td class="text-left d-flex align-center">
                        <v-row class="ma-0">
                          <!-- Icon file pdf -->
                          <div class="lg-4">
                            <v-tooltip
                              v-if="item.mainSigningFiles"
                              left
                              content-class="tooltip-left"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="
                                    clickFileDoc(item.mainSigningFiles[0])
                                  "
                                >
                                  <img src="@/assets/icons/pdf.svg" alt="pdf" />
                                </v-btn>
                              </template>
                              <span>
                                {{ item.mainSigningFiles[0].fileName }}
                              </span>
                            </v-tooltip>
                          </div>

                          <!-- show list khi co nhieu file trinh ky -->
                          <div class="lg-4" style="width: 20%">
                            <span class="file-signer-show">
                              <v-menu
                                v-if="
                                  item.mainSigningFiles &&
                                    item.mainSigningFiles.length > 1
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
                                      {{ $t('listSignDocFile') }}
                                      ({{ item.mainSigningFiles.length }})
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
                                      v-for="(file, i) in item.mainSigningFiles"
                                      :key="`${i}-${file.id}`"
                                      class="py-0"
                                      @click="clickFileDoc(file)"
                                    >
                                      <v-tooltip
                                        top
                                        content-class="tooltip-top"
                                        max-width="30%"
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
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-scroll-y-transition>
          </div>
        </div>
      </v-layout>

      <!-- paging -->
      <div
        :class="loadingTable ? 'disabledbutton' : ''"
        class="mt-5 mx-2 px-8 pb-5"
      >
        <base-paging
          :page="page"
          :total-pages="totalPages"
          :from-record="fromRecord"
          :to-record="toRecord"
          :total-records="totalRecords"
          @on-change-page="onChangePage"
        />
      </div>
      <v-divider />

      <!-- Bottom btn -->
      <v-row class="ma-0 py-5 px-6">
        <v-menu top offset-y :max-width="500" :min-width="200">
          <template v-slot:activator="{ on, attrs }">
            <span class="text-select-doc" v-bind="attrs" v-on="on">
              {{ lstCheckBoxSelected.length }} {{ $t('doc_selected') }}
            </span>
          </template>
          <div
            v-if="lstDocSelected.length > 0"
            class="wrap-list-select-replace-doc"
          >
            <v-simple-table dense fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center" style="width: 10%">STT</th>
                    <th class="text-left" style="width: 20%">
                      {{ $t('numSymbol') }}
                    </th>
                    <th class="text-left" style="width: 55%">
                      {{ $t('docName') }}
                    </th>
                    <th class="text-center" style="width: 15%">
                      {{ $t('action1') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in lstDocSelected" :key="index">
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
                      <div class="caption black-1">
                        {{ item.formulaName }}
                      </div>
                    </td>

                    <!-- Thao tac -->
                    <td class="text-center">
                      <v-btn icon @click="deleteReplaceItem(item.documentId)">
                        <v-icon color="#0a093a"> mdi-close </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>

          <div v-else class="empty-replace-doc">
            {{ $t('empty.data') }}
          </div>
        </v-menu>
        <v-spacer />

        <v-btn
          rounded
          outlined
          color="primary"
          class="w-150 py-4 text--button mr-7"
          @click="closeDialog"
        >
          {{ $t('cancelLabel') }}
        </v-btn>

        <v-btn
          rounded
          color="primary"
          class="w-150 py-4 text--button"
          @click="selectReplaceDoc"
        >
          {{ $t('selectLabel') }}
        </v-btn>
      </v-row>

      <dialog-view-pdf
        :src-file-pdf="srcFilePdf"
        :show-dialog="showDialogViewPdf"
        @close-dialog="showDialogViewPdf = false"
      />

      <base-preload :dialog="loading" />
    </div>
  </v-dialog>
</template>

<script>
import moment from 'moment'
import SearchReplaceDoc from '@/modules/edocument/views/document/library/components/SearchReplaceDoc'
import popupAvatar from '@/mixins/popupAvatar'
import PopupSigner from '@/modules/edocument/views/components/PopupSigner'
import ListAvatarSigner from '@/modules/edocument/views/components/ListAvatarSigner'
import AvatarSigner from '@/modules/edocument/views/components/AvatarSigner'
import customAvatar from '@/modules/edocument/mixins/customAvatar'
import pagingData from '@/mixins/paging'
import customsFile from '@/modules/edocument/mixins/customsFile'
import { DocumentService } from '@/modules/edocument/services/documentService'
import EmptyBoxEdocumentReplace from '@/views/components/EmptyBoxEdocumentReplace.vue'
import DialogViewPdf from '@/views/components/DialogViewPdf.vue'
import { mapActions } from 'vuex'

export default {
  name: 'DialogSelectReplaceDoc',

  components: {
    SearchReplaceDoc,
    AvatarSigner,
    ListAvatarSigner,
    PopupSigner,
    EmptyBoxEdocumentReplace,
    DialogViewPdf
  },

  mixins: [pagingData, customsFile, popupAvatar, customAvatar],

  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    buildGroupId: {
      type: Number,
      default: 0
    },
    lstSelectedReplaceDoc: {
      type: Array,
      default: null
    },
    documentId: {
      type: Number,
      default: 0
    },
  },

  data() {
    return {
      formdata: {
        documentId: null,
        page: 1,
        pageSize: 5,
        keyword: '',
        proclaimFromDate: null, // ngày lưu thư viện.
        proclaimToDate: null,
        docType: null, // Loai van ban.
        formulaTypeId: null, // Hinh thuc van ban.
        promulgateGroupId: null,
        promulgateGroupName: null,
        signerId: null,
        signerInfo: null,
        promulgateFromDate: null,
        promulgateToDate: null // Don vi xay dung.
      },

      listDocument: [],
      loading: false,
      showTable: false,
      lstCheckBoxSelected: [],
      loadingTable: false,

      checkboxAll: false,
      indeterminateAll: false,
      valCheckBoxAll: 0,
      lstDocSelected: [],

      srcFilePdf: null
    }
  },

  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    }
  },

  watch: {
    showDialog() {
      if (this.showDialog) {
        this.formdata.documentId = null
        this.formdata.page = 1
        this.formdata.keyword = ''
        this.formdata.proclaimFromDate = 0 // ngày lưu thư viện.
        this.formdata.proclaimToDate = null
        this.formdata.docType = null // Loai van ban.
        this.formdata.formulaTypeId = null // Hinh thuc van ban.
        this.formdata.promulgateGroupId = null
        this.formdata.promulgateGroupName = null
        this.formdata.signerId = null
        this.formdata.signerInfo = null
        this.formdata.promulgateFromDate = null
        this.formdata.promulgateToDate = null
        this.lstCheckBoxSelected = []
        this.lstDocSelected = []
        this.checkboxAll = true
        this.indeterminateAll = false
        this.lstSelectedReplaceDoc.map(item => {
          this.lstCheckBoxSelected.push(item.documentId)
          this.lstDocSelected.push(item)
        })

        if (this.$refs.searchReplaceDoc) {
          this.$refs.searchReplaceDoc.closeAdvanceSearch()
        }
        this.search()
      }
    },

    lstCheckBoxSelected() {
      if (this.lstCheckBoxSelected.length === 0) {
        this.indeterminateAll = false
        this.checkboxAll = false
        return
      }

      var numSelected = 0
      this.listDocument.map(item => {
        if (this.lstCheckBoxSelected.includes(item.documentId)) {
          numSelected++
        }
      })

      if (numSelected === this.listDocument.length) {
        this.indeterminateAll = false
        this.checkboxAll = true
      } else {
        this.indeterminateAll = true
        this.checkboxAll = false
      }
    }
  },

  methods: {
    ...mapActions('layout', ['setNotify']),

    closeDialog() {
      this.$emit('close-dialog')
    },

    changeShowAdvance(value) {
      this.showAdvance = value
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    isValidDate(strDate) {
      return moment(strDate, 'DDMMYYYY', true).isValid()
    },

    searchDocument() {
      this.formdata.page = 1
      this.search()
    },

    onChangePage(page) {
      this.closePopupSigner()
      this.formdata.page = page
      this.page = page
      this.search()
    },

    async search() {
      try {
        this.loadingTable = true
        if (this.showAdvance) {
          const promulgateFromDate = this.isValidDate(
            this.formdata.promulgateFromDate
          )
          const promulgateToDate = this.isValidDate(
            this.formdata.promulgateToDate
          )
          if (this.formdata.promulgateFromDate && !promulgateFromDate) return
          if (this.formdata.promulgateToDate && !promulgateToDate) return

          // Date luu thu vien.
          const proclaimFromDate = this.isValidDate(
            this.formdata.proclaimFromDate
          )
          const proclaimToDate = this.isValidDate(this.formdata.proclaimToDate)
          if (this.formdata.proclaimFromDate && !proclaimFromDate) return
          if (this.formdata.proclaimToDate && !proclaimToDate) return
        }
        this.formdata.documentId = this.documentId
        const response = await DocumentService.getDocReplace(this.formdata)
        const dataResponse = response.data
        this.listDocument = dataResponse.data

        var listDocTemp = []
        var numSelected = 0
        this.checkboxAll = true
        this.indeterminateAll = false
        this.listDocument.map(item => {
          if (!this.lstCheckBoxSelected.includes(item.documentId)) {
            this.checkboxAll = false
          } else {
            numSelected++
          }
          listDocTemp.push({
            ...item,
            showMenu: false
          })
        })
        if (numSelected > 0 && numSelected < this.listDocument.length) {
          this.indeterminateAll = true
        }
        this.listDocument = listDocTemp
        this.renderPaging(dataResponse)
        setTimeout(() => {
          this.showTable = true
        }, 10)
      } catch (error) {
        this.isShowAlert = true
        this.messages = error
      } finally {
        this.loadingTable = false
      }
    },

    clickFileDoc(file) {
      this.downloadFile(file)
    },

    onCloseMenu(item) {
      return !item.showMenu
    },

    onChangeCheckBoxAll(val) {
      this.lstCheckBoxSelected = []

      var lstIdReplaceTemp = []
      this.listDocument.map(item => {
        lstIdReplaceTemp.push(item.documentId)
      })

      if (val) {
        this.lstDocSelected = this.lstDocSelected.filter(
          item => !lstIdReplaceTemp.includes(item.documentId)
        )

        this.lstDocSelected.map(item => {
          this.lstCheckBoxSelected.push(item.documentId)
        })

        this.listDocument.map(item => {
          this.lstCheckBoxSelected.push(item.documentId)
          this.lstDocSelected.push(item)
        })
      } else {
        this.lstDocSelected = this.lstDocSelected.filter(
          item => !lstIdReplaceTemp.includes(item.documentId)
        )

        this.lstDocSelected.map(item => {
          this.lstCheckBoxSelected.push(item.documentId)
        })
      }
    },

    onChangeItemCheckBox(val) {
      if (this.lstCheckBoxSelected.includes(val)) {
        this.listDocument.map(item => {
          if (item.documentId === val) {
            this.lstDocSelected.push(item)
          }
        })
      } else {
        this.lstDocSelected = this.lstDocSelected.filter(
          item => item.documentId !== val
        )
      }
    },

    deleteReplaceItem(idDoc) {
      this.lstCheckBoxSelected = this.lstCheckBoxSelected.filter(
        item => item !== idDoc
      )

      this.lstDocSelected = this.lstDocSelected.filter(
        item => item.documentId !== idDoc
      )
    },

    selectReplaceDoc() {
      this.$emit('selectedReplaceDoc', this.lstDocSelected)
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="scss">
.dialog-select-replace-doc {
  border-radius: 20px !important;
}

.wrap-dialog-select-replace-doc {
  .disabledbutton {
    pointer-events: none;
    opacity: 0.4;
  }
  height: 100%;
  position: relative;
  background-color: white;
  border-radius: 20px !important;

  .text-select-doc {
    font-weight: 600;
    font-size: 14px;
    line-height: 15px;
    text-decoration-line: underline;
    color: #0a093d;
    cursor: pointer;
  }

  .col {
    padding-bottom: 0px !important;
    padding-top: 0px !important;
  }

  .close-dialog {
    position: absolute !important;
    right: 15px;
    top: 10px;
  }

  .text--label {
    font-weight: 700;
    font-size: 12px;
    line-height: 15px;
    color: #4b506d;
    text-transform: uppercase;
  }

  .list-signer {
    position: relative;
  }

  .wrap-list-search {
    border-radius: 8px;
    position: absolute;
    border: 1px solid #c4c4c4;
    z-index: 9;
    width: 93%;
    top: 80px;
    max-height: 220px;
    overflow-y: auto;
    .v-list-item {
      min-height: 45px !important;
      padding: 5px !important;
    }
  }

  .wrap-empty-list {
    height: calc(100vh - 550px) !important;
    min-height: 30vh;
  }

  .content-list-document {
    .v-data-table > .v-data-table__wrapper,
    .wrap-empty-list {
      height: calc(100vh - 550px) !important;
      min-height: 30vh;
    }
  }

  .v-input--selection-controls {
    padding-top: 0px !important;

    .v-input__slot {
      margin-bottom: 0px !important;
      align-items: center;
      justify-content: center;
    }
  }

  .v-input--selection-controls__input {
    margin-right: 0px !important;
  }

  .v-data-table__wrapper {
    table {
      thead {
        th {
          color: #8e8ea1 !important;
          box-shadow: none !important;
          font-size: 14px !important;
          font-weight: 700 !important;
        }
      }

      tbody {
        td {
          font-weight: 600;
          font-size: 14px !important;
          color: #22242c;

          button {
            position: relative;

            .icon-sign {
              position: absolute;
              right: -20px;
            }
          }
        }

        .caption {
          font-weight: 400 !important;
          font-size: 12px !important;
          line-height: 13px !important;
          color: #8e8ea1 !important;
        }
      }
    }
  }

  .group-avatar-signer {
    position: relative;

    .signer-document {
      line-height: 14px;
    }

    .signer {
      cursor: pointer;
      overflow: unset;

      &:hover {
        .signer-tooltip {
          display: block;
        }
      }
    }

    .signer-avatar {
      cursor: pointer;
      overflow: unset;

      &:hover {
        .signer-tooltip {
          display: block;
        }
      }
    }

    .signer-tooltip {
      display: none;
      position: absolute;
      width: 300px;
      top: 50%;
      z-index: 9999;
      background: #ffffff;
      border: 1px solid #c4c4c4;
      box-sizing: border-box;
      border-radius: 8px;
      color: #000;
      right: 40px;
      padding: 18px;
      transform: translateY(-50%);

      &::after {
        content: url('../../../../../../assets/icons/arrow-right-signer.png');
        position: absolute;
        right: -10px;
        top: 30px;
      }

      filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));

      .v-avatar {
        span {
          color: #fff;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 14px;
        }
      }

      b {
        color: #22242c;
        font-size: 14px;
        font-weight: 600;
      }

      span {
        color: #9fa2b4;
        font-size: 12px;
        font-weight: 400;
      }
    }
  }

  .group-avatar {
    position: relative;

    .list-signer {
      display: contents;
      position: absolute;
    }

    .signer {
      position: absolute;
      left: 80px;
      cursor: pointer;
      overflow: unset;

      &:hover {
        .signer-tooltip {
          display: block;

          &:hover {
            display: none;
          }
        }
      }
    }

    .render-signer-name {
      position: absolute;
      left: 40px;
    }

    .signer-avatar {
      position: absolute;
      cursor: pointer;
      overflow: unset;

      &:hover {
        .signer-tooltip {
          display: block;

          &:hover {
            display: none;
          }
        }
      }
    }
  }

  .link-hover {
    &:hover {
      color: #0fafe4;
      cursor: pointer;
    }
  }

  .disable-hover {
    .group-avatar-signer {
      .signer {
        &:hover {
          .signer-tooltip {
            display: none;
          }
        }
      }

      .signer-avatar {
        &:hover {
          .signer-tooltip {
            display: none;
          }
        }
      }
    }
  }
}

.wrap-list-select-replace-doc {
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
    height: 50px !important;
  }
}

.empty-replace-doc {
  width: 200px;
  padding: 10px;
}
</style>
