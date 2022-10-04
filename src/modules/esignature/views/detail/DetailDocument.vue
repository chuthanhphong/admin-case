<template>
  <div class="esignature-wrap-common esignature-font" style="height: 100%">
    <div fluid class="wrap--list-flows px-5 esignature-detail esignature-font">
      <breadcrumbs :items="breadcrumbs" clazz="pt-0" />
      <v-card color="white" class="rounded-xl pa-2 pb-0 text-wrap">
        <v-sheet
          id="scrolling-techniques-3"
          class="overflow-y-auto esignature-height-detail"
        >
          <v-card-title class="docTitle">
            {{ $t('document.label.docInfo') }}
          </v-card-title>

          <!-- body -->
          <v-row v-if="docmentDetail" class="mx-1">
            <v-col cols="12" sm="12" md="7">
              <!-- ten van ban trinh ky -->
              <v-row>
                <v-col cols="12">
                  <label class="docLabel text--label color--label">
                    {{ $t('electronicSign.labelSearch') }}
                  </label>
                  <div class="doc-content">
                    <span class="text--body-1">{{
                      docmentDetail.documentTitle
                    }}</span>
                  </div>
                </v-col>
              </v-row>

              <!-- trang thai van ban -|- do khan -->
              <v-row v-if="checkFlowTemplate" class="mt-2 d-flex justify-space-between">
                <v-col cols="12" sm="5">
                  <label class="docLabel text--label color--label">
                    {{ $t('electronicSign.textStatus') }}
                  </label>
                  <div class="doc-content">
                    <span
                      class="text--body-1"
                      v-html="documentState(docmentDetail.docState)"
                    />
                  </div>
                </v-col>

                <v-col cols="12" sm="5">
                  <label class="docLabel text-uppercase text--label color--label">
                    {{ $t('electronicSign.urgency') }}
                  </label>
                  <div class="doc-content">
                    <span class="text--body-1">{{
                      docmentDetail.priorityValue
                    }}</span>
                  </div>
                </v-col>
              </v-row>

              <!-- don vi ban hanh -|- so van ban dang ky -->
              <v-row class="mt-2 d-flex justify-space-between">
                <v-col cols="12" sm="5">
                  <label class="docLabel text--label color--label">
                    {{ $t('electronicSign.create.issueGroup') }}
                  </label>
                  <div class="doc-content d-flex justify-space-between">
                    <span class="text--body-1">{{
                      docmentDetail.promulgateGroupName
                    }}</span>
                    <div v-if="showActionChange">
                      <v-tooltip top content-class="tooltip-top">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            class="v-btn--icon v-size--small"
                            icon
                            v-on="on"
                            @click="dialogChangeUnit()"
                          >
                            <img src="@/assets/imgs/refresh.png" alt="">
                          </v-btn>
                        </template>
                        <span>{{ $t('document.changeUnit') }}</span>
                      </v-tooltip>
                    </div>
                  </div>
                </v-col>

                <v-col v-if="checkFlowTemplate" cols="12" sm="5">
                  <label class="docLabel text--label color--label">
                    {{ $t('document.label.countDocument') }}
                  </label>
                  <div class="doc-content">
                    <span class="text--body-1">{{
                      docmentDetail.registerNumber
                    }}</span>
                  </div>
                </v-col>
                <v-col v-else cols="12" sm="5">
                  <label class="docLabel text-uppercase text--label color--label">
                    {{ $t('electronicSign.urgency') }}
                  </label>
                  <div class="doc-content">
                    <span class="text--body-1">{{
                      docmentDetail.priorityValue
                    }}</span>
                  </div>
                </v-col>
              </v-row>

              <!-- ngay tao -|- thoi han ky -->
              <v-row class="mt-2 d-flex justify-space-between">
                <v-col cols="12" sm="5">
                  <label class="docLabel text--label color--label">
                    {{ $t('document.label.dateFrom') }}
                  </label>
                  <div class="doc-content">
                    <span class="text--body-1">{{
                      createdDate(docmentDetail.createdDate)
                    }}</span>
                  </div>
                </v-col>

                <v-col v-if="checkFlowTemplate" cols="12" sm="5">
                  <label class="docLabel text--label color--label">
                    {{ $t('document.timeSign') }}
                  </label>
                  <div class="doc-content">
                    <span class="text--body-1">{{
                      docmentDetail.signingDeadline
                    }}</span>
                  </div>
                </v-col>
                <v-col v-else cols="12" sm="5" />
              </v-row>

              <!-- nguoi tao -->
              <v-row>
                <v-col cols="12">
                  <label class="docLabel text--label color--label">
                    {{ $t('document.label.signUserType.creator') }}
                  </label>
                  <div v-if="docmentDetail" class="doc-content text--body-1">
                    <div>
                      {{ genCreator(docmentDetail) }}
                    </div>
                    <div>
                      {{ docmentDetail.groupName }}
                    </div>
                  </div>
                </v-col>
              </v-row>

              <!-- mo ta -->
              <v-row class="mt-2">
                <v-col cols="12">
                  <label class="docLabel text--label color--label">
                    {{ $t('document.description') }}
                  </label>
                  <div class="doc-content">
                    <span class="text--body-1">{{
                      docmentDetail.description
                    }}</span>
                  </div>
                </v-col>
              </v-row>

              <!-- file ky -|- file dinh kem -->
              <v-row class="d-flex justify-space-between my-2">
                <v-expansion-panels :value="opened" accordion>
                  <v-expansion-panel>
                    <div class="d-flex justify-space-between">
                      <v-col cols="12" sm="5" class="pb-0">
                        <label class="docLabel text--label color--label">
                          {{ $t('document.label.fileSign') }}
                        </label>
                        <div class="d-flex mt-2 align-center">
                          <v-tooltip top content-class="tooltip-top" max-width="30%">
                            <template v-slot:activator="{ on, attrs }">
                              <img
                                class="icon-sign"
                                src="@/assets/icons/pdf.svg"
                              >
                              <span
                                class="doc-text-file text--body-1"
                                v-bind="attrs"
                                v-on="on"
                                @click="clickFileDoc(0)"
                              >
                                {{ customFileNameHeader(docmentDetail.mainFiles[0]) }}
                              </span>
                            </template>
                            <span>{{ docmentDetail.mainFiles[0].fileName }}</span>
                          </v-tooltip>
                          <div
                            v-if="showIconSign"
                            class="ml-5 icon-file-sign"
                          >
                            <v-tooltip top content-class="tooltip-top">
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  v-bind="attrs"
                                  class="v-btn--icon v-size--small"
                                  icon
                                  v-on="on"
                                  @click="clickFileDoc(0)"
                                >
                                  <img
                                    src="@/assets/icons/icon-ky.svg"
                                    alt="Sign"
                                    width="32"
                                    height="32"
                                    class="margin-icon-sign"
                                  >
                                </v-btn>
                              </template>
                              <span>{{ $t('clickSign') }}</span>
                            </v-tooltip>
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="5" class="pb-0">
                        <v-row>
                          <v-col cols="12" sm="10" class="pb-0">
                            <label class="docLabel text--label color--label">
                              {{ $t('document.label.fileAttachs') }}
                            </label>
                            <show-file class="mt-2" :files="fileAttachment" />
                          </v-col>

                          <v-col cols="12" sm="2" class="pb-1">
                            <v-expansion-panel-header
                              v-if="showListFile"
                              expand-icon=""
                              :hide-actions="!showListFile"
                            >
                              <template v-slot:default="{ open }">
                                <span
                                  v-if="!open"
                                  key="0"
                                  class="overline text--disabled d-flex justify-end"
                                ><v-icon class="icon"> $expand </v-icon>
                                </span>

                                <span
                                  v-else
                                  key="1"
                                  class="overline text--disabled d-flex justify-end"
                                ><v-icon> mdi-chevron-up </v-icon></span>
                              </template>
                            </v-expansion-panel-header>
                          </v-col>
                        </v-row>
                      </v-col>
                    </div>

                    <v-expansion-panel-content v-if="showListFile">
                      <v-row class="ma-0 justify-space-between">
                        <v-col cols="12" sm="5" class="pt-0">
                          <div class="d-flex justify-space-between">
                            <ul class="list-files" :class="showIconSign ? 'mt-0' : 'mt-1'">
                              <li
                                v-for="(file, index) of fileMainSign"
                                :key="index"
                                @click="clickFileDoc(index + 1)"
                              >
                                <v-tooltip top content-class="tooltip-top" max-width="30%">
                                  <template v-slot:activator="{ on, attrs }">
                                    <img
                                      :src="getIconFile(`${file.fileName}`)"
                                      class="icon-sign"
                                    >
                                    <span
                                      class="doc-text-file text--body-1"
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      {{ customFileName(file) }}
                                    </span>
                                  </template>
                                  <span>{{ file.fileName }}</span>
                                </v-tooltip>
                              </li>
                            </ul>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="5" class="pt-0">
                          <show-file :files="fileAttachments" />
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-row>
            </v-col>

            <!-- danh sach nguoi ky -->
            <v-col cols="12" sm="12" md="5">
              <div class="wrap-history mt-5">
                <h5 class="text-uppercase px-4 pb-4">
                  {{ $t('document.label.usersJoin') }}
                </h5>
                <v-divider />

                <DocumentSigners
                  :histories="docmentDetail.signers"
                  :document-id="docId"
                  @close-dialog="closeDialogSign"
                />
              </div>
            </v-col>
          </v-row>
          <!-- lich su tac dong -->
          <div v-if="groupDocumentScopes.length > 0">
            <v-card-title class="docTitle">
              {{ $t('document.label.scopeUse') }}
            </v-card-title>

            <DialogTemplate :group-document-scopes="groupDocumentScopes" />

          </div>
          <div v-if="checkPromulgateDetail">
            <v-expansion-panels :value="1" accordion>
              <v-expansion-panel>
                <div class="d-flex justify-space-between">
                  <v-col cols="12" sm="10" class="pb-0">
                    <v-card-title class="docTitle pl-0">
                      {{ $t('infoProclaim') }}
                    </v-card-title>
                  </v-col>

                  <v-col cols="12" sm="2" class="pb-0 d-flex align-center">
                    <v-row class="pb-0">
                      <v-col class="d-block pb-0" sm="10" />
                      <v-col sm="1" class="pb-0">
                        <v-expansion-panel-header
                          v-if="checkPromulgateDetail"
                          expand-icon=""
                          :hide-actions="!checkPromulgateDetail"
                        >
                          <template v-slot:default="{ open }">
                            <span
                              v-if="!open"
                              key="0"
                              class="overline text--disabled d-flex justify-end"
                            ><v-icon class="icon"> $expand </v-icon>
                            </span>

                            <span
                              v-else
                              key="1"
                              class="overline text--disabled d-flex justify-end"
                            ><v-icon> mdi-chevron-up </v-icon></span>
                          </template>
                        </v-expansion-panel-header>
                      </v-col>
                    </v-row>
                  </v-col>
                </div>
                <v-expansion-panel-content>
                  <FromulgateInfo :promulgate-detail="promulgateDetail" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <!-- lich su tac dong -->
          <!-- <div v-if="signDocumentHistories.length > 0"> -->
          <div v-if="false">
            <v-expansion-panels :value="1" accordion>
              <v-expansion-panel>
                <div class="d-flex justify-space-between">
                  <v-col cols="12" sm="10" class="pb-0">
                    <v-card-title class="docTitle pl-0">
                      {{ $t('document.impactHistory') }}
                    </v-card-title>
                  </v-col>

                  <v-col cols="12" sm="2" class="pb-0 d-flex align-center">
                    <v-row class="pb-0">
                      <v-col class="d-block pb-0" sm="10" />
                      <v-col sm="1" class="pb-0">
                        <v-expansion-panel-header
                          v-if="signDocumentHistories.length > 0"
                          expand-icon=""
                          :hide-actions="signDocumentHistories.length === 0"
                        >
                          <template v-slot:default="{ open }">
                            <span
                              v-if="!open"
                              key="0"
                              class="overline text--disabled d-flex justify-end"
                            ><v-icon class="icon"> $expand </v-icon>
                            </span>

                            <span
                              v-else
                              key="1"
                              class="overline text--disabled d-flex justify-end"
                            ><v-icon> mdi-chevron-up </v-icon></span>
                          </template>
                        </v-expansion-panel-header>
                      </v-col>
                    </v-row>
                  </v-col>
                </div>
                <v-expansion-panel-content>
                  <DocumentHistory
                    :sign-document-histories="signDocumentHistories"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <v-row v-if="false" class="mx-1 mb-8">
            <!-- comment -->
            <v-col cols="12" sm="12" md="6" class="textField-comment">
              <v-card-title class="docTitle mt-6 pl-0">
                {{ $t('document.discussion') }} (0)
              </v-card-title>
              <validation-provider
                v-slot="{ errors }"
                name="discussion"
                rules="max:500"
              >
                <v-text-field
                  v-model="comment"
                  maxlength="500"
                  counter="500"
                  solo
                  flat
                  :placeholder="$t('document.writeComment')"
                  outlined
                  :error-messages="errors"
                  @change="comment = trimSpace(comment)"
                >
                  <template slot="append">
                    <v-btn icon>
                      <v-icon>mdi-emoticon-happy-outline</v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon>mdi-paperclip</v-icon>
                    </v-btn>
                  </template></v-text-field>
              </validation-provider>
            </v-col>

            <!-- them nguoi theo doi -->
            <v-col v-if="false" cols="12" sm="12" md="6">
              <div class="div-follower mt-12">
                <v-row class="my-4 mx-8 align-center">
                  <span class="text-follower-title mr-8">
                    {{ $t('document.followers') }}
                  </span>
                  <v-btn color="primary" class="ma-2 white--text px-2" rounded>
                    <v-icon> mdi-plus-circle-outline </v-icon>
                    <span class="text-follower-btn">
                      {{ $t('document.addFollowers') }}
                    </span>
                  </v-btn>
                </v-row>
                <v-divider />

                <!-- item nguoi theo doi -->
                <v-row class="ma-6">
                  <div
                    v-for="(item, i) in lstFollowers"
                    :key="i"
                    class="item-follower px-2 mr-4 mb-4"
                  >
                    <span
                      class="item-follower-text"
                    >Lê Minh Hạnh (Username)</span>
                    <v-btn icon>
                      <v-icon> mdi-close </v-icon>
                    </v-btn>
                  </div>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-sheet>
        <v-divider class="mt-2" />
        <div class=" d-flex bottom-btn-detail">
          <v-btn
            class="btn-close"
            color="primary"
            outlined
            rounded
            @click="hideDialog"
          >
            <span class="text-btn"> {{ $t('close') }}</span>
          </v-btn>

          <v-btn
            v-if="showActionReject"
            class="btn-close"
            color="#FF4A55"
            outlined
            rounded
            @click="showConfirmDialogCancelPromulgate = true"
          >
            <span class="text-btn"> {{ $t('cancelProclaim') }}</span>
          </v-btn>
          <v-btn
            v-if="false"
            class="btn-close"
            :outlined="showActionPromulgate"
            rounded
            color="primary"
          >
            <span class="text-btn"> {{ $t('document.tooltip.transfer') }}</span>
          </v-btn>

          <v-btn
            v-if="showActionPromulgate"
            class="btn-close"
            rounded
            color="primary"
            @click="showDialogProclaim = true"
          >
            <span class="text-btn"> {{ $t('proclaim') }}</span>
          </v-btn>
        </div>
      </v-card>

      <!-- Dialog change don vi ban hanh -->
      <DialogChangeUnit
        :formdata="formdata"
        :show-dialog="showDialogChangeUnit"
        @close-dialog="showDialogChangeUnit = false"
        @accept="showDialogConfirm"
      />

      <!-- Dialog confirm change don vi ban hanh-->
      <DialogConfirmChangePromulgate
        :content-confirm="contentConfirm"
        :title-confirm="titleConfirmChange"
        :show-dialog="showConfirmChangeUnit"
        @close-dialog="showConfirmChangeUnit = false"
        @accept-action="acceptChangeUnit"
      />

      <!-- Dialog ky van ban-->
      <DialogSign
        :show-dialog="showDialogSign"
        :document-id="docId"
        :index-open-file-doc="indexOpenFileDoc"
        :current-tab="currentTab"
        @close-dialog="closeDialogSign"
      />
      <!-- Dialog ban hanh van ban -->
      <DialogProclaim
        :show-dialog="showDialogProclaim"
        :proclaim="docmentDetail"
        @close-dialog="showDialogProclaim = false"
        @accept-action="showPopupPromulgate"
      />

      <!-- Dialog confirm van ban ban hanh -->
      <DialogConfirmPromulgate
        :content-confirm="contentConfirm"
        :show-dialog="showConfirmDialogPromulgate"
        @close-dialog="showConfirmDialogPromulgate = false"
        @accept-action="acceptProclaim"
      />

      <DialogConfirmCancelPromulgate
        :show-dialog="showConfirmDialogCancelPromulgate"
        @close-dialog="showConfirmDialogCancelPromulgate = false"
        @accept-action="cancelPromulgateDocument"
      />

      <base-preload :dialog="loading" />
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import DocumentHistory from './components/DocumentHistory'
import DialogTemplate from './components/DialogTemplate'
import DocumentSigners from './components/DocumentSigners'
import DialogChangeUnit from './components/DialogChangeUnit'
import DialogConfirmChangePromulgate from '@/modules/esignature/views/list/components/DialogConfirmChangePromulgate.vue'
import { DocumentService } from '@/modules/esignature/services/documentService'
import statusDocument from '@/modules/esignature/mixins/statusDocument'
import ShowFile from './components/ShowFile'
import DialogSign from '@/modules/esignature/views/sign/SignDocument.vue'
import customsFile from '@/modules/esignature/mixins/customsFile'
import constants from '@/constants'
import { mapActions } from 'vuex'
import DialogConfirmCancelPromulgate from '@/modules/esignature/views/list/components/proclaim/DialogConfirmCancelPromulgate.vue'
import DialogProclaim from '@/modules/esignature/views/list/components/DialogProclaim.vue'
import DialogConfirmPromulgate from '@/modules/esignature/views/list/components/DialogConfirmPromulgate.vue'
import FromulgateInfo from './components/FromulgateInfo'
import routeEsignature from '@/modules/esignature/router/routePaths'

export default {
  name: 'DetailDocument',
  components: {
    Breadcrumbs,
    DocumentSigners,
    DocumentHistory,
    DialogChangeUnit,
    DialogConfirmChangePromulgate,
    ShowFile,
    DialogSign,
    DialogConfirmCancelPromulgate,
    DialogProclaim,
    DialogConfirmPromulgate,
    FromulgateInfo,
    DialogTemplate
  },
  mixins: [statusDocument, customsFile],
  data() {
    return {
      checkChangeUnit: false,
      docId: null,
      histories: null,
      lstFollowers: [1, 2, 3, 4, 5, 6, 7],
      comment: '',
      showDialogChangeUnit: false,
      showConfirmChangeUnit: false,
      titleConfirmChange: 'document.titleConfirm.confirmChangeUnit',
      docmentDetail: null,
      loading: false,
      showDialogSign: false,
      indexOpenFileDoc: 0,
      opened: 0,
      signDocumentHistories: [],
      formdata: {
        promulgateGroupId: null,
        documentId: null,
        registerNumber: null,
        formulaTypeId: null,
        secureTypeId: null,
        promulgateDate: null
      },
      showIcons: [],
      linkBack: '',
      showDialogProclaim: false,
      showConfirmDialogCancelPromulgate: false,
      dataPromulgate: null,
      showConfirmDialogPromulgate: false,
      contentConfirm: null,
      promulgateDetail: null,
      first: true,
      groupDocumentScopes: [],
      currentTab: null,
      lstDocState: [constants.DOC_STATES.PROMULGATE, constants.DOC_STATES.PROMULGATE_CANCEL]
    }
  },
  computed: {
    breadcrumbs() {
      const check = localStorage.getItem(
        constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN
      )
      let linkHref = 'created'
      let title = 'electronicSign.textSubmit'
      let titleDatail = 'electronicSign.documentDetail'
      var tab = null
      if (check === constants.SEARCH_TYPE_DOC.PROCESS_DOC_ALL) {
        tab = 0
        linkHref = `process?currenTab=${tab}`
        title = 'document.documentProcess'
      }
      if (check === constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN) {
        tab = 1
        linkHref = `process?currenTab=${tab}`
        title = 'document.documentProcess'
      }
      if (check === constants.SEARCH_TYPE_DOC.PROCESS_DOC_REVIEW) {
        tab = 2
        linkHref = `process?currenTab=${tab}`
        title = 'document.documentProcess'
      }
      if (check === constants.SEARCH_TYPE_DOC.PROCESSED_DOC_PROMULGATE) {
        linkHref = 'proclaim'
        title = 'documentProclaim'
      }
      if (check === constants.SEARCH_TYPE_DOC.TEMPLATE) {
        linkHref = 'flows'
        title = 'flowTitle'
        titleDatail = 'electronicSign.flowDetail'
      }

      this.backTolist(linkHref, tab)
      return [
        {
          text: title,
          disabled: false,
          href: this.linkBack
        },
        {
          text: `${this.$t(titleDatail)}: ${
            this.documentTitle
          }`,
          disabled: true,
          tooltip: false
        }
      ]
    },
    documentTitle() {
      if (this.docmentDetail && this.docmentDetail.documentTitle) {
        return this.customDocumentTitle(this.docmentDetail.documentTitle)
      }
      return ''
    },
    checkFlowTemplate() {
      const check = localStorage.getItem(
        constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN
      )
      return (check !== constants.SEARCH_TYPE_DOC.TEMPLATE)
    },
    showListFile() {
      return (
        this.docmentDetail.mainFiles.length > 1 ||
        this.docmentDetail.fileAttachments.length > 1
      )
    },
    fileMainSign() {
      const arrFile = this.docmentDetail.mainFiles
      const arr = arrFile.slice(1)
      return arr
    },
    fileAttachment() {
      const arrFile = this.docmentDetail.fileAttachments
      const arr = arrFile.slice(0, 1)
      return arr
    },
    fileAttachments() {
      const arrFile = this.docmentDetail.fileAttachments
      const arr = arrFile.slice(1)
      return arr
    },
    showIconSign() {
      const lstApprove = constants.LIST_ACTIONS_DETAIL.SIGN
      var show = false
      if (this.showIcons && this.showIcons.includes(lstApprove)) {
        show = true
      }
      return show
    },
    showActionChange() {
      const lstApprove = constants.LIST_ACTIONS_DETAIL.CHANGE_PROMULGATE_GROUP
      var show = false
      if (this.showIcons && this.showIcons.includes(lstApprove)) {
        show = true
      }
      return show
    },
    showActionReject() {
      const lstApprove = constants.LIST_ACTIONS_DETAIL.PROMULGATE_CANCEL
      var show = false
      if (this.showIcons && this.showIcons.includes(lstApprove)) {
        show = true
      }
      return show
    },
    showActionTransfer() {
      const lstApprove = constants.LIST_ACTIONS_DETAIL.TRANSFER
      var show = false
      if (this.showIcons && this.showIcons.includes(lstApprove)) {
        show = true
      }
      return !show
    },
    showActionPromulgate() {
      const lstApprove = constants.LIST_ACTIONS_DETAIL.PROMULGATE
      var show = false
      if (this.showIcons && this.showIcons.includes(lstApprove)) {
        show = true
      }
      return show
    },
    checkPromulgateDetail() {
      let check = false
      if (this.promulgateDetail) {
        check = true
      }
      return check
    }
  },
  beforeDestroy() {
    localStorage.setItem(constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN, null)
  },
  async created() {
    await this.getDetailDocument()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),

    // huy ban hanh
    async cancelPromulgateDocument(reason) {
      try {
        const data = { documentId: this.docmentDetail.id, reasonCancel: reason }
        await DocumentService.cancelPromulgateDocument(data)
        var message = 'document.messageSuccess.cancelPromulgateDocument'
        this.setNotify({
          show: true,
          type: 'success',
          content: this.$t(message)
        })
        this.getDetailDocument()
      } catch (error) {
        this.isShowAlert = true
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      }
    },
    async warningChangeGroup(data) {
      try {
        const response = await DocumentService.warningPromulgate(data)
        this.contentConfirm = response.data
      } catch (error) {
        this.isShowAlert = true
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      }
    },
    // ban hanh
    async showPopupPromulgate(formData) {
      this.dataPromulgate = formData
      this.dataPromulgate.documentId = this.docmentDetail.id
      const data = {
        documentId: this.docmentDetail.id,
        promulgateGroupId: formData.promulgateGroupId,
        registerNumber: formData.documentNumber || null,
        docType: 1,
        securityTypeId: formData.secureTypeId,
        promulgateDate: formData.promulgateDate ? formData.promulgateDate.replaceAll('/', '') : null
      }
      if (formData.documentNumber) {
        await this.warningChangeGroup(data)
      }
      this.showConfirmDialogPromulgate = true
    },
    // ban hanh
    async acceptProclaim() {
      try {
        await DocumentService.saveDocumentPromulgate(this.dataPromulgate)
        var message = 'document.messageSuccess.promulgateDocument'
        this.setNotify({
          show: true,
          type: 'success',
          content: this.$t(message)
        })
        this.showDialogProclaim = false
        this.getDetailDocument()
      } catch (error) {
        this.isShowAlert = true
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      }
    },

    onShowDialogProclaim(documentIdSign) {
      this.documentIdSign = documentIdSign
      this.showDialogProclaim = true
    },
    backTolist(href, tab) {
      this.linkBack = `${routeEsignature.DOCUMENT_LIST_PATH}/${href}`
      this.currentTab = tab
    },
    hideDialog() {
      return this.$router.push(this.linkBack).catch(() => {})
    },
    showIconFile(listSigner) {
      const userInfo = JSON.parse(localStorage.getItem(constants.USER_INFO))
      var signer = listSigner.signers.find((item) => {
        return item.userId === userInfo.userId
      })
      let checkUnprogess = false
      if (
        signer &&
        signer.groupLevel >= signer.currentStep &&
        signer.processStatus === constants.SIGN_PROCCESS_STATUS.UNPROCESSED &&
        signer.state === constants.DOC_STATES.IN_PROGRESS
      ) {
        checkUnprogess = true
      }
      return checkUnprogess
    },
    // load thong tin ban hanh
    async getPromulgateInfo() {
      try {
        const response = await DocumentService.getPromulgateInfo(this.docId)
        this.promulgateDetail = response.data
        this.formdata.secureTypeId = this.docmentDetail.secureTypeId
        this.first = false
      } catch (error) {
        this.isShowAlert = true
        this.messages = error
      }
    },
    async getDetailDocument() {
      try {
        this.loading = true
        this.showIcons = []
        this.docId = parseInt(this.$route.params.documentId)
        var response
        if (
          localStorage.getItem(constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN) ===
          constants.SEARCH_TYPE_DOC.TEMPLATE
        ) {
          response = await DocumentService.getDetailDocTemplate(this.docId)
        } else {
          response = await DocumentService.getDetailDocument(this.docId)
        }
        this.docmentDetail = response.data
        if (
          this.docmentDetail.signDocumentHistories &&
          this.docmentDetail.signDocumentHistories.length > 0
        ) {
          this.signDocumentHistories = this.docmentDetail.signDocumentHistories
        }
        if (this.docmentDetail && this.docmentDetail.showIcons.length > 0) {
          this.showIcons = this.docmentDetail.showIcons
        }
        if (this.docmentDetail.groupDocumentScopes) {
          this.groupDocumentScopes = this.docmentDetail.groupDocumentScopes
        }
        this.formdata.formulaTypeId = this.docmentDetail.formulaTypeId

        this.formdata.promulgateGroupId = this.docmentDetail.promulgateGroupId
        this.formdata.registerNumber = this.docmentDetail.registerNumber || null
        this.loading = false
        if (this.docmentDetail && this.lstDocState.includes(this.docmentDetail.docState)) {
          this.getPromulgateInfo()
        }
      } catch (error) {
        if (this.checkChangeUnit) {
          return this.$router.push(this.linkBack).catch(() => {})
        }
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
        this.loading = false
      }
    },

    dialogChangeUnit() {
      this.formdata.promulgateGroupId = this.docmentDetail.promulgateGroupId
      this.formdata.registerNumber = this.docmentDetail.registerNumber
      this.showDialogChangeUnit = true
    },

    // show dialog confirm change unit.
    async showDialogConfirm() {
      const data = {
        documentId: this.docmentDetail.id,
        promulgateGroupId: this.formdata.promulgateGroupId,
        registerNumber: this.formdata.registerNumber || null,
        docType: 1,
        securityTypeId: this.formdata.secureTypeId,
        promulgateDate: this.formdata.promulgateDate ? this.formdata.promulgateDate.replaceAll('/', '') : null
      }
      if (this.formdata.registerNumber) {
        await this.warningChangeGroup(data)
      }
      this.showConfirmChangeUnit = true
    },

    // accept change unit.
    async acceptChangeUnit() {
      try {
        this.checkChangeUnit = false
        this.showDialogChangeUnit = false
        const formGroup = {
          documentId: this.docmentDetail.id,
          promulgateGroupId: this.formdata.promulgateGroupId,
          registerNumber: parseInt(this.formdata.registerNumber)
        }
        await DocumentService.changePromulgate(formGroup)

        var message = this.$t('document.messageSuccess.changeFromulgate')
        this.setNotify({
          show: true,
          type: 'success',
          content: this.$t(message)
        })
        this.checkChangeUnit = true
        setTimeout(() => {
          this.getDetailDocument()
        }, 1500)
      } catch (error) {
        this.checkChangeUnit = false
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      }
    },

    // gen creator
    genCreator(item) {
      var positionName = item.positionName ? `${item.positionName}. ` : ''
      var email = item.email ? item.email : ''
      var phone = item.phone ? `-${item.phone}` : ''
      return `${positionName} ${item.fullName} (${email}${phone})`
    },

    // Click item file sign.
    clickFileDoc(index) {
      this.indexOpenFileDoc = index
      this.showDialogSign = true
    },
    // Dong dialog ky van ban
    closeDialogSign(isSignDoc) {
      this.showDialogSign = false
      if (isSignDoc) this.getDetailDocument()
    }
  }
}
</script>

<style src="./DetailDocument.scss" lang="scss" />
