<template>
  <div class="wrap-home ml-2 mt-2 contracts-page">
    <v-container fluid class="py-5 pt-2 rounded-xl bg-primary pb-5">
      <h4 class="white--text ml-2">
        {{ $t('flow.label.flow') }}
      </h4>
      <v-card color="white" class="rounded-xl ma-2 mt-2 text-wrap">
        <search-flow
          :formdata="formdata"
          :search-flow="searchFlow"
          :change-show-advance="changeShowAdvance"
        />
        <v-layout wrap class="col-12">
          <div class="col-sm-12">
            <div
              v-if="listContract.length == 0"
              class="col-md-5 col-12 mx-auto wrap-empty-list"
            >
              <empty-box :loading="loading" subtitle="empty.flow" />
            </div>
            <div v-else class="content-list-contract text-center my-2">
              <v-scroll-y-transition>
                <v-simple-table v-show="showTable" dense fixed-header>
                  <template v-slot:default>
                    <thead class="text--body-5">
                      <tr>
                        <th class="text-center stt">Stt</th>
                        <th class="text-left contract-name">
                          {{ $t('contract.label.contractName') }}
                        </th>
                        <th class="text-left customer">
                          {{ $t('contract.label.contractType') }}
                        </th>
                        <th class="text-left customer">
                          {{ $t('contract.customerRepresentative') }}
                        </th>
                        <th class="text-left contract-name">
                          {{ $t('contract.label.scopeUse') }}
                        </th>
                        <th class="text-left time">
                          {{ $t('contract.label.dateFrom') }}
                        </th>
                        <th class="text-left customer">
                          {{ $t('contract.label.signUserType.creator') }}
                        </th>
                        <th class="text-center action">
                          {{ $t('contract.label.fileSign') }}
                        </th>
                        <th class="text-center action">
                          {{ $t('contract.label.actions') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="text--body-5">
                      <div v-if="listContract.length == 0">
                        <div class="no-data-table">
                          {{ $t('noData') }}
                        </div>
                      </div>
                      <tr
                        v-for="(item, index) in listContract"
                        v-else
                        :key="index"
                      >
                        <td class="text-center">
                          <div class="my-2">{{ index + fromRecord }}</div>
                        </td>
                        <td class="text-left link-hover">
                          <div
                            class="btn"
                            @click="showDetail(`${item.documentId}`)"
                          >
                            <v-tooltip top content-class="tooltip-top">
                              <template v-slot:activator="{ on }">
                                <div class="maxline2" v-on="on">
                                  {{ item.title }}
                                </div>
                              </template>
                              <div>
                                {{ item.title }}
                              </div>
                            </v-tooltip>
                          </div>

                          <!-- <div
                            class="btn"
                            @click="showDetail(`${item.documentId}`)"
                          >
                            {{ item.title }}
                          </div> -->
                        </td>
                        <td class="text-left">
                          {{ item.formulaName }}
                        </td>
                        <td class="text-left">
                          {{ item.customerRepresent }}
                        </td>
                        <td class="text-left">
                          <div v-html="renderScopes(item.groupDocumentScope)" />
                        </td>

                        <td class="text-left">{{ item.createdDate }}</td>
                        <td class="text-left">
                          <span v-if="item.creator">
                            {{ item.creator.fullName }}
                          </span>
                        </td>
                        <td class="text-center">
                          <v-tooltip left content-class="tooltip-left">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click="gotoSign(item.documentId)"
                              >
                                <img
                                  src="@/assets/icons/pdf.svg"
                                  alt=""
                                  srcset=""
                                >
                              </v-btn>
                            </template>
                            <span>{{ item.signFile.fileName }}</span>
                          </v-tooltip>
                        </td>
                        <td>
                          <v-menu
                            v-if="item.showIcons && item.showIcons.length > 0"
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
                              <div
                                v-for="(action, id) in item.showIcons"
                                :key="id"
                                class="px-2 item-action"
                              >
                                <div
                                  @click="
                                    showConfirmRemove(
                                      `${action}`,
                                      item.documentId
                                    )
                                  "
                                  v-html="
                                    renderAction(`${action}`, item.documentId)
                                  "
                                />
                              </div>
                            </v-list>
                          </v-menu>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-scroll-y-transition>
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
      <dialog-contract-detail
        :show-dialog="showContractDetail"
        :histories="historiesContract"
        :show-cancel-process="false"
        :contract-id="contractId"
        @close-dialog="showContractDetail = false"
      />
      <!-- Xac nhan xoa, huy luong hop dong -->
      <dialog-confirm
        :show-dialog="showDialogRemoveContract"
        :title-confirm="comfirmRemove"
        @close-dialog="showDialogRemoveContract = false"
        @accept="acceptRemoveContract"
      />
    </v-container>
  </div>
</template>

<script>
import pagingData from '@/mixins/paging'
import alertMixin from '@/mixins/alert'
import checkRoles from '@/mixins/checkRoles'
import statusContract from '@/modules/econtract/mixins/statusContract'
import SearchFlow from './components/SearchFlow.vue'
import DialogContractDetail from './components/DialogContractDetail.vue'
import DialogConfirm from '@/modules/econtract/views/eContract/contract/sign/components/DialogConfirm.vue'
import { ContractService } from '@/modules/econtract/services/contractService'
import config from '@/config'
import constants from '@/constants'
import econtractRoute from '@/modules/econtract/router/routePaths'
import { mapActions } from 'vuex'
import renderUtils from '@/mixins/renderUtils'
import EmptyBox from '@/views/components/EmptyBox'
export default {
  components: {
    SearchFlow,
    DialogContractDetail,
    DialogConfirm,
    EmptyBox
  },
  mixins: [pagingData, alertMixin, statusContract, renderUtils, checkRoles],
  data() {
    return {
      comfirmRemove: null,
      actionContract: null,
      documentId: null,
      showDialogRemoveContract: false,
      showAdvance: false,
      show: null,
      listContract: [],
      historiesContract: [],
      contractId: null,
      formdata: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keyword: '',
        documentFormulaId: null,
        groupDocScopeIds: null
      },
      listActionShowComfirm: [constants.LIST_ACTIONS_DETAIL.DELETE],
      showContractDetail: false,
      loading: false,
      showTable: false
    }
  },
  created() {
    this.hasPermission([constants.USER_ROLE.HDDT])
  },
  mounted() {
    this.searchFlow()
  },

  methods: {
    ...mapActions('layout', ['setNotify']),
    ...mapActions('contract', ['setGoBack']),
    showConfirmRemove(action, documentId) {
      if (this.listActionShowComfirm.includes(action)) {
        this.comfirmRemove = 'contract.titleComfirmRemove.comfirmRemoveContract'
        this.showDialogRemoveContract = true
        this.actionContract = action
        this.documentId = documentId
      } else {
        this.clickActionFlow(action, documentId)
      }
    },
    acceptRemoveContract() {
      this.clickActionFlow(this.actionContract, this.documentId)
    },
    async clickActionFlow(action, id) {
      // Sua hop dong
      if (action === constants.LIST_ACTIONS_DETAIL.EDIT) {
        return this.$router.push(`${econtractRoute.UPDATE_FLOW_PATH.replaceAll(':contractId', id)}`)
      }

      // Xoa hop dong
      if (action === constants.LIST_ACTIONS_DETAIL.DELETE) {
        try {
          await ContractService.deleteContract(id)
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('contract.tooltip.delete')
            })
          )
          // Goi lai danh sach
          this.searchFlow()
        } catch (error) {
          this.showNotify('error', error.message)
        }
      }
    },
    onChangePage(page) {
      this.formdata.page = page
      this.page = page
      this.search()
    },
    gotoSign(contractId) {
      this.setGoBack('process')
      localStorage.setItem(constants.LIST_CONTRACT_ROOT, 'flows')
      this.$router.push(`${econtractRoute.SIGN_CONTRACT_PATH.replaceAll(':contractId', contractId)}`)
    },
    // Hien thi chi tiet hop dong
    showDetail(contractId) {
      localStorage.setItem(constants.LIST_CONTRACT_ROOT, 'flows')
      this.contractId = `${contractId}`
      this.showContractDetail = true
    },
    changeShowAdvance(value) {
      this.showAdvance = value
    },
    async searchFlow() {
      this.formdata.page = 0
      this.search()
    },
    async search() {
      try {
        if (!this.showAdvance) {
          this.formdata.documentFormulaId = null
          this.formdata.groupDocScopeIds = null
        }
        this.loading = true
        const response = await ContractService.searchFlow(this.formdata)
        const dataResponse = response.data
        this.listContract = dataResponse.data
        this.renderPaging(dataResponse)
        setTimeout(() => {
          this.showTable = true
        }, 10)
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

<style lang="scss" src="./ListFlows.scss"></style>
