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
    calcPercentLine(number1, number2) {
      const highestNumber = number1 > number2 ? number1 : number2;

      return ((number1 / highestNumber) * 100).toFixed()
    },
    eventClickLine(name, key, type = '', value = 0) {
      this.$router.push({ name: name, params: { key: key, type: type, value: value }})
    },
    colorExpiredTask(number) {
      return number ? 'color: red;' : '';
    }
  },
};
