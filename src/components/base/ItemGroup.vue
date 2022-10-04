<template>
  <v-list-group
    :group="group"
    :sub-group="subGroup"
    :disabled="!item.enable"
    append-icon="mdi-menu-down"
    @click="onDashboard()"
  >
    <template v-slot:prependIcon>
      <v-tooltip right content-class="tooltip-right">
        <template v-slot:activator="{ on, attrs }">
          <i v-bind="attrs" class="icon-menu" :class="item.icon" v-on="on" />
        </template>
        <span v-text="item.title" />
      </v-tooltip>
    </template>
    <template v-slot:activator>
      <v-list-item-icon
        v-if="text"
        class="v-list-item__icon--text"
        v-text="computedText"
      />

      <v-list-item-avatar
        v-else-if="item.avatar"
        class="align-self-center"
        color="white"
        contain
      >
        <v-img
          src="https://demos.creative-tim.com/vuetify-material-dashboard/favicon.ico"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in children">
      <base-item-sub-group
        v-if="child.children"
        :key="`sub-group-${i}`"
        :item="child"
      />

      <base-item
        v-else
        v-show="showMenu(child.role)"
        :key="`item-${i}`"
        :item="child"
      />
    </template>
  </v-list-group>
</template>

<script>
// Utilities
import kebabCase from 'lodash/kebabCase'
import { mapState } from 'vuex'

export default {
  name: 'ItemGroup',

  inheritAttrs: false,

  props: {
    item: {
      type: Object,
      default: () => ({
        enable: false,
        isReload: false,
        href: undefined,
        avatar: undefined,
        group: undefined,
        title: undefined,
        children: []
      })
    },
    subGroup: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('layout', ['barColor', 'userInfo']),
    children() {
      return this.item.children.map((item) => ({
        ...item,
        to: item && item.to !== null && item.to !== undefined ? `${this.item.group}/${item.to}` : ""
        // to: !item.to ? "undefined" : `${this.item.group}/${item.to}`
      }))
    },
    computedText() {
      if (!this.item || !this.item.title) return ''

      let text = ''

      this.item.title.split(' ').forEach((val) => {
        text += val.substring(0, 1)
      })

      return text
    },
    group() {
      return this.genGroup(this.item.children)
    }
  },

  methods: {
    showMenu(roles) {
      var show = false
      if (!roles) {
        return true
      }
      this.userInfo.roles.forEach((role) => {
        if (roles.includes(role)) {
          show = true
          return
        }
      })
      return show
    },
    genGroup(children) {
      return children
        .filter((item) => item && item.to !== null && item.to !== undefined)
        .map((item) => {
          const parent = item.group || this.item.group
          let group = `${parent}/${kebabCase(item.to)}`

          if (item.children) {
            group = `${group}|${this.genGroup(item.children)}`
          }

          return group
        })
        .join('|')
    },

    onDashboard() {
      if (this.item.href) {
        if (this.$route.path !== this.item.href) {
          this.$router.push(this.item.href)
        }
      }
    },
  }
}
</script>

<style>
.v-list-group__activator p {
  margin-bottom: 0;
}
</style>
