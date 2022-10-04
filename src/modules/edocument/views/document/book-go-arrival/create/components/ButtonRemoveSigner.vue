<template>
  <v-tooltip bottom content-class="tooltip-bottom">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        color="#5d5fef"
        class="btn-remove-signer"
        v-bind="attrs"
        fab
        dark
        v-on="on"
        @click="onClick"
      >
        <v-icon>mdi-minus-circle-outline</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('document.tooltip.delete') }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'ButtonRemoveSigner',
  methods: {
    onClick() {
      this.$emit('on-click')
    }
  }
}
</script>

<style lang="scss" scoped></style>
