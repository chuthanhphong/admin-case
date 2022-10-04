<template>
  <div class="px-8 py-6 d-flex justify-center">
    <div class="wrap-content-upload-esignature">
      <div ref="printcontent" class="wrap-img">
        <div
          v-if="urlImgSignUpload"
          class="imageUpload"
          :style="{ 'background-image': `url(${urlImgSignUpload})` }"
        />

        <div v-else class="img_blank" />

        <div v-if="showFullname" class="full-name">
          <FitText>{{ fullName }} </FitText>
        </div>
      </div>

      <v-file-input
        id="inputImgSign"
        v-model="imgSignUpload"
        accept="image/*"
        class="img-sign"
        @change="onChangeImgUpload"
      />

      <!-- Text upload -->
      <div v-if="showTextUpload" class="d-flex flex-column txt-upload">
        <v-tooltip top content-class="tooltip-top">
          <template v-slot:activator="{ on, attrs }">
            <img
              v-bind="attrs"
              src="@/assets/icons/ic_upload.png"
              alt="upload"
              width="50"
              height="50"
              class="margin-icon-sign"
              v-on="on"
            >
          </template>
          <span>{{ $t('uploadImg') }}</span>
        </v-tooltip>

        <span class="txt-upload1">
          {{ $t('imgUploadSize') }}
        </span>
        <div>
          <span class="txt-upload2">
            {{ $t('imgUploadSize1') }}
          </span>
          <span class="txt-upload3">
            {{ $t('imgUploadSize2') }}
          </span>
        </div>
      </div>
    </div>

    <div class="wrap-click-select-img" @click="showDialogSelectTypeImg" />

    <DialogSelectTypeUpload
      :show-dialog="showDialogSelectImage"
      @close-dialog="showDialogSelectImage = false"
      @accept-dialog="acceptTypeUpload"
    />
  </div>
</template>

<script>
import FitText from '@/views/components/FitText'
import constants from '@/constants'
import { mapState, mapActions } from 'vuex'
import DialogSelectTypeUpload from './DialogSelectTypeUpload.vue'
import html2canvas from 'html2canvas'
export default {
  components: {
    DialogSelectTypeUpload,
    FitText
  },
  props: {
    fullName: {
      type: String,
      default: ''
    },
    showFullname: {
      type: Boolean,
      default: false
    },
    currentTab: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      imgSignUpload: null, // Data img upload.
      urlImgSignUpload: null, // Url image sign upload.
      uploadingImgSign: false, // Show loading when upload image.
      showDialogSelectImage: false,
      showTextUpload: true,
      fileImg: null,
      isChange: false
    }
  },
  computed: {
    ...mapState('document', ['showFullName'])
  },
  watch: {
    showFullName() {
      if (this.currentTab !== 0) this.isChange = true
      if (this.urlImgSignUpload && this.currentTab === 0) {
        this.onChangeImgUpload(this.fileImg)
      }
    },

    currentTab() {
      if (this.currentTab === 0 && this.isChange) {
        this.isChange = false
        this.onChangeImgUpload(this.fileImg)
      }
    }
  },
  methods: {
    ...mapActions('document', ['setImageSign', 'setLoadingBtnSelect']),
    ...mapActions('layout', ['setNotify']),

    // Chon anh ky.
    async onChangeImgUpload(file) {
      if (file) {
        // Validate type image.
        if (!file.type.includes('png')) {
          const message = 'document.requireTypePng'
          this.showError(message)
          return
        }

        // Validate size image.
        if (!this.validateSize(file.size)) {
          const message = 'document.imgeMaxSize'
          this.showError(message)
          return
        }

        // Get url image of file upload.
        this.showTextUpload = false
        this.fileImg = file
        this.setLoadingBtnSelect(true)
        const reader = new FileReader()
        reader.onload = (e) => {
          this.urlImgSignUpload = e.target.result
          setTimeout(() => {
            if (this.showFullName) this.convertImage()
          }, 100)
        }
        reader.readAsDataURL(file)

        if (!this.showFullName) {
          this.$emit('uploading-image', {
            type: constants.IMAGE_TYPES.MAIN,
            file: file
          })
        }
      }
    },

    async convertImage() {
      // Convert
      const el = this.$refs.printcontent
      const options = {
        type: 'dataURL',
        backgroundColor: '#00000000',
        border: 'none'
      }

      const printCanvas = await html2canvas(el, options)
      const imgSign = this.dataURLtoFile(
        printCanvas.toDataURL('image/png'),
        `${Date.now()}.png`
      )
      if (imgSign) {
        this.$emit('uploading-image', {
          type: constants.IMAGE_TYPES.MAIN,
          file: imgSign
        })
      }
    },

    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      return new File([u8arr], filename, { type: mime })
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
      const sizeLimit = 15 * 1024 * 1024 // 15BMB
      return size < sizeLimit
    },

    // Tai anh len tu may tinh
    uploadFromComputer() {
      document.getElementById('inputImgSign').click()
      this.showDialogSelectImage = false
    },

    // Tai anh tu thong tin nguoi dung
    uploadFromUserInfo() {},

    showDialogSelectTypeImg() {
      this.showDialogSelectImage = true
    },

    acceptTypeUpload(typeUpload) {
      typeUpload === 'computer'
        ? this.uploadFromComputer()
        : this.uploadFromUserInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-content-upload-esignature {
  border: 1px dashed #8e8ea1;
  border-radius: 8px;
  height: 240px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.wrap-click-select-img {
  position: absolute;
  height: 240px;
  width: 400px;
  border-radius: 8px;
}

.img_blank {
  width: 240px;
  height: 194px;
}

.imageUpload {
  width: 240px;
  height: 194px;
  display: block;
  cursor: pointer;
  background-size: contain;
  background-position: center center;
}

.img-sign {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.txt-upload {
  position: absolute;
  align-items: center;
}

.txt-upload1 {
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: #22242c;
  padding-top: 20px;
  padding-bottom: 8px;
}

.txt-upload2 {
  font-weight: 700;
  font-size: 19px;
  line-height: 24px;
  color: #22242c;
}

.txt-upload3 {
  font-size: 19px;
  line-height: 24px;
  color: #8e8ea1;
}

.full-name {
  text-transform: capitalize;
  color: #ff4a55;
  white-space: nowrap;
  bottom: 2px;
  text-align: center;
  width: 320px;
  height: 38px;
  overflow: hidden;
}

.wrap-img {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
