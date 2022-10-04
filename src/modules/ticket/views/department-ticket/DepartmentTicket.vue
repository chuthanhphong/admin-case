<template>
  <div class="container container-ticket py-0 px-6">
    <div class="d-flex align-center">
      <h5 class="title-page text-primary d-flex align-center">
        <span class="mr-3">{{
          $t("ticket-manager.menu.department-ticket")
        }}</span>
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
        <HeaderList
          :form-search="formSearch"
          :is-show-created-el="false"
          :is-show-performer-el="true"
          :is-show-perform-group-el="true"
          :is-show-follower-el="true"
          :is-show-request-unit-el="true"
          :disabled-create="hasTypesTicketActive"
          :groups-of-user="groupsOfUser"
          :setting-headers="settingHeaders"
          :lst-type="typesTicket"
          :lst-created="createUserName"
          :lst-performer="performerName"
          :lst-perform-group="performGroupName"
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

          <div v-else>
            <HeaderTable :headers="headers" />
            <div class="scroll-table-ticket-group overflow-y-auto">
              <div v-for="(item, index) in lstTickets" :key="index">
                <ChipUserView
                  :item="item"
                  :index="index"
                  :active-indexs="activeIndexs"
                  @on-click-toggle-chip="onClickToggleChip"
                />
                <BodyTableGroupByUser
                  :headers="headers"
                  :table-type="tableType"
                  :tickets-group-by-user="item"
                  :index-table="index"
                  :active-indexs="activeIndexs"
                  :form-search="formSearch"
                  @on-show-dialog-update-progress="onShowDialogUpdateProgress"
                  @on-show-confirm-complete="onShowConfirmComplete"
                />
              </div>
            </div>
          </div>
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
import HeaderList from "./components/HeaderList";
import DialogCreateTicket from "@/modules/ticket/views/components/create-ticket/DialogCreateTicket";
import EmptyBox from "@/views/components/EmptyBox";
import HeaderTable from "./components/HeaderTable";
import ChipUserView from "./components/ChipUserView";
import BodyTableGroupByUser from "./components/BodyTableGroupByUser";
import DialogUpdateProcess from "@/modules/ticket/views/components/DialogUpdateProcess";
import DialogConfirmComplete from "@/modules/ticket/views/components/DialogConfirmComplete";

// libs
import {
  definedStatus,
  selectGroupTicketType,
  PAGE_SIZE_GROUP,
  PAGE_SIZE_GROUP_VIEW_MORE,
} from "@/modules/ticket/helpers/ticketUtils";
import { mapActions } from "vuex";
import { FormUtils } from "@/helpers/formUtils";
import constants from "@/constants";
import mixinListUpdateProgress from "@/modules/ticket/mixins/mixinListUpdateProgress";
import mixinListActionComplete from "@/modules/ticket/mixins/mixinListActionComplete";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";
import { UserService } from "@/modules/ticket/services/userService";
import { GroupService } from "@/services/groupService";
import { CategoryService } from "@/modules/ticket/services/categoryService";
import { StorageService } from "@/modules/ticket/services/storageService";

const initForm = {
  name: "",
  status: definedStatus.all,
  dates: [],
  groupTicketSelected: selectGroupTicketType.receive,
  groupSelected: {},
};

export default {
  components: {
    HeaderList,
    DialogCreateTicket,
    EmptyBox,
    HeaderTable,
    ChipUserView,
    BodyTableGroupByUser,
    DialogUpdateProcess,
    DialogConfirmComplete,
  },
  mixins: [mixinListUpdateProgress, mixinListActionComplete],
  data() {
    return {
      formSearch: { ...initForm },
      tableType: "list",
      page: 1,
      totalCount: 0,

      // Datatable
      headers: [
        {
          text: "ID",
          value: "id",
          sortable: false,
          width: "6%",
        },
        {
          text: this.$t("tickets.labels.creator"),
          value: "createUserName",
          sortable: false,
          align: "center",
          width: "10%",
        },
        {
          text: this.$t("tickets.labels.ticket-name"),
          value: "name",
          sortable: false,
          width: "16%",
        },
        {
          text: this.$t("tickets.labels.status"),
          value: "status",
          sortable: false,
          width: "11%",
        },
        {
          text: this.$t("tickets.labels.process"),
          value: "progress",
          sortable: false,
          width: "12%",
        },
        {
          text: this.$t("tickets.labels.priority"),
          value: "priority",
          sortable: false,
          align: "center",
          width: "10%",
        },
        {
          text: this.$t("tickets.labels.ticket-type"),
          value: "ticketCateName",
          sortable: false,
          width: "14%",
        },
        {
          text: this.$t("tickets.labels.perform"),
          value: "userName",
          sortable: false,
          align: "center",
          width: "10%",
        },
        {
          text: this.$t("tickets.labels.group"),
          value: "groupName",
          sortable: false,
          width: "12%",
        },
      ],
      activeIndexs: [],
      typesTicket: [],
      lstTickets: [],
      groupsOfUser: [],

      allGroups: [],
      usersByGroupId: [],
      selectedItem: null,
      selectedItemIndex: null,
      loading: false,
      closeOnContent: false,
      isShowDialogAddNew: false,
      // action forward
      isShowDialogTreeView: false,
      selectedItemForward: null,
      menuModelAssign: [],
      lstOptionDeadline: [],
      createUserName: [],
      performerName: [],
      performGroupName: [],
      followerName: [],
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
    isLeaderGroupSearch() {
      const groupIds = this.findAdminGroupIds;
      if (groupIds && groupIds.length > 0) {
        return groupIds.includes(this.formSearch.groupSelected.groupId);
      }

      return false;
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
      await this.getGroupsByUserId();
      this.findTicketCategoryActive();
      this.getAllGroup();
      this.getListFollower();
      this.getListCompleTime();
      this.getFullList();
    },
    async findTicketCategoryActive() {
      const response = await CategoryService.findTicketCategoryActive({});
      if (response) {
        this.typesTicket = response.data;
      } else {
        this.typesTicket = [];
      }
    },
    async getGroupsByUserId() {
      try {
        const response = await GroupService.getGroupsByRoleOfUser();
        if (response) {
          this.groupsOfUser = response.data;
          this.formSearch.groupSelected = response.data[0];
          this.search();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getUsersByGroupId() {
      const response = await UserService.getUsersByGroupId();
      if (response) {
        this.usersByGroupId = response.data;
      }
    },
    async getAllGroup() {
      this.allGroups = await StorageService.getAllGroup();
    },
    async getList() {
      try {
        this.loading = true;
        const pars = this.bindRequestPars();
        let response = null;
        if (
          this.formSearch.groupTicketSelected === selectGroupTicketType.receive
        ) {
          response = await this.getTicketsOfPerformGroup(pars);
        } else if (
          this.formSearch.groupTicketSelected === selectGroupTicketType.send
        ) {
          response = await this.getTicketsOfCreatedGroup(pars);
        }

        if (response && response.data.totalCount > 0) {
          this.lstTickets = response.data.data;
          this.totalCount = response.data.totalCount;
          this.bindOpenAll();
        } else {
          this.lstTickets = [];
          this.totalCount = 0;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async getFullList() {
      const pars = {
        pageSize: PAGE_SIZE_GROUP_VIEW_MORE,
      };
      if (
        this.formSearch.groupTicketSelected === selectGroupTicketType.receive
      ) {
        pars["groupId"] = this.formSearch.groupSelected.groupId;
      } else if (
        this.formSearch.groupTicketSelected === selectGroupTicketType.send
      ) {
        pars["createGroupId"] = this.formSearch.groupSelected.groupId;
      }
      let response = null;
      if (
        this.formSearch.groupTicketSelected === selectGroupTicketType.receive
      ) {
        response = await this.getTicketsOfPerformGroup(pars);
      } else if (
        this.formSearch.groupTicketSelected === selectGroupTicketType.send
      ) {
        response = await this.getTicketsOfCreatedGroup(pars);
      }
      response.data.data.forEach((x) => {
        if (x.fullName) {
          this.performerName.push({
            id: x.id,
            name: x.fullName,
          });
        }
        x.ticketCustomDtos.forEach((y) => {
          if (y.groupName) {
            this.performGroupName.push({
              id: x.groupId,
              name: y.groupName,
            });
          }
          if (y.createUserName) {
            this.createUserName.push({
              id: y.createUserId,
              name: y.createUserName,
            });
          }
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
        this.loading = true;
        const pars = this.bindRequestPars();
        let response = null;
        if (
          this.formSearch.groupTicketSelected === selectGroupTicketType.receive
        ) {
          response = await TicketService.advanceSearchBelongGroup(pars);
        } else if (
          this.formSearch.groupTicketSelected === selectGroupTicketType.send
        ) {
          response = await TicketService.advanceSearchBelongCreateGroup(pars);
        }

        if (response && response.data.totalCount > 0) {
          this.lstTickets = response.data.data;
          this.totalCount = response.data.totalCount;
          this.bindOpenAll();
        } else {
          this.lstTickets = [];
          this.totalCount = 0;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    bindRequestPars() {
      const pars = {
        page: this.page,
        pageSize: PAGE_SIZE_GROUP,
      };

      if (
        this.formSearch.groupTicketSelected === selectGroupTicketType.receive
      ) {
        pars["groupIds"] = this.formSearch.groupSelected.groupId;
      } else if (
        this.formSearch.groupTicketSelected === selectGroupTicketType.send
      ) {
        pars["createGroupId"] = this.formSearch.groupSelected.groupId;
      }

      if (this.formSearch.name && FormUtils.isOriginal(this.formSearch.name)) {
        pars["id"] = parseInt(this.formSearch.name);
      } else if (this.formSearch.name) {
        pars["name"] = this.formSearch.name;
      }

      if (this.formSearch.type) {
        pars["ticketCateId"] = this.formSearch.type;
      }

      if (this.formSearch.createdSelected) {
        pars["createdUserIds"] = this.formSearch.createdSelected;
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

      if (this.formSearch.createDateFrom) {
        pars["fromDate"] = this.formSearch.createDateFrom;
      }

      if (this.formSearch.createDateTo) {
        pars["toDate"] = this.formSearch.createDateTo;
      }

      if (this.statusValue && this.statusValue.length === 1) {
        pars["strStatus"] = this.statusValue[0];
      } else if (this.statusValue && this.statusValue.length > 1) {
        pars["strStatus"] = this.statusValue.join(",");
      }

      if (this.priorityValue) {
        pars["priority"] = this.priorityValue;
      }

      if (
        this.formSearch.status &&
        this.formSearch.status.length > 0 &&
        this.isCheckStatusAllNot(this.formSearch.status) &&
        !this.statusValue.length
      ) {
        const status = [...this.formSearch.status];
        if (this.isLeaderGroupSearch && status.includes(definedStatus.draft)) {
          status.splice(0, 1);
        }

        pars["strStatus"] = status.join(",");
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
    async getTicketsOfPerformGroup(pars) {
      try {
        const response = await TicketService.findTicketsOfUserBelongGroup(pars);
        return response;
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      }
    },
    async getTicketsOfCreatedGroup(pars) {
      try {
        const response = await TicketService.findTicketsOfUserBelongCreateGroup(
          pars
        );
        return response;
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      }
    },
    bindOpenAll() {
      this.activeIndexs = [];
      this.lstTickets.forEach((item, index) => {
        this.activeIndexs.push(index);
      });
    },
    search() {
      this.page = 1;
      this.getList();
    },
    advanceSearch() {
      this.page = 1;
      this.getListAdvanceSearch();
    },
    clearSearch() {
      // this.formSearch = {};
      this.statusValue = null;
      this.deadlineValue = null;
      this.priorityValue = null;
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
    onClickToggleChip(index) {
      if (this.activeIndexs.includes(index)) {
        const idx = this.activeIndexs.findIndex((x) => x === index);
        this.activeIndexs.splice(idx, 1);
      } else {
        this.activeIndexs.push(index);
      }
    },
    showDialogAddNew() {
      this.isShowDialogAddNew = true;
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
  },
};
</script>
