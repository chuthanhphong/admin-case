export default {
  data() {
    return {
      listParticipateShowPopup: [],
      activeParticipateIndex: null,
      lstColors: ["#FFAF2E", "#0FAFE4", "#4A50E2", "#F028A0", "#FF4A55"],
    };
  },
  methods: {
    showPopup(index) {
      return this.listParticipateShowPopup[index];
    },
    activeShowPopupParticipateSigner(index) {
      if (this.activeParticipateIndex) {
        this.listParticipateShowPopup[this.activeParticipateIndex] = false;
      }
      this.listParticipateShowPopup[index] = true;
      this.activeParticipateIndex = index;
    },
    closePopupParticipateSigner() {
      this.listParticipateShowPopup[this.activeParticipateIndex] = false;
      this.activeParticipateIndex = null;
    },
  },
};
