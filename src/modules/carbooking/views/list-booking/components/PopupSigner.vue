<template>
  <v-fade-transition>
    <div
      v-if="carInfoColumn"
      v-show="activeIndex == index"
      class="wrap-popup-list-signer"
      :class="{ active: listShowPopup[index] }"
    >
      <div class="popup-list-signer">
        <div class="popup-header d-flex align-center justify-space-between">
          <div>
            <span>{{ $t("booking.labels.car-list") }}</span>
            <span> ({{ item.strVehicleInfo.length }})</span>
          </div>
          <v-btn
            text
            icon
            class="btn-close-list-signer"
            @click="closePopupCustomer(index)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider class="my-1" />
        <div class="list-signer">
          <div
            v-for="(signer, itemIndex) in item.strVehicleInfo"
            :key="itemIndex"
            class="list-item-signer pb-2"
          >
            <div class="d-flex align-start">
              <v-avatar size="32" :color="lstColors[itemIndex % 5]">
                <span class="text-uppercase white--text">{{
                  getFirstCharacter(signer)
                }}</span>
              </v-avatar>
              <div class="d-flex flex-column align-start pl-2">
                <div>
                  <b>{{ renderName(signer) }}</b>
                  <span class="pl-1">{{ signer.phone }}</span>
                </div>
                <div class="signer-document">
                  <b>{{ signer.vehicleName }}</b>
                  <span class="pl-1">{{ signer.licensePlates }}</span>
                </div>
                <v-chip class="mt-1 pa-2" color="#CCF3FE" small>
                  {{
                    $t("booking.labels.car") +
                    " " +
                    signer.seatNumberType +
                    " " +
                    $t("booking.labels.seat")
                  }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      v-show="activeParticipateIndex == index"
      class="wrap-popup-list-signer"
      :class="{ active: listParticipateShowPopup[index] }"
    >
      <div class="popup-list-signer">
        <div class="popup-header d-flex align-center justify-space-between">
          <div>
            <span>{{ $t("booking.labels.participant-list") }}</span>
            <span> ({{ item.strParticipantInfo.length }})</span>
          </div>
          <v-btn
            text
            icon
            class="btn-close-list-signer"
            @click="closePopupCustomer(index)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider class="my-1" />
        <div class="list-signer">
          <div
            v-for="(it, itemIndex) in item.strParticipantInfo"
            :key="itemIndex"
            class="list-item-signer pb-2"
          >
            <div class="d-flex align-start">
              <v-avatar
                v-if="item.strParticipantInfo.length === 1"
                size="32"
                :color="lstColors[itemIndex % 5]"
              >
                <!-- <img v-if="driverAvatar" :src="driverAvatar" />
                <span v-else class="text-uppercase white--text">
                  {{ getFirstCharacter(it) }}
                </span> -->
                <span class="text-uppercase white--text">
                  {{ getFirstCharacter(it) }}
                </span>
              </v-avatar>
              <v-avatar v-else size="32" :color="lstColors[itemIndex % 5]">
                <!-- <img
                  v-if="displayAvatar[itemIndex]"
                  :src="displayAvatar[itemIndex]"
                />
                <span v-else class="text-uppercase white--text">
                  {{ getFirstCharacter(it) }}
                </span> -->
                <span class="text-uppercase white--text">
                  {{ getFirstCharacter(it) }}
                </span>
              </v-avatar>
              <div class="d-flex flex-column align-start pl-2">
                <b>{{ itemIndex + 1 + "." }}{{ renderName(it) }}</b>
                <span>
                  {{ getTextTruncateView(it.email, 20) }} -
                  {{ it.phone }}
                </span>
                <span>{{ it.parameterValue }}</span>
                <span>{{ it.groupName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-fade-transition>
</template>

<script>
import { BookingService } from "@/modules/carbooking/services/bookingService";
import { getTextTruncate } from "@/modules/carbooking/helpers/bookingUtils";

export default {
  props: {
    carInfoColumn: {
      type: Boolean,
      default: undefined,
    },
    activeIndex: {
      type: Number,
      default: undefined,
    },
    activeParticipateIndex: {
      type: Number,
      default: undefined,
    },
    index: {
      type: Number,
      default: undefined,
    },
    listShowPopup: {
      type: Array,
      default: undefined,
    },
    listParticipateShowPopup: {
      type: Array,
      default: undefined,
    },
    item: {
      type: Object,
      default: undefined,
    },
    lstColors: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      driverAvatar: null,
      listAvatar: [],
      displayAvatar: [],
    };
  },
  created() {
    this.getAvatar();
  },
  methods: {
    closePopupCustomer(index) {
      this.$emit("close-popup-signer", index);
    },
    getFirstCharacter(signer) {
      if (!signer) return "";
      if (signer.fullName) {
        return this.genAvatar(signer.fullName);
      }
      return this.genAvatar(signer.fullName);
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
    async getAvatar() {
      var avatar = await Promise.all(
        this.item.strParticipantInfo.map((x) => this.downloadAvatar(x.avatar))
      );
      if (avatar.length === 1) {
        this.driverAvatar = avatar[0];
      } else if (avatar.length > 1) {
        this.listAvatar.push(avatar);
        this.listAvatar.forEach((x) => {
          this.displayAvatar = x;
        });
      }
      return this.driverAvatar;
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
    renderName(signer) {
      return signer.fullName;
    },
  },
};
</script>

<style lang="scss" scoped></style>
