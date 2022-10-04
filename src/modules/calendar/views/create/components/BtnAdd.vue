<template>
  <div v-if="show" class="d-flex align-center" style="cursor: pointer">
    <v-btn
      icon
      color="#5d5fef"
      class="btn-remove-signer"
      small
      dark
      @click="onClick"
    >
      <img width="24px" src="@/assets/icons/ic-add.svg" alt="" />
    </v-btn>
    <span class="pl-1 calendar-text--body-4" @click="onClick">{{
      $t(tooltip)
    }}</span>
  </div>
</template>

<script>
export default {
  name: "BtnAdd",
  props: {
    tooltip: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onClick() {
      this.$emit("on-click");
    },
  },
};
</script>

<style lang="scss" scoped></style>
