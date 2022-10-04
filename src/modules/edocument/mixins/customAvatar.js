export default {
  methods: {
    getFirstCharacter(signer) {
      if (!signer) return ''
      if (parseInt(signer.signProcessType) === 1 || signer.fullName) {
        return this.genAvatar(signer.fullName)
      }
      return this.genAvatar(signer.positionName)
    },
    genAvatar(name) {
      if (!name) return ''
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
    renderGroupName(signer) {
      let text = signer.positionName
      if (signer.fullName) {
        text = signer.fullName
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
