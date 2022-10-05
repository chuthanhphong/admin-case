<template>
  <v-scroll-y-transition v-if="isShow">
    <v-layout column>
      <v-data-table
        hide-default-header
        hide-default-footer
        class="simple-body-set-size no-set-minh"
        :class="`table-${tableType}`"
        :headers="headers"
        :fixed-header="true"
        :no-data-text="$t('noData')"
        :items="items"
        :items-per-page="countItems"
      >
        <template v-slot:[`item.id`]="{ item }">
          <td class="td-size-6">{{ item.id }}</td>
        </template>
        <template v-slot:[`item.createUserName`]="{ item }">
          <td class="td-size-10 text-center">
            <v-layout justify-center align-center>
              <div class="pos-rel">
                <v-hover v-slot="{ hover }">
                  <v-btn fab x-small color="primary">
                    <span class="white--text text-h6 text-uppercase">
                      {{ item.createUserName[0] }}
                    </span>
                    <PopupUserInfoViewHover
                      v-if="hover"
                      :user-info="item.createUserInfo"
                      :is-chevron-left="true"
                    />
                  </v-btn>
                </v-hover>
              </div>
            </v-layout>
          </td>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <td class="td-size-14">
            <div class="box-ticket-name d-flex align-center">
              <div class="mr-4">
                <div :class="tableType == 'list' ? 'd-none' : ''">
                  <b>
                    {{ item.id }}
                  </b>
                </div>
                <v-layout class="link">
                  <div class="text--body-5 task-name-hover cursor-pointer" @click="onGotoDetailTicket(item)">
                    {{ getTextTruncateView(item.name, 30) }}
                  </div>
                  <div
                    v-if="item.amountTask > 0"
                    class="d-flex align-center ml-3"
                  >
                    <img src="@/assets/icons/icon-parent.svg" alt="" />
                    <span class="greya7--text">{{ item.amountTask }}</span>
                  </div>
                </v-layout>
                <div class="text--overlined greya7--text">
                  {{ formatDateView(item.createdDate) }}
                </div>
              </div>
            </div>
          </td>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <td class="td-size-10">
            <v-layout align-center>
              <v-avatar
                :color="getColorDotByStatus(item.status)"
                size="15"
                class="mr-1"
              ></v-avatar>
              <span
                class="text-center mr-1"
                :class="getColorTextByStatus(item.status)"
                v-html="getTextByStatus(item.status)"
              >
              </span>
            </v-layout>
          </td>
        </template>
        <template v-slot:[`item.progress`]="{ item }">
          <td class="td-size-12">
            <v-layout align-center class="mr-4">
              <v-progress-linear
                height="8"
                rounded
                background-opacity="1"
                color="#E7ECF1"
                style="width: 90px"
                :value="item.progress ? item.progress : 0"
                :class="getClassColorProgressByStatus(item.status)"
                @click="onShowDialogUpdateProgress(item)"
              >
              </v-progress-linear>
              <span class="ml-2">
                {{ item.progress ? item.progress : 0 }}%
              </span>
            </v-layout>
          </td>
        </template>
        <template v-slot:[`item.priority`]="{ item }">
          <td class="td-size-10 text-center">
            <v-layout justify-center>
              <i
                class="app-icon icon-flash"
                :class="getColorByPriority(item.priority)"
              />
            </v-layout>
          </td>
        </template>
        <template v-slot:[`item.ticketCateName`]="{ item }">
          <td class="td-size-14">
            {{ getTextTruncateView(item.ticketCateName, 15) }}
          </td>
        </template>
        <template v-slot:[`item.userName`]="{ item }">
          <td class="td-size-10 text-center">
            <v-layout
              v-if="hasAttributeUserName(item)"
              justify-center
              align-center
            >
              <div class="pos-rel">
                <v-hover v-slot="{ hover }">
                  <v-btn fab x-small color="primary">
                    <span class="white--text text-h6 text-uppercase">
                      {{ item.userName[0] }}
                    </span>
                    <PopupUserInfoViewHover
                      v-if="hover"
                      :user-info="item.userInfo"
                      :is-chevron-left="false"
                    />
                  </v-btn>
                </v-hover>
              </div>
            </v-layout>
            <v-btn v-else class="border-dashed-2" outlined fab x-small>
              <i class="app-icon icon-personal dark" />
            </v-btn>
          </td>
        </template>
        <template v-slot:[`item.groupName`]="{ item }">
          <td class="td-size-12">
            {{ getTextTruncateView(item.groupName, 20) }}
          </td>
        </template>
      </v-data-table>
      <v-layout v-if="isLoadMore" justify-end align-center class="mr-4 mb-3">
        <v-btn text class="text--body mr-2" @click="onLoadMore">
          {{ $t("tickets.labels.view-more") }}
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </v-layout>
      <v-layout v-if="isLoadStart" justify-end align-center class="mr-4 mb-3">
        <v-btn text class="text--body mr-2" @click="onLoadStart">
          {{ $t("tickets.labels.collect") }}
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
      </v-layout>
    </v-layout>
  </v-scroll-y-transition>
</template>
<script>
import PopupUserInfoViewHover from "@/modules/ticket/views/components/PopupUserInfoViewHover";

import routePaths from "@/modules/ticket/router/routePaths";
import {
  formatDate,
  getTextTruncate,
  definedTicketDetailRedirect,
  FORMAT_DATE_TIME_TICKET,
  PAGE_SIZE_GROUP,
  PAGE_SIZE_GROUP_VIEW_MORE,
  definedStatus,
  selectGroupTicketType,
} from "@/modules/ticket/helpers/ticketUtils";
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import { FormUtils } from "@/helpers/formUtils";
import { mapState } from "vuex";

// services
import { TicketService } from "@/modules/ticket/services/ticketService";

export default {
  components: {
    PopupUserInfoViewHover,
  },
  mixins: [mixinStatusAndPriority],
  props: {
    headers: {
      type: Array,
      default: undefined,
    },
    tableType: {
      type: String,
      default: "list",
    },
    ticketsGroupByUser: {
      type: Object,
      default: undefined,
    },
    indexTable: {
      type: Number,
      default: undefined,
    },
    activeIndexs: {
      type: Array,
      default: undefined,
    },
    formSearch: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      items: [],
      page: 1,
      pageSize: PAGE_SIZE_GROUP,
    };
  },
  computed: {
    ...mapState("layout", ["userInfo"]),
    isShow() {
      return (
        this.activeIndexs.length > 0 &&
        this.activeIndexs.includes(this.indexTable)
      );
    },
    countItems() {
      return this.items.length;
    },
    isLoadMore() {
      return this.countItems < this.ticketsGroupByUser.totalTicket;
    },
    hasAttributeUserId() {
      return typeof this.ticketsGroupByUser.userId !== "undefined";
    },
    isLoadStart() {
      return (
        this.countItems === this.ticketsGroupByUser.totalTicket &&
        this.countItems > PAGE_SIZE_GROUP
      );
    },
  },
  watch: {
    ticketsGroupByUser(val) {
      this.items = val.ticketCustomDtos;
    },
  },
  created() {
    if (this.ticketsGroupByUser) {
      this.items = this.ticketsGroupByUser.ticketCustomDtos;
    }
  },
  methods: {
    onLoadMore() {
      if (this.isLoadMore) {
        this.page = 1;
        this.pageSize = PAGE_SIZE_GROUP_VIEW_MORE;
        this.getTicketsOfUser();
      }
    },
    async getTicketsOfUser() {
      const pars = this.bindRequestPars();
      const response = await TicketService.findDetailTicketsOfUser(pars);
      if (response && response.data.length > 0) {
        this.items = response.data;
      }
    },
    bindRequestPars() {
      const pars = {
        page: this.page,
        pageSize: this.pageSize,
      };

      if (
        this.formSearch.groupTicketSelected === selectGroupTicketType.receive
      ) {
        pars["groupId"] = this.formSearch.groupSelected.groupId;
      } else if (
        this.formSearch.groupTicketSelected === selectGroupTicketType.send
      ) {
        pars["createGroupId"] = this.formSearch.groupSelected.groupId;
      }

      if (this.formSearch.name && FormUtils.isOriginal(this.formSearch.name)) {
        pars["id"] = parseInt(this.formSearch.name);
      } else if (this.formSearch.name) {
        pars["name"] = this.formSearch.name;
      }

      if (
        this.formSearch.status &&
        this.formSearch.status.length > 0 &&
        this.isCheckStatusAllNot(this.formSearch.status)
      ) {
        pars["strStatus"] = this.formSearch.status.join(",");
      }

      if (this.formSearch.dates && this.formSearch.dates.length >= 2) {
        pars["fromDate"] = this.formSearch.dates[0];
        pars["toDate"] = this.formSearch.dates[1];
      }

      if (this.hasAttributeUserId) {
        pars["userId"] = this.ticketsGroupByUser.userId;
      }

      return pars;
    },
    onLoadStart() {
      if (!this.isLoadMore) {
        this.page = 1;
        this.pageSize = PAGE_SIZE_GROUP;
        this.getTicketsOfUser();
      }
    },
    isCheckStatusAllNot(arrCheck) {
      const arrAll = [definedStatus.all];
      var isSame =
        arrCheck.length === arrAll.length &&
        arrCheck.every((element, index) => {
          return element === arrAll[index];
        });
      return !isSame;
    },
    onGotoDetailTicket(item) {
      if (this.isNoCreatedAndStatusDraft(item)) return;

      this.$router.push({
        path: routePaths.DETAIL_TICKET_PATH,
        query: {
          id: item.id,
          typeRedirect: definedTicketDetailRedirect.group,
        },
      });
    },
    isNoCreatedAndStatusDraft(data) {
      return (
        data.createUserId !== this.userInfo.userId &&
        data.status === definedStatus.draft
      );
    },
    hasAttributeUserName(item) {
      return typeof item.userName !== "undefined";
    },
    getTextTruncateView(val, size) {
      return getTextTruncate(val, size);
    },
    formatDateView(date) {
      return formatDate(date, FORMAT_DATE_TIME_TICKET);
    },
    onShowDialogUpdateProgress(item) {
      console.log(item);
      this.$emit('on-show-dialog-update-progress', item);
    },
    onShowConfirmComplete(item) {
      this.$emit('on-show-confirm-complete', item);
    }
  },
};
</script>
