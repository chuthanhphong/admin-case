export default {
  data() {
    return {
      listShowPopup: [],
      activeIndex: null,
      lstColors: ['#FFAF2E', '#0FAFE4', '#4A50E2', '#F028A0', '#FF4A55']
    }
  },
  methods: {
    showPopup(index) {
      return this.listShowPopup[index]
    },
    activeShowPopupSigner(index) {
      if (this.activeIndex) {
        this.listShowPopup[this.activeIndex] = false
      }
      this.listShowPopup[index] = true
      this.activeIndex = index
    },
    closePopupSigner() {
      this.listShowPopup[this.activeIndex] = false
      this.activeIndex = null
    }
  }
}
