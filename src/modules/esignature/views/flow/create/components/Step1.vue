<template>
  <div>
    <div class="esignature-wrap-content">
      <validation-observer ref="observerStep1">
        <div>
          <!-- Loai hop dong -->
          <div class="col-12 row justify-space-around py-0">
            <div class="form-group col-10">
              <div class="col-12">
                <label class="text--body-1">{{ $t('electronicSign.create.nameDocument') }}
                  <span class="color-require">*</span></label>
                <validation-provider
                  v-slot="{ errors }"
                  name="documentName"
                  rules="required|max:500"
                >
                  <v-text-field
                    v-model="documentName"
                    dense
                    autofocus
                    maxlength="500"
                    counter="500"
                    flat
                    solo
                    :placeholder="$t('document.placeholder.nameDocument')"
                    outlined
                    :error-messages="errors"
                    required
                    @change="documentName = trimSpace(documentName)"
                  />
                </validation-provider>
              </div>
            </div>
          </div>
          <div class="col-12 row justify-space-around py-0 mt-0">
            <div class="form-group col-12 col-sm-6 col-md-4 pt-0">
              <div class="col-12">
                <label class="text--body-1">{{ $t('electronicSign.create.documentForm') }}
                  <span class="color-require">*</span></label>
                <validation-provider
                  v-slot="{ errors }"
                  name="documentType"
                  rules="required"
                >
                  <v-select
                    v-model="documentType"
                    dense
                    :placeholder="$t('document.placeholder.documentForm')"
                    outlined
                    attach
                    :error-messages="errors"
                    :no-data-text="$t('noData')"
                    required
                    :menu-props="{
                      bottom: true,
                      offsetY: true
                    }"
                    :items="lstContractType"
                    item-text="name"
                    item-value="id"
                  >
                    <template v-slot:append>
                      <v-icon>mdi-chevron-down</v-icon>
                    </template>
                  </v-select>
                </validation-provider>
              </div>
            </div>
            <div class="form-group col-12 col-sm-6 col-md-4 pt-0">
              <div class="col-12 pt-0">
                <label class="text--body-1">{{ $t('electronicSign.create.urgency') }}
                  <span class="color-require">*</span></label>
                <validation-provider
                  v-slot="{ errors }"
                  name="urgency"
                  rules="required"
                >
                  <v-select
                    v-model="priorityId"
                    dense
                    :placeholder="$t('document.placeholder.urgency')"
                    outlined
                    attach
                    :error-messages="errors"
                    required
                    :no-data-text="$t('noData')"
                    :menu-props="{
                      bottom: true,
                      offsetY: true
                    }"
                    :items="lstPriorityId"
                    item-text="name"
                    item-value="id"
                  >
                    <template v-slot:append>
                      <v-icon>mdi-chevron-down</v-icon>
                    </template>
                  </v-select>
                </validation-provider>
              </div>
            </div>
          </div>
          <div class="col-12 row justify-space-around py-0 mt-0">
            <div class="form-group col-12 col-sm-6 col-md-4 pt-0">
              <div class="col-12 pt-0">
                <label class="text--body-1">{{ $t('electronicSign.create.issueGroup') }}</label>
                <div class="wrap-scope-use">
                  <v-autocomplete
                    v-model="promulgateGroupId"
                    :no-data-text="$t('noData')"
                    :placeholder="$t('document.placeholder.issueGroup')"
                    :items="groups"
                    item-text="groupName"
                    item-value="groupId"
                    outlined
                    hide-selected
                    attach
                    maxlength="255"
                    dense
                    :filter="filterItems"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      maxHeight: 220
                    }"
                    allow-overflow
                  >
                    <vue-feather
                      slot="append"
                      class="grey--text"
                      type="search"
                    />
                    <template v-slot:item="data">
                      <div class="select-item flex-column d-flex">
                        <div class="title-item">{{ data.item.groupName }}</div>
                        <div class="desc-item">
                          {{ data.item.parentPathName }}
                        </div>
                      </div>
                    </template>
                  </v-autocomplete>
                </div>
              </div>
            </div>
            <div class="form-group col-12 col-sm-6 col-md-4 pt-0" />
          </div>
          <hr>
          <!-- Hop dong ky ket-->

          <div class="col-12 row justify-space-around py-0">
            <!-- abc -->
            <div class="form-group col-12 col-sm-6 col-md-4">
              <div class="col-12">
                <label class="text--body-1">{{ $t('electronicSign.create.fileSign') }}
                  <span class="color-require">*</span></label>
                <div class="d-flex justify-space-between align-center">
                  <validation-provider
                    ref="contractSignedProvider"
                    :rules="ruleFileDocument"
                    name="documentSigned"
                  >
                    <input
                      id="fileContract"
                      ref="fileContract"
                      type="file"
                      multiple
                      hidden
                      :loading="uploadingFile"
                      accept="application/pdf"
                      @change="selectDocumentFile"
                    >
                    <ul class="list-files">
                      <li
                        v-for="(file, index) in nameFileDocuments"
                        :key="index"
                      >
                        <img
                          :src="getIconFile(`${file.fileName}`)"
                          class="mr-2"
                        >
                        <span>{{ customFileName(file) }}</span>
                        <v-btn
                          :disabled="uploadingFile"
                          class="remove-attach"
                          icon
                          @click="removeFileDocument(index)"
                        ><v-icon>mdi-close</v-icon></v-btn>
                        <span
                          v-if="showDownLoadIcon"
                          class="download-attach ml-2"
                          @click="downloadFileDocument(index)"
                        ><v-icon>mdi-tray-arrow-down</v-icon></span>
                      </li>
                    </ul>
                  </validation-provider>
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
                    <div>{{ $t('electronicSign.format') }}: pdf</div>
                    <div class="text-danger">
                      ({{ $t('electronicSign.fileMax') }} 50MB)
                    </div>
                  </div>
                  <v-btn color="primary" text class="pa-0">
                    <span class="text-decoration-underline text-capitalize">{{
                      $t('electronicSign.sample')
                    }}</span>
                  </v-btn>
                </div>
              </div>
            </div>
            <!-- tai file dinh kem -->
            <div class="form-group col-12 col-sm-6 col-md-4">
              <div class="col-12">
                <label class="text--body-1">{{ $t('electronicSign.create.attachments') }}</label>
                <div class="d-flex justify-space-between align-center">
                  <validation-provider
                    ref="providerFileAttachs"
                    :rules="ruleFileAttachs"
                    name="fileAttachsFile"
                  >
                    <input
                      id="fileAttachsInput"
                      ref="fileAttachsInput"
                      type="file"
                      multiple
                      hidden
                      accept=".xlsx,.xls,.doc,.docx,.pdf"
                      @change="selectAttachs"
                    >
                    <ul class="list-files">
                      <li v-for="(file, index) in nameFileAttachs" :key="index">
                        <img
                          :src="getIconFile(`${file.fileName}`)"
                          class="mr-2"
                        >

                        <span>{{ customFileName(file) }}</span>
                        <v-btn
                          class="remove-attach"
                          icon
                          @click="removeFileAttach(index)"
                        ><v-icon>mdi-close</v-icon></v-btn>
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
                    <div>
                      {{ $t('electronicSign.format') }}: doc, docx, xlsx, pdf
                    </div>
                    <div class="text-danger">
                      ({{ $t('electronicSign.fileMax') }} 50MB)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </validation-observer>
    </div>
    <div>
      <hr class="mt-2">
      <div class="d-flex justify-end group-action-step1 mr-4">
        <v-btn
          class="my-2 w-150 py-4 mr-10"
          color="#0FAFE4"
          outlined
          rounded
          @click="showDialogCancel"
        >
          <span class="text-primary"> {{ $t('cancelLabel') }}</span>
        </v-btn>

        <v-btn
          class="my-2 w-150 py-4"
          rounded
          :disabled="!completed"
          color="primary"
          @click="nextStep"
        >
          {{ $t('electronicSign.continue') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapState } from 'vuex'
import rules from '@/mixins/rules'
import { formatFileSize } from '@/helpers/utils'
import { FileService } from '@/modules/esignature/services/fileService'
import { ContractService } from '@/modules/esignature/services/contractService'
import constants from '@/constants'
import { GroupService } from '@/services/groupService'
import { DocumentService } from '@/modules/esignature/services/documentService'
import statusDocument from '@/modules/esignature/mixins/statusDocument'
import filterItems from '@/modules/esignature/mixins/filterItems.js'
import customsFile from '@/modules/esignature/mixins/customsFile.js'

export default {
  name: 'Step1',
  components: {},
  mixins: [rules, statusDocument, filterItems, customsFile],
  data() {
    return {
      countDocument: null,
      countDocumentDefault: 0,
      errorMessagecountDocument: '',
      scopes: '',
      groups: [],
      // Flag upload file
      uploadingFile: false,
      uploadingFileAttatch: false,
      fileContract: null,
      tmpFileContract: null,
      nameFileDocuments: [],
      fileDocuments: [],
      fileAttachs: [],
      nameFileAttachs: [],
      type: null,
      documentType: null,
      documentName: null,
      priorityId: null,
      promulgateGroupId: null,
      completed: false,
      lstContractType: [],
      lstPriorityId: [],
      // Nguoi xem xet
      activePanel: [0],
      // Tao moi hop dong
      showDialogSelectTemplate: false
    }
  },
  computed: {
    fileStyle() {
      return {
        opacity: this.fileContract != null ? 1 : 0
      }
    },
    fileAttachStyle() {
      return { opacity: this.fileAttachs.length > 0 ? 1 : 0 }
    },
    ...mapState('esignature', ['fileDocumentUploaded', 'fileAttachsUploaded']),
    // Hien thi icon download
    showDownLoadIcon() {
      return this.type === 'TEMPLATE'
    }
  },
  watch: {
    documentType() {
      const type = this.lstContractType.find((t) => t.id === this.documentType)
      this.setDocumentType(type)
      this.isValidStep()
    },
    countDocument() {
      this.validateCountDoc()
      this.setCountDocument(this.countDocument)
    },
    priorityId() {
      const type = this.lstPriorityId.find((t) => t.id === this.priorityId)
      this.setPriorityId(type)
      this.isValidStep()
    },
    promulgateGroupId() {
      const type = this.groups.find((t) => t.groupId === this.promulgateGroupId)
      this.setPromulgateGroupId(type)
      if (!type) {
        this.countDocument = null
      }
    },
    documentName() {
      this.isValidStep()
      this.setDocumentName(this.documentName)
    },
    fileContract() {
      this.isValidStep()
    },
    fileDocuments() {
      this.isValidStep()
    },
    nameFileDocuments() {
      this.isValidStep()
    },
    uploadingFile() {
      this.isValidStep()
    }
  },
  created() {
    this.resetDataState()
    this.getDocPriority()
    this.getDocFormula()
    this.getGroups()
    this.getScopeTemplate()
  },
  methods: {
    ...mapActions('esignature', [
      'setFileDocument',
      'setFileAttachs',
      'setDocumentName',
      'setPriorityId',
      'setPromulgateGroupId',
      'setDocumentType',
      'setDocumentDetail',
      'setCountDocument',
      'resetDataState'
    ]),
    ...mapActions('layout', ['setNotify']),
    ...mapActions('flow', ['setRepresentGroup']),
    validateCountDoc() {
      this.errorMessagecountDocument = ''
      if (this.countDocument > 100000) {
        this.errorMessagecountDocument = 'document.countDocGreater'
      }
      if (
        this.countDocument < this.countDocumentDefault &&
        this.countDocument
      ) {
        this.errorMessagecountDocument = 'document.countDocInvalid'
      }
    },
    selectedScope(scopes) {
      this.promulgateGroupId = scopes
    },
    async getDocFormula() {
      try {
        const response = await DocumentService.getDocFormula()
        this.lstContractType = response.data
      } catch (error) {
        console.log(error)
      }
    },
    async getDocPriority() {
      try {
        const response = await DocumentService.getDocPriority()
        this.lstPriorityId = response.data
        if (this.lstPriorityId && this.lstPriorityId.length > 0) {
          this.priorityId = this.lstPriorityId[0].id
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getGroups() {
      try {
        const param = {
          pageSize: 1000000,
          restrictHierarchy: 'false',
          groupType: constants.GROUPS.INTERNAL
        }
        const response = await GroupService.search(param)
        this.groups = response.data.data
      } catch (error) {
        console.log(error)
      }
    },
    async getScopeTemplate() {
      try {
        const response = await DocumentService.getListPromulgateTemplate()
        this.setRepresentGroup(response.data)
      } catch (error) {
        console.log(error)
      }
    },
    trimSpace(val) {
      const value = val.trim()
      return value
    },
    // Tao hop dong tu
    createContractFrom(type) {
      this.type = type
      if (type === 'TEMPLATE') {
        this.showDialogSelectTemplate = true
      } else {
        this.setDocumentDetail(null)
        this.fileContract = null
        this.fileAttachs = []
        this.nameFileDocuments = []
        this.nameFileAttachs = []
        this.documentType = null
        this.documentName = null
        this.setFileDocument(null)
        this.setFileAttachs(null)
      }
    },
    // Xac nhan chon hop dong tu mau
    acceptContractFromTemplate(contractId) {
      this.showDialogSelectTemplate = false
      // Lay thong tin chi tiet luong mau
      this.initDataContractFromFlow(contractId)
      // Lay thong tin file ky
    },
    async initDataContractFromFlow(contractId) {
      try {
        const { data } = await ContractService.getDetailContract(contractId)
        this.setDocumentDetail(data)
        this.documentName = data.title
        this.initContractType(data)
        this.initFileMainSign(data)
        this.initFileAttachs(data)
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error
        })
      }
    },
    initContractType(data) {
      const type = this.lstContractType.find(
        (t) => t.id === data.documentFormulaId
      )
      this.documentType = type.code
    },
    async initFileMainSign(data) {
      if (data.fileDocuments) {
        data.fileDocuments.map((file) => {
          file.name = file.fileName
          file.size = file.fileSize
        })
        this.setFileDocument(data.fileDocuments)
        this.nameFileDocuments = data.fileDocuments
      }
    },
    async initFileAttachs(data) {
      if (data.fileAttachments) {
        data.fileAttachments.map((file) => {
          file.name = file.fileName
          file.size = file.fileSize
        })
        this.setFileAttachs(data.fileAttachments)
        this.nameFileAttachs = data.fileAttachments
      }
    },
    // Validate step
    isValidStep() {
      this.completed =
        !this.uploadingFile &&
        !_.isNull(this.documentType) &&
        !_.isNull(this.priorityId) &&
        !_.isEmpty(this.documentName) &&
        this.isValidArray()
    },
    isValidArray() {
      return this.nameFileDocuments.length > 0
    },
    // Upload file hop dong
    uploadContract() {
      document.getElementById('fileContract').click()
    },
    // Upload file dinh kem
    uploadAttachs() {
      document.getElementById('fileAttachsInput').click()
    },
    // Chuyen step 2
    nextStep() {
      this.$emit('next-step', 2)
    },
    // Chon file dinh kem
    async selectAttachs() {
      try {
        this.fileAttachs = [...this.$refs.fileAttachsInput.files]
        // bien chua index de xoa
        const listIndexRemove = []
        // lap de tim cac ten file trung nhau
        this.nameFileAttachs.map((file, index) => {
          let count = 0
          this.fileAttachs.map((fileAttach) => {
            if (file.fileName.includes(fileAttach.name)) {
              count++
            }
          })
          if (count > 1) {
            listIndexRemove.push(index)
          }
        })
        // xoa file cu khi bi trung ten file
        if (listIndexRemove.length > 0) {
          listIndexRemove.map((index) => {
            this.removeFileAttach(index)
          })
        }
        // validate file
        const lstFileValidate = this.fileAttachs.filter((file) => file.name)
        const { valid } = await this.$refs.providerFileAttachs.validate(
          lstFileValidate
        )
        if (!valid) {
          if (this.fileAttachs) {
            this.fileAttachs = this.nameFileAttachs
          } else {
            // neu xoa thi dat gia tri ve null
            this.fileAttachs = []
            this.nameFileAttachs = []
          }
          this.$refs.fileAttachsInput.type = 'text'
          this.$refs.fileAttachsInput.type = 'file'

          const message = this.$refs.providerFileAttachs.errors[0]
          const typeAlert = 'warning'
          this.$emit('show-alert', { message, typeAlert })
          return
        } else {
          await this.uploadFileAttachs()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // Chon file
    async selectDocumentFile() {
      try {
        this.fileDocuments = [...this.$refs.fileContract.files]
        // bien chua index de xoa
        const listIndexRemove = []
        // lap de tim cac ten file trung nhau
        this.nameFileDocuments.map((file, index) => {
          let count = 0
          this.fileDocuments.map((fileDocument) => {
            if (file.fileName.includes(fileDocument.name)) {
              count++
            }
          })
          if (count > 1) {
            listIndexRemove.push(index)
          }
        })

        // xoa file cu khi bi trung ten file
        if (listIndexRemove.length > 0) {
          listIndexRemove.map((index) => {
            this.removeFileDocument(index)
          })
        }
        // validate file
        const lstFileValidate = this.fileDocuments.filter((file) => file.name)
        const { valid } = await this.$refs.contractSignedProvider.validate(
          lstFileValidate
        )

        if (!valid) {
          if (this.fileDocuments) {
            // neu xoa thi dat gia tri ve null
            this.fileDocuments = this.nameFileDocuments
          } else {
            this.fileDocuments = []
            this.nameFileDocuments = []
          }
          this.$refs.fileContract.type = 'text'
          this.$refs.fileContract.type = 'file'
          const message = this.$refs.contractSignedProvider.errors[0]
          const typeAlert = 'warning'
          this.$emit('show-alert', { message, typeAlert })

          return
        } else {
          await this.uploadFileDocument()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // Hien thi ten file
    customFileName(file) {
      const fileName = file.name || file.fileName
      const fileSizeInput = file.size || file.fileSize
      const size = fileSizeInput / 1000
      const fileSize = formatFileSize({ size })

      var names = fileName.split('.')
      const extFile = names[names.length - 1]
      var name = names.splice(0, names.length - 1).join('')
      if (name.length > 25) {
        name = `${name.slice(0, 12)}...${name.slice(
          name.length - 10,
          name.length
        )}.${extFile} (${fileSize})`
      } else {
        name += `.${extFile} (${fileSize})`
      }
      return name
    },

    // Xoa tai lieu dinh kem
    removeFileAttach(index) {
      var fileBuffer = new DataTransfer()
      document.getElementById('fileAttachsInput').files = fileBuffer.files
      this.fileAttachs.splice(index, 1)
      var fileAttachsUpload = this.fileAttachsUploaded
      fileAttachsUpload.splice(index, 1)
      this.setFileAttachs(fileAttachsUpload)
    },

    // Xoa file
    removeFileDocument(index) {
      // xoa file trong the <input>
      var fileBuffer = new DataTransfer()
      document.getElementById('fileContract').files = fileBuffer.files
      this.fileDocuments.splice(index, 1)
      var fileUpload = this.fileDocumentUploaded
      fileUpload.splice(index, 1)
      this.setFileDocument(fileUpload)
    },

    async uploadFileDocument() {
      if (this.fileDocuments.length === 0) {
        return
      }
      try {
        this.uploadingFile = true
        var formData = new FormData()
        this.fileDocuments.map((file) => {
          formData.append('files', file)
        })
        formData.append('fileType', constants.FILE_TYPES.FILE_MAIN)
        const response = await FileService.uploadFileMain(formData, true)
        if (response.success) {
          const { data } = response
          const lstFileName = this.nameFileDocuments.map(
            (file) => file.fileName || file.name
          )
          data.forEach((file) => {
            if (!lstFileName.includes(file.fileName)) {
              this.nameFileDocuments.push(file)
            } else {
              const index = this.nameFileDocuments.findIndex(
                (x) => x.fileName === file.fileName
              )
              this.nameFileDocuments[index] = file
            }
          })
          await this.setFileDocument(this.nameFileDocuments)
        }
      } catch (error) {
        // xoa item khi call api loi
        this.fileDocuments = this.fileDocuments.filter((file) => file.fileName)
        var fileBuffer = new DataTransfer()
        document.getElementById('fileContract').files = fileBuffer.files
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.uploadingFile = false
      }
    },

    async uploadFileAttachs() {
      if (this.fileAttachs.length === 0) {
        return
      }
      try {
        this.uploadingFileAttatch = true
        var formData = new FormData()
        this.fileAttachs.map((file) => {
          formData.append('files', file)
        })
        formData.append('fileType', constants.FILE_TYPES.FILE_EXTRA)
        const response = await FileService.uploadFileMain(formData, false)

        if (response.success) {
          const { data } = response
          const lstFileName = this.nameFileAttachs.map(
            (file) => file.fileName || file.name
          )
          data.forEach((file) => {
            if (!lstFileName.includes(file.fileName)) {
              this.nameFileAttachs.push(file)
            } else {
              const index = this.nameFileAttachs.findIndex(
                (x) => x.fileName === file.fileName
              )
              this.nameFileAttachs[index] = file
            }
          })
          this.setFileAttachs(this.nameFileAttachs)
        }
      } catch (error) {
        // xoa item khi call api loi
        this.fileAttachs = this.fileAttachs.filter((file) => file.fileName)
        var fileBuffer = new DataTransfer()
        document.getElementById('fileAttachsInput').files = fileBuffer.files
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.uploadingFileAttatch = false
      }
    },

    // Hien thi dialog huy
    showDialogCancel() {
      this.$emit('show-cancel')
    },

    async downloadFileDocument(index) {
      const documentFile = this.nameFileDocuments[index]
      const file = await FileService.download({
        filePath: documentFile.filePath,
        storage: documentFile.storage,
        fileName: documentFile.fileName
      })
      this.downloadFile(file, documentFile.fileName)
    },

    // Tai file dinh kem
    async downloadFileAttach(index) {
      const attach = this.nameFileAttachs[index]
      const file = await FileService.download({
        filePath: attach.filePath,
        storage: attach.storage,
        fileName: attach.fileName
      })
      this.downloadFile(file, attach.fileName)
    },

    // Tai file
    downloadFile(file, fileName) {
      const downloadLink = document.createElement('a')
      document.body.appendChild(downloadLink)
      downloadLink.href = file
      downloadLink.target = '_self'
      downloadLink.download = fileName
      downloadLink.click()
    }
  }
}
</script>

<style lang="scss">
.list-files {
  list-style: none;
  padding: 0 !important;
  margin-top: 5px;
  li {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    cursor: pointer;
  }
  .icon-file-pdf {
    color: #fc1405;
    padding-right: 10px;
  }
  .icon-file-doc {
    color: #2684fc;
    padding-right: 10px;
  }
  .icon-file-excel {
    color: #15a5ae;
    padding-right: 10px;
  }
  .remove-attach {
    i {
      color: #ff4a55 !important;
      cursor: pointer;
    }
  }
}
</style>
