<template>
  <v-overlay :value="isLoading">
    <v-progress-circular indeterminate size="45" width="2" />
  </v-overlay>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped></style>
