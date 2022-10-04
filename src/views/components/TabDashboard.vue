<template>
  <div class="action">
    <div v-if="isActivePerform" class="action-item">
      <div>{{ activePerform }}</div>
      <div class="line-active"></div>
    </div>
    <div v-else class="action-item-unactive" @click="$emit('onIPerformClick')">
      <div>{{ activePerform }}</div>
      <div class="line-unActive"></div>
    </div>
    <div v-if="isActiveCreate" class="action-item">
      <div>{{ activeCreate }}</div>
      <div class="line-active"></div>
    </div>
    <div v-else class="action-item-unactive" @click="$emit('onICreateClick')">
      <div>{{ activeCreate }}</div>
      <div class="line-unActive"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activePerform: {
      type: String,
      default: "",
    },
    activeCreate: {
      type: String,
      default: "",
    },
    isActivePerform: {
      type: Boolean,
      default: false,
    },
    isActiveCreate: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.action {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 25px 0px 0px 0px;
  .action-item-unactive,
  .action-item {
    width: 50%;
    text-align: center;
    padding-bottom: 8px;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    cursor: pointer;
  }
  .action-item-unactive {
    color: #c5c7cd;
  }
}
.line-active {
  height: 6px;
  background: #00c3f9;
  border-radius: 10px;
  margin-top: 6px;
}

.line-unActive {
  height: 1px;
  background: #dfe0eb;
  margin-top: 10px;
}
.line-row {
  height: 100%;
  width: 1px;
  background: rgba(15, 18, 63, 0.44);
}
</style>
