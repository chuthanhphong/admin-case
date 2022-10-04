<template>
  <v-expansion-panels v-model="expanded" class="rounded-0 no-z-index">
    <v-expansion-panel class="rounded-0">
      <v-expansion-panel-header color="primary" class="rounded-0">
        <v-layout justify-space-between>
          <v-layout align-center>
            <v-btn fab x-small color="white" class="mr-3">
              <i class="app-icon icon-history primary"></i>
            </v-btn>
            <label class="text--subtitle-2 white--text">
              {{ $t("tickets.labels.history-activity") }}
            </label>
          </v-layout>
        </v-layout>
        <template v-slot:actions>
          <v-icon color="white"> $expand</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content
        class="scroll-expand-task-list overflow-y-auto rounded-0"
      >
        <ul>
          <li v-for="(item, i) in detail.ticketLogDtos" :key="i">
            <ItemHistoryViewList :item="item" :index="i" />
          </li>
        </ul>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import ItemHistoryViewList from "./ItemHistoryViewList";

export default {
  components: { ItemHistoryViewList },
  props: {
    detail: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      expanded: 0,
    };
  },
  computed: {},
  methods: {},
};
</script>
