<template>
  <div class="d-flex flex-column align-center mx-2">
    <v-btn
      fab
      x-small
      elevation="false"
      class="type-actions"
      :class="getStateAction"
      :disabled="isDisabled"
      @click="onClick"
    >
      <!-- <i class="type-icon" :class="textIcon" /> -->
      <v-tooltip top max-width="250" class="box-shadow">
        <template v-slot:activator="{ on, attrs }">
          <i class="type-icon" :class="textIcon" v-bind="attrs" v-on="on" />
        </template>
        <span>
          {{ textTooltip }}
        </span>
      </v-tooltip>
    </v-btn>
    <label class="text-caption" :class="isActived ? 'purple--text' : ''">{{ textAction }}</label>
  </div>
</template>
<script>
export default {
  props: {
    textAction: {
      type: String,
      default: null
    },
    textIcon: {
      type: String,
      default: null
    },
    onClick: {
      type: Function,
      default: null
    },
    isActived: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    textTooltip: {
      type: String,
      default: 'tooltip'
    }
  },
  computed: {
    getStateAction() {
      if (this.isActived) return 'active'

      return ''
    }
  }
}
</script>
