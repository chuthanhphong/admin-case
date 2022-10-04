<template>
  <v-list-item
    :href="href"
    :rel="href && href !== '#' ? 'noopener' : undefined"
    :target="href && href !== '#' ? '_blank' : undefined"
    :to="item.to"
    :active-class="`active primary--text`"
    :disabled="!item.enable"
    class="justify-center item"
    @click.native="item.isReload ? console.log('sdfsdfsdf'): undefined"
  >
    <v-list-item-icon
      v-if="text"
      class="v-list-item__icon--text"
      v-text="computedText"
    />

    <v-list-item-icon v-else-if="item.icon">
      <v-tooltip right content-class="tooltip-right">
        <template v-slot:activator="{ on, attrs }">
          <i icon v-bind="attrs" class="icon-menu" :class="classIcon" v-on="on" />
        </template>
        <span v-text="item.title" />
      </v-tooltip>
    </v-list-item-icon>

    <v-list-item-content v-if="item.title || item.subtitle" class="pd-5">
      <v-list-item-title :class="classText" v-text="item.title" />
      <v-list-item-subtitle :class="classText" v-text="item.subtitle" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import Themeable from 'vuetify/lib/mixins/themeable'

export default {
  name: 'Item',

  mixins: [Themeable],

  props: {
    first: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({
        enable: true,
        order: undefined,
        href: undefined,
        icon: undefined,
        subtitle: undefined,
        title: undefined,
        to: undefined,
        isReload: undefined
      })
    },
    text: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    computedText() {
      if (!this.item || !this.item.title) return ''

      let text = ''

      this.item.title.split(' ').forEach(val => {
        text += val.substring(0, 1)
      })

      return text
    },
    href() {
      return this.item.href || (!this.item.to ? '#' : undefined)
    },
    classIcon() {
      return this.item && this.item.enable !== undefined && this.item.enable ? this.item.icon : `${this.item.icon}-disable`
    },
    classText() {
      var result = this.item && this.item.enable !== undefined && this.item.enable ? '' : `menu-text-disable`
      return result + (this.first ? 'first-home' : '')
    }
  }
}
</script>
