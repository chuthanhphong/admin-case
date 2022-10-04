<template>
  <v-fade-transition>
    <v-dialog v-model="internalValue" persistent :max-width="widthDialog">
      <v-card class="px-7 py-5">
        <v-layout justify-space-between>
          <v-layout align-center>
            <h5 class="mr-2">Cập nhật tiến độ</h5>
            <v-text-field
              v-model="dataProcess.process"
              type="number"
              hide-details
              dense
              outlined
              class="mw-150"
              @keypress="isNumber"
              @change="changeProcess"
            />
          </v-layout>
          <v-icon class="mt-n8 mr-n4" @click="onClose">mdi-close</v-icon>
        </v-layout>
        <div class="d-flex justify-center align-center wp-100 mt-16">
          <v-slider
            v-model="dataProcess.process"
            height="8"
            thumb-label="always"
            color="primary gray"
            track-color="#E7ECF1"
            track-fill-color="primary"
            class="h-slider-8"
            :thumb-color="color"
          />
        </div>
        <div class="d-flex justify-center mt-4">
          <v-btn
            color="primary"
            class="w-150 rounded-xl text--label-2"
            @click="changeProcess()"
          >
            {{ $t("tickets.labels.update") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-fade-transition>
</template>
<script>
export default {
  name: "DialogUpdateProcess",
  props: {
    value: Boolean,
    widthDialog: {
      type: Number,
      default: 488,
    },
    dataProcess: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      internalValue: this.value,
      color: "#00C3F9",
    };
  },
  watch: {
    internalValue(val, oldVal) {
      if (val === oldVal) return;

      this.$emit("input", val);
    },
    value(val, oldVal) {
      if (val === oldVal) return;

      this.internalValue = val;
    },
  },
  methods: {
    changeProcess() {
      this.$emit("change-process", this.dataProcess);
      this.onClose()
    },
    isNumber(event) {
      if (event.key === ".") {
        return event.preventDefault();
      } else {
        return true;
      }
    },
    onClose() {
      this.$emit('input', false)
    }
  },
};
</script>
<style scoped>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(191 191 191 / 40%);
  justify-content: center;
  align-items: center;
  display: flex;
}

.process {
  transform-origin: center center;
  max-width: 423px;
  overflow-y: auto;
  pointer-events: auto;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
  z-index: inherit;
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
  background: #ffffff;
  border-radius: 15px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin: 10px 10px 35px;
}

.close {
  font-size: 20px;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.v-slider--horizontal.v-slider__track-container {
  height: 10px;
}
</style>
