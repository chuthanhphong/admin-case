<template>
  <div class="wrap-form-dialog">
    <div class="dialog-form">
      <!-- don vi  -->
      <v-row class="form-group maginUnit">
        <v-col md="3" class="d-flex pa-0 pb-3">
          <label class="text--change--signer">
            {{ $t('document.unit') }}
            <span class="red--text">*</span>
          </label>
        </v-col>
        <v-col md="9">
          <validation-provider v-slot="{ errors }" rules="required" name="unit">
            <v-autocomplete
              ref="selectGroup"
              v-model="formData.groupId"
              outlined
              :no-data-text="$t('noData')"
              hide-selected
              attach
              maxlength="255"
              dense
              :menu-props="{
                bottom: true,
                offsetY: true
              }"
              required
              :placeholder="$t('document.placeholder.group')"
              :error-messages="errors"
              :items="groupItems"
              allow-overflow
              :filter="filterItems"
              item-text="groupName"
              item-value="groupId"
              @change="selectGroupId(formData.groupId)"
              @blur="blurSelectGroup"
            >
              <vue-feather slot="append" class="grey--text" type="search" />
              <template v-slot:append>
                <v-slide-x-reverse-transition mode="out-in">
                  <v-icon
                    color="primary"
                    @click="clearData()"
                  >mdi-close</v-icon>
                </v-slide-x-reverse-transition>
              </template>
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
      <!-- chuc danh -->
      <v-row class="form-group">
        <v-col md="3" class="d-flex pa-0">
          <label class="text--change--signer">
            {{ $t('document.position') }}
            <span class="red--text">*</span>
          </label>
        </v-col>
        <v-col md="9">
          <validation-provider
            v-slot="{ errors }"
            rules="required"
            name="position"
          >
            <v-autocomplete
              ref="selectPosition"
              v-model="formData.positionId"
              outlined
              :no-data-text="$t('noData')"
              hide-selected
              maxlength="255"
              dense
              attach
              :disabled="!formData.groupId"
              :menu-props="{
                bottom: true,
                offsetY: true
              }"
              required
              :placeholder="$t('document.placeholder.position')"
              :error-messages="errors"
              :items="positionItems"
              allow-overflow
              item-text="name"
              item-value="id"
              :filter="filterItems"
              @change="selectedPosition(formData.positionId)"
              @blur="blurSelectPopsition"
            >
              <vue-feather slot="append" class="grey--text" type="search" />
            </v-autocomplete>
          </validation-provider>
        </v-col>
      </v-row>

      <!-- ten -->
      <v-row class="form-group mt-0">
        <v-col md="3" class="d-flex pa-0">
          <label class="text--change--signer">
            {{ $t('document.label.name') }}
            <span class="red--text">*</span>
          </label>
        </v-col>
        <v-col md="9">
          <validation-provider
            v-slot="{ errors }"
            name="fullName"
            rules="required"
          >
            <v-autocomplete
              ref="selectSigner"
              v-model="formData.userId"
              outlined
              :no-data-text="$t('noData')"
              hide-selected
              maxlength="255"
              dense
              attach
              :menu-props="{
                bottom: true,
                offsetY: true,
                maxHeight: 220
              }"
              required
              :disabled="!formData.groupId"
              :placeholder="$t('document.placeholder.signer')"
              :error-messages="errors"
              :items="userItems"
              allow-overflow
              :item-text="(item) => getFullName(item)"
              item-value="userId"
              :filter="filterItems"
              content-class="max-height-menu"
              @change="selectedSigner(formData.userId)"
              @blur="blurSelectSigner"
            >
              <vue-feather slot="append" class="grey--text" type="search" />
              <template v-slot:item="data">
                <div class="select-item flex-column d-flex">
                  <div class="title-item">{{ getFullName(data.item) }}</div>
                  <div class="desc-item">
                    {{ genEmailAndPhone(data.item) }}
                  </div>
                </div>
              </template>
            </v-autocomplete>
          </validation-provider>
        </v-col>
      </v-row>

      <!-- ghi chu -->
      <v-row class="form-group mt-0">
        <v-col md="3" class="d-flex pa-0">
          <label class="text--change--signer">{{
            $t('document.label.note')
          }}</label>
        </v-col>
        <v-col md="9">
          <v-textarea
            v-model="formData.note"
            textarea
            counter="500"
            maxlength="500"
            rows="3"
            outlined
            dense
            :placeholder="$t('document.label.enterNote')"
            @change="formData.note = trimSpace(formData.note)"
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

      <v-btn rounded color="primary" class="w-150 py-5" @click="accept">
        {{ $t(btnAcceptName) }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import rules from '@/mixins/rules'
import constants from '@/constants'
import filterItems from '@/mixins/filterItems.js'
import genItems from '@/mixins/genItems.js'
import { UsersService } from '@/services/usersService'
import { GroupService } from '@/services/groupService'

export default {
  name: 'FormDialog',
  mixins: [rules, filterItems, genItems],
  props: {
    formData: {
      type: Object,
      default: undefined
    },
    formType: {
      type: String,
      default: undefined
    },
    groupId: {
      type: Number,
      default: null
    },
    docId: {
      type: Number,
      default: null
    },
    listUsers: {
      type: Array,
      default: undefined
    },
    groupName: {
      type: String,
      default: null
    },
    btnAcceptName: {
      type: String,
      default: 'electronicSign.continue'
    }
  },
  data() {
    return {
      groupItems: [],
      positionItems: [],
      userItems: [],
      hasListPositions: false,
      hasListUsers: false
    }
  },
  computed: {},
  async created() {
    this.formData.groupName = this.groupName
    this.formData.groupId = this.groupId
    this.searchGroup()
    if (this.formData.groupId) {
      this.clearDataUser()
      this.clearDataPosition()
      await Promise.all([this.getUser(), this.findListPosition()])
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    },
    async accept() {
      this.$emit('accept', this.formData)
    },
    checkDisabled(value) {
      return !(this.formData.groupId && value)
    },
    clearData() {
      this.clearDataGroup()
      this.clearDataPosition()
      this.formData.signUserType = constants.SIGN_USER_TYPE.MAIN
      this.formData.signMethods = []
      this.clearDataUser()
    },
    clearDataGroup() {
      this.formData.groupName = ''
      this.formData.parentGroupName = ''
      this.formData.groupId = ''
      this.formData.groupCode = ''
    },
    clearDataPosition() {
      this.formData.positionId = ''
      this.formData.positionName = ''
    },
    clearDataUser() {
      this.formData.userId = ''
      this.formData.userName = ''
      this.formData.fullName = ''
      this.formData.email = ''
      this.formData.phone = ''
    },
    onRemove() {
      this.$emit('on-remove-signer', this.idx)
    },
    async searchGroup() {
      try {
        const param = {
          pageSize: 1000000,
          restrictHierarchy: 'false',
          groupType: constants.GROUPS.INTERNAL
        }
        const response = await GroupService.search(param)
        this.groupItems = response.data.data
      } catch (error) {
        console.log(error)
      }
    },
    selectGroupId(groupId) {
      const group = this.groupItems.find((g) => g.groupId === groupId)
      if (group) {
        this.clearDataPosition()
        this.clearDataUser()
        this.formData.parentGroupName = group.parentGroupName
        this.formData.groupName = group.groupName
        this.formData.groupCode = group.groupCode

        this.getUser()
        this.findListPosition()
      }
    },
    // hien thi email va sdt dai dien cua ban
    selectedSigner(value) {
      this.clearDataUser()
      const user = this.userItems.find((g) => g.userId === value)
      if (user) {
        this.formData.userId = user.userId
        this.formData.userName = user.userName
        this.formData.fullName = user.fullName
        this.formData.email = user.email
        this.formData.phone = user.phone
      }
      this.findListPosition()
    },
    // hien thi chuc danh cua ban
    selectedPosition(value) {
      const position = this.positionItems.find((g) => g.id === parseInt(value))
      if (position) {
        this.formData.positionId = position.id
        this.formData.positionName = position.name
      }
      this.getUser()
    },

    // Load danh sach user theo don vi
    async getUser() {
      try {
        this.hasListUsers = false
        const param = {
          groupId: this.formData.groupId,
          positionId: this.formData.positionId
        }
        const response = await UsersService.findUsers(param)
        if (response.success) {
          this.userItems = response.data
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.hasListUsers = true
      }
    },
    async findListPosition() {
      try {
        this.hasListPositions = false
        const param = {
          groupId: this.formData.groupId,
          userId: this.formData.userId
        }
        const response = await UsersService.findListPosition(param)
        if (response.success) {
          this.positionItems = response.data
          if (this.positionItems.length === 1) {
            this.formData.positionId = this.positionItems[0].id
            this.formData.positionName = this.positionItems[0].name
            this.getUser()
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.hasListPositions = true
      }
    },
    trimSpace(val) {
      const value = val.trim()
      return value
    },

    blurSelectGroup() {
      this.$refs.selectGroup.blur()
    },

    blurSelectSigner() {
      this.$refs.selectSigner.blur()
    },

    blurSelectPopsition() {
      this.$refs.selectPosition.blur()
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
    .text--change--signer {
      font-family: 'Mulish';
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 18px;
      text-transform: uppercase;
      color: #8e8ea1;
    }
    label {
      margin-bottom: 24px !important;
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
</style>
