<template>
  <v-snackbar
    v-model="internalValue"
    transition="slide-x-reverse-transition"
    v-bind="{
      ...$attrs
    }"
    :color="colorBgSnackbar"
    timeout="3000"
    :class="`alert-${type}`"
  >
    <div class="pa-2 py-4 d-flex align-center">
      <v-icon v-if="showIcon" :color="colorSnackbar" class="v-alert__icon">
        {{ iconAlert }}
      </v-icon>
      <div class="alert-content">
        <slot />
      </div>
    </div>
    <template v-slot:action="{ attrs }">
      <v-btn color="white" icon v-bind="attrs" @click="internalValue = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  name: 'BaseMaterialSnackbar',

  props: {
    dismissible: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'info'
    },
    value: Boolean,
    icon: {
      type: String,
      default: undefined
    }
  },

  data() {
    return {
      internalValue: this.value
    }
  },
  computed: {
    colorBgSnackbar() {
      switch (this.type) {
        case 'error':
          return '#FFDBDB'
        case 'success':
          return '#DBFFFF'
        case 'warning':
          return '#FFFDEC'
        default:
          return '#ffffff'
      }
    },
    colorSnackbar() {
      switch (this.type) {
        case 'error':
          return '#FF4A55'
        case 'success':
          return '#20C2C4'
        case 'warning':
          return '#FFB74A'
        default:
          return '#0FAFE4'
      }
    },
    iconAlert() {
      switch (this.type) {
        case 'error':
          return 'mdi-close-circle'
        case 'success':
          return 'mdi-check-circle'
        case 'warning':
          return 'mdi-alert-circle'
        default:
          return 'mdi-information'
      }
    }
  },
  watch: {
    internalValue(val, oldVal) {
      if (val === oldVal) return

      this.$emit('input', val)
    },
    value(val, oldVal) {
      if (val === oldVal) return

      this.internalValue = val
    }
  }
}
</script>
