<template>
  <div>
    <v-card class="mt-5 list-document-unread">
      <h3 class="header-section pa-3 ">
        {{ $t('managementDoc.dashboards.processingDocument') }}
      </h3>
      <v-scroll-y-transition>
        <v-simple-table
          v-show="contracts.length"
          fixed-header
          height="40vh"
          class="tb-wait-sign"
        >
          <template v-slot:default>
            <thead class="header-table text--body-5">
              <tr>
                <th class="text-center" style="width: 5%" />
                <th class="text-left edoc-text--body-8 text-capitalize" style="width: 75%">
                  {{ $t('managementDoc.dashboards.nameDocument') }}
                </th>
                <th class="text-center" style="width: 19%" />
              </tr>
            </thead>
            <tbody class="text--body-1">
              <tr
                v-for="(item, index) in contracts"
                :key="index"
                class="item-review"
              >
                <td class="text-center">
                  <b>{{ index + fromRecord }}</b>
                </td>
                <td class="py-3 link-hover" @click="showDetail(item)">
                  <div class="wrap-title-dashboard">
                    <div class="btn">
                      <v-tooltip top content-class="tooltip-top">
                        <template v-slot:activator="{ on }">
                          <div
                            class="maxline2 edoc-text--body-8"
                            :class="item.remainingDays < 0 ? 'text-danger' : ''"
                            v-on="on"
                          >
                            {{ item.title }}
                          </div>
                        </template>
                        <div>
                          {{ item.title }}
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="text--body-3">
                      <div class="contract-date">
                        <span>{{ $t('dashboards.receivedDate') }}</span>
                        {{ showDate(item.createdDate) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <v-btn
                    color="info"
                    class="btn-action-sign text--button"
                    rounded
                    @click="gotoSign(item)"
                  >
                    <div class="d-flex flex-column py-1">
                      <span>{{ $t('managementDoc.dashboards.readDocument') }}</span>
                    </div>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-scroll-y-transition>

      <div v-show="contracts.length == 0" class="col-sm-3 mx-auto">
        <empty-box :loading="loading" :show-action-create="showActionCreate" />
      </div>
      <v-divider v-if="contracts.length > 0" class="py-2" />
      <div class="mx-2 px-4">
        <base-paging
          :page="page"
          :total-pages="totalPages"
          :from-record="fromRecord"
          :to-record="toRecord"
          :total-records="totalRecords"
          @on-change-page="onChangePage"
        />
      </div>
    </v-card>
    <!-- Dialog ky van ban-->
    <ViewFile
      :show-dialog="showDialogSign"
      :document-id="documentId"
      :index-open-file-doc="indexOpenFileDoc"
      @close-dialog="closeDialogSign"
    />
  </div>
</template>

<script>
import pagingData from '@/mixins/paging'
// import constants from '@/constants'
import edocumentRoute from '@/modules/edocument/router/routePaths'
import { DocumentService } from '@/modules/edocument/services/documentService'
import { mapActions } from 'vuex'
import EmptyBox from '@/views/components/EmptyBoxDashboard'
import ViewFile from '@/modules/edocument/views/document/management/file/ViewFile'

export default {
  name: 'ContractWaitSign',
  components: {
    EmptyBox,
    ViewFile
  },
  mixins: [pagingData],
  props: {
    showActionCreate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      documentId: null,
      showDialogSign: false,
      indexOpenFileDoc: null,
      showContractDetail: false,
      contractId: undefined,
      contracts: [],
      process: [],
      searchForm: {
        page: '',
        pageSize: 5
      },
      loading: false
    }
  },
  mounted() {},
  created() {
    this.getRelateDocument()
  },
  methods: {
    ...mapActions('contract', ['setGoBack']),
    showDetail(item) {
      this.$router.push(
        `${edocumentRoute.MANAGEMENT_DOC_DETAIL_PATH.replaceAll(
          ':documentId',
          item.documentId
        )}`
      )
    },
    async getRelateDocument() {
      try {
        this.loading = true
        const response = await DocumentService.getListDocDashBoard(
          this.searchForm
        )
        const paging = response.data
        this.contracts = paging.data
        this.renderPaging(paging)
        if (this.contracts.length > 0) {
          this.$emit('update-show-intro', false)
        } else {
          this.$emit('update-show-intro', true)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    onChangePage(page) {
      this.searchForm.page = page
      this.getRelateDocument()
    },
    gotoSign(item) {
      this.indexOpenFileDoc = 0
      this.documentId = item.documentId
      this.showDialogSign = true
    },
    // Dong dialog ky van ban
    closeDialogSign(isSignDoc) {
      this.showDialogSign = false
      if (isSignDoc) this.getRelateDocument()
    },
    showDate(date) {
      return date || ''
    },
  }
}
</script>

<style lang="scss" scoped>

.list-document-unread {
  padding: 15px 0;
  border-radius: 20px;
  .link-hover {
    &:hover {
      color: #0fafe4;
      cursor: pointer;
    }
  }
}
.contract-name {
  font-size: 16px;
  color: #22242c;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0.2px;
  @media (max-width: 1336px) {
    font-size: 14px;
  }
}
.wrap-title-dashboard {
  line-height: 17px;
}

.contract-date {
  letter-spacing: 0.1px;
  font-weight: 500;
  color: #22242c;
  font-size: 12px;
  span {
    color: #8e8ea1;
  }
}
.empty {
  text-align: center;
  font-size: 14px;
}
</style>
