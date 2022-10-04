<template>
  <div>
    <v-card class="py-5 mt-5">
      <h5 class="header-section pl-4 pb-4">
        {{ $t('dashboards.processingContract') }}
      </h5>
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
                <th class="text-center stt" />
                <th class="text-left">
                  {{ $t('dashboards.nameContract') }}
                </th>
                <th class="text-left">
                  <span class="pl-5">{{ $t('dashboards.process') }}</span>
                </th>
                <th class="text-center" />
              </tr>
            </thead>
            <tbody class="text--body-1">
              <tr
                v-for="(item, index) in contracts"
                :key="index"
                :class="checkType(item.signUserType) ? '' : 'item-review'"
              >
                <td class="text-center">
                  <b>{{ index + fromRecord }}</b>
                </td>
                <td class="py-3">
                  <div class="wrap-title-dashboard">
                    <div class="btn" @click="showDetail(item.id)">
                      <v-tooltip top content-class="tooltip-top">
                        <template v-slot:activator="{ on }">
                          <div
                            class="maxline2 text--body-1"
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
                        {{ showDate(item.receivedDate) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td width="50%" class="text-center">
                  <div
                    class="process-contract"
                    :style="widthProcess(item.process.totalStep)"
                    @click="showDetail(item.id)"
                    v-html="renderProcessContract(item.process)"
                  />
                </td>
                <td width="20%" class="text-center">
                  <v-btn
                    :color="checkType(item.signUserType) ? 'info' : 'primary'"
                    class="btn-action-sign text--button"
                    rounded
                    @click="gotoSign(item)"
                  >
                    <div class="d-flex flex-column py-1">
                      <span> {{ $t(textButtom(item.signUserType)) }}</span>
                      <div
                        v-if="item.remainingDays"
                        class="text--body-5 text--uppercase"
                      >
                        <span>({{ item.remainingDays }} {{ $t('day') }})</span>
                      </div>
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
    <dialog-contract-detail
      :show-dialog="showContractDetail"
      :show-cancel-process="false"
      :contract-id="contractId"
      @close-dialog="showContractDetail = false"
    />
  </div>
</template>

<script>
import pagingData from '@/mixins/paging'
import constants from '@/constants'
import econtractRoute from '@/modules/econtract/router/routePaths'
import { ContractService } from '@/modules/econtract/services/contractService'
import DialogContractDetail from '@/modules/econtract/views/eContract/contract/list/components/DialogContractDetail'
import { mapActions } from 'vuex'
import EmptyBox from '@/views/components/EmptyBoxDashboard'
export default {
  name: 'ContractWaitSign',
  components: {
    DialogContractDetail,
    EmptyBox
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
    showDetail(contractId) {
      this.contractId = `${contractId}`
      this.showContractDetail = true
    },
    async getRelateDocument() {
      try {
        this.loading = true
        const response = await ContractService.getRelateDocument(
          this.searchForm
        )
        const paging = response.data
        this.contracts = paging.data
        this.renderPaging(paging)
        if (this.contracts.length > 0) {
          this.$emit('update-show-intro', false)
          this.contracts.map((item, index) => {
            const maxDots = 6
            // Tong so buoc
            const totalStep = +item.maxStep
            // Buoc ky hien tai
            const currentStep = +item.myStep
            // So buoc con lai
            const remainStep = totalStep - currentStep
            var startProcess = currentStep
            if (totalStep > maxDots && maxDots - currentStep <= 3) {
              startProcess = 3
            }
            if (remainStep < 3 && totalStep > maxDots) {
              startProcess = maxDots - remainStep
            }
            const step = {
              myStep: currentStep,
              totalStep,
              startProcess
            }

            return (item.process = step)
          })
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
    isProcessDone(status) {
      return status === 1
    },
    renderStep(process, index) {
      if (index + 1 === +process.myStep) {
        return `<span class="process-item status-processing"><i class="icon-process"></i></span>`
      }
      return `<span class="process-item status-${
        this.isProcessDone(process.status) ? 'done' : 'processing'
      }">${
        this.isProcessDone(process.status)
          ? `<i class="mdi mdi-check"></i>`
          : process.step
      }</span>`
    },
    renderProcessContract(process) {
      if (process.totalStep <= 6) {
        let htmlProcess = ''
        for (let i = 1; i <= process.startProcess; i++) {
          htmlProcess +=
            i === +process.startProcess
              ? `<span class="process-item status-processing pulse icon-processing"><i class="icon-process"></i></span>`
              : `<span class="process-item status-done"><i class="mdi mdi-check"></i></span>`
        }
        for (let i = process.startProcess + 1; i <= process.totalStep; i++) {
          htmlProcess += `<span class="process-item status-processing">${i}</span>`
        }
        return htmlProcess
      } else {
        let htmlProcess = ''
        // Cach buoc cuoi 3 buoc
        if (process.totalStep - process.myStep <= 3) {
          for (let i = 1; i <= process.startProcess; i++) {
            htmlProcess +=
              i === +process.startProcess
                ? `<span class="process-item status-processing pulse icon-processing"><i class="icon-process"></i></span>`
                : `<span class="process-item status-done"><i class="mdi mdi-check"></i></span>`
          }
          for (let i = process.myStep + 1; i <= process.totalStep; i++) {
            htmlProcess += `<span class="process-item status-processing">${i}</span>`
          }
        } else {
          for (let i = 1; i <= process.startProcess; i++) {
            htmlProcess +=
              i === +process.startProcess
                ? `<span class="process-item status-processing pulse  icon-processing"><i class="icon-process"></i></span>`
                : `<span class="process-item status-done"><i class="mdi mdi-check"></i></span>`
          }
          for (let i = 1; i <= 4 - process.startProcess; i++) {
            htmlProcess += `<span class="process-item status-processing">${process.myStep +
              i}</span>`
          }
          htmlProcess += `<span class="process-item status-processing">...</span>`
          htmlProcess += `<span class="process-item status-processing">${process.totalStep}</span>`
        }

        return htmlProcess
      }
    },
    widthProcess(totalStep) {
      if (totalStep >= 6) {
        return 'max-width: 532px'
      } else {
        if (totalStep <= 2) {
          return `max-width: 167px`
        }
        if (totalStep <= 3) {
          return `max-width: ${totalStep * 86}px`
        } else return `max-width: ${totalStep * 88.5}px`
      }
    },
    checkType(type) {
      let check = false
      if (
        type === constants.SIGN_USER_TYPE.MAIN ||
        type === constants.SIGN_USER_TYPE.FLASHES
      ) {
        check = true
      }
      return check
    },
    gotoSign(item) {
      this.setGoBack('/')
      const contractId = item.id
      if (item.signUserType === constants.SIGN_USER_TYPE.COORDINATOR) {
        localStorage.setItem(constants.LIST_CONTRACT_ROOT, 'coordination')
        this.$router.push(`${econtractRoute.COORDINATION_CONTRACT_PATH.replaceAll(':contractId', contractId)}`)
      } else {
        localStorage.setItem(constants.LIST_CONTRACT_ROOT, 'process')
        this.$router.push(`${econtractRoute.SIGN_CONTRACT_PATH.replaceAll(':contractId', contractId)}`)
      }
    },
    showDate(date) {
      return date || ''
    },
    textButtom(value) {
      let text = ''
      switch (value) {
        case constants.SIGN_USER_TYPE.REVIEWER:
          text = 'dashboards.review'
          break
        case constants.SIGN_USER_TYPE.COORDINATOR:
          text = 'dashboards.coordinator'
          break
        default:
          text = 'dashboards.signer'
          break
      }
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
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
