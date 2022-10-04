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
          <div class="text-link" @click="goIcreateDetail">
            {{ $t("menubar.econtract.created") }}
            <div class="number">{{ countIcreate }}</div>
          </div>
          <div class="line-row"></div>
          <div class="text-link" @click="goIreceiveDetail">
            {{ $t("menubar.econtract.receive") }}
            <div class="number">{{ countIreceive }}</div>
          </div>
          <div v-show="countExpire != undefined" class="line-row"></div>
          <div v-show="countExpire != undefined" class="text-link" @click="goExpireDetail">
            {{ $t("gloabal-dashboard.label.expire") }}
            <div class="number">{{ countExpire }}</div>
          </div>
        </div>
        <div class="line"></div>
        <content-base
          v-if="contracts.length"
          :code="$t(`gloabal-dashboard.QLVB.code`)"
          :title="`${$t(`gloabal-dashboard.QLVB.sup`)} (${totalElements})`"
          :items="contracts"
          @onRead="onClickReadItem"
          @onDetail="onGoDetail"
        />
        <empty-box v-else class="empty-box" subtitle="empty.document" />
      </div>
    </div>
    <view-file
      :show-dialog="showDialogSign"
      :document-id="documentId"
      :index-open-file-doc="indexOpenFileDoc"
      @close-dialog="closeDialogSign"
    />
  </div>
</template>

<script>
import { DocumentService } from "@/modules/edocument/services/documentService";
import ContentBase from "@/views/components/ContentBase.vue";
import constants from "@/constants";
import edocumentRoute from "@/modules/edocument/router/routePaths";
import EmptyBox from "@/views/components/EmptyBox";
import ViewFile from "@/modules/edocument/views/document/management/file/ViewFile";

export default {
  components: {
    ContentBase,
    EmptyBox,
    ViewFile,
  },

  data() {
    return {
      showDialogSign: false,
      documentId: null,
      indexOpenFileDoc: null,

      countIcreate: 0,
      countIreceive: 0,
      totalElements: 0,
      countExpire: undefined,

      contracts: [],
      loading: true,
      searchForm: {
        pageSize: 10,
      },
    };
  },

  created() {
    this.getCountDocument();
    this.getListDocDashboard();
  },

  methods: {
    closeDialogSign() {
      this.showDialogSign = false;
      this.getListDocDashboard();
    },

    async onClickReadItem(id) {
      try {
        // await DocumentService.updateReadDoc(id);
        this.indexOpenFileDoc = 0;
        this.documentId = id;
        this.showDialogSign = true;
      } catch (error) {
        console.log(error);
      }
    },

    onGoDetail(id) {
      this.$router.push(
        `${edocumentRoute.MANAGEMENT_DOC_DETAIL_PATH.replaceAll(
          ":documentId",
          id
        )}`
      );
    },

    goIcreateDetail() {
      this.$router.push(
        `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}?searchCriteria=${constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_CREATE}`
      );
    },

    goExpireDetail() {
      this.$router.push(
        `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}?searchCriteria=${constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_EXPIRE}`
      );
    },

    goIreceiveDetail() {
      this.$router.push(
        `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}?searchCriteria=${constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_RECEIVE}`
      );
    },

    async getCountDocument() {
      try {
        const res = await DocumentService.getCountDashBoard();
        res &&
          res.data.forEach((it) => {
            if (it.key === constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_CREATE) {
              this.countIcreate = it.value;
            }
            if (it.key === constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_RECEIVE) {
              this.countIreceive = it.value;
            }
            if (it.key === constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_EXPIRE) {
              this.countExpire = it.value;
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
