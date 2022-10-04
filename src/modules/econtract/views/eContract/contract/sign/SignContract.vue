<template>
  <div class="wrap-home contract-sign ml-2 mt-2">
    <v-container class="py-5 pt-2 rounded-xl bg-primary" fluid>
      <breadcrumbs :items="breadcrumbs" clazz="pt-0" />
      <v-card class="content-page rounded-xl pb-0" color="white">
        <div v-show="!loading" class="">
          <div class="main__tool">
            <div class="tool__header">
              <!-- File name -->
              <div class="file-name">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ fileContract.fileName }}</span>
                  </template>
                  <span>{{ fileContract.fileName }}</span>
                </v-tooltip>
              </div>

              <!-- Zoom -->
              <div class="tool__nav">
                <v-btn
                  :disabled="disabledZoomOut"
                  elevation="1"
                  fab
                  x-small
                  @click="zoomOut"
                >
                  <vue-feather color="#8E8EA1" type="minus-circle" />
                </v-btn>

                <v-select
                  v-model="zoom"
                  :items="lstZoom"
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    contentClass: 'menu-zoom',
                  }"
                  class="zoom-input"
                  dense
                  hide-details
                  solo
                  @change="changeZoom"
                >
                  <template slot="selection" slot-scope="data">
                    {{ data.item }}%
                  </template>
                  <template slot="item" slot-scope="data">
                    {{ data.item }}%
                  </template>
                </v-select>

                <v-btn
                  :disabled="disabledZoomIn"
                  elevation="1"
                  fab
                  x-small
                  @click="zoomIn"
                >
                  <vue-feather color="#8E8EA1" type="plus-circle" />
                </v-btn>
              </div>

              <!-- Comment, draw -->
              <div class="tool__comment d-none">
                <v-tooltip bottom content-class="tooltip-bottom">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" icon v-on="on">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("contract.tooltip.draw") }}</span>
                </v-tooltip>
                <v-tooltip bottom content-class="tooltip-bottom">
                  <template v-slot:activator="{ on }">
                    <v-btn class="mx-5" color="primary" icon v-on="on">
                      <vue-feather type="message-circle" />
                    </v-btn>
                  </template>
                  <span>{{ $t("contract.tooltip.comment") }}</span>
                </v-tooltip>
                <v-menu
                  v-if="showActionDeleteComment"
                  bottom
                  content-class="menu-action"
                  offset-y
                  open-on-hover
                >
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" icon v-on="on">
                      <vue-feather type="trash-2" />
                    </v-btn>
                  </template>
                  <v-list>
                    <div class="px-2 item-action btn">
                      {{ $t("contract.label.removeAll") }}
                    </div>
                    <div class="px-2 my-2 item-action btn">
                      {{ $t("contract.label.removeAllDraws") }}
                    </div>
                    <div class="px-2 item-action btn">
                      {{ $t("contract.label.removeAllComments") }}
                    </div>
                  </v-list>
                </v-menu>
              </div>
            </div>

            <div class="tool">
              <!-- File PDF preview -->
              <div class="tool__preview">
                <bsd-pdf
                  v-if="src"
                  id="pdf-preview"
                  ref="pdfPreview"
                  :file-path="src"
                  :force-render="forceRender"
                  :show-nav="false"
                  prefix-render-id="page-preview"
                  scale="0.1"
                  @on-success="loadPreviewSuccess"
                  @on-pagerender="loadSignFilePreview"
                />
              </div>

              <div id="workArea" ref="workArea" class="tool__workarea">
                <bsd-pdf
                  v-if="src"
                  ref="pdf"
                  :file-path="src"
                  :force-render="forceRender"
                  :show-nav="false"
                  prefix-render-id="page-content"
                  @on-scroll="onScollFile"
                  @on-success="loadPdfSuccess"
                  @on-pagerender="loadSignaturePage"
                />

                <div
                  v-if="canSelectImageSign && imageSigns.length > 0"
                  class="nav-signature-items"
                >
                  <v-btn
                    v-if="visibleStartSign"
                    class="text--button"
                    color="primary"
                    outlined
                    small
                    @click="moveToSignature(0)"
                  >{{ $t("contract.label.startSign") }}</v-btn>

                  <v-tooltip content-class="tooltip-left" left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :disabled="valueFocusPage <= firstFocusPage"
                        color="primary"
                        fab
                        icon
                        outlined
                        small
                        v-bind="attrs"
                        @click="moveToSignature('prev')"
                        v-on="on"
                      ><v-icon>mdi-chevron-up</v-icon></v-btn>
                    </template>
                    <span>{{ $t("contract.tooltip.prevSignature") }}</span>
                  </v-tooltip>

                  <v-tooltip content-class="tooltip-left" left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :disabled="valueFocusPage >= endFocusPage"
                        color="primary"
                        fab
                        icon
                        outlined
                        small
                        v-bind="attrs"
                        @click="moveToSignature('next')"
                        v-on="on"
                      ><v-icon>mdi-chevron-down</v-icon></v-btn>
                    </template>
                    <span>{{ $t("contract.tooltip.nextSignature") }}</span>
                  </v-tooltip>
                </div>
              </div>

              <div id="sidebar" class="tool__sidebar">
                <v-btn
                  v-if="showActionChangeSigner"
                  :disabled="showButtonChangeSigner"
                  class="my-2 w-150 py-5 px-2 text--button button-responsive"
                  color="primary"
                  rounded
                  @click="showDialogChangeSign"
                >
                  {{ $t("contract.label.changeSigner") }}
                </v-btn>
                <v-btn
                  v-if="showActionChangeReviewer"
                  class="my-2 w-150 py-5 px-2 text--button button-responsive "
                  color="primary"
                  rounded
                  @click="showDialogChangeReview"
                >
                  {{ $t("contract.label.changeReviewer") }}
                </v-btn>
                <v-btn
                  v-if="contractActionConfirm"
                  class="my-2 w-150 py-5 px-2 text--button button-responsive"
                  color="primary"
                  rounded
                  @click="contractActionConfirm = null"
                >
                  {{ $t(genTextBtn) }}
                </v-btn>
                <v-btn
                  v-if="showActionAddReviewer"
                  :disabled="disabledBtnAdd"
                  class="my-2 py-5 px-2 w-150 text--button button-responsive"
                  color="primary"
                  rounded
                  @click="showDialogAddReview"
                >
                  {{ $t("contract.label.addReviewer") }}
                </v-btn>

                <v-btn
                  v-if="showActionAddInitalSign"
                  :disabled="disabledBtnAdd"
                  class="my-2 py-5 w-150 text--button button-responsive"
                  color="primary"
                  rounded
                  @click="showDialogAddInitial"
                >
                  {{ $t("contract.label.addInitialSigner") }}
                </v-btn>
                <div
                  v-if="additionalSigners.length > 0 && permissions.length > 0"
                  class="text--body-3 text-danger"
                >
                  {{ $t("waitAllSigned") }}
                </div>
                <v-sheet
                  id="scrolling-techniques-2"
                  class="overflow-y-auto"
                  max-height="50vh"
                >
                  <contract-action
                    v-if="showButtonChangeSigner"
                    :additional-signers="additionalSigners"
                    @show-dialog="showButtonChange"
                  />
                  <contract-note
                    v-if="showContractNote"
                    :assigner-note="assignerNote"
                  />
                  <contract-action-confirm
                    v-if="showContractActionConfirm"
                    :contract-action-confirm="contractActionConfirm"
                    :sign-user-type="signUserType"
                  />
                </v-sheet>
              </div>
            </div>
          </div>

          <!-- CheckBox temp -->
          <div
            v-if="showAcceptTerm"
            :data-intro="$t('agreeTerm')"
            class="wrap-accept-term"
          >
            <v-checkbox v-model="acceptTerm" hide-details>
              <template slot="label">
                <span
                  class="red--text text--overlined"
                  v-html="$t('contract.terms')"
                />
              </template>
            </v-checkbox>
          </div>

          <!-- Bottom button -->
          <div class="d-flex justify-end align-center  pt-1 bottom-tool responsive-button-sign">
            <v-btn
              class="my-2 w-150 py-5 text--button"
              color="#0FAFE4"
              outlined
              rounded
              @click="backAction"
            >
              <span class="text-primary"> {{ $t("contract.back") }}</span>
            </v-btn>

            <v-btn
              v-if="showActionReject"
              class="my-2 w-150 py-5 mx-10 text--button"
              color="#FF4A55"
              outlined
              rounded
              @click="showDialogConfirmReject = true"
            >
              {{ $t("rejectLabel") }}
            </v-btn>
            <v-btn
              v-if="showActionReview"
              :disabled="waitingSubmit || !acceptTerm"
              class="my-2 w-150 py-5 text--button"
              color="primary"
              rounded
              @click="showDialogConfimReview = true"
            >
              {{ $t("dashboards.review") }}
            </v-btn>
            <v-btn
              v-if="contractActionConfirm"
              class="my-2 w-150 py-5 text--button"
              color="primary"
              rounded
              @click="showDialogConfirmChangeSigner"
            >{{ $t("contract.titleConfirm.comfirm") }}
            </v-btn>
            <v-btn
              v-if="showActionSign"
              :disabled="waitingSubmit || !acceptTerm"
              class="my-2 w-150 py-5 text--button"
              color="primary"
              rounded
              @click="onShowDialogConfirmSign"
            >
              {{ $t(labelBtnSign) }}
            </v-btn>
          </div>
        </div>
      </v-card>

      <dialog-select-signature
        :focus-tab-sign="focusTabSign"
        :full-name="fullName"
        :group-id="`${fileContract.signGroupId}`"
        :group-type="fileContract.groupType"
        :id-signature="currentSignatureId"
        :show-dialog="showDialogSelectSignature"
        @accept="acceptSelectSignture"
        @acceptFakeImgCA="acceptFakeImgCA"
        @close-dialog="showDialogSelectSignature = false"
        @accept-pin-ca="acceptPinCA"
      />
      <dialog-input-pin
        :show-dialog="showDialogSelectPinCA"
        @accept="acceptPinCA"
        @close-dialog="showDialogSelectPinCA = false"
      />
      <!-- Dialog doi nguoi xem xet -->
      <dialog-change-reviewer
        :contract-id="contractId"
        :group-id="signGroupId"
        :group-type="signGroupType"
        :list-users="listUsers"
        :show-dialog="showDialogChangeReviewer"
        @accept="acceptChangeSigner"
        @close-dialog="showDialogChangeReviewer = false"
      />
      <!-- Dialog Them ky nhay -->
      <dialog-add-initial-sign
        :contract-id="contractId"
        :group-id="signGroupId"
        :group-type="signGroupType"
        :list-users="listUsers"
        :show-dialog="showDialogAddInitialSign"
        @accept="acceptAddFlashesSign"
        @close-dialog="showDialogAddInitialSign = false"
      />
      <!-- Dialog Them xem xet -->
      <dialog-add-reviewer
        :contract-id="contractId"
        :group-id="signGroupId"
        :group-type="signGroupType"
        :list-users="listUsers"
        :show-dialog="showDialogAddReviewer"
        @accept="acceptAddFlashesSign"
        @close-dialog="showDialogAddReviewer = false"
      />
      <!-- Dialog doi nguoi ky -->
      <dialog-change-signer
        :contract-id="contractId"
        :group-id="signGroupId"
        :group-type="signGroupType"
        :list-users="listUsers"
        :show-dialog="showDialogChangeSigner"
        @accept="acceptChangeSigner"
        @close-dialog="showDialogChangeSigner = false"
      />
      <!-- Xac nhan ky -->
      <dialog-confirm
        :show-comment="true"
        :show-dialog="showDialogConfirmSign"
        :title-confirm="titlePopupSign"
        @accept="submitSign"
        @close-dialog="showDialogConfirmSign = false"
      />
      <!-- Xac nhan xem xet -->
      <dialog-confirm
        :show-comment="true"
        :show-dialog="showDialogConfimReview"
        title-confirm="contract.label.confirmReview"
        @accept="submitReview"
        @close-dialog="showDialogConfimReview = false"
      />
      <!-- Xac nhan tu choi -->
      <dialog-confirm
        :label-comment="`contract.label.reason`"
        :label-input-comment="`contract.label.inputReason`"
        :label-message-comment="`contract.reasonRequired`"
        :required-comment="true"
        :show-comment="true"
        :show-dialog="showDialogConfirmReject"
        title-confirm="contract.label.confirmReject"
        @accept="submitReject"
        @close-dialog="showDialogConfirmReject = false"
      />
      <!-- Xac nhan quay lai  -->
      <dialog-confirm
        :show-comment="false"
        :show-dialog="showDialogBack"
        content-confirm="contract.label.lostContent"
        title-confirm="contract.label.confirmBack"
        @accept="backSign"
        @close-dialog="showDialogBack = false"
      />
      <!-- Xac nhan doi nguoi ky, doi nguoi xem xet -->
      <dialog-confirm
        :show-dialog="showDialogChangeAdditional"
        :title-confirm="comfirmChange"
        @accept="acceptChangeSigner"
        @close-dialog="showDialogChangeAdditional = false"
      />
      <!-- Xac nhan xoa nguoi ky nhay, nguoi xem xet -->
      <dialog-confirm
        :show-dialog="showDialogRemoveAdditional"
        :title-confirm="comfimRemove"
        content-confirm="contract.label.lostContent"
        @accept="removeAdditionalSigner"
        @close-dialog="showDialogRemoveAdditional = false"
      />
      <base-preload :dialog="loading || waitingSubmit" />
    </v-container>
  </div>
</template>

<script>
// Libs
import bsdPdf from "bsd-pdf";
import Vue from "vue";
import i18n from "@/i18n";
import _ from "lodash";
import { mapActions, mapState } from "vuex";
import "intro.js/minified/introjs.min.css";

// Components
import Breadcrumbs from "@/components/core/Breadcrumbs.vue";
import DialogSelectSignature from "./components/DialogSelectSignature";
import DialogAddInitialSign from "./components/DialogAddInitialSign";
import DialogAddReviewer from "./components/DialogAddReviewer";
import DialogChangeReviewer from "./components/DialogChangeReviewer";
import DialogChangeSigner from "./components/DialogChangeSigner";
import DialogConfirm from "./components/DialogConfirm";
import DialogInputPin from "./components/DialogInputPin";
import ContractAction from "./components/ContractAction";
import ContractActionConfirm from "./components/ContractActionConfirm";
import ContractNote from "./components/ContractNote";
import ItemSignature from "./components/ItemSignature";
import TextPagePdf from "@/modules/econtract/views/eContract/contract/create-contract/components/TextPagePdf";
import IconSign from "@/modules/econtract/views/eContract/contract/create-contract/components/IconSign";

// Services
import { ContractService } from "@/modules/econtract/services/contractService";
import { FileService } from "@/modules/econtract/services/fileService";
import { randomId } from "@/core/utils";
import econtractRoute from "@/modules/econtract/router/routePaths";

// Mixins
import goBackMethod from "@/modules/econtract/mixins/goBackMethod";
import fileMixin from "@/modules/econtract/mixins/fileMixin";

// Constants
import constants from "@/constants";

const introJS = require("intro.js");

export default {
  components: {
    bsdPdf,
    Breadcrumbs,
    DialogSelectSignature,
    DialogInputPin,
    DialogAddInitialSign,
    DialogAddReviewer,
    DialogConfirm,
    DialogChangeReviewer,
    DialogChangeSigner,
    ContractAction,
    ContractNote,
    ContractActionConfirm,
  },
  mixins: [goBackMethod, fileMixin],
  data() {
    return {
      comfimRemove: null,
      paramsRemove: null,
      fileContract: {
        fileName: "",
        filePage: 0,
        url: "",
        documentTitle: "",
      },
      breadcrumbs: [
        {
          text: "contract.name",
          disabled: false,
          href: `${econtractRoute.LIST_CONTRACT_CREATED_PATH}`,
        },
        {
          text: "",
          disabled: true,
          tooltip: true,
          href: "",
        },
      ],
      loading: true,
      waitingSubmit: false,
      itemsSign: [],
      src: null,
      numPages: null,
      currentPage: 1,
      page: 1,
      pagesItemSign: [],
      /* Zoom */
      lstZoom: [25, 33, 50, 67, 75, 100, 110, 125, 150, 175, 200],
      zoom: 100,
      disabledZoomIn: false,
      disabledZoomOut: false,
      /* *** */
      contractId: null,
      showDialogSelectSignature: false,
      showDialogSelectPinCA: false,
      showDialogConfirmSign: false,
      showDialogConfirmReject: false,
      showDialogAddInitialSign: false,
      showDialogAddReviewer: false,
      showDialogChangeSigner: false,
      showDialogChangeReviewer: false,
      showDialogConfimReview: false,
      showDialogBack: false,
      showDialogRemoveAdditional: false,
      currentSignatureId: null,
      currentSignMethod: null,
      focusSignature: 0,
      totalSignature: 0,
      visibleStartSign: true,
      showContractActionConfirm: false, // show note khi doi nguoi xem xet
      comfirmChange: null, // title popup comfirm doi nguoi xem xet
      showDialogChangeAdditional: false, // show popup comfirm doi nguoi xem xet
      // Danh sach anh ky
      imageSigns: [],
      acceptTerm: false,
      permissions: null,
      signGroupType: null,
      signGroupId: null,
      additionalSigners: [],
      assignerNote: null,
      listUsers: [],
      signeUserId: null,
      signProcessId: null,
      signUserType: null,
      contractActionConfirm: null, // data form doi nguoi xem xet, nguoi ky
      // Ve
      draws: [],
      // Comment
      comments: [],
      labelBtnSign: "contract.signType.main",
      titlePopupSign: "contract.label.confirmSign",
      messageSignSuccess: "contract.signContractSuccess",
      fileSign: null,
      loadFileSignPreview: false, // Check load file pdf preview success.
      pagePreviewTooltips: [],
      pageActive: 1,
      scale: "1",
      forceRender: false,
      firstFocusPage: 0,
      valueFocusPage: 0,
      endFocusPage: 0,
      lstPageSign: [],
      listInitPageSign: [],
      fullName: "",
    };
  },
  computed: {
    ...mapState("contract", ["goBack"]),

    // Title popup confirm change reviewer, signer.
    genTextBtn() {
      let text = "contract.titleConfirm.cancelChangeSigner";
      if (this.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
        text = "contract.titleConfirm.cancelChangeReviewer";
      }
      return text;
    },

    // Disabled btn add reviewer, flashes khi doi nguoi ky.
    disabledBtnAdd() {
      let check = false;
      if (this.contractActionConfirm) check = true;
      return check;
    },

    // Hien thi btn doi nguoi ky khi khong co nguoi xem xet, nguoi ky
    showButtonChangeSigner() {
      return this.additionalSigners.length > 0;
    },

    showContractNote() {
      return this.assignerNote;
    },

    // Hien thi btn them ky nhay
    showActionAddInitalSign() {
      return (
        this.permissions &&
        this.permissions.includes(constants.SIGN_ACTIONS.ADD_FLASHES_SIGNER)
      );
    },

    // Hien thi btn them xem xet
    showActionAddReviewer() {
      return (
        this.permissions &&
        this.permissions.includes(constants.SIGN_ACTIONS.ADD_REVIEWER)
      );
    },

    // Hien thi btn tu choi
    showActionReject() {
      const lstApprove = [
        constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN,
        constants.SIGN_ACTIONS.APPROVE_MAIN_SIGN,
        constants.SIGN_ACTIONS.APPROVE_REVIEW,
        constants.SIGN_ACTIONS.APPROVE_COORDINATE,
      ];
      var isShow = false;
      if (this.permissions && !this.contractActionConfirm) {
        for (const permission of this.permissions) {
          if (lstApprove.includes(permission)) {
            isShow = true;
          }
        }
      }

      return isShow;
    },

    // Hien thi btn doi nguoi ky
    showActionChangeSigner() {
      return (
        this.permissions &&
        this.permissions.includes(constants.SIGN_ACTIONS.CHANGE_MAIN_SIGNER) &&
        !this.contractActionConfirm
      );
    },

    // Hien thi btn doi ky nhay
    showActionChangeInitalSigner() {
      return (
        this.permissions &&
        this.permissions.includes(constants.SIGN_ACTIONS.CHANGE_FLASHES_SIGNER)
      );
    },

    // Hien thi btn doi xem xet
    showActionChangeReviewer() {
      return (
        this.permissions &&
        this.permissions.includes(constants.SIGN_ACTIONS.CHANGE_REVIEWER) &&
        !this.contractActionConfirm
      );
    },

    // Hien thi nhom btn comment
    showGroupActionComment() {
      return (
        this.permissions &&
        this.permissions.includes(constants.SIGN_ACTIONS.COMMENT)
      );
    },

    // Hien thi btn xoa comment
    showActionDeleteComment() {
      return this.comments.length > 0 || this.draws.length > 0;
    },

    // Hien thi btn xem xet
    showActionReview() {
      return (
        this.permissions &&
        this.permissions.includes(constants.SIGN_ACTIONS.APPROVE_REVIEW) &&
        !this.contractActionConfirm
      );
    },

    // Hien thi btn ky
    showActionSign() {
      const lstApprove = [
        constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN,
        constants.SIGN_ACTIONS.APPROVE_MAIN_SIGN,
      ];
      var isShow = false;
      if (this.permissions && !this.contractActionConfirm) {
        for (const permission of this.permissions) {
          if (lstApprove.includes(permission)) {
            isShow = true;
          }
        }
      }

      return isShow;
    },

    canSelectImageSign() {
      return (
        this.permissions &&
        this.permissions.includes(constants.SIGN_ACTIONS.APPROVE_MAIN_SIGN) &&
        !this.contractActionConfirm
      );
    },

    // Hien thi dong y dieu khoan
    showAcceptTerm() {
      const lstAction = [
        constants.SIGN_ACTIONS.APPROVE_REVIEW,
        constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN,
        constants.SIGN_ACTIONS.APPROVE_MAIN_SIGN,
      ];
      var isExitsAction = false;

      if (this.permissions && !this.contractActionConfirm) {
        lstAction.map((action) => {
          if (this.permissions.includes(action)) {
            isExitsAction = true;
          }
        });
      }
      return isExitsAction;
    },

    // Noi dung thong bao thanh cong  khi tu choi
    messageRejectSuccess() {
      const lstApproveSign = [
        constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN,
        constants.SIGN_ACTIONS.APPROVE_MAIN_SIGN,
      ];

      // Quyen xem xet
      if (this.permissions.includes(constants.SIGN_ACTIONS.APPROVE_REVIEW)) {
        return this.$t("contract.rejectsSuccess.review");
      }
      // Quyen dieu phoi
      if (
        this.permissions.includes(constants.SIGN_ACTIONS.APPROVE_COORDINATE)
      ) {
        return this.$t("contract.rejectsSuccess.coordinate");
      }
      // Quyen ky nhay, ky chinh
      for (const permission of this.permissions) {
        if (lstApproveSign.includes(permission)) {
          return this.$t("contract.rejectsSuccess.sign");
        }
      }
      return "";
    },

    focusTabSign() {
      switch (this.currentSignMethod) {
        case constants.SIGN_METHODS.ALL:
        case constants.SIGN_METHODS.IMAGE_SIGN:
          return 0;
        case constants.SIGN_METHODS.DIGITAL_SIGN:
          return 2;
        default:
          return 0;
      }
    },

    signersCompleted() {
      var completed = false;
      if (!this.additionalSigners) {
        return false;
      } else {
        completed = this.additionalSigners.some(
          (signer) => signer.documentState !== "COMPLETE"
        );
        return completed;
      }
    },
  },

  watch: {
    zoom() {
      if (this.itemsSign.length > 0) {
        // this.itemsSign.map((item) => (item.signature.zoom = this.zoom));
        this.itemsSign.map((item) => (item.zoom = this.getZoom()));
      }
    },

    acceptTerm() {
      if (this.acceptTerm) {
        introJS.introJs().exit();
      }
    },

    contractActionConfirm() {
      if (this.signUserType !== constants.SIGN_USER_TYPE.REVIEWER) {
        if (this.contractActionConfirm) {
          // An chan ky, accpet, an group btn ky
          if (this.itemsSign.length > 0) {
            this.itemsSign.map((item) => item.$el.classList.add("d-none"));
          }
        } else {
          // Hien chan ky, accpet, an group btn ky
          this.itemsSign.map((item) => item.$el.classList.remove("d-none"));
        }
      }
    },

    // Hien thi thong bao co item ky cho page review
    itemsSign() {
      this.reloadIconSignPreview();
    },
  },

  updated() {
    this.updateBreadcrumb();
  },

  async created() {
    await this.initPage();
  },

  mounted() {
    this.updateBreadcrumb();
  },

  methods: {
    ...mapActions("layout", ["setNotify"]),
    ...mapActions("contract", ["setSignatureId"]),

    updateBreadcrumb() {
      const rootBreadcrum = localStorage.getItem(constants.LIST_CONTRACT_ROOT);
      if (rootBreadcrum === "flows") {
        this.breadcrumbs[0].href = `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/${rootBreadcrum}`;
      } else {
        this.breadcrumbs[0].href = `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contracts/${rootBreadcrum}`;
      }
    },

    showIntro() {
      if (this.showAcceptTerm && !this.acceptTerm) {
        introJS.introJs().start();
      }
    },

    showDialogConfirmChangeSigner() {
      this.showDialogChangeAdditional = true;
      this.comfirmChange = "contract.titleConfirm.comfirmChangeSigner";
      if (this.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
        this.comfirmChange = "contract.titleConfirm.comfirmChangeReviewer";
      }
    },

    async initPage() {
      await Object.assign(this.$data, this.$options.data.call(this));
      this.contractId = this.$route.params.contractId;
      var result = await this.getFileSign(this.contractId);
      if (!result) return;
      await this.getListSignature(this.contractId);
      await this.getAdditionalSigner(this.contractId);
      const user = JSON.parse(localStorage.getItem(constants.USER_INFO));
      this.fullName = user.fullName;
    },

    // Lay file ky
    async getFileSign(contractId) {
      try {
        const fileSign = await ContractService.getFileSign(contractId);
        this.fileSign = fileSign;
        if (fileSign) {
          this.src = fileSign;
        }
        return true;
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: error.message.message,
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    setTitlePopupAndButtonSign() {
      if (this.permissions && this.permissions.length > 0) {
        for (const permission of this.permissions) {
          if (permission === constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN) {
            this.labelBtnSign = "contract.signType.flashes";
            this.titlePopupSign = "contract.label.confirmSignFlashes";
            this.messageSignSuccess = "contract.flashesContractSuccess";
          }
        }
      }
    },

    // Lay danh sach chan ky
    async getListSignature(contractId) {
      try {
        const response = await ContractService.getSignatureSign(contractId);
        this.fileContract = response.data;

        this.breadcrumbs[1].text = this.fileContract.documentTitle;
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: error,
        });
      } finally {
        this.loading = false;
      }
    },

    initListSignature() {
      const docNoteSign = [];
      this.fileContract.signProcessList.map((process) => {
        process.docNoteSigns.map((note) =>
          docNoteSign.push({
            ...note,
            signUserName: process.signUserName,
            signType: process.signMethod,
          })
        );
        this.signeUserId = process.signUserId;
        this.signGroupType = process.groupType;
        this.signUserType = process.signUserType;
        this.signProcessId = process.signProcessId;
      });
      this.permissions = this.fileContract.actions;
      this.setTitlePopupAndButtonSign();
      if (docNoteSign && docNoteSign.length > 0) {
        this.pagesItemSign = _.groupBy(docNoteSign, "page");
        this.totalSignature = docNoteSign.length - 1;
        docNoteSign.map(async(doc, index) => {
          const signature = {
            x: doc.axisX,
            y: doc.axisY,
            page: doc.page,
            signType: doc.signType,
            name: doc.signUserName,
            docNoteSignId: doc.id,
            itemIndex: index,
            dataImgSign: null,
            zoom: 100,
          };
          this.imageSigns.push(signature);
          this.lstPageSign.push(signature.page);
        });
        setTimeout(() => {
          this.lstPageSign.sort((a, b) => a - b);
          this.initialListPageSign();
          this.firstFocusPage = this.lstPageSign[0];
          this.valueFocusPage = this.lstPageSign[0];
          this.endFocusPage = this.lstPageSign[this.lstPageSign.length - 1];
          this.imageSigns.map((img) => {
            this.addSignature(img);
          });
        }, 500);
      }
    },

    // Khoi tao list page co chan ky.
    initialListPageSign() {
      this.listInitPageSign = [];
      this.listInitPageSign.length = this.numPages;

      // Set chan ky vao page.
      for (const page of this.lstPageSign) {
        this.listInitPageSign[page - 1] = page;
      }
    },

    // Khoi tao chan ky
    addSignature(signature) {
      var ItemSignatureEl = Vue.extend(ItemSignature);
      var pageSign = this.$refs.workArea.querySelector(
        `#page-content${signature.page}`
      );
      var dataLoaded = pageSign.getAttribute("data-loaded");
      if (signature.x >= 640) signature.x = 640;
      if (signature.y >= -78) signature.y = -78;

      const id = randomId();
      var instance = new ItemSignatureEl({
        i18n,
        propsData: {
          type: signature.signType,
          id: id,
          w: 100,
          h: 60,
          signature: signature,
          itemIndex: signature.itemIndex,
        },
        methods: {
          onSelectSignature: this.onSelectSignature,
          onSelecPinCA: this.onSelecPinCA,
        },
      });
      this.itemsSign.push(instance);
      if (dataLoaded) {
        instance.$mount();
        pageSign.appendChild(instance.$el);
      }
    },

    // Check load file PDF main success.
    loadPdfSuccess(val) {
      setTimeout(() => {
        // this.reloadSign();
        if (!this.addInitSigner) this.initListSignature();
      }, 500);
    },

    // Reload chan ky khi change file PDF.
    reloadSign() {
      this.itemsSign.map((item) => {
        if (item.signer.fileName === this.fileDocument.fileName) {
          var pageSign = this.$refs.workArea.querySelector(
            `#page-content${item.signature.page}`
          );
          var dataLoaded = pageSign.getAttribute("data-loaded");
          if (dataLoaded) {
            item.$mount();
            pageSign.appendChild(item.$el);
          }
        }
      });
    },

    // Scroll file pdf
    onScollFile(currentPage) {
      this.currentPage = currentPage;
      this.valueFocusPage = currentPage;
      if (this.pageActive && this.pageActive !== currentPage) {
        this.$refs.pdfPreview.goToPage(this.currentPage);
        // Remove old pageActive
        var oldPage = document.getElementById(`page-preview${this.pageActive}`);
        oldPage.classList.remove("activePagePreview");
        this.pageActive = +currentPage;

        // Add new pageActive
        var newPage = document.getElementById(`page-preview${this.pageActive}`);
        newPage.classList.add("activePagePreview");
      }
    },

    // Load chan ky khi page pdf load success.
    loadSignaturePage(pageLoaded) {
      var instances = this.itemsSign.filter(
        (item) => item.signature.page === pageLoaded
      );

      if (instances) {
        var pageSign = this.$refs.workArea.querySelector(
          `#page-content${pageLoaded}`
        );

        for (var i = 0; i < instances.length; i++) {
          instances[i].$mount();
          pageSign.appendChild(instances[i].$el);
        }
      }
    },

    // Add lai pageNum & iconSign khi scroll file
    loadSignFilePreview(pageLoaded) {
      if (this.pagePreviewTooltips && this.loadFileSignPreview) {
        var element = document.getElementById(`page-preview${pageLoaded}`);
        this.addTextPage(element, pageLoaded);
        this.repalceIconSign(element, pageLoaded);

        setTimeout(() => {
          this.reloadPagesItemSign();
        }, 100);
      }
    },

    // Reload tooltip icon sign.
    reloadPagesItemSign() {
      this.pagePreviewTooltips.map((tooltip, page) => {
        var itemSign = this.pagesItemSign[page + 1];
        tooltip.numSign = itemSign ? itemSign.length : 0;
      });
    },

    addTextPage(pageSign, page) {
      var TextPagePdfEl = Vue.extend(TextPagePdf);
      var instance = new TextPagePdfEl({
        i18n,
        propsData: {
          textPage: "" + page,
        },
      });
      instance.$mount();
      pageSign.appendChild(instance.$el);
    },

    repalceIconSign(pageSign, pageNum) {
      var instance = this.pagePreviewTooltips[pageNum - 1];
      instance.$mount();
      pageSign.appendChild(instance.$el);
    },

    addIconSign(pageSign, numSign) {
      var IconSignEl = Vue.extend(IconSign);
      var instance = new IconSignEl({
        i18n,
        propsData: {
          numSign: numSign,
        },
      });
      instance.$mount();
      this.pagePreviewTooltips.push(instance);
      pageSign.appendChild(instance.$el);
    },

    // Check load file PDF Preview success.
    loadPreviewSuccess(val) {
      this.numPages = val;
      const self = this;
      this.pagePreviewTooltips = [];
      this.loadFileSignPreview = false;
      this.pageActive = 1;
      this.currentPage = 1;

      // Add event click to file PDF Preview.
      var onClickPdfPreviewPage = function() {
        var attribute = this.getAttribute("data-page-number");
        if (attribute) self.$refs.pdf.goToPage(+attribute);
        if (self.pageActive) {
          var elements = document.getElementById(
            `page-preview${self.pageActive}`
          );
          elements.classList.remove("activePagePreview");
          self.valueFocusPage = +attribute;
        }
        this.classList.add("activePagePreview");
        self.pageActive = +attribute;
      };

      setTimeout(() => {
        // Scroll file pdf Preview to top.
        const listPdf = document.getElementsByClassName("pdf-container");
        if (listPdf && listPdf.length > 0) listPdf[0].scrollTop = 0;
      }, 200);

      setTimeout(() => {
        for (var i = 1; i <= val; i++) {
          var element = document.getElementById(`page-preview${i}`);
          if (element) {
            if (i === 1) {
              element.classList.add("activePagePreview");
            }
            this.addTextPage(element, i);
            this.addIconSign(element, 0);
            this.loadFileSignPreview = true;
            element.addEventListener("click", onClickPdfPreviewPage);
          }
        }
        this.reloadIconSignPreview();
      }, 500);
    },

    // Reload icon ky khi change file PDF.
    reloadIconSignPreview() {
      var pageItems = [];
      this.itemsSign.map((item) => {
        pageItems.push(item.signature.page);
      });
      const group = _.groupBy(pageItems);
      this.pagesItemSign = group;
      this.reloadPagesItemSign();
    },

    getZoom() {
      let zoomPercent = this.zoom;
      zoomPercent = zoomPercent < 200 ? zoomPercent : 175;
      return `zoom: ${zoomPercent / 100}`;
    },

    changeZoom() {
      if (this.zoom === 25) {
        this.disabledZoomOut = true;
        this.disabledZoomIn = false;
      }
      if (this.zoom === 200) {
        this.disabledZoomIn = true;
        this.disabledZoomOut = false;
      }
      if (this.zoom > 25 && this.zoom < 200) {
        this.disabledZoomOut = false;
        this.disabledZoomIn = false;
      }
      this.scale = "" + this.zoom / 100;
      this.$refs.pdf.changeScale(this.scale);
    },

    // Chon anh ky
    onSelectSignature(idSignature) {
      if (!this.canSelectImageSign) {
        return;
      }
      this.currentSignatureId = idSignature;
      const itemSignature = this.imageSigns.find(
        (item) => +item.docNoteSignId === +idSignature
      );
      this.currentSignMethod = itemSignature.signType;
      this.setSignatureId(idSignature);
      this.showDialogSelectSignature = true;
    },

    // Chon chu ky so
    onSelecPinCA(idSignature) {
      if (!this.canSelectImageSign) {
        return;
      }
      this.currentSignatureId = idSignature;
      this.setSignatureId(idSignature);
      this.showDialogSelectPinCA = true;
    },
    zoomOut() {
      const currentIndexZoom = this.lstZoom.findIndex((z) => z === this.zoom);
      if (currentIndexZoom > 0) {
        this.zoom = this.lstZoom[currentIndexZoom - 1];
        this.scale = "" + this.zoom / 100;
        this.$refs.pdf.changeScale(this.scale);
        this.disabledZoomOut = false;
      } else {
        this.disabledZoomOut = true;
      }
      this.disabledZoomIn = false;
    },
    zoomIn() {
      const currentIndexZoom = this.lstZoom.findIndex((z) => z === this.zoom);
      if (currentIndexZoom < this.lstZoom.length - 1) {
        this.zoom = this.lstZoom[currentIndexZoom + 1];
        this.scale = "" + this.zoom / 100;
        this.$refs.pdf.changeScale(this.scale);
        this.disabledZoomIn = false;
      } else {
        this.disabledZoomIn = true;
      }
      this.disabledZoomOut = false;
    },

    resetRoom() {
      if (this.zoom !== 100) {
        this.zoom = 100;
        this.$refs.pdf.changeScale("1");
        this.disabledZoomOut = false;
        this.disabledZoomIn = false;
      }
    },
    // Di chuyen den chu ky
    moveToSignature(type) {
      this.resetRoom();
      const listSignature = document.querySelectorAll(".sign-item-added");
      // const totalSignature = listSignature.length - 1;
      if (type === 0) {
        this.visibleStartSign = false;

        this.valueFocusPage = this.lstPageSign[0];
        this.$refs.pdf.goToPage(this.lstPageSign[0]);
        setTimeout(() => {
          listSignature[0].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 200);
        this.indexNextSign = 0;
        return;
      }

      // Next den chan ky tiep theo.
      if (type === "next") {
        for (var i = this.valueFocusPage; i <= this.numPages - 1; i++) {
          if (this.listInitPageSign[i]) {
            this.valueFocusPage = this.listInitPageSign[i];
            break;
          }
        }

        var index = this.lstPageSign.findIndex(
          (x) => x === this.valueFocusPage
        );
        this.$refs.pdf.goToPage(this.valueFocusPage);
        setTimeout(() => {
          if (index > listSignature.length - 1) return;
          listSignature[index].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 200);
        return;
      }

      // Quay lai chan ky truoc.
      if (type === "prev") {
        for (var j = this.valueFocusPage - 2; j >= 0; j--) {
          if (this.listInitPageSign[j]) {
            this.valueFocusPage = this.listInitPageSign[j];
            break;
          }
        }

        var index2 = this.lstPageSign.findIndex(
          (x) => x === this.valueFocusPage
        );
        this.$refs.pdf.goToPage(this.valueFocusPage);
        setTimeout(() => {
          if (index > listSignature.length - 1) return;
          listSignature[index2].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 200);
        return;
      }

      // if (type === 0) {
      //   this.visibleStartSign = false;
      //   listSignature[0].scrollIntoView({
      //     behavior: "smooth",
      //     block: "center",
      //   });
      //   return;
      // }

      // if (type === "next") {
      //   this.focusSignature++;
      //   this.focusSignature =
      //     this.focusSignature >= totalSignature
      //       ? totalSignature
      //       : this.focusSignature;
      // } else {
      //   this.focusSignature--;
      //   this.focusSignature =
      //     this.focusSignature <= 0 ? 0 : this.focusSignature;
      // }
      // listSignature[this.focusSignature].scrollIntoView({
      //   behavior: "smooth",
      //   block: "center",
      // });
    },
    // ghi hoat dong -> xac nhan
    async saveNoteActive(params) {
      if (params) {
        this.showContractActionConfirm = true;
        this.contractActionConfirm = params;
      }
    },
    // Xac nhan doi nguoi ky chinh, doi nguoi xem xet
    async acceptChangeSigner(params) {
      try {
        const formData = {
          signUserType: this.signUserType,
          signProcessId: this.signProcessId,
          additionalSigner: params,
        };
        this.loading = true;
        const response = await ContractService.changeSigner(
          formData,
          this.contractId
        );
        this.loading = false;
        if (response.status === 200) {
          let message = "contract.messageSuccess.changeSigner";
          if (this.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
            message = "contract.messageSuccess.changeReviewer";
          }
          const typeAlert = "success";
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message),
          });
          setTimeout(() => {
            // this.$router.replace('/')
            this.goBackStep();
          }, 2000);
        }
      } catch (error) {
        this.getNotifyError(error);
        this.loading = false;
      }
    },
    // show popup doi nguoi ky
    showDialogChangeSign() {
      this.showDialogChangeSigner = true;
      this.getUsersByDocumentId();
    },
    // show popup doi nguoi xem xet
    showDialogChangeReview() {
      this.showDialogChangeReviewer = true;
      this.getUsersByDocumentId();
    },
    // show popup them nguoi xem xet
    showDialogAddReview() {
      this.showDialogAddReviewer = true;
      this.getUsersByDocumentId();
    },
    // show popup them nguoi ky nhay
    showDialogAddInitial() {
      this.showDialogAddInitialSign = true;
      this.getUsersByDocumentId();
    },

    // api load user trong he thong
    async getUsersByDocumentId() {
      try {
        if (!this.contractId) {
          return;
        }
        const param = {
          documentId: this.contractId,
          signProcessId: this.signProcessId,
        };
        const response = await ContractService.searchUserSigner(param);
        if (response.success) {
          this.listUsers = response.data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    // Lay thong tin hoat dong
    async getAdditionalSigner(contractId) {
      try {
        if (!contractId) {
          return;
        }
        const param = {
          documentId: contractId,
        };
        const response = await ContractService.getAdditionalSigner(param);
        if (response.success) {
          this.additionalSigners = response.data.additionalSigners;
          let note = response.data.assignerNote;
          if (note) {
            note = note.replace(/\n/g, "<br/>");
          }
          this.assignerNote = note;
        }
      } catch (error) {
        console.log(error);
      }
    },

    // Xac them ky nhay, them nguoi xem xet
    async acceptAddFlashesSign(params) {
      try {
        const formData = {
          documentId: this.contractId,
          additionalSigners: [params],
        };
        const response = await ContractService.additionalSigner(formData);
        if (response.data.status === 200) {
          let message = "contract.messageSuccess.addReviewer";
          if (params.signUserType === constants.SIGN_USER_TYPE.FLASHES) {
            message = "contract.messageSuccess.addFlashes";
          }
          await this.getNotifySucces(message);
          await this.initPage();
        }
      } catch (error) {
        this.getNotifyError(error);
      }
    },

    showButtonChange(params) {
      this.showDialogRemoveAdditional = true;
      this.paramsRemove = params;
      this.comfimRemove = "contract.label.comfimRemoveReviewer";
      if (params.signUserType === constants.SIGN_USER_TYPE.FLASHES) {
        this.comfimRemove = "contract.label.comfimRemoveFlashes";
      }
    },

    getNotifyError(error) {
      const typeAlert = "error";
      const message = error.message;
      this.setNotify({
        show: true,
        type: typeAlert,
        content: this.$t(message),
      });
    },

    getNotifySucces(message) {
      const typeAlert = "success";
      this.setNotify({
        show: true,
        type: typeAlert,
        content: this.$t(message),
      });
    },

    // Xac nhan xoa nguoi ky nhay, nguoi xem xet
    async removeAdditionalSigner() {
      try {
        const params = {
          contractId: this.paramsRemove.documentId,
          signProcessIds: [this.paramsRemove.signProcessId],
        };
        const response = await ContractService.removeAdditionalSigner(params);
        if (response.data.status === 200) {
          let message = "contract.messageSuccess.removeReviewer";
          if (
            this.paramsRemove.signUserType === constants.SIGN_USER_TYPE.FLASHES
          ) {
            message = "contract.messageSuccess.removeFlashes";
          }
          await this.getNotifySucces(message);
          await this.initPage();
        }
      } catch (error) {
        this.getNotifyError(error);
      }
    },

    // Xac nhan chu ky anh
    acceptSelectSignture(signatureImage) {
      this.visibleStartSign = false;
      const itemSignature = this.imageSigns.find(
        (item) => item.docNoteSignId === this.currentSignatureId
      );
      this.resetRoom();
      Object.assign(itemSignature, {
        ...signatureImage,
        signType: constants.SIGN_TYPES.IMAGE,
      });
      this.checkShowIntro();
    },

    // Xac nhan fake imgCA.
    async acceptFakeImgCA(obj) {
      this.waitingSubmit = true;
      this.visibleStartSign = false;
      const imgUpload = await this.uploadingImage({ file: obj.file });

      this.imageSigns.map((imgSign) => {
        imgSign["signType"] = constants.SIGN_TYPES.IMAGE;
        imgSign["dataImgSign"] = imgUpload["dataImgSign"];
        imgSign["filePath"] = imgUpload["filePath"];
        imgSign["fileName"] = imgUpload["fileName"];
        imgSign["storage"] = imgUpload["storage"];
        imgSign["fileSize"] = imgUpload["fileSize"];
        imgSign["fileType"] = imgUpload["fileType"];
      });
      this.waitingSubmit = false;
      this.checkShowIntro();
    },

    // Xac nhan chu ky so
    async acceptPinCA(obj) {
      this.visibleStartSign = false;
      var itemSignature = this.imageSigns.find(
        (item) => item.docNoteSignId === this.currentSignatureId
      );
      this.resetRoom();
      var metaData = obj.metaData;
      var provider = obj.provider;
      // Goi service lay anh chu ky
      Object.assign(itemSignature, { metaData }, { provider });
      await this.getImageCA(itemSignature);
      this.checkShowIntro();
    },

    async checkShowIntro() {
      if (await this.validateListImageSigns()) {
        this.showIntro();
      }
    },

    async getImageCA(itemSignCA) {
      const params = {
        signProvider: itemSignCA.provider,
        metadata: itemSignCA.metaData,
      };
      try {
        this.waitingSubmit = true;
        const response = await ContractService.getImageCA(params);
        if (response.status === 200) {
          itemSignCA["dataImgSign"] = `data:image/png;base64,${response.data}`;
          itemSignCA["signType"] = constants.SIGN_TYPES.CA;

          if (this.imageSigns.length > 1) {
            const fileImgCA = this.dataURLtoFile(
              itemSignCA["dataImgSign"],
              `${Date.now()}.png`
            );
            const imgUpload = await this.uploadingImage({ file: fileImgCA });

            this.imageSigns.map((imgSign) => {
              if (imgSign.docNoteSignId !== itemSignCA.docNoteSignId) {
                imgSign["signType"] = constants.SIGN_TYPES.IMAGE;
                imgSign["dataImgSign"] = imgUpload["dataImgSign"];
                imgSign["filePath"] = imgUpload["filePath"];
                imgSign["fileName"] = imgUpload["fileName"];
                imgSign["storage"] = imgUpload["storage"];
                imgSign["fileSize"] = imgUpload["fileSize"];
                imgSign["fileType"] = imgUpload["fileType"];
              }
            });
          }
        } else {
          this.setNotify({
            show: true,
            type: "error",
            content: response.message,
          });
          this.resetDataImage(itemSignCA);
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: error.message,
        });
        this.resetDataImage(itemSignCA);
      } finally {
        this.waitingSubmit = false;
      }
    },

    resetDataImage(currentImgSign) {
      currentImgSign["dataImgSign"] = null;
      if (this.imageSigns.length > 1) {
        this.imageSigns.map((imgSign) => {
          if (imgSign.docNoteSignId !== currentImgSign.docNoteSignId) {
            imgSign["dataImgSign"] = null;
            imgSign["filePath"] = null;
            imgSign["fileName"] = null;
            imgSign["storage"] = null;
            imgSign["fileSize"] = null;
            imgSign["fileType"] = null;
          }
        });
      }
    },

    // Upload anh vs tai anh
    async uploadingImage({ file }) {
      var formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", constants.FILE_TYPES.FILE_IMAGE_SIGNATURE);
      try {
        const response = await FileService.upload(formData, false);
        if (response.success) {
          const { data } = response;
          const dataImgSign = await FileService.download(
            {
              ...data,
            },
            file.type
          );
          return {
            ...data,
            dataImgSign,
          };
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    },

    // Validate list signature
    async validateListImageSigns() {
      var isValid = true;
      if (this.canSelectImageSign) {
        this.imageSigns.map((img) => {
          // if (!img.dataImgSign && img.signType === constants.SIGN_TYPES.IMAGE) {
          //   isValid = false
          // }
          // if (!img.pinCA && img.signType === constants.SIGN_TYPES.CA) {
          //   isValid = false
          // }
          if (!img.dataImgSign) {
            isValid = false;
          }
        });
      } else {
        if (this.imageSigns.length > 0) {
          this.imageSigns.map((img) => {
            if (!img.pinCA && img.signType === constants.SIGN_TYPES.CA) {
              isValid = false;
            }
          });
        }
      }
      return isValid;
    },

    async validateSignatureImage() {
      // Validate da du chu ky hay chua
      const isValid = await this.validateListImageSigns();
      if (!isValid) {
        const typeAlert = "error";
        const message = "contract.missSignSignature";
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message),
        });
      }
      return isValid;
    },

    async onShowDialogConfirmSign() {
      const isValid = await this.validateSignatureImage();
      this.showDialogConfirmSign = isValid;
    },

    // Submit ky
    async submitSign(comment) {
      // Validate da du chu ky hay chua
      const isValid = this.validateSignatureImage();
      if (!isValid) {
        return;
      }
      this.waitingSubmit = true;
      // Ky hop dong
      const data = {};
      data["processStatus"] = constants.SIGN_PROCCESS_STATUS.PROCESSED;
      if (this.canSelectImageSign) {
        data["signaturesData"] = this.imageSigns;
      }

      if (comment) {
        data["comment"] = comment.trim();
      }
      try {
        const response = await ContractService.signContract(
          data,
          this.contractId
        );

        if (response.success) {
          const typeAlert = "success";
          const message = this.messageSignSuccess;
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message),
          });
          this.goBackStep();
        }
      } catch (e) {
        const typeAlert = "error";
        const message = e.message;
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message),
        });
      } finally {
        this.waitingSubmit = false;
      }
    },

    // Submit tu choi ky
    async submitReject(comment) {
      const data = {};
      data["processStatus"] = constants.SIGN_PROCCESS_STATUS.REJECTED;
      data["comment"] = comment.trim();
      try {
        this.loading = true;

        const response = await ContractService.signContract(
          data,
          this.contractId
        );
        this.loading = false;
        if (response.success) {
          const typeAlert = "success";
          const message = this.messageRejectSuccess;
          this.setNotify({
            show: true,
            type: typeAlert,
            content: message,
          });
          this.goBackStep();
        }
      } catch (e) {
        const typeAlert = "error";
        const message = e.message;
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message),
        });
      } finally {
        this.waitingSubmit = false;
      }
    },

    // Submit xem xet
    async submitReview(comment) {
      const data = {};
      data["processStatus"] = constants.SIGN_PROCCESS_STATUS.PROCESSED;
      data["comment"] = comment.trim();
      try {
        const response = await ContractService.signContract(
          data,
          this.contractId
        );

        if (response.success) {
          const typeAlert = "success";
          const message = "contract.reviewContractSuccess";
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message),
          });
          this.goBackStep();
        }
      } catch (e) {
        const typeAlert = "error";
        const message = e.message;
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message),
        });
      } finally {
        this.waitingSubmit = false;
      }
    },

    // Quay lai
    backSign() {
      // window.history.back()
      // this.$router.replace('/')
      this.goBackStep();
    },

    backAction() {
      if (this.permissions.length) {
        this.showDialogBack = true;
      } else {
        this.goBackStep();
      }
    },

    async downloadFile() {
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);

      downloadLink.href = this.fileSign;
      downloadLink.target = "_self";
      downloadLink.download = "fileSign.pdf";
      downloadLink.click();
    },
  },
};
</script>

<style lang="scss" src="./SignContract.scss"></style>

<style lang="scss">

.responsive-button-sign{
  @media(max-width: 500px){
    button{
      width: 100px!important;
    }
  }
}
.v-list .v-list-item {
  padding: 0 10px !important;
}
.introjs-helperNumberLayer {
  display: none;
}
.introjs-tooltip {
  border-radius: 8px;
  padding: 20px;
  .introjs-tooltiptext {
    color: #f44336;
  }
  .introjs-bullets,
  .introjs-tooltipbuttons {
    display: none !important;
  }
}
.tool__nav {
  .v-btn__content {
    i {
      color: #8e8ea1;
    }
  }
}
.menu-zoom {
  .v-list-item {
    font-size: 14px !important;
  }
  .v-sheet.v-list {
    border-radius: 8px !important;
  }
}
</style>
