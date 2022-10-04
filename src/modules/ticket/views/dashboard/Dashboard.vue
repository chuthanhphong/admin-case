<template>
  <div class="container container-ticket wrap-home has-bg">
    <div class="row col-12">
      <!-- <v-layout row wrap justify-center justify-sm-space-between> -->
      <div class="col-8">
        <v-card class="chart-item pt-6 mb-6 text-center piechart">
          <h5 class="text-left pl-5 title-chart">
            <!-- {{ $t("reportTitleDashboard") }} -->
            Tôi Thực Hiện/Duyệt
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
        <v-card class="chart-item pa-6 mb-4 text-center piechart">
          <div class="d-flex justify-space-between align-center pb-6">
            <h5 class="text-left title-chart pl-2">
              <!-- {{ $t("reportTitleDashboard") }} -->
              Yêu Cầu Đơn Vị
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
                              {{ item.name }}
                            </span>
                          </span>
                        </template>
                        <span>{{ item.name }}</span>
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
          <v-divider class="pb-4" />
          <div class="request-header pt-4">
            <h6>Thực hiện: {{ totalCount }}</h6>
            <div class="request-status pr-6">
              <v-layout align-center>
                <v-avatar color="danger" size="15" class="mr-1"></v-avatar>
                <span class="text-center danger--text">{{
                  $t("tickets.status-by.expired")
                }}</span>
              </v-layout>
              <v-layout align-center>
                <v-avatar color="yellow-ff" size="15" class="mr-1"></v-avatar>
                <span class="text-center yellow-ff--text">{{
                  $t("tickets.status-by.undue")
                }}</span>
              </v-layout>
              <v-layout align-center>
                <v-avatar
                  :color="getColorDotByStatus(10)"
                  size="15"
                  class="mr-1"
                ></v-avatar>
                <span
                  class="text-center"
                  :class="getColorTextByStatus(10)"
                  v-html="getTextByStatus(10)"
                ></span>
              </v-layout>
            </div>
          </div>
          <div class="row piechart-content col-12 ma-0 pa-0">
            <div class="col-12 col-md-4">
              <div class="pie-chart-request pt-6">
                <doughnut
                  v-if="totalCount !== 0"
                  :chart-data="pieChartData"
                  :chart-options="pieChartOptions"
                  :plugins="pieChartPlugin"
                />
                <empty-box v-else />
              </div>
            </div>
            <div class="user-list-request col-md-8">
              <div
                class="row align-center ma-0 pa-0 col-12"
                v-for="(item, index) in listPerformUser"
                :key="index"
              >
                <div class="d-flex col-12 col-md-4">
                  <v-avatar color="primary" size="32">
                    <span class="white--text text-h6 text-uppercase">
                      {{ item.username[0] }}
                    </span>
                  </v-avatar>
                  <span class="d-flex align-center font-weight-bold pl-2">
                    {{ item.username }}
                  </span>
                </div>
                <div class="col-12 col-md-6">
                  <div class="status-bar">
                    <div
                      v-if="item.countOverDue != 0"
                      :style="`width: ${
                        (item.countOverDue / item.totalCount) * 100
                      }%`"
                      class="overdue-bar"
                    ></div>
                    <div
                      v-if="item.countNotDue != 0"
                      :style="`width: ${
                        (item.countNotDue / item.totalCount) * 100
                      }%`"
                      class="notdue-bar"
                    ></div>
                    <div
                      v-if="item.countClosed != 0"
                      :style="`width: ${
                        (item.countClosed / item.totalCount) * 100
                      }%`"
                      class="closed-bar"
                    ></div>
                  </div>
                </div>
                <div class="col-12 col-md-2 text-right">
                  <span>{{ item.totalCount }}</span>
                </div>
              </div>
              <div
                class="d-flex align-center justify-end text-link"
                @click="expandListUser()"
              >
                <h6>{{ isActiveCollapseItem ? "Thu gọn" : "Xem thêm" }}</h6>
                <v-icon>{{
                  isActiveCollapseItem ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
              </div>
            </div>
          </div>
          <v-divider class="pb-4" />
          <div class="request-header">
            <h6>Gửi đi: {{ totalSendCount }}</h6>
            <div class="request-status pr-6">
              <v-layout align-center>
                <v-avatar color="danger" size="15" class="mr-1"></v-avatar>
                <span class="text-center danger--text">{{
                  $t("tickets.status-by.expired")
                }}</span>
              </v-layout>
              <v-layout align-center>
                <v-avatar color="yellow-ff" size="15" class="mr-1"></v-avatar>
                <span class="text-center yellow-ff--text">{{
                  $t("tickets.status-by.undue")
                }}</span>
              </v-layout>
              <v-layout align-center>
                <v-avatar
                  :color="getColorDotByStatus(10)"
                  size="15"
                  class="mr-1"
                ></v-avatar>
                <span
                  class="text-center"
                  :class="getColorTextByStatus(10)"
                  v-html="getTextByStatus(10)"
                ></span>
              </v-layout>
              <v-layout align-center>
                <v-avatar
                  :color="getColorDotByStatus(-1)"
                  size="15"
                  class="mr-1"
                ></v-avatar>
                <span
                  class="text-center"
                  :class="getColorTextByStatus(-1)"
                  v-html="getTextByStatus(-1)"
                ></span>
              </v-layout>
            </div>
          </div>
          <div class="row piechart-content col-12 ma-0 pa-0">
            <div class="col-12 col-md-4">
              <div class="pie-chart-request pt-6">
                <doughnut
                  v-if="totalSendCount !== 0"
                  :chart-data="sendPieChartData"
                  :chart-options="pieChartOptions"
                  :plugins="pieChartPlugin"
                />
                <empty-box v-else />
              </div>
            </div>
            <div class="user-list-request col-md-8">
              <div
                class="row align-center ma-0 pa-0 col-12"
                v-for="(item, index) in listSendingUser"
                :key="index"
              >
                <div class="d-flex col-12 col-md-4">
                  <v-avatar color="primary" size="32">
                    <span class="white--text text-h6 text-uppercase">
                      {{ item.username[0] }}
                    </span>
                  </v-avatar>
                  <span class="d-flex align-center font-weight-bold pl-2">
                    {{ item.username }}
                  </span>
                </div>
                <div class="col-12 col-md-6">
                  <div class="status-bar">
                    <div
                      v-if="item.countOverDue != 0"
                      :style="`width: ${
                        (item.countOverDue / item.totalCount) * 100
                      }%`"
                      class="overdue-bar"
                    ></div>
                    <div
                      v-if="item.countNotDue != 0"
                      :style="`width: ${
                        (item.countNotDue / item.totalCount) * 100
                      }%`"
                      class="notdue-bar"
                    ></div>
                    <div
                      v-if="item.countClosed != 0"
                      :style="`width: ${
                        (item.countClosed / item.totalCount) * 100
                      }%`"
                      class="closed-bar"
                    ></div>
                    <div
                      v-if="item.countCanceled != 0"
                      :style="`width: ${
                        (item.countCanceled / item.totalCount) * 100
                      }%`"
                      class="cancelled-bar"
                    ></div>
                  </div>
                </div>
                <div class="col-12 col-md-2 text-right">
                  <span>{{ item.totalCount }}</span>
                </div>
              </div>
              <div
                class="d-flex align-center justify-end text-link"
                @click="expandSendListUser()"
              >
                <h6>{{ isActiveCollapseSendItem ? "Thu gọn" : "Xem thêm" }}</h6>
                <v-icon>{{
                  isActiveCollapseSendItem
                    ? "mdi-chevron-up"
                    : "mdi-chevron-down"
                }}</v-icon>
              </div>
            </div>
          </div>
        </v-card>
        <v-card class="chart-item pa-6 text-center piechart">
          <h5 class="text-left title-chart pl-2">
            <!-- {{ $t("reportTitleDashboard") }} -->
            Tôi tạo
          </h5>
          <div class="row piechart-content col-12 ma-0 pa-0">
            <div class="col-12 col-md-4">
              <div class="pie-chart-request pt-6">
                <doughnut
                  v-if="totalCreateCount !== 0"
                  :chart-data="createPieChartData"
                  :chart-options="pieChartOptions"
                  :plugins="pieChartPlugin"
                />
                <empty-box v-else />
              </div>
            </div>
            <div class="col-12 col-md-8 my-request-chart">
              <v-layout align-center>
                <div class="row d-flex align-center">
                  <div class="col-12 col-md-4 text-left">
                    <v-avatar color="danger" size="15" class="mr-1"></v-avatar>
                    <span :class="getColorTextByStatus(9)">
                      {{ $t("tickets.status-by.expired") }}
                    </span>
                  </div>
                  <div class="col-12 col-md-6">
                    <v-progress-linear
                      height="10"
                      rounded
                      background-opacity="1"
                      color="#E7ECF1"
                      :value="listCurrentCreate.countOverDue"
                      :class="getClassColorProgressByStatus(9)"
                    >
                    </v-progress-linear>
                  </div>
                  <div class="col-12 col-md-2 text-right">
                    <span>{{ listCurrentCreate.countOverDue }}</span>
                  </div>
                </div>
              </v-layout>
              <v-layout align-center>
                <div class="row d-flex align-center">
                  <div class="col-12 col-md-4 text-left">
                    <v-avatar
                      color="yellow-ff"
                      size="15"
                      class="mr-1"
                    ></v-avatar>
                    <span :class="getColorTextByStatus(2)">
                      {{ $t("tickets.status-by.undue") }}
                    </span>
                  </div>
                  <div class="col-12 col-md-6">
                    <v-progress-linear
                      height="10"
                      rounded
                      background-opacity="1"
                      color="#E7ECF1"
                      :value="listCurrentCreate.countNotDue"
                      :class="getClassColorProgressByStatus(2)"
                    >
                    </v-progress-linear>
                  </div>
                  <div class="col-12 col-md-2 text-right">
                    <span>{{ listCurrentCreate.countNotDue }}</span>
                  </div>
                </div>
              </v-layout>
              <v-layout align-center>
                <div class="row d-flex align-center">
                  <div class="col-12 col-md-4 text-left">
                    <v-avatar
                      :color="getColorDotByStatus(10)"
                      size="15"
                      class="mr-1"
                    ></v-avatar>
                    <span :class="getColorTextByStatus(10)">
                      {{ $t("tickets.status-by.closed") }}
                    </span>
                  </div>
                  <div class="col-12 col-md-6">
                    <v-progress-linear
                      height="10"
                      rounded
                      background-opacity="1"
                      color="#E7ECF1"
                      :value="listCurrentCreate.countClosed"
                      :class="getClassColorProgressByStatus(10)"
                    >
                    </v-progress-linear>
                  </div>
                  <div class="col-12 col-md-2 text-right">
                    <span>{{ listCurrentCreate.countClosed }}</span>
                  </div>
                </div>
              </v-layout>
              <v-layout align-center>
                <div class="row d-flex align-center">
                  <div class="col-12 col-md-4 text-left">
                    <v-avatar
                      :color="getColorDotByStatus(-1)"
                      size="15"
                      class="mr-1"
                    ></v-avatar>
                    <span
                      class="text-center w-200"
                      :class="getColorTextByStatus(-1)"
                    >
                      {{ $t("tickets.status-by.cancelled") }}
                    </span>
                  </div>
                  <div class="col-12 col-md-6">
                    <v-progress-linear
                      height="10"
                      rounded
                      background-opacity="1"
                      color="#E7ECF1"
                      :value="listCurrentCreate.countCanceled"
                      :class="getClassColorProgressByStatus(-1)"
                    >
                    </v-progress-linear>
                  </div>
                  <div class="col-12 col-md-2 text-right">
                    <span>{{ listCurrentCreate.countCanceled }}</span>
                  </div>
                </div>
              </v-layout>
              <v-layout align-center>
                <div class="row d-flex align-center">
                  <div class="col-12 col-md-4 text-left">
                    <v-avatar
                      :color="getColorDotByStatus(0)"
                      size="15"
                      class="mr-1"
                    ></v-avatar>
                    <span
                      class="text-center w-200"
                      :class="getColorTextByStatus(0)"
                    >
                      {{ $t("tickets.status-by.draft") }}
                    </span>
                  </div>
                  <div class="col-12 col-md-6">
                    <v-progress-linear
                      height="10"
                      rounded
                      background-opacity="1"
                      color="#E7ECF1"
                      :value="listCurrentCreate.countDraft"
                      :class="getClassColorProgressByStatus(0)"
                    >
                    </v-progress-linear>
                  </div>
                  <div class="col-12 col-md-2 text-right">
                    <span>{{ listCurrentCreate.countDraft }}</span>
                  </div>
                </div>
              </v-layout>
            </div>
          </div>
          <div class="row col-12">
            <div class="col-12 col-md-4"></div>
            <div class="row col-12 col-md-8 request-statistic">
              <div class="col-12 col-md-6">
                <b>Quá hạn</b>
                <h4>{{ listCurrentCreate.countOverDue }}</h4>
              </div>
              <v-divider vertical />
              <div class="col-12 col-md-6">
                <b>Tổng yêu cầu</b>
                <h4>
                  {{
                    listCurrentCreate.countOverDue +
                    listCurrentCreate.countNotDue +
                    listCurrentCreate.countClosed +
                    listCurrentCreate.countCanceled +
                    listCurrentCreate.countDraft
                  }}
                </h4>
              </div>
            </div>
          </div>
        </v-card>
      </div>
      <div class="col-4">
        <v-card class="chart-item pt-6 mb-6 text-center piechart">
          <h5 class="text-left pl-5 title-chart">
            <!-- {{ $t("reportTitleDashboard") }} -->
            Tạo yêu cầu
          </h5>
          <div class="justify-space-between pa-6">
            <card-item-create
              class="col-12"
              v-show="showCard"
              :key="addItem.name"
              :item="addItem"
              :is-role-v-t="isRoleVT"
              @show-dialog-add-new="showDialogAddNew"
            />
          </div>
        </v-card>
        <v-card class="chart-item pt-6 mb-6 text-center piechart">
          <h5 class="text-left pl-5 title-chart">
            <!-- {{ $t("reportTitleDashboard") }} -->
            Trung tâm nhận việc ({{ listJobs ? listJobs.length : 0 }})
          </h5>
          <div class="pa-6">
            <v-menu
              v-model="menuJobTreeUnit"
              :close-on-content-click="false"
              :value="showJobTreeUnit"
              attach
              bottom
              min-width="400px"
              max-width="400px"
              offset-y
              origin="center center"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  ref="nameUnit"
                  :value="unitJob.groupName"
                  class="text--body-5"
                  placeholder="Đơn vị"
                  dense
                  outlined
                  hide-details
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @click:append="menuJobTreeUnit = !menuJobTreeUnit"
                >
                  <template v-slot:append>
                    <img
                      alt=""
                      class="hover--pointer"
                      src="@/assets/icons/task/dropdown.svg"
                      @click="menuJobTreeUnit = !menuJobTreeUnit"
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
                    v-model="jobTreeUnit"
                    :placeholder="$t('task-manager.placeHolder.name-unit-task')"
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
                  :search="jobTreeUnit"
                  :filter="filter"
                  activatable
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
                            {{ item.name }}
                          </span>
                        </span>
                      </template>
                      <span>{{ item.name }}</span>
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
                    @click="onJobSubmit"
                  >
                    {{ $t("task-manager.tree-unit.choose") }}
                  </v-btn>
                </div>
              </div>
            </v-menu>
          </div>
          <v-data-table
            id="virtual-scroll-table"
            hide-default-footer
            :headers="headers"
            :fixed-header="true"
            :items="listJobs"
            :no-data-text="$t('noData')"
            :class="`table-${tableType}`"
          >
            <template v-slot:[`item.name`]="{ item }">
              <b>{{ item.name }}</b>
              <div class="d-flex align-center">
                <v-chip color="#CCF3FE">
                  {{ item.ticketCateName }}
                </v-chip>
                <span class="red--text pl-2">{{
                  getTextDeallineByExpectEndDate(item.expectEndDate)
                }}</span>
              </div>
            </template>
            <template v-slot:[`item.action`]="{ item, index }">
              <v-menu
                :key="item.id"
                v-model="menuModelAssign[index]"
                bottom
                left
                origin="center center"
                transition="scale-transition"
                max-width="300"
                :close-on-content-click="closeOnContent"
                offset-x
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="border-dashed-2"
                    :color="getColorActionAssign(item)"
                    outlined
                    fab
                    x-small
                    v-bind="attrs"
                    v-on="on"
                    @click="bindSelectedItem(item, index)"
                  >
                    <i
                      class="app-icon icon-personal"
                      :class="getColorActionAssign(item)"
                    />
                  </v-btn>
                </template>
                <assign-user
                  :users-by-group-id="usersByGroupId"
                  @assign-to="updateAssignTo"
                />
              </v-menu>

              <v-btn
                class="border-dashed-2 ml-2"
                outlined
                fab
                x-small
                :color="getColorActionForward(item)"
                @click="onShowDialogTreeView(item)"
                @dblclick="onDeactiveStateActionForward"
              >
                <i
                  class="app-icon icon-move-action icon-size-20"
                  :class="getColorActionForward(item)"
                />
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </div>
      <!-- </v-layout> -->
      <dialog-tree-view
        v-model="isShowDialogTreeView"
        :title="$t('tickets.labels.unit-request-perform')"
        :group-id="selectedItemForward ? selectedItemForward.groupId : null"
        :all-groups="allGroups"
        @selected-group="selectedGroup"
        @on-cancel="onDeactiveStateActionForward"
      />
      <dialog-create-ticket
        v-model="isShowDialogAddNew"
        :category-id="detailSelected ? detailSelected.ticketCateId : null"
        :types-ticket="typesTicket"
        :is-update="isUpdateItemSelected"
        :detail-ticket="detailSelected"
        @reload-list="initData"
      />
    </div>
  </div>
</template>

<script>
import CardItem from "./component/CardItem";
import CardItemCreate from "./component/CardItemCreate";
import AssignUser from "./component/AssignUser";
import DialogTreeView from "@/modules/ticket/views/components/DialogTreeView.vue";
import DialogCreateTicket from "@/modules/ticket/views/components/create-ticket/DialogCreateTicket";
import constants from "@/constants";
import ticketRoute from "@/modules/ticket/router/routePaths";
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import { secondsToHm } from "@/modules/ticket/helpers/ticketUtils";
import { Doughnut } from "vue-chartjs/legacy";
import EmptyBox from "@/views/components/EmptyBox";
import moment from "moment";
import { GroupService } from "@/services/groupService";
import { TicketService } from "@/modules/ticket/services/ticketService";
import { StorageService } from "@/modules/ticket/services/storageService";
import { UserService } from "@/modules/ticket/services/userService";
import { CategoryService } from "@/modules/ticket/services/categoryService";
import mixinActions from "./mixins/mixinActions";
import ApprovalIcon from "@/assets/icons/ticket/icon-approval.svg";

const initForm = {
  name: "",
  groupSelected: {},
};

export default {
  name: "Dashboard",
  components: {
    CardItem,
    CardItemCreate,
    DialogCreateTicket,
    AssignUser,
    DialogTreeView,
    EmptyBox,
    Doughnut,
  },
  mixins: [mixinStatusAndPriority, mixinActions],
  data() {
    return {
      formSearch: { ...initForm },
      isShowDialogAddNew: false,
      showCard: true,
      isRoleVT: false,
      isActiveCollapseItem: false,
      isActiveCollapseSendItem: false,
      typesTicket: [],
      menuModelAssign: [],
      selectedItem: null,
      selectedItemIndex: null,
      closeOnContent: false,
      isShowDialogTreeView: false,
      selectedItemForward: null,
      allGroups: [],
      usersByGroupId: [],
      addItem: {
        key: constants.DOC_STATES.EX,
        name: "managementDoc.dashboards.request",
        value: "managementDoc.dashboards.create",
        icon: "mdi-plus",
        iconColor: "reject",
        // link: `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}?searchCriteria=${constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_EXPIRE}`,
        bgColor: "#4A50E2",
      },
      cardItems: [
        {
          key: constants.DOC_STATES.EX,
          name: "managementDoc.dashboards.expired",
          value: null,
          icon: "mdi-calendar-blank-outline",
          iconColor: "reject",
          remainText: "managementDoc.dashboards.expiredDocument",
          link: `${ticketRoute.MY_PERFORM_TICKET_PATH}`,
          bgColor: "#FF4A55",
        },
        {
          key: constants.DOC_STATES.EX,
          name: "tickets.status-by.undue",
          value: null,
          icon: "mdi-timer-sand-complete",
          iconColor: "process",
          remainText: "managementDoc.dashboards.approveDocument",
          link: `${ticketRoute.MY_PERFORM_TICKET_PATH}`,
          bgColor: "#ffaf2e",
        },
        {
          key: constants.DOC_STATES.EX,
          name: "managementDoc.dashboards.approve",
          value: null,
          imageIcon: ApprovalIcon,
          iconColor: "completed",
          remainText: "managementDoc.dashboards.requestDocument",
          link: `${ticketRoute.MY_APPROVE_TICKET_PATH}`,
          bgColor: "#6F74F9",
        },
      ],
      valueCardItems: [],
      // Datatable
      tableType: "list",
      headers: [
        {
          text: this.$t("tickets.labels.ticket-name"),
          sortable: false,
          value: "name",
          class: "text--body-5 gray--text",
          width: "70%",
        },
        {
          text: this.$t("tickets.labels.actions"),
          sortable: false,
          value: "action",
          align: "center",
          width: "30%",
        },
      ],
      listJobs: [],
      // unit select box
      menuTreeUnit: null,
      showTreeUnit: false,
      menuJobTreeUnit: null,
      showJobTreeUnit: false,
      unit: {},
      unitJob: {},
      nameTreeUnit: "",
      jobTreeUnit: "",
      actives: [],
      selectedNode: [],
      open: [],
      items: [],
      groups: [],
      rootGroupId: 1,
      listPerformUser: [],
      listAllPerformUser: [],
      listSendingUser: [],
      listAllSendingUser: [],
      totalCreateCount: 0,
      seriesPie: [],
      sendSeriesPie: [],
      createSeriesPie: [],
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
            // console.log({ width })
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
      totalClosed: 0,
      totalNotDue: 0,
      totalOverDue: 0,
      totalCount: 0,
      totalSendClosed: 0,
      totalSendNotDue: 0,
      totalSendOverDue: 0,
      totalCancelled: 0,
      totalSendCount: 0,
      listCurrentCreate: {},
      parentGroupId: "",
    };
  },
  watch: {
    menuModelAssign(menuOpen) {
      const val = menuOpen[this.selectedItemIndex];
      if (!val) {
        this.onDeactiveStateActionAssign();
      }
    },
  },
  created() {
    this.initData();
  },
  computed: {
    pieChartData() {
      return {
        labels: [
          this.$t("tickets.status-by.undue"),
          this.$t("tickets.status-by.closed"),
          this.$t("tickets.status-by.expired"),
        ],
        datasets: [
          {
            data: this.seriesPie,
            borderRadius: 5,
            spacing: 1,
            backgroundColor: ["#00C3F9", "#FFAF2E", "#FF1D1D"],
            cutout: "75%",
          },
        ],
      };
    },
    sendPieChartData() {
      return {
        labels: [
          this.$t("tickets.status-by.undue"),
          this.$t("tickets.status-by.closed"),
          this.$t("tickets.status-by.expired"),
          this.$t("tickets.status-by.cancelled"),
        ],
        datasets: [
          {
            data: this.sendSeriesPie,
            borderRadius: 5,
            spacing: 1,
            backgroundColor: ["#FFAF2E", "#00C3F9", "#FF1D1D", "#F028A0"],
            cutout: "75%",
          },
        ],
      };
    },
    createPieChartData() {
      return {
        labels: [
          this.$t("tickets.status-by.undue"),
          this.$t("tickets.status-by.closed"),
          this.$t("tickets.status-by.expired"),
          this.$t("tickets.status-by.cancelled"),
          this.$t("tickets.status-by.draft"),
        ],
        datasets: [
          {
            data: this.createSeriesPie,
            borderRadius: 5,
            spacing: 1,
            backgroundColor: [
              "#FFAF2E",
              "#00C3F9",
              "#FF1D1D",
              "#F028A0",
              "#8E8EA1",
            ],
            cutout: "75%",
          },
        ],
      };
    },
    selected() {
      if (!this.actives.length) return undefined;

      const id = this.actives[0];

      return this.groups.find((group) => group.id === id);
    },
    filter() {
      return (item, search, textKey) =>
        this.removeAccents(item[textKey]).includes(this.removeAccents(search));
    },
  },
  // mounted() {
  //   this.getGroupByUserId();
  // },
  methods: {
    async initData() {
      await this.getGroupsByUserId();
      this.findTicketCategoryActive();
      this.getAllGroup();
      this.getListJob();
      this.searchUnit();
    },
    async findTicketCategoryActive() {
      try {
        const response = await CategoryService.findTicketCategoryActive({});
        if (response) {
          this.typesTicket = response.data;
        } else {
          this.typesTicket = [];
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getGroupByUserId() {
      const response = await GroupService.getGroupsByRoleOfUser();
      if (response.success) {
        this.groups = response.data;
        this.rootGroupId = this.groups[0].groupId;
        const rootGroup = this.groups.find(
          (g) => g.groupId === this.rootGroupId
        );
        // Danh sach dv doi tac
        var listPartners = this.groups.filter(
          (g) => g.groupType === constants.GROUPS.EXTERNAL
        );
        listPartners = listPartners.map((p) => ({
          id: p.groupId,
          name: p.groupName,
          code: p.groupCode,
        }));
        // count external group, save to localstorage
        localStorage.setItem(
          constants.EXTERNAL_GROUP_COUNT,
          listPartners.length
        );
        var nodePartner = {
          id: "",
          name: this.$t("group.partnerLabel"),
          code: "",
          children: listPartners,
        };
        this.items = [this.buildTree(rootGroup)];
        if (listPartners.length > 0) {
          this.items[0]["children"].push(nodePartner);
        }
        this.unit = this.groups.find(
          (group) => group.groupId === this.rootGroupId
        );
        this.unitJob = this.groups.find(
          (group) => group.groupId === this.rootGroupId
        );
        this.actives = [this.rootGroupId];
        this.open = [this.rootGroupId];
      }
    },
    // clear data array
    clearData() {
      this.seriesPie = [];
      this.sendSeriesPie = [];
      this.createSeriesPie = [];
      this.listAllPerformUser = [];
      this.listPerformUser = [];
      this.listAllSendingUser = [];
      this.listSendingUser = [];
      this.valueCardItems = [];
      this.totalClosed = 0;
      this.totalNotDue = 0;
      this.totalOverDue = 0;
      this.totalSendClosed = 0;
      this.totalSendNotDue = 0;
      this.totalSendOverDue = 0;
      this.totalCancelled = 0;
    },
    // List yeu cau don vi
    async getListUnit() {
      this.clearData();
      const pars = {
        groupId: this.parentGroupId,
      };
      const response = await TicketService.getListUnitDashboard(pars);
      response.data.statsTicketUserOfGroup.forEach((x) => {
        this.listAllPerformUser.push({
          userId: x.userId ? x.userId : "",
          username: x.username ? x.username : "",
          countClosed: x.countClosed,
          countNotDue: x.countNotDue,
          countOverDue: x.countOverDue,
          totalCount: x.countClosed + x.countNotDue + x.countOverDue,
        });
        this.totalClosed += x.countClosed;
        this.totalNotDue += x.countNotDue;
        this.totalOverDue += x.countOverDue;
        this.totalCount =
          this.totalClosed + this.totalNotDue + this.totalOverDue;
      });
      this.seriesPie.push(
        this.totalClosed,
        this.totalNotDue,
        this.totalOverDue
      );
      response.data.statsTicketUserOfGroup.slice(0, 5).forEach((x) => {
        this.listPerformUser.push({
          userId: x.userId ? x.userId : "",
          username: x.username ? x.username : "",
          countClosed: x.countClosed,
          countNotDue: x.countNotDue,
          countOverDue: x.countOverDue,
          totalCount: x.countClosed + x.countNotDue + x.countOverDue,
        });
      });
      response.data.statsTicketUserOfCreateGroup.forEach((x) => {
        this.listAllSendingUser.push({
          userId: x.userId,
          username: x.username,
          countCanceled: x.countCanceled,
          countClosed: x.countClosed,
          countNotDue: x.countNotDue,
          countOverDue: x.countOverDue,
          totalCount:
            x.countCanceled + x.countClosed + x.countNotDue + x.countOverDue,
        });
        this.totalSendClosed += x.countClosed;
        this.totalSendNotDue += x.countNotDue;
        this.totalSendOverDue += x.countOverDue;
        this.totalCancelled += x.countCanceled;
        this.totalSendCount =
          this.totalSendClosed +
          this.totalSendNotDue +
          this.totalSendOverDue +
          this.totalCancelled;
      });
      this.sendSeriesPie.push(
        this.totalSendNotDue,
        this.totalSendClosed,
        this.totalSendOverDue,
        this.totalCancelled
      );
      response.data.statsTicketUserOfCreateGroup.slice(0, 5).forEach((x) => {
        this.listSendingUser.push({
          userId: x.userId,
          username: x.username,
          countCanceled: x.countCanceled,
          countClosed: x.countClosed,
          countNotDue: x.countNotDue,
          countOverDue: x.countOverDue,
          totalCount:
            x.countCanceled + x.countClosed + x.countNotDue + x.countOverDue,
        });
      });
      this.listCurrentCreate = response.data.statsCurrentCreateUser;
      this.totalCreateCount =
        this.listCurrentCreate.countOverDue +
        this.listCurrentCreate.countNotDue +
        this.listCurrentCreate.countDraft +
        this.listCurrentCreate.countClosed +
        this.listCurrentCreate.countCanceled;
      this.valueCardItems.push(
        this.listCurrentCreate.countOverDue,
        this.listCurrentCreate.countNotDue,
        this.listCurrentCreate.countDraft
      );
      this.valueCardItems.forEach((x, index) => {
        this.cardItems[index].value = x;
      });
      this.createSeriesPie.push(
        this.listCurrentCreate.countNotDue,
        this.listCurrentCreate.countClosed,
        this.listCurrentCreate.countOverDue,
        this.listCurrentCreate.countCanceled,
        this.listCurrentCreate.countDraft
      );
    },
    // List trung tam nhan viec
    async getListJob() {
      const pars = {
        groupId: this.parentGroupId,
      };
      const response = await TicketService.getListJobs(pars);
      this.listJobs = response.data.data;
    },
    // Build cay don vi
    buildTree(group) {
      const childs = this.groups.filter(
        (g) => g.parentGroupId === group.groupId
      );
      const dataChild = [];
      childs.map((g) => dataChild.push(this.buildTree(g)));
      return {
        id: group.groupId,
        name: group.groupName,
        code: group.groupCode,
        children: dataChild,
      };
    },
    closeDialog() {
      this.actives = [this.unit.groupId];
      this.menuTreeUnit
        ? (this.menuTreeUnit = !this.menuTreeUnit)
        : (this.menuJobTreeUnit = !this.menuJobTreeUnit);
    },
    onSubmit() {
      if (!this.selectedNode.length) return undefined;
      const groupId = this.selectedNode[this.selectedNode.length - 1];
      if (groupId === this.unit.groupId) {
        return;
      }
      this.unit = this.groups.find((group) => group.groupId === groupId);
      this.menuTreeUnit = !this.menuTreeUnit;
      this.searchUnit();
    },
    onJobSubmit() {
      if (!this.selectedNode.length) return undefined;
      const groupId = this.selectedNode[this.selectedNode.length - 1];
      if (groupId === this.unitJob.groupId) {
        return;
      }
      this.unitJob = this.groups.find((group) => group.groupId === groupId);
      this.menuJobTreeUnit = !this.menuJobTreeUnit;
      this.searchJobUnit();
    },
    async searchUnit() {
      this.parentGroupId = this.unit.groupId;
      if (!this.parentGroupId) {
        await this.getGroupByUserId();
        this.parentGroupId = this.unit.groupId;
      }
      await this.getListUnit();
    },
    async searchJobUnit() {
      this.parentGroupId = this.unitJob.groupId;
      if (!this.parentGroupId) {
        await this.getGroupByUserId();
        this.parentGroupId = this.unitJob.groupId;
      }
      await this.getListJob();
    },
    clickOnNode(node) {
      if (node.length === 0) {
        this.actives = this.selectedNode;
        return;
      }
      this.selectedNode = node;
      this.parentGroupId = node[0];
    },
    expandListUser() {
      this.isActiveCollapseItem = !this.isActiveCollapseItem;
      if (this.isActiveCollapseItem) {
        this.listPerformUser = this.listAllPerformUser;
      } else {
        this.listPerformUser = this.listAllPerformUser.slice(0, 5);
      }
    },
    expandSendListUser() {
      this.isActiveCollapseSendItem = !this.isActiveCollapseSendItem;
      if (this.isActiveCollapseSendItem) {
        this.listSendingUser = this.listAllSendingUser;
      } else {
        this.listSendingUser = this.listAllSendingUser.slice(0, 5);
      }
    },
    getTextDeallineByExpectEndDate(expectEndDate) {
      const currentDate = moment().format();
      const expectDate = moment.utc(expectEndDate).local().format();
      const checkTime = moment(currentDate).diff(expectDate, "seconds");
      if (checkTime > 0) {
        return `Trễ ${secondsToHm(checkTime)}`;
      } else if (checkTime < 0) {
        return `Còn ${secondsToHm(Math.abs(checkTime))}`;
      }
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
    async getAllGroup() {
      this.allGroups = await StorageService.getAllGroup();
    },
    async getGroupsByUserId() {
      try {
        const response = await GroupService.getGroupsByUserId();
        if (response) {
          this.groupsByUserId = response.data;
          this.formSearch.groupSelected = response.data[0];
          this.getUsersFromGroupId();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getUsersFromGroupId() {
      try {
        const pars = { id: this.formSearch.groupSelected.groupId };
        const response = await UserService.getUsersFromGroupId(pars);
        if (response) {
          this.usersByGroupId = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async updateAssignTo(val) {
      this.closeOnContent = true;
      try {
        this.loading = true;
        const pars = {
          id: this.selectedItem.id,
          note: this.$t("tickets.messages.forward-user"),
          userId: val.userId,
        };
        await TicketService.forwardTicketUser(pars);
        this.getList();
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: "tickets.messages.forward-user-success",
        });
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.selectedItem = null;
        this.loading = false;
      }
    },
    // action forward
    async selectedGroup(val) {
      try {
        this.loading = true;
        if (this.selectedItemForward.groupId !== val[0].groupId) {
          const pars = {
            id: this.selectedItemForward.id,
            note: this.$t("tickets.messages.forward-group"),
            groupId: val[0].groupId,
          };
          await TicketService.forwardTicketGroup(pars);
          this.getList();
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: "tickets.messages.forward-group-success",
          });
        } else {
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.ERROR,
            content: "tickets.messages.forward-group-seft",
          });
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.selectedItemForward = null;
        this.loading = false;
      }
    },
    // popup create new
    showDialogAddNew() {
      this.detailSelected = null;
      this.isUpdateItemSelected = false;
      this.isShowDialogAddNew = true;
    },
    onDeactiveStateActionAssign() {
      this.selectedItem = null;
      this.selectedItemIndex = null;
    },
    getColorActionAssign(val) {
      return this.selectedItem && val.id === this.selectedItem.id
        ? "primary"
        : "darken";
    },
    bindSelectedItem(val, index) {
      this.selectedItem = val;
      this.selectedItemIndex = index;
      this.closeOnContent = false;
    },
    getColorActionForward(val) {
      return this.selectedItemForward && val.id === this.selectedItemForward.id
        ? "primary"
        : "darken";
    },
    onDeactiveStateActionForward() {
      this.selectedItemForward = null;
      this.isShowDialogTreeView = false;
    },
    onShowDialogTreeView(val) {
      this.selectedItemForward = val;
      this.isShowDialogTreeView = true;
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
      background-color: #ff1d1d;
      height: 10px;
      font-size: 8px;
    }
    .notdue-bar {
      background-color: #ffaf2e;
      height: 10px;
      font-size: 8px;
    }
    .closed-bar {
      background-color: #00c3f9;
      height: 10px;
      font-size: 8px;
    }
    .cancelled-bar {
      background-color: #f028a0;
      height: 10px;
      font-size: 8px;
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
</style>
