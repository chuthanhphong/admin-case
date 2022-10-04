import { definedStatus } from "@/modules/ticket/helpers/ticketUtils";
import { mapState } from "vuex";
import mixinFindUserRole from "@/modules/ticket/mixins/mixinFindUserRole";

export default {
  mixins: [mixinFindUserRole],
  computed: {
    ...mapState("layout", ["userInfo"]),
    isNotNull() {
      return this.detail !== null;
    },
    hasAttributeUserName() {
      return typeof this.detail.userName !== "undefined";
    },
    hasAttributeFileName() {
      return typeof this.detail.fileName !== "undefined";
    },
    hasAttributeMonitorUsers() {
      return typeof this.detail.monitorUsers !== "undefined";
    },
    hasAttributeInfoUser() {
      return typeof this.detail.infoUser !== "undefined";
    },
    hasAttributeExpectEndDate() {
      return typeof this.detail.expectEndDate !== "undefined";
    },
    hasAttributeEstDuration() {
      return typeof this.detail.estDuration !== "undefined";
    },
    hasAttributeStartDate() {
      return typeof this.detail.startDate !== "undefined";
    },
    hasAttributeGroupChange() {
      return typeof this.detail.groupChange !== "undefined";
    },
    hasTaskSourceMap() {
      return this.detail.taskSourceMap.data.length > 0;
    },
    isViewer() {
      return (
        !this.isCreated &&
        !this.isPerformer &&
        !this.isCreatedLeader &&
        !this.isPerformerLeader &&
        !this.isAdminTicket
      );
    },
    isNoCreatedAndStatusDraft() {
      return (
        this.detail &&
        this.detail.createUserId !== this.userInfo.userId &&
        this.detail.status === definedStatus.draft
      );
    },
    // admin
    isAdminTicket() {
      const groupIds = this.findAdminGroupIds;
      if (groupIds && groupIds.length > 0) {
        return true;
      }

      return false;
    },
    isAdminAndStatusDraft() {
      return this.isAdminTicket && this.detail.status === definedStatus.draft;
    },
    isAdminAndStatusProcessing() {
      return (
        this.isAdminTicket && this.detail.status === definedStatus.processing
      );
    },
    isAdminAndStatusRejectReview() {
      return (
        this.isAdminTicket && this.detail.status === definedStatus.reject_review
      );
    },
    isAdminAndStatusForward() {
      return this.isAdminTicket && this.detail.status === definedStatus.forward;
    },
    isAdminAndStatusWaitingClose() {
      return (
        this.isAdminTicket && this.detail.status === definedStatus.waiting_close
      );
    },
    isAdminAndStatusWaitingReview() {
      return (
        this.isAdminTicket &&
        this.detail.status === definedStatus.waiting_review
      );
    },
    isAdminAndStatusResultApprove() {
      return (
        this.isAdminTicket &&
        this.detail.status === definedStatus.result_approve
      );
    },
    isAdminAndStatusRefuseClose() {
      return (
        this.isAdminTicket && this.detail.status === definedStatus.refuse_close
      );
    },

    // nguoi tao
    isCreated() {
      return this.detail && this.detail.createUserId === this.userInfo.userId;
    },
    isCreatedAndStatusDraft() {
      return this.isCreated && this.detail.status === definedStatus.draft;
    },
    isCreatedAndStatusProcessing() {
      return this.isCreated && this.detail.status === definedStatus.processing;
    },
    isCreatedAndStatusRejectReview() {
      return (
        this.isCreated && this.detail.status === definedStatus.reject_review
      );
    },
    isCreatedAndStatusForward() {
      return this.isCreated && this.detail.status === definedStatus.forward;
    },
    isCreatedAndStatusWaitingClose() {
      return (
        this.isCreated && this.detail.status === definedStatus.waiting_close
      );
    },
    isCreatedAndStatusWaitingReview() {
      return (
        this.isCreated && this.detail.status === definedStatus.waiting_review
      );
    },
    isCreatedAndStatusResultApprove() {
      return (
        this.isCreated && this.detail.status === definedStatus.result_approve
      );
    },
    isCreatedAndStatusRefuseClose() {
      return (
        this.isCreated && this.detail.status === definedStatus.refuse_close
      );
    },

    // nguoi thuc hien
    isPerformer() {
      return (
        this.isNotNull &&
        this.hasAttributeInfoUser &&
        this.detail.userId === this.userInfo.userId
      );
    },
    isPerformerAndStatusProcessing() {
      return (
        this.isPerformer && this.detail.status === definedStatus.processing
      );
    },
    isPerformerAndStatusResultApprove() {
      return (
        this.isPerformer && this.detail.status === definedStatus.result_approve
      );
    },
    isPerformerAndStatusRefuseClose() {
      return (
        this.isPerformer && this.detail.status === definedStatus.refuse_close
      );
    },
    isRemoveUserPerformOfGroup() {
      return (
        this.hasAttributeInfoUser &&
        (this.isPerformerLeader || this.isPerformer)
      );
    },

    // lanh dao don vi tao
    isCreatedLeader() {
      const groupIds = this.findLeaderGroupIds;
      if (groupIds && groupIds.length > 0) {
        return groupIds.includes(this.detail.createGroupId);
      }

      return false;
    },
    isCreatedLeaderAndStatusProcessing() {
      return (
        this.isCreatedLeader && this.detail.status === definedStatus.processing
      );
    },
    isCreatedLeaderAndStatusForward() {
      return (
        this.isCreatedLeader && this.detail.status === definedStatus.forward
      );
    },
    isCreatedLeaderAndStatusWaitingReview() {
      return (
        this.isCreatedLeader &&
        this.detail.status === definedStatus.waiting_review
      );
    },
    isCreatedLeaderAndStatusWaitingClose() {
      return (
        this.isCreatedLeader &&
        this.detail.status === definedStatus.waiting_close
      );
    },
    isCreatedLeaderAndStatusResultApprove() {
      return (
        this.isCreatedLeader &&
        this.detail.status === definedStatus.result_approve
      );
    },
    isCreatedLeaderAndStatusRefuseClose() {
      return (
        this.isCreatedLeader &&
        this.detail.status === definedStatus.refuse_close
      );
    },

    // lanh dao don vi thuc hien
    isPerformerLeader() {
      const groupIds = this.findLeaderGroupIds;
      if (groupIds && groupIds.length > 0) {
        return groupIds.includes(this.detail.groupId);
      }

      return false;
    },
    isPerformerLeaderAndStatusProcessing() {
      return (
        this.isPerformerLeader &&
        this.detail.status === definedStatus.processing
      );
    },
    isPerformerLeaderAndStatusForward() {
      return (
        this.isPerformerLeader && this.detail.status === definedStatus.forward
      );
    },
    isPerformerLeaderAndStatusResultApprove() {
      return (
        this.isPerformerLeader &&
        this.detail.status === definedStatus.result_approve
      );
    },
    isPerformerLeaderAndStatusRefuseClose() {
      return (
        this.isPerformerLeader &&
        this.detail.status === definedStatus.refuse_close
      );
    },

    isGroup() {
      const result = this.findUserRoleDetailByGroupId(this.detail.groupId);
      return typeof result !== "undefined";
    },

    isGroupLeader() {
      const groupIds = this.findLeaderGroupIds;
      if (groupIds && groupIds.length > 0) {
        return groupIds.includes(this.detail.groupId);
      }

      return false;
    },
  },
};
