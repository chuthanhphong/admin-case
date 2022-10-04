<template>
  <div class="dialog-form-note mt-5">
    <div class="pt-3 pb-1 px-2 text-left text--overlined-1">{{ $t('contract.label.contractNote') }}</div>
    <p class="text-left px-2 text--overlined" v-html="assignerNote" />
  </div>
</template>

<script>
export default {
  props: {
    assignerNote: {
      type: String,
      default: undefined
    }
  }
}
</script>

<style lang="scss" scope></style>
