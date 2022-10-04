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
