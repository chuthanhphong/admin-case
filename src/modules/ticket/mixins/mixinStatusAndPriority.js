import { definedStatus } from "@/modules/ticket/helpers/ticketUtils";

export default {
  methods: {
    getTextByStatus(status) {
      switch (status) {
        case definedStatus.cancelled:
          return this.$t("tickets.status-by.cancelled");
        case definedStatus.draft:
          return this.$t("tickets.status-by.draft");
        case definedStatus.processing:
          return this.$t("tickets.status-by.processing");
        case definedStatus.reject_review:
          return this.$t("tickets.status-by.reject-review");
        case definedStatus.forward:
          return this.$t("tickets.status-by.forward-approved");
        case definedStatus.waiting_close:
          return this.$t("tickets.status-by.close-waiting");
        case definedStatus.waiting_review:
          return this.$t("tickets.status-by.review-waiting");
        case definedStatus.result_approve:
          return this.$t("tickets.status-by.result-approved");
        case definedStatus.refuse_close:
          return this.$t("tickets.status-by.refused-close");
        case definedStatus.closed:
          return this.$t("tickets.status-by.closed");
        default:
          return "";
      }
    },
    getColorTextByStatus(status) {
      switch (status) {
        case definedStatus.cancelled:
          return "pink-f0--text";
        case definedStatus.draft:
          return "gray--text";
        case definedStatus.processing:
          return "yellow-ff--text";
        case definedStatus.waiting_close:
          return "blue-1c--text";
        case definedStatus.forward:
        case definedStatus.waiting_review:
        case definedStatus.result_approve:
          return "blue-4a--text";
        case definedStatus.reject_review:
        case definedStatus.refuse_close:
          return "danger--text";
        case definedStatus.closed:
          return "primary--text";
        default:
          return "";
      }
    },
    getColorDotByStatus(status) {
      switch (status) {
        case definedStatus.cancelled:
          return "pink-f0";
        case definedStatus.draft:
          return "gray";
        case definedStatus.processing:
          return "yellow-ff";
        case definedStatus.waiting_close:
          return "blue-1c";
        case definedStatus.forward:
        case definedStatus.waiting_review:
        case definedStatus.result_approve:
          return "blue-4a";
        case definedStatus.reject_review:
        case definedStatus.refuse_close:
          return "danger";
        case definedStatus.closed:
          return "primary";
        default:
          return "";
      }
    },
    getClassColorProgressByStatus(status) {
      switch (status) {
        case definedStatus.cancelled:
          return "pro-pink-f0";
        case definedStatus.draft:
          return "pro-gray-light";
        case definedStatus.processing:
          return "pro-yellow-ff";
        case definedStatus.waiting_close:
          return "pro-blue-1c";
        case definedStatus.forward:
        case definedStatus.waiting_review:
        case definedStatus.result_approve:
          return "pro-blue-4a";
        case definedStatus.reject_review:
        case definedStatus.refuse_close:
          return "pro-danger";
        case definedStatus.closed:
          return "pro-primary";
        default:
          return "";
      }
    },
    getColorChipByStatus(status) {
      switch (status) {
        case definedStatus.cancelled:
          return "#FFE7F5";
        case definedStatus.draft:
          return "#E9E9EA";
        case definedStatus.processing:
          return "#FFEFD5";
        case definedStatus.waiting_close:
          return "#DBE2FB";
        case definedStatus.forward:
        case definedStatus.waiting_review:
        case definedStatus.result_approve:
          return "#DEDFFF";
        case definedStatus.reject_review:
        case definedStatus.refuse_close:
          return "#FFE8E9";
        case definedStatus.closed:
          return "#CCF3FE";
        default:
          return "";
      }
    },
    getKeyTextByPriority(val) {
      switch (val) {
        case 1:
          return "tickets.urgency.urgency-high";
        case 2:
          return "tickets.urgency.urgency-normal";
        default:
          return "tickets.urgency.urgency-low";
      }
    },
    getColorByPriority(val) {
      switch (val) {
        case 1:
          return "danger";
        case 2:
          return "orange";
        default:
          return "gray";
      }
    },
    getColorTextByPriority(val) {
      switch (val) {
        case 1:
          return "text-danger";
        case 2:
          return "orange--text";
        default:
          return "gray--text";
      }
    },
    getColorChipByPriority(val) {
      switch (val) {
        case 1:
          return "#FFE8E9";
        case 2:
          return "#FFE7D7";
        default:
          return "#E9E9EA";
      }
    },
  },
}
