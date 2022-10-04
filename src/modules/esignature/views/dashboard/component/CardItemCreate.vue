<template>
  <v-scale-transition>
    <div v-bind="$attrs" class="wrap-card-create">
      <v-card :href="createDocument" class="wrap-card-item">
        <div class="wrap-card-header">
          <div>
            <p class="text-title">{{ $t('electronicSignLabel') }}</p>
            <p class="text-create">{{ $t('dashboards.create') }}</p>
          </div>

          <v-spacer />

          <img src="@/assets/icons/ic_create.png" alt="iconCard">
        </div>
      </v-card>
    </div>
  </v-scale-transition>
</template>

<script>
import routeEsignature from "@/modules/esignature/router/routePaths";
export default {
  name: 'CardItemCreate',
  data() {
    return {
      createDocument: `${routeEsignature.CREATE_DOCUMENT_PATH}`
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-card-create {
  flex: 0 0 20%;
  max-width: 18%;
  height: 180px;

  @media screen and (max-width: 1120px) {
    flex: 0 0 50%;
    max-width: 50%;
    margin-bottom: 15px;
    padding-right: 24px;
    height: 120px;
  }

  @media screen and (max-width: 1440px) {
    height: 120px;
  }
}

.wrap-card-item {
  height: 180px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  padding: 14px 16px 17px 25.5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #868cff 0%, #4318ff 100%);
  cursor: pointer;

  @media screen and (max-width: 1440px) {
    height: 120px;
    padding: 11px 10px 6px 10.5px;
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

  .text-create {
    font-weight: 800;
    font-size: 36px;
    line-height: 45px;
    text-transform: capitalize;
    color: #fff;
    margin-bottom: 0px;

    @media screen and (max-width: 1440px) {
      font-size: 28px;
      line-height: 35px;
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
</style>
