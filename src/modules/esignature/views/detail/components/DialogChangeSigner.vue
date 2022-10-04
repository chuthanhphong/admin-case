<template>
  <v-dialog v-if="showDialog" v-model="showDialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center text-capitalize">
          <!-- <div>{{ $t('document.label.changeSigner') }}</div> -->
          <div>{{ $t(titleConfirm) }}</div>
        </h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>

      <!-- body -->
      <validation-observer ref="observerCoordinator">
        <form-dialog
          :form-data="formData"
          :group-id="groupId"
          :doc-id="docId"
          :list-users="listUsers"
          @close-dialog="closeDialog"
          @accept="accept"
        />
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import FormDialog from '../../components/FormDialog'

const initData = {
  userId: '',
  userName: '',
  fullName: '',
  groupName: '',
  parentGroupName: '',
  positionName: '',
  groupId: '',
  groupCode: '',
  email: '',
  phone: '',
  positionId: '',
  note: ''
}
export default {
  components: {
    FormDialog
  },
  props: {
    titleConfirm: {
      type: String,
      default: null
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    docId: {
      type: Number,
      default: 0
    },
    groupId: {
      type: Number,
      default: 0
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
      }
    }
  }
}
</script>
