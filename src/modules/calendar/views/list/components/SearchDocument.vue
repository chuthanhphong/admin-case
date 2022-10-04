<template>
  <div class="px-5">
    <div
      class="d-flex pt-3 justify-end align-center"
    >
      <v-text-field
        id="txt-search"
        v-model="formdata.meetingTitle"
        :placeholder="
          $t('calendar.meetingScheduleList.searchMeetingSchedule')
        "
        outlined
        dense
        autofocus
        class="mw-200 mr-3"
        clearable
        hide-details
        @change="formdata.meetingTitle = trimSpace(formdata.meetingTitle)"
        @keyup.enter="searchCalendar"
      >
        <vue-feather
          slot="append"
          type="search"
          size="20"
        />
      </v-text-field>

      <!-- Btn advance search -->
      <v-menu
        v-model="showAdvance"
        offset-x
        offset-y
        left
        attach
        :close-on-content-click="false"
        min-width="460px"
        max-width="460px"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on: menuState, attrs }">
          <v-tooltip top content-class="tooltip-top">
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                v-bind="attrs"
                outlined
                class="btn-show-advance mx-0 ml-1"
                v-on="{ ...menuState, ...tooltip }"
              >
                <i class="app-icon icon-advance darken" />
              </v-btn>
            </template>
            <div>
              {{ $t("calendar.advanceSearch.searchAdvanceNote") }}
            </div>
          </v-tooltip>
        </template>
        <AdvanceSearch
          :formdata="formdata"
          :show-advance="showAdvance"
          :searching-type="searchingType"
          @close-dialog="onClosePopupAdvanceSearch"
          @submit-dialog="onSubmitAdvanceSearch"
        />
      </v-menu>

      <div class="ml-5">
        <v-btn background-color="#fff" class="btn-room-empty">
          <span class="pr-2 text-capitalize text--button">
            {{ $t('calendar.meetingScheduleList.roomEmpty') }}
          </span>
          <vue-feather type="search" class="pr-2" size="25" />
        </v-btn>
      </div>

      <!-- Btn vao so den -->
      <div class="ml-5">
        <v-tooltip top content-class="tooltip-top">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              color="#0FAFE4"
              class="btn-create"
              v-on="on"
              @click="createMeeting"
            >
              <vue-feather type="plus-circle" size="25" />
            </v-btn>
          </template>
          <div>
            {{ $t('calendar.meetingScheduleList.createMeetingSchedule') }}
          </div>
        </v-tooltip>
      </div>
    </div>

  </div>
</template>

<script>
import AdvanceSearch from "@/modules/calendar/views/list/components/AdvanceSearch.vue";

export default {
  name: 'SearchDocument',
  components: { AdvanceSearch },

  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    search: {
      type: Function,
      default: undefined
    },
    searchingType: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      showAdvance: false,
      show: false,
    }
  },
  created() {},
  methods: {
    trimSpace(val) {
      return val ? val.trim() : ''
    },
    onClosePopupAdvanceSearch() {
      this.showAdvance = false;
    },

    // tao moi
    createMeeting() {
      this.$emit('show-dialog-save')
    },

    onSubmitAdvanceSearch(params, listIndexState) {
      this.$emit("advance-search", params, listIndexState)
    },
    searchCalendar() {
      this.search()
    }
  }
}
</script>

<style></style>
