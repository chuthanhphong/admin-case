<template>
  <v-dialog v-if="signerEdit" v-model="showDialog" persistent max-width="550">
    <v-card class="dialog-edit-signature">
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center text-capitalize">
          <div>{{ $t('document.dialog.configSignature') }}</div>
        </h5>
        <span v-if="signerEdit.signUserId" class="text-primary">
          {{ signerEdit.fullName }} ({{ signerEdit.signUserName }})
        </span>
        <span v-else class="text-primary">
          {{ signerEdit.positionName }} ({{ signerEdit.signGroupName }})
        </span>

        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <div class="px-8 py-2 pt-0">
        <v-radio-group v-model="option">
          <v-radio :value="optionsCopy.ALL_PAGE">
            <template v-slot:label>
              <div class="mr-10">{{ $t('document.dialog.copyAllPage') }}</div>
              <v-tooltip right content-class="tooltip-right">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                  >mdi-alert-circle-outline</v-icon>
                </template>
                <div class="mw-300 pa-0">
                  {{ $t('document.dialog.noteCopyAllPage') }}
                </div>
              </v-tooltip>
            </template>
          </v-radio>
          <v-radio :value="optionsCopy.SELECT_PAGE">
            <template v-slot:label>
              <div class="mr-10">{{ $t('document.dialog.copyRangePage') }}</div>
              <v-tooltip right content-class="tooltip-right">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                  >mdi-alert-circle-outline</v-icon>
                </template>
                <div class="mw-300 pa-0">
                  {{ $t('document.dialog.noteCopyRangePage') }}
                </div>
              </v-tooltip>
            </template>
          </v-radio>
        </v-radio-group>
        <v-scroll-y-transition>
          <div
            v-show="option === optionsCopy.SELECT_PAGE"
            class="wrap-select-page-sign col-10 mx-auto pa-0"
          >
            <div class="wrap-items pa-3">
              <rang-page
                :list-select-page-sign="listSelectPageSign"
                :max="maxPage"
              />
            </div>
            <div class="wrap-page-sign-footer">
              <v-btn
                color="white"
                fab
                dark
                x-small
                elevation="3"
                @click="addSelectPageSign"
              >
                <v-icon size="25" color="primary">mdi-plus-circle-outline</v-icon>
              </v-btn>
              <b class="primary--text pl-2 btn" @click="addSelectPageSign">{{
                $t('document.dialog.addRangePage')
              }}</b>
            </div>
          </div>
        </v-scroll-y-transition>
      </div>
      <v-card-actions class="d-flex justify-space-around py-6">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-200 py-6"
          @click="closeDialog"
        >
          {{ $t('cancelLabel') }}
        </v-btn>

        <v-btn
          rounded
          color="primary"
          class="w-200 py-6"
          @click="acceptEditSignature"
        >
          {{ $t('accept') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import constants from '@/constants'
import RangPage from './RangPage'
export default {
  components: {
    RangPage
  },
  props: {
    signerEdit: {
      type: Object,
      default: undefined
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    listSelectPageSign: {
      type: Array,
      default: undefined
    },
    maxPage: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      option: constants.OPTIONS_COPY_SIGNATURE.ALL_PAGE,
      optionsCopy: constants.OPTIONS_COPY_SIGNATURE
    }
  },
  watch: {
    option() {
      this.$emit('update-option-copy-signature', this.option)
    }
  },
  methods: {
    acceptEditSignature() {
      this.$emit('accept-edit-signature')
    },
    addSelectPageSign() {
      this.$emit('add-select-page-sign')
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="sass" scoped></style>
