import constants from "@/constants";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";

export default {
  data() {
    return {
      showDialogProcess: false,
      dataProcess: {
        process: null,
      },
      selectedItemUpdateProgress: null
    };
  },
  watch: {
    showDialogProcess(val) {
      if (val && !val) {
        this.resetSelectedItemUpdateProgress();
      }
    },
  },
  methods: {
    onShowDialogUpdateProgress(val) {
      this.selectedItemUpdateProgress = val;
      if (typeof val.progress !== "undefined" && val.progress >= 0) {
        this.dataProcess.process = val.progress;
      } else {
        this.dataProcess.process = 0
      }
      this.showDialogProcess = true;
    },
    async changeProcess(data) {
      try {
        this.loading = true;
        if (data.process === 100) {
          this.onShowConfirmComplete(this.selectedItemUpdateProgress);
        } else {
          if (this.selectedItemUpdateProgress) {
            const pars = {
              id: this.selectedItemUpdateProgress.id,
              progress: data.process,
            };
            await TicketService.updateProgressTicket(pars);
            this.setNotify({
              show: true,
              type: constants.NOTIFY_TYPE.SUCCESS,
              content: "tickets.messages.update-progress-success",
            });
            this.page = 1;
            this.getList();
          }
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.resetSelectedItemUpdateProgress();
        this.loading = false;
      }
    },
    resetSelectedItemUpdateProgress() {
      this.selectedItemUpdateProgress = null;
    },
  },
}
