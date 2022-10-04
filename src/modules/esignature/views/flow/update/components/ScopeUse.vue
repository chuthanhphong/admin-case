<template>
  <div v-if="checkShowScope">
    <validation-provider v-slot="{ errors }" name="groupUse" rules="required">
      <v-autocomplete
        v-model="selectedGroup"
        :search-input.sync="search"
        outlined
        :no-data-text="$t('users.itemGroupName')"
        hide-selected
        maxlength="255"
        :error-messages="errors"
        floating
        solo
        attach
        :filter="filterItems"
        dense
        elevation="0"
        :menu-props="{
          bottom: true,
          offsetY: true
        }"
        :placeholder="$t('document.label.selectScopeUse')"
        :label="$t('document.label.selectScopeUse')"
        :items="groups"
        :item-text="(item) => genGroupName(item.groupName)"
        item-value="groupId"
        chips
        deletable-chips
        multiple
        required
        class="text--body-1"
      >
        <vue-feather slot="append" class="grey--text" type="search" />
        <template v-slot:item="data">
          <div class="select-item flex-column d-flex">
            <div class="title-item">{{ data.item.groupName }}</div>
            <div class="desc-item">
              {{ data.item.pathName }}
            </div>
          </div>
        </template>
      </v-autocomplete>
    </validation-provider>
  </div>
</template>

<script>
import filterItems from '@/mixins/filterItems.js'

export default {
  mixins: [filterItems],
  props: {
    groups: {
      type: Array,
      default: undefined
    },
    initScopes: {
      type: Array,
      default: undefined
    },
    checkShowScope: {
      type: Boolean,
      default: false
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
    },
    initScopes() {
      this.selectedGroup = this.initScopes
    }
  },
  methods: {
    genGroupName(groupName) {
      if (groupName.length > 30) {
        groupName = `${groupName.slice(0, 30)}...`
      }
      return groupName
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
