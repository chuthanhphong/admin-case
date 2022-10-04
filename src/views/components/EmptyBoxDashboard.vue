<template>
  <div class="text-center empty-box">
    <div v-if="loading">
      <v-progress-circular
        indeterminate
        :size="35"
        :width="1"
        color="primary"
      />
    </div>
    <div v-else>
      <div class="empty-title text--subtitle">{{ $t("empty.data") }}</div>
      <p v-if="showSubtitle" class="empty-note text--caption">
        {{ $t(subtitle) }}
      </p>
      <v-img contain src="@/assets/imgs/empty.svg" max-width="100%" />
      <v-btn
        v-if="showActionCreate"
        rounded
        class="text--button"
        color="#6160DC"
        :to="linkCreate"
      >
        <span class="white--text">{{ $t(titleBtnCreate) }}</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
import econtractRoute from "@/modules/econtract/router/routePaths";
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    showSubtitle: {
      type: Boolean,
      default: true,
    },
    subtitle: {
      type: String,
      default: "empty.note",
    },
    linkCreate: {
      type: String,
      default: `${econtractRoute.CREATE_CONTRACT_PATH}`,
    },
    titleBtnCreate: {
      type: String,
      default: "contract.create",
    },
    showActionCreate: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped></style>
