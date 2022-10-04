<template>
  <v-autocomplete
    v-model="selectedGroup"
    :search-input.sync="search"
    outlined
    :no-data-text="$t('users.itemGroupName')"
    hide-selected
    hide-details
    maxlength="255"
    floating
    solo
    attach
    dense
    elevation="0"
    :menu-props="{
      bottom: true,
      offsetY: true
    }"
    :placeholder="$t('contract.label.selectScopeUse')"
    :label="$t('contract.label.selectScopeUse')"
    :items="groups"
    item-text="groupName"
    item-value="groupId"
    chips
    deletable-chips
    multiple
  >
    <vue-feather slot="append" class="grey--text" type="search" />
    <template v-slot:item="data">
      <div class="select-item flex-column d-flex">
        <div class="title-item">{{ data.item.groupName }}</div>
        <div class="desc-item">{{ data.item.groupPathName }}</div>
      </div>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  props: {
    groups: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      search: '',
      selectedGroup: []
    }
  },
  watch: {
    selectedGroup() {
      this.$emit('selected-scope', this.selectedGroup)
      this.search = ''
    }
  }
}
</script>

<style lang="scss">
.v-select__selections {
  .v-chip--select {
    margin-bottom: 2px !important;
  }
}
</style>
