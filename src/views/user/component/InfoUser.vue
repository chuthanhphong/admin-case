<template>
  <div class="wrap-home ml-2 mt-2">
    <v-sheet
      id="scrolling-techniques-2"
      class="overflow-y-auto"
      max-height="93vh"
    >
      <v-container
        fluid
        class="py-2 rounded-xl bg-primary pb-5 dialog-contract-detail"
      >
        <breadcrumbs :items="breadcrumbs" />
        <v-card color="white" class="rounded-xl ma-2 mt-2 mb-5 py-10">
          <v-row>
            <v-col>
              <div class="row align-center justify-center">
                <div class="container row align-center justify-center">
                  <div class="col-12">
                    <info-top
                      :formdata="formdata"
                      @show-change-password="showChangePassword = true"
                    />
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
        <v-card color="white" class="rounded-xl ma-2 mt-2 mb-2" fixed-header>
          <v-layout class="container mx-auto pa-0 ma-0">
            <div class="col-md-11 mx-auto col-12 wrap-form-user pt-5">
              <h6 color="primary" class="text-uppercase col primary--text">
                {{ $t('users.infoUser') }}
              </h6>
              <v-container
                id="dashboard"
                class="content-form"
                fluid
                tag="section"
              >
                <v-row>
                  <v-container>
                    <v-row>
                      <div class="col-12">
                        <v-row class="justify-space-between">
                          <v-col>
                            <!-- Ten nhan vien -->
                            <div class="form-group">
                              <label class="pr-2 text--body-1">
                                {{ $t('users.fullName') }}
                              </label>
                              <div class="detail-content text--body-1">
                                <span>{{ formdata.fullName }}</span>
                              </div>
                            </div>
                          </v-col>
                          <v-col>
                            <!-- trang thai -->
                            <label class="text-uppercase text--body-1">
                              {{ $t('users.status') }}
                            </label>
                            <div class="detail-content text--body-1">
                              <span>{{ $t(showStatus(formdata.status)) }}</span>
                            </div></v-col>
                        </v-row>
                        <v-row class="justify-space-between">
                          <v-col>
                            <!-- Ten dang nhap -->
                            <label class="text-uppercase text--body-1">
                              {{ $t('username') }}
                            </label>
                            <div class="detail-content text--body-1">
                              <span>{{ formdata.userName }}</span>
                            </div>
                          </v-col>
                          <v-col>
                            <!-- email -->
                            <label class="text-uppercase text--body-1">
                              Email
                            </label>
                            <div class="detail-content text--body-1">
                              <span>{{ formdata.email }}</span>
                            </div>
                          </v-col>
                        </v-row>
                        <v-row class="justify-space-between">
                          <v-col>
                            <!-- Di dong -->
                            <label class="text-uppercase text--body-1">
                              {{ $t('users.mobile') }}</label>
                            <div class="detail-content text--body-1">
                              <span>{{ formdata.phone }}</span>
                            </div>
                          </v-col>
                          <v-col>
                            <!-- Ngon ngu -->
                            <label class="text-uppercase text--body-1">
                              {{ $t('users.language') }}
                            </label>
                            <div class="detail-content text--body-1">
                              <span>{{
                                $t(showLanguage(formdata.language))
                              }}</span>
                            </div>
                          </v-col>
                        </v-row>
                        <v-row class="justify-space-between">
                          <v-col>
                            <!-- Ngay sinh -->
                            <label class="text-uppercase text--body-1">
                              {{ $t('users.dateOfBirth') }}</label>
                            <div class="detail-content text--body-1">
                              <span>{{
                                $t(showDateOfBirth(formdata.dateOfBirth))
                              }}</span>
                            </div>
                          </v-col>
                          <v-col>
                            <!-- Gioi tinh -->
                            <label class="text-uppercase text--body-1">
                              {{ $t('users.gender') }}</label>
                            <div class="detail-content text--body-1">
                              <span>{{ $t(showGender(formdata.gender)) }}</span>
                            </div>
                          </v-col>
                        </v-row>
                        <v-row class="justify-space-between">
                          <v-col>
                            <!-- Dia chi lien he -->
                            <label class="text-uppercase text--body-1">
                              {{ $t('users.address') }}</label>
                            <div class="detail-content text--body-1">
                              <span>{{ formdata.address }}</span>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </v-row>
                    <v-row class="mt-4">
                      <v-col cols="12">
                        <div class="d-flex justify-start">
                          <!-- Vai tro nguoi dung -->
                          <h6
                            color="primary"
                            class="text-uppercase primary--text mt-2"
                          >
                            {{ $t('users.userRole') }}
                          </h6>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="12">
                        <list-role-user
                          :user-roles="roleItems"
                          :parents="parents"
                          :formdata="formdata"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-row>
              </v-container>
            </div>
          </v-layout>
        </v-card>
        <dialog-change-password
          :show-dialog="showChangePassword"
          @close-dialog="showChangePassword = false"
          @accept="acceptChangePassword"
        />
        <dialog-select-signature
          :show-dialog="showDialogSelectSignature"
          @close-dialog="showDialogSelectSignature = false"
        />
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
import DialogSelectSignature from './DialogSelectSignature'
import ListRoleUser from '../component/ListRoleUser'
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import { UsersService } from '@/services/usersService'
import moment from 'moment'
import alertMixin from '@/mixins/alert'
import { mapActions } from 'vuex'
import constants from '@/constants'
import commonRoute from '@/router/routePaths'
import rules from '@/mixins/rules'
import InfoTop from './InfoTop'
import DialogChangePassword from './DialogChangePassword'
import { GroupService } from '@/services/groupService'
import { RoleService } from '@/services/roleService'

const initGroup = {
  fullName: '', // Ten nhan vien
  email: '', // email
  userName: '', // Ten dang nhap
  phone: '', // So dien thoai
  language: 'VI', // Ngon ngu
  dateOfBirth: '', // Ngay sinh
  gender: null, // Gioi tinh
  address: '', // Dia chi
  status: null,
  userRoles: [],
  avatar: '' // Anh dai dien
}
export default {
  components: {
    Breadcrumbs,
    ListRoleUser,
    InfoTop,
    DialogChangePassword,
    DialogSelectSignature
  },
  mixins: [alertMixin, rules],
  data() {
    return {
      showDialogSelectSignature: false,
      roleItems: [],
      parents: [],
      showChangePassword: false,
      isShowAlert: false,
      message: '',
      loading: false,
      menu: false,
      show: false,
      formdata: {
        ...initGroup
      },
      breadcrumbs: [
        {
          text: 'users.user',
          disabled: false,
          href: `${commonRoute.USER_PATH}`
        },
        { text: 'account', disabled: true, href: commonRoute.ECONTRACT_DASHBOARD_PATH }
      ]
    }
  },
  watch: {
    formdata() {
      this.searchGroup()
      this.getlistRole()
    }
  },
  created() {
    this.formdata.userRoles = this.roles
    this.getInfo()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    onSelectSignature() {
      this.showDialogSelectSignature = true
    },

    // function format date input
    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },
    showStatus(status) {
      let text = 'status.active'
      if (status === constants.ACTIVE_TYPE.UN_LOCK) {
        text = 'status.inactive'
      }
      return text
    },
    showLanguage(language) {
      let text = 'language.english'
      if (language === 'VI') {
        text = 'language.vietnamese'
      }
      return text
    },
    showDateOfBirth(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    showGender(gender) {
      let text = ''
      if (gender === constants.GENDER.MALE) {
        text = 'users.male'
      }
      if (gender === constants.GENDER.FEMALE) {
        text = 'users.female'
      }
      return text
    },
    trimSpace(val) {
      const value = val ? val.trim() : ''
      return value
    },
    async getlistRole() {
      try {
        const response = await RoleService.getList()
        this.roleItems = response.data
      } catch (error) {
        console.log(error)
      }
    },
    async searchGroup() {
      try {
        this.groupType = this.formdata.userRoles[0].groupType
        const param = {
          pageSize: 1000000,
          restrictHierarchy: 'false',
          groupType: this.groupType
        }
        const response = await GroupService.search(param)
        this.parents = response.data.data
      } catch (error) {
        console.log(error)
      }
    },
    // API getinfo user
    async getInfo() {
      try {
        const userId = this.$route.params.userId
        const response = await UsersService.getUserInfo(userId)
        this.formdata = response.data
      } catch (error) {
        console.log('error')
      }
    },
    async acceptChangePassword(value) {
      try {
        const response = await UsersService.changePassword(value)
        if (response.status === 200) {
          this.showChangePassword = false
          var message = 'users.messageSuccess.changePassword'
          const typeAlert = 'success'
          await this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message)
          })
          setTimeout(() => {
            localStorage.clear()
            this.$router.push(`${commonRoute.LOGIN_PATH}`).catch(() => {})
          }, 3000)
        }
      } catch (error) {
        const typeAlert = 'error'
        const message = error.message
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message)
        })
      }
    }
  }
}
</script>
