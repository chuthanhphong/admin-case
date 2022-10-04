<template>
  <v-dialog v-model="showDialog" persistent max-width="530" class="session-exp-dialog">
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <div class="d-flex align-center justify-center flex-column pa-4">
        <img src="@/assets/icons/icon-timeout.png" alt="">
        <h4>{{ $t('sessionExpired') }}</h4>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
      localStorage.setItem('showSessionExpired', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
