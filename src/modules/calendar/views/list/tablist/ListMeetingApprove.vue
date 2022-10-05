<template>
  <div class="calendar-font wrap-content-calendar-search">
    <SearchDocument
      v-show="showListData"
      :show-search="showListData"
      :formdata="formdata"
      :search="quickSearch"
      :search-date="searchDate"
      :meeting-start-time="meetingStartTime"
      :meeting-end-time="meetingEndTime"
      :searching-type="searchingType"
      @show-dialog-save="showDialogSave"
      @advance-search="advanceSearch"
    />
    <div v-if="showListData" class="calendar-content-list mt-4">
      <div
        v-show="lstMeeting.length == 0 || loading"
        class="col-md-5 col-12 mx-auto wrap-empty-list"
      >
        <empty-box-edocument :loading="loading" />
      </div>
      <div :class="lstMeeting.length > 0 ? '' : 'd-none'">
        <v-data-table
          id="virtual-scroll-table-approve"
          ref="tableParticipant"
          hide-default-footer
          fixed-header
          group-by="dateValue"
          :no-data-text="$t('noData')"
          :headers="headers"
          :items="lstMeeting"
          :items-per-page="countListMeeting"
          :class="{ 'disable-hover': activeIndex != null }"
        >
          <template
            v-slot:[`group.header`]="{ items, headers, isOpen, toggle }"
          >
            <th
              :colspan="headers.length"
              class="date-header"
              :class="checkDayCurrent(items[0].dateValue) ? 'active-day' : ''"
              style="border-bottom: none !important"
            >
              <div
                class="d-flex justify-space-around my-2 py-1 date-value"
                @click="toggle"
              >
                <div
                  class="d-flex align-center calendar-date-text-1 text-capitalize"
                >
                  {{ genDateValue(items[0].dateValue) }}
                  {{ genDate(items[0].dateValue) }} ({{ items.length }})
                </div>
                <v-icon>{{ isOpen ? "$expand" : "mdi-chevron-up" }} </v-icon>
              </div>
            </th>
          </template>
          <!-- thoi gian hop -->
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center" @click="onDetailMeeting(item)">
                {{ genDateTime(item) }}
              </td>
              <!-- dia diem -->
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
                      :index-row="item.index"
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
                :class="{ 'popup-acvite': activeIndex == item.index }"
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
                    :index="item.index"
                    @close-popup-signer="closePopupSigner"
                  />
                  <div class="group-avatar d-flex align-center">
                    <avatar-signer
                      :lst-colors="lstColors"
                      :item="item.participants[0]"
                      :index-row="item.index"
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
                    :index="item.index"
                    @close-popup-signer="closePopupSigner"
                  />
                  <div class="group-avatar d-flex align-center">
                    <list-avatar-signer
                      :lst-colors="lstColors"
                      :item="item"
                      :index-row="item.index"
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
                    :top="item.index > 5"
                    left
                    offset-y
                    transition="scroll-y-transition"
                    :content-class="
                      item.index <= 5
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
        <div class="d-flex pt-10 pb-5 ml-2 bg-status">
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
      :list-metting="lstMeetingDefault"
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
      :show-dialog="showDialog"
      @reset-tab-current="resetTabCurrent"
      @close-dialog-save="closeDialogSave"
    />

    <!-- Dialog reject duyet lich -->
    <DialogConfirmReject
      :show-dialog="showDialogConfirmReject"
      :title-confirm="titleConfirmReject"
      :show-comment="true"
      :required-comment="true"
      :label-comment="labelReject"
      :label-input-comment="labelInputReject"
      @close-dialog="showDialogConfirmReject = false"
      @accept="rejectApproveMeeting"
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

    <DialogConfirmSave
      :show-dialog="showDialogConfirm"
      :title-confirm="titleConfirm"
      @close-dialog="showDialogConfirm = false"
      @accept-action="approveMeeting"
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
import SearchDocument from "@/modules/calendar/views/list/components/SearchDocument";
import DialogSaveMeetingSchedule from "@/modules/calendar/views/create/DialogSaveMeetingSchedule";
import { CalendarService } from "@/modules/calendar/services/calendarService";
import statusCalender from "@/modules/calendar/mixins/statusCalender";
import customAvatar from "@/mixins/customAvatar";
import popupAvatar from "@/mixins/popupAvatar";
import PopupSigner from "@/modules/calendar/views/list/components/PopupSigner";
import ListAvatarSigner from "@/modules/calendar/views/list/components/ListAvatarSigner";
import AvatarSigner from "@/modules/calendar/views/list/components/AvatarSigner";
import { mapActions } from "vuex";
import searchCalendar from "@/modules/calendar/views/mixin/searchCalendar";
import DialogConfirmReject from "@/modules/calendar/views/components/DialogConfirmReject";
import EmptyBoxEdocument from "@/views/components/EmptyBoxEdocument.vue";
import constants from "@/constants";
import DialogConfirmSave from "@/modules/calendar/views/components/DialogConfirmSave";
import calendar from "@/modules/calendar/router/routePaths";
import moment from "moment";
import CalendarView from "@/modules/calendar/views/list/tablist/CalendarView.vue";

const initData = {
  keyword: "",
  meetingStartTime: null, // thoi gian bat dau hop
  meetingEndTime: null, // Thoi gian ket thuc hop
  createStartTime: null, // thoi gian tao tu
  createEndTime: null, // Thoi gian tao den
  status: ["PENDING", "APPROVED", "REJECTED", "CANCELED", "EXPIRED"], // trang thai: DELETED, DRAFT, PENDING ,APPROVED, REJECTED, CANCELED, EXPIRED
  meetingTitle: null,
  calendarTypes: "MEETING_SCHEDULE", // loai lich: MEETING_SCHEDULE, ON_CALL_SCHEDULE
  roomId: null, // Id phong hop
  roomName: null, // ten phong hop
  userId: null, // tim user tham gia hop
  groupId: null, // tim group tham gia hop
  participantName: null, // Tim thanh phan tham gia
  cycleType: null, // lich dinh ky: CYCLE_TYPE, ONCE, DAILY, WEEKLY, MONTHLY, QUARTERLY
  searchingType: null, // PARTICIPATING: toi tham gia, GROUP: lich don vi, APPROVE: toi duyet, CREATE: toi tao
};

export default {
  components: {
    SearchDocument,
    DialogSaveMeetingSchedule,
    PopupSigner,
    ListAvatarSigner,
    AvatarSigner,
    EmptyBoxEdocument,
    DialogConfirmReject,
    DialogConfirmSave,
    CalendarView,
  },
  mixins: [statusCalender, customAvatar, popupAvatar, searchCalendar],
  props: {
    showListData: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    formdata: {
      ...initData,
    },
    searchingType: "APPROVE",
    meetingItemId: null,

    // Data dialog confirm reject duyet lich.
    showDialogConfirmReject: false,
    titleConfirmReject: "calendar.messConfirmReject",
    labelReject: "document.label.reason",
    labelInputReject: "document.label.inputReason",

    // Data dialog confirm huy lich.
    showDialogConfirmCancel: false,
    titleConfirmCancel: "calendar.messConfirmCancel",

    // Data dialog confirm.
    showDialogConfirm: false,
    titleConfirm: "",

    // Data dialog confirm xoa lich.
    showDialogConfirmDelete: false,
    checkCreateCalendar: false,
    startDate: "",
    endDate: "",
    datePicker: "",
    removeEvent: false,
    listIndexState: [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "EXPIRED",
      "CANCELED",
    ],

    // Data dialog confirm reject duyet lich.
    showDialogConfirmRejectParticipant: false,
    titleConfirmRejectParticipant: "calendar.messConfirmReject",
    labelRejectParticipant: "document.label.reason",
    labelInputRejectParticipant: "document.label.inputReason",
  }),
  computed: {
    computedHeightTable() {
      const box = document.getElementById("virtual-scroll-table-approve");
      return box.offsetHeight;
    },
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),

    getNotifySucces(message) {
      this.setNotify({
        show: true,
        type: "success",
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

    async rejectApproveMeeting(comment) {
      try {
        this.loading = true;
        var formData = {};
        formData.meetingId = this.meetingItemId;
        formData.reason = comment;
        await CalendarService.rejectMeeting(formData);
        this.lstMeetingDefault = [];
        this.lstMeeting = [];
        this.page = 1;
        this.search();
        this.loading = false;
        this.getNotifySucces("calendar.messRejectSuccess");
      } catch (error) {
        this.getNotifyError(error.message);
        this.loading = false;
      }
    },

    async approveMeeting() {
      try {
        this.loading = true;
        await CalendarService.approveMeeting(this.meetingItemId);
        this.lstMeetingDefault = [];
        this.lstMeeting = [];
        this.page = 1;
        this.search();
        this.loading = false;
        this.getNotifySucces("calendar.messSendSuccess");
      } catch (error) {
        this.getNotifyError(error.message);
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
        this.lstMeetingDefault = [];
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
        this.lstMeetingDefault = [];
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
      if (action === constants.LIST_ACTIONS_DETAIL.REJECT) {
        this.meetingItemId = item.meetingId;
        this.showDialogConfirmReject = true;
        return;
      }

      if (action === constants.LIST_ACTIONS_DETAIL.APPROVE) {
        this.titleConfirm = "calendar.messApproveMeeting";
        this.meetingItemId = item.meetingId;
        this.showDialogConfirm = true;
        return;
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

    async search() {
      try {
        if (this.showAdvance) {
          this.lstMeetingDefault = [];
        }
        const parms = { ...this.formdata };
        parms.page = this.page;
        parms.pageSize = this.pageSize;
        parms.searchingType = this.searchingType;

        const response = await CalendarService.getListMeeting(parms);
        this.totalCount = response.data.totalElements;
        this.$emit("count-approve", this.totalCount);
        response.data.data.map((item) => {
          this.lstMeetingDefault.push(item);
        });

        // lay ra tat ca cac ngay trong list
        let index = 0;
        this.lstMeeting = [];
        this.lstMeetingDefault.map((meeting) => {
          meeting.index = index++;
          if (meeting.startTime) {
            if (meeting.startTime.includes(" ")) {
              const dateValue = meeting.startTime.split(" ").pop();
              meeting.dateValue = moment(dateValue, "DD/MM/YYYY").format(
                "MM/DD/YYYY"
              );
              this.lstMeeting.push(meeting);
            }
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.showAdvance = false;
        this.loading = false;
      }
    },
    onScroll(e) {
      // this.timeoutOnScroll && clearTimeout(this.timeoutOnScroll);
      // this.timeoutOnScroll = setTimeout(() => {
      //   const heightContent = document.querySelector(
      //     "#virtual-scroll-table-approve > .v-data-table__wrapper tbody"
      //   ).offsetHeight;
      //   const heightHeader = 44;
      //   const scrollTop =
      //     heightHeader + heightContent - this.computedHeightTable;
      // if (e.target.scrollTop >= scrollTop && this.isLoadMore) {
      //   this.page = this.page + 1;
      //   this.search();
      // }
      // }, 20);
    },
    onDetailMeeting(item) {
      if (
        item.showIcons &&
        item.showIcons.includes(constants.CALENDAR_ACTION.VIEW)
      ) {
        localStorage.setItem(
          constants.CALENDAR_TAB_LIST.NAME,
          constants.CALENDAR_TAB_LIST.TWO
        );
        this.$router.push(
          `${calendar.CALENDAR_MEETING_DETAIL_PATH.replaceAll(
            ":meetingId",
            item.meetingId
          )}`
        );
      }
    },
    showDialogSaveClickCalendar(start, end, date) {
      this.updateMeeting = false;
      this.meetingId = null;
      this.checkCreateCalendar = true;
      this.startDate = start;
      this.endDate = end;
      this.datePicker = date;
      this.showDialog = true;
    },
    updateStateRemoveEvent() {
      this.removeEvent = false;
    },

    resetTabCurrent() {
      this.$emit("reset-tab-current");
    },
  },
};
</script>
<style lang="scss" scoped src="../ListMeetingSchedule.scss"></style>
