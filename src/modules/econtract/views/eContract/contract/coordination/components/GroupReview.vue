<template>
  <div class="from-group-sign row align-center text--label-1">
    <btn-remove v-if="showRemove" @on-click="onRemove" />

    <div class="color-sign" :class="colorSign" />

    <div class="col-sm-3 wrap-users-list">
      <!-- dai dien cua ban -->
      <validation-provider
        v-if="type"
        :rules="checkRule() ? fullNameRuler : ''"
        name="fullName"
        :vid="`fullName-${id}`"
      >
        <v-text-field
          v-model="signer.fullName"
          outlined
          :clearable="!disabled"
          :disabled="disabled"
          hide-details
          dense
          required
        >
          <vue-feather slot="prepend-inner" class="grey--text" type="search" />
        </v-text-field>
      </validation-provider>
      <!-- dai dien khach hang -->
      <validation-provider
        v-else
        v-slot="{ errors }"
        name="fullName"
        :rules="checkRule() ? fullNameRuler : ''"
        :vid="`fullName-${id}`"
      >
        <v-text-field
          v-model="signer.name"
          outlined
          maxlength="255"
          :clearable="!disabled"
          :disabled="disabled"
          dense
          required
          :placeholder="$t('contract.inputName')"
          :error-messages="errors"
          @blur="resetFormOnput()"
          @input="onInputSearch"
          @change="updateName"
          @click:clear="resetSigner()"
        >
          <vue-feather slot="prepend-inner" class="grey--text" type="search" />
        </v-text-field>
      </validation-provider>
      <div v-show="showFilterUser" class="wrap-users">
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
                <v-list-item-subtitle>{{
                  getParentGroupName(user)
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </div>
    <validation-provider name="checkEmail">
      <v-text-field v-model="totalSigners" name="totalSigners" type="hidden" />
    </validation-provider>
    <div class="col-sm-3 ">
      <validation-provider
        ref="mobile"
        v-slot="{ errors }"
        name="email"
        :rules="checkRule() ? ruleEmail : ''"
        :vid="`email-${id}`"
      >
        <v-text-field
          v-model="signer.email"
          name="email"
          :clearable="!(type || disabled)"
          :readonly="type"
          :placeholder="$t('contract.email')"
          outlined
          :disabled="disabled"
          dense
          maxlength="255"
          required
          :error-messages="errors"
          @change="updateEmail"
          @click:clear="resetSigner()"
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
          :clearable="!disabled"
          :placeholder="$t('contract.phone')"
          outlined
          :disabled="disabled"
          maxlength="15"
          dense
          :error-messages="errors"
          oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
          @change="updatePhone"
        />
      </validation-provider>
    </div>
  </div>
</template>

<script>
import BtnRemove from '../../create-contract/components/BtnRemove'
import { UsersService } from '@/services/usersService'
import rules from '@/mixins/rules'
import updateSigner from '@/modules/econtract/mixins/updateSigner'
import constants from '@/constants'
export default {
  name: 'GroupReview',
  components: {
    BtnRemove
  },
  mixins: [rules, updateSigner],
  props: {
    isCoordinator: {
      type: Boolean,
      default: undefined
    },
    groupId: {
      type: Number,
      default: 0
    },
    group: {
      type: Array,
      default: undefined
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
      emailSignRule: { required: !this.isReview, email: true }
    }
  },
  computed: {
    colorSign() {
      return 'bg-primary'
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
    checkRule() {
      let check = false
      if (
        this.signer.phone ||
        this.signer.name ||
        this.signer.email ||
        this.isCoordinator
      ) {
        check = true
      }
      return check
    },
    // loc ra user trung mail
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
        this.signer.phone = user.phone
        this.signer.email = user.email
      }
    },
    onRemove() {
      this.$emit('on-remove-signer', this.id)
    },
    // hien thi email va sdt dai dien khach hang
    selectedUser(user) {
      // this.signer.userId = user.userId
      this.signer.name = user.fullName
      this.signer.phone = user.phone
      this.signer.email = user.email
    },
    textSelectedUser(item) {
      return item.fullName + '-' + item.phone
    },
    trimSpace(val) {
      const value = val.trim()
      return value
    },
    // search user dai dien khach hang
    onInputSearch() {
      setTimeout(async() => {
        if (
          (this.signer.name && this.signer.name.length === 0) ||
          this.groupId === null
        ) {
          this.showFilterUser = false
          return
        }
        const params = {
          groupId: this.groupId,
          restrictHierarchy: 'false',
          groupType: constants.GROUPS.EXTERNAL,
          fullName: this.signer.name,
          pageSize: 100000,
          excludeRoleCodes: 'ROLE_ADMIN'
        }
        const response = await UsersService.searchUser(params)
        if (response.success) {
          this.usersPartner = response.data.data
          this.filterUserPartner()
          this.showFilterUser = this.usersPartner.length > 0
        } else {
          console.log(response.messages)
        }
      }, 300)
    },
    filterUserPartner() {
      let lstUserId = []
      if (this.totalSigners) {
        this.totalSigners.map(user => {
          if (user.userId) return user.userId
          else return null
        })
      }
      lstUserId = lstUserId.filter(id => id != null)
      const filterUsers = this.usersPartner.filter(
        user => !lstUserId.includes(user.userId)
      )
      this.usersPartner = filterUsers
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
