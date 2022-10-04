<template>
  <v-dialog
    v-model="showDialog"
    max-width="802"
    persistent
    transition="dialog-transition"
  >
    <validation-observer ref="observer" v-slot="{ invalid }">
      <div class="dialog-create-type">
        <div class="d-flex justify-space-between align-center header__type-task">
          <h3 class="title-create">
            {{ $t('task-manager.dialogs.type-task.create') }}
          </h3>
          <v-icon
            @click="closeDialog"
          >mdi-close</v-icon>
        </div>
        <div class="body__type-task">
          <div>
            <label class="label-field">
              {{ $t('task-manager.dialogs.type-task.name') }}
              <span class="color-require px-1">*</span>
            </label>
            <validation-provider
              v-slot="{ errors }"
              name="typeTaskName"
              :rules="textInputRequired"
            >
              <v-text-field
                v-model="formData.name"
                dense
                maxlength="200"
                counter="200"
                autofocus
                flat
                solo
                :placeholder="$t('task-manager.placeHolder.type-task-name')"
                outlined
                :error-messages="errors"
                class="text--body-5"
              />
            </validation-provider>
          </div>
          <body-create
            :data-type-task="formData"
            :is-view="false"
            :is-tab="false"
            :is-update="true"
            :list-group="listGroup"
          />
        </div>
        <div class="footer__type-task">
          <v-btn
            color="primary"
            rounded
            outlined
            elevation="1"
            class="btn-action bg-white"
            @click="cancelForm(typeActionConst.CANCEL)"
          >
            {{ $t('task-manager.dialogs.type-task.btn-cancel') }}
          </v-btn>
          <v-btn
            rounded
            color="primary"
            class="btn-action"
            :disabled="invalid"
            @click="submitForm(typeActionConst.SAVE)"
          >
            {{ $t('task-manager.dialogs.type-task.btn-create') }}
          </v-btn>
        </div>
      </div>
      <dia-log-confirm
        :obj-confirm="objConfirm"
        @accept-action="onAcceptConfirm"
        @close-dialog="onCancelConfirm"
      />
    </validation-observer>
  </v-dialog>
</template>
<script>
// mixins
import rules from '@/mixins/rules'

// component
import DiaLogConfirm from '@/modules/etask/views/components/DiaLogConfirm'
import BodyCreate from '@/modules/etask/views/task/typetask/component/BodyCreate'

// constants
import constants from '@/modules/etask/constants'
import { TaskService } from '@/modules/etask/services/taskService'

// vuex
import { mapActions } from 'vuex'

const initForm = {
  name: '',
  description: '',
  applyingGroupId: '',
  sendFlag: false,
  receiveFlag: false,
  closeFlag: false
}

export default {
  components: {
    DiaLogConfirm,
    BodyCreate
  },
  mixins: [rules],
  props: {
    showDialog: {
      type: Boolean,
      default: undefined
    },
    listGroup: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      test: false,
      formData: { ...initForm },
      objConfirm: {
        titleConfirm: '',
        showDialogConfirm: false,
        isReason: false,
        isNull: false,
        comment: ''
      },
      typeActionActive: '',
      typeActionConst: constants.TASK_TYPE_ACTION,
    }
  },
  watch: {
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    resetFormData() {
      this.formData = { ...initForm }
      this.$refs.observer.reset()
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
    cancelForm(type) {
      this.typeActionActive = type
      this.objConfirm.showDialogConfirm = true
      this.objConfirm.titleConfirm = 'task-manager.title-confirm.cancel-type-task'
    },
    submitForm(type) {
      this.typeActionActive = type
      this.objConfirm.showDialogConfirm = true
      this.objConfirm.titleConfirm = 'task-manager.title-confirm.accept-type-task'
    },
    onAcceptConfirm() {
      if (this.typeActionActive === this.typeActionConst.SAVE) {
        this.saveTypeTask()
        this.resetFormData()
        this.closeDialog()
      } else {
        if (this.formData.name || this.formData.applyingGroupId) {
          this.resetFormData()
        } else {
          this.resetFormData()
          this.closeDialog()
        }
      }
    },
    onCancelConfirm() {
      this.objConfirm.showDialogConfirm = false
    },
    async saveTypeTask() {
      try {
        this.formData.name = this.formData.name.trim()
        const response = await TaskService.createTypeTask(
          this.formData
        )
        if (response.status === 200) {
          this.setNotify({
            show: true,
            type: 'success',
            content: this.$t('task-manager.information.create-type-task')
          })
          this.$emit('create-success')
        }
      } catch (error) {
        const message = error.message
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(message)
        })
      }
    }
  }
}
</script>
<style scoped>

.dialog-create-type {
  background: #FFFFFF;
}

.header__type-task {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #E9E9EA;
}

.body__type-task {
  padding: 20px;
}

.title-create {
  font-size: 20px !important;
  font-weight: 700 !important;
  line-height: 28px;
}

.label-field {
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 20px !important;
  text-transform: uppercase;
  display: flex;
  align-items: center;
}

.footer__type-task {
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 60px 25px 80px 15px;
  gap: 25px;
}

.btn-action {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  width: 140px;
  padding: 17px 0 !important;
}

.bg-white {
  background: #FFFFFF;
}

</style>
