<template>
  <div class="wrap--list-common edocument-font wrap-management">
    <v-container fluid class="py-0">
      <breadcrumbs :items="breadcrumbs" clazz="pt-0" />
      <v-card color="white" class="content-page-management rounded-xl px-0">
        <div>
          <div class="wrap-content-contract py-15">
            <div>
              <div class="col-12 row pb-0 justify-space-around ma-0">
                <!-- Ten van ban -->
                <div class="form-group py-0 col-12 col-sm-4 col-md-4">
                  <div>
                    <label class="edoc-text--body-4">
                      {{ $t('managementDoc.managementName') }}
                      <span class="color-require">*</span></label>
                    <validation-provider
                      v-slot="{ errors }"
                      name="managementName"
                      rules="required"
                    >
                      <v-text-field
                        v-model="documentTitle"
                        dense
                        maxlength="500"
                        counter="500"
                        autofocus
                        flat
                        solo
                        :placeholder="
                          $t('managementDoc.placeholder.managementName')
                        "
                        outlined
                        :error-messages="errors"
                        required
                        class="edoc-text--body-2"
                        @change="trimSpaceContractName"
                      />
                    </validation-provider>
                  </div>
                </div>
                <!-- hinh thuc van ban -->
                <div class="form-group py-0 col-12 col-sm-4 col-md-4">
                  <div>
                    <label class="edoc-text--body-4">
                      {{ $t('managementDoc.formulaType') }}
                      <span class="color-require">*</span></label>
                    <validation-provider
                      v-slot="{ errors }"
                      name="formulaType"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model.trim="formulaTypeId"
                        dense
                        :placeholder="
                          $t('managementDoc.placeholder.formulaType')
                        "
                        outlined
                        attach
                        :no-data-text="$t('noData')"
                        required
                        :error-messages="errors"
                        :filter="filterItems"
                        :menu-props="{
                          bottom: true,
                          offsetY: true,
                          maxHeight: 220
                        }"
                        :items="lstDocType"
                        :item-text="(item) => $t(item.name)"
                        item-value="id"
                        class="edoc-text--body-2"
                      >
                        <vue-feather
                          slot="append"
                          class="grey--text"
                          type="search"
                        />
                      </v-autocomplete>
                    </validation-provider>
                  </div>
                </div>
              </div>

              <div class="d-flex col-12 justify-space-around py-0 mt-3">
                <div class="form-group col-12 col-sm-4">
                  <div>
                    <label class="edoc-text--body-4">
                      {{ $t('contract.label.fileSign') }}
                      <span class="color-require">*</span></label>
                    <div class="d-flex justify-space-between align-center">
                      <validation-provider
                        ref="contractSignedProvider"
                        :rules="ruleFileDocument"
                        name="fileSign"
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
                            <span>{{ customFileNameUpload(file) }}</span>
                            <v-btn
                              :disabled="uploadingFile"
                              class="remove-attach"
                              icon
                              @click="removeFileDocument(index)"
                            ><v-icon>mdi-close</v-icon></v-btn>
                            <!-- <v-btn
                                class="download-attach ml-2"
                                icon
                                @click="downloadFileDocument(index)"
                              ><v-icon>mdi-tray-arrow-down</v-icon></v-btn> -->
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
                        <div class="edoc-text--body-2">
                          {{ $t('contract.format') }}: pdf
                        </div>
                        <div class="text-danger edoc-text--body-2">
                          ({{ $t('contract.fileMax') }} 50MB)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- tai file dinh kem -->
                <div class="form-group col-12 col-sm-4">
                  <div>
                    <label class="edoc-text--body-4">
                      {{ $t('contract.attachmentsFile') }}
                    </label>
                    <div class="d-flex justify-space-between align-center">
                      <validation-provider
                        ref="providerFileAttachs"
                        :rules="ruleFileAttachsDoc"
                        name="fileAttachsFile"
                      >
                        <input
                          id="fileAttachsInput"
                          ref="fileAttachsInput"
                          type="file"
                          multiple
                          hidden
                          accept=".xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.txt,.msg"
                          @change="selectAttachs"
                        >
                        <ul class="list-files">
                          <li
                            v-for="(file, index) in nameFileAttachs"
                            :key="index"
                          >
                            <img
                              :src="getIconFile(`${file.fileName}`)"
                              class="mr-2"
                            >
                            <span>{{ customFileNameUpload(file) }}</span>
                            <v-btn
                              :disabled="uploadingFile"
                              class="remove-attach"
                              icon
                              @click="removeFileAttach(index)"
                            ><v-icon>mdi-close</v-icon></v-btn>
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
                        <div class="edoc-text--body-2">
                          {{ $t('contract.format') }}: pdf, doc, docx, xlsx, xls, png, jpg, msg, txt
                        </div>
                        <div class="text-danger edoc-text--body-2">
                          ({{ $t('contract.fileMax') }} 50MB)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              class="d-flex justify-end mt-15 group-action-step rounded-b-xl"
            >
              <v-btn
                class="my-2 w-150 py-5 mr-10"
                color="#0FAFE4"
                outlined
                rounded
                @click="showDialogCancel = true"
              >
                <span class="text-primary edoc-text--button">
                  {{ $t('cancelLabel') }}</span>
              </v-btn>

              <v-btn
                class="my-2 w-150 py-5 edoc-text--button"
                :disabled="!completed"
                rounded
                color="primary"
                @click="showConfirmContract = true"
              >
                {{ $t('saveLabel') }}
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
      <dialog-cancel
        :show-dialog="showDialogCancel"
        @close-dialog="showDialogCancel = false"
      />
      <dialog-confirm-save
        title-confirm="managementDoc.titleConfirmSave.updateDocument"
        :show-dialog="showConfirmContract"
        @close-dialog="showConfirmContract = false"
        @accept-action="saveManagementDoc(isUpdate, documentId)"
      />
      <base-material-snackbar
        v-model="isShowAlert"
        :type="typeAlert"
        v-bind="{
          top: true,
          right: true
        }"
      >
        <div v-html="message" />
      </base-material-snackbar>
      <base-preload :dialog="loading" />
    </v-container>
  </div>
</template>

<script>
import edocumentRoute from '@/modules/edocument/router/routePaths'
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'

// dialog
import mixinManagementDoc from '../mixin/mixinManagementDoc'
import DialogCancel from '@/modules/edocument/views/components/DialogCancel'
import DialogConfirmSave from '@/modules/edocument/views/components/DialogConfirmSave'
import { DocumentService } from '@/modules/edocument/services/documentService.js'

export default {
  name: 'UpdateManagementDoc',
  components: {
    Breadcrumbs,
    DialogCancel,
    DialogConfirmSave
  },
  mixins: [mixinManagementDoc],
  data() {
    return {
      breadcrumbs: [
        {
          text: 'documentManager',
          disabled: false,
          href: `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}`
        },
        {
          text: 'managementDoc.updateManagementDoc',
          disabled: true,
          href: ''
        }
      ],
      isUpdate: true,
      documentId: null
    }
  },
  async created() {
    await Promise.all([this.getDocFormula(), this.getInfoDocPersonal()])
  },

  methods: {
    async getInfoDocPersonal() {
      try {
        this.documentId = this.$route.params.documentId
        const response = await DocumentService.getInfoDocPersonal(this.documentId)
        if (response.data) {
          this.documentTitle = response.data.documentTitle
          this.formulaTypeId = response.data.formulaTypeId
          this.initFileMain(response.data)
          this.initFileAttachs(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    },

    async initFileMain(data) {
      this.uploadingFile = true
      this.nameFileDocuments = []
      if (data.fileMainSigns) {
        await this.setFileDocument(data.fileMainSigns)
        this.nameFileDocuments = data.fileMainSigns
      }
      this.uploadingFile = false
    },

    async initFileAttachs(data) {
      if (data.fileAttachments) {
        data.fileAttachments.map((file) => {
          file.name = file.fileName
          file.size = file.fileSize
        })
        await this.setFileAttachs(data.fileAttachments)
        this.nameFileAttachs = data.fileAttachments
      }
    }
  }
}
</script>
