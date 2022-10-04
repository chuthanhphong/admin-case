<template>
  <div id="page-create" class="task-manager">
    <v-container class="rounded-xl" fluid>
      <div class="wrap-home">
        <div class="d-flex justify-space-between align-center my-3">
          <h5 class="text-capitalize">
            {{ $t('task-manager.menu.perform') }}
            <span
              v-if="totalElements"
            >
              ({{ totalElements }})
            </span>
          </h5>
          <v-btn color="primary" @click="showDialogCreate">
            <span class="pr-3 text-uppercase text--button">{{ $t('task-manager.button.create') }} </span>
            <vue-feather size="25" type="plus-circle" />
          </v-btn>
        </div>
        <control-task
          :form-data="formData"
          :obj-count="objCountSearch"
          :obj-setting="objSetting"
          :search-task="searchTask"
        />
        <div>
          <div
            v-if="listTaskPerformerRemain.length == 0 && listTaskPerformerToDay.length == 0"
            class="col-md-5 col-12 mx-auto wrap-empty-list"
          >
            <empty-box
              :subtitle="'task-manager.empty.data'"
            />
          </div>
          <div
            v-else
            class="container-table list-task"
          >
            <table-to-day
              :active-index="activeIndex"
              :form-data="formData"
              :index-sort="indexSort"
              :is-reload="isReloadChildTask"
              :list-sort-field="listSortField"
              :list-task-performer="listTaskPerformerToDay"
              :obj-loading="objLoading"
              :obj-setting="objSetting"
              :total-elements="totalElementsToday"
              @task-id="taskIdFromEmit"
              @change-sort="changeSort"
              @show-child-task="showChildTask"
              @show-process="showProcess"
              @show-dialog-detail="showDialogDetailFromEmit"
              @show-dialog-update=" showDialogEditFromEmit"
              @show-dialog-action="showDialogAction"
            />
            <table-remain
              :active-index="activeIndex"
              :form-data="formData"
              :index-sort="indexSort"
              :is-reload="isReloadChildTask"
              :list-sort-field="listSortField"
              :list-task-performer="listTaskPerformerRemain"
              :obj-loading="objLoading"
              :obj-setting="objSetting"
              :total-elements="totalElementsRemain"
              @task-id="taskIdFromEmit"
              @change-sort="changeSort"
              @show-child-task="showChildTask"
              @show-process="showProcess"
              @show-dialog-detail="showDialogDetailFromEmit"
              @show-dialog-update=" showDialogEditFromEmit"
              @show-dialog-action="showDialogAction"
            />
          </div>
        </div>
        <dialog-task-detail
          :data-task="dataTask"
          :form-data-search="formData"
          :show-dialog="showDialogDetail"
          :task-id-detail="taskId"
          @search-task-create="searchTaskCreate"
          @get-detail="getTaskDetail"
          @close-dialog="showDialogDetail = false"
        />
        <dialog-update-process
          :data-process="dataProcess"
          :row-id="rowId"
          :show-dialog="showDialogProcess"
          @change-process="changeProcess"
          @close-dialog="showDialogProcess = false"
        />
        <dialog-create-task
          :form-data-search="formData"
          :show-dialog="showDialogCreatetask"
          @search-task-create="searchTaskCreate"
          @close-dialog="showDialogCreatetask = false"
          @miniMize-dialog="showDialogCreatetask=false"
        />
        <dia-log-confirm
          :loading="objLoading.value"
          :obj-confirm="objConfirm"
          @accept-action="acceptAction"
          @close-dialog="closeDialogConfirm"
        />
        <dialog-update
          :form-data="dataTask"
          :form-data-search="formData"
          :list-association="listAssociation"
          :show-dialog="showDialogUpdateTask"
          :task-id="taskId"
          @close-dialog="closeDialogUpdate"
        />
      </div>
    </v-container>
    <base-preload :dialog="objLoading.value" />
  </div>
</template>
<script>
// components
import DialogUpdateProcess from '@/modules/etask/views/components/DialogUpdateProcess'
import DialogCreateTask from '@/modules/etask/views/components/DialogCreateTask'
import DialogTaskDetail from "@/modules/etask/views/components/DialogTaskDetail";
import DiaLogConfirm from '@/modules/etask/views/components/DiaLogConfirm'
import EmptyBox from '@/views/components/EmptyBox'
import DialogUpdate from "@/modules/etask/views/components/DialogUpdate";

// view
import ControlTask from '@/modules/etask/views/task/perform/components/ControlTask'
import TableToDay from '@/modules/etask/views/task/perform/components/TableToDay'
import TableRemain from '@/modules/etask/views/task/perform/components/TableRemain'

// service
import { TaskService } from '@/modules/etask/services/taskService'

// mixins
import actionsTask from '@/modules/etask/mixins/actionsTask'

// constants
import constants from '@/modules/etask/constants'

// vuex
import { mapActions, mapState } from 'vuex'

export default {
  name: 'IPerform',
  components: {
    EmptyBox,
    TableToDay,
    TableRemain,
    ControlTask,
    DialogTaskDetail,
    DialogUpdateProcess,
    DialogCreateTask,
    DiaLogConfirm,
    DialogUpdate
  },
  mixins: [actionsTask],
  data() {
    return {
      showDialogTaskDetail: false,
      showDialogProcess: false,
      showDialogCreatetask: false,
      showDialogUpdateTask: false,
      taskId: null,
      listTaskPerformerToDay: [],
      listTaskPerformerRemain: [],
      formData: {
        page: 1,
        pageSize: constants.task.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'PERFORMED', // loai cong viec - cong viec toi tao
        taskStatuses: [], // list trang thai
        taskDeadline: null, // viec hoan thanh hoac chua hoac all
        assignedGroupId: '', // nhom
        assignedUserId: '', // nguoi tao
        isCompletedTask: '', // han hoan thanh
        finishTaskTimeType: '', // menu complete
        taskName: '', // ten cong viec
        estimateEndFromDate: '', // den ngay
        estimateEndToDate: '', // tu ngay
        createdDateFrom: '', // tao tu ngay
        createdDateTo: '', // tao den ngay
        taskPriorities: [], // do uu tien
        followerIds: [], // list id nguoi theo doi
        combinerUserIds: [], // list id nguoi phoi hop
        combinerGroupIds: [], // list id nhom phoi hop
        sortOrder: '', // sap xep theo ten cv
        deadlineTaskTimeType: '', // han hoan thanh
        taskId: ''
      },
      activeIndex: [],

      dataProcess: {
        process: null
      },
      rowId: null,
      totalElementsRemain: null,
      totalElementsToday: null,
      totalElements: null,
      indexSort: 0,
      dataUpdateProgress: {
        taskId: '',
        progress: ''
      },
      listSortField: ['TASKNAME', 'TASKSTATUS', 'TASKPROGRESS', 'COMPLETEDATE'],
      objConfirm: {
        titleConfirm: '',
        showDialogConfirm: false,
        isReason: false,
        isNull: false,
        comment: '',
        status: false
      },
      actionTask: '',
      objTask: {},
      objLoading: {
        value: false
      },
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
        currentUserRoles: [],
        actualDuration: null,
        reportFreq: 'YEARLY',
        performer: null,
        assigner: null,
        parentTask: null,
        monitors: [],
        combinators: [],
        workflowStepId: null,
        workflowStepTaskId: null,
        childrenTask: [],
        fileAttachments: null,
        sourceTask: {},
        taskAssociations: [],
        listActions: []
      },
      showDialogDetail: false,
      showDialogUpdate: false,
      isReloadChildTask: false,
      objSetting: {
        type: constants.TYPE_SCREEN.PERFORMER,
        perform: true,
        state: true,
        progress: true,
        complete: true,
        assigner: true,
        createDate: true,
        source: true,
        typeTask: true,
        priority: true,
        combinator: true,
        follow: true
      },
      objCountSearch: {
        countSearch: 0
      },
      listAssociation: []
    }
  },
  computed: {
    ...mapState('layout', ['params_notification', 'pageCode_notification']),
  },
  watch: {
    /* comment chua lam chuc nang nay*/
    // dataTask: {
    //   handler() {
    //
    //   }, deep: true
    showDialogDetail() {
      if (this.showDialogDetail) {
        this.getTaskDetail(this.taskId)
      }
    },
    showDialogUpdateTask() {
      if (this.showDialogUpdateTask) {
        this.getTaskDetail(this.taskId)
      }
    },
    taskId() {
      this.getTaskDetail(this.taskId)
    },
    params_notification(newValue) {
      if (newValue) {
        this.setDefault();
        this.searchTask();
      }
    }
  },
  created() {
    if (this.pageCode_notification) {
      this.formData.isCompletedTask = null;
    }
    if (this.$route.params.key) {
      switch (this.$route.params.key) {
        case 1:
          this.formData.taskStatuses = [2]
          break;
        case 2:
          this.formData.isCompletedTask = 'false';
          this.formData.deadlineTaskTimeType = 'EXPIRED'
          break;
        case 3:
          this.formData.taskStatuses = [8, 1, 5]
          break;
        case 5:
          this.formData.isCompletedTask = null;
          this.formData.taskStatuses = [5]
          break;
        case 8:
          this.formData.isCompletedTask = 'false'
          break;
      }
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions('layout', ['setNotify', 'setParamsNotification']),
    setDefault() {
      this.formData = {
        page: 1,
        pageSize: constants.task.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'PERFORMED', // loai cong viec - cong viec toi tao
        taskStatuses: [], // list trang thai
        taskDeadline: null, // viec hoan thanh hoac chua hoac all
        assignedGroupId: '', // nhom
        assignedUserId: '', // nguoi tao
        isCompletedTask: null, // han hoan thanh
        finishTaskTimeType: '', // menu complete
        taskName: '', // ten cong viec
        estimateEndFromDate: '', // den ngay
        estimateEndToDate: '', // tu ngay
        createdDateFrom: '', // tao tu ngay
        createdDateTo: '', // tao den ngay
        taskPriorities: [], // do uu tien
        followerIds: [], // list id nguoi theo doi
        combinerUserIds: [], // list id nguoi phoi hop
        combinerGroupIds: [], // list id nhom phoi hop
        sortOrder: '', // sap xep theo ten cv
        deadlineTaskTimeType: '', // han hoan thanh
        taskId: ''
      }
      this.objSetting = {
        type: constants.TYPE_SCREEN.PERFORMER,
        perform: true,
        state: true,
        progress: true,
        complete: true,
        assigner: true,
        createDate: true,
        source: true,
        typeTask: true,
        priority: true,
        combinator: true,
        follow: true
      }
    },
    showChildTask(index) {
      this.isReloadChildTask = false
      if (this.activeIndex.includes(index)) {
        const new_arr = this.activeIndex.filter(item => item !== index)
        this.activeIndex = new_arr
      } else {
        this.activeIndex.push(index)
      }
    },
    showProcess(id, value) {
      this.rowId = id
      this.dataProcess.process = value
      this.showDialogProcess = !this.showDialogProcess
    },
    async changeProcess(value) {
      try {
        if (this.rowId != null) {
          this.dataUpdateProgress.taskId = this.rowId
          this.dataUpdateProgress.progress = value
          const response = await TaskService.updateProgress(
            this.dataUpdateProgress
          )
          if (response.status === 200) {
            this.setNotify({
              show: true,
              type: 'success',
              content: this.$t('task-manager.information.update-progress')
            })
            await this.searchTask()
          }
        }
      } catch (error) {
        const message = error
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(message)
        })
      }
    },
    showDialogCreate() {
      this.showDialogCreatetask = true
    },
    async getTaskDetail(id) {
      try {
        this.loading = true
        const response = await TaskService.getDetailTask(
          id || this.taskId
        )
        this.dataTask = response.data
        this.dataTask.sourceTask ? this.listAssociation.push(this.dataTask.sourceTask) : this.listAssociation = []
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.loading = false
      }
    },
    async search() {
      try {
        this.objLoading.value = true

        this.activeIndex = []
        this.isReloadChildTask = true

        // get list task to day
        this.formData.taskDeadline = true
        if (this.formData.keywords) {
          this.formData.keywords = this.formData.keywords.trim()
        }

        this.formData.taskId = this.params_notification;

        const responseToday = await TaskService.searchCreatTask(
          this.formData
        )
        const dataResponseToDay = responseToday.data
        this.listTaskPerformerToDay = dataResponseToDay.data
        this.totalElementsToday = dataResponseToDay.totalElements

        // get list task remain
        this.formData.taskDeadline = 'false'
        if (this.formData.keywords) {
          this.formData.keywords = this.formData.keywords.trim()
        }
        const responseRemain = await TaskService.searchCreatTask(
          this.formData
        )
        const dataResponseRemain = responseRemain.data
        this.listTaskPerformerRemain = dataResponseRemain.data
        this.totalElementsRemain = dataResponseRemain.totalElements

        this.totalElements = this.totalElementsToday + this.totalElementsRemain

        this.setParamsNotification('');
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
    async searchTask() {
      this.formData.page = ''
      this.activeIndex = []
      await this.search()
    },
    changeSort(value, field) {
      this.formData.sortType = field
      switch (value) {
        case 0:
          this.indexSort = 1
          this.formData.sortOrder = true
          this.searchTask()
          return
        case 1:
          this.indexSort = 2
          this.formData.sortOrder = 'false'
          this.searchTask()
          return
        case 2:
          this.indexSort = 0
          this.formData.sortOrder = ''
          this.formData.sortType = ''
          this.searchTask()
          return
      }
    },
    showDialogAction(obj, action) {
      if (action === constants.TASK_MANAGER_ACTIONS.UPDATE_PROGRESS) {
        this.rowId = obj.taskId
        this.dataProcess.process = obj.progress
        this.showDialogProcess = !this.showDialogProcess
      } else {
        this.objConfirm.showDialogConfirm = true
      }
      if (action === constants.TASK_MANAGER_ACTIONS.REMOVE) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.delete'
      }
      if (action === constants.TASK_MANAGER_ACTIONS.CANCEL) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.cancel'
        this.objConfirm.isReason = true
        this.objConfirm.isNull = true
        this.objConfirm.status = true
      }
      if (action === constants.TASK_MANAGER_ACTIONS.PAUSE) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.pause'
        this.objConfirm.isReason = true
        this.objConfirm.isNull = true
        this.objConfirm.status = true
      }
      if (action === constants.TASK_MANAGER_ACTIONS.REVIEW) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.review'
        this.objConfirm.isReason = true
      }
      if (action === constants.TASK_MANAGER_ACTIONS.DENY_REVIEW) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.deny-review'
        this.objConfirm.isReason = true
        this.objConfirm.isNull = true
        this.objConfirm.status = true
      }
      if (action === constants.TASK_MANAGER_ACTIONS.TAKE_OVER) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.take-over'
        this.objConfirm.isReason = true
      }
      if (action === constants.TASK_MANAGER_ACTIONS.DENY_TAKE_OVER) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.deny-take-over'
        this.objConfirm.isReason = true
        this.objConfirm.isNull = true
        this.objConfirm.status = true
      }
      if (action === constants.TASK_MANAGER_ACTIONS.APPROVE) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.approve'
        this.objConfirm.isReason = true
      }
      if (action === constants.TASK_MANAGER_ACTIONS.DENY_APPROVE) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.deny-approve'
        this.objConfirm.isReason = true
        this.objConfirm.isNull = true
        this.objConfirm.status = true
      }
      if (action === constants.TASK_MANAGER_ACTIONS.CLOSE) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.close'
      }
      if (action === constants.TASK_MANAGER_ACTIONS.RESENT_REVIEW) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.resent-review'
      }
      if (action === constants.TASK_MANAGER_ACTIONS.RESENT_TAKE_OVER) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.resent-task-over'
      }
      if (action === constants.TASK_MANAGER_ACTIONS.RESENT_APPROVE) {
        this.objConfirm.titleConfirm = 'task-manager.title-confirm.resent-approve'
      }
      this.objTask = obj
      this.actionTask = action
    },
    acceptAction() {
      try {
        this.objLoading.value = true
        this.clickAction(this.actionTask, this.objTask, this.objConfirm.comment)
      } catch (error) {
        console.log(error)
      } finally {
        this.objLoading.value = false
      }
    },
    closeDialogConfirm() {
      this.objConfirm.comment = ''
      this.objConfirm.showDialogConfirm = false
      this.objConfirm.isReason = false
      this.objConfirm.isNull = false
      this.objConfirm.status = false
    },
    showDialogDetailFromEmit(val) {
      this.showDialogDetail = val
    },
    taskIdFromEmit(val) {
      this.taskId = val
    },
    closeDialogDetail() {
      this.showDialogDetail = false
    },
    showDialogEditFromEmit(val) {
      this.showDialogUpdateTask = val
    },
    closeDialogUpdate() {
      this.showDialogUpdateTask = false
    },
    // goi ham search sau khi tao moi thanh cong
    searchTaskCreate() {
      this.objCountSearch.countSearch = 0

      // reset form data search when create
      this.formData.taskName = null
      this.formData.taskStatuses.length = 0
      this.formData.taskType = null
      this.formData.deadlineTaskTimeType = null
      this.formData.estimateEndFromDate = null
      this.formData.estimateEndToDate = null
      this.formData.taskPriorities = []
      this.formData.followerIds = []
      this.formData.combinerUserIds = []
      this.formData.combinerGroupIds = []

      this.searchTask()
    }
  },
}
</script>
<style scoped>
.container-table{
  height: calc(100vh - 250px) !important;
  min-height: 50vh;
  overflow-y: auto;
}
</style>
