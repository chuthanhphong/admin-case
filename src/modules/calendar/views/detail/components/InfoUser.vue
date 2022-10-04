<template>
  <div class="group-avatar-signer col-12 pa-0">
    <div class="signer-avatar cursor-pointer">
      <template>
        <img class="ml-3" src="@/assets/icons/calendar/circle.png">
        <div class="text-ellipsis">
          <span>{{ item.participantName }}</span>
        </div>
      </template>
    </div>
    <div class="signer-tooltip">
      <div class="d-flex align-center">
        <v-avatar
          size="40"
          color="#00C3F9"
        >
          <span class="text-uppercase white--text">{{
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoUser',
  props: {
    item: {
      type: Object,
      default: undefined
    }
  },
  methods: {
    getFirstCharacter(item) {
      if (!item) return ''
      if (item.participantName) {
        return this.genAvatar(item.participantName)
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
      return signer.participantName ? signer.participantName : signer.position
    },
    renderSignerPosition(signer) {
      const signerPositionName = signer.position
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
