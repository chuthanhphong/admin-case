<template>
  <div class="wrap-home ml-2 mt-2">
    <v-container fluid class=" py-5 pt-2 rounded-xl bg-primary pb-5">
      <h4 class="white--text ml-2">{{ $t('group.name') }}</h4>
      <v-card color="white" class="rounded-xl ma-2 mt-2">
        <v-layout wrap class="col-12">
          <tree-org
            :key="childKey"
            :show-action="true"
            @accept="showDialogConfirmRemove"
            @selected-group="selectedGroup"
          />
          <div class="col-sm-8 col-md-10 pt-0">
            <div
              class="top-org d-flex justify-center justify-sm-end flex-column flex-sm-row"
            >
              <div class="col-md-3 col-sm-6 col-12 pa-0">
                <v-text-field
                  id="txt-search"
                  v-model="searchForm.keyword"
                  name="txtSearch"
                  :placeholder="$t('group.search')"
                  outlined
                  dense
                  clearable
                  class="text--label-5"
                  hide-details
                  @change="searchForm.keyword = trimSpace(searchForm.keyword)"
                  @keyup.enter="searchGroup"
                >
                  <vue-feather
                    slot="prepend-inner"
                    class="grey--text"
                    type="search"
                    size="20"
                  />
                </v-text-field>
              </div>
              <v-btn
                color="primary"
                class="ml-0 my-2 my-sm-0 ml-sm-15 text--button"
                :to="groupCreatePath"
              >
                <span class="mr-2 text-capitalize">{{
                  $t('group.create')
                }}</span>
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </div>
            <div class="content-org text-center my-2">
              <v-data-table
                v-model="selected"
                :headers="headers"
                :items="organizations"
                item-key="stt"
                show-select
                hide-default-footer
                :options="options"
                checkbox-color="primary"
                :no-data-text="$t('noData')"
                class="text--body-5"
              >
                <!-- eslint-disable-next-line -->
                <template v-slot:item.data-table-select="{ item, isSelected, select }"
                >
                  <v-simple-checkbox
                    v-if="item.groupId !== rootGroupId"
                    :value="isSelected"
                    :ripple="false"
                    color="primary"
                    @input="select($event)"
                  />
                </template>
                <!-- eslint-disable-next-line -->
                <template v-slot:item.action="{ item }">
                  <v-menu
                    v-if="item.groupId !== rootGroupId"
                    bottom
                    :ripple="false"
                    left
                    offset-y
                    transition="scroll-y-transition"
                    content-class="menu-action arrow-up"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn text fab dense small v-bind="attrs" v-on="on">
                        <v-icon> mdi-dots-vertical </v-icon>
                      </v-btn>
                    </template>

                    <v-list :ripple="false">
                      <div class="item-action">
                        <v-btn
                          ripple="false"
                          text
                          dark
                          block
                          :to="{
                            name: 'GROUP_UPDATE',
                            params: { groupId: item.groupId }
                          }"
                        >
                          <v-icon size="20">mdi-pencil</v-icon>
                          <span class="text-capitalize">
                            {{ $t('contract.tooltip.edit') }}</span>
                        </v-btn>
                      </div>
                      <div class="item-action">
                        <v-btn
                          text
                          block
                          dark
                          @click="showDialogConfirmRemove(`${item.groupId}`)"
                        >
                          <v-icon size="20">mdi-trash-can</v-icon>
                          <span class="text-capitalize">
                            {{ $t('contract.tooltip.delete') }}
                          </span>
                        </v-btn>
                      </div>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </div>
            <v-btn
              v-if="selected.length > 0"
              color="primary"
              class="w-150 my-2 text--button"
              outlined
              rounded
              @click="showDialogConfirmRemoveMultiple"
            >{{ $t('contract.tooltip.delete') }}</v-btn>
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
      <dialog-confirm
        :show-dialog="showDialogRemove"
        :title-confirm="'group.dialog.titleConfirmRemove'"
        :content-confirm="'group.dialog.contentConfirm'"
        @close-dialog="showDialogRemove = false"
        @accept="acceptRemove"
      />
    </v-container>
  </div>
</template>

<script>
import TreeOrg from '@/views/group/component/TreeOrg'
import pagingData from '@/mixins/paging'
import { GroupService } from '@/services/groupService'
import config from '@/config'
import constants from '@/constants'
import DialogConfirm from '@/views/components/DialogConfirm'
import { mapActions } from 'vuex'
import checkRoles from '@/mixins/checkRoles'
import commonRoute from '@/router/routePaths'
export default {
  name: 'Group',
  components: {
    TreeOrg,
    DialogConfirm
  },
  mixins: [pagingData, checkRoles],
  data() {
    return {
      childKey: 0,
      organizations: [],
      rootGroupId: 1,
      groupCreatePath: `${commonRoute.GROUP_CREATE_PATH}`,
      searchForm: {
        parentId: '',
        page: '',
        pageSize: config.app.paging.pageSize,
        keyword: '',
        groupType: '',
        restrictHierarchy: 'false'
      },
      // Dialog xac nhan xoa don vi
      showDialogRemove: false,
      selectGroupId: '',
      isDeleteMultiple: false,
      // Datatable
      options: {
        itemsPerPage: 14
      },
      singleSelect: true,
      selected: [],
      headers: [
        {
          text: 'Stt',
          align: 'center',
          sortable: false,
          value: 'stt',
          width: '5%',
          class: 'text--label-3'
        },
        {
          text: this.$t('groupTableLabel.groupName'),
          value: 'groupName',
          sortable: false,
          width: '30%',
          class: 'text--label-3'
        },
        {
          text: this.$t('groupTableLabel.groupCode'),
          value: 'groupCode',
          sortable: false,
          width: '15%',
          class: 'text--label-3'
        },
        {
          text: this.$t('groupTableLabel.parentName'),
          value: 'parentPathName',
          sortable: false,
          width: '30%',
          class: 'text--label-3'
        },
        {
          text: this.$t('groupTableLabel.orderNo'),
          value: 'orderNo',
          sortable: false,
          align: 'center',
          width: '10%',
          class: 'text--label-3'
        },
        {
          text: this.$t('groupTableLabel.action'),
          sortable: false,
          value: 'action',
          align: 'center',
          width: '10%'
        }
      ]
    }
  },
  watch: {},
  created() {
    this.hasPermission([constants.USER_ROLE.ROLE_ADMIN])
    const user = JSON.parse(localStorage.getItem(constants.USER_INFO))
    this.rootGroupId = user.rootGroupId
  },
  mounted() {
    this.getListGroup()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    forceRerender() {
      this.childKey += 1
    },
    // Hien thi dialog xoa don vi
    showDialogConfirmRemove(groupId) {
      this.selectGroupId = groupId
      this.isDeleteMultiple = false
      this.showDialogRemove = true
    },
    // Hien thi dialog xoa nhieu don vi cung luc
    showDialogConfirmRemoveMultiple() {
      this.isDeleteMultiple = true
      this.showDialogRemove = true
    },
    // Tim kiem don vi theo cay don vi
    selectedGroup(groupId) {
      this.searchForm.page = ''
      this.searchForm.parentId = groupId
      if (groupId === '') {
        this.searchForm.groupType = constants.GROUPS.EXTERNAL
      } else {
        this.searchForm.groupType = ''
      }
      this.getListGroup()
    },
    // Lay danh sach don vi theo page
    onChangePage(page) {
      this.searchForm.page = page
      this.getListGroup()
    },
    trimSpace(val) {
      const value = val ? val.trim() : ''
      return value
    },
    async searchGroup() {
      this.searchForm.page = ''
      this.getListGroup()
    },
    // Call service tim kiem don vi
    async getListGroup() {
      const response = await GroupService.search(this.searchForm)
      if (response.success) {
        const dataGroup = response.data
        if (!dataGroup) {
          this.organizations = []
          this.renderPaging(dataGroup)
          return
        }
        this.organizations = dataGroup.data
        this.renderPaging(dataGroup)
        const startIndex = this.fromRecord
        this.organizations.map((org, index) => {
          if (org.groupId === this.rootGroupId) {
            org.parentPathName = ''
          }
          org.stt = startIndex + index
          org.action = false
        })
      }
    },
    // Call service xoa don vi
    async acceptRemove() {
      var groupIds = []
      if (this.isDeleteMultiple) {
        this.selected.map(group => {
          if (group.groupId !== this.rootGroupId) {
            groupIds.push(group.groupId)
          }
        })
      } else {
        groupIds.push(this.selectGroupId)
      }
      try {
        const params = {}
        params['listGroupId'] = groupIds
        const response = await GroupService.deleteGroup(params)
        if (response.status === 200) {
          const typeAlert = 'success'
          const message = this.$t('group.messageSuccess.removeSuccess')
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message)
          })
          this.getListGroup()
          this.forceRerender()
        }
      } catch (error) {
        const typeAlert = 'error'
        const message = error.message
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message)
        })
      }
    }
  }
}
</script>

<style lang="scss" src="./Group.scss" scoped></style>
