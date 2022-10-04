<template>
  <v-toolbar id="app-bar" dense height="58" color="white">
    <v-spacer />
    <!-- Menu -->
    <div class="d-flex">
      <v-menu
        offset-y
        bottom
        right
        transition="scroll-y-transition"
        content-class="item-menu-appbar"
      >
        <template v-slot:activator="{ on, attrs }">
          <img
            src="@/assets/icons/ic-layout-grid.png"
            alt="ic-layout-grid"
            class="mr-5"
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <div class="wrap-menu-appbar">
          <v-row class="ma-0">
            <!-- Dieu hanh - quan tri -->
            <v-col cols="3">
              <p class="title-menu">{{ $t("menuTitleCol1") }}</p>

              <!-- row 1 -->
              <div class="d-flex mt-5">
                <div
                  class="d-flex flex-column align-center wrap-item-menu"
                  :class="checkEnableIconMenu('econtract')"
                  @click="onClickIconMenu('econtract')"
                >
                  <img src="@/assets/icons/ic_hd12.svg" alt="hd" />
                  <p class="label-menu">{{ $t("menuAppBar.contract") }}</p>
                </div>
                <v-spacer />
                <div
                  class="d-flex flex-column align-center wrap-item-menu"
                  :class="checkEnableIconMenu('procedure')"
                >
                  <img src="@/assets/icons/ic_qt.svg" alt="qt" />
                  <p class="label-menu">{{ $t("menuAppBar.procedure") }}</p>
                </div>
              </div>

              <!-- row 2 -->
              <div class="d-flex mt-5">
                <div
                  class="d-flex flex-column align-center wrap-item-menu"
                  :class="checkEnableIconMenu('signature')"
                  @click="onClickIconMenu('signature')"
                >
                  <img src="@/assets/icons/ic_kdt.svg" alt="kdt" />
                  <p class="label-menu">{{ $t("menuAppBar.eSign") }}</p>
                </div>
                <v-spacer />
                <div
                  class="d-flex flex-column align-center wrap-item-menu"
                  :class="checkEnableIconMenu('schedule')"
                >
                  <img src="@/assets/icons/ic_lt.svg" alt="lt" />
                  <p class="label-menu">{{ $t("menuAppBar.schedule") }}</p>
                </div>
              </div>

              <!-- row 3 -->
              <div class="d-flex mt-5">
                <div
                  class="d-flex flex-column align-center wrap-item-menu"
                  :class="checkEnableIconMenu('edocument')"
                  @click="onClickIconMenu('edocument')"
                >
                  <img src="@/assets/icons/ic_vb.svg" alt="vb" />
                  <p class="label-menu">{{ $t("menuAppBar.document") }}</p>
                </div>
                <v-spacer />
                <div
                  class="d-flex flex-column align-center wrap-item-menu"
                  :class="checkEnableIconMenu('task')"
                  @click="onClickIconMenu('task')"
                >
                  <img src="@/assets/icons/ic_cv.svg" alt="cv" />
                  <p class="label-menu">{{ $t("menuAppBar.work") }}</p>
                </div>
              </div>

              <!-- row 4 -->
              <div class="d-flex mt-5">
                <div
                  class="d-flex flex-column align-center wrap-item-menu"
                  :class="checkEnableIconMenu('ticket')"
                  @click="onClickIconMenu('ticket')"
                >
                  <img src="@/assets/icons/ic_ticket2.svg" alt="ticket" />
                  <p class="label-menu">
                    {{ $t("task-manager.group-request.request") }}
                  </p>
                </div>
                <v-spacer />
              </div>
            </v-col>
            <v-divider vertical />

            <!-- Quan ly van phong -->
            <v-col cols="3" class="wrap-block-disable">
              <p class="title-menu">{{ $t("menuTitleCol2") }}</p>

              <!-- row 1 -->
              <div class="d-flex mt-5">
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_vp.png" alt="vp" />
                  <p class="label-menu">{{ $t("menuAppBar.office") }}</p>
                </div>
                <v-spacer />
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_ct.svg" alt="ct" />
                  <p class="label-menu">{{ $t("menuAppBar.ct") }}</p>
                </div>
              </div>

              <!-- row 2 -->
              <div class="d-flex mt-5">
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_ts.svg" alt="ts" />
                  <p class="label-menu">{{ $t("menuAppBar.asset") }}</p>
                </div>
                <v-spacer />
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_ctp.svg" alt="ctp" />
                  <p class="label-menu">{{ $t("menuAppBar.ctp") }}</p>
                </div>
              </div>

              <!-- row 3 -->
              <div class="d-flex mt-5">
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_tl.svg" alt="tl" />
                  <p class="label-menu">{{ $t("menuAppBar.document1") }}</p>
                </div>
                <v-spacer />
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_ai.svg" alt="ai" />
                  <p class="label-menu">{{ $t("menuAppBar.cameraAI") }}</p>
                </div>
              </div>
            </v-col>
            <v-divider vertical />

            <!-- Nhan su - ke toan -->
            <v-col cols="3" class="wrap-block-disable">
              <p class="title-menu">{{ $t("menuTitleCol3") }}</p>

              <!-- row 1 -->
              <div class="d-flex mt-5">
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_ns.svg" alt="ns" />
                  <p class="label-menu">{{ $t("menuAppBar.personnel") }}</p>
                </div>
                <v-spacer />
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_kpi.svg" alt="kpi" />
                  <p class="label-menu">{{ $t("menuAppBar.kpi") }}</p>
                </div>
              </div>

              <!-- row 2 -->
              <div class="d-flex mt-5">
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_cc.svg" alt="cc" />
                  <p class="label-menu">{{ $t("menuAppBar.dot") }}</p>
                </div>
                <v-spacer />
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_kt.svg" alt="kt" />
                  <p class="label-menu">{{ $t("menuAppBar.accountant") }}</p>
                </div>
              </div>

              <!-- row 3 -->
              <div class="d-flex mt-5">
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_bl.svg" alt="bl" />
                  <p class="label-menu">{{ $t("menuAppBar.payroll") }}</p>
                </div>
                <v-spacer />
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_hd1.svg" alt="hd1" />
                  <p class="label-menu">{{ $t("menuAppBar.receipt") }}</p>
                </div>
              </div>
            </v-col>
            <v-divider vertical />

            <!-- Tien ich khac -->
            <v-col cols="3" class="wrap-block-disable">
              <p class="title-menu">{{ $t("menuTitleCol4") }}</p>

              <!-- row 1 -->
              <div class="d-flex mt-5">
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_ns.svg" alt="ns" />
                  <p class="label-menu">{{ $t("menuAppBar.personnel") }}</p>
                </div>
                <v-spacer />
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_ct.svg" alt="ct" />
                  <p class="label-menu">{{ $t("menuAppBar.ct") }}</p>
                </div>
              </div>

              <!-- row 2 -->
              <div class="d-flex mt-5">
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_cc.svg" alt="cc" />
                  <p class="label-menu">{{ $t("menuAppBar.dot") }}</p>
                </div>
                <v-spacer />
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_ts.svg" alt="ts" />
                  <p class="label-menu">{{ $t("menuAppBar.asset") }}</p>
                </div>
              </div>

              <!-- row 3 -->
              <div class="d-flex mt-5">
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_bl.svg" alt="bl" />
                  <p class="label-menu">{{ $t("menuAppBar.payroll") }}</p>
                </div>
                <v-spacer />
                <div class="d-flex flex-column align-center wrap-item-menu">
                  <img src="@/assets/icons/ic_tt.svg" alt="tt" />
                  <p class="label-menu">{{ $t("menuAppBar.news") }}</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-menu>
    </div>

    <v-menu
      bottom
      right
      offset-y
      :disabled="notifications.length == 0"
      transition="scroll-y-transition"
      content-class="item-menu-notifications"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn small fab text v-bind="attrs" class="btn-notify" v-on="on" @click="setIsRingTheBell(false)">
          <v-badge dot color="info" overlap bordered :value="isBadge">
            <template v-slot:badge />
            <div :class="`menu-item-notify ${isRingTheBell ? 'ring-bell' : ''}`">
              <vue-feather type="bell" size="18" />
            </div>
          </v-badge>
        </v-btn>
      </template>

      <v-list :tile="false" nav class="notification-vlist">
        <div class="wrap-item-notification d-flex flex-column">
          <span class="noti-title">{{ $t("notify-title") }}</span>
          <v-list-item
            v-for="(n, i) in notifications"
            :key="`item-${i}`"
            link
            class="over-vlist"
            @click="goToPageNotification(n)"
          >
            <div
              class="d-flex flex-row justify-space-between noti-item"
              :class="`${bgReadUnread(n.readStatus)}`"
            >
              <div class="d-flex flex-column justify-center div-avatar">
                <v-avatar size="32px" color="primary">
                  <img v-if="notiImage[i]" :src="notiImage[i]" />
                  <b v-else class="text-uppercase white--text">{{
                    n.senderUserName && n.senderUserName[0]
                  }}</b>
                </v-avatar>
              </div>
              <div
                class="d-flex flex-column justify-left align-left div-content"
              >
                <span class="title"><span>{{ getModuleNotify(n.actionModule).module }}</span>{{ ' ' + n.content }}</span>
                <span class="sub-title">{{ formatTime(n.createdAt) }}</span>
              </div>
              <div
                class="
                  d-flex
                  flex-column
                  justify-center
                  align-center
                  div-module
                "
              >
                <div class="border-icon">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div class="icon" :class="`${getModuleNotify(n.actionModule).className}`" v-bind="attrs" v-on="on" />
                    </template>
                    <span>{{ getModuleNotify(n.actionModule).module }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </v-list-item>
        </div>
      </v-list>
      <div class="noti-view-all" @click="goNotificationPage">
        {{ $t("notify-see") }}
      </div>
    </v-menu>

    <div class="d-flex align-center">
      <v-menu
        offset-y
        bottom
        auto
        :ripple="false"
        transition="scroll-y-transition"
        content-class="menu-account arrow-up"
      >
        <template v-slot:activator="{ on, attrs }">
          <div
            class="d-flex align-center ml-2 ml-sm-5 wrap-info-header"
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar size="45px" class="mr-2 info-user-avatar" color="primary">
              <img v-if="showAvatar" :src="avatarData" />
              <b v-else class="text-uppercase white--text">{{ userName[0] }}</b>
            </v-avatar>
            <div class="ml-1 d-none d-sm-flex flex-column align-start">
              <b class="info-user-name">{{ userName }}</b>
              <span class="info-user-pathname">{{
                userInfo.groupPathName
              }}</span>
            </div>
          </div>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in settings"
            :key="i"
            :ripple="false"
            link
            @click="menuItems(item.action)"
          >
            <v-list-item-icon class="my-0">
              <img :src="item.icon" alt="" />
            </v-list-item-icon>
            <v-list-item-title class="d-flex align-center">
              <span>{{ $t(`${item.text}`) }}</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
</template>

<script>
// Utilities
import notification from "@/mixins/notification";
import constants from "@/constants";
import { genUsers } from "@/helpers/utils";
import econtractRoute from "@/modules/econtract/router/routePaths";
import { FileService } from "@/modules/econtract/services/fileService";
import edocumentRoute from "@/modules/edocument/router/routePaths";
import routeEsignature from "@/modules/esignature/router/routePaths";
import ticketRoute from '@/modules/ticket/router/routePaths';
import commonRoute from "@/router/routePaths";
import { localize } from "vee-validate";
import { mapActions, mapState } from "vuex";
import { UsersService } from "@/services/usersService";
import moment from "moment";

export default {
  name: "DashboardCoreAppBar",
  mixins: [notification],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    userName: "",
    totalUnread: 0,
    notiImage: [],
    notifications: [],
    user: genUsers(1)[0],
    userAvatar: "",
    langs: [
      {
        icon: require("../../assets/langs/vn.png"),
        text: "language.vietnamese",
        value: "vi",
      },
      {
        icon: require("../../assets/langs/us.png"),
        text: "language.english",
        value: "en",
      },
    ],
    listImgLang: {
      vi: require("../../assets/langs/vn.png"),
      en: require("../../assets/langs/us.png"),
    },
    iconLang: "vi",
    settings: [
      {
        icon: require("../../assets/icons/icon-account.svg"),
        text: "account",
        action: "account",
      },
      {
        icon: require("../../assets/icons/icon-logout.svg"),
        text: "logout",
        action: "logout",
      },
    ],
    currentEmail: "",
    formData: {
      page: 1,
      pageSize: 10
    },
    isBadge: false
  }),

  computed: {
    ...mapState("layout", ["drawer", "userInfo", "avatarData", "isLoadNewNotification", "isRingTheBell"]),
    srcLang() {
      const src = this.listImgLang[this.iconLang];
      return src;
    },
    showAvatar() {
      if (
        (this.avatarData && this.avatarData.toString() === "null") ||
        this.avatarData === null ||
        this.avatarData === ""
      ) {
        return false;
      }
      return true;
    },
  },
  watch: {
    userInfo() {
      if (this.userInfo) {
        if (this.userName !== this.userInfo.fullName) {
          this.setAvatar("");
          window.location.reload();
        }
      }
    },
    async isLoadNewNotification(newValue) {
      if (newValue) {
        // load user notifications
        const response = await this.initNotifications({
          page: 1,
          pageSize: 10,
        });
        this.isBadge = false;
        this.notifications = response && response.data;

        // Khi load lai trang co thong bao chua doc thi chuong se rung
        this.notifications.map(item => {
          if (!item.readStatus) {
            this.isBadge = true;
          }
        })
        try {
          this.notiImage = await Promise.all(
            this.notifications.filter(it => it.senderAvatar).map((it) => this.getImage(it.senderAvatar))
          );
        } catch (e) {
          console.log('e')
        }
        !this.isBadge && this.setIsRingTheBell(false);
        this.setIsLoadNewNotification(false);
      }
    }
  },

  async created() {
    // Set default lang
    localize(this.$root.$i18n.locale);
    const user = JSON.parse(localStorage.getItem(constants.USER_INFO));
    if (user) {
      this.userName = user.fullName;
      this.setUserInfo(user);
      if (user.avatar && user.avatar.filePath) {
        this.downloadAvatar(user.avatar);
      }
      if (user.isFirstLogin) {
        this.showChangePassword = true;
      }
    }

    // load user notifications
    const response = await this.initNotifications({
      page: 1,
      pageSize: 10,
    });
    this.notifications = response && response.data;

    // Khi load lai trang co thong bao chua doc thi chuong se rung
    this.notifications.map(item => {
      if (!item.readStatus) {
        this.setIsRingTheBell(true);
        this.isBadge = true;
      }
    })
    try {
      this.notiImage = await Promise.all(
        this.notifications.filter(it => it.senderAvatar !== null).map((it) => this.getImage(it.senderAvatar))
      );
    } catch (e) {
      // console.log('e')
    }

    this.countUnreadNotification();
  },
  methods: {
    ...mapActions("layout", ["setUserInfo", "setAvatar", "setReloadPage", "setIsLoadNewNotification", "setIsRingTheBell"]),

    async getImage(item) {
      try {
        const response = await FileService.downloadImage({
          ...item,
        });
        return response;
      } catch (error) {
        // console.log(error);
      }
    },

    async goToPageNotification(item) {
      const status = await this.updateReadNoti([item.id]);
      if (status === 200) {
        this.setIsLoadNewNotification(true);
        this.eventNotificationDetail(item);
      }
    },

    formatTime(time) {
      return moment(time).format("HH:mm DD/MM/YYYY");
    },

    async countUnreadNotification() {
      const response = await UsersService.loadUnreadNotifications();
      this.totalUnread = response.data.totalUnread;
    },

    async downloadAvatar(avatar) {
      const avatarLocal = localStorage.getItem(constants.AVATAR);
      if (avatarLocal) {
        this.setAvatar(avatarLocal);
        return;
      }
      try {
        const response = await FileService.downloadImage({
          ...avatar,
        });
        this.setAvatar(response);
      } catch (error) {
        this.setAvatar("");
      }
    },

    switchLang(lang) {
      this.$root.$i18n.locale = lang;
      localize(lang);
      this.iconLang = lang;
      localStorage.setItem(constants.LANGUAGE, lang);
    },

    menuItems(value) {
      if (value === "logout") {
        this.setAvatar("");
        const loginType = localStorage.getItem(constants.LOGIN_TYPE) || "IN";
        var url =
          loginType === "IN"
            ? `${commonRoute.LOGIN_PATH}`
            : `${commonRoute.LOGIN_AGENT_PATH}`;
        localStorage.clear();
        this.$router.push(url).catch(() => {});
      }
      if (value === "account") {
        const userId = this.userInfo.userId;

        this.$router
          .push(`${commonRoute.USER_INFO_PATH.replaceAll(":userId", userId)}`)
          .catch(() => {});
      }
    },

    checkEnableIconMenu(code) {
      if (this.userInfo.modules.includes("vn.bssd.digitalworkspace." + code)) {
        return "";
      }
      return "wrap-block-disable";
    },

    bgReadUnread(readStatus) {
      return readStatus != null && readStatus === 0 ? "bg-unread" : "bg-read";
    },

    onClickIconMenu(code) {
      switch (code) {
        case "econtract":
          this.$router.push(`${econtractRoute.ECONTRACT_DASHBOARD_PATH}`);
          break;
        case "signature":
          this.$router.push(`${routeEsignature.ESIGNATURE_DASHBOARD}`);
          break;
        case "task":
          // this.$router.push(`${etaskRoute.TASK_DASHBOARD}`);
          break;
        case "edocument":
          this.$router.push(`${edocumentRoute.DOCUMENT_DASHBOARD}`);
          break;
        case "ticket":
          this.$router.push(`${ticketRoute.TICKET_DASHBOARD}`);
          break;
        default:
          break;
      }
    },
    goNotificationPage() {
      this.$router.push(commonRoute.NOTIFICATION_PATH);
    },
  },
};
</script>
<style lang="scss" scope>
.menu-item-notify {
  border-radius: 50%;
  padding: 5px;
  border: 2px solid #8e8ea1;
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    color: #8e8ea1;
    font-weight: bold;
  }
}

.info-user-name {
  line-height: 100%;
  font-size: 1.1em;
}

.info-user-pathname {
  color: #8e8ea1;
  font-size: 0.8em;
}

.info-user- .text-search {
  .v-text-field__details {
    display: none !important;
  }

  .v-input__slot {
    margin-bottom: 0 !important;
  }
}

.item-menu-appbar {
  min-width: 650px !important;
  border-radius: 20px !important;
  margin-top: 25px;
  padding: 8px;
}

.wrap-menu-appbar {
  background-color: white;
  border-radius: 20px;
  // width: 650px;
  // height: 360px;
}

.label-menu {
  color: #22242c;
  font-size: 10px;
  text-transform: capitalize;
  margin-bottom: 0px !important;
  margin-top: -6px;
}

.title-menu {
  color: #22242c;
  font-size: 12px;
  font-weight: 800;
  text-transform: capitalize;
  margin-bottom: 0px !important;
  text-align: center;
}

.wrap-item-menu {
  width: 62px;
  cursor: pointer;
}

.wrap-block-disable {
  opacity: 0.3;
}
.notification-vlist {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.item-menu-notifications {
  min-width: 492px !important;
  border-radius: 20px !important;
  margin-top: 19px;
  padding: 12px 0px;
  gap: 11px;
  .wrap-item-notification {
    width: 100%;
    .over-vlist {
      padding: 0px !important;
      margin-bottom: 0px !important;
    }
    .noti-title {
      font-weight: 800;
      font-size: 19px;
      line-height: 24px;
      text-align: center;
      text-transform: capitalize;
      color: #22242c;
      display: block;
      padding-bottom: 22px;
    }
    .icon-cameraAI {
      content: "";
      background: url(../../assets/icons/menubar/cameraAI/main.svg) no-repeat;
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-congtacphi {
      content: "";
      background: url(../../assets/icons/menubar/congtacphi/main.svg) no-repeat;
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-congviec {
      content: "";
      background: url(../../assets/icons/menubar/congviec/main.svg) no-repeat;
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-hddt {
      content: "";
      background: url(../../assets/icons/menubar/hddt/main.svg) no-repeat;
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-lichhop {
      content: "";
      background: url(../../assets/icons/menubar/lichhop/main.svg) no-repeat;
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-quantri {
      content: "";
      background: url(../../assets/icons/menubar/quantri/main.svg) no-repeat;
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-quytrinh {
      content: "";
      background: url(../../assets/icons/menubar/quytrinh/main.svg) no-repeat;
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-taikhoan {
      content: "";
      background: url(../../assets/icons/menubar/taikhoan/main.svg) no-repeat;
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-tailieu {
      content: "";
      background: url(../../assets/icons/menubar/tailieu/main.svg) no-repeat;
      background-size: 100% 100%;
    }
    .icon-truyenthong {
      content: "";
      background: url(../../assets/icons/menubar/truyenthong/main.svg) no-repeat;
      background-size: 100% 100%;
    }
    .icon-kydt {
      content: "";
      background: url(../../assets/icons/menubar/kydt/main.svg) no-repeat;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-vanban {
      content: "";
      background: url(../../assets/icons/menubar/vanban/main.svg) no-repeat;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-tongquan {
      content: "";
      background: url(../../assets/icons/menubar/tongquan/main.svg) no-repeat;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-vanphongpham {
      content: "";
      background: url(../../assets/icons/menubar/vanphongpham/main.svg)
        no-repeat;
      background-size: 100% 100%;
      display: inline-block;
    }
    .icon-yeucau {
      content: "";
      background: url(../../assets/icons/menubar/yeucau/main.svg) no-repeat;
      background-size: 100% 100%;
    }
    .icon-xe {
      content: "";
      background: url(../../assets/icons/icon-car.svg) no-repeat;
      background-size: 100% 100%;
    }
    .bg-read {
      background: #ffffff;
    }
    .bg-unread {
      background: linear-gradient(0deg, #f1fdff, #f1fdff), #ffffff;
    }
    .noti-item {
      width: 100%;
      box-shadow: 0px 1px 0px #e7ecf1;
      padding: 8px 0px;
      .div-avatar {
        align-items: center;
        align-content: center;
        width: 68px;
      }
      .div-content {
        align-items: flex-start;
        padding: 0px;
        gap: 1px;
        width: 100%;
        .title {
          width: 363px;
          font-size: 14px !important;
          line-height: 18px;
          letter-spacing: 0.02em;

          & span {
            font-weight: 900;
          }
        }
        .sub-title {
          font-weight: 400;
          font-size: 12px;
          line-height: 15px;
          letter-spacing: 0.02em;
          color: #9fa2b4;
        }
      }
      .div-module {
        width: 60px;
        .border-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          border-radius: 100%;
          border: 1px solid #252733;
          .icon {
            width: 18px;
            height: 18px;
            margin: auto;
            box-sizing: border-box;
          }
        }
      }
    }
  }

  .noti-view-all {
    padding-right: 30px;
    height: 15px;
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    text-align: right;
    letter-spacing: 0.02em;
    text-decoration-line: underline;
    color: #252733;
    cursor: pointer;
    :hover {
      color: #414558;
    }
  }
}

.ring-bell > i {
    display:block;
    -webkit-animation: ring 3s .7s ease-in-out infinite;
    -webkit-transform-origin: 50% 4px;
    -moz-animation: ring 3s .7s ease-in-out infinite;
    -moz-transform-origin: 50% 4px;
    animation: ring 3s .7s ease-in-out infinite;
    transform-origin: 50% 4px;
}

@-webkit-keyframes ring {
  0% { -webkit-transform: rotateZ(0); }
  1% { -webkit-transform: rotateZ(30deg); }
  3% { -webkit-transform: rotateZ(-28deg); }
  5% { -webkit-transform: rotateZ(34deg); }
  7% { -webkit-transform: rotateZ(-32deg); }
  9% { -webkit-transform: rotateZ(30deg); }
  11% { -webkit-transform: rotateZ(-28deg); }
  13% { -webkit-transform: rotateZ(26deg); }
  15% { -webkit-transform: rotateZ(-24deg); }
  17% { -webkit-transform: rotateZ(22deg); }
  19% { -webkit-transform: rotateZ(-20deg); }
  21% { -webkit-transform: rotateZ(18deg); }
  23% { -webkit-transform: rotateZ(-16deg); }
  25% { -webkit-transform: rotateZ(14deg); }
  27% { -webkit-transform: rotateZ(-12deg); }
  29% { -webkit-transform: rotateZ(10deg); }
  31% { -webkit-transform: rotateZ(-8deg); }
  33% { -webkit-transform: rotateZ(6deg); }
  35% { -webkit-transform: rotateZ(-4deg); }
  37% { -webkit-transform: rotateZ(2deg); }
  39% { -webkit-transform: rotateZ(-1deg); }
  41% { -webkit-transform: rotateZ(1deg); }

  43% { -webkit-transform: rotateZ(0); }
  100% { -webkit-transform: rotateZ(0); }
}

@-moz-keyframes ring {
  0% { -moz-transform: rotate(0); }
  1% { -moz-transform: rotate(30deg); }
  3% { -moz-transform: rotate(-28deg); }
  5% { -moz-transform: rotate(34deg); }
  7% { -moz-transform: rotate(-32deg); }
  9% { -moz-transform: rotate(30deg); }
  11% { -moz-transform: rotate(-28deg); }
  13% { -moz-transform: rotate(26deg); }
  15% { -moz-transform: rotate(-24deg); }
  17% { -moz-transform: rotate(22deg); }
  19% { -moz-transform: rotate(-20deg); }
  21% { -moz-transform: rotate(18deg); }
  23% { -moz-transform: rotate(-16deg); }
  25% { -moz-transform: rotate(14deg); }
  27% { -moz-transform: rotate(-12deg); }
  29% { -moz-transform: rotate(10deg); }
  31% { -moz-transform: rotate(-8deg); }
  33% { -moz-transform: rotate(6deg); }
  35% { -moz-transform: rotate(-4deg); }
  37% { -moz-transform: rotate(2deg); }
  39% { -moz-transform: rotate(-1deg); }
  41% { -moz-transform: rotate(1deg); }

  43% { -moz-transform: rotate(0); }
  100% { -moz-transform: rotate(0); }
}

@keyframes ring {
  0% { transform: rotate(0); }
  1% { transform: rotate(30deg); }
  3% { transform: rotate(-28deg); }
  5% { transform: rotate(34deg); }
  7% { transform: rotate(-32deg); }
  9% { transform: rotate(30deg); }
  11% { transform: rotate(-28deg); }
  13% { transform: rotate(26deg); }
  15% { transform: rotate(-24deg); }
  17% { transform: rotate(22deg); }
  19% { transform: rotate(-20deg); }
  21% { transform: rotate(18deg); }
  23% { transform: rotate(-16deg); }
  25% { transform: rotate(14deg); }
  27% { transform: rotate(-12deg); }
  29% { transform: rotate(10deg); }
  31% { transform: rotate(-8deg); }
  33% { transform: rotate(6deg); }
  35% { transform: rotate(-4deg); }
  37% { transform: rotate(2deg); }
  39% { transform: rotate(-1deg); }
  41% { transform: rotate(1deg); }

  43% { transform: rotate(0); }
  100% { transform: rotate(0); }
}
</style>
