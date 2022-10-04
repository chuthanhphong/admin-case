<template>
  <div class="warper-dashboard-mdo">
    <div class="panel-content">
      <div
        v-for="(it, index) in roleData"
        :key="index"
        class="panel"
        :style="{ background: !it.title.length ? 'transparent' : 'white' }"
      >
        <div class="header">
          <span class="title text-link" @click="goDetaileDashboard(it.isRole)">{{ it.title }}</span>
        </div>
        <contract-screen
          v-if="it.isRole == $t(`gloabal-dashboard.HDDT.code`)"
        />
        <signature-screen
          v-if="it.isRole == $t(`gloabal-dashboard.KDT.code`)"
        />

        <document-screen
          v-if="it.isRole == $t(`gloabal-dashboard.QLVB.code`)"
        />
        <task-screen v-if="it.isRole == $t(`gloabal-dashboard.QLCV.code`)" />
        <ticket-screen v-if="it.isRole == $t(`gloabal-dashboard.QLYC.code`)" />
      </div>
    </div>
    <div class="panel-calendar">
      <div class="calendar"></div>
    </div>
    <dialog-change-password
      :show-dialog="showChangePassword"
      @close-dialog="showChangePassword = false"
      @accept="acceptChangePassword"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DialogChangePassword from "@/views/user/component/DialogChangePassword.vue";
import { UsersService } from "@/services/usersService";
import commonRoute from "@/router/routePaths";
import constants from "@/constants";
import ContractScreen from "@/views/dashboard/component/Contract.vue";
import SignatureScreen from "@/views/dashboard/component/Signature.vue";
import DocumentScreen from "@/views/dashboard/component/Document.vue";
import TaskScreen from "@/views/dashboard/component/Task.vue";
import TicketScreen from "@/views/dashboard/component/Ticket.vue";

import econtractRoute from "@/modules/econtract/router/routePaths";
import routeEsignature from "@/modules/esignature/router/routePaths";
import edocumentRoute from "@/modules/edocument/router/routePaths";
import etaskRoute from '@/modules/etask/router/routePaths'
import ticketRoute from '@/modules/ticket/router/routePaths';

export default {
  name: "Home",
  components: {
    DialogChangePassword,
    ContractScreen,
    SignatureScreen,
    DocumentScreen,
    TaskScreen,
    TicketScreen,
  },
  data() {
    return {
      showChangePassword: false,
      roleData: [],
      moduleCode: constants.MODULE_ROLES.MODULES,
    };
  },

  computed: {
    ...mapState("layout", ["userInfo"]),
  },

  created() {
    const user = JSON.parse(localStorage.getItem(constants.USER_INFO));
    const hidePopupChangePassword = localStorage.getItem(
      constants.HIDE_POPUP_CHANGE_PASSWORD
    );

    if (user) {
      this.setUserInfo(user);
      if (user.isFirstLogin) {
        if (!hidePopupChangePassword) {
          this.showChangePassword = true;
        }
      }
    }

    this.roleData = user.modules;
    this.roleData = this.roleData.map((isRole) => ({ isRole }));
    this.setTitle();
    this.roleData = this.convertRolesData();
  },

  methods: {
    ...mapActions("layout", ["setNotify", "setUserInfo"]),
    async acceptChangePassword(value) {
      try {
        const response = await UsersService.changePassword(value);
        if (response.status === 200) {
          this.showChangePassword = false;
          var message = "users.messageSuccess.changePassword";
          const typeAlert = "success";
          await this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message),
          });
          setTimeout(() => {
            localStorage.clear();
            this.$router.push(`${commonRoute.LOGIN_PATH}`).catch(() => {});
          }, 3000);
        }
      } catch (error) {
        const typeAlert = "error";
        const message = error.message;
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message),
        });
      }
    },

    setTitle() {
      if (!this.roleData.length) {
        return;
      }
      this.roleData.forEach((el) => {
        el.title = "";
        el.code = this.moduleCode[el.isRole];
        if (el.code !== undefined) {
          el.title = this.$t(`gloabal-dashboard.${el.code}.title`);
        }
      });
    },

    convertRolesData() {
      var modules = [];
      this.roleData.forEach((el) => {
        if (el.title.length) {
          modules.push(el);
        }
      });
      if (modules.length > 1 && modules.length % 2 !== 0) {
        modules.push({ title: "" });
      }
      return modules;
    },

    goDetaileDashboard(role) {
      switch (role) {
        case this.$t("gloabal-dashboard.HDDT.code"):
          this.$router.push(`${econtractRoute.ECONTRACT_DASHBOARD_PATH}`);
          break;
        case this.$t("gloabal-dashboard.KDT.code"):
          this.$router.push(`${routeEsignature.ESIGNATURE_DASHBOARD}`);
          break;
        case this.$t("gloabal-dashboard.QLVB.code"):
          this.$router.push(`${edocumentRoute.DOCUMENT_DASHBOARD}`);
          break;
        case this.$t("gloabal-dashboard.QLCV.code"):
          this.$router.push(`${etaskRoute.TASK_DASHBOARD}`);
          break;
        case this.$t("gloabal-dashboard.QLYC.code"):
          this.$router.push(`${ticketRoute.TICKET_DASHBOARD}`);
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.fixwith {
  width: 100%;
  min-height: 100vh;
}
.warper-dashboard-mdo {
  background-color: #e5e5e5;
  display: flex;
  flex-wrap: wrap;
  .panel-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0px 0px 20px 20px;
    max-width: 68%;
    .title {
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 25px;
      text-transform: capitalize;
      color: #22242c;
      padding-top: 25px;
      display: inline-block;
    }
    .panel {
      min-width: 366px;
      flex: 48%;
      margin: 20px 2% 0px 0px;
      height: 430px;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      padding: 0px 20px 13px 20px;
      div.bg {
        display: inline-block;
        background-size: auto !important;
        background-position: top center !important;
        @media screen and (max-width: 1440px) {
          background-size: contain !important;
        }
      }
    }
  }
  .panel-calendar {
    width: 31%;
    height: 880px;
    margin: 20px 0px 0px 0px;
    background: #ffffff;
    border-radius: 8px;
    text-align: center;
    .calendar {
      margin: auto;
      width: 70%;
      height: 880px;
      background: url("../../assets/dashboard/calendar.png") no-repeat;
    }
  }
}
.header {
  cursor: pointer;
}
::-webkit-scrollbar {
  display: none;
}
::-webkit-scrollbar-thumb {
  display: none;
}
.text-link:hover {
  color: #0fafe4 !important;
  text-decoration: underline #0fafe4 solid !important;
}
</style>
