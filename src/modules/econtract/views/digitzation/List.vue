<template>
  <div class="wrap-home ml-2 mt-2 contracts-page">
    <v-container fluid class="py-5 pt-2 rounded-xl bg-primary pb-5">
      <h4 class="white--text ml-2">{{ $t("contract-manager.name") }}</h4>
      <v-card
        color="white"
        class="rounded-xl ma-2 mt-2 text-wrap"
        :class="showContractDetail ? 'd-none' : ''"
      >
        <search-contract
          :formdata="formdata"
          :search-contract="searchContract"
          :change-show-advance="changeShowAdvance"
          @show-dialog-upload="showDialogUpload = true"
        />
        <v-layout wrap>
          <div class="col-12 px-0">
            <div
              v-if="listContract.length == 0 || loading"
              class="col-md-5 col-12 mx-auto wrap-empty-list"
            >
              <empty-box :loading="loading" />
            </div>
            <div v-else class="content-list-contract text-center my-2">
              <v-scroll-y-transition>
                <v-simple-table v-show="showTable" dense fixed-header>
                  <template v-slot:default>
                    <thead class="text--body-5">
                      <tr>
                        <th class="text-center stt">Stt</th>
                        <th class="text-center stt">ID</th>
                        <th class="text-left contract-no">
                          {{ $t("contract-manager.labels.contractNo") }}
                        </th>
                        <th class="text-left contract-name">
                          {{ $t("contract.label.contractName") }}
                        </th>
                        <th class="text-left customer">
                          {{ $t("contract.label.customer") }}
                        </th>
                        <th class="text-left time">
                          {{ $t("contract.label.timeExpired") }}
                        </th>
                        <th class="text-left time">
                          {{ $t("contract.label.dateFrom") }}
                        </th>
                        <th class="text-center action">
                          {{ $t("contract.label.fileSign") }}
                        </th>
                        <th class="text-center action">
                          {{ $t("contract.label.actions") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody :class="{ 'disable-hover': activeIndex != null }">
                      <tr v-for="(item, index) in listContract" :key="index">
                        <td class="text-center">
                          <div class="my-2 text--body-5">
                            {{ index + fromRecord }}
                          </div>
                        </td>
                        <td class="text-center">
                          <div class="my-2 text--body-5">
                            {{ item.documentId }}
                          </div>
                        </td>
                        <td class="text-left">
                          <div class="wrap-tooltip d-inline-block">
                            <v-tooltip top content-class="tooltip-top">
                              <template v-slot:activator="{ on }">
                                <div
                                  class="maxline2 my-2 text--body-5"
                                  v-on="on"
                                >
                                  {{ item.documentCode }}
                                </div>
                              </template>
                              <div>
                                {{ item.documentCode }}
                              </div>
                            </v-tooltip>
                          </div>
                        </td>
                        <td class="text-left link-hover">
                          <div class="wrap-tooltip">
                            <div
                              class="btn"
                              @click="showDetail(item.documentId)"
                            >
                              <v-tooltip top content-class="tooltip-top">
                                <template v-slot:activator="{ on }">
                                  <span
                                    :style="
                                      checkExpiredDate(item.expiredDate)
                                        ? ''
                                        : styleColorRed
                                    "
                                    class="maxline2 text--body-5"
                                    v-on="on"
                                    v-text="item.documentTitle"
                                  />
                                </template>
                                <div>
                                  {{ item.documentTitle }}
                                </div>
                              </v-tooltip>
                            </div>
                            <div class="grey--text darken-3 text--caption">
                              {{ item.formulaTypeName }}
                            </div>
                          </div>
                        </td>
                        <td
                          class="text-left text--body-5"
                          :class="{ 'popup-acvite': activeIndex == index }"
                        >
                          <div
                            v-if="item.signProcessInfoDtos.length === 1"
                            class="d-flex align-center group-avatar-customer"
                          >
                            <v-avatar
                              size="32"
                              :color="lstColors[0]"
                              @click="activeShowPopupCustomer(index)"
                            >
                              <span class="text-uppercase white--text">{{
                                renderAvatarText(item.signProcessInfoDtos[0])
                              }}</span>
                            </v-avatar>
                            <span class="ml-2">{{
                              renderGroupName(item.signProcessInfoDtos[0])
                            }}</span>
                            <popup-customer
                              :list-show-popup="listShowPopup"
                              :lst-colors="lstColors"
                              :item="item"
                              :active-index="activeIndex"
                              :index="index"
                              @close-popup-customer="closePopupCustomer"
                            />
                          </div>
                          <div
                            v-else
                            class="d-flex align-center group-avatar-customer"
                          >
                            <popup-customer
                              :list-show-popup="listShowPopup"
                              :lst-colors="lstColors"
                              :item="item"
                              :active-index="activeIndex"
                              :index="index"
                              @close-popup-customer="closePopupCustomer"
                            />
                            <list-avatar-customer
                              :lst-colors="lstColors"
                              :item="item"
                              :index-row="index"
                              @active-show-popup-customer="
                                activeShowPopupCustomer
                              "
                            />
                            <v-avatar
                              v-if="item.signProcessInfoDtos.length > 5"
                              size="30"
                              :color="lstColors[4]"
                              class="customer"
                              :style="`left: -32px`"
                              @click="activeShowPopupCustomer(index)"
                            >
                              <span
                                class="text-uppercase white--text"
                              >{{
                                item.signProcessInfoDtos.length - 4
                              }}+</span>
                            </v-avatar>
                          </div>
                        </td>
                        <td class="text-left">
                          <span
                            class="text--body-5"
                            :style="
                              checkExpiredDate(item.expiredDate)
                                ? ''
                                : styleColorRed
                            "
                          >{{ item.expiredDate }}</span>
                        </td>
                        <td class="text-left">
                          <span class="text--body-5">{{
                            item.createdDate
                          }}</span>
                        </td>
                        <td class="text-center">
                          <v-tooltip left content-class="tooltip-left">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click="gotoSign(item.documentId)"
                              >
                                <img
                                  src="@/assets/icons/pdf.svg"
                                  alt=""
                                  srcset=""
                                />
                              </v-btn>
                            </template>
                            <span>
                              {{ item.mainSignFile.fileName }}
                            </span>
                          </v-tooltip>
                        </td>
                        <td>
                          <v-menu
                            v-if="
                              item.showActions && item.showActions.length > 0
                            "
                            left
                            offset-y
                            transition="scroll-y-transition"
                            content-class="menu-action arrow-up"
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

                            <v-list>
                              <div
                                v-for="(action, id) in item.showActions"
                                :key="id"
                                class="px-2 item-action contract-manager-actions"
                              >
                                <div
                                  @click="showConfirmRemove(`${action}`, item)"
                                  v-html="
                                    renderContractAction(
                                      `${action}`,
                                      item.documentId
                                    )
                                  "
                                />
                              </div>
                            </v-list>
                          </v-menu>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-scroll-y-transition>
            </div>
            <div class="mt-10 mx-2 px-8 pb-4">
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
        </v-layout>
      </v-card>
      <!-- <base-loading :is-loading="loading" /> -->
      <dialog-view-pdf
        :src-file-pdf="srcFilePdf"
        :show-dialog="showDialogViewPdf"
        @close-dialog="showDialogViewPdf = false"
      />
      <dialog-contract-detail
        :show-dialog="showContractDetail"
        :histories="historiesContract"
        :contract-id="contractId"
        :show-cancel-process="false"
        :formdata="formdata"
        @close-dialog="showContractDetail = false"
      />
      <dialog-upload-contract
        :show-dialog="showDialogUpload"
        @close-dialog="showDialogUpload = false"
      />
      <!-- Xac nhan xoa, huy luong hop dong -->
      <dialog-confirm
        :show-dialog="showDialogRemoveContract"
        :title-confirm="comfirmRemove"
        @close-dialog="showDialogRemoveContract = false"
        @accept="acceptRemoveContract"
      />
      <base-preload :dialog="downloading" />
    </v-container>
  </div>
</template>

<script>
// Libs
import moment from "moment";
import { mapActions } from "vuex";

// Constants
import config from "@/config";
import constants from "@/constants";
import econtractRoute from "@/modules/econtract/router/routePaths";

// Mixins
import pagingData from "@/mixins/paging";
import alertMixin from "@/mixins/alert";
import checkRoles from "@/mixins/checkRoles";
import statusContract from "@/modules/econtract/mixins/statusContract";
import fileMixin from "@/modules/econtract/mixins/fileMixin";

// Components
import DialogConfirm from "../eContract/contract/sign/components/DialogConfirm.vue";
import DialogContractDetail from "./components/DialogContractDetail.vue";
import EmptyBox from "@/views/components/EmptyBox.vue";
import SearchContract from "./components/SearchContract";
import PopupCustomer from "./components/PopupCustomer.vue";
import ListAvatarCustomer from "./components/ListAvatarCustomer.vue";
import DialogUploadContract from "./components/DialogUploadContract.vue";
import DialogViewPdf from "@/views/components/DialogViewPdf.vue";

// Services
import { ContractService } from "@/modules/econtract/services/contractService";

export default {
  components: {
    DialogContractDetail,
    EmptyBox,
    SearchContract,
    PopupCustomer,
    ListAvatarCustomer,
    DialogUploadContract,
    DialogConfirm,
    DialogViewPdf,
  },
  mixins: [pagingData, alertMixin, statusContract, checkRoles, fileMixin],
  data() {
    return {
      comfirmRemove: null,
      actionContract: null,
      document: null,
      showDialogRemoveContract: false,
      showDialogUpload: false,
      showAdvance: false,
      show: null,
      listContract: [],
      historiesContract: [],
      contractId: null,
      lstColors: ["#FFAF2E", "#0FAFE4", "#4A50E2", "#F028A0", "#FF4A55"],
      formdata: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keyword: "",
        contractType: "", // Loai hop dong
        customerInfo: "", // Ten khach hang
        contractCondition: "", // Bo loc
        fromDate: null, // Ngay tao tu
        toDate: null, // Ngay tao den
        effectDateFrom: null, // Het hieu luc tu
        effectDateTo: null, // Het hieu luc den
        customerType: "", // Loai khach hang: PERSONAL, ORGANIZATION
      },
      listActionShowComfirm: [
        constants.CONTRACT_MANAGER_ACTIONS.ADD_TO_BRIEF,
        constants.CONTRACT_MANAGER_ACTIONS.DELETE,
        constants.CONTRACT_MANAGER_ACTIONS.TRANSFER,
      ],
      showContractDetail: false,
      showDialogViewPdf: false,
      srcFilePdf: null,
      loading: false,
      showTable: true,
      downloading: false,
      listShowPopup: [],
      activeIndex: null,
      styleColorRed: {
        color: "red",
      },
    };
  },
  created() {
    // this.hasPermission([constants.USER_ROLE.HDDT])
    this.hasPermission([
      constants.USER_ROLE.HDDT,
      constants.USER_ROLE.MAIN,
      constants.USER_ROLE.CONCURRENTLY,
      constants.USER_ROLE.OTHER,
      constants.USER_ROLE.NV,
      constants.USER_ROLE.LD,
      constants.USER_ROLE.GD,
    ]);
    localStorage.setItem(constants.LIST_CONTRACT_ROOT, "digitzations");
  },
  mounted() {
    this.searchContract();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    ...mapActions("contract", ["setGoBack"]),
    renderAvatarText(customer) {
      return customer.signGroupName
        ? this.genAvatar(customer.signGroupName)
        : this.genAvatar(customer.signUserName);
    },
    genAvatar(name) {
      if (!name) return "";
      if (name.includes("+")) return name;
      if (name.includes(" ")) {
        // lay ky tu dau tien cua lastname.
        name = name.replaceAll(" ", " ").trim();
        const lastName = name.split(" ").pop();
        return lastName[0].toUpperCase();
      }
      return name[0].toUpperCase();
    },
    renderGroupName(customer) {
      return customer.signGroupName
        ? customer.signGroupName
        : customer.signUserName;
    },
    showPopup(index) {
      return this.listShowPopup[index];
    },
    activeShowPopupCustomer(index) {
      if (this.activeIndex) {
        this.listShowPopup[this.activeIndex] = false;
      }
      this.listShowPopup[index] = true;
      this.activeIndex = index;
    },
    closePopupCustomer() {
      this.listShowPopup[this.activeIndex] = false;
      this.activeIndex = null;
    },
    showConfirmRemove(action, item) {
      if (this.listActionShowComfirm.includes(action)) {
        this.comfirmRemove =
          "contract.titleComfirmRemove.comfirmRemoveContract";
        if (action === constants.CONTRACT_MANAGER_ACTIONS.TRANSFER) {
          this.comfirmRemove = "contract-manager.dialogs.titlteConfirmTransfer";
        }
        if (action === constants.CONTRACT_MANAGER_ACTIONS.ADD_TO_BRIEF) {
          this.comfirmRemove = "contract-manager.dialogs.titlteConfirmAddBrief";
        }
        this.showDialogRemoveContract = true;
        this.actionContract = action;
        this.document = item;
      } else {
        this.clickAction(action, item);
      }
    },
    async clickAction(action, item) {
      // Xem chi tiet
      if (action === constants.CONTRACT_MANAGER_ACTIONS.VIEW) {
        this.showDetail(item.documentId);
      }
      // Tai file hop dong
      if (action === constants.CONTRACT_MANAGER_ACTIONS.DOWNLOAD) {
        if (item.mainSignFile) this.getFileSign(item);
      }
      // Gui hop dong
      if (action === constants.CONTRACT_MANAGER_ACTIONS.TRANSFER) {
        try {
          await ContractService.sendDocument(item.documentId);
          this.showNotify(
            "success",
            this.$t("success", {
              msg: this.$t("contract.tooltip.send"),
            })
          );
          // Goi lai danh sach
          this.searchContract();
        } catch (error) {
          this.showNotify("error", error.message);
        }

        return;
      }
      // Sua hop dong
      if (action === constants.CONTRACT_MANAGER_ACTIONS.EDIT) {
        return this.$router.push(
          `${econtractRoute.UPDATE_CONTRACT_DIGIT_PATH.replaceAll(
            ":contractId",
            item.documentId
          )}`
        );
      }
      // Xoa hop dong
      if (action === constants.CONTRACT_MANAGER_ACTIONS.DELETE) {
        try {
          await ContractService.deleteExternalContract(item.documentId);
          this.showNotify(
            "success",
            this.$t("success", {
              msg: this.$t("contract.tooltip.delete"),
            })
          );
          // Goi lai danh sach
          this.searchContract();
        } catch (error) {
          this.showNotify("error", error.message);
        }

        return;
      }
    },
    async getFileSign(item) {
      try {
        const fileSign = await ContractService.getFileSign(item.documentId);
        this.downloadFile(fileSign, item.fileName);
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    acceptRemoveContract() {
      this.clickAction(this.actionContract, this.document);
    },
    onChangePage(page) {
      this.listShowPopup[this.activeIndex] = false;
      this.activeIndex = null;
      this.formdata.page = page;
      this.page = page;
      this.search();
    },
    // Hien thi chi tiet hop dong
    showDetail(contractId) {
      this.contractId = `${contractId}`;
      this.showContractDetail = true;
    },
    changeShowAdvance(value) {
      this.showAdvance = value;
    },
    async searchContract() {
      this.formdata.page = "";
      this.search();
    },
    isValidDate(strDate) {
      return moment(strDate, 'DDMMYYYY', true).isValid()
    },
    async search() {
      try {
        if (!this.showAdvance) {
          this.formdata.effectDateFrom = null;
          this.formdata.effectDateTo = null;
        }
        if (this.formdata.customerInfo) {
          this.formdata.customerInfo = this.formdata.customerInfo.trim();
        }
        if (this.formdata.keyword) {
          this.formdata.keyword = this.formdata.keyword.trim();
        }
        // Ko goi search khi ngay bat dau hoac ngay ket thuc null
        const validFromDate = this.isValidDate(this.formdata.fromDate)
        const validToDate = this.isValidDate(this.formdata.toDate)

        if (!validFromDate || !validToDate) return

        this.loading = true;
        const response = await ContractService.searchContractManager(
          this.formdata
        );
        const dataResponse = response.data;
        this.listContract = dataResponse.data;
        this.renderPaging(dataResponse);
        setTimeout(() => {
          this.showTable = true;
        }, 10);
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    renderContractAction(action, id) {
      switch (action) {
        case constants.CONTRACT_MANAGER_ACTIONS.EDIT: // Sua hop dong
          return this.elementAction("edit", "contract-manager.labels.edit");
        case constants.CONTRACT_MANAGER_ACTIONS.VIEW: // Xem hop dong
          return this.elementAction("view", "contract-manager.labels.view");
        case constants.CONTRACT_MANAGER_ACTIONS.DELETE: // Xoa hop dong
          return this.elementAction("delete", "contract-manager.labels.delete");
        case constants.CONTRACT_MANAGER_ACTIONS.TRANSFER: // Chuyen hop dong
          return this.elementAction(
            "transfer",
            "contract-manager.labels.transfer"
          );
        case constants.CONTRACT_MANAGER_ACTIONS.ADD_TO_BRIEF: // Them vao ho so
          return this.elementAction(
            "add-profile",
            "contract-manager.labels.addToProfile"
          );
        case constants.LIST_ACTIONS_DETAIL.DOWNLOAD: // Tai file hop dong
          return this.elementAction(
            "download",
            "contract-manager.labels.download"
          );
      }
    },
    elementAction(icon, title) {
      return `
          <div class="btn-action">
            <i class='action-${icon}'></i>
            <span>${this.$t(title)}</span>
          </div>`;
    },
    gotoSign(contractId) {
      this.$router.push(
        `${econtractRoute.SIGN_CONTRACT_PATH.replaceAll(
          ":contractId",
          contractId
        )}`
      );
    },
    checkExpiredDate(date) {
      if (date != null) {
        const dateData = moment(date, "DD/MM/YYYY");
        const dateNow = moment(new Date(), "DD/MM/YYYY");
        const diff = dateData.diff(dateNow, "days");
        if (diff > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
  },
};
</script>
