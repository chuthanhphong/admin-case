<template>
  <div class="text-center empty-box">
    <div v-if="loading">
      <v-progress-circular
        indeterminate
        :size="35"
        :width="1"
        color="primary"
      />
    </div>
    <div v-else>
      <div class="empty-title text--subtitle">{{ $t('empty.data') }}</div>
      <v-img contain src="@/assets/imgs/empty.svg" max-width="100%" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    showSubtitle: {
      type: Boolean,
      default: true
    },
    subtitle: {
      type: String,
      default: 'empty.note'
    }
  }
}
</script>

<style lang="scss" scoped></style>
