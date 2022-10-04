<template>
  <v-layout v-if="totalRecords > 0" row justify-space-between>
    <div class="text--body-1">
      <span>{{ $t('paging.show') }} {{ `${fromRecord} - ${toRecord}` }}
        {{ $t('paging.from') }} <b>{{ totalRecords }}</b>
        {{ $t('paging.data') }}</span>
    </div>
    <div v-if="totalPages > 1" class="control-paging d-flex align-center">
      <v-btn
        elevation="1"
        icon
        small
        outlined
        :disabled="disablePrev"
        @click="goToPage(1)"
      >
        <v-icon>mdi-chevron-double-left</v-icon>
      </v-btn>
      <v-btn
        class="mx-3"
        elevation="1"
        icon
        outlined
        small
        :disabled="disablePrev"
        @click="prevPage"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span class="current-page text--body-1">{{ page }}</span>
      <span class="mx-3">/</span>
      <span class="text--body-1">{{ totalPages }}</span>
      <v-btn
        elevation="1"
        class="mx-3"
        icon
        outlined
        small
        :disabled="disableNext"
        @click="nextPage"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-btn
        elevation="1"
        icon
        small
        outlined
        :disabled="disableNext"
        @click="goToPage(totalPages)"
      >
        <v-icon>mdi-chevron-double-right</v-icon>
      </v-btn>
    </div>
  </v-layout>
</template>

<script>
export default {
  name: 'Paging',
  props: {
    page: {
      type: Number,
      default: 0
    },
    totalPages: {
      type: Number,
      default: 0
    },
    fromRecord: {
      type: Number,
      default: 0
    },
    toRecord: {
      type: Number,
      default: 0
    },
    totalRecords: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      disablePrev: true,
      disableNext: false
    }
  },
  watch: {
    page() {
      if (this.page <= 1) {
        this.disablePrev = true
        this.disableNext = false
      } else if (this.page >= this.totalPages) {
        this.disablePrev = false
        this.disableNext = true
      } else {
        this.disablePrev = false
        this.disableNext = false
      }
    },
    totalPages() {
      if (this.page <= 1) {
        this.disablePrev = true
        this.disableNext = false
      } else if (this.page >= this.totalPages) {
        this.disablePrev = false
        this.disableNext = true
      } else {
        this.disablePrev = false
        this.disableNext = false
      }
    }
  },
  methods: {
    goToPage(page) {
      this.$emit('on-change-page', page)
    },
    nextPage() {
      if (this.page >= this.totalPages) {
        return
      }
      const nextPage = this.page + 1

      this.$emit('on-change-page', nextPage)
    },
    prevPage() {
      if (this.page <= 1) {
        return
      }
      const prevPage = this.page - 1
      this.$emit('on-change-page', prevPage)
    }
  }
}
</script>

<style lang="scss" scoped>
.control-paging {
  * {
    color: #8e8ea1;
  }
}
</style>
