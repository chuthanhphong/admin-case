<template>
  <div class="col-md-12 form-group pa-0">
    <v-layout class="content-replace-document" wrap>
      <div class="col-sm-12 pa-0">
        <v-scroll-y-transition>
          <v-simple-table class="elevation-2" dense fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center" style="width: 4%">STT</th>
                  <th class="text-left" style="width: 10%">
                    {{ $t('numSymbol') }}
                  </th>
                  <th class="text-left" style="width: 25%">
                    {{ $t('docName') }}
                  </th>
                  <th class="text-left" style="width: 25%">
                    {{ $t('constructionGroup') }}
                  </th>
                  <th class="text-left" style="width: 15%">
                    {{ $t('expiryDate') }}
                  </th>
                  <th class="text-center" style="width: 10%">
                    {{ $t('contract.label.fileSign') }}
                  </th>
                  <th class="text-center" style="width: 10%">
                    {{ $t('contract.attachmentsFile') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in replaceDocuments" :key="index">
                  <!-- STT -->
                  <td class="text-center edoc-text--button">
                    <div class="my-2">{{ index + 1 }}</div>
                  </td>
                  <!-- So ky hieu -->
                  <td class="text-left">
                    <div class="maxline2">
                      {{ item.code }}
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
                    <div class="edoc-text--caption black-1">
                      {{ item.formulaName }}
                    </div>
                  </td>

                  <!-- Don vi -->
                  <td class="text-left">
                    <div v-if="item.submissionGroup" class="d-flex">
                      <v-tooltip
                        top
                        content-class="tooltip-top"
                        max-width="30%"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" class="maxline2" v-on="on">
                            {{ item.submissionGroup.groupName }}
                          </div>
                        </template>
                        <span>{{ item.submissionGroup.groupName }}</span>
                      </v-tooltip>
                    </div>
                  </td>

                  <!-- han su dung -->
                  <td class="text-left">
                    <div v-if="item.expireDate">
                      {{ item.expireDate }}
                    </div>
                  </td>

                  <td class="text-center edoc-text--button">
                    <v-row class="d-flex justify-center">
                      <!-- File trinh ky -->
                      <!-- Icon file pdf -->
                      <div class="lg-4">
                        <v-tooltip
                          v-if="item.mainSignFiles"
                          left
                          content-class="tooltip-left"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              v-bind="attrs"
                              v-on="on"
                              @click="downloadFile(item.mainSignFiles[0])"
                            >
                              <img
                                src="@/assets/icons/pdf.svg"
                                alt=""
                                srcset=""
                              />
                            </v-btn>
                          </template>
                          <span>{{ item.mainSignFiles[0].fileName }}</span>
                        </v-tooltip>
                      </div>
                      <!-- show list khi co nhieu file trinh ky -->
                      <div class="lg-4" style="width: 20%">
                        <span class="file-signer-show">
                          <v-menu
                            v-if="
                              item.mainSignFiles &&
                                item.mainSignFiles.length > 1
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
                                  {{ $t('listSignDocFile') }}
                                  ({{ item.mainSignFiles.length }})
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
                                  v-for="(file, i) in item.mainSignFiles"
                                  :key="`${i}-${file.id}`"
                                  class="py-0"
                                  @click="downloadFile(file)"
                                >
                                  <v-tooltip
                                    top
                                    content-class="tooltip-top"
                                    max-width="30%"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
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
                    </v-row>
                  </td>

                  <td class="text-center edoc-text--button">
                    <v-row class="d-flex justify-center">
                      <!-- File trinh ky -->
                      <!-- Icon file pdf -->
                      <div class="lg-4">
                        <v-tooltip
                          v-if="item.attachmentFiles"
                          left
                          content-class="tooltip-left"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              v-bind="attrs"
                              v-on="on"
                              @click="downloadFile(item.attachmentFiles[0])"
                            >
                              <img
                                :src="
                                  getIconFile(
                                    `${item.attachmentFiles[0].fileName}`
                                  )
                                "
                              />
                            </v-btn>
                          </template>
                          <span>{{ item.attachmentFiles[0].fileName }}</span>
                        </v-tooltip>
                      </div>
                      <!-- show list khi co nhieu file trinh ky -->
                      <div class="lg-4" style="width: 20%">
                        <span class="file-signer-show">
                          <v-menu
                            v-if="
                              item.attachmentFiles &&
                                item.attachmentFiles.length > 1
                            "
                            v-model="item.showFileAttachment"
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
                                  ({{ item.attachmentFiles.length }})
                                </h6>
                                <v-icon
                                  class="close-dialog ml-3"
                                  color="black"
                                  @click="onCloseMenuAttach(item)"
                                >
                                  mdi-close
                                </v-icon>
                              </v-card-title>
                              <v-divider />
                              <v-list class="pa-0 list-scroll">
                                <v-list-item
                                  v-for="(file, i) in item.attachmentFiles"
                                  :key="`${i}-${file.id}`"
                                  class="py-0"
                                  @click="downloadFile(file)"
                                >
                                  <v-tooltip
                                    top
                                    content-class="tooltip-top"
                                    max-width="30%"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
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
                    </v-row>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-scroll-y-transition>
      </div>
    </v-layout>
    <dialog-view-pdf
      :src-file-pdf="srcFilePdf"
      :show-dialog="showDialogViewPdf"
      @close-dialog="showDialogViewPdf = false"
    />
    <base-preload :dialog="loading" />
  </div>
</template>

<script>
import { FileService } from '@/modules/edocument/services/fileService'
import customsFile from '@/modules/edocument/mixins/customsFile'
import DialogViewPdf from '@/views/components/DialogViewPdf.vue'

export default {
  components: { DialogViewPdf },
  mixins: [customsFile],
  props: {
    replaceDocuments: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      filterUser: null,
      countLstUser: 0,
      loading: false,
    }
  },
  watch: {},
  mounted() {},
  methods: {
    renderScopes(groupDocumentScope) {
      if (groupDocumentScope && groupDocumentScope.length > 1) {
        return groupDocumentScope
          .map(scope => {
            if (!scope) return ''
            return `<div>${scope}</div>`
          })
          .join('')
      }
      return groupDocumentScope[0]
    },
    async viewFilePdf(file) {
      if (!file.url) {
        const urlFile = await FileService.download({
          fileName: file.fileName,
          storage: file.storage,
          filePath: file.filePath
        })
        this.srcFilePdf = urlFile
      } else {
        this.srcFilePdf = file.url
      }
      this.showDialogViewPdf = true
    },
    // Tai file dinh kem
    async downloadFileAttach(file, item) {
      if (item.showMenu) {
        item.showMenu = false
      }
      if (item.showFileAttachment) {
        item.showFileAttachment = false
      }
      this.loading = true
      try {
        if (file.fileName.includes('.pdf')) {
          await this.viewFilePdf(file)
        } else {
          await FileService.downloadFile({
            fileName: file.fileName,
            storage: file.storage,
            filePath: file.filePath
          })
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.loading = false
      }
    },
    onCloseMenu(item) {
      return !item.showMenu
    },
    onCloseMenuAttach(item) {
      return !item.showFileAttachment
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card__title {
  word-break: normal;
}
.signer-item {
  .v-input__slot {
    background: #fff !important;

    .v-input--selection-controls__input {
      margin-right: 0px !important;
    }
  }
}
</style>
