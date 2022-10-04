<template>
  <div>
    <div class="from-group-sign row align-center" :class="colorForm">
      <div class="d-flex">
        <btn-remove v-if="showRemove && !isDisbale" @on-click="onRemove()" />
        <div class="color-sign" />
      </div>
      <div class="d-flex form-group-signer">
        <div class="col-sm-7 col-md-8">
          <div class="row">
            <div class="col-sm-4">
              <validation-provider
                v-slot="{ errors }"
                :rules="fullNameRuler"
                name="groupName"
                :vid="`groupName-${getIndex}`"
              >
                <v-autocomplete
                  ref="selectGroup"
                  v-model="formData.signGroupId"
                  :autofocus="true"
                  outlined
                  :no-data-text="$t('noData')"
                  hide-selected
                  attach
                  :disabled="isDisbale"
                  maxlength="255"
                  dense
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  required
                  :placeholder="
                    isDisbale ? '' : $t('document.placeholder.group')
                  "
                  :error-messages="errors"
                  :items="groupItems"
                  allow-overflow
                  :filter="filterItems"
                  item-text="groupName"
                  item-value="groupId"
                  @change="selectGroupId(formData.signGroupId)"
                  @blur="blurSelectGroup"
                >
                  <vue-feather
                    slot="prepend-inner"
                    class="grey--text"
                    type="search"
                  />
                  <template v-slot:append>
                    <v-slide-x-reverse-transition mode="out-in">
                      <v-icon
                        color="primary"
                        :disabled="isDisbale"
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
            </div>
            <div class="col-sm-4">
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="position"
                :vid="`position-${getIndex}`"
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
                  :disabled="!formData.signGroupId || isDisbale"
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  required
                  :placeholder="
                    isDisbale ? '' : $t('document.placeholder.position')
                  "
                  :error-messages="errors"
                  :items="positionItems"
                  allow-overflow
                  item-text="name"
                  item-value="id"
                  :filter="filterItems"
                  @change="selectedPosition(formData.positionId)"
                  @blur="blurSelectPopsition"
                >
                  <vue-feather
                    slot="prepend-inner"
                    class="grey--text"
                    type="search"
                  />
                </v-autocomplete>
              </validation-provider>
            </div>
            <div class="col-sm-4">
              <validation-provider
                v-slot="{ errors }"
                name="fullName"
                :vid="`fullName-${getIndex}`"
              >
                <v-autocomplete
                  ref="selectSigner"
                  v-model="formData.signUserId"
                  outlined
                  :no-data-text="$t('noData')"
                  hide-selected
                  maxlength="255"
                  dense
                  attach
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  required
                  :disabled="!formData.signGroupId || isDisbale"
                  :placeholder="
                    isDisbale ? '' : $t('document.placeholder.signer')
                  "
                  :error-messages="errors"
                  :items="userItems"
                  allow-overflow
                  :item-text="(item) => getFullName(item)"
                  item-value="userId"
                  :filter="filterItems"
                  @change="selectedSigner(formData.signUserId)"
                  @blur="blurSelectSigner"
                >
                  <vue-feather
                    slot="prepend-inner"
                    class="grey--text"
                    type="search"
                  />
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
            </div>
          </div>
        </div>
        <!-- dai dien khach hang -->
        <div class="col-sm-5 col-md-4">
          <div class="row">
            <div class="col-sm-6">
              <validation-provider
                v-slot="{ errors }"
                name="signUserType"
                rules="required"
                :vid="`signUserType-${getIndex}`"
              >
                <v-select
                  ref="selectTypeSign"
                  v-model="formData.signUserType"
                  dense
                  outlined
                  :error-messages="errors"
                  required
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  attach
                  :disabled="!formData.signGroupId || isDisbale"
                  :items="signUserTypes"
                  :item-text="(item) => $t(item.label)"
                  item-value="value"
                  name="signUserType"
                  :no-data-text="$t('noData')"
                  :placeholder="$t('document.placeholder.type')"
                  @change="changeTypeSigner(formData.signUserType)"
                  @blur="blurSelectTypeSign"
                >
                  <template v-slot:append>
                    <v-icon>mdi-chevron-down</v-icon>
                  </template>
                </v-select>
              </validation-provider>
            </div>
            <div class="col-sm-6">
              <div v-if="checkDisplay" class="d-flex justify-space-around">
                <v-checkbox
                  v-model="formData.signMethod"
                  hide-details
                  :disabled="!formData.signGroupId || isDisbale"
                  :label="$t('document.signPhoto')"
                  :value="signMethods.IMAGE_SIGN"
                  class="mt-0 bg-transparent"
                />
                <v-checkbox
                  v-model="formData.signMethod"
                  hide-details
                  :disabled="!formData.signGroupId || isDisbale"
                  :label="$t('document.digitalSignature')"
                  :value="signMethods.DIGITAL_SIGN"
                  class="mt-0 bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BtnRemove from './BtnRemove'
import { UsersService } from '@/services/usersService'
import { GroupService } from '@/services/groupService'
import rules from '@/mixins/rules'
import filterItems from '@/mixins/filterItems.js'
import genItems from '@/mixins/genItems.js'
import constants from '@/constants'
import { mapState } from 'vuex'
export default {
  name: 'GroupSigner',
  components: {
    BtnRemove
  },
  mixins: [rules, filterItems, genItems],
  props: {
    formData: {
      type: Object,
      default: undefined
    },
    showRemove: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    },
    idx: {
      type: Number,
      default: 0
    },
    isDisbale: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      groupItems: [],
      positionItems: [],
      userItems: [],
      groupLevel: null,
      signMethods: constants.SIGN_METHODS,
      hasListPositions: false,
      signUserTypes: [
        {
          label: 'document.signType.main',
          value: constants.SIGN_USER_TYPE.MAIN
        },
        {
          label: 'document.signType.flashes',
          value: constants.SIGN_USER_TYPE.FLASHES
        },
        {
          label: 'document.signType.reviewer',
          value: constants.SIGN_USER_TYPE.REVIEWER
        }
      ]
    }
  },
  computed: {
    ...mapState('document', ['parentId']),
    getIndex() {
      return this.index + '-' + this.idx
    },
    colorForm() {
      let text = 'bg-signer-flash'
      if (this.formData.signUserType === constants.SIGN_USER_TYPE.MAIN) {
        text = 'bg-signer-main'
      }
      if (this.formData.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
        text = 'bg-light-blue'
      }
      return text
    },
    checkDisplay() {
      let check = true
      if (this.formData.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
        check = false
      }
      return check
    }
  },
  watch: {
    async formData() {
      await this.searchGroup()
      if (this.formData.signGroupId) {
        await Promise.all([this.getUser(), this.findListPosition()])
        this.checkExist()
      }
    }
  },
  async mounted() {
    await this.searchGroup()
    if (this.formData.signGroupId) {
      await Promise.all([this.getUser(), this.findListPosition()])
      this.checkExist()
    }
  },
  // mounted() {},
  methods: {
    // check user block and group delete
    checkExist() {
      this.checkUserExist()
      this.checkGroupExist()
      this.checkPositionExist()
    },
    checkUserExist() {
      const user = this.userItems.find(
        (g) => g.userId === this.formData.signUserId
      )
      if (!user) {
        this.clearDataUser()
        this.findListPosition()
      }
    },
    checkGroupExist() {
      const group = this.groupItems.find((g) => {
        return +g.groupId === +this.formData.signGroupId
      })
      if (!group) {
        this.clearDataGroup()
        return
      }
      this.formData.groupCode = group.groupCode
    },
    checkPositionExist() {
      const position = this.positionItems.find(
        (g) => g.id === this.formData.positionId
      )
      if (!position) {
        this.clearDataPosition()
        this.getUser()
      }
    },
    clearDataPosition() {
      this.formData.positionId = ''
      this.formData.positionName = ''
    },
    clearData() {
      this.clearDataGroup()
      this.formData.positionId = ''
      this.formData.positionName = ''
      this.formData.signUserType = constants.SIGN_USER_TYPE.MAIN
      this.formData.signMethod = []
      this.clearDataUser()
    },
    clearDataGroup() {
      this.formData.signGroupName = ''
      this.formData.parentGroupName = ''
      this.formData.signGroupId = ''
      this.formData.groupCode = ''
    },
    clearDataUser() {
      this.formData.signUserId = ''
      this.formData.signUserName = ''
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
        this.clearDataUser()
        this.formData.parentGroupName = group.parentGroupName
        this.formData.signGroupName = group.groupName
        this.formData.groupCode = group.groupCode
        this.formData.positionName = ''
        this.formData.positionId = ''

        this.getUser()
        this.findListPosition()
      }
    },
    // hien thi email va sdt dai dien cua ban
    selectedSigner(value) {
      this.clearDataUser()
      const user = this.userItems.find((g) => g.userId === value)
      if (user) {
        this.formData.signUserId = user.userId
        this.formData.signUserName = user.userName
        this.formData.fullName = user.fullName
        this.formData.email = user.email
        this.formData.phone = user.phone
      }
      this.findListPosition()
      this.$emit('reset-signatures')
    },
    // hien thi chuc danh cua ban
    selectedPosition(value) {
      const position = this.positionItems.find((g) => g.id === parseInt(value))
      if (position) {
        this.formData.positionId = position.id
        this.formData.positionName = position.name
      }
      this.getUser()
      this.$emit('reset-signatures')
    },

    // Load danh sach user theo don vi
    async getUser() {
      try {
        if (!this.formData.signGroupId) {
          return
        }
        const param = {
          groupId: this.formData.signGroupId,
          positionId: this.formData.positionId
        }
        const response = await UsersService.findUsers(param)
        if (response.success) {
          this.userItems = response.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async findListPosition() {
      try {
        if (!this.formData.signGroupId) {
          return
        }
        const param = {
          groupId: this.formData.signGroupId,
          userId: this.formData.signUserId
        }
        this.hasListPositions = false
        const response = await UsersService.findListPosition(param)
        if (response.success) {
          this.positionItems = response.data
          if (this.positionItems.length === 1 && !this.parentId) {
            this.formData.positionId = this.positionItems[0].id
            this.formData.positionName = this.positionItems[0].name
            this.getUser()
          }
          this.hasListPositions = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    trimSpace(val) {
      const value = val.trim()
      this.$emit('reset-signatures')
      return value
    },
    // Change type signer: MAIN, FLASHER, REVIEWER.
    changeTypeSigner(value) {
      if (value === constants.SIGN_USER_TYPE.REVIEWER) {
        this.$emit('reset-signatures')
      }
    },

    blurSelectGroup() {
      this.$refs.selectGroup.blur()
    },

    blurSelectSigner() {
      this.$refs.selectSigner.blur()
    },

    blurSelectTypeSign() {
      this.$refs.selectTypeSign.blur()
    },

    blurSelectPopsition() {
      this.$refs.selectPosition.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group-signer {
  width: 96%;
}
</style>
