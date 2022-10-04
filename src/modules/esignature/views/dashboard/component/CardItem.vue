<template>
  <v-col cols="12" md="3" sm="6" class="pa-0">
    <div
      class="wrap-card-item"
      :style="`background:${item.bgColor}`"
      :class="getMarginRight"
    >
      <div class="wrap-card-header">
        <div>
          <p class="text-title">{{ $t(item.title) }}</p>
          <p class="text-count">{{ item.count }}</p>
        </div>

        <v-spacer />

        <img :src="item.icon" alt="iconCard">
      </div>

      <v-spacer />

      <p class="text-subtitle">{{ $t(item.subTitle) }}</p>
    </div>
  </v-col>
</template>

<script>

// import constants from '@/constants'
import routeEsignature from '@/modules/esignature/router/routePaths'

export default {
  name: 'CardItem',
  props: {
    item: {
      type: Object,
      default: undefined
    },

    index: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      createDocumentPath: routeEsignature.CREATE_DOCUMENT_PATH
    }
  },

  computed: {
    getMarginRight() {
      return this.index < 3 ? 'card-margin-right' : 'card-margin-right-last'
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-card-item {
  height: 180px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  padding: 14px 16px 17px 15.5px;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1440px) {
    height: 120px;
    padding: 11px 10px 6px 9.5px;
  }
}

.card-margin-right {
  margin-right: 24px;
}

.card-margin-right-last {
  margin-right: 0;
  @media screen and (max-width: 960px) {
    margin-right: 24px;
  }
}

.wrap-card-header {
  display: flex;

  .text-title {
    font-weight: 600;
    font-size: 24px;
    line-height: 33px;
    text-transform: capitalize;
    color: #fff;
    margin-bottom: 8.5px;

    @media screen and (max-width: 1440px) {
      margin-bottom: 0px;
      font-size: 18px;
      line-height: 23px;
    }
  }

  .text-count {
    font-weight: 800;
    font-size: 36px;
    line-height: 45px;
    color: #fff;
    margin-bottom: 0px;

    @media screen and (max-width: 1440px) {
      font-size: 34px;
      line-height: 43px;
    }
  }

  img {
    width: 74px;
    height: 74px;
    @media screen and (max-width: 1440px) {
      width: 50px;
      height: 50px;
    }
  }
}

.text-subtitle {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.2px;
  color: #ffffff;
  margin-bottom: 0;

  @media screen and (max-width: 1440px) {
    font-size: 14px;
    line-height: 18px;
  }
}
</style>
