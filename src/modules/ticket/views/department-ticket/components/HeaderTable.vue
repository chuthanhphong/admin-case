<template>
  <v-simple-table fixed-header height="100" class="no-set-minh">
    <template v-slot:default>
      <v-data-table-header
        :headers="headers"
        class="text--body-5"
      ></v-data-table-header>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {};
  },
};
</script>
