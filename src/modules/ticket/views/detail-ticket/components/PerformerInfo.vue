<template>
  <v-expansion-panels
    v-model="expanded"
    class="rounded-xl rounded-b-0 no-z-index"
  >
    <v-expansion-panel class="rounded-xl rounded-b-0">
      <v-expansion-panel-header :hide-actions="!hasAttributeExpectEndDate">
        <v-layout justify-space-between>
          <v-layout align-center>
            <div v-if="hasAttributeInfoUser">
              <v-menu
                :key="`has-performer${detail.groupId}`"
                :close-on-content-click="closeOnContent"
                :max-width="360"
                bottom
                left
                offset-x
                origin="center center"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-avatar
                    class="mr-2"
                    color="primary"
                    size="32"
                    v-bind="attrs"
                    @click="onSetCloseOnContent"
                    v-on="on"
                  >
                    <span class="white--text text-h6 text-uppercase">
                      {{ detail.infoUser.userName[0] }}
                    </span>
                  </v-avatar>
                </template>
                <!-- is my self -->
                <assign-user
                  v-if="isAcceptAssignerAction"
                  :users-by-group-id="usersByGroupId"
                  @assign-to="updateAssignTo"
                />
                <!-- not is my self -->
                <user-info-view-popup v-else :user-info="userInfoView" />
              </v-menu>
            </div>
            <div v-else>
              <v-menu
                v-if="isAcceptAssignerActionWithNoPerformer"
                :key="`not-perform${detail.groupId}`"
                :close-on-content-click="closeOnContent"
                :max-width="360"
                bottom
                left
                offset-x
                origin="center center"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="border-dashed mr-1"
                    fab
                    outlined
                    v-bind="attrs"
                    x-small
                    @click="onSetCloseOnContent"
                    v-on="on"
                  >
                    <i class="app-icon icon-personal darken" />
                  </v-btn>
                </template>
                <!-- is my self -->
                <assign-user
                  :users-by-group-id="usersByGroupId"
                  @assign-to="updateAssignTo"
                />
              </v-menu>

              <v-btn v-else class="border-dashed mr-1" fab outlined x-small>
                <i class="app-icon icon-personal darken" />
              </v-btn>
            </div>
            <v-layout column>
              <label class="text--body-5 darken--text">
                {{
                  hasAttributeInfoUser
                    ? detail.infoUser.userName
                    : $t("tickets.labels.performer-name")
                }}
              </label>
              <label
                :class="
                  isForwardGroup
                    ? 'text-decoration-line-through gray--text'
                    : ''
                "
                class="text--overlined mt-1"
              >
                {{ detail.groupName }}
              </label>
              <v-layout v-if="isForwardGroup" align-center>
                <i
                  class="app-icon icon-move-action icon-size-20 purple mr-2"
                ></i>
                <label class="purple--text">
                  {{ detail.groupChange.name }}
                </label>
              </v-layout>
            </v-layout>
          </v-layout>
          <v-chip
            :color="getColorChipByStatus(detail.status)"
            class="mr-5"
            label
          >
            <v-layout align-center>
              <v-avatar
                :color="getColorDotByStatus(detail.status)"
                class="mr-1"
                size="15"
              >
              </v-avatar>
              <span
                :class="getColorTextByStatus(detail.status)"
                class="text-center"
                v-html="getTextByStatus(detail.status)"
              >
              </span>
            </v-layout>
          </v-chip>
        </v-layout>
        <template v-slot:actions>
          <v-icon v-if="hasAttributeExpectEndDate" color="darken">
            $expand
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="rounded-0">
        <!-- <Ranks /> -->
        <v-layout
          v-if="isShowCountDownTime || hasAttributeExpectEndDate"
          align-center
          class="border-est-duaration py-6"
          column
          justify-center
        >
          <h6 v-if="isShowCountDownTime" class="darken--text">
            {{
              isStateLate
                ? $t("tickets.labels.countdown")
                : $t("tickets.labels.delay-time")
            }}
          </h6>
          <h3
            v-if="isShowCountDownTime"
            :class="isStateLate ? 'darken--text' : 'error--text'"
          >
            {{ estTimeView }}
          </h3>
          <label
            v-if="hasAttributeExpectEndDate"
            class="text--body-5 greya7--text"
          >
            {{
              `${$t("tickets.labels.desired-deadline")} ${formatDateView(
                detail.expectEndDate
              )}`
            }}
          </label>
        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import AssignUser from "./AssignUser";
import UserInfoViewPopup from "@/modules/ticket/views/components/UserInfoViewPopup";
// import Ranks from "./Ranks";
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import mixinComputedState from "@/modules/ticket/views/detail-ticket/mixins/mixinComputedState";
import {
  definedStatus,
  FORMAT_DATE_TIME_TICKET,
  formatDate,
  getDiffTimeToNow,
  getEstDateTimeFromStartAndHour,
  secondsToHm,
} from "@/modules/ticket/helpers/ticketUtils";
import { mapActions } from "vuex";
import constants from "@/constants";

import { UserService } from "@/modules/ticket/services/userService";

export default {
  components: { AssignUser, UserInfoViewPopup },
  mixins: [mixinStatusAndPriority, mixinComputedState],
  props: {
    detail: {
      type: Object,
      default: undefined,
    },
    usersByGroupId: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      closeOnContent: false,
      userInfoView: null,
      expanded: 0,
      isStateLate: false,
      estTimeView: "",
    };
  },
  computed: {
    // action assigner
    isAcceptAssignerAction() {
      return (
        this.detail.status === definedStatus.processing &&
        (this.isPerformer || this.isPerformerLeader || this.isAdminTicket)
      );
    },
    isAcceptAssignerActionWithNoPerformer() {
      return this.isGroup || this.isGroupLeader;
    },
    isShowCountDownTime() {
      return this.hasAttributeStartDate && this.hasAttributeEstDuration;
    },
    isForwardGroup() {
      return (
        this.hasAttributeGroupChange &&
        this.detail.status === definedStatus.forward
      );
    },
  },
  watch: {
    detail() {
      if (this.hasAttributeInfoUser && !this.isPerformer) {
        this.getUserInfoById(this.detail.userId);
      }
    },
  },
  mounted() {
    if (this.hasAttributeInfoUser && !this.isPerformer) {
      this.getUserInfoById(this.detail.userId);
    }

    if (this.isShowCountDownTime) {
      this.handleViewEstDateTime();
    }
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    async getUserInfoById(id) {
      if (!this.userInfoView || id !== this.userInfoView.userId) {
        try {
          const response = await UserService.getDetailUserById(id);
          if (response.success) {
            this.userInfoView = response.data;
          } else {
            this.userInfoView = null;
          }
        } catch (error) {
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.ERROR,
            content: error.message,
            key: false,
          });
          this.userInfoView = null;
        }
      }
    },
    formatDateView(date) {
      return formatDate(date, FORMAT_DATE_TIME_TICKET);
    },
    updateAssignTo(val) {
      this.closeOnContent = true;
      this.$emit("update-assign-to", val);
    },
    onSetCloseOnContent() {
      this.closeOnContent = false;
    },
    handleViewEstDateTime() {
      const estDt = getEstDateTimeFromStartAndHour(
        this.detail.startDate,
        this.detail.estDuration
      );
      const time = getDiffTimeToNow(estDt);
      this.isStateLate = time <= 0;
      this.estTimeView = secondsToHm(Math.abs(time));
    },
  },
};
</script>
