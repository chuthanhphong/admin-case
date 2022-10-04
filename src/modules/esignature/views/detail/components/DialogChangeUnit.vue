<template>
  <v-dialog v-model="showDialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-center flex-column">
        <h5 class="text-center text-capitalize">
          <div>{{ $t('document.changeUnit') }}</div>
        </h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>

      <!-- body -->
      <div class="dialog-form">
        <!-- don vi ban hanh -->
        <v-row class="form-group">
          <v-col md="4" class="d-flex label-unit">
            <label>
              {{ $t('electronicSign.create.issueGroup') }}
            </label>
          </v-col>
          <v-col md="8">
            <validation-provider
              name="issueGroup"
              rules="required"
              vid="issueGroup1"
            >
              <v-autocomplete
                v-model="formdata.promulgateGroupId"
                :no-data-text="$t('noData')"
                :placeholder="$t('document.placeholder.issueGroup')"
                :items="lstGroupProclaim"
                item-text="groupName"
                item-value="groupId"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  maxHeight: 150
                }"
                :filter="filterItems"
                outlined
                attach
                dense
                class="text--body-1"
                @change="changeGroup(formdata.promulgateGroupId)"
              >
                <vue-feather
                  slot="append"
                  class="grey--text"
                  type="search"
                />
                <template v-slot:item="data">
                  <div class="select-item flex-column d-flex">
                    <div class="title-item">{{ data.item.groupName }}</div>
                    <div class="desc-item">
                      {{ data.item.parentPathName }}
                    </div>
                  </div>
                </template>
              </v-autocomplete>
            </validation-provider>
          </v-col>
        </v-row>

        <!-- so van ban dang ky -->
        <v-row class="form-group mt-0">
          <v-col md="4" class="label-unit">
            <div class="label-register">
              <label>{{ $t('document.label.countDocument') }}</label>
            </div>
            <div v-if="formdata.promulgateGroupId" class="">
              <small class="ml-3">({{ $t(nextNumber) }}:
                <span>{{ numDocRegiste }}</span>)</small>
            </div>
            <div v-else class="">
              <small class="ml-5" />
            </div>
          </v-col>
          <v-col md="8">
            <v-text-field
              v-model="formdata.registerNumber"
              dense
              outlined
              :placeholder="$t('document.label.enterRegister')"
              flat
              solo
              :disabled="!formdata.promulgateGroupId"
              class="text--body-1"
              :error-messages="$t(messageError)"
              maxlength="9"
              oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
              @input="onInputRegister"
            />
          </v-col>
        </v-row>
      </div>

      <!-- button -->
      <v-card-actions class="d-flex justify-center pt-5 pb-10">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-150 py-5 mr-12"
          @click="closeDialog"
        >
          {{ $t('document.signProcessStatus.reject') }}
        </v-btn>

        <v-btn
          :disabled="checkDisbled"
          rounded
          color="primary"
          class="w-150 py-5"
          @click="accept"
        >
          {{ $t('accept') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import rules from '@/mixins/rules'
import constants from '@/constants'
import { GroupService } from '@/services/groupService'
import filterItems from '@/mixins/filterItems.js'
import { DocumentService } from '@/modules/esignature/services/documentService'

export default {
  name: 'DialogChangeUnit',
  mixins: [rules, filterItems],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    formdata: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      numDocRegiste: 0, // so van ban dang ky
      listUsers: [],
      lstGroupProclaim: [],
      messageError: null,
      nextNumber: 'document.nextNumber'
    }
  },
  computed: {
    checkDisbled() {
      let check = false
      if (this.messageError) {
        check = true
      }
      return check
    }
  },
  watch: {
    showDialog() {
      if (this.showDialog) {
        this.getSuggestDocNum()
      }
    }

  },
  mounted() {
    this.getGroups()
    this.onInputRegister()
  },
  methods: {
    onInputRegister() {
      this.messageError = null
      if (this.formdata.registerNumber && this.formdata.registerNumber <= 0) {
        this.messageError = 'document.countDocumentInvalid'
        return this.messageError
      }
      if (this.formdata.registerNumber && this.formdata.registerNumber < this.numDocRegiste) {
        this.messageError = 'document.countDocumentResgiter'
        return this.messageError
      }
    },
    changeGroup(value) {
      this.formdata.registerNumber = null
      if (!this.formdata.promulgateGroupId) {
        this.messageError = null
      }
      this.getSuggestDocNum()
    },
    async getGroups() {
      try {
        const param = {
          pageSize: 1000,
          restrictHierarchy: 'false',
          groupType: constants.GROUPS.INTERNAL
        }
        const response = await GroupService.search(param)
        this.lstGroupProclaim = response.data.data
      } catch (error) {
        console.log(error)
      }
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
    accept() {
      this.$emit('accept')
    },
    async getSuggestDocNum() {
      try {
        var formRequest = {
          formulaTypeId: null,
          promulgateGroupId: null,
          securityTypeId: null,
          promulgateDate: null,
          docType: 1
        }

        if (this.formdata.formulaTypeId) {
          formRequest.formulaTypeId = this.formdata.formulaTypeId
        }
        if (this.formdata.secureTypeId) {
          formRequest.securityTypeId = this.formdata.secureTypeId
        }
        if (this.dateProclaimValue) {
          formRequest.promulgateDate = this.dateProclaimValue.replaceAll(
            '/',
            ''
          )
        }
        if (this.formdata.promulgateGroupId) {
          formRequest.promulgateGroupId = this.formdata.promulgateGroupId

          const response = await DocumentService.getSuggestDocNum(formRequest)
          if (response.data) {
            this.numDocRegiste = response.data
            this.onInputRegister()
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-form {
  padding: 20px;
  margin: 0 20px;
  .form-group {
    display: flex;
    justify-content: center;
    align-items: center;
    .label-register {
      label {
        top: 0 !important;
      }
    }
    label {
      font-size: 12px;
      width: 130px;
      top: -14px;
      position: relative;
      font-weight: bold;
      text-align: right;
      padding-right: 30px;
      margin-bottom: 0 !important;
    }
    .col {
      padding: 12px 0 0 0;
    }
    .wrap-users-list {
      position: relative;
      .wrap-users {
        position: absolute;
        width: 100%;
        top: 50px;
        max-height: 300px;
        overflow-y: auto;
        border-radius: 5px;
        border: 1px solid #ccc;
        margin-top: 2px;
        z-index: 1;
        background: #fff;
      }
    }
  }
}
.maginUnit {
  margin-bottom: -20px;
}
.label-unit {
  white-space: nowrap;
  small {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
    color: #8E8EA1;
    line-height: 18px;
    letter-spacing: 0.1px;
  }
  span {
    color: red;
  }
}
</style>
