<template>
  <div class="wrap--list--common--calendar calendar-font">
    <v-row class="title-calendar">
      <h4 class="color-title-calendar">
        {{ $t("menubar.calendar.meetingSchedule") }}
      </h4>

      <v-btn class="ml-5" text icon color="#00C3F9" @click="onChangeTypeList">
        <img
          v-if="showListData"
          src="@/assets/icons/calendar/ic_list_active.svg"
          alt="list"
          width="24"
          height="24"
        />
        <img
          v-else
          src="@/assets/icons/calendar/ic_list.svg"
          alt="list"
          width="24"
          height="24"
        />
      </v-btn>
      <v-btn text icon color="#00C3F9" @click="onChangeTypeCalendar">
        <v-icon :color="(showListData && '#22242C') || '#00C3F9'">
          mdi-calendar-blank-outline
        </v-icon>
      </v-btn>
    </v-row>

    <div class="wrap--content wrap-book-tab">
      <v-tabs v-model="currentTab" class="pt-2" @change="forceRerender()">
        <v-tab key="JOING">
          {{ $t("calendar.iJoin") }}
          <!-- <span>({{ participant }})</span> -->
        </v-tab>
        <v-tab key="GROUP">
          {{ $t("calendar.unitCalendar") }}
          <!-- <span>({{ group }})</span> -->
        </v-tab>
        <v-tab v-if="showTab" key="APPROVE">
          {{ $t("calendar.iBrowse") }}
          <!-- <span>({{ approve }})</span> -->
        </v-tab>
        <v-tab key="CREATE">
          {{ $t("calendar.iCreate") }}
          <!-- <span>({{ creator }})</span> -->
        </v-tab>

        <v-tabs-items v-model="currentTab">
          <v-tab-item
            key="JOING"
            transition="custom-transition"
            reverse-transition="custom-transition"
          >
            <ListMeetingParticipant
              :key="childKeyParticipant"
              :show-list-data="showListData"
              @reset-tab-current="resetTabCurrent"
              @count-participant="countParticipant"
            />
          </v-tab-item>
          <v-tab-item
            key="GROUP"
            transition="custom-transition"
            reverse-transition="custom-transition"
          >
            <ListMeetingGroup
              :key="childKeyGroup"
              :show-list-data="showListData"
              @reset-tab-current="resetTabCurrent"
              @count-group="countGroup"
            />
          </v-tab-item>
          <v-tab-item
            v-if="showTab"
            key="APPROVE"
            transition="custom-transition"
            reverse-transition="custom-transition"
          >
            <ListMeetingApprove
              :key="childKeyApprove"
              :show-list-data="showListData"
              @reset-tab-current="resetTabCurrent"
              @count-approve="countApprove"
            />
          </v-tab-item>
          <v-tab-item
            key="CREATE"
            transition="custom-transition"
            reverse-transition="custom-transition"
          >
            <ListMeetingCreator
              :key="childKeyCreator"
              :show-tab="showTab"
              :show-list-data="showListData"
              @count-creator="countCreator"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
  </div>
</template>

<script>
import ListMeetingCreator from "@/modules/calendar/views/list/creator/ListMeetingCreator.vue";
import ListMeetingApprove from "@/modules/calendar/views/list/tablist/ListMeetingApprove.vue";
import ListMeetingGroup from "@/modules/calendar/views/list/tablist/ListMeetingGroup.vue";
import ListMeetingParticipant from "@/modules/calendar/views/list/tablist/ListMeetingParticipant.vue";

// constants
import constants from "@/constants";

export default {
  name: "Tablist",

  components: {
    ListMeetingCreator,
    ListMeetingApprove,
    ListMeetingGroup,
    ListMeetingParticipant,
  },

  data() {
    return {
      currentTab: constants.CALENDAR_TAB_LIST.ZERO,
      showDialogSign: false,
      indexOpenFileDoc: null,
      documentId: null,
      childKeyCreator: 0,
      childKeyGroup: 0,
      childKeyParticipant: 0,
      childKeyApprove: 0,

      //   count
      participant: 0,
      group: 0,
      approve: 0,
      creator: 0,
      showTab: false,
      showListData: true,
    };
  },

  watch: {
    currentTab() {
      this.showListData = true;
    },
  },

  created() {
    const user = JSON.parse(localStorage.getItem(constants.USER_INFO));
    if (user) {
      if (user.roles && user.roles.includes("MEETING_MANAGE")) {
        this.showTab = true;
        this.currentTab = 2;
      }
    }
    const tabCurren = parseInt(
      localStorage.getItem(constants.CALENDAR_TAB_LIST.NAME)
    );
    if (tabCurren) {
      this.currentTab = tabCurren;
      localStorage.setItem(constants.CALENDAR_TAB_LIST.NAME, null)
    }
  },
  methods: {
    countParticipant(count) {
      this.participant = count || 0;
    },
    countGroup(count) {
      this.group = count || 0;
    },
    countApprove(count) {
      this.approve = count || 0;
    },
    countCreator(count) {
      this.creator = count || 0;
    },
    forceRerender() {
      if (this.currentTab === constants.CALENDAR_TAB_LIST.ONE) {
        return this.forceRerenderGroup();
      }
      if (this.currentTab === constants.CALENDAR_TAB_LIST.TWO && this.showTab) {
        return this.forceRerenderApprove();
      }
      if (this.currentTab === constants.CALENDAR_TAB_LIST.TWO && !this.showTab) {
        return this.forceRerenderCreator();
      }
      if (this.currentTab === constants.CALENDAR_TAB_LIST.THREE) {
        return this.forceRerenderCreator();
      }
      return this.forceRerenderParticipant();
    },

    forceRerenderApprove() {
      this.childKeyApprove += 1;
    },

    forceRerenderGroup() {
      this.childKeyGroup += 1;
    },
    forceRerenderParticipant() {
      this.childKeyParticipant += 1;
    },

    forceRerenderCreator() {
      this.childKeyCreator += 1;
    },

    onChangeTypeList() {
      this.showListData = true;
    },

    onChangeTypeCalendar() {
      this.showListData = false;
    },

    resetTabCurrent() {
      this.currentTab = 2
      const user = JSON.parse(localStorage.getItem(constants.USER_INFO));
      if (user) {
        if (user.roles && user.roles.includes("MEETING_MANAGE")) {
          this.showTab = true;
          this.currentTab = 3;
        }
      }
    },
  },
};
</script>

<style lang="scss" src="./ListMeetingSchedule.scss"></style>
