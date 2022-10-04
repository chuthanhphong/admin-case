<template>
  <v-scale-transition>
    <div v-bind="$attrs" class="wrap-card-five">
      <v-card :href="item.link" class="card-dashboard-esignature">
        <div class="wrap-card-item" :style="`background:${item.bgColor}`">
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
      </v-card>
    </div>
  </v-scale-transition>
</template>

<script>
export default {
  name: 'CardItemFive',
  props: {
    item: {
      type: Object,
      default: undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-card-five {
  flex: 0 0 20%;
  max-width: 18%;
  height: 180px;
  .card-dashboard-esignature {
    border-radius: 20px;
  }

  @media screen and (max-width: 1120px) {
    flex: 0 0 50%;
    max-width: 50%;
    height: 120px;
    margin-bottom: 15px;
  }

  @media screen and (max-width: 1440px) {
    height: 120px;
  }

  a {
    text-decoration: none;
  }
}

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
