<template>
  <v-dialog v-model="showDialog" max-width="65%" persistent>
    <v-card class="econtract-dialog-select-sign">
      <v-row class="close-dialog-sign ma-0">
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </v-row>

      <v-row class="title-dialog-sign ma-0 mb-2">
        {{ $t("contract.label.selectSignature") }}
      </v-row>

      <!-- Tab -->
      <tabs-signature
        :full-name="fullName"
        :tab-sign="focusTabSign"
        @uploadFakeImgCA="uploadFakeImgCA"
        @active-tab="activeTap"
        @choose-image-type="chooseImageSign"
        @accept-pin-ca="acceptPinCA"
        @update-pin="updatePinCA"
        @close-dialog="closeDialog"
      />

      <!-- Buttom button -->
      <div
        v-if="currentTab !== 'ca'"
        class="d-flex flex-row justify-end align-start pr-2 pb-4 "
      >
        <v-btn
          class="dialog-sign-btn"
          color="primary"
          outlined
          rounded
          @click="closeDialog"
        >
          {{ $t("cancelLabel") }}
        </v-btn>

        <v-btn
          :disabled="!activeBtnAccept"
          class="dialog-sign-btn ml-10"
          color="primary"
          rounded
          @click="accept"
        >
          {{ $t("selectLabel") }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import TabsSignature from "./TabsSignature";
import { mapState } from "vuex";
import constants from "@/constants";

export default {
  components: {
    TabsSignature,
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    focusTabSign: {
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
      currentTab: "upload",
      imageSignType: constants.IMAGE_TYPES.MAIN,
      error: "",
      pinCA: "",
    };
  },
  computed: {
    ...mapState("contract", [
      "signatureId",
      "imageMainSignData",
      "imageInitialSignData",
      "imageDrawSignData",
    ]),
    activeBtnAccept() {
      if (this.currentTab === "upload") {
        if (this.imageSignType === constants.IMAGE_TYPES.MAIN) {
          return this.imageMainSignData != null;
        }
        return this.imageInitialSignData != null;
      } else if (this.currentTab === "draw") {
        return this.imageDrawSignData != null;
      } else {
        return this.pinCA && this.pinCA.trim().length > 0;
      }
    },
  },
  methods: {
    updatePinCA(obj) {
      this.$emit("accept-pin-ca", obj);
      this.closeDialog();
    },
    uploadFakeImgCA(obj) {
      this.$emit("acceptFakeImgCA", obj);
      this.closeDialog();
    },

    closeDialog() {
      this.$emit("close-dialog");
    },
    accept() {
      var signatureImage = null;
      if (this.currentTab === "upload") {
        if (this.imageSignType === constants.IMAGE_TYPES.MAIN) {
          if (!this.imageMainSignData) {
            this.error = "contract.mainSignatureRequired";
            return;
          }
          signatureImage = this.imageMainSignData;
        } else {
          if (!this.imageInitialSignData) {
            this.error = "contract.initialSignatureRequired";
            return;
          }
          signatureImage = this.imageInitialSignData;
        }
        this.$emit("accept", signatureImage);
      } else if (this.currentTab === "draw") {
        if (!this.imageDrawSignData) {
          this.error = "contract.drawSignatureRequired";
          return;
        }
        signatureImage = this.imageDrawSignData;
        this.$emit("accept", signatureImage);
      }
      this.error = "";
      this.closeDialog();
    },
    acceptPinCA(pin) {
      this.$emit("accept-pin-ca", pin);
    },
    activeTap(tab) {
      this.currentTab = tab;
      this.error = "";
    },
    chooseImageSign(type) {
      this.imageSignType = type;
    },
  },
};
</script>

<style lang="scss">
.econtract-dialog-select-sign {
  .close-dialog-sign {
    color: #8e8ea1;
    justify-content: end;
    padding-right: 10px;
    padding-top: 10px;
  }

  .title-dialog-sign {
    font-weight: 800;
    font-size: 19px;
    line-height: 24px;
    text-transform: capitalize;
    color: #22242c;
    justify-content: center;
  }

  .v-tab {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #22242c;
    text-transform: none;
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
}
</style>
