<template>
  <div>
    <div class="wrap-content-contract pt-4">
      <validation-observer ref="observerStep1">
        <div class="d-flex justify-space-around py-5 wrap-types">
          <div
            class="item-contract-type text-center"
            :class="{ active: type === 'NEW' }"
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
                {{ $t('contract.new') }}
              </div>
              <hr>
              <div class="contract-desc">
                {{ $t('contract.notInForm') }}
              </div>
            </v-card>
          </div>
          <div
            class="item-contract-type text-center"
            :class="{ active: type === 'TEMPLATE' }"
          >
            <v-card
              rounded="lg"
              class="py-5 px-1 contract-type-content"
              outlined
            >
              <span class="wrap-icon-type">
                <i class="icon-clipboard icon-type" />
              </span>
              <div class="text-uppercase my-5  contract-type">
                {{ $t('contract.byTemplate') }}
              </div>
              <hr>
              <div class="contract-desc">
                {{ $t('contract.inForm') }}
              </div>
            </v-card>
          </div>
        </div>
        <div v-if="type">
          <hr>
          <!-- Loai hop dong -->
          <div class="col-12 row justify-space-around py-0">
            <div class="form-group col-12 col-sm-6 col-md-4">
              <div class="col-12">
                <label
                  class="text--label"
                >{{ $t('contract.typeLabel') }}
                  <span class="color-require ">*</span></label>
                <validation-provider
                  v-slot="{ errors }"
                  name="contractType"
                  rules="required"
                >
                  <v-select
                    v-model="contractType"
                    dense
                    disabled
                    attach
                    :placeholder="$t('contract.typeLabel')"
                    outlined
                    :error-messages="errors"
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
            <div class="form-group col-12 col-sm-6 col-md-4">
              <div class="col-12">
                <label
                  class="text--label"
                >{{ $t('contract.nameLabel') }}
                  <span class="color-require ">*</span></label>
                <validation-provider
                  v-slot="{ errors }"
                  name="contractName"
                  rules="required|max:500"
                >
                  <v-text-field
                    v-model="contractName"
                    dense
                    disabled
                    maxlength="500"
                    counter="500"
                    flat
                    solo
                    :placeholder="$t('contract.nameLabel')"
                    outlined
                    :error-messages="errors"
                    required
                    @change="contractName = trimSpace(contractName)"
                  />
                </validation-provider>
              </div>
            </div>
          </div>
          <hr>
          <!-- Hop dong ky ket-->

          <div class="col-12 row justify-space-around py-0">
            <div class="form-group col-12 col-sm-6 col-md-4">
              <div class="col-12">
                <label
                  class="text--label"
                >{{ $t('contract.signed') }}
                  <span class="color-require ">*</span></label>
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
                      disabled
                      hide-details
                      accept="application/pdf"
                      show-size
                      truncate-length="25"
                      class="no-border pa-0 mr-2 input-file d-none text--caption"
                      prepend-icon="icon-pdf"
                    />
                    <ul class="list-files text--caption">
                      <li>
                        <i class="icon-pdf pr-2" />
                        <span>{{ customFileName(fileContract, true) }}</span>
                      </li>
                    </ul>
                  </validation-provider>
                </div>
                <div
                  class="d-flex justify-space-between align-center text--body-2"
                >
                  <div>
                    <div>{{ $t('contract.format') }}: pdf</div>
                    <div class="text-danger">
                      ({{ $t('contract.fileMax') }} 50MB)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- tai file dinh kem -->
            <div class="form-group col-12 col-sm-6 col-md-4">
              <div class="col-12">
                <label class="text--label">{{
                  $t('contract.attachments')
                }}</label>
                <div class="d-flex justify-space-between align-center">
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
                    >
                    <ul class="list-files text--caption">
                      <li v-for="(file, index) in nameFileAttachs" :key="index">
                        <img
                          :src="getIconFile(`${file.fileName}`)"
                          class="mr-2"
                        >
                        <span>{{ customFileName(file, false) }}</span>
                      </li>
                    </ul>
                  </validation-provider>
                </div>
                <div
                  class="d-flex justify-space-between align-center text--body-2"
                >
                  <div>
                    <div>{{ $t('contract.format') }}: doc, docx, xlsx, pdf</div>
                    <div class="text-danger">
                      ({{ $t('contract.fileMax') }} 50MB)
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
          <span class="text-primary"> {{ $t('cancelLabel') }}</span>
        </v-btn>
        <v-btn
          class="my-2 w-150 py-5 mr-10 text--button"
          color="#0FAFE4"
          outlined
          rounded
          @click="showDialogReject"
        >
          <span class="text-primary"> {{ $t('rejectLabel') }}</span>
        </v-btn>

        <v-btn
          class="my-2 w-150 py-5 text--button"
          :disabled="!completed"
          rounded
          color="primary"
          @click="nextStep"
        >
          {{ $t('contract.continue') }}
        </v-btn>
      </div>
    </div>
    <dialog-select-template
      :lst-contract-type="lstContractType"
      :show-dialog="showDialogSelectTemplate"
      @close-dialog="showDialogSelectTemplate = false"
      @accept="acceptContractFromTemplate"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapState } from 'vuex'
import rules from '@/mixins/rules'
import { formatFileSize } from '@/helpers/utils'
import { FileService } from '@/modules/econtract/services/fileService'
import { ContractService } from '@/modules/econtract/services/contractService'
import constants from '@/constants'
import fileMixin from '@/modules/econtract/mixins/fileMixin'

import DialogSelectTemplate from '../../create-contract/components/DialogSelectTemplate'
export default {
  name: 'Step1',
  components: {
    DialogSelectTemplate
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
      type: 'NEW',
      contractType: null,
      contractName: null,
      completed: false,
      lstContractType: [],
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
    ...mapState('contract', ['fileContractUploaded', 'fileAttachsUploaded'])
  },
  watch: {
    contractType() {
      this.isValidStep()
      const type = this.lstContractType.find(t => t.id === this.contractType)
      this.setContractType(type)
    },
    contractName() {
      this.isValidStep()
      this.setContractName(this.contractName)
    },
    fileContract() {
      this.isValidStep()
    }
  },

  async created() {
    await this.searchGroup()
    this.initDataContract()
  },
  methods: {
    ...mapActions('contract', [
      'setFileContract',
      'setFileAttachs',
      'setContractName',
      'setContractType',
      'setContractDetail',
      'setCheckGroupSelected'
    ]),
    ...mapActions('layout', ['setNotify']),
    async initDataContract() {
      const contractId = this.$route.params.contractId
      try {
        const { data } = await ContractService.getDetailContract(contractId)
        this.setContractDetail(data)
        this.contractName = data.title
        this.initContractType(data)
        this.initFileMainSign(data)
        this.initFileAttachs(data)
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      }
    },
    initContractType(data) {
      const type = this.lstContractType.find(
        t => t.id === data.documentFormulaId
      )
      if (type) this.contractType = type.id
    },
    async initFileMainSign(data) {
      await this.setFileContract(data.fileMainSign)
      fetch(this.fileContractUploaded.url)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], this.fileContractUploaded.fileName, {
            type: 'application/pdf'
          })
          this.fileContract = file
        })
    },
    async initFileAttachs(data) {
      if (data.fileAttachments) {
        data.fileAttachments.map(file => {
          file.name = file.fileName
          file.size = file.fileSize
        })
        this.setFileAttachs(data.fileAttachments)
        this.nameFileAttachs = data.fileAttachments
      }
    },
    trimSpace(val) {
      const value = val ? val.trim() : ''
      return value
    },
    // Tao hop dong tu
    createContractFrom(type) {
      this.type = type
      if (type === 'TEMPLATE') {
        this.showDialogSelectTemplate = true
      }
    },
    // Xac nhan chon hop dong tu mau
    acceptContractFromTemplate() {
      this.showDialogSelectTemplate = false
    },
    async searchGroup() {
      try {
        const response = await ContractService.getList()
        this.lstContractType = response.data
      } catch (error) {
        console.log(error)
      }
    },
    // Validate step
    isValidStep() {
      this.completed =
        !_.isNull(this.contractType) &&
        !_.isEmpty(this.contractName) &&
        !_.isNull(this.fileContract)
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
        this.fileAttachs = [
          ...this.fileAttachs,
          ...this.$refs.fileAttachsInput.files
        ]
        // bien chua index de xoa
        const listIndexRemove = []
        // lap de tim cac ten file trung nhau
        this.nameFileAttachs.map((file, index) => {
          let count = 0
          this.fileAttachs.map(fileAttach => {
            if (file.name === fileAttach.name) {
              count++
            }
          })
          if (count > 1) {
            listIndexRemove.push(index)
          }
        })
        // xoa file cu khi bi trung ten file
        if (listIndexRemove.length > 0) {
          listIndexRemove.map(index => {
            this.removeFileAttach(index)
          })
        }
        // validate file
        // const tmpfileAttachs = _.uniqBy(this.fileAttachs, file => file.name)
        const { valid } = await this.$refs.providerFileAttachs.validate(
          this.fileAttachs[this.fileAttachs.length - 1]
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
        }
        await this.uploadFileAttachs()
      } catch (error) {
        console.log(error)
      }
    },
    // Hien thi ten file
    customFileName(file, isFile) {
      if (!file) {
        return
      }
      const fileName = isFile ? file.name : file.fileName
      const fileSizeInput = isFile ? file.size : file.fileSize
      const size = fileSizeInput / 1000
      const fileSize = formatFileSize({ size })
      var names = fileName.split('.')
      const extFile = names[names.length - 1]
      var name = names.splice(0, names.length - 1).join('')
      if (name.length > 25) {
        name = `${name.slice(0, 12)}...${name.slice(
          15,
          25
        )}.${extFile} (${fileSize})`
      } else {
        name += `.${extFile} (${fileSize})`
      }
      return name
    },
    // Xoa tai lieu dinh kem
    removeFileAttach(index) {
      this.fileAttachs.splice(index, 1)
      var fileAttachsUpload = this.fileAttachsUploaded
      fileAttachsUpload.splice(index, 1)
      this.setFileAttachs(fileAttachsUpload)
    },
    // upload file hop dong
    async uploadContractSigned() {
      try {
        const { valid } = await this.$refs.contractSignedProvider.validate(
          this.fileContract
        )
        if (!valid) {
          const message = this.$refs.contractSignedProvider.errors[0]
          const typeAlert = 'warning'
          this.$emit('show-alert', { message, typeAlert })
          // check xoa file
          if (this.fileContract || this.fileContract === undefined) {
            this.fileContract = this.tmpFileContract
          } else {
            // neu xoa thi dat gia tri ve null
            this.fileContract = null
            this.tmpFileContract = null
          }
          return
        }

        this.tmpFileContract = this.fileContract
        this.uploadingFile = true
        // Upload file
        var formData = new FormData()
        formData.append('file', this.fileContract)
        formData.append('fileType', constants.FILE_TYPES.FILE_MAIN)
        const response = await FileService.upload(formData, false)

        if (response.success) {
          this.setFileContract(response.data)
        }
      } catch (error) {
        this.fileContract = null
        this.tmpFileContract = null
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
        this.fileAttachs.map(file => {
          formData.append('files', file)
        })
        formData.append('fileType', constants.FILE_TYPES.FILE_EXTRA)
        const response = await FileService.upload(formData, true)

        this.nameFileAttachs = this.fileAttachs
        if (response.success) {
          this.setFileAttachs(response.data)
        }
      } catch (error) {
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
    // Hien thi dialog tu choi
    showDialogReject() {
      this.$emit('show-reject')
    }
  }
}
</script>

<style lang="scss"></style>
