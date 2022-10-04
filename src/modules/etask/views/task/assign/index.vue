<template>
  <div id="page-create" class="task-manager">
    <v-container class="rounded-xl" fluid>
      <div class="wrap-home">
        <div class="d-flex justify-space-between align-center my-3">
          <h5 class="text-capitalize">
            {{ $t('task-manager.menu.list-assign-task') }}
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
              v-if="listAssigner.length === 0"
              class="col-md-5 col-12 mx-auto wrap-empty-list"
            >
              <empty-box
                :subtitle="'task-manager.empty.data'"
              />
            </div>
            <div
              v-else
              id="table__assign-task"
              class="text-center my-2 list-task list-task-assign"
            >
              <v-simple-table class="table-task" dense fixed-header>
                <template v-slot:default>
                  <thead class="text--body-5 text-capitalize">
                    <tr>
                      <th class="text-start cell__task-name">
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
                      <th v-if="objSetting.perform" class="text-start cell__task-perform">
                        {{ $t('task-manager.table.performer') }}
                      </th>
                      <th v-if="objSetting.state" class="text-start cell__task-state">
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
                      <th v-if="objSetting.progress" class="text-start cell__task-process">
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
                      <th v-if="objSetting.complete" class="text-start cell__task-complete">
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
                      <th v-if="objSetting.source" class="text-start cell__task-source">
                        <span>
                          {{ $t('task-manager.table.source') }}
                        </span>
                      </th>
                      <th v-if="objSetting.typeTask" class="text-start cell__task-style-task">
                        <span>
                          {{ $t('task-manager.table.style-task') }}
                        </span>
                      </th>
                      <th class="text-center cell__task-action">
                        {{ $t('task-manager.table.actions') }}
                      </th>
                    </tr>
                  </thead>
                </template>
              </v-simple-table>
              <div class="list-task-assign box-list-task-assign">
                <div
                  v-for="(user, idx) in listUserAssign"
                  :key="'user' + idx"
                >
                  <div class="d-flex ma-3 ml-0">
                    <div
                      class="box-user"
                      @click="showTaskUser(user.userId)"
                    >
                      <v-avatar
                        class="cursor-pointer"
                        color="red"
                        size="32"
                      >
                        <span class="text-uppercase white--text">{{
                          renderAvatarText(user.userName)
                        }}</span>
                      </v-avatar>
                      <div class="mx-1">
                        <span>
                          {{ $t('task-manager.label.give') }}:
                        </span>
                        {{ user.fullName }} - {{ user.userName }}
                      </div>
                      <div>
                        <span>({{ user.totalTask }})</span>
                      </div>
                      <div
                        v-if="listUserActive.includes(user.userId)"
                      >
                        <v-img src="@/assets/icons/task/chevron-down.svg" />
                      </div>
                      <div
                        v-else
                      >
                        <v-img src="@/assets/icons/task/chevron-right.svg" />
                      </div>
                    </div>
                  </div>
                  <table-task-user
                    :form-data="formData"
                    :id-user="user.userId"
                    :id-user-active="idUserActive"
                    :list-user-active="listUserActive"
                    :obj-loading="objLoading"
                    :obj-setting="objSetting"
                    @task-id="taskIdFromEmit"
                    @show-process="showProcess"
                    @show-dialog-detail="showDialogDetailFromEmit"
                    @show-dialog-update=" showDialogEditFromEmit"
                    @show-dialog-action="showDialogAction"
                  />
                </div>
                <div
                  v-for="(group, idx) in listGroupAssign"
                  :key="'group' + idx"
                >
                  <div class="d-flex ma-3 ml-0">
                    <div
                      class="box-user"
                      @click="showTaskGroup(group.groupId)"
                    >
                      <img src="@/assets/icons/task/PersonAvatar.svg">
                      <div class="mx-1">
                        <span>
                          {{ $t('task-manager.label.give') }}:
                        </span>
                        {{ group.groupName }}
                      </div>
                      <div>
                        <span>({{ group.totalTask }})</span>
                      </div>
                      <div
                        v-if="listGroupActive.includes(group.groupId)"
                      >
                        <v-img src="@/assets/icons/task/chevron-down.svg" />
                      </div>
                      <div
                        v-else
                      >
                        <v-img src="@/assets/icons/task/chevron-right.svg" />
                      </div>
                    </div>
                  </div>
                  <table-task-group
                    :form-data="formData"
                    :id-group="group.groupId"
                    :id-group-active="idGroupActive"
                    :list-group-active="listGroupActive"
                    :obj-loading="objLoading"
                    :obj-setting="objSetting"
                    @task-id="taskIdFromEmit"
                    @show-process="showProcess"
                    @show-dialog-detail="showDialogDetailFromEmit"
                    @show-dialog-update=" showDialogEditFromEmit"
                    @show-dialog-action="showDialogAction"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="totalRecords > 0"
              class="mt-5 mx-2 px-8 pb-5"
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
        <dialog-task-detail
          :data-task="dataTask"
          :form-data-search="formData"
          :is-permisson-approve="true"
          :show-dialog="showDialogDetail"
          :task-id="taskId"
          @search-task-create="searchTaskCreate"
          @get-detail="getTaskDetail"
          @close-dialog="closeDialogDetail"
        />
        <dialog-update
          :form-data="dataTask"
          :form-data-search="formData"
          :list-association="listAssociation"
          :show-dialog="showDialogUpdate"
          :task-id="taskId"
          @search-task-create="searchTaskCreate"
          @close-dialog="closeDialogUpdate"
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
import DiaLogConfirm from '@/modules/etask/views/components/DiaLogConfirm'

// view
import TableTaskUser from '@/modules/etask/views/task/assign/components/TableTaskUser'
import TableTaskGroup from '@/modules/etask/views/task/assign/components/TableTaskGroup'
import DialogTaskDetail from "@/modules/etask/views/components/DialogTaskDetail";
import DialogUpdate from "@/modules/etask/views/components/DialogUpdate";

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
  name: 'IAssign',
  components: {
    EmptyBox,
    ControlTask,
    DialogUpdateProcess,
    DialogCreateTask,
    TableTaskUser,
    TableTaskGroup,
    DiaLogConfirm,
    DialogUpdate,
    DialogTaskDetail
  },
  mixins: [pagingData, actionsTask],
  data() {
    return {
      showDialogProcess: false,
      showDialogCreatetask: false,
      showDialogDetail: false,
      showDialogUpdate: false,
      taskId: null,
      listUserAssign: [],
      listGroupAssign: [],
      formData: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'ASSIGNED', // loai cong viec - cong viec toi tao
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
        performerUserIds: [], // list id nguoi thuc hien
        performerGroupIds: [], // list id nhom thuc hien
        followerIds: [], // list id nguoi theo doi
        combinerUserIds: [], // list id nguoi phoi hop
        combinerGroupIds: [], // list id nhom phoi hop
        sortOrder: '', // sap xep theo ten cv
        taskType: '', // loai cong viec
        deadlineTaskTimeType: '', // han hoan thanh
        taskId: ''
      },

      dataProcess: {
        process: null
      },
      rowId: null,
      listUserActive: [],
      listGroupActive: [],
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
      idUserActive: null,
      idGroupActive: null,
      objLoading: {
        value: false
      },
      objTask: {},
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
        parentTask: null,
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
        sourceTasks: {},
        taskAssociations: [],
        listActions: []
      },
      listAssigner: [],
      objSetting: {
        type: constants.TYPE_SCREEN.ASSIGN,
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
    dataTask: {
      handler() {
        /* comment chua lam chuc nang nay*/
        // this.compareObject(this.dataTask.performer, this.dataDefault.performer)
        // this.compareObject(this.dataTask.assigner, this.dataDefault.assigner)
        // this.compareObject(this.dataTask.progress, this.dataDefault.progress)
        // this.compareObject(this.dataTask.combinators, this.dataDefault.combinators)
        // this.compareObject(this.dataTask.monitors, this.dataDefault.monitors)
        // this.compareObject(this.dataTask.sourceTask, this.dataDefault.sourceTask)
        // this.compareObject(this.dataTask.taskAssociations, this.dataDefault.taskAssociations)
        // this.compareObject(this.dataTask.content, this.dataDefault.content)
        // this.compareObject(this.dataTask.fileAttachments, this.dataDefault.fileAttachments)
      }, deep: true
    },
    showDialogDetail() {
      if (this.showDialogDetail) {
        this.getTaskDetail(this.taskId)
      }
    },
    showDialogUpdate() {
      if (this.showDialogUpdate) {
        this.getTaskDetail(this.taskId)
      }
    },
    taskId() {
      if (this.taskId) {
        this.getTaskDetail(this.taskId)
      }
    },
    params_notification(newValue) {
      if (newValue) {
        this.setDefault();
      }
    }
  },
  created() {
    if (this.pageCode_notification) {
      this.formData.isCompletedTask = null;
    }
    if (this.$route.params.key) {
      switch (this.$route.params.key) {
        case 2:
          this.formData.isCompletedTask = 'false';
          this.formData.deadlineTaskTimeType = 'EXPIRED'
          break;
        case 3:
          this.formData.isCompletedTask = null;
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
    showProcess(id, value) {
      this.rowId = id
      this.dataProcess.process = value
      this.showDialogProcess = !this.showDialogProcess
    },
    setDefault() {
      this.formData = {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'ASSIGNED', // loai cong viec - cong viec toi tao
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
        performerUserIds: [], // list id nguoi thuc hien
        performerGroupIds: [], // list id nhom thuc hien
        followerIds: [], // list id nguoi theo doi
        combinerUserIds: [], // list id nguoi phoi hop
        combinerGroupIds: [], // list id nhom phoi hop
        sortOrder: '', // sap xep theo ten cv
        taskType: '', // loai cong viec
        deadlineTaskTimeType: '', // han hoan thanh
        taskId: ''
      }

      this.objSetting = {
        type: constants.TYPE_SCREEN.ASSIGN,
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
    renderAvatarText(customer) {
      return this.genAvatar(customer)
    },
    genAvatar(name) {
      if (!name) return ''
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        name = name.replaceAll(' ', ' ').trim()
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
    showTaskUser(index) {
      this.idUserActive = index
      if (this.listUserActive.includes(index)) {
        const new_arr = this.listUserActive.filter(item => item !== index)
        this.listUserActive = new_arr
      } else {
        this.listUserActive.push(index)
      }
    },
    showTaskGroup(index) {
      this.idGroupActive = index
      if (this.listGroupActive.includes(index)) {
        const new_arr = this.listGroupActive.filter(item => item !== index)
        this.listGroupActive = new_arr
      } else {
        this.listGroupActive.push(index)
      }
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

        this.listUserAssign = []
        this.listGroupAssign = []

        this.listUserActive = []
        this.listGroupActive = []

        this.idUserActive = null
        this.idGroupActive = null

        this.formData.assignedUserId = null
        this.formData.assignedGroupId = null
        this.formData.pageSize = config.app.paging.pageSize

        if (this.formData.keywords) {
          this.formData.keywords = this.formData.keywords.trim()
        }

        // get list user va group assign by current user
        this.formData.assignedGroupId = null
        this.formData.taskId = this.params_notification;
        const responseUser = await TaskService.getListAssignCurrentUser(
          this.formData
        )
        const response = responseUser.data
        this.renderPaging(response)
        this.listAssigner = response.data
        if (this.listAssigner && this.listAssigner.length !== 0) {
          this.listAssigner.filter(item => {
            if (item.userId) {
              this.listUserAssign.push(item)
            } else {
              this.listGroupAssign.push(item)
            }
          })
        }

        // search task
        this.formData.assignedGroupId = null
        this.formData.assignedUserId = null
        if (this.formData.keywords) {
          this.formData.keywords = this.formData.keywords.trim()
        }
        const responseTask = await TaskService.searchCreatTask(
          this.formData
        )
        const dataResponse = responseTask.data
        this.totalElements = dataResponse.totalElements
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
      await this.search()
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
      this.showDialogUpdate = val
    },
    closeDialogUpdate() {
      this.showDialogUpdate = false
    },
    onChangePage(page) {
      this.formData.page = page
      this.page = page
      this.search()
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
<style>
.box-list-task-assign {
  height: calc(100vh - 348px) !important;
  min-height: 50vh;
  overflow-y: auto;
}
</style>
