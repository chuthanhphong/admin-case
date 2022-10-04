<template>
  <div class="file-name px-3">
    <span class="text-hidden"> {{ fileName }} </span>
  </div>
</template>

<script>
export default {
  name: 'TooltipFileDocument',
  props: {
    fileName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.file-name {
  border: 1px solid #c4c4c4;
  border-radius: 14px;
  height: 40px;
  background-color: #fff;
  display: flex;
  align-items: center;
  width: 200px;
  .text-hidden {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
