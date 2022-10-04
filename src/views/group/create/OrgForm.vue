<template>
  <div>
    <div class="row justify-space-between">
      <!-- Ten don vi -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">
            {{ $t('group.groupName') }}
            <span class="color-require ">*</span>
          </label>
          <validation-provider
            v-slot="{ errors }"
            name="groupName"
            :rules="groupNameInput"
          >
            <v-text-field
              id="groupName"
              v-model="group.groupName"
              name="groupName"
              maxlength="255"
              :placeholder="$t('group.groupName')"
              outlined
              dense
              :error-messages="errors"
              required
              class="text--body-1"
              @change="group.groupName = trimSpace(group.groupName)"
            />
          </validation-provider>
        </div>
      </div>
      <!-- Ma don vi -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">
            {{ $t('group.groupCode') }}
            <span class="color-require">*</span></label>
          <validation-provider
            v-slot="{ errors }"
            name="groupCode"
            :rules="groupCodeInput"
          >
            <v-text-field
              id="groupCode"
              v-model="group.groupCode"
              :placeholder="$t('group.groupCode')"
              maxlength="255"
              outlined
              dense
              :error-messages="errors"
              required
              class="text--body-1"
            />
          </validation-provider>
        </div>
      </div>
    </div>
    <div class="row justify-space-between mt-0">
      <!-- Ten don vi cha -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">
            {{ $t('group.parentName') }}
            <span class="color-require ">*</span></label>
          <validation-provider
            v-slot="{ errors }"
            name="parentName"
            rules="required"
          >
            <v-autocomplete
              v-model="group.parentGroupId"
              :items="parents"
              item-text="groupName"
              item-value="groupId"
              outlined
              attach
              dense
              cache-items
              :placeholder="$t('group.parentName')"
              required
              hide-no-data
              :error-messages="errors"
              class="text--body-1"
              @change="selectedParent"
            >
              <vue-feather
                slot="prepend-inner"
                class="grey--text"
                type="search"
              />
              <template v-slot:append>
                <v-icon>mdi-chevron-down</v-icon>
              </template>

              <template v-slot:item="data">
                <div class="select-item flex-column d-flex">
                  <div class="title-item">{{ data.item.groupName }}</div>
                  <div class="desc-item">{{ data.item.parentPathName }}</div>
                </div>
              </template>
            </v-autocomplete>
          </validation-provider>
        </div>
      </div>
      <!-- Thu tu sap xep -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">
            {{ $t('group.orderNo') }}</label>
          <validation-provider
            v-slot="{ errors }"
            name="orderNo"
            :rules="numberPositive"
          >
            <v-text-field
              id="orderNo"
              v-model="group.orderNo"
              :placeholder="$t('group.orderNo')"
              :error-messages="errors"
              outlined
              dense
              type="number"
              oninput="validity.valid||(value='');"
              class="text--body-1"
            />
          </validation-provider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rules from '@/mixins/rules'

export default {
  name: 'OrgForm',
  mixins: [rules],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    group: {
      type: Object,
      default: undefined
    },
    parents: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      search: null
    }
  },
  mounted() {
    console.log(this.parents)
  },
  methods: {
    selectedParent(groupId) {
      const parent = this.parents.find(g => g.groupId === groupId)
      this.group.orderNo = parent.numberOfChildrenGroup + 1
    },
    trimSpace(val) {
      var value = val.trim()
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.col-md-5 {
  padding-bottom: 0 !important;
}
</style>
