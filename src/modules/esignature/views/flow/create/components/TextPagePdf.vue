<template>
  <div class="text-page-pdf">
    {{ textPage }}
  </div>
</template>

<script>
export default {
  name: 'TextPagePdf',
  props: {
    textPage: {
      type: String,
      default: '1'
    }
  }
}
</script>

<style></style>
