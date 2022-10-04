import { normalizeString } from '@/helpers/utils'

export default {
  methods: {
    filterItems(item, queryText, itemText) {
      if (queryText === null || queryText.length === 0) {
        return true
      }
      return (
        itemText &&
        itemText.length > 0 &&
        normalizeString(itemText).includes(normalizeString(queryText))
      )
    },
    resetSigner() {
      this.signer.userId = ''
      this.signer.name = ''
      this.signer.phone = ''
      this.signer.email = ''
      this.$emit('reset-signatures')
    },
    trimSpace(val) {
      const value = val ? val.toString().trim() : ''
      return value
    },
    updateName(name) {
      this.signer.name = this.trimSpace(name)
      this.$emit('reset-signatures')
    },
    updateFullName(fullName) {
      this.signer.fullName = this.trimSpace(fullName)
      this.signer.name = this.signer.fullName
      this.$emit('reset-signatures')
    },
    updateEmail(email) {
      this.signer.email = this.trimSpace(email)
      this.$emit('reset-signatures')
    },
    updatePhone(phone) {
      this.signer.phone = this.trimSpace(phone)
      this.$emit('reset-signatures')
    }
  }
}
