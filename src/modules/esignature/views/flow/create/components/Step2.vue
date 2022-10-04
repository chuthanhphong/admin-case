<template>
  <div>
    <!-- Danh sach ben ky -->
    <h5 class="my-3">
      {{ $t('document.listOfSignature') + ' (' + countSigner + ')' }}
    </h5>
    <validation-observer ref="observerStep2" v-slot="{ invalid }">
      <div class="wrap-content-esignature-step-2">
        <div class="wrap-types">
          <container lock-axis="y" @drop="onDropListSigner">
            <draggable v-for="(signer, index) in listSigner" :key="index">
              <!-- Dai dien cua ban -->
              <v-card class="mb-10 pb-5 group-sign-esignature rounded-xl group-blue">
                <div class="header-panel d-flex align-center pr-6">
                  <v-tooltip
                    v-if="listSigner.length > 1"
                    top
                    content-class="tooltip-top"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="btn-remove-signator"
                        v-bind="attrs"
                        @click="removeSignator(index)"
                        v-on="on"
                      >mdi-minus-circle-outline</v-icon>
                    </template>
                    <span>{{ $t('document.tooltip.removeSignator') }}</span>
                  </v-tooltip>
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
                    v-model="signer.openPanel"
                    multiple
                    class="elevation-0"
                  >
                    <v-expansion-panel class="elevation-0 rounded-xl">
                      <v-expansion-panel-content class="mx-8 pb-3 rounded-lg">
                        <container
                          lock-axis="y"
                          class="py-2"
                          drag-class="bg-primary"
                          @drop="onDropSigners(index, $event)"
                          @drag-start="onDragStart"
                        >
                          <draggable
                            v-for="(item, idx) in signer.signers"
                            :key="idx"
                          >
                            <validation-observer ref="observerSigner">
                              <group-signer
                                :index="index"
                                :idx="idx"
                                :form-data="item"
                                :show-remove="signer.signers.length > 1"
                                @on-remove-signer="removeSigner(index, idx)"
                                @reset-signatures="resetListSignature"
                              />
                            </validation-observer>
                          </draggable>
                        </container>
                        <div class="d-flex justify-center mt-3">
                          <btn-add
                            :show-buttom="showBtnAdd"
                            :tooltip="$t('document.addSigner')"
                            @on-click="addSigner(index)"
                          />
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </v-card>
            </draggable>
          </container>

          <v-btn
            block
            :disabled="showBtnAdd"
            color="primary"
            outlined
            dark
            class="text-primary text-capitalize py-10 text-center rounded-xl"
            @click="addSignator"
          >
            <span class="text-add">{{ $t('document.addSignator') }}</span>
            <v-icon size="40" class="icon-add">mdi-plus-circle-outline</v-icon>
          </v-btn>
        </div>
      </div>
      <hr class="mt-2">
      <div class="d-flex justify-end group-action-step1 mr-4">
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
          :disabled="invalid"
          @click="validateSigner"
        >
          {{ $t('document.continue') }}
        </v-btn>
      </div>
    </validation-observer>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import BtnAdd from './BtnAdd.vue'
import GroupSigner from './GroupSigner'
import { Container, Draggable } from 'vue-smooth-dnd'
import { applyDrag } from '@/helpers/utils'
import constants from '@/constants'

const initSignerData = {
  // thong tin user
  signUserId: '',
  signUserName: '',
  fullName: '',
  email: '',
  phone: '',
  // thong tin chuc danh
  positionName: '',
  positionId: '',
  // thong tin don vi
  signGroupId: '',
  signGroupName: '',
  parentGroupName: '',
  groupCode: '',
  step: '',
  groupLevel: '',
  signUserType: constants.SIGN_USER_TYPE.MAIN,
  signMethod: []
}
export default {
  name: 'Step2',
  components: {
    BtnAdd,
    GroupSigner,
    Draggable,
    Container
  },
  data() {
    return {
      completed: false,
      listUsers: [],
      groups: [],
      listSigner: [
        {
          signers: [{ ...initSignerData }],
          openPanel: [0]
        }
      ]
    }
  },
  computed: {
    countSigner() {
      let countSigner = 0
      this.listSigner.map((signator) => {
        signator.signers.map((signer) => {
          if (!signer.positionId) {
            return
          }
          countSigner++
        })
      })
      this.setCountSigner(countSigner)
      return countSigner
    },
    showBtnAdd() {
      let count = 0
      this.listSigner.map((signator) => {
        count += signator.signers.length
      })
      return count >= 50
    }
  },
  methods: {
    ...mapActions('esignature', [
      'setListSigner',
      'setCountSigner',
      'setResetSignatures',
      'setLoadFileSign'
    ]),

    resetListSignature() {
      this.setResetSignatures(true)
    },
    // loc user trung positionId
    validateSigner() {
      var totalSigner = []
      this.listSigner.map((element) => {
        totalSigner.push(...element.signers)
      })
      // check trung chuc danh
      totalSigner.filter((e) => {
        if (e.positionId) {
          e['keyPositionId'] = `${e.signGroupId}${e.positionId}${e.signUserId}`
        }
      })
      const userIdDuplicates = []
      const groupPositionIds = _.groupBy(totalSigner, 'keyPositionId')
      const keyPositionId = Object.keys(groupPositionIds)
      keyPositionId.map((k) => {
        if (groupPositionIds[k].length > 1) {
          userIdDuplicates.push(groupPositionIds[k][0])
        }
      })

      if (userIdDuplicates.length > 0) {
        let message = `${this.$t('document.position')} ${
          userIdDuplicates[0].positionName
        } ${this.$t('document.beLongToUnit')} ${
          userIdDuplicates[0].groupName
        } ${this.$t('document.duplicateUser')}`
        if (userIdDuplicates[0].fullName) {
          message = `${userIdDuplicates[0].fullName} (${
            userIdDuplicates[0].userName
          }) ${this.$t('document.duplicatePosition')} ${
            userIdDuplicates[0].positionName
          } ${this.$t('document.beLongToUnit')} ${
            userIdDuplicates[0].groupName
          }`
        }
        const typeAlert = 'error'
        this.$emit('show-alert', { message, typeAlert })
        return
      }
      // check loai nguoi ky chinh
      const checkSignType = totalSigner.find(
        (e) => e.signUserType === constants.SIGN_USER_TYPE.MAIN
      )
      if (!checkSignType) {
        const message = this.$t('document.checkSignType')
        const typeAlert = 'error'
        this.$emit('show-alert', { message, typeAlert })
        return
      }
      this.nextStep()
    },
    // Them  nguoi ky
    addSigner(index) {
      this.listSigner[index]['signers'].push({
        ...initSignerData
      })
      this.setResetSignatures(true)
    },
    clearData(index, idx) {
      this.listSigner[index].signers[idx] = [{ ...initSignerData }]
    },
    // Xoa  nguoi ky
    removeSigner(index, idSigner) {
      this.listSigner[index].signers.splice(idSigner, 1)
      this.setResetSignatures(true)
    },
    // Keo tha nguoi ky
    onDropSigners(index, resultDrop) {
      this.listSigner[index].signers = applyDrag(
        this.listSigner[index].signers,
        resultDrop
      )
    },
    // Keo tha ben dai dien
    onDropListSigner(resultDrop) {
      this.listSigner = applyDrag(this.listSigner, resultDrop)
      this.$refs.observerStep2.reset()
    },
    // Them ben tham gia ky
    addSignator() {
      this.listSigner.push({
        signers: [{ ...initSignerData }],
        openPanel: [0]
      })
      this.setResetSignatures(true)
    },
    // Xoa ben them gia ky
    removeSignator(index) {
      this.listSigner.splice(index, 1)
      this.setResetSignatures(true)
    },
    nextStep() {
      this.updateListSigner()
      this.setLoadFileSign(true)
      this.$emit('next-step', 3)
      this.setResetSignatures(false)
    },
    prevStep() {
      this.$emit('next-step', 1)
    },
    // Hien thi dialog huy
    showDialogCancel() {
      this.$emit('show-cancel')
    },
    // Cap nhat lai list signer
    updateListSigner() {
      this.setListSigner(null)
      this.setListSigner(this.listSigner)
    },
    onDragStart(dragResult) {
      this.$refs.observerStep2.reset()
    }
  }
}
</script>

<style lang="scss">
.group-sign-esignature {
  .error--text {
    .v-text-field__details {
      background: #fff;
    }
  }
  .v-text-field__details {
    position: absolute !important;
    bottom: -30px;
    width: 100%;
    background: transparent;
    border-radius: 5px;
    padding: 5px 10px !important;
  }
}
.theme--dark.v-btn.v-btn--disabled {
  background-color: rgba(0, 0, 0, 0.12) !important;
  color: rgba(0, 0, 0, 0.26) !important;
}
</style>
