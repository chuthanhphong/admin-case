<template>
  <v-layout v-if="userInfo" class="list-customer" column>
    <v-layout align-center class="pl-4">
      <img
        v-if="userInfo.level === 1"
        class="cursor-pointer"
        src="@/assets/icons/task/PersonAvatar.svg"
      >
      <v-avatar
        v-else
        :color="colorAvatar"
        size="32"
      >
        <span class="white--text text-h6 text-uppercase">
          {{ renderAvatarText(userInfo.fullName ? userInfo.fullName : userInfo.userFullName) }}
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
export default {
  props: {
    userInfo: {
      type: Object,
      default: undefined,
    },
    colorAvatar: {
      type: String,
      default: undefined
    }
  },
  methods: {
    renderAvatarText(customer) {
      return this.genAvatar(customer)
    },
    genAvatar(name) {
      if (!name) return ''
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        name = name.replaceAll(' ', ' ').trim()
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
    renderCustomerName(customer) {
      return customer.level === 2 ? `${customer.fullName}` : `${customer.groupName}`
    },
    renderCustomerInfo(customer) {
      if (customer.email) {
        return customer.level === 2 ? `${customer.userName + ' - ' + customer.email}` : ''
      }
    },
    renderCustomerContact(customer) {
      return customer.level === 2 ? `${customer.position + ' - ' + customer.groupName}` : `${customer.groupPathName}`
    },
    renderCustomerPhone(customer) {
      if (customer.phone) {
        return customer.level === 2 ? `${customer.phone}` : ''
      }
    }
  }
};
</script>
<style lang="css" scoped>
</style>
