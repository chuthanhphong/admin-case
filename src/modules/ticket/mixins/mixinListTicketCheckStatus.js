import { definedStatus } from "@/modules/ticket/helpers/ticketUtils";

export default {
  methods: {
    isStatusCancel(val) {
      return val === definedStatus.cancelled;
    },
    isStatusDraft(val) {
      return val === definedStatus.draft;
    },
    isStatusProcessing(val) {
      return val === definedStatus.processing;
    },
    isStatusRejectReview(val) {
      return val === definedStatus.reject_review;
    },
    isStatusForward(val) {
      return val === definedStatus.forward;
    },
    isStatusWaitingClose(val) {
      return val === definedStatus.waiting_close;
    },
    isStatusWaitingReview(val) {
      return val === definedStatus.waiting_review;
    },
    isStatusResultApprove(val) {
      return val === definedStatus.result_approve;
    },
    isStatusRefuseClose(val) {
      return val === definedStatus.refuse_close;
    },
    isStatusClose(val) {
      return val === definedStatus.closed;
    },
  },
};
