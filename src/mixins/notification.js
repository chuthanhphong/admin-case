import { UsersService } from "@/services/usersService";
import { FileService } from "@/modules/econtract/services/fileService";
import constants from "@/constants";
import moment from "moment";
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("layout", ["setParamsNotification", "setPageCodeNotification"]),

    async initNotifications(formDataSearch) {
      try {
        const res = await UsersService.findUserNotifications(formDataSearch);
        return res && res.data ? res.data : []
      } catch (error) {
        console.log(error)
      }
    },

    async updateReadNoti(data) {
      try {
        const res = await UsersService.readNotifi({
          notificationIds: data
        });
        return res.status
      } catch (error) {
        console.log(error)
      }
    },

    formatTime(time) {
      return moment(time).format("HH:mm DD/MM/YYYY");
    },

    getModuleNotify(type) {
      const result = {
        className: "",
        module: "",
      }
      switch (type) {
        case "DWS_SIGNATURE":
          result.className = "icon-kydt";
          result.module = `${this.$t('notifications.title.DWS_SIGNATURE')}`
          break;
        case "DWS_EDOCUMENT":
          result.className = "icon-vanban";
          result.module = `${this.$t("notifications.title.DWS_EDOCUMENT")}`
          break;
        case "DWS_TICKET":
          result.className = "icon-yeucau";
          result.module = `${this.$t("notifications.title.DWS_TICKET")}`
          break;
        case "DWS_TASK":
          result.className = "icon-congviec";
          result.module = `${this.$t("notifications.title.DWS_TASK")}`
          break;
        case "DWS_ECONTRACT":
          result.className = "icon-hddt";
          result.module = `${this.$t("notifications.title.DWS_ECONTRACT")}`
          break;
        case "DWS_CORE":
          result.className = "icon-tongquan";
          result.module = `${this.$t("notifications.title.DWS_CORE")}`
          break;
        case "DWS_ECALENDAR":
          result.className = "icon-lichhop";
          result.module = `${this.$t("notifications.title.DWS_ECALENDAR")}`
          break;
        case "DWS_VEHICLE":
          result.className = "icon-xe";
          result.module = `${this.$t("notifications.title.DWS_VEHICLE")}`
          break;
        default:
          result.className = "icon-tongquan";
          result.module = `${this.$t("notifications.title.DWS_CORE")}`
          break;
      }

      return result
    },
    async getImage(item) {
      try {
        if (item == null) {
          return null
        }
        const response = await FileService.downloadImage({
          ...item,
        });
        return response;
      } catch (error) {
        console.log(error);
      }
    },

    bgReadUnread(readStatus) {
      return readStatus != null && readStatus === 0 ? "bg-unread" : "bg-read";
    },

    eventNotificationDetail(item) {
      constants.PAGE_CODE_NOTIFICATIONS.TASK.map(notification => {
        if (notification.PAGE_CODE === item.pageCode) {
          this.setPageCodeNotification(item.pageCode)
          this.setParamsNotification(parseInt(item.params))
          this.$route.name !== notification.NAME && this.$router.push({
            name: notification.NAME
          });
        }
      })

      constants.PAGE_CODE_NOTIFICATIONS.TICKET.map(notification => {
        if (notification.PAGE_CODE === item.pageCode) {
          this.$route.query.id !== item.params &&
          this.$router.push({
            name: notification.NAME,
            query: { id: item.params }
          });
        }
      })
    },
    getAvatarByName(name) {
      const lastIndex = name.split(" ").length - 1;

      return name.split(" ")[lastIndex][0];
    }
  }
}
