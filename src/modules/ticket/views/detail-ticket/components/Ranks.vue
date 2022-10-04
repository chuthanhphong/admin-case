<template>
  <v-layout column class="mb-3">
    <v-layout class="mb-1">
      <h6>{{ $t('tickets.labels.rating') }}:</h6>
    </v-layout>
    <v-layout class="gray-f3 py-4 mx-n6">
      <v-layout v-for="i in 5" :key="i" column justify-center align-center>
        <i class="app-icon icon-star" :class="i < 3 ? 'active yellow-ff' : ''"></i>
        <label class="text--label-3 darken--text">Thất vọng</label>
      </v-layout>
    </v-layout>
    <v-layout align-center class="mt-2">
      <v-avatar color="primary" size="32" class="mr-2">K</v-avatar>
      <label class="text--body-5 greya7--text">
        "Yêu cầu hoàn thành ở mức bình thường"
      </label>
    </v-layout>
  </v-layout>
</template>
<script>
export default {};
</script>
