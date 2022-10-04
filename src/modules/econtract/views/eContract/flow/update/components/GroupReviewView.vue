<template>
  <div class="from-group-sign row align-center text--label-1">
    <div class="color-sign" :class="colorSign" />

    <div class="col-sm-3 wrap-users-list">
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
  </div>
</template>

<script>
export default {
  name: 'GroupReviewView',
  props: {
    signer: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    colorSign() {
      return 'bg-primary'
    }
  }
}
</script>

<style lang="scss" scoped></style>
