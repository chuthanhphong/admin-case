<template>
  <v-dialog v-model="showDialog" persistent max-width="530">
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <div class="wrap-input-pin text-center">
        <h5 class="mb-4">{{ $t('contract.dialog.pinInfoTitle') }}</h5>
        <v-text-field
          v-model="pin"
          class="mx-10"
          :label="$t('contract.label.inputPin')"
          :error-messages="$t(error)"
          outlined
          max-length="30"
          rounded
          dense
          @change="trimSpace"
        />
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

        <v-btn rounded color="primary" class="w-150 py-5 text--button" @click="accept">
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
    return {
      error: '',
      pin: '079073009568'
    }
  },
  watch: {
    pin() {
      if (this.pin.trim().length > 0) {
        this.error = ''
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    },
    accept() {
      if (this.pin.trim().length === 0) {
        this.error = 'contract.pinRequired'
        return
      }
      this.closeDialog()
      this.$emit('accept', this.pin)
    },
    trimSpace() {
      if (this.pin) {
        this.pin = this.pin.trim()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-input-pin {
  border: 1px dashed #ccc;
  margin: 30px;
  border-radius: 8px;
}
</style>
