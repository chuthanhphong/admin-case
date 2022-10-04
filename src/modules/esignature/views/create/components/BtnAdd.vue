<template>
  <v-tooltip bottom content-class="tooltip-bottom">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        fab
        dark
        x-small
        :disabled="showButtom"
        elevation="3"
        v-bind="attrs"
        v-on="on"
        @click="onClick"
      >
        <v-icon size="30">mdi-plus-circle-outline</v-icon>
      </v-btn>
    </template>
    <span>{{ $t(tooltip) }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'BtnAdd',
  props: {
    tooltip: {
      type: String,
      default: ''
    },
    showButtom: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick() {
      this.$emit('on-click')
    }
  }
}
</script>

<style lang="scss" scoped>
.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: rgba(0, 0, 0, 0.12) !important;
  color: rgba(0, 0, 0, 0.26) !important;
}
</style>
