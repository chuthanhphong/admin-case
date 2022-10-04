<template>
  <v-fade-transition>
    <div
      class="wrap-popup-user-info-view"
      :class="isChevronLeft ? 'chevron-left' : 'chevron-right'"
    >
      <v-card v-if="isShowPopup" v-click-outside="onClickOutside">
        <i
          class="app-icon white"
          :class="
            isChevronLeft
              ? 'icon-chevron-left pos-left'
              : 'icon-chevron-right pos-right'
          "
        ></i>
        <v-layout v-if="detailGroupView" align-center>
          <v-avatar color="primary" size="32" class="ml-4">
            <i class="app-icon icon-briefcase white"></i>
          </v-avatar>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{
                getTextTruncateView(detailGroupView.groupName, 20)
              }}</v-list-item-title>
              <v-list-item-subtitle v-if="hasDetailGroupEmail">
                {{ detailGroupView.email }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="detailGroupView.parentGroup">
                {{ detailGroupView.parentGroup.groupName }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-layout>
      </v-card>
    </div>
  </v-fade-transition>
</template>

<script>
// libs
import {
  getTextTruncate,
} from "@/modules/ticket/helpers/ticketUtils";
// services
import { GroupService } from "@/services/groupService";
export default {
  props: {
    userInfo: {
      type: Object,
      default: undefined,
    },
    activeIndex: {
      type: Number,
      default: undefined,
    },
    index: {
      type: Number,
      default: undefined,
    },
    isChevronLeft: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
    return {
      detailGroupView: null,
    }
  },
  computed: {
    isShowPopup() {
      return this.userInfo && this.activeIndex === this.index;
    },
    hasDetailGroupEmail() {
      return typeof this.detailGroupView.email !== "undefined";
    },
  },
  methods: {
    onClickOutside() {
      this.$emit("on-click-outside");
    },
    async getDetailGroupById(val) {
      const response = await GroupService.getDetailGroupById(val);
      if (response.success) {
        this.detailGroupView = response.data;
      }
    },
    getTextTruncateView(val, size) {
      return getTextTruncate(val, size);
    },
  },
};
</script>
