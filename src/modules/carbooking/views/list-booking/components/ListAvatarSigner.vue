<template>
  <div v-if="carInfoColumn">
    <template v-for="(signer, index) in item.strVehicleInfo">
      <v-avatar
        v-if="index < 5 || (item.strVehicleInfo.length < 5 && index == 4)"
        :key="index"
        size="32"
        :color="lstColors[index % 5]"
        class="signer white--text"
        :style="`left: ${20 * index}px`"
        @click="activeShowPopupSigner(indexRow)"
      >
        <span class="text-uppercase">{{ getFirstCharacter(signer) }}</span>
        <div class="signer-tooltip">
          <div class="d-flex align-start">
            <v-avatar
              size="32"
              :color="lstColors[index % 4]"
              @click="activeShowPopupSigner(indexRow)"
            >
              <span class="text-uppercase white--text">{{
                getFirstCharacter(signer)
              }}</span>
            </v-avatar>
            <div class="d-flex flex-column align-start pl-2">
              <div>
                <b>{{ renderName(signer) }}</b>
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
    </template>
  </div>
  <div v-else>
    <template v-for="(signer, index) in item.strParticipantInfo">
      <v-avatar
        v-if="index < 4 || (item.strParticipantInfo.length < 4 && index == 3)"
        :key="index"
        size="32"
        :color="lstColors[index % 4]"
        class="signer white--text"
        :style="`left: ${20 * index}px`"
        @click="activeShowPopupSigner(indexRow)"
      >
        <!-- <img v-if="signer.avatar" :src="signer.avatar" />
        <span v-else class="text-uppercase white--text">{{
          getFirstCharacter(signer)
        }}</span> -->
        <span class="text-uppercase white--text">
          {{ getFirstCharacter(signer) }}
        </span>
        <div class="signer-tooltip">
          <div class="d-flex align-start">
            <v-avatar
              size="32"
              :color="lstColors[index % 3]"
              @click="activeShowPopupSigner(indexRow)"
            >
              <!-- <img v-if="signer.avatar" :src="signer.avatar" />
              <span v-else class="text-uppercase white--text">{{
                getFirstCharacter(signer)
              }}</span> -->
              <span class="text-uppercase white--text">{{
                getFirstCharacter(signer)
              }}</span>
            </v-avatar>
            <div class="d-flex flex-column pl-2 text-left">
              <b>{{ renderName(signer) }}</b>
              <span>
                {{ getTextTruncateView(signer.email, 20) }} -
                {{ signer.phone }}
              </span>
              <span>{{ signer.parameterValue }}</span>
              <span>{{ signer.groupName }}</span>
            </div>
          </div>
        </div>
      </v-avatar>
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
    //   var listAvatar = await Promise.all(
    //     this.item.strParticipantInfo.map((x) => this.downloadAvatar(x.avatar))
    //   );
    //   this.item.strParticipantInfo.forEach((x, index) => {
    //     x.avatar = listAvatar[index];
    //   });
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
    renderCarLicense(signer) {
      return signer.licensePlates;
    },
    renderCarName(signer) {
      return signer.vehicleName;
    },
    renderPhone(signer) {
      return signer.phone;
    },
    renderCarType(signer) {
      return `<b style='font-size: 12px'>${this.$t("booking.labels.car")} ${
        signer.seatNumberType
      } ${this.$t("booking.labels.seat")}</b>`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
