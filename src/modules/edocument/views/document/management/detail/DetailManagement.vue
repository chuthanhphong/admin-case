<template>
  <div class="wrap--list-common edocument-font">
    <breadcrumbs :items="breadcrumbs" clazz="pt-0 ml-3" />
    <div class="wrap--content wrap-detail-tab">
      <v-tabs v-model="currentTab" @change="forceRerender()">
        <v-tab key="DETAIL" class="ml-9">{{ $t('detail') }}</v-tab>
        <v-tab key="TRANSFER">{{ $t('transferList') }}</v-tab>
        <v-tab v-if="checkShowLibrary" key="LIBRARIES">{{ $t('libraries.detail.libraryInfo') }}</v-tab>

        <v-tabs-items v-model="currentTab">
          <v-tab-item
            key="DETAIL"
            transition="custom-transition"
            reverse-transition="custom-transition"
          >
            <TabDetail
              :key="childKeyDetail"
              :document-detail="documentDetail"
              @goto-sign="gotoSign"
            />
          </v-tab-item>

          <v-tab-item
            key="TRANSFER"
            transition="custom-transition"
            reverse-transition="custom-transition"
          >
            <TabTransfer
              :key="childKeyTransfer"
              ref="TabTransfer"
              @selected-item="selectedItem"
              @onShowTransferTree="onShowTransferTree"
              @open-dialog-revoke="showDialogRevokeDocument"
            />
          </v-tab-item>
          <v-tab-item
            key="LIBRARIES"
            transition="custom-transition"
            reverse-transition="custom-transition"
          >
            <tab-library :key="childKeyLibrary" />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-divider />
      <div class="d-flex bottom-btn-detail pa-2 justify-end">
        <v-btn
          class="btn-close"
          color="primary"
          outlined
          rounded
          @click="hideDialog"
        >
          <span class="text-btn"> {{ $t('document.back') }}</span>
        </v-btn>
        <v-btn
          v-if="selected.length > 0"
          color="red"
          class="btn-revoke"
          outlined
          rounded
          @click="showDialogRevokeDocument"
        >{{ $t('eviction') }}</v-btn>
        <v-btn
          v-if="showTransfer"
          class="btn-sign"
          color="white"
          outlined
          rounded
          @click="showConfirmDialogTransfer = true"
        >
          <span class="text-btn">
            {{ $t('managementDoc.transfer.transferAction') }}
          </span>
        </v-btn>
      </div>
    </div>

    <DialogTransfer
      :show-dialog="showConfirmDialogTransfer"
      :doc-item="documentDetail"
      @close-dialog="showConfirmDialog"
    />

    <!-- Dialog ky van ban-->
    <ViewFile
      :show-dialog="showDialogSign"
      :document-id="documentId"
      :index-open-file-doc="indexOpenFileDoc"
      @close-dialog="closeDialogSign"
    />

    <TransferTree
      :document-id="docId"
      :show-dialog="showTransferTree"
      :document-title="documentTitle"
      @hideDialog="showTransferTree = false"
    />
    <base-preload :dialog="loading" />
  </div>
</template>

<script>
import edocumentRoute from '@/modules/edocument/router/routePaths'
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import TabDetail from './components/TabDetail.vue'
import TabTransfer from './components/TabTransfer.vue'
import TabLibrary from './components/TabLibrary.vue'
import { DocumentService } from '@/modules/edocument/services/documentService'
import customsFile from '@/modules/edocument/mixins/customsFile'
import constants from '@/constants'
import DialogTransfer from '@/modules/edocument/views/document/management/components/DialogTransfer'
import ViewFile from '@/modules/edocument/views/document/management/file/ViewFile'
import TransferTree from '@/modules/edocument/views/components/TransferTree'
import { mapActions } from 'vuex'

export default {
  name: 'CreateManagementDoc',
  components: {
    Breadcrumbs,
    TabDetail,
    TabTransfer,
    TabLibrary,
    DialogTransfer,
    ViewFile,
    TransferTree
  },
  mixins: [customsFile],
  data() {
    return {
      showConfirmDialogTransfer: false,
      isUpdate: false,
      currentTab: 'DETAIL',
      documentDetail: null,
      loading: false,
      showIcons: [],
      showDialogSign: false,
      documentId: null,
      indexOpenFileDoc: null,
      selected: [],
      showTransferTree: false,
      childKeyDetail: 0,
      childKeyTransfer: 0,
      childKeyLibrary: 0,
      titleComfirmRevoke: '',
      showDialogRevoke: false,
      linkBack: '',
      currentTabList: null,
      hrefToList: '',
      docId: null,
      documentTitle: null
    }
  },
  computed: {
    breadcrumbs() {
      const check = localStorage.getItem(
        constants.SEARCH_TYPE_DOCUMENT.SEARCH_TYPE_DOC
      )
      let linkHref = `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}`
      let title = 'documentManager'
      if (check === constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_BOOK_GO) {
        // tab = 0
        linkHref = `${edocumentRoute.DOCUMENT_BOOK_PATH}?currentTab=0`
        title = 'document.bookTitle'
      }
      if (check === constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_BOOK_ARRIVAL) {
        // tab = 1
        linkHref = `${edocumentRoute.DOCUMENT_BOOK_PATH}?currentTab=1`
        title = 'document.bookTitle'
      }
      if (check === constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_LIBRARY) {
        // tab = 1
        linkHref = `${edocumentRoute.DOCUMENT_LIBRARY_PATH}`
        title = 'libraries.librariesManagement'
      }

      this.backTolist(linkHref)

      return [
        {
          text: title,
          disabled: false,
          href: linkHref
        },
        {
          text: `${this.$t('electronicSign.documentDetail')}: ${
            this.documentName
          }`,
          disabled: true,
          tooltip: false
        }
      ]
    },

    checkShowLibrary() {
      let check = false
      if (this.documentDetail && this.documentDetail.status) {
        if (this.documentDetail.status === 7) {
          check = true
        }
      }
      return check
    },

    documentName() {
      if (this.documentDetail && this.documentDetail.documentTitle) {
        return this.customDocumentTitle(this.documentDetail.documentTitle)
      }
      return ''
    },
    showTransfer() {
      const lstApprove = constants.LIST_ACTIONS_DETAIL.TRANSFER
      var show = false
      if (this.showIcons && this.showIcons.includes(lstApprove)) {
        show = true
      }
      return show
    }
  },

  beforeDestroy() {
    localStorage.setItem(constants.SEARCH_TYPE_DOCUMENT.SEARCH_TYPE_DOC, null)
  },

  async created() {
    await this.getDetailDocument()
  },

  methods: {
    ...mapActions('layout', ['setNotify']),

    backTolist(href) {
      this.hrefToList = href
    },

    showConfirmDialog(check) {
      if (check) {
        this.forceRerender()
      }
      this.showConfirmDialogTransfer = false
    },
    forceRerender() {
      if (this.currentTab === 1) {
        this.childKeyTransfer += 1
      }
      if (this.currentTab === 2) {
        this.childKeyLibrary += 1
      }
      this.childKeyDetail += 1
    },

    showDialogRevokeDocument() {
      // this.titleComfirmRevoke =
      //   "managementDoc.titleConfirmSave.revokedDocument";
      // this.showDialogRevoke = true;
      this.$refs.TabTransfer.showDialogRevokeByCheckBox()
    },

    onShowTransferTree() {
      this.showTransferTree = true
    },

    selectedItem(item) {
      this.selected = item
    },
    hideDialog() {
      return this.$router.push(`${this.hrefToList}`)
    },
    // Dong dialog ky van ban
    closeDialogSign(isSignDoc) {
      this.showDialogSign = false
      if (isSignDoc) this.getDetailDocument()
    },
    // View file ky (click icon pdf and icon sign)
    gotoSign(index) {
      this.indexOpenFileDoc = index
      this.documentId = this.documentDetail.documentId
      this.showDialogSign = true
    },
    async getDetailDocument() {
      try {
        this.loading = true
        this.docId = parseInt(this.$route.params.documentId)
        const response = await DocumentService.getDetailDocument(this.docId)
        this.documentDetail = response.data
        this.showIcons = this.documentDetail.showIcons
        if (this.documentDetail) {
          this.documentTitle = this.documentDetail.documentTitle
        }
        this.loading = false
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" src="./DetailManagement.scss" />
