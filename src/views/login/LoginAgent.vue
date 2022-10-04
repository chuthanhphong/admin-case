<template>
  <v-app>
    <div id="login-page" class="auth-page d-flex align-center">
      <v-scroll-y-transition>
        <v-container v-show="animated" fluid tag="section">
          <v-row id="wrap-login" class="justify-center">
            <v-col md="8">
              <v-row id="login-content">
                <!-- logo -->
                <v-col class="panel-login" lg="7" md="6">
                  <div id="feature-img" class="img">
                    <img src="@/assets/login-panel.svg">
                  </div>
                </v-col>
                <v-col class="form-login" lg="5" md="6">
                  <!-- logo chuyển ngôn nhữ -->
                  <v-row class="justify-end">
                    <v-col sm="2" />
                    <v-menu
                      bottom
                      content-class="menu-lang arrow-up"
                      left
                      offset-y
                      origin="top right"
                      transition="scroll-y-transition"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="btn-switch-lang"
                          elevation="0"
                          rounded
                          small
                          v-bind="attrs"
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
                          class="align-items-center"
                          link
                          @click="switchLang(`${item.value}`)"
                        >
                          <v-list-item-icon class="my-0 align-self-center">
                            <img :src="item.icon" style="width: 30px">
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
                  <v-row class="flex-md-row flex-column">
                    <v-col md="12">
                      <div class="auth-logo">
                        <img
                          alt=""
                          src="@/assets/logo.png"
                          srcset=""
                        >
                        <h4 class="py-0">{{ $t('login') }}</h4>
                      </div>
                    </v-col>
                    <v-col md="12">
                      <!-- login form -->
                      <validation-observer ref="observer" v-slot="{ invalid }">
                        <form novalidate @submit.prevent="login">
                          <v-row>
                            <v-col md="12">
                              <validation-provider
                                v-slot="{ errors }"
                                name="Email"
                                rules="required|email"
                              >
                                <!-- <p>{{ $t('username') }}</p> -->
                                <v-text-field
                                  ref="refUserName"
                                  v-model="formdata.email"
                                  :error-messages="errors"
                                  :placeholder="`${$t('input')} Email`"
                                  autocomplete="new-email"
                                  class="text--label-1"
                                  flat
                                  label="Email"
                                  outlined
                                  prepend-inner-icon="mdi-account"
                                  required
                                  @change="formdata.email = trimSpace(formdata.email)"
                                />
                              </validation-provider>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="12">
                              <validation-provider
                                v-slot="{ errors }"
                                :name="$t(`loginCode`)"
                                rules="required"
                              >
                                <!-- <p>{{ $t('password') }}</p> -->
                                <v-text-field
                                  v-model="formdata.code"
                                  :error-messages="errors"
                                  :label="$t(`loginCode`)"
                                  :placeholder="`${$t('input')} ${$t(
                                    'loginCode'
                                  )}`"
                                  autocomplete="new-code"
                                  class="text--label-1"
                                  flat
                                  outlined
                                  prepend-inner-icon="mdi-code-greater-than"
                                  required
                                />
                              </validation-provider>
                              <div
                                v-if="showLoginCode"
                                class="d-flex justify-end mb-2"
                                @click="renewCode"
                              >
                                <v-btn
                                  :disabled="loading"
                                  class="text-normal text--button"
                                  color="primary"
                                  rounded
                                  text
                                >{{ $t('getLoginCode') }}</v-btn>
                              </div>
                            </v-col>
                          </v-row>
                          <v-row v-if="disabledCaptcha">
                            <v-col md="5">
                              <v-text-field
                                v-model="formdata.captcha"
                                dense
                                flat
                                label="Captcha"
                                outlined
                              />
                            </v-col>
                            <v-col md="5">
                              <div class="img-captcha">
                                <img
                                  :src="`data:image/png;base64,${captcha}`"
                                >
                              </div>
                            </v-col>
                            <v-col class="pt-5" md="1">
                              <v-icon
                                @click.prevent="reCaptcha"
                              >mdi-autorenew</v-icon>
                            </v-col>
                          </v-row>

                          <v-btn
                            :disabled="invalid"
                            block
                            class="mr-4 py-6 text--button"
                            color="primary"
                            rounded
                            type="submit"
                          >
                            {{ $t('access') }}
                          </v-btn>
                        </form>
                      </validation-observer>
                    </v-col>
                  </v-row>
                  <download-store />
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
      <base-session-expired
        :show-dialog="showSessionExpired"
        @close-dialog="closeDialogSessionExpired"
      />
    </div>
  </v-app>
</template>

<script>
import { AuthService } from '@/services/authService'
import { DeviceUUID } from 'device-uuid/lib/device-uuid'
import { localize } from 'vee-validate'
import constants from '@/constants'
import commonRoute from '@/router/routePaths'
import econtractRoute from '@/modules/econtract/router/routePaths'
import { mapActions } from 'vuex'
import { UsersService } from '@/services/usersService'
import DownloadStore from './DownloadStore.vue'
import { RoleService } from '@/services/roleService'

export default {
  components: { DownloadStore },
  data() {
    return {
      showLoginCode: false,
      message: null,
      loading: false,
      isShowAlert: false,
      showSessionExpired: false,
      typeAlert: 'error',
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
      show: false,
      disabledCaptcha: false,
      uuid: '',
      formdata: {
        email: '',
        code: '',
        captcha: null
      },
      captcha: '',
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
    const localShowSessionExpired = localStorage.getItem('showSessionExpired')
    this.showSessionExpired = localShowSessionExpired === 'true'
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
    ...mapActions('user', ['setCurrentUser']),
    ...mapActions('layout', ['setUserInfo']),
    async reCaptcha() {
      try {
        const response = await AuthService.reCaptcha(this.uuid)
        if (response.data) {
          this.captcha = response.data.captcha
        }
      } catch (error) {
        console.log(this.captcha)
      }
    },
    trimSpace(val) {
      return val ? val.trim() : ''
    },
    // function login goi loginUser tu action
    async login() {
      const du = new DeviceUUID().parse()
      const dua = [
        du.language,
        du.platform,
        du.os,
        du.cpuCores,
        du.isAuthoritative,
        du.silkAccelerated,
        du.isKindleFire,
        du.isDesktop,
        du.isMobile,
        du.isTablet,
        du.isWindows,
        du.isLinux,
        du.isLinux64,
        du.isMac,
        du.isiPad,
        du.isiPhone,
        du.isiPod,
        du.isSmartTV,
        du.pixelDepth,
        du.isTouchScreen
      ]
      this.uuid = du.hashMD5(dua.join(':'))
      const params = {
        email: this.formdata.email.trim(),
        code: this.formdata.code.trim(),
        guid: this.uuid,
        captcha: this.formdata.captcha || null
      }
      this.loading = true
      try {
        const response = await AuthService.login(JSON.stringify(params), true)
        this.setCurrentUser(response.data.data)
        await this.getUserProfile()
        localStorage.setItem(constants.LOGIN_TYPE, 'AGENT')
        const contractId = localStorage.getItem(constants.CONTRACT_ID)
        const coordinationId = localStorage.getItem(constants.COORDINATION_ID)
        if (contractId) {
          localStorage.removeItem(constants.CONTRACT_ID)
          this.$router.push(`${econtractRoute.SIGN_CONTRACT_PATH.replaceAll(':contractId', contractId)}`)
            .catch(() => {
              this.$router.push(`${econtractRoute.ECONTRACT_DASHBOARD_PATH}`)
            })
        } else if (coordinationId) {
          localStorage.removeItem(constants.COORDINATION_ID)
          this.$router
            .push(`${econtractRoute.COORDINATION_CONTRACT_PATH.replaceAll(':contractId', coordinationId)}`)
            .catch(() => {
              this.$router.push(`${econtractRoute.ECONTRACT_DASHBOARD_PATH}`)
            })
        } else {
          this.$router.push(`${commonRoute.DASHBOARD_HOME_PATH}`)
        }
      } catch (error) {
        if (error.data.data) {
          this.showLoginCode = error.data.data.errorCode === '400'
        }
        this.isShowAlert = true
        this.typeAlert = 'error'
        this.message = error.data.message
        this.captcha = error.data.data.captcha || null
        this.disabledCaptcha = this.captcha != null
      } finally {
        this.loading = false
      }
    },
    async getUserProfile() {
      try {
        const response = await UsersService.getUserProFile()
        if (response.status === 200) {
          const data = response.data
          data.modules = await RoleService.loadModulePermision()
          if (data.modules && data.modules.indexOf('vn.bssd.digitalworkspace.econtract') < 0) {
            data.modules.push('vn.bssd.digitalworkspace.econtract')
          }
          this.setUserInfo(data)
          localStorage.setItem(constants.USER_INFO, JSON.stringify(data))
          if (data.isFirstLogin) {
            this.checkFirstLogin = true
          }
        }
      } catch (error) {
        localStorage.clear()
        this.isShowAlert = true
        this.typeAlert = 'error'
        this.message = this.$t('getInfoFail')
        this.$router.push(`${commonRoute.LOGIN_AGENT_PATH}`)
      }
    },
    async renewCode() {
      try {
        this.loading = true
        const response = await AuthService.renewCode(this.formdata)
        if (response.status === 200) {
          this.isShowAlert = true
          this.typeAlert = 'success'
          this.message = this.$t('renewCodeSuccess')
        }
      } catch (error) {
        this.isShowAlert = true
        this.typeAlert = 'error'
        this.message = error.message
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 2000)
      }
    },
    // function chuyen ngon ngu
    switchLang(lang) {
      this.$refs.observer.reset()
      this.$root.$i18n.locale = lang
      localize(lang)
      this.iconLang = lang
      localStorage.setItem(constants.LANGUAGE, lang)
    },
    closeDialogSessionExpired() {
      this.showSessionExpired = false
    }
  }
}
</script>
