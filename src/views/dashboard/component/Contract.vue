<template>
  <div>
    <v-card v-if="loading" color="white" light outlined>
      <v-card-text class="text-center py-5">
        <v-avatar size="40" color="primary">
          <img src="@/assets/icons/hourglass.svg" alt="" />
        </v-avatar>
        <div class="primary--text text-center text--body-1 py-1">
          {{ $t("processing") }}
        </div>
        <v-progress-linear
          stream
          buffer-value="0"
          color="primary"
          class="mb-0"
        />
      </v-card-text>
    </v-card>
    <div v-else>
      <div>
        <div class="static">
          <div class="text-link" @click="goProgressDetail">
            {{ $t(`gloabal-dashboard.label.in_progress`) }}
            <div class="number">{{ countInprogress || 0 }}</div>
          </div>
          <div class="refuse text-link" @click="goRejectDetail">
            {{ $t("gloabal-dashboard.label.in_reject") }}
            <div class="number">{{ countRejected || 0 }}</div>
          </div>
          <div class="text-link" @click="goCompleteDetail">
            {{ $t("gloabal-dashboard.label.in_complete") }}
            <div class="number">{{ countComplete || 0 }}</div>
          </div>
        </div>
        <div class="line"></div>
        <content-base
          v-if="contracts.length"
          :code="$t(`gloabal-dashboard.HDDT.code`)"
          :title="`${$t(`gloabal-dashboard.HDDT.sup`)} (${totalElements})`"
          :items="contracts"
          @onDetailContract="goDetail"
        />
        <empty-box v-else class="empty-box" />
      </div>
    </div>
    <dialog-contract-detail
      :show-dialog="showContractDetail"
      :show-cancel-process="false"
      :contract-id="contractId"
      @close-dialog="showContractDetail = false"
    />
  </div>
</template>

<script>
import { ContractService } from "@/modules/econtract/services/contractService";
import ContentBase from "@/views/components/ContentBase.vue";
import constants from "@/constants";
import contract from "@/mixins/contracts";
import econtractRoute from "@/modules/econtract/router/routePaths";
import EmptyBox from "@/views/components/EmptyBox";
import DialogContractDetail from "@/modules/econtract/views/eContract/contract/list/components/DialogContractDetail";

export default {
  components: {
    ContentBase,
    EmptyBox,
    DialogContractDetail,
  },

  mixins: [contract],
  data() {
    return {
      showContractDetail: false,
      contractId: undefined,
      countInprogress: 0,
      countRejected: 0,
      countComplete: 0,
      totalElements: 0,
      contracts: [],
      loading: true,
      searchForm: {
        page: 1,
        pageSize: 10,
      },
    };
  },

  created() {
    this.getCountContract();
    this.getRelateDocument();
  },

  methods: {
    goDetail(id) {
      this.contractId = `${id}`;
      this.showContractDetail = true;
    },

    goProgressDetail() {
      this.$router.push(
        `${econtractRoute.LIST_CONTRACT_PROCESS_PATH}?docState=${constants.DOC_STATES.IN_PROGRESS}`
      );
    },

    goRejectDetail() {
      this.$router.push(
        `${econtractRoute.LIST_CONTRACT_PROCESS_PATH}?docState=${constants.DOC_STATES.REJECT}`
      );
    },

    goCompleteDetail() {
      this.$router.push(
        `${econtractRoute.LIST_CONTRACT_PROCESS_PATH}?docState=${constants.DOC_STATES.COMPLETE}`
      );
    },

    async getCountContract() {
      try {
        const response = await ContractService.getCount();
        response &&
          response.data.forEach((it) => {
            if (it.docState === constants.DOC_STATES.IN_PROGRESS) {
              this.countInprogress = it.count;
            }
            if (it.docState === constants.DOC_STATES.REJECTED) {
              this.countRejected = it.count;
            }
            if (it.docState === constants.DOC_STATES.COMPLETE) {
              this.countComplete = it.count;
            }
          });
      } catch (error) {
        console.log(error);
      }
    },

    async getRelateDocument() {
      try {
        const res = await ContractService.getRelateDocument(this.searchForm);
        this.totalElements = res.data.totalElements;
        this.contracts = this.setProcess(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.line {
  height: 2px;
  background: #dfe0eb;
  margin-top: 18px;
}
::v-deep(.empty-box) {
  margin-top: 10px;
  max-height: 300px;

  & .v-image {
    margin: 0 auto;
    max-width: 85% !important;
  }
}
.text-link {
  width: 100%;
  text-align: center;

  &:hover {
    color: #0fafe4 !important;

    & div {
      color: #0fafe4 !important;
    }
  }
}
</style>
