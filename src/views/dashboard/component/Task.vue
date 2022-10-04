<template>
  <div>
    <v-card v-if="loading" color="white" light outlined>
      <v-card-text class="text-center py-5">
        <v-avatar size="40" color="primary">
          <img src="@/assets/icons/hourglass.svg" alt="" />
        </v-avatar>
        <div class="primary--text text-center text--body-1 py-1">
          {{ $t("processing") }}
        </div>
        <v-progress-linear
          stream
          buffer-value="0"
          color="primary"
          class="mb-0"
        />
      </v-card-text>
    </v-card>
    <div v-else>
      <tab-dashboard
        :active-perform="$t('menubar.ticket-manager.ticket-handle')"
        :active-create="$t('menubar.econtract.deliver')"
        :is-active-perform="isActivePerform"
        :is-active-create="isActiveCreate"
        @onICreateClick="onICreateClick"
        @onIPerformClick="onIPerformClick"
      />
      <div>
        <doughnut-chart
          v-show="isActivePerform"
          :data-labels="labels"
          :data-color="colors"
          :data-series="taskPerform"
          :list-action="listActionPerform"
        />
        <doughnut-chart
          v-show="isActiveCreate"
          :data-labels="labels"
          :data-color="colors"
          :data-series="taskAssign"
          :list-action="listActionAssign"
        />
      </div>
      <div class="static">
        <div class="text-link" @click="goToPerformPage(isActivePerform ? 'I_PERFORM' : 'I_ASSIGN', isActivePerform ? 1 : 3)">
          {{
            isActivePerform
              ? $t("gloabal-dashboard.label.received-unprocess")
              : $t("task-manager.status.my-approve")
          }}
          <div class="number">
            {{ isActivePerform ? unaccomplishedTask : approveTask }}
          </div>
        </div>
        <div class="line-row"></div>
        <div class="text-link" @click="goToPerformPage(isActivePerform ? 'I_PERFORM' : 'I_ASSIGN', 2)">
          {{ $t("gloabal-dashboard.label.expired") }}
          <div class="number" :style="colorExpiredTask(isActivePerform ? expiredPerform : expiredAssign)">
            {{ isActivePerform ? expiredPerform : expiredAssign }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DoughnutChart from "@/views/components/DoughnutChart.vue";
import TabDashboard from "@/views/components/TabDashboard.vue";
import { TaskService } from "@/modules/etask/services/taskService";
import constants from "@/constants";

export default {
  components: {
    DoughnutChart,
    TabDashboard,
  },

  data() {
    return {
      isActivePerform: true,
      isActiveCreate: false,
      loading: true,
      taskPerform: [],
      taskAssign: [],
      unaccomplishedTask: 0,
      approveTask: 0,
      expiredAssign: 0,
      expiredPerform: 0,
      colors: ["#FFB74A", "#00C3F9"],
      labels: [
        this.$t("task-manager.status.unfinished"),
        this.$t("task-manager.status.finished"),
      ],
    };
  },

  computed: {
    listActionPerform() {
      return [
        () => this.goToPages('I_PERFORM', 8),
        () => this.goToPages('I_PERFORM', 5),
      ]
    },
    listActionAssign() {
      return [
        () => this.goToPages('I_ASSIGN', 8),
        () => this.goToPages('I_ASSIGN', 5),
      ]
    }
  },

  created() {
    const user = JSON.parse(localStorage.getItem(constants.USER_INFO));
    const checkGD = user.roles.includes('GD') || user.roles.includes('LD');

    this.isActivePerform = !checkGD;
    this.isActiveCreate = checkGD;

    this.getTaskDashboard();
  },

  methods: {
    onIPerformClick() {
      this.isActiveCreate = false;
      this.isActivePerform = !this.isActivePerform;
    },

    onICreateClick() {
      this.isActivePerform = false;
      this.isActiveCreate = !this.isActiveCreate;
    },

    async getTaskDashboard() {
      try {
        const res = await TaskService.getTaskDashboard();
        this.setDataPerform(res.data.taskPerform);
        this.setDataAssign(res.data.taskAssign);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    setDataPerform(data) {
      this.taskPerform.push(data.unfinishedTask);
      this.taskPerform.push(data.finishedTask);
      this.unaccomplishedTask = data.unaccomplishedTask;
      this.expiredPerform = data.expiredTask;
    },

    setDataAssign(data) {
      this.taskAssign.push(data.unfinishedTask);
      this.taskAssign.push(data.finishedTask);
      this.approveTask = data.approveTask;
      this.expiredAssign = data.expiredTask;
    },

    goToPerformPage(name, key) {
      this.$router.push({ name: name, params: { key: key }})
    },

    colorExpiredTask(number) {
      return number ? 'color: red;' : '';
    },

    goToPages(name, key) {
      this.$router.push({
        name: name,
        params: { key: key }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.text-link {
  width: 100%;
  text-align: center;

  &:hover {
    color: #0fafe4 !important;

    & div {
      color: #0fafe4 !important;
    }
  }
}
</style>
