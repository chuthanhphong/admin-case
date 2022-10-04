<template>
  <div class="wrap-item-ca-esignature">
    <div class="">
      <label class="text--body-2">
        {{ $t('username') }}
        <span class="color-require">*</span>
      </label>
      <validation-provider
        v-slot="{ errors }"
        name="userName"
        rules="required|max:50"
      >
        <v-text-field
          v-model="username"
          :error-messages="errors"
          :placeholder="$t('create-user.userName')"
          outlined
          maxlength="50"
          dense
          @change="username = trimSpace(username)"
        />
      </validation-provider>
    </div>
    <div class="">
      <label class="text--body-2">
        {{ $t('password') }}
        <span class="color-require">*</span>
      </label>
      <validation-provider
        v-slot="{ errors }"
        name="password"
        rules="required|max:50"
      >
        <v-text-field
          v-model="password"
          :error-messages="errors"
          outlined
          :placeholder="$t('create-user.password')"
          maxlength="50"
          dense
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          @click:append="show = !show"
        />
      </validation-provider>
    </div>
    <div class="">
      <label class="text--body-2">
        SERIAL
        <span class="color-require">*</span>
      </label>
      <validation-provider
        v-slot="{ errors }"
        name="serial"
        rules="required|max:100"
      >
        <v-text-field
          v-model="serial"
          :error-messages="errors"
          outlined
          placeholder="Nhập serial"
          maxlength="100"
          dense
          @change="serial = trimSpace(serial)"
        />
      </validation-provider>
    </div>
    <div class="">
      <label class="text--body-2">
        {{ $t('document.label.pin') }}
        <span class="color-require">*</span>
      </label>
      <validation-provider
        v-slot="{ errors }"
        name="inputPin"
        rules="required|max:50"
      >
        <v-text-field
          v-model="pin"
          :error-messages="errors"
          outlined
          :placeholder="$t('document.label.inputPin')"
          maxlength="50"
          dense
          @change="pin = trimSpace(pin)"
        />
      </validation-provider>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EasysignCA',
  data() {
    return {
      pin: '',
      serial: '',
      username: '',
      password: '',
      show: false
    }
  },
  watch: {
    pin() {
      this.submit()
    },
    serial() {
      this.submit()
    },
    username() {
      this.submit()
    },
    password() {
      this.submit()
    }
  },
  created() {
    this.submit()
  },
  methods: {
    submit() {
      const fromdata = {
        username: this.username,
        password: this.password,
        pin: this.pin,
        serial: this.serial
      }
      this.$emit('update-info', fromdata)
    },
    trimSpace(val) {
      const value = val ? val.toString().trim() : ''
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-item-search {
  label {
    text-transform: uppercase;
  }
}
.wrap-item-ca-esignature {
  label {
    display: inline-block;
    margin-bottom: 5px;
    color: #22242c;
    font-weight: 600;
  }
}
</style>
