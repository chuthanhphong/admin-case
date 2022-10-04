<template>
  <div class="text-center empty-box mt-12">
    <div v-if="loading">
      <v-progress-circular
        indeterminate
        :size="35"
        :width="1"
        color="primary"
      />
    </div>
    <div v-else class="wrap-empty-box">
      <h4 class="empty-title">{{ $t('empty.data') }}</h4>

      <p class="empty-note">{{ $t(note) }}</p>
      <img src="@/assets/imgs/empty.png" alt="empty">
      <v-btn
        v-if="showBtnCreate"
        class="btn-action-empty"
        rounded
        color="#6160DC"
        @click="createDocument()"
      >
        <span class="text-btn-action-empty">
          {{ $t('create_doc_label') }}
        </span>
      </v-btn>
    </div>
  </div>
</template>

<script>
// import constants from '@/constants'
import routeEsignature from '@/modules/esignature/router/routePaths'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    note: {
      type: String,
      default: 'empty.note'
    },

    showBtnCreate: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    createDocument() {
      this.$router.push(routeEsignature.CREATE_DOCUMENT_PATH)
    }
  }
}
</script>

<style lang="scss">
.wrap-empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;

  .btn-action-empty {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  }

  .text-btn-action-empty {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    text-transform: uppercase;
    color: #ffffff;
  }
}

.empty-title {
  font-weight: 700;
  font-size: 19px;
  line-height: 24px;
  text-align: center;
  color: #22242c;
  margin-bottom: 5px;
}

.empty-note {
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  color: #c1c9d2;

  @media screen and (max-width: 1440px) {
    font-size: 12px;
    line-height: 15px;
  }
}
</style>
