export default {
  methods: {
    getFirstCharacter(fullName) {
      if (!fullName) return ''
      if (parseInt(fullName.signProcessType) === 1 || fullName.fullName) {
        return this.genAvatar(fullName.fullName)
      }
      return this.genAvatar(fullName.positionName)
    },
    genAvatar(fullName) {
      if (!fullName) return ''
      if (fullName.includes('+')) return fullName
      if (fullName.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        const lastName = fullName.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return fullName[0].toUpperCase()
    },
    renderGroupName(fullName) {
      let text = fullName.positionName
      if (fullName.fullName) {
        text = fullName.fullName
      }
      return this.genGroupName(text)
    },
    genGroupName(text) {
      if (text.length > 20) {
        text = `${text.slice(0, 17)}...`
      }
      return text
    }
  }
}
