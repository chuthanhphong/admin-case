<template>
  <v-dialog v-model="showDialog" persistent max-width="680">
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center">
          <div>{{ $t('contract.label.addInitialSigner') }}</div>
        </h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <validation-observer ref="observerCoordinator">
        <form-dialog
          :form-data="formData"
          :group-type="groupType"
          :group-id="groupId"
          :list-users="listUsers"
          :contract-id="contractId"
          @close-dialog="closeDialog"
          @accept="accept"
        />
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import FormDialog from './FormDialog'
import constants from '@/constants'

const initData = {
  userId: '',
  userFullName: '',
  email: '',
  phone: '',
  note: '',
  groupId: '',
  groupName: '',
  signUserType: constants.SIGN_USER_TYPE.FLASHES
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
      formData: { ...initData }
    }
  },
  methods: {
    closeDialog() {
      this.$refs.observerCoordinator.reset()
      this.formData = { ...initData }
      this.$emit('close-dialog')
    },
    async accept(params) {
      const isValid = await this.$refs.observerCoordinator.validate()
      if (isValid) {
        this.$emit('accept', params)
        this.closeDialog()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
