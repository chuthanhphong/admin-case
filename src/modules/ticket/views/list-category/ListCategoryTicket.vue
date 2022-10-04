<template>
  <div class="container container-ticket">
    <h5 class="title-page text-primary">{{ $t("ticket-manager.menu.list-category") }}</h5>
    <div class="wrap-category-ticket">
      <category-ticket
        :reload-category.sync="reloadCategory"
        @type-ticket="setListTypeTicketId"
      />
      <category-detail
        :type-ticket-id="typeTicketId"
        @reload-category="onReloadCategory"
        @show-dialog-create-ticket="onShowDialogCreateTicket"
      />
    </div>

    <dialog-create-ticket
      v-model="isShowDialogCreateTicket"
      :category-id="typeTicketId"
      :types-ticket="typesTicket"
    />
  </div>
</template>

<script>
import DialogCreateTicket from "@/modules/ticket/views/components/create-ticket/DialogCreateTicket";

import CategoryDetail from "./components/CategoryDetail.vue";
import CategoryTicket from "./components/CategoryTicket.vue";
export default {
  components: { CategoryDetail, CategoryTicket, DialogCreateTicket },
  data() {
    return {
      activeCategoryId: null,
      activeTypeTicketId: null,
      typeTicketId: null,
      typeDetail: {},
      reloadCategory: false,
      isShowDialogCreateTicket: false,
      typesTicket: [],
      loading: false,
    };
  },
  created() {},
  methods: {
    setCategoryActive(id) {
      this.activeCategoryId = id;
    },
    setListTypeTicketId(id) {
      this.typeTicketId = id;
    },
    onReloadCategory(val) {
      this.loading = true
      this.reloadCategory = val;
    },
    onShowDialogCreateTicket(val) {
      this.typesTicket = [];
      this.typesTicket.push(val);
      this.isShowDialogCreateTicket = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
