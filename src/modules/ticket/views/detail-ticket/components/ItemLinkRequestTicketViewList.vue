<template>
  <v-row v-if="item" class="align-center item-link-ticket px-2">
    <v-col cols="6">
      <div class="d-flex">
        <v-avatar size="30">
          <v-img v-if="checkEqualItem(item.associationType ,'DOCUMENT')" :src="require('@/assets/icons/ticket/icon-document.svg')" />
          <v-img
            v-if="checkEqualItem(item.associationType ,'TICKET')"
            :src="require('@/assets/icons/ticket/icon-link-ticket.svg')"
          />
          <v-img
            v-if="checkEqualItem(item.associationType ,'TASK')"
            :src="require('@/assets/icons/ticket/icon-work.svg')"
          />
        </v-avatar>
        <div class="label-link-work-ticket ma-1">
          <b class="">{{ item.name }}</b>
          <!-- <b class="">{{ item.name }}</b> -->
        </div>
      </div>
    </v-col>
    <v-col cols="3" />
    <v-col cols="3">
      <v-layout align-center>
        <v-chip :color="getColorChipStatusLinkToTicket(item.status)">
          <span>{{ $t(renderStatusNameLink(item.status)) }}</span>
        </v-chip>
      </v-layout>
    </v-col>
  </v-row>
</template>

<script>
import constants from "@/modules/etask/constants";

export default {
  props: {
    item: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {};
  },
  computed: {
  },
  methods: {
    getColorChipStatusLinkToTicket(status) {
      switch (status) {
        case constants.STATUS_TASK.NEW:
          return "#E9E9EA";
        case constants.STATUS_TASK.REVIEW_RECEIVING:
        case constants.STATUS_TASK.REVIEW_SENDING:
        case constants.STATUS_TASK.PENDING:
          return "#DEDFFF";
        case constants.STATUS_TASK.RECEIVED_UNPROCESS:
          return "#FFECDF";
        case constants.STATUS_TASK.INPROGRESS:
          return "#FFEFD5";
        case constants.STATUS_TASK.REJECT_RECEIVING:
        case constants.STATUS_TASK.CANCELED:
          return "#FFE8E9";
        case constants.STATUS_TASK.FINISH:
          return "#CCF3FE";
        case constants.STATUS_TASK.CLOSED:
          return "#DEEFFE";
        default:
          return "#E9E9EA";
      }
    },
    renderStatusNameLink(item) {
      switch (item) {
        case constants.STATUS_TASK.NEW:
          return "task-manager.status.new";
        case constants.STATUS_TASK.REVIEW_RECEIVING:
          return 'task-manager.status.review-receiving'
        case constants.STATUS_TASK.REVIEW_SENDING:
          return 'task-manager.status.review-sending'
        case constants.STATUS_TASK.PENDING:
          return "task-manager.status.pending";
        case constants.STATUS_TASK.RECEIVED_UNPROCESS:
          return 'task-manager.status.received-unprocess';
        case constants.STATUS_TASK.INPROGRESS:
          return "task-manager.status.inprogress";
        case constants.STATUS_TASK.REJECT_RECEIVING:
          return 'task-manager.status.reject-receiving'
        case constants.STATUS_TASK.CANCELED:
          return "task-manager.status.canceled";
        case constants.STATUS_TASK.FINISH:
          return "task-manager.status.finish";
        case constants.STATUS_TASK.CLOSED:
          return "task-manager.status.closed";
        default:
          return "task-manager.status.no-data";
      }
    },
    checkEqualItem(item1, item2) {
      return item1 === item2
    }
  },
};
</script>
