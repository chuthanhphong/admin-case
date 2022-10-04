<template>
  <tbody>
    <tr>
      <td class="text-start mw-0">
        <div
          class="d-flex align-center cursor-pointer"
        >
          <div
            class="wrap-tooltip d-inline-block mw-80"
          >
            <v-tooltip content-class="tooltip-top" top>
              <template v-slot:activator="{ on }">
                <div
                  class="text-ellipsis my-2 text--body-5 text-name-hover"
                  @click="showDialogDetail(itemParent.taskId)"
                  v-on="on"
                >
                  {{ itemParent.taskName }}
                </div>
              </template>
              <div>
                {{ itemParent.taskName }}
              </div>
            </v-tooltip>
          </div>
          <div
            class="my-2 text--body-5"
            @click="itemParent.numberOfChildTasks ? showChildTask(itemParent.taskId) : ''"
          >
            <div
              v-if="itemParent.numberOfChildTasks"
              class="d-flex justify-center align-center"
            >
              <v-img src="@/assets/icons/task/treeview.svg" />
              <span>({{ itemParent.numberOfChildTasks }})</span>
              <div
                v-if="activeIndex.includes(index)"
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
        </div>
      </td>
      <td v-if="objSetting.assigner" class="text-start">
        <div
          v-if="itemParent.assignerInfo"
          class="group-avatar-customer"
        >
          <v-menu
            max-width="360"
            offset-y
            open-on-hover
            origin="center center"
            top
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-avatar
                :color="lstColors[0]"
                class="cursor-pointer"
                size="32"
                v-bind="attrs"
                v-on="on"
              >
                <span
                  v-if="itemParent.assignerInfo.fullName"
                  class="text-uppercase white--text"
                >{{
                  renderAvatarText(itemParent.assignerInfo.fullName)
                }}</span>
              </v-avatar>
            </template>
            <customer-info
              :color-avatar="lstColors[0]"
              :user-info="itemParent.assignerInfo"
            />
          </v-menu>
        </div>
        <div
          v-else
        >
          <img src="@/assets/icons/task/avatar-customer.svg" />
        </div>
      </td>
      <td v-if="objSetting.state" class="text-start">
        <span v-html="taskState(itemParent.taskStatus)" />
      </td>
      <td
        v-if="objSetting.progress"
        :class="checkProgress(itemParent.listActions)"
        class="text-start d-flex align-center"
      >
        <template>
          <v-progress-linear
            :class="checkEventProgress(itemParent.listActions)"
            :color="colorProgress(itemParent.taskStatus)"
            :value="itemParent.progress.toFixed()"
            class="task-style-progress"
            height="10px"
            rounded
            style="width: 100px"
            @click="showProcess(itemParent.taskId, itemParent.progress)"
          />
          <span class="ml-2">
            {{ itemParent.progress.toFixed() }}%
          </span>
        </template>
      </td>
      <td v-if="objSetting.complete" class="text-start">
        <div
          v-if="itemParent.taskTime.estimateEndDate"
          class="d-flex align-center"
          style="font-weight: 600"
        >
          <div class="mr-2">
            <div v-if="itemParent.taskTime.estimateStartDate">
              <span>{{ formatDate(itemParent.taskTime.estimateStartDate) }}</span>
              <span class="complete__hour">{{ itemParent.taskTime.estimateStartTime }}</span>
            </div>
            <div v-if="itemParent.taskTime.estimateEndDate">
              <span>{{ formatDate(itemParent.taskTime.estimateEndDate) }}</span>
              <span class="complete__hour">{{ itemParent.taskTime.estimateEndTime }}</span>
            </div>
          </div>
          <div
            v-if="itemParent.calculateTime"
            class="d-flex justify-center align-center"
            v-html="genderTime(itemParent.calculateTime)"
          />
        </div>
      </td>
      <td v-if="objSetting.combinator" class="text-start">
        <div
          v-if="itemParent.combinerInfos.length === 0"
        >
          <img src="@/assets/icons/task/avatar-customer.svg" />
        </div>
        <div
          v-else-if="itemParent.combinerInfos.length === 1"
          class="group-avatar-customer"
        >
          <v-menu
            max-width="360"
            offset-y
            open-on-hover
            origin="center center"
            top
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <img
                v-show="itemParent.combinerInfos[0].level === 1"
                class="cursor-pointer"
                src="@/assets/icons/task/PersonAvatar.svg"
                v-bind="attrs"
                v-on="on"
              >
              <v-avatar
                v-show="itemParent.combinerInfos[0].level === 2 && itemParent.combinerInfos[0].fullName"
                :color="lstColors[0]"
                class="cursor-pointer"
                size="32"
                v-bind="attrs"
                v-on="on"
              >
                <span
                  class="text-uppercase white--text"
                >{{
                  renderAvatarText(itemParent.combinerInfos[0].fullName)
                }}</span>
              </v-avatar>
            </template>
            <customer-info
              :color-avatar="lstColors[0]"
              :user-info="itemParent.combinerInfos[0]"
            />
          </v-menu>
        </div>
        <div
          v-else
          class="d-flex align-center group-avatar-customer"
        >
          <v-menu
            max-height="420"
            max-width="360"
            offset-y
            open-on-hover
            origin="center center"
            top
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <list-avatar-customer
                :items="itemParent.combinerInfos"
                :lst-colors="lstColors"
              />
              <v-avatar
                v-show="itemParent.combinerInfos.length > 5"
                :color="lstColors[4]"
                :style="`left: -32px`"
                class="customer"
                size="30"
                v-bind="attrs"
                v-on="on"
              >
                <span
                  class="text-uppercase white--text"
                >{{
                  itemParent.combinerInfos.length - 4
                }}+</span>
              </v-avatar>
            </template>
            <popup-combiner
              :items="itemParent"
              :lst-colors="lstColors"
            />
          </v-menu>
        </div>
      </td>
      <td v-if="objSetting.priority" class="text-start">
        <div
          class="d-flex justify-start align-center"
          v-html="taskPriority(itemParent.priority)"
        />
      </td>
      <td v-if="objSetting.follow" class="text-start">
        <div
          v-if="itemParent.monitorInfos.length === 0"
        >
          <img src="@/assets/icons/task/avatar-customer.svg" />
        </div>
        <div
          v-else-if="itemParent.monitorInfos.length === 1"
          class="group-avatar-customer"
        >
          <v-menu
            max-width="360"
            offset-y
            open-on-hover
            origin="center center"
            top
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-avatar
                :color="lstColors[0]"
                class="cursor-pointer"
                size="32"
                v-bind="attrs"
                v-on="on"
              >
                <span
                  v-if="itemParent.monitorInfos[0].fullName"
                  class="text-uppercase white--text"
                >{{
                  renderAvatarText(itemParent.monitorInfos[0].fullName)
                }}</span>
              </v-avatar>
            </template>
            <customer-info
              :color-avatar="lstColors[0]"
              :user-info="itemParent.monitorInfos[0]"
            />
          </v-menu>
        </div>
        <div
          v-else
          class="d-flex align-center group-avatar-customer"
        >
          <v-menu
            max-height="420"
            max-width="360"
            offset-y
            open-on-hover
            origin="center center"
            top
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <list-avatar-customer
                :items="itemParent.monitorInfos"
                :lst-colors="lstColors"
              />
              <v-avatar
                v-show="itemParent.monitorInfos.length > 5"
                :color="lstColors[4]"
                :style="`left: -32px`"
                class="customer"
                size="30"
                v-bind="attrs"
                v-on="on"
              >
                <span
                  class="text-uppercase white--text"
                >{{
                  itemParent.monitorInfos.length - 4
                }}+</span>
              </v-avatar>
            </template>
            <popup-follow
              :items="itemParent.monitorInfos"
              :lst-colors="lstColors"
            />
          </v-menu>
        </div>
      </td>
      <td v-if="objSetting.source" class="text-start">
        <div v-if="itemParent.taskSource">
          <v-tooltip content-class="tooltip-top" top>
            <template v-slot:activator="{ on }">
              <div
                class="text-ellipsis"
                v-on="on"
              >
                {{ itemParent.taskSource }}
              </div>
            </template>
            <div>
              {{ itemParent.taskSource }}
            </div>
          </v-tooltip>
        </div>
      </td>
      <td class="text-center">
        <v-menu
          content-class="menu-action arrow-up"
          left
          offset-y
          transition="scroll-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dense
              fab
              small
              text
              v-bind="attrs"
              v-on="on"
            >
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list>
            <div
              v-for="(action, id) in itemParent.listActions"
              :key="id"
              class="px-2 item-action"
            >
              <div
                @click="showConfirmRemove(`${action}`, itemParent)"
                v-html="
                  renderTaskAction(`${action}`, itemParent.taskId)
                "
              />
            </div>
          </v-list>
        </v-menu>
      </td>
    </tr>
    <tr
      v-for="(itemChild, idx) in listDataChild"
      :key="idx"
      class="show_child_task"
    >
      <td v-if="activeIndex.includes(index)" class="text-start mw-0">
        <div class="d-flex align-center ml-3">
          <div
            class="wrap-tooltip d-inline-block cursor-pointer mw-80"
          >
            <v-tooltip content-class="tooltip-top" top>
              <template v-slot:activator="{ on }">
                <div
                  class="text-ellipsis my-2 text--body-5 text-name-hover"
                  @click="showDialogDetail(itemChild.taskId)"
                  v-on="on"
                >
                  {{ itemChild.taskName }}
                </div>
              </template>
              <div>
                {{ itemChild.taskName }}
              </div>
            </v-tooltip>
          </div>
        </div>
      </td>
      <td v-if="activeIndex.includes(index) && objSetting.assigner" class="text-start">
        <div
          v-if="itemChild.assignerInfo"
          class="group-avatar-customer"
        >
          <v-menu
            max-width="360"
            offset-y
            open-on-hover
            origin="center center"
            top
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-avatar
                :color="lstColors[0]"
                class="cursor-pointer"
                size="32"
                v-bind="attrs"
                v-on="on"
              >
                <span
                  v-if="itemChild.assignerInfo.fullName"
                  class="text-uppercase white--text"
                >{{
                  renderAvatarText(itemChild.assignerInfo.fullName)
                }}</span>
              </v-avatar>
            </template>
            <customer-info
              :color-avatar="lstColors[0]"
              :user-info="itemChild.assignerInfo"
            />
          </v-menu>
        </div>
        <div
          v-else
        >
          <img src="@/assets/icons/task/avatar-customer.svg" />
        </div>
      </td>
      <td v-if="activeIndex.includes(index) && objSetting.state" class="text-start">
        <span v-html="taskState(itemChild.taskStatus)" />
      </td>
      <td
        v-if="activeIndex.includes(index) && objSetting.progress"
        :class="checkProgress(itemChild.listActions)"
        class="text-start d-flex align-center"
      >
        <template>
          <v-progress-linear
            :class="checkEventProgress(itemChild.listActions)"
            :color="colorProgress(itemChild.taskStatus)"
            :value="itemChild.progress.toFixed()"
            class="task-style-progress"
            height="10px"
            rounded
            style="width: 100px"
            @click="showProcess(itemChild.taskId, itemChild.progress)"
          />
          <span class="ml-2">
            {{ itemChild.progress.toFixed() }}%
          </span>
        </template>
      </td>
      <td v-if="activeIndex.includes(index) && objSetting.complete" class="text-start">
        <div
          v-if="itemChild.taskTime.estimateEndDate"
          class="d-flex align-center"
          style="font-weight: 600"
        >
          <div class="mr-2">
            <div v-if="itemChild.taskTime.estimateStartDate">
              <span>{{ formatDate(itemChild.taskTime.estimateStartDate) }}</span>
              <span class="complete__hour">{{ itemChild.taskTime.estimateStartTime }}</span>
            </div>
            <div v-if="itemChild.taskTime.estimateEndDate">
              <span>{{ formatDate(itemChild.taskTime.estimateEndDate) }}</span>
              <span class="complete__hour">{{ itemChild.taskTime.estimateEndTime }}</span>
            </div>
          </div>
          <div
            v-if="itemChild.calculateTime"
            class="d-flex justify-center align-center"
            v-html="genderTime(itemChild.calculateTime)"
          />
        </div>
      </td>
      <td v-if="activeIndex.includes(index) && objSetting.combinator" class="text-start">
        <div
          v-if="itemChild.combinerInfos.length === 0"
        >
          <img src="@/assets/icons/task/avatar-customer.svg" />
        </div>
        <div
          v-else-if="itemChild.combinerInfos.length === 1"
          class="group-avatar-customer"
        >
          <v-menu
            max-width="360"
            offset-y
            open-on-hover
            origin="center center"
            top
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <img
                v-show="itemChild.combinerInfos[0].level === 1"
                class="cursor-pointer"
                src="@/assets/icons/task/PersonAvatar.svg"
                v-bind="attrs"
                v-on="on"
              >
              <v-avatar
                v-show="itemChild.combinerInfos[0].level === 2 && itemChild.combinerInfos[0].fullName"
                :color="lstColors[0]"
                class="cursor-pointer"
                size="32"
                v-bind="attrs"
                v-on="on"
              >
                <span
                  class="text-uppercase white--text"
                >{{
                  renderAvatarText(itemChild.combinerInfos[0].fullName)
                }}</span>
              </v-avatar>
            </template>
            <customer-info
              :color-avatar="lstColors[0]"
              :user-info="itemChild.combinerInfos[0]"
            />
          </v-menu>
        </div>
        <div
          v-else
          class="d-flex align-center group-avatar-customer"
        >
          <v-menu
            max-height="420"
            max-width="360"
            offset-y
            open-on-hover
            origin="center center"
            top
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <list-avatar-customer
                :items="itemChild.combinerInfos"
                :lst-colors="lstColors"
              />
              <v-avatar
                v-show="itemChild.combinerInfos.length > 5"
                :color="lstColors[4]"
                :style="`left: -32px`"
                class="customer"
                size="30"
                v-bind="attrs"
                v-on="on"
              >
                <span
                  class="text-uppercase white--text"
                >{{
                  itemChild.combinerInfos.length - 4
                }}+</span>
              </v-avatar>
            </template>
            <popup-combiner
              :items="itemChild"
              :lst-colors="lstColors"
            />
          </v-menu>
        </div>
      </td>
      <td v-if="activeIndex.includes(index) && objSetting.priority" class="text-start">
        <div
          class="d-flex justify-start align-center"
          v-html="taskPriority(itemParent.priority)"
        />
      </td>
      <td v-if="activeIndex.includes(index) && objSetting.follow" class="text-start">
        <div
          v-if="itemChild.monitorInfos.length === 0"
        >
          <img src="@/assets/icons/task/avatar-customer.svg" />
        </div>
        <div
          v-else-if="itemChild.monitorInfos.length === 1"
          class="group-avatar-customer"
        >
          <v-menu
            max-width="360"
            offset-y
            open-on-hover
            origin="center center"
            top
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-avatar
                :color="lstColors[0]"
                class="cursor-pointer"
                size="32"
                v-bind="attrs"
                v-on="on"
              >
                <span
                  v-if="itemChild.monitorInfos[0].fullName"
                  class="text-uppercase white--text"
                >{{
                  renderAvatarText(itemChild.monitorInfos[0].fullName)
                }}</span>
              </v-avatar>
            </template>
            <customer-info
              :color-avatar="lstColors[0]"
              :user-info="itemChild.monitorInfos[0]"
            />
          </v-menu>
        </div>
        <div
          v-else
          class="d-flex align-center group-avatar-customer"
        >
          <v-menu
            max-height="420"
            max-width="360"
            offset-y
            open-on-hover
            origin="center center"
            top
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <list-avatar-customer
                :items="itemChild.monitorInfos"
                :lst-colors="lstColors"
              />
              <v-avatar
                v-show="itemChild.monitorInfos.length > 5"
                :color="lstColors[4]"
                :style="`left: -32px`"
                class="customer"
                size="30"
                v-bind="attrs"
                v-on="on"
              >
                <span
                  class="text-uppercase white--text"
                >{{
                  itemChild.monitorInfos.length - 4
                }}+</span>
              </v-avatar>
            </template>
            <popup-follow
              :items="itemChild.monitorInfos"
              :lst-colors="lstColors"
            />
          </v-menu>
        </div>
      </td>
      <td v-if="activeIndex.includes(index) && objSetting.source" class="text-start">
        <div v-if="itemChild.taskSource">
          <v-tooltip content-class="tooltip-top" top>
            <template v-slot:activator="{ on }">
              <div
                class="text-ellipsis"
                v-on="on"
              >
                {{ itemChild.taskSource }}
              </div>
            </template>
            <div>
              {{ itemChild.taskSource }}
            </div>
          </v-tooltip>
        </div>
      </td>
      <td v-if="activeIndex.includes(index)" class="text-center">
        <v-menu
          content-class="menu-action arrow-up"
          left
          offset-y
          transition="scroll-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dense
              fab
              small
              text
              v-bind="attrs"
              v-on="on"
            >
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list>
            <div
              v-for="(action, id) in itemChild.listActions"
              :key="id"
              class="px-2 item-action"
            >
              <div
                @click="showConfirmRemove(`${action}`, itemChild)"
                v-html="
                  renderTaskAction(`${action}`, itemChild.taskId)
                "
              />
            </div>
          </v-list>
        </v-menu>
      </td>
    </tr>
  </tbody>
</template>
<script>

import constants from '@/modules/etask/constants'
import PopupCombiner from '@/modules/etask/views/components/PopupCombiner'
import PopupFollow from '@/modules/etask/views/components/PopupFollow'
import ListAvatarCustomer from '@/modules/etask/views/components/ListAvatarCustomer'
import CustomerInfo from '@/modules/etask/views/components/CustomerInfo'

import statusTask from '@/modules/etask/mixins/statusTask'
import priorityTask from '@/modules/etask/mixins/priorityTask'
import actionsTask from '@/modules/etask/mixins/actionsTask'
import calculateDate from '@/modules/etask/mixins/calculateDate'

import moment from 'moment'

import config from "@/config";

import { mapActions } from 'vuex'

import { TaskService } from '@/modules/etask/services/taskService'

export default {
  components: {
    PopupCombiner,
    PopupFollow,
    ListAvatarCustomer,
    CustomerInfo
  },
  mixins: [statusTask, priorityTask, actionsTask, calculateDate],
  props: {
    activeIndex: {
      type: Array,
      default: undefined
    },
    index: {
      type: Number,
      default: undefined
    },
    itemParent: {
      type: Object,
      default: undefined
    },
    showDialogTaskDetail: {
      type: Boolean,
      default: false
    },
    showDialogEdit: {
      type: Boolean,
      default: false
    },
    objLoading: {
      type: Object,
      default: undefined
    },
    isReload: {
      type: Boolean,
      default: undefined
    },
    objSetting: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      lstColors: ['#FFAF2E', '#0FAFE4', '#4A50E2', '#F028A0', '#FF4A55'],
      listDataChild: [],
      formData: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        parentTaskId: '' // id cong viec cha
      },
      idTaskParent: '',
      listAction: [
        constants.TASK_MANAGER_ACTIONS.REMOVE,
        constants.TASK_MANAGER_ACTIONS.CANCEL,
        constants.TASK_MANAGER_ACTIONS.PAUSE,
        constants.TASK_MANAGER_ACTIONS.REVIEW,
        constants.TASK_MANAGER_ACTIONS.DENY_REVIEW,
        constants.TASK_MANAGER_ACTIONS.TAKE_OVER,
        constants.TASK_MANAGER_ACTIONS.DENY_TAKE_OVER,
        constants.TASK_MANAGER_ACTIONS.APPROVE,
        constants.TASK_MANAGER_ACTIONS.DENY_APPROVE,
        constants.TASK_MANAGER_ACTIONS.UPDATE_PROGRESS,
        constants.TASK_MANAGER_ACTIONS.RESENT_REVIEW,
        constants.TASK_MANAGER_ACTIONS.RESENT_APPROVE,
        constants.TASK_MANAGER_ACTIONS.RESENT_TAKE_OVER
      ],
      task: null,
      taskId: null
    }
  },
  watch: {
    idTaskParent() {
      if (this.idTaskParent) {
        this.searchTaskChild()
      }
    },
    taskId() {
      this.$emit('taskId', this.taskId)
    },
    activeIndex() {
      if (this.isReload) {
        this.taskId = null
        this.idTaskParent = null
      }
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    showDialogDetail(id) {
      this.showDialogTaskDetail = true
      this.$emit('show-dialog-detail', this.showDialogTaskDetail)
      this.$emit('taskId', this.taskId ? this.taskId : id)
    },
    showDialogEditFromMixin() {
      this.showDialogEdit = true
      this.$emit('show-dialog-edit', this.showDialogEdit)
      this.$emit('taskId', this.taskId)
    },
    showConfirmRemove(action, item) {
      if (this.listAction.includes(action)) {
        this.$emit('show-dialog-action', item, action)
      } else {
        this.clickAction(action, item)
      }
    },
    showProcess(id, value) {
      this.$emit('show-process', id, value)
    },
    showChildTask(id) {
      this.idTaskParent = id
      this.$emit('show-child-task', id)
    },
    async searchTaskChild() {
      await this.search()
    },
    async search() {
      try {
        this.formData.parentTaskId = this.idTaskParent
        this.objLoading.value = true
        const response = await TaskService.searchCreatTask(
          this.formData
        )
        const dataResponse = response.data
        this.listDataChild = dataResponse.data
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
    renderGroupName(customer) {
      return customer
    },
    formatDate(date) {
      if (date != null) {
        const dateData = moment(date, 'DD/MM/YYYY').format('DD/MM/YY')
        return dateData
      }
    }
  }
}
</script>
<style>

.show_child_task td{
  -webkit-animation: fadein 1s ease-in;
}

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.complete__hour {
  color: #A7A7AB;
  font-size: 12px;
  margin: 0 3px;
}
</style>
