<template>
  <v-dialog v-model="showDialog" persistent max-width="680">
    <div class="wrap-dialog-meeting-calendar">
      <div class="header-dialog">
        <span class="title-dialog">{{ title }}</span>
        <v-icon class="ic-close-dialog" @click="closeDialog">mdi-close</v-icon>
      </div>

      <!-- Body -->
      <v-divider />
      <div class="wrap-body">
        <div
          v-for="metting in listMetting"
          :key="metting.meetingId"
          class="item-meeting"
          @click="onDetailMeeting(metting)"
        >
          <div class="circle-event-time" />
          <div class="content-meeting">
            <p class="title-content-meeting">
              {{ formatTime(metting.startTime, metting.endTime) }}
              {{ metting.title }}
            </p>
            <p class="mb-0 sub-title">{{ metting.meetingRooms[0].name }}</p>
          </div>
        </div>
      </div>
      <div class="pb-5" />
    </div>
  </v-dialog>
</template>

<script>
import moment from "moment";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    listMetting: {
      type: Array,
      default: null,
    },
  },

  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },

    onDetailMeeting(metting) {
      this.$emit("onDetailMeeting", metting);
    },

    formatTime(start, end) {
      var timeStart = moment(start, "HH:mm DD/MM/YYYY").format("HH:mm");

      var timeEnd = moment(end, "HH:mm DD/MM/YYYY").format("HH:mm");

      return timeStart + "-" + timeEnd;
    },
  },
};
</script>

<style lang="scss">
.wrap-dialog-meeting-calendar {
  display: flex;
  flex-direction: column;
  background-color: white;

  .header-dialog {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 15px 14px 10px 14px;
  }

  .title-dialog {
    font-size: 18px;
    font-weight: 700;
    line-height: 25px;
    color: #22242c;
  }

  .ic-close-dialog {
    color: #22242c;
  }

  .item-meeting {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 20px 10px 20px;
    border-bottom: 1px solid;
    border-color: rgba(0, 0, 0, 0.12);
    cursor: pointer;
  }

  .circle-event-time {
    width: 10px;
    height: 10px;
    background-color: #22242c;
    border-radius: 10px;
    margin-right: 17px;
    flex: none;
  }

  .content-meeting {
    display: flex;
    flex-direction: column;
  }

  .title-content-meeting {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    text-transform: capitalize;
    color: #22242c;
    margin-bottom: 2px !important;
  }

  .sub-title {
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #a7a7ab;
  }

  .wrap-body {
    max-height: 500px;
    overflow-y: auto;
  }
}
</style>
