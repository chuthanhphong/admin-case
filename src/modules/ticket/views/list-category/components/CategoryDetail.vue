<template>
  <v-card class="card-detail card-category-detail" color="white">
    <div v-if="detail">
      <v-card-title class="d-flex justify">
        <v-layout justify-space-between align-center>
          <v-layout align-center>
            <span class="text--subtitle">
              {{ $t("ticket-manager.detail") }}
            </span>
            <v-btn
              v-if="isAdminTicket"
              color="black"
              fab
              icon
              x-small
              :to="{
                name: routeNames.UPDATE_CATEGORY_TICKET,
                params: { id: detail.id },
              }"
              class="mx-2"
            >
              <i class="app-icon icon-pencil black" />
            </v-btn>
            <v-layout v-if="isAdminTicket" align-center>
              <v-btn
                color="black"
                icon
                class="v-icon-active"
                @click="showDialogConfirm(hasDetailActive)"
              >
                <i
                  class="app-icon icon-active"
                  :class="hasDetailActive ? 'blue' : 'black'"
                />
              </v-btn>
              <span class="text--subtitle-3">
                {{
                  hasDetailActive
                    ? $t("ticket-types.inactivate")
                    : $t("ticket-types.active")
                }}
              </span>
            </v-layout>
          </v-layout>
          <v-btn
            v-if="hasDetailActive"
            class="d-flex justify-space-between"
            color="primary"
            rounded
            @click="onShowDialogCreateTicket"
          >
            <vue-feather type="plus-circle" size="25" />
            <span> {{ $t("ticket-manager.create-ticket") }} </span>
          </v-btn>
        </v-layout>
      </v-card-title>
      <div class="wrap-ticket-detail preview-detail">
        <!-- TICKET DETAIL TOP -->
        <div v-if="!hasDetailActive" class="tag-inactive"></div>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <div
              class="
                text-center text--subtitle text-uppercase
                font-weight-bold
                mb-6
              "
              v-bind="attrs"
              v-on="on"
            >
              {{ getTextTruncateView(detail.name, 50) }}
            </div>
          </template>
          {{ detail.name }}
        </v-tooltip>
        <v-card>
          <div class="ticket-detail-top mb-4">
            <div class="row">
              <v-card-title>
                <div class="col-md-6 px-3">
                  <label class="text--label-2 text-uppercase">
                    {{ $t("tickets.labels.department-processing") }}:
                  </label>
                  <v-tooltip top max-width="250">
                    <template v-slot:activator="{ on, attrs }">
                      <div class="text--label-1 px-2">
                        <span
                          class=""
                          v-bind="attrs"
                          v-on="on"
                          v-html="getTextTruncateView(groupName, 50)"
                        ></span>
                      </div>
                    </template>
                    <div class="text--label-1">
                      <span class="" v-html="groupName"></span>
                    </div>
                  </v-tooltip>
                </div>
                <div v-if="detail.description" class="col-md-5">
                  <label class="text--label-2 text-uppercase">
                    {{ $t("ticket-manager.description") }}:
                  </label>
                  <v-tooltip top max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <div class="text--label-1 pl-2" v-bind="attrs" v-on="on">
                        {{ getTextTruncateView(detail.description, 50) }}
                      </div>
                    </template>
                    {{ detail.description }}
                  </v-tooltip>
                </div>
              </v-card-title>
              <v-expand-transition>
                <div v-show="showbtn" class="row ma-0 ml-4">
                  <div class="form-group col-12 col-md-6">
                    <label class="text--label-2 text-uppercase">
                      {{ $t("ticket-manager.close-request") }}:
                    </label>
                    <div class="text--label-1 pl-2">
                      {{
                        hasCloseDuration
                          ? getCloseDurationType(detail.closeDuration)
                          : this.$t("close-requests.created")
                      }}
                    </div>
                  </div>
                  <div
                    v-if="hasApproveFalg"
                    class="form-group col-12 col-md-6 pa-1 pt-3"
                  >
                    <v-layout column>
                      <label class="text--label-2 text-uppercase">
                        {{ $t("ticket-manager.approved") }}:
                      </label>
                      <v-layout row class="ma-1">
                        <v-chip
                          v-if="detail.sendFlag === 1"
                          color="#CCF3FE"
                          class="card-info-detail ma-1"
                        >
                          {{ $t("create-new") }}
                        </v-chip>
                        <v-chip
                          v-if="detail.receiveFlag === 1"
                          color="#CCF3FE"
                          class="card-info-detail ma-2"
                        >
                          {{ $t("receive") }}
                        </v-chip>
                        <v-chip
                          v-if="detail.forwardFlag === 1"
                          color="#CCF3FE"
                          class="card-info-detail ma-1"
                        >
                          {{ $t("move-department") }}
                        </v-chip>
                        <v-chip
                          v-if="detail.finishFlag === 1"
                          color="#CCF3FE"
                          class="card-info-detail ma-1"
                        >
                          {{ $t("completed") }}
                        </v-chip>
                      </v-layout>
                    </v-layout>
                  </div>
                  <div
                    v-if="detail.estDuration"
                    class="form-group col-12 col-md-6"
                  >
                    <label class="text--label-2 text-uppercase">
                      {{ $t("ticket-manager.execution-time") }}:
                    </label>
                    <div class="text--label-1 pl-2">
                      {{ detail.estDuration }} {{ $t("hour") }}
                    </div>
                  </div>
                </div>
              </v-expand-transition>
            </div>
            <v-card-actions class="row" style="justify-content: end">
              <v-btn
                v-if="showExpandHeaderDetail"
                color="black"
                icon
                class="mx-2"
                @click="showbtn = !showbtn"
              >
                <v-icon class="v-icon-chevron">
                  {{ showbtn ? "mdi-chevron-up" : "mdi-chevron-down" }}
                </v-icon>
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
        <v-divider />
        <!-- TICKET DETAIL -->
        <div class="ticket-detail mt-4" aria-readonly="">
          <div>
            <div v-if="detail.categoryAttributeDtos.length > 0">
              <v-layout
                v-for="(typeAttributes, index) in detail.categoryAttributeDtos"
                :key="index"
                column
              >
                <gen-input-by-value-type
                  :type-attributes="typeAttributes"
                  :index="index"
                />
              </v-layout>
            </div>
          </div>
        </div>
      </div>
    </div>
    <dialog-confirm
      v-model="isShowDialogConfirm"
      :message="message"
      :on-cancel="onCancelConfirm"
      :on-accept="onAcceptConfirm"
    />
    <base-preload :dialog="loading" :reload-detail="onReloadDetailCategory" />
  </v-card>
</template>

<script>
import {
  definedValueType,
  getDateNow,
} from "@/modules/ticket/helpers/ticketUtils";
import { FormUtils } from "@/helpers/formUtils";
// component
import GenInputByValueType from "./GenInputByValueType.vue";
import DialogConfirm from "@/components/dialog/DialogConfirm.vue";
// Libs
import { getTextTruncate } from "@/modules/ticket/helpers/ticketUtils";
import moment from "moment";
import { mapActions } from "vuex";
// Mixins
import mixinTypeValue from "@/modules/ticket/mixins/mixinTypeValue";
import mixinFindUserRole from "@/modules/ticket/mixins/mixinFindUserRole";

// Services
import { CategoryService } from "@/modules/ticket/services/categoryService";
import { GroupService } from "@/services/groupService";
import constants from "@/constants";
import routeNames from "@/modules/ticket/router/routeNames";

export default {
  components: { DialogConfirm, GenInputByValueType },
  mixins: [mixinTypeValue, mixinFindUserRole],
  props: {
    typeTicketId: {
      type: Number,
      default: undefined,
    },
    reloadDetailCategory: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
    return {
      currentDate: moment().format("DD/MM/YYYY"),
      detail: null,
      categoryId: null,
      routeNames,
      groups: [],
      typeActionActive: 0,
      isShowDialogConfirm: false,
      titleConfirm: "",
      message: "",
      attributeDateFm: "",
      definedValueType: definedValueType,

      loading: false,
      dataTicket: true,
      showbtn: false,
      checkValueDetail: false,
      isShowDialogAddNew: false,

      ticketTypeActionConst: constants.TICKET_TYPE_ACTION,
      textActionActived: this.$t("saves.actived"),
    };
  },
  computed: {
    groupName() {
      const categoryGroup = this.groups.find(
        (g) => g.groupId === this.detail.groupId
      );
      if (categoryGroup) return categoryGroup.groupName;
      return "";
    },
    hasDetailActive() {
      return this.detail && this.detail.status === 1;
    },
    hasCloseDuration() {
      return typeof this.detail.closeDuration !== "undefined";
    },
    hasApproveFalg() {
      return (
        this.detail &&
        (this.detail.sendFlag ||
          this.detail.forwardFlag ||
          this.detail.finishFlag ||
          this.detail.receiveFlag)
      );
    },
    showExpandHeaderDetail() {
      return (
        this.detail.estDuration ||
        this.hasApproveFalg ||
        this.detail.description
      );
    },
    // admin
    isAdminTicket() {
      const groupIds = this.findAdminGroupIds;
      if (groupIds && groupIds.length > 0) {
        return true;
      }

      return false;
    },
  },
  watch: {
    async typeTicketId(id) {
      if (id) {
        this.showbtn = false;
        await this.getCategoryDetail(id);
      }
    },
  },
  async created() {
    await this.getAllGroup();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    confirmTypeValue(val, mapVal) {
      return val === mapVal;
    },
    onReloadDetailCategory(val) {
      this.reloadDetailCategory = val;
    },
    getCloseDurationType(val) {
      switch (val) {
        case 0:
          return this.$t("close-requests.auto");
        default:
          return val + " Giờ";
      }
    },
    async getCategoryDetail(id) {
      const dataDetail = await CategoryService.getCategoryDetail(id);
      if (dataDetail) {
        this.detail = dataDetail.data;
      } else {
        this.detail = null;
      }
    },
    isNumber(evt) {
      return FormUtils.isNumberTicket(evt);
    },
    allowedDates(val) {
      return val >= getDateNow();
    },
    isToday(date) {
      if (getDateNow() === date) {
        return true;
      }
      return false;
    },
    allowedMinutes() {},
    onPasteNumber(evt) {
      const val = FormUtils.isOnPasteOnlyNumberAndMaximum(
        evt,
        this.maximumSmallText
      );
      if (val !== null) {
        this.typeAttributes.attributeValue = val;
      }
    },
    async getAllGroup() {
      const dataGroups = await GroupService.getAllGroup();
      if (dataGroups) {
        this.groups = dataGroups.data.data;
      } else {
        this.groups = [];
      }
    },
    onAcceptConfirm() {
      this.isShowDialogConfirm = false;
      if (this.hasDetailActive) {
        // call in active because detail is active
        this.inactiveTicketType();
      } else {
        // call active because detail is inactive
        this.activeTicketType();
      }
    },
    async inactiveTicketType() {
      try {
        this.loading = true;
        const requestPars = { id: this.detail.id };
        await CategoryService.inactiveCategory(requestPars);
        this.getCategoryDetail(this.detail.id);
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: "ticket-types.inactive-success",
        });
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          key: false,
        });
      } finally {
        this.loading = false;
      }
    },
    async activeTicketType() {
      try {
        this.loading = true;
        const requestPars = {
          id: this.detail.id,
        };
        await CategoryService.activeCategory(requestPars);
        this.typeActionActive = -1;
        this.getCategoryDetail(this.detail.id);
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: "ticket-types.active-success",
        });
      } catch (error) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    async showDialogConfirm(active) {
      this.message = this.getMessageConfirmByTypeAction(active);
      this.isShowDialogConfirm = true;
    },
    getMessageConfirmByTypeAction(active) {
      if (active) {
        return this.$t("ticket-types.msg-confirm-inactive");
      } else {
        return this.$t("ticket-types.msg-confirm-actived");
      }
    },
    onCancelConfirm() {
      this.isShowDialogConfirm = false;
      this.typeActionActive = -1;
    },
    generateOptions(value) {
      return value.split(",");
    },
    onShowDialogCreateTicket() {
      this.$emit("show-dialog-create-ticket", this.detail);
    },
    getTextTruncateView(val, size) {
      return getTextTruncate(val, size);
    },
  },
};
</script>

<style lang="scss" scoped></style>
