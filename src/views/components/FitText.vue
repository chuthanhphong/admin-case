<template>
  <span class="fit"><slot /></span>
</template>

<script>
import fitty from 'fitty'

export default {
  name: 'FitText',
  props: {
    options: {
      type: Object,
      required: false,
      default() {
        return {
          minSize: 10,
          maxSize: 24,
          multiLine: false
        }
      }
    }
  },
  data() {
    return {
      $_fitty: undefined
    }
  },
  destroyed() {
    this.$_fitty.unsubscribe()
  },
  mounted() {
    this.$_fitty = fitty(this.$el, this.options)
  }
}
</script>

<style scoped>
.fit {
  display: inline-block;
  white-space: nowrap;
  font-weight: 700;
}
</style>
