<template>
  <v-dialog v-if="showDialog" v-model="showDialog" persistent max-width="550">
    <v-card>
      <v-icon class="close-dialog" color="#8E8EA1" @click="closeDialog">
        mdi-close
      </v-icon>
      <h5 class="text-center text-capitalize pt-6 px-10">
        <div>{{ $t(titleConfirm) }}</div>
      </h5>

      <!-- Thong tin doi nguoi ky -->
      <div class="d-flex justify-center mt-8">
        <div class="blue-dot" />
        <div class="d-flex flex-column">
          <p class="text--body-1 mb-0">{{ formData.fullName }}</p>
          <p class="text--body-2-normal mb-0 color--sub">
            {{ formData.positionName }}
          </p>
          <p class="text--body-2-normal mb-0 color--sub">
            {{ formData.groupName }}
          </p>
        </div>
      </div>

      <!-- Button -->
      <div class="d-flex justify-center mt-10 pb-4">
        <v-btn
          rounded
          outlined
          color="primary"
          class="btn-dialog mr-12"
          @click="closeDialog"
        >
          {{ $t('electronicSign.back') }}
        </v-btn>

        <v-btn rounded color="primary" class="btn-dialog" @click="accept">
          {{ $t('accept') }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: null
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    titleConfirm: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    accept() {
      this.closeDialog()
      this.$emit('accept-action')
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.blue-dot {
  width: 15px;
  height: 15px;
  background-color: #0fafe4;
  border-radius: 100%;
  margin: 10px;
}

.color--sub {
  color: #8e8ea1;
  line-height: 15px;
}
</style>
