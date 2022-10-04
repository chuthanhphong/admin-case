<template>
  <div class="wrap--list-common edocument-font wrap-update-document">
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
                  @change="documentTitle = trimSpace(documentTitle)"
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
                  :item-text="item => $t(item.name)"
                  item-value="id"
                  class="edoc-text--body-2"
                  @change="selectFormula(formulaTypeId)"
                >
                  <vue-feather slot="append" class="grey--text" type="search" />
                </v-autocomplete>
              </validation-provider>
            </div>

            <!-- Don vi ban hanh -->
            <div
              class="form-group py-0 col-12 col-sm-3 col-md-3 group-item-search"
            >
              <label class="edoc-text--body-4">
                {{ $t('managementDoc.updateDoc.promulgateGroup') }}
                <span class="color-require">*</span>
              </label>
              <validation-provider
                v-slot="{ errors }"
                name="promulgateGroup"
                rules="required"
              >
                <v-text-field
                  v-model="promulgateGroupName"
                  outlined
                  maxlength="255"
                  dense
                  :placeholder="$t('managementDoc.placeholder.groupName')"
                  class="edoc-text--body-2"
                  :error-messages="errors"
                  clearable
                  @click:clear="clearPromulgateGroupName"
                  @input="onInputSearchGroup"
                  @blur="closeFilterGroup"
                  @keyup.enter="searchDocumentByGroup()"
                  @click="selectPromulgateGroup()"
                  @change="promulgateGroupName = trimSpace(promulgateGroupName)"
                >
                  <vue-feather
                    slot="prepend-inner"
                    class="grey--text"
                    type="search"
                  />
                </v-text-field>
              </validation-provider>
              <div v-show="showFilterGroup" class="wrap-list-search-group">
                <v-list dense>
                  <v-list-item-group v-model="selectedGroup" color="primary">
                    <v-list-item
                      v-for="(group, idx) in lstGroupProclaim"
                      :key="idx"
                      two-line
                      class="py-0"
                    >
                      <v-list-item-content class="py-0">
                        <v-list-item-title>{{
                          group.groupName
                        }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ $t(genGroupName(group)) }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
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
                  offset-y
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
                  v-model="securityTypeId"
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
                  v-model="priorityId"
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

            <!-- Ngay den -->
            <div
              v-if="checkTypeDocument"
              class="form-group py-0 col-12 col-sm-3 col-md-3"
            >
              <div class="date-picker">
                <label class="edoc-text--body-4">
                  {{ $t('managementDoc.updateDoc.dateArrival') }}
                  <span class="color-require">*</span>
                </label>
                <v-menu
                  v-model="openDateReceive"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="270px"
                  max-width="270px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateReceiveValue"
                      outlined
                      placeholder="DD/MM/YYYY"
                      dense
                      v-bind="attrs"
                      append-icon="mdi-calendar-range"
                      class="edoc-text--body-2"
                      :error-messages="$t(errorDateReceive)"
                      v-on="on"
                      @click:append="openDateReceive = !openDateReceive"
                    />
                  </template>
                  <v-date-picker
                    v-model="dateReceivePicker"
                    format="DD/MM/YYYY"
                    :locale="localDate"
                    no-title
                    @input="openDateReceive = false"
                  />
                </v-menu>
              </div>
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
                  offset-y
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
            <div
              v-if="!checkTypeDocument"
              class="form-group py-0 col-12 col-sm-3 col-md-3"
            >
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
            <!-- Noi nhan van ban -->
            <div
              v-if="checkTypeDocument"
              class="form-group py-0 col-12 col-sm-3 col-md-3"
            >
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
                    formdata.handCopyPlace = trimSpace(formdata.handCopyPlace)
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
            <div
              v-if="!checkTypeDocument"
              class="form-group py-0 col-12 col-sm-3 col-md-3"
            />
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
                  v-for="(signer, index) in formdata.signers"
                  :key="index"
                  :signer="signer"
                  :index="index + 1"
                  :show-remove="formdata.signers.length > 1"
                  :formdata="formdata"
                  @remove-signer="removeSigner"
                  @validate-duplicates="validateDuplicates"
                />
              </div>
              <div v-show="showBtnAdd">
                <btn-add
                  :show="checkDisbaleBtnAdd"
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
                  <span class="color-require ">*</span></label>
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
                    class="btn-upload  ml-auto"
                    :loading="uploadingFileAttatch"
                    :disabled="uploadingFileAttatch"
                    @click="uploadAttachs"
                  >
                    <v-icon size="30">mdi-upload</v-icon>
                  </v-btn>
                </div>
                <div class="d-flex justify-space-between align-center mt-3">
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
              :disabled="!isComplete || !validateDuplicates()"
              rounded
              color="primary"
              @click="onShowDialogConfirmSave()"
            >
              {{ $t('saveLabel') }}
            </v-btn>
          </div>
        </div></v-card>

      <dialog-cancel
        :show-dialog="showDialogCancel"
        @close-dialog="showDialogCancel = false"
        @accept-cancel="acceptCancel"
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
import mixinManagementDoc from '../../management/mixin/mixinManagementDoc'
import DialogCancel from '@/modules/edocument/views/document/book-go-arrival/components/DialogCancel'
import DialogConfirmSave from '@/modules/edocument/views/components/DialogConfirmSave'
import SignerItem from '@/modules/edocument/views/document/book-go-arrival/create/components/SignerItem.vue'
import BtnAdd from '@/modules/edocument/views/components/BtnAdd.vue'
import { DocumentService } from '@/modules/edocument/services/documentService.js'
import constants from '@/constants'
import mixinBook from '../mixins/mixinBook'

export default {
  name: 'UpdateBook',
  components: {
    SignerItem,
    Breadcrumbs,
    DialogCancel,
    DialogConfirmSave,
    BtnAdd
  },
  mixins: [mixinManagementDoc, mixinBook],
  data() {
    return {
      linkBack: null
    }
  },

  computed: {
    breadcrumbs() {
      let linkHref = `${edocumentRoute.DOCUMENT_BOOK_PATH}?currentTab=0`
      let title = 'document.bookTitle'
      if (this.typeDocument === constants.DOC_TYPE.RECEIVE) {
        linkHref = `${edocumentRoute.DOCUMENT_BOOK_PATH}?currentTab=1`
      }
      const check = localStorage.getItem(
        constants.SEARCH_TYPE_DOCUMENT.SEARCH_TYPE_DOC
      );
      if (check === constants.SEARCH_TYPE_DOCUMENT.MANAGEMENT_DOC_DETAIL) {
        linkHref = `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}`;
        title = "documentManager";
      }
      this.backTolist(linkHref)
      return [
        {
          text: title,
          disabled: false,
          href: linkHref
        },
        {
          text: 'editDocument',
          disabled: true,
          tooltip: false
        }
      ]
    },
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },
    checkTypeDocument() {
      let type = false
      if (this.typeDocument === constants.DOC_TYPE.RECEIVE) {
        type = true
      }
      return type
    },
    checkDisbaleBtnAdd() {
      return this.formdata.signers.length < 50
    }
  },

  watch: {

  },
  beforeDestroy() {
    localStorage.setItem(constants.SEARCH_TYPE_DOCUMENT.SEARCH_TYPE_DOC, null);
  },

  async created() {
    await Promise.all([
      this.getDocType(),
      this.getSecurity(),
      this.getPriority(),
      this.getOccupation()
    ])
    this.getBookGroup()

    this.messageError = null
    await this.getInfoDoc()
    this.checkTitleDoc()
  },

  methods: {

    backTolist(href) {
      this.linkBack = href
    },

    async getSuggestNumber() {
      try {
        if (
          !this.bookGroupId ||
          !this.securityTypeId ||
          !this.dateProclaimValue ||
          this.errorDateProclaim
        ) {
          return
        }

        const param = {
          docType: this.typeDocument,
          bookGroupId: this.bookGroupId,
          securityTypeId: this.securityTypeId,
          promulgateDate: this.dateProclaimValue.replaceAll('/', '')
        }
        const response = await DocumentService.suggestNumber(param)
        this.suggestNumber = response.data
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

    async getInfoDoc() {
      try {
        this.loading = true
        this.documentId = this.$route.params.documentId

        // Case sua vb ky.
        this.disableBySignatureDoc = true
        const response = await DocumentService.getInfoDocPersonal(
          this.documentId
        )
        if (response.data) {
          this.promulgateGroupId = response.data.promulgateGroupId
          this.promulgateGroupName = response.data.promulgateGroupName
          this.securityTypeId = response.data.securityTypeId
          this.priorityId = response.data.priorityId
          this.formdata.occupationId = response.data.occupationId
          this.formdata.signers = response.data.signers
          this.code = response.data.documentPromulgate.code
          this.formdata.receivePlace = response.data.documentPromulgate.receivePlace
          this.formdata.handCopyPlace = response.data.documentPromulgate.handCopyPlace
          this.numberOfCopy = response.data.documentPromulgate.numberOfCopy

          this.dateProclaimValue = response.data.documentPromulgate.promulgateDate
          this.processingValue = response.data.documentPromulgate.expireDate
          this.dateReceiveValue = response.data.documentPromulgate.receiveDate
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
          this.typeDocument = response.data.docType
          await this.initFileMain(response.data)
          await this.initFileAttachs(response.data)
          this.getSuggestNumber()
          this.loading = false
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
        this.nameFileAttachs = data.fileAttachments
      }
    },

    async saveSignatureDocument() {
      try {
        this.formdata.docType = this.typeDocument
        this.formdata.documentId = this.documentId
        this.formdata.documentTitle = this.documentTitle
        this.formdata.formulaTypeId = this.formulaTypeId
        this.formdata.promulgateDate = this.dateProclaimValue.replaceAll(
          '/',
          ''
        )
        this.formdata.receiveDate = null
        if (this.checkTypeDocument) {
          this.formdata.receiveDate = this.dateReceiveValue.replaceAll(
            '/',
            ''
          )
        }

        this.formdata.bookGroupId = this.bookGroupId
        this.formdata.documentNumber = this.documentNumber
        this.formdata.code = this.code
        if (this.processingValue) {
          this.formdata.expiredDate = this.processingValue.replaceAll('/', '')
        }
        this.formdata.occupationId = this.formdata.occupationId || null
        this.formdata.numberOfCopy = this.numberOfCopy
          ? this.numberOfCopy
          : null
        this.formdata.promulgateGroupName = this.promulgateGroupName
        this.formdata.promulgateGroupId = this.promulgateGroupId
        this.formdata.securityTypeId = this.securityTypeId
        this.formdata.priorityId = this.priorityId
        this.formdata.fileMainSigns = this.fileDocumentUploaded
        this.formdata.fileMainSigns.map((fileMainSign) => {
          delete fileMainSign.url
        })
        this.formdata.fileAttachments = this.fileAttachsUploaded
        this.formdata.signers = this.buildParamSigner(this.formdata.signers)
        await DocumentService.saveExternalDoc(this.formdata)
        var message = this.$t('managementDoc.messageSuccess.updateDocumentGo')
        if (this.checkTypeDocument) {
          message = this.$t('managementDoc.messageSuccess.updateDocumentTo')
        }
        this.setNotify({
          show: true,
          type: 'success',
          content: message
        })

        this.$router.push(this.linkBack).catch(() => {})
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      }
    },
    acceptCancel() {
      this.$router.push(this.linkBack).catch(() => {})
    }
  }
}
</script>
<style lang="scss" src="./UpdateBook.scss"></style>
