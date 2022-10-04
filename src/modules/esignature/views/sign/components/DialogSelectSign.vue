<template>
  <v-dialog v-model="showDialog" persistent max-width="65%">
    <v-card class="dialog-select-sign">
      <v-row class="close-dialog-sign ma-0">
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </v-row>

      <v-row class="title-dialog-sign ma-0 mb-2">
        {{ $t('document.label.selectSignature') }}
      </v-row>

      <!-- Tab -->
      <v-tabs v-model="currentTab" fixed-tabs>
        <v-tab key="upload">
          {{ $t('document.label.upload') }}
        </v-tab>
        <v-tab key="draw">
          {{ $t('document.label.draw') }}
        </v-tab>
        <v-tab key="ca">
          {{ $t('document.label.ca') }}
        </v-tab>
      </v-tabs>

      <v-divider class="mx-14" />

      <v-tabs-items v-model="currentTab">
        <v-tab-item
          key="upload"
        >
          <UploadImgSign
            :full-name="fullName"
            :current-tab="currentTab"
            :show-fullname="showFullname"
            @uploading-image="uploadingImage"
            @reset-image="resetImage"
          />
        </v-tab-item>
        <v-tab-item
          key="draw"
        >
          <DrawSign
            :full-name="fullName"
            :current-tab="currentTab"
            :show-fullname="showFullname"
            @uploading-image="uploadingImage"
            @reset-image="resetImage"
          />
        </v-tab-item>
        <v-tab-item
          key="ca"
        >
          <DigitalSign
            :full-name="fullName"
            :loading-btn-select="loadingBtnSelect"
            @uploading-image="uploadingImageCADraw"
            @update-pin="updatePinCA"
            @close-dialog="closeDialog"
          />
        </v-tab-item>
      </v-tabs-items>

      <v-row v-show="currentTab != 2" class="ma-0 mx-10 pb-5">
        <v-col cols="12" md="6">
          <!-- checkBox -->
          <div class="checkbox-sign">
            <v-checkbox
              v-model="showFullname"
              hide-details
              :label="$t('showFullname')"
              :disabled="loadingBtnSelect"
            />
            <v-checkbox
              v-model="saveImgToUserInfo"
              hide-details
              :label="$t('saveImgToUserInfo')"
            />

            <v-checkbox
              v-model="useImgAllFileSign"
              hide-details
              :label="$t('useImgAllSign')"
            />
          </div>
        </v-col>

        <v-col cols="12" md="6" class="align-self-end">
          <!-- button -->
          <v-row class="ma-0 justify-md-end justify-center footer-dialog">
            <v-btn
              rounded
              outlined
              color="primary"
              class="dialog-sign-btn"
              @click="closeDialog"
            >
              {{ $t('cancelLabel') }}
            </v-btn>

            <v-btn
              rounded
              :disabled="!activeBtnAccept"
              color="primary"
              class="dialog-sign-btn ml-10"
              :loading="loadingBtnSelect"
              @click="accept(false)"
            >
              {{ $t('selectLabel') }}
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <base-preload :dialog="loading" />
  </v-dialog>
</template>

<script>
import constants from '@/constants'
import UploadImgSign from './UploadImgSign.vue'
import DrawSign from './DrawSign.vue'
import DigitalSign from './DigitalSign.vue'
import { FileService } from '@/modules/esignature/services/fileService'
import { mapState, mapActions } from 'vuex'
import { DocumentService } from '@/modules/esignature/services/documentService'

export default {
  components: {
    UploadImgSign,
    DrawSign,
    DigitalSign
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    fullName: {
      type: String,
      default: ''
    },
    signMethod: {
      type: String,
      default: ''
    },
    idSignature: {
      type: Number,
      default: null
    },
    idFileDoc: {
      type: Number,
      default: null
    },
    itemsSign: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      currentTab: 0,
      imageSignType: constants.IMAGE_TYPES.MAIN,
      // CheckBox
      showFullname: false, // Show Fullname trong chu ky.
      saveImgToUserInfo: false, // Luu anh vao thong tin nguoi dung.
      useImgAllFileSign: true, // Su dung anh ky cho all chan ky.
      metadata: '',
      provider: '',
      loading: false,
      disableCBFullName: false
    }
  },
  computed: {
    ...mapState('document', [
      'imageMainSignData',
      'imageInitialSignData',
      'imageCASignData',
      'imageDrawSignData',
      'clickClearDraw',
      'loadingBtnSelect'
    ]),
    activeBtnAccept() {
      if (this.currentTab === 0 && this.imageMainSignData != null) {
        return true
      }
      if (this.currentTab === 1 && this.imageDrawSignData != null) {
        return true
      }
      if (this.currentTab === 2 && this.metadata) {
        return true
      }
      return false
    }
  },
  watch: {
    signMethod() {
      if (this.signMethod === 'DIGITAL_SIGN') this.currentTab = 2
    },

    currentTab() {
      this.useImgAllFileSign = true
    },

    showFullname() {
      this.setShowFullName(this.showFullname)
    }
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    ...mapActions('document', [
      'setImageSign',
      'setClearDrawImg',
      'setShowFullName',
      'setLoadingBtnSelect'
    ]),

    async updatePinCA(pin, provider) {
      this.metadata = pin
      this.provider = provider
      await this.accept('CA')
    },

    closeDialog() {
      this.$emit('close-dialog')
    },

    async accept(status) {
      this.loading = true
      var signatureImage = null
      if (this.currentTab === 2 && status === 'CA') {
        await this.checkPinCA(this.metadata, this.provider)
        signatureImage = this.imageCASignData
      }
      if (this.currentTab === 0) {
        signatureImage = this.imageMainSignData
      }
      if (this.currentTab === 1) {
        signatureImage = this.imageDrawSignData
      }
      if (status === 'DRAW') {
        signatureImage = this.imageCASignData
        this.useImgAllFileSign = false
      }
      this.loading = false
      this.closeDialog()
      this.$emit(
        'accept',
        signatureImage,
        this.useImgAllFileSign,
        this.showFullname
      )
    },

    async checkPinCA(metadata, provider) {
      var itemFileCurrent = this.itemsSign.filter(
        file => file.signer.filesAttachmentId === this.idFileDoc
      )
      if (itemFileCurrent) {
        var itemSignature = itemFileCurrent.find(
          item => item.signer.id === this.idSignature
        )
        // Goi service lay anh chu ky
        Object.assign(itemSignature, { metadata }, { provider })
        await this.getImageCA(itemSignature)
      }
    },

    async getImageCA(itemSignature) {
      const params = {
        signProvider: itemSignature.provider,
        metadata: itemSignature.metadata
      }
      try {
        const response = await DocumentService.getImageCA(params)
        if (response.status === 200) {
          itemSignature.signer['signType'] = constants.SIGN_TYPES.CA
          if (this.itemsSign.length > 0) {
            const fileImgCA = this.dataURLtoFile(
              `data:image/png;base64,${response.data}`,
              `${Date.now()}.png`
            )
            // BE resize image
            const imgUpload = await this.uploadingImageCA({
              file: fileImgCA
            })
            this.itemsSign.map(imgSign => {
              if (imgSign.signer.filesAttachmentId === this.idFileDoc) {
                if (imgSign.signer.id !== itemSignature.signer.id) {
                  imgSign.signer['signType'] = constants.SIGN_TYPES.IMAGE
                } else {
                  imgSign.signer['provider'] = itemSignature.provider
                  imgSign.signer['metaData'] = itemSignature.metadata
                }
                imgSign['dataImgSign'] = imgUpload['dataImgSign']
                imgSign['filePath'] = imgUpload['filePath']
                imgSign['fileName'] = imgUpload['fileName']
                imgSign['storage'] = imgUpload['storage']
                imgSign['fileSize'] = imgUpload['fileSize']
                imgSign['fileType'] = imgUpload['fileType']
              }
            })
          }
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      }
    },

    async uploadingImageCA({ file }) {
      var formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', constants.FILE_TYPES.FILE_IMAGE_SIGNATURE)
      try {
        const response = await FileService.uploadImgSign(formData, false)
        if (response.success) {
          const { data } = response
          const dataImgSign = await FileService.download(
            {
              ...data
            },
            file.type
          )
          return {
            ...data,
            dataImgSign
          }
        } else {
          return null
        }
      } catch (error) {
        return null
      }
    },

    dataURLtoFile(dataurl, filename) {
      try {
        var arr = dataurl.split(',')
        var mime = arr[0].match(/:(.*?);/)[1]
        var bstr = atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }

        return new File([u8arr], filename, { type: mime })
      } catch (error) {
        console.log(error)
        return null
      }
    },

    // Upload anh vs tai anh
    async uploadingImage({ type, file }) {
      if (this.currentTab === 1) this.setClearDrawImg(false)
      var formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', constants.FILE_TYPES.FILE_IMAGE_SIGNATURE)
      const response = await FileService.uploadImgSign(formData, false)
      if (response.success) {
        const { data } = response
        const dataImgSign = await FileService.download({ ...data }, file.type)
        const payloadImage = { type, data: { dataImgSign, ...data }}
        if (this.currentTab !== 1) {
          this.setImageSign(payloadImage)
        }
        if (this.currentTab === 1 && !this.clickClearDraw) {
          this.setClearDrawImg(true)
          this.setImageSign(payloadImage)
        }
      }
      this.setLoadingBtnSelect(false)
    },

    async uploadingImageCADraw({ type, file }) {
      this.setClearDrawImg(false)
      this.loading = true
      var formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', constants.FILE_TYPES.FILE_IMAGE_SIGNATURE)
      const response = await FileService.uploadImgSign(formData, false)
      if (response.success) {
        const { data } = response
        const dataImgSign = await FileService.download({ ...data }, file.type)
        const payloadImage = { type, dataImgSign, ...data }
        this.itemsSign.map(imgSign => {
          if (imgSign.signer.filesAttachmentId === this.idFileDoc) {
            imgSign.signer['signType'] = constants.SIGN_TYPES.IMAGE
            imgSign['dataImgSign'] = payloadImage['dataImgSign']
            imgSign['filePath'] = payloadImage['filePath']
            imgSign['fileName'] = payloadImage['fileName']
            imgSign['storage'] = payloadImage['storage']
            imgSign['fileSize'] = payloadImage['fileSize']
            imgSign['fileType'] = payloadImage['fileType']
          }
        })
        this.setImageSign(payloadImage)
      }
      if (this.currentTab === 2) {
        await this.accept('DRAW')
      }
    },

    // Reset lai anh
    resetImage(type) {
      const payloadImage = {
        type,
        data: null
      }
      this.setImageSign(payloadImage)
    }
  }
}
</script>

<style lang="scss">
.footer-dialog {
  .v-btn:not(.v-btn--round).v-size--default {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  }
}

.checkbox-sign {
  .v-label {
    font-weight: 700;
    font-size: 13px;
    line-height: 13px;
    color: #22242c;

    @media screen and (max-width: 1440px) {
      font-size: 10px;
    }
  }

  .v-icon.v-icon {
    color: #22242c;
  }

  .v-input--selection-controls {
    margin-top: 8px;
  }

  .v-input--is-disabled .v-input__slot {
    background-color: white !important;
  }
}

.dialog-sign-btn {
  width: 150px;
  min-height: 50px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  @media screen and (max-width: 1440px) {
    min-height: 37px;
    width: 114px;
  }
}
</style>
