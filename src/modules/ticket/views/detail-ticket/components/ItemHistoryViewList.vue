<template>
  <v-layout v-if="item" column>
    <v-layout align-center>
      <label class="text--overlined-2 mr-7 gray--text">
        {{ formatDateView }}
      </label>
      <label class="text--body-5 darken--text">
        {{ item.createdByName }}
      </label>
    </v-layout>
    <label class="text--overlined darken--text">
      {{ item.note }}
    </label>
  </v-layout>
</template>

<script>
import {
  formatDateLocal,
  FORMAT_DATE_TIME_TICKET,
} from "@/modules/ticket/helpers/ticketUtils";

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
  },
  computed: {
    formatDateView() {
      return formatDateLocal(this.item.createdDate, FORMAT_DATE_TIME_TICKET);
    },
  },
};
</script>
