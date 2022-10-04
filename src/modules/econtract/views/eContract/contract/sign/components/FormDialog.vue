<template>
  <div class="wrap-form-dialog">
    <div class="dialog-form">
      <v-row v-if="showInput" class="form-group">
        <v-col md="3" class="d-flex">
          <label class="text--body-1">
            {{ $t('contract.label.fullName') }}
            <span class="red--text">*</span>
          </label>
        </v-col>
        <v-col md="9" class="wrap-users-list">
          <validation-provider
            v-slot="{ errors }"
            name="fullName"
            :rules="fullNameRuler"
            :vid="`fullName`"
          >
            <v-text-field
              v-model="formData.userFullName"
              outlined
              maxlength="255"
              clearable
              dense
              :placeholder="$t('contract.inputName')"
              :error-messages="errors"
              required
              class="text--body-1"
              @blur="resetFormOnput()"
              @input="onInputSearch"
              @change="formData.userFullName = trimSpace(formData.userFullName)"
            >
              <vue-feather slot="append" class="grey--text" type="search" />
            </v-text-field>
          </validation-provider>
          <div v-show="showFilterUser" class="wrap-users">
            <v-list dense>
              <v-list-item-group
                v-model="selectedItem"
                color="primary"
                @change="inputUserPartner(selectedItem)"
              >
                <v-list-item
                  v-for="(user, index) in usersPartner"
                  :key="index"
                  two-line
                  class="py-0"
                >
                  <v-list-item-content class="py-0">
                    <v-list-item-title>{{
                      user.userFullName
                    }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      user.groupPathName
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-col>
      </v-row>
      <v-row v-else class="form-group">
        <v-col md="3" class="d-flex">
          <label class="text--body-1">
            {{ $t('contract.label.fullName') }}
            <span class="red--text">*</span>
          </label>
        </v-col>
        <v-col md="9">
          <validation-provider
            v-slot="{ errors }"
            :rules="fullNameRuler"
            name="fullName"
          >
            <v-autocomplete
              v-model="formData.userId"
              outlined
              :no-data-text="$t('users.itemGroupName')"
              maxlength="255"
              dense
              clearable
              :menu-props="{
                bottom: true,
                offsetY: true,
                maxWidth: 409
              }"
              required
              :placeholder="$t('contract.inputName')"
              :error-messages="errors"
              :items="listUsers"
              item-text="userFullName"
              item-value="userId"
              class="text--body-1"
              :filter="filterItems"
              @change="selectedSigner(formData.userId)"
              @click:clear="resetForm"
            >
              <template v-slot:item="data">
                <div class="select-item flex-column d-flex py-1">
                  <div class="title-item">{{ data.item.userFullName }}</div>
                  <div class="desc-item">{{ data.item.groupPathName }}</div>
                </div>
              </template>
              <vue-feather
                slot="append"
                class="grey--text d-flex"
                type="search"
              />
            </v-autocomplete>
          </validation-provider>
        </v-col>
      </v-row>
      <v-row class="form-group mt-2">
        <v-col md="3" class="d-flex">
          <label class="text--body-1">
            {{ $t('contract.label.email') }}
            <span class="red--text">*</span>
          </label>
        </v-col>
        <v-col md="9">
          <validation-provider
            v-slot="{ errors }"
            name="email"
            :rules="ruleEmail"
            :vid="`email`"
          >
            <v-text-field
              v-model="formData.email"
              :placeholder="$t('contract.email')"
              outlined
              :readonly="!showInput"
              dense
              maxlength="255"
              :error-messages="errors"
              class="text--body-1"
              @change="formData.email = trimSpace(formData.email)"
            />
          </validation-provider>
        </v-col>
      </v-row>
      <v-row class="form-group mt-2">
        <v-col md="3" class="d-flex">
          <label class="text--body-1">{{ $t('contract.label.phone') }}</label>
        </v-col>
        <v-col md="9">
          <validation-provider
            v-slot="{ errors }"
            name="mobile"
            rules="max:15"
            :vid="`phone`"
          >
            <v-text-field
              v-model="formData.phone"
              :placeholder="$t('contract.phone')"
              outlined
              dense
              clearable
              maxlength="15"
              :error-messages="errors"
              class="text--body-1"
              oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
            />
          </validation-provider>
        </v-col>
      </v-row>
      <v-row class="form-group mt-2">
        <v-col md="3" class="d-flex">
          <label class="text--body-1">{{ $t('contract.note') }}</label>
        </v-col>
        <v-col md="9">
          <v-textarea
            v-model="formData.note"
            textarea
            auto-grow
            counter="500"
            maxlength="500"
            rows="3"
            outlined
            dense
            clearable
            :placeholder="$t('contract.note')"
            class="text--body-1"
            @change="formData.note = trimSpace(formData.note)"
          />
        </v-col>
      </v-row>
    </div>

    <v-card-actions class="d-flex justify-center pt-5 pb-10">
      <v-btn
        rounded
        outlined
        color="primary"
        class="w-150 py-5 mr-12 text--button"
        @click="closeDialog"
      >
        {{ $t('cancelLabel') }}
      </v-btn>

      <v-btn
        rounded
        color="primary"
        class="w-150 py-5 text--button"
        @click="accept"
      >
        {{
          formType == 'changeSigner' ? $t('contract.continue') : $t('accept')
        }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import rules from '@/mixins/rules'
import filterItems from '@/mixins/filterItems'
import constants from '@/constants'

export default {
  mixins: [rules, filterItems],
  props: {
    formData: {
      type: Object,
      default: undefined
    },
    formType: {
      type: String,
      default: undefined
    },
    groupType: {
      type: String,
      default: undefined
    },
    groupId: {
      type: Number,
      default: null
    },
    contractId: {
      type: String,
      default: null
    },
    listUsers: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      tempUser: null,
      selectedItem: null,
      usersPartner: [],
      showFilterUser: false
    }
  },
  computed: {
    showInput() {
      return this.groupType === constants.GROUPS.EXTERNAL
    }
  },
  watch: {},
  created() {
    // this.getUsersByGroupId()
  },
  methods: {
    resetForm() {
      this.formData.userFullName = ''
      this.formData.phone = ''
      this.formData.email = ''
      this.formData.groupId = ''
      this.formData.groupName = ''
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
    async accept() {
      this.$emit('accept', this.formData)
    },
    // hien thi email va sdt dai dien cua ban
    selectedSigner(value) {
      const user = this.listUsers.find(g => g.userId === value)
      if (user) {
        this.formData.userId = user.userId
        this.formData.userFullName = user.userFullName
        this.formData.phone = user.phone
        this.formData.email = user.email
        this.formData.groupId = user.groupId
        this.formData.groupName = user.groupName
      }
    },
    inputUserPartner(value) {
      const user = this.usersPartner[value]
      if (user) {
        this.tempUser = user
      }
      this.selectedUser(this.tempUser)
      this.showFilterUser = false
    },
    // hien thi email va sdt dai dien khach hang
    selectedUser(value) {
      // this.formData.userId = user.userId
      this.formData.userFullName = value.userFullName
      this.formData.phone = value.phone
      this.formData.email = value.email
      this.formData.groupId = value.groupId
      this.formData.groupName = value.groupName
    },
    trimSpace(val) {
      const value = val ? val.trim() : ''
      return value
    },
    resetFormOnput() {
      setTimeout(() => {
        this.showFilterUser = false
      }, 300)
    },
    onInputCheckMail() {
      this.formData.userId = null
      setTimeout(async() => {
        if (this.formData.email.trim().length === 0) {
          return
        }
        const userPartner = this.listUsers.find(
          user => user.email.toLowerCase() === this.formData.email.toLowerCase()
        )
        if (userPartner) {
          this.formData.userId = userPartner.userId
        }
      }, 300)
    },
    onInputSearch() {
      setTimeout(async() => {
        if (this.formData.userFullName.trim().length === 0) {
          this.showFilterUser = false
          return
        }
        var usersTemp = []
        this.listUsers.filter(user => {
          if (
            user.userFullName
              .toLowerCase()
              .includes(this.formData.userFullName.toLowerCase())
          ) {
            usersTemp.push(user)
          }
        })
        this.usersPartner = usersTemp
        this.showFilterUser = this.usersPartner.length > 0
      }, 300)
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
    label {
      font-size: 12px;
      width: 130px;
      top: -14px;
      position: relative;
      font-weight: bold;
      text-align: left;
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
</style>
