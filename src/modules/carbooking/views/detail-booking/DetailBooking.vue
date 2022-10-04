<template>
  <div class="container-booking-detail">
    <v-container class="container-content rounded-xl" fluid>
      <breadcrumbs :items="breadcrumbs" class="title-page" />
      <div class="wrap-home">
        <h5 class="title-booking text-capitalize">
          {{ detail?.title }}
        </h5>
        <v-row>
          <v-col cols="6" class="wrap-left">
            <!-- title man hinh chi tiet dat xe -->
            <location-info :detail="detail" />

            <!-- thong tin chung -->
            <booking-info-expand :detail="detail" />

            <!-- thanh phan tham gia -->
            <participant-expand
              :detail="detail"
              :participant-user-list="participantUserList"
              :driver-avatar="driverAvatar"
            />
          </v-col>
          <v-col cols="6" class="wrap-left">
            <div>
              <approver
                :approver="approver"
                :is-status="isStatus"
                :approve-group-infos="approveGroupInfos"
                :is-show-approve="isShowApprove"
              />
            </div>
            <!-- chon xe -->
            <div v-if="enableApproveBtn || isStatus === 2" class="mb-3">
              <choose-car
                :vehicle-info-add="vehicleInfoAdd"
                :vehicle-info-dtos="vehicleInfoDtos"
                :start-time="startTime"
                :end-time="endTime"
                :is-status="isStatus"
                :origin-booking-infos="originBookingInfos"
                :is-show-approve="isShowApprove"
                @addVehecle="onVehecle"
                @isDisable="onCheckApprove"
              />
            </div>
            <!-- lien ket -->
            <div v-if="refers?.length">
              <list-link :refers="refers" />
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- actions -->
      <v-layout justify-start class="footer-actions-fixed">
        <!-- quay lai -->
        <v-btn
          color="primary"
          rounded
          outlined
          elevation="1"
          class="w-160 py-5 mr-0 mr-md-3 bg-white"
          @click="goToBack()"
        >
          {{ $t("booking.labels.back") }}
        </v-btn>

        <!-- huy yeu cau -->
        <v-btn
          v-if="
            (detail?.realStatus === 1 && enableCancelButton) ||
            (detail?.realStatus === 2 && detail?.beChanged)
          "
          color="error"
          rounded
          outlined
          elevation="1"
          class="w-160 py-5 mr-0 mr-md-3 bg-white"
          @click="showPopupConfirm('cancel')"
        >
          {{ $t("booking.labels.cancel") }}
        </v-btn>

        <!-- tu choi -->
        <v-btn
          v-if="detail?.realStatus === 1 && enableApproveBtn"
          color="error"
          rounded
          outlined
          elevation="1"
          class="w-160 py-5 mr-0 mr-md-3 bg-white"
          @click="showPopupConfirm('reject')"
        >
          {{ $t("rejectLabel") }}
        </v-btn>

        <!-- sua duyet -->
<!--        <v-btn-->
<!--          v-if="isStatus === 2 && isShowApprove && enableApproveBtn"-->
<!--          color="primary"-->
<!--          rounded-->
<!--          elevation="1"-->
<!--          class="w-160 py-5 mr-0 mr-md-3"-->
<!--          :disabled="false"-->
<!--          @click="onChangeApprove"-->
<!--        >-->
<!--          {{ $t("booking.labels.change-approve") }}-->
<!--        </v-btn>-->

        <!-- luu duyet -->
        <v-btn
          v-if="isStatus === 1 && !isShowApprove && enableApproveBtn"
          color="primary"
          rounded
          elevation="1"
          class="w-160 py-5 mr-0 mr-md-3"
          :disabled="isDisableSaveApprove"
          @click="onShowConfirmResultApprove"
        >
          {{ $t("booking.labels.save-approve") }}
        </v-btn>

        <!-- duyet -->
        <v-btn
          v-if="isStatus === 1 && isShowApprove && enableApproveBtn"
          color="primary"
          rounded
          elevation="1"
          class="w-160 py-5 mr-0 mr-md-3"
          :disabled="isDisable"
          @click="onShowConfirmResultApprove"
        >
          {{ $t("booking.labels.approve") }}
        </v-btn>
      </v-layout>
    </v-container>

    <dia-log-confirm
      :obj-confirm="objConfirm"
      @close-dialog="objConfirm.showDialogConfirm = false"
      @accept-action="acceptClose"
    />

    <DialogConfirmSave
      :title-confirm="titleConfirmDialog"
      :show-dialog="showConfirmDialog"
      @close-dialog="closeDialog"
      @accept-action="acceptConfirmDoc"
      @reason="inputReason"
    />

    <base-material-snackbar
      v-model="isShowAlert"
      type="error"
      v-bind="{
        top: true,
        right: true,
      }"
    >
      {{ message }}
    </base-material-snackbar>
  </div>
</template>

<script>
import Breadcrumbs from "./components/Breadcrumbs";
import LocationInfo from "./components/LocationInfo";
import BookingInfoExpand from "./components/BookingInfoExpand";
import ParticipantExpand from "./components/ParticipantExpand";
import routePaths from "@/modules/carbooking/router/routePaths";
import { mapActions } from "vuex";
import constants from "@/constants";
import { BookingService } from "@/modules/carbooking/services/bookingService";
import Approver from "./components/Approver";
import ListLink from "./components/ListLink";
import ChooseCar from "./components/ChooseCar";
import DiaLogConfirm from "@/modules/etask/views/components/DiaLogConfirm";
import DialogConfirmSave from "@/modules/carbooking/views/components/DialogConfirm.vue";
import CryptoJS from "crypto-js";

export default {
  components: {
    Breadcrumbs,
    LocationInfo,
    BookingInfoExpand,
    ParticipantExpand,
    Approver,
    ListLink,
    ChooseCar,
    DiaLogConfirm,
    DialogConfirmSave,
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("booking.labels.booking-car-list"),
          disabled: false,
          href: "booking-car-list",
        },
        {
          text: this.$t("booking.labels.booking-car-detail"),
          disabled: true,
          tooltip: false,
        },
      ],
      isShowApprove: true,
      isShowAlert: false,
      message: "",
      isDisable: true,
      isDisableSaveApprove: false,
      approver: {},
      id: this.$route.query.id,
      detail: null,
      driverAvatar: null,
      isApprove: false,
      vehicleInfoDtos: [],
      originBookingInfos: [],
      approveGroupInfos: [],
      vehicleInfoAdd: [
        {
          id: "",
          vehicleRequestId: "",
          seatRequest: 0,
          status: "",
          orgStatus: "",
          vehicleId: "",
          driverId: "",
          isShowChoose: true,
          dataSelected: {},
          isShowChooseSeat: true,
        },
      ],
      refers: [],
      startTime: "",
      endTime: "",
      objConfirm: {
        titleConfirm: "",
        showDialogConfirm: false,
        isReason: false,
        isNull: false,
        comment: "",
      },
      dataApprove: {
        id: this.$route.query.id,
        note: "duyet yeu cau dat xe",
        vehicleInfoDtos: [],
      },
      dataInitial: [],
      isStatus: 1,
      titleConfirmDialog: "",
      showConfirmDialog: false,
      reason: null,
      userInfo: localStorage.getItem("USER_INFO"),
      enableCancelButton: false,
      enableApproveBtn: false,
      participantUserList: [],
    };
  },
  created() {
    this.initData();
    if (
      JSON.parse(this.userInfo).roles.filter((x) => x === "VEHICLE").length ===
      1
    ) {
      this.enableApproveBtn = true;
      this.enableCancelButton = true;
    }
  },
  methods: {
    ...mapActions("layout", ["setAvatar", "setNotify"]),
    compareData() {
      if (this.vehicleInfoAdd[0].driverId.length) {
        return true;
      }
      var dataCompare = [];
      this.vehicleInfoDtos.forEach((it) => {
        if (Object.keys(it.dataSelected).length) {
          dataCompare.push(it.dataSelected);
        }
      });
      if (
        CryptoJS.MD5(JSON.stringify(dataCompare)).toString() ===
        CryptoJS.MD5(JSON.stringify(this.dataInitial)).toString()
      ) {
        return true;
      }
      return false;
    },

    setDatarequest(data) {
      data.forEach((it) => {
        if (Object.keys(it.dataSelected).length) {
          this.dataApprove.vehicleInfoDtos.push({
            id: it.id,
            vehicleRequestId: this.id,
            seatRequest: it.seatRequest,
            status: it.status,
            orgStatus: it.orgStatus,
            vehicleId: it.dataSelected.vehicleId,
            driverId: it.dataSelected.driverId,
          });
        }
      });
    },
    onCheckApprove(data) {
      this.isDisable = data;
      this.isDisableSaveApprove = data;
    },
    async acceptClose() {
      try {
        let content = "";
        this.dataApprove.vehicleInfoDtos = [];
        this.setDatarequest(this.vehicleInfoDtos);
        this.setDatarequest(this.vehicleInfoAdd);
        if (this.isShowApprove) {
          await BookingService.approve(this.dataApprove);
          content = "booking.messages.approve-booking-success";
        } else {
          if (!this.compareData()) {
            await BookingService.updateApprove(this.dataApprove);
          }
          this.isStatus = 2;
          this.isShowApprove = true;
          content = "booking.messages.update-booking-success";
        }
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: content,
        });
        this.goToBack();
      } catch (error) {
        this.message = error.toString().replace("Error:", " ");
        this.isShowAlert = true;
      }
    },

    onChangeApprove() {
      this.isStatus = 1;
      this.isShowApprove = false;
    },

    onShowConfirmResultApprove() {
      this.objConfirm.titleConfirm = this.isShowApprove
        ? "booking.messages.approve-booking"
        : "booking.messages.update-booking";
      this.objConfirm.showDialogConfirm = true;
    },

    onVehecle() {
      this.vehicleInfoAdd.push({
        id: "",
        vehicleRequestId: "",
        seatRequest: 0,
        status: 0,
        orgStatus: "",
        vehicleId: "",
        driverId: "",
        isShowChoose: true,
        dataSelected: {},
        isShowChooseSeat: true,
        popupType: null,
      });
    },

    async initData() {
      try {
        const pars = {
          vehicleRequestId: this.id,
        };
        const response = await BookingService.detailBooking(pars);
        this.detail = response.data;
        this.originBookingInfos = this.detail?.originBookingInfos;
        this.refers = this.detail?.refers;
        this.vehicleInfoDtos = this.detail?.vehicleInfoDtos;
        this.vehicleInfoDtos?.forEach((it) => {
          if (it.driverName && it.driverName.length) {
            const dataSelect = { ...it };
            it.isShowChoose = false;
            it.dataSelected = dataSelect;
            this.dataInitial.push({ ...dataSelect });
            return;
          }
          it.isShowChoose = true;
          it.dataSelected = {};
        });
        this.startTime = this.detail?.startTime;
        this.endTime = this.detail?.endTime;
        this.isStatus = this.detail?.realStatus;
        if (this.detail?.approveUserInfo) {
          this.approver = this.detail.approveUserInfo;
        } else {
          this.approveGroupInfos = this.detail?.approveGroupInfos;
        }
        if (
          this.detail?.requestUserInfo.userId ===
          JSON.parse(this.userInfo).userId
        ) {
          this.enableCancelButton = true;
        } else {
          this.enableCancelButton = false;
        }
        if (this.detail?.participantDtos.length > 1) {
          this.participantUserList = this.detail.participantDtos.filter(
            (x) => x.roleType === 1
          );
          this.detail.participantDtos
            .filter((x) => x.roleType !== 1)
            .forEach((x) => {
              this.participantUserList.push(x);
            });
        }
        // if (this.detail.participantDtos?.length === 1) {
        //   var avatar = await Promise.all(
        //     this.detail.participantDtos.map((x) =>
        //       this.downloadAvatar(x.avatar)
        //     )
        //   );
        //   this.driverAvatar = avatar[0];
        // } else {
        //   var listAvatar = await Promise.all(
        //     this.detail.participantDtos.map((x) =>
        //       this.downloadAvatar(x.avatar)
        //     )
        //   );
        //   this.detail.participantDtos.forEach((x, index) => {
        //     x.avatar = listAvatar[index];
        //   });
        // }
      } catch (error) {
        console.log(error);
      }
    },
    async downloadAvatar(avatar) {
      const objAvatar = {
        filePath: avatar,
        storage: "storage0",
      };
      try {
        const response = await BookingService.downloadImage({
          ...objAvatar,
        });
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    showPopupConfirm(type) {
      this.popupType = type;
      if (type === "cancel") {
        this.titleConfirmDialog = "booking.messages.cancel-booking";
      } else if (type === "reject") {
        this.titleConfirmDialog = "booking.messages.reject-booking";
      }
      this.dialogConfirm();
      return;
    },
    async acceptConfirmDoc() {
      try {
        const pars = {
          id: this.id,
          reason: this.reason,
        };
        if (this.popupType === "cancel" && this.reason) {
          await BookingService.cancelBooking(pars);
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "booking.messages.cancel-success",
          });
          setTimeout(() => {
            this.goToBack();
          }, 1000);
        }
        if (this.popupType === "reject" && this.reason) {
          await BookingService.rejectBooking(pars);
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "booking.messages.reject-success",
          });
          setTimeout(() => {
            this.goToBack();
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
    inputReason(val) {
      this.reason = val;
    },
    dialogConfirm() {
      this.showConfirmDialog = true;
    },
    closeDialog() {
      this.reasonRules = [];
      this.showConfirmDialog = false;
    },
    goToBack() {
      this.$router.push({
        path: routePaths.LIST_BOOKING_CAR_PATH,
      });
    },
  },
};
</script>
