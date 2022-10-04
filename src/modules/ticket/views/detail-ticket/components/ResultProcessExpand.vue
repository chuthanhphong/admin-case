<template>
  <v-expansion-panels v-model="expanded" class="rounded-0 no-z-index">
    <v-expansion-panel class="rounded-0">
      <v-expansion-panel-header color="warning" class="rounded-0">
        <v-layout justify-space-between>
          <v-layout align-center>
            <v-btn fab x-small color="white" class="mr-3">
              <i class="app-icon icon-information warning"></i>
            </v-btn>
            <label class="text--subtitle-2 white--text">
              {{ $t("tickets.labels.result-process") }}
            </label>
          </v-layout>
        </v-layout>
        <template v-slot:actions>
          <v-icon color="white"> $expand </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content
        class="scroll-expand-task-detail-ticket overflow-y-auto rounded-0"
      >
        <v-layout column>
          <h5 v-if="isShowNoteDone" class="text--body-2">
            {{ $t("tickets.labels.note") }}:
          </h5>
          <span class="px-2">{{ note }}</span>
          <v-layout v-if="detail.outputFileAttachments">
            <h5 class="text--body-2">
              {{ $t("tickets.labels.attach-file") }}:
            </h5>
          </v-layout>
          <v-layout justify-space-between>
            <v-layout column justify-end>
              <ul class="list-files text--caption">
                <li
                  v-for="(item, idxFile) in detail.outputFileAttachments"
                  :key="idxFile"
                  @click="downloadFileAttach(item)"
                >
                  <img :src="getIconFile(`${item.fileName}`)" class="mr-2" />
                  <a class="text-decoration-underline">{{ item.fileName }}</a>
                </li>
              </ul>
            </v-layout>
          </v-layout>
        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
// import { definedStatus } from "@/modules/ticket/helpers/ticketUtils";
import mixinComputedState from "../mixins/mixinComputedState";
import mixinUploadFiles from "@/modules/ticket/mixins/mixinUploadFiles";

export default {
  mixins: [mixinComputedState, mixinUploadFiles],
  props: {
    detail: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      expanded: 0,
      note: "",
    };
  },
  computed: {
    isShowNoteDone() {
      const logDone = this.getLogDone;
      if (logDone.length > 0) {
        this.setTextNote(logDone);
        return true;
      }
      return false;
    },
    getLogDone() {
      return this.detail.ticketLogDtos.filter((e) => e.type === 12);
    },
  },
  methods: {
    // downloadFileAttach(val) {
    //   console.log(val)
    // },
    setTextNote(data) {
      this.note = data[0].note;
    },
  },
};
</script>
