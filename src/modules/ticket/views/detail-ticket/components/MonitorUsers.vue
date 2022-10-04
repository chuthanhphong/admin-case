<template>
  <v-layout class="white mt-2 mb-4 px-4" column>
    <label class="text--label-3 ml-5">
      {{ $t("tickets.labels.follower") }}
    </label>
    <v-layout justify-space-between>
      <v-layout column>
        <v-autocomplete
          v-if="!isViewer"
          v-model="selectedFollower"
          :items="allUser"
          :no-data-text="$t('noData')"
          chips
          class="no-border"
          dense
          hide-details
          item-text="fullName"
          multiple
          outlined
          return-object
          @blur="onUpdateSelectedFollower"
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
              @click:close="removeFollower(data.item)"
            >
              <v-avatar left>
                <v-icon> mdi-account-circle </v-icon>
              </v-avatar>
              {{ data.item.fullName }}
            </v-chip></template>
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
        <v-layout v-else class="py-5 ml-2" row>
          <v-layout v-for="(item, index) in selectedFollower" :key="index" column style="max-inline-size: max-content">
            <!-- <v-chip
                v-for="(item, index) in selectedFollower"
                :key="index"
                class="mr-2"
              >
                <v-avatar left>
                  <v-icon> mdi-account-circle </v-icon>
                </v-avatar>
                {{ item.fullName }}
              </v-chip> -->
            <v-chip class="mx-2 my-2 short">
              <v-avatar left>
                <v-icon> mdi-account-circle </v-icon>
              </v-avatar>
              <span> {{ item.fullName }} </span>
            </v-chip>
          </v-layout>
        </v-layout>
      </v-layout>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default: undefined,
    },
    isViewer: {
      type: Boolean,
      default: undefined,
    },
    allUser: {
      type: Array,
      default: undefined,
    },
    isReload: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
    return {
      selectedFollower: [],
      selectedFollowerOrigin: [],
    };
  },
  computed: {
    hasAttributeMonitorUsers() {
      return typeof this.detail.monitorUsers !== "undefined";
    },
  },
  watch: {
    isReload(val) {
      if (val) {
        this.initData();
      }
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.selectedFollower = [];
      if (
        this.hasAttributeMonitorUsers &&
        this.detail.monitorUsers.length > 0
      ) {
        this.selectedFollower = [...this.detail.monitorUsers];
        this.selectedFollowerOrigin = [...this.detail.monitorUsers];
      }
      if (this.isReload) {
        this.$emit("update:isReload", false);
      }
    },
    removeFollower(item) {
      const userIds = this.selectedFollower.map((o) => {
        return o.userId;
      });
      const index = userIds.indexOf(item.userId);
      if (index >= 0) this.selectedFollower.splice(index, 1);
    },
    onUpdateSelectedFollower() {
      if (this.isUpdateSelectedFollower()) {
        const userIds = this.selectedFollower.map((o) => {
          return o.userId;
        });
        this.$emit("update-selected-follower", userIds.join(","));
      }
    },
    isUpdateSelectedFollower() {
      const currUserIds = this.selectedFollower.map((o) => {
        return o.userId;
      });
      const oriUserIds = this.selectedFollowerOrigin.map((o) => {
        return o.userId;
      });
      currUserIds.sort();
      oriUserIds.sort();
      var isSame =
        currUserIds.length === oriUserIds.length &&
        currUserIds.every((element, index) => {
          return element === oriUserIds[index];
        });
      return !isSame;
    },
  },
};
</script>
