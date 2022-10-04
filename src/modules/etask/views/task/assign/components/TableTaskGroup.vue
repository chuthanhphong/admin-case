<template>
  <v-scroll-y-transition v-if="listGroupActive.includes(idGroup)">
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
      <dialog-task-detail
        :data-task="dataTask"
        :show-dialog="showDialogTaskDetail"
        :task-id="taskId"
        @close-dialog="closeDialogDetail"
      />
      <dialog-update
        :form-data="dataTask"
        :search-task="searchTask"
        :show-dialog="showDialogEditTask"
        :task-id="taskId"
        @close-dialog="closeDialogUpdate"
      />
    </v-simple-table>
  </v-scroll-y-transition>
</template>
<script>

import RowParent from '@/modules/etask/views/task/assign/components/RowParent'

import { TaskService } from '@/modules/etask/services/taskService'
import DialogTaskDetail from "@/modules/etask/views/components/DialogTaskDetail";
import DialogUpdate from "@/modules/etask/views/components/DialogUpdate";

export default {
  components: {
    RowParent,
    DialogUpdate,
    DialogTaskDetail
  },
  props: {
    listGroupActive: {
      type: Array,
      default: undefined
    },
    idGroup: {
      type: Number,
      default: undefined
    },
    formData: {
      type: Object,
      default: undefined
    },
    idGroupActive: {
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
      showDialogTaskDetail: false,
      showDialogEditTask: false,
      taskId: ''
    }
  },
  watch: {
    idGroupActive() {
      if (this.listGroupActive.includes(this.idGroupActive) && this.idGroup === this.idGroupActive && this.idGroupActive !== null) {
        this.formData.assignedGroupId = this.idGroupActive
        this.searchTask()
      }
    },
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
    closeDialogUpdate() {
      this.showDialogEditTask = false
    },
    taskIdfromEmit(val) {
      this.taskId = val
      this.$emit('task-id', this.taskId)
    },
    showDialogEditFromEmit(val) {
      this.$emit('show-dialog-update', val)
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
      this.formData.assignedUserId = null
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

