<template>
  <v-dialog v-model="objConfirm.showDialogConfirm" max-width="680" persistent>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-card>
        <v-card-title class="d-flex justify-center flex-column align-center">
          <h5 class="title">
            {{ $t(objConfirm.titleConfirm) }}
          </h5>
          <v-icon class="close-dialog" style="padding-top: 13px" @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <div
          v-if="objConfirm.isReason"
          class="px-5"
        >
          <label
            class="label-content"
            for="comment"
          >{{ objConfirm.status ? $t('task-manager.confirm.title-reason') : $t('task-manager.confirm.title-idea') }}
            <span
              v-if="objConfirm.isNull"
              class="red--text"
            >*</span>
            :
          </label>
          <validation-provider
            v-slot="{ errors }"
            name="taskReason"
            :rules="objConfirm.isNull ? textInputRequired : ''"
          >
            <v-textarea
              id="comment"
              v-model="objConfirm.comment"
              :error-messages="$t(errors)"
              :placeholder="objConfirm.status ? $t('task-manager.placeHolder.reason') : $t('task-manager.placeHolder.idea')"
              auto-grow
              autofocus
              class="py-2"
              counter="500"
              maxlength="500"
              no-resize
              outlined
              rows="3"
              @change="trimSpace"
            />
          </validation-provider>
        </div>
        <v-card-actions class="d-flex justify-center py-5" style="gap: 20px">
          <v-btn
            class="w-150 py-5 text--button btn-box-shadow"
            color="primary"
            outlined
            rounded
            @click="closeDialog"
          >
            {{ $t('task-manager.button.cancel') }}
          </v-btn>
          <v-btn
            class="w-150 py-5 text--button btn-box-shadow"
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
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style scoped>

.title {
  font-size: 19px;
  font-weight: 700;
  text-align: center;
  text-transform: capitalize;
}

.label-content {
  font-size: 16px;
  font-weight: 700;
}

.btn-box-shadow {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15) !important;
}

</style>
