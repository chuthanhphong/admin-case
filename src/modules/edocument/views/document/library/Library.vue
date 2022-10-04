<template>
  <div class="wrap--list-common edocument-font wrap-content-library-search">
    <h3 class="white--text ml-10 text-capitalize">
      {{ $t('libraries.librariesManagement') }}
    </h3>

    <div class="wrap--content d-flex">
      <TreeFormula :show-action="true" @selected-group="selectedFormulaType" @get-formula-tree="getFormulaTree" />
      <div class="col-sm-10 col-md-10 px-0">
        <div class="border-left-tree">
          <!-- <div class="titleGroupName d-flex align-center ml-2">{{ groupName }}</div> -->
          <SearchLibrary
            :claszz="showDialogSign"
            :formdata="formdata"
            :search-document="searchDocument"
            :change-show-advance="changeShowAdvance"
            :group-name="groupName"
          />
          <v-layout class="pt-2 d-block" wrap>
            <div
              v-if="listDocument.length == 0 || loading"
              class="col-md-5 col-12 mx-auto wrap-empty-list-library"
            >
              <empty-box-edocument :loading="loading" />
            </div>
            <div v-else class="text-center my-2 content-library-document">
              <v-scroll-y-transition>
                <v-simple-table v-show="showTable" dense fixed-header>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center" style="width: 4%">STT</th>
                        <th class="text-left" style="width: 10%">
                          {{ $t('numSymbol') }}
                        </th>
                        <th class="text-left" style="width: 20%">
                          {{ $t('docName') }}
                        </th>
                        <th class="text-left" style="width: 15%">
                          {{ $t('constructionGroup') }}
                        </th>
                        <th class="text-left" style="width: 28%">
                          {{ $t('libraries.listLibrary.scopeUser') }}
                        </th>
                        <th class="text-left" style="width: 12%">
                          {{ $t('expiryDate') }}
                        </th>
                        <th class="text-center" style="width: 10%">
                          {{ $t('dashboards.action') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in listDocument" :key="index">
                        <!-- STT -->
                        <td class="text-center">
                          <div class="my-2">{{ index + fromRecord }}</div>
                        </td>

                        <!-- ID -->
                        <td class="text-left">
                          <div class="maxline2">
                            {{ item.code }}
                          </div>
                        </td>

                        <!-- So ky hieu -->
                        <td
                          class="text-left link-hover"
                          @click="onDetailDoc(item)"
                        >
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
                          <div class="edoc-text--caption black-1">
                            {{ item.formulaName }}
                          </div>
                        </td>

                        <!-- Ten van ban -->
                        <td class="text-left">
                          <div class="d-flex">
                            <v-tooltip
                              top
                              content-class="tooltip-top"
                              max-width="30%"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <div v-bind="attrs" class="maxline2" v-on="on">
                                  {{ item.buildGroupName }}
                                </div>
                              </template>
                              <span>{{ item.buildGroupName }}</span>
                            </v-tooltip>
                          </div>
                        </td>

                        <!-- Don vi ban hanh -->
                        <td class="text-left">
                          <div v-html="renderScopes(item.groupScopeNames)" />
                        </td>

                        <!-- Ngay ban hanh -->
                        <td class="text-left">
                          <div v-if="item.expireDate">
                            {{ item.expireDate }}
                            <div
                              class="edoc-text--caption black-1"
                              :class="item.daysLeft > 0 ? '' : 'text-danger'"
                            >
                              {{ $t('libraries.listLibrary.dayLeft') }}:
                              {{ item.daysLeft }}
                              {{ $t('libraries.listLibrary.date') }}
                            </div>
                          </div>
                        </td>

                        <!-- Thao tac -->
                        <td
                          class="text-left "
                        >
                          <div class="d-flex align-center justify-center">
                            <v-menu
                              v-if="
                                item.showIcons && item.showIcons.length > 0
                              "
                              :top="index > 5"
                              left
                              offset-y
                              transition="scroll-y-transition"
                              :content-class="index <= 5 ? 'menu-action arrow-up' : 'menu-action arrow-down-list'"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  text
                                  fab
                                  dense
                                  small
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  <v-icon> mdi-dots-vertical </v-icon>
                                </v-btn>
                              </template>

                              <v-list class="px-2 item-action">
                                <div
                                  @click="onDetailDoc(item)"
                                  v-html="
                                    viewDetail(`${action}`, item.signUserType)
                                  "
                                />

                                <!-- RenAction -->
                                <div
                                  v-for="(action, id) in item.showIcons"
                                  :key="id"
                                >
                                  <div
                                    @click="showIconHandleDoc(`${action}`, item)"
                                    v-html="
                                      renderAction(`${action}`, item.signUserType)
                                    "
                                  />
                                </div>
                              </v-list>
                            </v-menu>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-scroll-y-transition>
            </div>
          </v-layout>

          <!-- paging -->
          <div class="mt-5 mx-2 px-8 pb-5">
            <base-paging
              :page="page"
              :total-pages="totalPages"
              :from-record="fromRecord"
              :to-record="toRecord"
              :total-records="totalRecords"
              @on-change-page="onChangePage"
            />
          </div>

          <!-- Dialog confirm delete library -->
          <dialog-confirm-save
            title-confirm="messDeleteLib"
            :show-dialog="showConfirmDeleteLib"
            :show-warning="showWarningDeleteLib"
            @close-dialog="showConfirmDeleteLib = false"
            @accept-action="deleteLibrary()"
          />
          <!-- show dialog save library -->
          <DialogSaveLibrary
            :show-dialog="showDialogSaveLibrary"
            :document-id="documentId"
            :document-current="documentCurrent"
            :update-library="updateLibrary"
            @close-dialog="closeDialogSaveLib"
          />

          <base-preload :dialog="loadingDialog" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'
import pagingData from '@/mixins/paging'
import statusDocument from '@/modules/edocument/mixins/statusDocument'
import { DocumentService } from '@/modules/edocument/services/documentService'
import SearchLibrary from './components/SearchLibrary.vue'
import EmptyBoxEdocument from '@/views/components/EmptyBoxEdocument.vue'
import edocumentRoute from '@/modules/edocument/router/routePaths'
import constants from '@/constants'
import { mapActions } from 'vuex'
import TreeFormula from '@/modules/edocument/views/document/library/components/TreeFormula'
import DialogConfirmSave from '@/modules/edocument/views/components/DialogConfirmSave'
import DialogSaveLibrary from "@/modules/edocument/views/document/library/components/DialogSaveLibrary";

export default {
  name: 'ManagementDoc',
  components: {
    SearchLibrary,
    EmptyBoxEdocument,
    TreeFormula,
    DialogConfirmSave,
    DialogSaveLibrary
  },
  mixins: [pagingData, statusDocument],

  data() {
    return {
      showAdvance: false,
      showConfirmDialogTransfer: false,
      titleConfirmDialog: '',
      showConfirmDialog: false,
      showTable: true,
      loading: false,
      docItem: null,
      formdata: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keyword: '',
        fromDate: null,
        toDate: null,
        expiredStatus: null, // trang thai hieu luc
        replacementDocumentStatus: null, // van ban thay the
        buildGroupId: null, // don vi xay dung
        groupScopeId: null, // pham vi ap dung
        formulaTypeId: null // hinh thuc van ban
      },
      listDocument: [],
      showDialogSign: false,
      documentItem: null,
      indexOpenFileDoc: null,
      documentId: null,

      showConfirmDeleteLib: false,
      showWarningDeleteLib: false,
      loadingDialog: false,

      showDialogSaveLibrary: false,
      documentCurrent: null,
      updateLibrary: false,
      groupName: null
    }
  },
  methods: {
    ...mapActions('layout', ['setNotify']),

    renderScopes(groupDocumentScope) {
      if (groupDocumentScope && groupDocumentScope.length > 1) {
        return groupDocumentScope
          .map(scope => {
            if (!scope) return ''
            return `<div>${scope}</div>`
          })
          .join('')
      }
      return groupDocumentScope[0]
    },

    changeShowAdvance(value) {
      this.showAdvance = value
    },
    searchDocument() {
      this.formdata.page = ''
      this.search()
    },

    getFormulaTree(listformula) {
      this.listformula = listformula
      this.getGroupNameSearch()
    },

    getGroupNameSearch() {
      const groupSelected = this.listformula.find(
        g => g.id === this.formdata.formulaTypeId
      )
      var groupName = 'libraries.listLibrary.all'
      if (groupSelected) {
        groupName = groupSelected.name
      }
      this.groupName = groupName
    },

    async search() {
      try {
        this.loading = true
        if (!this.showAdvance) {
          this.formdata.replacementDocumentStatus = null
          this.formdata.groupScopeId = null
          this.formdata.buildGroupId = null
          this.formdata.expiredStatus = 'EDOCUMENT_EFFECT'
        }
        const response = await DocumentService.getListLibrary(this.formdata)
        const dataResponse = response.data
        this.listDocument = dataResponse.data
        this.getGroupNameSearch()

        var listDocTemp = []
        this.listDocument.map(item => {
          listDocTemp.push({
            ...item,
            showMenu: false
          })
        })
        this.listDocument = listDocTemp
        this.renderPaging(dataResponse)
        setTimeout(() => {
          this.showTable = true
        }, 10)
      } catch (error) {
        this.isShowAlert = true
        this.messages = error
      } finally {
        this.loading = false
      }
    },

    selectedFormulaType(formulaTypeId) {
      this.formdata.page = ''
      this.formdata.formulaTypeId = formulaTypeId
      this.search()
    },

    onChangePage(page) {
      this.formdata.page = page
      this.page = page
      this.search()
    },

    onDetailDoc(item) {
      if (item.revokeDocument) {
        return
      }
      localStorage.setItem(
        constants.SEARCH_TYPE_DOCUMENT.SEARCH_TYPE_DOC,
        constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_LIBRARY
      )
      this.$router.push(
        `${edocumentRoute.MANAGEMENT_DOC_DETAIL_PATH.replaceAll(
          ':documentId',
          item.documentId
        )}`
      )
    },
    closeDialogSaveLib(value) {
      this.showDialogSaveLibrary = false;
      if (value) this.search();
    },
    // show icon thao tac cua van ban
    showIconHandleDoc(action, item) {
      this.docItem = item
      this.docAction = action
      if (action === constants.LIST_ACTIONS_DETAIL.DELETE_LIBRARY) {
        this.showConfirmDeleteLib = true
        return
      }
      if (action === constants.LIST_ACTIONS_DETAIL.TRANSFER) {
        this.showConfirmDialogTransfer = true
        return
      }
      if (action === constants.LIST_ACTIONS_DETAIL.EDIT_LIBRARY) {
        this.documentId = item.documentId;
        this.documentCurrent = item
        this.showDialogSaveLibrary = true;
        this.updateLibrary = true;
        return;
      }
      this.clickAction(action, item)
    },

    async deleteLibrary() {
      try {
        this.loadingDialog = true

        await DocumentService.deleteLibrary(this.docItem.documentId)
        this.search()

        this.setNotify({
          show: true,
          type: 'success',
          content: this.$t('messDeleteLibSuccess')
        })
      } catch (error) {
        this.loadingDialog = false
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      } finally {
        this.loadingDialog = false
      }
    }
  }
}
</script>

<style lang="scss" src="./Library.scss"></style>
