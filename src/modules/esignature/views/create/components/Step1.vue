<template>
  <div>
    <div class="esignature-wrap-content">
      <validation-observer ref="observerStep1">
        <div class="d-flex justify-space-around py-5 wrap-types">
          <div
            class="item-esignature-type text-center"
            :class="{ active: type === 'NEW' }"
            @click="createContractFrom('NEW')"
          >
            <v-card
              rounded="lg"
              class="py-3 px-1 esignature-type-content"
              outlined
            >
              <v-icon size="40">mdi-plus-circle-outline</v-icon>
              <div class="text-uppercase my-5 esignature-type">
                {{ $t('electronicSign.createDocument') }}
              </div>
              <hr>
              <div class="esignature-desc">
                {{ $t('electronicSign.create.createDocument') }}
              </div>
            </v-card>
          </div>
          <div
            class="item-esignature-type text-center"
            :class="{ active: type === 'TEMPLATE' }"
            @click="createContractFromTemplate()"
          >
            <v-card
              rounded="lg"
              class="py-3 px-1 esignature-type-content"
              outlined
            >
              <v-icon size="40">mdi-clipboard-text-outline</v-icon>
              <div class="text-uppercase my-5 esignature-type">
                {{ $t('electronicSign.create.byTemplate') }}
              </div>
              <hr>
              <div class="esignature-desc">
                {{ $t('electronicSign.create.inForm') }}
              </div>
            </v-card>
          </div>
        </div>
        <div v-if="type">
          <hr>
          <!-- Loai hop dong -->
          <validation-observer ref="observerStep2">
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
                      ref="refDocumentName"
                      v-model="documentName"
                      dense
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
                      @change="getSuggestDocNum()"
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
                      @change="getSuggestDocNum()"
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
                      @change="getSuggestDocNum()"
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
              <div class="form-group col-12 col-sm-6 col-md-4 pt-0">
                <div class="col-12 pt-0">
                  <label class="text--body-1">{{ $t('document.label.countDocument') }}</label>
                  <small v-if="promulgateGroupId" class="ml-1 label-unti">({{ $t(nextNumber) }}:
                    <span>{{ numDocRegiste }}</span>)
                  </small>
                  <div class="wrap-scope-use">
                    <v-text-field
                      v-model="countDocument"
                      name="phone"
                      type="text"
                      :disabled="!promulgateGroupId"
                      :placeholder="$t('document.label.enterRegister')"
                      outlined
                      dense
                      :error-messages="$t(messageError)"
                      maxlength="9"
                      oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
                      @input="onInputRegister"
                    />
                  </div>
                </div>
              </div>
            </div>
          </validation-observer>
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
                        <v-btn
                          v-if="showDownLoadIcon"
                          class="download-attach ml-2"
                          icon
                          @click="downloadFileDocument(index)"
                        ><v-icon>mdi-tray-arrow-down</v-icon></v-btn>
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
                  <!-- <v-btn color="primary" text class="pa-0">
                    <span class="text-decoration-underline text-capitalize">{{
                      $t('electronicSign.sample')
                    }}</span>
                  </v-btn> -->
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
                        <v-btn
                          v-if="showDownLoadIcon"
                          icon
                          class="download-attach ml-2"
                          @click="downloadFileAttach(index)"
                        ><v-icon>mdi-tray-arrow-down</v-icon></v-btn>
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

    <!-- Button -->
    <div v-if="type">
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

    <!-- Dialog select flow -->
    <DialogSelectFlow
      :lst-contract-type="lstContractType"
      :show-dialog="showDialogSelectTemplate"
      @close-dialog="showDialogSelectTemplate = false"
      @accept="acceptContractFromTemplate"
      @cancel-select-flow="cancelSelectFlow"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapState } from 'vuex'
import rules from '@/mixins/rules'
import { formatFileSize } from '@/helpers/utils'
import { FileService } from '@/modules/esignature/services/fileService'
import constants from '@/constants'
import { GroupService } from '@/services/groupService'
import { DocumentService } from '@/modules/esignature/services/documentService'
import statusDocument from '@/modules/esignature/mixins/statusDocument'
import filterItems from '@/modules/esignature/mixins/filterItems.js'
import DialogSelectFlow from '@/modules/esignature/views/flow/dialog/DialogSelectFlow.vue'
import customsFile from '@/modules/esignature/mixins/customsFile'

export default {
  name: 'Step1',
  components: { DialogSelectFlow },
  mixins: [rules, statusDocument, filterItems, customsFile],
  data() {
    return {
      messageError: null,
      nextNumber: 'document.nextNumber',
      numDocRegiste: 0,
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
      activePanel: [0],
      parentId: null,

      // Bool show dialog.
      showDialogSelectFlow: false,
      showDialogSelectTemplate: false,
      listSigner: [
        {
          signers: [],
          openPanel: []
        }
      ]
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
      if (type) {
        this.setDocumentType(type)
        this.isValidStep()
      }
    },
    parentId() {
      this.setParentId(this.parentId)
    },
    countDocument() {
      this.setCountDocument(this.countDocument)
      this.isValidStep()
    },
    priorityId() {
      const type = this.lstPriorityId.find((t) => t.id === this.priorityId)
      if (type) {
        this.setPriorityId(type)
        this.isValidStep()
      }
    },
    promulgateGroupId() {
      const type = this.groups.find((t) => t.groupId === this.promulgateGroupId)
      this.setPromulgateGroupId(type)
      if (!type) {
        this.countDocument = null
        this.messageError = null
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
      'setListSigner',
      'resetDataState',
      'setParentId'
    ]),
    ...mapActions('layout', ['setNotify']),
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
    focusDocumentName() {
      this.$refs.refDocumentName.focus()
    },
    trimSpace(val) {
      const value = val.trim()
      return value
    },
    // Tao hop dong tu
    async createContractFrom(type) {
      if (this.type === 'NEW' && type === 'NEW') {
        setTimeout(() => {
          this.focusDocumentName()
        }, 200)
        return
      }
      if (this.type) {
        this.$refs.observerStep2.reset()
      }
      this.type = type
      this.resetDataState()
      if (this.lstPriorityId) {
        this.priorityId = this.lstPriorityId[0]
        this.setPriorityId(this.lstPriorityId[0])
      }
      this.parentId = null
      setTimeout(() => {
        this.focusDocumentName()
      }, 200)
      this.fileContract = null
      this.fileAttachs = []
      this.promulgateGroupId = null
      this.nameFileDocuments = []
      this.nameFileAttachs = []
      this.documentType = null
      this.documentName = null
    },
    createContractFromTemplate() {
      this.showDialogSelectTemplate = true
    },
    // Xac nhan chon hop dong tu mau
    acceptContractFromTemplate(documentId) {
      this.type = 'TEMPLATE'
      this.showDialogSelectTemplate = false
      // Lay thong tin chi tiet luong mau
      this.parentId = documentId
      this.initDataContractFromFlow(documentId)
      // Lay thong tin file ky
    },
    // Huy chon luong mau
    cancelSelectFlow() {
      this.showDialogSelectTemplate = false
    },
    async initDataContractFromFlow(documentId) {
      try {
        const { data } = await DocumentService.getDocTemplate(documentId)
        const dataResponse = { ...data }
        this.setDocumentDetail(dataResponse)
        this.documentName = dataResponse.documentTitle
        this.setDocumentName(this.documentName)
        this.setParentId(this.parentId)
        this.initDocumentType(dataResponse)
        this.initpromulgateGroupId(dataResponse)
        this.initCountDocument(dataResponse)
        this.initPriorityId(dataResponse)
        this.initFileDocument(dataResponse)
        this.initFileAttachs(dataResponse)
        this.getListSigner(data)
        if (this.promulgateGroupId) {
          await this.getSuggestDocNum()
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      }
    },
    onInputRegister() {
      this.messageError = null
      if (this.countDocument && this.countDocument <= 0) {
        this.messageError = 'document.countDocumentInvalid'
        return this.messageError
      }
      if (this.countDocument && this.countDocument < this.numDocRegiste) {
        this.messageError = 'document.countDocumentResgiter'
        return this.messageError
      }
    },
    async getSuggestDocNum() {
      try {
        var formRequest = {
          formulaTypeId: null,
          promulgateGroupId: null,
          securityTypeId: null,
          promulgateDate: null,
          docType: 1
        }

        if (this.documentType) {
          formRequest.formulaTypeId = this.documentType
        }
        if (this.promulgateGroupId) {
          formRequest.promulgateGroupId = this.promulgateGroupId

          const response = await DocumentService.getSuggestDocNum(formRequest)
          if (response.data) {
            this.numDocRegiste = response.data
            this.onInputRegister()
            this.isValidStep()
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    initContractType(data) {
      const type = this.lstContractType.find(
        (t) => t.id === data.documentFormulaId
      )
      this.documentType = type.id
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
    initDocumentType(data) {
      const type = this.lstContractType.find(
        (t) => t.id === data.documentFormulaId
      )
      if (type) {
        this.documentType = type.id
        this.setDocumentType(type)
      }
    },
    initpromulgateGroupId(data) {
      this.promulgateGroupId = null
      if (data.promulgateGroupId) {
        const type = this.groups.find(
          (t) => t.groupId === data.promulgateGroupId
        )
        if (type) {
          this.promulgateGroupId = type.groupId
          this.setPromulgateGroupId(type)
        }
      }
    },
    initCountDocument(data) {
      if (this.promulgateGroupId) {
        this.countDocument = data.registerNumber
        this.setCountDocument(this.countDocument)
      }
    },
    initPriorityId(data) {
      const type = this.lstPriorityId.find((t) => t.id === data.priorityId)
      if (type) {
        this.priorityId = type.id
        this.setPriorityId(type)
        this.isValidStep()
      }
    },
    async initFileDocument(data) {
      this.uploadingFile = true
      this.nameFileDocuments = []
      if (data.fileMainSign) {
        await this.setFileDocument(data.fileMainSign)
        this.nameFileDocuments = data.fileMainSign
      }
      this.uploadingFile = false
    },
    // Validate step
    isValidStep() {
      this.completed =
        !this.uploadingFile &&
        !this.messageError &&
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
    },
    // Get list signer.
    getListSigner(data) {
      data.signatureSigners.map((item, i) => {
        this.listSigner[0].signers.push({
          signUserId: item.signUserId,
          signUserName: '',
          groupName: '',
          positionName: '',
          positionId: '',
          signGroupId: item.signGroupId,
          step: '',
          groupLevel: '',
          signUserType: item.signUserType,
          documentId: item.documentId,
          roleCode: item.roleCode,
          signProcessId: item.signProcessId,
          signMethods: []
        })
        this.listSigner[0].openPanel.push(i)
      })
      this.setListSigner(this.listSigner)
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
.label-unti {
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  color: #8E8EA1;
  line-height: 18px;
  letter-spacing: 0.1px;
  span {
    color: red;
  }
}
</style>
