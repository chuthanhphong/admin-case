<template>
  <div class="container container-ticket">
    <h5 class="title-page text-primary">{{ titlePage }}</h5>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <div class="row pt-2">
        <type-info
          :form-data="formData"
          :is-show-select-approve-el="isShowSelectApproveEl"
          :is-show-est-duration-el="isShowEstDurationEl"
          :is-show-assign-to-method-el="isShowAssignToMethodEl"
          :is-show-permission-view-el="isShowPermissionViewEl"
          :is-update="isUpdate"
          @show-dialog-tree-view="showDialogTreeView"
        />
        <type-design :form-data="formData" :is-update="isUpdate" />

        <v-col cols="12" class="white fixed-botton-actions">
          <v-layout justify-space-between align-center>
            <v-layout>
              <button-icon
                :text-action="$t('approved')"
                text-icon="icon-approved"
                :text-tooltip="$t('tickets.tooltips.btn-approved')"
                :is-actived="isShowSelectApproveEl"
                :on-click="changeStateApprove"
              />
              <button-icon
                :text-action="$t('duration')"
                text-icon="icon-duration"
                :text-tooltip="$t('tickets.tooltips.btn-duration')"
                :is-actived="isShowEstDurationEl"
                :on-click="changeStateEstDuration"
              />
              <button-icon
                :text-action="$t('assign-to-method')"
                text-icon="icon-assigned-to"
                :text-tooltip="$t('tickets.tooltips.btn-assign-to-method')"
                :is-actived="isShowAssignToMethodEl"
                :is-disabled="true"
                :on-click="changeStateAssignToMethod"
              />
              <button-icon
                :text-action="$t('permission-view')"
                text-icon="icon-permission-view"
                :text-tooltip="$t('tickets.tooltips.btn-permission-view')"
                :is-actived="isShowPermissionViewEl"
                :is-disabled="true"
                :on-click="changeStatePermissionView"
              />
              <v-layout column align-center />
            </v-layout>
            <v-layout justify-end>
              <v-btn
                v-if="!isUpdate"
                color="primary"
                rounded
                outlined
                elevation="1"
                class="w-160 py-5 mr-0 mr-md-3 bg-white"
                :disabled="invalid"
                @click="showDialogConfirm(ticketTypeActionConst.SAVE_DRAFT)"
              >
                {{ $t("saves.draft") }}
              </v-btn>
              <v-btn
                v-if="isShowActionDeactivate"
                color="error"
                rounded
                outlined
                elevation="1"
                class="w-160 py-5 mr-0 mr-md-3 bg-white error--text"
                @click="showDialogConfirm(ticketTypeActionConst.INACTIVE)"
              >
                {{ $t("ticket-types.inactivate") }}
              </v-btn>
              <v-btn
                color="primary"
                rounded
                outlined
                elevation="1"
                class="w-160 py-5 mr-0 mr-md-3 bg-white"
                @click="showDialogConfirm(ticketTypeActionConst.CANCEL)"
              >
                <span class="text-primary">{{ $t("cancel") }}</span>
              </v-btn>
              <v-btn
                color="primary"
                rounded
                class="w-160 py-5"
                :disabled="invalid"
                @click="showDialogConfirm(ticketTypeActionConst.SAVE_ACTIVED)"
              >
                {{ textActionActived }}
              </v-btn>
            </v-layout>
          </v-layout>
        </v-col>
      </div>
    </validation-observer>

    <!-- dialog confirm -->
    <dialog-confirm
      v-model="isShowDialogConfirm"
      :message="message"
      :on-cancel="onCancelConfirm"
      :on-accept="onAcceptConfirm"
    />

    <!-- dialog tree view -->
    <dialog-tree-view
      v-model="isShowDialogTreeView"
      :title="$t('tickets.labels.unit-request-perform')"
      :group-id="formData.groupId"
      :all-groups="allGroups"
      @selected-group="selectedGroup"
    />
  </div>
</template>

<script>
// Libs
import { mapActions } from "vuex";

// Components
import TypeDesign from "./component/TypeDesign.vue";
import TypeInfo from "./component/TypeInfo.vue";
import ButtonIcon from "./component/ButtonIcon.vue";
import DialogConfirm from "@/components/dialog/DialogConfirm.vue";
import DialogTreeView from "@/modules/ticket/views/components/DialogTreeView.vue";
// Services
import { CategoryService } from "@/modules/ticket/services/categoryService";
import { GroupService } from "@/services/groupService";

import ticketRoute from "@/modules/ticket/router/routePaths";
import constants from "@/constants";
import { parseValueWithTypeBoolean } from "@/modules/ticket/helpers/ticketUtils";

const initForm = {
  name: "",
  description: "",
  groupId: null,
  groupName: null,
  closeDurationType: "",
  closeDuration: "",
  sendFlag: false,
  receiveFlag: false,
  forwardFlag: false,
  finishFlag: false,
  receiveDuration: "",
  estDuration: "",
  categoryAttributeDtos: [],
  errors: [],
};
export default {
  components: {
    TypeInfo,
    TypeDesign,
    ButtonIcon,
    DialogConfirm,
    DialogTreeView,
  },
  data() {
    return {
      ticketTypeActionConst: constants.TICKET_TYPE_ACTION,
      formData: { ...initForm },
      categoryId: null,
      titlePage: this.$t("ticket-types.create"),
      isUpdate: false,

      allGroups: [],

      isShowSelectApproveEl: false,
      isShowEstDurationEl: false,
      isShowAssignToMethodEl: false,
      isShowPermissionViewEl: false,

      typeActionActive: 0,
      isShowDialogConfirm: false,
      message: "",

      isShowDialogTreeView: false,

      textActionActived: this.$t("saves.actived"),
      isShowActionDeactivate: false,
    };
  },
  computed: {},
  watch: {
    formData(val) {},
  },
  async created() {
    this.resetFormData();
    const categoryId = this.$route.params.id;
    await this.getAllGroup();
    if (categoryId) {
      this.titlePage = this.$t("ticket-types.update");
      await this.getCategoryTicketDetail(categoryId);
    }
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    async getAllGroup() {
      const response = await GroupService.getAllGroup();
      if (response) {
        this.allGroups = response.data.data;
      }
    },
    async getCategoryTicketDetail(categoryId) {
      this.categoryId = categoryId;
      const categoryData = await CategoryService.getCategoryDetail(categoryId);
      Object.assign(this.formData, categoryData.data);
      this.isUpdate = true;
      const itemGroup = this.allGroups.find(
        (x) => x.groupId === this.formData.groupId
      );
      if (itemGroup) {
        this.formData.groupName = itemGroup.groupName;
      }
      if (this.isUpdate && this.formData.status === 1) {
        this.textActionActived = this.$t("saveLabel");
        this.isShowActionDeactivate = true;
      }

      if (this.isUpdate) {
        this.parseDetailWithStateUpdate(categoryData.data);
      }
    },
    parseDetailWithStateUpdate(data) {
      if (typeof data.closeDuration !== "undefined") {
        this.parseDetailOfCloseDuration(data.closeDuration);
      } else {
        this.formData.closeDurationType = constants.CLOSE_DURATION_TYPES.MANUAL;
      }

      if (typeof data.estDuration !== "undefined" && data.estDuration >= 0) {
        this.isShowEstDurationEl = true;
      }

      if (
        data.sendFlag === 1 ||
        data.forwardFlag === 1 ||
        data.finishFlag === 1
      ) {
        this.isShowSelectApproveEl = true;
      }
    },
    parseDetailOfCloseDuration(val) {
      if (val && val === 0) {
        this.formData.closeDurationType = constants.CLOSE_DURATION_TYPES.AUTO;
      } else if (val && val > 0) {
        this.formData.closeDurationType = constants.CLOSE_DURATION_TYPES.HOUR;
        this.formData.closeDuration = val;
      }
    },
    async showDialogConfirm(type) {
      this.typeActionActive = type;
      this.message = this.getMessageConfirmByTypeAction(type);
      this.isShowDialogConfirm = true;
    },
    getMessageConfirmByTypeAction(type) {
      switch (type) {
        case constants.TICKET_TYPE_ACTION.SAVE_ACTIVED:
          return this.getMessageConfirmByActionActived();
        case constants.TICKET_TYPE_ACTION.CANCEL:
          return this.$t("ticket-types.msg-confirm-cancel");
        case constants.TICKET_TYPE_ACTION.SAVE_DRAFT:
          return this.$t("ticket-types.msg-confirm-save-draft");
        case constants.TICKET_TYPE_ACTION.INACTIVE:
          return this.$t("ticket-types.msg-confirm-inactive");
        default:
          return "";
      }
    },
    getMessageConfirmByActionActived() {
      if (this.isUpdate && this.formData.status === 1) {
        return this.$t("ticket-types.msg-confirm-update");
      }

      return this.$t("ticket-types.msg-confirm-save-actived");
    },
    onCancelConfirm() {
      this.isShowDialogConfirm = false;
      this.typeActionActive = -1;
    },
    onAcceptConfirm() {
      this.isShowDialogConfirm = false;
      if (this.typeActionActive === constants.TICKET_TYPE_ACTION.SAVE_ACTIVED) {
        this.createOrUpdateTicketType();
      } else if (
        this.typeActionActive === constants.TICKET_TYPE_ACTION.SAVE_DRAFT
      ) {
        this.createOrUpdateTicketType();
      } else if (
        this.typeActionActive === constants.TICKET_TYPE_ACTION.CANCEL
      ) {
        this.$router.replace(`${ticketRoute.CATEGORIES_TICKET_PATH}`);
      } else if (
        this.typeActionActive === constants.TICKET_TYPE_ACTION.INACTIVE
      ) {
        this.inactiveTicketType();
      }
    },
    createOrUpdateTicketType() {
      if (this.isUpdate) {
        this.updateTicketType();
      } else {
        this.createTicketType();
      }
    },
    async createTicketType() {
      try {
        this.loading = true;
        const valid = true; // this.checkValidCategoryAttribute();
        if (valid) {
          const requestPars = this.prepareRequestPars(this.formData);
          await CategoryService.createCategory(requestPars);
          const keyContent = this.getKeyContentNotifyCreateTicketTypeSuccess(
            this.typeActionActive
          );
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: keyContent,
          });
          this.typeActionActive = -1;
          setTimeout(() => {
            this.$router.push(`${ticketRoute.CATEGORIES_TICKET_PATH}`);
          }, constants.TIME_OUT);
        } else {
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.ERROR,
            content: "tickets.duplicate-data-name",
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
        this.loading = false;
      }
    },
    checkValidCategoryAttribute() {
      const categoryAttributes = this.formData.categoryAttributeDtos;
      const groupByType = categoryAttributes.reduce((r, a) => {
        r[a.valueType] = r[a.valueType] || [];
        r[a.valueType].push(a);
        return r;
      }, Object.create(null));

      let result = true;
      var keys = Object.keys(groupByType);
      for (var i = 0; i < keys.length; i++) {
        const arrVal = groupByType[keys[i]];
        if (arrVal.length >= 2) {
          // check duplicate title
          var nameArr = arrVal.map((item) => {
            return item.name.trim();
          });
          var isDuplicate = nameArr.some((item, idx) => {
            return nameArr.indexOf(item) !== idx;
          });
          if (isDuplicate) {
            result = false;
          }
        }
      }

      return result;
    },
    getKeyContentNotifyCreateTicketTypeSuccess(type) {
      if (type === constants.TICKET_TYPE_ACTION.SAVE_DRAFT) {
        return this.$t("ticket-types.save-draft-success");
      }

      return this.$t("ticket-types.created-success");
    },
    async updateTicketType() {
      try {
        this.loading = true;
        const valid = true; // this.checkValidCategoryAttribute();
        if (valid) {
          const requestPars = this.prepareRequestPars(this.formData);
          requestPars["id"] = this.categoryId;
          await CategoryService.editCategory(requestPars);
          this.typeActionActive = -1;
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: this.$t("ticket-types.updated-success"),
          });
          setTimeout(() => {
            this.$router.push(`${ticketRoute.CATEGORIES_TICKET_PATH}`);
          }, constants.TIME_OUT);
        } else {
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.ERROR,
            content: "tickets.duplicate-data-name",
          });
        }
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
    async inactiveTicketType() {
      try {
        this.loading = true;
        const requestPars = { id: this.categoryId };
        await CategoryService.inactiveCategory(requestPars);
        this.typeActionActive = -1;
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: "ticket-types.inactive-success",
        });

        setTimeout(() => {
          this.$router.push(`${ticketRoute.CATEGORIES_TICKET_PATH}`);
        }, constants.TIME_OUT);
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
    prepareRequestPars(data) {
      const requestPars = {};
      requestPars["name"] = data.name;
      requestPars["groupId"] = data.groupId;
      if (data.description) {
        requestPars["description"] = data.description;
      }
      if (
        data.closeDurationType === constants.CLOSE_DURATION_TYPES.HOUR &&
        this.formData.closeDuration
      ) {
        requestPars["closeDuration"] = this.formData.closeDuration;
      } else if (
        data.closeDurationType === constants.CLOSE_DURATION_TYPES.AUTO
      ) {
        requestPars["closeDuration"] = 0;
      } else {
        requestPars["closeDuration"] = null;
      }

      if (this.isShowSelectApproveEl) {
        requestPars["sendFlag"] = parseValueWithTypeBoolean(data.sendFlag);
        requestPars["receiveFlag"] = parseValueWithTypeBoolean(
          data.receiveFlag
        );
        requestPars["forwardFlag"] = parseValueWithTypeBoolean(
          data.forwardFlag
        );
        requestPars["finishFlag"] = parseValueWithTypeBoolean(data.finishFlag);
      } else {
        requestPars["sendFlag"] = null;
        requestPars["receiveFlag"] = null;
        requestPars["forwardFlag"] = null;
        requestPars["finishFlag"] = null;
      }

      if (this.isShowEstDurationEl) {
        requestPars["estDuration"] = parseInt(data.estDuration);
        requestPars["receiveDuration"] = parseInt(data.receiveDuration);
      } else {
        requestPars["estDuration"] = null;
        requestPars["receiveDuration"] = null;
      }

      if (data.categoryAttributeDtos && data.categoryAttributeDtos.length > 0) {
        requestPars["categoryAttributeDtos"] = this.prepareCategoryAttributes(
          data.categoryAttributeDtos
        );
      } else {
        requestPars["categoryAttributeDtos"] = [];
      }

      if (this.typeActionActive === constants.TICKET_TYPE_ACTION.SAVE_ACTIVED) {
        requestPars["status"] = 1;
      }

      return requestPars;
    },
    prepareCategoryAttributes(arrData) {
      const results = [];
      arrData.forEach((e, idx) => {
        const item = {};
        item["name"] = e.name.trim();
        item["valueType"] = e.valueType;
        item["orderNo"] = idx + 1;
        item["inputType"] = parseValueWithTypeBoolean(e.inputType);
        if (
          e.valueType === constants.FORM_TYPE_VALUES.SELECT ||
          e.valueType === constants.FORM_TYPE_VALUES.MULTIPLE_SELECT
        ) {
          item["value"] = e.value;
        }
        results.push(item);
      });

      return results;
    },
    async deleteCategoryTicket() {
      try {
        this.loading = true;
        await CategoryService.deleteCategory({ id: this.formData.id });
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: "ticket-types.deleted-success",
        });
        this.$router.replace(`${ticketRoute.CATEGORIES_TICKET_PATH}`);
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
    changeStateApprove() {
      if (this.isShowSelectApproveEl) {
        this.isShowSelectApproveEl = false;
        this.resetStateApprove();
      } else {
        this.isShowSelectApproveEl = true;
      }
    },
    resetStateApprove() {
      this.formData.sendFlag = false;
      this.formData.receiveFlag = false;
      this.formData.forwardFlag = false;
      this.formData.finishFlag = false;
    },
    changeStateEstDuration() {
      if (this.isShowEstDurationEl) {
        this.isShowEstDurationEl = false;
      } else {
        this.isShowEstDurationEl = true;
      }
    },
    changeStateAssignToMethod() {
      if (this.isShowAssignToMethodEl) {
        this.isShowAssignToMethodEl = false;
      } else {
        this.isShowAssignToMethodEl = true;
      }
    },
    changeStatePermissionView() {
      if (this.isShowPermissionViewEl) {
        this.isShowPermissionViewEl = false;
      } else {
        this.isShowPermissionViewEl = true;
      }
    },
    showDialogTreeView() {
      this.isShowDialogTreeView = true;
    },
    selectedGroup(val) {
      if (val) {
        this.formData.groupName = val[0].groupName;
        this.formData.groupId = val[0].groupId;
      }
    },
    resetFormData() {
      this.formData = { ...initForm };
      this.formData.categoryAttributeDtos = [];
    },
  },
};
</script>
