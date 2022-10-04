<template>
  <v-dialog v-model="showDialog" persistent max-width="400">
    <v-card class="dialog-select-sign">
      <v-row class="close-dialog-sign ma-0">
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </v-row>

      <v-row class="title-dialog-sign ma-0 mb-5">
        {{ $t('selectUpload') }}
      </v-row>

      <v-row class="ma-0 justify-center radio-type-upload mt-3">
        <v-radio-group v-model="radios">
          <v-radio :label="$t('radioInfo')" value="userInfo" class="mb-6" />
          <v-radio :label="$t('radioComputer')" value="computer" />
        </v-radio-group>
      </v-row>

      <!-- button -->
      <v-card-actions class="d-flex justify-center mt-8 pb-4">
        <v-btn
          rounded
          outlined
          color="primary"
          class="dialog-select-type-btn mr-10"
          @click="closeDialog"
        >
          {{ $t('document.signProcessStatus.reject') }}
        </v-btn>

        <v-btn
          rounded
          color="primary"
          class="dialog-select-type-btn"
          @click="accept"
        >
          {{ $t('electronicSign.continue') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radios: 'userInfo'
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    },

    accept() {
      this.$emit('accept-dialog', this.radios)
    }
  }
}
</script>

<style lang="scss">
.radio-type-upload {
  .v-radio .v-label {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #22242c;
  }
}

.dialog-select-type-btn {
  width: 150px;
  min-height: 50px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  @media screen and (max-width: 1440px) {
    min-height: 37px;
    width: 130px;
  }
}
</style>
