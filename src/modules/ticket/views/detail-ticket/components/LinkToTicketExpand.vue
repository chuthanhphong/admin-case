<template>
  <v-expansion-panels v-model="expanded" class="rounded-0 no-z-index">
    <v-expansion-panel class="rounded-0">
      <v-expansion-panel-header color="primary" class="rounded-0">
        <v-layout justify-space-between>
          <v-layout align-center>
            <v-btn fab x-small color="white" class="mr-3">
              <i class="app-icon icon-link primary"></i>
            </v-btn>
            <label class="text--subtitle-2 white--text">
              {{ $t("tickets.labels.link-to-ticket") }}
            </label>
          </v-layout>
          <v-btn
            v-if="isShowBtnCreateLinkTicket"
            fab
            outlined
            x-small
            color="white"
            class="border-width-2 mr-2"
            @click.stop="onShowSourceTask"
          >
            <v-icon>mdi-link-variant</v-icon>
          </v-btn>
        </v-layout>
        <template v-slot:actions>
          <v-icon color="white"> $expand</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content
        class="scroll-expand-task-list overflow-y-auto rounded-0"
      >
        <v-list>
          <div v-for="(item, i) in detail.taskSourceMap.data" :key="i" class="mt-2">
            <ItemLinkRequestTicketViewList :item="item" :index="i" />
          </div>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import ItemLinkRequestTicketViewList from "./ItemLinkRequestTicketViewList";
import mixinComputedState from "../mixins/mixinComputedState";
import { mapState } from "vuex";

export default {
  components: { ItemLinkRequestTicketViewList },
  mixins: [mixinComputedState],
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
  computed: {
    ...mapState("layout", ["userInfo"]),
    // hasLinkSourceMap() {
    //   return this.detail.taskSourceMap.data.length > 0;
    // },
    isShowBtnCreateLinkTicket() {
      return (
        this.isPerformerAndStatusProcessing ||
        this.isPerformerAndStatusResultApprove ||
        this.isPerformerAndStatusRefuseClose ||
        this.isPerformerLeaderAndStatusProcessing ||
        this.isPerformerLeaderAndStatusResultApprove ||
        this.isPerformerLeaderAndStatusRefuseClose
      );
    },
  },
  methods: {
    onShowSourceTask() {
      this.$emit("list-link-to");
    },
  },
};
</script>
