<template>
  <v-tooltip bottom content-class="tooltip-bottom">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        color="#5d5fef"
        class="btn-remove-participant"
        v-bind="attrs"
        small
        dark
        v-on="on"
        @click="onClick"
      >
        <img width="24px" src="@/assets/icons/ic-minus.svg" alt="" />
      </v-btn>
    </template>
    <span>{{ $t("document.tooltip.delete") }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "ButtonRemoveSigner",
  methods: {
    onClick() {
      this.$emit("on-click");
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-remove-participant {
  color: #000 !important;
  background-color: #fff;
}
</style>
