<template>
  <v-sheet id="scrolling-techniques-3" class="overflow-y-auto edocument-height-detail">
    <ListReceive />
    <div class="wrap-tab-transfer">
      <p class="mt-6 title-tab-transfer">
        {{ $t("listMoved") }}
        <v-btn v-if="showTransferTree" class="btn-tree-transfer" @click="onShowTransfer()">
          <span
            class="subTitle-tab-transfer hover--pointer"
            @click="onShowTransfer()"
          >({{ $t("rotationTree") }})</span>
        </v-btn>
      </p>
      <v-layout class="text-center my-2 content-transfer-document" wrap>
        <div v-if="lstTransfer.length > 0" class="col-sm-12 px-0 pt-0">
          <v-scroll-y-transition>
            <v-data-table
              id="mytable"
              v-model="selected"
              :show-select="checkshowCheckBoxAll"
              :headers="headers"
              :items="lstTransfer"
              checkbox-color="primary"
              :no-data-text="$t('noData')"
              item-key="stt"
              hide-default-footer
              class="elevation-2"
            >
              <template
                v-slot:[`item.data-table-select`]="{ item, isSelected, select }"
              >
                <v-btn v-if="item.documentActionStatus && item.parentId" icon>
                  <v-simple-checkbox
                    class="mr-2"
                    :value="isSelected"
                    :ripple="false"
                    color="primary"
                    @input="select($event)"
                  />
                </v-btn>
              </template>
              <template v-slot:[`item.sendDate`]="{ item }">
                <td class="text-left" :class="isUserIsRevoked(item)">
                  {{ item.sendDate }}
                </td>
              </template>
              <template v-slot:[`item.fullName`]="{ item }">
                <td class="text-left">
                  <div class="btn d-flex">
                    <v-tooltip top content-class="tooltip-top" max-width="30%">
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          v-bind="attrs"
                          class="maxline2"
                          :class="isUserIsRevoked(item)"
                          v-on="on"
                        >
                          {{ item.fullName }}
                        </div>
                      </template>
                      <span>{{ item.fullName }}</span>
                    </v-tooltip>
                  </div>
                  <div
                    class="edoc-text--caption black-1"
                    :class="isUserIsRevoked(item)"
                  >
                    {{ item.userName }}
                  </div>
                </td>
              </template>
              <template v-slot:[`item.actionLevelType`]="{ item }">
                <td class="text-left" :class="isUserIsRevoked(item)">
                  {{ $t(genLevelType(item.actionLevelType)) }}
                </td>
              </template>
              <template v-slot:[`item.note`]="{ item }">
                <td class="text-left">
                  <div class="btn d-flex">
                    <v-tooltip top content-class="tooltip-top" max-width="30%">
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          v-bind="attrs"
                          class="maxline2"
                          :class="isUserIsRevoked(item)"
                          v-on="on"
                        >
                          {{ item.note }}
                        </div>
                      </template>
                      <span>{{ item.note }}</span>
                    </v-tooltip>
                  </div>
                </td>
              </template>
              <template v-slot:[`item.filesAttachment`]="{ item }">
                <td
                  class="text-left"
                >
                  <v-row
                    v-if="item.filesAttachment.length > 0 && item.documentActionStatus"
                    class="d-flex justify-center"
                  >
                    <!-- File trinh ky -->
                    <!-- Icon file pdf -->
                    <div class="lg-4">
                      <v-tooltip
                        v-if="item.filesAttachment"
                        left
                        content-class="tooltip-left"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="
                              downloadFileAttach(item.filesAttachment[0], item)
                            "
                          >
                            <img
                              :src="
                                getIconFile(
                                  `${item.filesAttachment[0].fileName}`
                                )
                              "
                            />
                          </v-btn>
                        </template>
                        <span>{{ item.filesAttachment[0].fileName }}</span>
                      </v-tooltip>
                    </div>
                    <!-- show list khi co nhieu file trinh ky -->
                    <div class="lg-4" style="width: 20%">
                      <span class="file-signer-show">
                        <v-menu
                          v-if="
                            item.filesAttachment &&
                              item.filesAttachment.length > 1
                          "
                          v-model="item.showMenu"
                          :close-on-content-click="true"
                          offset-x
                          left
                          top
                          rounded="lg"
                          :nudge-width="300"
                        >
                          <template v-slot:activator="{ on: menu, attrs }">
                            <v-btn v-bind="attrs" icon v-on="menu">
                              <v-icon> mdi-menu-down </v-icon>
                            </v-btn>
                          </template>

                          <v-card max-width="500px">
                            <v-card-title
                              class="d-flex justify-space-between px-3 py-1"
                            >
                              <h6 class="black--text pt-0">
                                {{ $t("managementDoc.detail.listFileAttach") }}
                                ({{ item.filesAttachment.length }})
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
                                v-for="(file, i) in item.filesAttachment"
                                :key="`${i}-${file.id}`"
                                class="py-0"
                                @click="downloadFileAttach(file, item)"
                              >
                                <v-tooltip
                                  top
                                  content-class="tooltip-top"
                                  max-width="30%"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
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
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <td
                  class="text-center"
                >
                  <v-btn v-if="item.documentActionStatus && item.parentId" icon @click="showDialogRevokeDocument(item)">
                    <img
                      class="btn"
                      src="@/assets/icons/revoke.png"
                      alt="eviction"
                    />
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-scroll-y-transition>
        </div>
      </v-layout>
      <dialog-view-pdf
        :src-file-pdf="srcFilePdf"
        :show-dialog="showDialogViewPdf"
        @close-dialog="showDialogViewPdf = false"
      />

      <dialog-revoke
        :title-confirm="titleComfirmRevoke"
        :show-dialog="showDialogRevoke"
        :selected="lengthDocument"
        @close-dialog="showDialogRevoke = false"
        @accept-action="acceptConfirmRevoke"
      />

      <div v-if="lstTransfer.length > 0" class="mt-5 mx-2 px-8 pb-5">
        <base-paging
          :page="page"
          :total-pages="totalPages"
          :from-record="fromRecord"
          :to-record="toRecord"
          :total-records="totalRecords"
          @on-change-page="onChangePage"
        />
      </div>
      <base-preload :dialog="loadingViewFile" />
    </div>
  </v-sheet>
</template>

<script>
import { DocumentService } from "@/modules/edocument/services/documentService";
import pagingData from "@/mixins/paging";
import customsFile from "@/modules/edocument/mixins/customsFile";
import config from "@/config";
import constants from "@/constants";
import DialogViewPdf from "@/views/components/DialogViewPdf.vue";
import DialogRevoke from "@/modules/edocument/views/document/management/components/DialogRevoke.vue";
import ListReceive from "@/modules/edocument/views/document/management/detail/components/ListReceive.vue";
import { FileService } from "@/modules/edocument/services/fileService";
import { mapActions } from "vuex";

export default {
  name: "TabTransfer",

  components: {
    DialogViewPdf,
    DialogRevoke,
    ListReceive,
  },
  mixins: [pagingData, customsFile],

  data() {
    return {
      lengthDocument: null,
      showTransferTree: false,
      formdata: {
        page: 1,
        pageSize: config.app.paging.pageSize,
      },
      loadingViewFile: false,
      documentId: null,
      listTranferReceive: [],
      selected: [],
      typeRevoke: 1,
      headers: [
        {
          text: "Stt",
          align: "center",
          sortable: false,
          value: "stt",
          width: "5%",
          class: "text--label-3",
        },
        {
          text: this.$t("dateTransfer"),
          value: "sendDate",
          sortable: false,
          align: "left",
          width: "14%",
          class: "text--label-3",
        },
        {
          text: this.$t("receiver"),
          value: "fullName",
          sortable: false,
          align: "left",
          width: "15%",
          class: "text--label-3",
        },
        {
          text: this.$t("transferFormat"),
          value: "actionLevelType",
          sortable: false,
          align: "left",
          width: "10%",
          class: "text--label-3",
        },
        {
          text: this.$t("ideaTransfer"),
          value: "note",
          sortable: false,
          align: "left",
          width: "35%",
          class: "text--label-3",
        },
        {
          text: this.$t("contract.attachmentsFile"),
          value: "filesAttachment",
          sortable: false,
          align: "center",
          width: "10%",
          class: "text--label-3",
        },
        {
          text: this.$t("eviction"),
          sortable: false,
          value: "action",
          align: "center",
          width: "10%",
        },
      ],
      lstTransfer: [],
      lstSelected: [], // List checkBox selected.
      titleComfirmRevoke: "revoledDocument",
      showDialogRevoke: false,
      documentActionId: null,
      listRole: [
        constants.USER_ROLE.LD,
        constants.USER_ROLE.VT,
        constants.USER_ROLE.GD,
      ],
    };
  },
  computed: {
    checkshowCheckBoxAll() {
      let check = false
      const item = this.lstTransfer.find(item => {
        return item.documentActionStatus && item.parentId
      })
      if (item) {
        check = true
      }
      return check
    }
  },
  watch: {
    selected() {
      this.$emit("selected-item", this.selected);
    },
  },
  created() {
    this.search();
    this.showTransferTreeFunc();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),

    selectSelected(value) {
      console.log('value', value);
      return !value;
    },

    showTransferTreeFunc() {
      this.showTransferTree = false;
      const userInfo = JSON.parse(localStorage.getItem(constants.USER_INFO));
      if (userInfo && userInfo.roles.length >= 1) {
        userInfo.roles.forEach((role) => {
          if (this.listRole.includes(role)) {
            this.showTransferTree = true;
            return;
          }
        });
      }
    },
    async viewFilePdf(file) {
      if (!file.url) {
        const urlFile = await FileService.download({
          fileName: file.fileName,
          storage: file.storage,
          filePath: file.filePath,
        });
        this.srcFilePdf = urlFile;
      } else {
        this.srcFilePdf = file.url;
      }
      this.showDialogViewPdf = true;
    },
    // Tai file dinh kem
    async downloadFileAttach(file, item) {
      if (item.showMenu) {
        item.showMenu = false;
      }
      this.loadingViewFile = true;
      try {
        if (file.fileName.includes(".pdf")) {
          await this.viewFilePdf(file);
        } else {
          await FileService.downloadFile({
            fileName: file.fileName,
            storage: file.storage,
            filePath: file.filePath,
          });
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: error.message,
        });
      } finally {
        this.loadingViewFile = false;
      }
    },
    genLevelType(levelType) {
      let text = "managementDoc.transfer.user";
      if (levelType === constants.EDOCUMENT.GROUP_TREE) {
        text = "managementDoc.transfer.group";
      }
      return text;
    },
    onCloseMenu(item) {
      return !item.showMenu;
    },
    // Thu hoi
    showDialogRevokeDocument(item) {
      this.lengthDocument = null
      this.documentActionId = item.documentActionId;
      this.titleComfirmRevoke =
        "managementDoc.titleConfirmSave.revokedDocument";
      this.showDialogRevoke = true;
      this.typeRevoke = 1;
    },
    // Nguoi dung bi thu hoi van ban
    isUserIsRevoked(item) {
      if (item.documentActionStatus === 0) {
        return "revoked-user";
      }
    },

    showDialogRevokeByCheckBox() {
      var lengthDocumentSelect = []
      this.selected.filter((item) => {
        if (item.documentActionId && item.documentActionStatus === 1 && item.parentId) {
          lengthDocumentSelect.push(item)
        }
      });
      this.lengthDocument = lengthDocumentSelect.length
      this.typeRevoke = 2;
      this.titleComfirmRevoke =
        "managementDoc.titleConfirmSave.revokedDocument";
      this.showDialogRevoke = true;
    },

    async acceptConfirmRevoke(comment) {
      const formData = {};
      formData.documentActionIds = [];
      if (this.typeRevoke === 1) {
        formData.documentActionIds.push(this.documentActionId);
      }

      if (this.typeRevoke === 2) {
        this.selected.map((item) => {
          if (item.documentActionId && item.documentActionStatus === 1 && item.parentId) {
            formData.documentActionIds.push(item.documentActionId);
          }
        });
        this.selected = [];
      }

      formData.comment = comment;
      formData.documentId = this.documentId
      try {
        await DocumentService.revokeDocument(formData);
        var message = "managementDoc.messageSuccess.revokedDocument";
        const typeAlert = "success";
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message),
        });
        this.formdata.page = 1;
        this.search();
      } catch (e) {
        const typeAlert = "error";
        const message = e.message;
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message),
        });
      }
    },

    onChangePage(page) {
      this.formdata.page = page;
      this.page = page;
      this.search();
    },

    async search() {
      try {
        this.documentId = parseInt(this.$route.params.documentId);
        this.formdata.documentId = this.documentId;
        const response = await DocumentService.getListTransferUser(
          this.formdata
        );
        this.lstTransfer = response.data.data;
        this.renderPaging(response.data);
        const startIndex = this.fromRecord;
        this.lstTransfer.map((item, index) => {
          item.stt = startIndex + index;
          item.action = false;
        });
      } catch (error) {
        console.log(error);
      }
    },

    onShowTransfer() {
      this.$emit("onShowTransferTree");
    },
  },
};
</script>

<style></style>
