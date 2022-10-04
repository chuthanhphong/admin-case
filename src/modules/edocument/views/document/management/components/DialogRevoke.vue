<template>
  <v-dialog v-model="showDialog" persistent max-width="600">
    <v-card class="edocument-font">
      <v-icon class="close-dialog" color="#8E8EA1" @click="closeDialog">
        mdi-close
      </v-icon>
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center text-capitalize pt-6 px-10">
          {{ $t(titleConfirm) }}
        </h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>

      <div v-if="selected" class="px-5 d-flex justify-center">
        <span class="ml-2">{{ $t('managementDoc.titleConfirmSave.selected') }}</span>
        <span class="ml-2"> {{ selected }} </span>
        <span class="ml-2">{{ $t('managementDoc.titleConfirmSave.transfer') }}</span>
      </div>

      <!-- <div class="px-5">
        <label
          class="edoc-text--body-4"
          for="comment"
        >{{ $t('managementDoc.comment') }}
          <span class="red--text">*</span>
        </label>
        <v-textarea
          id="comment"
          v-model="comment"
          counter="500"
          maxlength="500"
          no-resize
          auto-grow
          rows="5"
          outlined
          class="edoc-text--body-2"
          :error-messages="$t(error)"
          :placeholder="$t('managementDoc.placeholder.labelInputComment')"
          @change="trimSpace"
        />
      </div> -->

      <v-card-actions class="d-flex justify-space-around py-6">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-200 py-6"
          @click="closeDialog"
        >
          {{ $t('cancelLabel') }}
        </v-btn>

        <v-btn rounded color="primary" class="w-200 py-6" @click="accept">
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
    labelMessageComment: {
      type: String,
      default: 'managementDoc.validate.commentRequired'
    },
    selected: {
      type: Number,
      default: undefined
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
    accept() {
      this.closeDialog()
      this.$emit('accept-action')
    },
    trimSpace() {
      if (this.comment) {
        this.comment = this.comment.trim()
      }
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card__title {
  word-break: normal;
}
</style>
