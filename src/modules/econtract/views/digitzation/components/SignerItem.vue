<template>
  <div class="d-flex flex-column mb-3">
    <div class="signer-item align-center col-12 py-2 pr-4">
      <div class="signer-action">
        <btn-remove v-if="showRemove && !disabled" @on-click="removeSigner" />
      </div>
      <div class="signer-customer-index">
        {{ index }}
      </div>
      <div class="row align-center">
        <!--Loai khach hang  -->
        <div class="col-md-2 form-group">
          <label class="text--body-1">
            {{ $t('contract-manager.labels.groupCustomer')
            }}<span class="color-require ">*</span>
          </label>
          <validation-provider
            name="contractType"
            rules="required"
            :vid="`contractType-${index}`"
          >
            <v-select
              v-model="signer.signerType"
              dense
              outlined
              attach
              :disabled="disabled"
              required
              :items="selectGroup"
              :item-text="item => $t(item.name)"
              item-value="value"
              class="text--body-5"
              @change="changeSignerType"
            >
              <template v-slot:append>
                <v-icon>mdi-chevron-down</v-icon>
              </template>
            </v-select>
          </validation-provider>
        </div>
        <!-- Ten cong ty -->
        <div v-if="showCompanyInput" class="col-md-2 form-group">
          <label class="text--body-1">
            {{ $t('contract.companyName') }}
            <span class="color-require ">*</span>
          </label>
          <validation-provider
            v-slot="{ errors }"
            name="companyName"
            rules="required"
            :vid="`companyName-${index}`"
          >
            <v-text-field
              v-model.trim="signer.groupName"
              outlined
              maxlength="255"
              dense
              :disabled="disabled"
              clearable
              :placeholder="$t('contract.companyName')"
              :error-messages="errors"
              required
              class="text--body-5"
              @input="onInputSearchCompany"
              @blur="closeFilterCompany"
              @change="triggerValidate"
              @click:clear="clearSignerCompany"
            >
              <vue-feather
                slot="prepend-inner"
                class="grey--text"
                type="search"
              />
            </v-text-field>
            <div v-show="showFilterCompany" class="wrap-list-search">
              <v-list dense>
                <v-list-item-group v-model="selectedCompany" color="primary">
                  <v-list-item
                    v-for="(company, idx) in listCompany"
                    :key="idx"
                    two-line
                    class="py-0"
                  >
                    <v-list-item-content class="py-0">
                      <v-list-item-title>{{
                        company.groupName
                      }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        company.parentGroupName
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
          </validation-provider>
        </div>

        <!-- Dai dien khach hang -->
        <div class="col-md-2 form-group">
          <label class="text--body-1">
            {{ $t('contract.customerRepresentative') }}
            <span class="color-require ">*</span>
          </label>
          <validation-provider
            v-slot="{ errors }"
            ref="refProvidercustomerRepresentative"
            name="customerRepresentative"
            :rules="groupNameInput"
            :vid="`customerRepresentative-${index}`"
          >
            <v-text-field
              v-model.trim="signer.signerName"
              outlined
              maxlength="255"
              dense
              clearable
              :placeholder="$t('contract.customerRepresentative')"
              :error-messages="errors"
              required
              class="text--body-5"
              :disabled="disableInput || disabled"
              @click:clear="clearSignerName"
              @input="onInputSearchCustomer"
              @blur="closeFilterCustomer"
              @change="triggerValidate"
            >
              <vue-feather
                slot="prepend-inner"
                class="grey--text"
                type="search"
              />
            </v-text-field>
          </validation-provider>
          <div v-show="showFilterCustomer" class="wrap-list-search">
            <v-list dense>
              <v-list-item-group v-model="selectedCustomer" color="primary">
                <v-list-item
                  v-for="(user, idx) in listCustomer"
                  :key="idx"
                  two-line
                  class="py-0"
                >
                  <v-list-item-content class="py-0">
                    <v-list-item-title>{{ user.fullName }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ user.position }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>

        <!-- Email -->
        <div class="col-md-2 form-group">
          <label class="text--body-1">Email</label>
          <validation-provider
            v-slot="{ errors }"
            name="email"
            :rules="signer.email ? ruleEmail : ''"
            :vid="`email-${index}`"
          >
            <v-text-field
              ref="signerEmail"
              v-model.trim="signer.email"
              name="email"
              placeholder="Email"
              outlined
              clearable
              dense
              :disabled="disableInput || disabled"
              maxlength="255"
              required
              class="text--body-5"
              :error-messages="errors"
              @change="triggerValidate"
              @input="signer.signerId = ''"
            />
          </validation-provider>
        </div>
        <!-- Phone -->
        <div class="col-md-2 form-group">
          <label class="text--body-1">{{ $t('contract.phone') }}</label>
          <v-text-field
            v-model.trim="signer.phoneNumber"
            name="phone"
            :placeholder="$t('group.phoneNo')"
            outlined
            clearable
            maxlength="15"
            dense
            class="text--body-5"
            :disabled="disableInput || disabled"
            oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
            @change="triggerValidate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Contants
import constants from '@/constants'

// Mixins
import rules from '@/mixins/rules'
import fileMixin from '@/modules/econtract/mixins/fileMixin'

// Components
import BtnRemove from '@/modules/econtract/views/eContract/contract/create-contract/components/BtnRemove.vue'

// Services
import { ContractService } from '@/modules/econtract/services/contractService'

export default {
  components: { BtnRemove },
  mixins: [rules, fileMixin],
  props: {
    signer: {
      type: Object,
      default: undefined
    },
    index: {
      type: Number,
      default: undefined
    },
    showRemove: {
      type: Boolean,
      default: false
    },
    formdata: {
      type: Object,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectGroup: [
        { name: 'contract.group', value: constants.GROUPS.GROUP },
        { name: 'contract.personal', value: constants.GROUPS.PERSONAL }
      ],
      listCompany: [],
      listCustomer: [],
      showFilterCompany: false,
      showFilterCustomer: false,
      selectedCompany: null,
      selectedCustomer: null,
      tempCompany: null,
      tempCustomer: null
    }
  },
  computed: {
    showCompanyInput() {
      return this.signer.signerType === constants.GROUPS.GROUP
    },
    disableInput() {
      if (this.signer.signerType === constants.GROUPS.PERSONAL) {
        return false
      } else {
        return (
          !(this.signer.groupName && this.signer.groupName.trim().length > 0) ||
          !this.signer.groupName
        )
      }
    }
  },
  watch: {
    selectedCompany() {
      if (this.selectedCompany == null) {
        return
      }
      var item = this.listCompany[this.selectedCompany]
      if (item) {
        this.tempCompany = item
      }
      this.signer.groupId = this.tempCompany.groupId
      this.signer.groupName = this.tempCompany.groupName
      this.closeFilterCompany()
      this.triggerValidate()
    },
    selectedCustomer() {
      if (this.selectedCustomer == null) {
        return
      }
      var item = this.listCustomer[this.selectedCustomer]
      if (item) {
        this.tempCustomer = item
      }
      this.signer.signerId = this.tempCustomer.userId
      this.signer.signerName = this.tempCustomer.fullName
      this.signer.email = this.tempCustomer.email
      this.signer.phoneNumber = this.tempCustomer.phone
      this.triggerValidate()
      this.closeFilterCustomer()
    }
  },
  created() {
    this.signer.signingStep = this.index
    // this.searchCompany()
    // this.searchCustomer()
  },
  methods: {
    triggerValidate() {
      this.$emit('validate-duplicates')
    },
    removeSigner() {
      this.$emit('remove-signer', this.index - 1)
    },
    clearSignerCompany() {
      this.$refs.refProvidercustomerRepresentative.reset()
      this.signer.signerName = ''
      this.signer.signerId = ''
      this.signer.email = ''
      this.signer.phoneNumber = ''
    },
    changeSignerType() {
      this.$refs.refProvidercustomerRepresentative.reset()
      this.signer.groupId = ''
      this.signer.groupName = ''
      this.signer.signerName = ''
      this.signer.signerId = ''
      this.signer.email = ''
      this.signer.phoneNumber = ''
      this.selectedCompany = null
      this.selectedCustomer = null
    },
    async searchCompany() {
      const params = {
        groupName: this.signer.groupName
      }

      const response = await ContractService.searchCompanyContractManager(
        params
      )
      if (response.success) {
        this.listCompany = response.data ? response.data.data : []
        this.filterCompanys()
        this.showFilterCompany = this.listCompany.length > 0
      } else {
        console.log(response.messages)
      }
    },

    async searchCustomer() {
      const fullName = this.trimSpace(this.signer.signerName)
      if (!fullName) {
        return
      }

      if (this.trimSpace(this.signer.groupName).length === 0) {
        this.signer.groupId = ''
      }
      const params = {
        groupId: this.signer.groupId,
        fullName: fullName
      }
      const response = await ContractService.searchCustomerContractManager(
        params
      )
      if (response.success) {
        this.listCustomer = response.data ? response.data.data : []
        this.filterCustomers()
        this.showFilterCustomer = this.listCustomer.length > 0
      } else {
        console.log(response.messages)
      }
    },
    closeFilterCompany() {
      setTimeout(() => {
        this.showFilterCompany = false
      }, 200)
    },
    closeFilterCustomer() {
      setTimeout(() => {
        this.showFilterCustomer = false
      }, 200)
    },
    clearSignerName() {
      this.signer.email = ''
      this.signer.signerId = ''
      this.signer.phoneNumber = ''
    },
    onInputSearchCompany() {
      this.signer.groupId = ''
      this.selectedCompany = null
      setTimeout(() => {
        this.searchCompany()
      }, 200)
    },
    onInputSearchCustomer() {
      this.signer.signerId = ''
      this.selectedCustomer = null
      if (!this.signer.groupId && this.showCompanyInput) return
      setTimeout(() => {
        this.searchCustomer()
      }, 200)
    },
    filterCompanys() {
      let lstGroupIds = this.formdata.externalSigners.map(signer => {
        if (signer.groupId) {
          return signer.groupId
        } else {
          return null
        }
      })
      lstGroupIds = lstGroupIds.filter(c => c !== null)
      this.listCompany = this.listCompany.filter(
        c => !lstGroupIds.includes(c.groupId)
      )
    },
    filterCustomers() {
      let lstSignerIds = this.formdata.externalSigners.map(signer => {
        if (signer.signerId) {
          return signer.signerId
        } else {
          return null
        }
      })
      lstSignerIds = lstSignerIds.filter(c => c !== null)
      this.listCustomer = this.listCustomer.filter(
        c => !lstSignerIds.includes(c.userId)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.signer-customer-index {
  font-size: 14px;
  font-weight: 600;
  color: #4b506d;
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
}
.signer-item {
  .form-group {
    .v-input__slot {
      width: 100%;
    }
    flex: 0 0 20%;
    max-width: 20%;
    @media (max-width: 1440px) {
      flex: 0 0 33%;
      max-width: 33%;
    }
    @media (max-width: 800px) {
      flex: 0 0 50%;
      max-width: 50%;
    }
    @media (max-width: 640px) {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
  label {
    text-transform: none;
    color: #6b7280;
    font-weight: 600;
  }
}
</style>
