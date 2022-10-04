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
        :active-create="$t('menubar.econtract.created')"
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
        />
        <doughnut-chart
          v-show="isActiveCreate"
          :data-labels="labels"
          :data-color="colors"
          :data-series="taskCreate"
        />
      </div>
      <div class="static">
        <div
          v-show="isActivePerform && outOfDate != undefined"
          class="text-link"
          @click="goDetail"
        >
          {{ $t("gloabal-dashboard.label.expired") }}
          <div class="number">
            {{ outOfDate }}
          </div>
        </div>
        <div v-show="isActivePerform" class="line-row"></div>

        <div
          v-show="(isActivePerform && refusedClose !== undefined) || (!isActivePerform && closeWaiting != undefined)"
          class="text-link"
          @click="goDetail"
        >
          {{
            isActivePerform
              ? $t("gloabal-dashboard.label.refused-close")
              : $t("gloabal-dashboard.label.close-waiting")
          }}
          <div class="number">
            {{ isActivePerform ? refusedClose : closeWaiting }}
          </div>
        </div>

        <div
          v-show="(isActivePerform && myApprove !== undefined) ||(!isActivePerform && reviewWaiting != undefined)"
          class="line-row"
        ></div>
        <div
          v-show="(isActivePerform && myApprove !== undefined) ||(!isActivePerform && reviewWaiting != undefined)"
          class="text-link"
          @click="goDetail"
        >
          {{
            isActivePerform
              ? $t("gloabal-dashboard.label.my-approve")
              : $t("gloabal-dashboard.label.send-approve")
          }}
          <div class="number">
            {{ isActivePerform ? myApprove : reviewWaiting }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DoughnutChart from "@/views/components/DoughnutChart.vue";
import TabDashboard from "@/views/components/TabDashboard.vue";
import { TicketService } from "@/modules/ticket/services/ticketService";
import ticketRoute from "@/modules/ticket/router/routePaths";

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
      taskCreate: [],

      outOfDate: 0,
      refusedClose: 0,
      closeWaiting: 0,
      myApprove: 0,
      reviewWaiting: 0,

      colors: ["#FF4A55", "#FFB74A", "#00C3F9", "#F028A0", "#8E8EA1"],
      labels: [
        this.$t("task-manager.status.complete.outOfDate"),
        this.$t("tickets.status-by.undue"),
        this.$t("tickets.status-by.closed"),
        this.$t("tickets.status-by.cancelled"),
        this.$t("electronicSign.docState.draft"),
      ],
    };
  },

  created() {
    this.getTicketDashboard();
  },

  methods: {
    goDetail() {
      if (this.isActivePerform) {
        this.$router.push(`${ticketRoute.MY_PERFORM_TICKET_PATH}`);
      }
    },

    onIPerformClick() {
      this.isActiveCreate = false;
      this.isActivePerform = !this.isActivePerform;
    },

    onICreateClick() {
      this.isActivePerform = false;
      this.isActiveCreate = !this.isActiveCreate;
    },

    async getTicketDashboard() {
      try {
        const res = await TicketService.getTicketDashboard();
        this.setDataPerform(res.data.statsCurrentUser);
        this.setDataCreate(res.data.statsCurrentCreateUser);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    setDataPerform(data) {
      this.taskPerform.push(data.countOverDue);
      this.taskPerform.push(data.countNotDue);
      this.taskPerform.push(data.countClosed);
      this.outOfDate = data.countOverDue;
      this.refusedClose = data.countRejectClose;
      this.myApprove = data.countApproveOfMe;
    },

    setDataCreate(data) {
      this.taskCreate.push(data.countOverDue);
      this.taskCreate.push(data.countNotDue);
      this.taskCreate.push(data.countClosed);
      this.taskCreate.push(data.countCanceled);
      this.taskCreate.push(data.countDraft);
      this.closeWaiting = data.countWaitClosed;
      this.reviewWaiting = data.countSendApprove;
    },
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
