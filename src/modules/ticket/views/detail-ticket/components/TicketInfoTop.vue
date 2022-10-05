<template>
  <v-layout v-if="detail" class="py-4 px-5" column>
    <v-card-title class="d-flex justify">
      <v-layout align-center>
        <v-avatar class="mr-2" color="primary" size="30">
          <i class="app-icon icon-ticket white"></i>
        </v-avatar>
        <h6 class="greya7--text">#{{ detail.id }}</h6>
        <v-spacer></v-spacer>
        <v-chip :color="getColorChipByPriority(detail.priority)" label>
          <i
            :class="getColorByPriority(detail.priority)"
            class="app-icon icon-flash"
          ></i>
          <label :class="getColorTextByPriority(detail.priority)">
            {{ $t(getKeyTextByPriority(detail.priority)) }}
          </label>
        </v-chip>
      </v-layout>
    </v-card-title>
    <h6>{{ detail.name }}</h6>
    <v-layout class="mt-3">
      <v-chip class="text--body-5 darken--text" color="#CCF3FE">
        {{ detail.ticketCateName }}
      </v-chip>
      <!-- <v-chip class="tag-ticket text--body-5 ml-1 bg-white">
        <i class="app-icon icon-tag black"></i>
        <label>{{ $t("tickets.labels.paste-label") }}</label>
      </v-chip>
      <v-btn fab x-small class="btn-icon ml-1">
        <v-icon dark>mdi-restart</v-icon>
      </v-btn> -->
    </v-layout>
    <!-- thong tin user -->
    <v-layout align-center class="mt-3">
      <v-menu
        max-width="360"
        open-on-hover
        origin="center center"
        top
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
            class="cursor-pointer"
            color="#0FAFE4"
            size="32"
            v-bind="attrs"
            v-on="on"
          >
            <span
              class="text-uppercase white--text"
            >{{
              renderAvatarText(detail.infoCreateUser.userName[0])
            }}</span>
          </v-avatar>
        </template>
        <PopupUserInfoViewHover
          :user-info="detail.infoCreateUser"
        />
      </v-menu>
      <v-layout class="ml-2" column>
        <label class="text--body-5">
          {{ detail.infoCreateUser.userName }}
        </label>
        <label class="text--overlined greya7--text">
          {{ $t("tickets.labels.create-time") }}
          {{ formatDateView(detail.createdDate) }}
        </label>
      </v-layout>
      <!-- AN BUILD PRODUCT -->
      <v-layout align-center>
        <label class="text--body-5 mr-2">
          {{ $t("tickets.labels.parent-work") }}:
        </label>
        <v-btn
          v-if="!haveSourceValue"
          class="w-140 btn-choose"
          rounded
          @click="onShowDialogSelectSource"
        >
          {{ $t("tickets.labels.choose") }}
        </v-btn>
        <v-tooltip
          v-else
          content-class="tooltip-top"
          top
        >
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              close
              color="#FFEDD2"
              v-bind="attrs"
              @click="onShowDialogSelectSource"
              v-on="on"
              @click:close="removeSource()"
            >
              <v-avatar left>
                <v-img v-if="checkEqualItem(detail.sourceTicket.associationType, 'DOCUMENT')" :src="require('@/assets/icons/task/createTask/document.svg')" />
                <v-img v-if="checkEqualItem(detail.sourceTicket.associationType, 'TICKET')" :src="require('@/assets/icons/task/createTask/ticket.svg')" />
                <v-img v-if="checkEqualItem(detail.sourceTicket.associationType, 'TASK')" :src="require('@/assets/icons/task/createTask/work.svg')" />
              </v-avatar>
              {{ getTextTruncate(detail.sourceTicket.name,15) }}
            </v-chip>
          </template>
          <span>{{ detail.sourceTicket.name }}</span>
        </v-tooltip>

      </v-layout>
    </v-layout>
    <v-layout class="mt-2" column>
      <v-layout align-center class="text--body-5 greya7--text">
        <i class="app-icon icon-phone-call darken icon-size-12 mr-2"></i>
        {{ detail.infoCreateUser.phone }}
      </v-layout>
      <v-layout align-center class="text--body-5 greya7--text">
        <i class="app-icon icon-mail darken icon-size-14 mr-2"></i>
        {{ detail.infoCreateUser.email }}
      </v-layout>
      <v-layout align-center class="text--body-5 greya7--text">
        <i class="app-icon icon-location darken icon-size-14 mr-2"></i>
        {{ detail.infoCreateUser.positionName }} -
        {{ detail.infoCreateUser.groupName }}
      </v-layout>
    </v-layout>
    <template v-if="detail.description" class="mt-4">
      <v-divider
        class="mr-2 gray-light"
        style="border-width: 1px"
        vertical
      ></v-divider>
      <span class="text--body-2">{{ detail.description }}</span>
    </template>
    <!-- dialog select source -->
    <dialog-select-source-task
      :excludes="[{ id:detail.id, associationType: 'TICKET' }]"
      :show-dialog="isShowDialogSource"
      :source-task="detail.sourceTask"
      :title="'task-manager.title.source-task'"
      @source-task="sourceTaskFromEmit"
      @close-dia-log="closeDialogSouceTask"
    />
  </v-layout>
</template>
<script>
// component
import DialogSelectSourceTask from "@/components/dialog/DialogSelectSourceTask";
import { FORMAT_DATE_TIME_TICKET, formatDate, } from "@/modules/ticket/helpers/ticketUtils";
import PopupUserInfoViewHover from "@/modules/ticket/views/components/PopupUserInfoViewHover";
import mixinStatusAndPriority from "@/modules/ticket/mixins/mixinStatusAndPriority";

// Services
import { StorageService } from "@/modules/ticket/services/storageService";
import { PublicTicketService } from "@/modules/ticket/services/publicTicketService";

const initForm = {
  name: "",
  urgency: null,
};
export default {
  components: { DialogSelectSourceTask, PopupUserInfoViewHover },
  mixins: [mixinStatusAndPriority],
  props: {
    value: Boolean,
    detail: {
      type: Object,
      default: undefined,
    },
    dataTicket: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      content: "",
      color: "#00c3f9",
      loading: false,
      formData: { ...initForm },
      showDialogSourceTask: false,
      listUrgency: [],
      isShowDialogSource: false,
      lstAssociation: [],
      listModuleType: [],
      sourceValue: null,
      haveSourceValue: false,
      selectedSource: null,
    };
  },
  computed: {
    getBgColorSelectedUrgency() {
      if (this.formData.urgency === 1) {
        return "pink-ff";
      } else if (this.formData.urgency === 2) {
        return "organe-ff";
      } else if (this.formData.urgency === 3) {
        return "gray-d3";
      } else {
        return "gray-d3";
      }
    },
  },
  watch: {
    value(val, oldVal) {
      if (val === oldVal) return;

      if (val) {
        this.parseDetailToForm();
      }
    },
  },
  created() {
    this.initData();
    if (this.detail.sourceTicket) {
      this.haveSourceValue = true
    }
  },
  methods: {
    async initData() {
      await this.getUrgency();
      this.getListSourceType();
    },
    checkEqualItem(item1, item2) {
      return item1 === item2
    },
    async getUrgency() {
      this.lstPriority = await StorageService.getPriority();
    },
    parseDetailToForm() {
      const data = this.detail;
      if (typeof data.urgency !== "undefined") {
        this.formData.urgency = this.listUrgency.find(
          (x) => x.value === data.urgency
        );
      }
    },
    async getListSourceType() {
      const response = await PublicTicketService.getSourceType();
      this.listModuleType = response.data;
    },
    onAccept(id, type, value) {
      this.selectedSource = value;
      this.sourceId = id;
      this.listModuleType.forEach((x) => {
        if (x.name === type) {
          this.sourceType = x.value;
        }
      });
      this.haveSourceValue = true;
      this.isShowDialogSource = false;
    },
    sourceTaskFromEmit(value) {
      this.$emit('source-task', value)
      this.haveSourceValue = true
    },
    removeSource() {
      this.$emit('remove-Source')
      this.haveSourceValue = false;
    },
    closeDialogSouceTask() {
      this.isShowDialogSource = false
    },
    selectSourceType(value) {
      this.sourceValue = value;
    },
    formatDateView(date) {
      return formatDate(date, FORMAT_DATE_TIME_TICKET);
    },
    onShowDialogSelectSource() {
      this.isShowDialogSource = true;
    },
    renderAvatarText(customer) {
      return this.genAvatar(customer)
    },
    getTextTruncate(val, size) {
      if (val.length > size) {
        return val.substring(0, size) + "...";
      } else {
        return val;
      }
    },
    genAvatar(name) {
      if (!name) return ''
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        name = name.replaceAll(' ', ' ').trim()
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
  },
};
</script>
