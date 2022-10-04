<template>
  <div>
    <v-row
      v-for="(selectPage, index) in listSelectPageSign"
      :key="index"
      class="item-select-page-sign"
    >
      <v-btn
        v-show="listSelectPageSign.length > 1"
        class="btn-remove-select-page-sign"
        color="error"
        icon
        @click="removeSelectPageSign(index)"
      >
        <v-icon>mdi-minus-circle-outline</v-icon></v-btn>
      <v-col>
        <v-text-field
          v-model="selectPage.start"
          :label="$t('document.label.fromPage')"
          :min="1"
          oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
          hide-details
          dense
          outlined
          @keypress="isNumber"
          @change="checkValidStart(index)"
          @keyup.enter="checkValidStart(index)"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="selectPage.end"
          :label="$t('document.label.toPage')"
          :min="1"
          oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
          hide-details
          dense
          outlined
          @keypress="isNumber"
          @change="checkInput(index)"
          @keyup.enter="checkInput(index)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'RangePage',
  props: {
    listSelectPageSign: {
      type: Array,
      default: undefined
    },
    max: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      start: 1,
      end: 1
    }
  },
  watch: {
    selectPage: {
      handler(value) {
        console.log(value)
      },
      deep: true
    }
  },
  methods: {
    removeSelectPageSign(index) {
      this.listSelectPageSign.splice(index, 1)
    },
    checkInput(index) {
      const range = this.listSelectPageSign[index]
      range.start = this.formatRange(range.start)
      range.end = this.formatRange(range.end)

      if (range.start > range.end) {
        range.end = range.start
      }
    },
    isNumber(event) {
      if (event.key === '.') {
        return event.preventDefault()
      } else {
        return true
      }
    },
    formatRange(value) {
      if (+value <= 0) {
        value = 1
      }
      if (+value > this.max) {
        value = this.max
      }
      try {
        value = value.toString().replace(/\./g, '')
      } catch (error) {
        console.log(error)
      }
      return +value
    },
    checkValidStart(index) {
      var range = this.listSelectPageSign[index]
      range.start = this.formatRange(range.start)
      if (range.end && range.start > range.end) {
        range.end = range.start
      }
    }
  }
}
</script>
