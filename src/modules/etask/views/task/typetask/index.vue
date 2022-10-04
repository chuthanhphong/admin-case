<template>
  <div class="type-task-manager">
    <v-container class="rounded-xl" fluid>
      <div class="wrap-home">
        <div class="row">
          <div class="col-5 border-right">
            <div class="d-flex align-center justify-space-between mt-2 mb-4">
              <h5 class="title__type-task text-capitalize">{{ $t('task-manager.menu.list-type-task') }}</h5>
              <v-tooltip content-class="tooltip-top" top>
                <template v-slot:activator="{ on }">
                  <img
                    src="@/assets/icons/task/type-task/add.png"
                    class="cursor-pointer"
                    v-on="on"
                    @click="createTypeTask"
                  >
                </template>
                <div>
                  {{ $t('task-manager.tool-tip.type-task.create') }}
                </div>
              </v-tooltip>
            </div>
            <div class="mb-4">
              <validation-provider
                name="contractName"
                rules="required|max:200"
              >
                <v-text-field
                  v-model="formData.keywords"
                  outlined
                  dense
                  clearable
                  hide-details
                  maxlength="200"
                  counter="200"
                  class="text--body-5"
                  name="txtSearch"
                  autofocus
                  :placeholder="$t('task-manager.placeHolder.name-type-task')"
                  @keyup.enter="searchTypeTask"
                  @click:clear="resetKeySearch"
                >
                  <vue-feather
                    slot="prepend-inner"
                    class="grey--text"
                    type="search"
                    size="20"
                  />
                </v-text-field>
              </validation-provider>
            </div>
            <div class="mb-4">
              <v-tabs
                v-model="tabs"
                color="#00C3F9"
              >
                <v-tab
                  key="active"
                  class="item-tab"
                >
                  {{ $t('task-manager.label.active') }}
                </v-tab>
                <v-tab
                  key="inactive"
                  class="item-tab"
                >
                  {{ $t('task-manager.label.in-active') }}
                </v-tab>
              </v-tabs>
            </div>
            <div class="list-type-task">
              <v-tabs-items
                v-model="tabs"
              >
                <v-tab-item
                  key="active"
                >
                  <v-list nav dense class="px-0">
                    <v-list-item
                      v-for="(item, i) in listTypeTaskActive"
                      :key="i"
                      :ripple="false"
                      class="border-none"
                      :class="checkTypeTaskActive(item)"
                      @click="showTypeTaskActive(item)"
                    >
                      <v-list-item-content>
                        <div class="name-type-task cursor-pointer">
                          {{ item.name }}
                          <span class="d-block date-create">
                            {{ item.createdDate }}
                          </span>
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-tab-item>
                <v-tab-item
                  key="inactive"
                >
                  <v-list nav dense class="px-0">
                    <v-list-item
                      v-for="(item, i) in listTypeTaskInActive"
                      :key="i"
                      :ripple="false"
                      class="border-none"
                      :class="checkTypeTaskActive(item)"
                      @click="showTypeTaskInActive(item)"
                    >
                      <v-list-item-content>
                        <div class="d-flex justify-space-between align-center mw-0">
                          <div class="name-type-task cursor-pointer">
                            {{ item.name }}
                            <span class="d-block date-create">
                              {{ item.createdDate }}
                            </span>
                          </div>
                          <div>
                            <v-tooltip content-class="tooltip-top" top>
                              <template v-slot:activator="{ on }">
                                <img
                                  class="cursor-pointer"
                                  src="@/assets/icons/task/type-task/trash.png"
                                  v-on="on"
                                  @click="removeTypeTask(item.id)"
                                />
                              </template>
                              <div>
                                {{ $t('task-manager.tool-tip.type-task.delete') }}
                              </div>
                            </v-tooltip>
                          </div>
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-tab-item>
              </v-tabs-items>
            </div>
          </div>
          <div class="col-7">
            <div class="d-flex align-center mt-2 mb-4">
              <h5 class="title__type-task text-capitalize">{{ $t('task-manager.menu.detail-type-task') }}</h5>
              <v-tooltip content-class="tooltip-top" top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-show="isShowIconUpdate()"
                    color="black"
                    icon
                    class="ml-2 mr-1"
                    style="height: 25px; width: 25px"
                    v-on="on"
                    @click="changeToUpdate"
                  >
                    <i
                      class="app-icon icon-update"
                      :style="isUpdate ? 'background-color: #2196F3' : ''"
                    />
                  </v-btn>
                </template>
                <div>
                  {{ $t('task-manager.tool-tip.type-task.update') }}
                </div>
              </v-tooltip>
              <div
                v-if="isShowIconUpdate()"
                class="d-flex justify-center align-center cursor-pointer"
                @click="tabs !== 0 ? inActiveState() : activeState()"
              >
                <v-btn
                  color="black"
                  icon
                  class="ml-1"
                  style="height: 25px; width: 25px"
                >
                  <i
                    class="app-icon icon-active"
                    :class="tabs !== 0 ? 'black' : 'blue'"
                  />
                </v-btn>
                <span class="text-types-task">
                  {{ tabs !== 0 ? $t("task-manager.dialogs.type-task.active")
                    : $t("task-manager.dialogs.type-task.in-active")
                  }}
                </span>
              </div>
            </div>
            <div
              v-if="(tabs === 0 && listTypeTaskActive.length === 0) || (tabs === 1 && listTypeTaskInActive.length === 0)"
              class="box-empty-data"
            >
              <empty-box
                :subtitle="'task-manager.empty.type-task'"
              />
            </div>
            <div
              v-else
            >
              <validation-observer ref="observer" v-slot="{ invalid }">
                <div class="box-create-by">
                  <div class="row">
                    <div class="col-6">
                      <label class="text-uppercase text-create-by">
                        {{ $t('task-manager.dialogs.type-task.create-by') }}
                      </label>
                      <div class="ml-3 d-flex align-center">
                        <v-menu
                          bottom
                          max-width="360"
                          open-on-hover
                          origin="center center"
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-avatar
                              color="#0FAFE4"
                              class="cursor-pointer"
                              size="32"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <span
                                class="text-uppercase white--text"
                              >{{
                                renderAvatarText(typeTaskDetail.creator.fullName)
                              }}</span>
                            </v-avatar>
                          </template>
                          <creator-info
                            :user-info="typeTaskDetail.creator"
                          />
                        </v-menu>
                        <p class="ma-0 ml-3 text-create-by">
                          {{ typeTaskDetail.creator.fullName }}
                          <span>({{ typeTaskDetail.creator.username }})</span>
                        </p>
                      </div>
                    </div>
                    <div class="col-6">
                      <label class="text-uppercase text-create-by">
                        {{ $t('task-manager.dialogs.type-task.create-date') }}
                      </label>
                      <div class="ml-3">
                        <p class="text-create-by ma-0">{{ typeTaskDetail.createdDate }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div :class="isDetail ? 'py-3' : ''">
                  <label class="label-field">
                    {{ $t('task-manager.dialogs.type-task.name') }}
                    <span class="color-require px-1">*</span>
                  </label>
                  <validation-provider
                    v-slot="{ errors }"
                    name="typeTaskName"
                    :rules="textInputRequired"
                  >
                    <v-text-field
                      v-model="typeTaskDetail.name"
                      dense
                      maxlength="200"
                      counter="200"
                      flat
                      solo
                      outlined
                      class="text--body-5"
                      :placeholder="$t('task-manager.placeHolder.type-task-name')"
                      :error-messages="errors"
                      :readonly="isDetail"
                      :hide-details="isDetail"
                    />
                  </validation-provider>
                </div>
                <body-create
                  :data-type-task="typeTaskDetail"
                  :is-view="isDetail"
                  :is-tab="tabs ? false : true"
                  :is-update="isUpdate"
                  :list-group="listGroup"
                />
                <div
                  v-if="isUpdate"
                  class="box-btn-action"
                >
                  <v-btn
                    color="primary"
                    rounded
                    outlined
                    elevation="1"
                    class="btn-action bg-white"
                    @click="cancelForm()"
                  >
                    {{ $t('task-manager.dialogs.type-task.btn-cancel') }}
                  </v-btn>
                  <v-btn
                    rounded
                    color="primary"
                    class="btn-action"
                    :disabled="invalid"
                    @click="submitForm()"
                  >
                    {{ $t('task-manager.dialogs.type-task.btn-update') }}
                  </v-btn>
                </div>
              </validation-observer>
            </div>
          </div>
        </div>
      </div>
    </v-container>
    <dialog-create
      :show-dialog="showDialogCreate"
      :list-group="listGroup"
      @create-success="createSuccess"
      @close-dialog="closeDialogCreate"
    />
    <dialog-confirm
      :obj-confirm="objConfirm"
      @accept-action="onAcceptConfirm"
      @cancel-action="onCancelConfirm"
      @close-dialog="onCloseConfirm"
    />
    <base-preload :dialog="loading" />
  </div>
</template>
<script>
// mixins
import rules from '@/mixins/rules'

// components
import EmptyBox from '@/views/components/EmptyBox'
import DialogCreate from '@/modules/etask/views/task/typetask/component/DialogCreate'
import BodyCreate from '@/modules/etask/views/task/typetask/component/BodyCreate'
import DialogConfirm from '@/modules/etask/views/task/typetask/component/DialogConfirm'
import CreatorInfo from '@/modules/etask/views/task/typetask/component/CreatorInfo'

// vuex
import { mapActions } from 'vuex'

// constants
import constants from '@/modules/etask/constants'

// service
import { TaskService } from '@/modules/etask/services/taskService'

export default {
  components: {
    EmptyBox,
    BodyCreate,
    DialogCreate,
    DialogConfirm,
    CreatorInfo
  },
  mixins: [rules],
  data() {
    return {
      tabs: 0,
      showDialogCreate: false,
      formData: {
        keywords: ''
      },
      objConfirm: {
        titleConfirm: '',
        showDialogConfirm: false,
        isReason: false,
        isNull: false,
        comment: ''
      },
      isUpdate: false,
      isDetail: false,
      typeTaskDetail: {},
      loading: false,
      typeActionActive: null,
      actionUpdate: constants.TASK_TYPE_ACTION.UPDATE,
      actionActive: constants.TASK_TYPE_ACTION.ACTIVE,
      actionInActive: constants.TASK_TYPE_ACTION.INACTIVE,
      actionRemove: constants.TASK_TYPE_ACTION.REMOVE,
      actionCancel: constants.TASK_TYPE_ACTION.CANCEL,
      listTypeTask: [],
      listTypeTaskActive: [],
      listTypeTaskInActive: [],
      listGroup: [],
      indexActive: 0,
      indexInActive: 0,
      idTypeTask: null
    }
  },
  computed: {},
  watch: {
    tabs() {
      this.isUpdate = false
      this.isDetail = true
      this.setDataTypeTaskDetail()
      this.isShowIconUpdate()
    }
  },
  mounted() {
    this.searchTypeTask()
    this.getGroupTree()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    createTypeTask() {
      this.showDialogCreate = true
      this.isUpdate = false
      this.isDetail = true
    },
    async search() {
      try {
        this.loading = true
        this.formData.keywords = this.formData.keywords.trim()
        const response = await TaskService.getListTypeTask(
          this.formData
        )
        this.listTypeTask = response.data
        if (this.listTypeTask.length !== 0) {
          this.listTypeTask.filter(item => {
            if (item.status === constants.STATE_TYPE_TASK.ACTIVE) {
              this.listTypeTaskActive.push(item)
            } else {
              this.listTypeTaskInActive.push(item)
            }
          })
        }
        if (this.listTypeTaskActive.length !== 0 || this.listTypeTaskInActive.length !== 0) {
          this.isDetail = true
          this.setDataTypeTaskDetail()
        }
      } catch (error) {
        const message = error.message
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(message)
        })
      } finally {
        this.loading = false
      }
    },
    searchTypeTask() {
      this.listTypeTask = []
      this.listTypeTaskActive = []
      this.listTypeTaskInActive = []
      this.search()
    },
    resetKeySearch() {
      this.formData.keywords = ''
      this.searchTypeTask()
    },
    closeDialogCreate() {
      this.showDialogCreate = false
    },
    onAcceptConfirm() {
      this.typeTaskDetail.name = this.typeTaskDetail.name.trim()
      if (this.typeActionActive === constants.TASK_TYPE_ACTION.ACTIVE) {
        this.updateTypeTask(this.typeTaskDetail)
      }
      if (this.typeActionActive === constants.TASK_TYPE_ACTION.INACTIVE) {
        this.updateTypeTask(this.typeTaskDetail)
      }
      if (this.typeActionActive === constants.TASK_TYPE_ACTION.UPDATE) {
        this.updateTypeTask(this.typeTaskDetail)
      }
      if (this.typeActionActive === constants.TASK_TYPE_ACTION.REMOVE) {
        if (this.idTypeTask) {
          this.deleteTypeTask()
        }
      }
      if (this.typeActionActive === constants.TASK_TYPE_ACTION.CANCEL) {
        this.isDetail = true
        this.isUpdate = false
        this.setDataTypeTaskDetail()
      }
      this.objConfirm.showDialogConfirm = false
    },
    onCancelConfirm() {
      this.objConfirm.showDialogConfirm = false
    },
    onCloseConfirm() {
      this.isUpdate = false
      this.isDetail = true
      this.setDataTypeTaskDetail()
      this.objConfirm.showDialogConfirm = false
    },
    removeTypeTask(id) {
      this.idTypeTask = id
      this.typeActionActive = this.actionRemove
      this.objConfirm.showDialogConfirm = true
      this.objConfirm.titleConfirm = 'task-manager.title-confirm.remove-type-task'
    },
    showTypeTaskActive(item) {
      this.indexActive = item.id
      this.showTypeTaskDetail(item)
    },
    showTypeTaskInActive(item) {
      this.indexInActive = item.id
      this.showTypeTaskDetail(item)
    },
    showTypeTaskDetail(item) {
      this.isDetail = true
      this.isUpdate = false
      this.typeTaskDetail = JSON.parse(JSON.stringify(item))
    },
    changeToUpdate() {
      this.isUpdate = !this.isUpdate
      this.isDetail = !this.isDetail
    },
    activeState() {
      this.typeTaskDetail.status = constants.STATE_TYPE_TASK.INACTIVE
      this.objConfirm.titleConfirm = 'task-manager.title-confirm.in-active-type-task'
      this.objConfirm.showDialogConfirm = true
      this.typeActionActive = this.actionInActive
    },
    inActiveState() {
      this.typeTaskDetail.status = constants.STATE_TYPE_TASK.ACTIVE
      this.objConfirm.titleConfirm = 'task-manager.title-confirm.active-type-task'
      this.objConfirm.showDialogConfirm = true
      this.typeActionActive = this.actionActive
    },
    cancelForm() {
      this.objConfirm.showDialogConfirm = true
      this.objConfirm.titleConfirm = 'task-manager.title-confirm.cancel-type-task'
      this.typeActionActive = this.actionCancel
    },
    submitForm() {
      this.objConfirm.showDialogConfirm = true
      this.objConfirm.titleConfirm = 'task-manager.title-confirm.update-type-task'
      this.typeActionActive = this.actionUpdate
    },
    renderAvatarText(customer) {
      return this.genAvatar(customer)
    },
    genAvatar(name) {
      if (!name) return ''
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        name = name.replaceAll(' ', ' ').trim()
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
    setDataTypeTaskDetail() {
      if ((!this.tabs && this.listTypeTaskActive.length !== 0) ||
          (this.tabs && this.listTypeTaskInActive.length !== 0)) {
        let obj = null
        if (this.tabs) {
          this.listTypeTaskInActive.filter(item => {
            if (item.id === this.indexInActive) {
              obj = JSON.parse(JSON.stringify(item))
            }
          })
          this.typeTaskDetail = obj
          if (obj === null) {
            this.typeTaskDetail = JSON.parse(JSON.stringify(this.listTypeTaskInActive[0]))
          }
        } else {
          this.listTypeTaskActive.filter(item => {
            if (item.id === this.indexActive) {
              obj = JSON.parse(JSON.stringify(item))
            }
          })
          this.typeTaskDetail = obj
          if (obj === null) {
            this.typeTaskDetail = JSON.parse(JSON.stringify(this.listTypeTaskActive[0]))
          }
        }
      }
    },
    async updateTypeTask(typeTask) {
      try {
        const response = await TaskService.updateTypeTask(
          typeTask
        )
        if (response.status === 200) {
          this.setNotify({
            show: true,
            type: 'success',
            content: this.$t('task-manager.information.update-type-task')
          })
          if (this.typeActionActive === constants.TASK_TYPE_ACTION.ACTIVE) {
            this.tabs = 0
            this.indexActive = this.typeTaskDetail.id
          }
          if (this.typeActionActive === constants.TASK_TYPE_ACTION.INACTIVE) {
            this.tabs = 1
            this.indexInActive = this.typeTaskDetail.id
          }
          await this.searchTypeTask()
        }
      } catch (error) {
        // reset trang thai
        this.resetStatus()
        const message = error.message
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(message)
        })
      }
    },
    async deleteTypeTask() {
      try {
        const response = await TaskService.deleteTypeTask(
          this.idTypeTask
        )
        if (response.status === 200) {
          this.setNotify({
            show: true,
            type: 'success',
            content: this.$t('task-manager.information.delete-type-task')
          })
          this.indexInActive = 0
          await this.searchTypeTask()
        }
      } catch (error) {
        const message = error.message
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(message)
        })
      }
    },
    createSuccess() {
      this.searchTypeTask()
    },
    resetStatus() {
      if (this.typeActionActive === constants.TASK_TYPE_ACTION.ACTIVE) {
        this.typeTaskDetail.status = constants.STATE_TYPE_TASK.INACTIVE
      }
      if (this.typeActionActive === constants.TASK_TYPE_ACTION.INACTIVE) {
        this.typeTaskDetail.status = constants.STATE_TYPE_TASK.ACTIVE
      }
    },
    checkTypeTaskActive(item) {
      if (this.typeTaskDetail.id === item.id) {
        return 'item-active'
      }
      return null
    },
    async getGroupTree() {
      try {
        const response = await TaskService.getGroupByCurrentUser()
        if (response.success) {
          this.listGroup = response.data
        }
      } catch (error) {
        const message = error.message
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(message)
        })
      }
    },
    isShowIconUpdate() {
      if (!this.tabs && this.listTypeTaskActive.length === 0) {
        return false
      }
      if (this.tabs && this.listTypeTaskInActive.length === 0) {
        return false
      }
      return true
    }
  }
}

</script>
<style scoped>

.type-task-manager {
  background: #66DBFB;
  border-radius: 20px;
  margin: 10px;
}

.wrap-home {
  background: white;
  padding: 15px;
  border-radius: 20px;
}

.title__type-task {
  font-size: 18px !important;
  font-weight: 700 !important;
  line-height: 25px;
}

.border-right {
  border-right: 1px solid #D3D3D5;
}

.item-tab {
  font-size: 14px;
  font-weight: 700;
  text-transform: unset;
  line-height: 20px;
}

.name-type-task {
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 20px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-create {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.list-type-task {
  height: calc(100vh - 310px) !important;
  min-height: 50vh;
  overflow-y: auto;
}

.box-empty-data {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
}

.label-field {
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 20px !important;
  text-transform: uppercase;
  display: flex;
  align-items: center;
}

.box-btn-action {
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 15px;
  gap: 15px;
  position: fixed;
  bottom: 5%;
  right: 3%;
}

.btn-action {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  width: 140px;
  padding: 20px 0 !important;
}

.bg-white {
  background: #FFFFFF;
}

.icon-update {
  -webkit-mask-image: url(../../../../../assets/icons/task/type-task/update.png) !important;
  mask-image: url(../../../../../assets/icons/task/type-task/update.png) !important;
  background-size: contain;
  width: 20px;
  height: 20px;
  display: inline-block;
}

.icon-active {
  -webkit-mask-image: url(../../../../../assets/icons/task/type-task/power.png) !important;
  mask-image: url(../../../../../assets/icons/task/type-task/power.png) !important;
  background-size: contain;
  width: 20px;
  height: 20px;
  display: inline-block;
}

.text-types-task {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.box-create-by {
  background: #E9E9EA;
  padding: 12px 0px 8px 8px;
  margin: 15px 0;
  border-radius: 8px;
}

.text-create-by {
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 20px !important;
}

.mw-0 {
  min-width: 0;
}

.border-none {
  border: none;
}

.item-active {
  background: #E6F9FE;
}

</style>
