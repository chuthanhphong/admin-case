<template>
  <v-dialog v-model="dialog" persistent width="350" style="z-index:20000;">
    <v-card color="white" light>
      <v-card-text class="text-center py-5">
        <v-avatar size="40" color="primary">
          <img src="@/assets/icons/hourglass.svg" alt="">
        </v-avatar>
        <div class="primary--text text-center text--body-1 py-1">
          {{ $t('processing') }}
        </div>
        <v-progress-linear stream buffer-value="0" color="primary" class="mb-0" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.v-overlay--active {
  .v-overlay__scrim {
    opacity: 0.2 !important;
  }
}
</style>
