// import { definedStatus } from "@/modules/carbooking/helpers/bookingUtils";

export default {
  methods: {
    getTextByStatus(status) {
      switch (status) {
        case 0:
          return this.$t("booking.status-by.draft");
        case 1:
          return this.$t("booking.status-by.waiting_approve");
        case 2:
          return this.$t("booking.status-by.approved");
        case 3:
          return this.$t("booking.status-by.reject");
        case 4:
          return this.$t("booking.status-by.cancelled");
        case 6:
          return this.$t("booking.status-by.approve_expired");
        default:
          return "";
      }
    },
    getColorTextByStatus(status) {
      switch (status) {
        case 0:
          return "gray--text";
        case 4:
          return "pink-f0--text";
        case 1:
          return "blue-1c--text";
        case 2:
          return "primary--text";
        case 3:
          return "danger--text";
        case 6:
          return "danger--text";
        default:
          return "";
      }
    },
    getColorDotByStatus(status) {
      switch (status) {
        case 0:
          return "gray";
        case 4:
          return "pink-f0";
        case 1:
          return "blue-1c";
        case 2:
          return "primary";
        case 6:
          return "danger";
        case 3:
          return "danger";
        default:
          return "";
      }
    },
    getClassColorProgressByStatus(status) {
      switch (status) {
        case 0:
          return "pro-gray-light";
        case 4:
          return "pro-pink-f0";
        case 1:
          return "pro-blue-1c";
        case 2:
          return "pro-primary";
        case 6:
          return "pro-danger";
        case 3:
          return "pro-danger";
        default:
          return "";
      }
    },
    getColorChipByStatus(status) {
      switch (status) {
        case 0:
          return "#E9E9EA";
        case 4:
          return "#FFE7F5";
        case 1:
          return "#DBE2FB";
        case 2:
          return "#CCF3FE";
        case 6:
          return "#FFE8E9";
        case 3:
          return "#FFE8E9";
        default:
          return "";
      }
    },
    getColorBtnByStatus(val) {
      switch (val) {
        case 0:
          return "#E9E9EA";
        case 4:
          return "#FCD4EC";
        case 1:
          return "#DEDFFF";
        case 2:
          return "#CCF3FE";
        case 6:
          return "#FFDBDD";
        case 3:
          return "#FFDBDD";
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
