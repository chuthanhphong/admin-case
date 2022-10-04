<template>
  <div class="d-flex align-center justify-center mt-5 mb-2 flex-column">
    <label class="label-download pb-1 text--body-3">{{ $t('labelDownloadApp') }}</label>
    <div class="d-flex align-center">
      <a
        href="https://play.google.com/store/apps/details?id=com.bssd.bssd_econtract"
        target="_blank"
        class="px-1"
      >
        <img src="@/assets/icons/appstore/CHPlay.png" alt="">
      </a>
      <a
        href="https://apps.apple.com/vn/app/mdo-econtract/id1611740140"
        target="_blank"
      >
        <img src="@/assets/icons/appstore/Appstore.png" alt="">
      </a>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.label-download {
  color: #8e8ea1;
}
</style>
