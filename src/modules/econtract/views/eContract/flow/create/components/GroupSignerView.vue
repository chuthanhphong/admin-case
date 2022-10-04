<template>
  <div class="from-group-sign row align-center text--label-1">
    <div class="color-sign" :class="colorSign" />

    <div class="col-sm-3 wrap-users-list">
      <!-- dai dien cua ban -->
      <label class="black--text text--body-1">{{ signer.name }}</label>
    </div>
    <div class="col-sm-3 ">
      <label class="black--text text--body-1">{{ signer.email }}</label>
    </div>
    <div
      v-if="signer.phone && signer.phone.length > 0"
      class="col-sm-3 "
    >
      <label class="black--text text--body-1">{{ signer.phone }}</label>
    </div>
    <div class="col-sm-2 ml-auto px-0">
      <div class="d-flex justify-space-around">
        <v-checkbox
          v-model="signer.signMethods"
          hide-details
          :label="$t('contract.signPhoto')"
          :value="signMethods.IMAGE_SIGN"
          disabled
          class="mt-0 bg-transparent"
        />
        <v-checkbox
          v-model="signer.signMethods"
          hide-details
          disabled
          :label="$t('contract.digitalSignature')"
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
    signer: {
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
    colorSign() {
      return 'bg-info'
    }
  }
}
</script>

<style lang="scss" scoped></style>
