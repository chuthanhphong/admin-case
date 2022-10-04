<template>
  <v-dialog
    v-model="showDialog"
    content-class="dialog-change-password"
    class="wrap-dialog-change-passowrd"
    persistent
    max-width="860"
  >
    <div class="row ma-0">
      <v-card
        color="primary col-12 col-md-5 d-flex pl-6 flex-column justify-center"
      >
        <span class="title-rule-change-pass">
          {{ $t('dialogChangePassword.titleRequire') }}:
        </span>
        <ul>
          <li>
            <span v-html="validNewPasswordType(validateType.LENGTH)" />
            {{ $t('dialogChangePassword.requireLength') }}
          </li>
          <li>
            <span v-html="validNewPasswordType(validateType.UPPERCASE)" />
            {{ $t('dialogChangePassword.requireUppercase') }}
          </li>
          <li>
            <span v-html="validNewPasswordType(validateType.LOWERCASE)" />
            {{ $t('dialogChangePassword.requireLowercase') }}
          </li>
          <li>
            <span v-html="validNewPasswordType(validateType.NUMBER)" />
            {{ $t('dialogChangePassword.requireNumber') }}
          </li>
          <li>
            <span v-html="validNewPasswordType(validateType.SPECIAL)" />
            {{ $t('dialogChangePassword.requireSpecialCharacter') }}
          </li>
        </ul>
      </v-card>
      <v-card class="col-12 col-md-7">
        <v-card-title class="d-flex justify-center flex-column">
          <h5 class="text-center">
            {{ $t('changePassword') }}
          </h5>
          <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <div class="wrap-change-password px-5">
          <validation-observer ref="observer">
            <div class="form-group flex-column align-start">
              <div class="wrap-users-list col-12  pa-0">
                <label class="mb-0 text--body-1">
                  {{ $t('oldPassword') }}
                  <span class="red--text">*</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  name="oldPassword"
                  :rules="password"
                >
                  <v-text-field
                    v-model="oldPassword"
                    outlined
                    rounded
                    :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showOldPassword ? 'text' : 'password'"
                    maxlength="50"
                    dense
                    :placeholder="$t('placeholder.oldPassword')"
                    :error-messages="errors"
                    required
                    class="text--body-1"
                    @click:append="showOldPassword = !showOldPassword"
                  />
                </validation-provider>
              </div>
            </div>
            <div class="form-group flex-column align-start">
              <div class="wrap-users-list col-12 pa-0">
                <label class="text--body-1">
                  {{ $t('newPassword') }}
                  <span class="red--text">*</span>
                </label>

                <validation-provider
                  v-slot="{ errors }"
                  vid="newPassword"
                  :name="$t('newPassword')"
                  :rules="password"
                >
                  <v-text-field
                    v-model="newPassword"
                    outlined
                    rounded
                    :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showNewPassword ? 'text' : 'password'"
                    maxlength="50"
                    dense
                    :placeholder="$t('placeholder.newPassword')"
                    :error-messages="errors"
                    required
                    class="text--body-1"
                    @click:append="showNewPassword = !showNewPassword"
                  />
                </validation-provider>
              </div>
            </div>
            <div class="form-group flex-column align-start">
              <div class="wrap-users-list col-12 pa-0">
                <label class="text--body-1">
                  {{ $t('confirmNewPassword') }}
                  <span class="red--text">*</span>
                </label>

                <validation-provider
                  v-slot="{ errors }"
                  name="confirmNewPassword"
                  :rules="confirmPassword"
                >
                  <v-text-field
                    v-model="confirmNewPassword"
                    outlined
                    rounded
                    maxlength="50"
                    :append-icon="
                      showConfirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :type="showConfirmNewPassword ? 'text' : 'password'"
                    dense
                    :placeholder="$t('confirmNewPassword')"
                    :error-messages="errors"
                    required
                    class="text--body-1"
                    @click:append="
                      showConfirmNewPassword = !showConfirmNewPassword
                    "
                  />
                </validation-provider>
              </div>
            </div>
          </validation-observer>
        </div>
        <v-card-actions class="d-flex justify-space-around py-6">
          <v-btn
            rounded
            outlined
            color="primary"
            class="w-150 py-5 text--button"
            @click="closeDialog"
          >
            {{ $t('cancelLabel') }}
          </v-btn>

          <v-btn
            rounded
            color="primary"
            class="w-150 py-5 text--button"
            @click="accept"
          >
            {{ $t('saveLabel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import rules from '@/mixins/rules'
import constants from '@/constants'
const validateType = {
  UPPERCASE: 1,
  LOWERCASE: 2,
  NUMBER: 3,
  LENGTH: 4,
  SPECIAL: 5
}
export default {
  mixins: [rules],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showOldPassword: false,
      showNewPassword: false,
      showConfirmNewPassword: false,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      validateType: validateType
    }
  },
  computed: {},
  methods: {
    validNewPasswordType(type) {
      var regex = ''
      switch (+type) {
        case validateType.UPPERCASE:
          regex = /[A-Z]/
          break
        case validateType.LOWERCASE:
          regex = /[a-z]/
          break
        case validateType.NUMBER:
          regex = /[0-9]/
          break
        case validateType.LENGTH:
          regex = /[A-Za-z\d*@#$%^&+=]{8,50}/
          break
        case validateType.SPECIAL:
          regex = /[*@#$%^&+=]/
          break
      }
      if (this.newPassword && this.newPassword.trim().length > 0) {
        const isValid = regex.test(this.newPassword)
        return this.iconCheckValid(isValid)
      } else {
        return `<i class="icon-validate normal"></i>`
      }
    },
    iconCheckValid(isValid) {
      if (isValid) {
        return `<i class="icon-validate valid"></i>`
      } else {
        return `<i class="icon-validate invalid"></i>`
      }
    },
    async accept() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.$emit('accept', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          confirmNewPassword: this.confirmNewPassword
        })
      }
    },
    closeDialog() {
      this.$emit('close-dialog')
      localStorage.setItem(constants.HIDE_POPUP_CHANGE_PASSWORD, 1)
      this.resetInput()
    },
    resetInput() {
      this.oldPassword = ''
      this.newPassword = ''
      this.confirmNewPassword = ''
      this.$refs.observer.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.title-rule-change-pass {
  color: #22242c;
  font-size: 12px !important;
  font-weight: 600 !important;
}
</style>
