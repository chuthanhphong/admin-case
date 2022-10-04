<template>
  <div>
    <div v-for="(item, index) in formdata.userRoles" :key="index">
      <div class="mt-1 justify-space-between border-dasher px-4 py-2 mb-2">
        <v-col md="12">
          <div class="pt-1 pb-1 d-flex flex-column">
            <v-row class="mt-1 d-flex justify-space-between">
              <v-col md="5" cols="12" class="py-0">
                <!-- Don vi/ phong ban -->
                <label class="text-uppercase text--body-1">
                  {{ $t('users.groupName') }}
                  <span class="color-require ">*</span>
                </label>
                <div
                  class="detail-content text--body-1"
                  v-text="genGroupName(item.groupId)"
                />
              </v-col>
              <v-col md="5" cols="12" class="ml-0 ml-md-3 py-0">
                <!-- Chuc danh -->
                <label class="text-uppercase text--body-1">
                  {{ $t('users.position') }}</label>
                <div class="detail-content text--body-1" v-text="item.position" />
              </v-col>
            </v-row>
            <v-row class="mt-1 justify-space-between">
              <v-col md="5" cols="12" class="pb-1">
                <!-- Loai vai tro -->
                <label class="text-uppercase text--body-1">
                  {{ $t('users.isDefault') }}
                </label>
                <div
                  class="detail-content text--body-1"
                  v-text="$t(showRoleType(item.roleType))"
                />
              </v-col>
              <v-col cols="12" md="5">
                <!-- Vai tro -->
                <label class="text-uppercase text--body-1">
                  {{ $t('users.roleId') }}
                </label>
                <div class="detail-content text--body-1" v-text="genRoleName(item.roleId)" />
              </v-col>
            </v-row>
          </div>
        </v-col>
      </div>
    </div>
  </div>
</template>

<script>
import constants from '@/constants'

export default {
  name: 'ListRoleUser',
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    parents: {
      type: Array,
      default: undefined
    },
    userRoles: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {}
  },
  methods: {
    showRoleType(value) {
      switch (value) {
        case constants.USER_ROLE.MAIN:
          return 'userRole.main'
        case constants.USER_ROLE.CONCURRENTLY:
          return 'userRole.concurrently'
        case constants.USER_ROLE.OTHER:
          return 'userRole.other'
      }
    },
    genGroupName(groupId) {
      let text = ''
      const group = this.parents.find(g => g.groupId === groupId)
      if (group) {
        text = group.groupName
      }
      return text
    },
    genRoleName(roleId) {
      let text = ''
      const roles = this.userRoles.find(g => g.roleId === roleId)
      if (roles) {
        text = roles.roleName
      }
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
.form-new {
  position: relative;
  border: 0.5px #7b8794 dashed;
  border-radius: 5px;
  .theme--light.v-data-table
    > .v-data-table__wrapper
    > table
    > tbody
    > tr:not(:last-child)
    > td:not(.v-data-table__mobile-row) {
    border-bottom: none;
  }
  .table {
    background-color: #e9f8f9;
    thead tr th {
      background: #e9f8f9;
    }
  }
}
</style>
