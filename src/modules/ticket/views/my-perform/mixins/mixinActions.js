// libs
import constants from "@/constants";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";
import { StorageService } from "@/modules/ticket/services/storageService";
import { UserService } from "@/modules/ticket/services/userService";

export default {
  data() {
    return {
      itemActionSelected: null,
      showDialogTreeView: false,
      showDialogConfirmComplete: false,
      showDialogConfirmForwardGroup: false,
      allGroups: [],
      groupSelectedForwardTicket: null,
      showDialogAssigner: false,
      usersByGroupIdForAssigner: [],
    };
  },
  watch: {
    showDialogAssigner(val) {
      if (!val) {
        this.resetItemActionSelected();
      }
    }
  },
  methods: {
    async getAllGroup() {
      this.allGroups = await StorageService.getAllGroup();
    },
    async getUsersFromGroupId() {
      try {
        const pars = { id: this.userInfo.userRoleDetails[0].groupId };
        const response = await UserService.getUsersFromGroupId(pars);
        if (response) {
          this.removeMySelfOfGroup(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    removeMySelfOfGroup(data) {
      data.splice(0, 1);
      this.usersByGroupIdForAssigner = data;
    },
    isDisableActions(val) {
      return (
        this.isStatusDraft(val) ||
        this.isStatusRejectReview(val) ||
        this.isStatusWaitingReview(val)
      );
    },
    // show actions
    isShowViewAction(val) {
      return (
        this.isStatusCancel(val) ||
        this.isStatusProcessing(val) ||
        this.isStatusForward(val) ||
        this.isStatusWaitingClose(val) ||
        this.isStatusResultApprove(val) ||
        this.isStatusRefuseClose(val) ||
        this.isStatusClose(val)
      );
    },
    isShowCompleteAction(val) {
      return this.isStatusProcessing(val) || this.isStatusRefuseClose(val);
    },
    isShowForwardAction(val) {
      return this.isStatusProcessing(val);
    },
    isShowAssignerAction(val) {
      return this.isStatusProcessing(val);
    },

    // handle action chuyen don vi
    onShowDialogTreeView(val) {
      this.showDialogTreeView = true;
      this.setItemActionSelected(val);
    },
    onCloseDialogTreeView() {
      this.showDialogTreeView = false;
    },
    async selectedForwardGroup(val) {
      if (this.itemActionSelected.groupId !== val[0].groupId) {
        this.groupSelectedForwardTicket = val[0];
        this.showDialogConfirmForwardGroup = true;
      } else {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: "tickets.messages.forward-group-seft",
        });
      }
    },
    async onAcceptForwardGroup() {
      this.showDialogConfirmForwardGroup = false;
      try {
        this.loading = true;
        if (
          this.itemActionSelected.groupId !==
          this.groupSelectedForwardTicket.groupId
        ) {
          const pars = {
            id: this.itemActionSelected.id,
            note: this.$t("tickets.notes.forward-group"),
            groupId: this.groupSelectedForwardTicket.groupId,
          };
          await TicketService.forwardTicketGroup(pars);
          this.resetItemActionSelected();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.forward-group-success",
          });
          this.getList();
        } else {
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.ERROR,
            content: "tickets.messages.forward-group-seft",
          });
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.loading = false;
      }
    },
    onShowDialogAssigner(val) {
      this.showDialogAssigner = true;
      this.setItemActionSelected(val);
    },
    async updateAssignTo(val) {
      this.showDialogAssigner = false;
      try {
        this.loading = true;
        const pars = {
          id: this.itemActionSelected.id,
          note: this.$t("tickets.messages.forward-user"),
          userId: val.userId,
        };
        await TicketService.forwardTicketUser(pars);
        this.resetItemActionSelected();
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: "tickets.messages.forward-user-success",
        });
        this.getList();
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
