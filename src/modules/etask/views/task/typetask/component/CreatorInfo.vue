<template>
  <v-layout v-if="userInfo" column class="list-customer">
    <v-layout align-center class="pl-4">
      <v-avatar
        color="#0FAFE4"
        size="32"
      >
        <span class="white--text text-h6 text-uppercase">
          {{ renderAvatarText(userInfo.fullName) }}
        </span>
      </v-avatar>
      <v-list-item class="pl-2">
        <v-list-item-content>
          <v-list-item-title>
            {{ userInfo.fullName }}
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
    <v-layout justify-center align-center class="my-2">
      <v-btn small class="text-capitalize">
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
    renderCustomerInfo(customer) {
      if (customer.email) {
        return `${customer.username + ' - ' + customer.email}`
      }
    },
    renderCustomerContact(customer) {
      if (customer.position && customer.groupPathName) {
        return `${customer.position + ' - ' + customer.groupPathName}`
      }
    },
    renderCustomerPhone(customer) {
      if (customer.phone) {
        return `${customer.phone}`
      }
    }
  }
};
</script>
<style lang="css" scoped>
</style>
