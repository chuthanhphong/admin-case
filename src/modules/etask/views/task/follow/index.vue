<template>
  <div id="page-create" class="task-manager">
    <v-container class="rounded-xl" fluid>
      <div class="wrap-home">
        <div class="d-flex justify-space-between align-center my-3">
          <h5 class="text-capitalize">
            {{ $t('task-manager.menu.list-follow-task') }}
            <span v-if="totalElements">({{ totalElements }})</span>
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
        <v-layout wrap>
          <div class="col-12 pa-0">
            <div
              v-if="listTask.length === 0"
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
                        <th v-if="objSetting.combinator" class="text-start task-combination">
                          {{ $t('task-manager.table.combination') }}
                        </th>
                        <th v-if="objSetting.priority" class="text-start task-priority">
                          {{ $t('task-manager.table.priority') }}
                        </th>
                        <th v-if="objSetting.typeTask" class="text-start task-style-task">
                          <span>
                            {{ $t('task-manager.table.style-task') }}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <row-parent
                      v-for="(itemParent, idx) in listTask"
                      :key="idx"
                      :active-index="activeIndex"
                      :index="itemParent.taskId"
                      :item-parent="itemParent"
                      :obj-loading="objLoading"
                      :obj-setting="objSetting"
                      :show-dialog-task-detail="showDialogTaskDetail"
                      @taskId="taskIdfromEmit"
                      @show-process="showProcess"
                      @show-child-task="showChildTask"
                      @show-dialog-detail="openTaskDetail"
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
          @get-detail="getTaskDetail"
          @close-dialog="closeDialogDetail"
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
      </div>
    </v-container>
    <base-preload :dialog="objLoading.value" />
  </div>
</template>
<script>
// components
import EmptyBox from '@/views/components/EmptyBox'
import DialogUpdateProcess from '@/modules/etask/views/components/DialogUpdateProcess'
import DialogCreateTask from '@/modules/etask/views/components/DialogCreateTask'
import DialogTaskDetail from '@/modules/etask/views/components/DialogTaskDetail'

// view
import ControlTask from '@/modules/etask/views/task/follow/components/ControlTask'
import RowParent from '@/modules/etask/views/task/follow/components/RowParent'

// service
import { TaskService } from '@/modules/etask/services/taskService'

// mixins
import pagingData from '@/mixins/paging'
import actionsTask from '@/modules/etask/mixins/actionsTask'

// config
import config from '@/config'

// vuex
import { mapActions, mapState } from 'vuex'
import constants from "@/modules/etask/constants";

export default {
  name: 'IAssign',
  components: {
    EmptyBox,
    ControlTask,
    DialogUpdateProcess,
    DialogTaskDetail,
    RowParent,
    DialogCreateTask
  },
  mixins: [pagingData, actionsTask],
  data() {
    return {
      showDialogTaskDetail: false,
      showDialogProcess: false,
      showDialogCreatetask: false,
      taskId: null,
      listTask: [],
      formData: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'FOLLOWED', // loai cong viec - cong viec toi tao
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
        combinerUserIds: [], // list id nguoi phoi hop
        combinerGroupIds: [], // list id nhom phoi hop
        sortOrder: '', // sap xep theo ten cv
        taskType: '', // loai cong viec
        taskId: ''

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
      showTable: true,
      activeIndex: [],

      dataProcess: {
        process: null
      },
      rowId: null,
      totalElements: null,
      indexSort: 0,
      dataUpdateProgress: {
        taskId: '',
        progress: ''
      },
      listSortField: ['TASKNAME', 'TASKSTATUS', 'TASKPROGRESS', 'COMPLETEDATE'],
      objLoading: {
        value: false
      },
      objSetting: {
        type: constants.TYPE_SCREEN.FOLLOWER,
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
      }
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
    showDialogTaskDetail() {
      if (this.getTaskDetail) {
        this.getTaskDetail(this.taskId)
      }
    },
    showDialogEditTask() {
      if (this.showDialogEditTask) {
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
  },
  mounted() {
  },
  methods: {
    ...mapActions('layout', ['setNotify', 'setParamsNotification']),
    setDefault() {
      this.formData = {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'FOLLOWED', // loai cong viec - cong viec toi tao
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
        combinerUserIds: [], // list id nguoi phoi hop
        combinerGroupIds: [], // list id nhom phoi hop
        sortOrder: '', // sap xep theo ten cv
        taskType: '', // loai cong viec
        taskId: ''
      }
      this.objSetting = {
        type: constants.TYPE_SCREEN.FOLLOWER,
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
      if (this.activeIndex.includes(index)) {
        const new_arr = this.activeIndex.filter(item => item !== index)
        this.activeIndex = new_arr
      } else {
        this.activeIndex.push(index)
      }
    },
    closeDialogDetail() {
      this.showDialogTaskDetail = false
    },
    taskIdfromEmit(val) {
      this.taskId = val
    },
    openTaskDetail(data) {
      this.showDialogTaskDetail = data
    },
    showProcess(id, value) {
      this.rowId = id
      this.dataProcess.process = value
      this.showDialogProcess = !this.showDialogProcess
    },
    async getTaskDetail(id) {
      try {
        this.objLoading.value = true
        const response = await TaskService.getDetailTask(
          id || this.taskId
        )
        this.dataTask = response.data
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

        if (this.formData.keywords) {
          this.formData.keywords = this.formData.keywords.trim()
        }

        this.formData.taskId = this.params_notification;

        const response = await TaskService.searchCreatTask(
          this.formData
        )
        const dataResponse = response.data
        this.listTask = dataResponse.data
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
      this.formData.combinerUserIds = []
      this.formData.combinerGroupIds = []

      this.searchTask()
    }
  }
}
</script>
