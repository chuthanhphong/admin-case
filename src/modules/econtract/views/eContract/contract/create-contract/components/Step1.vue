<template>
  <div>
    <div class="wrap-content-contract pt-4 mh-60">
      <validation-observer ref="observerStep1">
        <div class="d-flex justify-space-around py-5 wrap-types">
          <div
            class="item-contract-type text-center"
            :class="{ active: type === 'NEW' }"
            @click="createContractNew('NEW')"
          >
            <v-card
              rounded="lg"
              class="py-5 px-1 contract-type-content"
              outlined
            >
              <span class="wrap-icon-type">
                <i class="icon-plus icon-type" />
              </span>
              <div class="text-uppercase my-5 contract-type">
                {{ $t("contract.new") }}
              </div>
              <hr />
              <div class="contract-desc text--body font--semi-bold">
                {{ $t("contract.notInForm") }}
              </div>
            </v-card>
          </div>
          <div
            class="item-contract-type text-center"
            :class="{ active: type === 'TEMPLATE' }"
            @click="createContractTemplate('TEMPLATE')"
          >
            <v-card
              rounded="lg"
              class="py-5 px-1 contract-type-content"
              outlined
            >
              <span class="wrap-icon-type">
                <i class="icon-clipboard icon-type" />
              </span>

              <div class="text-uppercase my-5 contract-type">
                {{ $t("contract.byTemplate") }}
              </div>
              <hr />
              <div class="contract-desc text--body font--semi-bold">
                {{ $t("contract.inForm") }}
              </div>
            </v-card>
          </div>
        </div>
        <div v-if="type">
          <hr />
          <!-- Loai hop dong -->
          <div class="col-12 row justify-space-around py-0">
            <div class="form-group col-12 col-sm-6 col-md-4">
              <div class="col-12">
                <label class="text--body-1">
                  {{ $t("contract.typeLabel") }}
                  <span class="color-require">*</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  name="contractType"
                  rules="required"
                >
                  <v-select
                    v-model="contractType"
                    dense
                    attach
                    :placeholder="$t('contract.typeLabel')"
                    outlined
                    :error-messages="errors"
                    required
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                    }"
                    :items="lstContractType"
                    item-text="name"
                    item-value="id"
                    class="text--body"
                  >
                    <template v-slot:append>
                      <v-icon>mdi-chevron-down</v-icon>
                    </template>
                  </v-select>
                </validation-provider>
              </div>
            </div>
            <div class="form-group col-12 col-sm-6 col-md-4">
              <div class="col-12">
                <label
                  class="text--body-1"
                >{{ $t("contract.nameLabel") }}
                  <span class="color-require">*</span></label>
                <validation-provider
                  v-slot="{ errors }"
                  name="contractName"
                  rules="required|max:500"
                >
                  <v-text-field
                    v-model="contractName"
                    dense
                    maxlength="500"
                    counter="500"
                    flat
                    solo
                    :placeholder="$t('contract.nameLabel')"
                    outlined
                    :error-messages="errors"
                    required
                    class="text--body"
                    @change="contractName = trimSpace(contractName)"
                  />
                </validation-provider>
              </div>
            </div>
          </div>
          <hr />
          <!-- Hop dong ky ket-->

          <div class="col-12 row justify-space-around py-0">
            <div class="form-group col-12 col-sm-6 col-md-4">
              <div class="col-12">
                <label
                  class="text--body-1"
                >{{ $t("contract.signed") }}
                  <span class="color-require">*</span></label>
                <div class="d-flex justify-space-between align-center">
                  <validation-provider
                    ref="contractSignedProvider"
                    name="contractSigned"
                    :rules="ruleFileContract"
                  >
                    <v-file-input
                      id="fileContract"
                      ref="fileContract"
                      v-model="fileContract"
                      :style="fileStyle"
                      accept="application/pdf"
                      show-size
                      :loading="uploadingFile"
                      truncate-length="25"
                      class="no-border pa-0 mr-2 input-file text--caption-1"
                      prepend-icon="icon-pdf"
                      hide-details
                      :clearable="!uploadingFile"
                      @change="uploadContractSigned"
                    />
                  </validation-provider>
                  <span
                    v-if="showDownLoadIcon && fileContract"
                    class="btn"
                    @click="downloadFileContract"
                  ><v-icon>mdi-tray-arrow-down</v-icon></span>

                  <v-btn
                    outlined
                    :loading="uploadingFile"
                    :disabled="uploadingFile"
                    class="btn-upload ml-auto"
                    @click="uploadContract"
                  >
                    <v-icon size="30">mdi-upload</v-icon>
                  </v-btn>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text--body-1">
                      {{ $t("contract.format") }}: pdf
                    </div>
                    <div class="text-danger text--body-2">
                      ({{ $t("contract.fileMax") }} 50MB)
                    </div>
                  </div>
                  <!-- <v-btn color="primary" text class="pa-0">
                    <span
                      class="text-decoration-underline text-capitalize text--body-1"
                    >{{ $t('contract.sample') }}</span>
                  </v-btn> -->
                </div>
              </div>
            </div>
            <!-- tai file dinh kem -->
            <div class="form-group col-12 col-sm-6 col-md-4">
              <div class="col-12">
                <label class="text--body-1">{{
                  $t("contract.attachments")
                }}</label>
                <div class="d-flex justify-space-between align-start">
                  <validation-provider
                    ref="providerFileAttachs"
                    :rules="ruleFileAttachs"
                    name="fileAttachs"
                  >
                    <input
                      id="fileAttachsInput"
                      ref="fileAttachsInput"
                      type="file"
                      multiple
                      hidden
                      accept=".xlsx,.xls,.doc,.docx,.pdf"
                      @change="selectAttachs"
                    />
                    <ul class="list-files text--caption">
                      <li v-for="(file, index) in nameFileAttachs" :key="index">
                        <img
                          :src="getIconFile(`${file.fileName}`)"
                          class="mr-2"
                        />
                        <span>{{ customFileName(file) }}</span>
                        <span
                          class="remove-attach"
                          @click="removeFileAttach(index)"
                        ><v-icon>mdi-close</v-icon></span>
                        <span
                          v-if="showDownLoadIcon"
                          class="download-attach ml-2"
                          @click="downloadFileAttach(index)"
                        ><v-icon>mdi-tray-arrow-down</v-icon></span>
                      </li>
                    </ul>
                  </validation-provider>
                  <v-btn
                    outlined
                    class="btn-upload ml-auto"
                    :loading="uploadingFileAttatch"
                    :disabled="uploadingFileAttatch"
                    @click="uploadAttachs"
                  >
                    <v-icon size="30">mdi-upload</v-icon>
                  </v-btn>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text--body-1">
                      {{ $t("contract.format") }}: doc, docx, xlsx, pdf
                    </div>
                    <div class="text-danger text--body-2">
                      ({{ $t("contract.fileMax") }} 50MB)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </validation-observer>
    </div>
    <div v-if="type">
      <div class="d-flex justify-end group-action-step">
        <v-btn
          class="my-2 w-150 py-5 mr-10 text--button"
          color="#0FAFE4"
          outlined
          rounded
          @click="showDialogCancel"
        >
          <span class="text-primary"> {{ $t("cancelLabel") }}</span>
        </v-btn>

        <v-btn
          class="my-2 w-150 py-5 text--button"
          :disabled="!completed"
          rounded
          color="primary"
          @click="nextStep"
        >
          {{ $t("contract.continue") }}
        </v-btn>
      </div>
    </div>
    <dialog-select-template
      :lst-contract-type="lstContractType"
      :show-dialog="showDialogSelectTemplate"
      @close-dialog="showDialogSelectTemplate = false"
      @accept="acceptContractFromTemplate"
      @cancel-select-flow="cancelSelectFlow"
    />
  </div>
</template>

<script>
import _ from "lodash";
import { mapActions, mapState } from "vuex";
import rules from "@/mixins/rules";
import { formatFileSize } from "@/helpers/utils";
import { FileService } from "@/modules/econtract/services/fileService";
import { ContractService } from "@/modules/econtract/services/contractService";
import constants from "@/constants";
import DialogSelectTemplate from "./DialogSelectTemplate";
import fileMixin from "@/modules/econtract/mixins/fileMixin";

export default {
  name: "Step1",
  components: {
    DialogSelectTemplate,
  },
  mixins: [rules, fileMixin],
  data() {
    return {
      // Flag upload file
      uploadingFile: false,
      uploadingFileAttatch: false,
      fileContract: null,
      tmpFileContract: null,
      fileAttachs: [],
      nameFileAttachs: [],
      type: null,
      contractType: null,
      contractName: null,
      completed: false,
      lstContractType: [],
      // Nguoi xem xet
      activePanel: [0],
      // Tao moi hop dong
      showDialogSelectTemplate: false,
    };
  },
  computed: {
    fileStyle() {
      return {
        opacity: this.fileContract != null ? 1 : 0,
      };
    },
    fileAttachStyle() {
      return { opacity: this.fileAttachs.length > 0 ? 1 : 0 };
    },
    ...mapState("contract", ["fileContractUploaded", "fileAttachsUploaded"]),
    // Hien thi icon download
    showDownLoadIcon() {
      return this.type === "TEMPLATE";
    },
  },
  watch: {
    contractType() {
      this.isValidStep();
      const type = this.lstContractType.find((t) => t.id === this.contractType);
      this.setContractType(type);
    },
    contractName() {
      this.isValidStep();
      this.setContractName(this.contractName);
    },
    fileContract() {
      this.isValidStep();
    },
    uploadingFile() {
      this.isValidStep();
    },
  },
  created() {
    this.setFileAttachs(null);
    this.searchGroup();
  },
  methods: {
    ...mapActions("contract", [
      "setFileContract",
      "setFileAttachs",
      "setContractName",
      "setContractType",
      "setContractDetail",
      "setCheckGroupSelected",
      "setListSigner",
      "resetDataState",
    ]),
    ...mapActions("layout", ["setNotify"]),
    trimSpace(val) {
      const value = val ? val.trim() : "";
      return value;
    },
    // Huy chon luong mau
    cancelSelectFlow() {
      // this.createContractFrom('NEW')
    },
    // Tao hop dong tu
    createContractTemplate(type) {
      this.showDialogSelectTemplate = true;

      this.setCheckGroupSelected(true);
    },

    createContractNew(type) {
      if (this.type !== type) {
        this.fileContract = null;
        this.fileAttachs = [];
        this.nameFileAttachs = [];
        this.contractType = null;
        this.contractName = null;
        this.resetDataState();
      }

      this.type = type;
      this.setCheckGroupSelected(true);
    },

    // Xac nhan chon hop dong tu mau
    acceptContractFromTemplate(contractId) {
      this.showDialogSelectTemplate = false;
      // Lay thong tin chi tiet luong mau
      this.initDataContractFromFlow(contractId);
      this.type = "TEMPLATE";
      // Lay thong tin file ky
    },
    async initDataContractFromFlow(contractId) {
      try {
        const { data } = await ContractService.getDetailContract(contractId);
        this.fileContract = null;
        this.fileAttachs = [];
        this.nameFileAttachs = [];
        this.contractType = null;
        this.contractName = null;
        this.resetDataState();

        this.setContractDetail(data);
        this.contractName = data.title;
        this.setContractName(this.contractName);
        this.initContractType(data);
        this.initFileMainSign(data);
        this.initFileAttachs(data);
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: error.message,
        });
      }
    },
    initContractType(data) {
      const type = this.lstContractType.find(
        (t) => t.id === data.documentFormulaId
      );
      if (type) this.contractType = type.id;
      this.setContractType(type);
    },
    async initFileMainSign(data) {
      await this.setFileContract(data.fileMainSign);
      fetch(this.fileContractUploaded.url)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], this.fileContractUploaded.fileName, {
            type: "application/pdf",
          });
          this.fileContract = file;
        });
    },
    async initFileAttachs(data) {
      if (data.fileAttachments) {
        data.fileAttachments.map((file) => {
          file.name = file.fileName;
          file.size = file.fileSize;
        });
        this.setFileAttachs(data.fileAttachments);
        this.nameFileAttachs = data.fileAttachments;
      }
    },
    async searchGroup() {
      try {
        const response = await ContractService.getList();
        this.lstContractType = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    // Validate step
    isValidStep() {
      this.completed =
        !this.uploadingFile &&
        !_.isNull(this.contractType) &&
        !_.isEmpty(this.contractName) &&
        !_.isNull(this.fileContract);
    },
    // Upload file hop dong
    uploadContract() {
      document.getElementById("fileContract").click();
    },
    // Upload file dinh kem
    uploadAttachs() {
      document.getElementById("fileAttachsInput").click();
    },
    // Chuyen step 2
    nextStep() {
      this.$emit("next-step", 2);
    },
    // Chon file dinh kem
    async selectAttachs() {
      try {
        this.fileAttachs = [
          // ...this.fileAttachs,
          ...this.$refs.fileAttachsInput.files,
        ];
        // bien chua index de xoa
        const listIndexRemove = [];
        // lap de tim cac ten file trung nhau
        this.nameFileAttachs.map((file, index) => {
          let count = 0;
          this.fileAttachs.map((fileAttach) => {
            if (file.name === fileAttach.name) {
              count++;
            }
          });
          if (count > 1) {
            listIndexRemove.push(index);
          }
        });
        // xoa file cu khi bi trung ten file
        if (listIndexRemove.length > 0) {
          listIndexRemove.map((index) => {
            this.removeFileAttach(index);
          });
        }
        // validate file
        // const tmpfileAttachs = _.uniqBy(this.fileAttachs, file => file.name)
        const lstFileValidate = this.fileAttachs.filter((file) => file.name);
        const { valid } = await this.$refs.providerFileAttachs.validate(
          lstFileValidate
        );

        if (!valid) {
          if (this.fileAttachs) {
            this.fileAttachs = this.nameFileAttachs;
          } else {
            // neu xoa thi dat gia tri ve null
            this.fileAttachs = [];
            this.nameFileAttachs = [];
          }
          this.$refs.fileAttachsInput.type = "text";
          this.$refs.fileAttachsInput.type = "file";

          const message = this.$refs.providerFileAttachs.errors[0];
          const typeAlert = "warning";
          this.$emit("show-alert", { message, typeAlert });
          return;
        } else {
          await this.uploadFileAttachs();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // Hien thi ten file
    customFileName(file) {
      // const fileName = file.name
      // const size = file.size / 1000
      // const fileSize = formatFileSize({ size })

      const fileName = file.name || file.fileName;
      const fileSizeInput = file.size || file.fileSize;
      const size = fileSizeInput / 1000;
      const fileSize = formatFileSize({ size });

      var names = fileName.split(".");
      const extFile = names[names.length - 1];
      var name = names.splice(0, names.length - 1).join("");
      if (name.length > 25) {
        name = `${name.slice(0, 12)}...${name.slice(
          15,
          25
        )}.${extFile} (${fileSize})`;
      } else {
        name += `.${extFile} (${fileSize})`;
      }
      return name;
    },
    // Xoa tai lieu dinh kem
    removeFileAttach(index) {
      var fileBuffer = new DataTransfer();
      document.getElementById("fileAttachsInput").files = fileBuffer.files;
      this.fileAttachs.splice(index, 1);
      var fileAttachsUpload = this.fileAttachsUploaded;
      fileAttachsUpload.splice(index, 1);
      this.setFileAttachs(fileAttachsUpload);
    },
    // upload file hop dong
    async uploadContractSigned() {
      try {
        this.uploadingFile = true;
        const { valid } = await this.$refs.contractSignedProvider.validate(
          this.fileContract
        );
        if (!valid) {
          const message = this.$refs.contractSignedProvider.errors[0];
          const typeAlert = "warning";
          this.$emit("show-alert", { message, typeAlert });
          // check xoa file
          if (this.fileContract || this.fileContract === undefined) {
            this.fileContract = this.tmpFileContract;
          } else {
            // neu xoa thi dat gia tri ve null
            this.fileContract = null;
            this.tmpFileContract = null;
          }
          return;
        }

        this.tmpFileContract = this.fileContract;
        // Upload file
        var formData = new FormData();
        formData.append("file", this.fileContract);
        formData.append("fileType", constants.FILE_TYPES.FILE_MAIN);
        const response = await FileService.upload(formData, false);

        if (response.success) {
          await this.setFileContract(response.data);
        }
      } catch (error) {
        this.fileContract = null;
        this.tmpFileContract = null;
        this.setNotify({
          show: true,
          type: "error",
          content: error.message,
        });
      } finally {
        this.uploadingFile = false;
      }
    },

    async uploadFileAttachs() {
      if (this.fileAttachs.length === 0) {
        return;
      }
      try {
        this.uploadingFileAttatch = true;
        var formData = new FormData();
        this.fileAttachs.map((file) => {
          if (file.name) {
            formData.append("files", file);
          }
        });
        formData.append("fileType", constants.FILE_TYPES.FILE_EXTRA);
        const response = await FileService.upload(formData, true);

        if (response.success) {
          // this.nameFileAttachs = this.fileAttachs
          // this.setFileAttachs(response.data)
          const { data } = response;
          const lstFileName = this.nameFileAttachs.map(
            (file) => file.fileName || file.name
          );
          data.forEach((file) => {
            if (!lstFileName.includes(file.fileName)) {
              this.nameFileAttachs.push(file);
            } else {
              const index = this.nameFileAttachs.findIndex(
                (x) => x.fileName === file.fileName
              );
              this.nameFileAttachs[index] = file;
            }
          });
          this.setFileAttachs(this.nameFileAttachs);
        }
      } catch (error) {
        // var numFileError = this.$refs.fileAttachsInput.files.length
        // this.fileAttachs.splice(
        //   this.fileAttachs.length - numFileError,
        //   numFileError
        // )
        this.fileAttachs = this.fileAttachs.filter((file) => file.fileName);
        var fileBuffer = new DataTransfer();
        document.getElementById("fileAttachsInput").files = fileBuffer.files;

        this.setNotify({
          show: true,
          type: "error",
          content: error.message,
        });
      } finally {
        this.uploadingFileAttatch = false;
      }
    },

    // Hien thi dialog huy
    showDialogCancel() {
      this.$emit("show-cancel");
    },
    // Tai file ky chinh
    downloadFileContract() {
      this.downloadFile(
        this.fileContractUploaded.url,
        this.fileContractUploaded.fileName
      );
    },
    // Tai file dinh kem
    async downloadFileAttach(index) {
      const attach = this.nameFileAttachs[index];
      const file = await FileService.download({
        filePath: attach.filePath,
        storage: attach.storage,
        fileName: attach.fileName,
      });
      this.downloadFile(file, attach.fileName);
    },
    // Tai file
    downloadFile(file, fileName) {
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = file;
      downloadLink.target = "_self";
      downloadLink.download = fileName;
      downloadLink.click();
    },
  },
};
</script>

<style lang="scss" scoped>

.mh-60 {
  max-height: 60vh !important;
}

</style>
