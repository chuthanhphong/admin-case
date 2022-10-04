<template>
  <v-fade-transition>
    <div
      v-show="activeIndex == index"
      class="wrap-popup-list-signer"
      :class="{ active: listShowPopup[index] }"
    >
      <div class="popup-list-signer">
        <div class="popup-header d-flex align-center justify-space-between">
          <div>
            <span>{{ $t('document.listSign') }}</span>
            <span> ({{ item.signers.length }})</span>
          </div>
          <v-btn
            text
            icon
            class="btn-close-list-signer"
            @click="closePopupCustomer(index)"
          ><v-icon>mdi-close</v-icon></v-btn>
        </div>
        <v-divider class="my-1" />
        <div class="list-signer">
          <div
            v-for="(signer, itemIndex) in item.signers"
            :key="itemIndex"
            class="list-item-signer pb-2"
          >
            <div class="d-flex align-center">
              <v-avatar size="32" :color="lstColors[itemIndex % 5]">
                <span class="text-uppercase white--text">{{
                  getFirstCharacter(signer)
                }}</span>
              </v-avatar>
              <div class="d-flex flex-column pl-2 text-left">
                <div>
                  <b>{{ renderSignerName(signer) }}</b>
                </div>
                <div class="signer-document">
                  <span v-html="renderSignerPosition(signer)" />
                  <span v-html="renderSignerInfo(signer)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-fade-transition>
</template>

<script>
export default {
  props: {
    activeIndex: {
      type: Number,
      default: undefined
    },
    index: {
      type: Number,
      default: undefined
    },
    listShowPopup: {
      type: Array,
      default: undefined
    },
    item: {
      type: Object,
      default: undefined
    },
    lstColors: {
      type: Array,
      default: undefined
    }
  },
  methods: {
    closePopupCustomer(index) {
      this.$emit('close-popup-signer', index)
    },
    getFirstCharacter(signer) {
      if (!signer) return ''
      if (parseInt(signer.signProcessType) === 1 || signer.fullName) {
        return this.genAvatar(signer.fullName)
      }
      return this.genAvatar(signer.positionName)
    },
    genAvatar(name) {
      if (!name) return ''
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
    renderSignerName(signer) {
      return signer.fullName ? signer.fullName : signer.positionName
    },
    renderSignerInfo(signer) {
      return signer.groupPathName ? signer.groupPathName + '<br/>' : ''
    },
    renderSignerPosition(signer) {
      let signerPositionName = signer.positionName
      if (parseInt(signer.signProcessType) !== 1) {
        signerPositionName =
          signerPositionName +
          ' (' +
          this.$t('document.signaturePosition') +
          ')'
      }
      return signer.fullName ? signerPositionName + '<br/>' : ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
