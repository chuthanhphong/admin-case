<template>
  <v-scroll-y-transition v-if="listUserActive.includes(idUser)">
    <v-simple-table class="table-task" dense fixed-header>
      <template v-slot:default>
        <row-parent
          v-for="(itemParent, idx) in listTask"
          :key="idx"
          :active-index="activeIndex"
          :index="itemParent.taskId"
          :item-parent="itemParent"
          :obj-loading="objLoading"
          :show-dialog-edit="showDialogEditTask"
          :show-dialog-task-detail="showDialogTaskDetail"
          :obj-setting="objSetting"
          @taskId="taskIdfromEmit"
          @show-process="showProcess"
          @show-dialog-action="showDialogAction"
          @show-child-task="showChildTask"
          @show-dialog-detail="openTaskDetail"
          @show-dialog-edit="showDialogEditFromEmit"
        />
      </template>
    </v-simple-table>
  </v-scroll-y-transition>
</template>
<script>

import RowParent from '@/modules/etask/views/task/assign/components/RowParent'

import { TaskService } from '@/modules/etask/services/taskService'

export default {
  components: {
    RowParent,
  },
  props: {
    listUserActive: {
      type: Array,
      default: undefined
    },
    idUser: {
      type: Number,
      default: undefined
    },
    formData: {
      type: Object,
      default: undefined
    },
    idUserActive: {
      type: Number,
      default: undefined
    },
    objLoading: {
      type: Object,
      default: undefined
    },
    objSetting: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      activeIndex: null,
      showDialogProcess: false,
      showDialogTaskDetail: false,
      showDialogEditTask: false,
      listTask: [],
      dataTask: {
        id: null,
        parentId: null,
        taskCategoryId: null,
        name: '',
        content: '',
        priority: null,
        requireApproval: false,
        status: null,
        startDate: null,
        endDate: null,
        level: null,
        progress: null,
        currentUserRole: null,
        actualDuration: null,
        reportFreq: 'YEARLY',
        performer: {},
        assigner: {},
        monitors: [],
        combinators: [],
        workflowStepId: null,
        workflowStepTaskId: null,
        childrenTask: [],
        fileAttachments: null,
        sourceTasks: [],
        taskAssociations: null
      },
      taskId: null
    }
  },
  watch: {
    idUserActive() {
      if (this.listUserActive.includes(this.idUserActive) && this.idUser === this.idUserActive && this.idUserActive !== null) {
        this.formData.assignedUserId = this.idUserActive
        this.searchTask()
      }
    },
    taskId() {
      this.$emit('task-id', this.taskId)
    }
  },
  created() {
  },
  methods: {
    openTaskDetail(data) {
      this.$emit('show-dialog-detail', data)
    },
    closeDialogDetail() {
      this.showDialogTaskDetail = false
    },
    taskIdfromEmit(val) {
      this.taskId = val
      this.$emit('task-id', this.taskId)
    },
    showDialogEditFromEmit(val) {
      this.$emit('show-dialog-update', val)
    },
    closeDialogUpdate() {
      this.showDialogEditTask = false
    },
    showChildTask(index) {
      if (this.activeIndex === index) {
        this.activeIndex = null
      } else {
        this.activeIndex = index
      }
    },
    showProcess(id, value) {
      this.$emit('show-process', id, value)
    },
    showDialogAction(obj, value) {
      this.$emit('show-dialog-action', obj, value)
    },
    searchTask() {
      this.formData.page = ''
      this.formData.assignedGroupId = null
      this.search()
    },
    async search() {
      try {
        this.objLoading.value = true
        this.formData.pageSize = 2000

        if (this.formData.keywords) {
          this.formData.keywords = this.formData.keywords.trim()
        }
        const response = await TaskService.searchCreatTask(
          this.formData
        )
        const dataResponse = response.data
        this.listTask = dataResponse.data
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.objLoading.value = false
      }
    },
  }
}
</script>

