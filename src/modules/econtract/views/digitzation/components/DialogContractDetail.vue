<template>
  <v-fade-transition>
    <div v-if="showDialog" class="wrap-contract-detail pa-6">
      <h4 class="text-center dialog-title white--text">
        <div>{{ $t('contract.dialog.contractDetail') }}</div>
      </h4>
      <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>

      <v-card class="dialog-contract-detail px-10 mt-4">
        <div>
          <v-row class="pt-2">
            <v-col
              class="contract-detail-content"
              :class="histories.length ? 'col-12 col-md-7' : 'col-12 no-border'"
            >
              <h6 class="text-capitalize">
                {{ $t('contract.label.contractInfo') }}
              </h6>
              <v-row>
                <v-col cols="12">
                  <div class="wrap-history-top">
                    <v-row class="mt-0">
                      <v-col cols="12">
                        <div class="form-group">
                          <label class="pr-2 text--body-1">{{
                            $t('contract.label.contractName')
                          }}</label>
                          <div
                            v-if="contractDetail"
                            class="detail-content  text--body-1"
                          >
                            <span>{{ contractDetail.documentTitle }} </span>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row class="mt-0">
                      <v-col cols="12" sm="6">
                        <div class="form-group">
                          <label class="pr-2 text--body-1">
                            {{
                              $t('contract-manager.labels.contractNumber')
                            }}</label>
                          <div
                            class="detail-content  text--body-1 symbol-contract"
                          >
                            <span v-if="contractDetail">{{
                              contractDetail.contractCode
                            }}</span>
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <div class="form-group">
                          <label class="pr-2 text--body-1">
                            {{ $t('group.name') }}
                          </label>
                          <div
                            class="detail-content flex-start d-flex  text--body-1"
                          >
                            <div
                              v-if="contractDetail"
                              v-html="contractDetail.ownerGroupName"
                            />
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row class="mt-0">
                      <v-col cols="12" sm="6">
                        <div class="form-group">
                          <label class="pr-2 text--body-1">
                            {{ $t('users.addSignature.time') }}</label>
                          <div class="detail-content  text--body-1">
                            <span v-if="contractDetail">{{
                              contractDetail.effectDate
                            }}</span>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="form-group">
                          <label class="pr-2 text--body-1">
                            {{ $t('contract.label.timeExpired') }}</label>
                          <div class="detail-content  text--body-1">
                            <span v-if="contractDetail">{{
                              contractDetail.expirationDate
                            }}</span>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                  <div
                    v-if="
                      contractDetail && contractDetail.customerDtos.length > 0
                    "
                    class="wrap-list-customer mt-3"
                  >
                    <div
                      v-for="(signer, index) in contractDetail.customerDtos"
                      :key="index"
                      class="mt-0"
                    >
                      <v-col cols="12" class="px-0 pt-0">
                        <div class="form-group">
                          <label class="pr-2 text--body-1">
                            {{ $t('contract.customerRepresentative') }}
                            {{ index + 1 }}
                          </label>
                          <div class="detail-content  text--body-1">
                            <div>
                              {{ signer.customerRepresent }}
                              <span v-html="renderCustomerInfo(signer)" />
                            </div>
                            <div v-if="signer.signGroupName">
                              {{ signer.signGroupName }}
                            </div>
                          </div>
                        </div>
                      </v-col>
                    </div>
                  </div>

                  <v-row class="mt-0">
                    <v-col cols="12" sm="6">
                      <div class="form-group">
                        <label class="pr-2 text--body-1">
                          {{ $t('contract.label.fileSign') }}</label>
                        <div class="text--caption">
                          <div
                            v-if="contractDetail && contractDetail.fileMain"
                            class="d-flex align-center"
                          >
                            <img
                              :src="
                                getIconFile(
                                  `${contractDetail.fileMain.fileName}`
                                )
                              "
                              class="mr-2"
                            >
                            <span
                              class="text-primary text-link text-decoration-underline btn"
                              @click="
                                gotoSign(contractDetail.documentId)
                              "
                            >{{
                              contractDetail.fileMain.fileName || ''
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div
                        v-if="
                          contractDetail &&
                            contractDetail.fileAttachments.length > 0
                        "
                        class="form-group"
                      >
                        <label class="pr-2 text--body-1">
                          {{ $t('contract.label.fileAttachs') }}</label>
                        <div>
                          <ul class="list-files text--caption">
                            <li
                              v-for="(fileAttach,
                                      idx) in contractDetail.fileAttachments"
                              :key="idx"
                              class="mb-2"
                              @click="downloadFileAttach(fileAttach)"
                            >
                              <div class="d-flex align-center">
                                <img
                                  :src="getIconFile(`${fileAttach.fileName}`)"
                                  class="mr-2"
                                >
                                <span
                                  class="text-primary text-link text-decoration-underline btn"
                                >{{ fileAttach.fileName }}</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="histories.length" class="pl-0 col-12 col-md-5">
              <div class="wrap-history pl-3">
                <div>
                  <h6 class="text-capitalize">
                    {{ $t('contract.label.usersJoin') }}
                  </h6>
                </div>
                <contract-history
                  :histories="histories"
                  :document-id="documentId"
                  @close-dialog="closeDialog"
                />
              </div>
            </v-col>
          </v-row>
        </div>
        <v-divider class="mt-3" />
        <v-card-actions class="d-flex justify-center py-4">
          <v-btn
            v-if="showCancelProcess"
            rounded
            outlined
            color="primary"
            class="w-150 py-5 mr-12 text--button"
            @click="cancelProcess"
          >
            {{ $t('cancelProcessLabel') }}
          </v-btn>

          <v-btn
            rounded
            color="primary"
            class="w-150 py-5 text--button"
            @click="closeDialog"
          >
            {{ $t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
      <dialog-view-pdf
        :src-file-pdf="srcFilePdf"
        :show-dialog="showDialogViewPdf"
        @close-dialog="showDialogViewPdf = false"
      />
      <base-preload :dialog="loading" />
    </div>
  </v-fade-transition>
</template>

<script>
import ContractHistory from './ContractHistory'
import statusContract from '@/modules/econtract/mixins/statusContract'
import { ContractService } from '@/modules/econtract/services/contractService'
import { mapActions } from 'vuex'
import fileMixin from '@/modules/econtract/mixins/fileMixin'
import DialogViewPdf from '@/views/components/DialogViewPdf.vue'
import econtractRoute from '@/modules/econtract/router/routePaths'

export default {
  components: {
    ContractHistory,
    DialogViewPdf
  },
  mixins: [statusContract, fileMixin],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    showCancelProcess: {
      type: Boolean,
      default: false
    },
    contractId: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      documentId: null,
      contractDetail: null,
      loading: false,
      histories: []
    }
  },
  watch: {
    showDialog() {
      if (this.showDialog) {
        this.searchDetailContract()
        this.getContractHistory()
      }
    }
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    closeDialog() {
      this.contractDetail = null
      this.$emit('close-dialog')
    },
    renderCustomerInfo(customer) {
      if (customer.email && customer.phone) {
        return `(${customer.email + ' - ' + customer.phone})`
      }
      if (customer.email && !customer.phone) {
        return `(${customer.email})`
      }
      if (!customer.email && customer.phone) {
        return `(${customer.phone})`
      }
      return ''
    },

    cancelProcess() {
      this.closeDialog()
      this.$emit('cancel-process')
    },
    async searchDetailContract() {
      try {
        this.loading = true
        const response = await ContractService.getDetailExternalContract(
          this.contractId
        )
        this.contractDetail = response.data
        if (this.contractDetail) {
          this.documentId = this.contractDetail.id
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.loading = false
      }
    },
    async getContractHistory() {
      try {
        this.loading = true
        const response = await ContractService.getContractHistory(
          this.contractId
        )
        this.histories = response.data || []
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.loading = false
      }
    },
    gotoSign(contractId) {
      this.$router.push(`${econtractRoute.SIGN_CONTRACT_PATH.replaceAll(':contractId', contractId)}`)
    }
  }
}
</script>
<style lang="scss">
.symbol-contract {
  word-break: break-all;
}
</style>
