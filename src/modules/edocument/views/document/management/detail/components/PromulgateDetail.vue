<template>
  <div v-if="documentDetail">
    <v-row class="d-flex justify-space-between">
      <!-- so ky hieu van ban -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.symbolDocument') }}
        </label>
        <div class="doc-content wrap-text-esignature">
          <span class="edoc-text--button"> {{ documentDetail.documentPromulgate.code }}</span>
        </div>
      </v-col>
      <!-- ngay den -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.dateArrival') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button">{{
            documentDetail.documentPromulgate.receiveDate
          }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-2 d-flex justify-space-between">
      <!-- don vi ban hanh -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.promulgateGroup') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button"> {{ documentDetail.promulgateGroupName }}</span>
        </div>
      </v-col>

      <!-- ngay ban hanh -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.datePromulgate') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button">{{
            documentDetail.documentPromulgate.promulgateDate
          }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-2 d-flex justify-space-between">
      <!-- so thuoc don vi -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.noteOfGroup') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button"> {{ documentDetail.documentPromulgate.bookGroupName }}</span>
        </div>
      </v-col>

      <!-- nganh -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.branch') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button">{{
            documentDetail.occupationName
          }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-2 d-flex justify-space-between">
      <!-- do mat -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.density') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button"> {{ documentDetail.securityTypeName }}</span>
        </div>
      </v-col>

      <!-- do khan -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.urgency') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button">{{
            documentDetail.priorityName
          }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-2 d-flex justify-space-between">
      <!-- het hieu luc -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.timeExpired') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button"> {{ documentDetail.documentPromulgate.expireDate }}</span>
        </div>
      </v-col>

      <!-- noi nhan van ban -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.receiveDoc') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button">{{
            documentDetail.documentPromulgate.receivePlace
          }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-2 d-flex justify-space-between">
      <!-- noi nhan ban luu -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.receiveSave') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button"> {{ documentDetail.documentPromulgate.handCopyPlace }}</span>
        </div>
      </v-col>

      <!-- so ban luu -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.numberSave') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button">{{
            documentDetail.documentPromulgate.numberOfCopy
          }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-2 d-flex justify-space-between">
      <!-- so van ban dang ky -->
      <v-col cols="12" sm="5">
        <label class="doc-label">
          {{ $t('managementDoc.updateDoc.countDocument') }}
        </label>
        <div class="doc-content">
          <span class="edoc-text--button"> {{ documentDetail.registerNumber }}</span>
        </div>
      </v-col>

      <v-col cols="12" sm="5" />
    </v-row>
  </div>
</template>

<script>

export default {
  props: {
    documentDetail: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      showDialogViewPdf: false,
      srcFilePdf: null,
      loading: false
    }
  }
}
</script>
