<template>
  <v-dialog v-model="internalValue" persistent :max-width="widthDialog">
    <v-card class="pb-3">
      <v-layout justify-end class="pt-2 mr-3 mb-6">
        <v-icon color="grey" size="20" @click="onClose">mdi-close</v-icon>
      </v-layout>
      <v-layout justify-center class="px-8 text-center">
        <h6 class="font-weight-bold black--text text-h6">{{ message }}</h6>
      </v-layout>
      <v-layout column class="px-4 mt-3">
        <v-layout>
          <label class="text--body-1-7 darken--text">
            {{ $t("tickets.labels.reason") }}:
          </label>
        </v-layout>
        <v-layout>
          <v-text-field
            v-model="reason"
            outlined
            dense
            :placeholder="$t('tickets.placeholders.inputReason')"
            :maxlength="maximumSmallText"
            :counter="maximumSmallText"
          >
          </v-text-field>
        </v-layout>
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
import constants from "@/constants";

export default {
  name: "DialogConfirmReason",
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
  },
  data() {
    return {
      internalValue: this.value,
      maximumSmallText: constants.MAXIMUM_SMALL_TEXT,
      reason: "",
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
      const parEmit = this.reason;
      this.$emit("on-accept", parEmit);
      this.onClose();
      this.resetData();
    },
    resetData() {
      this.reason = "";
    },
  },
};
</script>
