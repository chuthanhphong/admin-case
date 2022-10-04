<template>
  <div>
    <!-- <v-tabs v-model="tabSign" fixed-tabs>
      <v-tab ref="tab1" key="0">
        {{ $t('contract.signPhoto') }}
      </v-tab>
      <v-tab key="1">
        {{ $t('contract.digitalSignature') }}
      </v-tab>
    </v-tabs> -->

    <v-tabs-items v-model="tabSign">
      <v-tab-item>
        <p class="note-select-signature">{{ $t('clickSelectSignature') }}</p>
        <div class="sign-item" @click="toggleDialog(true, signTypes.IMAGE)">
          <div class="count-sign">{{ countImageSign }}</div>
          <div class="text-sign">
            <i class="icon-pentool" />
            <h5 class="text-capitalize">{{ $t('contract.signature') }}</h5>
            <div class="note-sign">
              <span>{{ $t('contract.idSignature') }} </span>
            </div>
          </div>
        </div>
      </v-tab-item>
      <!-- <v-tab-item>
        <p class="note-select-signature">{{ $t('clickSelectSignature') }}</p>
        <div class="sign-item" @click="toggleDialog(true, signTypes.CA)">
          <div class="count-sign">{{ countCASign }}</div>
          <div class="text-sign">
            <i class="icon-pentool" />
            <h5 class="text-capitalize">{{
              $t('users.digitalSignatures')
            }}</h5>
            <div class="note-sign">
              <span>{{ $t('contract.idSignature') }} </span>
            </div>
          </div>
        </div>
      </v-tab-item> -->
    </v-tabs-items>
  </div>
</template>

<script>
import constants from '@/constants'
export default {
  props: {
    itemsSign: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      tabSign: 0,
      signTypes: constants.SIGN_TYPES
    }
  },
  computed: {
    countImageSign() {
      if (this.itemsSign) {
        // const totalImageSign = this.itemsSign.filter(
        //   item => item.signer.signType === constants.SIGN_TYPES.IMAGE
        // )
        return this.itemsSign.length
      }
      return 0
    },
    countCASign() {
      if (this.itemsSign) {
        const totalImageSign = this.itemsSign.filter(
          item => item.signer.signType === constants.SIGN_TYPES.CA
        )
        return totalImageSign.length
      }
      return 0
    }
  },
  methods: {
    toggleDialog(value, type) {
      if (type === this.signTypes.CA) {
        return this.$emit('toggle-dialog-select-singer-ca', value)
      }
      this.$emit('toggle-dialog-select-singer', value)
    }
  }
}
</script>

<style lang="sass" scoped></style>
