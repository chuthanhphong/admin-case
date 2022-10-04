<template>
  <v-fade-transition>
    <div v-if="showDialog" class="esignature-wrap-sign esignature-font">
      <v-card class="signDocument">
        <div class="wrap-card custom-file-pdf">
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
              <div class="esignature-file-name">
                <div
                  v-if="listFileDocument.length > 1"
                  class="tooltip-select-file select-file"
                >
                  <v-select
                    id="mySelect"
                    v-model="fileDocument"
                    background-color="white"
                    :items="listFileDocument"
                    :item-text="(item) => item.fileName"
                    item-value="id"
                    return-object
                    outlined
                    dense
                    attach
                    hide-details
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      contentClass: 'menu-select-files'
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
                      <span
                        class="text-select-file"
                      >{{ data.item.fileOrder + 1 }}.{{
                        customFileName2(data.item.fileName)
                      }}</span>
                    </template>

                    <!-- List Item -->
                    <template slot="item" slot-scope="data">
                      <v-tooltip right content-class="tooltip-right">
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" class="wrap-item-file" v-on="on">
                            <div
                              class="item-select-file"
                              :class="getClassItemSign(data)"
                            >
                              <p>{{ data.item.fileOrder + 1 }}</p>
                            </div>
                            {{ customFileName2(data.item.fileName) }}
                            <img
                              v-if="
                                data.item.exist.length > 0 && data.item.isSign
                              "
                              src="@/assets/icons/ic_signature.png"
                              alt="Sign"
                              width="18"
                              height="18"
                              class="margin-icon-sign"
                            >
                            <img
                              v-if="
                                data.item.exist.length > 0 && !data.item.isSign
                              "
                              src="@/assets/icons/ic_no_signature.png"
                              alt="Sign"
                              width="18"
                              height="18"
                              class="margin-icon-sign"
                            >
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

              <!-- List icon file sign -->
              <div id="listIconFileSign" class="wrap-list-file-sign">
                <div
                  v-if="
                    showListIconSign &&
                      listFileDocument.length > 0 &&
                      showActionSign
                  "
                  class="list-icon-file-sign d-flex"
                >
                  <div v-for="item in listFileDocument" :key="item.id">
                    <div
                      v-if="item.exist && item.exist.length > 0"
                      class="item-list-icon"
                      :class="getClassItemSign2(item)"
                      @click="onchangeFileClickIcon(item)"
                    >
                      {{ item.fileOrder + 1 }}
                    </div>
                  </div>
                </div>
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
                    contentClass: 'menu-select-zoom'
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

              <!-- Chu thich icon sign -->
              <v-spacer />
              <div
                v-if="itemsSign.length >= 1 && showActionSign"
                class="guideline-icon-sign"
              >
                <div class="ic-no-sign mr-1" />
                <span class="mr-3">{{ $t('document.noSign') }}</span>
                <div class="ic-sign mr-1" />
                {{ $t('document.alreadySigned') }}
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

                <!-- Bat dau ky -->
                <div
                  v-if="canSelectImageSign && listSignByDoc.length > 0"
                  class="nav-signature-items"
                >
                  <v-btn
                    v-if="visibleStartSign"
                    small
                    outlined
                    color="primary"
                    @click="moveToSignature(1)"
                  >
                    {{ $t('document.label.startSign') }}
                  </v-btn>

                  <v-tooltip left content-class="tooltip-left">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :disabled="valueFocusPage <= firstFocusPage"
                        v-bind="attrs"
                        icon
                        fab
                        small
                        outlined
                        color="primary"
                        v-on="on"
                        @click="moveToSignature('prev')"
                      >
                        <v-icon>mdi-chevron-up</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('document.tooltip.prevSignature') }}</span>
                  </v-tooltip>

                  <v-tooltip left content-class="tooltip-left">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        outlined
                        small
                        v-bind="attrs"
                        icon
                        fab
                        :disabled="valueFocusPage >= endFocusPage"
                        color="primary"
                        @click="moveToSignature('next')"
                        v-on="on"
                      >
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('document.tooltip.nextSignature') }}</span>
                  </v-tooltip>
                </div>
              </div>

              <div class="tool__sidebar">
                <!-- Btn change signer -->
                <v-btn
                  v-if="showActionChangeSigner"
                  class="btn-change"
                  rounded
                  :disabled="disableChangeSigner"
                  @click="showDialogChangeSign"
                >
                  {{ $t('document.label.changeSigner') }}
                </v-btn>

                <!-- Btn change reviewer -->
                <v-btn
                  v-if="showActionChangeReviewer"
                  class="btn-change"
                  rounded
                  @click="showDialogChangeReview"
                >
                  {{ $t('document.label.changeReviewer') }}
                </v-btn>

                <!-- Btn add reviewer -->
                <v-btn
                  v-if="showActionAddReviewer"
                  class="btn-change"
                  rounded
                  :disabled="disabledBtnAdd"
                  @click="showDialogAddReview"
                >
                  {{ $t('document.label.addReviewer') }}
                </v-btn>

                <!-- Btn add flasher -->
                <v-btn
                  v-if="showActionAddFlasher"
                  class="btn-change"
                  rounded
                  :disabled="disabledBtnAdd"
                  @click="showDialogAddFlasher"
                >
                  {{ $t('document.label.addInitialSigner') }}
                </v-btn>
                <v-sheet
                  id="scrolling-techniques-2"
                  class="overflow-y-auto"
                  :max-height="heightScoll"
                >
                  <!-- List nguoi xu ly-->
                  <DocumentAction
                    :additional-signers="lstAdditionalSigner"
                    :list-actions="listActions"
                    :doc-state="docState"
                    @show-dialog="showDialogRemoveSigner"
                  />
                  <div v-if="parentSignProcesses">
                    <SignNote :parent-sign-processes="parentSignProcesses" />
                  </div>
                </v-sheet>
              </div>
            </div>
          </div>

          <!-- Button bottom -->
          <div class="d-flex bottom-btn-sign">
            <v-btn
              class="btn-close"
              color="primary"
              outlined
              rounded
              @click="hideDialog"
            >
              <span class="text-btn"> {{ $t('electronicSign.back') }}</span>
            </v-btn>

            <v-btn
              v-if="showActionReject"
              class="btn-reject"
              color="#FF4A55"
              outlined
              rounded
              @click="rejectSign"
            >
              <span class="text-btn"> {{ $t('dashboards.reject') }}</span>
            </v-btn>

            <v-btn
              v-if="showActionSign"
              class="btn-sign"
              rounded
              color="primary"
              @click="acceptSign"
            >
              <span class="text-btn"> {{ $t(showTextSign) }}</span>
            </v-btn>

            <v-btn
              v-if="showActionReview"
              class="btn-sign"
              rounded
              color="primary"
              @click="acceptReview"
            >
              <span class="text-btn">
                {{ $t('document.signType.reviewer') }}</span>
            </v-btn>
          </div>
        </div>

        <!-- Dialog confirm reject -->
        <DialogConfirm
          :show-dialog="showDialogConfirmReject"
          :title-confirm="titleDialogConfirm"
          :show-comment="true"
          :required-comment="requiredComment"
          :label-comment="labelComment"
          :label-input-comment="labelInputComment"
          @close-dialog="showDialogConfirmReject = false"
          @accept="submitReject"
        />

        <!-- Dialog confirm sign, review, flasher -->
        <DialogConfirm
          :show-dialog="showDialogConfirmAccept"
          :title-confirm="titleDialogConfirm"
          :show-comment="true"
          :required-comment="requiredComment"
          :label-comment="labelComment"
          :label-input-comment="labelInputComment"
          @close-dialog="showDialogConfirmAccept = false"
          @accept="submitAccept"
        />

        <!-- Xac nhan quay lai  -->
        <DialogConfirm
          :show-dialog="showDialogBack"
          title-confirm="document.label.confirmBack"
          content-confirm="document.label.lostContent"
          :show-comment="false"
          @close-dialog="showDialogBack = false"
          @accept="backAcceptDialog"
        />

        <!-- Dialog chon chan ky  -->
        <DialogSelectSign
          :show-dialog="showDialogSelectSign"
          :id-signature="currentSignatureId"
          :full-name="fullName"
          :sign-method="signMethod"
          :id-file-doc="idFileDoc"
          :items-sign="itemsSign"
          @accept="acceptSelectSign"
          @close-dialog="showDialogSelectSign = false"
        />

        <!-- Dialog doi nguoi ky, ky nhay, xem xet -->
        <dialog-change-signer
          :title-confirm="titleConfirm"
          :show-dialog="showDialogChangeSigner"
          :doc-id="documentId"
          :group-id="signGroupId"
          :group-name="signGroupName"
          @accept="showDialogConfirm"
          @close-dialog="showDialogChangeSigner = false"
        />

        <!-- Dialog them nguoi ky -->
        <dialog-add-signer
          :title-confirm="titleConfirm"
          :show-dialog="showDialogAddSigner"
          :doc-id="documentId"
          :group-id="signGroupId"
          :group-name="signGroupName"
          @close-dialog="showDialogAddSigner = false"
          @accept="acceptAdd"
        />

        <!-- Dialog confirm them nguoi ky -->
        <dialog-confirm-add-signer
          :title-confirm="titleConfirmAdd"
          :form-data="formData"
          :show-dialog="showConfirmAddSigner"
          @close-dialog="showConfirmAddSigner = false"
          @accept-action="acceptAdd"
        />

        <!-- Dialog confirm remove signer -->
        <dialog-confirm-remove-signer
          :show-dialog="showPopupConfirmRemove"
          :title-confirm="titleDialogRemoveSigner"
          @accept="acceptRemoveSinger"
          @close-dialog="showPopupConfirmRemove = false"
        />

        <!-- Dialog confirm change signer -->
        <dialog-confirm-change-signer
          :title-confirm="titleConfirmChange"
          :form-data="formData"
          :show-dialog="showConfirmChangeSigner"
          :confirm-content-sign="confirmContentSign"
          @close-dialog="showConfirmChangeSigner = false"
          @accept-action="acceptChange"
        />

        <base-preload :dialog="loading" />
      </v-card>
    </div>
  </v-fade-transition>
</template>

<script>
import Vue from 'vue'
import bsdPdf from 'bsd-pdf'
import i18n from '@/i18n'
import constants from '@/constants'
import DialogConfirm from '@/modules/esignature/views/sign/components//DialogConfirm.vue'
import { DocumentService } from '@/modules/esignature/services/documentService'
import { mapActions } from 'vuex'
import { FileService } from '@/modules/esignature/services/fileService'
import IconSign from '@/modules/esignature/views/create/components/IconSign'
import TextPagePdf from '@/modules/esignature/views/create/components/TextPagePdf'
import _ from 'lodash'
import ItemSignature from '@/modules/esignature/views/sign/components//ItemSignature'
import DialogSelectSign from '@/modules/esignature/views/sign/components//DialogSelectSign'
import { randomId } from '@/core/utils'
import TooltipFileDocument from '@/modules/esignature/views/components/TooltipFileDocument'
import customsFile from '@/modules/esignature/mixins/customsFile'
import DialogAddSigner from '@/modules/esignature/views/sign/components/DialogAddSigner.vue'
import DialogConfirmAddSigner from '@/modules/esignature/views/sign/components/DialogConfirmAddSigner.vue'
import DialogConfirmRemoveSigner from '@/modules/esignature/views/sign/components/DialogConfirmRemoveSigner.vue'
import DialogConfirmChangeSigner from '@/modules/esignature/views/components/DialogConfirm.vue'
import DialogChangeSigner from '@/modules/esignature/views/sign/components/DialogChangeSigner.vue'
import DocumentAction from '@/modules/esignature/views/sign/components/DocumentAction.vue'
import SignNote from '@/modules/esignature/views/sign/components/SignNote.vue'
import routeEsignature from '@/modules/esignature/router/routePaths'

function initialData() {
  return {
    fileDocument: {
      fileName: ''
    },
    listFileDocument: [],
    documentTitle: '', // Ten van ban trinh ky
    disabledZoomIn: false,
    disabledZoomOut: false,
    zoom: 100,
    scale: '1',
    lstZoom: [25, 33, 50, 67, 75, 100, 110, 125, 150, 175, 200],
    signUserType: '',
    visibleStartSign: true,
    // Dialog confirm
    showDialogConfirmReject: false,
    showDialogConfirmAccept: false,
    titleDialogConfirm: '',
    requiredComment: false,
    labelComment: '',
    labelInputComment: '',
    showDialogBack: false,
    typeConfirm: '',
    // filePDF
    src: '',
    numPages: null,
    currentPage: 1,
    pageActive: 1,
    forceRender: false,
    loading: false,
    listSigner: [], // List nguoi ky
    itemsSign: [], // List chan ky
    loadFileSignPreview: false, // Check load file pdf preview success.
    pagePreviewTooltips: [],
    addInitSigner: false, // Check add init sign
    listActions: [],
    listSignByDoc: [],
    showDialogSelectSign: false,
    currentSignatureId: null,
    showLoadingChangeFile: false,
    // Handle page
    firstFocusPage: 1,
    valueFocusPage: 1,
    endFocusPage: 1,
    listInitPageSign: [],
    idFileDoc: null,
    isSignDoc: false,
    showListIconSign: false, // check show list icon file ky.
    messErrorSign: '',
    fullName: '',
    signMethod: '',
    showDialogAddSigner: false,
    titleConfirm: '',
    showConfirmAddSigner: false,
    titleConfirmAdd: '',
    formData: {},
    showPopupConfirmRemove: false,

    signProcessId: null,
    signGroupId: null,
    signGroupName: null,

    showDialogChangeSigner: false,
    showConfirmDoc: false,
    showConfirmChangeSigner: false,
    titleConfirmChange: null,
    confirmContentSign: '',

    checkChangeReview: false,
    isAddReviewer: undefined,

    lstAdditionalSigner: [],

    titleDialogRemoveSigner: '',
    signProcessIdRemove: null,
    isRemoveReviewer: false,

    // Note
    parentSignProcesses: null,
    docState: null
  }
}

export default {
  name: 'SignDocument',
  components: {
    DialogConfirm,
    bsdPdf,
    DialogSelectSign,
    TooltipFileDocument,
    DialogAddSigner,
    DialogConfirmAddSigner,
    DialogConfirmRemoveSigner,
    DialogChangeSigner,
    DialogConfirmChangeSigner,
    DocumentAction,
    SignNote
  },
  mixins: [customsFile],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    documentId: {
      type: Number,
      default: 0
    },
    indexOpenFileDoc: {
      type: Number,
      default: 0
    },
    isDashboard: {
      type: Boolean,
      default: false
    },
    isListProcess: {
      type: Boolean,
      default: false
    },
    currentTab: {
      type: Number,
      default: 0
    }
  },
  data() {
    return initialData()
  },
  computed: {
    heightScoll() {
      let height = 70
      if (this.showActionAddFlasher) {
        height -= 8
      }
      if (this.showActionAddReviewer) {
        height -= 8
      }
      if (this.showActionChangeSigner || this.showActionChangeReviewer) {
        height -= 8
      }
      return `${height}vh`
    },
    // show text ky chinh hoac ky nhay
    showTextSign() {
      let text = 'document.signType.flashes'
      if (this.checkSignerOrFlasher()) {
        text = 'signLabel'
      }
      return text
    },

    // Check show btn change signer
    showActionChangeSigner() {
      return (
        this.listActions &&
        this.listActions.includes(constants.SIGN_ACTIONS.CHANGE_MAIN_SIGNER)
      )
    },

    // Check show btn change reviewer
    showActionChangeReviewer() {
      return (
        this.listActions &&
        this.listActions.includes(constants.SIGN_ACTIONS.CHANGE_REVIEWER)
      )
    },

    showActionAddReviewer() {
      return (
        this.listActions &&
        this.listActions.includes(constants.SIGN_ACTIONS.ADD_REVIEWER)
      )
    },

    showActionAddFlasher() {
      return (
        this.listActions &&
        this.listActions.includes(constants.SIGN_ACTIONS.ADD_FLASHES_SIGNER)
      )
    },

    showActionReject() {
      const lstApprove = [
        constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN,
        constants.SIGN_ACTIONS.APPROVE_MAIN_SIGN,
        constants.SIGN_ACTIONS.APPROVE_REVIEW,
        constants.SIGN_ACTIONS.APPROVE_COORDINATE
      ]
      var show = false
      if (this.listActions) {
        for (const action of this.listActions) {
          if (lstApprove.includes(action)) {
            show = true
            break
          }
        }
      }
      return show
    },

    showActionSign() {
      const lstApprove = [
        constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN,
        constants.SIGN_ACTIONS.APPROVE_MAIN_SIGN
      ]
      var show = false
      if (this.listActions) {
        for (const action of this.listActions) {
          if (lstApprove.includes(action)) {
            show = true
            break
          }
        }
      }

      return show
    },

    // check neu la ky nhay thi disbale
    showActionFlasher() {
      return (
        this.listActions &&
        this.listActions.includes(constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN)
      )
    },

    showActionReview() {
      return (
        this.listActions &&
        this.listActions.includes(constants.SIGN_ACTIONS.APPROVE_REVIEW)
      )
    },

    canSelectImageSign() {
      return (
        this.listActions &&
        (this.listActions.includes(constants.SIGN_ACTIONS.APPROVE_MAIN_SIGN) ||
          this.listActions.includes(
            constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN
          ))
      )
    },

    // Check neu co reviewer or flasher disable btn change signer
    disableChangeSigner() {
      return false
    },

    disabledBtnAdd() {
      return false
    },

    // Generate text btn confirm when change signer/ reviewer
    genTextBtnConfirm() {
      let text = 'document.titleConfirm.cancelChangeSigner'
      if (this.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
        text = 'document.titleConfirm.cancelChangeReviewer'
      }
      return text
    }
  },
  watch: {
    async showDialog() {
      if (this.showDialog) {
        await Promise.all([
          this.initDataDocument(),
          this.getListAdditionalSigner()
        ])
      }
    },

    async itemsSign() {
      await this.reloadIconSignPreview()
    },

    zoom() {
      if (this.itemsSign.length > 0) {
        this.itemsSign.map((item) => (item.zoom = this.getZoom()))
      }
    }
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    ...mapActions('document', ['resetDataState']),
    // check true la ky chinh, false la ky nhay
    checkSignerOrFlasher() {
      let check = true
      if (
        this.listActions &&
        this.listActions.includes(constants.SIGN_ACTIONS.APPROVE_FLASHES_SIGN)
      ) {
        check = false
      }
      return check
    },

    resetData() {
      Object.assign(this.$data, initialData())
    },

    async initDataDocument() {
      try {
        setTimeout(() => {
          this.loading = true
        }, 100)

        const { data } = await DocumentService.viewDocumentInfo(this.documentId)
        this.documentTitle = data.documentTitle
        this.docState = data.docState
        this.listFileDocument = data.mainSigningFiles
        this.listSigner = data.signProcesses
        this.listActions = data.actions
        if (data.parentSignProcesses.length > 0) {
          this.parentSignProcesses = data.parentSignProcesses
        }
        this.createEventScrollListIconFileSign()
        this.resetDataState()
        if (this.listSigner.length > 0) {
          this.initGroup()
        }
        if (this.listFileDocument && this.listFileDocument.length > 0) {
          await this.downloadFileDocument()
        }
      } catch (error) {
        this.loading = false
        this.showMess(error.message, 'error')
      }
    },

    showMess(error, type) {
      this.setNotify({
        show: true,
        type: type,
        content: error
      })
    },

    // create event scroll list icon file sign.
    createEventScrollListIconFileSign() {
      const ele = document.getElementById('listIconFileSign')
      if (ele) {
        ele.style.cursor = 'pointer'

        let pos = { top: 0, left: 0, x: 0, y: 0 }

        const mouseDownHandler = function(e) {
          ele.style.cursor = 'grabbing'
          ele.style.userSelect = 'none'

          pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY
          }

          document.addEventListener('mousemove', mouseMoveHandler)
          document.addEventListener('mouseup', mouseUpHandler)
        }

        const mouseMoveHandler = function(e) {
          // How far the mouse has been moved
          const dx = e.clientX - pos.x
          const dy = e.clientY - pos.y

          // Scroll the element
          ele.scrollTop = pos.top - dy
          ele.scrollLeft = pos.left - dx
        }

        const mouseUpHandler = function() {
          ele.style.cursor = 'pointer'
          ele.style.removeProperty('user-select')

          document.removeEventListener('mousemove', mouseMoveHandler)
          document.removeEventListener('mouseup', mouseUpHandler)
        }

        // Attach the handler
        ele.addEventListener('mousedown', mouseDownHandler)
      }
    },

    // download url file document
    async downloadFileDocument() {
      var urlFileOpenFirst = await FileService.downloadSignFile(
        this.documentId,
        this.listFileDocument[this.indexOpenFileDoc].id
      )
      this.listFileDocument[this.indexOpenFileDoc].url = urlFileOpenFirst
      this.fileDocument = this.listFileDocument[this.indexOpenFileDoc]
      this.src = this.fileDocument.url
      await this.setListDoc()
      const user = JSON.parse(localStorage.getItem(constants.USER_INFO))
      this.fullName = user.fullName

      for (const file of this.listFileDocument) {
        if (!file.url) {
          file.url = await FileService.downloadSignFile(
            this.documentId,
            file.id
          )
          if (this.showLoadingChangeFile && file.id === this.fileDocument.id) {
            this.loading = false
            this.showLoadingChangeFile = false
            this.changeFilePdfWithUrl(file.id)
          }
        }
      }
    },

    // Tim xem file co chan ky khong
    async setListDoc() {
      for (const [index, file] of this.listFileDocument.entries()) {
        file.fileOrder = index
        file.isSign = false
        var listSignTemp = []
        this.listSigner.map((item) => {
          item.docNoteSigns.map((sign) => {
            if (sign.filesAttachmentId === file.id) listSignTemp.push(sign)
          })
        })
        file.exist = listSignTemp
        if (file.exist.length !== 0) this.showListIconSign = true
      }
    },

    getClassItemSign(data) {
      if (data.item.exist.length > 0 && data.item.isSign) {
        return 'item-file-sign'
      }
      if (data.item.exist.length > 0 && !data.item.isSign) {
        return 'item-file-no-sign'
      }
    },

    getClassItemSign2(item) {
      if (item.exist && item.exist.length > 0 && item.isSign) {
        return 'item-file-sign'
      }
      if (item.exist && item.exist.length > 0 && !item.isSign) {
        return 'item-file-no-sign'
      }
    },

    // get list chan ky
    initListSign() {
      this.listSigner.map((item) => {
        item.docNoteSigns.map((sign) => {
          sign.dataImgSign = null
          sign.zoom = 100
          sign.signType = constants.SIGN_PROVIDERS.IMAGE
          sign.fullName = item.fullName
          sign.signUserName = item.signUserName
          sign.signMethod = item.signMethod
          sign.signUserId = item.signUserId
          sign.positionName = item.positionName
          sign.signGroupCode = item.signGroupCode
          if (sign.filesAttachmentId === this.fileDocument.id) {
            this.addItemSign2('img-sign', sign)
            this.listSignByDoc.push(sign.page)
          } else {
            this.addItemSignInit('img-sign', sign)
          }
        })
      })

      this.addInitSigner = true
      this.checkShowBtnMoveSign()
    },

    // Khoi tao list page co chan ky.
    initialListPageSign() {
      this.listInitPageSign = []
      this.listInitPageSign.length = this.numPages

      // Set chan ky vao page.
      for (const page of this.listSignByDoc) {
        this.listInitPageSign[page - 1] = page
      }
    },

    // Change file pdf
    onchangeFilePdf(id) {
      if (!this.fileDocument.url) {
        this.loading = true
        this.showLoadingChangeFile = true
      } else {
        this.changeFilePdfWithUrl(id)
      }
    },

    onchangeFileClickIcon(file) {
      if (file.id === this.fileDocument.id) return
      this.fileDocument = file
      if (!this.fileDocument.url) {
        this.loading = true
        this.showLoadingChangeFile = true
      } else {
        this.changeFilePdfWithUrl(file.id)
      }
    },

    // Change file pdf when url exist
    changeFilePdfWithUrl(id) {
      this.forceRender = false
      this.loadFileSignPreview = false
      this.src = null
      this.resetRoom()

      // Get list sign by document
      this.listSignByDoc = []
      var listSignTemp = this.itemsSign.filter(
        (item) => item.signer.filesAttachmentId === id
      )
      listSignTemp.map((item) => this.listSignByDoc.push(item.signer.page))
      this.checkShowBtnMoveSign()

      setTimeout(() => {
        this.forceRender = true
        this.src = this.fileDocument.url
      }, 100)
    },

    // check file doc exist sign show btn MoveSign.
    checkShowBtnMoveSign() {
      this.visibleStartSign = this.listSignByDoc.length !== 0

      if (this.visibleStartSign) {
        this.listSignByDoc = [...new Set(this.listSignByDoc)]
        this.listSignByDoc.sort((a, b) => a - b)
        this.initialListPageSign()
        this.firstFocusPage = this.listSignByDoc[0]
        this.valueFocusPage = this.listSignByDoc[0]
        this.endFocusPage = this.listSignByDoc[this.listSignByDoc.length - 1]
      }
    },

    // Add lai pageNum & iconSign khi scroll file
    loadSignFilePreview(pageLoaded) {
      if (this.pagePreviewTooltips && this.loadFileSignPreview) {
        var element = document.getElementById(`page-preview${pageLoaded}`)
        this.addTextPage(element, pageLoaded)
        this.repalceIconSign(element, pageLoaded)

        setTimeout(() => {
          this.reloadPagesItemSign()
        }, 100)
      }
    },

    // Check load file PDF Preview success.
    loadPreviewSuccess(val) {
      this.numPages = val
      const self = this
      this.pagePreviewTooltips = []
      this.loadFileSignPreview = false
      this.pageActive = 1
      this.currentPage = 1

      // Add event click to file PDF Preview.
      var onClickPdfPreviewPage = function() {
        var attribute = this.getAttribute('data-page-number')
        if (attribute) self.$refs.pdf.goToPage(+attribute)
        if (self.pageActive) {
          var elements = document.getElementById(
            `page-preview${self.pageActive}`
          )
          elements.classList.remove('activePagePreview')
          self.valueFocusPage = +attribute
        }
        this.classList.add('activePagePreview')
        self.pageActive = +attribute
      }

      setTimeout(() => {
        // Scroll file pdf Preview to top.
        const listPdf = document.getElementsByClassName('pdf-container')
        if (listPdf && listPdf.length > 0) listPdf[0].scrollTop = 0
      }, 200)

      setTimeout(() => {
        for (var i = 1; i <= val; i++) {
          var element = document.getElementById(`page-preview${i}`)
          if (element) {
            if (i === 1) {
              element.classList.add('activePagePreview')
            }
            this.addTextPage(element, i)
            this.addIconSign(element, 0)
            this.loadFileSignPreview = true
            element.addEventListener('click', onClickPdfPreviewPage)
          }
        }
        this.reloadIconSignPreview()
      }, 500)
    },

    // Check load file PDF main success.
    loadPdfSuccess(val) {
      setTimeout(() => {
        this.reloadSign()
        if (!this.addInitSigner) {
          this.initListSign()
          this.loading = false
        }
      }, 500)
    },

    // Reload chan ky khi change file PDF.
    reloadSign() {
      this.itemsSign.map((item) => {
        if (item.signer.filesAttachmentId === this.fileDocument.id) {
          var pageSign = this.$refs.workArea.querySelector(
            `#page-content${item.signer.page}`
          )
          var dataLoaded = pageSign.getAttribute('data-loaded')
          if (dataLoaded) {
            item.fileDocId = this.fileDocument.id
            item.$mount()
            pageSign.appendChild(item.$el)
          }
        }
      })
    },

    // Reload icon ky khi change file PDF.
    reloadIconSignPreview() {
      var pageItems = []
      this.itemsSign.map((item) => {
        if (item.signer.filesAttachmentId === this.fileDocument.id) {
          pageItems.push(item.signer.page)
        }
      })
      const group = _.groupBy(pageItems)
      this.pagesItemSign = group
      this.reloadPagesItemSign()
    },

    // Load chan ky khi page pdf load success.
    loadSignaturePage(pageLoaded) {
      var instances = this.itemsSign.filter(
        (item) =>
          item.signer.page === pageLoaded &&
          item.signer.filesAttachmentId === this.fileDocument.id
      )

      if (instances) {
        var pageSign = this.$refs.workArea.querySelector(
          `#page-content${pageLoaded}`
        )

        for (var i = 0; i < instances.length; i++) {
          instances[i].fileDocId = this.fileDocument.id
          instances[i].$mount()
          pageSign.appendChild(instances[i].$el)
        }
      }
    },

    // Scroll file pdf
    onScollFile(currentPage) {
      this.currentPage = currentPage
      this.valueFocusPage = currentPage
      if (this.pageActive && this.pageActive !== currentPage) {
        this.$refs.pdfPreview.goToPage(this.currentPage)
        // Remove old pageActive
        var oldPage = document.getElementById(`page-preview${this.pageActive}`)
        oldPage.classList.remove('activePagePreview')
        this.pageActive = +currentPage

        // Add new pageActive
        var newPage = document.getElementById(`page-preview${this.pageActive}`)
        newPage.classList.add('activePagePreview')
      }
    },

    // Reload tooltip icon sign.
    reloadPagesItemSign() {
      this.pagePreviewTooltips.map((tooltip, page) => {
        var itemSign = this.pagesItemSign[page + 1]
        tooltip.numSign = itemSign ? itemSign.length : 0
      })
    },

    addTextPage(pageSign, page) {
      var TextPagePdfEl = Vue.extend(TextPagePdf)
      var instance = new TextPagePdfEl({
        i18n,
        propsData: {
          textPage: '' + page
        }
      })
      instance.$mount()
      pageSign.appendChild(instance.$el)
    },

    repalceIconSign(pageSign, pageNum) {
      var instance = this.pagePreviewTooltips[pageNum - 1]
      instance.$mount()
      pageSign.appendChild(instance.$el)
    },

    addIconSign(pageSign, numSign) {
      var IconSignEl = Vue.extend(IconSign)
      var instance = new IconSignEl({
        i18n,
        propsData: {
          numSign: numSign
        }
      })
      instance.$mount()
      this.pagePreviewTooltips.push(instance)
      pageSign.appendChild(instance.$el)
    },

    getZoom() {
      let zoomPercent = this.zoom
      zoomPercent = zoomPercent < 200 ? zoomPercent : 175
      return `zoom: ${zoomPercent / 100}`
    },

    // Them chan ky vao file pdf.
    addItemSign2(type, signer) {
      var ItemSignatureEl = Vue.extend(ItemSignature)
      var pageSign = this.$refs.workArea.querySelector(
        `#page-content${signer.page}`
      )
      var dataLoaded = pageSign.getAttribute('data-loaded')
      if (signer.axisX >= 656) signer.axisX = 656
      if (signer.axisY >= -78) signer.axisY = -78

      const id = randomId()
      var instance = new ItemSignatureEl({
        i18n,
        propsData: {
          type: type,
          id: id,
          w: 100,
          h: 60,
          itemIndex: this.itemsSign.length,
          signer: signer,
          fileDocId: this.fileDocument.id,
          fileOrder: this.fileDocument.fileOrder,
          zoom: this.getZoom(),
          showFullname: false
        },
        methods: {
          onSelectSignature: this.onSelectSignature,
          onSelecPinCA: this.onSelecPinCA
        }
      })
      this.itemsSign.push(instance)
      if (dataLoaded) {
        instance.$mount()
        pageSign.appendChild(instance.$el)
      }
    },

    addItemSignInit(type, signer) {
      var ItemSignatureEl = Vue.extend(ItemSignature)

      if (signer.axisX >= 656) signer.axisX = 656
      if (signer.axisY >= -78) signer.axisY = -78

      const id = randomId()
      var instance = new ItemSignatureEl({
        i18n,
        propsData: {
          type: type,
          id: id,
          w: 100,
          h: 60,
          itemIndex: this.itemsSign.length,
          signer: signer,
          fileDocId: this.fileDocument.id,
          fileName: this.fileDocument.fileName,
          fileOrder: this.fileDocument.fileOrder,
          zoom: this.getZoom(),
          showFullname: false
        },
        methods: {
          onSelectSignature: this.onSelectSignature,
          onSelecPinCA: this.onSelecPinCA
        }
      })
      this.itemsSign.push(instance)
    },

    // Chon anh ky
    onSelectSignature(idSignature, idFileDoc, signMethod) {
      if (!this.canSelectImageSign) return
      this.showDialogSelectSign = true
      this.currentSignatureId = idSignature
      this.idFileDoc = idFileDoc
      this.signMethod = signMethod
    },

    // Chon chu ky so
    onSelecPinCA(idSignature, idFileDoc, signMethod) {
      if (!this.canSelectImageSign) {
        return
      }
      this.showDialogSelectSign = true
      this.currentSignatureId = idSignature
      this.idFileDoc = idFileDoc
      this.signMethod = signMethod
    },

    hideDialog() {
      this.showDialogBack = true
    },

    backAcceptDialog() {
      this.$emit('close-dialog', this.isSignDoc)
      this.resetData()
    },

    changeZoom() {
      if (this.zoom === 25) {
        this.disabledZoomOut = true
        this.disabledZoomIn = false
      }
      if (this.zoom === 200) {
        this.disabledZoomIn = true
        this.disabledZoomOut = false
      }
      if (this.zoom > 25 && this.zoom < 200) {
        this.disabledZoomOut = false
        this.disabledZoomIn = false
      }
      this.scale = '' + this.zoom / 100
      this.$refs.pdf.changeScale(this.scale)
    },

    zoomOut() {
      const currentIndexZoom = this.lstZoom.findIndex((z) => z === this.zoom)
      if (currentIndexZoom > 0) {
        this.zoom = this.lstZoom[currentIndexZoom - 1]
        this.scale = '' + this.zoom / 100
        this.$refs.pdf.changeScale(this.scale)
        this.disabledZoomOut = false
      } else {
        this.disabledZoomOut = true
      }
      this.disabledZoomIn = false
    },

    zoomIn() {
      const currentIndexZoom = this.lstZoom.findIndex((z) => z === this.zoom)
      if (currentIndexZoom < this.lstZoom.length - 1) {
        this.zoom = this.lstZoom[currentIndexZoom + 1]
        this.scale = '' + this.zoom / 100
        this.$refs.pdf.changeScale(this.scale)
        this.disabledZoomIn = false
      } else {
        this.disabledZoomIn = true
      }
      this.disabledZoomOut = false
    },

    resetRoom() {
      if (this.zoom !== 100) {
        this.zoom = 100
        this.$refs.pdf.changeScale('1')
        this.disabledZoomOut = false
        this.disabledZoomIn = false
      }
    },

    rejectSign() {
      this.typeConfirm = constants.SIGN_USER_TYPE.FLASHES
      if (this.checkSignerOrFlasher()) {
        this.typeConfirm = constants.SIGN_USER_TYPE.MAIN
      }
      if (this.showActionReview) {
        this.typeConfirm = constants.SIGN_USER_TYPE.REVIEWER
      }
      this.showDialogConfirmReject = true
      this.requiredComment = true
      this.titleDialogConfirm = 'document.label.confirmReject'
      this.labelComment = 'document.label.reason'
      this.labelInputComment = 'document.label.inputReason'
    },

    checkFillImgToSignature() {
      var isError = false
      var indexFile = 1
      this.messErrorSign = ''
      for (const item of this.listFileDocument) {
        if (!item.isSign && item.exist.length > 0) {
          this.messErrorSign +=
            '' + (item.fileOrder + 1) + '. ' + item.fileName + '<br>'
          isError = true
          indexFile++
        }
      }

      // Xoa STT voi case co 1 file chua co chu ky
      if (indexFile === 2) {
        this.messErrorSign = this.messErrorSign.substring(
          3,
          this.messErrorSign.length
        )
      }

      var messError =
        this.$t('document.missSignSignature') + '<br>' + this.messErrorSign

      isError
        ? this.showMess(messError, 'error')
        : (this.showDialogConfirmAccept = true)
    },

    acceptSign() {
      this.requiredComment = false
      this.titleDialogConfirm = 'document.label.confirmSignFlashes'
      this.labelComment = 'document.comment'
      this.labelInputComment = 'document.inputComment'
      this.typeConfirm = constants.SIGN_USER_TYPE.FLASHES
      if (this.checkSignerOrFlasher()) {
        this.typeConfirm = constants.SIGN_USER_TYPE.MAIN
        this.titleDialogConfirm = 'document.label.confirmSign'
      }

      if (this.itemsSign.length === 0) {
        this.showDialogConfirmAccept = true
      } else {
        this.checkFillImgToSignature()
      }
    },

    acceptReview() {
      this.showDialogConfirmAccept = true
      this.requiredComment = false
      this.titleDialogConfirm = 'document.label.confirmReview'
      this.labelComment = 'document.comment'
      this.labelInputComment = 'document.inputComment'
      this.typeConfirm = constants.SIGN_USER_TYPE.REVIEWER
    },

    // get data group
    initGroup() {
      this.signGroupId = parseInt(this.listSigner[0].signGroupId)
      this.signProcessId = parseInt(this.listSigner[0].signProcessId)
      this.signGroupName = this.listSigner[0].signGroupName
    },

    // xac nhan change nguoi ky hoac nguoi xem xet.
    showDialogConfirm(params) {
      this.formData = params
      if (this.showDialogAddSigner) {
        this.showConfirmAddSigner = true
      } else {
        this.showConfirmChangeSigner = true
      }

      this.confirmContentSign = 'document.label.confirmContentSign'
      this.titleConfirmChange = 'document.titleConfirm.changeSignerTitle'
      if (this.checkChangeReview) {
        this.confirmContentSign = 'document.label.confirmContentReview'
        this.titleConfirmChange = 'document.titleConfirm.changeReviewerTitle'
      }
    },

    // Dialog doi nguoi ky
    showDialogChangeSign() {
      this.titleConfirm = 'document.label.changeSigner'
      this.message = 'document.titleConfirm.changeSignerSuccess'
      this.showDialogChangeSigner = true
    },

    // Dialog doi nguoi xem xet
    showDialogChangeReview() {
      this.titleConfirm = 'document.label.changeReviewer'
      this.message = 'document.titleConfirm.changeReviewerSuccess'
      this.showDialogChangeSigner = true
      this.checkChangeReview = true
    },

    showDialogAddReview() {
      this.isAddReviewer = true
      this.titleConfirm = this.$t('document.label.addReviewer')
      this.message = 'document.titleConfirm.addReviewerSuccess'
      this.titleConfirmAdd = 'document.titleConfirm.addReviewerTitle'
      this.showDialogAddSigner = true
    },

    showDialogAddFlasher() {
      this.isAddReviewer = false
      this.titleConfirm = this.$t('document.label.addInitialSigner')
      this.message = 'document.titleConfirm.addFlasherSuccess'
      this.titleConfirmAdd = 'document.titleConfirm.addSignerTitle'
      this.showDialogAddSigner = true
    },

    // Dong y doi nguoi ky, xem xet
    async acceptChange() {
      this.showDialogChangeSigner = false
      try {
        this.formData['documentId'] = parseInt(this.documentId)
        this.formData['signProcessId'] = parseInt(this.signProcessId)

        const response = await DocumentService.changeSignerBySigner(
          this.formData
        )
        if (response.status === 200) {
          this.isSignDoc = true
          this.getNotifySucces(this.message)
          // tro ve man dashboard hoac man list
          setTimeout(() => {
            if (this.isDashboard) {
              this.backAcceptDialog()
            } else {
              this.goBackToList()
            }
          }, 2000)
        }
      } catch (error) {
        this.getNotifyError(error)
      }
    },

    goBackToList() {
      if (this.isListProcess) {
        this.$emit('close-dialog', true)
      }
      return this.$router.push(`${routeEsignature.DOCUMENT_LIST_PROCESS_TAB_PATH}${this.currenTab}`)
    },

    // Dong y them nguoi ky nhay hoac nguoi xem xet
    async acceptAdd(params) {
      try {
        this.loading = true
        this.formData = params
        this.formData['documentId'] = parseInt(this.documentId)
        this.formData['signProcessId'] = parseInt(this.signProcessId)

        const response = this.isAddReviewer
          ? await DocumentService.addReviewer(this.formData)
          : await DocumentService.addFlasher(this.formData)

        if (response.status === 200) {
          const { data } = await DocumentService.viewDocumentInfo(
            this.documentId
          )
          this.parentSignProcesses = data.parentSignProcesses
          this.listActions = []
          this.listActions = data.actions
          // this.listSigner = data.signProcesses
          this.forceRender = true
          // this.initListSign()
          await this.getListAdditionalSigner()

          this.getNotifySucces(this.message)
          this.showDialogAddSigner = false
          this.isSignDoc = true
        }
      } catch (error) {
        this.getNotifyError(error)
      } finally {
        this.loading = false
      }
    },

    async submitReject(comment) {
      var formData = {}
      formData.processStatus = constants.SIGN_PROCCESS_STATUS.REJECTED
      formData.comment = comment
      var messSuccess = 'document.rejectsSuccess.review'
      if (this.typeConfirm === constants.SIGN_USER_TYPE.MAIN) {
        messSuccess = 'document.rejectContractSuccess'
      }
      if (this.typeConfirm === constants.SIGN_USER_TYPE.FLASHES) {
        messSuccess = 'document.rejectFlashContractSuccess'
      }
      try {
        this.loading = true
        await DocumentService.signDocument(this.documentId, formData)
        this.loading = false
        this.showMess(messSuccess, 'success')
        this.isSignDoc = true
        this.backAcceptDialog()
      } catch (error) {
        this.loading = false
        this.showMess(error.message, 'error')
      }
    },

    async submitAccept(comment) {
      var formData = {}
      formData.processStatus = constants.SIGN_PROCCESS_STATUS.PROCESSED
      formData.comment = comment
      var messSuccess = 'document.reviewSuccess'
      if (this.typeConfirm === constants.SIGN_USER_TYPE.FLASHES) {
        messSuccess = 'document.flashesContractSuccess'
      }
      if (this.typeConfirm === constants.SIGN_USER_TYPE.MAIN) {
        messSuccess = 'document.signDocSuccess'
      }
      if (
        this.typeConfirm !== constants.SIGN_USER_TYPE.REVIEWER &&
        this.itemsSign.length !== 0
      ) {
        formData.signaturesData = this.buildParamSign()
      }
      try {
        this.loading = true
        await DocumentService.signDocument(this.documentId, formData)
        this.loading = false
        this.showMess(messSuccess, 'success')
        this.isSignDoc = true
        this.backAcceptDialog()
      } catch (error) {
        this.loading = false
        this.showMess(error.message, 'error')
      }
    },

    getNotifyError(error) {
      const typeAlert = 'error'
      const message = error.message
      this.setNotify({
        show: true,
        type: typeAlert,
        content: this.$t(message)
      })
    },

    getNotifySucces(message) {
      const typeAlert = 'success'
      this.setNotify({
        show: true,
        type: typeAlert,
        content: this.$t(message)
      })
    },

    // Tao param chan ky.
    buildParamSign() {
      const listParamSign = []
      this.itemsSign.map((item) => {
        var dataSign = {}
        dataSign.docNoteSignId = item.signer.id
        dataSign.signType = item.signer.signType
        dataSign.filePath = item.filePath
        dataSign.storage = item.storage
        dataSign.fileName = item.fileName
        dataSign.fileSize = item.fileSize
        if (item.signer.signType === constants.SIGN_TYPES.CA) {
          dataSign.pinCA = item.pinCA
          dataSign.filePath = null
          dataSign.provider = item.signer.provider
          dataSign.metaData = item.signer.metaData
        }
        listParamSign.push(dataSign)
      })
      return listParamSign
    },

    acceptSelectSign(signatureImage, useImgAllFileSign, showFullname) {
      this.visibleStartSign = false
      this.resetRoom()

      // Chon anh ky cho all chan ky all file
      if (signatureImage && useImgAllFileSign) {
        this.itemsSign.map((item) => {
          item.signer.signType = constants.SIGN_TYPES.IMAGE
          item.showFullname = !!showFullname
          Object.assign(item, { ...signatureImage })
        })
        this.listFileDocument.map((itemDoc) => {
          itemDoc.isSign = true
        })
      } else {
        const itemSignature = this.itemsSign.find(
          (item) => item.signer.id === this.currentSignatureId
        )

        // Check file doc da ky het chan ky chua
        var isSignDoc = true
        const listSignByDoc = this.itemsSign.filter(
          (item) => item.signer.filesAttachmentId === this.idFileDoc
        )

        for (const sign of listSignByDoc) {
          if (sign.signer.id !== this.currentSignatureId && !sign.filePath) {
            isSignDoc = false
          }
        }

        const itemDoc = this.listFileDocument.find(
          (item) => item.id === this.idFileDoc
        )
        itemDoc.isSign = isSignDoc

        if (signatureImage) {
          itemSignature.signer.signType = constants.SIGN_TYPES.IMAGE
        }

        if (itemSignature) {
          itemSignature.showFullname = !!showFullname
          Object.assign(itemSignature, { ...signatureImage })
        }
      }
    },

    // Di chuyen den chu ky
    moveToSignature(type) {
      this.resetRoom()

      // Move den vi tri chan ky dau tien.
      if (this.visibleStartSign) {
        this.visibleStartSign = false
        this.valueFocusPage = this.listSignByDoc[0]
        this.$refs.pdf.goToPage(this.listSignByDoc[0])
        return
      }

      // Next den chan ky tiep theo.
      if (type === 'next') {
        for (var i = this.valueFocusPage; i <= this.numPages - 1; i++) {
          if (this.listInitPageSign[i]) {
            this.valueFocusPage = this.listInitPageSign[i]
            break
          }
        }
        this.$refs.pdf.goToPage(this.valueFocusPage)
        return
      }

      // Quay lai chan ky truoc.
      if (type === 'prev') {
        for (var j = this.valueFocusPage - 2; j >= 0; j--) {
          if (this.listInitPageSign[j]) {
            this.valueFocusPage = this.listInitPageSign[j]
            break
          }
        }
        this.$refs.pdf.goToPage(this.valueFocusPage)
        return
      }
    },

    // Show dialog remove flasher, reviewer.
    showDialogRemoveSigner(item) {
      this.isRemoveReviewer = false
      this.titleDialogRemoveSigner = 'document.label.comfimRemoveFlashes'
      if (item.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
        this.titleDialogRemoveSigner = 'document.label.comfimRemoveReviewer'
        this.isRemoveReviewer = true
      }

      this.signProcessIdRemove = item.signProcessId
      this.showPopupConfirmRemove = true
    },

    // Xac nhan bo nguoi ky
    async acceptRemoveSinger() {
      try {
        this.loading = true

        const response = this.isRemoveReviewer
          ? await DocumentService.removeReviewer(
            this.documentId,
            this.signProcessIdRemove
          )
          : await DocumentService.removeFlasher(
            this.documentId,
            this.signProcessIdRemove
          )

        if (response.status === 200) {
          await this.getListAdditionalSigner()
          const { data } = await DocumentService.viewDocumentInfo(
            this.documentId
          )
          this.listActions = data.actions

          this.getNotifySucces(response.message)
        }
      } catch (error) {
        this.getNotifyError(error)
      } finally {
        this.loading = false
      }
    },

    // Get list additional signer.
    async getListAdditionalSigner() {
      const { data } = await DocumentService.getAdditionalSigner(
        this.documentId
      )
      this.lstAdditionalSigner = data
    }
  }
}
</script>

<style lang="scss" src="./SignDocument.scss" />
