<template>
  <interact
    v-if="showSignature"
    :id="id"
    :drag-option="dragOption"
    :resize-option="resizeOption"
    :style="style"
    :resizable="type == 'textbox'"
    draggable
    class="resize-drag sign-item-added"
    @dragmove="dragmove"
    @resizemove="resizemove"
  >
    <div>
      <v-tooltip v-if="canCloneSignature" top content-class="tooltip-top">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            x-small
            class="sign-action-copy sign-action"
            @click="editSignature(id)"
          >
            <img
              src="@/assets/icons/ic_sign_copy.png"
              alt="ic_sign_delete"
              v-bind="attrs"
              v-on="on"
            >
          </v-btn>
        </template>
        <span>{{ $t('document.tooltip.configSignature') }}</span>
      </v-tooltip>

      <v-tooltip v-model="showToolTip" top content-class="tooltip-top">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            x-small
            class="sign-action-remove sign-action"
            @click="removeItem(id)"
          >
            <img
              src="@/assets/icons/ic_sign_delete.png"
              alt="ic_sign_delete"
              v-bind="attrs"
              v-on="on"
            >
          </v-btn>
        </template>
        <span>{{ $t('document.tooltip.removeSignature') }}</span>
      </v-tooltip>

      <div class="text-sign">
        <div class="text-capitalize">
          <i class="v-icon mdi" :class="iconTitle" />
          <span>{{ $t('electronicSign.footSign') }}</span>
        </div>
        <div v-if="signer.signUserId" class="note-sign">
          <span>{{ signer.fullName }} ({{ signer.signUserName }})</span>
        </div>
        <div v-if="signer.signUserId" class="caption text--secondary mw-300">
          <span>{{ signer.positionName }} - {{ signer.groupCode }}</span>
        </div>
        <div v-else class="note-sign">
          <span>{{ signer.positionName }} ({{ signer.groupCode }})</span>
        </div>
      </div>
    </div>
  </interact>
</template>

<script>
import interact from 'interactjs'
import constants from '@/constants'
export default {
  name: 'TypeSignature',
  props: {
    type: { type: String, default: 'textbox' },
    id: { type: String, default: 'id-item-sign' },
    w: { type: Number, default: 200 },
    h: { type: Number, default: 200 },
    signer: { type: Object, default: undefined },
    itemIndex: { type: Number, default: -1 },
    fileName: { type: String, default: '' } // fileName document.
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
      },
      showEdit: false
    }
  },
  computed: {
    style() {
      return {
        transform: `translate(${this.signer.x}px, ${this.signer.y}px)`
      }
    },
    iconTitle() {
      return this.signer.signType === constants.SIGN_TYPES.IMAGE
        ? 'ic-pentool'
        : 'mdi-pencil-lock'
    },
    canCloneSignature() {
      return this.signer.signType === constants.SIGN_TYPES.IMAGE
    },
    // Hien thi chan ky voi file ky tuong ung.
    // check theo ten file pdf.
    showSignature() {
      return this.fileName === this.signer.fileName
    }
  },

  methods: {
    dragmove(event) {
      this.signer.x += +event.dx.toFixed(0)
      this.signer.y += +event.dy.toFixed(0)
      if (this.signer.x < 15) {
        this.signer.x = 15
      }
      if (this.signer.x > 656) {
        this.signer.x = 656
      }
      if (this.signer.y > -150) {
        this.signer.y = -150
      }
    },
    resizemove(event) {
      this.w = event.rect.width <= 100 ? 100 : event.rect.width
      this.h = event.rect.height <= 60 ? 60 : event.rect.height

      this.signer.x += event.deltaRect.left
      this.signer.y += event.deltaRect.top
    },
    removeItem(id) {
      this.showToolTip = false
      this.removeItemSign(id)
    }
  }
}
</script>

<style lang="scss">
.sign-action {
  position: absolute;
  top: -10px;
  right: -9px;
  background: white;
  cursor: pointer;
}
.sign-action-copy {
  right: 20px;
}
.text-sign i {
  position: absolute !important;
  left: 15px;
  top: 10px;
}
</style>
