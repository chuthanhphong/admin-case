<template>
  <div class="tab-select-signature">
    <div class="d-flex justify-space-around px-15 wrap-images-sign">
      <div class="wrap-upload">
        <v-row justify="center" align="center" class="content-upload">
          <div
            v-if="previewImgMainSign"
            class="imagePreviewWrapper"
            :style="{ 'background-image': `url(${previewImgMainSign})` }"
          />
          <v-file-input
            id="imageMainSign"
            v-model="imageMainSign"
            accept=".png"
            class="img-sign"
            @change="onChangeImageMainSign"
          />
          <v-btn
            v-if="!imageMainSign"
            color="secondary"
            rounded
            class="text--button"
            @click="uploaImagSign('imageMainSign')"
          >
            <v-icon>mdi-cloud-upload</v-icon>
            {{ $t('contract.label.uploadImageMainSign') }}</v-btn>
          <v-tooltip v-if="previewImgMainSign" top content-class="tooltip-top">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                v-bind="attrs"
                x-small
                color="secondary"
                icon
                elevation="2"
                class="btn-edit-img-sign"
                :loading="uploadingImgMain"
                v-on="on"
                @click="uploaImagSign('imageMainSign')"
              ><v-icon size="25">mdi-circle-edit-outline</v-icon></v-btn>
            </template>
            <div>
              {{ $t('contract.label.editImageSign') }}
            </div>
          </v-tooltip>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import constants from '@/constants'
import { mapActions } from 'vuex'
import { FileService } from '@/modules/econtract/services/fileService'

export default {
  data() {
    return {
      imageMainSign: null,
      tmpImageMainSign: null,
      imageInitialSign: null,
      previewImgMainSign: null,
      uploadingImgMain: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    ...mapActions('layout', ['setNotify']),
    async uploadingImage({ type, file }) {
      var formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', constants.FILE_TYPES.FILE_IMAGE_SIGNATURE)
      await FileService.upload(formData, false)
    },
    // Reset lai anh
    resetImage() {
      this.previewImgMainSign = null
      this.imageMainSign = null
    },
    uploaImagSign(typeImg) {
      document.getElementById(typeImg).click()
    },
    // Chon anh ky chinh
    async onChangeImageMainSign(file) {
      if (file) {
        var isError = false
        if (!file.type.includes('png')) {
          this.resetImage()
          this.showError('contract.requireTypePng')
          isError = true
        }
        // Validate size anh
        if (!this.validateSize(file.size)) {
          this.showError('contract.imgeMaxSize')
          isError = true
        }
        if (isError) {
          this.resetImage()
          this.previewImgMainSign = null
          this.imageMainSign = null
          this.tmpImageMainSign = null
          return
        }
        const reader = new FileReader()
        reader.onload = e => {
          this.previewImgMainSign = e.target.result
        }
        reader.readAsDataURL(file)
        this.tmpImageMainSign = this.imageMainSign
        // Upload file
        this.uploadingImgMain = true
        await this.uploadingImage({
          type: constants.IMAGE_TYPES.MAIN,
          file
        })
        this.uploadingImgMain = false
      } else {
        if (this.tmpImageMainSign) {
          this.imageMainSign = this.tmpImageMainSign
        } else {
          this.previewImgMainSign = null
        }
      }
    },
    // Hien thi thong bao loi
    showError(msg) {
      const message = msg
      const typeAlert = 'error'
      this.setNotify({
        show: true,
        type: typeAlert,
        content: message
      })
    },
    validateSize(size) {
      const sizeLimit = 15 * 1024 * 1024
      return size < sizeLimit
    }
  }
}
</script>

<style lang="scss" scoped>
.imagePreviewWrapper {
  width: 279px;
  height: 186px;

  display: block;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
}
.img-sign {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}
.error-img {
  position: absolute;
}
.tab-select-signature {
  .v-slide-group__content {
    border-bottom: 1px solid #c1c9d2;
  }
  .v-tabs-slider-wrapper {
    bottom: -1px;
  }
  .v-tabs-items .v-window__container {
    justify-content: center;
  }
  .wrap-upload {
    .content-upload {
      position: relative;
      width: 450px;
      height: 210px;
      border-radius: 4px;
      border: 1px dashed #8e8ea1;
      margin-top: 20px;
      &.active {
        border: 1px solid #f2f2fa;
        background: #f2f2fa;
      }
      .btn-edit-img-sign {
        position: absolute;
        bottom: 5px;
        right: 5px;
      }
    }
    .v-input--selection-controls__input {
      margin-right: 0 !important;
      margin-left: 5px;
    }
  }
}
@media (max-width: 1024px) {
  .tab-select-signature {
    .v-tabs-items .v-window__container {
      height: unset !important;
    }
    .wrap-upload {
      margin: 30px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    #wrap-draw-signature {
      height: 350px;
      margin: 30px 0;
    }
  }
  .wrap-images-sign {
    flex-direction: column;
  }
}
</style>
