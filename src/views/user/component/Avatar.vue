<template>
  <div class="d-flex align-center justify-space-around flex-column flex-md-row">
    <div class="avatar">
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
    <v-btn
      color="primary"
      rounded
      class="btn-upload-avatar mt-4 mt-md-0 text--button"
      :disabled="isDisabledUploadAvatar"
      @click="uploaImagSign('avatar')"
    >{{ $t('users.uploadAvatar') }}</v-btn>
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

export default {
  components: {
    DialogConfirm
  },
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    isDisabledUploadAvatar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      previewAvatar: null,
      showDialog: false,
      avatar: null
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
    // load neu co anh
    initPage() {
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
