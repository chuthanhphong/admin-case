<template>
  <div class="pt-4 esignature-font">
    <div
      v-for="(item, index) in parentSignProcesses"
      :key="index"
      class="wrap-sign-note mb-5"
    >
      <div class="d-flex">
        <label class="text--body-1 mb-1">{{ $t('document.label.note') }}</label>
      </div>
      <div class="text--overlined wrap--text">
        <div class="pb-1">
          <label>{{ $t('document.label.sender') }}: </label>&nbsp;
          <label>{{ item.fullName }}</label>
        </div>

        <div class="pb-1">
          <label>{{ $t('document.position') }}: </label>&nbsp;
          <label>{{ item.positionName }}</label>
        </div>

        <div class="pb-1">
          <label>{{ $t('document.unit') }}: </label>&nbsp;
          <label>{{ item.signGroupName }}</label>
        </div>

        <div class="pb-1">
          <label>{{ $t('document.label.note') }}: </label>&nbsp;
          <span class="mb-0" v-html="assignmentNote(item.assignmentNote)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignNote',
  props: {
    parentSignProcesses: {
      type: Array,
      default: undefined
    }
  },
  methods: {
    assignmentNote(value) {
      if (!value) return ''
      if (value.includes('\n')) {
        return value.replaceAll('\n', '<br />')
      }
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-sign-note {
  width: 250px;
  border: 1px solid #6b7280;
  border-radius: 8px;
  padding: 10px;
  margin: auto;
  justify-content: start;
  align-items: flex-start;
  text-align: start;
  color: #000000;
  label {
    display: inline-block;
    margin-bottom: 5px;
    color: #000000;
    font-weight: 500 !important;
    font-size: 13px;
  }
  @media screen and (max-width: 1336px) {
    width: 150px;
  }
}
</style>
