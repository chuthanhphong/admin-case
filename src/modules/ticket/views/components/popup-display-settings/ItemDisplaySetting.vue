<template>
  <v-sheet outlined rounded="lg" class="mb-3 px-3 py-2">
    <v-layout justify-space-between align-center>
      <div class="d-flex">
        <i class="app-icon" :class="item.icon"></i>
        <div class="ml-2">{{ $t(item.text) }}</div>
      </div>
      <v-switch
        v-model="item.active"
        inset
        class="mt-0 pt-0"
        hide-details
      ></v-switch>
    </v-layout>
  </v-sheet>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: undefined,
    },
  },
};
</script>
