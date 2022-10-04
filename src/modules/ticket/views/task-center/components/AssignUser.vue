<template>
  <v-layout column>
    <v-layout justify-center align-center class="px-4 mt-2">
      <label class="text-body-1 mr-2 darken--text">
        {{ $t("assigned-to") }}:
      </label>
      <v-text-field
        v-model="txtSearchUser"
        hide-details
        class="pt-0 mt-0"
        @input="filterUserByText"
      ></v-text-field>
    </v-layout>
    <v-divider></v-divider>
    <v-list class="overflow-y-auto" max-height="50vh">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        @click="bindSelectedUser(item)"
      >
        <v-list-item-avatar>
          <v-icon color="primary"> mdi-account-circle </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.fullName }}
            <span v-if="isShowMe(item.userId, index)">
              ({{ $t("tickets.labels.me") }})
            </span>
          </v-list-item-title>
          <v-list-item-subtitle v-html="item.email"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    usersByGroupId: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      selectedUser: null,
      txtSearchUser: "",
      items: [],
    };
  },
  computed: {
    ...mapState("layout", ["userInfo"]),
  },
  watch: {
    usersByGroupId(val) {
      this.items = val;
    },
  },
  created() {
    this.items = this.usersByGroupId;
  },
  methods: {
    bindSelectedUser(val) {
      this.selectedUser = val;
      this.$emit("assign-to", val);
    },
    filterUserByText(val) {
      this.items = this.usersByGroupId.filter((user) => {
        return user.fullName.toLowerCase().indexOf(val) !== -1; // returns true or false
      });
    },
    isShowMe(userId, index) {
      return userId === this.userInfo.userId && index === 0;
    },
  },
};
</script>
