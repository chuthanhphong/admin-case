<template>
  <v-dialog v-model="objConfirm.showDialogConfirm" max-width="720" persistent>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-card>
        <v-card-title class="d-flex justify-center flex-column align-center">
          <h5 class="text-center text-capitalize">
            {{ $t(objConfirm.titleConfirm) }}
          </h5>
          <v-icon class="close-dialog" style="padding-top: 13px" @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <div
          v-if="objConfirm.isReason"
          class="px-5"
        >
          <label
            class="edoc-text--body-4"
            for="comment"
          >{{ $t('managementDoc.comment') }}
            <span
              v-if="objConfirm.isNull"
              class="red--text"
            >*</span>
          </label>
          <validation-provider
            v-slot="{ errors }"
            name="taskReason"
            :rules="textInputRequired"
          >
            <v-textarea
              id="comment"
              v-model="objConfirm.comment"
              :error-messages="$t(errors)"
              :placeholder="$t('managementDoc.placeholder.labelInputComment')"
              auto-grow
              autofocus
              class="py-2"
              counter="500"
              maxlength="500"
              no-resize
              outlined
              rows="5"
              @change="trimSpace"
            />
          </validation-provider>
        </div>
        <v-card-actions class="d-flex justify-center py-6" style="gap: 40px">
          <v-btn
            class="w-150 py-5 text--button"
            color="primary"
            outlined
            rounded
            @click="cancel"
          >
            {{ $t('task-manager.button.cancel') }}
          </v-btn>
          <v-btn
            class="w-150 py-5 text--button"
            color="primary"
            rounded
            :disabled="invalid"
            @click="accept"
          >
            {{ $t('task-manager.button.accept') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
    <base-preload :dialog="loading" />
  </v-dialog>
</template>

<script>
import rules from '@/mixins/rules'

export default {
  mixins: [rules],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    objConfirm: {
      type: Object,
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
    },
    cancel() {
      this.$emit('cancel-action')
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>
<style scoped>
</style>
