<template>
  <div>
    <v-expansion-panels v-model="expanded" class="rounded-0 no-z-index">
      <v-expansion-panel class="rounded-0">
        <v-expansion-panel-header color="overlay" class="rounded-0">
          <v-layout justify-space-between>
            <v-layout align-center>
              <v-avatar color="white" size="30" class="align-center mr-4">
                <i class="app-icon icon-participants darken icon-size-22"></i>
              </v-avatar>
              <h6>
                {{ $t("booking.labels.participants") }} ({{
                  detail?.participantDtos.length
                }})
              </h6>
            </v-layout>
          </v-layout>
        </v-expansion-panel-header>
        <v-expansion-panel-content
          class="participant-info overflow-y-auto pt-4 pa-0"
        >
          <v-simple-table>
            <template v-slot:default>
              <tbody class="text--body-1">
                <tr
                  v-for="(item, index) in participantUserList"
                  :key="index"
                  class="item-review"
                >
                  <td class="group-avatar-signer text-center">
                    <v-avatar size="32" color="#00C3F9" class="signer-avatar">
                      <span class="text-uppercase white--text">
                        {{ getFirstCharacter(item) }}
                      </span>
                      <div class="signer-tooltip">
                        <div class="d-flex align-start">
                          <v-avatar size="32" color="#00C3F9">
                            <span class="text-uppercase white--text">{{
                              getFirstCharacter(item)
                            }}</span>
                          </v-avatar>
                          <div class="d-flex flex-column align-start pl-2">
                            <b>{{ item.fullName }}</b>
                            <span>
                              {{ getTextTruncateView(item.email, 20) }} -
                              {{ item.phone }}
                            </span>
                            <span>{{ item.parameterValue }}</span>
                            <span>{{ item.groupName }}</span>
                          </div>
                        </div>
                      </div>
                    </v-avatar>
                    <!-- <v-avatar
                      v-if="detail.participantDtos.length === 1"
                      size="32"
                      color="#00C3F9"
                    >
                      <img v-if="driverAvatar" :src="driverAvatar" />
                      <span v-else class="text-uppercase white--text">{{
                        getFirstCharacter(item)
                      }}</span>
                    </v-avatar>
                    <v-avatar
                      v-else
                      size="32"
                      color="#00C3F9"
                    >
                      <img v-if="item.avatar" :src="item.avatar" />
                      <span v-else class="text-uppercase white--text">{{
                        getFirstCharacter(item)
                      }}</span>
                    </v-avatar> -->
                  </td>
                  <td class="d-flex align-center">
                    <b>{{ item.fullName }}</b>
                    <v-tooltip top content-class="tooltip-top">
                      <template v-slot:activator="{ on, attrs }">
                        <img
                          class="mt-n4"
                          v-on="on"
                          v-bind="attrs"
                          v-if="item.roleType === 1"
                          src="@/assets/icons/icon-award.svg"
                        />
                      </template>
                      <span>{{ $t("booking.labels.host-booking") }}</span>
                    </v-tooltip>
                  </td>
                  <td>
                    <b>{{ item.email }}</b>
                  </td>
                  <td>
                    <b>{{ item.phone }}</b>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { getTextTruncate } from "@/modules/carbooking/helpers/bookingUtils";

export default {
  props: {
    detail: {
      type: Object,
      default: undefined,
    },
    driverAvatar: {
      type: String,
      default: undefined,
    },
    participantUserList: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      expanded: 0,
    };
  },
  created() {},
  methods: {
    getFirstCharacter(item) {
      if (!item) return "";
      if (item.fullName) {
        return this.genAvatar(item.fullName);
      }
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
    getTextTruncateView(val, size) {
      return getTextTruncate(val, size);
    },
  },
};
</script>
