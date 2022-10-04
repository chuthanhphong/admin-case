import constants from "@/modules/etask/constants";

export default {
  data() {
    return {}
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
      return customer.objectType === constants.OBJECT_TYPE.USER ? `${customer.userFullName}` : `${customer.groupName}`
    },
    renderCustomerInfo(customer) {
      if (customer.email) {
        return customer.objectType === constants.OBJECT_TYPE.USER ? `${customer.username + ' - ' + customer.email}` : ''
      }
    },
    renderCustomerContact(customer) {
      return customer.objectType === constants.OBJECT_TYPE.USER ? `${customer.positionName + ' - ' + customer.groupName}` : `${customer.groupPathName}`
    },
    renderCustomerPhone(customer) {
      if (customer.phone) {
        return customer.objectType === constants.OBJECT_TYPE.USER ? `${customer.phone}` : ''
      }
    }
  }
}
