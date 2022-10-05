<template>
  <v-dialog v-model="objConfirm.showDialogConfirm" max-width="680" persistent>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-card>
        <v-card-title class="d-flex justify-center flex-column">
          <h5 class="text-center text-capitalize">
            <div>{{ $t(objConfirm.titleConfirm) }}</div>
          </h5>
          <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <div
          v-if="objConfirm.isReason"
          class="px-5"
        >
          <label
            for="comment"
          >{{ $t('calendar.detailMeeting.confirm.reason') }}
            <span
              v-if="objConfirm.isNull"
              class="red--text"
            >*</span>
            :
          </label>
          <validation-provider
            v-slot="{ errors }"
            name="reason"
            :rules="objConfirm.isNull ? textInputRequired : ''"
          >
            <v-textarea
              id="comment"
              v-model="objConfirm.reason"
              :error-messages="$t(errors)"
              :placeholder="$t('calendar.detailMeeting.confirm.placeholder-reason')"
              auto-grow
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
        <v-card-actions class="d-flex justify-space-around py-6">
          <v-btn
            class="w-150 py-5"
            color="primary"
            outlined
            rounded
            @click="closeDialog"
          >
            {{ $t('task-manager.button.cancel') }}
          </v-btn>
          <v-btn
            class="w-150 py-5"
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
      if (this.objConfirm.reason) {
        this.objConfirm.reason = this.objConfirm.reason.trim()
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

label {
  font-size: 16px !important;
}

.btn-box-shadow {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15) !important;
}

</style>
