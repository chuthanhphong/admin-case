<template>
  <div>
    <v-expansion-panels v-model="expanded" flat>
      <v-expansion-panel>
        <v-expansion-panel-header
          color="#00C3F9"
          text-color="#fff"
          class="rounded-0"
        >
          <v-layout justify-space-between>
            <v-layout align-center>
              <v-avatar
                color="white"
                size="30"
                class="align-center mr-1 pt-3 pb-2"
              >
                <div>
                  <img src="@/assets/icons/info-detail.svg" alt="" />
                </div>
              </v-avatar>
              <div class="text-title">
                {{
                  isStatus === 1
                    ? $t("booking.screen-detail.choose-car.choose-car-approve")
                    : $t("booking.screen-detail.choose-car.info-car-approve")
                }}
              </div>
            </v-layout>
          </v-layout>
          <template v-slot:actions>
            <v-icon color="white"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="overflow-y-auto pt-4">
          <div v-if="isStatus === 1">
            <div class="note-requier">
              {{ $t("booking.screen-detail.choose-car.required") }}:
            </div>
            <div
              v-for="(it, index) in originBookingInfos"
              :key="index"
              class="note-requier"
            >
              &nbsp; &#8226; {{ it.amount }} &nbsp;
              <img src="@/assets/icons/ic-car.svg" alt="" />
              &nbsp;
              {{ it.seatNumber }} chỗ
            </div>
          </div>

          <div v-if="vehicleInfoDtos.length">
            <div v-for="(it, index) in vehicleInfoDtos" :key="index">
              <div v-if="isStatus === 1" class="list-item-book-car mt-2 pb-4">
                <div class="title-name">{{ it.seatRequest }} CHỖ:</div>
                <div v-if="it.isShowChoose" style="width: 100%">
                  <v-autocomplete
                    :items="transportData"
                    :no-data-text="$t('noData')"
                    placeholder="Nhập tên tài xế / tên xe"
                    class="text--body-5"
                    dense
                    outlined
                    solo
                    append-icon="mdi-magnify"
                    :no-filter="true"
                    @change="onSelected($event, index)"
                    @click="findTransport(it.seatRequest)"
                    @update:search-input="findTransport(it.seatRequest, $event)"
                  >
                    <template v-slot:item="data">
                      <div
                        v-if="isStatus === 1 && transportData.length"
                        class="item"
                      >
                        <v-list-item color="transparent">
                          <div class="d-flex nowrap" style="width: 100%">
                            <div
                              class="d-flex flex-column justify-center div-avatar"
                            >
                              <v-avatar
                                class="mr-2"
                                size="40px"
                                color="primary"
                              >
                                <img v-if="false" />
                                <b v-else class="text-uppercase white--text">{{
                                  data.item.driverName &&
                                  data.item.driverName[0]
                                }}</b>
                              </v-avatar>
                            </div>
                            <div
                              class="d-flex flex-column justify-left align-left div-content"
                            >
                              <span class="title-name">
                                {{ data.item.driverName }} - Tài xế
                              </span>
                              <span class="sub-title-phone">
                                {{ data.item.driverPhone }}
                              </span>
                              <span class="sub-title-car">
                                {{ data.item.vehicleName }} -
                                {{ data.item.licensePlates }}
                              </span>
                            </div>
                          </div>
                        </v-list-item>
                      </div>
                    </template>
                  </v-autocomplete>
                </div>

                <div v-else class="mt-4">
                  <div class="user">
                    <v-list-item color="transparent">
                      <div class="d-flex nowrap" style="width: 100%">
                        <div
                          class="d-flex flex-column justify-center div-avatar"
                        >
                          <v-avatar class="mr-4" size="80px" color="primary">
                            <img v-if="false" />
                            <b v-else class="text-uppercase white--text">{{
                              it.dataSelected?.driverName &&
                              it.dataSelected?.driverName[0]
                            }}</b>
                          </v-avatar>
                        </div>
                        <div
                          class="d-flex flex-column justify-left align-left div-content"
                        >
                          <span class="title-name mb-2 mt-1">
                            {{ it.dataSelected?.driverName }} - Tài xế
                          </span>
                          <span class="sub-title-phone mb-2">
                            {{ it.dataSelected?.driverPhone }}
                          </span>
                          <span class="sub-title-car">
                            {{ it.dataSelected?.vehicleName }} -
                            {{ it.dataSelected?.licensePlates }}
                          </span>
                        </div>
                      </div>
                    </v-list-item>
                    <div v-if="isStatus === 1" class="ic-delete">
                      <v-btn icon @click="onCloseSelected(index)">
                        <v-icon color="#FF4A55"> mdi-close </v-icon>
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="isStatus === 2 && it.dataSelected?.driverName?.length"
                class="list-item-book-car mt-2 pb-4"
              >
                <div class="title-name mb-3">{{ it.seatRequest }} Chỗ:</div>
                <div class="user">
                  <v-list-item color="transparent">
                    <div class="d-flex nowrap" style="width: 100%">
                      <div class="d-flex flex-column justify-center div-avatar">
                        <v-avatar class="mr-4" size="80px" color="primary">
                          <img v-if="false" />
                          <b v-else class="text-uppercase white--text">{{
                            it.dataSelected?.driverName &&
                            it.dataSelected?.driverName[0]
                          }}</b>
                        </v-avatar>
                      </div>
                      <div
                        class="d-flex flex-column justify-left align-left div-content"
                      >
                        <span class="title-name mb-2 mt-1">
                          {{ it.dataSelected?.driverName }} - Tài xế
                        </span>
                        <span class="sub-title-phone mb-2">
                          {{ it.dataSelected?.driverPhone }}
                        </span>
                        <span class="sub-title-car">
                          {{ it.dataSelected?.vehicleName }} -
                          {{ it.dataSelected?.licensePlates }}
                        </span>
                      </div>
                    </div>
                  </v-list-item>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isStatus === 1 && vehicleInfoAdd.length">
            <selected-car
              :item-type-car="itemTypeCar"
              :vehicle-info-dtos="vehicleInfoAdd"
              :transport-data="transportData"
              @onSelected="onSelectedAdd"
              @onCloseSelected="onCloselecteddAdd"
              @findTransport="findTransport"
            />
          </div>
          <v-btn
            v-if="isStatus === 1"
            class="add-car text-center mt-4"
            :disabled="isDisableAdd"
            @click="onClickAddCar"
          >
            {{ $t("booking.screen-detail.choose-car.btn-addCar") }}
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { BookingService } from "@/modules/carbooking/services/bookingService";
import SelectedCar from "./SelectedCar";
import moment from "moment";

export default {
  components: {
    SelectedCar,
  },

  props: {
    isStatus: {
      type: Number,
      default: 1,
    },
    originBookingInfos: {
      type: Array,
      default: () => [],
    },
    vehicleInfoAdd: {
      type: Array,
      default: () => [],
    },
    vehicleInfoDtos: {
      type: Array,
      default: () => [],
    },
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    isShowApprove: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      expanded: 0,
      itemTypeCar: [],
      isShowAdd: false,
      isDisableAdd: true,
      transportData: [],
      transferVehicleData: [],
      itemSearch: [],
    };
  },

  watch: {
    startTime() {
      this.findTransport();
    },
  },

  created() {
    this.getSeatType();
  },

  methods: {
    onClickAddCar() {
      this.isDisableAdd = true;
      this.$emit("addVehecle");
    },

    async getSeatType() {
      try {
        const res = await BookingService.getSeatType();
        this.itemTypeCar = res.data ? res.data : [];
      } catch (error) {
        console.log(error);
      }
    },

    onSelectedAdd(data, index) {
      this.vehicleInfoAdd[index].isShowChooseSeat = false;
      this.vehicleInfoAdd[index].isShowChoose = false;
      this.vehicleInfoAdd[index].dataSelected = data;
      if (!this.vehicleInfoAdd[this.vehicleInfoAdd.length - 1].isShowChoose) {
        this.isDisableAdd = false;
      }
      this.checkShowApprove();
    },

    onCloselecteddAdd(index) {
      this.vehicleInfoAdd[index].isShowChooseSeat = true;
      this.vehicleInfoAdd[index].isShowChoose = true;
      this.vehicleInfoAdd[index].dataSelected = {};
      if (this.vehicleInfoAdd[this.vehicleInfoAdd.length - 1].isShowChoose) {
        this.isDisableAdd = true;
      }
      this.checkShowApprove();
    },

    onCloseSelected(index) {
      this.vehicleInfoDtos[index].isShowChoose = true;
      if (this.isShowApprove) {
        this.vehicleInfoDtos[index].dataSelected = {};
      } else {
        this.transferVehicleData.push({
          ...this.vehicleInfoDtos[index].dataSelected,
        });
        this.vehicleInfoDtos[index].dataSelected.driverId = null;
        this.vehicleInfoDtos[index].dataSelected.vehicleId = null;
      }
      this.checkShowApprove();
      this.transportData = [];
    },

    onSelected(data, index) {
      this.vehicleInfoDtos[index].isShowChoose = false;
      this.vehicleInfoDtos[index].dataSelected = data;
      this.checkShowApprove();
      this.transportData = [];
    },

    checkShowApprove() {
      if (this.isStatus !== 1) {
        return;
      }
      this.$emit("isDisable", true);
      this.vehicleInfoDtos.forEach((it) => {
        if (
          Object.keys(it.dataSelected).length &&
          it.dataSelected.driverId !== null
        ) {
          this.$emit("isDisable", false);
        }
      });
      this.vehicleInfoAdd.forEach((it) => {
        if (Object.keys(it.dataSelected).length) {
          this.$emit("isDisable", false);
        }
      });
    },

    async findTransport(seatNumber, event) {
      if (typeof event === "object") {
        return;
      }
      try {
        this.transportData = [];
        const dataRequest = {
          seatNumber: seatNumber,
          textSearch: event,
          startTime: moment(this.startTime).format("YYYY-MM-DD HH:mm"),
          endTime: moment(this.endTime).format("YYYY-MM-DD HH:mm"),
        };
        const res = await BookingService.findTransport(dataRequest);
        this.transportData = res.data.data;
        this.transferVehicleData.map((x) => {
          x.driverName = x.driverName.toLowerCase();
          x.vehicleName = x.vehicleName.toLowerCase();
        });
        this.itemSearch = this.transferVehicleData.filter((it) => {
          event = event + "";
          if (
            it.driverName.includes(event.toLowerCase()) ||
            it.vehicleName.includes(event.toLowerCase()) ||
            event === "undefined"
          ) {
            return it;
          }
        });
        if (this.itemSearch.length && this.transferVehicleData.length) {
          if (this.transportData === undefined) {
            this.transportData = [];
          }
          this.itemSearch.forEach((x) => {
            this.transportData.push(x);
          });
          this.transportData = this.transportData.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.id === item.id)
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.v-text-field__details) {
  display: none;
  margin-top: 0px;
  height: 70px;
}
.note-requier {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #ff4a55;
  font-style: italic;
}
.text-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #fff;
}
.add-car {
  width: 100%;
  height: 38px;
  background: #ffffff;
  border: 1px solid #00c3f9;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 40px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-transform: uppercase;
  color: #009cc7;
  &:disabled {
    border: none;
    box-shadow: none;
  }
}
.title-name {
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  text-transform: capitalize;
  color: #22242c;
}

.sub-title-phone {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-transform: capitalize;
  color: #4e5056;
}

.sub-title-car {
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  text-transform: capitalize;
  color: #a7a7ab;
}
</style>
