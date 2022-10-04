<template>
  <div>
    <v-layout justify-center>
      <div class="text--subtitle text-uppercase font-weight-bold mb-6">{{ computedTitle }}</div>
    </v-layout>
    <div v-if="computedShowTagInactive" class="tag-inactive" />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    status: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentDate: moment().format('DD/MM/YYYY')
    }
  },
  computed: {
    computedTitle() {
      if (this.title) return this.title

      return this.$t('ticket-types.name')
    },
    computedShowTagInactive() {
      return this.isUpdate && this.status === 0
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
