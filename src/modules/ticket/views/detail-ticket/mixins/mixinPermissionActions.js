import constants from "@/constants";
import routePaths from "@/modules/ticket/router/routePaths";
import { definedTicketDetailRedirect } from "@/modules/ticket/helpers/ticketUtils";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";
export default {
  data() {
    return {
      showDialogConfirmDelete: false,
      showDialogConfirmRejectReview: false,
      showDialogConfirmDenyForwardGroup: false,
      showDialogConfirmReject: false,
      showDialogConfirmCancel: false,
      showDialogConfirmReview: false,
      showDialogConfirmAcceptForwardGroup: false,
      showDialogConfirmResultApprove: false,
      showDialogConfirmClose: false,
      showDialogConfirmRefuseClose: false,

      showDialogTreeView: false,
      groupSelectedForwardTicket: null,
      showDialogConfirmForwardGroup: false,
      showDialogConfirmComplete: false,
    };
  },
  computed: {
    // actions
    // delete
    isShowDeleteAction() {
      return this.isCreatedAndStatusDraft;
    },
    // send
    isShowSendAction() {
      return this.isCreatedAndStatusDraft;
    },
    // tu choi xem xet
    isShowRejectReviewAction() {
      return (
        this.isCreatedLeaderAndStatusWaitingReview ||
        this.isAdminAndStatusWaitingReview
      );
    },
    // xem xet
    isShowReviewAction() {
      return (
        this.isCreatedLeaderAndStatusWaitingReview ||
        this.isAdminAndStatusWaitingReview
      );
    },
    // duyet chuyen don vi
    isShowAcceptForwardGroupAction() {
      return (
        this.isPerformerLeaderAndStatusForward || this.isAdminAndStatusForward
      );
    },
    // tu choi duyet chuyen don vi
    isShowDenyForwardGroupAction() {
      return (
        this.isPerformerLeaderAndStatusForward || this.isAdminAndStatusForward
      );
    },
    // tu choi duyet ket qua
    isShowRejectAction() {
      return (
        this.isPerformerLeaderAndStatusResultApprove ||
        this.isAdminAndStatusResultApprove
      );
    },
    // duyet ket qua
    isShowResultApproveAction() {
      return (
        this.isPerformerLeaderAndStatusResultApprove ||
        this.isAdminAndStatusResultApprove
      );
    },
    // huy yeu cau
    isShowCancelAction() {
      return (
        this.isCreatedAndStatusRejectReview ||
        this.isCreatedAndStatusWaitingReview ||
        this.isAdminAndStatusRejectReview ||
        this.isAdminAndStatusWaitingReview
      );
    },
    // edit
    isShowEditAction() {
      return (
        this.isCreatedAndStatusDraft ||
        this.isCreatedAndStatusRejectReview ||
        this.isAdminAndStatusRejectReview
      );
    },
    // dong yeu cau
    isShowCloseAction() {
      return (
        this.isCreatedAndStatusProcessing ||
        this.isCreatedAndStatusForward ||
        this.isCreatedAndStatusWaitingClose ||
        this.isCreatedAndStatusResultApprove ||
        this.isCreatedAndStatusRefuseClose ||
        this.isCreatedLeaderAndStatusProcessing ||
        this.isCreatedLeaderAndStatusForward ||
        this.isCreatedLeaderAndStatusWaitingClose ||
        this.isCreatedLeaderAndStatusResultApprove ||
        this.isCreatedLeaderAndStatusRefuseClose ||
        this.isAdminAndStatusProcessing ||
        this.isAdminAndStatusForward ||
        this.isAdminAndStatusWaitingClose ||
        this.isAdminAndStatusResultApprove ||
        this.isAdminAndStatusRefuseClose
      );
    },
    // tu choi dong
    isShowRefuseCloseAction() {
      return (
        this.isCreatedAndStatusWaitingClose ||
        this.isCreatedLeaderAndStatusWaitingClose ||
        this.isAdminAndStatusWaitingClose
      );
    },
    // chuyen don vi
    isShowForwardGroupAction() {
      return (
        this.isPerformerAndStatusProcessing ||
        this.isPerformerLeaderAndStatusProcessing ||
        this.isAdminAndStatusProcessing
      );
    },
    // hoan thanh
    isShowCompleteAction() {
      return (
        this.isPerformerAndStatusProcessing ||
        this.isPerformerAndStatusRefuseClose ||
        this.isPerformerLeaderAndStatusProcessing ||
        this.isPerformerLeaderAndStatusRefuseClose ||
        this.isAdminAndStatusProcessing ||
        this.isAdminAndStatusRefuseClose
      );
    },
  },
  methods: {
    // handle action xoa
    onShowConfirmDelete() {
      this.showDialogConfirmDelete = true;
    },
    async onAcceptDelete() {
      try {
        this.loading = true;
        if (this.isShowDeleteAction) {
          const pars = { id: this.detail.id };
          await TicketService.delete(pars);
          this.setTypeRedirect(definedTicketDetailRedirect.request);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.delete-success",
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

    // handle action send
    async onAcceptSend() {
      try {
        this.loading = true;
        if (this.isShowSendAction) {
          const pars = {
            ids: [this.detail.id],
            note: this.$t("tickets.notes.send"),
          };
          await TicketService.send(pars);
          this.setTypeRedirect(definedTicketDetailRedirect.perform);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.send-success",
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

    // handle action tu choi xem xet
    onShowConfirmRejectReview() {
      this.showDialogConfirmRejectReview = true;
    },
    async onAcceptRejectReview(reason) {
      try {
        this.loading = true;
        if (this.isShowRejectReviewAction) {
          const note =
            reason !== "" ? reason : this.$t("tickets.notes.reject-review");
          const pars = { ids: [this.detail.id], note: note };
          await TicketService.rejectedSending(pars);
          this.setTypeRedirect(definedTicketDetailRedirect.approve);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.reject-review-success",
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

    // handle action xem xet
    onShowConfirmReview() {
      this.showDialogConfirmReview = true;
    },
    async onAcceptReview() {
      try {
        this.loading = true;
        if (this.isShowReviewAction) {
          const pars = {
            ids: [this.detail.id],
            note: this.$t("tickets.notes.approve-sending"),
          };
          await TicketService.approvedSending(pars);
          this.setTypeRedirect(definedTicketDetailRedirect.approve);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.review-success",
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

    // handle action chuyen don vi
    onShowDialogTreeView() {
      this.showDialogTreeView = true;
    },
    onCloseDialogTreeView() {
      this.showDialogTreeView = false;
    },
    async selectedForwardGroup(val) {
      if (this.detail.groupId !== val[0].groupId) {
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
          this.detail.groupId !== this.groupSelectedForwardTicket.groupId &&
          this.isShowForwardGroupAction
        ) {
          const pars = {
            id: this.detail.id,
            note: this.$t("tickets.notes.forward-group"),
            groupId: this.groupSelectedForwardTicket.groupId,
          };
          await TicketService.forwardTicketGroup(pars);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.forward-group-success",
          });
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

    // handle action tu choi duyet chuyen don vi
    onShowConfirmDenyForwardGroup() {
      this.showDialogConfirmDenyForwardGroup = true;
    },
    async onAcceptDenyForwardGroup(reason) {
      try {
        this.loading = true;
        if (this.isShowDenyForwardGroupAction) {
          const note =
            reason !== ""
              ? reason
              : this.$t("tickets.notes.deny-forward-group");
          const pars = { ids: [this.detail.id], note: note };
          await TicketService.denyForwardGroup(pars);
          this.setTypeRedirect(definedTicketDetailRedirect.approve);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.deny-forward-group-success",
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

    // handle action duyet chuyen don vi
    onShowConfirmAcceptForwardGroup() {
      this.showDialogConfirmAcceptForwardGroup = true;
    },
    async onAcceptAcceptForwardGroup() {
      try {
        this.loading = true;
        if (this.isShowAcceptForwardGroupAction) {
          const pars = {
            ids: [this.detail.id],
            note: this.$t("tickets.notes.accept-forward-group"),
          };
          await TicketService.acceptForwardGroup(pars);
          this.setTypeRedirect(definedTicketDetailRedirect.approve);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.accept-forward-group-success",
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

    // handle action tu choi duyet ket qua
    onShowConfirmReject() {
      this.showDialogConfirmReject = true;
    },
    async onAcceptReject(reason) {
      try {
        this.loading = true;
        if (this.isShowRejectAction) {
          const note = reason !== "" ? reason : this.$t("tickets.notes.reject");
          const pars = { ids: [this.detail.id], note: note };
          await TicketService.rejectFinish(pars);
          this.setTypeRedirect(definedTicketDetailRedirect.approve);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.reject-success",
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

    // handle action duyet ket qua
    onShowConfirmResultApprove() {
      this.showDialogConfirmResultApprove = true;
    },
    async onAcceptResultApprove() {
      try {
        this.loading = true;
        if (this.isShowResultApproveAction) {
          const pars = {
            ids: [this.detail.id],
            note: this.$t("tickets.notes.result-approve"),
          };
          await TicketService.approveFinish(pars);
          this.setTypeRedirect(definedTicketDetailRedirect.approve);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.result-approve-success",
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

    // handle action huy yeu cau
    onShowConfirmCancel() {
      this.showDialogConfirmCancel = true;
    },
    async onAcceptCancel() {
      try {
        this.loading = true;
        if (this.isShowCancelAction) {
          const pars = {
            ids: [this.detail.id],
            note: this.$t("tickets.notes.cancel"),
          };
          await TicketService.cancel(pars);
          this.setTypeRedirect(definedTicketDetailRedirect.request);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.cancel-success",
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

    // handle action dong
    onShowConfirmClose() {
      this.showDialogConfirmClose = true;
    },
    async onAcceptClose() {
      try {
        this.loading = true;
        if (this.isShowCloseAction) {
          const pars = {
            ids: [this.detail.id],
            note: this.$t("tickets.notes.close"),
          };
          await TicketService.close(pars);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.ticket-close-success",
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

    // handle action tu choi dong
    onShowConfirmRefuseClose() {
      this.showDialogConfirmRefuseClose = true;
    },
    async onAcceptRefuseClose() {
      try {
        this.loading = true;
        if (this.isShowRefuseCloseAction) {
          const pars = {
            ids: [this.detail.id],
            note: this.$t("tickets.labels.refused-close"),
          };
          await TicketService.reject(pars);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.refuse-close-success",
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

    // handle action hoan thanh
    onShowConfirmComplete() {
      this.showDialogConfirmComplete = true;
    },
    async onAcceptComplete(data) {
      try {
        this.loading = true;
        if (this.isShowCompleteAction) {
          const pars = {
            id: this.detail.id,
            note: data.reason,
          };

          if (data.fileAttachmentRequests.length > 0) {
            pars["fileAttachmentRequests"] = data.fileAttachmentRequests;
          }
          await TicketService.complete(pars);
          this.onGotoBack();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.complete",
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
    setTypeRedirect(type) {
      this.typeRedirect = type;
    },
    onGotoBack() {
      const path = this.getPathWithBack(this.typeRedirect);
      this.$router.push(path);
    },
    getPathWithBack(type) {
      switch (type) {
        case definedTicketDetailRedirect.perform:
          return routePaths.MY_PERFORM_TICKET_PATH;
        case definedTicketDetailRedirect.request:
          return routePaths.MY_REQUEST_TICKET_PATH;
        case definedTicketDetailRedirect.follow:
          return routePaths.MY_FOLLOW_TICKET_PATH;
        case definedTicketDetailRedirect.task:
          return routePaths.TASK_CENTER_TICKET_PATH;
        case definedTicketDetailRedirect.group:
          return routePaths.DEPARTMENT_TICKET_PATH;
        case definedTicketDetailRedirect.approve:
          return routePaths.MY_APPROVE_TICKET_PATH;
        default:
          return routePaths.MY_REQUEST_TICKET_PATH;
      }
    },
  },
};
