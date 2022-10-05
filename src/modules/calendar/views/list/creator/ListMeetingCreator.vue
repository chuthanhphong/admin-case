<template>
  <div class="calendar-font wrap-content-calendar-search">
    <SearchDocument
      v-show="showListData"
      :formdata="formdata"
      :search="quickSearch"
      @show-dialog-save="showDialogSave"
      @advance-search="advanceSearch"
    />
    <div v-if="showListData" class="calendar-content-list mt-4">
      <div
        v-if="lstMeeting.length == 0"
        class="col-md-5 col-12 mx-auto wrap-empty-list"
      >
        <empty-box-edocument :loading="loading" />
      </div>
      <div v-else>
        <v-data-table
          id="virtual-scroll-table-creator"
          v-scroll:#virtual-scroll-table-creator="onScroll"
          hide-default-footer
          fixed-header
          :no-data-text="$t('noData')"
          :headers="headers"
          :items="lstMeeting"
          :items-per-page="countListMeeting"
          :class="{ 'disable-hover': activeIndex != null }"
        >
          <!-- thoi gian hop -->
          <template v-slot:item="{ item, index }">
            <tr>
              <td class="text-center" @click="onDetailMeeting(item)">
                {{ genDateTime(item) }}
              </td>
              <td class="text-center">
                <v-icon color="#000">mdi-circle-medium</v-icon>
              </td>
              <!-- dia diem -->
              <td class="text-left">
                <div
                  v-if="
                    item.meetingRooms.length > 0 && item.meetingRooms[0].name
                  "
                >
                  {{ item.meetingRooms[0].name }}
                </div>
              </td>
              <!-- ten lich -->
              <td class="text-left name-meeting" @click="onDetailMeeting(item)">
                {{ item.title }}
              </td>
              <!-- trang thai -->
              <td class="text-left" @click="onDetailMeeting(item)">
                <span v-html="calendarStatus(item.status)"></span>
              </td>
              <!-- Chu tri -->
              <td class="text-left">
                <div class="group-avatar-signer">
                  <div class="group-avatar d-flex align-center">
                    <avatar-signer
                      :lst-colors="lstColors"
                      :item="item.chairman"
                      :index-row="index"
                      class="list-signer"
                    />
                    <span class="render-signer-name">
                      {{ renderGroupName(item.chairman) }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- tham gia -->
              <td
                class="text-left link-hover"
                :class="{ 'popup-acvite': activeIndex == index }"
              >
                <div
                  v-if="item.participants.length === 1"
                  class="group-avatar-signer"
                >
                  <popup-signer
                    :list-show-popup="listShowPopup"
                    :lst-colors="lstColors"
                    :item="item"
                    :active-index="activeIndex"
                    :index="index"
                    @close-popup-signer="closePopupSigner"
                  />
                  <div class="group-avatar d-flex align-center">
                    <avatar-signer
                      :lst-colors="lstColors"
                      :item="item.participants[0]"
                      :index-row="index"
                      class="list-signer"
                      @active-show-popup-signer="activeShowPopupSigner"
                    />
                    <span class="render-signer-name">
                      {{ renderGroupName(item.participants[0]) }}
                    </span>
                  </div>
                </div>

                <div v-else class="group-avatar-signer">
                  <popup-signer
                    :list-show-popup="listShowPopup"
                    :lst-colors="lstColors"
                    :item="item"
                    :active-index="activeIndex"
                    :index="index"
                    @close-popup-signer="closePopupSigner"
                  />
                  <div class="group-avatar d-flex align-center">
                    <list-avatar-signer
                      :lst-colors="lstColors"
                      :item="item"
                      :index-row="index"
                      class="list-signer"
                      @active-show-popup-signer="activeShowPopupSigner"
                    />
                    <v-avatar
                      v-if="item.participants.length > 5"
                      size="32"
                      :color="lstColors[4]"
                      class="signer"
                      @click="activeShowPopupSigner(index)"
                    >
                      <span class="text-uppercase white--text">
                        {{ item.participants.length - 4 }}+
                      </span>
                    </v-avatar>
                  </div>
                </div>
              </td>

              <!-- Thao tac -->
              <td class="text-left">
                <div class="d-flex align-center justify-center">
                  <v-menu
                    v-if="item.showIcons && item.showIcons.length > 0"
                    :top="index > 5"
                    left
                    offset-y
                    transition="scroll-y-transition"
                    :content-class="
                      index <= 5
                        ? 'menu-action arrow-up'
                        : 'menu-action arrow-down-list'
                    "
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn text fab dense small v-bind="attrs" v-on="on">
                        <v-icon> mdi-dots-vertical </v-icon>
                      </v-btn>
                    </template>

                    <v-list class="px-2 item-action">
                      <div
                        @click="onDetailMeeting(item)"
                        v-html="viewDetail(`${action}`, item.signUserType)"
                      />

                      <!-- RenAction -->
                      <div v-for="(action, id) in item.showIcons" :key="id">
                        <div
                          @click="showIconHandleDoc(`${action}`, item)"
                          v-html="renderAction(`${action}`, item.signUserType)"
                        />
                      </div>
                    </v-list>
                  </v-menu>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>

        <!-- status -->
        <div class="d-flex pt-10 pb-5 ml-2 bg-status">
          <div class="pa-2 mx-1 d-flex customer-status-draft">
            <v-checkbox
              v-model="isDraft"
              hide-details
              color="#8e8ea1"
              :label="$t('calendar.status.draft')"
              class="mt-0 pt-0"
            />
          </div>
          <div class="pa-2 mx-1 d-flex customer-status-pending">
            <v-checkbox
              v-model="isPending"
              hide-details
              color="#4a50e2"
              :label="$t('calendar.status.pending')"
              class="mt-0 pt-0"
            />
          </div>
          <div class="pa-2 mx-1 d-flex customer-status-appored">
            <v-checkbox
              v-model="isApprove"
              hide-details
              color="#00c3f9"
              :label="$t('calendar.status.approve')"
              class="mt-0 pt-0"
            />
          </div>
          <div class="pa-2 mx-1 d-flex customer-status-reject">
            <v-checkbox
              v-model="isReject"
              hide-details
              color="#ff4a55"
              :label="$t('calendar.status.reject')"
              class="mt-0 pt-0"
            />
          </div>
          <div class="pa-2 mx-1 d-flex customer-status-expired">
            <v-checkbox
              v-model="isExpired"
              hide-details
              color="#ff4a55"
              :label="$t('calendar.status.expired')"
              class="mt-0 pt-0"
            />
          </div>
          <div class="pa-2 mx-1 d-flex customer-status-cancel">
            <v-checkbox
              v-model="isCancel"
              hide-details
              color="#f028a0"
              :label="$t('calendar.status.cancel')"
              class="mt-0 pt-0"
            />
          </div>
        </div>
      </div>
    </div>

    <CalendarView
      v-else
      :list-metting="lstMeeting"
      :show-list-data="showListData"
      :formdata="formdata"
      :search="quickSearch"
      :remove-event="removeEvent"
      @close-dialog-save="closeDialogSave"
      @show-dialog-save="showDialogSave"
      @advance-search="advanceSearch"
      @showDialogSaveClickCalendar="showDialogSaveClickCalendar"
      @updateStateRemoveEvent="updateStateRemoveEvent"
      @onDetailMeeting="onDetailMeeting"
    />

    <DialogSaveMeetingSchedule
      :meeting-id="meetingId"
      :show-dialog="showDialogSaveMeeting"
      :update-meeting="updateMeeting"
      :start-date="startDate"
      :end-date="endDate"
      :date="datePicker"
      :check-create-calendar="checkCreateCalendar"
      @close-dialog-save="closeDialogSave"
    />
    <DialogConfirmSave
      :show-dialog="showDialogConfirm"
      :title-confirm="titleConfirm"
      @close-dialog="showDialogConfirm = false"
      @accept-action="sendMeeting"
    />

    <!-- Dialog huy lich -->
    <DialogConfirmReject
      :show-dialog="showDialogConfirmCancel"
      :title-confirm="titleConfirmCancel"
      :show-comment="true"
      :required-comment="true"
      :label-comment="labelReject"
      :label-input-comment="labelInputReject"
      @close-dialog="showDialogConfirmCancel = false"
      @accept="cancelMeeting"
    />

    <!-- Dialog xoa lich -->
    <DialogConfirmSave
      :show-dialog="showDialogConfirmDelete"
      :title-confirm="titleConfirm"
      @close-dialog="showDialogConfirmDelete = false"
      @accept-action="deleteMeeting"
    />

    <!-- Dialog tu choi tham gia -->
    <DialogConfirmReject
      :show-dialog="showDialogConfirmRejectParticipant"
      :title-confirm="titleConfirmRejectParticipant"
      :show-comment="true"
      :required-comment="false"
      :label-comment="labelRejectParticipant"
      :label-input-comment="labelInputRejectParticipant"
      @close-dialog="showDialogConfirmRejectParticipant = false"
      @accept="rejectParticipantMeeting"
    />
  </div>
</template>
<script>
import DialogConfirmSave from "@/modules/calendar/views/components/DialogConfirmSave";
import SearchDocument from "@/modules/calendar/views/list/creator/SearchDocument";
import DialogSaveMeetingSchedule from "@/modules/calendar/views/create/DialogSaveMeetingSchedule";
import { CalendarService } from "@/modules/calendar/services/calendarService";
import statusCalender from "@/modules/calendar/mixins/statusCalender";
import customAvatar from "@/mixins/customAvatar";
import popupAvatar from "@/mixins/popupAvatar";
import PopupSigner from "@/modules/calendar/views/list/components/PopupSigner";
import ListAvatarSigner from "@/modules/calendar/views/list/components/ListAvatarSigner";
import AvatarSigner from "@/modules/calendar/views/list/components/AvatarSigner";
import { mapActions } from "vuex";
import moment from "moment";
import EmptyBoxEdocument from "@/views/components/EmptyBoxEdocument.vue";
import calendar from "@/modules/calendar/router/routePaths";
import constants from "@/constants";
import DialogConfirmReject from "@/modules/calendar/views/components/DialogConfirmReject";
import CalendarView from "@/modules/calendar/views/list/creator/CalendarView.vue";

const initData = {
  keyword: "",
  meetingStartTime: null, // thoi gian bat dau hop
  meetingEndTime: null, // Thoi gian ket thuc hop
  createStartTime: null, // thoi gian tao tu
  createEndTime: null, // Thoi gian tao den
  status: ["DRAFT", "PENDING", "APPROVED", "REJECTED", "EXPIRED", "CANCELED"], // trang thai: DELETED, DRAFT, PENDING ,APPROVED, REJECTED, CANCELED, EXPIRED
  meetingTitle: null,
  calendarTypes: "MEETING_SCHEDULE", // loai lich: MEETING_SCHEDULE, ON_CALL_SCHEDULE
  roomId: null, // Id phong hop
  roomName: null, // ten phong hop
  userId: null, // tim user tham gia hop
  groupId: null, // tim group tham gia hop
  participantName: null, // Tim thanh phan tham gia
  cycleType: null, // lich dinh ky: CYCLE_TYPE, ONCE, DAILY, WEEKLY, MONTHLY, QUARTERLY
  searchingType: "CREATE", // PARTICIPATING: toi tham gia, GROUP: lich don vi, APPROVE: toi duyet, CREATE: toi tao
};

export default {
  components: {
    SearchDocument,
    DialogSaveMeetingSchedule,
    PopupSigner,
    ListAvatarSigner,
    AvatarSigner,
    EmptyBoxEdocument,
    DialogConfirmSave,
    DialogConfirmReject,
    CalendarView,
  },
  mixins: [statusCalender, customAvatar, popupAvatar],
  props: {
    showListData: {
      type: Boolean,
      default: true,
    },
    showTab: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    loading: false,

    meetingId: null,
    updateMeeting: false,

    showDialogSaveMeeting: false,
    lstMeetingDefault: [],
    lstMeeting: [],
    headers: [
      {
        text: "Thời gian",
        sortable: false,
        value: "startTime",
        class: "text--body-5 gray--text",
        align: "center",
        width: "15%",
      },
      {
        sortable: false,
        align: "center",
        width: "1%",
      },
      {
        text: "Địa điểm",
        sortable: true,
        value: "roomName",
        class: "text--body-5 gray--text",
        width: "20%",
      },
      {
        text: "Tên lịch",
        sortable: true,
        value: "title",
        class: "text--body-5 gray--text",
        width: "20%",
      },
      {
        text: "Trạng thái",
        sortable: true,
        value: "status",
        class: "text--body-5 gray--text",
        width: "10%",
      },
      {
        text: "Chủ trì",
        sortable: true,
        value: "chairman",
        class: "text--body-5 gray--text",
        width: "13%",
      },
      {
        text: "Người tham gia",
        sortable: false,
        value: "participants",
        class: "text--body-5 gray--text",
        width: "13%",
      },
      {
        text: "Thao tác",
        sortable: false,
        value: "action",
        class: "text--body-5 gray--text",
        align: "center",
        width: "8%",
      },
    ],
    formdata: {
      ...initData,
    },
    page: 1,
    pageSize: 100000,

    params: null,
    showAdvance: false,

    timeoutOnScroll: null,
    totalCount: 0,

    // Data dialog confirm.
    showDialogConfirm: false,
    titleConfirm: "",
    meetingItemId: null,
    listIndexState: [
      "DRAFT",
      "PENDING",
      "APPROVED",
      "REJECTED",
      "EXPIRED",
      "CANCELED",
    ],

    // Data dialog confirm huy lich.
    showDialogConfirmCancel: false,
    titleConfirmCancel: "calendar.messConfirmCancel",
    labelReject: "document.label.reason",
    labelInputReject: "document.label.inputReason",
    // Data dialog confirm xoa lich.
    showDialogConfirmDelete: false,
    checkCreateCalendar: false,
    startDate: "",
    endDate: "",
    datePicker: "",
    removeEvent: false,

    // Data dialog confirm reject duyet lich.
    showDialogConfirmRejectParticipant: false,
    titleConfirmRejectParticipant: "calendar.messConfirmReject",
    labelRejectParticipant: "document.label.reason",
    labelInputRejectParticipant: "document.label.inputReason",
  }),
  computed: {
    isExpired: {
      get() {
        return this.listIndexState.includes("EXPIRED");
      },
    },
    isDraft: {
      get() {
        return this.listIndexState.includes("DRAFT");
      },
    },
    isPending: {
      get() {
        return this.listIndexState.includes("PENDING");
      },
    },
    isApprove: {
      get() {
        return this.listIndexState.includes("APPROVED");
      },
    },
    isReject: {
      get() {
        return this.listIndexState.includes("REJECTED");
      },
    },
    isCancel: {
      get() {
        return this.listIndexState.includes("CANCELED");
      },
    },
    computedHeightTable() {
      const box = document.getElementById("virtual-scroll-table-creator");
      return box.offsetHeight;
    },
    countListMeeting() {
      return this.lstMeeting.length;
    },
    isLoadMore() {
      return this.countListMeeting < this.totalCount;
    },
  },
  async created() {
    await this.initDate();
    this.search();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),

    getNotifySucces(message) {
      const typeAlert = "success";
      this.setNotify({
        show: true,
        type: typeAlert,
        content: this.$t(message),
      });
    },

    getNotifyError(message) {
      this.setNotify({
        show: true,
        type: "error",
        content: this.$t(message),
      });
    },

    async sendMeeting() {
      try {
        this.loading = true;
        await CalendarService.sendMeeting(this.meetingItemId);
        this.lstMeeting = [];
        this.page = 1;
        this.search();
        this.loading = false;
        this.getNotifySucces("calendar.messSendSuccess");
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: this.$t(error.message),
        });
        this.loading = false;
      }
    },

    async cancelMeeting(comment) {
      try {
        this.loading = true;
        var formData = {};
        formData.meetingId = this.meetingItemId;
        formData.note = comment;
        await CalendarService.cancelMeeting(formData);
        this.lstMeeting = [];
        this.page = 1;
        this.search();
        this.loading = false;
        this.getNotifySucces("calendar.messCancelSuccess");
      } catch (error) {
        this.getNotifyError(error.message);
        this.loading = false;
      }
    },

    async deleteMeeting() {
      try {
        this.loading = true;
        await CalendarService.deleteMeeting(this.meetingItemId);
        this.lstMeeting = [];
        this.page = 1;
        this.search();
        this.loading = false;
        this.getNotifySucces("calendar.detailMeeting.success.delete");
      } catch (error) {
        this.getNotifyError(error.message);
        this.loading = false;
      }
    },

    async rejectParticipantMeeting(comment) {
      try {
        this.loading = true;
        var formData = {};
        formData.meetingId = this.meetingItemId;
        formData.note = comment;
        await CalendarService.notParticipant(formData);
        this.lstMeeting = [];
        this.lstMeetingDefault = [];
        this.page = 1;
        this.search();
        this.loading = false;
        this.getNotifySucces("calendar.detailMeeting.success.not-participant");
      } catch (error) {
        this.getNotifyError(error.message);
        this.loading = false;
      }
    },

    // show icon thao tac cua van ban
    showIconHandleDoc(action, item) {
      if (action === constants.LIST_ACTIONS_DETAIL.EDIT) {
        this.meetingId = item.meetingId;
        this.showDialogSaveMeeting = true;
        this.updateMeeting = true;
        return;
      }

      if (action === constants.LIST_ACTIONS_DETAIL.SEND) {
        this.titleConfirm = "calendar.messApproveMeeting";
        this.meetingItemId = item.meetingId;
        this.showDialogConfirm = true;
      }

      if (action === constants.LIST_ACTIONS_DETAIL.CANCEL) {
        this.meetingItemId = item.meetingId;
        this.showDialogConfirmCancel = true;
        return;
      }

      if (action === constants.LIST_ACTIONS_DETAIL.DELETE) {
        this.titleConfirm = "calendar.messConfirmDelete";
        this.meetingItemId = item.meetingId;
        this.showDialogConfirmDelete = true;
        return;
      }

      // tu choi tham gia
      if (action === constants.LIST_ACTIONS_DETAIL.NOT_PARTICIPATE) {
        this.titleConfirm = "calendar.messConfirmRejectParticipant";
        this.meetingItemId = item.meetingId;
        this.showDialogConfirmRejectParticipant = true;
        return;
      }
    },

    onDetailMeeting(item) {
      if (
        item.showIcons &&
        item.showIcons.includes(constants.CALENDAR_ACTION.VIEW)
      ) {
        let tab = constants.CALENDAR_TAB_LIST.TWO;
        if (this.showTab) tab = constants.CALENDAR_TAB_LIST.THREE;
        localStorage.setItem(constants.CALENDAR_TAB_LIST.NAME, tab);
        this.$router.push(
          `${calendar.CALENDAR_MEETING_DETAIL_PATH.replaceAll(
            ":meetingId",
            item.meetingId
          )}`
        );
      }
    },
    initDate() {
      this.formdata.createStartTime = moment()
        .subtract(365, "days")
        .format("DD/MM/YYYY")
        .replaceAll("/", "");
      this.formdata.createEndTime = moment()
        .format("DD/MM/YYYY")
        .replaceAll("/", "");
    },
    showDialogSave() {
      this.updateMeeting = false;
      this.meetingId = null;
      this.showDialogSaveMeeting = true;
    },
    showDialogSaveClickCalendar(start, end, date) {
      this.updateMeeting = false;
      this.meetingId = null;
      this.checkCreateCalendar = true;
      this.startDate = start;
      this.endDate = end;
      this.datePicker = date;
      this.showDialogSaveMeeting = true;
    },
    closeDialogSave(status) {
      if (status) {
        this.lstMeeting = [];
        this.search();
      } else {
        this.removeEvent = true;
      }
      this.showDialogSaveMeeting = false;
    },
    advanceSearch(params, listIndexState) {
      this.formdata = params;
      this.showAdvance = true;
      this.listIndexState = listIndexState;
      this.page = 1;
      this.search();
    },
    quickSearch() {
      this.showAdvance = true;
      this.page = 1;
      this.search();
    },
    async search() {
      try {
        const parms = { ...this.formdata };
        parms.page = this.page;
        parms.pageSize = this.pageSize;

        const response = await CalendarService.getListMeeting(parms);
        this.totalCount = response.data.totalElements;
        this.$emit("count-creator", this.totalCount);
        if (this.showAdvance) {
          this.lstMeeting = [];
        }
        response.data.data.map((item) => {
          this.lstMeeting.push(item);
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.showAdvance = false;
        this.loading = false;
      }
    },
    genDateTime(item) {
      let startTime = "";
      let endTime = "";
      let date = "";
      if (item.startTime) {
        if (item.startTime.includes(" ")) {
          const dateValue = item.startTime.split(" ");
          startTime = dateValue[0];
          date = dateValue[1];
        }
      } else {
        return null;
      }
      if (item.endTime) {
        if (item.endTime.includes(" ")) {
          const dateValue = item.endTime.split(" ");
          endTime = dateValue[0];
        }
      } else {
        return null;
      }
      return `${date} ${startTime} - ${endTime}`;
    },
    onScroll(e) {
      this.timeoutOnScroll && clearTimeout(this.timeoutOnScroll);
      this.timeoutOnScroll = setTimeout(() => {
        const heightContent = document.querySelector(
          "#virtual-scroll-table-creator > .v-data-table__wrapper tbody"
        ).offsetHeight;
        const heightHeader = 44;
        const scrollTop =
          heightHeader + heightContent - this.computedHeightTable;
        if (e.target.scrollTop >= scrollTop && this.isLoadMore) {
          this.page = this.page + 1;
          this.search();
        }
      }, 20);
    },
    updateStateRemoveEvent() {
      this.removeEvent = false;
    },
  },
};
</script>
<style lang="scss" scoped src="../ListMeetingSchedule.scss"></style>
