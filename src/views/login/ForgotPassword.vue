<template>
  <v-app>
    <div id="login-page" class="auth-page d-flex align-center">
      <v-scroll-y-transition>
        <v-container v-show="animated" fluid tag="section">
          <v-row id="wrap-login" class="justify-center">
            <v-col lg="8" md="10">
              <v-row id="login-content">
                <!-- logo -->
                <v-col lg="7" md="6" class="panel-login">
                  <div id="feature-img" class="img">
                    <img src="@/assets/login-panel.svg">
                  </div>
                </v-col>
                <v-col lg="5" md="6" class="form-login">
                  <!-- logo chuyển ngôn nhữ -->
                  <div class="d-flex align-center">
                    <v-btn fab icon text small @click="goLogin">
                      <v-icon color="#000">mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-row class="justify-end">
                      <v-menu
                        bottom
                        left
                        offset-y
                        origin="top right"
                        transition="scroll-y-transition"
                        content-class="menu-lang arrow-up"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            rounded
                            small
                            v-bind="attrs"
                            elevation="0"
                            class="btn-switch-lang mt-0"
                            v-on="on"
                          >
                            <v-avatar size="25">
                              <img :src="srcLang" alt="">
                            </v-avatar>
                            <span class="px-2">
                              <span v-if="iconLang == 'vi'">VNI</span>
                              <span v-else>EN</span>
                            </span>
                            <v-icon>mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list nav>
                          <v-list-item
                            v-for="(item, i) in langs"
                            :key="`lang-${i}`"
                            link
                            class="align-items-center"
                            @click="switchLang(`${item.value}`)"
                          >
                            <v-list-item-icon class="my-0 align-self-center">
                              <img :src="item.icon" style="width: 25px">
                            </v-list-item-icon>
                            <v-list-item-content class="p-0">
                              <v-list-item-title class="text-capitalize">{{
                                $t(item.text)
                              }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-row>
                  </div>

                  <v-row class="flex-md-row flex-column">
                    <v-col md="12">
                      <div class="auth-logo">
                        <img
                          src="@/assets/logo.png"
                          alt=""
                          srcset=""
                        >
                        <h4>{{ $t('forgot') }}</h4>
                        <div class="text--body-1">
                          {{ $t('forgot-content') }}
                        </div>
                      </div>
                    </v-col>
                    <v-col md="12" class="mb-8">
                      <!-- login form -->
                      <validation-observer ref="observer" v-slot="{ invalid }">
                        <form novalidate @submit.prevent="forgotPassword">
                          <v-row class="mb-10">
                            <v-col md="12">
                              <validation-provider
                                v-slot="{ errors }"
                                name="Email"
                                :rules="ruleEmail"
                              >
                                <v-text-field
                                  ref="refUserName"
                                  v-model="formdata.email"
                                  prepend-inner-icon="mdi-email"
                                  :placeholder="$t('placeholder.email')"
                                  outlined
                                  maxlength="255"
                                  class="text--label-1"
                                  flat
                                  label="Email"
                                  :error-messages="errors"
                                  required
                                />
                              </validation-provider>
                            </v-col>
                          </v-row>
                          <v-btn
                            :disabled="invalid"
                            color="primary"
                            class="mr-4 py-6 text--button"
                            block
                            rounded
                            type="submit"
                          >
                            {{ $t('getLoginPassword') }}
                          </v-btn>
                        </form>
                      </validation-observer>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-scroll-y-transition>
      <base-loading :is-loading="loading" />
      <base-material-snackbar
        v-model="isShowAlert"
        :type="typeAlert"
        v-bind="{
          top: true,
          right: true
        }"
      >
        {{ message }}
      </base-material-snackbar>
    </div>
  </v-app>
</template>

<script>
import { localize } from 'vee-validate'
import { AuthService } from '@/services/authService'
import rules from '@/mixins/rules'
import constants from '@/constants'
import commonRoute from '@/router/routePaths'

export default {
  mixins: [rules],
  data() {
    return {
      message: null,
      loading: false,
      isShowAlert: false,
      typeAlert: null,
      langs: [
        {
          icon: require('@/assets/langs/vn.png'),
          text: 'language.vietnamese',
          value: 'vi'
        },
        {
          icon: require('@/assets/langs/us.png'),
          text: 'language.english',
          value: 'en'
        }
      ],
      listImgLang: {
        vi: require('@/assets/langs/vn.png'),
        en: require('@/assets/langs/us.png')
      },
      formdata: {
        email: ''
      },
      iconLang: 'vi',
      animated: false
    }
  },
  computed: {
    srcLang() {
      const src = this.listImgLang[this.iconLang]
      return src
    }
  },
  created() {
    const localLang = localStorage.getItem(constants.LANGUAGE) || 'vi'
    localize(localLang)
    this.iconLang = localLang
    localStorage.setItem(constants.LANGUAGE, localLang)
  },
  mounted() {
    setTimeout(() => {
      this.animated = true
    }, 100)
    setTimeout(() => {
      this.focusUserName()
    }, 200)
  },
  methods: {
    focusUserName() {
      this.$refs.refUserName.focus()
    },
    goLogin() {
      this.$router.replace(`${commonRoute.LOGIN_PATH}`)
    },
    async forgotPassword() {
      try {
        const params = {
          email: this.formdata.email.trim()
        }
        this.loading = true
        const response = await AuthService.forgotPassword(params)
        if (response.data.status === 200) {
          this.typeAlert = 'success'
          this.isShowAlert = true
          this.message = this.$t('users.messageSuccess.forgotPassword')
          this.loading = false
          setTimeout(() => {
            this.$router.push(`${commonRoute.LOGIN_PATH}`).catch(() => {})
          }, 2000)
        }
      } catch (error) {
        this.typeAlert = 'error'
        this.isShowAlert = true
        this.message = error.message
        this.loading = false
      }
    },
    // function chuyen ngon ngu
    switchLang(lang) {
      this.$refs.observer.reset()
      this.$root.$i18n.locale = lang
      localize(lang)
      this.iconLang = lang
      localStorage.setItem(constants.LANGUAGE, lang)
    }
  }
}
</script>
