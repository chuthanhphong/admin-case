<template>
  <interact
    :id="id"
    :drag-option="dragOption"
    :resize-option="resizeOption"
    :style="style"
    :resizable="type == 'textbox'"
    :draggable="signer.showActions"
    class="resize-drag sign-item-added"
    @dragmove="dragmove"
    @resizemove="resizemove"
  >
    <div class="">
      <v-tooltip v-if="canCloneSignature" top content-class="tooltip-top">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            x-small
            class="sign-action-copy sign-action"
            @click="editSignature(id)"
          >
            <i v-bind="attrs" class="icon-clone-signature" v-on="on" />
          </v-btn>
        </template>
        <span>{{ $t('contract.tooltip.configSignature') }}</span>
      </v-tooltip>

      <v-tooltip
        v-if="signer.showActions"
        v-model="showToolTip"
        top
        content-class="tooltip-top"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            x-small
            class="sign-action-remove sign-action"
          ><vue-feather
            type="x-circle"
            v-bind="attrs"
            size="22"
            class=""
            v-on="on"
            @click="removeItem(id)"
          /></v-btn>
        </template>
        <span>{{ $t('contract.tooltip.removeSignature') }}</span>
      </v-tooltip>

      <div class="text-sign">
        <div class="text-capitalize">
          <i class="icon-pentool active" />
          <!-- <i class="v-icon mdi" :class="iconTitle" /> -->
          <h5 class="text-capitalize">{{ $t('contract.signature') }}</h5>
        </div>
        <div class="note-sign">
          <span>{{ signer.name }}</span>
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
      },
      showEdit: false
    }
  },
  computed: {
    style() {
      return {
        // height: `${this.h}px`,
        // width: `${this.w}px`,
        transform: `translate(${this.signer.x}px, ${this.signer.y}px)`
      }
    },
    titleSignature() {
      return this.signer.signType === constants.SIGN_TYPES.IMAGE
        ? 'users.photoSignature'
        : 'users.digitalSignatures'
    },
    iconTitle() {
      return this.signer.signType === constants.SIGN_TYPES.IMAGE
        ? 'mdi-fountain-pen-tip'
        : 'mdi-pencil-lock'
    },
    canCloneSignature() {
      return (
        this.signer.signType === constants.SIGN_TYPES.IMAGE &&
        this.signer.showActions
      )
    }
  },

  methods: {
    dragmove(event) {
      this.signer.x += +event.dx.toFixed(0)
      if (this.signer.x <= 15) {
        this.signer.x = 15
      }
      if (this.signer.x >= 635) {
        this.signer.x = 635
      }
      this.signer.y += +event.dy.toFixed(0)
      if (this.signer.y >= -80) {
        this.signer.y = -80
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

<style lang="scss"></style>
