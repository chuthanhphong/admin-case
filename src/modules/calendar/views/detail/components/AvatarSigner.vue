<template>
  <div class="group-avatar-signer">
    <template>
      <v-avatar
        size="32"
        class="signer-avatar"
        color="#00C3F9"
      >
        <img
          v-if="isGroup(item)"
          alt=""
          src="@/assets/icons/calendar/avatar-group.svg"
          class="cursor-pointer"
        >
        <span v-else class="text-uppercase white--text">
          {{ getFirstCharacter(item) }}
        </span>
        <div class="signer-tooltip">
          <div class="d-flex align-center">
            <v-avatar
              size="40"
              color="#00C3F9"
            >
              <img
                v-if="isGroup(item)"
                alt=""
                src="@/assets/icons/calendar/avatar-group.svg"
                class="cursor-pointer"
              >
              <span v-else class="text-uppercase white--text">{{
                getFirstCharacter(item)
              }}</span>
            </v-avatar>
            <div class="d-flex flex-column pl-2 text-left col-10">
              <div class="text-ellipsis">
                <b>{{ renderSignerName(item) }}</b>
              </div>
              <div class="signer-document text-ellipsis">
                <span v-html="renderEmailPhone(item)" />
                <span v-html="renderSignerPosition(item)" />
                <span v-html="renderSignerInfo(item)" />
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
  name: 'AvatarSigner',
  props: {
    item: {
      type: Object,
      default: undefined
    }
  },
  methods: {
    isGroup(item) {
      if (!item.userId && item.groupId) {
        return true
      }
      return false
    },
    getFirstCharacter(item) {
      if (!item) return ''
      if (item.fullName) {
        return this.genAvatar(item.fullName)
      }
      return null
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
      return signer.fullName ? signer.fullName : signer.groupName
    },
    renderSignerInfo(signer) {
      return signer.groupPathName ? signer.groupPathName + '<br/>' : ''
    },
    renderSignerPosition(signer) {
      const signerPositionName = signer.positionName
      return signerPositionName ? signerPositionName + '<br/>' : ''
    },
    renderEmailPhone(signer) {
      if (!signer.email && !signer.phone) return "";
      if (!signer.email) return signer.phone + "<br>";
      if (!signer.phone) return signer.email + "<br>";
      return signer.email + " - " + signer.phone + "<br>";
    },
  }
}
</script>

<style lang="scss" scoped></style>
