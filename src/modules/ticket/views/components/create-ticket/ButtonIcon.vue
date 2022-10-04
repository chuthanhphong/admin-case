<template>
  <div class="d-flex flex-column align-center mx-2">
    <v-btn
      fab
      x-small
      outlined
      elevation="false"
      class="border-dashed"
      :class="getStateAction"
      :disabled="isDisabled"
      @click="onClick"
    >
      <v-tooltip v-if="textTooltip" top max-width="250" class="box-shadow">
        <template v-slot:activator="{ on, attrs }">
          <i class="app-icon" :class="getClassIcon" v-bind="attrs" v-on="on" />
        </template>
        <span>
          {{ textTooltip }}
        </span>
      </v-tooltip>
      <i v-else class="app-icon" :class="textIcon" />
    </v-btn>
    <label class="text-caption" :class="getColorText">{{ textAction }}</label>
  </div>
</template>
<script>
export default {
  props: {
    textAction: {
      type: String,
      default: null,
    },
    textIcon: {
      type: String,
      default: null,
    },
    onClick: {
      type: Function,
      default: null,
    },
    isActived: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    textTooltip: {
      type: String,
      default: null,
    },
  },
  computed: {
    getStateAction() {
      if (this.isActived) return "active";

      return "";
    },
    getColorText() {
      if (this.isActived) return "purple--text";

      if (this.isDisabled) return "text--disabled";

      return "";
    },
    getClassIcon() {
      if (this.isActived) return `${this.textIcon} purple`;

      return `${this.textIcon}`;
    },
  },
};
</script>
