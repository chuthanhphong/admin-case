<template>
  <div class="container-booking">
    <v-container class="container-content rounded-xl" fluid>
      <h5 class="title-page text-primary d-flex align-center">
        <span class="mr-3">{{ $t("booking.labels.booking-car-list") }}</span>
        <span>({{ totalCount }})</span>
      </h5>
      <div class="wrap-home">
        <v-tabs
          v-model="currentTab"
          @change="changeTab()"
          class="wrap--content wrap-book-tab"
        >
          <v-tab key="0"> {{ $t("booking.labels.my-participation") }} </v-tab>
          <v-tab key="1"> {{ $t("booking.labels.my-request") }} </v-tab>
          <v-tab key="2" v-if="enableApproveTab">
            {{ $t("booking.labels.my-approve") }}
          </v-tab>
        </v-tabs>
        <HeaderList
          :form-search="formSearch"
          :list-participant="listParticipant"
          @get-status="getStatus"
          @search="search"
          @advance-search="search"
          @clear-search="clearSearch"
          @show-dialog-add-new="isShowDialog = !isShowDialog"
        />
        <div class="box-list-content-booking mt-4">
          <div
            v-if="countListBooking === 0"
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
            :items="listBooking"
            :no-data-text="$t('noData')"
            :items-per-page="countListBooking"
            height="70vh"
          >
            <template v-slot:[`item.title`]="{ item }">
              <v-layout class="link">
                <v-tooltip top content-class="tooltip-top">
                  <template v-slot:activator="{ on, attrs }">
                    <b
                      class="fw-600 cursor-pointer"
                      v-on="on"
                      v-bind="attrs"
                      @click="onGotoDetailBooking(item)"
                    >
                      {{ getTextTruncateView(item.title, 30) }}
                    </b>
                  </template>
                  <span>{{ item.title }}</span>
                </v-tooltip>
              </v-layout>
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
                <!-- <span class="red--text">{{
                  getTextDeallineByExpectEndDate(item.expectEndDate)
                }}</span> -->
              </v-layout>
            </template>
            <template v-slot:[`item.from`]="{ item }">
              <v-layout align-center>
                <i class="app-icon icon-clock warning icon-size-16" />
                <span class="fw-600 ml-2">{{
                  formatHourView(item.startTime)
                }}</span>
                <span class="greya7--text ml-2">{{
                  formatDateView(item.startTime)
                }}</span>
              </v-layout>
              <v-layout align-center>
                <img
                  src="@/assets/icons/icon-departure.svg"
                  class="icon-size-16"
                />
                <v-layout column>
                  <v-tooltip left content-class="tooltip-left">
                    <template v-slot:activator="{ on, attrs }">
                      <span v-on="on" v-bind="attrs" class="ml-2 fw-600 w-220">
                        {{ getFirstSubString(item.departure, 30) }}
                      </span>
                    </template>
                    <span>{{ item.departure }}</span>
                  </v-tooltip>

                  <!-- <b class="ml-2 w-220">
                    {{ getLastSubString(item.departure, 31, 60) }}
                  </b> -->
                </v-layout>
              </v-layout>
            </template>
            <template v-slot:[`item.to`]="{ item }">
              <v-layout align-center>
                <i class="app-icon icon-clock warning icon-size-16" />
                <span class="fw-600 ml-2">{{
                  formatHourView(item.endTime)
                }}</span>
                <span class="greya7--text ml-2">{{
                  formatDateView(item.endTime)
                }}</span>
              </v-layout>
              <v-layout align-center>
                <!-- <i class="app-icon icon-destination danger icon-size-16" /> -->
                <img
                  src="@/assets/icons/icon-destination.svg"
                  class="icon-size-16"
                />
                <v-layout column>
                  <v-tooltip left content-class="tooltip-left">
                    <template v-slot:activator="{ on, attrs }">
                      <span v-on="on" v-bind="attrs" class="ml-2 fw-600 w-220">
                        {{ getFirstSubString(item.destination, 30) }}
                      </span>
                    </template>
                    <span>{{ item.destination }}</span>
                  </v-tooltip>
                  <!-- <b class="ml-2 w-220">
                    {{ getLastSubString(item.destination, 31, 60) }}
                  </b> -->
                </v-layout>
              </v-layout>
            </template>
            <template v-slot:[`item.strVehicleInfo`]="{ item, index }">
              <div :class="{ 'disable-hover': activeIndex != null }">
                <div
                  v-if="item.strVehicleInfo && item.strVehicleInfo.length === 1"
                  class="group-avatar-signer"
                >
                  <popup-signer
                    :list-show-popup="listShowPopup"
                    :lst-colors="lstColors"
                    :item="item"
                    :car-info-column="true"
                    :active-index="activeIndex"
                    :index="index"
                    @close-popup-signer="closePopupSigner"
                  />
                  <div class="group-avatar d-flex align-center">
                    <avatar-signer
                      :lst-colors="lstColors"
                      :item="item"
                      :car-info-column="true"
                      :index-row="index"
                      class="list-signer"
                      @active-show-popup-signer="activeShowPopupSigner"
                    />
                  </div>
                </div>
                <div
                  v-else-if="
                    item.strVehicleInfo && item.strVehicleInfo.length > 1
                  "
                  class="group-avatar-signer"
                >
                  <popup-signer
                    :list-show-popup="listShowPopup"
                    :lst-colors="lstColors"
                    :item="item"
                    :car-info-column="true"
                    :active-index="activeIndex"
                    :index="index"
                    @close-popup-signer="closePopupSigner"
                  />
                  <div class="group-avatar d-flex align-center">
                    <list-avatar-signer
                      :lst-colors="lstColors"
                      :item="item"
                      :index-row="index"
                      :car-info-column="true"
                      class="list-signer"
                      @active-show-popup-signer="activeShowPopupSigner"
                    />
                    <v-avatar
                      v-if="item.strVehicleInfo.length > 5"
                      size="32"
                      :color="lstColors[4]"
                      class="signer"
                      @click="activeShowPopupSigner(index)"
                    >
                      <span class="text-uppercase white--text">
                        +{{ item.strVehicleInfo.length - 4 }}
                      </span>
                    </v-avatar>
                  </div>
                </div>
                <div v-else>
                  <v-btn outlined fab small class="border-dashed-2">
                    <i class="app-icon icon-car icon-size-20" />
                  </v-btn>
                  <span class="greya7--text ml-2">Chưa gán xe</span>
                </div>
              </div>
            </template>
            <template v-slot:[`item.strParticipantInfo`]="{ item, index }">
              <div :class="{ 'disable-hover': activeParticipateIndex != null }">
                <div
                  v-if="item.strParticipantInfo.length === 1"
                  class="group-avatar-signer"
                >
                  <popup-signer
                    :list-participate-show-popup="listParticipateShowPopup"
                    :lst-colors="lstColors"
                    :item="item"
                    :car-info-column="false"
                    :active-participate-index="activeParticipateIndex"
                    :index="index"
                    @close-popup-signer="closePopupParticipateSigner"
                  />
                  <div class="group-avatar d-flex align-center">
                    <avatar-signer
                      :lst-colors="lstColors"
                      :item="item"
                      :car-info-column="false"
                      :index-row="index"
                      class="list-signer"
                      @active-show-popup-signer="
                        activeShowPopupParticipateSigner
                      "
                    />
                  </div>
                </div>
                <div v-else class="group-avatar-signer">
                  <popup-signer
                    :list-participate-show-popup="listParticipateShowPopup"
                    :lst-colors="lstColors"
                    :item="item"
                    :car-info-column="false"
                    :active-participate-index="activeParticipateIndex"
                    :index="index"
                    @close-popup-signer="closePopupParticipateSigner"
                  />
                  <div class="group-avatar d-flex align-center">
                    <list-avatar-signer
                      :lst-colors="lstColors"
                      :item="item"
                      :car-info-column="false"
                      :index-row="index"
                      class="list-signer"
                      @active-show-popup-signer="
                        activeShowPopupParticipateSigner
                      "
                    />
                    <v-avatar
                      v-if="item.strParticipantInfo.length > 4"
                      size="32"
                      :color="lstColors[3]"
                      class="signer"
                      @click="activeShowPopupParticipateSigner(index)"
                    >
                      <span class="text-uppercase white--text">
                        +{{ item.strParticipantInfo.length - 3 }}
                      </span>
                    </v-avatar>
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-menu
                left
                offset-y
                transition="scroll-y-transition"
                content-class="menu-action arrow-up"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text fab dense small v-bind="attrs" v-on="on">
                    <v-icon> mdi-dots-vertical </v-icon>
                  </v-btn>
                </template>
                <v-list :ripple="false">
                  <!-- Xem -->
                  <v-btn
                    text
                    dark
                    block
                    class="text-capitalize"
                    @click="onGotoDetailBooking(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="v-icon notranslate mdi mdi-eye-outline"></i>
                      <span class="ml-2">{{
                        $t("document.tooltip.view")
                      }}</span>
                    </v-layout>
                  </v-btn>
                  <!-- Duyệt -->
                  <v-btn
                    v-if="item.status === 1 && approveRule"
                    text
                    dark
                    block
                    class="text-capitalize"
                    @click="onGotoDetailBooking(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-approval light"></i>
                      <span class="ml-2">{{
                        $t("booking.labels.approve")
                      }}</span>
                    </v-layout>
                  </v-btn>
                  <!-- Từ chối duyệt -->
                  <v-btn
                    v-if="item.status === 1 && approveRule"
                    text
                    dark
                    block
                    class="text-capitalize"
                    @click="showPopupConfirm(item.id, 'reject')"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-approval-deny light"></i>
                      <span class="ml-2">{{
                        $t("booking.labels.reject-approve")
                      }}</span>
                    </v-layout>
                  </v-btn>
                  <!-- Thay đổi xe -->
                  <v-btn
                    v-if="item.status === 2 && approveRule"
                    text
                    dark
                    block
                    class="text-capitalize"
                    @click="onGotoDetailBooking(item)"
                  >
                    <v-layout justify-start align-center>
                      <i class="app-icon icon-refresh light"></i>
                      <span class="ml-2">{{
                        $t("booking.labels.change-car")
                      }}</span>
                    </v-layout>
                  </v-btn>
                  <!-- Hủy đặt xe -->
                  <v-btn
                    v-if="
                      (item.status === 1 &&
                        item.requestUserId === JSON.parse(userInfo).userId) ||
                      (item.status === 2 && item.beChanged)
                    "
                    text
                    dark
                    block
                    class="text-capitalize"
                    @click="showPopupConfirm(item.id, 'cancel')"
                  >
                    <v-layout justify-start align-center>
                      <i class="v-icon notranslate mdi mdi-close"></i>
                      <span class="ml-2">{{
                        $t("booking.labels.cancel")
                      }}</span>
                    </v-layout>
                  </v-btn>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </div>
      <DialogConfirm
        :title-confirm="titleConfirmDialog"
        :show-dialog="showConfirmDialog"
        @close-dialog="showConfirmDialog = false"
        @accept-action="acceptConfirmDoc"
        @reason="inputReason"
      />
      <dialog-book-car
        :is-dialog-show="isShowDialog"
        @close-dialog="isShowDialog = !isShowDialog"
        @book-car-success="onBookCarSuccess"
      />
    </v-container>
  </div>
</template>

<script>
import HeaderList from "./components/HeaderList";
import EmptyBox from "@/views/components/EmptyBox";
import PopupSigner from "./components/PopupSigner.vue";
import AvatarSigner from "./components/AvatarSigner.vue";
import ListAvatarSigner from "./components/ListAvatarSigner.vue";
import DialogBookCar from "./components/DialogBookCar.vue";
import DialogConfirm from "@/modules/carbooking/views/components/DialogConfirm.vue";

// libs
import { mapActions } from "vuex";
import routePaths from "@/modules/carbooking/router/routePaths";
import constants from "@/constants";

// mixins
import customAvatar from "@/mixins/customAvatar";
import popupAvatar from "@/mixins/popupAvatar";
import mixinStatusAndPriority from "@/modules/carbooking/mixins/mixinStatusAndPriority";
import popupParticipate from "@/modules/carbooking/mixins/popupParticipate";
import notification from "@/mixins/notification";

import {
  formatDate,
  getTextTruncate,
  PAGE_SIZE,
} from "@/modules/carbooking/helpers/bookingUtils";

// services
import { BookingService } from "@/modules/carbooking/services/bookingService";

export default {
  name: "ListBooking",
  components: {
    HeaderList,
    PopupSigner,
    AvatarSigner,
    ListAvatarSigner,
    EmptyBox,
    DialogBookCar,
    DialogConfirm,
  },
  mixins: [
    mixinStatusAndPriority,
    popupParticipate,
    popupAvatar,
    customAvatar,
    notification,
  ],
  data() {
    return {
      isShowDialog: false,
      formSearch: {},
      page: 1,
      totalCount: 0,
      headers: [
        {
          text: "Tên đặt xe",
          sortable: false,
          value: "title",
          class: "text--body-5 gray--text",
          width: "20%",
        },
        {
          text: "Trạng thái",
          sortable: false,
          value: "status",
          class: "text--body-5 gray--text",
          width: "10%",
        },
        {
          text: "Điểm đi",
          sortable: false,
          value: "from",
          class: "text--body-5 gray--text",
          // width: "20%",
        },
        {
          text: "Điểm đến",
          sortable: false,
          value: "to",
          class: "text--body-5 gray--text",
          // width: "20%",
        },
        {
          text: "Thông tin xe",
          sortable: false,
          value: "strVehicleInfo",
          class: "text--body-5 gray--text",
          // width: "6%",
        },
        {
          text: "Tham gia",
          sortable: false,
          value: "strParticipantInfo",
          class: "text--body-5 gray--text",
          width: "10%",
        },
        {
          text: "Thao tác",
          sortable: false,
          value: "action",
          class: "text--body-5 gray--text",
          // width: "6%",
        },
      ],
      loading: false,
      timeoutOnScroll: null,
      listBooking: [],
      listBookingAll: [],
      statusValue: [],
      statusType: null,
      avatarDriver: [],
      listParticipant: [],
      titleConfirmDialog: "",
      showConfirmDialog: false,
      chooseId: null,
      cancelReason: null,
      currentTab: 0,
      userInfo: localStorage.getItem("USER_INFO"),
      enableApproveTab: false,
      approveRule: false,
      popupType: null,
    };
  },
  computed: {
    computedHeightTable() {
      const box = document.getElementById("virtual-scroll-table");
      return box.offsetHeight;
    },
    countListBooking() {
      return this.listBooking.length;
    },
    isLoadMore() {
      return this.countListBooking < this.totalCount;
    },
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("layout", ["setAvatar", "setNotify", "setClearAdvance"]),

    async initData() {
      if (
        JSON.parse(this.userInfo).roles.filter((x) => x === "VEHICLE")
          .length === 1
      ) {
        this.approveRule = true;
        this.enableApproveTab = true;
      }
    },
    bindRequestPars() {
      const pars = {
        page: this.page,
        pageSize: PAGE_SIZE,
      };
      if (this.formSearch.name) {
        pars["requestName"] = this.formSearch.name;
      }

      if (this.formSearch.advanceSearchName) {
        pars["requestName"] = this.formSearch.advanceSearchName;
      }

      if (this.statusValue && this.statusValue.length === 1) {
        pars["status"] = this.statusValue[0];
      } else if (this.statusValue && this.statusValue.length > 1) {
        pars["status"] = this.statusValue.join(",");
      }
      if (this.formSearch.startTime) {
        pars["startTime"] = this.formSearch.startTime;
      }

      if (this.formSearch.endTime) {
        pars["endTime"] = this.formSearch.endTime;
      }

      if (this.formSearch.participants) {
        pars["participantName"] = this.formSearch.participants;
      }

      if (this.currentTab || this.currentTab === 0) {
        pars["actionType"] = this.currentTab + 1;
      }

      return pars;
    },
    onBookCarSuccess() {
      this.isShowDialog = !this.isShowDialog;
      this.currentTab = 1;
      this.changeTab();
    },
    changeTab() {
      this.setClearAdvance(true);
      this.listBooking = [];
      this.clearSearch();
      this.getList();
    },
    async getList() {
      this.loading = true;
      try {
        const pars = this.bindRequestPars();
        const response = await BookingService.getListBooking(pars);
        if (response && response.data.totalCount > 0) {
          this.totalCount = response.data.totalCount;
          response.data.data.forEach((x) => {
            this.listBooking.push({
              id: x.id,
              requestUserId: x.requestUserId,
              beChanged: x.beChanged,
              createdDate: x.createdDate,
              departure: x.departure,
              destination: x.destination,
              endTime: x.endTime,
              startTime: x.startTime,
              status: x.status,
              strVehicleInfo: x.strVehicleInfo
                ? JSON.parse(x.strVehicleInfo)
                : [],
              strParticipantInfo: x.strParticipantInfo
                ? JSON.parse(x.strParticipantInfo)
                : [],
              title: x.title,
              totalCount: x.totalCount,
            });
          });
          this.listBooking.forEach((x) => {
            x.strParticipantInfo.forEach((y) => {
              this.listParticipant.push(y);
            });
          });
        } else {
          this.listBooking = [];
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
        this.setClearAdvance(false);
      }
    },
    search() {
      this.page = 1;
      this.listBooking = [];
      this.getList();
    },
    getStatus(value, type) {
      this.statusValue = value;
      this.statusType = type;
    },
    // async downloadAvatar(avatar) {
    //   const objAvatar = {
    //     filePath: avatar,
    //     storage: "storage0",
    //   };
    //   try {
    //     const response = await BookingService.downloadImage({
    //       ...objAvatar,
    //     });
    //     return response;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    showPopupConfirm(id, type) {
      this.chooseId = id;
      this.popupType = type;
      if (type === "cancel") {
        this.titleConfirmDialog = "booking.messages.cancel-booking";
      } else if (type === "reject") {
        this.titleConfirmDialog = "booking.messages.reject-booking";
      }
      this.dialogConfirm();
      return;
    },
    inputReason(val) {
      this.cancelReason = val;
    },
    dialogConfirm() {
      this.showConfirmDialog = true;
    },
    async acceptConfirmDoc() {
      try {
        const pars = {
          id: this.chooseId,
          reason: this.cancelReason,
        };
        if (this.popupType === "cancel" && this.cancelReason) {
          await BookingService.cancelBooking(pars);
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "booking.messages.cancel-success",
          });
          setTimeout(() => {
            // Goi lai danh sach
            this.listBooking = [];
            this.getList();
          }, 1000);
        }
        if (this.popupType === "reject" && this.cancelReason) {
          await BookingService.rejectBooking(pars);
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "booking.messages.reject-success",
          });
          setTimeout(() => {
            // Goi lai danh sach
            this.listBooking = [];
            this.getList();
          }, 1000);
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      }
    },
    formatDateView(date) {
      return formatDate(date, "DD/MM/YYYY");
    },
    formatHourView(date) {
      return formatDate(date, "HH:mm");
    },
    getTextTruncateView(val, size) {
      return getTextTruncate(val, size);
    },
    getFirstSubString(value, size) {
      if (value.length > size) {
        value = value.substring(0, size) + "...";
      }
      return value;
    },
    getLastSubString(value, fromSize, toSize) {
      if (value.length >= fromSize && value.length <= toSize) {
        value = value.substring(fromSize, toSize);
      } else if (value.length > toSize) {
        value = value.substring(fromSize, toSize) + "...";
      }
      return value;
    },
    clearSearch() {
      this.formSearch = {};
      this.statusValue = [];
    },
    onGotoDetailBooking(item) {
      this.$router.push({
        path: routePaths.DETAIL_BOOKING_PATH,
        query: {
          id: item.id,
        },
      });
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
