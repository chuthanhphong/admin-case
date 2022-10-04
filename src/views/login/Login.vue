<template>
  <v-app>
    <div id="login-page" class="auth-page d-flex align-center">
      <v-scroll-y-transition>
        <v-container v-show="animated" fluid tag="section">
          <v-row id="wrap-login" class="justify-center">
            <v-col md="8">
              <v-row id="login-content">
                <!-- logo -->
                <v-col lg="7" md="6" class="panel-login">
                  <div id="feature-img" class="img">
                    <img src="@/assets/login-panel.svg" />
                  </div>
                </v-col>
                <v-col lg="5" md="6" class="form-login">
                  <!-- logo chuyển ngôn nhữ -->
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
                          class="btn-switch-lang"
                          v-on="on"
                        >
                          <v-avatar size="25">
                            <img :src="srcLang" alt="" />
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
                            <img :src="item.icon" style="width: 25px" />
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
                        <img src="@/assets/logo.png" alt="" srcset="" />
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
                                :name="$t(`username`)"
                                rules="required"
                              >
                                <!-- <p>{{ $t('username') }}</p> -->
                                <v-text-field
                                  ref="refUserName"
                                  v-model="formdata.username"
                                  prepend-inner-icon="mdi-account"
                                  outlined
                                  class="text--label-1"
                                  :label="$t('username')"
                                  :placeholder="$t('username')"
                                  flat
                                  :error-messages="errors"
                                  required
                                  autocomplete="account-name"
                                />
                              </validation-provider>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="12">
                              <validation-provider
                                v-slot="{ errors }"
                                :name="$t(`password`)"
                                rules="required"
                              >
                                <!-- <p>{{ $t('password') }}</p> -->
                                <v-text-field
                                  v-model="formdata.password"
                                  prepend-inner-icon="mdi-lock"
                                  :placeholder="$t('password')"
                                  :append-icon="
                                    show ? 'mdi-eye' : 'mdi-eye-off'
                                  "
                                  outlined
                                  class="text--label-1"
                                  :type="show ? 'text' : 'password'"
                                  flat
                                  :label="$t(`password`)"
                                  :error-messages="errors"
                                  required
                                  autocomplete="new-password"
                                  @click:append="show = !show"
                                />
                              </validation-provider>
                              <div
                                v-if="!disabledCaptcha"
                                class="d-flex justify-end"
                              >
                                <p>
                                  <a
                                    class="text--overlined-1"
                                    @click="forgotPassword"
                                  >
                                    {{ $t('forgot') }}
                                  </a>
                                </p>
                              </div>
                            </v-col>
                          </v-row>
                          <v-row v-if="disabledCaptcha">
                            <v-col md="5">
                              <v-text-field
                                v-model="formdata.captcha"
                                dense
                                label="Captcha"
                                class="text--label-1"
                                outlined
                                flat
                              />
                            </v-col>
                            <v-col md="5">
                              <div class="img-captcha">
                                <img
                                  :src="`data:image/png;base64,${captcha}`"
                                />
                              </div>
                            </v-col>
                            <v-col md="1" class="pt-5">
                              <v-icon
                                @click.prevent="reCaptcha"
                              >mdi-autorenew</v-icon>
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
                            {{ $t('login') }}
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
import { mapActions } from 'vuex'
import { DeviceUUID } from 'device-uuid/lib/device-uuid'
import { localize } from 'vee-validate'
import constants from '@/constants'
import { UsersService } from '@/services/usersService'
import { RoleService } from '@/services/roleService'
import DownloadStore from './DownloadStore.vue'
import commonRoute from '@/router/routePaths'
import econtractRoute from '@/modules/econtract/router/routePaths'
import { messaging, getToken, PUBLIC_KEY } from '@/firebase'

export default {
  components: { DownloadStore },
  data() {
    return {
      checkFirstLogin: false,
      message: null,
      loading: false,
      isShowAlert: false,
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
        username: '',
        password: '',
        captcha: ''
      },
      captcha: '',
      iconLang: 'vi',
      showSessionExpired: true,
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
    ...mapActions('layout', ['setUserInfo']),
    focusUserName() {
      this.$refs.refUserName.focus()
    },
    forgotPassword() {
      this.$router.push(`${commonRoute.FORGOT_PASSWORD_PATH}`).catch(() => {})
    },
    async reCaptcha() {
      try {
        const response = await AuthService.reCaptcha(this.uuid)
        if (response.data) this.captcha = response.data.captcha
      } catch (error) {
        console.log(this.captcha)
      }
    },
    //   mapACtion tu store user voi action la loginUser
    ...mapActions('user', ['loginUser']),
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
        username: this.formdata.username.trim(),
        password: this.formdata.password,
        guid: this.uuid,
        captcha: this.formdata.captcha || null
      }
      this.loading = true
      const response = await this.loginUser(JSON.stringify(params))
      if (response.error) {
        this.isShowAlert = true
        this.message = response.data.message
        this.captcha = response.data.data.captcha || null
        this.disabledCaptcha = this.captcha != null
      } else {
        await this.getUserProfile()
        this.getTokenFireBase()
        try {
          if (this.checkFirstLogin) {
            this.updateFirstLogin()
          }
        } catch (error) {
          console.log(error)
        }
        localStorage.setItem(constants.LOGIN_TYPE, 'IN')
        const contractId = localStorage.getItem(constants.CONTRACT_ID)
        const coordinationId = localStorage.getItem(constants.COORDINATION_ID)
        const contractUpdateId = localStorage.getItem(
          constants.CONTRACT_UPDATE_ID
        )
        const pathEsignature = localStorage.getItem(
          constants.ESIGNATURE_DOCUMNET_DETAIL
        )
        const pathEdocument = localStorage.getItem(
          constants.MANAGEMENT_DOC_DETAIL
        )
        if (pathEdocument) {
          this.$router.push(pathEdocument)
        } else if (pathEsignature) {
          this.$router.push(pathEsignature)
        } else if (contractId) {
          localStorage.removeItem(constants.CONTRACT_ID)
          this.$router
            .push(
              `${econtractRoute.SIGN_CONTRACT_PATH.replaceAll(
                ':contractId',
                contractId
              )}`
            )
            .catch(() => {
              this.$router.push(`${econtractRoute.ECONTRACT_DASHBOARD_PATH}`)
            })
        } else if (coordinationId) {
          localStorage.removeItem(constants.COORDINATION_ID)
          this.$router
            .push(
              `${econtractRoute.COORDINATION_CONTRACT_PATH.replaceAll(
                ':contractId',
                coordinationId
              )}`
            )
            .catch(() => {
              this.$router.push(`${econtractRoute.ECONTRACT_DASHBOARD_PATH}`)
            })
        } else if (contractUpdateId) {
          localStorage.removeItem(constants.CONTRACT_UPDATE_ID)
          this.$router
            .push(
              `${econtractRoute.UPDATE_CONTRACT_PATH.replaceAll(
                ':contractId',
                contractUpdateId
              )}`
            )
            .catch(() => {
              this.$router.push(`${econtractRoute.ECONTRACT_DASHBOARD_PATH}`)
            })
        } else {
          this.$router.push(`${commonRoute.DASHBOARD_HOME_PATH}`)
        }
      }
      this.loading = false
    },

    async saveFcmToken(currentToken) {
      const data = {
        fcmToken: currentToken,
        guid: this.uuid,
        deviceType: 'WEB'
      }
      UsersService.saveFcmToken(data)
        .then()
        .catch(error => console.log(error))
    },

    getTokenFireBase() {
      getToken(messaging, { vapidKey: PUBLIC_KEY })
        .then(currentToken => {
          console.log(currentToken)
          if (currentToken) {
            this.saveFcmToken(currentToken)
          } else {
            console.log(
              'No registration token available. Request permission to generate one.'
            )
          }
        })
        .catch(err => {
          console.log('An error occurred while retrieving token. ', err)
        })
    },
    // function chuyen ngon ngu
    switchLang(lang) {
      this.$refs.observer.reset()
      this.$root.$i18n.locale = lang
      localize(lang)
      this.iconLang = lang
      localStorage.setItem(constants.LANGUAGE, lang)
    },
    async getUserProfile() {
      try {
        const response = await UsersService.getUserProFile()
        if (response.status === 200) {
          const data = response.data
          // load modules roles
          data.modules = await RoleService.loadModulePermision()
          if (
            data.modules &&
            data.modules.indexOf('vn.bssd.digitalworkspace.econtract') < 0
          ) {
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
        this.message = this.$t('getInfoFail')
        this.$router.push(constants.ROOT_PATH)
        console.log(error)
      }
    },
    async updateFirstLogin() {
      try {
        await UsersService.updateFirstLogin()
      } catch (error) {
        console.log(error)
      }
    },
    closeDialogSessionExpired() {
      this.showSessionExpired = false
    }
  }
}
</script>
