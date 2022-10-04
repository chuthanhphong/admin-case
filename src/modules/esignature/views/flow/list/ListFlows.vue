<template>
  <div class="esignature-wrap--list-common esignature-font wrap--list-flows">
    <h3 class="white--text ml-10 text-capitalize">{{ $t("flowTitle") }}</h3>

    <div class="wrap--content">
      <SearchFlow
        :claszz="showDialogSign"
        :formdata="formdata"
        :search-document="searchDocument"
        :change-show-advance="changeShowAdvance"
      />

      <v-layout wrap>
        <div class="col-sm-12 px-0 pt-2">
          <div class="text-center my-2 esignature-content-list-flow">
            <v-scroll-y-transition>
              <v-simple-table dense fixed-header>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 4%">STT</th>
                      <th class="text-left" style="width: 18%">
                        {{ $t("electronicSign.labelSearch") }}
                      </th>
                      <th class="text-left" style="width: 12%">
                        {{ $t("electronicSign.textForm") }}
                      </th>
                      <th class="text-left indexTable" style="width: 15%">
                        {{ $t("electronicSign.signer") }}
                      </th>
                      <th class="text-left" style="width: 18%">
                        {{ $t("document.label.scopeUse") }}
                      </th>
                      <th class="text-left" style="width: 10%">
                        {{ $t("electronicSign.dateCreated") }}
                      </th>
                      <th class="text-left" style="width: 12%">
                        {{ $t("signUserType") }}
                      </th>
                      <th class="text-center" style="width: 11%">
                        {{ $t("electronicSign.actions") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody :class="{ 'disable-hover': activeIndex != null }">
                    <div v-if="listDocument.length == 0">
                      <div class="no-data-table text-center">
                        {{ $t("noData") }}
                      </div>
                    </div>

                    <tr
                      v-for="(item, index) in listDocument"
                      v-else
                      :key="index"
                    >
                      <!-- STT -->
                      <td class="text-center">
                        <div class="my-2">{{ index + fromRecord }}</div>
                      </td>

                      <!-- Ten van ban trinh ky -->
                      <td
                        class="text-left link-hover"
                        @click="showDetail(item.id)"
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
                              </div> </template><span>{{ item.documentTitle }}</span>
                          </v-tooltip>
                        </div>
                      </td>

                      <!-- Hinh thuc van ban -->
                      <td class="text-left">{{ item.formulaName }}</td>

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
                              <span
                                class="text-uppercase white--text"
                              >{{ item.signers.length - 4 }}+</span>
                            </v-avatar>
                          </div>
                        </div>
                      </td>
                      <!-- Do khan -->
                      <td class="text-left">
                        <div v-html="renderScopes(item.groupDocumentScopes)" />
                      </td>

                      <!-- Trang thai van ban -->
                      <td class="text-left">
                        {{ createdDate(item.createdDate) }}
                      </td>

                      <!-- Tien do xu ly -->
                      <td class="text-left">
                        {{ item.creatorFullName }}
                      </td>

                      <!-- Thao tac -->
                      <td class="text-left">
                        <v-container>
                          <v-row class="d-flex justify-end">
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
                                      v-if="!checkIcon(item)"
                                      src="@/assets/icons/pdf.svg"
                                      alt=""
                                      srcset=""
                                    />
                                    <img
                                      v-else
                                      src="@/assets/icons/sign/iconSign.svg"
                                      alt=""
                                      srcset=""
                                    />
                                  </v-btn>
                                </template>
                                <span>{{
                                  item.mainFiles[0].fileName
                                }}</span>
                              </v-tooltip>
                            </div>
                            <div class="lg-4" style="width: 20%">
                              <!-- show list khi co nhieu file trinh ky -->
                              <span class="file-signer-show">
                                <v-menu
                                  v-if="
                                    item.mainFiles &&
                                      item.mainFiles.length > 1
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
                                        {{ $t("document.listSignDocFile") }}
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
                                        v-for="(
                                          file, i
                                        ) in item.mainFiles"
                                        :key="`${i}-${file.id}`"
                                        class="py-0"
                                        @click="
                                          clickFileDoc(i, item.id)
                                        "
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
                            <div class="lg-4">
                              <v-menu
                                v-if="item.showIcons || item.mainFiles"
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
                                    @click="showDetail(item.id)"
                                    v-html="
                                      viewDetail(`${action}`, item.signUserType)
                                    "
                                  />
                                  <div
                                    v-if="
                                      item.showIcons &&
                                        item.showIcons.length > 0
                                    "
                                  >
                                    <div
                                      v-for="(action, id) in item.showIcons"
                                      :key="id"
                                    >
                                      <div
                                        @click="
                                          showConfirmRemove(`${action}`, item.id)
                                        "
                                        v-html="
                                          renderAction(
                                            `${action}`,
                                            item.signUserType
                                          )
                                        "
                                      />
                                    </div>
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
    </div>
    <!-- Dialog confirm van ban trinh ky-->
    <DialogConfirm
      :title-confirm="titleConfirmDialog"
      :show-dialog="showDialogRemoveContract"
      @close-dialog="showDialogRemoveContract = false"
      @accept-action="acceptRemoveContract"
    />
    <!-- Dialog ky van ban-->
    <DialogSign
      :show-dialog="showDialogSign"
      :document-id="documentIdSign"
      :index-open-file-doc="indexOpenFileDoc"
      @close-dialog="closeDialogSign"
    />
  </div>
</template>

<script>
import SearchFlow from "./components/SearchFlow.vue";
import config from "@/config";
import pagingData from "@/mixins/paging";
import moment from "moment";
import { mapActions } from "vuex";
import { DocumentService } from "@/modules/esignature/services/documentService";
import constants from "@/constants";
import statusDocument from "@/modules/esignature/mixins/statusDocument";
import customsFile from "@/modules/esignature/mixins/customsFile";
import PopupSigner from "@/modules/esignature/views/list/components/PopupSigner.vue";
import ListAvatarSigner from "@/modules/esignature/views/list/components/ListAvatarSigner.vue";
import popupAvatar from "@/mixins/popupAvatar";
import renderUtils from "@/mixins/renderUtils";
import DialogSign from "@/modules/esignature/views/sign/SignDocument.vue";
import DialogConfirm from "@/modules/esignature/views/create/components/DialogConfirmSave.vue";
import customAvatar from "@/mixins/customAvatar";
import routeEsignature from "@/modules/esignature/router/routePaths";
import AvatarSigner from "@/modules/esignature/views/list/components/AvatarSigner.vue";

export default {
  name: "ListFlows",
  components: {
    SearchFlow,
    PopupSigner,
    ListAvatarSigner,
    DialogSign,
    DialogConfirm,
    AvatarSigner,
  },

  mixins: [
    pagingData,
    customsFile,
    popupAvatar,
    statusDocument,
    renderUtils,
    customAvatar,
  ],

  data() {
    return {
      showAdvance: false,
      formdata: {
        page: 1,
        fromDate: null,
        toDate: null,
        pageSize: config.app.paging.pageSize,
        keyword: "",
        documentScopeIds: null,
        formulaTypeId: "", // Hinh thuc van ban.
        docScopeType: "",
      },
      listDocument: [],
      listSigner: [],
      dialogSigner: false,
      docName: "",
      showConfirmDialog: false,
      titleConfirmDialog: "",
      docItem: undefined,
      docAction: undefined,
      showDialogSign: false,
      documentIdSign: null,
      indexOpenFileDoc: 0,
      showDialogProclaim: false,
      itemProclaim: null,
      actionDocument: null,
      showDialogRemoveContract: false,
      listActionShowComfirm: [constants.LIST_ACTIONS_DETAIL.DELETE],
    };
  },

  methods: {
    ...mapActions("layout", ["setNotify"]),
    showConfirmRemove(action, documentId) {
      if (this.listActionShowComfirm.includes(action)) {
        this.titleConfirmDialog =
          "document.titleComfirmRemove.comfirmRemoveContract";
        this.showDialogRemoveContract = true;
        this.actionDocument = action;
        this.documentIdSign = documentId;
      } else {
        this.clickActionFlow(action, documentId);
      }
    },
    acceptRemoveContract() {
      this.clickActionFlow(this.actionDocument, this.documentIdSign);
    },
    async clickActionFlow(action, id) {
      // Sua luong mau
      if (action === constants.LIST_ACTIONS_DETAIL.EDIT) {
        return this.$router.push(
          routeEsignature.UPDATE_FLOW_PATH.replaceAll(":documentId", id)
        )
      }

      // Xoa luong mau
      if (action === constants.LIST_ACTIONS_DETAIL.DELETE) {
        try {
          await DocumentService.removeTemplateFlow(id);
          this.showNotify("success", this.$t("removeFLowSuccess"));
          // Goi lai danh sach
          this.searchDocument();
        } catch (error) {
          this.showNotify("error", error.message);
        }
      }
    },

    changeShowAdvance(value) {
      this.showAdvance = value;
    },

    searchDocument() {
      this.formdata.page = "";
      this.search();
    },

    isValidDate(strDate) {
      return moment(strDate, "DDMMYYYY", true).isValid();
    },

    onCloseMenu(item) {
      return !item.showMenu;
    },

    async search() {
      try {
        if (!this.showAdvance) {
          this.formdata.formulaTypeId = "";
          this.formdata.docScopeType = constants.ALL;
        }
        const validFromDate = this.isValidDate(this.formdata.fromDate);
        const validToDate = this.isValidDate(this.formdata.toDate);
        if (!validFromDate || !validToDate) return;

        const response = await DocumentService.getListTemplate(this.formdata);
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
      } catch (error) {
        this.isShowAlert = true;
        this.messages = error;
      } finally {
        this.loading = false;
      }
    },

    onShowDialogProclaim(documentIdSign) {
      this.documentIdSign = documentIdSign;
      this.showDialogProclaim = true;
    },

    onChangePage(page) {
      this.closePopupSigner();
      this.formdata.page = page;
      this.page = page;
      this.search();
    },

    showDetail(docId) {
      localStorage.setItem(
        constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN,
        constants.SEARCH_TYPE_DOC.TEMPLATE
      );
      this.$router.push(
        routeEsignature.DOCUMENT_DETAIL_PATH.replaceAll(":documentId", docId)
      );
    },

    // Dialog show confirm remove van ban trinh ky
    dialogConfirm() {
      this.showConfirmDialog = true;
    },

    // show icon thao tac cua van ban
    showIconHandleDoc(action, item) {
      this.itemProclaim = item;
      this.documentIdSign = item.id;
      if (action === constants.LIST_ACTIONS_DETAIL.PROMULGATE) {
        this.showDialogProclaim = true;
        return;
      }

      if (action === constants.LIST_ACTIONS_DETAIL.PROMULGATE_CANCEL) {
        this.showConfirmDialogCancelPromulgate = true;
        return;
      }

      if (action === constants.LIST_ACTIONS_DETAIL.TRANSFER) {
        return;
      }
    },

    acceptConfirmDoc() {},

    // get List avatar signer.
    getListAvatarSigner(item) {
      if (item.signers.length > 5) {
        var listAvatar = item.signers.slice(0, 4);
        var avatarFive = `${item.signers.length - 4}+`;
        var itemFive = { fullName: avatarFive };
        listAvatar.push(itemFive);
        return listAvatar;
      }
      return item.signers;
    },

    // View file ky (click icon pdf and icon sign)
    gotoSign(docId) {
      this.indexOpenFileDoc = 0;
      this.documentIdSign = docId;
      this.showDialogSign = true;
    },

    // Click item file sign.
    clickFileDoc(index, docId) {
      this.indexOpenFileDoc = index;
      this.documentIdSign = docId;
      this.showDialogSign = true;
    },

    // Dong dialog ky van ban
    closeDialogSign(isSignDoc) {
      this.showDialogSign = false;
      if (isSignDoc) this.searchDocument();
    },
  },
};
</script>

<style lang="scss" src="./ListFlows.scss"></style>
