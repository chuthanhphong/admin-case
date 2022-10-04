<template>
  <v-fade-transition>
    <div v-if="showDialog" class="wrap-sign-doc">
      <v-card class="signDocument">
        <div class="wrap-card">
          <!-- Title document -->
          <v-row class="ma-0 justify-space-between flex-nowrap wrap-title">
            <v-tooltip content-class="tooltip-bottom" bottom max-width="50%">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" class="title-doc" v-on="on">
                  {{ customDocumentTitle(documentTitle) }}
                </span>
              </template>
              <span>{{ documentTitle }}</span>
            </v-tooltip>

            <v-btn icon class="icon-close-sign" @click="hideDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>

          <!-- Body -->
          <div class="main__tool">
            <div class="tool__header">
              <!-- Select file pdf -->
              <div class="file-name-document">
                <div
                  v-if="listFileDocument.length > 1"
                  class="tooltip-select-file select-file"
                >
                  <v-select
                    id="mySelect"
                    v-model="fileDocument"
                    background-color="white"
                    :items="listFileDocument"
                    item-text="fileName"
                    item-value="id"
                    return-object
                    outlined
                    dense
                    attach
                    hide-details
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      contentClass: 'menu-select-files',
                    }"
                    @change="onchangeFilePdf(fileDocument.id)"
                  >
                    <!-- Icon v-select -->
                    <template v-slot:append>
                      <div class="v-input__icon v-input__icon--append">
                        <v-icon class="icon-color">mdi-chevron-down</v-icon>
                      </div>
                    </template>

                    <!-- Item show -->
                    <template slot="selection" slot-scope="data">
                      <span class="text-select-file">
                        {{ data.item.fileOrder + 1 }}.
                        {{ customFileName2(data.item.fileName) }}
                      </span>
                    </template>

                    <!-- List Item -->
                    <template slot="item" slot-scope="data">
                      <v-tooltip right content-class="tooltip-right">
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" class="wrap-item-file" v-on="on">
                            {{ data.item.fileOrder + 1 }}.
                            {{ customFileName2(data.item.fileName) }}
                          </div>
                        </template>
                        <span>{{ data.item.fileName }}</span>
                      </v-tooltip>
                    </template>
                  </v-select>
                </div>

                <TooltipFileDocument
                  v-else
                  :file-name="fileDocument.fileName"
                />
              </div>

              <!-- Zoom file pdf -->
              <div class="tool__nav">
                <v-btn
                  fab
                  elevation="1"
                  color="white"
                  :class="
                    (disabledZoomOut && 'icon-color-disable') || 'icon-color'
                  "
                  @click="zoomOut"
                >
                  <v-icon>mdi-minus-circle-outline</v-icon>
                </v-btn>

                <v-select
                  v-model="zoom"
                  :items="lstZoom"
                  background-color="white"
                  dense
                  outlined
                  hide-details
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    contentClass: 'menu-select-zoom',
                  }"
                  class="zoom-input mx-3"
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
                  fab
                  elevation="1"
                  color="white"
                  :class="
                    (disabledZoomIn && 'icon-color-disable') || 'icon-color'
                  "
                  @click="zoomIn"
                >
                  <v-icon>mdi-plus-circle-outline</v-icon>
                </v-btn>
              </div>

              <!-- icon draw/comment -->
              <div class="icon-draw-comment" />
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
                  scale="0.11"
                  @on-success="loadPreviewSuccess"
                  @on-pagerender="loadSignFilePreview"
                />
              </div>

              <!-- File PDF view -->
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

              <div class="tool__sidebar" />
            </div>
          </div>

          <!-- Button bottom -->
          <div class="d-flex bottom-btn-sign justify-center">
            <v-btn
              class="btn-close"
              color="primary"
              outlined
              rounded
              @click="hideDialog"
            >
              <span class="text-btn"> {{ $t("close") }}</span>
            </v-btn>
            <v-btn
              v-if="showTransfer"
              class="btn-sign"
              color="white"
              outlined
              rounded
              @click="showConfirmDialogTransfer = true"
            >
              <span class="text-btn">
                {{ $t("managementDoc.transfer.transferAction") }}
              </span>
            </v-btn>
          </div>
        </div>

        <base-preload :dialog="loading" />
      </v-card>
      <DialogTransfer
        :show-dialog="showConfirmDialogTransfer"
        :doc-item="docItem"
        @close-dialog="showConfirmDialogTransfer = false"
      />
    </div>
  </v-fade-transition>
</template>

<script>
import Vue from "vue";
import i18n from "@/i18n";
import bsdPdf from "bsd-pdf";
import constants from "@/constants";
import { DocumentService } from "@/modules/edocument/services/documentService";
import TooltipFileDocument from "@/modules/edocument/views/document/management/file/components/TooltipFileDocument";
import customsFile from "@/modules/edocument/mixins/customsFile";
import TextPagePdf from "@/modules/edocument/views/document/management/file/components/TextPagePdf";
import DialogTransfer from "@/modules/edocument/views/document/management/components/DialogTransfer";
import { mapActions } from "vuex";

function initialData() {
  return {
    fileDocument: {
      fileName: "",
    },
    listFileDocument: [],
    documentTitle: "", // Ten van ban trinh ky
    disabledZoomIn: false,
    disabledZoomOut: false,
    zoom: 100,
    scale: "1",
    lstZoom: [25, 33, 50, 67, 75, 100, 110, 125, 150, 175, 200],
    visibleStartSign: true,
    // filePDF
    src: "",
    numPages: null,
    currentPage: 1,
    pageActive: 1,
    forceRender: false,
    loading: false,
    loadFileSignPreview: false, // Check load file pdf preview success.
    pagePreviewTooltips: [],
    showLoadingChangeFile: false,
    // Handle page
    firstFocusPage: 1,
    valueFocusPage: 1,
    endFocusPage: 1,
    isSignDoc: false,
    showConfirmDialogTransfer: false,
    docItem: null,
    listActions: [],
  };
}

export default {
  name: "SignDocument",
  components: {
    bsdPdf,
    TooltipFileDocument,
    DialogTransfer,
  },
  mixins: [customsFile],
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    documentId: {
      type: Number,
      default: 0,
    },
    indexOpenFileDoc: {
      type: Number,
      default: 0,
    },
    isDashboard: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return initialData();
  },
  computed: {
    showTransfer() {
      const lstApprove = constants.LIST_ACTIONS_DETAIL.TRANSFER;
      var show = false;
      if (this.listActions && this.listActions.includes(lstApprove)) {
        show = true;
      }
      return show;
    },
  },
  watch: {
    async showDialog() {
      if (this.showDialog) {
        this.initDataDocument();
      }
    },
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    // check true la ky chinh, false la ky nhay
    checkSignerOrFlasher() {
      let check = true;
      if (
        this.listActions &&
        this.listActions.includes(constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN)
      ) {
        check = false;
      }
      return check;
    },

    resetData() {
      Object.assign(this.$data, initialData());
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

    async initDataDocument() {
      try {
        setTimeout(() => {
          this.loading = true;
        }, 100);
        await DocumentService.updateReadDoc(this.documentId);
        const { data } = await DocumentService.getDetailDocument(
          this.documentId
        );
        this.docItem = { ...data };
        this.documentTitle = data.documentTitle;
        this.listFileDocument = data.fileMainSigns;

        this.listActions = data.showIcons;
        this.createEventScrollListIconFileSign();

        if (this.listFileDocument && this.listFileDocument.length > 0) {
          await this.downloadFileDocument();
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: this.$t(error.message),
        });
      } finally {
        this.loading = false;
      }
    },

    showMess(error, type) {
      this.setNotify({
        show: true,
        type: type,
        content: error,
      });
    },

    // create event scroll list icon file sign.
    createEventScrollListIconFileSign() {
      const ele = document.getElementById("listIconFileSign");
      if (ele) {
        ele.style.cursor = "pointer";

        let pos = { top: 0, left: 0, x: 0, y: 0 };

        const mouseDownHandler = function(e) {
          ele.style.cursor = "grabbing";
          ele.style.userSelect = "none";

          pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
          };

          document.addEventListener("mousemove", mouseMoveHandler);
          document.addEventListener("mouseup", mouseUpHandler);
        };

        const mouseMoveHandler = function(e) {
          // How far the mouse has been moved
          const dx = e.clientX - pos.x;
          const dy = e.clientY - pos.y;

          // Scroll the element
          ele.scrollTop = pos.top - dy;
          ele.scrollLeft = pos.left - dx;
        };

        const mouseUpHandler = function() {
          ele.style.cursor = "pointer";
          ele.style.removeProperty("user-select");

          document.removeEventListener("mousemove", mouseMoveHandler);
          document.removeEventListener("mouseup", mouseUpHandler);
        };

        // Attach the handler
        ele.addEventListener("mousedown", mouseDownHandler);
      }
    },

    // download url file document
    async downloadFileDocument() {
      var urlFileOpenFirst = await DocumentService.viewDocumentInfo(
        this.listFileDocument[this.indexOpenFileDoc].id
      );
      this.listFileDocument[this.indexOpenFileDoc].url = urlFileOpenFirst.data;
      this.fileDocument = this.listFileDocument[this.indexOpenFileDoc];
      this.src = "data:application/pdf;base64," + this.fileDocument.url;

      for (const file of this.listFileDocument) {
        if (!file.url) {
          var urlFile = await DocumentService.viewDocumentInfo(file.id);

          file.url = urlFile.data;
          if (this.showLoadingChangeFile && file.id === this.fileDocument.id) {
            this.loading = false;
            this.showLoadingChangeFile = false;
            this.changeFilePdfWithUrl(file.id);
          }
        }
      }
    },

    // Change file pdf
    onchangeFilePdf(id) {
      if (!this.fileDocument.url) {
        this.loading = true;
        this.showLoadingChangeFile = true;
      } else {
        this.changeFilePdfWithUrl(id);
      }
    },

    // Change file pdf when url exist
    changeFilePdfWithUrl(id) {
      this.forceRender = false;
      this.loadFileSignPreview = false;
      this.src = null;
      this.resetRoom();

      setTimeout(() => {
        this.forceRender = true;
        this.src = "data:application/pdf;base64," + this.fileDocument.url;
      }, 100);
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
            this.loadFileSignPreview = true;
            element.addEventListener("click", onClickPdfPreviewPage);
          }
        }
      }, 500);
    },

    // Check load file PDF main success.
    loadPdfSuccess(val) {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },

    // Load chan ky khi page pdf load success.
    loadSignaturePage(pageLoaded) {},

    loadSignFilePreview(pageLoaded) {
      if (this.pagePreviewTooltips && this.loadFileSignPreview) {
        var element = document.getElementById(`page-preview${pageLoaded}`);
        this.addTextPage(element, pageLoaded);
      }
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

    getZoom() {
      let zoomPercent = this.zoom;
      zoomPercent = zoomPercent < 200 ? zoomPercent : 175;
      return `zoom: ${zoomPercent / 100}`;
    },

    hideDialog() {
      this.showDialogBack = true;
      this.goBackToList();
    },

    backAcceptDialog() {
      this.$emit("close-dialog", this.isSignDoc);
      this.resetData();
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

    goBackToList() {
      this.$emit("close-dialog", true);
      this.resetData();
    },
  },
};
</script>

<style lang="scss" src="./ViewFile.scss" />
