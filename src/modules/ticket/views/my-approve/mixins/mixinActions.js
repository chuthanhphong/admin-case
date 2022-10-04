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
    // handle action xoa
    onShowConfirmDelete(val) {
      this.showDialogConfirmDelete = true;
      this.setItemActionSelected(val);
    },
    setItemActionSelected(val) {
      this.itemActionSelected = val;
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
    onCancelCancel() {
      this.resetItemActionSelected();
      this.showDialogConfirmCancel = false;
    },

    // handle action dong
    onShowConfirmClose(val) {
      this.showDialogConfirmClose = true;
      this.setItemActionSelected(val);
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
    onCancelRefuseClose() {
      this.resetItemActionSelected();
      this.showDialogConfirmRefuseClose = false;
    },
    async onShowDialogUpdateTicket(item) {
      await this.getDetail(item.id);
      this.isUpdateItemSelected = true;
      this.isShowDialogAddNew = true;
    },
    async onAcceptClose() {
      try {
        this.loading = true;
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
