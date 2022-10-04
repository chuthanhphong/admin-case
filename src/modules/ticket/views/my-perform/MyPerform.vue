<template>
  <div class="container container-ticket has-bg py-0 px-6">
    <div class="d-flex align-center">
      <h5 class="title-page text-primary d-flex align-center">
        <span class="mr-3">{{ $t("tickets.titles.my-perform") }}</span>
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
          :is-show-created-el="true"
          :is-show-performer-el="false"
          :is-show-perform-group-el="false"
          :is-show-follower-el="true"
          :setting-headers="settingHeaders"
          :lst-type="typesTicket"
          :lst-created="createUserName"
          :lst-follower="followerName"
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
            :fixed-header="true"
            :items="lstTickets"
            :no-data-text="$t('noData')"
            :class="`table-${tableType}`"
            :items-per-page="countListTickets"
          >
            <template v-slot:[`item.createUserName`]="{ item }">
              <v-layout justify-center align-center>
                <div class="pos-rel">
                  <v-hover v-slot="{ hover }">
                    <v-btn fab x-small color="primary">
                      <span class="white--text text-h6 text-uppercase">
                        {{ item.createUserName[0] }}
                      </span>
                      <PopupUserInfoViewHover
                        v-if="hover"
                        :user-info="item.createUserInfo"
                        :is-chevron-left="true"
                      />
                    </v-btn>
                  </v-hover>
                </div>
              </v-layout>
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <div class="box-ticket-name d-flex align-center">
                <div class="mr-4">
                  <div :class="tableType == 'list' ? 'd-none' : ''">
                    <b>
                      {{ item.id }}
                    </b>
                  </div>
                  <v-layout class="link">
                    <span class="text--body-5 task-name-hover text-ellipsis cursor-pointer" @click="onGotoDetailTicket(item)">
                      {{ getTextTruncateView(item.name, 30) }}
                    </span>
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
                <span v-if="isShowTextDealline(item)" v-html="getTextDeallineByExpectEndDate(item.startDate, item.estDuration)"></span>
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
            <template v-slot:[`item.priority`]="{ item }">
              <v-layout justify-center>
                <i
                  class="app-icon icon-flash"
                  :class="getColorByPriority(item.priority)"
                />
              </v-layout>
            </template>
            <template v-slot:[`item.ticketCateName`]="{ item }">
              {{ getTextTruncateView(item.ticketCateName, 15) }}
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-btn v-if="isDisableActions(item.status)" text fab dense small>
                <v-icon> mdi-dots-vertical</v-icon>
              </v-btn>
              <v-menu
                v-else
                bottom
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

                  <!-- HOAN THANH -->
                  <v-btn
                    v-if="isShowCompleteAction(item.status)"
                    text
                    dark
                    block
                    @click="onShowConfirmComplete(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-complete white"></i>
                      <span class="text-capitalize ml-2">
                        {{ $t("completed") }}
                      </span>
                    </v-layout>
                  </v-btn>

                  <!-- DOI NGUOI -->
                  <v-btn
                    v-if="isShowAssignerAction(item.status)"
                    text
                    dark
                    block
                    @click="onShowDialogAssigner(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-move-action white"></i>
                      <span class="text-capitalize ml-2">
                        {{ $t("tickets.labels.performer-change") }}
                      </span>
                    </v-layout>
                  </v-btn>

                  <!-- CHUYEN TIEP -->
                  <v-btn
                    v-if="isShowForwardAction(item.status)"
                    text
                    dark
                    block
                    @click="onShowDialogTreeView(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-move-action white"></i>
                      <span class="text-capitalize ml-2">
                        {{ $t("tickets.labels.forward") }}
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
      :types-ticket="typesTicket"
    />

    <dialog-update-process
      v-model="showDialogProcess"
      :data-process="dataProcess"
      @change-process="changeProcess"
    />
    <base-preload :dialog="loading" />

    <!-- dialog tree view -->
    <dialog-tree-view
      v-model="showDialogTreeView"
      :title="$t('tickets.labels.unit-request-perform')"
      :group-id="itemActionSelected ? itemActionSelected.groupId : null"
      :all-groups="allGroups"
      @selected-group="selectedForwardGroup"
      @on-cancel="onCloseDialogTreeView"
    />

    <!-- hoan thanh -->
    <DialogConfirmComplete
      v-model="showDialogConfirmComplete"
      :message="$t('tickets.messages.complete-ticket-confirm')"
      @on-accept="onAcceptComplete"
    />

    <!-- chuyen don vi -->
    <DialogConfirm
      v-model="showDialogConfirmForwardGroup"
      :message="`${$t('tickets.messages.forward-ticket-confirm')} [${
        groupSelectedForwardTicket ? groupSelectedForwardTicket.groupName : ''
      }] ${$t('tickets.messages.forward-ticket-confirm-2')}`"
      @on-accept="onAcceptForwardGroup"
    />

    <DialogAssigner
      v-model="showDialogAssigner"
      :users-by-group-id="usersByGroupIdForAssigner"
      @assign-to="updateAssignTo"
    />
  </div>
</template>

<script>
// components
import HeaderListTicket from "@/modules/ticket/views/components/HeaderListTicket";
import DialogCreateTicket from "@/modules/ticket/views/components/create-ticket/DialogCreateTicket";
import EmptyBox from "@/views/components/EmptyBox";
import DialogUpdateProcess from "@/modules/ticket/views/components/DialogUpdateProcess";
import PopupUserInfoViewHover from "@/modules/ticket/views/components/PopupUserInfoViewHover";
import DialogConfirmComplete from "@/modules/ticket/views/components/DialogConfirmComplete";
import DialogConfirm from "@/modules/ticket/views/components/DialogConfirm";
import DialogTreeView from "@/modules/ticket/views/components/DialogTreeView.vue";
import DialogAssigner from "./components/DialogAssigner";

// libs
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import mixinListUpdateProgress from "@/modules/ticket/mixins/mixinListUpdateProgress";
import mixinListActionComplete from "@/modules/ticket/mixins/mixinListActionComplete";
import {
  formatDate,
  definedStatus,
  secondsToHm,
  getDiffTimeToNow,
  getEstDateTimeFromStartAndHour,
  getTextTruncate,
  definedTicketDetailRedirect,
  FORMAT_DATE_TIME_TICKET,
  PAGE_SIZE,
  PAGE_SIZE_GROUP_VIEW_MORE,
} from "@/modules/ticket/helpers/ticketUtils";
// import moment from "moment";
import { mapActions } from "vuex";
import { FormUtils } from "@/helpers/formUtils";
import constants from "@/constants";
import routePaths from "@/modules/ticket/router/routePaths";
import { mapState } from "vuex";
import mixinListTicketCheckStatus from "@/modules/ticket/mixins/mixinListTicketCheckStatus";
import mixinActions from "./mixins/mixinActions";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";
import { CategoryService } from "@/modules/ticket/services/categoryService";
import { StorageService } from "@/modules/ticket/services/storageService";

const initForm = {
  name: "",
  status: definedStatus.all,
  dates: [],
};

export default {
  components: {
    HeaderListTicket,
    DialogCreateTicket,
    EmptyBox,
    DialogUpdateProcess,
    PopupUserInfoViewHover,
    DialogConfirmComplete,
    DialogConfirm,
    DialogTreeView,
    DialogAssigner,
  },
  mixins: [
    mixinStatusAndPriority,
    mixinListUpdateProgress,
    mixinListTicketCheckStatus,
    mixinActions,
    mixinListActionComplete,
  ],
  data() {
    return {
      formSearch: { ...initForm },
      initFromData: {
        name: "",
      },
      tableType: "list",
      page: 1,
      totalCount: 0,
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
          text: this.$t("tickets.labels.creator"),
          value: "createUserName",
          sortable: false,
          align: "center",
          class: "text--body-5 gray--text",
          width: "8%",
        },
        {
          text: this.$t("tickets.labels.ticket-name"),
          value: "name",
          sortable: false,
          class: "text--body-5 gray--text",
          width: "10%"
        },
        {
          text: this.$t("tickets.labels.status"),
          value: "status",
          sortable: false,
          class: "text--body-5 gray--text",
          width: "16%",
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
          text: this.$t("tickets.labels.actions"),
          value: "action",
          sortable: false,
          align: "center",
          class: "text--body-5 gray--text",
          width: "10%",
        },
      ],
      lstOptionDeadline: [],
      typesTicket: [],
      createUserName: [],
      followerName: [],
      lstTickets: [],
      usersByGroupId: [],
      selectedItem: null,
      selectedItemIndex: null,
      loading: false,
      isShowDialogAddNew: false,
      timeoutOnScroll: null,
      menuModelAssign: [],
      statusValue: [],
      deadlineValue: null,
      priorityValue: null,

      settingHeaders: [
        {
          text: "tickets.labels.creator",
          value: "creator",
          icon: "icon-user-plus",
          active: true,
        },
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
  },
  watch: {
    menuModelAssign(menuOpen) {
      const val = menuOpen[this.selectedItemIndex];
      if (!val) {
        this.onDeactiveStateActionAssign();
      }
    },
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    async initData() {
      await this.findTicketCategoryActive();
      this.getAllGroup();
      this.getUsersFromGroupId();
      this.getListFollower();
      this.getListCompleTime();
      this.getFullList();
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
    async getList() {
      try {
        // this.loading = true;
        const pars = this.bindRequestPars();
        const response = await TicketService.findPerformTicket(pars);
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
      const response = await TicketService.findPerformTicket(pars);
      response.data.data.forEach((x) => {
        this.createUserName.push({
          id: x.createUserId,
          name: x.createUserName,
        });
      });
    },
    async getListFollower() {
      this.followerName = await StorageService.getAllUserOfDomain();
    },
    async getListCompleTime() {
      const response = await TicketService.getListCompleteTime();
      response.data.forEach((x) => {
        this.lstOptionDeadline.push({
          name: x.name,
          value: x.value,
          isClicked: false,
        });
      });
    },
    async getListAdvanceSearch() {
      try {
        // this.loading = true;
        const pars = this.bindRequestPars();
        const response = await TicketService.advanceSearchMyPerform(pars);
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

      if (this.statusValue && this.statusValue.length === 1) {
        pars["strStatus"] = this.statusValue[0];
      } else if (this.statusValue && this.statusValue.length > 1) {
        pars["strStatus"] = this.statusValue.join(",");
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

      if (this.formSearch.createdSelected) {
        pars["createdUserIds"] = this.formSearch.createdSelected;
      }

      if (this.formSearch.followerSelected) {
        pars["monitorUserIds"] = this.formSearch.followerSelected;
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
        !this.statusValue.length
      ) {
        pars["strStatus"] = this.formSearch.status.join(",");
      }

      if (
        this.formSearch.dates &&
        this.formSearch.dates.length >= 2 &&
        (!this.formSearch.createDateFrom || !this.formSearch.createDateTo) &&
        !this.deadlineValue
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
    hasAttributeExpectEndDate(item) {
      return typeof item.expectEndDate !== "undefined";
    },
    // getTextDeallineByExpectEndDate(expectEndDate) {
    //   const currentDate = moment().format();
    //   const expectDate = moment.utc(expectEndDate).local().format();
    //   const checkTime = moment(currentDate).diff(expectDate, "seconds");
    //   if (checkTime > 0) {
    //     return `<span style="color:red"> Trễ ${secondsToHm(checkTime)}`;
    //   } else if (checkTime < 0) {
    //     return `Còn ${secondsToHm(Math.abs(checkTime))}`;
    //   }
    // },
    getTextDeallineByExpectEndDate(startDate, estDuration) {
      const expectEndDate = getEstDateTimeFromStartAndHour(
        startDate,
        estDuration,
      );
      const time = getDiffTimeToNow(expectEndDate);
      if (time > 0) {
        return `<span style="color:red"> trễ ${secondsToHm(Math.abs(time))}</span>`
      } else if (time < 0) {
        return `còn ${secondsToHm(Math.abs(time))}`
      }
    },
    isShowTextDealline(item) {
      return typeof item.estDuration !== "undefined" && typeof item.startDate !== "undefined";
    },
    formatDateView(date) {
      return formatDate(date, FORMAT_DATE_TIME_TICKET);
    },
    showDialogAddNew() {
      this.isShowDialogAddNew = true;
    },
    onDeactiveStateActionAssign() {
      this.selectedItem = null;
      this.selectedItemIndex = null;
    },
    onGotoDetailTicket(item) {
      if (this.isNoCreatedAndStatusDraft(item)) return;

      this.$router.push({
        path: routePaths.DETAIL_TICKET_PATH,
        query: {
          id: item.id,
          typeRedirect: definedTicketDetailRedirect.perform,
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
          this.getList();
        }
      }, 20);
    },
  },
};
</script>
