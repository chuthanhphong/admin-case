<template>
  <div class="wrap-home ml-2 mt-2">
    <v-sheet
      id="scrolling-techniques-2"
      class="overflow-y-auto"
      max-height="95vh"
    >
      <v-container fluid class="py-2 rounded-xl bg-primary pb-5">
        <breadcrumbs :items="breadcrumbs" />
        <v-card color="white" class="rounded-xl ma-2 mt-2 mb-5 py-10">
          <v-row>
            <v-col>
              <div
                class="row align-center justify-center col-md-8 col-12 mx-auto"
              >
                <div
                  class="container row align-center justify-center flex-md-row flex-column"
                >
                  <div class="col-md-8 col-12 border-right-dasher">
                    <avatar :formdata="formdata" />
                  </div>
                  <div
                    class="col-md-4 col-12 d-flex align-center justify-center"
                  >
                    <!-- Tai anh chu ky -->
                    <v-btn
                      color="primary"
                      rounded
                      class="btn-upload-avatar w-150 text--button"
                    >{{ $t('users.uploadSignature') }}</v-btn>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-card color="white" class="rounded-xl ma-2 mt-2 mb-2" fixed-header>
          <v-layout class="container mx-auto pa-0 ma-0">
            <div class="col-md-11 col-12 mx-auto wrap-form-user pt-5">
              <!-- Thong tin nhan vien -->
              <h6 color="primary" class="text-uppercase col primary--text">
                {{ $t('users.infoUser') }}
              </h6>
              <validation-observer ref="observer">
                <form @submit.prevent="editUser">
                  <v-container class="content-form" fluid tag="section">
                    <v-row>
                      <v-container id="dashboard" fluid tag="section">
                        <v-row>
                          <v-col>
                            <div>
                              <v-row
                                v-if="showUserName"
                                class="justify-space-between"
                              >
                                <v-col md="5" cols="12" class="py-0">
                                  <!-- Ten nhan vien -->
                                  <validation-provider
                                    v-slot="{ errors }"
                                    name="fullName"
                                    :rules="fullNameRuler"
                                  >
                                    <label class="text-uppercase text--body-1">
                                      {{ $t('users.fullName') }}
                                      <span class="color-require">*</span>
                                    </label>
                                    <v-text-field
                                      v-model="formdata.fullName"
                                      dense
                                      outlined
                                      maxlength="255"
                                      :placeholder="$t('create-user.fullName')"
                                      flat
                                      solo
                                      :error-messages="errors"
                                      required
                                      class="text--body-1"
                                      @change="
                                        formdata.fullName = trimSpace(
                                          formdata.fullName
                                        )
                                      "
                                    />
                                  </validation-provider>
                                </v-col>
                                <v-col md="5" cols="12" class="py-0">
                                  <!-- trang thai -->
                                  <validation-provider>
                                    <label class="text-uppercase text--body-1">
                                      {{ $t('users.status') }}</label>
                                    <v-select
                                      v-model="formdata.activeType"
                                      outlined
                                      attach
                                      dense
                                      :menu-props="{
                                        bottom: true,
                                        offsetY: true
                                      }"
                                      flat
                                      solo
                                      item-value="value"
                                      class="text--body-1"
                                      :items="statusItems"
                                      :disabled="!isNotAdmin"
                                    ><template v-slot:item="{ item }">
                                       {{ $t(item.text) }}
                                     </template>
                                      <template v-slot:append>
                                        <v-icon>mdi-chevron-down</v-icon>
                                      </template>

                                      <template v-slot:selection="{ item }">
                                        {{ $t(item.text) }}
                                      </template>
                                    </v-select>
                                  </validation-provider>
                                </v-col>
                              </v-row>
                              <v-row v-else class="justify-space-between">
                                <v-col>
                                  <!-- Ten nhan vien -->
                                  <validation-provider
                                    v-slot="{ errors }"
                                    name="fullName"
                                    :rules="fullNameRuler"
                                  >
                                    <label class="text-uppercase text--body-1">
                                      {{ $t('users.fullName') }}
                                      <span class="color-require">*</span>
                                    </label>
                                    <v-text-field
                                      v-model="formdata.fullName"
                                      dense
                                      outlined
                                      maxlength="255"
                                      :placeholder="$t('create-user.fullName')"
                                      flat
                                      solo
                                      :error-messages="errors"
                                      required
                                      class="text--body-1"
                                      @change="
                                        formdata.fullName = trimSpace(
                                          formdata.fullName
                                        )
                                      "
                                    />
                                  </validation-provider>
                                </v-col>
                              </v-row>
                              <v-row class="mt-1 d-flex justify-space-between">
                                <v-col
                                  v-if="showUserName"
                                  md="5"
                                  cols="12"
                                  class="py-0"
                                >
                                  <!-- Ten dang nhap -->
                                  <validation-provider
                                    v-slot="{ errors }"
                                    name="userName"
                                    :rules="userNameInput"
                                  >
                                    <label class="text-uppercase text--body-1">
                                      {{ $t('username') }}
                                      <span class="color-require">*</span>
                                    </label>
                                    <v-text-field
                                      v-model="formdata.userName"
                                      disabled
                                      dense
                                      outlined
                                      maxlength="255"
                                      :placeholder="$t('create-user.userName')"
                                      flat
                                      solo
                                      :error-messages="errors"
                                      required
                                      class="text--body-1"
                                      @change="
                                        formdata.userName = trimSpace(
                                          formdata.userName
                                        )
                                      "
                                    /> </validation-provider></v-col>
                                <v-col v-else md="5">
                                  <!-- trang thai -->
                                  <validation-provider>
                                    <label class="text-uppercase text--body-1">
                                      {{ $t('users.status') }}</label>
                                    <v-select
                                      v-model="formdata.activeType"
                                      outlined
                                      dense
                                      :menu-props="{
                                        bottom: true,
                                        offsetY: true
                                      }"
                                      flat
                                      solo
                                      item-value="value"
                                      class="text--body-1"
                                      :items="statusItems"
                                    >
                                      <template v-slot:item="{ item }">
                                        {{ $t(item.text) }}
                                      </template>
                                      <template v-slot:append>
                                        <v-icon>mdi-chevron-down</v-icon>
                                      </template>
                                      <template v-slot:selection="{ item }">
                                        {{ $t(item.text) }}
                                      </template>
                                    </v-select>
                                  </validation-provider>
                                </v-col>
                                <v-col md="5" cols="12">
                                  <!-- email -->
                                  <validation-provider
                                    v-slot="{ errors }"
                                    name="Email"
                                    :rules="ruleEmail"
                                  >
                                    <label class="text-uppercase text--body-1">
                                      Email
                                      <span
                                        class="color-require"
                                      >*</span></label>
                                    <v-text-field
                                      v-model="formdata.email"
                                      dense
                                      maxlength="255"
                                      outlined
                                      :disabled="!showUserName"
                                      :placeholder="$t('create-user.email')"
                                      flat
                                      solo
                                      :error-messages="errors"
                                      required
                                      class="text--body-1"
                                      @change="
                                        formdata.email = trimSpace(
                                          formdata.email
                                        )
                                      "
                                    /> </validation-provider></v-col>
                              </v-row>
                              <v-row class="mt-1 d-flex justify-space-between">
                                <v-col md="5" cols="12" class="py-0">
                                  <!-- Di dong -->
                                  <validation-provider
                                    v-slot="{ errors }"
                                    name="mobile"
                                    rules="max:15"
                                  >
                                    <label class="text-uppercase text--body-1">
                                      {{ $t('users.mobile') }}</label>
                                    <v-text-field
                                      v-model="formdata.phone"
                                      dense
                                      maxlength="15"
                                      outlined
                                      :placeholder="$t('create-user.mobile')"
                                      flat
                                      solo
                                      :error-messages="errors"
                                      oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
                                      class="text--body-1"
                                      @change="
                                        formdata.phone = trimSpace(
                                          formdata.phone
                                        )
                                      "
                                    /> </validation-provider></v-col>
                                <v-col md="5" cols="12" class="py-0">
                                  <!-- Ngon ngu -->
                                  <validation-provider>
                                    <label class="text-uppercase text--body-1">
                                      {{ $t('users.language') }}
                                    </label>
                                    <v-select
                                      v-model="formdata.language"
                                      outlined
                                      dense
                                      :menu-props="{
                                        bottom: true,
                                        offsetY: true
                                      }"
                                      attach
                                      flat
                                      solo
                                      item-value="value"
                                      class="text--body-1"
                                      :items="languageItems"
                                      :placeholder="$t('users.language')"
                                    >
                                      <template v-slot:append>
                                        <v-icon>mdi-chevron-down</v-icon>
                                      </template>
                                      <template v-slot:item="{ item }">
                                        {{ $t(item.text) }}
                                      </template>
                                      <template v-slot:selection="{ item }">
                                        {{ $t(item.text) }}
                                      </template>
                                    </v-select></validation-provider></v-col>
                              </v-row>
                              <v-row class="mt-1 d-flex justify-space-between">
                                <v-col md="5" cols="12" class="py-0">
                                  <!-- Ngay sinh -->

                                  <label class="text-uppercase text--body-1">
                                    {{ $t('users.dateOfBirth') }}</label>
                                  <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    attach
                                    max-width="290px"
                                    min-width="auto"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <validation-provider
                                        v-slot="{ errors }"
                                        name="dateOfBirth"
                                        :rules="ruleDate"
                                      >
                                        <v-text-field
                                          v-model="dateOfBirth"
                                          outlined
                                          placeholder="DD/MM/YYYY"
                                          dense
                                          v-bind="attrs"
                                          :error-messages="errors"
                                          class="text--body-1"
                                          v-on="on"
                                        />
                                      </validation-provider>
                                    </template>
                                    <v-date-picker
                                      v-model="date"
                                      format="DD/MM/YYYY"
                                      no-title
                                      :max="toDate"
                                      show-adjacent-months
                                      @input="menu = false"
                                    /> </v-menu></v-col>
                                <v-col md="5" cols="12" class="py-0">
                                  <!-- Gioi tinh -->
                                  <validation-provider>
                                    <label class="text-uppercase text--body-1">
                                      {{ $t('users.gender') }}</label>
                                    <v-select
                                      v-model="formdata.gender"
                                      outlined
                                      dense
                                      :menu-props="{
                                        bottom: true,
                                        offsetY: true
                                      }"
                                      flat
                                      solo
                                      attach
                                      item-value="value"
                                      :items="genderItems"
                                      class="text--body-1"
                                      :placeholder="$t('create-user.gender')"
                                    >
                                      <template v-slot:append>
                                        <v-icon>mdi-chevron-down</v-icon>
                                      </template>

                                      <template v-slot:item="{ item }">
                                        {{ $t(item.text) }}
                                      </template>
                                      <template v-slot:selection="{ item }">
                                        {{ $t(item.text) }}
                                      </template>
                                    </v-select></validation-provider></v-col>
                              </v-row>
                              <v-row class="mt-1 d-flex justify-space-between">
                                <v-col class="py-0">
                                  <!-- Dia chi lien he -->
                                  <validation-provider
                                    v-slot="{ errors }"
                                    name="address"
                                    rules="max:500"
                                  >
                                    <label class="text-uppercase text--body-1">
                                      {{ $t('users.address') }}</label>
                                    <v-text-field
                                      v-model="formdata.address"
                                      :error-messages="errors"
                                      dense
                                      maxlength="500"
                                      outlined
                                      :placeholder="$t('create-user.address')"
                                      flat
                                      solo
                                      class="text--body-1"
                                      @change="
                                        formdata.address = trimSpace(
                                          formdata.address
                                        )
                                      "
                                    /> </validation-provider></v-col>
                              </v-row>
                            </div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <div>
                              <!-- Vai tro nguoi dung -->
                              <v-row class="justify-space-between">
                                <div class="col-12 py-0">
                                  <h6
                                    color="primary"
                                    class="primary--text text-uppercase"
                                  >
                                    {{ $t('users.userRole') }}
                                  </h6>
                                </div>
                              </v-row>
                            </div>
                          </v-col>
                          <v-col md="4" />
                        </v-row>
                        <v-row>
                          <v-col md="12">
                            <validation-observer ref="observerRole">
                              <create-role-user
                                :parents="parents"
                                :formdata="formdata"
                                :role-items="roleItems"
                                :position-items="positionItems"
                                :is-update="true"
                                @user-external="userExternalChange"
                                @on-change-roles="onChangeRole"
                              />
                            </validation-observer>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-row>
                  </v-container>
                </form>
              </validation-observer>
            </div>
          </v-layout>
          <div class="pa-5 form-group group-actions">
            <v-divider class="mb-6" />
            <div class="container">
              <v-row class="d-flex justify-sm-space-between justify-md-end">
                <v-btn
                  color="#FF4A55"
                  class="w-150 py-5 mx-0 mx-md-5 text--button"
                  outlined
                  rounded
                  @click.stop="dialog = true"
                >{{ $t('cancelLabel') }}</v-btn>
                <v-btn
                  color="primary"
                  class="w-150 py-5 text--button"
                  rounded
                  @click.stop="checkValidate()"
                >{{ $t('saveLabel') }}</v-btn>
              </v-row>
            </div>
          </div>
        </v-card>
      </v-container>
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

      <!-- dialog cancel -->
      <v-dialog v-model="dialog" persistent max-width="680">
        <v-card>
          <v-card-title class="d-flex justify-end">
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="d-flex justify-center title-dialog">
            <h5>{{ $t('title.cancel') }}</h5>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-around">
            <v-btn
              rounded
              class="w-150 btn-cancel py-5 text--button"
              color="#0FAFE4"
              elevation="1"
              outlined
              @click="dialog = false"
            >
              {{ $t('close') }}
            </v-btn>
            <v-btn
              rounded
              class="w-150 py-5 text--button"
              color="primary"
              :to="userRouterPath"
            >
              {{ $t('accept') }}
            </v-btn>
          </v-card-actions>
          <v-card-actions />
        </v-card>
      </v-dialog>
      <!-- dialog save -->
      <v-dialog v-model="dialogSave" persistent max-width="680">
        <v-card>
          <v-card-title class="d-flex justify-center">
            <h5>
              {{ $t('title.edit') }}
            </h5>

            <v-icon
              class="close-dialog"
              @click="dialogSave = false"
            >mdi-close</v-icon>
          </v-card-title>
          <v-card-actions class="d-flex justify-space-around py-8">
            <v-btn
              rounded
              class="w-150 btn-cancel py-5 text--button"
              color="#0FAFE4"
              elevation="1"
              outlined
              @click="dialogSave = false"
            >
              {{ $t('cancelLabel') }}
            </v-btn>
            <v-btn
              class="w-150 py-5 text--button"
              rounded
              color="primary"
              @click.prevent="editUser"
              @click="dialogSave = false"
            >
              {{ $t('accept') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <dialog-change-password
        :show-dialog="showChangePassword"
        @close-dialog="showChangePassword = false"
      />
    </v-sheet>
  </div>
</template>

<script>
import CreateRoleUser from '../component/CreateRoleUser'
import { GroupService } from '@/services/groupService'
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import { UsersService } from '@/services/usersService'
import { RoleService } from '@/services/roleService'
import moment from 'moment'
import alertMixin from '@/mixins/alert'
import { mapActions } from 'vuex'
import constants from '@/constants'
import rules from '@/mixins/rules'
import DialogChangePassword from '@/views/user/component/DialogChangePassword'
import Avatar from '../component/Avatar'
import checkRoles from '@/mixins/checkRoles'
import commonRoute from '@/router/routePaths'
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

  userRoles: [
    {
      groupId: '', // Id phong ban/ don vi
      groupType: null, // Type cua phong ban/ don vi
      roleId: '', // Vai tro
      roleType: constants.USER_ROLE.MAIN, // Loai vai tro
      positionId: null // Chuc danh
    }
  ],
  avatar: '' // Anh dai dien
}
export default {
  components: {
    Breadcrumbs,
    CreateRoleUser,
    DialogChangePassword,
    Avatar
  },
  mixins: [alertMixin, rules, checkRoles],
  data() {
    return {
      userRouterPath: `${commonRoute.USER_PATH}`,
      parents: [],
      userId: null,
      color: '',
      dialog: false,
      dialogSave: false,
      isShowAlert: false,
      message: '',
      loading: false,
      menu: false,
      show: false,
      toDate: moment().format('YYYY-MM-DD'),
      date: moment().format('YYYY-MM-DD') + 1,
      formdata: {
        ...initGroup
      },
      dateOfBirth: '',
      roleItems: [],
      positionItems: [],
      genderItems: [
        { text: 'users.male', value: constants.GENDER.MALE },
        { text: 'users.female', value: constants.GENDER.FEMALE }
      ],
      languageItems: [
        { text: 'language.vietnamese', value: 'VI' },
        { text: 'language.english', value: 'EN' }
      ],
      breadcrumbs: [
        {
          text: 'users.user',
          disabled: false,
          href: `${commonRoute.USER_PATH}`
        },
        { text: 'users.update', disabled: true, href: '' }
      ],
      statusItems: [
        { text: 'status.active', value: constants.ACTIVE_TYPE.UN_LOCK },
        { text: 'status.inactive', value: constants.ACTIVE_TYPE.LOCK }
      ],
      showChangePassword: false,
      isNotAdmin: null
    }
  },
  computed: {
    showUserName() {
      var show = true
      if (this.formdata && this.formdata.userRoles.length > 0) {
        this.formdata.userRoles.map(role => {
          if (role.groupType === constants.GROUPS.EXTERNAL) {
            show = false
          }
        })
      }
      return show
    }
  },
  watch: {
    dateOfBirth() {
      if (moment(this.dateOfBirth, 'DD/MM/YYYY', true).isValid()) {
        this.date = moment(this.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD')
      }
    },
    date(val) {
      this.dateOfBirth = this.formatDate(this.date)
      this.formdata.dateOfBirth = this.dateOfBirth
    },
    formdata() {
      if (this.formdata && this.formdata.dateOfBirth) {
        this.dateOfBirth = this.formatDate(this.formdata.dateOfBirth)
        this.formdata.dateOfBirth = this.dateOfBirth
      }
      this.searchGroup()
    },
    menu() {
      if (this.menu && this.formdata.dateOfBirth) {
        this.date = moment(this.formdata.dateOfBirth, 'DD/MM/YYYY').format(
          'YYYY-MM-DD'
        )
      }
    }
  },
  async created() {
    this.hasPermission([constants.USER_ROLE.ROLE_ADMIN])
    this.userId = this.$route.params.userId
    await this.getInfo(this.userId)
    await this.getlistRole()
    await this.getlistPosition()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    // function format date input
    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },

    // function commit data 2 component
    onChangeRole(roles) {
      this.formdata.userRoles = roles
    },
    // check validate form
    async checkValidate() {
      // Validate form
      this.$refs.observer.validate().then(valid => {
        if (valid) {
          this.dialogSave = true
        }
      })
    },
    // api danh sach vai tro
    async getlistRole() {
      try {
        const response = await RoleService.getList()
        this.roleItems = response.data
        const userRoleId = this.formdata.userRoleId
        const mainRole = this.roleItems.find(
          role => +role.roleId === +userRoleId
        )
        this.isNotAdmin = mainRole.roleCode !== constants.USER_ROLE.ROLE_ADMIN
        if (this.isNotAdmin) {
          this.roleItems = this.roleItems.filter(
            role => role.roleCode !== constants.USER_ROLE.ROLE_ADMIN
          )
        }
      } catch (error) {
        console.log(error)
      }
    },
    // api danh sach chuc danh
    async getlistPosition() {
      try {
        const response = await UsersService.getListPosition()
        this.positionItems = response.data
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
    trimSpace(val) {
      const value = val ? val.trim() : ''
      return value
    },

    // API getinfo user
    async getInfo(id) {
      try {
        const response = await UsersService.getUserInfo(id)
        this.formdata = response.data
      } catch (error) {
        console.log('error')
      }
    },
    userExternalChange(type) {},
    // function call API post create user
    async editUser() {
      try {
        this.loading = true
        delete this.formdata.status
        const response = await UsersService.updateUser(
          this.userId,
          this.formdata
        )
        this.loading = false
        if (response.data.status === 200) {
          this.setNotify({
            show: true,
            type: this.typeAlerts.SUCCESS,
            content: response.data.message
          })
          this.$router.push(`${commonRoute.USER_PATH}`).catch(() => {})
        } else {
          this.setNotify({
            show: true,
            type: this.typeAlerts.ERROR,
            content: response.message
          })
        }
      } catch (error) {
        this.isShowAlert = true
        this.message = error.message
        this.typeAlert = this.typeAlerts.ERROR
        this.loading = false
      }
    }
  }
}
</script>
