<template>
  <div class="wrap-advance-search px-2 py-4 pb-0 mt-3">
    <v-row justify="space-between">
      <div class="d-flex form-group flex-column">
        <label class="text-left text--body-5">{{ $t('users.roleId') }}</label>
        <v-select
          v-model="selectRole"
          :items="listRoles"
          item-text="roleName"
          item-value="roleCode"
          class="text--body-5"
          outlined
          :menu-props="{
            bottom: true,
            offsetY: true,
            contentClass: 'menu-select-user'
          }"
          dense
          @change="onchangeSelectRole"
        >
          <template v-slot:append>
            <v-icon>mdi-chevron-down</v-icon>
          </template>
        </v-select>
      </div>
      <div class="d-flex form-group flex-column">
        <label class="text-left text--body-5">{{ $t('users.unit') }}</label>
        <v-autocomplete
          v-model="formdata.groupId"
          :items="listGroups"
          item-text="groupName"
          item-value="groupId"
          class="text--body-5"
          :menu-props="{
            bottom: true,
            offsetY: true
          }"
          outlined
          dense
          @change="onchangeSelectGroup"
        >
          <vue-feather slot="prepend-inner" class="grey--text" type="search" />
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
      </div>
      <div class="d-flex form-group flex-column">
        <label class="text-left text--body-5">{{ $t('users.status') }}</label>
        <v-select
          v-model="selectStatus"
          :items="listStatusUser"
          :item-text="item => $t(item.label)"
          item-value="value"
          class="text--body-5"
          outlined
          :menu-props="{ bottom: true, offsetY: true }"
          dense
          @change="onChangeSelectStatus"
        >
          <template v-slot:append>
            <v-icon>mdi-chevron-down</v-icon>
          </template>
        </v-select>
      </div>
    </v-row>
  </div>
</template>

<script>
import constants from '@/constants'
import { RoleService } from '@/services/roleService'
import { GroupService } from '@/services/groupService'

export default {
  components: {},
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    searchUser: {
      type: Function,
      default: undefined
    },
    showAdvance: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      selectRole: { roleCode: constants.ALL },
      selectStatus: { value: constants.ALL },
      listStatusUser: [
        { label: 'users.all', value: constants.ALL },
        { label: 'status.active', value: constants.ACTIVE_TYPE.UN_LOCK },
        { label: 'status.inactive', value: constants.ACTIVE_TYPE.LOCK }
      ],
      listGroups: [],
      listRoles: []
    }
  },
  computed: {},
  watch: {
    showAdvance() {
      if (!this.showAdvance) {
        this.selectStatus = { value: constants.ALL }
        this.selectRole = { roleCode: constants.ALL }
      }
    }
  },
  async created() {
    this.getlistRole()
    this.searchGroup()
  },
  mounted() {},
  methods: {
    getParentGroupName(item) {
      return item.groupType === constants.GROUPS.EXTERNAL
        ? this.$t('group.partnerLabel')
        : item.parentPathName
    },
    // chon vai tro
    onchangeSelectRole() {
      if (this.selectRole !== constants.ALL) {
        this.formdata.code = this.selectRole
      } else {
        this.formdata.code = ''
      }
      this.searchUser()
    },
    // chon don vi
    onchangeSelectGroup() {
      this.formdata.groupType = ''
      if (!this.formdata.groupId) {
        this.formdata.groupId = ''
        this.formdata.groupType = constants.GROUPS.EXTERNAL
      }
      this.searchUser()
    },
    // chon trang thai
    onChangeSelectStatus() {
      if (this.selectStatus === constants.ACTIVE_TYPE.LOCK) {
        this.formdata.activeTypes = this.selectStatus
      }
      if (this.selectStatus === constants.ACTIVE_TYPE.UN_LOCK) {
        this.formdata.activeTypes = ''
      }
      if (this.selectStatus === constants.ALL) {
        this.formdata.activeTypes = [
          constants.ACTIVE_TYPE.LOCK,
          constants.ACTIVE_TYPE.UN_LOCK
        ]
      }
      this.searchUser()
    },
    // load danh sach don vi
    async searchGroup() {
      try {
        const param = {
          pageSize: 1000000,
          restrictHierarchy: 'false'
        }
        const response = await GroupService.search(param)
        if (response.status === 200) {
          this.listGroups = response.data.data
          this.listGroups.unshift({
            groupId: '',
            groupName: this.$t('group.partnerLabel')
          })
          this.$emit('update-list-groups', this.listGroups)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // load danh sach vai tro
    async getlistRole() {
      try {
        const response = await RoleService.getList()
        this.listRoles = response.data
        if (response.status === 200) {
          this.listRoles.unshift({
            roleCode: constants.ALL,
            roleName: this.$t('users.all')
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.v-menu__content {
  max-width: 270px;
}
.wrap-advance-search {
  .v-input__control {
    .v-input__slot {
      width: 270px;
    }
  }
  @media (max-width: 1336px) {
    .form-group {
      flex-direction: column;
      align-items: flex-start !important;
      margin-left: 15px;
      label {
        color: #000;
        padding-bottom: 5px !important;
        text-align: left !important;
      }
    }
  }
  @media (max-width: 1000px) {
    .v-input__control {
      .v-input__slot {
        width: 100% !important;
      }
    }
    .form-group {
      flex-direction: column;
      align-items: flex-start !important;
      margin-left: 15px;
      label {
        color: #000;
        padding-bottom: 5px !important;
        text-align: left !important;
      }
    }
  }
  label {
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    color: #4b506d;
    text-align: right;
    min-width: 110px;
  }
}
</style>
