<template>
  <div class="wrap-list">
    <v-divider />
    <SearchDocumentGo :formdata="formdata" :search-document="searchDocument" />

    <v-layout wrap>
      <div class="col-sm-12 px-0 pt-0">
        <div
          v-if="listDocument.length == 0 || loading"
          class="col-md-5 col-12 mx-auto wrap-empty-list"
        >
          <empty-box-edocument :loading="loading" />
        </div>
        <div v-else class="text-center my-2 content-book-document">
          <v-scroll-y-transition>
            <v-simple-table v-show="showTable" dense fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center" style="width: 4%">STT</th>
                    <th class="text-center" style="width: 4%">ID</th>
                    <th class="text-left" style="width: 10%">
                      {{ $t("numSymbol") }}
                    </th>
                    <th class="text-left" style="width: 20%">
                      {{ $t("docName") }}
                    </th>
                    <th class="text-left" style="width: 10%">
                      {{ $t("urgency") }}
                    </th>
                    <th class="text-left" style="width: 10%">
                      {{ $t("security") }}
                    </th>
                    <th class="text-left" style="width: 12%">
                      {{ $t("signer") }}
                    </th>
                    <th class="text-left" style="width: 10%">
                      {{ $t("proclaimGroup") }}
                    </th>
                    <th class="text-left" style="width: 8%">
                      {{ $t("dateProclaim") }}
                    </th>
                    <th class="text-center" style="width: 11%">
                      <span class="pl-6">{{ $t("action") }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody :class="{ 'disable-hover': activeIndex != null }">
                  <tr v-for="(item, index) in listDocument" :key="index">
                    <!-- STT -->
                    <td class="text-center">
                      <div class="my-2">{{ index + fromRecord }}</div>
                    </td>

                    <!-- ID -->
                    <td class="text-center">
                      <div class="my-2">{{ item.documentId }}</div>
                    </td>

                    <!-- So ky hieu -->
                    <td class="text-left">
                      <div class="d-flex">
                        <v-tooltip
                          top
                          content-class="tooltip-top"
                          max-width="30%"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" class="maxline2" v-on="on">
                              {{ item.code }}
                            </div>
                          </template>
                          <span> {{ item.code }}</span>
                        </v-tooltip>
                      </div>
                    </td>

                    <!-- Ten van ban -->
                    <td class="text-left link-hover" @click="onDetailDoc(item)">
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
                      <div class="text--caption black-1">
                        {{ item.formulaName }}
                      </div>
                    </td>

                    <!-- Do khan -->
                    <td class="text-left">{{ item.priorityName }}</td>

                    <!-- Do mat -->
                    <td class="text-left">{{ item.securityName }}</td>

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
                      <div class="d-flex">
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
                          <span> {{ item.promulgateGroupName }}</span>
                        </v-tooltip>
                      </div>
                    </td>

                    <!-- Ngay ban hanh -->
                    <td class="text-left">
                      {{ createdDate(item.promulgateDate) }}
                    </td>

                    <!-- Thao tac -->
                    <td class="text-left d-flex align-center">
                      <v-container :class="item.revokeDocument ? 'd-none' : ''">
                        <v-row class="d-flex justify-end">
                          <!-- File trinh ky -->
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
                                  @click="gotoSign(item)"
                                >
                                  <img
                                    v-if="!checkIcon(item)"
                                    src="@/assets/icons/pdf.svg"
                                    alt=""
                                    srcset=""
                                  />
                                  <img
                                    v-else
                                    src="@/assets/icons/iconSign.svg"
                                    alt=""
                                    srcset=""
                                  />
                                </v-btn>
                              </template>
                              <span>{{
                                item.mainSigningFiles[0].fileName
                              }}</span>
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
                                      {{ $t("listSignDocFile") }}
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
                                      @click="clickFileDoc(i, item)"
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

                          <div>
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
                                    @click="
                                      showIconHandleDoc(`${action}`, item)
                                    "
                                    v-html="
                                      renderAction(
                                        `${action}`,
                                        item.signUserType
                                      )
                                    "
                                  />
                                </div>
                              </v-list>
                            </v-menu>
                          </div>
                        </v-row>
                      </v-container>
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
    <div class="ma-0 mx-2 px-8 pb-5">
      <base-paging
        :page="page"
        :total-pages="totalPages"
        :from-record="fromRecord"
        :to-record="toRecord"
        :total-records="totalRecords"
        @on-change-page="onChangePage"
      />
    </div>
    <!-- Dialog confirm van ban trinh ky-->
    <DialogConfirmDelete
      :title-confirm="titleConfirmDialog"
      :show-dialog="showConfirmDialog"
      @close-dialog="showConfirmDialog = false"
      @accept-action="acceptConfirmDoc"
    />
    <DialogTransfer
      :show-dialog="showConfirmDialogTransfer"
      :doc-item="docItem"
      @close-dialog="showConfirmDialogTransfer = false"
      @accept-action="acceptConfirmTransfer"
    />

    <!-- Dialog confirm delete library -->
    <dialog-confirm-save
      title-confirm="messDeleteLib"
      :show-dialog="showConfirmDeleteLib"
      :show-warning="showWarningDeleteLib"
      @close-dialog="showConfirmDeleteLib = false"
      @accept-action="deleteLibrary()"
    />

    <DialogSaveLibrary
      :show-dialog="showDialogSaveLibrary"
      :document-id="documentId"
      :document-current="documentCurrent"
      :update-library="updateLibrary"
      @close-dialog="closeDialogSaveLib"
    />

    <base-preload :dialog="loadingDialog" />
  </div>
</template>

<script>
import SearchDocumentGo from "./SearchDocumentGo.vue";
import { DocumentService } from "@/modules/edocument/services/documentService";
import customsFile from "@/modules/edocument/mixins/customsFile";
import popupAvatar from "@/mixins/popupAvatar";
import config from "@/config";
import moment from "moment";
import pagingData from "@/mixins/paging";
import PopupSigner from "@/modules/edocument/views/components/PopupSigner";
import ListAvatarSigner from "@/modules/edocument/views/components/ListAvatarSigner";
import statusDocument from "@/modules/edocument/mixins/statusDocument";
import customAvatar from "@/modules/edocument/mixins/customAvatar";
import AvatarSigner from "@/modules/edocument/views/components/AvatarSigner";
import edocumentRoute from "@/modules/edocument/router/routePaths";
import DialogConfirmDelete from "@/modules/edocument/views/document/management/components/DialogConfirmDelete";
import constants from "@/constants";
import { mapActions } from "vuex";
import EmptyBoxEdocument from "@/views/components/EmptyBoxEdocument.vue";
import DialogTransfer from "@/modules/edocument/views/document/management/components/DialogTransfer";
import DialogConfirmSave from "@/modules/edocument/views/components/DialogConfirmSave";
import DialogSaveLibrary from "@/modules/edocument/views/document/library/components/DialogSaveLibrary";

export default {
  name: "ListDocumentGo",
  components: {
    SearchDocumentGo,
    PopupSigner,
    ListAvatarSigner,
    AvatarSigner,
    DialogConfirmDelete,
    EmptyBoxEdocument,
    DialogTransfer,
    DialogConfirmSave,
    DialogSaveLibrary,
  },
  mixins: [pagingData, customsFile, popupAvatar, statusDocument, customAvatar],

  data() {
    return {
      showConfirmDialogTransfer: false,
      formdata: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keyword: "",
        formulaTypeId: null,
        fromDate: null,
        toDate: null,
        searchCriteria: null, // bo loc.
        promulgateGroupId: null,
        promulgateGroupName: null,
        signerId: null,
        signerInfo: null,
        docType: "EDOCUMENT_OUTGOING",
      },
      listDocument: [],
      docItem: null,
      docAction: null,
      titleConfirmDialog: null,
      showConfirmDialog: false,
      loading: false,
      showTable: true,
      documentId: null,

      showDialogSaveLibrary: false,
      showConfirmDeleteLib: false,
      showWarningDeleteLib: false,
      loadingDialog: false,
      documentCurrent: null,
      updateLibrary: false,
    };
  },

  methods: {
    ...mapActions("layout", ["setNotify"]),

    searchDocument() {
      this.formdata.page = "";
      this.search();
    },

    closeDialogSaveLib(value) {
      this.showDialogSaveLibrary = false;
      if (value) this.search();
    },

    async search() {
      try {
        const validFromDate = this.isValidDate(this.formdata.fromDate);
        const validToDate = this.isValidDate(this.formdata.toDate);
        if (!validFromDate || !validToDate) return;
        this.loading = true;
        const response = await DocumentService.getListBook(this.formdata);
        const dataResponse = response.data;
        this.listDocument = dataResponse.data;
        var listDocTemp = [];
        this.listDocument.map((item) => {
          listDocTemp.push({
            ...item,
            showMenu: false,
          });
        });
        this.listDocument = listDocTemp;
        this.renderPaging(dataResponse);
        setTimeout(() => {
          this.showTable = true;
        }, 10);
      } catch (error) {
        this.isShowAlert = true;
        this.messages = error;
      } finally {
        this.loading = false;
      }
    },

    isValidDate(strDate) {
      return moment(strDate, "DDMMYYYY", true).isValid();
    },

    onChangePage(page) {
      this.closePopupSigner();
      this.formdata.page = page;
      this.page = page;
      this.search();
    },

    onDetailDoc(item) {
      localStorage.setItem(
        constants.SEARCH_TYPE_DOCUMENT.SEARCH_TYPE_DOC,
        constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_BOOK_GO
      );
      this.$router.push(
        `${edocumentRoute.MANAGEMENT_DOC_DETAIL_PATH.replaceAll(
          ":documentId",
          item.documentId
        )}`
      );
    },

    // Dialog show confirm remove van ban trinh ky
    dialogConfirm() {
      this.showConfirmDialog = true;
    },

    // accept remove van ban trinh ky
    acceptConfirmDoc() {
      this.clickAction(this.docAction, this.docItem);
    },

    // show icon thao tac cua van ban
    showIconHandleDoc(action, item) {
      this.docItem = item;
      this.docAction = action;
      this.documentId = item.documentId;
      if (action === constants.LIST_ACTIONS_DETAIL.DELETE) {
        this.titleConfirmDialog =
          "managementDoc.titleConfirmSave.deleteDocument";
        this.dialogConfirm();
        return;
      }
      if (action === constants.LIST_ACTIONS_DETAIL.TRANSFER) {
        this.showConfirmDialogTransfer = true;
        return;
      }
      if (action === constants.LIST_ACTIONS_DETAIL.DELETE_LIBRARY) {
        this.showConfirmDeleteLib = true;
        return;
      }
      if (action === constants.LIST_ACTIONS_DETAIL.SAVE_LIBRARY) {
        this.documentCurrent = item
        this.showDialogSaveLibrary = true;
        this.updateLibrary = false
        return;
      }

      if (action === constants.LIST_ACTIONS_DETAIL.EDIT_LIBRARY) {
        this.documentId = item.documentId;
        this.documentCurrent = item
        this.showDialogSaveLibrary = true;
        this.updateLibrary = true;
        return;
      }

      this.clickAction(
        action,
        item,
        constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_BOOK_GO
      );
    },
    acceptConfirmTransfer() {},

    // View file ky (click icon pdf and icon sign)
    gotoSign(docId) {
      this.$emit("changedDocId", docId);
      this.$emit("changedIndexOpenFileDoc", 0);
      this.$emit("changedShowDialogSign");
    },

    // Click item file sign.
    clickFileDoc(index, docId) {
      this.$emit("changedDocId", docId);
      this.$emit("changedIndexOpenFileDoc", index);
      this.$emit("changedShowDialogSign");
    },

    onCloseMenu(item) {
      return !item.showMenu;
    },

    async deleteLibrary() {
      try {
        this.loadingDialog = true;

        await DocumentService.deleteLibrary(this.docItem.documentId);
        this.search();

        this.setNotify({
          show: true,
          type: "success",
          content: this.$t("messDeleteLibSuccess"),
        });
      } catch (error) {
        this.loadingDialog = false;
        this.setNotify({
          show: true,
          type: "error",
          content: this.$t(error.message),
        });
      } finally {
        this.loadingDialog = false;
      }
    },
  },
};
</script>

<style></style>
