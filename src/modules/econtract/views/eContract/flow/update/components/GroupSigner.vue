<template>
  <div class="from-group-sign row align-center text--label-1">
    <btn-remove v-if="showRemove" @on-click="onRemove" />

    <div class="color-sign" :class="colorSign" />

    <div class="col-sm-3 wrap-users-list">
      <!-- dai dien cua ban -->
      <validation-provider
        v-if="type"
        v-slot="{ errors }"
        :rules="fullNameRuler"
        name="fullName"
        :vid="`fullName-${id}`"
      >
        <v-autocomplete
          v-model="signer.userId"
          outlined
          attach
          :no-data-text="$t('users.itemGroupName')"
          hide-selected
          :filter="filterItems"
          clearable
          maxlength="255"
          dense
          :menu-props="{
            bottom: true,
            offsetY: true
          }"
          required
          :placeholder="$t('contract.inputName')"
          :error-messages="errors"
          :readonly="isReadonly"
          :items="users"
          allow-overflow
          item-text="fullName"
          item-value="userId"
          @click:clear="resetSigner()"
          @click="openListUser()"
          @change="selectedSigner(signer.userId)"
        >
          <vue-feather slot="prepend-inner" class="grey--text" type="search" />
          <template v-slot:item="data">
            <div class="select-item flex-column d-flex">
              <div class="title-item">{{ data.item.fullName }}</div>
              <div class="desc-item">{{ data.item.position }}</div>
            </div>
          </template>
        </v-autocomplete>
      </validation-provider>
      <!-- dai dien khach hang -->
      <validation-provider
        v-else
        v-slot="{ errors }"
        name="fullName"
        :rules="fullNameRuler"
        :vid="`fullName-${id}`"
      >
        <v-text-field
          v-model="signer.fullName"
          outlined
          maxlength="255"
          dense
          :clearable="!(type || isReadonly)"
          :disabled="disabled"
          :readonly="isReadonly"
          :placeholder="$t('contract.inputName')"
          :error-messages="errors"
          required
          @click:clear="resetSigner()"
          @blur="resetFormOnput()"
          @input="onInputSearch"
          @change="updateFullName"
        >
          <vue-feather slot="prepend-inner" class="grey--text" type="search" />
        </v-text-field>
      </validation-provider>
      <div v-if="!type" v-show="showFilterUser" class="wrap-users">
        <v-list dense>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item
              v-for="(user, index) in usersPartner"
              :key="index"
              two-line
              class="py-0"
            >
              <v-list-item-content class="py-0">
                <v-list-item-title>{{ user.fullName }}</v-list-item-title>
                <v-list-item-subtitle>{{ user.position }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </div>
    <div class="col-sm-3 ">
      <validation-provider
        v-slot="{ errors }"
        name="email"
        :rules="ruleEmail"
        :vid="`email-${id}`"
      >
        <v-text-field
          v-model="signer.email"
          name="email"
          :clearable="!(type || isReadonly)"
          :disabled="disabled"
          :readonly="type || isReadonly"
          :placeholder="$t('contract.email')"
          outlined
          dense
          maxlength="255"
          required
          :error-messages="errors"
          @change="updateEmail"
        />
      </validation-provider>
    </div>
    <div class="col-sm-3 ">
      <validation-provider
        v-slot="{ errors }"
        name="mobile"
        rules="max:15"
        :vid="`phone-${id}`"
      >
        <v-text-field
          v-model="signer.phone"
          name="phone"
          :placeholder="$t('contract.phone')"
          outlined
          clearable
          maxlength="15"
          dense
          :disabled="disabled"
          :readonly="isReadonly"
          :error-messages="errors"
          oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
          @change="updatePhone"
        />
      </validation-provider>
    </div>
    <div class="col-sm-2 ml-auto px-0">
      <div class="d-flex justify-space-around">
        <v-checkbox
          v-model="signer.signMethods"
          hide-details
          :readonly="isReadonly || disabled"
          :label="$t('contract.signPhoto')"
          :value="signMethods.IMAGE_SIGN"
          class="mt-0 bg-transparent"
        />
        <v-checkbox
          v-model="signer.signMethods"
          hide-details
          :readonly="isReadonly || disabled"
          :label="$t('contract.digitalSignature')"
          :value="signMethods.DIGITAL_SIGN"
          class="mt-0 bg-transparent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BtnRemove from '../../create/components/BtnRemove'
import { UsersService } from '@/services/usersService'
import rules from '@/mixins/rules'
import updateSigner from '@/modules/econtract/mixins/updateSigner'
import constants from '@/constants'
export default {
  name: 'GroupSigner',
  components: {
    BtnRemove
  },
  mixins: [rules, updateSigner],
  props: {
    groupName: {
      type: String,
      default: null
    },
    groupId: {
      type: Number,
      default: 0
    },
    totalSigners: {
      type: Array,
      default: undefined
    },
    totalReviews: {
      type: Array,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: undefined
    },
    type: {
      type: Boolean,
      default: undefined
    },
    signer: {
      type: Object,
      default: undefined
    },
    isReview: {
      type: Boolean,
      default: false
    },
    showRemove: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    },
    listUsers: {
      type: Array,
      default: undefined
    },
    isReadonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempUser: null,
      selectedItem: null,
      showFilterUser: false,
      users: null,
      usersPartner: null,
      fullNameSignRule: {
        required: !this.isReview
      },
      emailSignRule: { required: !this.isReview, email: true },
      signMethods: constants.SIGN_METHODS
    }
  },
  computed: {
    colorSign() {
      return 'bg-info'
    }
  },
  watch: {
    selectedItem() {
      var user = this.usersPartner[this.selectedItem]
      if (user) {
        this.tempUser = user
      }
      this.selectedUser(this.tempUser)
      this.showFilterUser = false
    },
    listUsers() {
      this.filterUsers()
    },
    signer: {
      handler: function() {
        console.log(`update signer: ${this.signer}`)
        this.$emit('reset-signatures')
      },
      deep: true
    }
  },
  created() {
    this.filterUsers()
  },
  beforeUpdate() {
    if (this.signer.userId !== '') {
      this.users = this.listUsers
    } else {
      this.filterUsers()
    }
  },
  mounted() {},
  methods: {
    resetFormOnput() {
      setTimeout(() => {
        this.showFilterUser = false
      }, 300)
    },
    // loc user trung mail
    filterUsers() {
      const that = this
      this.users = this.listUsers.filter(user => {
        let isNotExist = true
        if (this.totalSigners) {
          this.totalSigners.map(signer => {
            if (
              signer.email === user.email &&
              that.signer.email !== signer.email
            ) {
              isNotExist = false
            }
          })
        }
        if (this.totalReviews) {
          this.totalReviews.map(review => {
            if (
              review.email === user.email &&
              that.signer.email !== review.email
            ) {
              isNotExist = false
            }
          })
        }
        return isNotExist
      })
    },
    // hien thi email va sdt dai dien cua ban
    selectedSigner(value) {
      const user = this.users.find(g => g.userId === value)
      if (user) {
        this.signer.userId = user.userId
        this.signer.name = user.fullName
        this.signer.fullName = user.fullName
        this.signer.phone = user.phone
        this.signer.email = user.email
        this.$emit('reset-signatures')
      }
    },
    onRemove() {
      this.$emit('on-remove-signer', this.id)
    },
    // hien thi email va sdt dai dien khach hang
    selectedUser(user) {
      // this.signer.userId = user.userId
      this.signer.name = user.fullName
      this.signer.fullName = user.fullName
      this.signer.phone = user.phone
      this.signer.email = user.email
      this.$emit('reset-signatures')
    },
    textSelectedUser(item) {
      return item.fullName + '-' + item.phone
    },
    trimSpaceEmail(val) {
      const value = val ? val.trim() : ''
      return value
    },
    trimSpace(val) {
      const value = val ? val.trim() : ''
      this.$emit('reset-signatures')
      return value
    },
    // search user trong dai dien khach hang
    onInputSearch() {
      setTimeout(async() => {
        if (
          (this.signer.fullName && this.signer.fullName.trim().length === 0) ||
          !this.signer.fullName ||
          (this.groupName !== null && this.groupId === null)
        ) {
          this.showFilterUser = false
          return
        }
        const params = {
          groupId: this.groupId,
          restrictHierarchy: 'false',
          groupType: constants.GROUPS.EXTERNAL,
          fullName: this.signer.fullName.trim(),
          pageSize: 100000,
          excludeRoleCodes: 'ROLE_ADMIN'
        }
        const response = await UsersService.searchUser(params)
        if (response.success) {
          this.usersPartner = response.data.data
          this.showFilterUser = this.usersPartner.length > 0
        } else {
          console.log(response.messages)
        }
      }, 300)
    },
    getParentGroupName(item) {
      return item.groupName + ' - ' + this.$t('group.partnerLabel')
    },
    openListUser() {
      this.filterUsers()
    }
  }
}
</script>

<style lang="scss" scoped></style>
