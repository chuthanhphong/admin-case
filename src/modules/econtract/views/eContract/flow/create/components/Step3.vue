<template>
  <div>
    <div class="main__tool">
      <div class="tool__header">
        <div class="file-name">
          <span v-if="fileContract">{{ fileContract.fileName }}</span>
        </div>
      </div>

      <div class="tool">
        <!-- File PDF preview -->
        <div class="tool__preview">
          <bsd-pdf
            v-if="src"
            id="pdf-preview"
            ref="pdfPreview"
            prefix-render-id="page-preview"
            :file-path="src"
            :force-render="forceRender"
            :show-nav="false"
            scale="0.1"
            @on-success="loadPreviewSuccess"
            @on-pagerender="loadSignFilePreview"
          />
        </div>

        <div id="workArea" ref="workArea" class="tool__workarea">
          <bsd-pdf
            v-if="src"
            ref="pdf"
            prefix-render-id="page-content"
            :file-path="src"
            :show-nav="false"
            :force-render="forceRender"
            @on-scroll="onScollFile"
            @on-success="loadPdfSuccess"
            @on-pagerender="loadSignaturePage"
          />
        </div>

        <div id="sidebar" class="tool__sidebar">
          <TabsSign
            :items-sign="itemsSign"
            :dialog-select-signer="dialogSelectSigner"
            @toggle-dialog-select-singer="toggleDialogSelectSigner"
            @toggle-dialog-select-singer-ca="toggleDialogSelectSignerCA"
          />
          <div class="text-center">
            <v-btn
              v-if="itemsSign.length > 0"
              class="my-2 py-5 btn-remove-all-signature text--button"
              rounded
              color="primary"
              @click="clearAllSignature"
            >
              {{ $t("contract.label.removeAllItemSign") }}
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Dialog chon nguoi ky anh -->
      <DialogSelectSigner
        :indexs-person-sign="indexsPersonSign"
        :list-person-sign="listPersonSign"
        :message-required="messageRequired"
        :show-dialog="dialogSelectSigner"
        @accept-personal-sign="acceptPersonalSign"
        @update-list-index-personal-sign="updateListIndexPersonalSign"
        @close-dialog="dialogSelectSigner = false"
      />
      <!-- Dialog chon nguoi ky so -->
      <DialogSelectSigner
        :indexs-person-sign="indexsPersonSign"
        :list-person-sign="listPersonSign"
        :message-required="messageRequired"
        :show-dialog="dialogSelectSignerCA"
        :check-signature="true"
        :items-sign="itemsSign"
        @accept-personal-sign="acceptPersonalSignCA"
        @update-list-index-personal-sign="updateListIndexPersonalSign"
        @close-dialog="dialogSelectSignerCA = false"
      />
      <!-- Dialog dat lai -->
      <DialogConfigSignature
        :show-dialog="dialogEditSignature"
        :signer-edit="signerEdit"
        :list-select-page-sign="listSelectPageSign"
        :max-page="numPages"
        @close-dialog="dialogEditSignature = false"
        @add-select-page-sign="addSelectPageSign"
        @accept-edit-signature="acceptEditSignature"
        @update-option-copy-signature="updateOptionCopySignature"
      />
    </div>

    <!-- Button bottom -->
    <div class="d-flex justify-end align-center">
      <v-btn
        class="my-2 w-150 py-5 mr-10 text--button"
        color="#0FAFE4"
        outlined
        rounded
        @click="showDialogCancel"
      >
        <span class="text-primary"> {{ $t("cancelLabel") }}</span>
      </v-btn>

      <v-btn
        class="my-2 w-150 py-5 mr-10 text--button"
        color="#0FAFE4"
        outlined
        rounded
        @click="prevStep"
      >
        <span class="text-primary"> {{ $t("contract.back") }}</span>
      </v-btn>

      <v-btn
        class="my-2 w-150 py-5 text--button"
        rounded
        color="primary"
        @click="nextStep"
      >
        {{ $t("contract.continue") }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import i18n from "@/i18n";
import bsdPdf from "bsd-pdf";
import TextPagePdf from "@/modules/econtract/views/eContract/contract/create-contract/components/TextPagePdf";
import IconSign from "@/modules/econtract/views/eContract/contract/create-contract/components/IconSign";
import { mapState, mapActions } from "vuex";
import TypeSignature from "./TypeSignature";
import constants from "@/constants";
import { randomId } from "@/core/utils";
import _ from "lodash";
// import RangPage from './RangPage.vue'
import DialogConfigSignature from "./DialogConfigSignature.vue";
import DialogSelectSigner from "./DialogSelectSigner.vue";
import TabsSign from "./TabsSign.vue";

export default {
  name: "Step3",

  components: {
    bsdPdf,
    DialogConfigSignature,
    DialogSelectSigner,
    TabsSign,
  },
  props: {
    fileContract: { type: Object, default: undefined }, // File hop dong
    fileAttachs: { type: Array, default: undefined }, // File dinh kem
  },

  data() {
    return {
      indexsPersonSign: null, // Index nguoi dc chon ky
      src: "",
      numPages: null,
      currentPage: 1,
      pageActive: 1,
      itemsSign: [], // Danh sach chan chu ky dc add
      tabSign: 0, // tabSign: Ky Anh, Ky So
      dialogSelectSigner: false, // Flag popup chon nguoi ky anh
      dialogSelectSignerCA: false, // Flag popup chon nguoi ky so
      messageRequired: "", // Message thong bao loi
      dialogEditSignature: false, // Flag hien thi dialog dat lai chu ky
      signerEdit: null, // Nguoi dc edit chu ky
      optionsCopy: constants.OPTIONS_COPY_SIGNATURE,
      optionCopySignature: constants.OPTIONS_COPY_SIGNATURE.ALL_PAGE,
      listSelectPageSign: [{ start: 1, end: 1 }],
      pagesItemSign: [],
      signType: constants.SIGN_TYPES.IMAGE,
      countSignature: 0,

      pagePreviewTooltips: [],
      forceRender: false,
      loadFileSignPreview: false, // Check load file pdf preview success.
    };
  },
  computed: {
    ...mapState("contract", [
      "listSigner",
      "resetSignatures",
      "allowLoadFileSign",
    ]),

    // Loc danh sach nguoi ky
    listPersonSign() {
      const list = [];
      if (!this.listSigner) return [];

      // Chi lay danh sach nguoi ky
      this.listSigner.map((group) => {
        group.data.signers.map((signer) => {
          if (signer.email !== "") list.push({ ...signer });
        });
      });
      return list;
    },
  },

  watch: {
    // Hien thi file hop dong khi co thay doi
    async fileContract() {
      if (!this.fileContract && !this.fileContract.url) return;

      // Reset lai list chan ky.
      this.clearAllSignature();
    },

    tabSign(index) {
      this.signType =
        index === 0 ? constants.SIGN_TYPES.IMAGE : constants.SIGN_TYPES.CA;
    },

    // reset lai chan ky
    resetSignatures() {
      if (this.resetSignatures) {
        this.setCoordination(true);
        this.clearAllSignature();
        this.setResetSignatures(false);
      }
    },

    // Hien thi thong bao co item ky cho page review
    itemsSign() {
      this.reloadIconSignPreview();
    },

    pagesItemSign() {
      this.reloadPagesItemSign();
    },

    allowLoadFileSign() {
      if (!this.fileContract && !this.fileContract.url) return;

      if (this.allowLoadFileSign) {
        this.src = this.fileContract.url;
        this.setAllowLoadFileSign(false);
      }
    },
  },

  methods: {
    ...mapActions("contract", [
      "setItemsSign",
      "setAllowLoadFileSign",
      "setResetSignatures",
      "setCoordination",
    ]),

    clearAllSignature() {
      if (this.itemsSign.length > 0) {
        this.itemsSign.map((item) => {
          if (item.$el) item.$el.remove();
        });
      }
      this.itemsSign = [];
      this.countSignature = 0;
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

    // Check load file PDF main success.
    loadPdfSuccess(val) {},

    // Reload icon ky khi change file PDF.
    reloadIconSignPreview() {
      var pageItems = [];
      this.itemsSign.map((item) => {
        pageItems.push(item.signer.page);
      });
      const group = _.groupBy(pageItems);
      this.pagesItemSign = group;
      this.reloadPagesItemSign();
    },

    // Reload tooltip icon sign.
    reloadPagesItemSign() {
      this.pagePreviewTooltips.map((tooltip, page) => {
        var itemSign = this.pagesItemSign[page + 1];
        tooltip.numSign = itemSign ? itemSign.length : 0;
      });
    },

    // Load chan ky khi page pdf load success.
    loadSignaturePage(pageLoaded) {
      var instances = this.itemsSign.filter(
        (item) => item.signer.page === pageLoaded
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

    // Scroll file pdf
    onScollFile(currentPage) {
      this.currentPage = currentPage;
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

    updateOptionCopySignature(option) {
      this.optionCopySignature = option;
    },

    // Chon nguoi ky
    updateListIndexPersonalSign(list) {
      this.indexsPersonSign = list;
    },

    // Xac nhan chon nguoi ky anh
    acceptPersonalSign() {
      if (
        !this.indexsPersonSign ||
        (this.indexsPersonSign && this.indexsPersonSign.length === 0)
      ) {
        this.messageRequired = this.$t("contract.mustSelectSigner");
        return;
      }
      this.messageRequired = "";
      const signers = [];
      // Lay danh sach nguoi dc chon
      this.indexsPersonSign.map((index) => {
        signers.push({
          ...this.listPersonSign[index],
          signType: constants.SIGN_TYPES.IMAGE,
        });
      });
      signers.map((signer) => {
        this.addItemSign2(
          "img-sign",
          signer,
          this.currentPage,
          null,
          null,
          true
        );
      });
      // Tat popup chon nguoi ky
      this.dialogSelectSigner = false;
      // Reset danh sach chon nguoi ky
      this.indexsPersonSign = null;
    },

    // Xac nhan chon nguoi ky so
    acceptPersonalSignCA() {
      const signers = [];
      // Lay danh sach nguoi dc chon
      if (this.indexsPersonSign) {
        this.indexsPersonSign.map((index) => {
          signers.push({
            ...this.listPersonSign[index],
            signType: constants.SIGN_TYPES.CA,
          });
        });
        signers.map((signer) => {
          this.addItemSign2(
            "img-sign",
            signer,
            this.currentPage,
            null,
            null,
            true
          );
        });
      }

      // Tat popup chon nguoi ky so
      this.dialogSelectSignerCA = false;
      // Reset danh sach chon nguoi ky
      this.indexsPersonSign = null;
    },

    addItemSign2(type, signer, pageContain, x, y, scrollToSignature) {
      var TyppeSignatureEl = Vue.extend(TypeSignature);
      var pageSign = this.$refs.workArea.querySelector(
        `#page-content${pageContain}`
      );
      var dataLoaded = pageSign.getAttribute("data-loaded");
      if (this.countSignature >= 16) this.countSignature = 0;

      const marginItemSign = 20 * this.countSignature;
      x = x || pageSign.clientWidth / 2 + marginItemSign - 80;
      y = y || -215;
      this.countSignature++;
      if (x >= 640) x = 640;
      if (y >= -78) y = -78;
      signer.x = x;
      signer.y = y;
      // signer.signType = this.signType
      signer.page = pageContain;
      const id = randomId();
      var instance = new TyppeSignatureEl({
        i18n,
        propsData: {
          type: type,
          id: id,
          w: 100,
          h: 60,
          itemIndex: this.itemsSign.length,
          signer: signer,
        },
        methods: {
          removeItemSign: this.removeItemSign,
          editSignature: this.editSignature,
        },
      });
      this.itemsSign.push(instance);
      if (dataLoaded) {
        instance.$mount();
        pageSign.appendChild(instance.$el);
      }

      if (scrollToSignature) {
        instance.$el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },

    // Xoa chan chu ky
    removeItemSign(id) {
      try {
        const index = this.itemsSign.findIndex((i) => i.id === id);
        this.itemsSign[index].$el.remove();
        this.itemsSign.splice(index, 1);
      } catch (error) {
        console.log(error);
      }
    },

    // Hien thi popup dat lai chu ky
    editSignature(id) {
      const indexSigner = this.itemsSign.findIndex((item) => item.id === id);
      const signer = this.itemsSign[indexSigner].signer;
      this.signerEdit = { ...signer };
      this.dialogEditSignature = true;
    },

    // Chuyen sang buoc 4
    nextStep() {
      if (this.validateAllSignature()) {
        this.setItemsSign(this.itemsSign);
        this.$emit("next-step", 4);
      }
    },

    // Quay lai buoc 2
    prevStep() {
      this.$emit("next-step", 2);
    },

    // Them moi item chu ky cho cac trang
    addSelectPageSign() {
      this.listSelectPageSign.push({ start: 1, end: 1 });
    },

    // Xac nhan dat lai chu ky
    acceptEditSignature() {
      this.dialogEditSignature = false;
      this.signerEdit.clone = true;

      // Copy chu ky cho tat ca cac trang
      if (this.optionCopySignature === this.optionsCopy.ALL_PAGE) {
        for (let page = 1; page <= this.numPages; page++) {
          if (page !== this.signerEdit.page) {
            const newSigner = { ...this.signerEdit };
            this.addItemSign2(
              "img-sign",
              newSigner,
              page,
              newSigner.x,
              newSigner.y,
              false
            );
          }
        }
      } else {
        var listRange = [];
        this.listSelectPageSign.map((range) => {
          for (let i = range.start; i <= range.end; i++) {
            listRange.push(i);
          }
        });

        listRange = listRange.sort((a, b) => a - b);
        const uniqueRange = new Set();
        listRange.map((r) => uniqueRange.add(r));
        listRange = Array.from(uniqueRange);
        for (const page of listRange) {
          if (page !== this.signerEdit.page) {
            const newSigner = { ...this.signerEdit };
            this.addItemSign2(
              "img-sign",
              newSigner,
              page,
              newSigner.x,
              newSigner.y,
              false
            );
          }
        }
      }
      // Reset lai list page
      this.listSelectPageSign = [{ start: 1, end: 1 }];
      this.optionsCopy = constants.OPTIONS_COPY_SIGNATURE;
    },

    // Hien thi so luong chan ky tren moi trang
    showCountSignaturePreview(index) {
      return this.pagesItemSign[index] != null;
    },

    toggleDialogSelectSigner(value) {
      this.dialogSelectSigner = value;
    },

    toggleDialogSelectSignerCA(value) {
      this.dialogSelectSignerCA = value;
    },

    // Hien thi dialog huy
    showDialogCancel() {
      this.$emit("show-cancel");
    },

    // Kiem tra danh sach nguoi ky da co chan ky hay chua
    validateAllSignature() {
      var listUserInvalid = [];
      this.listPersonSign.map((person) => {
        const hasSignarue = this.itemsSign.some(
          (item) => item.signer.userId === person.userId
        );
        if (!hasSignarue) listUserInvalid.push(person.name);
      });
      if (listUserInvalid.length > 0) {
        this.isShowAlert = true;
        const msgUserInvalid = listUserInvalid.map(
          (u) => `<li><b>${u}</b> ${this.$t("contract.missSignature")}</li>`
        );
        const message = `<ul>${msgUserInvalid.join("")}</ul>`;
        const typeAlert = "error";
        const showIcon = false;
        this.$emit("show-alert", { message, typeAlert, showIcon });
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss"></style>
