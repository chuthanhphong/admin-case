<template>
  <div class="row piechart-content col-12 ma-0 pa-0">
    <div class="col-12 col-md-4">
      <div class="pie-chart-request pt-6 pl-6">
        <doughnut
          v-if="(listCurrentCreate.unfinishedTask + listCurrentCreate.finishedTask) !== 0"
          :chart-data="createPieChartData"
          :chart-options="pieChartOptions"
          :plugins="pieChartPlugin"
        />
        <div v-else class="doughnut-nodata">
          <div class="doughnut-total">
            <span class="title-nodata">{{ $t("dashboards.total") }}</span>
            <div class="sum-nodata">0</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-8 my-request-chart">
      <v-layout align-center>
        <div class="row d-flex align-center" @click="listCurrentCreate.event1()">
          <div class="col-12 col-md-4 text-left text-link">
            <v-avatar color="yellow-ff" size="15" class="mr-1"></v-avatar>
            <span :class="getColorTextByStatus(2)">
              {{ $t("task-manager.dashboard-task.unfinished") }}
            </span>
          </div>
          <div class="col-12 col-md-6">
            <v-progress-linear
              v-if="listCurrentCreate.unfinishedTask !== 0"
              height="10"
              rounded
              color="#ffaf2e"
              :value="calcPercentLine(listCurrentCreate.unfinishedTask, listCurrentCreate.finishedTask)"
            >
            </v-progress-linear>
            <v-progress-linear
              v-else
              height="10"
              rounded
              :value="0"
              color="#c4c4c4"
            >
            </v-progress-linear>
          </div>
          <div class="col-12 col-md-2 text-left">
            <span>{{ listCurrentCreate.unfinishedTask }}</span>
          </div>
        </div>
      </v-layout>
      <v-layout align-center>
        <div class="row d-flex align-center" @click="listCurrentCreate.event2()">
          <div class="col-12 col-md-4 text-left text-link">
            <v-avatar
              :color="getColorDotByStatus(10)"
              size="15"
              class="mr-1"
            ></v-avatar>
            <span :class="getColorTextByStatus(10)">
              {{ $t("task-manager.dashboard-task.complete") }}
            </span>
          </div>
          <div class="col-12 col-md-6">
            <v-progress-linear
              v-if="listCurrentCreate.finishedTask !== 0"
              height="10"
              rounded
              color="#0fafe4"
              :value="calcPercentLine(listCurrentCreate.finishedTask, listCurrentCreate.unfinishedTask)"
            >
            </v-progress-linear>
            <v-progress-linear
              v-else
              height="10"
              rounded
              :value="0"
              color="#c4c4c4"
            >
            </v-progress-linear>
          </div>
          <div class="col-12 col-md-2 text-left">
            <span>{{ listCurrentCreate.finishedTask }}</span>
          </div>
        </div>
      </v-layout>
      <div class="row col-12">
        <div class="col-12 col-md-4"></div>
        <div class="row col-12 col-md-11 request-statistic">
          <div class="col-12 col-md-6 text-link" @click="listCurrentCreate.event3()">
            <b>{{ $t(isLd ? 'task-manager.dashboard-task.unfulfilled' : 'task-manager.dashboard-task.pending') }}</b>
            <h4>{{ (isLd ? listCurrentCreate.unaccomplishedTask : listCurrentCreate.approveTask) || 0 }}</h4>
          </div>
          <v-divider vertical />
          <div class="col-12 col-md-6 text-link" @click="listCurrentCreate.event4()">
            <b>{{ $t("task-manager.dashboard-task.outOfDate") }}</b>
            <h4 :style="colorExpiredTask(listCurrentCreate.expiredTask)">
              {{ listCurrentCreate.expiredTask || 0 }}
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import mixinActions from "../mixins/mixinActions";
import { Doughnut } from "vue-chartjs/legacy";

export default {
  name: "PiechartContent",
  components: {
    Doughnut,
  },
  mixins: [mixinStatusAndPriority, mixinActions],
  props: {
    createPieChartData: {
      type: Object,
      default: () => {},
    },
    pieChartOptions: {
      type: Object,
      default: () => [],
    },
    listCurrentCreate: {
      type: Object,
      default: () => {},
    },
    pieChartPlugin: {
      type: Array,
      default: () => [],
    },
    isLd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  }
};
</script>

<style lang="scss" scoped>
@mixin bar($bgColor) {
  background-color: $bgColor;
  height: 10px;
  font-size: 8px;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e7ecf1;
  padding: 20px 12px;
  .request-status {
    display: flex;
    gap: 20px;
  }
}
.pie-chart-request {
  width: 205px;
  @media (max-width: 1336px) {
    width: 150px;
  }
  @media (max-width: 960px) {
    width: 70%;
    margin: 0 auto;
  }
}
.user-list-request {
  .status-bar {
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    .overdue-bar {
      @include bar(#ff1d1d);
    }
    .notdue-bar {
      @include bar(#ffaf2e);
    }
    .closed-bar {
      @include bar(#00c3f9);
    }
    .cancelled-bar {
      @include bar(#f028a0);
    }
  }
}
.my-request-chart {
  display: grid;
  align-items: center;
  gap: 10px;
}
.request-statistic {
  border: 1px dashed #4e5056;
  border-radius: 8px !important;
}
.tree-unit {
  height: calc(100vh - 650px) !important;
  overflow-y: auto !important;
}
.text-link {
  cursor: pointer;

  & :hover {
    opacity: 0.7;
  }
}
.doughnut-nodata {
  width: 176px;
  height: 176px;
  border-radius: 50%;
  border: 20px solid #8e8ea1;
  display: flex;
  align-items: center;
  .doughnut-total {
    width: 84.14px;
    height: 84.14px;
    padding: 16px;
    margin: auto;
    border-radius: 50%;
    background: #FFFFFF;
    text-align: center;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    .title-nodata {
      color: #BABEC6;
      font-size: 14px;
    }
    .sum-nodata {
      margin-top: -10px;
      color: #22242C;
      font-size: 20px;
      font-size: 25px;
      font-weight: bold;
    }
  }
}
</style>
