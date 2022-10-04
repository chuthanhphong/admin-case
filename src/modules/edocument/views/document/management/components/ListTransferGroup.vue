<template>
  <div v-if="showTable" class="col-md-12 form-group py-0 px-5">
    <v-scroll-y-transition>
      <v-simple-table dense fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center  edoc-text--button" style="width: 5%">STT</th>
              <th class="text-left  edoc-text--button" style="width: 70%">{{ $t('managementDoc.transfer.groupName') }}</th>
              <!-- <th class="text-center  edoc-text--button" style="width: 14%">
                {{ $t('managementDoc.transfer.download') }}
              </th> -->
              <th class="text-center  edoc-text--button" style="width: 10%">
                {{ $t('dashboards.action') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filtered" :key="index">
              <!-- STT -->
              <td class="text-center  edoc-text--button">
                <div class="my-2">{{ index + 1 + (page - 1) * 10 }}</div>
              </td>

              <!-- ten don vi -->
              <td class="text-left  edoc-text--button">
                <div class="d-flex">
                  <v-tooltip
                    top
                    content-class="tooltip-top"
                    max-width="30%"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" class="maxline2" v-on="on">
                        {{ genGroupName(item) }}
                      </div>
                    </template>
                    <span>{{ genGroupName(item) }}</span>
                  </v-tooltip>
                </div>
                <div v-if="item.receivedDocument" class="text-danger">({{
                  $t('managementDoc.transfer.received')
                }})</div>
              </td>

              <!-- chop phep tai-->
              <!-- <td class="text-center">
                <div class="d-flex justify-center">
                  <v-checkbox
                    v-model="item.checkbox"
                    hide-details
                    class=" edoc-text--button mt-0"
                  />
                </div>
              </td> -->
              <!-- thao tac -->
              <td class="text-center   edoc-text--button">
                <div class="d-flex justify-center">
                  <v-btn
                    class="v-btn--icon v-size--small"
                    icon
                    @click="removeGroup(item)"
                  >
                    <img src="@/assets/imgs/trash.png" alt="">
                  </v-btn>
                  <v-btn
                    class="v-btn--icon v-size--small"
                    icon
                    @click="openList(item)"
                  >
                    <img src="@/assets/imgs/view.png" alt="">
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
    groupLst: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      checkbox1: false,
      page: 1,
      pageSize: 10,
      toRecord: 0
    }
  },
  computed: {
    filtered() {
      return this.groupLst.slice((this.page - 1) * 10, this.pageSize * this.page)
    }
  },
  watch: {
    groupLst() {
      this.renderPagingLst()
    }
  },
  methods: {
    genGroupName(item) {
      return item.groupPathName ? item.groupPathName : item.groupName
    },
    openList(group) {
      this.$emit('on-open-list', group)
    },

    onChangePage(page) {
      this.page = page
      this.renderPagingLst()
    },
    renderPagingLst() {
      var groupTransfer = {
        page: this.page || 1,
        pageSize: 10,
        totalElements: this.groupLst.length,
        totalPages: Math.ceil(this.groupLst.length / 10),
        data: this.filtered.length > 0 ? this.filtered : this.groupLst
      }
      if (this.groupLst.length === 0) {
        groupTransfer = null
      }
      this.renderPaging(groupTransfer)
    },
    removeGroup(item) {
      if (item) {
        const index = this.groupLst.indexOf(item)
        if (index >= 0) {
          this.groupLst.splice(index, 1)
          this.$emit('on-remove-group')
          if (this.groupLst.length > 0) {
            this.page = Math.ceil(this.groupLst.length / 10) >= this.page ? this.page : this.page - 1
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
