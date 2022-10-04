<template>
  <div class="cl-content">
    <div v-if="dataSeries.reduce((sum, s) => sum + s, 0)">
      <div v-for="(it, index) in dataSeries" :key="index" class="cl-label">
        <div class="cl-item-label">
          <div
            class="cl-icon"
            :style="{
              background: dataColor[index],
            }"
          ></div>
          <div>
            <v-list-item-title class="cl-title" @click="listAction[index]()">{{ dataLabels[index] }}: {{ it }}</v-list-item-title>
            <v-list-item-subtitle class="cl-suptitle">{{
              getPercent(it)
            }}</v-list-item-subtitle>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-for="(it, index) in dataLabels" :key="index" class="cl-label">
        <div class="cl-item-label">
          <div
            class="cl-icon"
            :style="{
              background: dataColor[index],
            }"
          ></div>
          <div>
            <v-list-item-title class="cl-title">{{ dataLabels[index] }}: 0</v-list-item-title>
            <v-list-item-subtitle class="cl-suptitle">0 %</v-list-item-subtitle>
          </div>
        </div>
      </div>
    </div>

    <div style="width: 38%; margin-right: 35px">
      <doughnut
        v-if="dataSeries.reduce((sum, s) => sum + s, 0)"
        :chart-data="pieChartData"
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
</template>

<script>
import { Doughnut } from "vue-chartjs";

export default {
  components: {
    Doughnut,
  },

  props: {
    dataSeries: {
      type: Array,
      default: () => [],
      require: false,
    },
    dataLabels: {
      type: Array,
      default: () => [],
      require: false,
    },
    dataColor: {
      type: Array,
      default: () => [],
      require: false,
    },
    listAction: {
      type: Array,
      default: () => [],
      require: false,
    }
  },

  data() {
    return {
      pieChartData: {
        labels: this.dataLabels,
        datasets: [
          {
            data: this.dataSeries,
            borderRadius: 5,
            spacing: 1,
            backgroundColor: this.dataColor,
            cutout: "75%",
          },
        ],
      },

      pieChartOptions: {
        responsive: true,
        hoverOffset: 4,
        plugins: {
          renderTotal: {
            title: this.$t("dashboards.total"),
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            position: "nearest",
            external: this.externalTooltipHandler,
          },
        },
      },

      pieChartPlugin: [
        {
          id: "renderTotal",
          beforeDraw(chart, args, options) {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;
            chart.ctx.restore();
            const data = chart.config.data.datasets[0].data;
            const title = chart.config.options.plugins.renderTotal.title;
            var total = data.reduce((sum, s) => sum + s, 0) + "";
            // let fontSize = (height / 180).toFixed(2)
            let fontSize = (height / 180).toFixed(2);
            let fontSizeTotal = (height / 100).toFixed(2);
            if (width < 300) {
              fontSize = 14;
              fontSizeTotal = 32;
            } else {
              fontSize = 16;
              fontSizeTotal = 35;
            }
            ctx.font = `600 ${fontSize}px Mulish`;
            ctx.textBaseline = "middle";
            const text = title;
            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 2.2;
            ctx.fillStyle = "#8E8EA1";
            ctx.fillText(text, textX, textY);

            ctx.font = `700 ${fontSizeTotal}px Mulish`;
            const textTotalX = Math.round(
              (width - ctx.measureText(total).width) / 2
            );
            const textTotalY = height / 1.7;
            ctx.fillStyle = "#000000";
            ctx.fillText(total, textTotalX, textTotalY);
            ctx.save();
          },
        },
      ],
    };
  },

  methods: {
    externalTooltipHandler(context) {
      // Tooltip Element
      const { chart, tooltip } = context;
      const tooltipEl = this.getOrCreateTooltip(chart);

      // Hide if no tooltip
      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
      }
      if (tooltip.dataPoints) {
        const tableBody = document.createElement("tbody");

        const dataTooltip = tooltip.dataPoints[0];
        const { label, formattedValue, dataset } = dataTooltip;

        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = 0;

        const td = document.createElement("td");
        td.style.borderWidth = 0;
        const wrapCountEl = document.createElement("div");
        wrapCountEl.setAttribute("class", "warp-count");

        const countEl = document.createElement("span");
        countEl.setAttribute("class", "count-text");
        const nodeCount = document.createTextNode(formattedValue);
        countEl.appendChild(nodeCount);
        wrapCountEl.appendChild(countEl);

        const percentEl = document.createElement("span");
        percentEl.setAttribute("class", "percent-text");
        var total = dataset.data.reduce((sum, s) => sum + s, 0);
        const percentValue =
          "(" + ((formattedValue / total) * 100).toFixed(2) + "%)";
        const nodePercent = document.createTextNode(percentValue);
        percentEl.appendChild(nodePercent);
        wrapCountEl.appendChild(percentEl);

        const labelEl = document.createElement("div");
        labelEl.setAttribute("class", "label-tooltip");
        const nodeLabel = document.createTextNode(label);
        labelEl.appendChild(nodeLabel);

        td.appendChild(wrapCountEl);
        td.appendChild(labelEl);
        tr.appendChild(td);
        tableBody.appendChild(tr);
        const tableRoot = tooltipEl.querySelector("table");

        // Remove old children
        while (tableRoot.firstChild) {
          tableRoot.firstChild.remove();
        }
        // Add new children
        tableRoot.appendChild(tableBody);
      }
      const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1;
      tooltipEl.style.left = positionX + tooltip.caretX + "px";
      tooltipEl.style.top = positionY + tooltip.caretY + "px";
      tooltipEl.style.font = tooltip.options.bodyFont.string;
      tooltipEl.style.padding =
        tooltip.options.padding + "px " + tooltip.options.padding + "px";
    },

    getOrCreateTooltip(chart) {
      let tooltipEl = chart.canvas.parentNode.querySelector("div");
      if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.style.background = "#fff";
        tooltipEl.style.borderRadius = "15px";
        tooltipEl.style.color = "#0A093D";
        tooltipEl.style.opacity = 1;
        tooltipEl.style.pointerEvents = "none";
        tooltipEl.style.position = "absolute";
        tooltipEl.style.transform = "translate(-50%, 0)";
        tooltipEl.style.transition = "all .1s ease";

        const table = document.createElement("table");
        table.style.margin = "0px";

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
      }

      return tooltipEl;
    },

    getPercent(value) {
      const total = this.dataSeries.reduce((sum, s) => sum + s, 0);
      if (!total) {
        return "0.0 %";
      }
      return ((value / total) * 100).toFixed(1) + " %";
    },
  },
};
</script>

<style lang="scss" scoped>
.cl-content {
  padding-top: 10px;
  height: 210px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.cl-icon {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-right: 5px;
}
.cl-label {
  margin-top: 5px;
  .cl-item-label {
    display: flex;
    font-size: 14px;
    line-height: 18px;
  }
  .cl-title {
    cursor: pointer;
    color: #22242c;

    &:hover {
      color: #0fafe4;
    }
  }
  .cl-suptitle {
    color: #9fa2b4;
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
