<template>
  <div>
    <div class="icon-result" :class="type">
      <img
        v-if="type == 'success'"
        src="@/assets/icons/icon-check-bold.png"
        alt=""
      >
      <img v-else src="@/assets/icons/icon-caution.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    background: {
      type: String,
      default: '#20C2C4'
    },
    type: {
      type: String,
      default: 'success'
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-result {
  width: 47px;
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 15px auto;
  &.success {
    background: #20c2c4 !important;
  }
  img {
    align-self: center;
  }
}
</style>
