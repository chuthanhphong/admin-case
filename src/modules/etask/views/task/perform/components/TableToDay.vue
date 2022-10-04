<template>
  <v-layout wrap>
    <div
      class="box-group-task"
      @click="showTableTask = !showTableTask"
    >
      <span>
        {{ $t('task-manager.label.task-today') }} ({{ totalElements }})
      </span>
      <v-img v-if="showTableTask" src="@/assets/icons/task/dropdown.png" />
      <v-img v-else src="@/assets/icons/task/drop-right.svg" />
    </div>
    <div
      v-show="showTableTask && listTaskPerformer.length !== 0"
      class="col-12 px-0"
    >
      <div class="text-center my-2">
        <v-scroll-y-transition>
          <v-simple-table class="table-task" dense fixed-header>
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
                  <th v-if="objSetting.assigner" class="text-start task-deliver">
                    {{ $t('task-manager.table.deliver') }}
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
                  <th v-if="objSetting.follow" class="text-start task-follow">
                    {{ $t('task-manager.table.follow') }}
                  </th>
                  <th v-if="objSetting.source" class="text-start task-source">
                    {{ $t('task-manager.table.source') }}
                  </th>
                  <th class="text-center task-action">
                    {{ $t('task-manager.table.actions') }}
                  </th>
                </tr>
              </thead>
              <row-parent
                v-for="(itemParent, idx) in listTaskPerformer"
                :key="idx"
                :active-index="activeIndex"
                :index="itemParent.taskId"
                :is-reload="isReload"
                :item-parent="itemParent"
                :obj-loading="objLoading"
                :obj-setting="objSetting"
                :show-dialog-edit="showDialogTaskUpdate"
                :show-dialog-task-detail="showDialogTaskDetail"
                @taskId="taskIdfromEmit"
                @show-process="showProcess"
                @show-dialog-action="showDialogAction"
                @show-child-task="showChildTask(itemParent.taskId)"
                @show-dialog-detail="openTaskDetail"
                @show-dialog-edit="showDialogEditFromEmit"
              />
            </template>
          </v-simple-table>
        </v-scroll-y-transition>
      </div>
    </div>
  </v-layout>
</template>
<script>
import RowParent from '@/modules/etask/views/task/perform/components/RowParent'

export default {
  components: {
    RowParent
  },
  mixins: [],
  props: {
    activeIndex: {
      type: Array,
      default: undefined
    },
    formData: {
      type: Object,
      default: undefined
    },
    objLoading: {
      type: Object,
      default: undefined
    },
    totalElements: {
      type: Number,
      default: undefined
    },
    listTaskPerformer: {
      type: Array,
      default: undefined
    },
    indexSort: {
      type: Number,
      default: undefined
    },
    listSortField: {
      type: Array,
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
      showTableTask: true,
      showDialogTaskDetail: false,
      showDialogTaskUpdate: false,
      taskId: null,
    }
  },
  watch: {
    taskId() {
      this.$emit('task-id', this.taskId)
    },
  },
  mounted() {
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
    showProcess(id, value) {
      this.$emit('show-process', id, value)
    },
    showDialogAction(obj, action) {
      this.$emit('show-dialog-action', obj, action)
    },
    showChildTask(index) {
      this.$emit('show-child-task', index)
    },
    changeSortName(value, field) {
      this.$emit('change-sort', value, field)
    },
  }
}
</script>
<style scoped>
.box-group-task {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  font-size: 14px;
  font-weight: 600;
  gap: 5px;
  cursor: pointer;
}
.wrap-empty-list {
  height: auto !important;
  min-height: auto !important;
  overflow-y: auto !important;
}
</style>

