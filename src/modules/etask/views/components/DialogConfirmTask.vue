<template>
  <v-dialog v-model="showDialog" max-width="680" persistent>
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center">
          {{ $t(title) }}
        </h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-card-actions class="d-flex justify-space-around py-6">
        <v-btn
          class="w-150 py-5 text--button"
          color="primary"
          outlined
          rounded
          @click="closeDialog"
        >
          {{ $t('task-manager.button.cancel') }}
        </v-btn>
        <v-btn
          class="w-150 py-5 text--button"
          color="primary"
          rounded
          @click="accept"
        >
          {{ $t('task-manager.button.accept') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <base-preload :dialog="loading" />
  </v-dialog>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      error: ''
    }
  },
  methods: {
    trimSpace() {
      if (this.objConfirm.comment) {
        this.objConfirm.comment = this.objConfirm.comment.trim()
      }
    },
    accept() {
      this.$emit('accept-action')
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="sass" scoped></style>
