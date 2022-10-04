<template>
  <div>
    <v-dialog v-model="showDialog" persistent max-width="680">
      <v-card>
        <v-card-title class="d-flex justify-center flex-column">
          <h5 class="text-center">
            <div>{{ $t('contract.changeReviewer') }}</div>
          </h5>
          <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <validation-observer ref="observerCoordinator">
          <form-dialog
            :form-data="formData"
            :group-type="groupType"
            :group-id="groupId"
            :contract-id="contractId"
            :list-users="listUsers"
            form-type="changeSigner"
            @close-dialog="closeDialog"
            @accept="showDialogConfirm = true"
          />
        </validation-observer>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDialogConfirm" persistent max-width="680">
      <v-card>
        <v-card-title class="d-flex justify-center flex-column">
          <h5 class="text-center">
            <div>{{ $t('contract.titleConfirm.changeReviewerTitle') }}</div>
          </h5>
          <v-icon
            class="close-dialog"
            @click="showDialogConfirm = false"
          >mdi-close</v-icon>
        </v-card-title>
        <div class="px-5 text-center text--body-2">
          <div>{{ $t('contract.notes.cannotSeeContract') }}</div>
          <div class="d-flex justify-center align-start my-4">
            <v-avatar size="10" color="primary" class="mr-4 mt-1" />
            <div class="d-flex align-start flex-column text-center">
              <b class="signer-name">{{ formData.userFullName }}</b>
              <span class="signer-email">{{ formData.email }}</span>
            </div>
          </div>
        </div>
        <v-card-actions class="d-flex justify-center pt-5 pb-10">
          <v-btn
            rounded
            outlined
            color="primary"
            class="w-150 py-5 mr-12 text--button"
            @click="showDialogConfirm = false"
          >
            {{ $t('contract.back') }}
          </v-btn>

          <v-btn rounded color="primary" class="w-150 py-5 text--button" @click="accept">
            {{ $t('accept') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FormDialog from './FormDialog'

const initData = {
  userId: '',
  userFullName: '',
  email: '',
  phone: '',
  note: '',
  groupId: '',
  groupName: ''
}
export default {
  components: {
    FormDialog
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    groupType: {
      type: String,
      default: null
    },
    groupId: {
      type: Number,
      default: null
    },
    contractId: {
      type: String,
      default: null
    },
    listUsers: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      listUser: null,
      formData: { ...initData },
      showDialogConfirm: false
    }
  },
  methods: {
    closeDialog() {
      this.$refs.observerCoordinator.reset()
      this.formData = { ...initData }
      this.$emit('close-dialog')
    },
    async selectSigner() {
      const isValid = await this.$refs.observerCoordinator.validate()
      if (isValid) {
        this.showDialogConfirm = true
      }
    },
    async accept() {
      this.$emit('accept', { ...this.formData })
      this.showDialogConfirm = false
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
.signer-name {
  color: #22242c;
  line-height: 12px;
}
.signer-email {
  color: #8e8ea1;
}
</style>
