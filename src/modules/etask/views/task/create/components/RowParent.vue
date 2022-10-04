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
      <td v-if="objSetting.perform" class="text-start">
        <div
          v-if="itemParent.performer"
          class="group-avatar-customer"
        >
          <v-menu
            top
            offset-y
            max-width="360"
            open-on-hover
            origin="center center"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-avatar
                :color="lstColors[0]"
                :class="itemParent.performer.level === 1 ? 'style-avatar-group': ''"
                class="cursor-pointer"
                size="32"
                v-bind="attrs"
                v-on="on"
              >
                <img
                  v-show="itemParent.performer.level === 1"
                  class="cursor-pointer"
                  src="@/assets/icons/task/PersonAvatar.svg"
                  v-bind="attrs"
                  v-on="on"
                >
                <span
                  v-show="itemParent.performer.level === 2 && itemParent.performer.fullName"
                  class="text-uppercase white--text"
                >{{
                  renderAvatarText(itemParent.performer.fullName)
                }}</span>
              </v-avatar>
            </template>
            <customer-info
              :color-avatar="lstColors[0]"
              :user-info="itemParent.performer"
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
            :value="itemParent.progress.toFixed()"
            :color="colorProgress(itemParent.taskStatus)"
            class="task-style-progress"
            height="10px"
            rounded
            style="width: 100px;"
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
      <td v-if="objSetting.assigner" class="text-start">
        <div
          v-if="itemParent.assignerInfo"
          class="group-avatar-customer"
        >
          <v-menu
            top
            offset-y
            max-width="360"
            open-on-hover
            origin="center center"
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
      <td v-if="objSetting.createDate" class="text-start">{{ formatDate(itemParent.taskTime.createdDate) }}</td>
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
              <v-icon> mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <div
              v-for="(action, id) in itemParent.listActions"
              :key="id"
              class="px-2 item-action"
            >
              <div
                @click="showConfirm(`${action}`, itemParent)"
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
      <td v-if="activeIndex.includes(index) && objSetting.perform" class="text-start">
        <div
          v-if="itemChild.performer"
          class="group-avatar-customer"
        >
          <v-menu
            top
            offset-y
            max-width="360"
            open-on-hover
            origin="center center"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-avatar
                :color="lstColors[0]"
                :class="itemChild.performer.level === 1 ? 'style-avatar-group': ''"
                class="cursor-pointer"
                size="32"
                v-bind="attrs"
                v-on="on"
              >
                <img
                  v-show="itemChild.performer.level === 1"
                  class="cursor-pointer"
                  src="@/assets/icons/task/PersonAvatar.svg"
                  v-bind="attrs"
                  v-on="on"
                >
                <span
                  v-show="itemChild.performer.level === 2 && itemChild.performer.fullName"
                  class="text-uppercase white--text"
                >{{
                  renderAvatarText(itemChild.performer.fullName)
                }}</span>
              </v-avatar>
            </template>
            <customer-info
              :color-avatar="lstColors[0]"
              :user-info="itemChild.performer"
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
            :value="itemChild.progress.toFixed()"
            :color="colorProgress(itemChild.taskStatus)"
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
      <td v-if="activeIndex.includes(index) && objSetting.assigner" class="text-start">
        <div
          v-if="itemChild.assignerInfo"
          class="group-avatar-customer"
        >
          <v-menu
            top
            offset-y
            max-width="360"
            open-on-hover
            origin="center center"
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
      <td v-if="activeIndex.includes(index) && objSetting.createDate" class="text-start">{{ formatDate(itemChild.taskTime.createdDate) }}</td>
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
              <v-icon> mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <div
              v-for="(action, id) in itemChild.listActions"
              :key="id"
              class="px-2 item-action"
            >
              <div
                @click="showConfirm(`${action}`, itemChild)"
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

import CustomerInfo from '@/modules/etask/views/components/CustomerInfo'

import moment from 'moment'

import config from '@/config'

import { TaskService } from '@/modules/etask/services/taskService'

import { mapActions } from 'vuex'

import statusTask from '@/modules/etask/mixins/statusTask'
import priorityTask from '@/modules/etask/mixins/priorityTask'
import actionsTask from '@/modules/etask/mixins/actionsTask'
import calculateDate from '@/modules/etask/mixins/calculateDate'

export default {
  components: {
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
      checkbox: true,
      formData: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        parentTaskId: '' // id cong viec cha
      },
      idTaskParent: '',
      listActionConfirm: [
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
      ]
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
      this.$emit('show-dialog-edit', true)
      this.$emit('taskId', this.taskId)
    },

    showConfirm(action, item) {
      if (this.listActionConfirm.includes(action)) {
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

.show_child_task td {
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

.text-red {
  color: #FF4A55;
}

</style>
