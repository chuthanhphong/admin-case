<template>
  <v-dialog
    v-model="internalValue"
    max-width="802"
    persistent
    transition="dialog-transition"
  >
    <v-card class="container-ticket container-ticket-add-new">
      <v-toolbar color="primary" dark>
        <span>
          {{
            isUpdate
              ? $t("tickets.labels.edit-ticket")
              : $t("tickets.labels.create-new")
          }}
        </span>
        <v-spacer></v-spacer>
        <v-select
          v-if="isShowPriorityEl"
          v-model="formData.priority"
          :class="getBgColorSelectedPriority"
          :items="lstPriority"
          :placeholder="$t('tickets.placeholders.priority')"
          class="mw-150 mt-0 text--body-3"
          dense
          hide-details
          item-text="name"
          item-value="value"
          outlined
        >
          <template v-slot:item="{ item }">
            <i
              :class="getColorByPriority(item.value)"
              class="app-icon icon-flash mr-2"
            />
            <span :class="getColorTextByPriority(item.value)">
              {{ $t(getKeyTextByPriority(item.value)) }}
            </span>
          </template>
          <template v-slot:selection="{ item }">
            <i
              :class="getColorByPriority(item.value)"
              class="app-icon icon-flash mr-2"
            />
            <span :class="getColorTextByPriority(item.value)">
              {{ $t(getKeyTextByPriority(item.value)) }}
            </span>
          </template>
        </v-select>
        <v-btn icon @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-layout class="px-8">
          <validation-provider
            v-slot="{ errors }"
            :rules="textInputRequired"
            class="wp-100"
            name="ticketName"
          >
            <v-text-field
              v-model="formData.name"
              :error-messages="errors"
              :maxlength="maximumExText"
              :placeholder="$t('tickets.placeholders.ticket-name')"
              autofocus
              class="text-h6 font-weight-bold"
              hide-details="auto"
            />
          </validation-provider>
        </v-layout>
        <v-layout
          :class="hasTicketName ? '' : 'opacity-3'"
          class="content-ticket-add-new"
          column
        >
          <v-layout class="px-8 py-3" column>
            <v-layout column>
              <label class="text--body-5 darken--text text-uppercase">
                {{ $t("tickets.labels.describe") }}
              </label>

              <v-textarea
                v-model="formData.description"
                :disabled="disabledAll"
                :maxlength="maximumSmallText"
                :placeholder="$t('tickets.placeholders.describe')"
                class="white"
                dense
                outlined
                rows="3"
              ></v-textarea>
            </v-layout>
            <v-layout v-if="isShowEstDurationEl" column>
              <label class="text--body-5 darken--text text-uppercase">
                {{ $t("tickets.labels.desired-deadline") }}
              </label>
              <base-datetime-picker
                v-model="formData.duration"
                :clear-text="$t('cancel')"
                :date-picker-props="datePickerProps"
                :ok-text="$t('selectLabel')"
                :persistent="true"
                :text-field-props="textFieldProps"
                :time-picker-props="timePickerProps"
                date-format="dd/MM/yyyy"
                @input-date="changeDurationDate"
                @input-time="updateDurationHour"
              >
              </base-datetime-picker>
            </v-layout>
            <v-layout v-if="isShowFollowerEl" column>
              <label class="text--body-5 darken--text text-uppercase">
                {{ $t("tickets.labels.follower") }}
              </label>
              <v-autocomplete
                v-model="formData.follower"
                :items="allUserOfDomain"
                :label="$t('tickets.placeholders.follower')"
                :no-data-text="$t('noData')"
                chips
                class="v-input--is-focused"
                color="blue-grey lighten-2"
                dense
                item-text="fullName"
                item-value="userId"
                multiple
                outlined
                solo
              >
                <template slot="append">
                  <!-- <i class="app-icon icon-personal darken" /> -->
                  <v-img
                    :src="require('@/assets/icons/ticket/user.png')"
                    class="hover--pointer"
                  />
                </template>
                <template v-slot:selection="data">
                  <v-chip
                    :input-value="data.selected"
                    close
                    v-bind="data.attrs"
                    @click="data.select"
                    @click:close="removeFollower(data.item)"
                  >
                    <v-avatar left>
                      <v-icon> mdi-account-circle </v-icon>
                    </v-avatar>
                    {{ data.item.fullName }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <v-list-item-avatar>
                    <v-icon color="primary"> mdi-account-circle </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-html="data.item.fullName"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-html="data.item.email"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-layout>

            <!-- nguon goc -->
            <!-- <v-layout v-if="isShowSourceEl" column>
              <label class="text--body-5 darken--text text-uppercase">
                {{ $t("tickets.labels.source-from") }}
              </label>
              <v-autocomplete
                v-model="formData.source"
                :item-text="(item) => item.name"
                :items="lstAssociation"
                class="text--body-5 cursor-pointer"
                dense
                elevation="0"
                height="40px"
                maxlength="255"
                outlined
                readonly
                @click="onShowDialogSelectSource"
              >
                <template slot="append">
                  <v-img
                    :src="require('@/assets/icons/ticket/search.png')"
                    class="hover--pointer"
                    @click="onShowDialogSelectSource"
                  />
                </template>
                <template v-slot:selection="data">
                  <v-chip
                    close
                    @click="data.select"
                    @click:close="removeSource()"
                  >
                    <v-avatar left>
                      <v-img v-if="checkEqualItem(data.item.associationType, 'DOCUMENT')" :src="require('@/assets/icons/task/createTask/document.svg')" />
                      <v-img v-if="checkEqualItem(data.item.associationType, 'TICKET')" :src="require('@/assets/icons/task/createTask/ticket.svg')" />
                      <v-img v-if="checkEqualItem(data.item.associationType, 'TASK')" :src="require('@/assets/icons/task/createTask/work.svg')" />
                    </v-avatar>
                    {{ data.item.name }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-layout> -->

            <!-- lien ket -->
            <!-- <v-layout v-if="isShowLinkEl" column>
              <label class="text--body-5 darken--text text-uppercase">
                {{ $t("tickets.labels.link-to") }}
              </label>
              <v-autocomplete
                v-model="formData.referList"
                :hide-selected="true"
                :item-text="item=>item.name"
                :item-value="item=>item.id"
                :items="formData.referList"
                class="text--body-5 cursor-pointer custom-autocomplete"
                outlined
                readonly
                return-object
                @click="onShowDialogSelectRefer"
              >
                <template slot="append">
                  <v-img
                    :src="require('@/assets/icons/ticket/search.png')"
                    class="hover--pointer"
                    @click="onShowDialogSelectRefer"
                  />
                </template>
                <template v-slot:selection="{item,index}">
                  <v-chip
                    close
                    @click:close="removeLinkTo(index)"
                  >
                    <v-avatar left>
                      <v-img v-if="checkEqualItem(item.associationType ,'DOCUMENT')" :src="require('@/assets/icons/task/createTask/document.svg')" />
                      <v-img v-if="checkEqualItem(item.associationType ,'TICKET')" :src="require('@/assets/icons/task/createTask/ticket.svg')" />
                      <v-img v-if="checkEqualItem(item.associationType , 'TASK')" :src="require('@/assets/icons/task/createTask/work.svg')" />
                    </v-avatar>
                    {{ item.name }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-layout> -->
            <v-layout v-if="isShowAttachEl" column>
              <label class="text--body-5 darken--text text-uppercase">
                {{ $t("tickets.labels.attach-file") }}
              </label>
              <validation-provider
                ref="providerFileAttachs"
                :rules="ruleFileAttachsTicket"
                name="fileAttachs"
              >
                <input
                  ref="fileAttachsInput"
                  :loading="uploadingFileAttatch"
                  accept=".xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.jpeg"
                  hidden
                  multiple
                  type="file"
                  @change="selectAttachs"
                />
              </validation-provider>
              <v-layout justify-space-between>
                <v-layout column justify-end>
                  <ul class="list-files text--caption">
                    <li v-for="(file, index) in nameFileAttachs" :key="index">
                      <img
                        :src="getIconFile(`${file.fileName}`)"
                        class="mr-2"
                      />
                      <span>{{ customFileName(file) }}</span>
                      <span
                        class="remove-attach"
                        @click="removeFileAttach(index)"
                      >
                        <v-icon>mdi-close</v-icon>
                      </span>
                    </li>
                  </ul>
                  <label>
                    {{ $t("ticket-types.format-file-valid") }}
                  </label>
                  <label class="error--text">
                    {{ $t("ticket-types.maximum-file-size") }}
                  </label>
                </v-layout>
                <v-btn
                  :loading="uploadingFileAttatch"
                  class="btn-upload"
                  @click="uploadAttachs"
                >
                  <v-icon size="30">mdi-upload</v-icon>
                </v-btn>
              </v-layout>
            </v-layout>
          </v-layout>
          <v-layout class="greyticket px-8 py-3">
            <!-- thoi han -->
            <button-icon
              :is-actived="isShowEstDurationEl"
              :is-disabled="disabledAll"
              :on-click="changeStateEstDuration"
              :text-action="$t('duration')"
              :text-tooltip="$t('tickets.tooltips.duration-ticket')"
              text-icon="icon-calendar"
            />
            <!-- theo doi -->
            <button-icon
              :is-actived="isShowFollowerEl"
              :is-disabled="disabledAll"
              :on-click="changeStateFollower"
              :text-action="$t('tickets.labels.follow')"
              :text-tooltip="$t('tickets.tooltips.follower')"
              text-icon="icon-view icon-size-22"
            />
            <!-- do uu tien -->
            <button-icon
              :is-actived="isShowPriorityEl"
              :is-disabled="disabledAll"
              :on-click="changeStatePriority"
              :text-action="$t('tickets.labels.priority')"
              :text-tooltip="$t('tickets.tooltips.priority')"
              text-icon="icon-flash icon-size-20"
            />
            <!-- <v-menu offset-y top>
              <template v-slot:activator="{ on: menu, attrs: atMenu }">
                <div class="d-flex flex-column align-center mx-2">
                  <v-btn
                    fab
                    x-small
                    outlined
                    elevation="false"
                    class="border-dashed"
                    :class="isShowPriorityEl ? 'active' : ''"
                    :disabled="disabledAll"
                    v-bind="{ ...atMenu }"
                    v-on="{ ...menu }"
                    @click="changeStatePriority"
                  >
                    <v-tooltip top max-width="250" class="box-shadow">
                      <template
                        v-slot:activator="{ on: tooltip, attrs: atTooltip }"
                      >
                        <i
                          class="app-icon icon-flash icon-size-20"
                          :class="isShowPriorityEl ? 'purple' : ''"
                          v-bind="{ ...atTooltip }"
                          v-on="{ ...tooltip }"
                        />
                      </template>
                      <span>
                        {{ $t("tickets.tooltips.priority") }}
                      </span>
                    </v-tooltip>
                  </v-btn>
                  <label
                    class="text-caption"
                    :class="isShowPriorityEl ? 'purple--text' : ''"
                  >
                    {{ $t("tickets.labels.priority") }}
                  </label>
                </div>
              </template>
              <v-list-item-group
                v-model="formData.priority"
                class="container-ticket"
              >
                <v-list-item v-for="(item, i) in lstPriority" :key="i">
                  <v-list-item-icon>
                    <v-icon :color="getColorByPriority(item.value)">
                      mdi-flash
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="$t(getKeyTextByPriority(item.value))"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-menu> -->
            <!-- nguon goc -->
            <!-- <button-icon
              :is-actived="isShowSourceEl"
              :is-disabled="disabledAll"
              :on-click="changeStateSource"
              :text-action="$t('tickets.labels.source')"
              :text-tooltip="$t('tickets.tooltips.source')"
              text-icon="icon-source icon-size-20"
            /> -->
            <!-- lien ket -->
            <!-- <button-icon
              :is-actived="isShowLinkEl"
              :is-disabled="disabledAll"
              :on-click="changeStateLink"
              :text-action="$t('tickets.labels.link')"
              :text-tooltip="$t('tickets.tooltips.link')"
              text-icon="icon-link icon-size-20"
            /> -->
            <!-- dinh kem -->
            <button-icon
              :is-actived="isShowAttachEl"
              :is-disabled="disabledAll"
              :on-click="changeStateAttach"
              :text-action="$t('tickets.labels.attach')"
              :text-tooltip="$t('tickets.tooltips.attach')"
              text-icon="icon-attach icon-size-20"
            />
          </v-layout>
          <v-layout class="px-8 py-3" column>
            <v-layout column>
              <label class="text--body-5 darken--text text-uppercase">
                {{ $t("tickets.labels.ticket-type") }}
                <span>*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                :rules="textInputRequired"
                name="ticketType"
              >
                <v-autocomplete
                  v-model="formData.selectedCategory"
                  :disabled="disabledAll"
                  :error-messages="errors"
                  :filter="filterItems"
                  :items="typesTicket"
                  :label="$t('tickets.placeholders.ticket-type')"
                  :no-data-text="$t('noData')"
                  append-icon="mdi-chevron-down"
                  chips
                  class="darken--text white hover--pointer"
                  dense
                  item-text="name"
                  item-value="id"
                  outlined
                  return-object
                  single-line
                  solo
                  @change="changeSelectedCategory"
                ></v-autocomplete>
              </validation-provider>
            </v-layout>
            <v-layout column>
              <label class="text--body-5 darken--text text-uppercase">
                {{ $t("tickets.labels.department-processing") }}
              </label>
              <validation-provider
                v-slot="{ errors }"
                :rules="textInputRequired"
                name="selectedGroup"
              >
                <v-autocomplete
                  v-model="formData.selectedGroup"
                  :error-messages="errors"
                  :items="allGroups"
                  :label="$t('tickets.placeholders.department-processing')"
                  chips
                  class="white"
                  dense
                  disabled
                  item-text="groupName"
                  item-value="groupId"
                  outlined
                  return-object
                  solo
                >
                  <template slot="append">
                    <i />
                  </template>
                </v-autocomplete>
              </validation-provider>
            </v-layout>

            <!-- generate category -->
            <div v-if="formData.categoryAttributes.length > 0">
              <v-layout
                v-for="(typeAttributes, index) in formData.categoryAttributes"
                :key="index"
                column
              >
                <gen-input-by-value-type
                  :index="index"
                  :type-attributes="typeAttributes"
                />
              </v-layout>
            </div>
          </v-layout>
        </v-layout>
        <v-card-actions class="justify-end pb-4">
          <v-btn
            :disabled="invalid"
            class="w-140 py-5 mr-0 mr-md-3 bg-white"
            color="primary"
            elevation="1"
            outlined
            rounded
            @click="showDialogConfirm(typeActionConst.SAVE_DRAFT)"
          >
            {{ $t("saves.draft") }}
          </v-btn>
          <v-btn
            class="w-140 py-5 mr-0 mr-md-3 bg-white"
            color="primary"
            elevation="1"
            outlined
            rounded
            @click="showDialogConfirm(typeActionConst.CANCEL)"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            :disabled="invalid"
            class="w-140 py-5"
            color="primary"
            rounded
            @click="showDialogConfirm(typeActionConst.SAVE_ACTIVED)"
          >
            {{ $t("send") }}
          </v-btn>
        </v-card-actions>
      </validation-observer>
    </v-card>

    <!-- dialog confirm -->
    <dialog-confirm
      v-model="isShowDialogConfirm"
      :message="message"
      :on-accept="onAcceptConfirm"
      :on-cancel="onCancelConfirm"
    />

    <!-- dialog select source -->
    <dialog-select-source
      :show-dialog="isShowDialogSource"
      :source-task="formData.source"
      :title="'task-manager.title.source-task'"
      @source-task="sourceTaskFromEmit"
      @close-dia-log="closeDialogSelectSourceTask"
      @list-association="listAssociationFromEmit"
    />

    <!-- dialog refer list -->
    <DialogSelectLinkTo
      :show-dialog="isShowDialogReferList"
      :task-associations="formData.referList"
      :title="'task-manager.title.link-to'"
      @list-link-to="taskAssociationsFromEmit"
      @close-dia-log="closeDialogSelectTaskAssociations"
    />
  </v-dialog>
</template>

<script>
// component
import ButtonIcon from "./ButtonIcon.vue";
import GenInputByValueType from "./GenInputByValueType.vue";
import DialogConfirm from "@/components/dialog/DialogConfirm.vue";
import DialogSelectSource from "@/components/dialog/DialogSelectSourceTask";
import DialogSelectLinkTo from "@/components/dialog/DialogSelectLinkTo";
// libs
import rules from "@/mixins/rules";
import constants from "@/constants";
import {
  definedPriotity,
  definedStatus,
  definedValueType,
  FORMAT_DATE_TIME_HM_TICKET,
  formatDate,
  formatDateTimeIso,
  getDateNow,
  HTTP_STATUS_SUCCESS
} from "@/modules/ticket/helpers/ticketUtils";
import { mapActions } from "vuex";
import mixinUploadFiles from "@/modules/ticket/mixins/mixinUploadFiles";
import routeNames from "@/modules/ticket/router/routeNames";
import routePaths from "@/modules/ticket/router/routePaths";
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";
import filterItems from "@/mixins/filterItems.js";

// Services
import { CategoryService } from "@/modules/ticket/services/categoryService";
import { TicketService } from "@/modules/ticket/services/ticketService";
import { PublicTicketService } from "@/modules/ticket/services/publicTicketService";
import { StorageService } from "@/modules/ticket/services/storageService";
import { AssociationService } from "@/modules/ticket/services/associationService";

const initForm = {
  name: "",
  description: "",
  duration: "",
  follower: [],
  priority: null,
  source: null,
  referList: [],
  fileAttachmentRequests: [],
  selectedCategory: null,
  selectedGroup: null,
  categoryAttributes: [],
};

export default {
  components: {
    ButtonIcon,
    GenInputByValueType,
    DialogConfirm,
    DialogSelectSource,
    DialogSelectLinkTo
  },
  mixins: [rules, filterItems, mixinUploadFiles, mixinStatusAndPriority],
  props: {
    value: Boolean,
    categoryId: {
      type: Number,
      default: undefined,
    },
    typesTicket: {
      type: Array,
      default: require,
    },
    isUpdate: {
      type: Boolean,
      default: undefined,
    },
    detailTicket: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      internalValue: this.value,
      maximumExText: constants.MAXIMUM_EX_TEXT,
      maximumSmallText: constants.MAXIMUM_SMALL_TEXT,
      typeActionConst: constants.TICKET_TYPE_ACTION,

      isShowEstDurationEl: false,
      isShowFollowerEl: false,
      isShowPriorityEl: false,
      isShowSourceEl: false,
      isShowLinkEl: false,
      isShowAttachEl: false,

      // typesTicket: [],
      allGroups: [],
      allUserOfDomain: [],
      lstPriority: [],
      lstAssociation: [],
      selectedReferList: [],
      formData: { ...initForm },
      durationDateVal: null,
      durationHourVal: 0,
      sourceValue: null,
      listModuleType: [],
      listModuleReferType: [],
      sourceType: null,
      sourceId: null,
      referType: null,
      referTypeName: null,
      referList: [],
      referListPars: [],
      textFieldProps: {
        appendIcon: "app-icon icon-calendar darken",
        outlined: true,
        dense: true,
        placeholder: this.$t("tickets.placeholders.desired-deadline"),
      },
      datePickerProps: {
        noTitle: true,
        allowedDates: (val) => this.allowedDateDuration(val),
      },
      timePickerProps: {
        format: "24hr",
        noTitle: true,
        allowedHours: (val) => this.allowedHourDuration(val),
        allowedMinutes: (val) => this.allowedMinutesDuration(val),
      },

      // dialog confirm
      isShowDialogConfirm: false,
      message: "",

      isShowDialogSource: false,
      isShowDialogReferList: false,

      originInputFileAttachments: [],
      originInputFileAttributes: [],
    };
  },
  computed: {
    disabledAll() {
      return this.formData.name === null || this.formData.name === "";
    },
    hasTicketName() {
      return !this.disabledAll;
    },
    getBgColorSelectedPriority() {
      if (this.formData.priority === 1) {
        return "pink-ff";
      } else if (this.formData.priority === 2) {
        return "organe-ff";
      } else if (this.formData.priority === 3) {
        return "gray-d3";
      } else {
        return "gray-d3";
      }
    },
  },
  watch: {
    internalValue(val, oldVal) {
      if (val === oldVal) return;

      this.$emit("input", val);
      if (this.internalValue) {
        if (this.typesTicket.length > 0) {
          this.formData.selectedCategory = this.typesTicket[0]
        }
      }
    },
    value(val, oldVal) {
      if (val === oldVal) return;

      this.internalValue = val;
      this.bindSelectCategoryById();
      if (val && this.isUpdate) {
        this.parseDetailToForm();
      } else {
        this.formData.selectedCategory = null;
      }
    },
    nameFileAttachs() {
      this.formData.fileAttachmentRequests = this.nameFileAttachs;
    },
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    async initData() {
      this.getAllGroup();
      this.getAllUserOfDomain();
      this.getPriority();
      this.getListSourceType();
    },
    async getAllGroup() {
      this.allGroups = await StorageService.getAllGroup();
    },
    async getAllUserOfDomain() {
      this.allUserOfDomain = await StorageService.getAllUserOfDomain();
    },
    async getPriority() {
      this.lstPriority = await StorageService.getPriority();
    },
    selectSourceType(value) {
      this.sourceValue = value;
      this.getAssociations();
    },
    async getListSourceType() {
      const response = await PublicTicketService.getSourceType();
      this.listModuleType = response.data;
    },
    async getListReferType() {
      const response = await PublicTicketService.getReferType();
      this.listModuleReferType = response.data;
      this.listModuleReferType.forEach((x) => {
        if (x.name === this.referTypeName) {
          this.referType = x.value;
        }
      });
    },
    async getListAssociation(keyword) {
      const body = {
        keyword: keyword,
      };
      const response = await AssociationService.getAssociations(body);
      if (response && response.status === HTTP_STATUS_SUCCESS) {
        if (this.sourceValue === 1) {
          this.lstAssociation = response.data.documents;
        } else if (this.sourceValue === 3) {
          this.lstAssociation = response.data.tasks;
        } else if (this.sourceValue === 4) {
          this.lstAssociation = response.data.tickets;
        }
      }
    },
    async getAssociations() {
      const body = {};
      const response = await AssociationService.getAssociations(body);
      if (response && response.status === HTTP_STATUS_SUCCESS) {
        if (this.sourceValue === 1) {
          this.lstAssociation = response.data.documents;
        } else if (this.sourceValue === 3) {
          this.lstAssociation = response.data.tasks;
        } else if (this.sourceValue === 4) {
          this.lstAssociation = response.data.tickets;
        }
      }
    },
    onClosePopup() {
      this.sourceValue = null;
      this.lstAssociation = [];
      this.isShowDialogSource = false;
      this.isShowDialogReferList = false;
    },
    onAccept(id, type, value) {
      this.getListReferType();
      this.formData.source = value;
      this.sourceId = id;
      this.listModuleType.forEach((x) => {
        if (x.name === type) {
          this.sourceType = x.value;
        }
      });
      this.isShowDialogSource = false;
    },
    removeLinkTo(index) {
      if (index >= 0) {
        this.formData.referList.splice(index, 1)
      }
    },
    onAcceptRefer(item, type) {
      this.referList = [];
      this.referListPars = [];
      this.getListReferType();
      this.formData.referList = [];
      item.forEach((x) => {
        this.formData.referList.push(x.name);
        this.referList.push(x.id);
      });
      this.listModuleType.forEach((x) => {
        if (x.name === type) {
          this.sourceType = x.value;
        }
      });
      this.isShowDialogReferList = false;
    },
    removeSource() {
      this.formData.source = null;
    },
    // removeRefer(index) {
    //   this.formData.referList.splice(index, 1);
    // },
    bindSelectCategoryById() {
      if (this.categoryId) {
        const selected = this.typesTicket.find((o) => o.id === this.categoryId);
        this.formData.selectedCategory = selected;
        if (!this.isUpdate) {
          this.changeSelectedCategory(selected);
        }
      }
    },
    taskAssociationsFromEmit(value) {
      this.formData.referList = value
    },
    closeDialogSelectTaskAssociations() {
      this.isShowDialogReferList = false
    },
    async getCategoryDetail(id) {
      const response = await CategoryService.getCategoryDetail(id);
      this.resetCategoryAttributes();
      if (response) {
        this.bindCategoryAttributes(response.data.categoryAttributeDtos);
      }
    },
    resetCategoryAttributes() {
      this.formData.categoryAttributes = [];
    },
    bindCategoryAttributes(data) {
      if (data && data.length > 0) {
        data.forEach((item) => {
          const newType = {
            name: null,
            valueType: null,
            attributeValue: null,
          };
          Object.assign(newType, item);
          this.formData.categoryAttributes.push({ ...newType });
        });
      }
    },
    listAssociationFromEmit(val) {
      this.lstAssociation = val
    },
    async createOrUpdateTicket() {
      try {
        this.loading = true;
        const valid = await this.$refs.observer.validate();
        if (valid) {
          const requestPars = this.bindTicketRequestPars(this.formData);
          if (this.isUpdate) {
            await TicketService.update(requestPars);
          } else {
            await TicketService.create(requestPars);
          }

          const keyMsg = this.getContentMessageSuccess(
            this.isUpdate,
            this.typeActionActive
          );

          this.resetTypeAction();
          this.resetFormData();
          this.onClose();
          const routeName = this.$route.name;
          if (routeName === routeNames.MY_REQUEST_TICKET) {
            this.$emit("reload-list");
            this.$emit("reload-advance-list");
            this.$emit("on-accept-confirm");
          } else {
            this.$router.push(routePaths.MY_REQUEST_TICKET_PATH);
          }

          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: keyMsg,
          });
        }
        // this.$emit("on-accept-confirm");
      } catch (error) {
        console.log(error)
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: error.message,
          isKey: false,
        });
      } finally {
        this.loading = false;
      }
    },
    getContentMessageSuccess(isUpdate, typeAction) {
      if (isUpdate) {
        if (typeAction === constants.TICKET_TYPE_ACTION.SAVE_ACTIVED) {
          return "tickets.messages.updated-success";
        } else {
          return "tickets.messages.update-draft-success";
        }
      } else {
        if (typeAction === constants.TICKET_TYPE_ACTION.SAVE_ACTIVED) {
          return "tickets.messages.created-success";
        } else {
          return "tickets.messages.save-draft-success";
        }
      }
    },
    bindTicketRequestPars(data) {
      const pars = {
        name: data.name,
        description: data.description,
        ticketCateId: data.selectedCategory.id,
      };

      let status = null;
      if (this.typeActionActive === constants.TICKET_TYPE_ACTION.SAVE_ACTIVED) {
        status = definedStatus.send;
      }
      if (status) {
        pars["status"] = status;
      }

      // thoi han mong muon
      if (this.isShowEstDurationEl && this.formData.duration) {
        pars["expectEndDate"] = formatDateTimeIso(this.formData.duration);
      }

      // theo doi
      const ticketDetail = this.bindRequestTicketDetail();
      if (ticketDetail && Object.keys(ticketDetail).length > 0) {
        pars["ticketDetailDto"] = ticketDetail;
      }

      // do ưu tien
      if (this.isShowPriorityEl && this.formData.priority) {
        pars["priority"] = this.formData.priority;
      } else {
        pars["priority"] = definedPriotity.normal;
      }

      // nguon goc
      if (this.isShowSourceEl && this.formData.source) {
        pars["sourceMapDto"] = {
          sourceId: this.sourceId,
          sourceType: this.sourceType,
          referType: this.referType,
          objectType: 0,
          objectId: 0,
        };
      }
      this.referList.forEach((x) => {
        this.referListPars.push({
          sourceType: this.sourceType,
          sourceId: x,
          referType: this.referType,
          objectType: 0,
          objectId: 0,
        });
      });
      // lien ket
      if (this.isShowLinkEl && this.formData.referList) {
        pars["referList"] = this.referListPars;
      }

      // dinh kem
      if (this.isShowAttachEl) {
        pars["fileAttachmentRequests"] = this.formData.fileAttachmentRequests;
        if (this.isUpdate) {
          pars["flagChangeFile"] = this.getFlagChangeFile(
            this.formData.fileAttachmentRequests,
            this.originInputFileAttachments
          );
        }
      }

      // categoryAttributeDtos
      const categoryAttributeDtos = this.bindRequestCategoryAttributes(
        data.categoryAttributes
      );
      if (categoryAttributeDtos && categoryAttributeDtos.length > 0) {
        pars["categoryAttributeDtos"] = categoryAttributeDtos;
      }

      if (this.isUpdate) {
        pars["id"] = this.detailTicket.id;
      }

      return pars;
    },
    bindRequestCategoryAttributes(data) {
      const results = [];
      data.forEach((item) => {
        const newItem = {
          id: item.id,
          name: item.name,
          valueType: item.valueType,
        };
        if (item.valueType === definedValueType.file) {
          if (item.attributeValue && item.attributeValue.length > 0) {
            newItem["fileAttributeRequests"] = item.attributeValue;
            // if (this.isUpdate) {
            //   const fileOrigin = this.originInputFileAttributes[item.id];
            //   newItem["flagChangeFile"] = this.getFlagChangeFile(
            //     item.attributeValue,
            //     fileOrigin
            //   );
            // }
          }
        } else {
          newItem["attributeValue"] = item.attributeValue;
        }
        results.push(newItem);
      });

      return results;
    },
    bindRequestTicketDetail() {
      const result = {};
      if (this.isShowFollowerEl && this.formData.follower.length > 0) {
        result["monitorUserId"] = this.formData.follower.join(",");
      }

      return result;
    },

    resetFormData() {
      this.isShowEstDurationEl = false;
      this.isShowFollowerEl = false;
      this.isShowPriorityEl = false;
      this.isShowSourceEl = false;
      this.isShowLinkEl = false;
      this.isShowAttachEl = false;

      this.formData = { ...initForm };
      this.durationDateVal = null;
      this.durationHourVal = 0;
      this.fileAttachs = [];
      this.nameFileAttachs = [];
      this.$refs.observer.reset();
    },
    changeSelectedCategory(val) {
      if (val) {
        this.bindSelectedGroup(val.groupId);
        this.getCategoryDetail(val.id);
      } else {
        this.formData.selectedGroup = null;
        this.resetCategoryAttributes();
      }
    },
    bindSelectedGroup(groupId) {
      this.formData.selectedGroup = this.allGroups.find(
        (x) => x.groupId === groupId
      );
    },
    allowedDateDuration(val) {
      return val >= getDateNow();
    },
    changeDurationDate(val) {
      this.durationDateVal = val;
    },
    updateDurationHour(val) {
      if (val) {
        const hour = val.split(":")[0];
        this.durationHourVal = parseInt(hour);
      } else {
        this.durationHourVal = 0;
      }
    },
    allowedHourDuration(val) {
      if (this.isToday(this.durationDateVal)) {
        const today = new Date();
        var hour = today.getHours();
        var minutes = today.getMinutes();
        if (minutes === 59) {
          return val > hour;
        } else {
          return val >= hour;
        }
      }

      return true;
    },
    isToday(date) {
      return getDateNow() === date;
    },
    allowedMinutesDuration(val) {
      if (this.isToday(this.durationDateVal)) {
        const today = new Date();
        var hour = today.getHours();
        var minutes = today.getMinutes();
        if (this.durationHourVal === hour) {
          return minutes >= 59 ? true : val > minutes;
        } else {
          return true;
        }
      }

      return true;
    },
    onClose() {
      this.referList = [];
      this.referListPars = [];
      this.$emit("input", false);
      if (this.isUpdate) {
        this.resetFormData();
      }
    },
    changeStateEstDuration() {
      this.isShowEstDurationEl = !this.isShowEstDurationEl;
    },
    changeStateFollower() {
      this.isShowFollowerEl = !this.isShowFollowerEl;
    },
    changeStatePriority() {
      this.isShowPriorityEl = !this.isShowPriorityEl;
    },
    changeStateSource() {
      this.isShowSourceEl = !this.isShowSourceEl;
    },
    changeStateLink() {
      this.isShowLinkEl = !this.isShowLinkEl;
    },
    changeStateAttach() {
      this.isShowAttachEl = !this.isShowAttachEl;
    },
    removeFollower(item) {
      const index = this.formData.follower.indexOf(item.userId);
      if (index >= 0) this.formData.follower.splice(index, 1);
    },
    async showDialogConfirm(type) {
      this.typeActionActive = type;
      this.message = this.getMessageConfirmByTypeAction(type);
      this.isShowDialogConfirm = true;
    },
    getMessageConfirmByTypeAction(type) {
      switch (type) {
        case constants.TICKET_TYPE_ACTION.SAVE_ACTIVED:
          return this.$t("tickets.messages.send");
        case constants.TICKET_TYPE_ACTION.SAVE_DRAFT:
          return this.$t("tickets.messages.draft");
        case constants.TICKET_TYPE_ACTION.CANCEL:
          return this.$t("ticket-types.msg-confirm-cancel");
        default:
          return "";
      }
    },
    onCancelConfirm() {
      this.resetTypeAction();
      this.isShowDialogConfirm = false;
    },
    resetTypeAction() {
      this.typeActionActive = -1;
    },
    onAcceptConfirm() {
      this.isShowDialogConfirm = false;
      if (
        this.typeActionActive === constants.TICKET_TYPE_ACTION.SAVE_ACTIVED ||
          this.typeActionActive === constants.TICKET_TYPE_ACTION.SAVE_DRAFT
      ) {
        this.createOrUpdateTicket();
      } else if (
        this.typeActionActive === constants.TICKET_TYPE_ACTION.CANCEL
      ) {
        this.onClose();
        this.resetTypeAction();
        this.resetFormData();
      }
    },
    // select source
    onShowDialogSelectSource() {
      this.referTypeName = "PARENT";
      this.isShowDialogSource = true;
    },
    onShowDialogSelectRefer() {
      this.referTypeName = "IN";
      this.isShowDialogReferList = true;
    },
    checkEqualItem(item1, item2) {
      return item1 === item2
    },

    // edit data from detail
    parseDetailToForm() {
      if (this.isUpdate && this.detailTicket) {
        const data = { ...this.detailTicket };
        this.formData.name = data.name;
        this.formData.description = data.description;
        this.formData.selectedGroup = data.groupId;
        this.formData.categoryAttributes = data.categoryAttributeDtos;

        if (typeof data.expectEndDate !== "undefined") {
          this.changeStateEstDuration();
          this.formData.duration = formatDate(
            data.expectEndDate,
            FORMAT_DATE_TIME_HM_TICKET
          );
        }

        if (typeof data.monitorUserId !== "undefined") {
          this.changeStateFollower();
          this.formData.follower = [];
          const arrUserIds = data.monitorUserId.split(",");
          arrUserIds.forEach((item) => {
            this.formData.follower.push(parseInt(item));
          });
        }

        if (typeof data.priority !== "undefined") {
          this.changeStatePriority();
          this.formData.priority = this.lstPriority.find(
            (x) => x.value === data.priority
          ).value;
        }

        if (data.taskSourceMap.data.length > 0) {
          this.changeStateSource();
        }

        if (data.refers.length > 0) {
          this.changeStateLink();
        }

        if (typeof data.inputFileAttachments !== "undefined") {
          this.changeStateAttach();
          this.nameFileAttachs = data.inputFileAttachments;
          this.originInputFileAttachments = [...data.inputFileAttachments];
        }

        this.bindSelectedGroup(data.groupId);
        if (data.categoryAttributeDtos.length > 0) {
          this.resetCategoryAttributes();
          this.bindCategoryAttributes(data.categoryAttributeDtos);
          this.bindOriginInputFileAttributes(data.categoryAttributeDtos);
        }
      }
    },
    sourceTaskFromEmit(value) {
      this.formData.source = value
    },
    closeDialogSelectSourceTask() {
      this.isShowDialogSource = false
    },
    getFlagChangeFile(files, arrOrigin) {
      if (arrOrigin.length === 0) return 1;

      if (files.length !== arrOrigin.length) return 1;

      // check file name
      const nameFiles = files.map((o) => {
        return o.fileName.toLowerCase();
      });
      const nameOriginFiles = arrOrigin.map((o) => {
        return o.fileName.toLowerCase();
      });
      nameFiles.sort();
      nameOriginFiles.sort();
      var isSameName =
          nameFiles.length === nameOriginFiles.length &&
          nameFiles.every((element, index) => {
            return element === nameOriginFiles[index];
          });

      // check file size
      const sizeFiles = files.map((o) => {
        return o.fileSize;
      });
      const sizeOriginFiles = arrOrigin.map((o) => {
        return o.fileSize;
      });
      sizeFiles.sort();
      sizeOriginFiles.sort();
      var isSameSize =
          sizeFiles.length === sizeOriginFiles.length &&
          sizeFiles.every((element, index) => {
            return element === sizeOriginFiles[index];
          });

      return isSameName && isSameSize ? 0 : 1;
    },
    bindOriginInputFileAttributes(categoryAttributeDtos) {
      const results = categoryAttributeDtos.map((item) => {
        if (item.valueType === definedValueType.file) {
          results[item.id] = [...item.inputFileAttributes];
        }
      });
      this.originInputFileAttributes = results;
    },
  },
};
</script>
