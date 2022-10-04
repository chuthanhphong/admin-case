<template>
  <div class="d-flex align-center">
    <v-btn
      fab
      outlined
      x-small
      dark
      elevation="3"
      @click="onClick"
    >
      <v-icon color="primary" size="28">mdi-plus-circle-outline</v-icon>
    </v-btn>
    <b class="primary--text pl-1 btn" @click="onClick">{{ $t(tooltip) }}</b>
  </div>
</template>

<script>
export default {
  name: 'BtnAdd',
  props: {
    tooltip: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
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
