<template>
  <v-card class="card-ticket card-type-ticket" color="#00C3F9">
    <v-card-title class="d-flex align-center">
      <span class="text--subtitle white--text d-flex align-center">
        {{ $t("ticket-manager.menu.ticket-type") }}
        <span class="text--small pl-1">({{ typesTicket.length }})</span>
      </span>
      <span v-if="isAdminTicket" class="pl-2">
        <v-btn
          :to="{ name: routeNames.CREATE_CATEGORY_TICKET }"
          color="white"
          elevation="0"
          fab
          style="width: 28px; height: 28px"
          x-small
        >
          <v-icon color="#4A50E2" size="28">mdi-plus-circle-outline</v-icon>
        </v-btn>
        <!-- <menu-actions
          @edit-click="editTypeTicketClick"
          @remove-click="removeTypeTicketClick"
        />-->
      </span>
    </v-card-title>
    <div
      v-if="isAdminTicket"
      class="form-filter text--small white--text d-flex align-center"
    >
      <v-checkbox
        v-model="checkedActive"
        class="ml-3"
        color="#ffffff"
        hide-details
        @change="onChangeCheckActive"
      >
        <template v-slot:label>
          <div class="white--text text--small">
            {{ $t("ticket-manager.active") }}
          </div>
        </template>
      </v-checkbox>
      <v-checkbox
        v-model="checkedInActive"
        class="ml-3 pl-6"
        color="#ffffff"
        hide-details
        @change="onChangeCheckInActive"
      >
        <template v-slot:label>
          <div class="white--text text--small">
            {{ $t("ticket-manager.inactivate") }}
          </div>
        </template>
      </v-checkbox>
    </div>
    <div class="list-type-ticket list-card-ticket">
      <div class="d-flex align-center mb-4">
        <v-text-field
          v-model="txtSearch"
          background-color="white"
          clearable
          color="primary"
          dense
          hide-details
          outlined
          placeholder="Tìm kiếm"
          @input="searchfilter"
        >
          <template v-slot:append>
            <img src="@/assets/icons/icon-search.svg" />
          </template>
        </v-text-field>
      </div>
      <v-list v-show="typesTicket.length > 0" class="px-0" dense nav>
        <v-list-item-group
          v-model="selectedTypeTicket"
          color="primary"
          mandatory
        >
          <v-list-item
            v-for="(item, i) in typesTicket"
            :key="i"
            :ripple="false"
            @click="emmitTypeTicket(item)"
          >
            <v-list-item-content>
              <div class="d-flex align-center justify-space-between">
                <v-list-item-title v-text="item.name" />
                <v-rating
                  background-color="#FFB74A"
                  class="btn-fav"
                  empty-icon="icon-star"
                  full-icon="icon-star-active"
                  hover
                  length="1"
                  size="20"
                />
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
    <base-preload :dialog="loading" />
  </v-card>
</template>

<script>
import routeNames from "@/modules/ticket/router/routeNames";
// Components
// import MenuActions from './MenuActions.vue'
// Services
import { CategoryService } from "@/modules/ticket/services/categoryService";
import mixinFindUserRole from "@/modules/ticket/mixins/mixinFindUserRole";

export default {
  // components: { MenuActions },
  mixins: [mixinFindUserRole],
  props: {
    categoryId: {
      type: Number,
      default: undefined,
    },
    reloadCategory: {
      type: Boolean,
      default: undefined,
    },

  },
  data() {
    return {
      routeNames,
      typesTicket: [],
      selectedTypeTicket: null,
      isEditTypeTicket: false,
      isRemoveTypeTicket: false,
      editingTypeTicket: null,
      categoryName: "",
      txtSearch: "",
      checkedActive: false,
      checkedInActive: false,
      loading: false,
    };
  },
  computed: {
    // admin
    isAdminTicket() {
      const groupIds = this.findAdminGroupIds;
      if (groupIds && groupIds.length > 0) {
        return true;
      }

      return false;
    },
  },
  watch: {
    editingTypeTicket(id) {
      this.categoryName = this.typesTicket[id].name;
    },
    reloadCategory(val) {
      if (val) {
        this.findTicketCategory();
      }
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      if (this.isAdminTicket) {
        this.checkedActive = true;
        this.checkedInActive = true;
      } else {
        this.checkedActive = true;
        this.checkedInActive = false;
      }
      this.findTicketCategory();
    },
    async findTicketCategory() {
      try {
        const pars = this.bindRequestPars();
        const dataTypeTicket = await CategoryService.findTicketCategory(pars);
        this.loading = true;
        if (dataTypeTicket) {
          this.typesTicket = dataTypeTicket.data;
          this.selectedTypeTicket = 0;
          this.emmitTypeTicket(this.typesTicket[0]);
        } else {
          this.typesTicket = [];
        }
      } catch (error) {
        return error;
      } finally {
        this.loading = false;
      }
    },
    checkSelectItem(select) {
      if (this.selectedTypeTicket) {
        return this.selectedTypeTicket;
      }
    },
    // event checkbox search
    bindRequestPars() {
      const pars = {};
      if (this.checkedInActive && !this.checkedActive) {
        pars["status"] = 0;
      } else if (this.checkedActive && !this.checkedInActive) {
        pars["status"] = 1;
      }

      if (this.txtSearch) {
        pars["name"] = this.txtSearch.trim();
      }

      return pars;
    },
    // function search
    searchfilter() {
      this.findTicketCategory();
    },
    classEditing(i) {
      return this.editingTypeTicketId(i) ? "d-none" : "";
    },
    editTypeTicketClick() {
      this.isEditTypeTicket = !this.isEditTypeTicket;
      this.isRemoveTypeTicket = false;
      this.editingTypeTicket = null;
    },
    removeTypeTicketClick() {
      this.isRemoveTypeTicket = !this.isRemoveTypeTicket;
      this.isEditTypeTicket = false;
      this.editingTypeTicket = null;
    },
    editingTypeTicketId(id) {
      return id === this.editingTypeTicket;
    },
    emmitTypeTicket(typeTicket) {
      this.$emit("type-ticket", typeTicket.id);
    },
    onChangeCheckActive() {
      this.searchfilter();
    },
    onChangeCheckInActive() {
      this.searchfilter();
    },
  },
};
</script>

<style lang="scss" scoped></style>
