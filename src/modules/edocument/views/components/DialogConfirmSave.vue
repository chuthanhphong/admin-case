<template>
  <v-dialog v-model="showDialog" persistent max-width="680">
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center text-capitalize">
          {{ $t(titleConfirm) }}
        </h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <div v-if="showWarning" class="px-5 d-flex justify-center">
        <img src="@/assets/imgs/warning.png">
        <span class="ml-2">
          {{ $t('confirmContentPromulgate') }}
        </span>
      </div>

      <v-card-actions class="d-flex justify-space-around py-6">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-150 py-5 text--button"
          @click="closeDialog"
        >
          {{ $t('cancelLabel') }}
        </v-btn>

        <v-btn
          rounded
          color="primary"
          class="w-150 py-5 text--button"
          @click="accept"
        >
          {{ $t('accept') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    titleConfirm: {
      type: String,
      default: ''
    },
    showWarning: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    accept() {
      this.closeDialog()
      this.$emit('accept-action')
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="sass" scoped></style>
