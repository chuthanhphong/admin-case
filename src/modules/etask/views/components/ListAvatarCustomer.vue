<template>
  <div>
    <template v-for="(customer, index) in items">
      <v-menu
        :key="index"
        open-on-hover
        top
        offset-y
        origin="left center"
        transition="scale-transition"
        max-width="360"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
            v-if="index < 4 || (items.length == 5 && index == 4)"
            size="30"
            :color="lstColors[index % 5]"
            class="customer white--text"
            :style="`left: ${-8 * index}px; ${customer.level === 1 ? 'background: #33CFFA; border-radius: 50%;' : ''}`"
            v-bind="attrs"
            v-on="on"
          >
            <img
              v-if="customer.level === 1"
              src="@/assets/icons/task/PersonAvatar.svg"
              class="cursor-pointer"
              v-bind="attrs"
              v-on="on"
            >
            <span
              v-if="customer.fullName && customer.level === 2"
              class="text-uppercase"
            >
              {{ renderAvatarText(customer.fullName) }}
            </span>
          </v-avatar>
        </template>
        <customer-info
          :color-avatar="lstColors[index % 5]"
          :user-info="customer"
        />
      </v-menu>
    </template>
  </div>
</template>
<script>

import CustomerInfo from '@/modules/etask/views/components/CustomerInfo'

export default {
  components: {
    CustomerInfo
  },
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
      if (!name) {
        return ''
      }
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua name.
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
    renderCustomerInfo(customer) {
      return customer.level === 1 ? customer.groupName + '<br/>' : customer.userName + '<br/>'
    },
    renderCustomerContact(customer) {
      return customer.level === 1 ? customer.groupPathName + '<br/>' : customer.fullName + '<br/>'
    }
  }
}
</script>

<style lang="scss" scoped></style>

