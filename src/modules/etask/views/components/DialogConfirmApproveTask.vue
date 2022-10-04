<template>
  <v-dialog v-model="showDialog" max-width="550" persistent>
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center mt-2">
          {{ $t(title) }}
        </h5>

        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <div class="mt-3">
        <v-col class="pa-0" md="12">
          <v-textarea
            v-model="content"
            :error-messages="$t(isRequiredContent)"
            :placeholder="$t('task-manager.placeHolder.content')"
            class="text--body-5 ml-4 mr-4"
            counter="500"
            full-width
            maxlength="500"
            name="note"
            outlined
            rows="4"
            @change="content = trimSpace(content)"
          />
        </v-col>
      </div>
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
          :disabled="isRequiredContent !== ''"
          class="w-150 py-5 text--button"
          color="primary"
          rounded
          @click="accept"
        >
          {{ $t('accept') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <base-preload :dialog="loading" />
  </v-dialog>
</template>

<script>
import constants from "@/modules/etask/constants";

export default {
  name: "DialogConfirmApproveTask",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    statusApprove: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      content: ''
    }
  },
  computed: {
    isRequiredContent() {
      let reqMes = ''
      this.statusApprove === constants.APPROVE_STATUS.REJECT && this.content === '' ? reqMes = 'task-manager.error.required-approve' : reqMes = ''
      return reqMes
    }

  },
  watch: {
    statusApprove() {
      this.content = ''
    }
  },
  methods: {
    trimSpace(val) {
      return val ? val.trim() : ''
    },
    accept() {
      this.$emit('content', this.content)
      this.$emit('acpept-action')
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style scoped>
.v-input__slot{
  width: 496px!important;
height: 136px!important;
}
</style>
