<template>
  <div class="container container-ticket wrap-home has-bg">
    <div class="d-flex align-center">
      <h5 class="title-page text-primary d-flex align-center">
        <span class="mr-3">{{ $t("task-manager.dashboard-task.jobOverview") }}</span>
      </h5>
    </div>
    <div class="row col-12">
      <div class="col-8">
        <v-card class="chart-item pt-6 mb-6 text-center piechart">
          <h5 class="text-left pl-5 title-chart">
            {{ $t('task-manager.dashboard-task.iDo.iDo') }}
          </h5>
          <div class="d-flex justify-space-between pa-6">
            <card-item
              v-for="item in cardItems"
              v-show="showCard"
              :key="item.name"
              class="col-12 col-sm-6"
              :class="(isRoleVT && 'col-md-3') || 'col-md-4'"
              :item="item"
              :is-role-v-t="isRoleVT"
            />
          </div>
        </v-card>
      </div>
      <div class="col-4">
        <v-card class="chart-item pt-6 mb-6 text-center piechart">
          <h5 class="text-left pl-5 title-chart">
            {{ $t('task-manager.dashboard-task.create.createJobs') }}
          </h5>
          <div class="justify-space-between pa-6">
            <card-item-create
              v-show="showCard"
              :key="addItem.name"
              class="col-12"
              :item="addItem"
              :is-role-v-t="isRoleVT"
              @show-dialog-add-new="showDialogCreate"
            />
            <dialog-create-task
              :form-data-search="formData"
              :show-dialog="showDialogCreatetask"
              @search-task="searchTask"
              @close-dialog="closeDialogCreate"
              @miniMize-dialog="showDialogCreatetask=false"
            />
          </div>
        </v-card>
      </div>
      <div v-if="isLd" class="col-12">
        <v-card class="chart-item pa-6 mb-4 text-center piechart">
          <div class="d-flex justify-space-between align-center pb-6">
            <h5 class="text-left title-chart pl-2">
              {{ $t('task-manager.dashboard-task.manageRequests') }}
            </h5>
            <div>
              <v-menu
                v-model="menuTreeUnit"
                :close-on-content-click="false"
                :value="showTreeUnit"
                attach
                bottom
                min-width="400px"
                max-width="400px"
                offset-y
                origin="center center"
                transition="scale-transition"
                nudge-left="173"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    ref="nameUnit"
                    :value="unit.groupName"
                    class="text--body-5"
                    placeholder="Đơn vị"
                    dense
                    outlined
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    @click:append="menuTreeUnit = !menuTreeUnit"
                  >
                    <template v-slot:append>
                      <img
                        alt=""
                        class="hover--pointer"
                        src="@/assets/icons/task/dropdown.svg"
                        @click="menuTreeUnit = !menuTreeUnit"
                      />
                    </template>
                  </v-text-field>
                </template>
                <div>
                  <div class="pa-3">
                    <span class="text--lg">
                      {{ $t("task-manager.tree-unit.list") }}
                    </span>
                  </div>
                  <div>
                    <v-text-field
                      v-model="nameTreeUnit"
                      :placeholder="
                        $t('task-manager.placeHolder.name-unit-task')
                      "
                      class="text--body-5 ma-3"
                      clearable
                      dense
                      hide-details
                      name="txtSearch"
                      outlined
                    >
                      <vue-feather
                        slot="prepend-inner"
                        class="grey--text"
                        size="20"
                        type="search"
                      />
                    </v-text-field>
                  </div>
                  <v-treeview
                    id="org-tree"
                    :active="actives"
                    :items="items"
                    :open="open"
                    :search="nameTreeUnit"
                    :filter="filter"
                    activatable
                    item-key="groupId"
                    item-text="groupName"
                    class="col-12 tree-unit"
                    dense
                    expand-icon="mdi-chevron-down"
                    hoverable
                    transition
                    @update:active="clickOnNode"
                  >
                    <template slot="label" slot-scope="{ item, leaf }">
                      <v-tooltip content-class="tooltip-top" top>
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">
                            <span
                              :class="`label-item-${leaf ? 'leaf' : 'parent'}`"
                            >
                              {{ item.groupName }}
                            </span>
                          </span>
                        </template>
                        <span>{{ item.groupName }}</span>
                      </v-tooltip>
                    </template>
                  </v-treeview>
                  <div class="d-flex justify-center py-3">
                    <v-btn
                      class="w-150 py-5 mr-4 text--button"
                      color="primary"
                      elevation="0"
                      outlined
                      rounded
                      @click="closeDialog"
                    >
                      {{ $t("task-manager.tree-unit.cancel") }}
                    </v-btn>
                    <v-btn
                      class="w-150 py-5 text--button"
                      color="primary"
                      elevation="0"
                      rounded
                      @click="onSubmit"
                    >
                      {{ $t("task-manager.tree-unit.choose") }}
                    </v-btn>
                  </div>
                </div>
              </v-menu>
            </div>
          </div>
          <tab-dashboard
            :active-perform="$t('task-manager.dashboard-task.perform')"
            :active-create="$t('task-manager.dashboard-task.deliver')"
            :is-active-perform="isActivePerform"
            :is-active-create="isActiveCreate"
            @onICreateClick="onICreateClick"
            @onIPerformClick="onIPerformClick"
          />
          <piechart-content
            v-if="isActivePerform"
            :is-ld="true"
            :create-pie-chart-data="performPieChartData"
            :pie-chart-options="pieChartOptions"
            :list-current-create="listCurrentPerform"
            :pie-chart-plugin="pieChartPlugin"
          />
          <piechart-content
            v-if="isActiveCreate"
            :is-ld="true"
            :create-pie-chart-data="assignPieChartData"
            :pie-chart-options="pieChartOptions"
            :list-current-create="listCurrentAssign"
            :pie-chart-plugin="pieChartPlugin"
          />
        </v-card>
      </div>
      <div v-else class="col-12">
        <v-card class="chart-item pa-6 text-center piechart">
          <h5 class="text-left title-chart pl-2">
            {{ $t('task-manager.dashboard-task.iDeliver') }}
          </h5>
          <piechart-content
            :is-ld="false"
            :create-pie-chart-data="pieChartData"
            :pie-chart-options="pieChartOptions"
            :list-current-create="listCurrent"
            :pie-chart-plugin="pieChartPlugin"
          />
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import constants from "@/constants";
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import mixinActions from "./mixins/mixinActions";
import TicketIcon from "@/assets/icons/ticket/icon-ticket2.svg";
import CardItem from "./component/CardItem";
import CardItemCreate from "./component/CardItemCreate";
import TabDashboard from "@/views/components/TabDashboard.vue";
import PiechartContent from "./component/PiechartContent";
import { TaskService } from '@/modules/etask/services/taskService'
import DialogCreateTask from '@/modules/etask/views/components/DialogCreateTask'// config
import config from '@/config'
import { mapActions } from 'vuex';
import LTT from 'list-to-tree'
import pagingData from '@/mixins/paging'

export default {
  name: "Dashboard",
  components: {
    CardItem,
    CardItemCreate,
    PiechartContent,
    TabDashboard,
    DialogCreateTask
  },
  mixins: [mixinStatusAndPriority, mixinActions, pagingData],
  data() {
    return {
      isShowDialogAddNew: false,
      showCard: true,
      isRoleVT: false,
      isActivePerform: true,
      isActiveCreate: false,
      addItem: {
        key: constants.DOC_STATES.EX,
        name: "task-manager.dashboard-task.create.work",
        value: "task-manager.dashboard-task.create.createNew",
        icon: "mdi-plus",
        iconColor: "reject",
        bgColor: "#4A50E2",
      },
      cardItems: [
        {
          key: constants.DOC_STATES.EX,
          name: "task-manager.dashboard-task.iDo.outOfDate",
          value: null,
          icon: "mdi-calendar-blank-outline",
          iconColor: "reject",
          remainText: "task-manager.dashboard-task.iDo.textOutOfDate",
          param: 2,
          bgColor: "#FF4A55",
        },
        {
          key: constants.DOC_STATES.EX,
          name: "task-manager.dashboard-task.iDo.unfinished",
          value: null,
          icon: "mdi-timer-sand-complete",
          iconColor: "process",
          remainText: "task-manager.dashboard-task.iDo.textUnfinished",
          param: 8,
          bgColor: "#ffaf2e",
        },
        {
          key: constants.DOC_STATES.EX,
          name: "task-manager.dashboard-task.iDo.complete",
          value: null,
          imageIcon: TicketIcon,
          iconColor: "completed",
          remainText: "task-manager.dashboard-task.iDo.textComplete",
          param: 5,
          bgColor: "#00C3F9",
        },
      ],
      menuTreeUnit: null,
      showTreeUnit: false,
      menuJobTreeUnit: null,
      unit: {},
      nameTreeUnit: "",
      actives: [],
      selectedNode: [],
      open: [],
      items: [],
      groups: [],
      seriesPie: [],
      performSeriesPie: [],
      assignSeriesPie: [],
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
            let fontSize = (height / 180).toFixed(2);
            let fontSizeTotal = (height / 100).toFixed(2);
            if (width < 300) {
              fontSize = 14;
              fontSizeTotal = 36;
            } else {
              fontSize = 16;
              fontSizeTotal = 40;
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
      listCurrentPerform: {},
      listCurrentAssign: {},
      listCurrent: {},
      parentGroupId: "",
      isLd: false,
      showDialogCreatetask: false,
      formData: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keywords: '', // ten, thuc hien, loai cong viec
        sortType: '', // sap xep theo cot
        taskFilter: 'CREATED', // loai cong viec - cong viec toi tao
        taskStatuses: [], // list trang thai
        taskDeadline: null, // viec hoan thanh hoac chua hoac all
        assignedGroupId: '', // nhom
        assignedUserId: '', // nguoi tao
        deadlineTaskTimeType: '', // Han hoan thanh
        isCompletedTask: 'false', // han hoan thanh -> tam thoi bo qua
        finishTaskTimeType: '', // menu complete
        taskName: '', // ten cong viec
        estimateEndFromDate: '', // den ngay
        estimateEndToDate: '', // tu ngay
        createdDateFrom: '', // tao tu ngay
        createdDateTo: '', // tao den ngay
        taskPriorities: [], // do uu tien
        performerUserIds: [], // list id nguoi thuc hien
        performerGroupIds: [], // list id nhom thuc hien
        followerIds: [], // list id nguoi theo doi
        combinerUserIds: [], // list id nguoi phoi hop
        combinerGroupIds: [], // list id nhom phoi hop
        sortOrder: '', // sap xep theo ten cv
        taskType: '', // loai cong viec
        taskId: '',
      },
      objLoading: {
        value: false
      },
      activeIndex: [],
      isLoadingChildTask: false,
      listTaskCreate: [],
      totalElements: null,
    };
  },
  computed: {
    pieChartData() {
      return {
        labels: [
          this.$t("task-manager.dashboard-task.unfinished"),
          this.$t("task-manager.dashboard-task.complete"),
        ],
        datasets: [
          {
            data: this.seriesPie,
            borderRadius: 5,
            spacing: 1,
            backgroundColor: ["#FFAF2E", "#00C3F9"],
            cutout: "75%",
          },
        ],
      };
    },
    performPieChartData() {
      return {
        labels: [
          this.$t("task-manager.dashboard-task.unfinished"),
          this.$t("task-manager.dashboard-task.complete"),
        ],
        datasets: [
          {
            data: this.performSeriesPie,
            borderRadius: 5,
            spacing: 1,
            backgroundColor: ["#FFAF2E", "#00C3F9"],
            cutout: "75%",
          },
        ],
      };
    },
    assignPieChartData() {
      return {
        labels: [
          this.$t("task-manager.dashboard-task.unfinished"),
          this.$t("task-manager.dashboard-task.complete"),
        ],
        datasets: [
          {
            data: this.assignSeriesPie,
            borderRadius: 5,
            spacing: 1,
            backgroundColor: [
              "#FFAF2E",
              "#00C3F9",
            ],
            cutout: "75%",
          },
        ],
      };
    },
    filter() {
      return (item, search, textKey) =>
        this.removeAccents(item[textKey]).includes(this.removeAccents(search.trim()));
    },
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    async initData() {
      await this.searchTask()
      this.getModuleTaskDashboard();
    },
    closeDialogCreate() {
      this.showDialogCreatetask = false
    },
    showDialogCreate() {
      this.showDialogCreatetask = true
    },
    async searchTask() {
      this.formData.page = ''
      this.formData.parentGroupId = this.unit.groupId
      this.listUserActive = []
      if (!this.formData.parentGroupId) {
        await this.getGroupTree()
        this.formData.parentGroupId = this.unit.groupId
      }
      await this.search()
    },
    async search() {
      try {
        this.objLoading.value = true

        this.listUserActive = []
        this.listGroupActive = []
        this.idUserActive = null
        this.idGroupActive = null

        this.formData.actionUserId = null
        this.formData.actionGroupId = null

        this.formData.pageSize = config.app.paging.pageSize

        // get list user assign by current group
        if (this.formData.keywords) {
          this.formData.keywords = this.formData.keywords.trim()
        }

        this.formData.taskId = this.params_notification;

        const responseUser = await TaskService.getListUserAssignCurrentGroup(
          this.formData
        )
        const response = responseUser.data
        this.listUserAssign = response.data
        this.renderPaging(response)
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.objLoading.value = false
      }
    },
    async getModuleTaskDashboard() {
      try {
        const response = await TaskService.getModuleTaskDashboard({ groupId: this.unit.groupId });
        const data = response.data;

        this.isLd = !data.taskAssign;

        if (this.isLd) {
          this.createSeriesPie('performSeriesPie', data.taskGroupPerform);
          this.createListCurrent(
            'listCurrentPerform',
            data.taskGroupPerform,
            () => this.eventClickLine('I_ROOM_WORK', 8, 'perform', this.formData.parentGroupId),
            () => this.eventClickLine('I_ROOM_WORK', 5, 'perform', this.formData.parentGroupId),
            () => this.eventClickLine('I_ROOM_WORK', 7, 'perform', this.formData.parentGroupId),
            () => this.eventClickLine('I_ROOM_WORK', 2, 'perform', this.formData.parentGroupId),
          );

          this.createSeriesPie('assignSeriesPie', data.taskGroupAssign);
          this.createListCurrent(
            'listCurrentAssign',
            data.taskGroupAssign,
            () => this.eventClickLine('I_ROOM_WORK', 8, 'assign', this.formData.parentGroupId),
            () => this.eventClickLine('I_ROOM_WORK', 5, 'assign', this.formData.parentGroupId),
            () => this.eventClickLine('I_ROOM_WORK', 7, 'assign', this.formData.parentGroupId),
            () => this.eventClickLine('I_ROOM_WORK', 2, 'assign', this.formData.parentGroupId),
          );
        } else {
          this.createSeriesPie('seriesPie', data.taskAssign);
          this.createListCurrent(
            'listCurrent',
            data.taskAssign,
            () => this.eventClickLine('I_ASSIGN', 1000),
            () => this.eventClickLine('I_ASSIGN', 5),
            () => this.eventClickLine('I_ASSIGN', 3),
            () => this.eventClickLine('I_ASSIGN', 2),
          );
        }

        this.cardItems[0].value = data.taskPerform.expiredTask;
        this.cardItems[1].value = data.taskPerform.unfinishedTask;
        this.cardItems[2].value = data.taskPerform.finishedTask;
      } catch (error) {
        console.log(error);
      }
    },
    createSeriesPie(key, data) {
      this[key] = [];
      this[key].push(
        data.unfinishedTask,
        data.finishedTask,
      );
    },
    createListCurrent(key, data, event1, event2, event3, event4) {
      this[key] = {
        unfinishedTask: data.unfinishedTask,
        finishedTask: data.finishedTask,
        approveTask: data.approveTask,
        expiredTask: data.expiredTask,
        unaccomplishedTask: data.unaccomplishedTask,
        event1: event1,
        event2: event2,
        event3: event3,
        event4: event4
      }
    },
    async getGroupTree() {
      try {
        const response = await TaskService.getGroupByCurrentUser()
        if (response.success) {
          this.groups = response.data

          this.rootGroupId = this.groups[0].groupId
          this.items = this.prepareDataGroupsToTree(this.groups)
          this.unit = this.groups.find(group => group.groupId === this.rootGroupId)
          this.actives = [this.rootGroupId]
          this.open = [this.rootGroupId]
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      }
    },
    prepareDataGroupsToTree(arrData) {
      const arrCopy = arrData.map((item) => ({ ...item }))
      let tree = null
      const first = arrCopy[0]
      if (first.parentGroupId === null) {
        first.parentGroupId = 0
        var ltt = new LTT(arrCopy, {
          key_id: "groupId",
          key_parent: "parentGroupId",
          key_child: "children",
        })
        tree = ltt.GetTree()
      } else {
        tree = this.arrayToTreeNoRoot(arrCopy, first.parentGroupId)
      }
      return tree
    },
    arrayToTreeNoRoot(arr, parent = 0) {
      return arr
        .filter((item) => item.parentGroupId === parent)
        .map((child) => ({
          ...child,
          children: this.arrayToTreeNoRoot(arr, child.groupId),
        }))
    },
    onICreateClick() {
      this.isActivePerform = false;
      this.isActiveCreate = !this.isActiveCreate;
    },
    onIPerformClick() {
      this.isActiveCreate = false;
      this.isActivePerform = !this.isActivePerform;
    },
    closeDialog() {
      this.actives = [this.unit.groupId]
      this.menuTreeUnit = !this.menuTreeUnit
    },
    onSubmit() {
      if (!this.selectedNode.length) return undefined;
      const groupId = this.selectedNode[this.selectedNode.length - 1];
      if (groupId === this.unit.groupId) {
        return;
      }
      this.unit = this.groups.find((group) => group.groupId === groupId);
      this.menuTreeUnit = !this.menuTreeUnit;
      this.searchTask()
      this.getModuleTaskDashboard();
    },
    clickOnNode(node) {
      if (node.length === 0) {
        this.actives = this.selectedNode;
        return;
      }
      this.selectedNode = node;
      this.formData.parentGroupId = node[0];
    },
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
    removeAccents(str) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toUpperCase();
    },
  },
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
  width: 200px;
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
}
.title-dashboard-task {
  position: absolute;
  top: -38px;
  left: 21px;
  font-size: 20px;
  font-weight: 200;
  line-height: 28px;
  color: #00C3F9;
}
.position-relative {
  position: relative;
}
</style>
