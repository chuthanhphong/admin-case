<template>
  <v-dialog v-model="showDialog" persistent max-width="550">
    <v-card>
      <v-icon class="close-dialog" color="#8E8EA1" @click="closeDialog">
        mdi-close
      </v-icon>
      <h5 class="text-center text-capitalize pt-6 px-10">
        {{ $t('document.dialog.cancelCreateTitle') }}
      </h5>

      <v-card-actions class="d-flex justify-space-around py-6">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-200 py-6"
          @click="closeDialog"
        >
          {{ $t('close') }}
        </v-btn>

        <v-btn rounded color="primary" class="w-200 py-6" @click="acceptCancel">
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
    }
  },
  data() {
    return {}
  },
  methods: {
    acceptCancel() {
      this.$emit('close-dialog')
      window.history.back()
      // window.location.href = '/'
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="sass" scoped></style>
