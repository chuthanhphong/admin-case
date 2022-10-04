import { CalendarService } from '@/modules/calendar/services/calendarService'
export default {
  data() {
    return {
      // auto search Contact
      showFilterContact: false,
      selectedContact: null,
      tempContact: null,
      keywordTempContact: null
    }
  },
  watch: {
    //  chon phong hop
    selectedContact() {
      if (this.selectedContact == null) {
        return
      }
      var item = this.lstPointOfContact[this.selectedContact]
      if (item) {
        this.tempContact = item
      }
      this.pointOfContact = `${
        this.tempContact.fullName
      } (${this.genEmailAndPhone(this.tempContact)})`

      this.pointOfContactId = this.tempContact.userId
      this.closeFilterContact()
    }
  },
  methods: {
    clearContact() {
      this.pointOfContact = null
      this.pointOfContactId = null
    },
    // search danh sach phong hop
    async searchContact() {
      try {
        if (
          this.pointOfContact &&
          this.pointOfContact.trim() === this.keywordTempContact
        ) {
          return
        }
        this.keywordTempContact =
          this.pointOfContact && this.pointOfContact.trim()

        if (this.trimSpace(this.pointOfContact).length === 0) {
          this.ContactId = null
        }
        const params = {
          pageSize: 100000,
          keyword: this.pointOfContact
        }
        const result = await CalendarService.searchInternalExternalUser(params)
        if (result) {
          this.lstPointOfContact = result.data ? result.data : []
          this.showFilterContact = this.lstPointOfContact.length > 0
        }
      } catch (error) {
        console.log(error)
      }
    },

    selectContact() {
      this.keywordTempContact = null
      this.searchContact()
    },

    // nhap de tim kiem nguoi ky
    onInputSearchContact() {
      this.ContactId = ''
      this.selectedContact = null
      setTimeout(() => {
        this.searchContact()
      }, 200)
    },

    // close dialog show phong hop
    closeFilterContact() {
      setTimeout(() => {
        this.showFilterContact = false
      }, 200)
    }
  }
}
