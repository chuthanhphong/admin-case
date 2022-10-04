<template>
  <v-fade-transition>
    <div
      :class="isChevronLeft ? 'chevron-left' : 'chevron-right'"
      class="wrap-popup-user-info-view"
    >
      <v-card>
        <i
          :class="
            isChevronLeft
              ? 'icon-chevron-left pos-left'
              : 'icon-chevron-right pos-right'
          "
          class="app-icon white"
        ></i>
        <v-layout align-center class="pl-4">
          <v-avatar color="primary" size="32">
            <span class="white--text text-h6 text-uppercase">
              {{ userInfo.userName[0] }}
            </span>
          </v-avatar>
          <v-list-item class="pl-2">
            <v-list-item-content class="text-start">
              <v-list-item-title>
                {{ userInfo.fullName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ userInfo.userName }} - {{ userInfo.email }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <span v-if="userInfo.positionName">
                  {{ userInfo.positionName }} -
                </span>
                {{ userInfo.groupName }}
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-if="userInfo.phone"
                class="d-flex align-center"
              >
                <i class="app-icon icon-phone-call gray icon-size-12 mr-1"></i>
                {{ userInfo.phone }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-layout>
        <v-divider height="2"></v-divider>
        <v-layout align-center class="mt-2" justify-center>
          <v-btn class="text-capitalize mb-2" small>
            <i class="app-icon icon-message-circle gray mr-2"></i>
            {{ $t("tickets.labels.message") }}
          </v-btn>
        </v-layout>
      </v-card>
    </div>
  </v-fade-transition>
</template>

<script>
export default {
  props: {
    userInfo: {
      type: Object,
      default: undefined,
    },
    isChevronLeft: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
