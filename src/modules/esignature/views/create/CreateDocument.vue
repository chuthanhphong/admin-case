<template>
  <div class="wrap-home px-2 text-color-esignature">
    <v-container fluid class="py-5 rounded-xl bg-primary">
      <breadcrumbs :items="breadcrumbs" clazz="pt-0" />
      <v-card color="white" class="content-page px-0 pb-0 rounded-xl">
        <v-stepper
          v-model="currentStep"
          class="esignature-steps mb-0 no-transition"
          elevation="0"
        >
          <v-stepper-header class="elevation-0">
            <v-stepper-step
              :complete="currentStep > 2"
              step="1"
              complete-icon="mdi-check"
              class="step1-header"
              :class="getClassStep1"
            >
              {{ $t('electronicSign.infoDocument') }}
            </v-stepper-step>
            <v-stepper-step
              :complete="currentStep > 2"
              step="2"
              complete-icon=""
              class="hide-label step1-header"
            />
            <v-stepper-step
              :complete="currentStep > 3"
              step="3"
              complete-icon="mdi-check"
            >
              {{ $t('electronicSign.designDocument') }}
            </v-stepper-step>

            <v-stepper-step
              step="4"
              :complete="currentStep > 4"
              complete-icon=""
            >
              {{ $t('electronicSign.confirm') }}
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
                :list-file-document="fileDocumentUploaded"
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
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import Step1 from '@/modules/esignature/views/create/components/Step1.vue'
import Step2 from '@/modules/esignature/views/create/components/Step2.vue'
import Step3 from '@/modules/esignature/views/create/components/Step3.vue'
import Step4 from '@/modules/esignature/views/create/components/Step4.vue'
import DialogCancel from '@/modules/esignature/views/create/components/DialogCancel.vue'
import alertMixin from '@/mixins/alert'
import routeEsignature from '@/modules/esignature/router/routePaths'
// import routeCommon from '@/router/routePaths'

import { mapState } from 'vuex'

export default {
  name: 'CreateEsignature',

  components: { Step1, Step2, Step3, Step4, DialogCancel, Breadcrumbs },

  mixins: [alertMixin],
  data() {
    return {
      currentStep: 1,
      showDialogCancel: false,
      isShowAlert: false,
      message: '',
      breadcrumbs: [
        {
          text: 'electronicSign.textSubmit',
          disabled: false,
          href: routeEsignature.DOCUMENT_LIST_CREATE_PATH
        },
        {
          text: 'electronicSign.createDocument',
          disabled: true,
          href: ''
        }
      ]
    }
  },
  computed: {
    ...mapState('esignature', ['fileDocumentUploaded', 'fileAttachsUploaded']),
    getClassStep1() {
      if (this.currentStep > 2 && this.currentStep !== 1) return 'step3'
      return 'step1'
    }
  },
  methods: {
    goBack() {
      this.$router.push(routeEsignature.CREATE_DOCUMENT_PATH)
    },
    moveStep(step) {
      this.currentStep = step
    },
    complete() {},
    showAlert(data) {
      this.message = data.message
      this.typeAlert = data.typeAlert
      this.isShowAlert = true
    }
  }
}
</script>

<style src="./CreateDocument.scss" lang="scss"></style>
