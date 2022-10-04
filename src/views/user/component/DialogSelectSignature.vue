<template>
  <v-dialog v-model="showDialog" persistent max-width="75%">
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center">
          <div>{{ $t('users.dialog.titleAddSignature') }}</div>
        </h5>

        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="text--body-2">
        <p class="text-center red--text">
          {{ $t('users.dialog.contentAddSignature') }}
        </p>
      </v-card-text>
      <validation-observer ref="observerCoordinator">
        <form-dialog
          :form-data="formData"
          @close-dialog="closeDialog"
          @accept="accept"
        />
      </validation-observer>
      <div>
        <upload-image-signature />
      </div>
      <div v-if="error">
        <div class="red--text text-center text--body-2">{{ $t(error) }}</div>
      </div>
      <v-card-actions class="d-flex justify-end py-8">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-150 py-5 mr-12 text--button"
          @click="closeDialog"
        >
          {{ $t('cancelLabel') }}
        </v-btn>

        <v-btn
          rounded
          :disabled="!activeBtnAccept"
          color="primary"
          class="w-150 py-5 text--button"
          @click="accept"
        >
          {{ $t('saveLabel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import constants from '@/constants'
import FormDialog from './FormDialog'
import UploadImageSignature from './UploadImageSignature.vue'

const initData = {
  userId: '',
  userFullName: '',
  email: '',
  phone: '',
  note: '',
  groupId: '',
  groupName: '',
  effectDateFrom: ''
}
export default {
  components: {
    UploadImageSignature,
    FormDialog
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: { ...initData },
      currentTab: 'upload',
      imageSignType: constants.IMAGE_TYPES.MAIN,
      error: ''
    }
  },
  computed: {
    ...mapState('contract', [
      'signatureId',
      'imageMainSignData',
      'imageInitialSignData',
      'imageDrawSignData'
    ]),
    activeBtnAccept() {
      if (this.currentTab === 'upload') {
        if (this.imageSignType === constants.IMAGE_TYPES.MAIN) {
          return this.imageMainSignData != null
        }
        return this.imageInitialSignData != null
      } else {
        return this.imageDrawSignData != null
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    },
    accept() {
      var signatureImage = null
      if (this.currentTab === 'upload') {
        if (this.imageSignType === constants.IMAGE_TYPES.MAIN) {
          if (!this.imageMainSignData) {
            this.error = 'contract.mainSignatureRequired'
            return
          }
          signatureImage = this.imageMainSignData
        } else {
          if (!this.imageInitialSignData) {
            this.error = 'contract.initialSignatureRequired'
            return
          }
          signatureImage = this.imageInitialSignData
        }
      } else {
        if (!this.imageDrawSignData) {
          this.error = 'contract.drawSignatureRequired'
          return
        }
        signatureImage = this.imageDrawSignData
      }
      this.error = ''
      this.closeDialog()
      this.$emit('accept', signatureImage)
    },
    activeTap(tab) {
      this.currentTab = tab
      this.error = ''
    },
    chooseImageSign(type) {
      this.imageSignType = type
    }
  }
}
</script>

<style lang="scss" scoped></style>
