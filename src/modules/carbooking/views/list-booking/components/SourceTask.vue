<template>
  <div>
    <span class="label-input">
      {{ $t("booking.dialog-create.label.source") }}
    </span>
    <div>
      <div @click="openDialogSelectSoureTask">
        <v-autocomplete
          v-model="sourceTask"
          :item-text="(item) => item.name"
          :item-value="(item) => item.id"
          :items="listSourceTask"
          :placeholder="$t('task-manager.placeHolder.source-task')"
          :autofocus="true"
          class="text--body-5 cursor-pointer"
          dense
          height="40px"
          hide-no-data
          outlined
          readonly
          return-object
          append-icon="mdi-magnify"
        >
          <template v-slot:selection="data">
            <v-chip
              close
              @click="data.select"
              @click:close="removeSourceTask()"
            >
              <v-avatar left>
                <img
                  v-if="data.item.associationType === 'DOCUMENT'"
                  src="@/assets/icons/task/createTask/document.svg"
                />
                <img
                  v-if="data.item.associationType === 'TICKET'"
                  src="@/assets/icons/task/createTask/ticket.svg"
                />
                <img
                  v-if="data.item.associationType === 'TASK'"
                  src="@/assets/icons/task/createTask/work.svg"
                />
              </v-avatar>
              {{ data.item.name }}
            </v-chip>
          </template>
        </v-autocomplete>
      </div>
      <dialog-select-source-task
        :show-dialog="showDialogSelectSoucreTask"
        :source-task="sourceTask"
        :title="'task-manager.title.source-task'"
        @source-task="sourceTaskFromEmit"
        @close-dia-log="closeDialogSelectSourceTask"
        @list-association="listAssociationFromEmit"
      />
    </div>
  </div>
</template>

<script>
import DialogSelectSourceTask from "@/components/dialog/DialogSelectSourceTask";
export default {
  components: {
    DialogSelectSourceTask,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showDialogSelectSoucreTask: false,
      listSourceTask: [],
      sourceTask: null,
    };
  },
  watch: {
    isShow() {
      if (!this.isShow) {
        this.sourceTask = null;
      }
    },
  },
  methods: {
    openDialogSelectSoureTask() {
      this.showDialogSelectSoucreTask = true;
    },
    closeDialogSelectSourceTask() {
      this.showDialogSelectSoucreTask = false;
    },
    listAssociationFromEmit(val) {
      this.listSourceTask = val;
    },
    removeSourceTask() {
      this.sourceTask = null;
      this.$emit("sourceTask", this.sourceTask);
    },
    sourceTaskFromEmit(value) {
      this.sourceTask = value;
      this.$emit("sourceTask", this.sourceTask);
    },
  },
};
</script>
