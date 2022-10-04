<template>
  <div class="wrap-home px-2 mt-2">
    <v-container fluid class="py-5 pt-2 rounded-xl bg-primary">
      <breadcrumbs :items="breadcrumbs" clazz="pt-0" />
      <v-card color="white" class=" px-0">
        <v-stepper
          v-model="currentStep"
          class="contract-steps mb-0 no-transition"
          elevation="0"
        >
          <v-stepper-header class="elevation-0">
            <v-stepper-step
              :complete="currentStep >= 1"
              step="1"
              complete-icon=""
              class="step1-header text--subtitle nowrap"
            >
              {{ $t('contract.information') }}
            </v-stepper-step>
            <v-stepper-step
              :complete="currentStep >= 2"
              step="2"
              complete-icon=""
              class="hide-label step1-header"
            />
            <v-stepper-step
              :complete="currentStep >= 3"
              step="3"
              complete-icon=""
              class="text--subtitle nowrap"
            >
              {{ $t('contract.design') }}
            </v-stepper-step>

            <v-stepper-step
              step="4"
              :complete="currentStep == 4"
              complete-icon=""
              class="last-step text--subtitle nowrap"
            >
              {{ $t('contract.confirm') }}
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <step-1
                @next-step="moveStep"
                @show-cancel="showDialogCancel = true"
                @show-reject="showDialogReject = true"
                @show-alert="showAlert"
              />
            </v-stepper-content>
            <v-stepper-content step="2">
              <step-2
                @next-step="moveStep"
                @show-cancel="showDialogCancel = true"
                @show-reject="showDialogReject = true"
                @show-alert="showAlert"
              />
            </v-stepper-content>
            <v-stepper-content step="3">
              <step-3
                :file-contract="fileContractUploaded"
                :file-attachs="fileAttachsUploaded"
                @next-step="moveStep"
                @show-cancel="showDialogCancel = true"
                @show-reject="showDialogReject = true"
                @show-alert="showAlert"
              />
            </v-stepper-content>
            <v-stepper-content step="4">
              <step-4
                @next-step="moveStep"
                @show-cancel="showDialogCancel = true"
                @show-reject="showDialogReject = true"
                @show-alert="showAlert"
              />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
      <dialog-cancel
        :show-dialog="showDialogCancel"
        @close-dialog="showDialogCancel = false"
      />
      <dialog-reject
        :label-comment="`contract.label.reason`"
        :label-input-comment="`contract.label.inputReason`"
        :label-message-comment="`contract.reasonRequired`"
        :show-comment="true"
        :required-comment="true"
        :show-dialog="showDialogReject"
        @accept="acceptRejectCoordination"
        @close-dialog="showDialogReject = false"
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
    </v-container>
  </div>
</template>

<script>
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import Step4 from './components/Step4'
import DialogCancel from '../create-contract/components/DialogCancel.vue'
import alertMixin from '@/mixins/alert'
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import { ContractService } from '@/modules/econtract/services/contractService'
import routeCommon from '@/router/routePaths'
import econtractRoute from '@/modules/econtract/router/routePaths'
import constants from '@/constants'

import { mapActions, mapState } from 'vuex'
import DialogReject from './components/DialogReject.vue'

export default {
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    DialogCancel,
    Breadcrumbs,
    DialogReject
  },
  mixins: [alertMixin],
  data() {
    return {
      currentStep: 1,
      showDialogCancel: false,
      showDialogReject: false,
      isShowAlert: false,
      showIcon: true,
      message: '',
      breadcrumbs: [
        {
          text: 'contract.name',
          disabled: false,
          href: `${econtractRoute.LIST_CONTRACT_COORDINATION_PATH}`
        },
        {
          text: 'contract.coordination',
          disabled: true,
          href: `${econtractRoute.ECONTRACT_DASHBOARD_PATH}`
        }
      ]
    }
  },
  computed: {
    ...mapState('contract', [
      'fileContractUploaded',
      'fileAttachsUploaded',
      'goBack'
    ])
  },

  methods: {
    ...mapActions('layout', ['setNotify']),
    moveStep(step) {
      this.currentStep = step
    },
    async acceptRejectCoordination(comment) {
      // Tu choi dieu phoi
      try {
        const contractId = this.$route.params.contractId
        const data = {}
        data['comment'] = comment.trim()
        const response = await ContractService.rejectCoordinatingContract(
          data,
          contractId
        )
        if (response.status === 200) {
          var message = 'contract.rejectsSuccess.coordinate'
          const typeAlert = 'success'
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message)
          })
          setTimeout(() => {
            window.history.back()
          }, 1500)
        }
      } catch (error) {
        const typeAlert = 'error'
        const message = error
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message)
        })
      }
    },
    replaceUrlBack() {
      if (this.goBack !== '/') {
        this.$router.replace(
          `${constants.ROOT_PATH}app/contracts/${this.goBack}`
        )
      } else {
        this.$router.replace(`${routeCommon.ROOT_PATH}`)
      }
    },
    showAlert(data) {
      this.message = data.message
      this.typeAlert = data.typeAlert
      this.isShowAlert = true
      if (!data.showIcon) {
        this.showIcon = data.showIcon
      } else {
        this.showIcon = true
      }
    }
  }
}
</script>
