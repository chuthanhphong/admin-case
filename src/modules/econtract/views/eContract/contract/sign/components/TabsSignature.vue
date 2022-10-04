<template>
  <div>
    <v-tabs v-model="activeTab" fixed-tabs>
      <v-tab key="upload">
        {{ $t("signTabUpload") }}
      </v-tab>
      <v-tab key="draw">
        {{ $t("signTabDraw") }}
      </v-tab>
      <v-tab key="ca">
        {{ $t("contract.label.ca") }}
      </v-tab>
    </v-tabs>
    <v-divider class="mx-14" />
    <v-tabs-items v-model="activeTab">
      <v-tab-item key="upload">
        <upload-image-signature
          @uploading-image="uploadingImage"
          @reset-image="resetImage"
          @choose-image-sign="chooseImageSign"
        />
      </v-tab-item>
      <v-tab-item key="draw">
        <signature-pad @on-choose-draw-signature="chooseDrawSignature" />
      </v-tab-item>
      <v-tab-item key="ca">
        <input-pin-ca
          :full-name="fullName"
          @accept-pin-ca="acceptPinCA"
          @update-pin="updatePinCA"
          @uploadFakeImgCA="uploadFakeImgCA"
          @close-dialog="closeDialog"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import constants from "@/constants";
import SignaturePad from "./SignaturePad.vue";
import UploadImageSignature from "./UploadImageSignature.vue";
import { mapState, mapActions } from "vuex";
import { FileService } from "@/modules/econtract/services/fileService";
import InputPinCa from "./InputPinCa";
export default {
  components: { SignaturePad, UploadImageSignature, InputPinCa },
  props: {
    idSignature: {
      type: Number,
      default: undefined,
    },
    tabSign: {
      type: Number,
      default: 0,
    },
    fullName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      methosSign: constants.SIGNATURE_METHODS,
      method: constants.SIGNATURE_METHODS.MAIN,
      activeTab: 0,
    };
  },
  computed: {
    ...mapState("contract", [
      "signatureId",
      "imageMainSignData",
      "imageInitialSignData",
      "imageDrawSignData",
    ]),
  },
  watch: {
    activeTab() {
      let type = "";
      if (this.activeTab === 0) {
        type = "upload";
      }
      if (this.activeTab === 1) {
        type = "draw";
      }
      if (this.activeTab === 2) {
        type = "ca";
      }
      this.$emit("active-tab", type);
    },
  },
  mounted() {
    this.activeTab = this.tabSign;
  },

  methods: {
    ...mapActions("contract", ["setImageSign"]),

    toggleDialog(value) {
      this.$emit("toggle-dialog-select-singer", value);
    },
    chooseDrawSignature(data) {
      if (data) {
        this.uploadingImage({
          type: constants.IMAGE_TYPES.DRAW,
          file: data,
        });
      } else {
        // Xoa chu viet tay
        const payloadImage = {
          type: constants.IMAGE_TYPES.DRAW,
          data: null,
        };
        this.setImageSign(payloadImage);
      }
    },
    // Chon anh ky
    chooseImageSign(type) {
      this.$emit("choose-image-type", type);
    },
    // Upload anh vs tai anh
    async uploadingImage({ type, file }) {
      var formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", constants.FILE_TYPES.FILE_IMAGE_SIGNATURE);
      const response = await FileService.upload(formData, false);
      if (response.success) {
        const { data } = response;
        const dataImgSign = await FileService.download(
          {
            ...data,
          },
          file.type
        );
        const payloadImage = {
          type,
          data: {
            dataImgSign,
            ...data,
          },
        };
        this.setImageSign(payloadImage);
      }
    },
    // Reset lai anh
    resetImage({ type }) {
      const payloadImage = {
        type,
        data: null,
      };
      this.setImageSign(payloadImage);
    },
    acceptPinCA(pin) {
      this.$emit("accept-pin-ca", pin);
    },
    updatePinCA(pin) {
      this.$emit("update-pin", pin);
    },
    uploadFakeImgCA(imgSign) {
      this.$emit("uploadFakeImgCA", imgSign);
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
  },
};
</script>

<style lang="scss"></style>
