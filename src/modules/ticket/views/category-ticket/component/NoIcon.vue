<template>
  <span class="primary rounded-circle white--text type-ticket-px-2 type-ticket-py-1"> {{ no }}</span>
</template>
<script>
export default {
  props: {
    no: {
      type: String,
      default: '1'
    }
  }
}
</script>
