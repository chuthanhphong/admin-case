<template>
  <v-layout v-if="userInfo" class="list-customer" column>
    <v-layout align-center class="pl-4">
      <img
        v-if="userInfo.objectType === 'GROUP'"
        class="cursor-pointer"
        src="@/assets/icons/task/avatar-group.svg"
      >
      <v-avatar
        v-else
        :color="lstColors[index]"
        size="32"
      >
        <span class="white--text text-h6 text-uppercase">
          {{ renderAvatarText(userInfo.objectType === 'USER' ? userInfo.userFullName : userInfo.groupName ) }}
        </span>
      </v-avatar>
      <v-list-item class="pl-2">
        <v-list-item-content>
          <v-list-item-title>
            {{ renderCustomerName(userInfo) }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ renderCustomerInfo(userInfo) }}
          </v-list-item-subtitle>
          <v-list-item-subtitle class="text-ellipsis mw-290">
            <span>
              {{ renderCustomerContact(userInfo) }}
            </span>
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="userInfo.phone" class="d-flex align-center">
            <i class="app-icon icon-phone-call gray icon-size-12 mr-1"></i>
            {{ renderCustomerPhone(userInfo) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-layout>
    <v-divider height="2"></v-divider>
    <v-layout align-center class="my-2" justify-center>
      <v-btn class="text-capitalize" small>
        <i class="app-icon icon-message-circle gray mr-2"></i>
        {{ $t("tickets.labels.message") }}
      </v-btn>
    </v-layout>
  </v-layout>
</template>

<script>

import RenderInfoUser from "@/modules/etask/mixins/RenderInfoUser";

export default {
  mixins: [RenderInfoUser],
  props: {
    userInfo: {
      type: Object,
      default: undefined,
    },
    lstColors: {
      type: Array,
      default: undefined
    },
    index: {
      type: Number,
      default: undefined
    }
  },
  methods: {

  }
}
</script>
<style lang="css" scoped>
</style>
