<template>
  <v-expansion-panels class="my-3 rounded-0 no-z-index wrap__report-meeting">
    <v-expansion-panel class="rounded-0">
      <v-expansion-panel-header color="#00C3F9" class="rounded-0">
        <v-layout justify-space-between align-center>
          <v-layout align-center>
            <v-btn fab x-small color="white" class="mr-3">
              <img src="@/assets/icons/calendar/history-active.png">
            </v-btn>
            <label class="name-title">
              {{ $t("calendar.detailMeeting.history-active") }}
            </label>
          </v-layout>
        </v-layout>
        <template v-slot:actions>
          <v-icon color="white"> $expand </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="mt-3">
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>

export default {
  data() {
    return {
    }
  }
}
</script>
<style scoped>

</style>
