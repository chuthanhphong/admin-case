<template>
  <v-container v-if="item">
    <v-row class="align-center">
      <v-col cols="6">
        <div class="d-flex">
          <v-tooltip content-class="tooltip-top" top>
            <template v-slot:activator="{ on }">
              <b class="task-name-hover text-ellipsis cursor-pointer" @click="showDialogDetail(item.taskId)" v-on="on">
                {{ item.taskName }}
              </b>
            </template>
            <div>{{ item.taskName }}</div>
          </v-tooltip>
          <div
            v-if="item.numberOfChildTasks > 0"
            class="d-flex align-center ml-3"
          >
            <img src="@/assets/icons/icon-parent.svg" alt="" />
            <span class="greya7--text">{{ item.numberOfChildTasks }}</span>
          </div>
        </div>
      </v-col>
      <v-col cols="3" align="center">
        <v-layout align-center>
          <v-chip :color="getColorChipStatusTaskByStaus(item.taskStatus)">
            <span :class="getClassColorStatusTaskByStatus(item.taskStatus)">
              {{ getTextStatusTaskByStatus(item.taskStatus) }}
            </span>
          </v-chip>
        </v-layout>
      </v-col>
      <v-col cols="2">
        <v-layout column align-center>
          <v-tooltip
            v-if="hasAttributeEstimateEndDate"
            top
            max-width="250"
            class="box-shadow"
          >
            <template v-slot:activator="{ on, attrs }">
              <label v-bind="attrs" v-on="on">
                {{ item.taskTime.estimateEndDate }}
              </label>
            </template>
            <span>
              {{
                `${$t("tickets.labels.deadline")} ${
                  item.taskTime.estimateEndTime
                } ${item.taskTime.estimateEndDate}`
              }}
            </span>
          </v-tooltip>
          <v-btn v-else fab outlined x-small class="border-dashed">
            <v-tooltip top max-width="250" class="box-shadow">
              <template v-slot:activator="{ on, attrs }">
                <i
                  class="app-icon icon-calendar darken"
                  v-bind="attrs"
                  v-on="on"
                ></i>
              </template>
              <span>
                {{ $t("tickets.tooltips.task-no-estimate") }}
              </span>
            </v-tooltip>
          </v-btn>
        </v-layout>
      </v-col>
      <v-col cols="1">
        <v-layout justify-center align-center>
          <label v-if="item.performer" class="pos-rel">
            <v-avatar
              color="primary"
              size="32"
              @click="getUserInfoById(item.performer.userId)"
            >
              <span class="white--text text-h6 text-uppercase">
                {{ item.performer.userName[0] }}
              </span>
            </v-avatar>
            <PopupUserInfoViewIntoRow
              :user-info="userInfoView"
              :active-index="activeIndex"
              :index="index"
              @on-click-outside="onClickOutside"
            />
          </label>
          <v-btn v-else fab outlined x-small class="border-dashed">
            <i class="app-icon icon-personal darken"></i>
          </v-btn>
        </v-layout>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// components
import PopupUserInfoViewIntoRow from "@/modules/ticket/views/components/PopupUserInfoViewIntoRow";
// import DialogTaskDetail from "@/modules/etask/views/components/DialogTaskDetail";

// services
// import { TaskService } from "@/modules/etask/services/taskService";
import {
  formatDate,
  FORMAT_DATE_TICKET,
} from "@/modules/ticket/helpers/ticketUtils";
import { UserService } from "@/modules/ticket/services/userService";
// constants
// import constants from '@/modules/etask/constants'
import actionsTask from '@/modules/etask/mixins/actionsTask'

export default {
  components: { PopupUserInfoViewIntoRow },
  mixins: [actionsTask],
  props: {
    item: {
      type: Object,
      default: undefined,
    },
    index: {
      type: Number,
      default: undefined,
    },

  },
  data() {
    return {
      userInfoView: null,
      isLeftPopupUser: true,
      activeIndex: -1,
      userInfo: null,
      positionPopupUserView: true,
      taskId: null,
    };
  },
  computed: {
    hasAttributeEstimateEndDate() {
      return this.item.taskTime.estimateEndDate;
    },
  },
  watch: {},
  methods: {
    showDialogDetail(id) {
      this.$emit("get-task-detail", id);
    },
    getTextStatusTaskByStatus(status) {
      switch (status) {
        case "NEW":
          return this.$t("tickets.status-task.init");
        case "REVIEW_RECEIVING":
          return this.$t("tickets.status-task.waiting-receive");
        case "RECEIVED_UNPROCESS":
          return this.$t("tickets.status-task.unprocess");
        case "INPROGRESS":
          return this.$t("tickets.status-task.processing");
        case "REJECT_RECEIVING":
          return this.$t("tickets.status-task.refuse-accept");
        case "FINISH":
          return this.$t("tickets.status-task.complete");
        case "CLOSED":
          return this.$t("tickets.status-task.close");
        case "CANCELED":
          return this.$t("tickets.status-task.cancel");
        case "REVIEW_SENDING":
          return this.$t("tickets.status-task.waiting-review");
        case "PENDING":
          return this.$t("tickets.status-task.pause");
        default:
          return "";
      }
    },
    getClassColorStatusTaskByStatus(status) {
      switch (status) {
        case "NEW":
          return "gray--text";
        case "REVIEW_RECEIVING":
        case "REVIEW_SENDING":
        case "PENDING":
          return "blue-4a--text";
        case "RECEIVED_UNPROCESS":
          return "organe-fd--text";
        case "INPROGRESS":
          return "yellow-ff--text";
        case "REJECT_RECEIVING":
        case "CANCELED":
          return "danger--text";
        case "FINISH":
          return "primary--text";
        case "CLOSED":
          return "blue-1c--text";
        default:
          return "";
      }
    },
    getColorChipStatusTaskByStaus(status) {
      switch (status) {
        case "NEW":
          return "#E9E9EA";
        case "REVIEW_RECEIVING":
        case "REVIEW_SENDING":
        case "PENDING":
          return "#DEDFFF";
        case "RECEIVED_UNPROCESS":
          return "#FFECDF";
        case "INPROGRESS":
          return "#FFEFD5";
        case "REJECT_RECEIVING":
        case "CANCELED":
          return "#FFE8E9";
        case "FINISH":
          return "#CCF3FE";
        case "CLOSED":
          return "#DEEFFE";
        default:
          return "";
      }
    },
    formatDateView(date) {
      return formatDate(date, FORMAT_DATE_TICKET);
    },
    async getUserInfoById(id) {
      this.activeIndex = this.index;
      if (!this.userInfoView || id !== this.userInfoView.userId) {
        const response = await UserService.getDetailUserById(id);
        if (response.success) {
          this.userInfoView = response.data;
          this.userInfo = response.data;
        } else {
          this.userInfoView = null;
        }
      }
    },
    onClickOutside() {
      this.activeIndex = -1;
    },
  },
};
</script>
