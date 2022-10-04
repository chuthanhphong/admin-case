<template>
  <base-item-group :item="item" />
</template>

<script>
export default {
  name: 'ItemSubGroup',
  props: {
    item: {
      type: Object,
      default: () => ({
        avatar: undefined,
        group: undefined,
        title: undefined,
        enable: false,
        isReload: undefined,
        children: []
      })
    }
  }
}
</script>
