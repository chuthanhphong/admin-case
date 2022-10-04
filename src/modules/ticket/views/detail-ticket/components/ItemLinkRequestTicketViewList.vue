<template>
  <v-container v-if="item">
    <v-row class="align-center item-link-ticket">
      <v-col cols="6">
        <div class="d-flex">
          <v-avatar size="30">
            <v-img :src="require('@/assets/icons/ticket/icon-document.svg')" />
            <v-img
              :src="require('@/assets/icons/ticket/icon-link-ticket.svg')"
            />
            <v-img :src="require('@/assets/icons/ticket/icon-work.svg')" />
          </v-avatar>
          <div class="label-link-work-ticket ma-1">
            <b class=""> Văn bản</b>
            <!-- <b class="">{{ item.name }}</b> -->
          </div>
        </div>
      </v-col>
      <v-col cols="3">
        <v-layout align-center>
          <v-chip color="primary">
            <span>Hoàn Thành</span>
          </v-chip>
        </v-layout>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import { UserService } from "@/modules/ticket/services/userService";
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
  computed: {},
  methods: {
    getColorChipStatusLinkToTicket(status) {
      switch (status) {
        case "NEW":
          return "#E9E9EA";
        case "REVIEW_RECEIVING":
        case "REVIEW_SENDING":
        case "PENDING":
          return "#DEDFFF";
        case "RECEIVED_UNPROCESS":
          return "#FFECDF";
        case "INPROGRESS":
          return "#FFEFD5";
        case "REJECT_RECEIVING":
        case "CANCELED":
          return "#FFE8E9";
        case "FINISH":
          return "#CCF3FE";
        case "CLOSED":
          return "#DEEFFE";
        default:
          return "";
      }
    },
  },
};
</script>
