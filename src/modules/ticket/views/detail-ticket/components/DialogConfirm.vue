<template>
  <v-dialog v-model="internalValue" persistent :max-width="widthDialog">
    <v-card class="pb-3">
      <v-layout justify-end class="pt-2 mr-3 mb-6">
        <v-icon color="grey" size="20" @click="onClose">mdi-close</v-icon>
      </v-layout>
      <v-layout justify-center class="px-8 text-center">
        <h6 class="font-weight-bold black--text text-h6">{{ message }}</h6>
      </v-layout>
      <v-layout v-if="warningMsg" justify-center align-end class="mt-1">
        <v-icon color="#FCD405" size="20" class="mr-1">mdi-alert</v-icon>
        <label class="text--body-3 black--text">
          {{ warningMsg }}
        </label>
      </v-layout>
      <v-card-actions>
        <v-layout justify-center>
          <v-col cols="9">
            <v-layout justify-space-between>
              <v-btn
                color="primary"
                rounded
                outlined
                elevation="1"
                class="w-120 py-5 mr-0 mr-md-6 bg-white"
                @click="onClose"
              >
                <span class="text-primary">{{ $t("cancel") }}</span>
              </v-btn>
              <v-btn
                color="primary"
                rounded
                class="w-120 py-5"
                @click="onAccept"
              >
                {{ $t("agree") }}
              </v-btn>
            </v-layout>
          </v-col>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "DialogConfirm",
  props: {
    widthDialog: {
      type: Number,
      default: 460,
    },
    value: Boolean,
    message: {
      type: String,
      default: null,
    },
    warningMsg: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      internalValue: this.value,
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
    onClose() {
      this.$emit("input", false);
    },
    onAccept() {
      this.$emit("on-accept");
      this.onClose();
    },
  },
};
</script>
