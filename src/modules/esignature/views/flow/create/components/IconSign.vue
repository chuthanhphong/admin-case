<template>
  <div v-if="numSign > 0" class="count-signature">
    <v-tooltip right content-class="tooltip-right">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" fab x-small v-bind="attrs" v-on="on">
          <i
            aria-hidden="true"
            class="v-icon notranslate mdi mdi-draw-pen theme--light"
            style="font-size: 20px"
          />
        </v-btn>
      </template>
      <span>{{ numSign }} </span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'IconSign',
  props: {
    numSign: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style></style>
