<template>
  <v-dialog v-model="showDialog" persistent :max-width="widthDialog">
    <v-card>
      <v-icon class="close-dialog" color="#8E8EA1" @click="closeDialog">
        mdi-close
      </v-icon>
      <h5 class="text-center text-capitalize pt-6 px-10">
        {{ $t(titleConfirm) }}
      </h5>
      <div class="pa-4">
        <h6 class="d-flex justify-start pb-2">
          {{ $t("tickets.labels.reason") }}:
        </h6>
        <v-textarea
          class="text--body-5"
          counter="500"
          maxlength="500"
          name="note"
          outlined
          :placeholder="$t('tickets.placeholders.inputReason')"
          rows="2"
          v-model="rejectReason"
          @change="rejectReason = trimSpace(rejectReason)"
          style="border-radius: 12px"
        ></v-textarea>
      </div>

      <v-card-actions class="d-flex justify-space-around py-6">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-200 py-6"
          @click="closeDialog"
        >
          {{ $t("cancelLabel") }}
        </v-btn>

        <v-btn rounded color="primary" class="w-200 py-6" @click="accept">
          {{ $t("accept") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    widthDialog: {
      type: Number,
      default: 460,
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    titleConfirm: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      rejectReason: "",
    };
  },
  methods: {
    trimSpace(val) {
      return val ? val.trim() : ''
    },
    accept() {
      this.$emit("reason", this.rejectReason);
      this.$emit("accept-action");
      this.closeDialog();
    },
    closeDialog() {
      this.rejectReason = "";
      this.$emit("close-dialog");
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card__title {
  word-break: normal;
}
</style>
