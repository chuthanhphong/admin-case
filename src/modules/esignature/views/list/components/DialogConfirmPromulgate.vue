<template>
  <v-dialog v-model="showDialog" persistent max-width="600">
    <v-card class="py-5">
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center text-capitalize">
          <div>{{ $t('document.label.confirmPromulgate') }}</div>
        </h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <div v-if="contentConfirm" class="px-5 d-flex justify-center">
        <img src="@/assets/imgs/warning.png">
        <span class="ml-2">{{ $t('document.label.confirmContentPromulgate') }}</span>
      </div>

      <v-card-actions class="d-flex justify-space-around py-6">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-150 py-5"
          @click="closeDialog"
        >
          {{ $t('cancelLabel') }}
        </v-btn>

        <v-btn rounded color="primary" class="w-150 py-5" @click="accept">
          {{ $t('accept') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogConfirm',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    contentConfirm: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    },

    accept() {
      this.$emit('accept-action', this.reason)
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped></style>
