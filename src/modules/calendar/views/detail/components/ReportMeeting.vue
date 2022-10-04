<template>
  <v-expansion-panels v-model="expanded" class="my-3 rounded-0 no-z-index wrap__report-meeting">
    <v-expansion-panel class="rounded-0">
      <v-expansion-panel-header color="#00C3F9" class="rounded-0">
        <v-layout justify-space-between>
          <v-layout align-center>
            <v-avatar color="white" size="30" class="align-center mr-4">
              <i class="app-icon icon-information primary icon-size-22"></i>
            </v-avatar>
            <label class="name-title">
              {{ $t("calendar.detailMeeting.report-meeting") }}
            </label>
          </v-layout>
        </v-layout>
        <template v-slot:actions>
          <v-icon color="white"> $expand </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="pa-0">
        <!--<div
          v-for="(item, index) in listData"
          :key="index"
          class="d-flex align-center justify-space-between py-3"
          :class="index === listData.length - 1 ? '' : 'item-report-meeting'"
        >
          <div class="d-flex align-center" style="gap: 5px">
            <v-avatar
              size="32"
              color="#00C3F9"
            >
              <span class="text-uppercase white&#45;&#45;text">
                B
              </span>
            </v-avatar>
            <div>
              <div>
                <span>Vu Tien Anh (BaoTQ)</span>
              </div>
              <div>
                <span class="mr-1">{{ $t('calendar.detailMeeting.establishment') }}</span>
                <span>(30/09/2022 10:10)</span>
              </div>
            </div>
          </div>
          <div class="d-flex justify-space-between">
            <ul class="list-files mt-1">
              <li>Ten file hop dong</li>
            </ul>
          </div>
        </div>
        <div>
          <label class="title-follower">
            {{ $t("calendar.detailMeeting.follower") }}
          </label>
          <v-layout column>
            <v-autocomplete
              v-if="isUpdate"
              :items="listFollower"
              chips
              class="no-border"
              dense
              hide-details
              item-text="fullName"
              multiple
              outlined
              return-object
            >
              <template slot="append">
                <v-btn class="border-dashed" fab outlined x-small>
                  <i class="app-icon icon-user-plus darken icon-size-20"></i>
                </v-btn>
              </template>
              <template v-slot:selection="data">
                <v-chip
                  :input-value="data.selected"
                  close
                  v-bind="data.attrs"
                  @click="data.select"
                >
                  <v-avatar left>
                    <v-icon> mdi-account-circle </v-icon>
                  </v-avatar>
                  {{ data.item.fullName }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <v-list-item-avatar>
                  <v-icon color="primary"> mdi-account-circle </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="data.item.fullName"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="data.item.email"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-layout v-else class="py-2 ml-2 d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-layout v-for="(item, index) in selectedFollower" :key="index" column style="max-inline-size: max-content">
                  <v-chip
                    :color="listColor[index % 2]"
                    class="mx-2 my-2 short"
                  >
                    <v-avatar left>
                      <v-icon> mdi-account-circle </v-icon>
                    </v-avatar>
                    <span> {{ item.fullName }} </span>
                  </v-chip>
                </v-layout>
              </div>
              <v-btn class="border-dashed" fab outlined x-small>
                <i class="app-icon icon-user-plus darken icon-size-20"></i>
              </v-btn>
            </v-layout>
          </v-layout>
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
        {},
        {}
      ],
      listFollower: [
        {
          userId: 590,
          fullName: 'AnhVT',
          userName: 'phongnh7',
          email: 'phongnh7@bssd.vn'
        },
        {
          userId: 591,
          fullName: 'BaoTQ',
          userName: 'phongnh7',
          email: 'phongnh7@bssd.vn'
        }
      ],
      isUpdate: false,
      selectedFollower: [],
      listColor: ['#CCF3FE', '#DBDCF9']
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.selectedFollower = []
      this.selectedFollower = this.listFollower
    }
  }
}
</script>
<style scoped>

.item-report-meeting {
  border-bottom: 2px dashed #C1C9D2;
}

.title-follower {
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
  color: #252733;
  text-transform: capitalize;
  margin-left: 10px;
}

</style>
