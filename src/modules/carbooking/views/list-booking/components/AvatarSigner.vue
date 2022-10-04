<template>
  <div v-if="carInfoColumn">
    <template>
      <v-avatar
        size="32"
        class="signer-avatar"
        :color="lstColors[0]"
        @click="activeShowPopupSigner(indexRow)"
      >
        <span class="text-uppercase white--text">
          {{ getFirstCharacter(item.strVehicleInfo[0]) }}
        </span>
        <div class="signer-tooltip">
          <div class="d-flex align-start">
            <v-avatar
              size="32"
              :color="lstColors[0]"
              @click="activeShowPopupSigner(indexRow)"
            >
              <span class="text-uppercase white--text">{{
                getFirstCharacter(item.strVehicleInfo[0])
              }}</span>
            </v-avatar>
            <div class="d-flex flex-column align-start pl-2">
              <div>
                <b>{{ renderName(item.strVehicleInfo[0]) }}</b>
                <span
                  class="pl-1"
                  v-html="renderPhone(item.strVehicleInfo[0])"
                />
              </div>
              <div class="mt-1">
                <b v-html="renderCarName(item.strVehicleInfo[0])" />
                <span
                  class="pl-1"
                  v-html="renderCarLicense(item.strVehicleInfo[0])"
                />
              </div>
              <v-chip
                class="mt-1 pa-2"
                color="#CCF3FE"
                small
                v-html="renderCarType(item.strVehicleInfo[0])"
              ></v-chip>
            </div>
          </div>
        </div>
      </v-avatar>
      <div
        v-for="(it, index) in item.strVehicleInfo"
        :key="index"
        class="signer-info"
      >
        <span class="fw-600">{{ it.fullName }}</span>
        <span class="greya7--text">{{ it.phone }}</span>
        <v-chip color="#CCF3FE" x-small>
          <b>
            {{
              $t("booking.labels.car") +
              " " +
              it.seatNumberType +
              " " +
              $t("booking.labels.seat")
            }}
          </b>
        </v-chip>
      </div>
    </template>
  </div>
  <div v-else>
    <template>
      <v-avatar
        size="32"
        class="signer-avatar"
        :color="lstColors[0]"
        @click="activeShowPopupSigner(indexRow)"
      >
        <!-- <img :src="driverAvatar" /> -->
        <span class="text-uppercase white--text">{{
          getFirstCharacter(item.strParticipantInfo[0])
        }}</span>
        <div class="signer-tooltip">
          <div class="d-flex align-start">
            <v-avatar
              size="32"
              :color="lstColors[0]"
              @click="activeShowPopupSigner(indexRow)"
            >
              <!-- <img :src="driverAvatar" /> -->
              <span class="text-uppercase white--text">{{
                getFirstCharacter(item.strParticipantInfo[0])
              }}</span>
            </v-avatar>
            <div class="d-flex flex-column pl-2 text-left">
              <b>{{ renderName(item.strParticipantInfo[0]) }}</b>
              <span v-html="renderEmailPhone(item.strParticipantInfo[0])" />
              <span v-html="renderPositionName(item.strParticipantInfo[0])" />
              <span v-html="renderGroupName(item.strParticipantInfo[0])" />
            </div>
          </div>
        </div>
      </v-avatar>
      <div
        v-for="(it, index) in item.strParticipantInfo"
        :key="index"
        class="signer-info"
      >
        <span class="fw-600">{{ it.userName }}</span>
      </div>
    </template>
  </div>
</template>

<script>
// import { BookingService } from "@/modules/carbooking/services/bookingService";
import { getTextTruncate } from "@/modules/carbooking/helpers/bookingUtils";

export default {
  props: {
    item: {
      type: Object,
      default: undefined,
    },
    lstColors: {
      type: Array,
      default: undefined,
    },
    indexRow: {
      type: Number,
      default: undefined,
    },
    carInfoColumn: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
    return {
      // driverAvatar: null,
    };
  },
  created() {
    // this.getAvatar();
  },
  methods: {
    activeShowPopupSigner(index) {
      this.$emit("active-show-popup-signer", index);
    },
    getFirstCharacter(signer) {
      if (this.carInfoColumn) {
        if (!signer) return "";
        if (signer.fullName) {
          return this.genAvatar(signer.fullName);
        }
      } else {
        if (!signer) return "";
        if (signer.fullName) {
          return this.genAvatar(signer.fullName);
        }
      }
    },
    getTextTruncateView(val, size) {
      return getTextTruncate(val, size);
    },
    genAvatar(name) {
      if (!name) return "";
      if (name.includes("+")) return name;
      if (name.includes(" ")) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(" ").pop();
        return lastName[0].toUpperCase();
      }
      return name[0].toUpperCase();
    },
    // async getAvatar() {
    //   var avatar = await Promise.all(
    //     this.item.strParticipantInfo.map((x) => this.downloadAvatar(x.avatar))
    //   );
    //   this.driverAvatar = avatar[0];
    //   return this.driverAvatar;
    // },
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
    renderName(signer) {
      return signer.fullName;
    },
    renderPhone(signer) {
      return signer.phone;
    },
    renderCarLicense(signer) {
      return signer.licensePlates;
    },
    renderCarName(signer) {
      return signer.vehicleName;
    },
    renderCarType(signer) {
      return `<b style='font-size: 12px'>${this.$t("booking.labels.car")} ${
        signer.seatNumberType
      } ${this.$t("booking.labels.seat")}</b>`;
    },
    renderEmailPhone(signer) {
      return this.getTextTruncateView(signer.email, 20) + " - " + signer.phone;
    },
    renderPositionName(signer) {
      return signer.parameterValue;
    },
    renderGroupName(signer) {
      return signer.groupName;
    },
  },
};
</script>

<style lang="scss" scoped></style>
