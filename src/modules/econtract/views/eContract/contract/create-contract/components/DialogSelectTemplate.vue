<template>
  <v-dialog v-model="showDialog" persistent width="80%">
    <v-card class="px-4">
      <v-card-title class="d-flex justify-center">
        <h4 class="text-center font--bold">
          {{ $t("contract.selectTemplateContract") }}
        </h4>
        <v-icon class="close-dialog" @click="cancelSelectFlow">
          mdi-close
        </v-icon>
      </v-card-title>
      <div class="wrap-template">
        <div class="header-template d-flex justify-space-between">
          <!-- Loai hop dong -->
          <div class="form-group">
            <label class="text--body-1">
              {{ $t("contract.label.contractType") }}
            </label>
            <v-select
              v-model="formData.documentFormulaId"
              dense
              :placeholder="$t('contract.typeLabel')"
              outlined
              :menu-props="{
                bottom: true,
                offsetY: true,
                maxHeight: 220,
              }"
              class="text--body-1"
              hide-details
              :items="lstContractType"
              item-text="name"
              item-value="id"
              @change="search"
            >
              <template v-slot:append>
                <v-icon>mdi-chevron-down</v-icon>
              </template>
            </v-select>
          </div>

          <!-- Ten hop dong -->
          <div class="form-group">
            <label class="text--body-1">
              {{ $t("contract.label.contractName") }}
            </label>
            <v-text-field
              id="txt-search"
              v-model="formData.keyword"
              :placeholder="$t('contract.label.contractName')"
              outlined
              class="text--body-1"
              dense
              clearable
              hide-details
              name="txtSearch"
              @change="search"
            >
              <vue-feather slot="append" class="grey--text" type="search" />
            </v-text-field>
          </div>

          <!-- Pham vi su dung -->
          <div class="form-group">
            <label class="text--body-1">
              {{ $t("contract.label.scopeUse") }}
            </label>
            <v-autocomplete
              v-model="formData.groupDocScopeIds"
              class="flow-scope text--body-1"
              outlined
              :no-data-text="$t('users.itemGroupName')"
              hide-selected
              hide-details
              maxlength="255"
              floating
              attach
              solo
              dense
              elevation="0"
              :menu-props="{
                bottom: true,
                offsetY: true,
                maxHeight: 220,
              }"
              :placeholder="$t('contract.label.selectScope')"
              :label="$t('contract.label.selectScope')"
              :items="scopes"
              item-text="groupName"
              item-value="groupId"
              chips
              deletable-chips
              multiple
              @change="search"
            >
              <vue-feather slot="append" class="grey--text" type="search" />
              <template v-slot:item="data">
                <div class="select-item flex-column d-flex">
                  <div class="title-item">{{ data.item.groupName }}</div>
                  <div class="desc-item">{{ data.item.groupPathName }}</div>
                </div>
              </template>
            </v-autocomplete>
          </div>
        </div>
        <div v-if="listTemplate.length == 0" class="col-md-5 col-12 mx-auto">
          <empty-box :show-subtitle="false" :loading="loading" />
        </div>
        <v-radio-group v-else v-model="flow">
          <div class="content-template">
            <v-simple-table dense fixed-header>
              <template v-slot:default>
                <thead class="text--body-5">
                  <tr>
                    <th class="text-right stt">Stt</th>
                    <th class="text-left contract-name">
                      {{ $t("contract.label.contractName") }}
                    </th>
                    <th class="text-left contract-name">
                      {{ $t("contract.label.contractType") }}
                    </th>
                    <th class="text-left contract-name">
                      {{ $t("contract.label.scopeUse") }}
                    </th>
                    <th class="text-left contract-name">
                      {{ $t("contract.label.signUserType.creator") }}
                    </th>

                    <th class="text-left action">
                      {{ $t("contract.label.fileSign") }}
                    </th>
                  </tr>
                </thead>
                <tbody class="text--body-5">
                  <div v-if="listTemplate.length == 0">
                    <div class="no-data-table text-center">
                      {{ $t("noData") }}
                    </div>
                  </div>
                  <tr
                    v-for="(item, index) in listTemplate"
                    v-else
                    :key="index"
                    @click="selectRow(item.documentId)"
                  >
                    <td class="text-center">
                      <v-radio
                        class="radio-select-template"
                        :label="`${index + 1}`"
                        :value="item.documentId"
                        color="black"
                      />
                      <!-- <div class="my-2">{{ index + 1 }}</div> -->
                    </td>
                    <td class="text-left link-hover">
                      <div class="btn">
                        <v-tooltip top content-class="tooltip-top">
                          <template v-slot:activator="{ on, attrs }">
                            <div
                              v-bind="attrs"
                              class="maxline2 mw-300"
                              v-on="on"
                            >
                              {{ item.title }}
                            </div>
                          </template>
                          {{ item.title }}
                        </v-tooltip>
                      </div>
                    </td>
                    <td class="text-left">
                      {{ item.formulaName }}
                    </td>
                    <td class="text-left">
                      <div v-html="renderScopes(item.groupDocumentScope)" />
                    </td>
                    <td class="text-left">
                      <span v-if="item.creator">
                        {{ item.creator.fullName }}
                      </span>
                    </td>
                    <td class="text-left">
                      <v-tooltip left content-class="tooltip-left">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="gotoSign(item.documentId)"
                          >
                            <img src="@/assets/icons/pdf.svg" />
                          </v-btn>
                        </template>
                        <span>{{ item.signFile.fileName }}</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-radio-group>
      </div>
      <v-divider v-if="listTemplate.length != 0" />
      <v-card-actions
        v-if="listTemplate.length != 0"
        class="d-flex justify-end py-6 px-0"
      >
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-240 py-5 mr-10 text--button"
          @click="cancelSelectFlow"
        >
          {{ $t("cancelLabel") }}
        </v-btn>

        <v-btn
          :disabled="!flow"
          rounded
          color="primary"
          class="w-240 py-5 text--button"
          @click="accept"
        >
          {{ $t("selectLabel") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GroupService } from "@/services/groupService";
import { ContractService } from "@/modules/econtract/services/contractService";
import renderUtils from "@/mixins/renderUtils";
import EmptyBox from "@/views/components/EmptyBox";
import econtractRoute from "@/modules/econtract/router/routePaths";
export default {
  components: {
    EmptyBox,
  },
  mixins: [renderUtils],
  props: {
    showDialog: { type: Boolean, default: false },
    lstContractType: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      listTemplate: [],
      flow: null,
      contractType: null,
      selectedGroup: [],
      scopes: [],
      selectContractType: { code: "ALL" },
      formData: {
        page: 1,
        pageSize: 1000,
        keyword: "",
        documentFormulaId: "",
        groupDocScopeIds: "",
      },
      loading: false,
    };
  },
  async created() {
    this.getScopes();
    this.search();
  },
  methods: {
    selectRow(id) {
      this.flow = id;
    },
    accept() {
      this.$emit("accept", this.flow);
      this.closeDialog();
    },
    closeDialog() {
      this.flow = null;
      this.$emit("close-dialog");
    },
    cancelSelectFlow() {
      this.$emit("cancel-select-flow");
      this.closeDialog();
    },
    async getScopes() {
      try {
        const response = await GroupService.getFlowGroup();
        this.scopes = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async search() {
      try {
        this.loading = true;
        const response = await ContractService.searchFlow(this.formData);
        const dataResponse = response.data;
        this.listTemplate = dataResponse.data;
      } catch (error) {
        this.isShowAlert = true;
        this.messages = error;
      } finally {
        this.loading = false;
      }
    },
    gotoSign(contractId) {
      this.$router.push(
        `${econtractRoute.SIGN_CONTRACT_PATH.replaceAll(
          ":contractId",
          contractId
        )}`
      );
    },
  },
};
</script>

<style lang="scss">
.flow-scope {
  label {
    text-transform: none;
    color: #8e8ea1 !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    @media (max-width: 1336px) {
      font-weight: 600 !important;
      font-size: 14px !important;
    }
  }
}

.wrap-template {
  .form-group {
    width: 100%;
    label {
      font-size: 12px;
    }
    .v-input {
      width: 90%;
      @media (max-width: 1336px) {
        width: 95%;
      }
    }
  }
  .content-template {
    margin: 15px 0;
    height: 400px;
    .v-data-table > .v-data-table__wrapper {
      max-height: 400px;
      min-height: unset;
    }
  }
  .radio-select-template {
    .v-input--selection-controls__input {
      transform: scale(0.7);
    }
  }
}

.v-select__selections {
  .v-chip--select {
    margin: 4px !important;
  }
}
</style>
