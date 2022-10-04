<template>
  <div id="page-create" class="task-manager">
    <v-container class="rounded-xl" fluid>
      <div class="wrap-home">
        <div class="d-flex justify-space-between align-center my-3">
          <h5 class="text-capitalize">
            {{ $t('task-manager.menu.list-create-task') }}
            <span v-if="totalElements">({{ totalElements }})</span>
          </h5>
          <v-btn color="primary" @click="showDialogCreate">
            <span class="pr-3 text-uppercase text--button">{{
              $t('task-manager.button.create')
            }} </span>
            <vue-feather size="25" type="plus-circle" />
          </v-btn>
        </div>
        <control-task
          :form-data="formData"
          :obj-count="objCountSearch"
          :obj-setting="objSetting"
          :search-task="searchTask"
        />
        <v-layout wrap>
          <div class="col-12 pa-0">
            <div
              v-if="listTaskCreate.length === 0"
              class="col-md-5 col-12 mx-auto wrap-empty-list"
            >
              <empty-box
                :subtitle="'task-manager.empty.data'"
              />
            </div>
            <div
              v-else
              class="list-task text-center my-2 list-task-create"
            >
              <v-scroll-y-transition>
                <v-simple-table v-show="showTable" class="table-task" dense fixed-header>
                  <template v-slot:default>
                    <thead class="text--body-5 text-capitalize">
                      <tr>
                        <th class="text-start task-name">
                          <div class="d-flex justify-space-between align-center">
                            <span>
                              {{ $t('task-manager.table.name') }}
                            </span>
                            <span
                              v-if="indexSort === 0 || formData.sortType !== listSortField[0]"
                              class="icon-sort"
                              @click="changeSortName(0, listSortField[0])"
                            />
                            <span
                              v-if="indexSort === 1 && formData.sortType === listSortField[0]"
                              class="icon-sort__asc"
                              @click="changeSortName(1, listSortField[0])"
                            />
                            <span
                              v-if="indexSort === 2 && formData.sortType === listSortField[0]"
                              class="icon-sort__desc"
                              @click="changeSortName(2, listSortField[0])"
                            />
                          </div>
                        </th>
                        <th v-if="objSetting.perform" class="text-start task-perform">
                          {{ $t('task-manager.table.performer') }}
                        </th>
                        <th v-if="objSetting.state" class="text-start task-state">
                          <div class="d-flex justify-space-between align-center">
                            <span>
                              {{ $t('task-manager.table.state') }}
                            </span>
                            <span
                              v-if="indexSort === 0 || formData.sortType !== listSortField[1]"
                              class="icon-sort"
                              @click="changeSortName(0, listSortField[1])"
                            />
                            <span
                              v-if="indexSort === 1 && formData.sortType === listSortField[1]"
                              class="icon-sort__asc"
                              @click="changeSortName(1, listSortField[1])"
                            />
                            <span
                              v-if="indexSort === 2 && formData.sortType === listSortField[1]"
                              class="icon-sort__desc"
                              @click="changeSortName(2, listSortField[1])"
                            />
                          </div>
                        </th>
                        <th v-if="objSetting.progress" class="text-start task-process">
                          <div class="d-flex justify-space-between align-center">
                            <span>
                              {{ $t('task-manager.table.process') }}
                            </span>
                            <span
                              v-if="indexSort === 0 || formData.sortType !== listSortField[2]"
                              class="icon-sort"
                              @click="changeSortName(0, listSortField[2])"
                            />
                            <span
                              v-if="indexSort === 1 && formData.sortType === listSortField[2]"
                              class="icon-sort__asc"
                              @click="changeSortName(1, listSortField[2])"
                            />
                            <span
                              v-if="indexSort === 2 && formData.sortType === listSortField[2]"
                              class="icon-sort__desc"
                              @click="changeSortName(2, listSortField[2])"
                            />
                          </div>
                        </th>
                        <th v-if="objSetting.complete" class="text-start task-complete">
                          <div class="d-flex justify-space-between align-center">
                            <span>
                              {{ $t('task-manager.table.duration') }}
                            </span>
                            <span
                              v-if="indexSort === 0 || formData.sortType !== listSortField[3]"
                              class="icon-sort"
                              @click="changeSortName(0, listSortField[3])"
                            />
                            <span
                              v-if="indexSort === 1 && formData.sortType === listSortField[3]"
                              class="icon-sort__asc"
                              @click="changeSortName(1, listSortField[3])"
                            />
                            <span
                              v-if="indexSort === 2 && formData.sortType === listSortField[3]"
                              class="icon-sort__desc"
                              @click="changeSortName(2, listSortField[3])"
                            />
                          </div>
                        </th>
                        <th v-if="objSetting.assigner" class="text-start task-deliver">
                          {{ $t('task-manager.table.deliver') }}
                        </th>
                        <th v-if="objSetting.createDate" class="text-start task-create-date">
                          {{ $t('task-manager.table.date-create') }}
                        </th>
                        <th class="text-center task-action">
                          {{ $t('task-manager.table.actions') }}
                        </th>
                      </tr>
                    </thead>
                    <row-parent
                      v-for="(itemParent, idx) in listTaskCreate"
                      :key="idx"
                      :active-index="activeIndex"
                      :index="itemParent.taskId"
                      :is-reload="isLoadingChildTask"
                      :item-parent="itemParent"
                      :obj-loading="objLoading"
                      :obj-setting="objSetting"
                      :show-dialog-edit="showDialogEditTask"
                      :show-dialog-task-detail="showDialogTaskDetail"
                      @showDialogEdit="showDialogEditFromEmit"
                      @taskId="taskIdfromEmit"
                      @show-process="showProcess"
                      @show-child-task="showChildTask(itemParent.taskId)"
                      @show-dialog-detail="openTaskDetail"
                      @show-dialog-edit="showDialogEditFromEmit"
                      @show-dialog-action="showDialogAction"
                    />
                  </template>
                </v-simple-table>
              </v-scroll-y-transition>
            </div>
            <div
              v-if="totalRecords > 0"
              class="mt-10 mx-2 px-8 pb-4"
            >
              <base-paging
                :from-record="fromRecord"
                :page="page"
                :to-record="toRecord"
                :total-pages="totalPages"
                :total-records="totalRecords"
                @on-change-page="onChangePage"
              />
            </div>
          </div>
        </v-layout>
        <dialog-task-detail
          :data-task="dataTask"
          :form-data-search="formData"
          :show-dialog="showDialogTaskDetail"
          :task-id="taskId"
          @search-task-create="searchTaskCreate"
          @close-dialog="closeDialogDetail"
          @get-detail="getTaskDetail"
        />
        <dialog-update
          :form-data="dataTask"
          :form-data-search="formData"
          :list-association="listAssociation"
          :show-dialog="showDialogEditTask"
          :status-bengin="statusBengin"
          :task-id="taskId"
          @search-task-create="searchTaskCreate"
          @close-dialog="closeDialogUpdate"
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
          @close-dialog="closeDialogCreate"
          @miniMize-dialog="showDialogCreatetask=false"
        />
        <dia-log-confirm
          :loading="objLoading.value"
          :obj-confirm="objConfirm"
          @accept-action="acceptAction"
          @close-dialog="closeDialogConfirm"
        />
      </div>
    </v-container>
    <base-preload :dialog="objLoading.value" />
  </div>
</template>
<script>
// components
import EmptyBox from '@/views/components/EmptyBox'
import ControlTask from '@/modules/etask/views/components/ControlTask'
import DialogUpdateProcess from '@/modules/etask/views/components/DialogUpdateProcess'
import DialogCreateTask from '@/modules/etask/views/components/DialogCreateTask'
import DialogTaskDetail from "@/modules/etask/views/components/DialogTaskDetail";
import DialogUpdate from "@/modules/etask/views/components/DialogUpdate";
import DiaLogConfirm from '@/modules/etask/views/components/DiaLogConfirm'

// view
import RowParent from '@/modules/etask/views/task/create/components/RowParent'

// service
import { TaskService } from '@/modules/etask/services/taskService'

// mixins
import pagingData from '@/mixins/paging'
import actionsTask from '@/modules/etask/mixins/actionsTask'

// config
import config from '@/config'

// vuex
import { mapActions, mapState } from 'vuex'

// constants
import constants from '@/modules/etask/constants'

export default {
  name: 'ICreateTask',
  components: {
    EmptyBox,
    ControlTask,
    DialogUpdateProcess,
    DialogCreateTask,
    DialogTaskDetail,
    RowParent,
    DialogUpdate,
    DiaLogConfirm
  },
  mixins: [pagingData, actionsTask],
  data() {
    return {
      showDialogTaskDetail: false,
      showDialogProcess: false,
      showDialogCreatetask: false,
      taskId: null,
      loading: false,
      statusBengin: '',
      listTaskCreate: [],
      formData: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'CREATED', // loai cong viec - cong viec toi tao
        taskStatuses: [], // list trang thai
        taskDeadline: null, // viec hoan thanh hoac chua hoac all
        assignedGroupId: '', // nhom
        assignedUserId: '', // nguoi tao
        deadlineTaskTimeType: '', // Han hoan thanh
        isCompletedTask: '', // han hoan thanh
        finishTaskTimeType: '', // menu complete
        taskName: '', // ten cong viec
        estimateEndFromDate: '', // den ngay
        estimateEndToDate: '', // tu ngay
        createdDateFrom: '', // tao tu ngay
        createdDateTo: '', // tao den ngay
        taskPriorities: [], // do uu tien
        performerUserIds: [], // list id nguoi thuc hien
        performerGroupIds: [], // list id nhom thuc hien
        followerIds: [], // list id nguoi theo doi
        combinerUserIds: [], // list id nguoi phoi hop
        combinerGroupIds: [], // list id nhom phoi hop
        sortOrder: '', // sap xep theo ten cv
        taskType: '', // loai cong viec
        taskId: ''
      },
      showTable: false,
      activeIndex: [],

      dataProcess: {
        process: null
      },
      rowId: null,
      totalElements: null,
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
        parentTask: null,
        progress: null,
        currentUserRoles: [],
        actualDuration: null,
        reportFreq: 'YEARLY',
        performer: null,
        assigner: null,
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
      listActionsDetail: [],
      taskIdDetail: null,
      showDialogEditTask: false,
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
      objTask: {},
      objLoading: {
        value: false
      },
      isLoadingChildTask: false,
      objSetting: {
        type: constants.TYPE_SCREEN.CREATE,
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
      dataDefault: {},
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
    // },
    taskId() {
      if (this.taskId) {
        this.getTaskDetail(this.taskId)
        this.statusBengin = this.dataTask.status
      }
    },
    showDialogTaskDetail() {
      if (this.showDialogTaskDetail) {
        this.getTaskDetail(this.taskId)
      }
    },
    showDialogEditTask() {
      if (this.showDialogEditTask) {
        this.getTaskDetail(this.taskId)
      }
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
  },
  mounted() {
  },
  methods: {
    ...mapActions('layout', ['setNotify', 'setParamsNotification']),

    openTaskDetail(data) {
      this.showDialogTaskDetail = data
    },
    closeDialogDetail() {
      this.showDialogTaskDetail = false
    },
    taskIdfromEmit(val) {
      this.taskId = val
    },
    showDialogEditFromEmit(val) {
      this.showDialogEditTask = val
    },
    closeDialogCreate() {
      this.showDialogCreatetask = false
    },
    closeDialogUpdate() {
      this.showDialogEditTask = false
    },
    setDefault() {
      this.formData = {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'CREATED', // loai cong viec - cong viec toi tao
        taskStatuses: [], // list trang thai
        taskDeadline: null, // viec hoan thanh hoac chua hoac all
        assignedGroupId: '', // nhom
        assignedUserId: '', // nguoi tao
        deadlineTaskTimeType: '', // Han hoan thanh
        isCompletedTask: null, // han hoan thanh
        finishTaskTimeType: '', // menu complete
        taskName: '', // ten cong viec
        estimateEndFromDate: '', // den ngay
        estimateEndToDate: '', // tu ngay
        createdDateFrom: '', // tao tu ngay
        createdDateTo: '', // tao den ngay
        taskPriorities: [], // do uu tien
        performerUserIds: [], // list id nguoi thuc hien
        performerGroupIds: [], // list id nhom thuc hien
        followerIds: [], // list id nguoi theo doi
        combinerUserIds: [], // list id nguoi phoi hop
        combinerGroupIds: [], // list id nhom phoi hop
        sortOrder: '', // sap xep theo ten cv
        taskType: '', // loai cong viec
        taskId: ''
      }
      this.objSetting = {
        type: constants.TYPE_SCREEN.CREATE,
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
      this.isLoadingChildTask = false
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
    async searchTask() {
      this.formData.page = ''
      await this.search()
    },
    async search() {
      try {
        this.objLoading.value = true

        this.activeIndex = []

        this.isLoadingChildTask = true

        if (this.formData.keywords) {
          this.formData.keywords = this.formData.keywords.trim()
        }

        this.formData.taskId = this.params_notification;

        const response = await TaskService.searchCreatTask(
          this.formData
        )
        const dataResponse = response.data

        this.listTaskCreate = dataResponse.data
        this.totalElements = dataResponse.totalElements
        this.renderPaging(dataResponse)
        this.setParamsNotification('');
        setTimeout(() => {
          this.showTable = true
        }, 10)
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
    async getTaskDetail(id) {
      try {
        this.objLoading.value = true
        const response = await TaskService.getDetailTask(
          id || this.taskId
        )
        this.dataTask = response.data
        this.dataDefault = { ...this.dataTask }
        this.dataTask.sourceTask ? this.listAssociation.push(this.dataTask.sourceTask) : this.listAssociation = []
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
    onChangePage(page) {
      this.formData.page = page
      this.page = page
      this.search()
    },
    showDialogCreate() {
      this.showDialogCreatetask = true
    },
    changeSortName(value, field) {
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
      this.formData.performerUserIds = []
      this.formData.performerGroupIds = []
      this.formData.followerIds = []
      this.formData.combinerUserIds = []
      this.formData.combinerGroupIds = []

      this.searchTask()
    }
  }
}
</script>

