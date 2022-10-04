<template>
  <div
    class="wrap--list-common edocument-font"
    :class="showDialogSign ? 'bg-white' : ''"
  >
    <h3 class="white--text ml-10">{{ $t('document.bookTitle') }}</h3>

    <div class="wrap--content wrap-book-tab">
      <v-tabs v-model="currentTab" class="pt-2" @change="forceRerender()">
        <v-tab key="K-SEND" class="ml-16">
          {{ $t('document.docGo') }}
        </v-tab>
        <v-tab key="K-RECEIVE">
          {{ $t('document.docTo') }}
        </v-tab>

        <v-tabs-items v-model="currentTab">
          <v-tab-item
            key="K-SEND"
            transition="custom-transition"
            reverse-transition="custom-transition"
          >
            <ListDocumentGo
              :key="childKeyGo"
              :class="showDialogSign ? 'd-none' : ''"
              @changedShowDialogSign="changedShowDialogSign"
              @changedDocId="changedDocId"
              @changedIndexOpenFileDoc="changedIndexOpenFileDoc"
            />
          </v-tab-item>

          <v-tab-item
            key="K-RECEIVE"
            transition="custom-transition"
            reverse-transition="custom-transition"
          >
            <ListDocumentArrival
              :key="childKeyArrival"
              :class="showDialogSign ? 'd-none' : ''"
              @changedShowDialogSign="changedShowDialogSign"
              @changedDocId="changedDocId"
              @changedIndexOpenFileDoc="changedIndexOpenFileDoc"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>

    <!-- Dialog ky van ban-->
    <ViewFile
      :show-dialog="showDialogSign"
      :document-id="documentId"
      :index-open-file-doc="indexOpenFileDoc"
      @close-dialog="closeDialogSign"
    />
  </div>
</template>

<script>
import ListDocumentGo from './components/ListDocumentGo.vue'
import ListDocumentArrival from './components/ListDocumentArrival.vue'
import ViewFile from '@/modules/edocument/views/document/management/file/ViewFile'
import { isEmpty } from 'lodash'

export default {
  name: 'BookGoArrival',

  components: {
    ListDocumentGo,
    ListDocumentArrival,
    ViewFile
  },

  data() {
    return {
      currentTab: 0,
      showDialogSign: false,
      indexOpenFileDoc: null,
      documentId: null,
      childKeyGo: 0,
      childKeyArrival: 0
    }
  },
  created() {
    const tabCurren = this.$route.query

    if (!isEmpty(tabCurren)) {
      if (tabCurren.currentTab) {
        this.currentTab = parseInt(tabCurren.currentTab)
        this.$router.replace({ query: {}})
      }
    }
  },
  methods: {
    forceRerender() {
      if (this.currentTab === 1) {
        return this.forceRerenderArrival()
      }
      return this.forceRerenderGo()
    },

    forceRerenderArrival() {
      this.childKeyArrival += 1
    },

    forceRerenderGo() {
      this.childKeyGo += 1
    },

    closeDialogSign(isSignDoc) {
      this.showDialogSign = false
      if (isSignDoc) {
        this.forceRerender()
      }
    },

    changedShowDialogSign() {
      this.showDialogSign = true
    },

    changedDocId(docId) {
      this.documentId = docId.documentId
    },

    changedIndexOpenFileDoc(index) {
      this.indexOpenFileDoc = index
    }
  }
}
</script>

<style lang="scss" src="./BookGoArrival.scss"></style>
