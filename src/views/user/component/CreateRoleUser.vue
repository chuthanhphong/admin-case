<template>
  <div>
    <div v-for="(a, index) in formdata.userRoles" :key="index">
      <div class="mt-1 justify-space-between border-dasher px-4 py-2 mb-2">
        <v-col md="12">
          <div class="pt-1 pb-1 mt-1 d-flex flex-column">
            <v-row class="mt-1 d-flex justify-space-between">
              <v-col md="5" cols="12" class="py-0">
                <!-- Don vi/ phong ban -->
                <label class="text-uppercase text--body-1">
                  {{ $t('users.groupName') }}
                  <span class="color-require">*</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="groupNameOrType"
                  :vid="`groupName-${index}`"
                >
                  <v-autocomplete
                    v-model="formdata.userRoles[index].groupId"
                    :items="parents"
                    attach
                    item-text="groupName"
                    item-value="groupId"
                    :filter="filterItems"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      maxHeight: 133
                    }"
                    outlined
                    dense
                    :placeholder="$t('create-user.groupName')"
                    required
                    :error-messages="errors"
                    :disabled="!showRemove(a.roleId)"
                    class="text--body-1"
                    @change="
                      onChangegroupType(
                        formdata.userRoles[index].groupId,
                        index
                      )
                    "
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
                        <div class="title-item">
                          {{ data.item.groupName }}
                        </div>
                        <div class="desc-item">
                          {{ getParentGroupName(data.item) }}
                        </div>
                      </div>
                    </template>
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title>
                          {{ $t('users.itemGroupName') }}
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col md="5" cols="12" class="ml-0 ml-md-3 py-0">
                <!-- Chuc danh -->
                <validation-provider
                  v-slot="{ errors }"
                  name="position"
                  :rules="checkInternal(index) ? 'required' : ''"
                  :vid="`position-${index}`"
                >
                  <label class="text-uppercase text--body-1">
                    {{ $t('users.position') }}
                    <span
                      v-if="checkInternal(index)"
                      class="color-require"
                    >*</span>
                  </label>
                  <v-autocomplete
                    v-model="formdata.userRoles[index].positionId"
                    :items="positionItems"
                    attach
                    item-text="name"
                    item-value="id"
                    :filter="filterItems"
                    :disabled="!showRemove(a.roleId)"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      maxHeight: 133
                    }"
                    required
                    outlined
                    dense
                    class="text--body-1"
                    :placeholder="$t('create-user.position')"
                    :error-messages="errors"
                  >
                    <vue-feather
                      slot="prepend-inner"
                      class="grey--text"
                      type="search"
                    />
                    <template v-slot:append>
                      <v-icon>mdi-chevron-down</v-icon>
                    </template>
                  </v-autocomplete>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row
              v-if="checkInternal(index)"
              class="mt-1 justify-space-between"
            >
              <v-col md="5" cols="12" class="pb-1">
                <!-- Loai vai tro -->
                <validation-provider>
                  <label class="text-uppercase text--body-1">
                    {{ $t('users.isDefault') }}
                    <span class="color-require">*</span>
                  </label>
                  <v-select
                    v-model="formdata.userRoles[index].roleType"
                    outlined
                    attach
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      maxHeight: 133
                    }"
                    dense
                    flat
                    solo
                    item-text="text"
                    item-value="value"
                    class="text--body-1"
                    :items="isDefaultItems"
                    :disabled="!showRemove(a.roleId)"
                  >
                    <template v-slot:append>
                      <v-icon>mdi-chevron-down</v-icon>
                    </template>
                  </v-select>
                </validation-provider></v-col>
              <v-col cols="12" md="5">
                <!-- Vai tro -->
                <validation-provider
                  v-slot="{ errors }"
                  name="roleId"
                  rules="required"
                  :vid="`role-${index}`"
                >
                  <label class="text-uppercase text--body-1">
                    {{ $t('users.roleId') }}
                    <span class="color-require">*</span></label>
                  <v-select
                    v-model="formdata.userRoles[index].roleId"
                    :name="formdata.userRoles[index].roleId"
                    required
                    attach
                    :error-messages="errors"
                    outlined
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      maxHeight: 133
                    }"
                    dense
                    flat
                    solo
                    item-text="roleName"
                    item-value="roleId"
                    class="text--body-1"
                    :items="isUpdate ? userItemRoles[index] : roleItems"
                    :placeholder="$t('create-user.roleId')"
                    :disabled="!showRemove(a.roleId)"
                  >
                    <template v-slot:append>
                      <v-icon>mdi-chevron-down</v-icon>
                    </template>
                  </v-select></validation-provider></v-col>
            </v-row>

            <v-tooltip
              v-if="
                formdata.userRoles.length > 1 && showRemove(a.roleId)
                  ? true
                  : false
              "
              bottom
              content-class="tooltip-bottom"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-avatar class="deleteBtn elevation-2" size="30">
                  <span class="text-h5">
                    <v-btn
                      v-bind="attrs"
                      @click.prevent="deleteForm(index)"
                      v-on="on"
                    >
                      <v-icon color="#FF4A55">mdi-minus-circle-outline</v-icon>
                    </v-btn>
                  </span>
                </v-avatar>
              </template>
              <span>{{ $t('tooltip.deleteRole') }}</span>
            </v-tooltip>
          </div>
        </v-col>
      </div>
    </div>
    <v-row class="my-3">
      <v-col class="d-flex justify-start align-center">
        <div class="btn-add-role" @click.prevent="addForm">
          <v-btn
            outlined
            fab
            icon
            elevation="3"
            rounded
            x-small
            color="#C1C9D2"
          ><v-icon size="25" color="primary">mdi-plus-circle-outline</v-icon>
          </v-btn>
          <label class="text-uppercase ml-2 mb-0 text-add-role">
            {{ $t('tooltip.addRole') }}</label>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import rules from '@/mixins/rules'
import constants from '@/constants'
import filterItems from '@/mixins/filterItems.js'

export default {
  name: 'CreateRoleUser',
  mixins: [rules, filterItems],
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    parents: {
      type: Array,
      default: undefined
    },
    roleItems: {
      type: Array,
      default: undefined
    },
    positionItems: {
      type: Array,
      default: undefined
    },
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lable: '',
      isDefaultItems: [
        { text: this.$t('userRole.main'), value: constants.USER_ROLE.MAIN },
        {
          text: this.$t('userRole.concurrently'),
          value: constants.USER_ROLE.CONCURRENTLY
        },
        { text: this.$t('userRole.other'), value: constants.USER_ROLE.OTHER }
      ],
      groupExternal: constants.GROUPS.EXTERNAL,
      userExternal: false,
      rootRoles: null,
      roleAdmin: null,
      userItemRoles: [],
      maxLoop: 10
    }
  },

  watch: {
    groupType() {}
  },

  created() {
    this.$emit('on-change-roles', this.formdata.userRoles)
    if (!this.isUpdate) {
      return
    }
    var loop = 0
    const intervalInitRole = setInterval(() => {
      if (
        (this.userItemRoles.length === 0 ||
          (this.userItemRoles.length > 0 &&
            this.userItemRoles[0].length <= 1)) &&
        loop < this.maxLoop
      ) {
        this.initUserRoles()
        loop++
      } else {
        clearInterval(intervalInitRole)
      }
    }, 300)
  },
  methods: {
    showRemove(roleId) {
      if (!this.isUpdate || this.roleAdmin === undefined) {
        return true
      }
      const show =
        this.isUpdate && this.roleAdmin && roleId !== this.roleAdmin.roleId
      console.log('====================================')
      console.log(show)
      console.log(this.roleAdmin)
      console.log(roleId)
      console.log('====================================')
      return show
    },

    initUserRoles() {
      if (this.formdata.userRoles && this.roleItems) {
        this.formdata.userRoles.forEach((_, index) => {
          this.userItemRoles[index] = this.filterRoles(index)
        })
        this.$forceUpdate()
      }
    },
    disableEditUserRole(roleId) {
      if (!roleId || !this.formdata.userId) return false
      const userRole = this.roleItems.find(role => +role.roleId === +roleId)
      return userRole && userRole.roleCode === constants.USER_ROLE.ROLE_ADMIN
    },
    initRootRoles() {
      if ((!this.rootRoles || this.rootRoles.length === 0) && this.roleItems) {
        this.rootRoles = [...this.roleItems]
      }
    },
    initRoleAdmin() {
      if (!this.roleAdmin) {
        this.roleAdmin = this.roleItems.find(
          role => role.roleCode === constants.USER_ROLE.ROLE_ADMIN
        )
      }
    },
    filterRoles(index = 0) {
      this.initRootRoles()
      this.initRoleAdmin()
      if (!this.isUpdate || this.roleAdmin === undefined) {
        return this.roleItems
      }

      let rolesFilter = [...this.rootRoles]
      const { userRoles } = this.formdata
      if (userRoles.length <= 1) {
        rolesFilter = [...this.rootRoles]
        return rolesFilter
      }

      const currentAdmin = +userRoles[index].roleId === +this.roleAdmin.roleId
      const hasRoleAdmin = +userRoles.some(
        role => +role.roleId === +this.roleAdmin.roleId
      )

      if (hasRoleAdmin && !currentAdmin) {
        rolesFilter = this.rootRoles.filter(
          role => +role.roleId !== +this.roleAdmin.roleId
        )
      } else {
        rolesFilter = [...this.rootRoles]
      }
      return rolesFilter
    },
    checkInternal(index) {
      return this.formdata.userRoles[index].groupType !== this.groupExternal
    },
    // add form roles user
    addForm() {
      this.formdata.userRoles.push({
        groupId: '',
        groupType: null,
        roleId: '',
        roleType: constants.USER_ROLE.OTHER,
        positionId: null
      })
      this.userItemRoles[this.formdata.userRoles.length - 1] = this.filterRoles(
        this.formdata.userRoles.length - 1
      )
      this.setDataExternal()
    },
    // delete form roles user
    deleteForm(index) {
      this.formdata.userRoles.splice(index, 1)
      this.setDataExternal()
    },

    // Thay doi don vi phong ban
    onChangegroupType(groupId, index) {
      // Lay don vi theo groupId
      const group = this.parents.find(g => g.groupId === groupId)
      this.formdata.userRoles[index].groupId = group.groupId
      this.formdata.userRoles[index].groupType = group.groupType
      if (group.groupType === constants.GROUPS.EXTERNAL) {
        this.formdata.userRoles[index].roleId = ''
      }
      this.setDataExternal()
    },
    setDataExternal() {
      const groupExternals = this.formdata.userRoles.filter(
        g => g.groupType === constants.GROUPS.EXTERNAL
      )
      this.userExternal = groupExternals && groupExternals.length > 0
      this.$emit('user-external', this.userExternal)
    },
    trimSpace(val) {
      const value = val ? val.trim() : ''
      return value
    },
    getParentGroupName(item) {
      return item.groupType === constants.GROUPS.EXTERNAL
        ? this.$t('group.partnerLabel')
        : item.parentPathName
    }
  }
}
</script>

<style lang="scss" scoped>
.form-new {
  position: relative;
  border: 1px #7b8794 dashed;
  border-radius: 10px;
}
.group-name {
  padding-right: 6%;
}
.deleteBtn {
  position: absolute;
  top: 50%;
  left: -15px;
  transform: translateY(-50%);
}
.col {
  padding-bottom: 0 !important;
  padding-top: 0 !important;
}
label {
  margin-bottom: 5px;
  display: inline-block;
  color: #4b506d;
  font-size: 12px;
  font-weight: 700;
}
.color-require {
  color: red;
}
.btn-add-role:hover {
  label {
    cursor: pointer;
    color: #54c5eb;
  }
}

.text-add-role {
  font-size: 14px;
  font-weight: 500;
}
</style>
