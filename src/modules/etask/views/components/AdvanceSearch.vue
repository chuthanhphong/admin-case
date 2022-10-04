<template>
  <div id="dialog-search__i-create">
    <div class="dialog__header">
      <h5>
        {{ $t('task-manager.dialogs.title-search-task') }}
      </h5>
      <v-icon @click="closeDialog">mdi-close</v-icon>
    </div>
    <div class="dialog__body">
      <div class="item">
        <div class="mb-2">
          <label class="text--body-5 text-capitalize">{{ $t('task-manager.dialogs.name') }}</label>
        </div>
        <validation-provider
          name="contractName"
          rules="required|max:200"
        >
          <v-text-field
            v-model="formData.taskName"
            outlined
            dense
            clearable
            maxlength="200"
            counter="200"
            class="text--body-5"
            name="txtSearch"
            autofocus
            :placeholder="$t('task-manager.dialogs.label.name')"
            @change="trimSpace"
          >
            <vue-feather
              slot="prepend-inner"
              class="grey--text"
              type="search"
              size="20"
            />
          </v-text-field>
        </validation-provider>
        <hr>
      </div>
      <div class="item">
        <div class="mb-2">
          <label class="text--body-5 text-capitalize">{{ $t('task-manager.dialogs.state.name') }}</label>
        </div>
        <div class="d-flex flex-wrap" style="gap: 4px">
          <span
            v-for="(item, index) in listTaskState"
            :key="index"
            :class="[item.class, listIndexState.includes(item.value) ? 'active' : '']"
            :value="item.value"
            @click="chooseState(item.value)"
          >
            {{ $t(item.label) }}
          </span>
        </div>
        <hr>
      </div>
      <div class="item">
        <div class="mb-2">
          <label class="text--body-5 text-capitalize">{{ $t('task-manager.label.style-task') }}</label>
        </div>
        <v-select
          v-model="formData.taskType"
          :items="listTaskType"
          :item-text="item => $t(item.name)"
          :item-value="item => item.id"
          outlined
          dense
          class="text--body-5"
          :placeholder="$t('task-manager.label.choose-style-task')"
        >
          <template v-slot:append>
            <v-icon>mdi-chevron-down</v-icon>
          </template>
        </v-select>
      </div>
      <div class="item">
        <div class="mb-5">
          <label class="text--body-5 text-capitalize">{{ $t('task-manager.dialogs.completion-deadline') }}</label>
        </div>
        <v-row class="mb-3">
          <v-col
            v-for="(item, index) in listOptionDate"
            :key="index"
            cols="3"
            @click="chooseDate(item.value)"
          >
            <div
              :class="[item.class, item.value === indexDate ? 'active' : '', 'item__choose-date']"
              :style="{ color: item.color }"
            >
              <span>{{ $t(item.label) }}</span>
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="item">
        <div class="d-flex align-start flex-column flex-sm-row justify-end" style="gap: 20px">
          <div class="d-flex align-start form-group flex-column">
            <label class="text--body-5 text-uppercase">
              {{ $t('task-manager.dialogs.start-date') }}</label>
            <v-menu
              v-model="menuDateFrom"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  ref="dateFromValue"
                  v-model="dateFromValue"
                  outlined
                  placeholder="DD/MM/YYYY"
                  dense
                  class="text--body-6"
                  v-bind="attrs"
                  :error-messages="$t(errorFromDate)"
                  v-on="on"
                  @click="menuDateFrom = !menuDateFrom"
                >
                  <template v-slot:append>
                    <img
                      src="@/assets/icons/task/createTask/calendar.png"
                      alt=""
                      class="hover--pointer"
                      @click="menuDateFrom = !menuDateFrom"
                    >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="dateFromPicker"
                format="DD/MM/YYYY"
                :locale="localDate"
                no-title
                show-adjacent-months
                @input="menuDateFrom = false"
              />
            </v-menu>
          </div>
          <div class="d-flex align-start form-group flex-column">
            <label class="text--body-5 text-uppercase">
              {{ $t('task-manager.dialogs.end-date') }}</label>
            <v-menu
              v-model="menuDateTo"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  ref="dateToValue"
                  v-model="dateToValue"
                  outlined
                  placeholder="DD/MM/YYYY"
                  dense
                  class="text--body-6"
                  v-bind="attrs"
                  :error-messages="$t(errorToDate)"
                  v-on="on"
                  @click="menuDateTo = !menuDateTo"
                >
                  <template v-slot:append>
                    <img
                      src="@/assets/icons/task/createTask/calendar.png"
                      alt=""
                      class="hover--pointer"
                      @click="menuDateTo = !menuDateTo"
                    >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="dateToPicker"
                format="DD/MM/YYYY"
                :locale="localDate"
                no-title
                show-adjacent-months
                @input="menuDateTo = false"
              />
            </v-menu>
          </div>
        </div>
        <hr>
      </div>
      <div class="item">
        <div class="mb-5">
          <label class="text--body-5 text-capitalize">{{ $t('task-manager.dialogs.priority.name') }}</label>
        </div>
        <v-row class="mb-4">
          <v-col
            v-for="(item, index) in listPriority"
            :key="index"
            cols="4"
            @click="choosePriority(item.value)"
          >
            <span
              :class="[item.class, listIndexPriority.includes(item.value) ? 'active' : '']"
              :value="item.value"
            >
              <v-icon
                :color="item.colorIcon"
              >
                mdi-flash
              </v-icon>
              {{ $t(item.label) }}
            </span>
          </v-col>
        </v-row>
        <hr>
      </div>
      <div class="item">
        <div class="mb-2">
          <label class="text--body-5 text-capitalize">{{ $t('task-manager.dialogs.performer') }}</label>
        </div>
        <v-autocomplete
          v-model="selectedPerformers"
          :search-input.sync="searchPerformer"
          class="flow-scope col-12 text--body-5"
          outlined
          :no-data-text="$t('users.itemGroupName')"
          hide-selected
          hide-details
          maxlength="50"
          floating
          solo
          dense
          elevation="0"
          :filter="filterItems"
          :menu-props="{
            bottom: true,
            offsetY: true
          }"
          :placeholder="$t('task-manager.label.selectPerformers')"
          :label="$t('task-manager.label.selectPerformers')"
          :items="listPerformer"
          :item-text="item=> item.objectType === 'USER' ? `${item.username} - ${item.userFullName}` : `${item.groupName} - ${item.groupPathName}`"
          :item-value="item => item"
          chips
          deletable-chips
          multiple
          attach
          @change="searchPerformer = ''"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
          <template v-slot:item="data">
            <div class="select-item flex-column d-flex">
              <div class="title-item">
                <span>{{ data.item.objectType === 'USER' ? data.item.userFullName : data.item.groupPathName }}</span>
                <span class="ml-1 desc-item">( {{ data.item.objectType === 'USER' ? data.item.username : data.item.groupName }} )</span>
              </div>
              <div class="desc-item">{{ data.item.objectType === 'USER' ? data.item.positionName : '' }}</div>
            </div>
          </template>
        </v-autocomplete>
        <hr>
      </div>
      <div class="item">
        <div class="mb-2">
          <label class="text--body-5 text-capitalize">{{ $t('task-manager.dialogs.follower') }}</label>
        </div>
        <v-autocomplete
          v-model="formData.followerIds"
          :search-input.sync="searchFollower"
          class="flow-scope col-12 text--body-5"
          outlined
          :no-data-text="$t('users.itemGroupName')"
          hide-selected
          maxlength="50"
          hide-details
          floating
          solo
          dense
          elevation="0"
          :filter="filterItems"
          :menu-props="{
            bottom: true,
            offsetY: true
          }"
          :placeholder="$t('task-manager.label.selectFollower')"
          :label="$t('task-manager.label.selectFollower')"
          :items="listFollower"
          :item-text="item => `${item.username} - ${item.userFullName}`"
          :item-value="item => item.userId"
          chips
          deletable-chips
          multiple
          attach
          @change="searchFollower = ''"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
          <template v-slot:item="data">
            <div class="select-item flex-column d-flex">
              <div class="title-item">
                <span>{{ data.item.userFullName }}</span>
                <span class="ml-1 desc-item">( {{ data.item.username }} )</span>
              </div>
              <div class="desc-item">{{ data.item.positionName }}</div>
            </div>
          </template>
        </v-autocomplete>
        <hr>
      </div>
      <div class="item">
        <div class="mb-2">
          <label class="text--body-5 text-capitalize">{{ $t('task-manager.dialogs.coordinator') }}</label>
        </div>
        <v-autocomplete
          v-model="selectedCombiners"
          :search-input.sync="searchCombinator"
          class="flow-scope col-12 text--body-5"
          outlined
          :no-data-text="$t('users.itemGroupName')"
          hide-selected
          maxlength="50"
          hide-details
          floating
          solo
          dense
          elevation="0"
          :filter="filterItems"
          :menu-props="{
            bottom: true,
            offsetY: true
          }"
          :placeholder="$t('task-manager.label.selectCombinator')"
          :label="$t('task-manager.label.selectCombinator')"
          :items="listCombinator"
          :item-text="item => item.objectType === 'USER' ? `${item.username} - ${item.userFullName}` : `${item.groupName} - ${item.groupPathName}`"
          :item-value="item => item"
          chips
          deletable-chips
          multiple
          attach
          @change="searchCombinator = ''"
        >
          <vue-feather slot="append" class="grey--text" type="search" />
          <template v-slot:item="data">
            <div class="select-item flex-column d-flex">
              <div class="title-item">
                <span>{{ data.item.objectType === 'USER' ? data.item.userFullName : data.item.groupPathName }}</span>
                <span class="ml-1 desc-item">( {{ data.item.objectType === 'USER' ? data.item.username : data.item.groupName }} )</span>
              </div>
              <div class="desc-item">{{ data.item.objectType === 'USER' ? data.item.positionName : '' }}</div>
            </div>
          </template>
        </v-autocomplete>
        <hr>
      </div>
    </div>
    <div class="d-flex justify-center py-3">
      <v-btn
        rounded
        outlined
        color="primary"
        class="w-150 py-5 mr-4 text--button box-shadow"
        elevation="0"
        @click="cancelSearch()"
      >
        {{ $t('task-manager.button.delete-filter') }}
      </v-btn>
      <v-btn
        rounded
        color="primary"
        class="w-150 py-5 text--button box-shadow"
        elevation="0"
        @click="onSubmit"
      >
        {{ $t('task-manager.button.apply') }}
      </v-btn>
    </div>
  </div>
</template>
<script>

import moment from 'moment'
import { TaskService } from '@/modules/etask/services/taskService'
import { mapActions, mapState } from 'vuex'
import constants from '@/modules/etask/constants'
import filterItems from '@/mixins/filterItems.js'

export default {
  mixins: [filterItems],
  props: {
    formData: {
      type: Object,
      default: undefined
    },
    searchTask: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      // state
      listTaskState: [
        {
          label: 'task-manager.status.review-sending',
          value: 8,
          class: 'state-task state-review-sending'
        },
        {
          label: 'task-manager.status.review-receiving',
          value: 1,
          class: 'state-task state-review-receiving'
        },
        {
          label: 'task-manager.status.pending',
          value: 9,
          class: 'state-task state-pending'
        },
        {
          label: 'task-manager.status.inprogress',
          value: 3,
          class: 'state-task state-inprogress'
        },
        {
          label: 'task-manager.status.received-unprocess',
          value: 2,
          class: 'state-task state-received-unprocess'
        },
        {
          label: 'task-manager.status.canceled',
          value: 7,
          class: 'state-task state-canceled'
        },
        {
          label: 'task-manager.status.new',
          value: 0,
          class: 'state-task state-new'
        },
        {
          label: 'task-manager.status.finish',
          value: 5,
          class: 'state-task state-finish'
        },
        {
          label: 'task-manager.status.closed',
          value: 6,
          class: 'state-task state-closed'
        },
        {
          label: 'task-manager.status.reject-receiving',
          value: 4,
          class: 'state-task state-reject-receiving'
        }
      ],
      listIndexState: [],

      // han hoan thanh
      listOptionDate: [
        {
          label: 'task-manager.status.complete.outOfDate',
          value: 'EXPIRED',
          color: '#FF4A55'
        },
        {
          label: 'task-manager.status.complete.value-today',
          value: 'TODAY',
          color: '#22242C'
        },
        {
          label: 'task-manager.status.complete.value-week',
          value: 'THIS_WEEK',
          color: '#22242C'
        },
        {
          label: 'task-manager.status.complete.value-month',
          value: 'THIS_MONTH',
          color: '#22242C'
        }
      ],
      indexDate: '',

      // do uu tien
      listPriority: [
        {
          label: 'task-manager.dialogs.priority.high',
          value: '1',
          class: 'priority-task priority-high',
          colorIcon: '#FF4A55'
        },
        {
          label: 'task-manager.dialogs.priority.normal',
          value: '2',
          class: 'priority-task priority-normal',
          colorIcon: '#FD8538'
        },
        {
          label: 'task-manager.dialogs.priority.draft',
          value: '3',
          class: 'priority-task priority-draft',
          colorIcon: '#D3D3D5'
        }
      ],
      listIndexPriority: [],

      // menu
      menuDateFrom: null,
      menuDateTo: null,

      // picker
      dateFromPicker: null,
      dateToPicker: null,

      // Input date value
      dateFromValue: null,
      dateToValue: null,

      // error date
      errorFromDate: null,
      errorToDate: null,

      // list nguoi thuc hien
      listPerformer: [],

      // list nguoi theo doi
      listFollower: [],

      // list nguoi phoi hop
      listCombinator: [],

      // list loai cong viec
      listTaskType: [],

      searchPerformer: '',
      searchFollower: '',
      searchCombinator: '',
      isChooseDate: false,
      selectedPerformers: [],
      selectedCombiners: [],
      countSearch: 0
    }
  },
  computed: {
    ...mapState('layout', ['params_notification']),
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    }
  },
  watch: {
    dateFromPicker(date) {
      this.isChooseDate = true
      if (date) this.dateFromValue = this.formatDate(date)
    },
    dateToPicker(date) {
      this.isChooseDate = true
      if (date) this.dateToValue = this.formatDate(date)
    },
    dateFromValue() {
      this.errorFromDate = ''
      this.errorToDate = ''
      if (this.dateFromValue && this.dateFromValue.length > 0) {
        this.isChooseDate = true
        this.formData.estimateEndFromDate = this.dateFromValue
        const isValid = moment(
          this.dateFromValue,
          'DD/MM/YYYY',
          true
        ).isValid()
        this.errorFromDate = isValid
          ? ''
          : this.$t('task-manager.dateInvalid', { name: this.$t('task-manager.label.dateFrom') })
        if (isValid) {
          this.dateFromPicker = moment(
            this.dateFromValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
          const selectDate = moment(this.dateToValue, 'DD/MM/YYYY')
          const timeExprired = moment(this.dateFromValue, 'DD/MM/YYYY')
          const diff = selectDate.diff(timeExprired, 'days')
          this.formData.estimateEndFromDate = this.dateFromValue && this.dateFromValue.replaceAll('/', '')
          this.formData.deadlineTaskTimeType = null
          this.indexDate = ''
          if (diff < 0) {
            this.errorFromDate = 'task-manager.compareDate'
            this.errorToDate = ''
          } else if (diff > 365) {
            this.errorToDate = ''
            this.errorToDate = 'task-manager.dateExpire'
          } else {
            this.errorFromDate = ''
            this.errorToDate = ''
          }
        } else {
          this.dateFromPicker = null
          this.formData.estimateEndFromDate = null
        }
      } else {
        this.dateFromPicker = null
        this.formData.estimateEndFromDate = null
      }
    },
    dateToValue() {
      this.errorToDate = ''
      this.errorFromDate = ''
      if (this.dateToValue && this.dateToValue.length > 0) {
        this.isChooseDate = true
        this.formData.estimateEndToDate = this.dateToValue
        const isValid = moment(
          this.dateToValue,
          'DD/MM/YYYY',
          true
        ).isValid()
        this.errorToDate = isValid
          ? ''
          : this.$t('task-manager.dateInvalid', { name: this.$t('task-manager.label.dateTo') })
        if (isValid) {
          this.dateToPicker = moment(
            this.dateToValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
          const selectDate = moment(this.dateToValue, 'DD/MM/YYYY')
          const timeExprired = moment(this.dateFromValue, 'DD/MM/YYYY')
          const diff = selectDate.diff(timeExprired, 'days')
          this.formData.estimateEndToDate = this.dateToValue && this.dateToValue.replaceAll('/', '')
          this.formData.deadlineTaskTimeType = null
          this.indexDate = ''
          if (diff < 0) {
            this.errorToDate = 'task-manager.compareDate'
            this.errorFromDate = ''
          } else if (diff > 365) {
            this.errorToDate = 'task-manager.dateExpire'
            this.errorFromDate = ''
          } else {
            this.errorToDate = ''
            this.errorFromDate = ''
          }
        } else {
          this.dateToPicker = null
          this.formData.estimateEndToDate = null
        }
      } else {
        this.dateToPicker = null
        this.formData.estimateEndToDate = null
      }
    },
    "formData.status"() {
      if (!this.formData.status.length) {
        this.listIndexState = []
      }
    },
    "formData.deadlineTaskTimeType"() {
      if (!this.formData.deadlineTaskTimeType) {
        this.indexDate = ''
      }
    },
    "formData.estimateEndFromDate"() {
      if (!this.formData.estimateEndFromDate) {
        this.dateFromPicker = null
        this.dateFromValue = null
      }
    },
    "formData.estimateEndToDate"() {
      if (!this.formData.estimateEndToDate) {
        this.dateToPicker = null
        this.dateToValue = null
      }
    },
    "formData.taskPriorities"() {
      if (!this.formData.taskPriorities.length) {
        this.listIndexPriority = []
      }
    },
    "formData.performerUserIds"() {
      if (!this.formData.performerUserIds.length && !this.formData.performerGroupIds.length) {
        this.selectedPerformers = []
      }
    },
    "formData.performerGroupIds"() {
      if (!this.formData.performerUserIds.length && !this.formData.performerGroupIds.length) {
        this.selectedPerformers = []
      }
    },
    "formData.combinerUserIds"() {
      if (!this.formData.combinerUserIds.length && !this.formData.combinerGroupIds.length) {
        this.selectedPerformers = []
      }
    },
    "formData.combinerGroupIds"() {
      if (!this.formData.combinerUserIds.length && !this.formData.combinerGroupIds.length) {
        this.selectedPerformers = []
      }
    },
    params_notification(newValue) {
      if (newValue) {
        this.getListPerformer()
        this.getListFollower()
        this.getListCombinator()
        this.getListTaskType()
      }
    }
  },
  created() {
    if (this.$route.params.key) {
      switch (this.$route.params.key) {
        case 2:
          this.indexDate = 'EXPIRED'
          break;
        case 3:
          this.listIndexState = [8, 1, 5]
          break;
        case 5:
          this.listIndexState = [5]
          break;
        case 7:
          this.listIndexState = [2]
          break;
      }
    }
  },
  mounted() {
    this.getListPerformer()
    this.getListFollower()
    this.getListCombinator()
    this.getListTaskType()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    trimSpace() {
      if (this.formData.taskName) {
        this.formData.taskName = this.formData.taskName.trim()
      }
    },
    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },
    cancelSearch() {
      if (this.formData.taskName ||
          this.formData.taskStatuses.length !== 0 ||
          this.formData.taskType ||
          this.formData.deadlineTaskTimeType ||
          this.formData.estimateEndFromDate ||
          this.formData.estimateEndToDate ||
          this.formData.taskPriorities.length !== 0 ||
          this.selectedPerformers.length !== 0 ||
          this.formData.followerIds.length !== 0 ||
          this.selectedCombiners.length !== 0
      ) {
        // reset from data params
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

        this.countSearch = 0
        this.$emit('count-search', this.countSearch)
        this.searchTask()
      } else {
        this.$emit('close-dialog')
      }
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
    chooseState(value) {
      if (this.listIndexState.includes(value)) {
        const new_arr = this.listIndexState.filter(item => item !== value)
        this.listIndexState = new_arr
      } else {
        this.listIndexState.push(value)
      }
      this.formData.taskStatuses = this.listIndexState
    },
    choosePriority(value) {
      if (this.listIndexPriority.includes(value)) {
        const new_arr = this.listIndexPriority.filter(item => item !== value)
        this.listIndexPriority = new_arr
      } else {
        this.listIndexPriority.push(value)
      }
      this.formData.taskPriorities = this.listIndexPriority
    },
    chooseDate(value) {
      if (this.indexDate === value) {
        this.indexDate = ''
      } else {
        this.isChooseDate = false
        this.indexDate = value
        this.formData.estimateEndFromDate = ''
        this.formData.estimateEndToDate = ''
        this.dateFromValue = ''
        this.dateToValue = ''
        this.formData.deadlineTaskTimeType = value
      }
    },
    onSubmit() {
      if (this.selectedPerformers) {
        this.selectedPerformers.map(performer => {
          if (performer.objectType === constants.OBJECT_TYPE.USER && performer.userId) {
            this.formData.performerUserIds.push(performer.userId)
          }
          if (performer.objectType === constants.OBJECT_TYPE.GROUP && performer.groupId) {
            this.formData.performerGroupIds.push(performer.groupId)
          }
        })
      }

      if (this.selectedCombiners) {
        this.selectedCombiners.map(combiner => {
          if (combiner.objectType === constants.OBJECT_TYPE.USER && combiner.userId) {
            this.formData.combinerUserIds.push(combiner.userId)
          }
          if (combiner.objectType === constants.OBJECT_TYPE.GROUP && combiner.groupId) {
            this.formData.combinerGroupIds.push(combiner.groupId)
          }
        })
      }
      this.searchTask()
      this.count()
      this.$emit('count-search', this.countSearch)
      this.$emit('close-dialog')
    },
    async getListPerformer() {
      try {
        const response = await TaskService.getListCustomer(constants.PATICIPATION.PERFORMER)
        this.listPerformer = response.data
      } catch (error) {
        console.log(error)
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      }
    },
    async getListFollower() {
      try {
        const response = await TaskService.getListCustomer(constants.PATICIPATION.MONITOR)
        this.listFollower = response.data
      } catch (error) {
        console.log(error)
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      }
    },
    async getListCombinator() {
      try {
        const response = await TaskService.getListCustomer(constants.PATICIPATION.COMBINATOR)
        this.listCombinator = response.data
      } catch (error) {
        console.log(error)
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      }
    },
    async getListTaskType() {
      try {
        const response = await TaskService.getListTaskType()
        this.listTaskType = response.data
      } catch (error) {
        console.log(error)
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      }
    },
    count() {
      this.countSearch = 0
      if (this.formData.taskName) {
        this.countSearch++;
      }
      if (this.formData.taskStatuses.length !== 0) {
        this.countSearch += this.formData.taskStatuses.length
      }
      if (this.formData.taskType) {
        this.countSearch++;
      }
      if (this.formData.deadlineTaskTimeType || this.formData.estimateEndFromDate || this.formData.estimateEndToDate) {
        this.countSearch++;
      }
      if (this.formData.taskPriorities.length !== 0) {
        this.countSearch += this.formData.taskPriorities.length
      }
      if (this.formData.performerUserIds.length !== 0) {
        this.countSearch += this.formData.performerUserIds.length
      }
      if (this.formData.performerGroupIds.length !== 0) {
        this.countSearch += this.formData.performerGroupIds.length
      }
      if (this.formData.followerIds.length !== 0) {
        this.countSearch += this.formData.followerIds.length
      }
      if (this.formData.combinerUserIds.length !== 0) {
        this.countSearch += this.formData.combinerUserIds.length
      }
      if (this.formData.combinerGroupIds.length !== 0) {
        this.countSearch += this.formData.combinerGroupIds.length
      }
    }
  }
}
</script>
<style scoped>

.item__choose-date {
  padding: 10px 0;
  background: #FFFFFF;
  box-shadow: 1px 2px 12px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid #FFFFFF;
  font-size: 12px;
}

.item__choose-date.active {
  border: 1px solid #00C3F9 !important;
}

.box-shadow {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15) !important;
}

</style>
