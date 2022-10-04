<template>
  <div class="px-8 py-6 d-flex justify-center">
    <div class="wrap-content-upload hover--pointer" @click="uploaImagSign('imageMainSign')">
      <div
        v-if="previewImgMainSign"
        :style="{ 'background-image': `url(${previewImgMainSign})` }"
        class="imagePreviewWrapper"
      />

      <v-file-input
        id="imageMainSign"
        v-model="imageMainSign"
        accept="image/*"
        class="img-sign"
        @change="onChangeImageMainSign"
      />

      <!-- Text upload -->
      <div v-if="!imageMainSign" class="d-flex flex-column align-center justify-center txt-upload">
        <v-tooltip content-class="tooltip-top" top>
          <template v-slot:activator="{ on, attrs }">
            <img
              alt="upload"
              height="50"
              src="@/assets/icons/ic_upload.png"
              v-bind="attrs"
              width="50"
              v-on="on"
            />
          </template>
          <span>{{ $t("uploadImg") }}</span>
        </v-tooltip>

        <span class="txt-upload1">
          {{ $t("imgUploadSize") }}
        </span>
        <div>
          <span class="txt-upload2">
            {{ $t("imgUploadSize1") }}
          </span>
          <span class="txt-upload3">
            {{ $t("imgUploadSize2") }}
          </span>
        </div>
      </div>

      <!-- <v-tooltip v-if="previewImgMainSign" top content-class="tooltip-top">
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
          >
            <v-icon size="25">mdi-circle-edit-outline</v-icon>
          </v-btn>
        </template>
        <div>
          {{ $t("contract.label.editImageSign") }}
        </div>
      </v-tooltip> -->
    </div>
  </div>
</template>

<script>
import constants from "@/constants";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      methosSign: constants.SIGNATURE_METHODS,
      method: constants.SIGNATURE_METHODS.MAIN,
      imageMainSign: null,
      tmpImageMainSign: null,
      imageInitialSign: null,
      tmpImageInitialSign: null,
      previewImgMainSign: null,
      previewImgInitialSign: null,
      uploadingImgMain: false,
      uploadingImgInitial: false,
      uploadingImgDraw: false,
      errorImgMainSign: "",
      errorImgInitialSign: "",
    };
  },
  computed: {
    ...mapState("contract", [
      "signatureId",
      "imageMainSignData",
      "imageInitialSignData",
    ]),
  },
  watch: {
    method() {
      this.$emit("choose-image-sign", this.method);
    },
  },
  methods: {
    ...mapActions("contract", ["setImageSign"]),
    ...mapActions("layout", ["setNotify"]),
    uploaImagSign(typeImg) {
      document.getElementById(typeImg).click();
    },
    // Chon anh ky chinh
    async onChangeImageMainSign(file) {
      if (file) {
        var isError = false;
        if (!file.type.includes("png")) {
          this.$emit("reset-image", {
            type: constants.IMAGE_TYPES.MAIN,
          });
          this.showError("contract.requireTypePng");
          isError = true;
        }
        // Validate size anh
        if (!this.validateSize(file.size)) {
          this.showError("contract.imgeMaxSize");
          isError = true;
        }
        if (isError) {
          this.$emit("reset-image", {
            type: constants.IMAGE_TYPES.MAIN,
          });
          this.previewImgMainSign = null;
          this.imageMainSign = null;
          this.tmpImageMainSign = null;
          return;
        }
        const payloadImage = {
          type: constants.IMAGE_TYPES.MAIN,
          data: null,
        };
        this.setImageSign(payloadImage);
        this.errorImgMainSign = "";
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImgMainSign = e.target.result;
        };
        reader.readAsDataURL(file);
        this.tmpImageMainSign = this.imageMainSign;
        // Upload file
        this.uploadingImgMain = true;
        await this.$emit("uploading-image", {
          type: constants.IMAGE_TYPES.MAIN,
          file,
        });
        this.uploadingImgMain = false;
      } else {
        if (this.tmpImageMainSign) {
          this.imageMainSign = this.tmpImageMainSign;
        } else {
          this.previewImgMainSign = null;
        }
      }
    },
    // Hien thi thong bao loi
    showError(msg) {
      const message = msg;
      const typeAlert = "error";
      this.setNotify({
        show: true,
        type: typeAlert,
        content: message,
      });
    },
    // Chon anh ky nhay
    async onChangeImageInitialSign(file) {
      if (file) {
        var isError = false;
        // Validate loai anh
        if (!file.type.includes("png")) {
          const message = "contract.requireTypePng";
          this.showError(message);
          isError = true;
        }
        // Validate size anh
        if (!this.validateSize(file.size)) {
          const message = "contract.imgeMaxSize";
          this.showError(message);
          isError = true;
        }
        if (isError) {
          this.$emit("reset-image", {
            type: constants.IMAGE_TYPES.INITIAL,
          });
          this.previewImgInitialSign = null;
          this.imageInitialSign = null;
          this.tmpImageInitialSign = null;
          return;
        }
        const payloadImage = {
          type: constants.IMAGE_TYPES.INITIAL,
          data: null,
        };
        this.setImageSign(payloadImage);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImgInitialSign = e.target.result;
        };
        reader.readAsDataURL(file);
        this.tmpImageInitialSign = this.imageInitialSign;
        this.uploadingImgInitial = true;
        this.$emit("uploading-image", {
          type: constants.IMAGE_TYPES.INITIAL,
          file,
        });
        this.uploadingImgInitial = false;
      } else {
        if (this.tmpImageInitialSign) {
          this.imageInitialSign = this.tmpImageInitialSign;
        } else {
          this.previewImgInitialSign = null;
        }
      }
    },
    validateSize(size) {
      const sizeLimit = 15 * 1024 * 1024;
      return size < sizeLimit;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-content-upload {
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
.avatar {
  overflow: hidden;
  position: relative;
}
.imagePreviewWrapper {
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
.margin-icon-sign {
  margin-left: auto;
  margin-right: 5px;
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
</style>
