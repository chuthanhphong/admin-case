<template>
  <v-dialog v-if="showDialog" v-model="showDialog" persistent max-width="600px">
    <v-card>
      <v-icon
        class="close-dialog mr-3 mt-1"
        color="#8E8EA1"
        @click="closeDialog"
      >
        mdi-close
      </v-icon>
      <h5 class="text-center pt-6 pb-5 text-capitalize">
        <div>{{ $t(titleConfirm) }}</div>
      </h5>

      <!-- body -->
      <validation-observer ref="observerCoordinator">
        <form-dialog
          :form-data="formData"
          :group-id="groupId"
          :doc-id="docId"
          :group-name="groupName"
          @close-dialog="closeDialog"
          @accept="accept"
        />
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import FormDialog from '@/modules/esignature/views/components/FormDialog'

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
      default: null
    },
    groupName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      formData: { ...initData }
    }
  },

  watch: {
    showDialog() {
      if (this.showDialog) {
        this.formData = { ...initData }
      }
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
