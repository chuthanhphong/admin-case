<template>
  <v-main>
    <router-view />
    <dashboard-core-footer />
    <base-material-snackbar
      v-model="notify.show"
      :type="notify.type"
      :show-icon="notify.showIcon || true"
      v-bind="{
        top: true,
        right: true,
      }"
    >
      <div
        v-if="typeof notify.key === 'undefined'"
        v-html="$t(notify.content)"
      />
      <div v-else v-html="notify.content" />
    </base-material-snackbar>
  </v-main>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "DashboardCoreView",
  components: {
    DashboardCoreFooter: () => import("./Footer"),
  },
  computed: { ...mapState("layout", ["notify"]) },
  methods: {
    ...mapActions("layout", ["setNotify"]),
  },
};
</script>
