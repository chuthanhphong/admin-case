<template>
  <div>
    <template v-for="(customer, index) in item.signProcessInfoDtos">
      <v-avatar
        v-if="index < 4 || (item.signProcessInfoDtos.length == 5 && index == 4)"
        :key="index"
        size="30"
        :color="lstColors[index % 5]"
        class="customer white--text"
        :style="`left: ${-8 * index}px`"
        @click="activeShowPopupCustomer(indexRow)"
      >
        <span class="text-uppercase">{{ renderAvatarText(customer) }}</span>
        <div class="customer-tooltip arrow-right">
          <div class="d-flex align-center">
            <v-avatar
              size="40"
              :color="lstColors[index % 5]"
              @click="activeShowPopupCustomer(indexRow)"
            >
              <span class="text-uppercase white--text">{{
                renderAvatarText(customer)
              }}</span>
            </v-avatar>
            <div class="d-flex flex-column pl-2 text-left">
              <b>{{ renderCustomerName(customer) }}</b>
              <span class="customer-contact">
                <span v-html="renderCustomerInfo(customer)" />
                <span v-html="renderCustomerContact(customer)" />
              </span>
            </div>
          </div>
        </div>
      </v-avatar>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: undefined
    },
    lstColors: {
      type: Array,
      default: undefined
    },
    indexRow: {
      type: Number,
      default: undefined
    }
  },
  methods: {
    activeShowPopupCustomer(index) {
      this.$emit('active-show-popup-customer', index)
    },
    renderAvatarText(customer) {
      return customer.signGroupName
        ? this.genAvatar(customer.signGroupName)
        : this.genAvatar(customer.signUserName)
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
      return customer.signGroupName
        ? customer.signGroupName
        : customer.signUserName
    },
    renderCustomerInfo(customer) {
      return customer.signGroupName ? customer.signUserName + '<br/>' : ''
    },
    renderCustomerContact(customer) {
      if (customer.email && customer.phone) {
        return customer.email + ' - ' + customer.phone
      }
      if (customer.email && !customer.phone) {
        return customer.email
      }
      if (!customer.email && customer.phone) {
        return customer.phone
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
