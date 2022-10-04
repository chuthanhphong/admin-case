<template>
  <v-sheet
    id="scrolling-techniques-3"
    class="overflow-y-auto edocument-height-detail"
    :min-height="documentDetail ? '' : '75vh'"
  >
    <div v-if="documentDetail" class="detail-management">
      <v-row class="ma-1">
        <v-col cols="12" sm="12" md="7">
          <v-row>
            <v-col cols="12" sm="8" class="py-3">
              <label class="docTitle">
                {{ $t('managementDoc.documentDetail') }}
              </label>
            </v-col>
            <v-col
              v-if="documentDetail && documentDetail.documentPromulgate"
              cols="12"
              sm="4"
              class="py-3 d-flex justify-end pr-7"
            >
              <div class="number-document">
                <span class="text-number">{{
                  $t('managementDoc.documentCode')
                }}</span>
                &nbsp;
                <span class="code-number">{{
                  documentDetail.documentPromulgate.documentNumber
                }}</span>
                &nbsp;
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="documentDetail.signers" cols="12" sm="12" md="5">
          <v-row>
            <v-col cols="12" class="py-3">
              <label class="doc-label">
                {{ $t('managementDoc.usersJoin') }}
              </label>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="ma-2 mt-0">
        <v-col cols="12" sm="12" md="7" class="border-right-detail">
          <!-- ten van ban -->
          <v-row>
            <v-col cols="12" sm="12" class="pt-0">
              <label class="doc-label">
                {{ $t('managementDoc.detail.documentTitle') }}
              </label>

              <div class="doc-content">
                <span class="edoc-text--button">
                  {{ documentDetail.documentTitle }}</span>
              </div>
            </v-col>
          </v-row>

          <!-- loai van ban || hinh thuc van ban -->
          <v-row class="mt-2 d-flex justify-space-between">
            <v-col cols="12" sm="5">
              <label class="doc-label">
                {{ $t('managementDoc.detail.documentType') }}
              </label>
              <div class="doc-content">
                <span class="edoc-text--button">
                  {{ $t(genDoctype(documentDetail)) }}</span>
              </div>
            </v-col>

            <v-col cols="12" sm="5">
              <label class="doc-label">
                {{ $t('managementDoc.detail.formulaType') }}
              </label>
              <div class="doc-content">
                <span class="edoc-text--button">{{
                  documentDetail.formulaTypeName
                }}</span>
              </div>
            </v-col>
          </v-row>

          <!-- ngay tao || nguoi tao -->
          <v-row class="mt-2 d-flex justify-space-between">
            <v-col cols="12" sm="5">
              <label class="doc-label">
                {{ $t('managementDoc.detail.createDate') }}
              </label>
              <div class="d-flex justify-space-between doc-content">
                <span class="edoc-text--button">{{
                  documentDetail.createDate
                }}</span>
              </div>
            </v-col>

            <v-col cols="12" sm="5">
              <label class="doc-label">
                {{ $t('managementDoc.detail.creator') }}
              </label>
              <div class="edoc-text--button doc-content">
                <div>
                  {{ genCreator(documentDetail.creator) }}
                </div>
                <div>
                  {{ documentDetail.creator.groupName }}
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- file ky -|- file dinh kem -->
          <v-row class="d-flex justify-space-between my-2">
            <v-expansion-panels :value="opened" accordion>
              <v-expansion-panel>
                <div class="d-flex justify-space-between">
                  <v-col cols="12" sm="5" class="pb-0">
                    <label class="doc-label">
                      {{ $t('contract.label.fileSign') }}
                    </label>
                    <div class="d-flex mt-2 align-center">
                      <v-tooltip
                        top
                        content-class="tooltip-top"
                        max-width="30%"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <img class="icon-sign" src="@/assets/icons/pdf.svg" />
                          <span
                            class="doc-text-file edoc-text--button"
                            v-bind="attrs"
                            v-on="on"
                            @click="clickFileDoc(0)"
                          >
                            {{
                              customFileNameHeader(
                                documentDetail.fileMainSigns[0]
                              )
                            }}
                          </span>
                        </template>
                        <span>{{
                          documentDetail.fileMainSigns[0].fileName
                        }}</span>
                      </v-tooltip>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="5" class="pb-0">
                    <v-row>
                      <v-col cols="12" sm="10" class="pb-0">
                        <label class="doc-label">
                          {{ $t('contract.attachmentsFile') }}
                        </label>
                        <show-file class="mt-2" :files="fileAttachment" />
                      </v-col>

                      <v-col cols="12" sm="2" class="pb-1 pr-0">
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
                        <ul class="list-files mt-1">
                          <li
                            v-for="(file, index) of fileMainSign"
                            :key="index"
                            @click="clickFileDoc(index + 1)"
                          >
                            <v-tooltip
                              top
                              content-class="tooltip-top"
                              max-width="30%"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <img
                                  :src="getIconFile(`${file.fileName}`)"
                                  class="icon-sign"
                                />
                                <span
                                  class="doc-text-file edoc-text--button"
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
          <!-- thong tin ban hanh -->
          <div v-if="checkPromulgateDetail">
            <v-expansion-panels :value="0" accordion>
              <v-expansion-panel>
                <div class="d-flex justify-space-between">
                  <v-col cols="12" sm="10" class="pa-0">
                    <v-card-title class="docTitle pl-0">
                      {{ $t('managementDoc.formulgate') }}
                    </v-card-title>
                  </v-col>

                  <v-col cols="12" sm="2" class="pb-0">
                    <v-row class="pb-0 d-flex justify-end">
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
                  <PromulgateDetail :document-detail="documentDetail" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-col>

        <!-- danh sach nguoi ky -->
        <v-col cols="12" sm="12" md="5" class="pt-0">
          <div v-if="documentDetail.signers" class="wrap-history">
            <DocumentSigners :histories="documentDetail.signers" />
          </div>
          <div v-else class="justify-center d-flex mt-5">
            <v-img src="@/assets/imgs/add-group.svg" max-width="350" />
          </div>
        </v-col>
      </v-row>
    </div>
  </v-sheet>
</template>

<script>
import customsFile from '@/modules/edocument/mixins/customsFile'
import ShowFile from './ShowFile'
import DocumentSigners from './DocumentSigners'
import constants from '@/constants'
import PromulgateDetail from './PromulgateDetail'

export default {
  name: 'TabDetail',
  components: {
    ShowFile,
    DocumentSigners,
    PromulgateDetail
  },
  mixins: [customsFile],
  props: {
    documentDetail: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      opened: 0
    }
  },
  computed: {
    showListFile() {
      return (
        this.documentDetail.fileMainSigns.length > 1 ||
        this.documentDetail.fileAttachments.length > 1
      )
    },
    fileMainSign() {
      const arrFile = this.documentDetail.fileMainSigns
      const arr = arrFile.slice(1)
      return arr
    },
    fileAttachment() {
      const arrFile = this.documentDetail.fileAttachments
      const arr = arrFile.slice(0, 1)
      return arr
    },
    fileAttachments() {
      const arrFile = this.documentDetail.fileAttachments
      const arr = arrFile.slice(1)
      return arr
    },
    checkPromulgateDetail() {
      let check = false
      if (this.documentDetail && this.documentDetail.documentPromulgate) {
        check = true
      }
      return check
    }
  },
  watch: {},
  methods: {
    genCreator(item) {
      var positionName = item.positionName ? `${item.positionName}. ` : ''
      var email = item.email ? item.email : ''
      var phone = item.phone ? `-${item.phone}` : ''
      return `${positionName} ${item.fullName} (${email}${phone})`
    },
    genDoctype(item) {
      let text = 'managementDoc.detail.documnetSend'
      if (item.docType !== constants.DOC_TYPE.SEND) {
        text = 'managementDoc.detail.documentRevecied'
      }
      return text
    },
    clickFileDoc(index) {
      this.$emit('goto-sign', index)
    }
  }
}
</script>

<style lang="scss">
.list-files {
  list-style: none;
  padding: 0 !important;
  li {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .icon-file-pdf {
    color: #fc1405;
    padding-right: 10px;
  }
}
.number-document {
  box-sizing: border-box;
  border: 1px solid #ff4a55;
  border-radius: 5px;
  display: inline-block;
  padding: 4px;
  left: calc(50% - 121px / 2 + 21px);
  top: calc(50% - 36px / 2 - 906.5px);
  .text-number {
    background: #ff4a55;
    border-radius: 20px;
    color: #fff;
    text-align: center;
    padding: 2px 10px;
    flex-grow: 0;
    text-transform: capitalize;
    align-items: center;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
  }
  .code-number {
    align-items: center;
    text-transform: capitalize;
    color: #22242c;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
  }
}
</style>
