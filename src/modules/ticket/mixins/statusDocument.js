export default {
  methods: {
    viewDetail() {
      return `
      <div class="btn-action">
        <i class='v-icon notranslate mdi mdi-eye-outline'></i> 
        <span>${this.$t("document.tooltip.view")}</span>
      </div>`;
    },
    refuseApprove() {
      return `
      <div class="btn-action">
        <i class='v-icon notranslate mdi mdi-bookmark-remove-outline'></i> 
        <span>${this.$t("tickets.labels.refuse")}</span>
      </div>`;
    },
    closeRequest() {
      return `
      <div class="btn-action">
        <i class='v-icon notranslate mdi mdi-close-outline'></i> 
        <span>${this.$t("tickets.labels.ticket-close")}</span>
      </div>`;
    },
    waitingReview() {
      return `
      <div class="btn-action">
        <i class='v-icon notranslate mdi mdi-note-search-outline'></i> 
        <span>${this.$t("tickets.labels.review")}</span>
      </div>`;
    },
    waitingApprove() {
      return `
      <div class="btn-action">
        <i class='v-icon notranslate mdi mdi-bookmark-check-outline'></i> 
        <span>${this.$t("tickets.labels.approve")}</span>
      </div>`;
    },
  },
};
