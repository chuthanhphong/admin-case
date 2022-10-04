<template>
  <div class="container container-ticket has-bg py-0 px-6">
    <div class="d-flex align-center">
      <h5 class="title-page text-primary d-flex align-center">
        <span class="mr-3">{{ $t("tickets.titles.task-center") }}</span>
        <span>({{ totalCount }})</span>
        <div class="px-2">
          <v-btn fab icon x-small @click="tableType = 'list'">
            <i
              :class="tableType == 'list' ? 'primary' : 'gray'"
              class="app-icon icon-list"
            />
          </v-btn>
          <v-btn fab icon x-small @click="tableType = 'card'">
            <i
              :class="tableType != 'list' ? 'primary' : 'gray'"
              class="app-icon icon-card"
            />
          </v-btn>
        </div>
      </h5>
    </div>
    <div class="wrap-category-ticket">
      <v-card class="rounded-xl py-6">
        <HeaderList
          :disabled-create="hasTypesTicketActive"
          :form-search="formSearch"
          :groups-by-user-id="groupsByUserId"
          :is-show-created-el="true"
          :is-show-follower-el="true"
          :is-show-task-center-el="true"
          :lst-created="createUserName"
          :lst-follower="followerName"
          :lst-type="typesTicket"
          :setting-headers="settingHeaders"
          :total-count="totalCount"
          @search="search"
          @get-deadline="getDeadline"
          @get-priority="getPriority"
          @advance-search="advanceSearch"
          @clear-search="clearSearch"
          @show-dialog-add-new="showDialogAddNew"
          @on-change-group="onChangeGroup"
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
            :class="`table-${tableType}`"
            :fixed-header="true"
            :headers="headers"
            :items="lstTickets"
            :items-per-page="countListTickets"
            :no-data-text="$t('noData')"
            hide-default-footer
          >
            <template v-slot:[`item.createUserName`]="{ item }">
              <v-layout align-center justify-center>
                <div class="pos-rel">
                  <v-hover v-slot="{ hover }">
                    <v-btn color="primary" fab x-small>
                      <span class="white--text text-h6 text-uppercase">
                        {{ item.createUserName[0] }}
                      </span>
                      <PopupUserInfoViewHover
                        v-if="hover"
                        :is-chevron-left="true"
                        :user-info="item.createUserInfo"
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
                      <img alt="" src="@/assets/icons/icon-parent.svg" />
                      <span class="greya7--text">{{ item.amountTask }}</span>
                    </div>
                  </v-layout>
                  <div class="text--overlined greya7--text">
                    {{ formatDateView(item.createdDate) }}
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:[`item.expectEndDate`]="{ item }">
              <v-layout
                v-if="hasAttributeExpectEndDate(item)"
                align-center
                justify-center
              >
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
                  :class="getColorByPriority(item.priority)"
                  class="app-icon icon-flash"
                />
              </v-layout>
            </template>
            <template v-slot:[`item.ticketCateName`]="{ item }">
              {{ getTextTruncateView(item.ticketCateName, 15) }}
            </template>
            <template v-slot:[`item.perform`]="{ item, index }">
              <v-menu
                :key="item.id"
                v-model="menuModelAssign[index]"
                :close-on-content-click="closeOnContent"
                bottom
                left
                max-width="300"
                offset-x
                origin="center center"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :color="getColorActionAssign(item)"
                    class="border-dashed-2"
                    fab
                    outlined
                    v-bind="attrs"
                    x-small
                    @click="bindSelectedItem(item, index)"
                    v-on="on"
                  >
                    <i
                      :class="getColorActionAssign(item)"
                      class="app-icon icon-personal"
                    />
                  </v-btn>
                </template>
                <assign-user
                  :users-by-group-id="usersByGroupId"
                  @assign-to="updateAssignTo"
                />
              </v-menu>
            </template>
            <template v-slot:[`item.move`]="{ item }">
              <v-menu
                :close-on-content-click="closeOnContent"
                background-opacity="1"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :color="getColorActionForward(item)"
                    class="border-dashed-2"
                    fab
                    outlined
                    v-bind="attrs"
                    x-small
                    @click="onShowDialogTreeView(item)"
                    @dblclick="onDeactiveStateActionForward"
                    v-on="on"
                  >
                    <i
                      :class="getColorActionForward(item)"
                      class="app-icon icon-move-action icon-size-20"
                    />
                  </v-btn>
                </template>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </div>
    <!-- dialog tree view -->
    <dialog-tree-view
      v-model="isShowDialogTreeView"
      :all-groups="allGroups"
      :group-id="selectedItemForward ? selectedItemForward.groupId : null"
      :title="$t('tickets.labels.unit-request-perform')"
      @selected-group="selectedGroup"
      @on-cancel="onDeactiveStateActionForward"
    />

    <dialog-create-ticket
      v-model="isShowDialogAddNew"
      :types-ticket="typesTicket"
    />
    <base-preload :dialog="loading" />
  </div>
</template>

<script>
// components
import HeaderList from "./components/HeaderList";
import AssignUser from "./components/AssignUser";
import DialogTreeView from "@/modules/ticket/views/components/DialogTreeView.vue";
import DialogCreateTicket from "@/modules/ticket/views/components/create-ticket/DialogCreateTicket";
import EmptyBox from "@/views/components/EmptyBox";
import PopupUserInfoViewHover from "@/modules/ticket/views/components/PopupUserInfoViewHover";

// libs
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import {
  definedStatus,
  definedTicketDetailRedirect,
  FORMAT_DATE_TIME_TICKET,
  formatDate,
  getDiffTimeToNow,
  getEstDateTimeFromStartAndHour,
  getTextTruncate,
  PAGE_SIZE,
  PAGE_SIZE_GROUP_VIEW_MORE,
  secondsToHm,
} from "@/modules/ticket/helpers/ticketUtils";
// import moment from "moment";
import { mapActions, mapState } from "vuex";
import { FormUtils } from "@/helpers/formUtils";
import constants from "@/constants";
import routePaths from "@/modules/ticket/router/routePaths";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";
import { UserService } from "@/modules/ticket/services/userService";
import { GroupService } from "@/services/groupService";
import { CategoryService } from "@/modules/ticket/services/categoryService";
import { StorageService } from "@/modules/ticket/services/storageService";

const initForm = {
  name: "",
  groupSelected: {},
};

export default {
  components: {
    HeaderList,
    AssignUser,
    DialogTreeView,
    DialogCreateTicket,
    EmptyBox,
    PopupUserInfoViewHover,
  },
  mixins: [mixinStatusAndPriority],
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
          width: "10%",
        },
        {
          text: this.$t("tickets.labels.ticket-name"),
          value: "name",
          sortable: false,
          class: "text--body-5 gray--text",
        },
        {
          text: this.$t("tickets.labels.processing-deadline"),
          align: "center",
          value: "expectEndDate",
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
          value: "perform",
          sortable: false,
          align: "center",
          class: "text--body-5 gray--text",
          width: "10%",
        },
        {
          text: this.$t("tickets.labels.move"),
          value: "move",
          sortable: false,
          align: "center",
          class: "text--body-5 gray--text",
          width: "10%",
        },
      ],

      typesTicket: [],
      lstTickets: [],
      allGroups: [],
      usersByGroupId: [],
      groupsByUserId: [],

      selectedItem: null,
      selectedItemIndex: null,
      loading: false,
      closeOnContent: false,
      isShowDialogAddNew: false,
      // action forward
      isShowDialogTreeView: false,
      selectedItemForward: null,
      timeoutOnScroll: null,
      menuModelAssign: [],
      lstOptionDeadline: [],
      createUserName: [],
      followerName: [],
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
          text: "tickets.labels.duration",
          value: "duration",
          icon: "icon-calendar",
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
    groupsByUserIdLength() {
      return this.groupsByUserId.length;
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
      this.getList();
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
    async getGroupsByUserId() {
      const response = await GroupService.getGroupsByUserId();
      if (response) {
        this.groupsByUserId = response.data;
        const arrCheckRole = response.data
        arrCheckRole.filter(group => {
          if (group.roleType === 'MAIN') {
            this.formSearch.groupSelected = group
          }
        })
        this.getUsersFromGroupId();
      }
    },
    async getList() {
      try {
        // this.loading = true;
        const pars = this.bindRequestPars();
        const response = await TicketService.findTicketEmploy(pars);
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
        groupId: this.formSearch.groupSelected.groupId,
      };
      const response = await TicketService.findTicketEmploy(pars);
      response.data.data.forEach((x) => {
        if (x.createUserName) {
          this.createUserName.push({
            id: x.createUserId,
            name: x.createUserName,
          });
        }
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
        const response = await TicketService.advanceSearchTaskCenter(pars);
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
        groupId: this.formSearch.groupSelected.groupId,
      };

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

      return pars;
    },
    async getUsersFromGroupId() {
      try {
        const pars = { id: this.formSearch.groupSelected.groupId };
        const response = await UserService.getUsersFromGroupId(pars);
        if (response) {
          this.usersByGroupId = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getAllGroup() {
      this.allGroups = await StorageService.getAllGroup();
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
      this.formSearch = {};
      this.deadlineValue = null;
      this.priorityValue = null;
    },
    onChangeGroup() {
      this.getUsersFromGroupId();
      this.search();
      this.getFullList();
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
    //     return `<span class="error--text">Trễ ${secondsToHm(checkTime)}</span>`;
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
      this.isShowDialogAddNew = true;
    },
    bindSelectedItem(val, index) {
      this.selectedItem = val;
      this.selectedItemIndex = index;
      this.closeOnContent = false;
    },
    getColorActionAssign(val) {
      return this.selectedItem && val.id === this.selectedItem.id
        ? "primary"
        : "darken";
    },
    onDeactiveStateActionAssign() {
      this.selectedItem = null;
      this.selectedItemIndex = null;
    },
    getColorActionForward(val) {
      return this.selectedItemForward && val.id === this.selectedItemForward.id
        ? "primary"
        : "darken";
    },
    onDeactiveStateActionForward() {
      this.selectedItemForward = null;
      this.isShowDialogTreeView = false;
    },
    onClickOutsideForward() {
      this.onDeactiveStateActionForward();
    },
    onClearableGroup(val) {
      if (!val) {
        this.selectedItemForward = null;
      }
    },
    async updateAssignTo(val) {
      this.closeOnContent = true;
      try {
        this.loading = true;
        const pars = {
          id: this.selectedItem.id,
          note: this.$t("tickets.messages.forward-user"),
          userId: val.userId,
        };
        await TicketService.forwardTicketUser(pars);
        this.getList();
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
        this.selectedItem = null;
        this.loading = false;
      }
    },
    // action forward
    async selectedGroup(val) {
      this.closeOnContent = true;
      try {
        this.loading = true;
        if (this.selectedItemForward.groupId !== val[0].groupId) {
          const pars = {
            id: this.selectedItemForward.id,
            note: this.$t("tickets.messages.forward-group"),
            groupId: val[0].groupId,
          };
          await TicketService.forwardTicketGroup(pars);
          this.getList();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.forward-group-success",
          });
        } else {
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.ERROR,
            content: "tickets.messages.forward-group-seft",
          });
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.selectedItemForward = null;
        this.loading = false;
      }
    },
    getDeadline(value) {
      this.deadlineValue = value;
    },
    getPriority(value) {
      this.priorityValue = value;
    },
    onShowDialogTreeView(val) {
      this.selectedItemForward = val;
      this.isShowDialogTreeView = true;
      this.closeOnContent = false;
    },
    onGotoDetailTicket(item) {
      if (this.isNoCreatedAndStatusDraft(item)) return;

      this.$router.push({
        path: routePaths.DETAIL_TICKET_PATH,
        query: { id: item.id, typeRedirect: definedTicketDetailRedirect.task },
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
