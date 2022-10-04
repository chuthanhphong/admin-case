<template>
  <div v-if="showSignature" :style="zoom" @click="selectImage">
    <interact
      :id="id"
      :drag-option="dragOption"
      :resize-option="resizeOption"
      :style="style"
      :resizable="type == 'textbox'"
      :draggable="false"
      :class="(dataImgSign && 'sign-item-img') || 'sign-item-added'"
    >
      <div v-if="dataImgSign" class="signature-preview">
        <img :src="dataImgSign" alt="img-sign">

        <i v-if="signer.signType == 'CA'" class="icon-pentool icon-ca active" />
      </div>
      <div v-else class="text-sign">
        <div class="text-capitalize wrap-text-sign">
          <i class="v-icon mdi" :class="iconTitle" />
          <span class="text-footSign">{{ $t('electronicSign.footSign') }}</span>
        </div>
        <div v-if="checkShow" class="note-sign">
          <span>{{ signer.fullName }} ({{ signer.signUserName }})</span>
        </div>
        <div v-else class="note-sign">
          <span>{{ signer.positionName }} ({{ signer.signGroupCode }})</span>
        </div>
      </div>
    </interact>
  </div>
</template>

<script>
import interact from 'interactjs'
import constants from '@/constants'
export default {
  props: {
    type: { type: String, default: 'textbox' },
    id: { type: String, default: 'id-item-sign' },
    w: { type: Number, default: 200 },
    h: { type: Number, default: 200 },
    signer: { type: Object, default: null },
    itemIndex: { type: Number, default: -1 },
    zoom: { type: String, default: 'zoom: 1' },
    dataImgSign: { type: String, default: null },
    fileDocId: { type: Number, default: 0 }, // fileName document.
    showFullname: { type: Boolean, default: false }
  },
  data() {
    return {
      showToolTip: false,
      resizeOption: {
        edges: { left: true, right: true, bottom: true, top: true }
      },
      dragOption: {
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: false
          })
        ]
      },
      dropzoneOption: {
        accept: '.pdf-app'
      }
    }
  },
  computed: {
    style() {
      return {
        transform: `translate(${this.signer.axisX}px, ${this.signer.axisY}px)`
      }
    },
    titleItem() {
      return this.signer.signType === constants.SIGN_TYPES.IMAGE
        ? 'users.photoSignature'
        : 'users.digitalSignatures'
    },
    iconTitle() {
      return 'ic-pentool'
    },
    showSignature() {
      return this.fileDocId === this.signer.filesAttachmentId
    },
    checkShow() {
      return this.signer.signUserId
    }
  },

  methods: {
    selectImage() {
      this.onSelectSignature(
        this.signer.id,
        this.signer.filesAttachmentId,
        this.signer.signMethod
      )
    },
    getClassItemSign() {
      if (this.dataImgSign && this.showFullname) {
        return 'has-signature has-show-fullName'
      }
      if (this.dataImgSign) return 'has-signature'
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.signature-preview {
  position: relative;
}
.icon-pentool {
  position: absolute;
  left: -5px;
  top: -5px;
  border-radius: 5px 0 0 0;
  &.active {
    background-color: #0fafe4;
  }
}
.sign-item-added {
  background: #fffbdc;
  border-radius: 8px;
  border: 1px solid #0fafe4;
  padding: 10px 5px;
  width: 160px;
  position: absolute;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  @media screen and (max-width: 1440px) {
    width: 152px;
  }

  i {
    color: #7b8794;
  }
}

.sign-item-img {
  background: #fffbdc;
  border-radius: 8px;
  border: 1px solid #0fafe4;
  padding: 5px;
  width: 160px;
  position: absolute;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);

  i {
    color: #7b8794;
  }
}

.img-sign {
  max-height: 100px;
  max-width: 150px;
}

.img-sign-no-name {
  max-height: 68px;
}

.note-sign {
  border-top: 1px solid #7b8794;
  margin-left: 5px;
  margin-right: 5px;
  padding-top: 5px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.2px;
  color: #22242c;
}

.wrap-text-sign {
  margin-top: 5px;
  margin-bottom: 13px;
  .text-footSign {
    font-weight: 600;
    font-size: 18px;
    line-height: 23px;
    color: #22242c;
  }
}

.text-sign i {
  position: absolute !important;
  left: 10px;
  top: 16px;
}
</style>
