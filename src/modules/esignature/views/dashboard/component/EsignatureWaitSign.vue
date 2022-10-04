<template>
  <div
    class="wrap-list-contract"
    :class="(showIntro && 'height-list-contract') || ''"
  >
    <p class="title-list-contract">{{ $t('docSubmited') }}</p>

    <div class="content-list-dashboard">
      <v-scroll-y-transition>
        <v-simple-table
          v-show="contracts.length"
          fixed-header
          class="tb-wait-sign"
        >
          <template v-slot:default>
            <thead class="header-table">
              <tr>
                <th class="text-center stt" />

                <th class="text-left">
                  {{ $t('electronicSign.create.nameDocument') }}
                </th>

                <th class="text-left">
                  <span class="pl-1">{{ $t('dashboards.process') }}</span>
                </th>

                <th class="text-center" />
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in contracts" :key="index">
                <td class="text-center" width="3%">
                  <div class="wrap-text-stt">
                    <span class="text-stt">{{ index + fromRecord }}</span>
                  </div>
                </td>

                <td class="py-3" width="37%">
                  <div class="btn" @click="showDetail(item)">
                    <div class="d-flex">
                      <v-tooltip top content-class="tooltip-top">
                        <template v-slot:activator="{ on }">
                          <div
                            class="text-stt maxline2"
                            :style="calculateStyle(item)"
                            v-on="on"
                          >
                            {{ item.title }}
                          </div>
                        </template>

                        <span v-text="item.title" />
                      </v-tooltip>
                    </div>

                    <div>
                      <span class="text-date"> {{ $t('receivedDate') }}</span>

                      <span class="text-data-date">
                        {{ convertSubmissionDate(item.submissionDate) }}
                      </span>
                    </div>
                  </div>
                </td>

                <td width="40%">
                  <div class="d-flex align-center">
                    <v-progress-linear
                      class="process-inProcess mr-2"
                      :buffer-value="item.totalProcessedSigners"
                      :value="valueProgress(item)"
                      :color="colorProgess(item.docState)"
                      height="15"
                    />

                    <span class="text-process">
                      {{ item.totalProcessedSigners }}/{{ item.totalSigners }}
                    </span>
                  </div>
                </td>

                <td width="20%" class="text-center">
                  <v-btn
                    :color="getColorBtn(item)"
                    class="btn-action"
                    height="40px"
                    rounded
                    @click="gotoSign(item)"
                  >
                    <div>
                      <span class="text-btn-action">
                        {{ $t(getTextBtn(item)) }}
                      </span>
                      <div v-if="checkShowSigningRemainTime(item)">
                        <small class="text-remaining">
                          ({{ item.signingRemainTime }} {{ $t('document.day') }})
                        </small>
                      </div>
                    </div>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-scroll-y-transition>
    </div>

    <div v-show="contracts.length == 0" class="mx-auto">
      <empty-box :loading="loading" :show-btn-create="true" />
    </div>

    <div v-if="checkShowData" class="fill-blank" />

    <v-divider v-if="checkShowData" class="py-2" />

    <div v-if="checkShowData" class="px-10 pb-7 pt-4">
      <base-paging
        :page="page"
        :total-pages="totalPages"
        :from-record="fromRecord"
        :to-record="toRecord"
        :total-records="totalRecords"
        @on-change-page="onChangePage"
      />
    </div>

    <!-- Dialog ky van ban-->
    <DialogSign
      :show-dialog="showDialogSign"
      :document-id="documentIdSign"
      :index-open-file-doc="0"
      :is-dashboard="true"
      @close-dialog="closeDialogSign"
    />
    <!-- Dialog ban hanh van ban -->
    <DialogProclaim
      :show-dialog="showDialogProclaim"
      :proclaim="itemProclaim"
      @close-dialog="showDialogProclaim = false"
      @accept-action="showPopupPromulgate"
    />

    <!-- Dialog confirm van ban ban hanh -->
    <DialogConfirmPromulgate
      :content-confirm="contentConfirm"
      :show-dialog="showConfirmDialogPromulgate"
      @close-dialog="showConfirmDialogPromulgate = false"
      @accept-action="acceptProclaim"
    />
  </div>
</template>

<script>
import routeEsignature from '@/modules/esignature/router/routePaths'
import pagingData from '@/mixins/paging'
import constants from '@/constants'
import { mapActions } from 'vuex'
import { DocumentService } from '@/modules/esignature/services/documentService'
import EmptyBox from '@/modules/esignature/views/components/EmptyBox.vue'
import DialogSign from '@/modules/esignature/views/sign/SignDocument.vue'
import DialogProclaim from '@/modules/esignature/views/list/components/DialogProclaim.vue'
import DialogConfirmPromulgate from '@/modules/esignature/views/list/components/DialogConfirmPromulgate.vue'

export default {
  name: 'ContractWaitSign',

  components: {
    EmptyBox,
    DialogSign,
    DialogProclaim,
    DialogConfirmPromulgate
  },

  mixins: [pagingData],

  data() {
    return {
      showContractDetail: false,
      contractId: undefined,
      contracts: [],
      process: [],
      showIntro: false,
      documentIdSign: 0,
      showDialogSign: false,
      searchForm: {
        page: '',
        pageSize: 5
      },
      showDialogProclaim: false,
      itemProclaim: null,
      dataPromulgate: null,
      showConfirmDialogPromulgate: false,
      contentConfirm: null
    }
  },
  computed: {
    checkShowData() {
      return this.contracts.length > 0
    }
  },
  created() {
    this.getListDocDashboard()
  },

  methods: {
    ...mapActions('document', ['setGoBack']),
    ...mapActions('layout', ['setNotify']),
    valueProgress(item) {
      return (item.totalProcessedSigners / item.totalSigners) * 100
    },
    colorProgess(item) {
      if (item === constants.DOC_STATES.COMPLETE) {
        return '#1c49e9'
      }
      return '#ffaf2e'
    },
    gotoSign(item) {
      this.itemProclaim = item
      this.documentIdSign = item.documentId
      if (item.docState === constants.DOC_STATES.COMPLETE) {
        this.showDialogProclaim = true
        return
      }
      this.showDialogSign = true
    },

    showDetail(item) {
      let store = constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN
      if (item.docState === constants.DOC_STATES.COMPLETE) {
        store = constants.SEARCH_TYPE_DOC.PROCESSED_DOC_PROMULGATE
      }
      if (
        item.docState === constants.DOC_STATES.IN_PROGRESS &&
        item.signUserType === constants.SIGN_USER_TYPE.REVIEWER
      ) {
        store = constants.SEARCH_TYPE_DOC.PROCESS_DOC_REVIEW
      }
      localStorage.setItem(constants.SEARCH_TYPE_DOC.PROCESS_DOC_SIGN, store)
      this.$router.push(
        routeEsignature.DOCUMENT_DETAIL_PATH.replaceAll(
          ':documentId',
          item.documentId
        )
      )
    },

    closeDialogSign(isSignDoc) {
      this.showDialogSign = false
      if (isSignDoc) {
        this.searchForm.page = 1
        this.$emit('update-count')
      }
      this.getListDocDashboard()
    },

    async getListDocDashboard() {
      try {
        this.loading = true
        const response = await DocumentService.getListDocDashBoard(
          this.searchForm
        )

        const paging = response.data
        this.contracts = paging.data
        this.renderPaging(paging)

        if (this.contracts.length === 0) {
          this.showIntro = true
          this.$emit('update-show-intro', true)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    calculateStyle(item) {
      if (item.signingRemainTime) {
        if (
          parseInt(item.signingRemainTime) >= 0 ||
          item.docState === constants.DOC_STATES.COMPLETE
        ) {
          return 'color: #22242C'
        }
        return 'color: #F15642'
      }
    },

    convertSubmissionDate(date) {
      return date || ''
    },

    getColorBtn(item) {
      if (item.docState === constants.DOC_STATES.COMPLETE) return '#1C49E9'
      if (item.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
        return '#0FAFE4'
      }
      return '#6160DC'
    },

    getTextBtn(item) {
      if (item.docState === constants.DOC_STATES.COMPLETE) return 'proclaim'
      if (item.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
        return 'reviewer'
      }
      return 'signLabel'
    },

    checkShowSigningRemainTime(item) {
      if (item.docState === constants.DOC_STATES.COMPLETE) return false
      if (!item.signingRemainTime) return false
      return true
    },

    onChangePage(page) {
      this.searchForm.page = page
      this.getListDocDashboard()
    },
    // ban hanh
    async showPopupPromulgate(formData) {
      this.dataPromulgate = formData
      this.dataPromulgate.documentId = this.documentIdSign
      if (!formData.documentNumber) {
        return
      }
      try {
        const data = {
          documentId: this.documentIdSign,
          promulgateGroupId: formData.promulgateGroupId,
          registerNumber: formData.documentNumber,
          docType: 1,
          securityTypeId: formData.secureTypeId,
          promulgateDate: formData.promulgateDate
            ? formData.promulgateDate.replaceAll('/', '')
            : null
        }
        const response = await DocumentService.warningPromulgate(data)
        this.contentConfirm = response.data
      } catch (error) {
        this.isShowAlert = true
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      } finally {
        this.showConfirmDialogPromulgate = true
      }
    },
    async acceptProclaim() {
      try {
        await DocumentService.saveDocumentPromulgate(this.dataPromulgate)
        var message = 'document.messageSuccess.promulgateDocument'
        this.setNotify({
          show: true,
          type: 'success',
          content: this.$t(message)
        })
        this.showDialogProclaim = false
        this.closeDialogSign(true)
      } catch (error) {
        this.isShowAlert = true
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.wrap-list-contract {
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 18px;
  margin-bottom: 14px;
  flex-grow: 1;

  @media screen and (max-width: 1440px) {
    margin-top: 15px;
  }

  .title-list-contract {
    font-weight: 800;
    font-size: 26px;
    line-height: 33px;
    text-transform: capitalize;
    color: #22242c;
    margin: 36px 10px 27px 30px;

    @media screen and (max-width: 1440px) {
      font-size: 19px;
      line-height: 24px;
      margin: 18px 10px 13px 30px;
    }
  }

  .text-stt {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #22242c;
  }

  .text-date {
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    color: #8e8ea1;
  }

  .text-data-date {
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    color: #22242c;
  }

  .wrap-text-stt {
    height: 100%;
    padding-top: 10px;
  }

  .text-process {
    font-weight: 600;
    font-size: 14px;
    color: #22242c;

    @media screen and (max-width: 1440px) {
      font-size: 12px;
      line-height: 15px;
    }
  }

  .btn-action {
    width: 147px;
    height: 36px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  }

  .text-btn-action {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    text-transform: uppercase;
    color: #ffffff;
  }
  .text-remaining {
    font-size: 11px;
    line-height: 12px;
    text-transform: none;
    color: #ffffff;
  }

  .maxline2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .fill-blank {
    flex-grow: 1;
  }

  //Css process
  .process-inProcess {
    border: none;
    color: lightblue;
    background: #e7ecf1;
    border-radius: 20px;
    width: 90%;

    @media screen and (max-width: 1440px) {
      height: 10px;
    }
  }

  .process-inProcess::-webkit-progress-bar {
    background: #e7ecf1;
    border-radius: 20px;
  }

  .process-inProcess::-webkit-progress-value {
    background: linear-gradient(154.49deg, #ffd085 6.61%, #ffaf2e 89.72%);
    border-radius: 20px;
  }

  .process-inProcess::-moz-progress-bar {
    background: #0fafe4;
    border-radius: 20px;
  }
}

.header-table {
  th {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    text-transform: uppercase;
    color: #8e8ea1;
  }
}

.height-list-contract {
  height: 450px;

  @media screen and (max-width: 1440px) {
    height: 450px;
  }
}
</style>
