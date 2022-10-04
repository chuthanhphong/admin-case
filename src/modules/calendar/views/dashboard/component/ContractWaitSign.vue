<template>
  <div>
    <v-card class="mt-5 list-document-unread">
      <p class="title-list-contract">{{ $t("managementDoc.dashboards.processingDocument") }}</p>
      <div class="content-list-dashboard">
        <v-scroll-y-transition>
          <v-simple-table
            v-show="contracts.length"
            fixed-header
            class="tb-wait-sign"
          >
            <template v-slot:default>
              <thead class="header-table text--body-5">
                <tr>
                  <th class="text-center" style="width: 5%" />
                  <th
                    class="text-left edoc-text--body-8 text-capitalize"
                    style="width: 75%"
                  >
                    {{ $t("managementDoc.dashboards.nameDocument") }}
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
                          <span>{{ $t("dashboards.receivedDate") }}</span>
                          {{ showDate(item.createdDate) }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    <v-btn
                      color="#0FAFE4"
                      class="btn-action-sign text--button"
                      rounded
                      @click="gotoSign(item)"
                    >
                      <div class="d-flex flex-column py-1 white--text">
                        <span>{{
                          $t("managementDoc.dashboards.readDocument")
                        }}</span>
                      </div>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-scroll-y-transition>
      </div>

      <div v-show="contracts.length == 0" class="col-sm-3 mx-auto">
        <empty-box
          :loading="loading"
          :show-action-create="showActionCreate"
          :subtitle="subtitleEmpty"
          :title-btn-create="titleBtnCreate"
          :link-create="linkCreate"
        />
      </div>
      <v-divider v-if="contracts.length > 0" class="py-2" />
      <div class="px-10 pb-3 pt-0">
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
import pagingData from "@/mixins/paging";
// import constants from '@/constants'
import edocumentRoute from "@/modules/edocument/router/routePaths";
import { DocumentService } from "@/modules/edocument/services/documentService";
import { mapActions } from "vuex";
import EmptyBox from "@/views/components/EmptyBoxDashboard";
import ViewFile from "@/modules/edocument/views/document/management/file/ViewFile";

export default {
  name: "ContractWaitSign",
  components: {
    EmptyBox,
    ViewFile,
  },
  mixins: [pagingData],
  props: {
    showActionCreate: {
      type: Boolean,
      default: true,
    },
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
        page: "",
        pageSize: 5,
      },
      loading: false,
      subtitleEmpty: "messCreateDoc",
      titleBtnCreate: "createPersonalDoc",
      linkCreate: `${edocumentRoute.CREATE_MANAGEMENT_DOC_PATH}`,
    };
  },
  mounted() {},
  created() {
    this.getRelateDocument();
  },
  methods: {
    ...mapActions("contract", ["setGoBack"]),
    showDetail(item) {
      this.$router.push(
        `${edocumentRoute.MANAGEMENT_DOC_DETAIL_PATH.replaceAll(
          ":documentId",
          item.documentId
        )}`
      );
    },
    async getRelateDocument() {
      try {
        this.loading = true;
        const response = await DocumentService.getListDocDashBoard(
          this.searchForm
        );
        const paging = response.data;
        this.contracts = paging.data;
        this.renderPaging(paging);
        if (this.contracts.length > 0) {
          this.$emit("update-show-intro", false);
        } else {
          this.$emit("update-show-intro", true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    onChangePage(page) {
      this.searchForm.page = page;
      this.getRelateDocument();
    },
    gotoSign(item) {
      this.indexOpenFileDoc = 0;
      this.documentId = item.documentId;
      this.showDialogSign = true;
    },
    // Dong dialog ky van ban
    closeDialogSign(isSignDoc) {
      this.showDialogSign = false;
      if (isSignDoc) {
        this.searchForm.page = 1
        this.getRelateDocument();
      }
    },
    showDate(date) {
      return date || "";
    },
  },
};
</script>

<style lang="scss" scoped>
.list-document-unread {
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
  .link-hover {
    &:hover {
      color: #0fafe4;
      cursor: pointer;
    }
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
