<template>
  <v-dialog v-model="showDialog" persistent max-width="550">
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center text-capitalize">
          <div>{{ $t('document.dialog.titleConfirmCancelPromulgate') }}</div>
        </h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <div class="px-5">
        <label
          class="text--body-1-normal"
          for="comment"
          v-html="
            `${$t(labelComment)}${
              requiredComment ? '<span class=\'red--text\'>*</span> :' : ':'
            }`
          "
        />
        <v-textarea
          id="comment"
          v-model="comment"
          counter="500"
          maxlength="500"
          rows="5"
          outlined
          class="py-2"
          :error-messages="$t(error)"
          :placeholder="$t(labelInputComment)"
          @change="trimSpace"
        />
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
    titleConfirm: {
      type: String,
      default: ''
    },
    labelComment: {
      type: String,
      default: 'document.label.reason'
    },
    labelInputComment: {
      type: String,
      default: 'document.label.inputReason'
    },
    labelMessageComment: {
      type: String,
      default: 'document.reasonRequired'
    },
    requiredComment: {
      type: Boolean,
      default: true
    },
    showComment: {
      type: Boolean,
      default: false
    },
    contentConfirm: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      error: '',
      comment: ''
    }
  },
  watch: {
    comment() {
      if (this.comment.trim().length > 0) {
        this.error = ''
      }
    }
  },
  methods: {
    closeDialog() {
      this.comment = ''
      this.error = ''
      this.$emit('close-dialog')
    },

    accept() {
      if (this.requiredComment) {
        if (this.comment.trim().length === 0) {
          this.error = this.labelMessageComment
          return
        }
      }
      this.$emit('accept-action', this.comment)
      this.closeDialog()
    },

    trimSpace() {
      if (this.comment) {
        this.comment = this.comment.trim()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
label {
  font-size: 16px !important;
}
</style>
