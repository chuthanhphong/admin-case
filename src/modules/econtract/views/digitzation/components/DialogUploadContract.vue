<template>
  <div>
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="820"
      transition="dialog-transition"
    >
      <validation-observer ref="observerUpload" v-slot="{ invalid }">
        <v-card>
          <v-card-title class="d-flex justify-center flex-column">
            <h5 class="text-center mb-6">
              <div>
                {{ $t('contract-manager.dialogs.titleUploadContract') }}
              </div>
            </h5>
            <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
          </v-card-title>
          <div class="wrap-content-upload col-12 col-md-8 mx-auto text--body-2">
            <div class="group-upload">
              <label class="text-uppercase text--label">
                {{ $t('contract-manager.dialogs.labels.listContract') }}
                <span class="color-require ">*</span>
              </label>
              <div class="group-upload">
                <div
                  class="d-flex justify-space-between align-center border-dasher py-3"
                >
                  <validation-provider
                    ref="fileListContractProvider"
                    name="fileListContract"
                    :rules="ruleFileListContract"
                    class="d-flex align-center px-3"
                  >
                    <v-file-input
                      id="fileContract"
                      ref="fileContract"
                      v-model="fileContract"
                      :style="fileStyle"
                      accept=".xlsx,.xls"
                      show-size
                      truncate-length="25"
                      :loading="uploadingFile"
                      class="no-border pa-0 input-file mb-0 text--caption"
                      :class="fileContract ? '' : 'w-0'"
                      :prepend-icon="fileContract ? 'icon-excel' : ''"
                      hide-details=""
                      @change="validateFileExcel"
                    />
                    <span
                      v-if="!fileContract"
                      class="text-note btn"
                      @click="openSelectFileListContract"
                    >{{
                      $t(
                        'contract-manager.dialogs.labels.placeholderUploadListContract'
                      )
                    }}</span>
                  </validation-provider>
                  <v-btn
                    :loading="uploadingFile"
                    :disabled="uploadingFile"
                    text
                    fab
                    class="mr-2"
                    @click="openSelectFileListContract"
                  >
                    <v-icon size="30">mdi-upload</v-icon>
                  </v-btn>
                </div>
                <div class="mt-2">
                  <div>
                    {{ $t('contract.format') }}: xls/xlsx
                    <span
                      class="text-danger"
                    >({{ $t('contract.fileMax') }} 50MB)</span>
                  </div>
                </div>
                <div class="note-download">
                  <b>{{
                    $t('contract-manager.dialogs.labels.downloadFileExample')
                  }}<a class="pl-1" @click="downloadFileExcelTemplate">{{
                    $t('contract-manager.dialogs.labels.here')
                  }}</a>
                    !
                  </b>
                </div>
              </div>
            </div>
            <div class="group-upload mt-4">
              <label class="text-uppercase text--label">
                {{ $t('contract-manager.dialogs.labels.fileZip') }}
                <span class="color-require ">*</span>
              </label>
              <div class="group-upload">
                <div
                  class="d-flex justify-space-between align-center border-dasher py-3"
                >
                  <validation-provider
                    ref="fileZipContractProvider"
                    name="fileZipContract"
                    :rules="ruleFileZipContract"
                    class="d-flex align-center px-3"
                  >
                    <v-file-input
                      id="fileZipContract"
                      ref="fileZipContract"
                      v-model="fileZip"
                      :style="fileZipStyle"
                      accept=".zip"
                      show-size
                      truncate-length="25"
                      :loading="uploadingFileZip"
                      class="no-border pa-0 input-file text--caption"
                      :class="fileZip ? '' : 'w-0'"
                      :prepend-icon="fileZip ? 'icon-zip' : ''"
                      hide-details=""
                      @change="validateFileZip"
                    />
                    <span
                      v-if="!fileZip"
                      class="text-note btn"
                      @click="openSelectFileZipContract"
                    >{{
                      $t(
                        'contract-manager.dialogs.labels.placeholderUploadFileZip'
                      )
                    }}</span>
                  </validation-provider>
                  <v-btn
                    :loading="uploadingFileZip"
                    :disabled="uploadingFileZip"
                    text
                    fab
                    class="mr-2"
                    @click="openSelectFileZipContract"
                  >
                    <v-icon size="30">mdi-upload</v-icon>
                  </v-btn>
                </div>
                <div class="mt-2">
                  <div>
                    {{ $t('contract.format') }}: zip
                    <span
                      class="text-danger"
                    >({{ $t('contract.fileMax') }} 50MB)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <v-card-actions class="d-flex justify-end py-6 px-8">
            <v-btn
              rounded
              outlined
              color="primary"
              class="w-150 py-5 mr-4 text--button"
              elevation="0"
              @click="closeDialog"
            >
              {{ $t('cancelLabel') }}
            </v-btn>
            <v-btn
              rounded
              color="primary"
              class="w-150 py-5 text--button"
              elevation="0"
              :disabled="invalid"
              @click="showConfirm = true"
            >
              {{ $t('addLabel') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </validation-observer>
    </v-dialog>
    <!-- Dialog checking data -->
    <v-dialog
      v-model="dialogChecking"
      persistent
      max-width="680"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="d-flex justify-center flex-column">
          <v-icon
            class="close-dialog"
            @click="dialogChecking = false"
          >mdi-close</v-icon>
        </v-card-title>
        <div class="text-center">
          <h5>{{ $t('contract-manager.dialogs.labels.checkingData') }}</h5>
          <v-progress-circular
            indeterminate
            :size="40"
            :width="2"
            color="primary"
            class="my-4"
          />
          <div class="note px-10 pb-5 text--body-2">
            <span class="text-danger">{{ $t('caution') }}: </span>
            <span>{{
              $t('contract-manager.dialogs.labels.noteChecking')
            }}</span>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <!-- Dialog success -->
    <v-dialog
      v-model="dialogSuccess"
      persistent
      :overlay="false"
      max-width="680"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="d-flex justify-center flex-column">
          <v-icon
            class="close-dialog"
            @click="dialogSuccess = false"
          >mdi-close</v-icon>
        </v-card-title>
        <div class="text-center">
          <icon-result type="success" />
          <h5>{{ $t('msgSuccess') }}</h5>
          <div class="note px-10 py-5 text--body-2">
            <span>{{ dataResponse.messageHanleFile }}</span>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <!-- Dialog error -->
    <v-dialog
      v-model="dialogError"
      persistent
      :overlay="false"
      max-width="680"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="d-flex justify-center flex-column">
          <v-icon
            class="close-dialog"
            @click="dialogError = false"
          >mdi-close</v-icon>
        </v-card-title>
        <div v-if="dialogError" class="text-center px-10 pb-5">
          <icon-result type="warning" />
          <h5 class="text-capitalize">{{ dataResponse.messageHanleFile }}</h5>
          <div class="group-upload mt-4 d-flex align-start flex-column">
            <label class="text-uppercase text-danger text--label">
              {{ $t('contract-manager.dialogs.labels.fileError') }}
            </label>
            <div class="group-upload col-12 px-0 pt-0">
              <div
                class="d-flex justify-space-between align-center border-dasher py-3 px-3"
              >
                <div class="file-error d-flex align-center text--caption">
                  <img src="@/assets/icons/xls.svg" class="mr-2">
                  <span>{{ fileErrorName }}</span>
                </div>
                <v-btn
                  color="primary"
                  class="text--button"
                  @click="downloadFileError"
                >
                  <span class="text-capitalize mr-4">{{ $t('download') }}</span>
                  <v-icon size="25">mdi-tray-arrow-down</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <!-- Dialog confirm -->
    <dialog-confirm
      :show-dialog="showConfirm"
      :title-confirm="$t('contract-manager.dialogs.titlteConfirmImport')"
      @accept="uploadListContract"
      @close-dialog="showConfirm = fasle"
    />
    <base-preload :dialog="downloading" />
  </div>
</template>

<script>
// Lib
import { mapActions } from 'vuex'

// Mixin
import rules from '@/mixins/rules'
import fileMixin from '@/modules/econtract/mixins/fileMixin'
import IconResult from './IconResult.vue'

import DialogConfirm from '@/views/components/DialogConfirm'
// Services
import { FileService } from '@/modules/econtract/services/fileService'

export default {
  components: { IconResult, DialogConfirm },
  mixins: [rules, fileMixin],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileContract: null,
      fileZip: null,
      uploadingFileZip: false,
      uploadingFile: false,
      dialogChecking: false,
      dialogSuccess: false,
      dialogError: false,
      dataResponse: {},
      downloading: false,
      showConfirm: false,
      fileErrorName: ''
    }
  },
  methods: {
    ...mapActions('layout', ['setNotify']),

    fileStyle() {
      return {
        opacity: this.fileContract != null ? 1 : 0
      }
    },
    fileZipStyle() {
      return {
        opacity: this.fileZip != null ? 1 : 0
      }
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
    accept() {
      this.dialogChecking = true
      setTimeout(() => {
        this.dialogChecking = false
        this.dialogSuccess = true
      }, 3000)
      this.$emit('accept')
    },
    // Open popup select file danh sach hop dop
    openSelectFileListContract() {
      document.getElementById('fileContract').click()
    },
    // Open popup select file danh sach hop dop
    openSelectFileZipContract() {
      document.getElementById('fileZipContract').click()
    },
    async validateFileExcel() {
      const {
        valid,
        errors
      } = await this.$refs.fileListContractProvider.validate(this.fileContract)
      if (!valid) {
        const content = errors[0]
        const type = 'warning'
        this.setNotify({ show: true, type, content })
        this.fileContract = null
        return
      }
    },
    async validateFileZip() {
      const {
        valid,
        errors
      } = await this.$refs.fileZipContractProvider.validate(this.fileZip)
      if (!valid) {
        const content = errors[0]
        const type = 'warning'
        this.fileZip = null
        this.setNotify({ show: true, type, content })
        return
      }
    },
    genFileErrorName(fileName) {
      this.fileErrorName = `${this.$t('fileError')}-${fileName}`
    },
    async downloadFileError() {
      if (this.dataResponse && this.dataResponse.totalErr) {
        const { resultFile } = this.dataResponse
        const fileData = {
          ...resultFile,
          fileName: this.fileErrorName,
          filePath: `${resultFile.pathOfErrorFile}${resultFile.fileName}`
        }
        await this.downloadFileSign(fileData)
      }
    },
    // upload file hop dong
    async uploadListContract() {
      try {
        this.dialogChecking = true
        // Upload file
        var formData = new FormData()
        formData.append('excelFile', this.fileContract)
        formData.append('zipFile', this.fileZip)
        const response = await FileService.uploadFileExcel(formData)
        const isError = +response.data.totalErr !== 0
        this.dataResponse = response.data
        if (isError) {
          this.genFileErrorName(this.fileContract.name)
          this.dialogError = true
          return
        }
        this.dialogSuccess = true
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.dialogChecking = false
        this.fileContract = null
        this.fileZip = null
      }
    },
    // Tai file template mau
    async downloadFileExcelTemplate() {
      this.downloading = true
      try {
        await FileService.downloadFileExcelTemplate()
      } catch (error) {
        console.log('====================================')
        console.log(error.message)
        console.log('====================================')
      } finally {
        this.downloading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.group-upload {
  label {
    color: #22242c;
    font-weight: 700;
  }
  .text-note {
    color: #252733;
  }
}
</style>
