<template>
  <div class="wrap-tab-transfer">
    <p class="mt-6 title-tab-transfer">
      {{ $t('listReason') }}
    </p>
    <v-layout class="content-transfer-document" wrap>
      <div v-if="listTranferReceive.length > 0" class="col-sm-12 pa-0 ">
        <v-scroll-y-transition>
          <v-simple-table class="elevation-2" dense fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center edoc-text--button" style="width: 4%">
                    STT
                  </th>
                  <th class="text-left edoc-text--button" style="width: 17%">
                    {{ $t('managementDoc.detail.dateReceive') }}
                  </th>
                  <th class="text-left edoc-text--button" style="width: 15%">
                    {{ $t('managementDoc.detail.userTransfer') }}
                  </th>
                  <th class="text-left edoc-text--button" style="width: 10%">
                    {{ $t('managementDoc.detail.priorityReceive') }}
                  </th>
                  <th class="text-left edoc-text--button" style="width: 40%">
                    {{ $t('managementDoc.detail.reasonReceive') }}
                  </th>
                  <th class="text-left edoc-text--button" style="width: 10%">
                    {{ $t('contract.attachmentsFile') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in listTranferReceive" :key="index">
                  <!-- STT -->
                  <td class="text-center edoc-text--button">
                    <div class="my-2">{{ index + fromRecord }}</div>
                  </td>

                  <!-- thoi gian nhan -->
                  <td class="text-left" :class="isUserIsRevoked(item)">
                    {{ item.sendDate }}
                  </td>

                  <!-- nguoi chuyen -->
                  <td class="text-left">
                    <div class="d-flex">
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

                  <!-- hinh thuc nhan -->
                  <td class="text-left" :class="isUserIsRevoked(item)">
                    {{ $t(genLevelType(item.actionLevelType)) }}
                  </td>

                  <!-- y kien nhan duoc -->
                  <td class="text-left">
                    <div class="d-flex">
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
                  <!-- file dinh kem -->
                  <td
                    class="text-left"
                    :class="item.documentActionStatus === 0 ? 'd-none' : ''"
                  >
                    <v-row
                      v-if="item.filesAttachment.length > 0"
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
                                  {{ $t('managementDoc.detail.listFileAttach') }}
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
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-scroll-y-transition>
      </div>
    </v-layout>
    <div v-if="listTranferReceive.length > 0" class="mt-5 mx-2 px-8 pb-5">
      <base-paging
        :page="page"
        :total-pages="totalPages"
        :from-record="fromRecord"
        :to-record="toRecord"
        :total-records="totalRecords"
        @on-change-page="onChangePage"
      />
    </div>
    <dialog-view-pdf
      :src-file-pdf="srcFilePdf"
      :show-dialog="showDialogViewPdf"
      @close-dialog="showDialogViewPdf = false"
    />

    <base-preload :dialog="loadingViewFile" />
  </div>
</template>

<script>
import pagingData from '@/mixins/paging'
import { DocumentService } from '@/modules/edocument/services/documentService'
import config from '@/config'
import DialogViewPdf from '@/views/components/DialogViewPdf.vue'
import customsFile from '@/modules/edocument/mixins/customsFile'
import { FileService } from '@/modules/edocument/services/fileService'
import constants from '@/constants'
import { mapActions } from 'vuex'

export default {
  components: { DialogViewPdf },
  mixins: [pagingData, customsFile],
  props: {
    showTable: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formdata: {
        page: 1,
        pageSize: config.app.paging.pageSize
      },
      listTranferReceive: [],
      loadingViewFile: false,
    }
  },
  created() {
    this.searchListReceive()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),

    isUserIsRevoked(item) {
      if (item.documentActionStatus === 0) {
        return 'revoked-user'
      }
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
      this.loadingViewFile = true
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
        this.loadingViewFile = false
      }
    },
    genLevelType(levelType) {
      let text = 'managementDoc.transfer.user'
      if (levelType === constants.EDOCUMENT.GROUP_TREE) {
        text = 'managementDoc.transfer.group'
      }
      return text
    },
    onCloseMenu(item) {
      return !item.showMenu
    },
    onChangePage(page) {
      this.formdata.page = page
      this.page = page
      this.searchListReceive()
    },
    async searchListReceive() {
      try {
        this.documentId = parseInt(this.$route.params.documentId)
        this.formdata.documentId = this.documentId
        const response = await DocumentService.getListReceiveUser(
          this.formdata
        )
        this.listTranferReceive = response.data.data
        this.renderPaging(response.data)
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.v-card__title {
  word-break: normal;
}
</style>
