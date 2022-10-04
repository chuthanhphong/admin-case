<template>
  <v-expansion-panels v-model="expanded" class="my-3 rounded-0 no-z-index wrap__report-meeting">
    <v-expansion-panel class="rounded-0">
      <v-expansion-panel-header color="#00C3F9" class="rounded-0">
        <v-layout justify-space-between align-center>
          <v-layout align-center>
            <v-btn fab x-small color="white" class="mr-3">
              <img src="@/assets/icons/calendar/link-schedule.png">
            </v-btn>
            <label class="name-title">
              {{ $t("calendar.detailMeeting.link-schedule") }}
            </label>
          </v-layout>
          <div class="mr-2">
            <i class="app-icon icon-link white"></i>
          </div>
        </v-layout>
        <template v-slot:actions>
          <v-icon color="white"> $expand </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="">
        <!--<div
          v-for="(item, index) in listData"
          :key="index"
          class="item-link">
          <i :class="item.icon"></i>
          <span>(012345) Con cai nit</span>
        </div>-->
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>

export default {
  data() {
    return {
      expanded: 0,
      listData: [
        {
          icon: 'icon-ticket'
        },
        {
          icon: 'icon-document'
        }
      ]
    }
  }
}
</script>
<style scoped lang="scss">

.item-link {
  display: flex;
  align-items: center;
  justify-content: left;
  border-radius: 10px;
  border: 1px solid #22242C;
  padding: 10px 5px;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #252733;
  letter-spacing: 0.02em;
  margin: 10px 0;

  & .icon-ticket:before {
    content: "";
    background: url(../../../../../assets/icons/calendar/icon-ticket.png)
    no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    width: 24px;
    height: 23px;
  }

  & .icon-document:before {
    content: "";
    background: url(../../../../../assets/icons/calendar/icon-document.png)
    no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    width: 24px;
    height: 23px;
  }

}

</style>
