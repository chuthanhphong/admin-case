<template>
  <div class="container container-ticket">
    <div class="ticket-detail-content">
      <div class="d-flex align-center">
        <h5 class="title-page text-primary d-flex align-center">
          <span class="mr-3">{{ $t("tickets.titles.detail") }}</span>
        </h5>
      </div>
      <v-row v-if="detail">
        <v-col class="white" cols="6">
          <v-card class="rounded-xl rounded-b-0">
            <TicketInfoTop
              :detail="detail"
              @source-task="sourceTicketFromEmit"
              @remove-Source="removeSoucreTicket"
            />
          </v-card>
          <TicketInfoExpand :detail="detail" />
        </v-col>
        <!-- card-right -->
        <v-col class="expand-detail overflow-y-auto white" cols="6">
          <v-card class="rounded-xl">
            <PerformerInfo
              :detail="detail"
              :is-viewer="isViewer"
              :user-info="userInfo"
              :users-by-group-id="usersByGroupIdForAssigner"
              @update-assign-to="updateAssignTo"
            />

            <MonitorUsers
              :all-user="allUserOfDomain"
              :detail="detail"
              :is-reload.sync="isReload"
              :is-viewer="isViewer"
              @update-selected-follower="updateSelectedFollower"
            />
            <ResultProcessExpand :detail="detail" />
            <TaskInfoExpand
              :detail="detail"
              @create-task="onShowCreateTask"
              @get-task-detail="getTaskDetail"
            />
            <LinkToTicketExpand :detail="detail" @Source-task="onShowSourceTask" />
            <v-layout align-center class="mx-6 mt-4 mb-2">
              <v-progress-linear
                :class="getClassColorProgressByStatus(detail.status)"
                :value="detail.progress ? detail.progress : 0"
                background-opacity="1"
                class="rounded-xl"
                color="#E7ECF1"
                height="15"
                @click="onShowDialogUpdateProgress"
              >
              </v-progress-linear>
              <span class="mx-2">
                {{ detail.progress ? detail.progress : 0 }}%
              </span>
              <v-btn fab outlined x-small @click="onShowDialogCompleteProcess">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-layout>
            <HistoryActivityTicket :detail="detail" />
            <v-divider class="ma-4 px-4"></v-divider>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- actions -->
    <v-layout v-if="detail" class="white mt-4 footer-actions-fixed" justify-end>
      <!-- quay lai -->
      <v-btn
        class="w-160 py-5 mr-0 mr-md-3 bg-white"
        color="primary"
        elevation="1"
        outlined
        rounded
        @click="onGotoBack"
      >
        {{ $t("tickets.labels.back") }}
      </v-btn>
      <!-- xoa yeu cau -->
      <v-btn
        v-if="isShowDeleteAction"
        class="w-160 py-5 mr-0 mr-md-3 bg-white"
        color="error"
        elevation="1"
        outlined
        rounded
        @click="onShowConfirmDelete"
      >
        {{ $t("tickets.labels.delete") }}
      </v-btn>

      <!-- huy yeu cau -->
      <v-btn
        v-if="isShowCancelAction"
        class="w-160 py-5 mr-0 mr-md-3 bg-white"
        color="error"
        elevation="1"
        outlined
        rounded
        @click="onShowConfirmCancel"
      >
        {{ $t("tickets.labels.cancel") }}
      </v-btn>

      <!-- tu choi duyet chuyen don vi -->
      <v-btn
        v-if="isShowDenyForwardGroupAction"
        class="w-160 py-5 mr-0 mr-md-3 bg-white"
        color="error"
        elevation="1"
        outlined
        rounded
        @click="onShowConfirmDenyForwardGroup"
      >
        {{ $t("rejectLabel") }}
      </v-btn>

      <!-- duyet chuyen don vi -->
      <v-btn
        v-if="isShowAcceptForwardGroupAction"
        class="w-160 py-5 mr-0 mr-md-3"
        color="primary"
        elevation="1"
        rounded
        @click="onShowConfirmAcceptForwardGroup"
      >
        {{ $t("tickets.labels.approve") }}
      </v-btn>

      <!-- tu choi duyet ket qua -->
      <v-btn
        v-if="isShowRejectAction"
        class="w-160 py-5 mr-0 mr-md-3 bg-white"
        color="error"
        elevation="1"
        outlined
        rounded
        @click="onShowConfirmReject"
      >
        {{ $t("rejectLabel") }}
      </v-btn>

      <!-- duyet ket qua -->
      <v-btn
        v-if="isShowResultApproveAction"
        class="w-160 py-5 mr-0 mr-md-3"
        color="primary"
        elevation="1"
        rounded
        @click="onShowConfirmResultApprove"
      >
        {{ $t("tickets.labels.approve") }}
      </v-btn>

      <!-- tu choi xem xet -->
      <v-btn
        v-if="isShowRejectReviewAction"
        class="w-160 py-5 mr-0 mr-md-3 bg-white"
        color="error"
        elevation="1"
        outlined
        rounded
        @click="onShowConfirmRejectReview"
      >
        {{ $t("rejectLabel") }}
      </v-btn>

      <!-- xem xet -->
      <v-btn
        v-if="isShowReviewAction"
        class="w-160 py-5 mr-0 mr-md-3"
        color="primary"
        elevation="1"
        rounded
        @click="onShowConfirmReview"
      >
        {{ $t("tickets.labels.review") }}
      </v-btn>

      <!-- chinh sua -->
      <v-btn
        v-if="isShowEditAction"
        class="w-160 py-5 mr-0 mr-md-3"
        color="primary"
        elevation="1"
        rounded
        @click="onShowDialogUpdateTicket"
      >
        {{ $t("tickets.labels.edit") }}
      </v-btn>

      <!-- gui yeu cau -->
      <v-btn
        v-if="isShowSendAction"
        class="w-160 py-5 mr-0 mr-md-3"
        color="primary"
        elevation="1"
        rounded
        @click="onAcceptSend"
      >
        {{ $t("tickets.labels.send-ticket") }}
      </v-btn>

      <!-- close -->
      <v-btn
        v-if="isShowCloseAction"
        class="w-160 py-5 mr-0 mr-md-3"
        color="primary"
        elevation="1"
        rounded
        @click="onShowConfirmClose"
      >
        {{ $t("tickets.labels.ticket-close") }}
      </v-btn>

      <!-- tu choi dong -->
      <v-btn
        v-if="isShowRefuseCloseAction"
        class="w-160 py-5 mr-0 mr-md-3 bg-white"
        color="error"
        elevation="1"
        outlined
        rounded
        @click="onShowConfirmRefuseClose"
      >
        {{ $t("tickets.labels.refused-close") }}
      </v-btn>

      <!-- chuyen don vi -->
      <v-btn
        v-if="isShowForwardGroupAction"
        class="w-160 py-5 mr-0 mr-md-3 bg-white"
        color="primary"
        elevation="1"
        outlined
        rounded
        @click="onShowDialogTreeView"
      >
        {{ $t("tickets.labels.forward") }}
      </v-btn>

      <!-- hoan thanh -->
      <v-btn
        v-if="isShowCompleteAction"
        class="w-160 py-5"
        color="primary"
        rounded
        @click="onShowConfirmComplete"
      >
        {{ $t("completed") }}
      </v-btn>
    </v-layout>
    <dialog-update-process
      v-model="showDialogProcess"
      :data-process="dataProcess"
      @change-process="changeProcess"
    />

    <dialog-create-task
      :show-dialog="showDialogCreatetask"
      :ticket-info-for-create-task="ticketInfoForCreateTask"
      @close-dialog="showDialogCreatetask = false"
      @miniMize-dialog="showDialogCreatetask = false"
    />

    <dialog-select-link-to
      :excludes="[{ id:dataTaskDetail.id, associationType: 'TICKET' }]"
      :show-dialog="showDialogLinkTo"
      :task-associations="dataTaskDetail.taskAssociations"
      :title="'task-manager.title.link-to'"
      @close-dialog="showDialogLinkTo = false"
      @miniMize-dialog="showDialogLinkTo = false"
    />

    <!-- xoa yeu cau -->
    <DialogConfirm
      v-model="showDialogConfirmDelete"
      :message="$t('tickets.messages.delete-confirm')"
      @on-accept="onAcceptDelete"
    />

    <!-- tu choi xem xet -->
    <DialogConfirmReason
      v-model="showDialogConfirmRejectReview"
      :message="$t('tickets.messages.reject-confirm')"
      @on-accept="onAcceptRejectReview"
    />

    <!-- tu choi duyet chuyen don vi -->
    <DialogConfirmReason
      v-model="showDialogConfirmDenyForwardGroup"
      :message="$t('tickets.messages.reject-confirm')"
      @on-accept="onAcceptDenyForwardGroup"
    />

    <!-- tu choi duyet ket qua -->
    <DialogConfirmReason
      v-model="showDialogConfirmReject"
      :message="$t('tickets.messages.reject-confirm')"
      @on-accept="onAcceptReject"
    />

    <!-- huy yeu cau -->
    <DialogConfirm
      v-model="showDialogConfirmCancel"
      :message="$t('tickets.messages.cancel-confirm')"
      @on-accept="onAcceptCancel"
    />

    <!-- xem xet -->
    <DialogConfirm
      v-model="showDialogConfirmReview"
      :message="$t('tickets.messages.review-confirm')"
      @on-accept="onAcceptReview"
    />

    <!-- duyet chuyen don vi -->
    <DialogConfirm
      v-model="showDialogConfirmAcceptForwardGroup"
      :message="$t('tickets.messages.approve-confirm')"
      @on-accept="onAcceptAcceptForwardGroup"
    />

    <!-- duyet ket qua -->
    <DialogConfirm
      v-model="showDialogConfirmResultApprove"
      :message="$t('tickets.messages.approve-confirm')"
      @on-accept="onAcceptResultApprove"
    />

    <!-- dong yeu cau -->
    <DialogConfirm
      v-model="showDialogConfirmClose"
      :message="$t('tickets.messages.ticket-close-confirm')"
      :warning-msg="$t('tickets.messages.warning-ticket-close-confirm')"
      @on-accept="onAcceptClose"
    />

    <!-- tu choi dong -->
    <DialogConfirm
      v-model="showDialogConfirmRefuseClose"
      :message="$t('tickets.messages.refuse-close-confirm')"
      :warning-msg="$t('tickets.messages.warning-refuse-close-confirm')"
      @on-accept="onAcceptRefuseClose"
    />

    <!-- chuyen don vi -->
    <DialogConfirm
      v-model="showDialogConfirmForwardGroup"
      :message="`${$t('tickets.messages.forward-ticket-confirm')} [${
        groupSelectedForwardTicket ? groupSelectedForwardTicket.groupName : ''
      }] ${$t('tickets.messages.forward-ticket-confirm-2')}`"
      @on-accept="onAcceptForwardGroup"
    />

    <!-- hoan thanh -->
    <DialogConfirmComplete
      v-model="showDialogConfirmComplete"
      :message="$t('tickets.messages.complete-ticket-confirm')"
      @on-accept="onAcceptComplete"
    />

    <!-- dialog tree view -->
    <dialog-tree-view
      v-model="showDialogTreeView"
      :all-groups="allGroups"
      :group-id="detail ? detail.groupId : null"
      :title="$t('tickets.labels.unit-request-perform')"
      @selected-group="selectedForwardGroup"
      @on-cancel="onCloseDialogTreeView"
    />

    <!-- chinh sua yeu cau -->
    <dialog-create-ticket
      v-model="showDialogUpdateTicket"
      :category-id="detail ? detail.ticketCateId : null"
      :detail-ticket="detail"
      :is-update="true"
      :types-ticket="typesTicket"
    />
    <!--show dialog chi tiet task-->
    <dialog-task-detail
      :data-task="dataTaskDetail"
      :show-dialog="showDialogTaskDetail"
      :task-id-detail="taskId"
      @close-dialog="showDialogTaskDetail = false"
    />
    <!-- hien thi popup thong bao yeu cau da duoc nhan vien khac thuc hien-->
    <popup-has-been-assigned-to-another
      v-model="showPopupHasBeenAssigned"
      :message="$t('tickets.messages.has-been-assigned-to-another')"
    />
    <base-preload :dialog="loading" />
  </div>
</template>

<script>
// components
import TicketInfoTop from "./components/TicketInfoTop";
import TicketInfoExpand from "./components/TicketInfoExpand";
import TaskInfoExpand from "./components/TaskInfoExpand";
import PerformerInfo from "./components/PerformerInfo";
import MonitorUsers from "./components/MonitorUsers";
import LinkToTicketExpand from "./components/LinkToTicketExpand";
import ResultProcessExpand from "./components/ResultProcessExpand";
import HistoryActivityTicket from "./components/HistoryActivityTicket";
import DialogUpdateProcess from "@/modules/ticket/views/components/DialogUpdateProcess";
import DialogCreateTask from "@/modules/etask/views/components/DialogCreateTask";
import DialogConfirm from "./components/DialogConfirm";
import DialogConfirmReason from "@/modules/ticket/views/components/DialogConfirmReason";
import DialogTreeView from "@/modules/ticket/views/components/DialogTreeView.vue";
import DialogCreateTicket from "@/modules/ticket/views/components/create-ticket/DialogCreateTicket";
import DialogSelectLinkTo from "@/components/dialog/DialogSelectLinkTo";
import DialogConfirmComplete from "@/modules/ticket/views/components/DialogConfirmComplete";
import DialogTaskDetail from "@/modules/etask/views/components/DialogTaskDetail";
import PopupHasBeenAssignedToAnother from "@/modules/ticket/views/components/PopupHasBeenAssignedToAnother";

// libs
import { mapActions } from "vuex";
import constants from "@/constants";
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import mixinFindUserRole from "@/modules/ticket/mixins/mixinFindUserRole";
import { FORMAT_DATE_TIME_TICKET, formatDate, HTTP_STATUS_SUCCESS, } from "@/modules/ticket/helpers/ticketUtils";
import mixinUploadFiles from "@/modules/ticket/mixins/mixinUploadFiles";
import mixinComputedState from "./mixins/mixinComputedState";
import mixinPermissionActions from "./mixins/mixinPermissionActions";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";
import { UserService } from "@/modules/ticket/services/userService";
import { CategoryService } from "@/modules/ticket/services/categoryService";
import { StorageService } from "@/modules/ticket/services/storageService";
import { TaskService } from "@/modules/etask/services/taskService";

export default {
  components: {
    TicketInfoTop,
    TicketInfoExpand,
    TaskInfoExpand,
    PerformerInfo,
    MonitorUsers,
    LinkToTicketExpand,
    ResultProcessExpand,
    HistoryActivityTicket,
    // DialogSelectSourceTask,
    DialogUpdateProcess,
    DialogCreateTask,
    DialogConfirm,
    DialogConfirmReason,
    DialogTreeView,
    DialogCreateTicket,
    DialogSelectLinkTo,
    DialogConfirmComplete,
    DialogTaskDetail,
    PopupHasBeenAssignedToAnother,
  },
  mixins: [
    mixinStatusAndPriority,
    mixinUploadFiles,
    mixinComputedState,
    mixinPermissionActions,
    mixinFindUserRole,
  ],
  props: {
    dataTask: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      id: null,
      typeRedirect: null,
      detail: null,
      ticketInfoForCreateTask: null,
      taskId: null,

      allGroups: [],
      userOfGroup: [],
      usersByGroupIdForAssigner: [],
      allUserOfDomaim: [],
      listAssociation: [],

      typesTicket: [],
      // dialog progress
      dataProcess: {
        process: null,
      },
      showPopupHasBeenAssigned: false,
      rowId: null,
      showDialogProcess: false,
      loading: false,

      showDialogCreatetask: false,
      showDialogSourceTask: false,
      showDialogCompleteProcess: false,
      showDialogLinkTo: false,
      showDialogComplete: false,
      showDialogDetail: false,
      DialogTaskDetail: false,
      showDialogTaskDetail: false,

      isReload: false,
      showDialogUpdateTicket: false,
      dataTaskDetail: {
        id: null,
        parentId: null,
        taskCategoryId: null,
        name: "",
        content: "",
        priority: null,
        requireApproval: false,
        status: null,
        startDate: null,
        endDate: null,
        level: null,
        progress: null,
        currentUserRoles: [],
        actualDuration: null,
        reportFreq: "YEARLY",
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
      },
    };
  },
  watch: {
    showDialogCreatetask(val) {
      if (!val && this.ticketInfoForCreateTask.isReload) {
        this.ticketInfoForCreateTask.isReload = false;
        this.getDetail();
      }
    },
    showDialogConfirmForwardTicket(val) {
      if (!val && this.groupSelectedForwardTicket) {
        this.resetGroupSelectedForwardTicket();
      }
    },
    "$route.query.id"() {
      const query = this.$route.query;
      this.id = query.id;
      this.typeRedirect = parseInt(query.typeRedirect);
      this.initData();
    },
  },
  created() {
    const query = this.$route.query;
    this.id = query.id;
    this.typeRedirect = parseInt(query.typeRedirect);
    this.initData();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    async initData() {
      if (this.id) {
        this.getAllGroup();
        this.getAllUserOfDomain();
        this.getDetail(true);
      }
    },
    async getTaskDetail(taskId) {
      try {
        const response = await TaskService.getDetailTask(taskId);
        this.dataTaskDetail = response.data;
        this.taskId = taskId;
        this.showDialogTaskDetail = true;
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: error.message,
          key: false,
        });
      }
    },
    async getDetail(isLoadUsersGroup) {
      try {
        this.loading = true;
        const pars = { id: this.id };
        const response = await TicketService.detail(pars);
        if (response) {
          this.detail = response.data;
          if (
            !this.findRoleNotificationGroupIds.includes(this.detail.groupId)
          ) {
            if (this.detail.userId) {
              if (this.detail.userId !== this.detail.infoUser.userId) {
                this.showPopupHasBeenAssigned = true;
                return;
              }
            }
          }
          if (this.isNoCreatedAndStatusDraft) {
            this.onGotoBack();
            return;
          }

          this.parseDetailToView(response.data);
          if (isLoadUsersGroup) {
            await this.getUsersByGroupId();
          }
        } else {
          this.detail = null;
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.loading = false;
      }
    },
    parseDetailToView(data) {
      if (typeof data.progress !== "undefined") {
        this.dataProcess.process = data.progress;
      }

      if (this.isShowEditAction) {
        this.findTicketCategoryActive();
      }
    },
    async getUsersByGroupId() {
      try {
        if (this.userOfGroup && this.userOfGroup.length > 0) {
          this.removeUserPerformOfGroup();
        } else {
          const pars = { id: this.detail.groupId };
          const response = await UserService.getUsersFromGroupId(pars);
          if (response) {
            this.userOfGroup = response.data;
            this.usersByGroupIdForAssigner = response.data;
            this.removeUserPerformOfGroup();
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    removeUserPerformOfGroup() {
      if (this.isRemoveUserPerformOfGroup) {
        const newArr = [...this.userOfGroup];
        const idx = newArr.findIndex((x) => x.userId === this.detail.userId);
        newArr.splice(idx, 1);
        this.usersByGroupIdForAssigner = newArr;
      }
    },
    async getAllGroup() {
      this.allGroups = await StorageService.getAllGroup();
    },
    async findTicketCategoryActive() {
      try {
        this.loading = true;
        const response = await CategoryService.findTicketCategoryActive({});
        if (response) {
          this.typesTicket = response.data;
        } else {
          this.typesTicket = [];
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.loading = false;
      }
    },
    async getAllUserOfDomain() {
      this.allUserOfDomain = await StorageService.getAllUserOfDomain();
    },
    formatDateView(date) {
      return formatDate(date, FORMAT_DATE_TIME_TICKET);
    },
    onShowDialogUpdateProgress() {
      if (
        this.isPerformerAndStatusProcessing ||
        this.isPerformerAndStatusRefuseClose ||
        this.isPerformerLeaderAndStatusProcessing ||
        this.isPerformerLeaderAndStatusResultApprove ||
        this.isPerformerLeaderAndStatusRefuseClose ||
        this.isAdminTicket
      ) {
        this.showDialogProcess = true;
      }
    },
    onShowDialogCompleteProcess() {
      if (
        this.isPerformerAndStatusProcessing ||
        this.isPerformerAndStatusRefuseClose ||
        this.isPerformerLeaderAndStatusProcessing ||
        this.isPerformerLeaderAndStatusRefuseClose ||
        this.isAdminTicket
      ) {
        this.showDialogConfirmComplete = true;
      }
    },
    async changeProcess(data) {
      try {
        this.loading = true;
        if (data.process === 100 && !this.isPerformerLeader) {
          this.onShowConfirmComplete();
        } else {
          const pars = {
            id: this.detail.id,
            progress: data.process,
          };
          const response = await TicketService.updateProgressTicket(pars);
          if (response && response.status === HTTP_STATUS_SUCCESS) {
            await this.getDetail();
            this.setNotify({
              show: true,
              type: constants.NOTIFY_TYPE.SUCCESS,
              content: "tickets.messages.update-progress-success",
            });
          }
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.loading = false;
      }
    },
    onShowCreateTask() {
      this.ticketInfoForCreateTask = this.bindCreateTaskPars();
      this.showDialogCreatetask = true;
    },
    bindCreateTaskPars() {
      const pars = {
        id: this.detail.id,
        name: this.detail.name,
        isReload: false,
      };
      const monitorIds = [];
      if (this.hasAttributeInfoUser) {
        pars["assignId"] = this.detail.infoUser.userId;
        monitorIds.push(this.detail.infoUser.userId);
      }
      if (this.hasAttributeMonitorUsers) {
        const monitorIdArr = this.detail.monitorUsers.map((item) => {
          return item.userId;
        });
        monitorIdArr.forEach((val) => {
          if (!monitorIds.includes(val)) {
            monitorIds.push(val);
          }
        });
      }

      if (monitorIds.length > 0) {
        pars["monitorIds"] = monitorIds;
      }

      return pars;
    },
    async updateSelectedFollower(val) {
      try {
        this.loading = true;
        const pars = this.bindUpdateSelectedFollowerPars(val);
        await TicketService.updateMonitorUserOfTicket(pars);
        this.getDetail();
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: "tickets.messages.update-monitor-success",
        });
      } catch (error) {
        this.isReload = true;
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.loading = false;
      }
    },
    bindUpdateSelectedFollowerPars(val) {
      const pars = { id: this.id };
      if (val) {
        pars["monitorUserId"] = val;
      } else {
        pars["monitorUserId"] = null;
      }
      return pars;
    },
    async updateAssignTo(val) {
      try {
        this.loading = true;
        const pars = {
          id: this.detail.id,
          note: this.$t("tickets.messages.forward-user"),
          userId: val.userId,
        };
        const response = await TicketService.forwardTicketUser(pars);
        if (response) {
          this.getDetail(true);
        }
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: "tickets.messages.forward-user-success",
        });
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.loading = false;
      }
    },
    onShowSourceTask() {
      this.showDialogLinkTo = true;
    },
    onShowDialogUpdateTicket() {
      this.showDialogUpdateTicket = true;
    },
    async sourceTicketFromEmit(val) {
      if (val) {
        try {
          this.loading = true
          await TicketService.addSourceTicket(this.detail.id, val)
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: this.$t('ticket-manager.notify-message.add-source-success'),
            key: false,
          });
          this.getDetail()
        } catch (err) {
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.ERROR,
            content: err.message,
            key: false,
          });
        } finally {
          this.loading = false
        }
      }
    },
    async removeSoucreTicket() {
      try {
        this.loading = true
        await TicketService.removeSouceTicKet(this.detail.id)
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: this.$t('ticket-manager.notify-message.remove-source-success'),
          key: false,
        });
        this.getDetail()
      } catch (err) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: err.message,
          key: false,
        });
      } finally {
        this.loading = false
      }
    },
    listAssociationFromEmit(val) {
      this.listAssociation = val;
    },
    resetGroupSelectedForwardTicket() {
      this.groupSelectedForwardTicket = null;
    },
    // closeDialogDetail() {
    //   this.showDialogDetail = false;
    // },
  },
};
</script>

