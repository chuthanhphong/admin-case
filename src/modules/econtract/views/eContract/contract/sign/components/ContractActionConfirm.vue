<template>
  <div v-if="contractActionConfirm !== null" class="mt-5">
    <h4>{{ $t('contract.label.activity') }}</h4>
    <v-container class="pa-0">
      <v-list class="contract-history pt-0">
        <template>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                class="d-flex justify-center teal--text text-wrap"
              >{{ $t(genTextBtn) }}
              </v-list-item-title>
              <v-list-item-title
                class="d-flex text-wrap"
              >{{ contractActionConfirm.userFullName }}
              </v-list-item-title>
              <v-list-item-subtitle class="d-flex text-wrap">
                {{ contractActionConfirm.email }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-container>
  </div>
</template>

<script>
import constants from '@/constants'

export default {
  props: {
    contractActionConfirm: {
      type: Object,
      default: undefined
    },
    signUserType: {
      type: String,
      default: null
    }
  },
  computed: {
    genTextBtn() {
      let text = 'contract.label.changeSigner'
      if (this.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
        text = 'contract.label.changeReviewer'
      }
      return text
    }
  }
}
</script>

<style lang="scss">
.contract-history {
  font-size: 13px;
  .icon {
    border: 1px solid #000 !important;
  }
  &.v-list .v-list-item {
    padding: 0 !important;
  }
}
</style>
