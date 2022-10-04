<template>
  <div>
    <template v-for="(signer, index) in item.participants">
      <v-avatar
        v-if="index < 5 || (item.participants.length < 5 && index == 4)"
        :key="index"
        size="32"
        :color="signer.groupType ? '' : lstColors[index % 5]"
        class="signer white--text"
        :style="`left: ${20 * index}px`"
        @click="activeShowPopupSigner(indexRow)"
      >
        <img
          v-if="signer.groupType"
          alt=""
          src="@/assets/icons/calendar/avatar-group.svg"
          class="cursor-pointer"
        >
        <span v-else class="text-uppercase">{{ getFirstCharacter(signer) }}</span>
        <div class="signer-tooltip">
          <div class="d-flex align-center">
            <v-avatar
              size="40"
              :color="signer.groupType ? '' : lstColors[index % 5]"
              @click="activeShowPopupSigner(indexRow)"
            >
              <img
                v-if="signer.groupType"
                alt=""
                src="@/assets/icons/calendar/avatar-group.svg"
                class="cursor-pointer"
              >
              <span v-else class="text-uppercase white--text">{{
                getFirstCharacter(signer)
              }}</span>
            </v-avatar>
            <div class="d-flex flex-column pl-2 text-left">
              <div>
                <b>{{ renderSignerName(signer) }}</b>
              </div>
              <div class="signer-document">
                <span v-html="renderEmailPhone(signer)" />
                <span v-html="renderSignerPosition(signer)" />
                <span v-html="renderSignerInfo(signer)" />
              </div>
            </div>
          </div>
        </div>
      </v-avatar>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: undefined
    },
    lstColors: {
      type: Array,
      default: undefined
    },
    indexRow: {
      type: Number,
      default: undefined
    }
  },
  methods: {
    activeShowPopupSigner(index) {
      this.$emit('active-show-popup-signer', index)
    },
    getFirstCharacter(signer) {
      if (!signer) return ''
      if (parseInt(signer.signProcessType) === 1 || signer.fullName) {
        return this.genAvatar(signer.fullName)
      }
      return this.genAvatar(signer.position)
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
      return signer.fullName ? signer.fullName : signer.position
    },
    renderSignerInfo(signer) {
      return signer.groupPathName ? signer.groupPathName + '<br/>' : ''
    },
    renderEmailPhone(signer) {
      if (!signer.email && !signer.phone) return ''
      if (!signer.email) return signer.phone + '<br>'
      if (!signer.phone) return signer.email + '<br>'
      return signer.email + ' - ' + signer.phone + '<br>'
    },
    renderSignerPosition(signer) {
      const signerPositionName = signer.position
      return signerPositionName ? signerPositionName + '<br/>' : ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
