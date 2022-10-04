<template>
  <v-menu
    left
    offset-y
    transition="scroll-y-transition"
    content-class="menu-action menu-action-category arrow-up"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn text fab dense small v-bind="attrs" v-on="on">
        <v-icon> mdi-dots-vertical </v-icon>
      </v-btn>
    </template>
    <v-list>
      <div class="px-2 item-action">
        <div class="action" @click="editClick">
          <i class="icon-pencil app-icon light" />
          <span>Sửa</span>
        </div>
        <div class="action" @click="removeClick">
          <i class="icon-trash app-icon light" />
          <span>Xoá</span>
        </div>
      </div>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  methods: {
    editClick() {
      this.$emit('edit-click')
    },
    removeClick() {
      this.$emit('remove-click')
    }
  }
}
</script>

<style lang="scss" scoped></style>
