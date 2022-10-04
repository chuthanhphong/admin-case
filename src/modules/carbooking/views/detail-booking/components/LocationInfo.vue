<template>
  <v-layout column class="px-4 mb-4">
    <div class="d-flex p-4">
      <div class="d-flex flex-column">
        <img
          src="@/assets/icons/icon-departure.svg"
          class="app-icon light icon-size-20"
        />
        <img src="@/assets/icons/icon-dashed-line.svg" class="h-50" />
        <img
          src="@/assets/icons/icon-destination.svg"
          class="app-icon light icon-size-20"
        />
      </div>
      <div class="ml-6">
        <v-layout column>
          <span class="font-weight-bold fs-14">
            {{ formatHourView(detail?.startTime) }}
            {{ formatDateView(detail?.startTime) }}
          </span>
          <span class="grey2--text fs-12">
            {{ detail?.departure }}
          </span>
        </v-layout>
        <v-layout column class="pt-6">
          <span class="font-weight-bold fs-14">
            {{ formatHourView(detail?.endTime) }}
            {{ formatDateView(detail?.endTime) }}
          </span>
          <span class="grey2--text fs-12">
            {{ detail?.destination }}
          </span>
        </v-layout>
      </div>
    </div>
  </v-layout>
</template>

<script>
import { formatDate } from "@/modules/carbooking/helpers/bookingUtils";

export default {
  components: {},
  props: {
    detail: {
      type: Object,
      default: undefined,
    },
  },
  methods: {
    formatDateView(date) {
      return formatDate(date, "DD/MM/YYYY");
    },
    formatHourView(date) {
      return formatDate(date, "HH:mm");
    },
  },
};
</script>
