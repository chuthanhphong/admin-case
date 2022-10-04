<template>
  <v-dialog
    v-model="internalValue"
    max-width="702"
    persistent
    transition="dialog-transition"
  >
    <v-card>
      <v-container class="container-ticket">
        <v-layout justify-space-between class="mb-4">
          <h5>{{ $t("tickets.placeholders.source") }}</h5>
          <v-icon @click="onClose"> mdi-close </v-icon>
        </v-layout>
        <v-layout>
          <v-select
            v-model="selectSourceType"
            outlined
            dense
            chips
            :placeholder="$t('tickets.placeholders.object-type')"
            class="text--body-2"
            :items="lstModuleType"
            item-text="name"
            @change="selectSource()"
          >
            <template v-slot:item="{ item }">
              <v-btn fab color="primary" x-small class="mr-3">
                <i
                  class="app-icon white icon-size-22"
                  :class="getClassIconByType(item.name)"
                ></i>
              </v-btn>
              <span>
                {{ $t(getTextByType(item.name)) }}
              </span>
            </template>
            <template v-slot:selection="{ item }">
              <v-btn fab color="primary" x-small class="mr-3">
                <i
                  class="app-icon white icon-size-22"
                  :class="getClassIconByType(item.name)"
                ></i>
              </v-btn>
              <span>
                {{ $t(getTextByType(item.name)) }}
              </span>
            </template>
          </v-select>
        </v-layout>
        <v-layout>
          <v-text-field
            v-model="keyword"
            outlined
            dense
            class="text--body-2"
            :placeholder="$t('tickets.placeholders.search')"
            hide-details
            @keyup.enter="getListAssociation(keyword)"
          >
            <vue-feather slot="append" class="darken--text" type="search" />
          </v-text-field>
        </v-layout>
        <v-layout class="overlay pa-3 text--body-5 mt-3">
          {{ $t("tickets.labels.object-name") }}
        </v-layout>
        <v-layout column class="pb-4">
          <v-list class="scroll-sources-dialog-select overflow-y-auto">
            <template v-for="(item, index) in items">
              <v-list-item
                :key="index"
                :class="getColorSelected(index)"
                @click="onSelectedRow(item, index)"
              >
                <v-btn fab color="primary" x-small class="mr-3">
                  <i
                    class="app-icon white icon-size-22"
                    :class="getClassIconByType(item.associationType)"
                  ></i>
                </v-btn>
                <v-list-item-content>
                  <v-list-item-title v-html="item.name"></v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t("tickets.labels.creator") }}: {{ item.creatorName }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-layout>
        <v-row>
          <v-layout justify-end class="rounded-t pa-3 drop-shadow">
            <v-btn
              color="primary"
              rounded
              outlined
              class="w-140 py-5 mr-0 mr-md-3 bg-white"
              @click="onCancel"
            >
              {{ $t("cancel") }}
            </v-btn>
            <v-btn rounded color="primary" class="w-140 py-5" @click="onAccept">
              {{ $t("selectLabel") }}
            </v-btn>
          </v-layout>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
// libs
import mixinModuleType from "@/modules/ticket/mixins/mixinModuleType";

export default {
  mixins: [mixinModuleType],
  props: {
    value: Boolean,
    lstModuleType: {
      type: Array,
      default: undefined,
    },
    items: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      internalValue: this.value,
      itemSelected: null,
      activeName: null,
      activeType: null,
      activeId: null,
      activeValue: null,
      selectSourceType: null,
      keyword: null,
    };
  },
  watch: {
    internalValue(val, oldVal) {
      if (val === oldVal) return;

      this.$emit("input", val);
    },
    value(val, oldVal) {
      if (val === oldVal) return;

      this.internalValue = val;
    },
  },
  methods: {
    onSelectedRow(item, val) {
      this.activeName = item.name;
      this.activeType = item.associationType;
      this.activeId = item.id;
      this.activeValue = val;
    },
    getColorSelected(val) {
      if (val === this.activeValue) return "primary";
      return "";
    },
    selectSource() {
      this.$emit("select-source", this.selectSourceType);
    },
    getListAssociation(keyword) {
      this.$emit("get-list-association", keyword);
    },
    onClose() {
      this.$emit("input", false);
    },
    onCancel() {
      this.resetItemSelected();
      this.onClose();
    },
    resetItemSelected() {
      this.itemSelected = null;
    },
    onAccept() {
      this.$emit("on-accept", this.activeId, this.activeType, this.activeName);
    },
  },
};
</script>
