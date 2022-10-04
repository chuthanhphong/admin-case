<template>
  <div>
    <!-- Search -->
    <SearchDocumentProcess
      :claszz="showDialogSign"
      :formdata="formdata"
      :search-document="searchDocument"
      :change-show-advance="changeShowAdvance"
      :type="type"
    />

    <!-- Table -->
    <v-layout wrap>
      <div class="col-sm-12 px-0 pt-0">
        <div class="text-center mt-4 mb-2 esignature-content-list-process">
          <v-scroll-y-transition>
            <v-simple-table dense fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center stt">STT</th>
                    <th class="text-left document-name">
                      {{ $t('electronicSign.labelSearch') }}
                    </th>
                    <th class="text-left textForm">
                      {{ $t('electronicSign.textForm') }}
                    </th>
                    <th class="text-left urgency">
                      {{ $t('electronicSign.urgency') }}
                    </th>
                    <th class="text-left indexTable signer">
                      {{ $t('electronicSign.signer') }}
                    </th>
                    <th class="text-left textStatus">
                      {{ $t('electronicSign.textStatus') }}
                    </th>
                    <th class="text-left processingProgress">
                      {{ $t('electronicSign.processingProgress') }}
                    </th>
                    <th class="text-left processStatus">
                      {{ $t('document.label.processStatus') }}
                    </th>
                    <th class="text-left dateCreated">
                      {{ $t('document.label.activity') }}
                    </th>
                    <th class="text-center action">
                      {{ $t('electronicSign.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody :class="{ 'disable-hover': activeIndex != null }">
                  <div v-if="listDocument.length == 0">
                    <div class="no-data-table">
                      {{ $t('noData') }}
                    </div>
                  </div>
                  <tr v-for="(item, index) in listDocument" v-else :key="index">
                    <!-- STT -->
                    <td class="text-center">
                      <div class="my-2">{{ index + fromRecord }}</div>
                    </td>

                    <!-- Ten van ban trinh ky -->
                    <td
                      class="text-left link-hover"
                      @click="showDetail(item.documentId)"
                    >
                      <div class="btn d-flex">
                        <v-tooltip
                          top
                          content-class="tooltip-top"
                          max-width="30%"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" class="maxline2" v-on="on">
                              {{ item.documentTitle }}
                            </div> </template><span>{{ item.documentTitle }}</span>
                        </v-tooltip>
                      </div>
                      <div class="caption grey--text darken-3">
                        {{ $t('document.label.dateFormProcess') }}:
                        {{ item.sendDate }}
                      </div>
                    </td>

                    <!-- Hinh thuc van ban -->
                    <td class="text-left">{{ item.formulaName }}</td>

                    <!-- Do khan -->
                    <td class="text-left">{{ item.priorityName }}</td>

                    <!-- Avatar -->
                    <td class="text-left link-hover" :class="{ 'popup-acvite': activeIndex == index }">
                      <div
                        v-if="item.signers.length === 1"
                        class="group-avatar-signer"
                      >
                        <popup-signer
                          :list-show-popup="listShowPopup"
                          :lst-colors="lstColors"
                          :item="item"
                          :active-index="activeIndex"
                          :index="index"
                          @close-popup-signer="closePopupSigner"
                        />
                        <div class="group-avatar d-flex align-center">
                          <avatar-signer
                            :lst-colors="lstColors"
                            :item="item"
                            :index-row="index"
                            class="list-signer"
                            @active-show-popup-signer="activeShowPopupSigner"
                          />
                          <span class="render-signer-name">
                            {{ renderGroupName(item.signers[0]) }}
                          </span>
                        </div>
                      </div>
                      <div
                        v-else
                        class="group-avatar-signer"
                      >
                        <popup-signer
                          :list-show-popup="listShowPopup"
                          :lst-colors="lstColors"
                          :item="item"
                          :active-index="activeIndex"
                          :index="index"
                          @close-popup-signer="closePopupSigner"
                        />
                        <div class="group-avatar d-flex align-center">
                          <list-avatar-signer
                            :lst-colors="lstColors"
                            :item="item"
                            :index-row="index"
                            class="list-signer"
                            @active-show-popup-signer="activeShowPopupSigner"
                          />
                          <v-avatar
                            v-if="item.signers.length > 5"
                            size="32"
                            :color="lstColors[4]"
                            class="signer"
                            @click="activeShowPopupSigner(index)"
                          >
                            <span
                              class="text-uppercase white--text"
                            >{{ item.signers.length - 4 }}+</span>
                          </v-avatar>
                        </div>
                      </div>
                    </td>
                    <td class="text-left">
                      <span v-html="documentState(item.docState)" />
                    </td>
                    <!-- Tien do xu ly -->
                    <td class="text-left">
                      <div class="d-flex align-center">
                        <v-progress-linear
                          class="process-inProcess mr-2"
                          :buffer-value="item.totalSigner"
                          :value="valueProgress(item)"
                          :color="colorProgess(item.docState)"
                          height="8"
                        />
                        <span>
                          {{ item.totalSignerProcessed }}/
                          {{ item.totalSigner }}
                        </span>
                      </div>
                    </td>
                    <!-- Trang thai xu ly -->
                    <td class="text-left">
                      <span v-html="rednderIcon(item)" />

                      <span class="pl-2">{{
                        $t(renderStatusProcess(item))
                      }}</span>
                    </td>

                    <!-- Ngay thao tac -->
                    <td class="text-left">
                      {{ createdDate(item.createdDate) }}
                    </td>

                    <!-- Thao tac -->
                    <td class="text-left d-flex align-center">
                      <v-container>
                        <v-row class="d-flex justify-end">
                          <!-- Icon file pdf -->
                          <div class="lg-4">
                            <v-tooltip
                              v-if="item.mainSigningFiles"
                              left
                              content-class="tooltip-left"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="gotoSign(item.documentId)"
                                >
                                  <img
                                    v-if="!checkIcon(item)"
                                    src="@/assets/icons/pdf.svg"
                                    alt=""
                                    srcset=""
                                  >
                                  <img
                                    v-else
                                    src="@/assets/icons/sign/iconSign.svg"
                                    alt=""
                                    srcset=""
                                  >
                                </v-btn>
                              </template>
                              <span>{{
                                item.mainSigningFiles[0].fileName
                              }}</span>
                            </v-tooltip>
                          </div>
                          <div class="lg-4" style="width: 20%">
                            <!-- show list khi co nhieu file trinh ky -->
                            <span class="file-signer-show">
                              <v-menu
                                v-if="
                                  item.mainSigningFiles &&
                                    item.mainSigningFiles.length > 1
                                "
                                v-model="item.showMenu"
                                :close-on-content-click="true"
                                offset-x
                                left
                                rounded="lg"
                                :nudge-width="300"
                              >
                                <template
                                  v-slot:activator="{ on: menu, attrs }"
                                >
                                  <v-btn v-bind="attrs" icon v-on="menu">
                                    <v-icon> mdi-menu-down </v-icon>
                                  </v-btn>
                                </template>

                                <v-card max-width="500px">
                                  <v-card-title
                                    class="d-flex justify-space-between px-3 py-1"
                                  >
                                    <h6 class="black--text pt-0">
                                      {{ $t('document.listSignDocFile') }}
                                      ({{ item.mainSigningFiles.length }})
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
                                      v-for="(file, i) in item.mainSigningFiles"
                                      :key="`${i}-${file.id}`"
                                      class="py-0"
                                      @click="clickFileDoc(i, item.documentId)"
                                    >
                                      <v-tooltip
                                        top
                                        content-class="tooltip-top"
                                        max-width="30%"
                                      >
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
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

                          <div class="lg-4">
                            <v-menu
                              :top="index > 5"
                              left
                              offset-y
                              transition="scroll-y-transition"
                              :content-class="index <= 5 ? 'menu-action arrow-up' : 'menu-action arrow-down-list'"
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

                              <v-list class="px-2 item-action">
                                <div
                                  @click="showDetail(item.documentId)"
                                  v-html="
                                    viewDetail(`${action}`, item.signUserType)
                                  "
                                />

                                <div
                                  v-if="
                                    item.showIcons && item.showIcons.length > 0
                                  "
                                >
                                  <div
                                    v-for="(action, id) in item.showIcons"
                                    :key="id"
                                  >
                                    <div
                                      @click="
                                        showIconHandleDoc(`${action}`, item)
                                      "
                                      v-html="
                                        renderAction(
                                          `${action}`,
                                          item.signUserType
                                        )
                                      "
                                    />
                                  </div>
                                </div>
                              </v-list>
                            </v-menu>
                          </div>
                        </v-row>
                      </v-container>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-scroll-y-transition>
        </div>

        <!-- paging -->
      </div>
    </v-layout>
    <div class="mt-2 mx-2 px-8 pb-5">
      <base-paging
        :page="page"
        :total-pages="totalPages"
        :from-record="fromRecord"
        :to-record="toRecord"
        :total-records="totalRecords"
        @on-change-page="onChangePage"
      />
    </div>

    <!-- Dialog confirm van ban trinh ky-->
    <DialogConfirm
      :title-confirm="titleConfirmDialog"
      :show-dialog="showConfirmDialog"
      @close-dialog="showConfirmDialog = false"
      @accept-action="acceptConfirmDoc"
    />
  </div>
</template>

<script>
import SearchDocumentProcess from '@/modules/esignature/views/list/components/process/SearchDocumentProcess.vue'
import { DocumentService } from '@/modules/esignature/services/documentService'
import statusDocument from '@/modules/esignature/mixins/statusDocument'
import pagingData from '@/mixins/paging'
import DialogConfirm from '@/modules/esignature/views/create/components/DialogConfirmSave.vue'
import constants from '@/constants'
import customsFile from '@/modules/esignature/mixins/customsFile'
import listDocumentMethod from '@/modules/esignature/mixins/listDocumentMethod'
import popupAvatar from '@/mixins/popupAvatar'
import PopupSigner from '@/modules/esignature/views/list/components/PopupSigner.vue'
import ListAvatarSigner from '@/modules/esignature/views/list/components/ListAvatarSigner.vue'
import customAvatar from '@/mixins/customAvatar'
import routeEsignature from '@/modules/esignature/router/routePaths'
import AvatarSigner from "@/modules/esignature/views/list/components/AvatarSigner.vue";

export default {
  name: 'ListDocumentMainSign',
  components: {
    SearchDocumentProcess,
    DialogConfirm,
    PopupSigner,
    ListAvatarSigner,
    AvatarSigner
  },
  mixins: [
    pagingData,
    statusDocument,
    customsFile,
    listDocumentMethod,
    popupAvatar,
    customAvatar
  ],
  data() {
    return {
      type: constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN
    }
  },
  methods: {
    showDetail(docId) {
      localStorage.setItem(
        constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN,
        constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN
      )
      this.$router.push(routeEsignature.DOCUMENT_DETAIL_PATH.replaceAll(':documentId', docId))
    },
    async search() {
      try {
        if (!this.showAdvance) {
          this.formdata.docState = null
          this.formdata.processStatus = null
          this.formdata.signUserTypes = [
            constants.SIGN_USER_TYPE.MAIN,
            constants.SIGN_USER_TYPE.FLASHES
          ]
        }
        const validFromDate = this.isValidDate(this.formdata.fromDate)
        const validToDate = this.isValidDate(this.formdata.toDate)
        if (!validFromDate || !validToDate) return

        const response = await DocumentService.search(this.formdata)
        const dataResponse = response.data
        this.listDocument = dataResponse.data
        var listDocTemp = []
        this.listDocument.map((item) => {
          listDocTemp.push({
            ...item,
            showMenu: false
          })
        })
        this.listDocument = listDocTemp
        this.renderPaging(dataResponse)
      } catch (error) {
        this.isShowAlert = true
        this.messages = error
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style
  lang="scss"
  scoped
  src="@/modules/esignature/views/list/ListDocumentCreated.scss"
></style>
