<template>
  <v-layout column>
    <v-layout justify-space-between class="py-3 pl-4 pr-3">
      <h5 class="text-capitalize">
        {{ $t("tickets.labels.view-setting") }}
      </h5>
      <v-icon @click="closeDialog">mdi-close</v-icon>
    </v-layout>
    <v-divider class="mb-4"></v-divider>
    <v-layout v-if="items" column class="overflow-y-auto px-6 pb-2">
      <!-- NGUOI TAO   -->
      <ItemDisplaySetting
        v-for="(item, index) in items"
        :key="index"
        :item="item"
      />
    </v-layout>
  </v-layout>
</template>
<script>
// components
import ItemDisplaySetting from "./ItemDisplaySetting.vue";

export default {
  components: { ItemDisplaySetting },
  props: {
    items: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
};
</script>
