<template>
  <div id="page-create" class="task-manager">
    <v-container class="rounded-xl" fluid>
      <div class="wrap-home">
        <div class="d-flex justify-space-between align-center my-3">
          <h5 class="text-capitalize">
            {{ $t('task-manager.menu.list-unit-task') }}
            <span>({{ totalTask }})</span>
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
        <v-row>
          <v-col cols="6" md="3" xl="2">
            <v-select
              v-model="select"
              :item-text="item => $t(item.name)"
              :items="listStyleTask"
              :placeholder="$t('task-manager.label.choose-style-task')"
              class="text--body-5"
              dense
              item-value="value"
              outlined
              return-object
              @change="onchangeSelect(`${select.value}`)"
            >
              <template v-slot:append>
                <v-icon>mdi-chevron-down</v-icon>
              </template>
            </v-select>
          </v-col>
          <v-col cols="6" md="3" xl="2">
            <v-menu
              v-model="menuTreeUnit"
              :close-on-content-click="false"
              :value="showTreeUnit"
              attach
              bottom
              max-width="423px"
              min-width="423px"
              offset-y
              origin="center center"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  ref="nameUnit"
                  :value="unit.groupName"
                  class="text--body-5"
                  dense
                  hide-details="auto"
                  outlined
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @click:append="menuTreeUnit = !menuTreeUnit"
                >
                  <template v-slot:append>
                    <img
                      alt=""
                      class="hover--pointer"
                      src="@/assets/icons/task/dropdown.svg"
                      @click="menuTreeUnit = !menuTreeUnit"
                    >
                  </template>
                </v-text-field>
              </template>
              <div>
                <div class="pa-3">
                  <span class="text--lg">
                    {{ $t('task-manager.tree-unit.list') }}
                  </span>
                </div>
                <div>
                  <v-text-field
                    v-model="nameTreeUnit"
                    :placeholder="$t('task-manager.placeHolder.name-unit-task')"
                    class="text--body-5 ma-3"
                    clearable
                    dense
                    hide-details
                    name="txtSearch"
                    outlined
                  >
                    <vue-feather
                      slot="prepend-inner"
                      class="grey--text"
                      size="20"
                      type="search"
                    />
                  </v-text-field>
                </div>
                <v-treeview
                  id="org-tree"
                  :active="actives"
                  :filter="filter"
                  :items="items"
                  :open="open"
                  :search="nameTreeUnit"
                  activatable
                  class="col-12 tree-unit"
                  dense
                  expand-icon="mdi-chevron-down"
                  hoverable
                  item-key="groupId"
                  item-text="groupName"
                  transition
                  @update:active="clickOnNode"
                >
                  <template slot="label" slot-scope="{ item, leaf }">
                    <v-tooltip content-class="tooltip-top" top>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          <span :class="`label-item-${leaf ? 'leaf' : 'parent'}`">{{
                            item.groupName
                          }}</span>
                        </span>
                      </template>
                      <span>{{ $t(item.groupName) }}</span>
                    </v-tooltip>
                  </template>
                </v-treeview>
                <div class="d-flex justify-center py-3">
                  <v-btn
                    class="w-150 py-5 mr-4 text--button"
                    color="primary"
                    elevation="0"
                    outlined
                    rounded
                    @click="closeDialog"
                  >
                    {{ $t('task-manager.tree-unit.cancel') }}
                  </v-btn>
                  <v-btn
                    class="w-150 py-5 text--button"
                    color="primary"
                    elevation="0"
                    rounded
                    @click="onSubmit"
                  >
                    {{ $t('task-manager.tree-unit.choose') }}
                  </v-btn>
                </div>
              </div>
            </v-menu>
          </v-col>
        </v-row>
        <v-layout wrap>
          <div class="list-task-unit col-12 pa-0">
            <div
              v-if="listUserAssign.length === 0"
              class="col-md-5 col-12 mx-auto box-empty"
            >
              <empty-box
                :subtitle="'task-manager.empty.data'"
              />
            </div>
            <div
              v-else
              id="table__assign-task"
              class="text-center my-2 list-task"
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
                      <th v-if="objSetting.priority" class="text-start cell__task-priority">
                        {{ $t('task-manager.table.prioritized') }}
                      </th>
                      <th v-if="objSetting.assigner" class="text-start cell__task-deliver">
                        {{ $t('task-manager.table.deliver') }}
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
              <div class="box-table-task">
                <div
                  v-for="(user, idx) in listUserAssign"
                  :key="'user' + idx"
                >
                  <div
                    v-if="user.userId"
                    class="d-flex ma-3 ml-0"
                  >
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
                      <div class="mx-2">
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
                  <div
                    v-if="user.groupId"
                    class="d-flex ma-3 ml-0"
                  >
                    <div
                      class="box-user"
                      @click="showTaskGroup(user.groupId)"
                    >
                      <img src="@/assets/icons/task/PersonAvatar.svg">
                      <div class="mx-2">
                        {{ user.pathName }}
                      </div>
                      <div>
                        <span>({{ user.totalTask }})</span>
                      </div>
                      <div
                        v-if="listGroupActive.includes(user.groupId)"
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
                    :id-group="user.groupId"
                    :id-group-active="idGroupActive"
                    :id-user="user.userId"
                    :id-user-active="idUserActive"
                    :list-group-active="listGroupActive"
                    :list-user-active="listUserActive"
                    :obj-loading="objLoading"
                    :obj-setting="objSetting"
                    @task-id="taskIdFromEmit"
                    @show-process="showProcess"
                    @show-dialog-detail="showDialogDetailFromEmit"
                    @show-dialog-update="showDialogEditFromEmit"
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
        <dialog-task-detail
          :data-task="dataTask"
          :form-data-search="formData"
          :is-permisson-approve="true"
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
import DialogTaskDetail from "@/modules/etask/views/components/DialogTaskDetail";
import DiaLogConfirm from '@/modules/etask/views/components/DiaLogConfirm'
import DialogUpdate from "@/modules/etask/views/components/DialogUpdate";

// view
import TableTaskUser from '@/modules/etask/views/task/roomwork/components/TableTaskUser'

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
import LTT from 'list-to-tree'

export default {
  name: 'RoomWork',
  components: {
    EmptyBox,
    ControlTask,
    DialogUpdateProcess,
    DialogCreateTask,
    DialogTaskDetail,
    TableTaskUser,
    DiaLogConfirm,
    DialogUpdate
  },
  mixins: [pagingData, actionsTask],
  data() {
    return {
      showDialogDetail: false,
      showDialogUpdate: false,
      showDialogProcess: false,
      showDialogCreatetask: false,
      showDialogUpdateTask: false,
      taskId: null,
      listUserAssign: [],
      formData: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'DEPARTMENTS', // loai cong viec - cong viec toi tao
        taskStatuses: [], // list trang thai
        taskDeadline: null, // viec hoan thanh hoac chua hoac all
        assignedGroupId: '', // nhom
        actionUserId: '', // nguoi tao
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
        parentGroupId: '', // id group tree unit
        assignType: 'false', // loai cong viec
        taskId: ''
      },
      showTable: true,

      dataProcess: {
        process: null
      },
      rowId: null,
      listUserActive: [],
      listGroupActive: [],
      indexSort: 0,
      listStyleTask: [
        {
          value: 'false',
          name: 'task-manager.label.deliver'
        },
        {
          value: 'true',
          name: 'task-manager.label.deliver-to'
        }
      ],
      // Date
      menuTreeUnit: null,
      errorDateFromTo: null,
      childKey: 0,
      select: {
        value: 'false',
        name: 'task-manager.label.deliver'
      },
      showTreeUnit: false,
      actives: [],
      selectedNode: [],
      open: [],
      items: [],
      groups: [],
      rootGroupId: 1,
      dataUpdateProgress: {
        taskId: '',
        progress: ''
      },
      unit: {},
      nameTreeUnit: '',
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
      idUserActive: null,
      idGroupActive: null,
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
      objSetting: {
        type: constants.TYPE_SCREEN.DEPARTMENT,
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
      isInit: true,
      objCountSearch: {
        countSearch: 0
      },
      totalTask: 0,
      listAssociation: []
    }
  },
  computed: {
    ...mapState('layout', ['userInfo', 'params_notification', 'pageCode_notification']),
    selected() {
      if (!this.actives.length) return undefined

      const id = this.actives[0]

      return this.groups.find(group => group.id === id)
    },
    filter() {
      return (item, search, textKey) => this.removeAccents(item[textKey]).includes(this.removeAccents(search.trim()))
    }
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
    pageCode_notification(newValuePageCode) {
      if (newValuePageCode) {
        this.setDefault();
        switch (newValuePageCode) {
          case 'TASK_05_02':
            this.select = {
              value: 'false',
              name: 'task-manager.label.deliver'
            }
            this.formData.assignType = 'false'
            break;
          case 'TASK_05_01':
            this.select = {
              value: 'true',
              name: 'task-manager.label.deliver-to'
            }
            this.formData.assignType = true
        }
        this.searchTask();
      }
    },
    params_notification(newValueParams) {
      if (newValueParams) {
        this.setDefault();
        this.searchTask();
      }
    },
  },
  created() {
    switch (this.pageCode_notification) {
      case 'TASK_05_02':
        this.select = {
          value: 'false',
          name: 'task-manager.label.deliver'
        }
        this.formData.assignType = 'false'
        break;
      case 'TASK_05_01':
        this.select = {
          value: 'true',
          name: 'task-manager.label.deliver-to'
        }
        this.formData.assignType = true
    }

    if (this.$route.params.key) {
      if (this.$route.params.type === 'perform') {
        this.select = {
          value: 'true',
          name: 'task-manager.label.deliver-to'
        }
        this.formData.assignType = true;
      }

      switch (this.$route.params.key) {
        case 2:
          this.formData.isCompletedTask = 'false'
          this.formData.deadlineTaskTimeType = 'EXPIRED'
          break;
        case 5:
          this.formData.isCompletedTask = null;
          this.formData.taskStatuses = [5]
          break;
        case 7:
          this.formData.taskStatuses = [2]
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
    ...mapActions('layout', ['setNotify', 'setParamsNotification', 'setPageCodeNotification']),
    setDefault() {
      this.formData = {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'DEPARTMENTS', // loai cong viec - cong viec toi tao
        taskStatuses: [], // list trang thai
        taskDeadline: null, // viec hoan thanh hoac chua hoac all
        assignedGroupId: '', // nhom
        actionUserId: '', // nguoi tao
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
        parentGroupId: '', // id group tree unit
        assignType: 'false', // loai cong viec
        taskId: ''
      };
      this.objSetting = {
        type: constants.TYPE_SCREEN.DEPARTMENT,
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
    showDialogCreate() {
      this.showDialogCreatetask = true
    },
    changeSortName(value, field) {
      this.listUserActive = []
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
    onchangeSelect(value) {
      this.formData.assignType = value
      this.searchTask()
    },
    async getGroupTree() {
      try {
        const response = await TaskService.getGroupByCurrentUser()
        if (response.success) {
          this.groups = response.data

          this.rootGroupId = this.groups[0].groupId
          this.items = this.prepareDataGroupsToTree(this.groups)
          if (this.isInit) {
            if (this.$route.params.value) {
              const id = this.$route.params.value;
              this.unit = this.groups.find(group => group.groupId === id)
              this.actives = [id]
              this.open = [id]
            } else {
              this.unit = this.groups.find(group => group.groupId === this.rootGroupId)
              this.actives = [this.rootGroupId]
              this.open = [this.rootGroupId]
            }
          } else {
            this.unit = this.groups.find(group => group.groupId === this.rootGroupId)
            this.actives = [this.rootGroupId]
            this.open = [this.rootGroupId]
          }
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      }
    },
    prepareDataGroupsToTree(arrData) {
      const arrCopy = arrData.map((item) => ({ ...item }))
      let tree = null
      const first = arrCopy[0]
      if (first.parentGroupId === null) {
        first.parentGroupId = 0
        var ltt = new LTT(arrCopy, {
          key_id: "groupId",
          key_parent: "parentGroupId",
          key_child: "children",
        })
        tree = ltt.GetTree()
      } else {
        tree = this.arrayToTreeNoRoot(arrCopy, first.parentGroupId)
      }
      return tree
    },
    arrayToTreeNoRoot(arr, parent = 0) {
      return arr
        .filter((item) => item.parentGroupId === parent)
        .map((child) => ({
          ...child,
          children: this.arrayToTreeNoRoot(arr, child.groupId),
        }))
    },
    // Build cay don vi
    buildTree(group) {
      const childs = this.groups.filter(
        g => g.parentGroupId === group.groupId
      )
      const dataChild = []
      childs.map(g => dataChild.push(this.buildTree(g)))
      return {
        id: group.groupId,
        name: group.groupName,
        code: group.groupCode,
        children: dataChild
      }
    },
    closeDialog() {
      this.actives = [this.unit.groupId]
      this.menuTreeUnit = !this.menuTreeUnit
    },
    onSubmit() {
      this.menuTreeUnit = !this.menuTreeUnit
      if (!this.selectedNode.length) return undefined
      const groupId = this.selectedNode[this.selectedNode.length - 1]
      if (groupId === this.unit.groupId) {
        return
      }
      this.unit = this.groups.find(group => group.groupId === groupId)
      this.searchTask()
    },
    clickOnNode(node) {
      if (node.length === 0) {
        this.actives = this.selectedNode
        return
      }
      this.selectedNode = node
      this.formData.parentGroupId = node[0]
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

        this.listUserActive = []
        this.listGroupActive = []
        this.idUserActive = null
        this.idGroupActive = null

        this.formData.actionUserId = null
        this.formData.actionGroupId = null

        this.formData.pageSize = config.app.paging.pageSize

        // get list user assign by current group
        if (this.formData.keywords) {
          this.formData.keywords = this.formData.keywords.trim()
        }

        this.formData.taskId = this.params_notification;

        const responseUser = await TaskService.getListUserAssignCurrentGroup(
          this.formData
        )
        const response = responseUser.data
        this.totalTask = response.totalTasks;
        this.listUserAssign = response.data
        this.renderPaging(response)
        this.setParamsNotification('');
        this.setPageCodeNotification('');
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
      this.formData.parentGroupId = this.unit.groupId
      this.listUserActive = []
      if (!this.formData.parentGroupId) {
        await this.getGroupTree()

        if (this.isInit) {
          if (this.$route.params.value) {
            this.formData.parentGroupId = this.$route.params.value;
          } else {
            this.formData.parentGroupId = this.unit.groupId;
          }
        } else {
          this.formData.parentGroupId = this.unit.groupId;
        }

        this.isInit = false;
      }
      await this.search()
    },
    onChangePage(page) {
      this.formData.page = page
      this.page = page
      this.search()
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
    removeAccents(str) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toUpperCase();
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
<style scoped>

.tree-unit {
  height: calc(100vh - 545px) !important;
  overflow-y: auto !important;
}

.box-empty {
  height: calc(100vh - 385px)!important;
  min-height: 40vh;
  overflow-y: auto;
}

.box-table-task {
  height: calc(100vh - 440px)!important;
  min-height: 40vh;
  overflow-y: auto;
}

</style>
