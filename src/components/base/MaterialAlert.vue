<template>
  <v-alert v-bind="$attrs" v-on="$listeners">
    <template v-if="$attrs.icon" v-slot:prepend>
      <v-icon class="v-alert__icon white">
        {{ $attrs.icon }}
      </v-icon>
    </template>

    <slot />

    <template v-if="$attrs.dismissible" v-slot:close="{ toggle }">
      <v-btn
        :aria-label="$vuetify.lang.t('$vuetify.close')"
        color
        icon
        small
        @click="toggle"
      >
        <v-icon>
          $vuetify.icons.cancel
        </v-icon>
      </v-btn>
    </template>
  </v-alert>
</template>

<script>
export default {
  name: 'MaterialAlert'
}
</script>

<style lang="scss">
.v-alert:not(.v-sheet--tile) {
  border-radius: 0;
}
.v-snack__content {
  padding: 0;
}
.v-sheet.v-snack__wrapper {
  border-radius: 0;
  margin-bottom: 20px;
}
</style>
