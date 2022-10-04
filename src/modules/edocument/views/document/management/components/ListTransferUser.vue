<template>
  <div v-if="showTable" class="col-md-12 form-group py-0 px-5">
    <v-scroll-y-transition>
      <v-simple-table dense fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center edoc-text--button" style="width: 5%">
                STT
              </th>
              <th class="text-left edoc-text--button" style="width: 30%">
                {{ $t('managementDoc.transfer.userName') }}
              </th>
              <th class="text-left edoc-text--button" style="width: 15%">
                {{ $t('managementDoc.transfer.position') }}
              </th>
              <th class="text-left edoc-text--button" style="width: 25%">
                {{ $t('managementDoc.transfer.group') }}
              </th>
              <!-- <th class="text-center edoc-text--button" style="width: 14%">
                {{ $t('managementDoc.transfer.download') }}
              </th> -->
              <th class="text-center edoc-text--button" style="width: 10%">
                {{ $t('dashboards.action') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filterUser" :key="index">
              <!-- STT -->
              <td class="text-center edoc-text--button">
                <div class="my-2">{{ index + 1 + (page - 1) * 10 }}</div>
              </td>

              <!-- full name -->
              <td class="text-left edoc-text--button">
                <div class="d-flex">
                  <v-tooltip top content-class="tooltip-top" max-width="30%">
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" class="maxline2" v-on="on">
                        {{ item.fullName }} - {{ item.userName }}
                      </div>
                    </template>
                    <span>{{ item.fullName }} - {{ item.userName }}</span>
                  </v-tooltip>
                </div>
                <div v-if="item.receivedDocument" class="text-danger">
                  ({{ $t('managementDoc.transfer.received') }})
                </div>
              </td>

              <!-- chuc danh -->
              <td class="text-left edoc-text--button">
                <div class="my-2 maxline2">{{ item.positionName }}</div>
              </td>

              <!-- ten don vi -->
              <td class="text-left edoc-text--button">
                <div class="d-flex">
                  <v-tooltip top content-class="tooltip-top" max-width="30%">
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" class="maxline2" v-on="on">
                        {{ item.groupPathName }}
                      </div>
                    </template>
                    <span>{{ item.groupPathName }}</span>
                  </v-tooltip>
                </div>
              </td>

              <!-- chop phep tai-->
              <!-- <td class="text-center">
                <div class="d-flex justify-center">
                  <v-checkbox
                    v-model="item.checkbox"
                    hide-details
                    class="edoc-text--button mt-0"
                  />
                </div>
              </td> -->
              <!-- thao tac -->
              <td class="text-center">
                <div class="d-flex justify-center">
                  <v-btn
                    class="v-btn--icon v-size--small"
                    icon
                    @click="removeUser(item)"
                  >
                    <img src="@/assets/imgs/trash.png" alt="" />
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-scroll-y-transition>
    <div class="mt-5 mx-2 px-8 pb-5">
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
</template>

<script>
import pagingData from '@/mixins/paging'
export default {
  mixins: [pagingData],
  props: {
    showTable: {
      type: Boolean,
      default: false
    },
    userLst: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      page: 1,
      pageSize: 10
    }
  },
  computed: {
    filterUser() {
      return this.userLst.slice((this.page - 1) * 10, this.pageSize * this.page)
    }
  },
  watch: {
    userLst() {
      this.renderPagingLst()
    }
  },
  methods: {
    onChangePage(page) {
      this.page = page
      this.renderPagingLst()
    },
    renderPagingLst() {
      var userTransfer = {
        page: this.page || 1,
        pageSize: 10,
        totalElements: this.userLst.length,
        totalPages: Math.ceil(this.userLst.length / 10),
        data: this.filterUser.length > 0 ? this.filterUser : this.userLst
      }
      if (this.userLst.length === 0) {
        userTransfer = null
      }
      this.renderPaging(userTransfer)
    },
    removeUser(item) {
      if (item) {
        const index = this.userLst.indexOf(item)
        if (index >= 0) {
          this.userLst.splice(index, 1)
          this.$emit('on-remove-user')
          console.log('this.userLst', this.userLst)
          if (this.userLst.length > 0) {
            this.page =
              Math.ceil(this.userLst.length / 10) >= this.page
                ? this.page
                : this.page - 1
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card__title {
  word-break: normal;
}
</style>
