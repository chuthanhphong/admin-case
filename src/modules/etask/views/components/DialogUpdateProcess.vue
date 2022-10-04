<template>
  <v-dialog v-model="showDialog" max-width="530" persistent>
    <div class="process">
      <div class="header">
        <div class="d-flex justify-center align-center">
          <h5 class="mr-4">{{ $t('task-manager.label.update-process') }}</h5>
          <v-text-field
            v-model="dataProcess.process"
            dense
            hide-details
            outlined
            style="max-width: 70px; margin: 10px 0"
            type="number"
            @keypress="isNumber"
          />
        </div>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </div>
      <div class="px-5">
        <v-slider
          v-model="dataProcess.process"
          :thumb-color="color"
          thumb-label="always"
        />
      </div>
      <div class="d-flex justify-center align-center mb-3">
        <v-btn
          class="w-150 py-5 text--button"
          color="primary"
          rounded
          @click="onSubmit"
        >
          <span class="text-uppercase text--button">{{ $t('task-manager.button.update') }} </span>
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>
<script>

export default {
  name: 'DialogUpdateProcess',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    dataProcess: {
      type: Object,
      default: undefined
    },
    rowId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      color: '#00c3f9'
    }
  },
  watch: {
  },
  methods: {
    onSubmit() {
      this.$emit('change-process', this.dataProcess.process)
      this.$emit('close-dialog')
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
    isNumber(event) {
      if (event.key === '.') {
        return event.preventDefault()
      } else {
        return true
      }
    }
  }
}
</script>
<style scoped>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(191 191 191 / 40%);
  justify-content: center;
  align-items: center;
  display: flex;
}

.process {
  transform-origin: center center;
  overflow-y: auto;
  pointer-events: auto;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
  z-index: inherit;
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
  background: #FFFFFF;
  border-radius: 15px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin: 10px 10px 35px;
}

.close {
  font-size: 20px;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.v-slider--horizontal.v-slider__track-container {
  height: 10px;
}
</style>
