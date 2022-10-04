<template>
  <v-fade-transition>
    <div v-if="showDialog" class="wrap-contract-detail pa-6">
      <h4 class="text-center dialog-title white--text">
        <div>{{ $t('contract.dialog.contractDetail') }}</div>
      </h4>
      <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>

      <v-card class="dialog-contract-detail px-10 mt-4">
        <div>
          <v-row>
            <v-col cols="12" sm="12" md="7" class="contract-detail-content">
              <h6 class="text-capitalize">
                {{ $t('contract.label.contractInfo') }}
              </h6>
              <v-row>
                <v-col cols="12">
                  <v-row class="mt-0">
                    <v-col cols="12">
                      <div class="form-group">
                        <label class="pr-2 text--body-1">{{
                          $t('contract.label.contractName')
                        }}</label>
                        <div
                          v-if="contractDetail"
                          class="detail-content text--body-1"
                        >
                          <span>{{ contractDetail.documentTitle }} </span>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="form-group">
                        <label class="pr-2 text--body-1">{{
                          $t('contract.label.contractStatus')
                        }}</label>
                        <div
                          class="detail-content text--body-1 flex-start d-flex"
                        >
                          <div
                            v-if="contractDetail"
                            class="text--body-1"
                            v-html="contractState(contractDetail.docState)"
                          />
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row class="mt-0">
                    <v-col cols="12" sm="6">
                      <div class="form-group">
                        <label class="pr-2 text--body-1">{{
                          $t('contract.label.timeSign')
                        }}</label>
                        <div class="detail-content text--body-1">
                          <span v-if="contractDetail">{{
                            contractDetail.signingDeadline
                          }}</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="form-group">
                        <label class="pr-2 text--body-1">{{
                          $t('contract.label.timeExpired')
                        }}</label>
                        <div class="detail-content text--body-1">
                          <span v-if="contractDetail">{{
                            contractDetail.expirationDate
                          }}</span>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row class="mt-0">
                    <v-col cols="12">
                      <div class="form-group">
                        <label class="pr-2 text--body-1">{{
                          $t('contract.customerRepresentative')
                        }}</label>
                        <div class="detail-content text--body-1">
                          <div v-if="contractDetail">
                            {{ contractDetail.customerRepresent }}
                          </div>
                          <div
                            v-if="
                              contractDetail && contractDetail.signGroupName
                            "
                          >
                            {{ contractDetail.signGroupName }}
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row class="mt-0">
                    <v-col cols="12" sm="6">
                      <div class="form-group">
                        <label class="pr-2 text--body-1">{{
                          $t('contract.label.fileSign')
                        }}</label>
                        <div class="">
                          <div
                            v-if="contractDetail && contractDetail.fileMain"
                            class="d-flex align-center text--caption"
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
                              @click="gotoSign(contractDetail.id)"
                            >{{
                              contractDetail.fileMain.fileName || ''
                            }}</span>
                            <v-tooltip top content-class="tooltip-top">
                              <template v-slot:activator="{ on }">
                                <img
                                  v-if="contractDetail.isSigning"
                                  class="ml-1 icon-sign"
                                  src="@/assets/icons/icon-ky.svg"
                                  v-on="on"
                                >
                              </template>
                              <div>
                                {{ $t('contract.tooltip.clickToSign') }}
                              </div>
                            </v-tooltip>
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
                        <label class="pr-2 text--body-1">{{
                          $t('contract.label.fileAttachs')
                        }}</label>
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
            <v-col cols="12" sm="12" md="5" class="pl-0">
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
import econtractRoute from '@/modules/econtract/router/routePaths'
import { ContractService } from '@/modules/econtract/services/contractService'
import { mapActions } from 'vuex'
import fileMixin from '@/modules/econtract/mixins/fileMixin'
import DialogViewPdf from '@/views/components/DialogViewPdf.vue'
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
      histories: null
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
    cancelProcess() {
      this.closeDialog()
      this.$emit('cancel-process')
    },
    gotoSign(contractId) {
      this.$router.push(`${econtractRoute.SIGN_CONTRACT_PATH.replaceAll(':contractId', contractId)}`)
    },
    async searchDetailContract() {
      try {
        this.loading = true
        const response = await ContractService.searchDetailContract(
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
        this.histories = response.data
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" src="./DialogContractDetail.scss"></style>
