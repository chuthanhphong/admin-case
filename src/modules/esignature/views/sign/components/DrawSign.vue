<template>
  <div class="px-8 py-6 d-flex justify-center">
    <div class="wrap-draw">
      <div class="draw-img">
        <!-- Text ve tai day -->
        <span v-show="!showClear" class="text-draw">
          {{ $t('drawHere') }}
        </span>

        <VueSignaturePad
          ref="signaturePad"
          width="398px"
          height="194px"
          class="sign-pad"
          :options="{ onBegin, onEnd }"
        />

        <!-- btn delete -->
        <v-tooltip v-if="clearDrawImg" top content-class="tooltip-top">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              color="secondary"
              class="btn-clear-draw"
              v-on="on"
              @click="clear"
            >
              <v-icon size="25">mdi-close</v-icon>
            </v-btn>
          </template>
          <div>
            {{ $t('document.label.clearImageSign') }}
          </div>
        </v-tooltip>

        <div v-if="showFullname" class="full-name">
          <FitText>{{ fullName }} </FitText>
        </div>

        <div v-else class="full-name-not-selected">fullName</div>
      </div>
    </div>

    <div ref="printcontent" class="wrap-img-print">
      <div
        v-if="imgDraw"
        class="imageUpload"
        :style="{ 'background-image': `url(${imgDraw})` }"
      />
      <div v-if="showFullname" class="full-name">
        <FitText>{{ fullName }} </FitText>
      </div>
    </div>
  </div>
</template>
<script>
import FitText from '@/views/components/FitText'
import constants from '@/constants'
import { mapState, mapActions } from 'vuex'
import html2canvas from 'html2canvas'
export default {
  components: {
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
      showClear: false,
      imgDraw: null,
      isChange: false
    }
  },
  computed: {
    ...mapState('document', ['clearDrawImg', 'showFullName'])
  },
  watch: {
    showFullName() {
      if (this.currentTab !== 1) this.isChange = true
      if (this.imgDraw && this.currentTab === 1) {
        this.setClearDrawImg(false)
        this.save()
      }
    },

    currentTab() {
      if (this.currentTab === 1 && this.isChange) {
        this.isChange = false
        this.setClearDrawImg(false)
        this.save()
      }
    }
  },
  methods: {
    ...mapActions('document', [
      'setClearDrawImg',
      'setClickClearDraw',
      'setLoadingBtnSelect'
    ]),

    // Clear signPad
    clear() {
      this.$refs.signaturePad.clearSignature()
      this.$emit('reset-image', constants.IMAGE_TYPES.DRAW)
      this.showClear = false
      this.setClearDrawImg(false)
      this.setClickClearDraw(true)
      this.imgDraw = null
    },

    async save() {
      this.setLoadingBtnSelect(true)
      const { data } = this.$refs.signaturePad.saveSignature()
      this.imgDraw = data
      if (this.showFullName) {
        setTimeout(() => {
          this.convertImage()
        }, 200)
      } else {
        this.convertImgWithNoName(data)
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
          type: constants.IMAGE_TYPES.DRAW,
          file: imgSign
        })
      }
    },

    convertImgWithNoName(data) {
      const imgSign = this.dataURLtoFile(data, `${Date.now()}.png`)
      if (imgSign) {
        this.$emit('uploading-image', {
          type: constants.IMAGE_TYPES.DRAW,
          file: imgSign
        })
      }
    },

    onBegin() {
      this.showClear = true
      this.setClickClearDraw(false)
    },

    onEnd() {
      this.setClearDrawImg(false)
      this.save()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-draw {
  width: 400px;
  height: 240px;
  border-radius: 8px;
  border: 1px dashed #8e8ea1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 4px;
}

.btn-clear-draw {
  position: absolute;
  bottom: 4px;
  right: 4px;
  z-index: 4;
}

.draw-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: white;
  z-index: 2;
}

.text-draw {
  position: absolute;
  z-index: 2;
  font-weight: 400;
  font-size: 19px;
  top: 100px;
  letter-spacing: 0.2px;
  color: #c4c4c4;
}

.sign-pad {
  z-index: 3;
}

.full-name {
  text-transform: capitalize;
  color: #ff4a55;
  white-space: nowrap;
  bottom: 2px;
  text-align: center;
  width: 398px;
  height: 38px;
  overflow: hidden;
}

.full-name-not-selected {
  font-weight: 700;
  font-size: 24px;
  text-transform: capitalize;
  opacity: 0;
  white-space: nowrap;
  bottom: 2px;
  text-align: center;
}

.imageUpload {
  width: 398px;
  height: 194px;
  display: block;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
}

.wrap-img-print {
  position: absolute;
  z-index: 1;
  padding-top: 5px;
}
</style>
