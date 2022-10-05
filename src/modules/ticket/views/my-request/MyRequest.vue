<template>
  <div class="container container-ticket has-bg py-0 px-6">
    <div class="d-flex align-center">
      <h5 class="title-page text-primary d-flex align-center">
        <span class="mr-3">{{ $t("tickets.titles.my-request") }}</span>
        <span>({{ totalCount }})</span>
        <div class="px-2">
          <v-btn icon fab x-small @click="tableType = 'list'">
            <i
              class="app-icon icon-list"
              :class="tableType == 'list' ? 'primary' : 'gray'"
            />
          </v-btn>
          <v-btn icon fab x-small @click="tableType = 'card'">
            <i
              class="app-icon icon-card"
              :class="tableType != 'list' ? 'primary' : 'gray'"
            />
          </v-btn>
        </div>
      </h5>
    </div>
    <div class="wrap-category-ticket">
      <v-card class="rounded-xl py-6">
        <HeaderListTicket
          :form-search="formSearch"
          :disabled-create="hasTypesTicketActive"
          :is-show-created-el="false"
          :is-show-performer-el="true"
          :is-show-perform-group-el="true"
          :is-show-follower-el="true"
          :setting-headers="settingHeaders"
          :lst-type="typesTicket"
          :lst-performer="performerName"
          :lst-perform-group="performGroupName"
          :lst-follower="followerName"
          :is-clear-data="isClearData"
          :on-reload-data="onReloadData"
          @get-status="getStatus"
          @get-deadline="getDeadline"
          @get-priority="getPriority"
          @search="search"
          @advance-search="advanceSearch"
          @clear-search="clearSearch"
          @show-dialog-add-new="showDialogAddNew"
        />
        <div class="box-list-content-tickets mt-4">
          <div
            v-if="countListTickets === 0"
            class="col-md-5 col-12 mx-auto wrap-empty-list"
          >
            <empty-box :loading="loading" :subtitle="'tickets.empty.data'" />
          </div>
          <v-data-table
            v-else
            id="virtual-scroll-table"
            v-scroll:#virtual-scroll-table="onScroll"
            hide-default-footer
            :headers="headers"
            :items="lstTickets"
            :fixed-header="true"
            :no-data-text="$t('noData')"
            :class="`table-${tableType}`"
            :items-per-page="countListTickets"
          >
            <template v-slot:[`item.name`]="{ item }">
              <div class="box-ticket-name d-flex align-center">
                <div class="mr-4">
                  <div :class="tableType == 'list' ? 'd-none' : ''">
                    <b>
                      {{ item.id }}
                    </b>
                  </div>
                  <v-layout class="link">
                    <!-- <v-tooltip content-class="tooltip-top" top>
                      <template v-slot:activator="{ on }">
                        <div class="text--body-5 task-name-hover text-ellipsis cursor-pointer" @click="onGotoDetailTicket(item)" v-on="on">
                          {{ getTextTruncateView(item.name, 30) }}
                        </div>
                      </template>
                      <div>
                        {{ item.name }}
                      </div>
                    </v-tooltip> -->
                    <div class="text--body-5 task-name-hover text-ellipsis cursor-pointer" @click="onGotoDetailTicket(item)">
                      {{ getTextTruncateView(item.name, 30) }}
                    </div>
                    <div
                      v-if="item.amountTask > 0"
                      class="d-flex align-center ml-3"
                    >
                      <img src="@/assets/icons/icon-parent.svg" alt="" />
                      <span class="greya7--text">{{ item.amountTask }}</span>
                    </div>
                  </v-layout>
                  <div class="text--overlined greya7--text">
                    {{ formatDateView(item.createdDate) }}
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <v-layout align-center>
                <v-avatar
                  :color="getColorDotByStatus(item.status)"
                  size="15"
                  class="mr-1"
                ></v-avatar>
                <span
                  class="text-center mr-1"
                  :class="getColorTextByStatus(item.status)"
                  v-html="getTextByStatus(item.status)"
                ></span>
                <span
                  v-if="isShowTextDealline(item)"
                  v-html="
                    getTextDeallineByExpectEndDate(
                      item.startDate,
                      item.estDuration
                    )
                  "
                ></span>
              </v-layout>
            </template>
            <template v-slot:[`item.priority`]="{ item }">
              <v-layout justify-center>
                <i
                  class="app-icon icon-flash"
                  :class="getColorByPriority(item.priority)"
                />
              </v-layout>
            </template>
            <template v-slot:[`item.progress`]="{ item }">
              <v-layout align-center class="mr-4">
                <v-progress-linear
                  height="8"
                  rounded
                  background-opacity="1"
                  color="#E7ECF1"
                  style="width: 90px"
                  :value="item.progress ? item.progress : 0"
                  :class="getClassColorProgressByStatus(item.status)"
                  @click="onShowDialogUpdateProgress(item)"
                >
                </v-progress-linear>
                <span class="ml-2">
                  {{ item.progress ? item.progress : 0 }}%
                </span>
              </v-layout>
            </template>
            <template v-slot:[`item.ticketCateName`]="{ item }">
              {{ getTextTruncateView(item.ticketCateName, 15) }}
            </template>
            <template v-slot:[`item.userName`]="{ item }">
              <v-layout
                v-if="hasAttributeUserName(item)"
                justify-center
                align-center
              >
                <div class="pos-rel">
                  <v-hover v-slot="{ hover }">
                    <v-btn fab x-small color="primary">
                      <span class="white--text text-h6 text-uppercase">
                        {{ item.userName[0] }}
                      </span>
                      <PopupUserInfoViewHover
                        v-if="hover"
                        :user-info="item.userInfo"
                        :is-chevron-left="false"
                      />
                    </v-btn>
                  </v-hover>
                </div>
              </v-layout>
              <v-btn v-else class="border-dashed-2" outlined fab x-small>
                <i class="app-icon icon-personal dark" />
              </v-btn>
            </template>
            <template v-slot:[`item.groupName`]="{ item }">
              <v-menu
                bottom
                origin="center center"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                    @click="getDetailGroupById(item.groupId)"
                    v-html="getTextTruncateView(item.groupName, 20)"
                  >
                  </span>
                </template>

                <v-layout v-if="detailGroupView" align-center>
                  <v-avatar color="primary" size="32" class="ml-4">
                    <i class="app-icon icon-briefcase white"></i>
                  </v-avatar>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ getTextTruncateView(detailGroupView.groupName, 20) }}
                      </v-list-item-title>
                      <v-list-item-subtitle v-if="hasDetailGroupEmail">
                        {{ detailGroupView.email }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="detailGroupView.parentGroup">
                        {{ detailGroupView.parentGroup.groupName }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-layout>
              </v-menu>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-menu
                bottom
                :ripple="false"
                left
                offset-y
                transition="scroll-y-transition"
                content-class="menu-action arrow-up"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text fab dense small v-bind="attrs" v-on="on">
                    <v-icon> mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list :ripple="false">
                  <!-- XEM -->
                  <v-btn
                    v-if="isShowViewAction(item.status)"
                    text
                    dark
                    block
                    @click="onGotoDetailTicket(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-view icon-size-24 white"></i>
                      <span class="text-capitalize ml-2">
                        {{ $t("tickets.labels.view") }}
                      </span>
                    </v-layout>
                  </v-btn>

                  <!-- GUI -->
                  <v-btn
                    v-if="isShowSendAction(item.status)"
                    text
                    dark
                    block
                    @click="onAcceptSend(item.id)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-send white"></i>
                      <span class="text-capitalize ml-2">
                        {{ $t("tickets.labels.send-ticket") }}
                      </span>
                    </v-layout>
                  </v-btn>

                  <!-- SUA -->
                  <v-btn
                    v-if="isShowEditAction(item.status)"
                    text
                    dark
                    block
                    @click="onShowDialogUpdateTicket(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-pencil icon-size-24 white"></i>
                      <span class="text-capitalize ml-2">
                        {{ $t("tickets.labels.edit") }}
                      </span>
                    </v-layout>
                  </v-btn>

                  <!-- XOA -->
                  <v-btn
                    v-if="isShowDeleteAction(item.status)"
                    text
                    dark
                    block
                    @click="onShowConfirmDelete(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-trash icon-size-24 white"></i>
                      <span class="text-capitalize ml-2">
                        {{ $t("tickets.labels.delete") }}
                      </span>
                    </v-layout>
                  </v-btn>

                  <!-- HUY -->
                  <v-btn
                    v-if="isShowCancelAction(item.status)"
                    text
                    dark
                    block
                    @click="onShowConfirmCancel(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-close white"></i>
                      <span class="text-capitalize ml-2">
                        {{ $t("tickets.labels.cancel") }}
                      </span>
                    </v-layout>
                  </v-btn>

                  <!-- DONG -->
                  <v-btn
                    v-if="isShowCloseAction(item.status)"
                    text
                    dark
                    block
                    @click="onShowConfirmClose(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-select-checked white"></i>
                      <span class="text-capitalize ml-2">
                        {{ $t("tickets.labels.ticket-close") }}
                      </span>
                    </v-layout>
                  </v-btn>

                  <!-- TU CHOI DONG -->
                  <v-btn
                    v-if="isShowRefuseCloseAction(item.status)"
                    text
                    dark
                    block
                    @click="onShowConfirmRefuseClose(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-outline-close white"></i>
                      <span class="text-capitalize ml-2">
                        {{ $t("tickets.labels.refused-close") }}
                      </span>
                    </v-layout>
                  </v-btn>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </div>
    <dialog-create-ticket
      v-model="isShowDialogAddNew"
      :category-id="detailSelected ? detailSelected.ticketCateId : null"
      :types-ticket="typesTicket"
      :is-update="isUpdateItemSelected"
      :detail-ticket="detailSelected"
      @reload-list="getList"
      @reload-advance-list="reloadAdvanceList"
    />

    <dialog-update-process
      v-model="showDialogProcess"
      :data-process="dataProcess"
      @change-process="changeProcess"
    />

    <base-preload :dialog="loading" />

    <!-- xoa yeu cau -->
    <DialogConfirm
      v-model="showDialogConfirmDelete"
      :message="$t('tickets.messages.delete-confirm')"
      @on-accept="onAcceptDelete"
      @on-cancel="onCancelDelete"
    />

    <!-- huy yeu cau -->
    <DialogConfirm
      v-model="showDialogConfirmCancel"
      :message="$t('tickets.messages.cancel-confirm')"
      @on-accept="onAcceptCancel"
      @on-cancel="onCancelCancel"
    />

    <!-- dong yeu cau -->
    <DialogConfirm
      v-model="showDialogConfirmClose"
      :message="$t('tickets.messages.ticket-close-confirm')"
      :warning-msg="$t('tickets.messages.warning-ticket-close-confirm')"
      @on-accept="onAcceptClose"
      @on-cancel="onCancelClose"
    />

    <!-- tu choi dong -->
    <DialogConfirm
      v-model="showDialogConfirmRefuseClose"
      :message="$t('tickets.messages.refuse-close-confirm')"
      :warning-msg="$t('tickets.messages.warning-refuse-close-confirm')"
      @on-accept="onAcceptRefuseClose"
      @on-cancel="onCancelRefuseClose"
    />

    <!-- hoan thanh -->
    <DialogConfirmComplete
      v-model="showDialogConfirmComplete"
      :message="$t('tickets.messages.complete-ticket-confirm')"
      @on-accept="onAcceptComplete"
    />
  </div>
</template>

<script>
// components
import HeaderListTicket from "@/modules/ticket/views/components/HeaderListTicket";
import EmptyBox from "@/views/components/EmptyBox";
import DialogCreateTicket from "@/modules/ticket/views/components/create-ticket/DialogCreateTicket";
import DialogUpdateProcess from "@/modules/ticket/views/components/DialogUpdateProcess";
import PopupUserInfoViewHover from "@/modules/ticket/views/components/PopupUserInfoViewHover";
import DialogConfirm from "@/modules/ticket/views/components/DialogConfirm";
import DialogConfirmComplete from "@/modules/ticket/views/components/DialogConfirmComplete";

// libs
import mixinListUpdateProgress from "@/modules/ticket/mixins/mixinListUpdateProgress";
import mixinListActionComplete from "@/modules/ticket/mixins/mixinListActionComplete";
import {
  formatDate,
  definedStatus,
  secondsToHm,
  getDiffTimeToNow,
  getEstDateTimeFromStartAndHour,
  getTextTruncate,
  FORMAT_DATE_TIME_TICKET,
  definedTicketDetailRedirect,
  PAGE_SIZE,
  PAGE_SIZE_GROUP_VIEW_MORE,
} from "@/modules/ticket/helpers/ticketUtils";
// import moment from "moment";
import { mapActions } from "vuex";
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import { FormUtils } from "@/helpers/formUtils";
import routePaths from "@/modules/ticket/router/routePaths";
import constants from "@/constants";
import { mapState } from "vuex";
import mixinListTicketCheckStatus from "@/modules/ticket/mixins/mixinListTicketCheckStatus";
import mixinActions from "./mixins/mixinActions";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";
import { CategoryService } from "@/modules/ticket/services/categoryService";
import { GroupService } from "@/services/groupService";
import { StorageService } from "@/modules/ticket/services/storageService";

const initForm = {
  name: "",
  status: null,
  dates: [],
};

export default {
  name: "MyRequest",
  components: {
    HeaderListTicket,
    DialogCreateTicket,
    EmptyBox,
    DialogUpdateProcess,
    PopupUserInfoViewHover,
    DialogConfirm,
    DialogConfirmComplete,
  },
  mixins: [
    mixinStatusAndPriority,
    mixinListUpdateProgress,
    mixinListTicketCheckStatus,
    mixinActions,
    mixinListActionComplete,
  ],
  props: {
    detail: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      formSearch: { ...initForm },
      tableType: "list",
      lstTickets: [],
      typesTicket: [],
      page: 1,
      totalCount: 0,
      isStateLate: false,
      estTimeView: "",
      // Datatable
      headers: [
        {
          text: "ID",
          sortable: false,
          value: "id",
          cellClass: "cell-ticket-id",
          class: "text--body-5 gray--text",
          width: "6%",
        },
        {
          text: this.$t("tickets.labels.ticket-name"),
          value: "name",
          sortable: false,
          class: "text--body-5 gray--text",
        },
        {
          text: this.$t("tickets.labels.status"),
          value: "status",
          sortable: false,
          class: "text--body-5 gray--text",
          width: "18%",
        },
        {
          text: this.$t("tickets.labels.process"),
          value: "progress",
          sortable: false,
          class: "text--body-5 gray--text",
          width: "10%",
        },
        {
          text: this.$t("tickets.labels.priority"),
          value: "priority",
          sortable: false,
          align: "center",
          class: "text--body-5 gray--text",
          width: "10%",
        },
        {
          text: this.$t("tickets.labels.ticket-type"),
          value: "ticketCateName",
          sortable: false,
          class: "text--body-5 gray--text",
          width: "15%",
        },
        {
          text: this.$t("tickets.labels.perform"),
          value: "userName",
          sortable: false,
          align: "center",
          class: "text--body-5 gray--text",
          width: "10%",
        },
        {
          text: this.$t("tickets.labels.group"),
          value: "groupName",
          sortable: false,
          class: "text--body-5 gray--text",
          width: "12%",
        },
        {
          text: this.$t("tickets.labels.actions"),
          sortable: false,
          value: "action",
          align: "center",
          width: "10%",
        },
      ],
      loading: false,
      isShowDialogAddNew: false,
      timeoutOnScroll: null,
      detailGroupView: null,
      activeIndex: null,
      performerName: [],
      performGroupName: [],
      followerName: [],
      statusValue: [],
      deadlineValue: null,
      priorityValue: null,
      isClearData: false,
      onReloadData: true,
      loadingPage: null,
      settingHeaders: [
        {
          text: "tickets.labels.status",
          value: "status",
          icon: "icon-circle",
          active: true,
        },
        {
          text: "tickets.labels.duration",
          value: "duration",
          icon: "icon-calendar",
          active: true,
        },
        {
          text: "tickets.labels.process",
          value: "process",
          icon: "icon-progress",
          active: true,
        },
        {
          text: "tickets.labels.priority",
          value: "priority",
          icon: "icon-flash",
          active: true,
        },
        {
          text: "tickets.labels.ticket-type",
          value: "ticket-type",
          icon: "icon-folder-open",
          active: true,
        },
        {
          text: "tickets.labels.perform",
          value: "perform",
          icon: "icon-personal",
          active: true,
        },
        {
          text: "tickets.labels.perform-group",
          value: "perform-group",
          icon: "icon-building",
          active: true,
        },
      ],
    };
  },
  computed: {
    ...mapState("layout", ["userInfo"]),
    computedHeightTable() {
      const box = document.getElementById("virtual-scroll-table");
      return box.offsetHeight;
    },
    countListTickets() {
      return this.lstTickets.length;
    },
    isLoadMore() {
      return this.countListTickets < this.totalCount;
    },
    hasTypesTicketActive() {
      return this.typesTicket.length === 0;
    },
    hasDetailGroupEmail() {
      return typeof this.detailGroupView.email !== "undefined";
    },
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    async initData() {
      await this.findTicketCategoryActive();
      this.getListFollower();
      // this.getListCompleTime();
      this.getFullList();
    },
    onAcceptConfirm() {
      this.statusValue = [];
    },
    async findTicketCategoryActive() {
      try {
        const response = await CategoryService.findTicketCategoryActive({});
        if (response) {
          this.typesTicket = response.data;
        } else {
          this.typesTicket = [];
        }
      } catch (error) {
        console.log(error);
      }
    },

    reloadAdvanceList() {
      this.isClearData = false;
    },
    async getList() {
      try {
        // this.loading = true;
        this.isClearData = true;
        const pars = this.bindRequestPars();
        const response = await TicketService.findCreateTicket(pars);
        if (response && response.data.totalCount > 0) {
          this.totalCount = response.data.totalCount;
          if (this.page > 1) {
            this.lstTickets = this.lstTickets.concat(response.data.data);
          } else {
            this.lstTickets = response.data.data;
          }
        } else {
          this.lstTickets = [];
          this.totalCount = 0;
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
    async getFullList() {
      const pars = {
        pageSize: PAGE_SIZE_GROUP_VIEW_MORE,
      };
      const response = await TicketService.findCreateTicket(pars);
      response.data.data.forEach((x) => {
        if (x.userName) {
          this.performerName.push({
            id: x.id,
            name: x.userName,
          });
        }
        if (x.groupName) {
          this.performGroupName.push({
            id: x.groupId,
            name: x.groupName,
          });
        }
      });
    },
    async getListFollower() {
      this.followerName = await StorageService.getAllUserOfDomain();
    },
    async getListAdvanceSearch() {
      try {
        // this.loading = true;
        const pars = this.bindRequestPars();
        const response = await TicketService.advanceSearchMyRequest(pars);
        if (response && response.data.totalCount > 0) {
          this.totalCount = response.data.totalCount;
          if (this.page > 1) {
            this.lstTickets = this.lstTickets.concat(response.data.data);
          } else {
            this.lstTickets = response.data.data;
          }
        } else {
          this.lstTickets = [];
          this.totalCount = 0;
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
    bindRequestPars() {
      const pars = {
        page: this.page,
        pageSize: PAGE_SIZE,
      };

      if (this.formSearch.name && FormUtils.isOriginal(this.formSearch.name)) {
        pars["id"] = parseInt(this.formSearch.name);
      } else if (this.formSearch.name) {
        pars["name"] = this.formSearch.name;
      }

      if (this.formSearch.type) {
        pars["ticketCateId"] = this.formSearch.type;
      }

      if (this.formSearch.performerSelected) {
        pars["performUserIds"] = this.formSearch.performerSelected;
      }

      if (this.formSearch.performGroupSelected) {
        pars["performGroupName"] = this.formSearch.performGroupSelected;
      }

      if (this.formSearch.followerSelected) {
        pars["monitorUserIds"] = this.formSearch.followerSelected;
      }

      if (this.deadlineValue) {
        pars["completeType"] = this.deadlineValue;
      }

      if (this.formSearch.deadlineFrom) {
        pars["slaFromDate"] = this.formSearch.deadlineFrom;
      }

      if (this.formSearch.deadlineTo) {
        pars["slaToDate"] = this.formSearch.deadlineTo;
      }

      if (this.formSearch.createDateFrom && !this.deadlineValue) {
        pars["fromDate"] = this.formSearch.createDateFrom;
      }

      if (this.formSearch.createDateTo && !this.deadlineValue) {
        pars["toDate"] = this.formSearch.createDateTo;
      }

      if (this.priorityValue) {
        pars["priority"] = this.priorityValue;
      }

      if (this.statusValue && this.statusValue.length === 1) {
        pars["strStatus"] = this.statusValue[0];
      } else if (this.statusValue && this.statusValue.length > 1) {
        pars["strStatus"] = this.statusValue.join(",");
      }
      if (
        this.formSearch.status &&
        this.formSearch.status.length === 1 &&
        this.isCheckStatusAllNot(this.formSearch.status)
      ) {
        pars["status"] = this.formSearch.status[0];
      } else if (
        this.formSearch.status &&
        this.formSearch.status.length > 1 &&
        !this.statusValue
      ) {
        pars["strStatus"] = this.formSearch.status.join(",");
      }

      if (
        this.formSearch.dates &&
        this.formSearch.dates.length >= 2 &&
        (!this.formSearch.createDateFrom || !this.formSearch.createDateTo)
      ) {
        pars["fromDate"] = this.formSearch.dates[0];
        pars["toDate"] = this.formSearch.dates[1];
      }

      return pars;
    },
    isCheckStatusAllNot(arrCheck) {
      const arrAll = [definedStatus.all];
      var isSame =
        arrCheck.length === arrAll.length &&
        arrCheck.every((element, index) => {
          return element === arrAll[index];
        });
      return !isSame;
    },
    search() {
      this.page = 1;
      this.getList();
    },
    getStatus(value) {
      this.statusValue = value;
    },
    getDeadline(value) {
      this.deadlineValue = value;
    },
    getPriority(value) {
      this.priorityValue = value;
    },
    clearSearch() {
      this.formSearch = {};
      this.statusValue = null;
      this.deadlineValue = null;
      this.priorityValue = null;
    },
    advanceSearch() {
      this.page = 1;
      this.getListAdvanceSearch();
    },
    getTextTruncateView(val, size) {
      return getTextTruncate(val, size);
    },
    hasAttributeUserName(item) {
      return typeof item.userName !== "undefined";
    },
    // getTextDeallineByExpectEndDate(expectEndDate) {
    //   const currentDate = moment().format();
    //   const expectDate = moment(expectEndDate).format();
    //   const checkTime = moment(currentDate).diff(expectDate, "seconds");
    //   if (checkTime > 0) {
    //     return `<span style="color:red"> Trễ ${secondsToHm(checkTime)} </span>`;
    //   } else if (checkTime < 0) {
    //     return `Còn ${secondsToHm(Math.abs(checkTime))}`;
    //   }
    // },
    getTextDeallineByExpectEndDate(startDate, estDuration) {
      const expectEndDate = getEstDateTimeFromStartAndHour(
        startDate,
        estDuration
      );
      const time = getDiffTimeToNow(expectEndDate);
      if (time > 0) {
        return `<span style="color:red"> trễ ${secondsToHm(
          Math.abs(time)
        )}</span>`;
      } else if (time < 0) {
        return `còn ${secondsToHm(Math.abs(time))}`;
      }
    },
    isShowTextDealline(item) {
      return (
        typeof item.estDuration !== "undefined" &&
        typeof item.startDate !== "undefined"
      );
    },
    formatDateView(date) {
      return formatDate(date, FORMAT_DATE_TIME_TICKET);
    },
    showDialogAddNew() {
      this.detailSelected = null;
      this.isUpdateItemSelected = false;
      this.isShowDialogAddNew = true;
    },
    async getDetailGroupById(val) {
      const response = await GroupService.getDetailGroupById(val);
      if (response.success) {
        this.detailGroupView = response.data;
      }
    },
    onGotoDetailTicket(item) {
      if (this.isNoCreatedAndStatusDraft(item)) return;

      this.$router.push({
        path: routePaths.DETAIL_TICKET_PATH,
        query: {
          id: item.id,
          typeRedirect: definedTicketDetailRedirect.request,
        },
      });
    },
    isNoCreatedAndStatusDraft(data) {
      return (
        data.createUserId !== this.userInfo.userId &&
        data.status === definedStatus.draft
      );
    },
    onScroll(e) {
      this.timeoutOnScroll && clearTimeout(this.timeoutOnScroll);
      this.timeoutOnScroll = setTimeout(() => {
        const heightContent = document.querySelector(
          "#virtual-scroll-table > .v-data-table__wrapper tbody"
        ).offsetHeight;
        const heightHeader = 44;
        const scrollTop =
          heightHeader + heightContent - this.computedHeightTable;
        if (e.target.scrollTop >= scrollTop && this.isLoadMore) {
          this.page = this.page + 1;
          if (this.getListAdvanceSearch) {
            this.getList(this.loadingPage);
          }
          // this.getList();
        }
      }, 20);
    },
  },
};
</script>
