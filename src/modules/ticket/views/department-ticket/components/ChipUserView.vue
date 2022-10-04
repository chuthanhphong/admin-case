<template>
  <v-layout class="pt-2 pl-2">
    <v-chip color="#CCF3FE" class="text--body" @click="onClickToggleChip">
      <v-avatar v-if="hasAttributeFullName" size="32" class="primary">
        {{ item.fullName[0] }}
      </v-avatar>
      <v-btn v-else class="border-dashed avatar-size-24" outlined fab>
        <i class="app-icon icon-personal icon-size-12" />
      </v-btn>

      <v-layout>
        {{ hasAttributeFullName ? item.fullName : "Chưa giao người thực hiện" }}
      </v-layout>
      <div>
        <span>({{ item.totalTicket }})</span>
      </div>
      <v-icon>{{ isActive ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
    </v-chip>
  </v-layout>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: undefined,
    },
    index: {
      type: Number,
      default: undefined,
    },
    activeIndexs: {
      type: Array,
      default: undefined,
    },
  },
  computed: {
    hasAttributeFullName() {
      return typeof this.item.fullName !== "undefined";
    },
    isActive() {
      return (
        this.activeIndexs.length > 0 && this.activeIndexs.includes(this.index)
      );
    },
  },
  methods: {
    onClickToggleChip() {
      this.$emit("on-click-toggle-chip", this.index);
    },
  },
};
</script>
