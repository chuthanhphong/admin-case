<template>
  <div>
    <div class="px-8 py-6 d-flex justify-center">
      <div class="content-upload ma-0 mx-5">
        <div class="d-flex justify-space-between responsive-select-sign" style="width: 100%">
          <v-radio-group v-model="typeCa" class="pl-4 radio-type-upload-esignature">
            <v-radio
              :label="$t('signToken')"
              class="mb-6 text--body-2 color-text-radio"
              value="TOKEN"
            />
            <v-radio
              :label="$t('signHSM')"
              class="text--body-2 color-text-radio"
              value="HSM"
            />
          </v-radio-group>
          <!-- chon nha cung cap -->
          <div
            v-if="typeCa === 'HSM'"
            class="wrap-item-search py-0 col-sm-8 col-md-8 px-1"
          >
            <div class="">
              <label class="text--body-2">
                {{ $t('supplier') }}
                <span class="color-require">*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="supplier"
                rules="required"
              >
                <v-select
                  v-model="provider"
                  :error-messages="errors"
                  :items="lstProvider"
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    maxHeight: 200
                  }"
                  :no-data-text="$t('noData')"
                  :placeholder="$t('chooseSupplier')"
                  attach
                  class="edoc-text--body-2"
                  dense
                  item-text="name"
                  item-value="code"
                  outlined
                  required
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
      <div ref="printcontent" class="wrap-img-print opacity-1">
        <div class="imageUpload">
          <div class="full-name">
            <FitText :options="options">{{ fullName }} </FitText>
          </div>
        </div>
      </div>
    <!-- button -->
    </div>
    <div class="py-4 pr-2 d-flex flex-row flex-nowrap justify-end align-center">
      <v-btn
        class="dialog-sign-btn"
        color="primary"
        outlined
        rounded
        @click="closeDialog"
      >
        {{ $t('cancelLabel') }}
      </v-btn>

      <v-btn
        :disabled="!isComplete"
        class="dialog-sign-btn ml-10"
        color="primary"
        rounded
        @click="acceptCa"
      >
        {{ $t('accuracy') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import FitText from '@/views/components/FitText'
import EasysignCA from './EasysignCA'
import LoginCA from './LoginCA'
import { isEmpty } from 'lodash'
import html2canvas from 'html2canvas'
import constants from '@/constants'

export default {
  components: {
    EasysignCA,
    LoginCA,
    FitText
  },
  props: {
    fullName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: { maxSize: 48 },
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
  watch: {
    // pin() {
    //   this.$emit("update-pin", this.pin);
    //   if (this.pin.trim().length > 0) {
    //     this.error = "";
    //   }
    // },
  },
  mounted() {
    // this.$emit("update-pin", this.pin);
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
        this.$emit('uploadFakeImgCA', {
          file: imgSign,
          type: constants.SIGN_TYPES.CA
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
          const encodeBase64 = btoa(JSON.stringify(formdata))
          this.$emit('update-pin', {
            metaData: encodeBase64,
            provider: this.provider
          })
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

<style lang="scss" scoped>

.responsive-select-sign{
  @media (max-width: 600px) {
    width: 400px!important;
  }
}
.content-upload {
  height: 350px;
  width: 650px;
  border: 1px dashed #8e8ea1;
  border-radius: 8px;
  display: flex;
  z-index: 2;
  background-color: #fff;
  @media(max-width: 1000px){
    .button-responsive{
    }

  }

  .radio-type-upload {
    .v-radio .v-label {
      font-weight: 700;
      font-size: 14px;
      line-height: 18px;
      color: #22242c;
    }
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

.wrap-img-print {
  position: absolute;
  z-index: 1;
  margin-top: -20px;
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

.full-name {
  text-transform: capitalize;
  color: #ff4a55;
  white-space: nowrap;
  bottom: 2px;
  text-align: center;
  width: 398px;
  overflow: hidden;
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
</style>
