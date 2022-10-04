<template>
  <div class="d-flex align-center">
    <v-btn fab outlined x-small dark elevation="3" @click="onClick">
      <v-icon color="primary" size="28">mdi-plus-circle-outline</v-icon>
    </v-btn>
    <span class="text--button blue-1 pl-2 btn" @click="onClick">
      {{ $t(text) }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ButtonAddSigner',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  methods: {
    onClick() {
      this.$emit('on-click')
    }
  }
}
</script>

<style lang="scss" scoped></style>
