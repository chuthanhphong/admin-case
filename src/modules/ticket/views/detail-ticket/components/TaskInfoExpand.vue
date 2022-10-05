<template>
  <v-expansion-panels v-model="expanded" class="rounded-0 no-z-index">
    <v-expansion-panel class="rounded-0">
      <v-expansion-panel-header class="rounded-0" color="primary">
        <v-layout justify-space-between>
          <v-layout align-center>
            <v-btn class="mr-3" color="white" fab x-small>
              <i class="app-icon icon-signature primary"></i>
            </v-btn>
            <label class="text--subtitle-2 white--text">
              {{ $t("tickets.labels.task-to-do") }}
            </label>
          </v-layout>
          <v-btn
            v-if="isShowBtnCreateTask"
            class="border-width-2 mr-2"
            color="white"
            fab
            outlined
            x-small
            @click.stop="onShowCreateTask"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-layout>
        <template v-slot:actions>
          <v-icon color="white"> $expand </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content
        class="scroll-expand-task-detail-ticket overflow-y-auto rounded-0"
      >
        <ul>
          <li v-for="(item, i) in detail.taskSourceMap.data" :key="i">
            <ItemTaskViewList
              :index="i"
              :item="item"
              @get-task-detail="getTaskDetail"
            />
          </li>
        </ul>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import ItemTaskViewList from "./ItemTaskViewList";
import mixinComputedState from "../mixins/mixinComputedState";

export default {
  components: { ItemTaskViewList },
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
      taskId: null,
      showDialogDetail: false,
      listActionsDetail: []
    };
  },
  computed: {
    isShowBtnCreateTask() {
      return (
        this.isPerformerAndStatusProcessing ||
        this.isPerformerAndStatusResultApprove ||
        this.isPerformerAndStatusRefuseClose ||
        this.isPerformerLeaderAndStatusProcessing ||
        this.isPerformerLeaderAndStatusResultApprove ||
        this.isPerformerLeaderAndStatusRefuseClose ||
        this.isAdminAndStatusProcessing ||
        this.isAdminAndStatusResultApprove ||
        this.isAdminAndStatusRefuseClose
      );
    },
  },
  watch: {
    taskId() {
      this.getTaskDetail(this.taskId);
    },
  },
  methods: {
    onShowCreateTask() {
      this.$emit("create-task");
    },

    async getTaskDetail(taskId) {
      this.$emit('get-task-detail', taskId);
    },
    showDialogDetailFromEmit(val) {
      this.showDialogDetail = val;
    },
    closeDialogDetail() {
      this.showDialogDetail = false;
    },
  },
};
</script>
