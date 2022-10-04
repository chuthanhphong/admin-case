<template>
  <validation-provider
    v-slot="{ errors }"
    name="select"
    class="select-option-fluid"
    :vid="`select-option-${indexParent}-${index}`"
    :rules="computedSelectRules"
  >
    <v-text-field
      v-model="selectOptions[index]"
      :placeholder="$t('enter-option-name')"
      dense
      hide-details="auto"
      class="mb-3 input-label"
      prepend-icon="mdi-checkbox-blank-outline"
      append-outer-icon="mdi-minus-circle-outline"
      :error-messages="errors"
      :maxlength="maximumSmallText"
      @click:append-outer="removeOption"
    />
  </validation-provider>
</template>

<script>
import constants from '@/constants'

export default {
  props: {
    selectOptions: {
      type: Array,
      default: undefined
    },
    index: {
      type: Number,
      default: undefined
    },
    indexParent: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      maximumSmallText: constants.MAXIMUM_SMALL_TEXT
    }
  },
  computed: {
    computedSelectRules() {
      if (this.selectOptions && this.selectOptions.length > 0) {
        // // calculate max length
        // const optionsLen = this.selectOptions.join(',').length
        // const valLen = this.selectOptions[this.index] ? this.selectOptions[this.index].length : 0
        // let max = constants.MAXIMUM_SMALL_TEXT - optionsLen + valLen
        // if (max <= 0) {
        //   max = 0
        // }

        const results = []
        this.selectOptions.forEach((item, idx) => {
          if (this.index !== idx && item !== '') {
            results.push(item)
          }
        })
        if (results.length > 0) {
          let excludedVal = ''
          const len = results.length
          results.forEach((item, idx) => {
            if (idx === len - 1) {
              excludedVal += item
            } else {
              excludedVal += item + ','
            }
          })

          return `required|excluded:${excludedVal}`
        } else {
          return `required`
        }
      } else {
        return `required`
      }
    }
  },
  methods: {
    removeOption() {
      this.$emit('remove-option', this.index)
    }
  }
}
</script>

<style lang="scss" scoped></style>
