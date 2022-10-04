<template>
  <v-app>
    <dashboard-core-app-bar />

    <dashboard-core-drawer />

    <dashboard-core-view />

    <div v-if="isShowAlert" class="noti-fcm" @click="onclickNoti">
      <div class="noti-content">
        <div class="noti-avatar">MDO</div>
        <div>
          <div class="noti-title">{{ messageTitle }}</div>
          <div class="noti-sub">{{ messageContent }}</div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import { messaging, onMessage } from "@/firebase";
import { mapActions } from "vuex";
import constants from "@/constants"

export default {
  name: "LayoutDefault",
  components: {
    DashboardCoreAppBar: () => import("@/components/core/AppBar"),
    DashboardCoreDrawer: () => import("@/components/core/Drawer"),
    DashboardCoreView: () => import("@/components/core/View"),
  },
  data: () => ({
    expandOnHover: false,
    isShowAlert: false,
    typeAlert: "success",
    messageTitle: "",
    messageContent: "",
  }),

  mounted() {
    this.getMessageFireBase();
  },

  methods: {
    ...mapActions("layout", ["setIsLoadNewNotification", "setIsRingTheBell"]),
    // TODO
    onclickNoti() {},
    getMessageFireBase() {
      onMessage(messaging, (payload) => {
        this.isShowAlert = true;
        this.messageTitle = payload.notification.title;
        this.messageContent = payload.notification.content;
        this.setIsLoadNewNotification(true);
        this.setIsRingTheBell(true);
        setTimeout(() => {
          this.isShowAlert = false;
        }, constants.TIME_OUT_MESSAGE_FIRE_BASE);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.noti-fcm {
  width: 343px;
  height: max-content;
  bottom: 20px;
  right: 20px;
  position: fixed;
  background: #fff;
  padding: 10px;
  .noti-content {
    display: flex;
    flex-wrap: nowrap;
    .noti-avatar {
      width: 40px;
      height: 40px;
      background: #00c3f9;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 12px;
      line-height: 20px;
      color: #fff;
      margin-right: 10px;
    }
    .noti-title {
      max-width: 273px;
      color: #252733;
      font-weight: 700;
      font-size: 14px;
    }
    .noti-sub {
      max-width: 273px;
      font-weight: 500;
      font-size: 14px;
      color: #252733;
    }
  }
}
</style>
