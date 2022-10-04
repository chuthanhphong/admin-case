<template>
  <div>
    <div class="wrap-content-contract">
      <div class="dialog-contract-detail ">
        <!-- Loai hop dong -->
        <div class="col-12 row justify-space-around">
          <div class="form-group col-12 col-sm-6 col-md-4">
            <div class="col-12">
              <label class="text--label-1">{{
                $t('contract.typeLabel')
              }}</label>
              <div class="detail-content text--body-1">
                <span>{{ contractType.name }}</span>
              </div>
            </div>
          </div>
          <div class="form-group col-12 col-sm-6 col-md-4">
            <div class="col-12">
              <label class="text--label-1">{{
                $t('contract.nameLabel')
              }}</label>
              <div class="detail-content text--body-1">
                <span>{{ contractName }}</span>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <!-- Hop dong ky ket-->

        <div class="col-12 row justify-space-around">
          <div
            v-if="fileContractUploaded != null"
            class="form-group col-12 col-sm-6 col-md-4"
          >
            <div class="col-12">
              <label class="text--label-1">{{ $t('contract.signed') }}</label>
              <div class="detail-content text--caption">
                <ul class="list-files">
                  <li @click="downloadFileContract">
                    <i class="icon-pdf mr-2" />
                    <span>{{
                      customFileName(fileContractUploaded.fileName)
                    }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- tai file dinh kem -->
          <div class="form-group col-12 col-sm-6 col-md-4">
            <div v-if="fileAttachsUploaded != null" class="col-12">
              <label class="text--label-1">{{
                $t('contract.attachments')
              }}</label>
              <div class="detail-content">
                <ul class="list-files">
                  <li
                    v-for="(file, index) in fileAttachsUploaded"
                    :key="index"
                    @click="downloadFileAttach(file)"
                  >
                    <img :src="getIconFile(`${file.fileName}`)" class="mr-2">
                    <span>{{ customFileName(file.fileName) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <!-- Danh sach ben ky -->
      <h6 class="my-3">{{ $t('contract.listOfSignature') }}</h6>
      <container v-if="listSigner != null" lock-axis="y">
        <div v-for="(represent, index) in listSigner" :key="index">
          <!-- Dai dien cua ban -->
          <v-card
            class="mb-10 group-sign rounded-xl"
            :class="groupSignType(represent)"
          >
            <div class="header-panel d-flex align-center pr-6">
              <div class="index-panel">
                <v-tooltip top content-class="tooltip-top">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      {{ index + 1 }}
                    </span>
                  </template>
                  <span>{{ $t('contract.tooltip.stepSign') }}</span>
                </v-tooltip>
              </div>
              <div>
                <div
                  v-if="
                    checkType(represent.type) &&
                      showTypeGroup(represent.data.group)
                  "
                  class="col-12 col-sm-12 pa-0"
                >
                  <label class="title-panel">{{
                    showTypeGroup(represent.data.group)
                  }}</label>
                </div>

                <div
                  v-if="isDisplayRepresent(represent)"
                  class="col-12 col-sm-12 pa-0"
                >
                  <label class="title-panel">{{ represent.groupName }}</label>
                </div>
              </div>
            </div>
            <div class="content-panel">
              <!-- Nguoi dieu phoi -->
              <v-expansion-panels
                v-if="isDisplayCoordinator(represent)"
                v-model="openPanel"
                disabled
                class="elevation-0 panel-reviewer"
                multiple
              >
                <v-expansion-panel class="elevation-0 rounded-xl">
                  <v-expansion-panel-header class="mx-2">
                    <span class="pl-5">{{ $t('contract.coordinator') }}</span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="mx-3 pb-3 rounded-lg">
                    <container class="bg-light-blue py-1">
                      <group-review-view :signer="represent.data.coordinator" />
                    </container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Nguoi xem xet -->
              <v-expansion-panels
                v-if="represent.data.reviews[0].email != ''"
                v-model="openPanel"
                disabled
                class="elevation-0 panel-reviewer"
                multiple
              >
                <v-expansion-panel class="elevation-0 rounded-xl">
                  <v-expansion-panel-header class="mx-2">
                    <span class="pl-5">{{ $t('contract.reviewer') }}</span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="mx-3 pb-3 rounded-lg">
                    <container
                      drag-class="bg-primary"
                      class="bg-light-blue py-2"
                    >
                      <div
                        v-for="(signer, idx) in represent.data.reviews"
                        :key="idx"
                      >
                        <group-review-view :signer="signer" />
                      </div>
                    </container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <!-- Nguoi ky -->
              <v-expansion-panels
                v-if="!represent.data.isCoordinator"
                v-model="openPanel"
                multiple
                disabled
                class="elevation-0"
              >
                <v-expansion-panel class="elevation-0 rounded-xl">
                  <v-expansion-panel-header class="mx-2">
                    <span class="pl-5">{{ $t('contract.signer') }}</span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="mx-3 pb-3 rounded-lg">
                    <container
                      lock-axis="y"
                      class="bg-light-purple py-2"
                      drag-class="bg-primary"
                    >
                      <div
                        v-for="(signer, idx) in represent.data.signers"
                        :key="idx"
                      >
                        <group-signer-view :signer="signer" />
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
          <label for="note">{{ $t('contract.note') }}</label>
          <v-textarea
            v-model="note"
            rows="3"
            outlined
            disabled
            maxlength="500"
            counter="500"
            name="note"
            @change="note = trimSpace(note)"
          />
        </v-col>
      </v-row>
      <v-row justify="space-around">
        <v-col cols="12" sm="4" md="3">
          <v-row justify="space-between">
            <v-col>
              <v-row justify="space-between">
                <label>{{ $t('contract.timeSign') }}</label>
                <v-tooltip top content-class="tooltip-top">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                    >mdi-alert-circle-outline</v-icon>
                  </template>
                  <div class="mw-300 pa-0">
                    {{ $t('contract.tooltip.timeSign') }}
                  </div>
                </v-tooltip>
              </v-row>
            </v-col>
          </v-row>

          <v-row class="pt-4">
            <v-menu
              ref="menuTimeSign"
              v-model="menuTimeSign"
              :close-on-content-click="false"
              transition="scale-transition"
              disabled
              attach
              bottom
              nudge-bottom="40"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="timeSignValue"
                  :error-messages="errorMessageTimeSign"
                  outlined
                  disabled
                  placeholder="DD/MM/YYYY"
                  dense
                  v-bind="attrs"
                  v-on="on"
                  @change="validateTimeExpired"
                >
                  <template v-slot:append>
                    <img
                      src="@/assets/icons/calendar.svg"
                      alt=""
                      class="hover--pointer"
                      @click="menuTimeSign = !menuTimeSign"
                    >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="timeSign"
                format="DD/MM/YYYY"
                :locale="localDate"
                no-title
                disabled
                :min="currentDate"
                show-adjacent-months
                @input="menuTimeSign = false"
              />
            </v-menu>
          </v-row>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-row justify="space-between">
            <v-col>
              <v-row justify="space-between">
                <label for="note">{{ $t('contract.timeExpired') }}</label>
                <v-tooltip top content-class="tooltip-top">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                    >mdi-alert-circle-outline</v-icon>
                  </template>
                  <div class="mw-300 pa-0">
                    {{ $t('contract.tooltip.timeExpired') }}
                  </div>
                </v-tooltip>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="pt-4">
            <v-menu
              ref="menu"
              v-model="menuTimeExpired"
              disabled
              :close-on-content-click="false"
              transition="scale-transition"
              bottom
              attach
              nudge-bottom="40"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="timeExpiredValue"
                  outlined
                  disabled
                  placeholder="DD/MM/YYYY"
                  dense
                  v-bind="attrs"
                  :error-messages="$t(errorMessageTimeExpired)"
                  v-on="on"
                >
                  <template v-slot:append>
                    <img
                      src="@/assets/icons/calendar.svg"
                      alt=""
                      class="hover--pointer"
                      @click="menuTimeExpired = !menuTimeExpired"
                    >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="timeExpired"
                :locale="localDate"
                disabled
                format="DD/MM/YYYY"
                no-title
                :min="currentDate"
                show-adjacent-months
                @input="menuTimeExpired = false"
              />
            </v-menu>
          </v-row>
        </v-col>
      </v-row>
      <hr class="my-2">
      <v-row class="mt-5">
        <v-col>
          <v-row align="center" class="px-3">
            <v-checkbox
              v-model="isRemine"
              hide-details
              :label="$t('contract.remine')"
              value="remine"
              class="mt-0"
              disabled
            />
            <div class="w-100 px-1">
              <v-text-field
                v-model="dayRemine"
                type="text"
                hide-details
                disabled
                maxlength="1"
                oninput="this.value = this.value.replace(/[^1-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
                outlined
                dense
                color="primary"
                @change="changeDayRemine(dayRemine)"
              />
            </div>
            <label class="v-label theme--light">{{ $t('contract.day') }}</label>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <div class="d-flex justify-end align-center group-action-step">
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
        @click="prevStep"
      >
        <span class="text-primary"> {{ $t('contract.back') }}</span>
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
        rounded
        color="primary"
        @click="confirmCoordination(`${docStates.IN_PROGRESS}`)"
      >
        {{ $t('coordinationLabel') }}
      </v-btn>
    </div>
    <dialog-confirm-save
      :title-confirm="titleConfirmSave"
      :show-dialog="showConfirmContract"
      @close-dialog="showConfirmContract = false"
      @accept-action="coordinationContract"
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
import GroupSignerView from './GroupSignerView'
import GroupReviewView from './GroupReviewView'
import DialogConfirmSave from '../../create-contract/components//DialogConfirmSave'
import { Container } from 'vue-smooth-dnd'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import { FileService } from '@/modules/econtract/services/fileService'
import constants from '@/constants'
import _ from 'lodash'
import { ContractService } from '@/modules/econtract/services/contractService'
import DialogViewPdf from '@/views/components/DialogViewPdf.vue'
import goBackMethod from '@/modules/econtract/mixins/goBackMethod'
import fileMixin from '@/modules/econtract/mixins/fileMixin'

export default {
  name: 'Step4',
  components: {
    GroupSignerView,
    GroupReviewView,
    Container,
    DialogConfirmSave,
    DialogViewPdf
  },
  mixins: [goBackMethod, fileMixin],
  data() {
    return {
      completed: false,
      listUsers: [],
      selectGroup: [
        { name: 'contract.group', value: constants.GROUPS.GROUP },
        { name: 'contract.personal', value: constants.GROUPS.PERSONAL }
      ],
      groups: [],
      openPanel: [0, 1],
      note: '',
      timeSign: '',
      timeExpired: '',
      timeSignValue: '',
      timeExpiredValue: '',
      dayRemine: 1,
      // Menu date
      currentDate: moment().format('YYYY-MM-DD'),
      isAgreeTerm: false,
      showConfirmContract: false,
      titleConfirmSave: '',
      isRemine: false,
      menuTimeSign: false,
      menuTimeExpired: false,
      docStates: constants.DOC_STATES,
      docState: '',
      listMainSign: null,
      errorMessageTimeExpired: '',
      errorMessageTimeSign: '',
      documentId: null,
      // Hien thi file pdf
      showDialogViewPdf: false,
      srcFilePdf: null,
      loading: false
    }
  },
  computed: {
    ...mapState('contract', [
      'listSigner',
      'itemsSign',
      'contractName',
      'contractType',
      'fileContractUploaded',
      'fileAttachsUploaded',
      'contractDetail'
    ]),
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },
    isDisableSaveDraft() {
      return !this.validateTimeSignContract()
    }
  },
  watch: {
    timeSign(date) {
      this.timeSignValue = this.formatDate(date)
    },
    timeExpired(date) {
      this.timeExpiredValue = this.formatDate(date)
    },
    timeSignValue() {
      this.validateTimeSign()
    },
    timeExpiredValue() {
      this.validateTimeExpired()
    },
    itemsSign() {
      const users = []
      this.itemsSign.map(item => users.push(item.signer))
      var results = _(users)
        .groupBy('email')
        .value()
      this.listMainSign = results
    },
    contractDetail() {
      this.initDataFinalize()
    }
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    initDataFinalize() {
      if (!this.contractDetail) {
        return
      }

      if (this.contractDetail.note) {
        this.note = this.contractDetail.note
      }

      this.documentId = this.contractDetail.documentId
      if (this.contractDetail.isSignReminder) {
        this.isRemine = 'remine'
        this.dayRemine = this.contractDetail.signReminderDays
          ? this.contractDetail.signReminderDays
          : 1
      }
      if (this.contractDetail.expirationDate) {
        this.timeExpired = moment(
          this.contractDetail.expirationDate,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')
      }
      if (this.contractDetail.signingDeadline) {
        this.timeSign = moment(
          this.contractDetail.signingDeadline,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD')
      }
    },
    showTypeGroup(type) {
      if (type === constants.GROUPS.PERSONAL) {
        return this.$t('contract.personal')
      }
    },
    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },
    // check hien thi group nguoi dieu phoi
    isDisplayCoordinator(value) {
      let check = false
      if (
        value.type !== constants.GROUPS.INTERNAL &&
        value.data.group !== constants.GROUPS.PERSONAL &&
        value.data.isCoordinator
      ) {
        check = true
      }
      return check
    },
    // check hien thi neu la reprensent
    isDisplayGroup(value) {
      let check = false
      if (value === constants.GROUPS.INTERNAL) {
        check = true
      }
      return check
    },
    // check hien thi group dai dien khach hang
    isDisplayRepresent(value) {
      let check = false
      if (value.data.group !== constants.GROUPS.PERSONAL) {
        check = true
      }
      return check
    },
    checkType(represent) {
      return represent !== constants.GROUPS.INTERNAL
    },
    // Tieu de
    titlePanel(represent) {
      return represent.type === constants.GROUPS.INTERNAL
        ? this.$t('contract.yourRepresentative')
        : this.$t('contract.customerRepresentative')
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
    customFileName(strName) {
      const fileName = strName
      var names = fileName.split('.')
      const extFile = names[names.length - 1]
      var name = names.splice(0, names.length - 1).join('')
      if (name.length > 25) {
        name = `${name.slice(0, 12)}...${name.slice(15, 25)}.${extFile}`
      } else {
        name += `.${extFile}`
      }
      return name
    },
    // Tai file hop dong
    async downloadFileContract() {
      this.loading = true
      await this.viewFilePdf(this.fileContractUploaded)
      this.loading = false
    },
    // async viewFilePdf(file) {
    //   const urlFile = await FileService.download({
    //     fileName: file.fileName,
    //     storage: file.storage,
    //     filePath: file.filePath
    //   })
    //   this.srcFilePdf = urlFile
    //   this.showDialogViewPdf = true
    // },
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
    // Hien thi dialog huy
    showDialogCancel() {
      this.$emit('show-cancel')
    },
    // Hien thi dialog tu choi
    showDialogReject() {
      this.$emit('show-reject')
    },
    // Confirm save
    confirmCoordination(docState) {
      if (!this.validateTimeSignContract()) {
        return
      }
      this.showConfirmContract = true
      this.docState = docState
      this.titleConfirmSave = 'contract.dialog.titleConfirmCoordinationContract'
    },
    // Dieu phoi hop dong
    async coordinationContract() {
      const formData = {}
      const representGroups = this.buildParamSigner()
      try {
        const repCoordinate = representGroups.find(r => r.hasPermission)
        formData['signers'] = repCoordinate['signers']
        if (repCoordinate['reviewers']) {
          formData['reviewers'] = repCoordinate['reviewers']
        }

        await ContractService.coordinationContract(formData, this.documentId)
        const message = 'contract.coordinationContractSuccess'
        const typeAlert = 'success'
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message)
        })
        setTimeout(() => {
          this.goBackStep()
        }, 1500)
      } catch (e) {
        const typeAlert = 'error'
        const message = e.message
        this.$emit('show-alert', { message, typeAlert })
      }
    },
    // build params nguoi ky
    buildParamSigner() {
      var countStep = 0
      const representGroups = []
      this.listSigner.map((signator, index) => {
        if (index === 0) {
          countStep = signator.maxStep
        }
        if (signator.type === constants.GROUPS.INTERNAL) {
          return
        }
        countStep = countStep + 1
        const group = {}
        group.groupType = signator.type
        group.groupId = signator.groupId ? signator.groupId : null
        group.groupName = signator.groupName
        group.hasPermission = signator.hasPermission
        group.groupSignOrder = index + 1
        if (signator.data.isCoordinator) {
          const { signData } = this.buildDocNotRequest(
            constants.SIGN_USER_TYPE.DISTRIBUTOR,
            signator.data.coordinator,
            0,
            null
          )
          group.coordinator = signData
        } else {
          group.signers = []
          var totalReviewers = 0

          // group.reviews = []

          var lstReviews = []
          signator.data.reviews.map((signer, index) => {
            if (signer.email === '') {
              return
            }
            totalReviewers++
            const { signData } = this.buildDocNotRequest(
              constants.SIGN_USER_TYPE.REVIEWER,
              signer,
              countStep, // 1 + index,
              null
            )
            lstReviews.push(signData)
          })
          var countStepSign = totalReviewers > 0 ? countStep + 1 : countStep
          signator.data.signers.map((signer, index) => {
            const { signData } = this.buildDocNotRequest(
              constants.SIGN_USER_TYPE.MAIN,
              signer,
              countStepSign,
              this.listMainSign
            )
            countStepSign++

            countStep = countStepSign
            group.signers.push(signData)
          })
          countStep--
          if (lstReviews.length > 0) group.reviewers = lstReviews
        }
        representGroups.push(group)
      })
      return representGroups
    },

    // build params nguoi ky, nguoi xem xet
    buildDocNotRequest(signUserType, signer, step, listSigature) {
      var signData = {}
      signData.userId = signer.userId
      signData.fullName = signer.name
      signData.phone = signer.phone
      signData.email = signer.email

      signData.signUserType = signUserType
      signData.step = step

      var docNoteSigns = []
      if (signUserType === constants.SIGN_USER_TYPE.MAIN) {
        signData.signMethod =
          signer.signMethods.length > 1 &&
          !signer.signMethods.includes(constants.SIGN_METHODS.NORMAL_SIGN)
            ? constants.SIGN_METHODS.ALL
            : signer.signMethods.find(
              method => method !== constants.SIGN_METHODS.NORMAL_SIGN
            )
        if (signer.signMethods.length === 0) {
          signData.signMethod = constants.SIGN_METHODS.NORMAL_SIGN
        }
        var dataUserSign = listSigature[signer.email]

        dataUserSign.map(data => {
          var signature = {}
          signature.page = data.page
          // signature.signType = data.signType
          signature.signType = null

          signature.size = '(150,150)'
          signature.axisX = data.x
          signature.axisY = data.y
          docNoteSigns.push(signature)
        })
        if (docNoteSigns.length > 0) {
          signData.docNoteSigns = docNoteSigns
        }
      }
      return { signData }
    },
    // Validate thoi gian ky
    validateTimeSignContract() {
      return this.validateTimeSign() && this.validateTimeExpired()
    },
    validateTimeSign() {
      var isValid = true
      const currentDate = moment()

      // Thoi han ky
      if (this.timeSignValue.length > 0) {
        if (!moment(this.timeSignValue, 'DD/MM/YYYY', true).isValid()) {
          this.errorMessageTimeSign = `${this.$t(
            'contract.timeSign'
          )} ${this.$t('contract.formatDate')}`
          isValid = false
        } else {
          const selectDate = moment(this.timeSignValue, 'DD/MM/YYYY')
          const diff = selectDate.diff(currentDate, 'days')
          if (diff < 0) {
            isValid = false
            this.errorMessageTimeSign = `${this.$t('contract.timeSign')}
${this.$t('contract.mustGreathanCurrentDate')}`
          } else {
            this.errorMessageTimeSign = ''
          }
        }
      } else {
        this.errorMessageTimeSign = ''
        isValid = true
      }
      return isValid
    },
    validateTimeExpired() {
      var isValid = true
      const currentDate = moment()
      if (this.timeExpiredValue.length > 0) {
        if (!moment(this.timeExpiredValue, 'DD/MM/YYYY', true).isValid()) {
          this.errorMessageTimeExpired = 'contract.expireDateInvalid'
          isValid = false
        } else {
          const selectDate = moment(this.timeExpiredValue, 'DD/MM/YYYY')
          const diff = selectDate.diff(currentDate, 'days')
          if (diff < 0) {
            isValid = false
            this.errorMessageTimeExpired = 'contract.expireDateAndNow'
          } else {
            const timeSign = moment(this.timeSignValue, 'DD/MM/YYYY')
            const timeExpired = moment(this.timeExpiredValue, 'DD/MM/YYYY')
            const diffValue = timeExpired.diff(timeSign, 'days')
            if (diffValue <= 0) {
              isValid = false
              this.errorMessageTimeExpired = 'contract.expireDateAndTimeSign'
            } else {
              this.errorMessageTimeExpired = ''
            }
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
      const value = val ? val.trim() : ''

      return value
    }
  }
}
</script>

<style lang="scss">
.required .v-label {
  display: block !important;
  word-break: break-all;
  &::after {
    content: ' *';
    color: red;
  }
}
</style>
