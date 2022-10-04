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
            {{ $t("gloabal-dashboard.label.in_progress") }}
            <div class="number">{{ countInprogress }}</div>
          </div>
          <div
            class="refuse text-link"
            style="padding: 0px 20px 0px 20px"
            @click="goRejectDetail"
          >
            {{ $t("gloabal-dashboard.label.in_reject") }}
            <div class="number">{{ countRejected }}</div>
          </div>
          <div
            class="text-link"
            style="
              padding: 0px 20px 0px 10px;
              border-right: 1px solid rgba(15, 18, 63, 0.44);
            "
            @click="goCompleteDetail"
          >
            {{ $t("gloabal-dashboard.label.in_complete") }}
            <div class="number">{{ countComplete }}</div>
          </div>
          <div class="text-link" @click="goPromulgateDetail">
            {{ $t("gloabal-dashboard.label.in_promulgate") }}
            <div class="number">{{ countPromulgate }}</div>
          </div>
        </div>
        <div class="line"></div>
        <content-base
          v-if="contracts.length"
          :code="$t(`gloabal-dashboard.KDT.code`)"
          :title="`${$t(`gloabal-dashboard.KDT.sup`)} (${totalElements})`"
          :items="contracts"
          @onDetailSig="goDetail"
        />
        <empty-box v-else class="empty-box" subtitle="empty.document" />
      </div>
    </div>
  </div>
</template>

<script>
import { DocumentService } from "@/modules/esignature/services/documentService";
import ContentBase from "@/views/components/ContentBase.vue";
import constants from "@/constants";
import routeEsignature from "@/modules/esignature/router/routePaths";
import EmptyBox from "@/views/components/EmptyBox";

export default {
  components: {
    ContentBase,
    EmptyBox,
  },

  data() {
    return {
      countInprogress: 0,
      countRejected: 0,
      countComplete: 0,
      countPromulgate: 0,
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
    this.countDocByState();
    this.getListDocDashboard();
  },

  methods: {
    goDetail(documentId) {
      this.$router.push(
        routeEsignature.DOCUMENT_DETAIL_PATH.replaceAll(
          ":documentId",
          documentId
        )
      );
    },

    goProgressDetail() {
      this.$router.push(
        `${routeEsignature.DOCUMENT_LIST_PROCESS_PATH}?docState=${constants.DOC_STATES.IN_PROGRESS}`
      );
    },

    goRejectDetail() {
      this.$router.push(
        `${routeEsignature.DOCUMENT_LIST_PROCESS_PATH}?docState=${constants.DOC_STATES.REJECT}`
      );
    },

    goCompleteDetail() {
      this.$router.push(
        `${routeEsignature.DOCUMENT_LIST_PROCESS_PATH}?docState=${constants.DOC_STATES.COMPLETE}`
      );
    },

    goPromulgateDetail() {
      this.$router.push(
        `${routeEsignature.DOCUMENT_LIST_PROCESS_PATH}?docState=${constants.DOC_STATES.PROMULGATE}`
      );
    },

    async countDocByState() {
      try {
        const res = await DocumentService.getCountDocByState();
        res &&
          res.data.forEach((it) => {
            if (it.key === constants.DOC_STATES.IN_PROGRESS) {
              this.countInprogress = it.value;
            }
            if (it.key === constants.DOC_STATES.REJECTED) {
              this.countRejected = it.value;
            }
            if (it.key === constants.DOC_STATES.COMPLETE) {
              this.countComplete = it.value;
            }
            if (it.key === constants.DOC_STATES.PROMULGATE) {
              this.countPromulgate = it.value;
            }
          });
      } catch (error) {
        console.log(error);
      }
    },

    async getListDocDashboard() {
      try {
        const res = await DocumentService.getListDocDashBoard(this.searchForm);
        this.totalElements = res.data.totalElements;
        this.contracts = res.data.data;
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
