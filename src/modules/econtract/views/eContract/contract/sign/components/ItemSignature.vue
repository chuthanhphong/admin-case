<template>
  <div
    class="item-signature"
    :style="zoom"
    :class="`signature-${itemIndex}`"
    @click="selectImage"
  >
    <interact
      :id="id"
      :drag-option="dragOption"
      :resize-option="resizeOption"
      :style="style"
      :resizable="type == 'textbox'"
      :draggable="false"
      class="resize-drag sign-item-added"
      :class="signature.dataImgSign ? 'has-signature' : ''"
    >
      <div
        v-if="signature.dataImgSign"
        class="signature-preview"
        :style="`background: url(${signature.dataImgSign});`"
      >
        <i
          v-if="signature.signType == 'CA'"
          class="icon-pentool icon-ca active"
        />
        <!-- <img :src="signature.dataImgSign"> -->
      </div>
      <div v-else>
        <div class="text-sign">
          <div>
            <i class="icon-pentool active" />
            <!-- <span class="text-capitalize">{{ $t(titleItem) }}</span> -->
            <h6 class="text-capitalize">{{ $t('contract.signature') }}</h6>
          </div>
          <div class="note-sign text--label-2">
            {{ signature.name }}
          </div>
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
    zoom: { type: String, default: 'zoom: 1' },
    signature: { type: Object, default: undefined },
    itemIndex: { type: Number, default: -1 }
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
        // height: `${this.h}px`,
        // width: `${this.w}px`,
        transform: `translate(${this.signature.x}px, ${this.signature.y}px)`
      }
    },
    titleItem() {
      return this.signature.signType === constants.SIGN_TYPES.IMAGE
        ? 'users.photoSignature'
        : 'users.digitalSignatures'
    },
    iconTitle() {
      return this.signature.signType === constants.SIGN_TYPES.IMAGE
        ? 'mdi-fountain-pen-tip'
        : 'mdi-pencil-lock'
    }
  },

  methods: {
    selectImage() {
      this.onSelectSignature(this.signature.docNoteSignId)

      // if (this.signature.signType === constants.SIGN_TYPES.IMAGE) {
      //   this.onSelectSignature(this.signature.docNoteSignId)
      // } else {
      //   this.onSelecPinCA(this.signature.docNoteSignId)
      // }
    }
  }
}
</script>

<style lang="scss">
.signature-preview {
  background-repeat: no-repeat !important;
  background-size: 100% 100% !important;
  height: 100%;
}
.sign-item-added {
  &.has-signature {
    height: 80px;
    padding: 5px;
    img {
      max-height: 68px;
    }
  }
  i {
    color: #0fafe4;
  }
  .sign-item-remove {
    position: absolute !important;
    top: -5px;
    right: -5px;
    color: #ff5252 !important;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
  }
  .sign-item-more {
    position: absolute !important;
    top: -10px;
    right: -5px;
    color: #0fafe4 !important;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 1px solid #0fafe4;
  }
  .note-sign {
    border-top: 1px solid #0fafe4;
    margin-top: 5px;
    padding-top: 5px;
  }
  .wrap-edit-signer {
    &.active {
      display: block;
    }
    display: none;
    position: absolute;
    background: #252733;
    color: #fff;
    width: 100%;
    border-radius: 8px;
    top: 100%;
    left: 0;
    margin-top: 10px;
    padding: 5px 0;
    &::before {
      content: '';
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid #252733;
      position: absolute;
      top: -5px;
    }
    ul {
      padding: 0;
      list-style: none;
      width: 100%;
      li {
        margin-bottom: 10px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          color: #fff;
          font-size: 20px;
          margin-right: 10px;
        }
      }
    }
  }
}
.sign-action {
  position: absolute;
  top: -12px;
  right: -5px;
  background: white;
  cursor: pointer;
}
.sign-action-copy {
  right: 30px;
}
.text-sign i {
  position: absolute !important;
  left: 5px;
}
</style>
