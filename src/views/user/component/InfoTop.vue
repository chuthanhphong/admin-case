<template>
  <div class="d-flex align-center justify-space-around">
    <div class=" d-flex align-center flex-column flex-md-row">
      <div class="avatar mr-md-8 mr-0">
        <!-- Anh dai dien -->
        <v-avatar
          v-model="previewAvatar"
          color="primary"
          class="imagePreviewWrapper"
          size="190"
          :style="{
            'background-image': `url(${previewAvatar})`
          }"
        />
        <!-- Xoa anh dai dien -->
        <v-avatar
          v-if="!previewAvatar"
          class="small-circle bg-avatar"
          color="#ffffff50"
          size="50"
        />
        <v-avatar
          v-if="!previewAvatar"
          class="big-circle bg-avatar"
          color="#ffffff50"
          size="100"
        />
        <div>
          <v-btn
            v-if="avatar || previewAvatar"
            small
            icon
            outlined
            class="update-avatar"
            @click="accept"
          ><v-icon class="remove-avatar" size="20">mdi-close</v-icon></v-btn>
          <v-file-input
            id="avatar"
            ref="refAvatar"
            v-model="avatar"
            class="d-none"
            accept="image/*"
            @change="onChangeImageProfile"
          />
        </div>
      </div>
      <div class="ml-md-8 ml-0">
        <div class="mb-6">
          <h4 class="info-fullName text-capitalize">{{ userInfo.fullName }}</h4>
          <div class="primary--text">{{ userInfo.groupPathName }}</div>
        </div>
        <v-btn
          color="primary"
          rounded
          class="btn-upload-avatar text--button"
          @click="uploaImagSign('avatar')"
        >{{ $t('users.uploadAvatar') }}</v-btn>
        <v-btn
          color="primary"
          class="btn-upload-avatar w-150 mx-4 text--button"
          rounded
          @click="showChangePassword"
        >{{ $t('changePassword') }}</v-btn>
        <v-btn
          color="primary"
          class="btn-upload-avatar w-150 text--button"
          rounded
          @click="logout"
        >{{ $t('logout') }}</v-btn>
      </div>
    </div>

    <dialog-confirm
      :show-dialog="showDialog"
      :title-confirm="$t('users.dialog.removeAvatar')"
      @close-dialog="showDialog = false"
      @accept="deleteImage"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { UsersService } from '@/services/usersService'
import { FileService } from '@/modules/econtract/services/fileService'
import constants from '@/constants'
import DialogConfirm from '@/views/components/DialogConfirm.vue'
import commonRoute from '@/router/routePaths'
export default {
  components: {
    DialogConfirm
  },
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    roles: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      previewAvatar: null,
      showDialog: false,
      avatar: null,
      userInfo: null
    }
  },
  computed: {},
  watch: {
    formdata() {
      if (this.formdata.avatar && this.formdata.avatar.filePath) {
        this.downloadImage(this.formdata.avatar)
      }
    }
  },
  async created() {
    this.initPage()
  },
  mounted() {},
  methods: {
    ...mapActions('layout', ['setNotify', 'setAvatar', 'setUserInfo']),
    showChangePassword() {
      this.$emit('show-change-password')
    },
    // load neu co anh
    initPage() {
      this.userInfo = JSON.parse(localStorage.getItem(constants.USER_INFO))
      setTimeout(() => {
        if (this.formdata.avatar.filePath) {
          this.downloadImage(this.formdata.avatar)
          this.avatar = this.formdata.avatar
        }
      }, 300)
    },
    accept() {
      this.showDialog = true
    },
    // Api xoa anh
    async deleteImage() {
      try {
        const userId = this.formdata.userId
        const response = await UsersService.deleteImageProfile(userId)
        if (response.success) {
          this.previewAvatar = ''
          this.avatar = null
          this.showDialog = false
          var message = 'users.messageSuccess.removeAvatarSuccess'
          const typeAlert = 'success'
          this.updateAvatarHeader('')
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message)
          })
        }
      } catch (error) {
        this.showError(error.message)
      }
    },
    showError(msg) {
      const message = msg
      const typeAlert = 'error'
      this.setNotify({
        show: true,
        type: typeAlert,
        content: message
      })
    },
    logout() {
      this.setAvatar('')
      const loginType = localStorage.getItem(constants.LOGIN_TYPE) || 'IN'
      var url = loginType === 'IN' ? commonRoute.LOGIN_PATH : commonRoute.LOGIN_AGENT_PATH
      localStorage.clear()
      this.$router.push(url).catch(() => {})
    },
    // Api tai anh
    async downloadImage(response, refreshUserAvatar = false) {
      try {
        const dataImgAvatar = await FileService.downloadImage({
          filePath: response.filePath,
          storage: response.storage
        })
        if (refreshUserAvatar) {
          this.updateAvatarHeader(dataImgAvatar, response)
        }

        this.previewAvatar = dataImgAvatar
      } catch (error) {
        this.showError(error.message)
      }
    },

    // Api upload anh
    async uploadingImage({ file }) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('userId', this.formdata.userId)
        formData.append('fileType', constants.FILE_TYPES.FILE_IMAGE_AVATAR)
        const response = await UsersService.uploadImageProfile(formData)
        if (response.success) {
          this.downloadImage(response.data, true)
          var message = 'users.messageSuccess.uploadAvatar'
          const typeAlert = 'success'
          this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message)
          })
        }
      } catch (error) {
        this.avatar = null
        this.showError(error.message)
      }
    },
    updateAvatarHeader(dataImg, avatar) {
      const userProfile = JSON.parse(localStorage.getItem(constants.USER_INFO))
      if (userProfile.userId === this.formdata.userId) {
        // Xoa avatar local
        if (dataImg === '') {
          userProfile.avatar = ''
        } else {
          // cap nhat lai avatar local
          userProfile.avatar = avatar
        }
        localStorage.setItem(constants.USER_INFO, JSON.stringify(userProfile))
        localStorage.setItem(constants.AVATAR, dataImg)
        this.setAvatar(dataImg)
      } else {
        this.formdata.avatar = avatar
      }
    },
    // validate size anh
    validateSize(size) {
      const sizeLimit = 15 * 1024 * 1024
      return size < sizeLimit
    },
    // upload anh
    uploaImagSign(typeImg) {
      document.getElementById(typeImg).click()
    },
    // chon anh
    async onChangeImageProfile(file) {
      if (file) {
        var isError = false
        const typeImage = ['image/jpg', 'image/jpeg', 'image/png']
        if (!typeImage.includes(file.type)) {
          this.showError('users.requireType')
          isError = true
        }
        // Validate size anh
        if (!this.validateSize(file.size)) {
          this.showError('contract.imgeMaxSize')
          isError = true
        }
        if (isError) {
          document.getElementById('avatar').value = null
          this.avatar = null
          return
        }
        // Upload file
        await this.uploadingImage({ file })
      } else {
        this.previewAvatar = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-avatar {
  position: absolute;
  bottom: -30px;
  right: 0;
  &.small-circle {
    right: 70px;
  }
}
.update-avatar {
  position: absolute;
  bottom: 10px;
  right: 20px;
  .remove-avatar {
    background: #fff;
    border-radius: 50%;
    padding: 15px;
    border: 1px solid #8e8ea1;
  }
}
.imagePreviewWrapper {
  display: block;
  border: 1px solid;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
