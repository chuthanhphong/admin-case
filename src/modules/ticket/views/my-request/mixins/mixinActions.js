// libs
import constants from "@/constants";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";

export default {
  data() {
    return {
      itemActionSelected: null,
      showDialogConfirmDelete: false,
      showDialogConfirmCancel: false,
      showDialogConfirmClose: false,
      showDialogConfirmRefuseClose: false,
      showDialogUpdateTicket: false,
      detailSelected: null,
      isUpdateItemSelected: false,
    };
  },
  methods: {
    // show actions
    isShowViewAction() {
      return true;
    },
    isShowSendAction(val) {
      return this.isStatusDraft(val);
    },
    isShowEditAction(val) {
      return this.isStatusDraft(val) || this.isStatusRejectReview(val);
    },
    isShowDeleteAction(val) {
      return this.isStatusDraft(val);
    },
    isShowCancelAction(val) {
      return this.isStatusRejectReview(val) || this.isStatusWaitingReview(val);
    },
    isShowCloseAction(val) {
      return (
        this.isStatusProcessing(val) ||
        this.isStatusForward(val) ||
        this.isStatusWaitingClose(val) ||
        this.isStatusResultApprove(val) ||
        this.isStatusRefuseClose(val)
      );
    },
    isShowRefuseCloseAction(val) {
      return this.isStatusWaitingClose(val);
    },

    // handle action send
    async onAcceptSend(id) {
      try {
        this.loading = true;
        if (this.isShowSendAction) {
          const pars = { ids: [id], note: this.$t("tickets.notes.send") };
          await TicketService.send(pars);
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.send-success",
          });
          this.getList();
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
    // handle action xoa
    onShowConfirmDelete(val) {
      this.showDialogConfirmDelete = true;
      this.setItemActionSelected(val);
    },
    setItemActionSelected(val) {
      this.itemActionSelected = val;
    },
    async onAcceptDelete() {
      try {
        this.loading = true;
        if (this.isShowDeleteAction) {
          const pars = { id: this.itemActionSelected.id };
          await TicketService.delete(pars);
          this.resetItemActionSelected();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.delete-success",
          });
          this.getList();
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
    onCancelDelete() {
      this.resetItemActionSelected();
      this.showDialogConfirmDelete = false;
    },
    resetItemActionSelected() {
      this.itemActionSelected = null;
    },
    // handle action huy yeu cau
    onShowConfirmCancel(val) {
      this.showDialogConfirmCancel = true;
      this.setItemActionSelected(val);
    },
    async onAcceptCancel() {
      try {
        this.loading = true;
        if (this.isShowCancelAction) {
          const pars = {
            ids: [this.itemActionSelected.id],
            note: this.$t("tickets.notes.cancel"),
          };
          await TicketService.cancel(pars);
          this.resetItemActionSelected();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.cancel-success",
          });
          this.getList();
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
    onCancelCancel() {
      this.resetItemActionSelected();
      this.showDialogConfirmCancel = false;
    },

    // handle action dong
    onShowConfirmClose(val) {
      this.showDialogConfirmClose = true;
      this.setItemActionSelected(val);
    },
    async onAcceptClose() {
      try {
        this.loading = true;
        if (this.isShowCloseAction) {
          const pars = {
            ids: [this.itemActionSelected.id],
            note: this.$t("tickets.notes.close"),
          };
          await TicketService.close(pars);
          this.resetItemActionSelected();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.ticket-close-success",
          });
          this.getList();
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
    onCancelClose() {
      this.resetItemActionSelected();
      this.showDialogConfirmClose = false;
    },

    // handle action tu choi dong
    onShowConfirmRefuseClose(val) {
      this.showDialogConfirmRefuseClose = true;
      this.setItemActionSelected(val);
    },
    async onAcceptRefuseClose() {
      try {
        this.loading = true;
        if (this.isShowRefuseCloseAction) {
          const pars = {
            ids: [this.itemActionSelected.id],
            note: this.$t("tickets.labels.refused-close"),
          };
          await TicketService.reject(pars);
          this.resetItemActionSelected();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.refuse-close-success",
          });
          this.getList();
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
    onCancelRefuseClose() {
      this.resetItemActionSelected();
      this.showDialogConfirmRefuseClose = false;
    },
    async onShowDialogUpdateTicket(item) {
      await this.getDetail(item.id);
      this.isUpdateItemSelected = true;
      this.isShowDialogAddNew = true;
    },
    async getDetail(id) {
      try {
        this.loading = true;
        const pars = { id: id };
        const response = await TicketService.detail(pars);
        if (response) {
          this.detailSelected = response.data;
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
  },
};
