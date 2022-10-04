<template>
  <v-tooltip bottom content-class="tooltip-bottom">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        color="error"
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
    <span>{{ $t('contract.tooltip.delete') }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'BtnRemove',
  methods: {
    onClick() {
      this.$emit('on-click')
    }
  }
}
</script>

<style lang="scss" scoped></style>
