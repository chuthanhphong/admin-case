<template>
  <v-dialog v-model="showDialog" persistent max-width="600">
    <v-card>
      <v-icon class="close-dialog" color="#8E8EA1" @click="closeDialog">
        mdi-close
      </v-icon>
      <h5 class="text-center pt-6 px-10 text-capitalize">
        <div>{{ $t(titleConfirm) }}</div>
      </h5>

      <div v-if="contentConfirm" class="px-5 text-center">
        {{ $t(contentConfirm) }}
      </div>

      <!-- Button -->
      <div class="d-flex justify-center mt-12 pb-10">
        <v-btn
          rounded
          outlined
          color="primary"
          class="btn-dialog mr-12"
          @click="closeDialog"
        >
          {{ $t('cancelLabel') }}
        </v-btn>

        <v-btn rounded color="primary" class="btn-dialog" @click="accept">
          {{ $t('accept') }}
        </v-btn>
      </div>
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
    titleConfirm: {
      type: String,
      default: 'document.titleConfirmRemoveSigner'
    },
    contentConfirm: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    },

    accept() {
      this.$emit('accept')
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-dialog {
  height: 42px !important;
  width: 147px !important;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}</style>
