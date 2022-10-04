<template>
  <div class="wrap-home px-2 mt-2">
    <v-container fluid class=" py-5 pt-2 rounded-xl bg-primary flow-page">
      <breadcrumbs :items="breadcrumbs" clazz="pt-0" />
      <v-card color="white" class="content-page rounded-xl pb-0 px-0">
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
              class="step1-header"
            >
              <div class="text--subtitle-2 nowrap">
                {{ $t('contract.information') }}
              </div>
            </v-stepper-step>
            <v-stepper-step
              :complete="currentStep >= 2"
              step="2"
              complete-icon=""
              class="hide-label step1-header text--subtitle nowrap"
            />
            <v-stepper-step
              :complete="currentStep >= 3"
              step="3"
              complete-icon=""
            >
              <div class="text--subtitle-2 nowrap">
                {{ $t('contract.design') }}
              </div>
            </v-stepper-step>

            <v-stepper-step
              step="4"
              :complete="currentStep == 4"
              complete-icon=""
              class="last-step"
            >
              <div class="text--subtitle-2 nowrap">
                {{ $t('contract.confirm') }}
              </div>
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <step-1
                @next-step="moveStep"
                @show-cancel="showDialogCancel = true"
                @show-alert="showAlert"
              />
            </v-stepper-content>
            <v-stepper-content step="2">
              <step-2
                @next-step="moveStep"
                @show-cancel="showDialogCancel = true"
                @show-alert="showAlert"
              />
            </v-stepper-content>
            <v-stepper-content step="3">
              <step-3
                :file-contract="fileContractUploaded"
                :file-attachs="fileAttachsUploaded"
                @next-step="moveStep"
                @show-cancel="showDialogCancel = true"
                @show-alert="showAlert"
              />
            </v-stepper-content>
            <v-stepper-content step="4">
              <step-4
                @next-step="moveStep"
                @show-cancel="showDialogCancel = true"
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
import Step1 from './components/Step1.vue'
import Step2 from './components/Step2.vue'
import Step3 from './components/Step3.vue'
import Step4 from './components/Step4.vue'
import DialogCancel from '../create/components/DialogCancel.vue'
import alertMixin from '@/mixins/alert'
import checkRoles from '@/mixins/checkRoles'
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import constants from '@/constants'
import econtractRoute from '@/modules/econtract/router/routePaths'
import { mapState } from 'vuex'
export default {
  components: { Step1, Step2, Step3, Step4, DialogCancel, Breadcrumbs },
  mixins: [alertMixin, checkRoles],
  data() {
    return {
      currentStep: 1,
      showDialogCancel: false,
      isShowAlert: false,
      showIcon: true,
      message: '',
      breadcrumbs: [
        {
          text: 'flow.label.flow',
          disabled: false,
          href: `${econtractRoute.LIST_FLOWS_PATH}`
        },
        {
          text: 'flow.label.update',
          disabled: true,
          href: ''
        }
      ]
    }
  },
  computed: {
    ...mapState('contract', ['fileContractUploaded', 'fileAttachsUploaded'])
  },
  created() {
    this.hasPermission([constants.USER_ROLE.HDDT])
  },
  methods: {
    goBack() {
      this.$router.push(`${econtractRoute.LIST_CONTRACT_CREATED_PATH}`)
    },
    moveStep(step) {
      this.currentStep = step
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

<style src="../create/CreateFlow.scss" lang="scss"></style>
