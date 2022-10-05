<template>
  <div>
    <v-expansion-panels v-model="expanded" flat>
      <v-expansion-panel>
        <v-expansion-panel-header
          color="#00C3F9"
          text-color="#fff"
          class="rounded-0"
        >
          <v-layout justify-space-between>
            <v-layout align-center>
              <v-avatar
                color="white"
                size="30"
                class="align-center mr-1 pt-3 pb-2"
              >
                <div>
                  <img src="@/assets/icons/ic-link-detail.svg" alt="" />
                </div>
              </v-avatar>
              <div class="text-title">
                {{ $t("booking.screen-detail.listLink.title") }}
              </div>
              <!-- <v-btn icon class="ml-auto">
                <img src="@/assets/icons/ic-link-white.svg" alt="" />
              </v-btn> -->
            </v-layout>
          </v-layout>
          <template v-slot:actions>
            <v-icon color="white"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="overflow-y-auto pt-4">
          <v-list-item
            v-for="(it, index) in refers"
            :key="index"
            class="list-item mb-2"
          >
            <div class="d-flex align-center nowrap">
              <div class="d-flex flex-column justify-center div-avatar">
                <v-img
                  v-if="it.referType === 1"
                  src="@/assets/icons/task/createTask/document.svg"
                />
                <v-img
                  v-if="it.referType === 2"
                  src="@/assets/icons/task/createTask/ticket.svg"
                />
                <v-img
                  v-if="it.referType === 3"
                  src="@/assets/icons/task/createTask/work.svg"
                />
              </div>
              <div class="ml-2 mr-3 text-truncate">
                <span class="source-name pt-1">
                  ({{ it.sourceId }}) {{ it.sourceName }}
                </span>
              </div>
              <!-- <div
                class="
                  d-flex
                  no-wrap
                  justify-center
                  align-center
                  div-module
                  ml-auto
                "
              >
                <v-chip class="source-name" color="#CCF3FE">{{
                  it.status
                }}</v-chip>
                <div class="ic-delete">
                  <v-btn icon color="black">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </div> -->
            </div>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  props: {
    refers: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      expanded: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
.text-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #fff;
}
.list-item {
  height: 32px;
  border: 1px solid rgba(34, 36, 44, 0.05);
  border-radius: 8px;
  padding: 5px 10px 5px 10px;
  &:hover {
    .ic-delete {
      display: block;
    }
    background: rgba(34, 36, 44, 0.05);
  }
  .ic-delete {
    display: none;
  }
  .source-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #252733;
    align-items: center;
    white-space: nowrap;
  }
}
</style>
