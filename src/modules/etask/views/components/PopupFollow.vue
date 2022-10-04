<template>
  <v-layout column>
    <div class="list-customer pa-3">
      <div
        v-for="(item, ind) in items"
        :key="ind"
        class="list-item-customer pb-2"
      >
        <div class="d-flex align-center">
          <v-avatar
            size="32"
            :color="lstColors[1 % 5]"
          >
            <span class="white--text text-h6 text-uppercase">
              {{ renderAvatarText(item.fullName) }}
            </span>
          </v-avatar>
          <v-list-item class="pl-2">
            <v-list-item-content>
              <v-list-item-title>
                {{ renderCustomerName(item) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ renderCustomerInfo(item) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-ellipsis mw-290">
                <span>
                  {{ renderCustomerContact(item) }}
                </span>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="item.phone" class="d-flex align-center">
                <i class="app-icon icon-phone-call gray icon-size-12 mr-1"></i>
                {{ renderCustomerPhone(item) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </div>
      </div>
    </div>
  </v-layout>
</template>
<script>

export default {
  props: {
    items: {
      type: Array,
      default: undefined
    },
    lstColors: {
      type: Array,
      default: undefined
    }
  },
  methods: {
    renderAvatarText(customer) {
      return this.genAvatar(customer)
    },
    genAvatar(name) {
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua name.
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
}
</script>
<style lang="scss" scoped>
.total-customer {
  color: #9fa2b4;
}
</style>
