<template>
  <div class="approver-section">
    <v-list-item color="transparent">
      <div class="d-flex nowrap" style="width: 100%">
        <div
          v-if="approver?.fullName?.length"
          class="d-flex flex-column justify-center div-avatar"
        >
          <v-avatar size="40px" color="primary">
            <img v-if="false" />
            <b v-else class="text-uppercase white--text">{{
              approver?.fullName[0]
            }}</b>
          </v-avatar>
        </div>
        <img v-else src="@/assets/icons/ic-company.svg" alt="" />
        <div v-if="approver?.fullName?.length" class="ml-2">
          <div class="title-full-name">
            {{ approver.fullName }} - {{ approver.positionName }}
          </div>
          <span v-if="approver.email" class="sub-title-approver">
            {{ approver.email }}
          </span>
          <div class="sub-title-approver">{{ approver.groupName }}</div>
        </div>
        <div v-else class="ml-2">
          <div class="title-full-name text-truncate mt-2">
            {{ approveGroupInfos[0]?.pathName }}
          </div>
          <!-- <span class="sub-title-approver">
            {{ approveGroupInfos[1]?.pathName }}
            {{ approveGroupInfos[2] ? "-" : "" }}
            {{ approveGroupInfos[2]?.pathName }}
          </span> -->
        </div>
        <div
          class="
            d-flex
            flex-column
            justify-center
            align-center
            div-module
            ml-auto
          "
        >
          <v-btn
            :color="
              isShowApprove
                ? getColorBtnByStatus(isStatus)
                : getColorBtnByStatus(2)
            "
            class="ml-auto white--text"
          >
            <v-avatar
              :color="
                isShowApprove
                  ? getColorDotByStatus(isStatus)
                  : getColorDotByStatus(2)
              "
              size="15"
              class="mr-1"
            >
            </v-avatar>
            <span
              class="text--overlined-1 text-transform-none text-center"
              :class="
                isShowApprove
                  ? getColorTextByStatus(isStatus)
                  : getColorTextByStatus(2)
              "
              v-html="
                isShowApprove ? getTextByStatus(isStatus) : getTextByStatus(2)
              "
            >
            </span>
          </v-btn>
        </div>
      </div>
    </v-list-item>
  </div>
</template>

<script>
import mixinStatusAndPriority from "@/modules/carbooking/mixins/mixinStatusAndPriority";

export default {
  mixins: [mixinStatusAndPriority],
  props: {
    approveGroupInfos: {
      type: Array,
      default: () => [],
    },
    approver: {
      type: Object,
      default: () => {},
    },
    isStatus: {
      type: Number,
      default: 1,
    },
    isShowApprove: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.title-full-name {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  align-items: center;
  color: #22242c;
}
.sub-title-approver {
  font-weight: 400;
  font-size: 12px;
  color: #22242c;
}
</style>
