<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        color="error"
        class="btn-remove-signer"
        v-bind="attrs"
        fab
        dark
        x-small
        v-on="on"
        @click="onClick"
      >
        <v-icon>mdi-minus-circle-outline</v-icon>
      </v-btn>
    </template>
    <span>Xóa</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'BtnRemove',
  methods: {
    onClick() {
      this.$emit('on-click')
    }
  }
}
</script>

<style lang="scss" scoped></style>
