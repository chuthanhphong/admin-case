<template>
  <v-fade-transition>
    <div
      v-show="activeIndex == index"
      class="wrap-popup-list-customer"
      :class="{ active: listShowPopup[index] }"
    >
      <div class="popup-list-customer">
        <div class="popup-header d-flex align-center justify-space-between">
          <span>
            {{ $t('contract.listOfCustomer') }}
            <span class="total-customer">
              ({{ item.signProcessInfoDtos.length }})
            </span>
          </span>
          <v-btn
            text
            icon
            class="btn-close-list-customer"
            @click="closePopupCustomer(index)"
          ><v-icon>mdi-close</v-icon></v-btn>
        </div>
        <v-divider class="my-1" />
        <div class="list-customer">
          <div
            v-for="(customer, itemIndex) in item.signProcessInfoDtos"
            :key="itemIndex"
            class="list-item-customer pb-2"
          >
            <div class="d-flex align-center">
              <v-avatar size="32" :color="lstColors[itemIndex % 5]">
                <span class="text-uppercase  white--text">{{
                  renderAvatarText(customer)
                }}</span>
              </v-avatar>
              <div
                class="d-flex flex-column pl-1 text-left list-item-customer-info"
              >
                <b>{{ itemIndex + 1 }}. {{ renderCustomerName(customer) }}</b>
                <span class="customer-contact">
                  <span v-html="renderCustomerInfo(customer)" />
                  <span v-html="renderCustomerContact(customer)" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-fade-transition>
</template>

<script>
export default {
  props: {
    activeIndex: {
      type: Number,
      default: undefined
    },
    index: {
      type: Number,
      default: undefined
    },
    listShowPopup: {
      type: Array,
      default: undefined
    },
    item: {
      type: Object,
      default: undefined
    },
    lstColors: {
      type: Array,
      default: undefined
    }
  },
  methods: {
    closePopupCustomer(index) {
      this.$emit('close-popup-customer', index)
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
        return `${customer.email + ' - ' + customer.phone}`
      }
      if (customer.email && !customer.phone) {
        return `${customer.email}`
      }
      if (!customer.email && customer.phone) {
        return `${customer.phone}`
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.total-customer {
  color: #9fa2b4;
}
</style>
