<template>
  <v-scale-transition>
    <div v-bind="$attrs">
      <v-card
        v-if="!isCreatCard"
        class="pa-4 card-dashboard"
        :style="`background:${item.bgColor}`"
        :href="item.link"
      >
        <div class="card-header d-flex justify-space-between">
          <div class="card-info">
            <div class="card-name text--subtitle">{{ $t(item.name) }}</div>
            <h2 class="card-value">
              {{ (+item.value).toLocaleString() || 0 }}
            </h2>
          </div>
          <div class="card-icon rounded-circle" :class="`bg-${item.iconColor}`">
            <v-icon color="white" size="30">
              {{ item.icon }}
            </v-icon>
          </div>
        </div>
        <div class="card-body text--caption">
          <div class="day-remain">
            <span class="remain-text">{{ $t(item.remainText) }}</span>
          </div>
        </div>
      </v-card>
      <v-card
        v-else
        class="pa-4 card-dashboard d-flex  justify-space-between gradient-info"
        :href="createContract"
      >
        <div class="card-header d-flex justify-space-between">
          <div class="card-info">
            <div class="card-name white--text text--subtitle">
              {{ $t(item.name) }}
            </div>
            <h2 class="card-value white--text">
              {{ $t(item.value) }}
            </h2>
          </div>
        </div>
        <div class="card-icon rounded-circle align-self-center">
          <v-icon color="gray--text" size="30">
            {{ item.icon }}
          </v-icon>
        </div>
      </v-card>
    </div>
  </v-scale-transition>
</template>

<script>
import routePaths from '@/router/routePaths'
import econtractRoute from '@/modules/econtract/router/routePaths'
export default {
  name: 'CardItem',
  props: {
    item: {
      type: Object,
      default: undefined
    },
    isCreatCard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      routePaths,
      createContract: `${econtractRoute.CREATE_CONTRACT_PATH}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors';
.gradient-info {
  background: linear-gradient(135deg, #868cff 0%, #4318ff 100%);
}
.card-dashboard {
  border-radius: 20px;
  min-height: 130px;
  .card-info {
    .card-name {
      color: #fff;
      font-weight: 600;
      font-size: 18px;
    }
    .card-value {
      font-size: 34px;
      color: #fff;
      font-weight: 800;
    }
  }
  .card-icon {
    background: #ffffff40 !important;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }
  .card-body {
    position: absolute;
    bottom: 15px;
  }
  &.gradient-info {
    .card-icon {
      background: #ffffff !important;
    }
  }
}
@media (max-width: 640px) {
  .card-dashboard {
    width: 100%;
  }
}
</style>
