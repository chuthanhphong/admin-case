<template>
  <div v-if="showTable" class="col-md-12 form-group pa-0 list-transfer">
    <div class="col-md-12">
      <label class="edoc-text--body-8 color-label text-capitalize">
        {{ $t('managementDoc.transfer.listUserTransfer') }}
        <span v-if="countLstUser">({{ countLstUser }})</span>
      </label>
    </div>
    <v-layout wrap>
      <div class="col-sm-12 px-5 py-0">
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
                  <th class="text-left edoc-text--button" style="width: 30%">
                    {{ $t('managementDoc.transfer.positionName') }}
                  </th>
                  <th class="text-left edoc-text--button" style="width: 24%">
                    Email
                  </th>
                  <th class="text-left edoc-text--button" style="width: 10%">
                    {{ $t('managementDoc.updateDoc.phoneNumber') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in filterUser" :key="index">
                  <!-- STT -->
                  <td class="text-center edoc-text--button">
                    <div class="my-2">{{ index + fromRecord }}</div>
                  </td>

                  <!-- full name -->
                  <td class="text-left edoc-text--button">
                    <div class="d-flex">
                      <v-tooltip
                        top
                        content-class="tooltip-top"
                        max-width="30%"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" class="maxline2" v-on="on">
                            {{ item.fullName }}
                          </div>
                        </template>
                        <span>{{ item.fullName }}</span>
                      </v-tooltip>
                    </div>
                  </td>

                  <!-- chuc danh -->
                  <td class="text-left edoc-text--button">
                    <div class="my-2 maxline2">{{ item.positionName }}</div>
                  </td>

                  <!-- ten don vi -->
                  <td class="text-left edoc-text--button">
                    <div class="my-2 maxline2">{{ item.email }}</div>
                  </td>

                  <!-- so dien thoai -->
                  <td class="text-left edoc-text--button">
                    <div class="my-2 maxline2">{{ item.phone }}</div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-scroll-y-transition>
      </div>
    </v-layout>
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
import { DocumentService } from '@/modules/edocument/services/documentService'
import config from '@/config'

export default {
  mixins: [pagingData],
  props: {
    showTable: {
      type: Boolean,
      default: false
    },
    itemGroupShow: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      formdata: {
        page: '',
        pageSize: config.app.paging.pageSize,
        restrictHierarchy: 'false'
      },
      filterUser: null,
      countLstUser: 0
    }
  },
  watch: {
    showTable() {
      if (this.showTable) {
        this.formdata.page = ''
        this.search()
      }
    }
  },
  mounted() {},
  methods: {
    onChangePage(page) {
      this.formdata.page = page
      this.search()
    },
    async search() {
      try {
        if (!this.itemGroupShow) {
          return
        }
        this.formdata.groupId = this.itemGroupShow.groupId
        const response = await DocumentService.getListUserRole(this.formdata)
        const dataResponse = response.data
        this.filterUser = dataResponse.data
        this.countLstUser = dataResponse.totalElements
        this.renderPaging(dataResponse)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card__title {
  word-break: normal;
}
.signer-item {
  .v-input__slot {
    background: #fff !important;

    .v-input--selection-controls__input {
      margin-right: 0px !important;
    }
  }
}
</style>
