<template>
  <v-dialog
    v-model="internalValue"
    hide-overlay
    max-width="576"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="px-3 py-2">
      <v-layout class="mb-3" justify-space-between>
        <label class="text-h6 font-weight-bold">
          {{ title }}
        </label>
        <v-icon @click="onCancel">mdi-close</v-icon>
      </v-layout>
      <v-layout>
        <v-text-field
          v-model="search"
          :placeholder="$t('search')"
          clearable
          dense
          hide-details=""
          outlined
        >
          <vue-feather slot="append" class="darken--text" type="search" />
        </v-text-field>
      </v-layout>
      <v-divider class="mt-1" />
      <label>{{ $t("searchs") }}</label>
      <v-row>
        <v-col>
          <v-card-text>
            <v-treeview
              v-model="selection"
              :filter="filter"
              :items="items"
              :open.sync="open"
              :search="search"
              class="treeview-scroll-content"
              color="primary"
              item-key="groupId"
              item-text="groupName"
              return-object
              selectable
              selection-type="independent"
              @input="onUpdate"
            />
          </v-card-text>
        </v-col>
      </v-row>

      <v-divider />

      <v-layout justify-end>
        <v-card-actions>
          <v-btn
            class="w-140 py-5 mr-0 mr-md-3 bg-white"
            color="error"
            elevation="1"
            outlined
            rounded
            @click="onDeleteTreeSelected"
          >
            {{ $t("selected-delete") }}
          </v-btn>
          <v-btn
            class="w-140 py-5 mr-0 mr-md-3 bg-white"
            color="primary"
            elevation="1"
            outlined
            rounded
            @click="onCancel"
          >
            <span class="text-primary">{{ $t("cancel") }}</span>
          </v-btn>
          <v-btn
            :disabled="disableAccept"
            class="w-140 py-5"
            color="primary"
            rounded
            @click="onSelectedGroup"
          >
            {{ $t("selected") }}
          </v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
  </v-dialog>
</template>
<script>
var LTT = require("list-to-tree");

export default {
  props: {
    value: Boolean,
    title: {
      type: String,
      default: undefined,
    },
    groupId: {
      type: Number,
      default: null,
    },
    allGroups: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      internalValue: this.value,
      selection: [],
      items: [],
      open: [],
      search: null,
    };
  },
  computed: {
    filter() {
      return undefined;
    },
    disableAccept() {
      return this.selection.length === 0;
    },
  },
  watch: {
    internalValue(val, oldVal) {
      if (val === oldVal) return;

      this.$emit("input", val);
    },
    value(val, oldVal) {
      if (val === oldVal) return;

      this.internalValue = val;

      if (val && this.groupId) {
        this.bindGroupDefault();
      } else {
        this.selection = [];
      }
    },
    allGroups(val) {
      if (val) {
        this.items = this.prepareDataGroupsToTree(val);
        this.open.push({ groupId: val[0].groupId });
      }
    },
  },
  created() {},
  methods: {
    bindGroupDefault() {
      const itemGroup = this.allGroups.find((x) => x.groupId === this.groupId);
      if (itemGroup) {
        this.selection = [itemGroup];
      }
    },
    prepareDataGroupsToTree(arrData) {
      const arrCopy = arrData.map((item) => ({ ...item }));
      let tree = null;
      const first = arrCopy[0];
      if (first.parentGroupId === null) {
        first.parentGroupId = 0;
        var ltt = new LTT(arrCopy, {
          key_id: "groupId",
          key_parent: "parentGroupId",
          key_child: "children",
        });
        tree = ltt.GetTree();
      } else {
        tree = this.arrayToTreeNoRoot(arrCopy, first.parentGroupId);
      }

      return tree;
    },
    arrayToTreeNoRoot(arr, parent = 0) {
      return arr
        .filter((item) => item.parentGroupId === parent)
        .map((child) => ({
          ...child,
          children: this.arrayToTreeNoRoot(arr, child.groupId),
        }));
    },
    onUpdate(val) {
      const last = val.slice(-1);
      this.selection = last;
    },
    onSelectedGroup() {
      if (this.selection && this.selection.length > 0) {
        this.$emit("selected-group", this.selection);
      }
      this.onClose();
    },
    onDeleteTreeSelected() {
      this.selection = [];
    },
    onCancel() {
      this.selection = [];
      this.$emit("on-cancel");
      this.onClose();
    },
    onClose() {
      this.$emit("input", false);
      // this.$emit("on-cancel");
    },
  },
};
</script>
