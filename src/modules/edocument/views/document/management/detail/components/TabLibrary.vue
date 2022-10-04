<template>
  <v-sheet id="scrolling-techniques-3" class="overflow-y-auto edocument-height-detail">
    <div class="wrap-tab-library detail-management">
      <v-row v-if="libraryInfo" class="d-flex justify-space-around ma-0 pa-5">
        <v-col class="md-3">
          <label class="doc-label">
            {{ $t('constructionGroup') }}
          </label>

          <div class="doc-content">
            <span class="edoc-text--button">
              {{ libraryInfo.submissionGroupName }}</span>
          </div>
        </v-col>
        <v-col class="md-3">
          <label class="doc-label">
            {{ $t('libraries.detail.dateSaveLib') }}
          </label>

          <div class="doc-content">
            <span class="edoc-text--button">
              {{ libraryInfo.proclaimDate }}</span>
          </div>
        </v-col>
        <v-col class="md-3">
          <label class="doc-label">
            {{ $t('libraries.detail.description') }}
          </label>

          <div class="doc-content">
            <span class="edoc-text--button" v-html="genComment(libraryInfo.note)" />
          </div>
        </v-col>
      </v-row>
      <div v-if="groupScopes.length > 0" class="px-5">
        <v-card-title class="doc-label pl-0">
          {{ $t('libraries.listLibrary.scopeUser') }}
        </v-card-title>

        <DialogTemplate :group-document-scopes="groupScopes" />

      </div>
      <div v-if="replaceDocuments.length > 0" class="px-5">
        <v-card-title class="doc-label pl-0">
          {{ $t('libraries.detail.replaceDocument') }} &nbsp;
          <v-tooltip right content-class="tooltip-right" max-width="20%">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                color="#8E8EA1"
                dense
                class="margin-b1"
                v-on="on"
              >
                mdi-information-outline
              </v-icon>
            </template>
            <span>{{ $t('libraries.detail.noteReplaceDocument') }}</span>
          </v-tooltip>
        </v-card-title>

        <ListReplaceDocument :replace-documents="replaceDocuments" />

      </div>
      <div v-if="false" class="px-5">
        <v-card-title class="doc-label">
          {{ $t('libraries.detail.replaceByDocument') }}
        </v-card-title>

        <DialogTemplate :group-document-scopes="groupScopes" />

      </div>
      <base-preload :loading="loading" />
    </div>
  </v-sheet>
</template>

<script>
import { DocumentService } from '@/modules/edocument/services/documentService'
import DialogTemplate from './DialogTemplate'
import ListReplaceDocument from './ListReplaceDocument'
import { mapActions } from 'vuex'

export default {
  name: 'TabTransfer',

  components: {
    DialogTemplate,
    ListReplaceDocument
  },

  data() {
    return {
      lstTransfer: [],
      libraryInfo: null,
      loading: false,
      documentId: null,
      listTranferReceive: [],
      groupScopes: [],
      replaceDocuments: [],
      documentActionId: null
    }
  },
  created() {
    this.getLibraryInfo()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),

    async getLibraryInfo() {
      try {
        this.loading = true
        this.documentId = parseInt(this.$route.params.documentId)
        const response = await DocumentService.getLibraryInfo(this.documentId)
        this.libraryInfo = response.data
        if (this.libraryInfo) {
          this.groupScopes = this.libraryInfo.groupScopes
          this.replaceDocuments = this.libraryInfo.replaceDocuments
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    onShowTransfer() {
      this.$emit('onShowTransferTree')
    },

    genComment(note) {
      if (!note) return ''
      if (note.includes('\n')) {
        return note.replaceAll('\n', '<br \>')
      }
      return note
    },
  }
}
</script>

<style></style>
