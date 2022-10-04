<template>
  <div class="wrap-home contract-manager-create px-2 mt-2">
    <v-container fluid class=" py-5 pt-2 rounded-xl bg-primary">
      <breadcrumbs :items="breadcrumbs" clazz="pt-0" />
      <v-card color="white" class="content-page rounded-xl pb-0 px-0">
        <validation-observer ref="observerStep1" v-slot="{ invalid }">
          <div>
            <div class="wrap-content-contract pb-15">
              <h6 class="col my-0 py-0">
                {{ $t('contract-manager.labels.information') }}
              </h6>
              <div>
                <!-- Thong tin chung -->
                <div class="col-12 row pb-0 justify-space-between">
                  <!-- Ten hop dong -->
                  <div class="form-group py-0 col-12 col-sm-4 col-md-3">
                    <div>
                      <label class="text--body-1">
                        {{ $t('contract.label.contractName') }}
                        <span class="color-require ">*</span>
                      </label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="contractName"
                        rules="required"
                      >
                        <v-text-field
                          v-model.trim="formdata.title"
                          dense
                          maxlength="500"
                          counter="500"
                          flat
                          solo
                          :placeholder="$t('contract.label.contractName')"
                          outlined
                          :error-messages="errors"
                          required
                          :disabled="!isExternal"
                          class="text--body-5"
                          @change="trimSpaceContractName"
                        />
                      </validation-provider>
                    </div>
                  </div>
                  <!-- So/Ky hieu -->
                  <div class="form-group py-0 col-12 col-sm-4 col-md-3">
                    <div>
                      <label class="text--body-1">
                        {{ $t('contract-manager.labels.contractNumber') }}
                        <span class="color-require ">*</span></label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="contractNo"
                        rules="required|max:500"
                      >
                        <v-text-field
                          v-model.trim="formdata.contractCode"
                          dense
                          maxlength="500"
                          counter="500"
                          flat
                          solo
                          :placeholder="
                            $t('contract-manager.labels.contractNumber')
                          "
                          outlined
                          :error-messages="errors"
                          required
                          class="text--body-5"
                          @change="trimSpaceContracCode"
                        />
                      </validation-provider>
                    </div>
                  </div>
                  <!-- Loai hop dong -->
                  <div class="form-group py-0 col-sm-4 col-md-3">
                    <div>
                      <label class="text--body-1">
                        {{ $t('contract.typeLabel') }}
                        <span class="color-require ">*</span>
                      </label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="contractType"
                        rules="required"
                      >
                        <v-select
                          v-model="formdata.formulaTypeId"
                          dense
                          attach
                          :placeholder="$t('contract.typeLabel')"
                          outlined
                          :error-messages="errors"
                          :no-data-text="$t('users.itemGroupName')"
                          required
                          :menu-props="{
                            bottom: true,
                            offsetY: true
                          }"
                          :items="lstContractType"
                          class="text--body-5"
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
                <div class="col-12 row justify-space-between py-0 mb-2">
                  <!-- Don vi -->
                  <div class="form-group col-12  py-0 col-sm-4 col-md-3">
                    <div>
                      <label class="text--body-1">
                        {{ $t('group.name') }}
                        <span class="color-require ">*</span></label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="group"
                        rules="required"
                      >
                        <v-autocomplete
                          v-model="formdata.ownerGroupId"
                          outlined
                          :no-data-text="$t('users.itemGroupName')"
                          maxlength="255"
                          dense
                          attach
                          elevation="0"
                          :menu-props="{
                            bottom: true,
                            offsetY: true
                          }"
                          :placeholder="$t('group.name')"
                          :items="groups"
                          item-text="groupName"
                          item-value="groupId"
                          class="text--body-5"
                          :error-messages="errors"
                          :disabled="!isExternal"
                        >
                          <vue-feather
                            slot="append"
                            class="grey--text"
                            type="search"
                          />
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
                  <!-- Ngay hieu luc -->
                  <div class="form-group py-0 col-12 col-sm-4 col-md-3">
                    <div>
                      <label class="text--body-1">
                        {{ $t('users.addSignature.time') }}
                        <span class="color-require ">*</span>
                      </label>
                      <v-menu
                        v-model="menuEffectiveDate"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <validation-provider
                            v-slot="{ errors }"
                            name="effectiveDate"
                            rules="required"
                          >
                            <v-text-field
                              ref="effectiveDateValue"
                              v-model.trim="effectiveDateValue"
                              outlined
                              placeholder="DD/MM/YYYY"
                              dense
                              v-bind="attrs"
                              :error-messages="
                                $t(errorEffectiveDateValue) || errors
                              "
                              class="text--body-5"
                              v-on="on"
                              @click:append="
                                menuEffectiveDate = !menuEffectiveDate
                              "
                            >
                              <template v-slot:append>
                                <img
                                  src="@/assets/icons/calendar.svg"
                                  alt=""
                                  class="hover--pointer"
                                  @click="
                                    menuEffectiveDate = !menuEffectiveDate
                                  "
                                >
                              </template>
                            </v-text-field>
                          </validation-provider>
                          <!-- @change="changeMinToDate" -->
                        </template>
                        <v-date-picker
                          v-model="effectiveDatePicker"
                          format="DD/MM/YYYY"
                          :locale="localDate"
                          no-title
                          show-adjacent-months
                          @input="menuEffectiveDate = false"
                        />
                      </v-menu>
                    </div>
                  </div>
                  <!-- Het hieu luc -->
                  <div class="form-group py-0 col-12 col-sm-4 col-md-3">
                    <div>
                      <label class="text--body-1">
                        {{ $t('users.addSignature.timeExpired') }}
                      </label>

                      <v-menu
                        v-model="menuTimeExpDate"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <validation-provider
                            v-slot="{ errors }"
                            name="expiredDate"
                            :rules="
                              expirationDateValue.length > 0
                                ? formatDateRule
                                : ''
                            "
                          >
                            <v-text-field
                              v-model.trim="expirationDateValue"
                              outlined
                              placeholder="DD/MM/YYYY"
                              dense
                              v-bind="attrs"
                              :error-messages="errors"
                              class="text--body-5"
                              v-on="on"
                              @click:append="menuTimeExpDate = !menuTimeExpDate"
                            >
                              <template v-slot:append>
                                <img
                                  src="@/assets/icons/calendar.svg"
                                  alt=""
                                  class="hover--pointer"
                                  @click="menuTimeExpDate = !menuTimeExpDate"
                                >
                              </template>
                            </v-text-field>
                          </validation-provider>
                          <!-- @change="changeMinToDate" -->
                        </template>
                        <v-date-picker
                          v-model="expirationDatePicker"
                          format="DD/MM/YYYY"
                          :locale="localDate"
                          no-title
                          show-adjacent-months
                          @input="menuTimeExpDate = false"
                        />
                      </v-menu>
                    </div>
                  </div>
                </div>
                <!-- Cac ben ky -->
                <h6 class="col my-0 py-0">
                  {{ $t('contract.listSigners') }}
                </h6>
                <div class="col-12">
                  <div class="wrap-list-signer py-0">
                    <signer-item
                      v-for="(signer, index) in formdata.externalSigners"
                      :key="index"
                      :signer="signer"
                      :index="index + 1"
                      :show-remove="formdata.externalSigners.length > 1"
                      :formdata="formdata"
                      :disabled="!isExternal"
                      @remove-signer="removeSigner"
                      @validate-duplicates="validateDuplicates"
                    />
                  </div>
                  <div v-show="showBtnAdd" v-if="isExternal">
                    <btn-add
                      :tooltip="$t('contract.addSigner')"
                      @on-click="addSigner"
                    />
                  </div>
                </div>

                <div class="d-flex col-12 justify-space-between py-0 mt-3">
                  <div class="form-group col-12 col-sm-5">
                    <div>
                      <label class="text--body-1">
                        {{ $t('contract.label.fileSign') }}
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
                            :style="fileStyle"
                            accept="application/pdf"
                            show-size
                            truncate-length="25"
                            :loading="uploadingFile"
                            class="no-border pa-0 mr-2 input-file text--caption-1"
                            prepend-icon="icon-pdf"
                            :disabled="!isExternal"
                            @change="uploadContractSigned"
                            @click:clear="resetFileSign"
                          />
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
                          <div class="text--body-1">
                            {{ $t('contract.format') }}: pdf
                          </div>
                          <div class="text-danger text--body-2">
                            ({{ $t('contract.fileMax') }} 50MB)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- tai file dinh kem -->
                  <div class="form-group col-12 col-sm-5">
                    <div>
                      <label class="text--body-1">
                        {{ $t('contract.attachments') }}</label>
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
                            <li
                              v-for="(file, index) in nameFileAttachs"
                              :key="index"
                            >
                              <img
                                :src="getIconFile(`${file.fileName}`)"
                                class="mr-2"
                              >
                              <span
                                :class="
                                  file.id &&
                                    !isExternal &&
                                    file.fileType != 'FILE_EXTERNAL'
                                    ? 'file-disabled'
                                    : ''
                                "
                              >{{ customFileName(file) }}</span>
                              <span
                                v-if="
                                  !file.id ||
                                    isExternal ||
                                    file.fileType == 'FILE_EXTERNAL'
                                "
                                class="remove-attach"
                                @click="removeFileAttach(index)"
                              ><v-icon>mdi-close</v-icon></span>
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
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="text--body-1">
                            {{ $t('contract.format') }}: doc, docx, xlsx, pdf
                          </div>
                          <div class="text-danger text--body-2">
                            ({{ $t('contract.fileMax') }} 50MB)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!--Hop dong lien quan -->
                <h6 v-if="false" class="col my-0 py-0">
                  {{ $t('contract.label.relatedContract') }}
                  <v-icon size="20" color="#4B506D">mdi-link-variant</v-icon>
                </h6>

                <div v-if="false" class="col-12">
                  <div
                    class="box-action-select-document border-dasher d-flex align-center justify-center mb-2"
                  >
                    <v-btn
                      text
                      class="text-capitalize btn-select-document text--body-1"
                      block
                    >
                      {{ $t('contract.label.selectDocument') }}
                      <v-icon
                        size="25"
                        class="ml-6"
                      >mdi-plus-circle-outline</v-icon>
                    </v-btn>
                  </div>
                  <div class="wrap-table-document-selected d-none">
                    <v-simple-table dense fixed-header>
                      <template v-slot:default>
                        <thead class="text--body-2">
                          <tr>
                            <th class="text-center stt">Stt</th>
                            <th class="text-left contract-name">
                              {{ $t('contract.label.contractName') }}
                            </th>
                            <th class="text-left contract-name">
                              {{ $t('contract.signer') }}
                            </th>
                            <th class="text-center action">
                              {{ $t('contract.label.actions') }}
                            </th>
                          </tr>
                        </thead>
                        <tbody class="text--body-2">
                          <tr>
                            <td class="text-center">
                              <b class="my-2">1</b>
                            </td>
                            <td class="text-left link-hover">
                              <div>
                                <div class="maxline2">
                                  Biên bản thanh lý hợp đồng mua bán hàng hóa
                                  Biên bản thanh lý hợp đồng mua bán hàng hóa
                                  Biên bản
                                </div>
                                <div class="text--caption grey--text darken-3">
                                  Hợp đồng cấp nước
                                </div>
                              </div>
                            </td>
                            <td class="text-left">
                              <div class="maxline2 document-signer">
                                Nguyễn Hoàng Văn An, Tổ Thư Ký BGĐ Khối Điều
                                Dưỡng-MT, XH - Khối Điều Dưỡng-Môi Trường
                              </div>
                            </td>
                            <td class="text-center">
                              <v-btn color="#0A093D" icon>
                                <v-icon>mdi-close</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                          <tr>
                            <td class="text-center">
                              <b class="my-2">1</b>
                            </td>
                            <td class="text-left link-hover">
                              <div>
                                <div class="maxline2">
                                  Biên bản thanh lý hợp đồng mua bán hàng hóa
                                  Biên bản thanh lý hợp đồng mua bán hàng hóa
                                  Biên bản
                                </div>
                                <div class="text--caption grey--text darken-3">
                                  Hợp đồng cấp nước
                                </div>
                              </div>
                            </td>
                            <td class="text-left">
                              <div class="maxline2 document-signer">
                                Nguyễn Hoàng Văn An, Tổ Thư Ký BGĐ Khối Điều
                                Dưỡng-MT, XH - Khối Điều Dưỡng-Môi Trường
                              </div>
                            </td>
                            <td class="text-center">
                              <v-btn color="#0A093D" icon>
                                <v-icon>mdi-close</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="d-flex justify-end mt-15 group-action-step">
                <v-btn
                  class="my-2 w-150 py-5 mr-10"
                  color="#0FAFE4"
                  outlined
                  rounded
                  @click="showDialogCancel = true"
                >
                  <span class="text-primary text--button">
                    {{ $t('cancelLabel') }}</span>
                </v-btn>

                <v-btn
                  class="my-2 w-150 py-5 text--button"
                  :disabled="
                    invalid ||
                      !validateDuplicates() ||
                      !formdata.fileMainSign ||
                      !validateDateEffect()
                  "
                  rounded
                  color="primary"
                  @click="showConfirmContract = true"
                >
                  {{ $t('saveLabel') }}
                </v-btn>
              </div>
            </div>
          </div>
        </validation-observer>
      </v-card>
      <dialog-cancel
        :show-dialog="showDialogCancel"
        @close-dialog="showDialogCancel = false"
      />
      <dialog-confirm-save
        title-confirm="contract.dialog.titleConfirmUpdateContract"
        :show-dialog="showConfirmContract"
        @close-dialog="showConfirmContract = false"
        @accept-action="saveContract(isUpdate)"
      />
      <base-material-snackbar
        v-model="isShowAlert"
        :type="typeAlert"
        :show-icon="showIcon"
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
// Libs
import moment from 'moment'

// Constants
import constants from '@/constants'

//  Mixins
import mixinDigitzation from './mixin/mixinDigitzation'

// Componentes
import DialogCancel from '../eContract/contract/create-contract/components/DialogCancel'
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import SignerItem from './components/SignerItem.vue'
import BtnAdd from '../eContract/contract/create-contract/components/BtnAdd.vue'
import DialogConfirmSave from '../eContract/contract/create-contract/components/DialogConfirmSave'
import econtractRoute from '@/modules/econtract/router/routePaths'

// Services
import { ContractService } from '@/modules/econtract/services/contractService'

const signerGroupType = [
  { name: 'contract.group', value: constants.GROUPS.GROUP },
  { name: 'contract.personal', value: constants.GROUPS.PERSONAL }
]

export default {
  components: {
    DialogCancel,
    Breadcrumbs,
    SignerItem,
    BtnAdd,
    DialogConfirmSave
  },
  mixins: [mixinDigitzation],
  data() {
    return {
      breadcrumbs: [
        {
          text: 'contract-manager.name',
          disabled: false,
          href: `${econtractRoute.LIST_CONTRACT_DIGIT_PATH}`
        },
        {
          text: 'contract.update',
          disabled: true,
          href: ''
        }
      ],
      isUpdate: true
    }
  },
  computed: {
    isExternal() {
      return this.formdata.processType === 'VB_EXTERNAL'
    }
  },
  created() {
    // this.hasPermission([constants.USER_ROLE.HDDT])
    this.getListGroups()
    this.getListFormulaType()
    this.initDataContract()
  },
  methods: {
    async initDataContract() {
      const contractId = this.$route.params.contractId
      try {
        const { data } = await ContractService.getExternalContractInfo(
          contractId
        )
        data.externalSigners = data.externalSigners.map(signer => {
          return {
            ...signer,
            signerType: signer.groupName
              ? signerGroupType[0]['value']
              : signerGroupType[1]['value']
          }
        })

        Object.assign(this.formdata, data)

        if (data.expirationDate) {
          this.expirationDateValue = data.expirationDate
          this.expirationDatePicker = moment(
            data.expirationDate,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
        }
        if (data.effectDate) {
          this.effectiveDateValue = data.effectDate
          this.effectiveDatePicker = moment(
            data.effectDate,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
        }

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
    }
  }
}
</script>
<style lang="scss"></style>
