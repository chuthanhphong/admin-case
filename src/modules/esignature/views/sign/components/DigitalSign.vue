<template>
  <div>
    <div class="px-8 py-6 d-flex justify-center">
      <div class="content-upload-esignature ma-0 mx-5">
        <div class="d-flex justify-space-between" style="width: 100%">
          <v-radio-group v-model="typeCa" class="pl-4 radio-type-upload-esignature">
            <v-radio
              :label="$t('document.signToken')"
              value="TOKEN"
              class="mb-6 text--body-2 color-text-radio"
            />
            <v-radio
              :label="$t('document.signHSM')"
              value="HSM"
              class="text--body-2 color-text-radio"
            />
          </v-radio-group>
          <!-- chon nha cung cap -->
          <div
            v-if="typeCa === 'HSM'"
            class="wrap-item-search py-0 col-12 col-sm-8 col-md-8"
          >
            <div class="">
              <label class="text--body-2">
                {{ $t('document.supplier') }}
                <span class="color-require">*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="provider"
                rules="required"
              >
                <v-select
                  v-model="provider"
                  dense
                  :placeholder="$t('document.chooseSupplier')"
                  outlined
                  attach
                  :error-messages="errors"
                  :no-data-text="$t('noData')"
                  required
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    maxHeight: 200
                  }"
                  :items="lstProvider"
                  item-text="name"
                  item-value="code"
                  class="edoc-text--body-2"
                >
                  <template v-slot:append>
                    <v-icon>mdi-chevron-down</v-icon>
                  </template>
                </v-select>
              </validation-provider>
            </div>
            <div v-if="provider === 'EASY_SIGN'">
              <EasysignCA @update-info="updateIndo" />
            </div>
            <div v-if="provider !== null && provider !== 'EASY_SIGN'">
              <LoginCA @update-info="updateIndoCA" />
            </div>
          </div>
        </div>
      </div>
      <div ref="printcontent" class="wrap-img-print">
        <div class="imageUpload">
          <div class="full-name">
            <FitText :options="options">{{ fullName }} </FitText>
          </div>
        </div>
      </div>
    </div>
    <v-row class="ma-0 mx-10 pb-5">
      <v-col cols="12" md="6" />

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
            :disabled="!isComplete"
            color="primary"
            class="dialog-sign-btn ml-10"
            :loading="loadingBtnSelect"
            @click="acceptCa"
          >
            {{ $t('accuracy') }}
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EasysignCA from './EasysignCA'
import LoginCA from './LoginCA'
import { isEmpty } from 'lodash'
import FitText from '@/views/components/FitText'
import constants from '@/constants'
import html2canvas from 'html2canvas'

export default {
  name: 'DigitalSign',
  components: {
    EasysignCA,
    LoginCA,
    FitText
  },

  props: {
    loadingBtnSelect: {
      type: Boolean,
      default: false
    },
    fullName: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      options: { maxSize: 48 },
      encodeBase64: null,
      loading: false,
      typeCa: 'HSM',
      provider: null,
      pin: null,
      serial: null,
      username: null,
      password: null,
      lstProvider: [
        {
          code: 'CMC',
          name: 'CMC CA'
        },
        {
          code: 'EASY_SIGN',
          name: 'Easysign CA'
        },
        {
          code: 'FPT',
          name: 'FPT CA'
        },
        {
          code: 'VNPT',
          name: 'VNPT CA'
        }
      ],
      isComplete: false
    }
  },
  methods: {
    async convertImage() {
      // Convert
      const el = this.$refs.printcontent
      const options = {
        type: 'dataURL',
        backgroundColor: 'none',
        border: 'none'
      }

      const printCanvas = await html2canvas(el, options)
      const imgSign = this.dataURLtoFile(
        printCanvas.toDataURL('image/png'),
        `${Date.now()}.png`
      )
      if (imgSign) {
        this.$emit('uploading-image', {
          type: constants.IMAGE_TYPES.CA,
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

    updateIndo(formdata) {
      this.username = formdata.username
      this.password = formdata.password
      this.pin = formdata.pin
      this.serial = formdata.serial
      this.activeBtnAccept()
    },

    updateIndoCA(formdata) {
      this.username = formdata.username
      this.password = formdata.password
      this.activeBtnAccept()
    },

    activeBtnAccept() {
      if (this.provider === 'EASY_SIGN') {
        this.isComplete =
          !isEmpty(this.username) &&
          !isEmpty(this.password) &&
          !isEmpty(this.serial) &&
          !isEmpty(this.pin)
      } else {
        this.isComplete = !isEmpty(this.username) && !isEmpty(this.password)
      }
    },

    acceptCa() {
      if (this.provider === 'EASY_SIGN') {
        const formdata = {
          username: this.username,
          password: this.password,
          pin: this.pin,
          serial: this.serial
        }
        if (formdata && this.provider === 'EASY_SIGN') {
          this.encodeBase64 = btoa(JSON.stringify(formdata))
          this.$emit('update-pin', this.encodeBase64, this.provider)
        }
      } else {
        this.convertImage()
      }
    },

    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="scss">
.content-upload-esignature {
  height: 350px;
  width: 650px;
  border: 1px dashed #8e8ea1;
  border-radius: 8px;
  display: flex;
  z-index: 2;
  background-color: #fff;

  label {
    display: inline-block;
    margin-bottom: 5px;
    color: #22242c;
    font-weight: 600 !important;
  }
}
.radio-type-upload-esignature {
    .v-radio .v-label {
      font-weight: 600 !important;
      font-size: 14px !important;
      line-height: 18px !important;
      color: #22242c !important;
    }
  }

.text-digital {
  font-weight: 800;
  font-size: 16px;
  line-height: 20px;
  color: #000000;
}

.wrap-item-search {
  max-height: 350px;
  overflow-y: auto;
  z-index: 5;
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  label {
    text-transform: uppercase;
  }
}

.full-name {
  text-transform: capitalize;
  color: #ff4a55;
  white-space: nowrap;
  bottom: 2px;
  text-align: center;
  width: 398px;
  overflow: hidden;
}

.imageUpload {
  width: 398px;
  height: 194px;
  display: flex;
  align-items: center;
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
