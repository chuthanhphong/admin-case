<template>
  <div class="wrap-home ml-2 mt-2">
    <v-container fluid class=" py-5 pt-2 rounded-xl bg-primary pb-5">
      <h4 class="white--text ml-2">{{ $t('users.user') }}</h4>
      <v-card color="white" class="rounded-xl ma-2 mt-2 text-wrap">
        <v-layout wrap class="col-12">
          <tree-org :show-action="false" @selected-group="selectedGroup" />
          <div class="col-sm-8 col-md-10">
            <div
              class="top-org d-flex flex-column flex-md-row justify-space-between pt-3 align-center"
            >
              <div class="titleGroupName">{{ groupName }}</div>
              <div class="col-md-5 pa-0 d-flex align-right justify-end">
                <v-text-field
                  id="txt-search"
                  v-model="formdata.keyword"
                  name="txtSearch"
                  class="text--label-5"
                  :placeholder="$t('users.search')"
                  outlined
                  dense
                  clearable
                  hide-details
                  @change="formdata.keyword = trimSpace(formdata.keyword)"
                  @keyup.enter="searchUser"
                  @click:clear="resetSearch"
                >
                  <vue-feather
                    slot="prepend-inner"
                    class="grey--text"
                    type="search"
                    size="20"
                  />
                </v-text-field>
                <div>
                  <v-tooltip top content-class="tooltip-top">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        outlined
                        color="primary"
                        class="btn-show-advance"
                        v-on="on"
                        @click="changeShowAdvance"
                      >
                        <img src="@/assets/icons/icon-advance.svg" alt="">
                      </v-btn>
                    </template>
                    <div>
                      {{ $t('contract.label.advanceSearch') }}
                    </div>
                  </v-tooltip>
                </div>
                <div class="d-flex align-center justify-end">
                  <div class="d-flex align-center">
                    <v-btn
                      color="primary"
                      class="ml-0 my-2 my-sm-0 text--button"
                      :to="userCreatePath"
                    >
                      <span class="mr-2 text-capitalize">{{
                        $t('users.create')
                      }}</span>
                      <v-icon>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
            <advance-search
              v-show="showAdvance"
              :search-user="searchUser"
              :formdata="formdata"
              :show-advance="showAdvance"
              @update-list-groups="updateListGroup"
            />
            <div class="content-org text-center my-2">
              <v-simple-table v-if="users.length > 0" dense fixed-header>
                <template v-slot:default>
                  <thead class="text--body-5">
                    <tr>
                      <th class="text-left" style="width:5%">
                        Stt
                      </th>
                      <th class="text-left" style="width:15%">
                        {{ $t('users.fullName') }}
                      </th>
                      <th class="text-left" style="width:15%">
                        {{ $t('username') }}
                      </th>
                      <th class="text-left" style="width:15%">
                        Email
                      </th>
                      <th class="text-left" style="width:25%">
                        {{ $t('users.roleGroupName') }}
                      </th>
                      <!-- <th class="text-left" style="width:20%">
                        {{ $t('users.roleId') }}
                      </th> -->
                      <th class="text-center" style="width:10%">
                        {{ $t('users.operation') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text--body-5">
                    <tr v-if="users == ''">
                      <td colspan="7" class="text-center red--text">
                        {{ $t('noData') }}
                      </td>
                    </tr>
                    <tr v-for="(item, index) in users" :key="index">
                      <td class="text-left">
                        <div class="my-2">{{ index + fromRecord }}</div>
                      </td>
                      <td class="text-left" v-html="showFullName(item)" />
                      <td class="text-left">{{ item.userName }}</td>
                      <td class="text-left">{{ item.email }}</td>
                      <!-- <td class="text-left">{{ item.groupName }}</td> -->
                      <td class="text-left">
                        <div v-html="renderRoleNames(item).toString()" />
                      </td>
                      <td>
                        <v-menu
                          left
                          offset-y
                          transition="scroll-y-transition"
                          content-class="menu-action arrow-up"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              text
                              fab
                              dense
                              small
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon> mdi-dots-vertical </v-icon>
                            </v-btn>
                          </template>

                          <v-list>
                            <div class="px-2 item-action">
                              <v-btn
                                text
                                dark
                                block
                                :to="{
                                  name: 'USER_UPDATE',
                                  params: { userId: item.userId }
                                }"
                              >
                                <v-icon>mdi-pencil</v-icon>
                                <span class="text-capitalize">
                                  {{ $t('contract.tooltip.edit') }}</span>
                              </v-btn>
                            </div>
                            <div
                              v-if="item.roleName !== 'QTHT'"
                              class="px-2 item-action"
                            >
                              <v-btn
                                block
                                text
                                dark
                                @click="showDialogConfirm(item)"
                              >
                                <div v-if="showIcon(item.activeType)">
                                  <v-icon>mdi-lock</v-icon>
                                  <span class="text-capitalize">
                                    {{ $t('users.lock') }}
                                  </span>
                                </div>
                                <div v-else>
                                  <v-icon>mdi-lock-open</v-icon>
                                  <span class="text-capitalize">
                                    {{ $t('users.unlock') }}
                                  </span>
                                </div>
                              </v-btn>
                            </div>
                          </v-list>
                        </v-menu>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <div v-else class="col-12 col-sm-5 mx-auto">
                <empty-box :loading="loading" subtitle="empty.user" />
              </div>
            </div>
            <div class="mt-10 mx-2">
              <base-paging
                :page="page"
                :total-pages="totalPages"
                :from-record="fromRecord"
                :to-record="toRecord"
                :total-records="totalRecords"
                @on-change-page="onChangePage"
              />
            </div>
          </div>
        </v-layout>
      </v-card>
      <!-- <base-loading :is-loading="loading" /> -->
      <dialog-confirm
        :show-dialog="showDialog"
        :title-confirm="titleComfirm"
        @close-dialog="showDialog = false"
        @accept="accept"
      />
    </v-container>
  </div>
</template>

<script>
import TreeOrg from '@/views/group/component/TreeOrg'
import pagingData from '@/mixins/paging'
import alertMixin from '@/mixins/alert'
import { UsersService } from '@/services/usersService'
import config from '@/config'
import { mapActions } from 'vuex'
import constants from '@/constants'
import AdvanceSearch from './component/AdvanceSearch'
import DialogConfirm from '@/views/components/DialogConfirm.vue'
import checkRoles from '@/mixins/checkRoles'
import EmptyBox from '@/views/components/EmptyBox.vue'
import commonRoute from '@/router/routePaths'
export default {
  name: 'User',
  components: {
    TreeOrg,
    DialogConfirm,
    AdvanceSearch,
    EmptyBox
  },
  mixins: [pagingData, alertMixin, checkRoles],
  data() {
    return {
      userCreatePath: `${commonRoute.USER_CREATE_PATH}`,
      userId: null,
      titleComfirm: '',
      showDialog: false,
      showAdvance: false,
      loading: false,
      isShowAlert: false,
      groupName: '',
      formdata: {
        keyword: '',
        groupId: '',
        groupType: '',
        page: '',
        pageSize: config.app.paging.pageSize,
        restrictHierarchy: 'false',
        activeTypes: '',
        code: ''
      },
      users: [],
      listGroups: []
    }
  },
  created() {
    this.hasPermission([constants.USER_ROLE.ROLE_ADMIN])
  },
  methods: {
    ...mapActions('user', ['updateStatusCreate']),
    ...mapActions('layout', ['setNotify']),
    renderRoleNames(item) {
      var roles = []
      let renderRole = ''
      if (item.roleNames.length === 0) {
        return item.groupPathName
      }
      // item.roleNames.map(r => (renderRole += `<div>${r}</div>`))
      roles = item.roleNames.map(r => (r = r.split('   ')))
      roles.map(role => {
        renderRole += `<div class="role-item d-flex justify-start">`
        role.map((r, index) => {
          const classRoleName = index === 0 ? 'role-name' : ''
          renderRole += `<span class="role-detail ${classRoleName}">${r.trim()}</span>`
        })
        renderRole += `</div>`
      })
      return renderRole
    },
    showFullName(item) {
      if (item.activeType === constants.ACTIVE_TYPE.LOCK) {
        return `<div class="d-flex justify-space-between">${item.fullName} <i class="mdi mdi-lock"></i></div>`
      }
      return item.fullName
    },
    // check user dang hoat dong
    showIcon(activeType) {
      let check = false
      if (activeType === constants.ACTIVE_TYPE.UN_LOCK) {
        check = true
      }
      return check
    },
    showDialogConfirm(user) {
      this.titleComfirm = 'users.dialog.titleConfirmUnlock'
      if (user.activeType === constants.ACTIVE_TYPE.UN_LOCK) {
        this.titleComfirm = 'users.dialog.titleConfirmLock'
      }
      this.activeType = user.activeType
      this.userId = user.userId
      this.showDialog = true
    },
    async accept() {
      try {
        const response = await UsersService.lockOrUnlock(this.userId)
        if (response.status === 200) {
          const typeAlert = 'success'
          let message = this.$t('users.messageSuccess.unlockSuccess')
          if (this.activeType === constants.ACTIVE_TYPE.UN_LOCK) {
            message = this.$t('users.messageSuccess.lockSuccess')
          }
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message)
          })
          this.search()
        }
      } catch (error) {
        const typeAlert = 'error'
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(error.message)
        })
      }
    },
    changeShowAdvance() {
      this.showAdvance = !this.showAdvance
    },
    selectedGroup(groupId) {
      this.formdata.page = ''
      this.formdata.groupId = groupId
      this.formdata.groupType = ''
      if (groupId === '') {
        this.formdata.groupType = constants.GROUPS.EXTERNAL
      }
      this.search()
    },
    onChangePage(page) {
      this.formdata.page = page
      this.search()
    },
    async resetSearch() {
      this.formdata.keyword = ''
      this.searchUser()
    },
    async searchUser() {
      this.formdata.page = ''
      this.search()
    },
    trimSpace(val) {
      const value = val ? val.trim() : ''

      return value
    },
    updateListGroup(listGroups) {
      this.listGroups = listGroups
      this.getGroupNameSearch()
    },
    getGroupNameSearch() {
      const groupSelected = this.listGroups.find(
        g => g.groupId === this.formdata.groupId
      )
      var groupName = ''
      if (groupSelected) {
        groupName = groupSelected.groupName
      } else {
        groupName = this.$t('group.partnerLabel')
      }
      this.groupName = groupName
    },
    // func call api search user
    async search() {
      try {
        if (!this.showAdvance) {
          this.formdata.code = null
          this.formdata.activeTypes = [
            constants.ACTIVE_TYPE.LOCK,
            constants.ACTIVE_TYPE.UN_LOCK
          ]
        }
        this.getGroupNameSearch()
        this.loading = true
        // this.formdata.excludeRoleCodes = 'ROLE_ADMIN'
        const response = await UsersService.searchUser(this.formdata)
        const dataResponse = response.data
        this.users = dataResponse.data
        this.renderPaging(dataResponse)
      } catch (error) {
        this.isShowAlert = true
        this.messages = error
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
