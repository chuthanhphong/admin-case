<template>
  <div class="px-8 py-6 d-flex justify-center">
    <div class="wrap-draw">
      <div class="draw-img">
        <!-- Text ve tai day -->
        <span v-show="!showClear" class="text-draw">
          {{ $t("drawHere") }}
        </span>

        <VueSignaturePad
          ref="signaturePad"
          width="398px"
          height="194px"
          class="sign-pad"
          :options="{ onBegin, onEnd }"
        />

        <!-- btn delete -->
        <v-tooltip v-if="showClear" top content-class="tooltip-top">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              color="secondary"
              icon
              elevation="2"
              class="btn-clear-draw"
              v-on="on"
              @click="clear"
            >
              <v-icon size="25" color="#4B506D"> mdi-trash-can-outline </v-icon>
            </v-btn>
          </template>
          <div>
            {{ $t("contract.label.clearImageSign") }}
          </div>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import fileMixin from "@/modules/econtract/mixins/fileMixin";
export default {
  mixins: [fileMixin],
  data: () => ({
    showClear: false,
    canSave: true,
  }),
  computed: {
    ...mapState("contract", ["imageDrawSignData"]),
  },
  watch: {
    imageDrawSignData() {
      if (this.imageDrawSignData) {
        // this.$refs.signaturePad.fromDataURL(this.imageDrawSignData.dataImgSign)
      }
    },
  },
  methods: {
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    clear() {
      this.$refs.signaturePad.clearSignature();
      this.$emit("on-choose-draw-signature", null);
      this.showClear = false;
    },
    save() {
      setTimeout(() => {
        const { data } = this.$refs.signaturePad.saveSignature();
        console.log("====================================");
        console.log(data);
        console.log("====================================");
        const imgSign = this.dataURLtoFile(data, `${Date.now()}.png`);
        this.$emit("on-choose-draw-signature", imgSign);
      }, 500);
    },
    onBegin() {
      this.showClear = true;
      this.$emit("on-choose-draw-signature", null);
    },
    onEnd() {
      this.save();
    },
  },
};
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

.btn-clear-draw {
  position: absolute;
  bottom: -35px;
  right: 4px;
  z-index: 4;
}
</style>
