import { definedRoleCodes } from "@/modules/ticket/helpers/ticketUtils";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("layout", ["userInfo"]),
    findAdminGroupIds() {
      const results = this.userInfo.userRoleDetails.filter(
        (x) => x.roleCode === definedRoleCodes.admin
      );
      if (results && results.length > 0) {
        return results.map((item) => {
          return item.groupId;
        });
      }

      return [];
    },
    findLeaderGroupIds() {
      const results = this.userInfo.userRoleDetails.filter(
        (x) => x.roleCode === definedRoleCodes.ld
      );
      if (results && results.length > 0) {
        return results.map((item) => {
          return item.groupId;
        });
      }

      return [];
    },
    findRoleNotificationGroupIds() {
      const results = this.userInfo.userRoleDetails.filter(
        (x) => x.roleCode === definedRoleCodes.ld ||
        x.roleCode === definedRoleCodes.gd ||
        x.roleCode === definedRoleCodes.admin
      );
      if (results && results.length > 0) {
        return results.map((item) => {
          return item.groupId;
        });
      }

      return [];
    },
  },
  methods: {
    findUserRoleDetailByGroupId(id) {
      return this.userInfo.userRoleDetails.find(
        (x) => x.groupId === id
      );
    }
  },
};
