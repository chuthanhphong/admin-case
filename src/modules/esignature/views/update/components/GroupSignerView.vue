<template>
  <div class="from-group-sign-view row align-center" :class="colorForm">
    <div class="col-sm-3 wrap-users-list">
      <!-- dai dien cua ban -->
      <label class="black--text text--body-1-normal">{{ formData.signGroupName }} </label>
      <span
        v-if="formData.parentGroupName"
        class="black--text text--body-1-normal"
      > - {{ formData.parentGroupName }}
      </span>
    </div>

    <div class="col-sm-2">
      <label class="black--text text--body-1-normal">{{ formData.positionName }}</label>
    </div>
    <div class="col-sm-2">
      <label v-if="formData.signUserId" class="black--text text--body-1-normal">{{
        `${formData.fullName} (${formData.signUserName})`
      }}</label>
    </div>
    <div class="col-sm-2">
      <label class="black--text text--body-1-normal">{{ $t(getSignerType) }}</label>
    </div>
    <div class="col-sm-2">
      <div v-if="checkDisplay" class="d-flex justify-space-around">
        <v-checkbox
          v-model="formData.signMethod"
          hide-details
          :label="$t('document.signPhoto')"
          :value="signMethods.IMAGE_SIGN"
          disabled
          class="mt-0 bg-transparent"
        />
        <v-checkbox
          v-model="formData.signMethod"
          hide-details
          disabled
          :label="$t('document.digitalSignature')"
          :value="signMethods.DIGITAL_SIGN"
          class="mt-0 bg-transparent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import constants from '@/constants'
export default {
  name: 'GroupSignerView',
  props: {
    formData: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      signMethods: constants.SIGN_METHODS
    }
  },
  computed: {
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
    },
    getSignerType() {
      let text = 'document.signType.main'
      if (this.formData.signUserType === constants.SIGN_USER_TYPE.FLASHES) {
        text = 'document.signType.flashes'
      }
      if (this.formData.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
        text = 'document.signType.reviewer'
      }
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
.from-group-sign-view {
  border-radius: 8px;
  margin: 30px 0;
  margin-bottom: 10px;
  padding: 15px;
  cursor: auto;
}
</style>
