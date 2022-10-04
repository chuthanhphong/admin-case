
export default {
  methods: {
    getPositionName(item) {
      if (item.positionName) {
        return `${item.roleName} - ${item.positionName}`
      }
      return item.roleName
    },
    getFullName(item) {
      if (item) {
        return `${item.fullName} (${item.userName})`
      }
    },
    genEmailAndPhone(item) {
      let text = `${item.email}`
      if (item.phone) {
        text += ` - ${item.phone}`
      }
      return text
    },
    getParentGroupName(group) {
      if (group.parentPathName) {
        const level = group.parentPathName.split('-')
        if (level.length > 1) {
          return group.parentPathName
        }
        return `${group.groupName} - ${group.parentPathName}`
      }
    }
  }
}
