<template>
  <div class="wrap-home ml-2 mt-2 contracts-page">
    <v-container fluid class="py-5 pt-2 rounded-xl bg-primary pb-5">
      <h4 class="white--text ml-2">
        {{ $t('contract.label.coordination') }}
      </h4>
      <v-card
        color="white"
        class="rounded-xl ma-2 mt-2 text-wrap"
        :class="showContractDetail ? 'd-none' : ''"
      >
        <search-contract
          :formdata="formdata"
          :search-contract="searchContract"
          :change-show-advance="changeShowAdvance"
        />
        <v-layout wrap>
          <div class="col-12 px-0">
            <div
              v-if="listContract.length == 0"
              class="col-md-5 col-12 mx-auto wrap-empty-list"
            >
              <empty-box :loading="loading" />
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
                          {{ $t('contract.label.customer') }}
                        </th>
                        <th class="text-left contract-status">
                          {{ $t('contract.label.contractStatus') }}
                        </th>
                        <th class="text-left contract-status">
                          {{ $t('contract.label.processStatus') }}
                        </th>
                        <th class="text-left time">
                          {{ $t('contract.label.updatedDate') }}
                        </th>
                        <th class="text-left time">
                          {{ $t('contract.label.timeExpired') }}
                        </th>
                        <th class="text-left time">
                          {{ $t('contract.label.dateArrival') }}
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
                        <td class="text-left">
                          <div
                            class="btn"
                            @click="showDetail(`${item.documentId}`)"
                          >
                            <v-tooltip top content-class="tooltip-top">
                              <template v-slot:activator="{ on }">
                                <div class="maxline2" v-on="on">
                                  {{ item.documentTitle }}
                                </div>
                              </template>
                              <div>
                                {{ item.documentTitle }}
                              </div>
                            </v-tooltip>

                            <div class="text--caption grey--text darken-3">
                              {{ item.formulaName }}
                            </div>
                          </div>
                        </td>
                        <td class="text-left">
                          <div class="d-flex align-center">
                            <span
                              v-html="
                                renderAvatar(
                                  item.docState,
                                  getFirstCharacter(item.customerRepresent)
                                )
                              "
                            />
                            <span class="ml-2">{{
                              item.customerRepresent
                            }}</span>
                          </div>
                        </td>
                        <td class="text-left">
                          <span v-html="contractState(item.docState)" />
                        </td>
                        <td class="text-left">
                          {{ renderProcessStatus(`${item.processStatus}`) }}
                        </td>
                        <td class="text-left">{{ item.updatedDate }}</td>

                        <td class="text-left">{{ item.expiredDate }}</td>
                        <td class="text-left">{{ item.submissionDate }}</td>
                        <td class="text-center">
                          <v-tooltip left content-class="tooltip-left">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click="gotoSign(item.documentId)"
                              >
                                <img src="@/assets/icons/pdf.svg">
                              </v-btn>
                            </template>
                            <span>{{ item.fileName }}</span>
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
                                <div v-if="action === 'COORDINATE'">
                                  <div
                                    class="btn-action"
                                    @click="
                                      goToCoordinate(`${item.documentId}`)
                                    "
                                  >
                                    <i
                                      class="v-icon notranslate mdi mdi-account-convert"
                                    />
                                    <span>{{
                                      $t('contract.tooltip.coordinate')
                                    }}</span>
                                  </div>
                                  <div
                                    class="btn-action"
                                    @click="
                                      showConfirmReject(`${item.documentId}`)
                                    "
                                  >
                                    <i
                                      class="v-icon notranslate mdi mdi-account-cancel"
                                    />
                                    <span>{{
                                      $t('contract.tooltip.cancelCoordinate')
                                    }}</span>
                                  </div>
                                </div>
                                <div v-else>
                                  <div
                                    @click="clickAction(`${action}`, item)"
                                    v-html="
                                      renderAction(`${action}`, item.documentId)
                                    "
                                  />
                                </div>
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
            <div class="mt-10 mx-2 px-8 pb-4">
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
        :contract-id="contractId"
        :show-cancel-process="false"
        @close-dialog="showContractDetail = false"
      />
      <dialog-reject
        :label-comment="`contract.label.reason`"
        :label-input-comment="`contract.label.inputReason`"
        :label-message-comment="`contract.reasonRequired`"
        :show-comment="true"
        :required-comment="true"
        :show-dialog="showDialogReject"
        @accept="acceptRejectCoordination"
        @close-dialog="showDialogReject = false"
      />
    </v-container>
  </div>
</template>

<script>
import pagingData from '@/mixins/paging'
import alertMixin from '@/mixins/alert'
import statusContract from '@/modules/econtract/mixins/statusContract'
import SearchContract from './SearchContract'
import DialogContractDetail from '../components/DialogContractDetail'
import { ContractService } from '@/modules/econtract/services/contractService'
import config from '@/config'
import constants from '@/constants'
import econtractRoute from '@/modules/econtract/router/routePaths'
import { mapActions } from 'vuex'
import DialogReject from '@/modules/econtract/views/eContract/contract/coordination/components/DialogReject'
import checkRoles from '@/mixins/checkRoles'
import EmptyBox from '@/views/components/EmptyBox.vue'
import moment from 'moment'
export default {
  components: { SearchContract, DialogContractDetail, DialogReject, EmptyBox },
  mixins: [pagingData, alertMixin, statusContract, checkRoles],
  data() {
    return {
      showAdvance: false,
      showDialogReject: false,
      show: null,
      listContract: [],
      historiesContract: [],
      contractId: null,
      formdata: {
        page: 1,
        pageSize: config.app.paging.pageSize,
        keyword: '',
        searchType: constants.SEARCH_TYPE_CONTRACT.COORDINATOR_CONTRACT,
        fromDate: null,
        toDate: null,
        effectDateFrom: null,
        effectDateTo: null
      },
      showContractDetail: false,
      loading: false,
      showTable: false
    }
  },
  created() {
    this.hasPermission([
      constants.USER_ROLE.HDDT,
      constants.USER_ROLE.MAIN,
      constants.USER_ROLE.CONCURRENTLY,
      constants.USER_ROLE.OTHER,
      constants.USER_ROLE.NV,
      constants.USER_ROLE.LD,
      constants.USER_ROLE.VT,
      constants.USER_ROLE.GD
    ])
    localStorage.setItem(constants.LIST_CONTRACT_ROOT, 'coordination')
  },
  methods: {
    ...mapActions('contract', ['setGoBack']),
    ...mapActions('layout', ['setNotify']),
    renderProcessStatus(status) {
      if (status) {
        return this.$t(
          `contract.label.coordinateProcess.${status.toLowerCase()}`
        )
      }
      return ''
    },
    onChangePage(page) {
      this.formdata.page = page
      this.page = page
      this.search()
    },
    gotoSign(contractId) {
      this.setGoBack('coordinate')
      this.$router.push(`${econtractRoute.SIGN_CONTRACT_PATH.replaceAll(':contractId', contractId)}`)
    },
    // Hien thi chi tiet hop dong
    showDetail(contractId) {
      this.contractId = `${contractId}`
      this.showContractDetail = true
    },
    changeShowAdvance(value) {
      this.showAdvance = value
    },
    isValidDate(strDate) {
      return moment(strDate, 'DDMMYYYY', true).isValid()
    },
    async searchContract() {
      this.formdata.page = ''
      this.search()
    },
    async search() {
      try {
        if (!this.formdata.fromDate || !this.formdata.toDate) {
          return
        }
        const validFromDate = this.isValidDate(this.formdata.fromDate)
        const validToDate = this.isValidDate(this.formdata.toDate)

        if (!validFromDate || !validToDate) return

        this.loading = true
        const response = await ContractService.searchContract(this.formdata)
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
    },
    goToCoordinate(contractId) {
      this.$router.push(`${econtractRoute.COORDINATION_CONTRACT_PATH.replaceAll(':contractId', contractId)}`)
    },
    showConfirmReject(contractId) {
      this.contractId = contractId
      this.showDialogReject = true
    },
    async acceptRejectCoordination(comment) {
      // Tu choi dieu phoi
      try {
        const contractId = this.contractId
        const data = {}
        data['comment'] = comment.trim()
        const response = await ContractService.rejectCoordinatingContract(
          data,
          contractId
        )
        if (response.status === 200) {
          var message = 'contract.rejectsSuccess.coordinate'
          const typeAlert = 'success'
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message)
          })
          this.search()
        }
      } catch (error) {
        const typeAlert = 'error'
        const message = error
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

<style lang="scss" src="../ListContract.scss"></style>
