<template>
  <div>
    <div class="esignature-wrap--list-common wrap--list-flows">
      <div
        class="px-5 esignature-font"
      >
        <h3 class="white--text ml-5 text-capitalize">
          {{ $t('document.documentProcess') }}
        </h3>
        <div class="wrap--list-process">
          <v-tabs v-model="currentTab" @change="forceRerender()">
            <v-tab
              key="all"
            >{{ $t('document.label.docStates.all') }}
              <sup class="color-sup">{{
                countSigner + countReviewer + countSignerFlash
              }}</sup></v-tab>
            <v-tab
              key="main"
            >{{ $t('signLabel') }}
              <sup class="color-sup">{{
                countSigner + countSignerFlash
              }}</sup></v-tab>
            <v-tab
              key="review"
            >{{ $t('document.signType.reviewer') }}
              <sup class="color-sup">{{ countReviewer }}</sup></v-tab>

            <v-tabs-items v-model="currentTab">
              <v-tab-item
                key="all"
                transition="custom-transition"
                reverse-transition="custom-transition"
              >
                <ListDocumentAll
                  :key="childKey"
                  :class="showDialogSign ? 'd-none' : ''"
                  @show-dialog-sign="showDialogSignFunt"
                  @show-dialog-sign-file="showDialogSignFile"
                  @count-unprocess="countUnprocessed"
                />
              </v-tab-item>
              <v-tab-item
                key="main"
                transition="custom-transition"
                reverse-transition="custom-transition"
              >
                <ListDocumentMainSign
                  :key="childKeyMain"
                  :class="showDialogSign ? 'd-none' : ''"
                  @show-dialog-sign="showDialogSignFunt"
                  @show-dialog-sign-file="showDialogSignFile"
                />
              </v-tab-item>
              <v-tab-item
                key="review"
                transition="custom-transition"
                reverse-transition="custom-transition"
              >
                <ListDocumentReview
                  :key="childKeyReview"
                  :class="showDialogSign ? 'd-none' : ''"
                  @show-dialog-sign="showDialogSignFunt"
                  @show-dialog-sign-file="showDialogSignFile"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </div>
        <!-- Dialog ky van ban-->
        <DialogSign
          :show-dialog="showDialogSign"
          :is-list-process="isListProcess"
          :document-id="documentIdSign"
          :index-open-file-doc="indexOpenFileDoc"
          @close-dialog="closeDialogSign"
          @back-to-list="backToList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ListDocumentAll from '@/modules/esignature/views/list/process/components/ListDocumentAll.vue'
import ListDocumentMainSign from '@/modules/esignature/views/list/process/components/ListDocumentMainSign.vue'
import ListDocumentReview from '@/modules/esignature/views/list/process/components/ListDocumentReview.vue'
import { DocumentService } from '@/modules/esignature/services/documentService'
import DialogSign from '@/modules/esignature/views/sign/SignDocument.vue'
import constants from '@/constants'
import _ from 'lodash'

export default {
  name: 'TabsDocumentProcess',
  components: {
    ListDocumentAll,
    ListDocumentMainSign,
    ListDocumentReview,
    DialogSign
  },
  data() {
    return {
      isListProcess: false,
      showDialogSign: false,
      documentIdSign: null,
      indexOpenFileDoc: null,
      currentTab: 0,
      listCount: null,
      childKey: 0,
      childKeyMain: 0,
      childKeyReview: 0
    }
  },
  computed: {
    countSigner() {
      return this.countNumber(constants.SIGN_USER_TYPE.MAIN)
    },
    countSignerFlash() {
      return this.countNumber(constants.SIGN_USER_TYPE.FLASHES)
    },
    countReviewer() {
      return this.countNumber(constants.SIGN_USER_TYPE.REVIEWER)
    }
  },
  created() {
    this.countUnprocessed()
    const tabCurren = this.$route.query
    if (!_.isEmpty(tabCurren)) {
      if (tabCurren.currenTab) {
        this.currentTab = parseInt(tabCurren.currenTab)
        this.$router.replace({ query: {}})
      }
    }
  },
  methods: {
    countNumber(type) {
      let number = null
      if (this.listCount) {
        number = this.listCount.find(count => {
          return count.key === type
        })
      }
      return number ? number.value : 0
    },
    forceRerender() {
      if (this.currentTab === 1) {
        return this.forceRerenderMain()
      }
      if (this.currentTab === 2) {
        return this.forceRerenderReview()
      }
      this.forceRerenderAll()
    },
    forceRerenderAll() {
      this.childKey += 1
    },
    forceRerenderMain() {
      this.childKeyMain += 1
    },
    forceRerenderReview() {
      this.childKeyReview += 1
    },
    showDialogSignFile(index, docId) {
      this.indexOpenFileDoc = index
      this.documentIdSign = docId
      this.isListProcess = true
      this.showDialogSign = true
    },
    showDialogSignFunt(docId) {
      this.indexOpenFileDoc = 0
      this.showDialogSign = true
      this.isListProcess = true
      this.documentIdSign = docId
    },
    async countUnprocessed() {
      try {
        const response = await DocumentService.countUnprocessed()
        this.listCount = response.data
      } catch (error) {
        this.isShowAlert = true
        this.messages = error
      }
    },
    closeDialogSign(isSignDoc) {
      this.showDialogSign = false
      if (isSignDoc) {
        this.countUnprocessed()
        this.forceRerender()
      }
    },
    backToList(tabCurren) {
      this.currentTab = parseInt(tabCurren)
    }
  }
}
</script>

<style
  scoped
  src="@/modules/esignature/views/list/ListDocumentCreated.scss"
  lang="scss"
></style>
