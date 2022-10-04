<template>
  <div class="esignature-font">
    <div class="wrap-content-esignature">
      <div class="dialog-esignature-detail wrap-types">
        <!-- Ten van ban trinh ky -->
        <div class="col-12 row justify-space-around">
          <div class="form-group col-10">
            <div class="col-12">
              <label class="text--body-1">{{ $t('electronicSign.create.nameDocument') }}</label>
              <div class="detail-content">
                <span>{{ documentName }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Hinh thuc van ban || Do khan -->
        <div class="col-12 row justify-space-around">
          <div class="form-group col-12 col-sm-6 col-md-4">
            <div class="col-12">
              <label class="text--body-1">{{ $t('electronicSign.create.documentForm') }}</label>
              <div class="detail-content">
                <span>{{ documentType.name }}</span>
              </div>
            </div>
          </div>
          <div class="form-group col-12 col-sm-6 col-md-4">
            <div class="col-12">
              <label class="text--body-1">{{ $t('electronicSign.create.urgency') }}</label>
              <div class="detail-content">
                <span>{{ priorityId.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Don vi ban hanh || so van ban ban hanh -->
        <div v-if="promulgateGroupId" class="col-12 row justify-space-around">
          <div class="form-group col-12 col-sm-6 col-md-4">
            <div class="col-12">
              <label class="text--body-1">{{ $t('electronicSign.create.issueGroup') }}</label>
              <div class="detail-content">
                <span>{{ genGroupName }}</span>
              </div>
            </div>
          </div>
          <div class="form-group col-12 col-sm-6 col-md-4">
            <div class="col-12" />
          </div>
        </div>

        <!-- File ky || File dinh kem-->
        <v-divider class="mt-6 mb-3" />
        <div class="col-12 row justify-space-around">
          <div class="form-group col-12 col-sm-6 col-md-4">
            <div class="col-12">
              <label class="text--body-1">{{ $t('document.label.fileSign') }}</label>
              <div
                class="d-flex justify-space-between align-center detail-content"
              >
                <ul class="list-files">
                  <li
                    v-for="(file, index) in fileDocumentUploaded"
                    :key="index"
                    @click="downloadFileDoc(file)"
                  >
                    <img :src="getIconFile(`${file.fileName}`)" class="mr-2">
                    <span>{{ customFileName(file) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- tai file dinh kem -->
          <div class="form-group col-12 col-sm-6 col-md-4">
            <div v-if="showFileAttach()" class="col-12">
              <label class="text--body-1">{{ $t('document.label.fileAttachs') }}</label>
              <div
                class="d-flex justify-space-between align-center detail-content"
              >
                <ul class="list-files">
                  <li
                    v-for="(file, index) in fileAttachsUploaded"
                    :key="index"
                    @click="downloadFileAttach(file)"
                  >
                    <img :src="getIconFile(`${file.fileName}`)" class="mr-2">
                    <span>{{ customFileName(file) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-divider class="mt-6 mb-6" />
      <!-- Danh sach ben ky -->
      <h5 class="my-3">
        {{ $t('document.listOfSignature') + ' (' + countSigner + ')' }}
      </h5>
      <container v-if="listSigner != null" lock-axis="y">
        <div v-for="(represent, index) in listSigner" :key="index">
          <!-- Dai dien cua ban -->
          <v-card
            class="mb-10 pb-5 group-sign-esignature rounded-xl"
            :class="groupSignType(represent)"
          >
            <div class="header-panel-step-4 d-flex align-center pr-6">
              <div class="index-panel">
                <v-tooltip top content-class="tooltip-top">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      {{ index + 1 }}
                    </span>
                  </template>
                  <span>{{ $t('document.tooltip.stepSign') }}</span>
                </v-tooltip>
              </div>
            </div>
            <div class="content-panel">
              <!-- Nguoi ky -->
              <v-expansion-panels
                v-model="openPanel"
                multiple
                disabled
                class="elevation-0"
              >
                <v-expansion-panel class="elevation-0 rounded-xl">
                  <v-expansion-panel-content class="mx-8 pb-3 rounded-lg">
                    <container
                      lock-axis="y"
                      class="py-2"
                      drag-class="bg-primary"
                    >
                      <div
                        v-for="(signer, idx) in represent.signers"
                        :key="idx"
                      >
                        <group-signer-view :form-data="signer" />
                      </div>
                    </container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card>
        </div>
      </container>
      <v-row>
        <v-col>
          <label class="text--body-1" for="note">{{ $t('document.note') }}</label>
          <v-textarea
            v-model="note"
            rows="3"
            outlined
            maxlength="500"
            counter="500"
            name="note"
            @change="note = trimSpace(note)"
          />
        </v-col>
      </v-row>
      <v-row class="d-flex justify-space-around mb-15 align-start">
        <v-col cols="12" sm="6" md="6">
          <v-row justify="space-between">
            <label
              class="text--body-1"
              for="note"
            >{{ $t('document.label.scopeUse') }}
              <span class="red--text">*</span></label>
          </v-row>
          <v-row class="pt-2">
            <v-radio-group v-model="createType">
              <v-radio :label="$t('document.personal')" :value="types.PERSON" />
              <v-radio :label="$t('document.unit')" :value="types.GROUP" />
            </v-radio-group>
            <v-col class="d-flex align-end mt-6">
              <div class="d-flex flex-column" />
              <div class="d-flex flex-column">
                <div class="wrap-scope-use-step4">
                  <validation-observer ref="observer">
                    <scope-use
                      :check-show-scope="checkShowScope"
                      :groups="representGroup"
                      :init-scopes="initScope"
                      @selected-scope="selectedScope"
                    />
                  </validation-observer>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" md="5">
          <v-row align="center">
            <v-checkbox
              v-model="isRemine"
              hide-details
              :label="$t('document.remine')"
              value="remine"
              class="mt-0"
            />
            <div class="w-100 px-1">
              <v-text-field
                v-model="dayRemine"
                type="text"
                hide-details
                maxlength="1"
                oninput="this.value = this.value.replace(/[^1-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
                outlined
                dense
                color="primary"
                @change="changeDayRemine(dayRemine)"
              />
            </div>
            <label class="text--body-1 theme--light">{{ $t('document.day') }}</label>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <hr class="mt-2">
    <div class="d-flex justify-end mr-4 group-action-step1">
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
        class="my-2 w-150 py-4 mr-10"
        color="#0FAFE4"
        outlined
        rounded
        @click="prevStep"
      >
        <span class="text-primary"> {{ $t('document.back') }}</span>
      </v-btn>

      <v-btn
        class="my-2 w-150 py-4"
        rounded
        color="primary"
        @click="confirmSaveContract(`${docStates.DRAFT}`)"
      >
        {{ $t('flowDocument.saveFlow') }}
      </v-btn>
    </div>
    <dialog-confirm-save
      :title-confirm="titleConfirmSave"
      :show-dialog="showConfirmContract"
      @close-dialog="showConfirmContract = false"
      @accept-action="saveContract"
    />
    <dialog-view-pdf
      :src-file-pdf="srcFilePdf"
      :show-dialog="showDialogViewPdf"
      @close-dialog="showDialogViewPdf = false"
    />
    <base-preload :dialog="loading" />
  </div>
</template>

<script>
import GroupSignerView from './GroupSignerView.vue'
import DialogConfirmSave from '@/modules/esignature/views/flow/create/components/DialogConfirmSave.vue'
import { Container } from 'vue-smooth-dnd'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import { FileService } from '@/modules/esignature/services/fileService'
import constants from '@/constants'
import _ from 'lodash'
import { DocumentService } from '@/modules/esignature/services/documentService'
import DialogViewPdf from '@/views/components/DialogViewPdf.vue'
import goBackMethod from '@/mixins/goBackMethod'
import statusDocument from '@/modules/esignature/mixins/statusDocument'
import { formatFileSize } from '@/helpers/utils'
import ScopeUse from '@/modules/esignature/views/flow/update/components/ScopeUse'
import customsFile from '@/modules/esignature/mixins/customsFile'
import routeEsignature from '@/modules/esignature/router/routePaths'

const types = {
  GROUP: 'GROUP',
  PERSON: 'PERSON'
}
export default {
  name: 'Step4',
  components: {
    GroupSignerView,
    Container,
    DialogConfirmSave,
    DialogViewPdf,
    ScopeUse
  },
  mixins: [goBackMethod, statusDocument, customsFile],
  data() {
    return {
      createType: null,
      types: types,
      completed: false,
      listUsers: [],
      openPanel: [0, 1],
      note: '',
      timeExpired: '',
      timeExpiredValue: '',
      dayRemine: 1,
      // Menu date
      currentDate: moment().format('YYYY-MM-DD'),
      isAgreeTerm: true,
      showConfirmContract: false,
      titleConfirmSave: '',
      isRemine: false,
      menuTimeExpired: false,
      docStates: constants.DOC_STATES,
      docState: '',
      listMainSign: null,
      errorMessageTimeExpired: '',
      haveCoordinator: false,
      // Hien thi file pdf
      showDialogViewPdf: false,
      srcFilePdf: null,
      loading: false,
      scopes: [],
      initScope: [],
      documentId: null
    }
  },
  computed: {
    ...mapState('esignature', [
      'countSigner',
      'listSigner',
      'itemsSign',
      'documentName',
      'priorityId',
      'promulgateGroupId',
      'documentType',
      'fileDocumentUploaded',
      'countDocument',
      'fileAttachsUploaded',
      'resetSignatures',
      'documentDetail'
    ]),
    ...mapState('flow', ['representGroup']),
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },
    genGroupName() {
      return this.promulgateGroupId && this.promulgateGroupId.groupName
    },
    showGroup() {
      return this.promulgateGroupId
    },
    checkShowScope() {
      return this.createType === types.GROUP
    }
  },
  watch: {
    timeExpired(date) {
      const value = this.formatDate(date)
      const check = moment(value, 'DD/MM/YYYY', true).isValid()
      if (check) {
        this.timeExpiredValue = value
      }
    },
    timeExpiredValue() {
      this.validateTimeExpired()
    },
    itemsSign() {
      const positions = []
      this.itemsSign.map((item) => positions.push(item.signer))
      var results = _(positions).groupBy('keyPositionId').value()
      this.listMainSign = results
    },
    resetSignatures() {
      this.haveCoordinator = false
    },
    async documentDetail() {
      await this.initDataFinalize()
    },
    representGroup() {}
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    ...mapActions('esignature', ['setFileAttachs']),
    showFileAttach() {
      let check = false
      if (this.fileAttachsUploaded && this.fileAttachsUploaded.length > 0) {
        check = true
      }
      return check
    },
    showTypeGroup(type) {
      if (type === constants.GROUPS.PERSONAL) {
        return this.$t('document.personal')
      }
    },
    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },
    initDataFinalize() {
      if (!this.documentDetail) {
        return
      }
      this.documentId = this.$route.params.documentId
      if (this.documentDetail.description) {
        this.note = this.documentDetail.description
      }
      if (
        this.documentDetail.documentAlarm &&
        this.documentDetail.documentAlarm.cycle
      ) {
        this.isRemine = 'remine'
        this.dayRemine = this.documentDetail.documentAlarm.cycle
          ? this.documentDetail.documentAlarm.cycle
          : 1
      }
      if (
        this.documentDetail.documentAlarm &&
        this.documentDetail.documentAlarm.signingDeadline
      ) {
        this.timeExpired = moment(
          this.documentDetail.documentAlarm.signingDeadline,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')
      }
      this.initScope = this.documentDetail.documentScopes

      if (this.initScope.length > 0) {
        this.createType = types.GROUP
      } else {
        this.createType = types.PERSON
      }
      const scopesActive = []
      // Lay danh sach pham vi active
      this.initScope.map((id) => {
        this.representGroup.map((group) => {
          if (+group.groupId === +id) {
            scopesActive.push(+id)
          }
        })
      })
      this.initScope = scopesActive

      this.scopes = scopesActive
    },
    // Mau sac panel
    groupSignType(represent) {
      return represent.type === constants.GROUPS.INTERNAL
        ? 'group-blue'
        : 'group-cyan'
    },
    nextStep() {
      this.$emit('next-step', 5)
    },
    prevStep() {
      this.$emit('next-step', 3)
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

    // Tai file van ban
    async downloadFileDoc(file) {
      this.loading = true
      await this.viewFilePdf(file)
      this.loading = false
    },

    async viewFilePdf(file) {
      if (!file.url) {
        const urlFile = await FileService.download({
          fileName: file.fileName,
          storage: file.storage,
          filePath: file.filePath
        })
        this.srcFilePdf = urlFile
        await this.uploadUrlFileAttach(file, urlFile)
      } else {
        this.srcFilePdf = file.url
      }
      this.showDialogViewPdf = true
    },

    // Tai file dinh kem
    async downloadFileAttach(file) {
      this.loading = true
      if (file.fileName.includes('.pdf')) {
        await this.viewFilePdf(file)
      } else {
        await FileService.downloadFile({
          fileName: file.fileName,
          storage: file.storage,
          filePath: file.filePath
        })
      }
      this.loading = false
    },

    // update url fileAttach vua download
    uploadUrlFileAttach(file, urlFile) {
      const lstTempFileAttach = []
      this.fileAttachsUploaded.map((item) => {
        if (item.fileName === file.fileName) {
          file.url = urlFile
          lstTempFileAttach.push(file)
        } else {
          lstTempFileAttach.push(item)
        }
      })
      this.setFileAttachs(lstTempFileAttach)
    },

    // Hien thi dialog huy
    showDialogCancel() {
      this.$emit('show-cancel')
    },
    // Confirm save
    async confirmSaveContract(docState) {
      if (this.createType === types.GROUP) {
        const isValid = await this.$refs.observer.validate()
        if (!isValid) return
      }
      this.showConfirmContract = true
      this.docState = docState
      this.titleConfirmSave = 'flowDocument.titleConfirm'
    },
    // Luu hop dong
    async saveContract() {
      const formData = {}
      formData.processType = constants.PROCESS_TYPE.VB_TEMPLATE
      formData.documentId = parseInt(this.documentId)
      formData.formulaTypeId = this.documentType.id
      formData.priorityId = this.priorityId.id
      formData.promulgateGroupId =
        this.promulgateGroupId && this.promulgateGroupId.groupId
      formData.title = this.documentName.trim()
      formData.documentScopes =
        this.createType === this.types.GROUP ? this.scopes : null
      formData.fileMainSigns = this.fileDocumentUploaded
      formData.fileMainSigns.map((fileMainSign) => {
        delete fileMainSign.url
      })
      formData.fileAttachments = this.fileAttachsUploaded
      formData.description = this.note ? this.note.trim() : null
      formData.signingDeadline = this.timeExpiredValue
        ? this.timeExpiredValue
        : null
      formData.docState = this.docState
      formData.registerNumber = this.showGroup ? this.countDocument : null
      formData.signReminderDays = this.isRemine ? this.dayRemine : null
      formData.signers = this.buildParamSigner()
      try {
        this.loading = true
        await DocumentService.saveDocumentTemplate(formData)
        this.loading = false
        var message = 'flowDocument.saveSuccessUpdate'
        const typeAlert = 'success'
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message)
        })
        this.$router.push(routeEsignature.LIST_FLOWS_PATH)
      } catch (e) {
        this.loading = false
        const typeAlert = 'error'
        const message = e.message
        this.$emit('show-alert', { message, typeAlert })
      }
    },
    // build params nguoi ky
    buildParamSigner() {
      var countGroup = 0
      var countStepSign = 0
      const representGroups = []
      this.listSigner.map((signator) => {
        countGroup = countGroup + 1
        signator.signers.map((signer) => {
          countStepSign++
          const { signData } = this.buildDocNotRequest(
            signer,
            countGroup,
            countStepSign,
            this.listMainSign
          )
          representGroups.push(signData)
        })
      })
      return representGroups
    },

    // build params nguoi ky, nguoi xem xet
    buildDocNotRequest(signer, countGroup, countStepSign, listSigature) {
      var signData = {}
      signData.email = signer.email
      signData.phone = signer.phone
      signData.positionId = signer.positionId
      signData.positionName = signer.positionName
      signData.signUserId = signer.signUserId
      signData.signUserName = signer.signUserName
      signData.signGroupId = signer.signGroupId
      signData.signGroupName = signer.signGroupName
      signData.signUserType = signer.signUserType
      signData.groupLevel = countGroup
      signData.step = countStepSign

      var docNoteSigns = []
      if (signer.signUserType !== constants.SIGN_USER_TYPE.REVIEWER) {
        signData.signMethod = constants.SIGN_METHODS.NORMAL_SIGN
        if (signer.signMethod.length > 0) {
          signData.signMethod =
            signer.signMethod.length > 1
              ? constants.SIGN_METHODS.ALL
              : signer.signMethod[0]
        }
        var dataUserSign = listSigature[signer.keyPositionId]
        if (dataUserSign) {
          dataUserSign.map((data) => {
            var signature = {}
            signature.fileOrder = data.fileOrder
            signature.page = data.page
            signature.signType = data.signType

            signature.size = '(150,150)'
            signature.axisX = data.x
            signature.axisY = data.y
            docNoteSigns.push(signature)
          })
        }
        if (docNoteSigns.length > 0) {
          signData.docNoteSigns = docNoteSigns
        }
      }
      return { signData }
    },
    validateTimeExpired() {
      var isValid = true
      const currentDate = moment()
      if (this.timeExpiredValue.length > 0) {
        if (!moment(this.timeExpiredValue, 'DD/MM/YYYY', true).isValid()) {
          this.errorMessageTimeExpired = 'document.expireDateInvalid'
          this.timeExpired = ''
          isValid = false
        } else {
          const selectDate = moment(this.timeExpiredValue, 'DD/MM/YYYY')
          const diff = selectDate.diff(currentDate, 'days')
          if (diff < 0) {
            isValid = false
            this.timeExpired = ''
            this.errorMessageTimeExpired = 'document.expireDateAndNow'
          } else {
            this.errorMessageTimeExpired = ''
          }
        }
      } else {
        this.errorMessageTimeExpired = ''
        isValid = true
      }
      return isValid
    },
    changeDayRemine(value) {
      return value ? this.dayRemine : (this.dayRemine = 1)
    },
    trimSpace(val) {
      const value = val.trim()
      return value
    },
    selectedScope(scopes) {
      this.scopes = scopes
    }
  }
}
</script>

<style lang="scss" scoped>
.required .v-label {
  display: block !important;
  word-break: break-all;
  &::after {
    content: ' *';
    color: red;
  }
}
.dialog-esignature-detail {
  .detail-content {
    background: #e9f8f9;
    border-radius: 8px;
    padding: 10px 15px;
    min-height: 50px;
  }
}
.header-panel-step-4 {
  padding: 5px 20px;
  background: #0fafe4;
  .index-panel {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    text-align: center;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    font-weight: 600;
  }
  .title-panel {
    color: #fff;
    font-weight: 800;
    font-size: 18px;
    text-transform: capitalize;
  }
}
.wrap-scope-use-step4 {
  width: 600px;
}
::v-deep(.v-input--checkbox) {
  .v-label {
    font-size: 16px;
    font-weight: 600;
    color: #4b506d !important;
  }
}
</style>
