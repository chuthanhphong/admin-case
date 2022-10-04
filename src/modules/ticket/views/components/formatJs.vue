<script>
import constants from "@/constants";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";

export default {
  data() {
    return {
      showDialogConfirmComplete: false,
      itemActionSelected: null,
    };
  },
  watch: {},
  methods: {
    // handle action hoan thanh
    onShowConfirmComplete(val) {
      this.showDialogConfirmComplete = true;
      this.setItemActionSelected(val);
    },
    setItemActionSelected(val) {
      this.itemActionSelected = val;
    },
    async onAcceptComplete(data) {
      this.showDialogConfirmComplete = false;
      try {
        this.loading = true;
        const pars = {
          id: this.itemActionSelected.id,
          note: data.reason,
        };

        if (data.fileAttachmentRequests.length > 0) {
          pars["fileAttachmentRequests"] = data.fileAttachmentRequests;
        }
        await TicketService.complete(pars);
        this.resetItemActionSelected();
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: "tickets.messages.complete",
        });
        this.page = 1;
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
    resetItemActionSelected() {
      this.itemActionSelected = null;
    },
    onCancelComplete() {
      this.resetItemActionSelected();
      this.showDialogConfirmComplete = false;
    },
  },
};
</script>
