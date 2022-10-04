<template>
  <v-dialog v-model="internalValue" persistent :max-width="widthDialog">
    <v-card class="pb-3">
      <v-layout justify-end class="pt-2 mr-3 mb-1">
        <v-icon color="grey" size="20" @click="onClose">mdi-close</v-icon>
      </v-layout>
      <v-layout justify-center class="px-8 text-center mb-1">
        <h6 class="font-weight-bold black--text text-h6">{{ message }}</h6>
      </v-layout>
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
      this.$router.push('/home');
    },
  },
};
</script>
