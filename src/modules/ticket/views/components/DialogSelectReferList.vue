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
          <h5>{{ $t("tickets.placeholders.link") }}</h5>
          <v-icon @click="onClose"> mdi-close </v-icon>
        </v-layout>
        <v-row>
          <v-col cols="6">
            <v-layout>
              <v-select
                v-model="selectSourceType"
                outlined
                dense
                chips
                hide-details
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
                class="text--body-2 mt-2"
                :placeholder="$t('tickets.placeholders.search')"
                @keyup.enter="getListAssociation(keyword)"
                hide-details
              >
                <vue-feather slot="append" class="darken--text" type="search" />
              </v-text-field>
            </v-layout>
            <v-layout class="overlay pa-3 text--body-5 mt-3">
              {{ $t("tickets.labels.object-name") }}
            </v-layout>
            <v-layout column class="pb-4">
              <v-list class="scroll-sources-dialog-select overflow-y-auto">
                <template v-for="(item, index) in handleItems">
                  <v-list-item
                    :key="item.id"
                    @click="onSelectedRow(item, index)"
                  >
                    <v-checkbox
                      v-model="selectChecked"
                      :value="item"
                    ></v-checkbox>
                    <v-btn fab color="primary" x-small class="mr-3">
                      <i
                        class="app-icon white icon-size-22"
                        :class="getClassIconByType(item.associationType)"
                      ></i>
                    </v-btn>
                    <v-list-item-content>
                      <v-list-item-title v-html="item.name"></v-list-item-title>
                      <v-list-item-subtitle>
                        {{ $t("tickets.labels.creator") }}:
                        {{ item.creatorName }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-layout>
          </v-col>
          <v-divider vertical class="mt-4"></v-divider>
          <v-col cols="6">
            <v-layout class="text--body-1">
              {{ $t("tickets.labels.object-seleted") }} ({{
                selectedItems.length
              }})
            </v-layout>
            <v-layout class="overlay pa-3 text--body-5 mt-3">
              {{ $t("tickets.labels.object-name") }}
            </v-layout>
            <v-layout column class="pb-4">
              <v-list class="scroll-sources-dialog-select overflow-y-auto">
                <template v-for="(item, index) in selectedItems">
                  <v-list-item
                    :key="item.id"
                    @click="onDeselectedRow(item, index)"
                  >
                    <v-checkbox
                      v-model="deselectChecked"
                      :value="item"
                    ></v-checkbox>
                    <v-btn fab color="primary" x-small class="mr-3">
                      <i
                        class="app-icon white icon-size-22"
                        :class="getClassIconByType(item.associationType)"
                      ></i>
                    </v-btn>
                    <v-list-item-content>
                      <v-list-item-title v-html="item.name"></v-list-item-title>
                      <v-list-item-subtitle>
                        {{ $t("tickets.labels.creator") }}:
                        {{ item.creatorName }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-layout>
          </v-col>
        </v-row>
        <v-row>
          <v-layout justify-end class="rounded-t pa-3 drop-shadow">
            <v-btn
              color="error"
              rounded
              outlined
              class="w-140 py-5 mr-0 mr-md-3 bg-white"
              @click="onRemoveSelected"
            >
              {{ $t("selected-delete") }}
            </v-btn>
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
      activeType: null,
      activeValue: null,
      selectSourceType: null,
      deselectChecked: [],
      selectChecked: [],
      keyword: null,
      selectedItems: [],
      handleItems: [],
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
    items(val) {
      if (val.length > 0) {
        this.handleItems = [...val];
      }
    },
  },
  methods: {
    onSelectedRow(item, val) {
      this.$emit("selected-link", item.id);
      this.selectChecked.push(item);
      this.selectedItems.unshift(item);
      this.handleItems = this.handleItems.filter((x) => x !== item);
      this.activeType = item.associationType;
      this.activeValue = val;
    },
    onDeselectedRow(item, val) {
      this.handleItems.unshift(item);
      this.selectChecked = this.selectChecked.filter((x) => x !== item);
      this.selectedItems = this.selectedItems.filter((x) => x !== item);
      this.activeType = item.associationType;
      this.activeValue = val;
    },
    getColorSelected(val) {
      if (val === this.activeValue) return "primary";
      return "";
    },
    onClose() {
      this.selectChecked = [];
      this.selectedItems = [];
      this.items = [];
      this.$emit("close");
    },
    selectSource() {
      this.$emit("select-source", this.selectSourceType);
    },
    getListAssociation(keyword) {
      this.$emit("get-list-association", keyword);
    },
    onCancel() {
      this.resetItemSelected();
      this.onClose();
    },
    onRemoveSelected() {
      this.selectChecked = [];
      this.selectedItems = [];
      this.items = [];
    },
    resetItemSelected() {
      this.selectSourceType = null;
    },
    onAccept() {
      this.$emit("on-accept", this.selectChecked, this.activeType);
    },
  },
};
</script>
