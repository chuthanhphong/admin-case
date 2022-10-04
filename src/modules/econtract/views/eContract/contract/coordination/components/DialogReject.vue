<template>
  <v-dialog v-model="showDialog" persistent max-width="680">
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center">
          {{ $t('contract.dialog.rejectCoordinationTitle') }}
        </h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <div v-if="contentConfirm" class="px-5 text-center">
        {{ $t(contentConfirm) }}
      </div>
      <div v-if="showComment" class="px-5">
        <label
          class="text--label"
          for="comment"
          v-html="
            `${$t(labelComment)}:${
              requiredComment ? '<span class=\'red--text\'>*</span>' : ''
            }`
          "
        />
        <v-textarea
          id="comment"
          v-model="comment"
          counter="500"
          maxlength="500"
          no-resize
          auto-grow
          rows="3"
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
          class="w-150 py-5 text--button"
          @click="closeDialog"
        >
          {{ $t('close') }}
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
    labelComment: {
      type: String,
      default: 'contract.comment'
    },
    labelInputComment: {
      type: String,
      default: 'contract.inputComment'
    },
    labelMessageComment: {
      type: String,
      default: 'contract.commentRequired'
    },
    contentConfirm: {
      type: String,
      default: ''
    },
    requiredComment: {
      type: Boolean,
      default: false
    },
    showComment: {
      type: Boolean,
      default: false
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
      this.$emit('close-dialog')
    },
    accept() {
      if (this.requiredComment) {
        if (this.comment.trim().length === 0) {
          this.error = this.labelMessageComment
          return
        }
      }
      this.closeDialog()
      const strComment = this.comment
      this.comment = ''
      this.$emit('accept', strComment)
    },
    trimSpace() {
      if (this.comment) {
        this.comment = this.comment.trim()
      }
    }
  }
}
</script>

<style lang="sass" scoped></style>
