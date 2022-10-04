<template>
  <div class="menu-setting">
    <div class="dialog__header">
      <div>
        {{ $t('task-manager.dialogs.title-setting-task') }}
      </div>
      <div
        style="cursor: pointer"
        @click="closeSetting"
      >
        <img src="@/assets/icons/task/first_page.png">
      </div>
    </div>
    <div class="label-display">
      {{ $t('task-manager.dialogs.display-column') }}
    </div>
    <div class="dialog__body">
      <div v-if="isShowPerform" class="item">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/user.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.perform') }}</label>
        </div>
        <v-switch
          v-model="objSetting.perform"
          inset
        />
      </div>
      <div class="item">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/check-inactive.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.state') }}</label>
        </div>
        <v-switch
          v-model="objSetting.state"
          inset
        />
      </div>
      <div class="item">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/progress.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.progress') }}</label>
        </div>
        <v-switch
          v-model="objSetting.progress"
          inset
        />
      </div>
      <div class="item">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/grip-vertical.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.complete') }}</label>
        </div>
        <v-switch
          v-model="objSetting.complete"
          inset
        />
      </div>
      <div v-if="isShowAssign" class="item">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/flash_on.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.assigner') }}</label>
        </div>
        <v-switch
          v-model="objSetting.assigner"
          inset
        />
      </div>
      <div v-if="isShowCreateDate" class="item">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/repeat.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.createDate') }}</label>
        </div>
        <v-switch
          v-model="objSetting.createDate"
          inset
        />
      </div>
      <div v-if="isShowSource" class="item">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/icon-coordinator.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.source') }}</label>
        </div>
        <v-switch
          v-model="objSetting.source"
          inset
        />
      </div>
      <div v-if="isShowTypeTask" class="item">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/view.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.type-task') }}</label>
        </div>
        <v-switch
          v-model="objSetting.typeTask"
          inset
        />
      </div>
      <div v-if="isShowPriority" class="item">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/view.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.priority') }}</label>
        </div>
        <v-switch
          v-model="objSetting.priority"
          inset
        />
      </div>
      <div v-if="isShowCombiner" class="item">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/view.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.combinator') }}</label>
        </div>
        <v-switch
          v-model="objSetting.combinator"
          inset
        />
      </div>
      <div v-if="isShowFollow" class="item mb-0">
        <div class="d-flex justify-center align-center">
          <img src="@/assets/icons/task/view.svg">
          <label class="label-item">{{ $t('task-manager.label.setting-task.follow') }}</label>
        </div>
        <v-switch
          v-model="objSetting.follow"
          inset
        />
      </div>
    </div>
  </div>
</template>
<script>

import constants from '@/modules/etask/constants'

export default {
  props: {
    objSetting: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
    }
  },
  computed: {
    isShowPerform() {
      if (this.objSetting.type !== constants.TYPE_SCREEN.PERFORMER) {
        return true
      } else {
        return false
      }
    },
    isShowAssign() {
      const arr = [
        constants.TYPE_SCREEN.CREATE,
        constants.TYPE_SCREEN.PERFORMER,
        constants.TYPE_SCREEN.DEPARTMENT
      ]
      if (arr.includes(this.objSetting.type)) {
        return true
      } else {
        return false
      }
    },
    isShowCreateDate() {
      if (this.objSetting.type === constants.TYPE_SCREEN.CREATE) {
        return true
      } else {
        return false
      }
    },
    isShowSource() {
      const arr = [
        constants.TYPE_SCREEN.ASSIGN,
        constants.TYPE_SCREEN.PERFORMER
      ]
      if (arr.includes(this.objSetting.type)) {
        return true
      } else {
        return false
      }
    },
    isShowTypeTask() {
      const arr = [
        constants.TYPE_SCREEN.ASSIGN,
        constants.TYPE_SCREEN.FOLLOWER,
        constants.TYPE_SCREEN.DEPARTMENT
      ]
      if (arr.includes(this.objSetting.type)) {
        return true
      } else {
        return false
      }
    },
    isShowPriority() {
      const arr = [
        constants.TYPE_SCREEN.PERFORMER,
        constants.TYPE_SCREEN.FOLLOWER,
        constants.TYPE_SCREEN.DEPARTMENT
      ]
      if (arr.includes(this.objSetting.type)) {
        return true
      } else {
        return false
      }
    },
    isShowCombiner() {
      const arr = [
        constants.TYPE_SCREEN.FOLLOWER,
        constants.TYPE_SCREEN.PERFORMER
      ]
      if (arr.includes(this.objSetting.type)) {
        return true
      } else {
        return false
      }
    },
    isShowFollow() {
      if (this.objSetting.type === constants.TYPE_SCREEN.PERFORMER) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    closeSetting() {
      this.$emit('close-setting')
    }
  }
}
</script>
<style scoped>

.label-item {
  font-size: 14px;
  font-weight: 600;
  margin-left: 4px;
}

.box-shadow {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15) !important;
}

</style>
