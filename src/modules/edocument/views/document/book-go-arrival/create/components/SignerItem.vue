<template>
  <div class="d-flex flex-column mb-3">
    <div
      class="signer-item align-center col-12 py-2 pr-4 bg-main"
    >
      <div class="signer-action">
        <btn-remove v-if="showRemove" @on-click="removeSigner" />
      </div>
      <div class="signer-customer-index">
        {{ index }}
      </div>
      <div class="row align-center">
        <!-- Ten nguoi ky -->
        <div class="col-md-2 form-group">
          <label class="text--body-4">
            {{ $t('managementDoc.updateDoc.signerName') }}
            <span class="color-require">*</span>
          </label>
          <validation-provider
            v-slot="{ errors }"
            ref="refProvidercustomerRepresentative"
            name="signerName"
            :rules="groupNameInput"
            :vid="`customerRepresentative-${index}`"
          >
            <v-text-field
              v-model="signer.signFullName"
              outlined
              maxlength="255"
              dense
              clearable
              :error-messages="errors"
              required
              class="text--body-2"
              :placeholder="$t('managementDoc.placeholder.signerName')"
              @click:clear="clearSignerName"
              @input="onInputSearchCustomer"
              @blur="closeFilterCustomer"
              @change="triggerValidate(); signer.signFullName = trimSpace(signer.signFullName)"
              @click="selectSigner()"
            >
              <vue-feather
                slot="prepend-inner"
                class="grey--text"
                type="search"
              />
            </v-text-field>
          </validation-provider>
          <div v-show="showFilterCustomer" class="wrap-list-search-user">
            <v-list dense>
              <v-list-item-group v-model="selectedCustomer" color="primary">
                <v-list-item
                  v-for="(user, idx) in listCustomer"
                  :key="idx"
                  two-line
                  class="py-0"
                >
                  <v-list-item-content class="py-0">
                    <v-list-item-title>{{ user.fullName }} ({{ user.userName }})</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ genEmailAndPhone(user) }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ genPositionName(user) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>

        <!-- Ten cong ty -->
        <div class="col-md-2 form-group">
          <label class="text--body-4">
            {{ $t('managementDoc.updateDoc.groupName') }}
          </label>
          <v-text-field
            v-model="signer.signGroupName"
            outlined
            maxlength="255"
            dense
            clearable
            class="text--body-2"
            :placeholder="$t('enterGroupName')"
            @input="onInputSearchCompany"
            @blur="closeFilterCompany"
            @change="triggerValidate(); signer.signGroupName = trimSpace(signer.signGroupName)"
            @click:clear="clearSignerCompany"
            @click="selectCompany()"
          >
            <vue-feather
              slot="prepend-inner"
              class="grey--text"
              type="search"
            />
          </v-text-field>
          <div v-show="showFilterCompany" class="wrap-list-search-user">
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
                    <v-list-item-subtitle>
                      {{ $t(genGroupName(company)) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>

        <!-- Email -->
        <div class="col-md-2 form-group">
          <label class="text--body-4">Email</label>
          <validation-provider
            v-slot="{ errors }"
            name="email"
            :rules="signer.email ? ruleEmailNotRequired : ''"
            :vid="`email-${index}`"
          >
            <v-text-field
              ref="signerEmail"
              v-model="signer.email"
              name="email"
              outlined
              clearable
              dense
              :placeholder="$t('enterEmail')"
              maxlength="255"
              required
              class="text--body-2"
              :error-messages="errors"
              @input="signer.signUserId = ''"
              @change="signer.email = trimSpace(signer.email)"
            />
          </validation-provider>
        </div>
        <!-- Phone -->
        <div class="col-md-2 form-group">
          <label class="text--body-4">{{
            $t('managementDoc.updateDoc.phoneNumber')
          }}</label>
          <v-text-field
            v-model="signer.phone"
            name="phone"
            outlined
            clearable
            :placeholder="$t('enterPhone')"
            maxlength="15"
            dense
            class="text--body-2"
            oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
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
import { DocumentService } from '@/modules/edocument/services/documentService'

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
    }
  },
  data() {
    return {
      listCompany: [],
      listCustomer: [],
      showFilterCompany: false,
      showFilterCustomer: false,
      selectedCompany: null,
      selectedCustomer: null,
      tempCompany: null,
      tempCustomer: null,
      keywordTemp: null,
      firstSelect: false,
      groupNameTmp: null
    }
  },
  computed: {
    showCompanyInput() {
      return this.signer.signerType === constants.GROUPS.GROUP
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
      this.firstSelect = true
      if (this.signer.userId) {
        this.firstSelect = false
      }
      this.signer.signGroupId = this.tempCompany.groupId
      this.signer.signGroupName = this.tempCompany.groupName
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
      this.signer.signGroupId = this.tempCustomer.groupId
      this.signer.signGroupName = this.tempCustomer.groupName
      this.signer.signUserId = this.tempCustomer.userId
      this.signer.signFullName = this.tempCustomer.fullName
      this.signer.signUserName = this.tempCustomer.userName
      this.signer.email = this.tempCustomer.email
      this.signer.phone = this.tempCustomer.phone
      this.triggerValidate()
      this.closeFilterCustomer()
    }
  },
  created() {
  },
  methods: {
    genGroupName(group) {
      let groupName = 'group.partnerLabel'
      if (group.groupType === constants.GROUPS.INTERNAL) {
        groupName = group.parentPathName
      }
      return groupName
    },
    genEmailAndPhone(user) {
      if (user.phone) {
        return `${user.email} - ${user.phone}`
      }
      return user.email
    },
    genPositionName(user) {
      if (user.roleName) {
        return `${user.positionName} - ${user.groupPathName}`
      }
      return `${user.groupPathName}`
    },

    triggerValidate() {
      setTimeout(() => {
        this.$emit('validate-duplicates')
      }, 200)
    },

    // xoa nguoi ky
    removeSigner() {
      this.$emit('remove-signer', this.index - 1)
    },

    // xoa don vi
    clearSignerCompany() {
      this.$refs.refProvidercustomerRepresentative.reset()
      this.signer.signGroupId = ''
      this.signer.signGroupName = ''
    },

    // click chon don vi
    selectCompany() {
      this.groupNameTmp = null
      this.searchCompany()
    },

    // api tim kiem don vi
    async searchCompany() {
      if (this.signer.signGroupName &&
        this.signer.signGroupName.trim() === this.groupNameTmp) {
        return
      }
      this.keywordgroupNameTmpTemp = this.signer.signGroupName && this.signer.signGroupName.trim()
      if (this.trimSpace(this.signer.signFullName).length === 0) {
        this.signer.signUserId = ''
      }
      const params = {
        keyword: this.signer.signGroupName,
        signerId: this.signer.signUserId
      }

      const response = await DocumentService.getListGroup(params)
      if (response.success) {
        this.listCompany = response.data ? response.data : []
        // this.filterCompanys()
        this.showFilterCompany = this.listCompany.length > 0
      } else {
        console.log(response.messages)
      }
    },

    // click chon ten nguoi ky
    selectSigner() {
      this.keywordTemp = null
      this.searchCustomer()
    },

    trimSpace(val) {
      return val ? val.trim() : ''
    },

    // api tim kiem nguoi ky
    async searchCustomer() {
      if (
        this.signer.signFullName &&
        this.signer.signFullName.trim() === this.keywordTemp
      ) {
        return
      }
      this.keywordTemp = this.signer.signFullName && this.signer.signFullName.trim()

      if (this.trimSpace(this.signer.signGroupName).length === 0) {
        this.signer.signGroupId = ''
      }
      const params = {
        groupId: this.signer.signGroupId,
        keyword: this.signer.signFullName,
        restrictHierarchy: true
      }
      const response = await DocumentService.searchSignerDocumentBook(params)
      if (response.success) {
        this.listCustomer = response.data ? response.data : []
        // this.filterCustomers()
        this.showFilterCustomer = this.listCustomer.length > 0
      } else {
        console.log(response.messages)
      }
    },

    // dong popup show danh sach don vi
    closeFilterCompany() {
      setTimeout(() => {
        this.showFilterCompany = false
      }, 200)
    },

    // dong popup show danh sach nguoi ky
    closeFilterCustomer() {
      setTimeout(() => {
        this.showFilterCustomer = false
      }, 200)
    },

    // xoa nguoi ky
    clearSignerName() {
      this.signer.email = ''
      this.signer.signUserId = ''
      this.signer.phone = ''
      this.signer.signFullName = ''
      this.signer.signUserName = ''
    },

    // nhap de tim kiem don vi
    onInputSearchCompany() {
      this.signer.signGroupId = ''
      this.selectedCompany = null
      setTimeout(() => {
        this.searchCompany()
      }, 200)
    },

    // nhap de tim kiem nguoi ky
    onInputSearchCustomer() {
      this.signer.signUserId = ''
      this.selectedCustomer = null
      if (!this.signer.signGroupId && this.showCompanyInput) return
      setTimeout(() => {
        this.searchCustomer()
      }, 200)
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

.bg-main {
  background-color: #f9f5ff !important;
}

.signer-item {

  .wrap-list-search-user {
    border-radius: 8px;
    position: absolute;
    border: 1px solid #c4c4c4;
    z-index: 9;
    width: 95%;
    top: 80px;
    max-height: 220px;
    overflow-y: auto;
    .v-list-item {
      min-height: 45px !important;
      padding: 5px !important;
    }
  }
  .form-group {
    .v-input__slot {
      width: 100%;
    }
    flex: 0 0 25%;
    max-width: 25%;
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
}

</style>
