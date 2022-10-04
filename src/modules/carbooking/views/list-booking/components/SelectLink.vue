<template>
  <div>
    <span class="label-input">
      {{ $t("booking.dialog-create.label.link") }}
    </span>
    <div>
      <v-autocomplete
        v-model="taskAssociations"
        :hide-selected="true"
        :item-text="(item) => item.name"
        :item-value="(item) => item.id"
        :items="taskAssociations"
        :autofocus="true"
        :placeholder="$t('task-manager.placeHolder.link-to')"
        class="text--body-5 cursor-pointer"
        dense
        height="auto"
        hide-no-data
        multiple
        outlined
        return-object
        append-icon="mdi-magnify"
        @click="OpenDialogSelectTaskAssociations"
      >
        <template v-slot:selection="{ item, index }">
          <v-chip close @click:close="removeLinkTo(index)">
            <v-avatar left>
              <img
                v-if="item.associationType === 'DOCUMENT'"
                src="@/assets/icons/task/createTask/document.svg"
              />
              <img
                v-if="item.associationType === 'TICKET'"
                src="@/assets/icons/task/createTask/ticket.svg"
              />
              <img
                v-if="item.associationType === 'TASK'"
                src="@/assets/icons/task/createTask/work.svg"
              />
            </v-avatar>
            {{ item.name }}
          </v-chip>
        </template>
      </v-autocomplete>
      <dialog-select-link-to
        :show-dialog="showDialogSelectTaskAssociations"
        :task-associations="taskAssociations"
        :title="'task-manager.title.link-to'"
        @list-link-to="taskAssociationsFromEmit"
        @close-dia-log="closeDialogSelectTaskAssociations"
      />
    </div>
  </div>
</template>

<script>
import DialogSelectLinkTo from "@/components/dialog/DialogSelectLinkTo";

export default {
  components: {
    DialogSelectLinkTo,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      taskAssociations: null,
      showDialogSelectTaskAssociations: false,
    };
  },
  watch: {
    isShow() {
      if (!this.isShow) {
        this.taskAssociations = null;
      }
    },
  },
  methods: {
    closeDialogSelectTaskAssociations() {
      this.showDialogSelectTaskAssociations = false;
    },
    OpenDialogSelectTaskAssociations() {
      this.showDialogSelectTaskAssociations = true;
    },
    removeLinkTo(index) {
      if (index >= 0) {
        this.taskAssociations.splice(index, 1);
        this.$emit("taskAssociations", this.taskAssociations);
      }
    },
    taskAssociationsFromEmit(value) {
      this.taskAssociations = value;
      this.$emit("taskAssociations", this.taskAssociations);
    },
  },
};
</script>
