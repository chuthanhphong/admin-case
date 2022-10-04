<template>
  <div class="wrap--list-common edocument-font">
    <v-container fluid class="py-0">
      <breadcrumbs :items="breadcrumbs" clazz="pt-0" />
      <v-card color="white" class="content-page rounded-xl px-0">
        <div class="wrap-content-document pb-15">
          <!-- Ten van ban -->
          <div class="col-12 row pb-0 justify-space-around ma-0">
            <div class="form-group py-0 col-12 col-sm-11 col-md-11">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.managementName') }}
                <span class="color-require">*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="managementName"
                rules="required|max:500"
              >
                <v-text-field
                  v-model="documentTitle"
                  dense
                  maxlength="500"
                  counter="500"
                  autofocus
                  flat
                  solo
                  :placeholder="$t('managementDoc.placeholder.managementName')"
                  outlined
                  :error-messages="errors"
                  required
                  class="edoc-text--body-2"
                  @change="trimSpaceContractName"
                />
              </validation-provider>
            </div>
          </div>

          <!-- hang 2 -->
          <div class="col-12 row pb-0 justify-space-around ma-0">
            <!-- Loai van ban -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.documentType') }}
                <span class="color-require">*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="documentType"
                rules="required"
              >
                <v-text-field
                  v-model="docType"
                  dense
                  flat
                  solo
                  disabled
                  :placeholder="$t('managementDoc.placeholder.documentType')"
                  outlined
                  :error-messages="errors"
                  required
                  class="edoc-text--body-2"
                  @change="trimSpaceContractName"
                />
              </validation-provider>
            </div>

            <!-- hinh thuc van ban -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.formulaType') }}
                <span class="color-require">*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="formulaType"
                rules="required"
              >
                <v-autocomplete
                  v-model.trim="formulaTypeId"
                  dense
                  :placeholder="$t('managementDoc.placeholder.formulaType')"
                  outlined
                  attach
                  :no-data-text="$t('noData')"
                  required
                  :error-messages="errors"
                  :filter="filterItems"
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :items="lstDocType"
                  :item-text="(item) => $t(item.name)"
                  item-value="id"
                  class="edoc-text--body-2"
                  @change="selectFormula(formulaTypeId)"
                >
                  <vue-feather slot="append" class="grey--text" type="search" />
                </v-autocomplete>
              </validation-provider>
            </div>

            <!-- Don vi ban hanh -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.promulgateGroup') }}
                <span class="color-require">*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="promulgateGroup"
                rules="required"
              >
                <v-autocomplete
                  v-model.trim="formdata.promulgateGroupId"
                  dense
                  :placeholder="$t('managementDoc.updateDoc.promulgateGroup')"
                  outlined
                  attach
                  :no-data-text="$t('noData')"
                  required
                  :error-messages="errors"
                  :filter="filterItems"
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :disabled="disableBySignatureDoc"
                  :items="lstGroupProclaim"
                  item-text="groupName"
                  item-value="groupId"
                  class="edoc-text--body-2"
                >
                  <vue-feather slot="append" class="grey--text" type="search" />
                  <template v-slot:item="data">
                    <div class="select-item flex-column d-flex">
                      <div class="title-item">
                        {{ data.item.groupName }}
                      </div>
                      <div class="desc-item">
                        {{ data.item.parentPathName }}
                      </div>
                    </div>
                  </template>
                </v-autocomplete>
              </validation-provider>
            </div>
          </div>

          <!-- hang 3 -->
          <div class="col-12 row pb-0 justify-space-around ma-0">
            <!-- Ngay ban hanh -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <div class="date-picker">
                <label class="edoc-text--body-4">
                  {{ $t('managementDoc.updateDoc.datePromulgate') }}
                  <span class="color-require">*</span>
                </label>
                <v-menu
                  v-model="openDateProclaim"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  attach
                  bottom
                  nudge-bottom="50"
                  min-width="270px"
                  max-width="270px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateProclaimValue"
                      outlined
                      placeholder="DD/MM/YYYY"
                      dense
                      v-bind="attrs"
                      append-icon="mdi-calendar-range"
                      class="edoc-text--body-2"
                      :error-messages="$t(errorDateProclaim)"
                      v-on="on"
                      @click:append="openDateProclaim = !openDateProclaim"
                    />
                  </template>
                  <v-date-picker
                    v-model="dateProclaimPicker"
                    format="DD/MM/YYYY"
                    :locale="localDate"
                    no-title
                    @input="openDateProclaim = false"
                  />
                </v-menu>
              </div>
            </div>

            <!-- So thuoc don vi -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.noteOfGroup') }}
                <span class="color-require">*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="noteOfGroup"
                rules="required"
              >
                <v-autocomplete
                  v-model.trim="bookGroupId"
                  dense
                  :placeholder="$t('managementDoc.placeholder.noteOfGroup')"
                  outlined
                  attach
                  :no-data-text="$t('noData')"
                  required
                  :error-messages="errors"
                  :filter="filterItems"
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :items="lstGroupBook"
                  item-text="groupName"
                  item-value="groupId"
                  class="edoc-text--body-2"
                  @change="selectBookGroup(bookGroupId)"
                >
                  <vue-feather slot="append" class="grey--text" type="search" />

                  <template v-slot:item="data">
                    <div class="select-item flex-column d-flex">
                      <div class="title-item">
                        {{ data.item.groupName }}
                      </div>
                      <div class="desc-item">
                        {{ data.item.parentPathName }}
                      </div>
                    </div>
                  </template>
                </v-autocomplete>
              </validation-provider>
            </div>

            <!-- So van ban -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.documentNumber') }}
                <span class="color-require">*</span>
              </label>
              <small class="ml-1 label-unti">
                ({{ $t('managementDoc.updateDoc.numberContineu') }}:
                <span>{{ suggestNumber }}</span>)
              </small>
              <v-text-field
                v-model="documentNumber"
                dense
                flat
                solo
                maxlength="10"
                :placeholder="$t('managementDoc.placeholder.documentNumber')"
                outlined
                :error-messages="$t(messageError)"
                class="edoc-text--body-2"
                oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
                @input="onInputRegister()"
              />
            </div>
          </div>

          <!-- hang 4 -->
          <div class="col-12 row pb-0 justify-space-around ma-0">
            <!-- So ky hieu van ban -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.symbolDocument') }}
                <span class="color-require">*</span>
                <v-tooltip right content-class="tooltip-right">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      color="#8E8EA1"
                      dense
                      class="margin-b1"
                      v-on="on"
                    >
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>{{ $t('tooltipSymbolDoc') }}</span>
                </v-tooltip>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="symbolDocument"
                rules="required|max:100"
              >
                <v-text-field
                  v-model="code"
                  dense
                  flat
                  maxlength="100"
                  solo
                  :placeholder="$t('managementDoc.placeholder.symbolDocument')"
                  outlined
                  :error-messages="errors"
                  required
                  class="edoc-text--body-2"
                  @change="code = trimSpace(code)"
                />
              </validation-provider>
            </div>

            <!-- Do mat -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.density') }}
                <span class="color-require">*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="density"
                rules="required"
              >
                <v-select
                  v-model="formdata.securityTypeId"
                  dense
                  :placeholder="$t('managementDoc.placeholder.density')"
                  outlined
                  attach
                  :error-messages="errors"
                  :no-data-text="$t('noData')"
                  required
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :items="lstSecurity"
                  item-text="name"
                  item-value="id"
                  class="edoc-text--body-2"
                  @change="changeSecurity"
                >
                  <template v-slot:append>
                    <v-icon>mdi-chevron-down</v-icon>
                  </template>
                </v-select>
              </validation-provider>
            </div>

            <!-- Do khan -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.urgency') }}
                <span class="color-require">*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="urgency"
                rules="required"
              >
                <v-select
                  v-model="formdata.priorityId"
                  dense
                  :placeholder="$t('managementDoc.placeholder.urgency')"
                  outlined
                  attach
                  :error-messages="errors"
                  :no-data-text="$t('noData')"
                  required
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :items="lstUrgency"
                  item-text="name"
                  item-value="id"
                  class="edoc-text--body-2"
                >
                  <template v-slot:append>
                    <v-icon>mdi-chevron-down</v-icon>
                  </template>
                </v-select>
              </validation-provider>
            </div>
          </div>

          <!-- hang 5 -->
          <div class="col-12 row pb-0 justify-space-around ma-0">
            <!-- Nganh -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.branch') }}
              </label>
              <v-select
                v-model="formdata.occupationId"
                dense
                :placeholder="$t('managementDoc.placeholder.branch')"
                outlined
                attach
                :no-data-text="$t('noData')"
                :menu-props="{
                  bottom: true,
                  offsetY: true
                }"
                class="edoc-text--body-2"
                :items="lstOccupation"
                item-text="name"
                item-value="id"
              >
                <template v-slot:append>
                  <v-icon>mdi-chevron-down</v-icon>
                </template>
              </v-select>
            </div>

            <!-- Het hieu luc -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <div class="date-picker">
                <label class="edoc-text--body-4">
                  {{ $t('managementDoc.updateDoc.timeExpired') }}
                </label>
                <v-menu
                  v-model="openProcessing"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  attach
                  bottom
                  nudge-bottom="50"
                  min-width="270px"
                  max-width="270px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="processingValue"
                      outlined
                      placeholder="DD/MM/YYYY"
                      dense
                      v-bind="attrs"
                      append-icon="mdi-calendar-range"
                      :error-messages="$t(errorProcessing)"
                      class="edoc-text--body-2"
                      v-on="on"
                      @click:append="openProcessing = !openProcessing"
                    />
                  </template>
                  <v-date-picker
                    v-model="processingPicker"
                    format="DD/MM/YYYY"
                    :locale="localDate"
                    no-title
                    @input="openProcessing = false"
                  />
                </v-menu>
              </div>
            </div>

            <!-- Noi nhan van ban -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.receiveDoc') }}
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="receiveDoc"
                rules="max:500"
              >
                <v-text-field
                  v-model="formdata.receivePlace"
                  dense
                  flat
                  maxlength="500"
                  solo
                  :placeholder="$t('managementDoc.placeholder.receiveDoc')"
                  outlined
                  :error-messages="errors"
                  class="edoc-text--body-2"
                  @change="
                    formdata.receivePlace = trimSpace(formdata.receivePlace)
                  "
                />
              </validation-provider>
            </div>
          </div>

          <!-- hang 6 -->
          <div class="col-12 row pb-0 justify-space-around ma-0">
            <!-- Noi nhan ban luu -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.receiveSave') }}
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="receiveSave"
                rules="max:500"
              >
                <v-text-field
                  v-model="formdata.handCopyPlace"
                  dense
                  flat
                  maxlength="500"
                  solo
                  :placeholder="$t('managementDoc.placeholder.receiveSave')"
                  outlined
                  :error-messages="errors"
                  class="edoc-text--body-2"
                  @change="
                    formdata.handCopyPlace = trimSpace(
                      formdata.handCopyPlace
                    )
                  "
                />
              </validation-provider>
            </div>

            <!-- So ban luu -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.numberSave') }}
              </label>
              <v-text-field
                v-model="numberOfCopy"
                dense
                flat
                solo
                :placeholder="$t('managementDoc.placeholder.numberSave')"
                outlined
                :error-messages="$t(messageErrorCopy)"
                class="edoc-text--body-2"
                maxlength="3"
                oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
                @input="onInputCopy()"
              />
            </div>

            <!-- Khoang trong -->
            <div class="form-group py-0 col-12 col-sm-3 col-md-3" />
          </div>

          <!-- Nguoi ky -->
          <div class="col-12 row pb-0 justify-space-around ma-0">
            <div class="form-group py-0 col-12 col-sm-11">
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.signer') }}
              </label>
            </div>
          </div>

          <div class="col-12 row pb-0 justify-space-around ma-0">
            <div class="col-11 py-0">
              <div class="wrap-list-signer py-0">
                <signer-item
                  v-for="(signer, index) in formdata.externalSigners"
                  :key="index"
                  :signer="signer"
                  :index="index + 1"
                  :show-remove="formdata.externalSigners.length > 1"
                  :formdata="formdata"
                  :disabled="disableBySignatureDoc"
                  @remove-signer="removeSigner"
                  @validate-duplicates="validateDuplicates"
                />
              </div>
              <div v-show="showBtnAdd">
                <btn-add
                  :tooltip="$t('managementDoc.updateDoc.addSigner')"
                  @on-click="addSigner"
                />
              </div>
            </div>
          </div>

          <!-- file -->
          <div class="d-flex col-12 justify-space-around py-0 mt-3">
            <div class="form-group col-11 col-sm-5 d-flex justify-start">
              <div class="col-sm-10 pa-0">
                <label class="edoc-text--body-4">
                  {{ $t('contract.label.fileSign') }}
                  <span class="color-require">*</span>
                  <v-tooltip right content-class="tooltip-right">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" color="#8E8EA1" dense v-on="on">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <span>{{ $t('tooltipFileSign') }}</span>
                  </v-tooltip>
                </label>
                <div class="d-flex justify-space-between align-center">
                  <validation-provider
                    ref="contractSignedProvider"
                    :rules="ruleFileContract"
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
                        :class="
                          (disableBySignatureDoc && 'disable-edit-file') || ''
                        "
                      >
                        <img
                          :src="getIconFile(`${file.fileName}`)"
                          class="mr-2"
                        >
                        <span>{{ customFileNameUpload(file) }}</span>
                        <v-btn
                          v-show="!disableBySignatureDoc"
                          :disabled="uploadingFile"
                          class="remove-attach"
                          icon
                          @click="removeFileDocument(index)"
                        ><v-icon>mdi-close</v-icon></v-btn>
                        <v-btn
                          v-show="!disableBySignatureDoc"
                          class="download-attach ml-2"
                          icon
                          @click="downloadFileDocument(index)"
                        ><v-icon>mdi-tray-arrow-down</v-icon></v-btn>
                      </li>
                    </ul>
                  </validation-provider>

                  <v-btn
                    v-show="!disableBySignatureDoc"
                    outlined
                    :loading="uploadingFile"
                    :disabled="uploadingFile"
                    class="btn-upload"
                    @click="uploadContract"
                  >
                    <v-icon size="30">mdi-upload</v-icon>
                  </v-btn>
                </div>
                <div class="d-flex justify-space-between align-center mt-3">
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
            <div class="form-group col-11 col-sm-5 d-flex justify-end">
              <div class="col-sm-10 pa-0">
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
                      accept=".xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.txt"
                      @change="selectAttachs"
                    >
                    <ul class="list-files edoc-text--caption">
                      <li
                        v-for="(file, index) in nameFileAttachsNotremove"
                        :key="index"
                        :class="
                          (disableBySignatureDoc && 'disable-edit-file') || ''
                        "
                      >
                        <img
                          :src="getIconFile(`${file.fileName}`)"
                          class="mr-2"
                        >
                        <span>{{ customFileNameUpload(file) }}</span>
                        <v-btn
                          v-show="!disableBySignatureDoc"
                          class="remove-attach"
                          @click="removeFileAttach(index)"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </li>
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
                    class="btn-upload"
                    :loading="uploadingFileAttatch"
                    :disabled="uploadingFileAttatch || true"
                    @click="uploadAttachs"
                  >
                    <v-icon size="30">mdi-upload</v-icon>
                  </v-btn>
                </div>
                <div class="d-flex justify-space-between align-center mt-3">
                  <div>
                    <div class="edoc-text--body-2">
                      {{ $t('contract.format') }}: pdf, doc, docx, xlsx, xls,
                      png, jpg, msg, txt
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

        <!-- Button -->
        <div class="d-flex justify-end mt-15 group-action-step rounded-b-xl">
          <v-btn
            class="my-2 w-150 py-5 mr-10"
            color="#0FAFE4"
            outlined
            rounded
            @click="showDialogCancel = true"
          >
            <span class="text-primary edoc-text--button">
              {{ $t('cancelLabel') }}
            </span>
          </v-btn>

          <v-btn
            class="my-2 w-150 py-5 edoc-text--button"
            :disabled="!isComplete"
            rounded
            color="primary"
            @click="onShowDialogConfirmSave()"
          >
            {{ $t('saveLabel') }}
          </v-btn>
        </div>
      </v-card>

      <dialog-cancel
        :show-dialog="showDialogCancel"
        @close-dialog="showDialogCancel = false"
      />
      <dialog-confirm-save
        title-confirm="managementDoc.titleConfirmSave.updateDocument"
        :show-dialog="showConfirmContract"
        :show-warning="showWarning"
        @close-dialog="showConfirmContract = false"
        @accept-action="saveDocument()"
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
import SignerItem from '@/modules/edocument/views/components/SignerItem.vue'
import BtnAdd from '@/modules/edocument/views/components/BtnAdd.vue'
import groupBy from 'lodash/groupBy'
import moment from 'moment'
import { DocumentService } from '@/modules/edocument/services/documentService.js'
import { isNull, isEmpty } from 'lodash'
import constants from "@/constants";

const initFormData = {
  documentId: null,
  documentTitle: '',
  formulaTypeId: null,
  promulgateGroupId: null,
  promulgateGroupName: '',
  promulgateDate: null,
  bookGroupId: null,
  documentNumber: '', // So van ban.
  code: '', // So, ky hieu van ban.
  securityTypeId: null, // Do mat.
  priorityId: null, // Do khan.
  occupationId: null, // Nganh.
  expiredDate: null, // Het hieu luc,
  receivePlace: '', // Noi nhan van ban.
  handCopyPlace: ''
}

const initSignerData = {
  groupId: '',
  groupName: '',
  signFullName: '',
  signUserName: '',
  signUserId: '',
  email: '',
  phoneNumber: '',
  signingStep: ''
}

export default {
  name: 'UpdateManagementDoc',
  components: {
    SignerItem,
    Breadcrumbs,
    DialogCancel,
    DialogConfirmSave,
    BtnAdd
  },
  mixins: [mixinManagementDoc],
  data() {
    return {
      numberOfCopy: null,
      messageErrorCopy: null,
      showBtnAdd: true,

      docType: '',
      isUpdate: true,
      formdata: {
        ...initFormData
      },
      lstGroupProclaim: [],
      lstUrgency: [],
      lstOccupation: [],
      lstSecurity: [],
      lstGroupBook: [],

      // Date Proclaim.
      openDateProclaim: false,
      errorDateProclaim: null,
      dateProclaimValue: null,
      dateProclaimPicker: null,

      // Processing deadline.
      openProcessing: false,
      errorProcessing: null,
      processingValue: null,
      processingPicker: null,

      isFirstLoad: false,
      loading: false,
      messageError: null,
      isGetSugget: false,

      documentId: null,
      documentType: null,
      disableBySignatureDoc: false,
      isComplete: false,

      formulaTypeId: null,
      bookGroupId: null,
      documentTitle: '',
      code: '',
      documentNumber: '',
      suggestNumber: '',
      showWarning: false,
      groupCode: '',
      groupName: '',
      formulaTypeCode: '',
      bookGroupCode: null,

      nameFileAttachsNotremove: [],
      checkManagement: false
    }
  },

  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },
    breadcrumbs() {
      const check = localStorage.getItem(
        constants.SEARCH_TYPE_DOCUMENT.SEARCH_TYPE_DOC
      );
      let linkHref = `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}`;
      let title = "documentManager";
      if (check === constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_BOOK_GO) {
        // tab = 0
        linkHref = `${edocumentRoute.DOCUMENT_BOOK_PATH}?currentTab=0`;
        title = "document.bookTitle";
        this.checkManagementFunction()
      }

      return [
        {
          text: title,
          disabled: false,
          href: linkHref,
        },
        {
          text: 'editDocument',
          disabled: true,
          href: ''
        },
      ];
    },
  },

  watch: {
    async dateProclaimPicker(date) {
      if (date) {
        this.dateProclaimValue = this.formatDate(date)
        this.getSuggestNumber()
      }
    },

    dateProclaimValue() {
      if (this.dateProclaimValue) {
        var isValid = moment(
          this.dateProclaimValue,
          'DD/MM/YYYY',
          true
        ).isValid()

        if (!isValid) {
          this.errorDateProclaim = 'managementDoc.validate.dateProclaimInvalid'
          this.dateProclaimPicker = null
          return
        } else {
          this.dateProclaimPicker = moment(
            this.dateProclaimValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')

          // Check (Han xu ly < Ngay ban hanh)
          const dateProclaim = moment(this.dateProclaimValue, 'DD/MM/YYYY')
          const dateProcessing = moment(this.processingValue, 'DD/MM/YYYY')
          this.errorProcessing = null
          if (dateProclaim > dateProcessing) {
            this.errorProcessing = 'managementDoc.validate.processingError1'
          }

          this.errorDateProclaim = null
          return
        }
      } else {
        this.dateProclaimPicker = null
        this.errorDateProclaim = 'managementDoc.validate.errorDateProclaim'
      }
    },

    processingPicker(date) {
      if (date) {
        this.processingValue = this.formatDate(date)
      }
    },

    processingValue() {
      if (this.processingValue) {
        var isValidDate = moment(
          this.processingValue,
          'DD/MM/YYYY',
          true
        ).isValid()

        if (!isValidDate) {
          this.errorProcessing = 'managementDoc.validate.dateExpireInvalid'
          this.processingPicker = null
          return
        } else {
          this.processingPicker = moment(
            this.processingValue,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')

          // Check (Han xu ly < Ngay ban hanh)
          const dateProclaim = moment(this.dateProclaimValue, 'DD/MM/YYYY')
          const dateProcessing = moment(this.processingValue, 'DD/MM/YYYY')
          if (dateProclaim > dateProcessing) {
            this.errorProcessing = 'managementDoc.validate.processingError1'
            return
          }

          this.errorProcessing = null
          return
        }
      } else {
        this.processingPicker = null
        this.errorProcessing = null
      }
    },

    formulaTypeId() {
      this.isValidStep()
    },

    bookGroupId() {
      this.isValidStep()
    },

    documentTitle() {
      this.isValidStep()
    },

    errorDateProclaim() {
      this.isValidStep()
    },

    code() {
      this.isValidStep()
    },

    errorProcessing() {
      this.isValidStep()
    }
  },

  async created() {
    this.initDate()
    this.formdata = {
      ...initFormData,
      externalSigners: [{ ...initSignerData }]
    }

    await Promise.all([
      this.getBookGroup(),
      this.getDocType(),
      this.getProclaimGroup(),
      this.getSecurity(),
      this.getPriority(),
      this.getOccupation()

    ])
    this.messageError = null
    await this.getInfoDoc()

    // await this.getSuggestNumber()
    // this.onInputRegister()
  },

  beforeDestroy() {
    localStorage.setItem(constants.SEARCH_TYPE_DOCUMENT.SEARCH_TYPE_DOC, null);
  },

  methods: {

    checkManagementFunction() {
      this.checkManagement = true
    },

    selectBookGroup(bookId) {
      const book = this.lstGroupBook.find(item => { return item.groupId === bookId })
      if (book) {
        this.bookGroupCode = book.groupCode
      }
      this.suggetCodeDocument()
      this.getSuggestNumber()
    },
    onInputRegister() {
      this.messageError = null
      this.suggetCodeDocument()
      if (this.documentNumber && this.documentNumber <= 0) {
        this.messageError = 'managementDoc.validate.documentNumber'
        return this.messageError
      }
      if (!this.documentNumber) {
        this.messageError = 'managementDoc.validate.documentNumberInvalid'
        return this.messageError
      }
    },
    onInputCopy() {
      this.messageErrorCopy = null
      if (this.numberOfCopy && this.numberOfCopy <= 0) {
        this.messageErrorCopy = 'managementDoc.validate.numberOfCopy'
        return this.messageErrorCopy
      }
    },
    trimSpace(val) {
      return val ? val.trim() : ''
    },

    suggetCodeDocument() {
      if (this.formulaTypeCode && this.bookGroupCode) {
        this.code = `${
          this.documentNumber
        }/${this.formulaTypeCode.toUpperCase()}-${this.bookGroupCode.toUpperCase()}`
      }
    },

    selectFormula(val) {
      const group = this.lstDocType.find((g) => g.id === val)
      if (group) {
        this.formulaTypeCode = group.code
      }
      this.suggetCodeDocument()
    },

    isValidStep() {
      this.isComplete =
        !isNull(this.formulaTypeId) &&
        !isNull(this.bookGroupId) &&
        !isEmpty(this.documentTitle) &&
        isEmpty(this.errorDateProclaim) &&
        !isEmpty(this.code) &&
        isNull(this.messageError) &&
        !isEmpty(this.documentNumber) &&
        isNull(this.errorProcessing)
    },

    async getInfoDoc() {
      try {
        this.loading = true
        this.documentId = this.$route.params.documentId
        this.documentType = this.$route.params.documentType

        // Case sua vb ky.
        if (this.documentType && this.documentType === 'INTERNAL_DOCUMENT') {
          this.disableBySignatureDoc = true
          this.showBtnAdd = false
          const response = await DocumentService.getInfoDocPersonal(
            this.documentId
          )
          if (response.data) {
            this.formdata.documentId = this.documentId
            this.formdata.promulgateGroupId = response.data.promulgateGroupId
            this.formdata.securityTypeId = response.data.securityTypeId
            this.formdata.priorityId = response.data.priorityId
            this.formdata.occupationId = response.data.occupationId
            this.formdata.externalSigners = response.data.signers
            this.code = response.data.documentPromulgate.code
            this.formdata.receivePlace = response.data.documentPromulgate.receivePlace
            this.formdata.handCopyPlace = response.data.documentPromulgate.handCopyPlace
            this.numberOfCopy = response.data.documentPromulgate.numberOfCopy

            this.dateProclaimValue = response.data.documentPromulgate.promulgateDate
            this.processingValue = response.data.documentPromulgate.expireDate
            this.formulaTypeId = response.data.formulaTypeId
            const group = this.lstDocType.find((g) => g.id === this.formulaTypeId)
            if (group) {
              this.formulaTypeCode = group.code
            }
            this.bookGroupId = response.data.documentPromulgate.bookGroupId
            const book = this.lstGroupBook.find(item => { return item.groupId === this.bookGroupId })
            if (book) {
              this.bookGroupCode = book.groupCode
            }
            this.documentTitle = response.data.documentTitle
            this.documentNumber = response.data.documentPromulgate.documentNumber
            this.docType = this.$t('contract.documnetSend')
            await this.initFileMain(response.data)
            await this.initFileAttachs(response.data)
            await this.getSuggestNumber()
            this.loading = false
          }
        }
      } catch (error) {
        this.loading = false
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
        this.nameFileAttachsNotremove = data.fileAttachments
      }
    },

    async getDocType() {
      try {
        const response = await DocumentService.getDocType()
        this.lstTypeDoc = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async getSecurity() {
      try {
        const response = await DocumentService.getListSecurity()
        this.lstSecurity = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async getPriority() {
      try {
        const response = await DocumentService.getDocPriority()
        this.lstUrgency = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async getOccupation() {
      try {
        const response = await DocumentService.getListOccupation()
        this.lstOccupation = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async getBookGroup() {
      try {
        const response = await DocumentService.getBookGroup()
        this.lstGroupBook = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async getProclaimGroup() {
      try {
        const param = {
          pageSize: 1000000,
          restrictHierarchy: 'false'
        }
        const response = await DocumentService.search(param)
        this.lstGroupProclaim = response.data.data
        var itemGroup = this.lstGroupProclaim.find(
          (item) => item.groupId === this.formdata.promulgateGroupId
        )
        if (itemGroup) {
          this.groupCode = itemGroup.groupCode
          this.groupName = itemGroup.groupName
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getSuggestNumber() {
      try {
        if (
          !this.bookGroupId ||
          !this.formdata.securityTypeId ||
          !this.dateProclaimValue
        ) {
          return
        }

        const param = {
          bookGroupId: this.bookGroupId,
          securityTypeId: this.formdata.securityTypeId,
          promulgateDate: this.dateProclaimValue.replaceAll('/', ''),
          documentNumber: this.documentNumber,
          docType: constants.DOC_TYPE.SEND
        }
        const response = await DocumentService.suggestNumber(param)
        this.suggestNumber = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async warningPromulgate() {
      try {
        const param = {
          documentId: this.documentId,
          formulaTypeId: this.formulaTypeId,
          securityTypeId: this.formdata.securityTypeId,
          promulgateDate: this.dateProclaimValue.replaceAll('/', ''),
          documentNumber: this.documentNumber,
          bookGroupId: this.bookGroupId,
          docType: constants.DOC_TYPE.SEND
        }
        const response = await DocumentService.warningPromulgateNumber(param)
        this.showWarning = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async saveSignatureDocument() {
      try {
        this.formdata.docType = constants.DOC_TYPE.SEND
        this.formdata.documentTitle = this.documentTitle
        this.formdata.formulaTypeId = this.formulaTypeId
        this.formdata.promulgateDate = this.dateProclaimValue.replaceAll(
          '/',
          ''
        )
        this.formdata.bookGroupId = this.bookGroupId
        this.formdata.documentNumber = this.documentNumber
        this.formdata.code = this.code
        if (this.processingValue) {
          this.formdata.expiredDate = this.processingValue.replaceAll('/', '')
        }
        this.formdata.occupationId = this.formdata.occupationId || null
        this.formdata.numberOfCopy = this.numberOfCopy ? this.numberOfCopy : null
        this.formdata.promulgateGroupName = this.groupName

        await DocumentService.saveSignatureDoc(this.formdata)

        this.setNotify({
          show: true,
          type: 'success',
          content: this.$t('managementDoc.messageSuccess.updateDocument')
        })
        if (this.checkManagement) {
          this.$router.push(`${edocumentRoute.DOCUMENT_BOOK_PATH}?currentTab=0`)
        } else {
          this.$router.push(`${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}`)
        }
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      }
    },

    validateDuplicates() {
      const lstMsgError = []
      const validateDuplicateEmail = this.isDuplicate('email')
      if (validateDuplicateEmail.isDuplicate) {
        lstMsgError.push(
          `<li>
            Email ${validateDuplicateEmail.value[0]['k']}
            ${this.$t('contract.duplicateEmail')}
          </li>`
        )
      }
      const validateDuplicateGroupName = this.isDuplicate('groupName')
      if (validateDuplicateGroupName.isDuplicate) {
        lstMsgError.push(
          `<li>
          ${this.$t('contract.companyName')}
          ${validateDuplicateGroupName.value[0]['k']}
          ${this.$t('contract.duplicateEmail')}
          </li>`
        )
      }
      const validateDuplicatePhone = this.isDuplicate('phoneNumber')
      if (validateDuplicatePhone.isDuplicate) {
        lstMsgError.push(
          `<li>
          ${this.$t('contract.label.phone')}
          ${validateDuplicatePhone.value[0]['k']}
          ${this.$t('contract.duplicateEmail')}
          </li>`
        )
      }
      if (lstMsgError.length > 0) {
        this.showAlert({
          message: `<ul>${lstMsgError.join('')}</ul>`,
          typeAlert: 'error'
        })
      }
      return lstMsgError.length === 0
    },

    isDuplicate(type) {
      const dataCompare = this.formdata.externalSigners.filter(
        (e) => e[type] !== ''
      )
      const dataDuplicate = []
      const groupKey = groupBy(dataCompare, type)
      const keys = Object.keys(groupKey)
      keys.map((k) => {
        if (groupKey[k].length > 1 && k !== 'null') {
          dataDuplicate.push({ k, val: groupKey[k][0] })
        }
      })

      return { isDuplicate: dataDuplicate.length > 0, value: dataDuplicate }
    },

    // Xoa ben ky
    removeSigner(index) {
      this.formdata.externalSigners.splice(index, 1)
    },

    // Them ben ky
    addSigner() {
      this.formdata.externalSigners.push({ ...initSignerData })
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    initDate() {
      this.dateProclaimValue = moment().format('DD/MM/YYYY')
    },

    changeSecurity(val) {
      this.getSuggestNumber()
    },

    async onShowDialogConfirmSave() {
      await this.warningPromulgate()
      this.showConfirmContract = true
    },

    saveDocument() {
      if (this.documentType && this.documentType === 'INTERNAL_DOCUMENT') {
        this.saveSignatureDocument()
      }
    }
  }
}
</script>

<style lang="scss" src="../ManagementDoc.scss"></style>
