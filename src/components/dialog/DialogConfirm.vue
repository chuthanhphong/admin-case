<template>
  <v-dialog v-model="internalValue" persistent :max-width="widthDialog">
    <v-card class="pb-3">
      <v-layout justify-end class="pt-2 mr-3 mb-6">
        <v-icon color="grey" size="20" @click="onClose">mdi-close</v-icon>
      </v-layout>
      <v-card-text class="text-center">
        <v-row justify="center" class="font-weight-bold black--text text-h6 px-8">
          <h6>{{ message }}</h6>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-layout justify-center>
          <v-col cols="9">
            <v-layout justify-space-between>
              <v-btn
                color="primary"
                rounded
                outlined
                elevation="1"
                class="w-120 py-5 mr-0 mr-md-6 bg-white"
                @click="onCancel"
              >
                <span class="text-primary">{{ $t('cancel') }}</span>
              </v-btn>
              <v-btn
                color="primary"
                rounded
                class="w-120 py-5"
                @click="onAccept(data)"
              >
                {{ $t('agree') }}
              </v-btn>
            </v-layout>
          </v-col>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'DialogConfirm',
  props: {
    widthDialog: {
      type: Number,
      default: 460
    },
    value: Boolean,
    message: {
      type: String,
      default: null
    },
    onAccept: {
      type: Function,
      default: undefined
    },
    onCancel: {
      type: Function,
      default: undefined
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      internalValue: this.value
    }
  },
  watch: {
    internalValue(val, oldVal) {
      if (val === oldVal) return

      this.$emit('input', val)
    },
    value(val, oldVal) {
      if (val === oldVal) return

      this.internalValue = val
    }
  },
  methods: {
    onClose() {
      this.$emit('input', false)
    }
  }
}
</script>
