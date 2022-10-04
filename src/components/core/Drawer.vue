<template>
  <div>
    <v-btn fab icon class="btn-menu" @click="drawer = !drawer">
      <v-icon>mdi-menu-open</v-icon>
    </v-btn>
    <v-navigation-drawer
      id="core-navigation-drawer"
      v-model="drawer"
      :expand-on-hover="expandOnHover"
      disable-route-watcher
      :mini-variant="mini"
      app
      fixed
      :permanent="!temporary"
      v-bind="$attrs"
      mini-variant-width="78"
      absolute
      left
      width="260"
      :temporary="temporary"
    >
      <v-list dense nav height="60" class="header-logo">
        <v-list-item class="px-0" @click="mini = !mini">
          <v-list-item-avatar class="my-0 mr-0">
            <v-img contain src="@/assets/mdo-logo.svg" height="30" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="title-app">
              <b>MDO </b><span>-VĂN PHÒNG SỐ</span>
            </v-list-item-title>
          </v-list-item-content>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-menu-left</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
      <v-list expand nav>
        <template v-for="(item, i) in computedItems">
          <div :key="i" @click="checkReloadPage">
            <base-item-group
              v-if="item.children && showMenu(item)"
              :key="`group-${i}`"
              :item="item"
              :first="i === 0"
            />
            <base-item
              v-else
              v-show="showMenu(item)"
              :key="`item-${i}`"
              :item="item"
              :first="i === 0"
            />
          </div>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
// Utilities
import { mapState, mapActions } from 'vuex'
import constants from '@/constants'
import baseMenu from '@/components/menu/base-menu'
export default {
  name: 'DashboardCoreDrawer',
  props: {
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    expand: true,
    mini: false,
    countRefresh: 0,
    items: [...baseMenu],
    temporary: false
  }),

  computed: {
    ...mapState('layout', ['barColor', 'barImage', 'userInfo']),
    drawer: {
      get() {
        return this.$store.state.layout.drawer
      },
      set(val) {
        this.setDrawer(val)
      }
    },
    computedItems() {
      return this.items.map(item => {
        item.enable = item.moduleRoles && item.moduleRoles.length > 0 && item.moduleRoles.every(item => this.userInfo.modules.includes(item))
        return item
      }).map(this.mapItem)
    },
    profile() {
      return {
        avatar: true,
        title: 'Profile'
      }
    }
  },

  watch: {
    mini() {
      this.setRefreshChart(this.countRefresh++)
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.getDimensions)
  },
  created() {
    this.getDimensions()
    window.addEventListener('resize', this.getDimensions)
    const user = JSON.parse(localStorage.getItem(constants.USER_INFO))
    if (user) {
      this.userName = user.fullName
      this.setUserInfo(user)
    }
  },
  methods: {
    ...mapActions('layout', ['setDrawer', 'setUserInfo', 'setRefreshChart']),
    getDimensions() {
      const width = document.documentElement.clientWidth
      if (width <= 1024) {
        this.temporary = true
      } else {
        this.temporary = false
      }
    },
    showMenu(item) {
      const roles = item.role
      const ignoreRole = item.ignoreRole
      var show = false
      if (ignoreRole && this.userInfo.roles.length <= 1) {
        var isIgnore = false
        this.userInfo.roles.forEach(role => {
          if (ignoreRole.includes(role)) {
            isIgnore = true
          }
        })
        if (isIgnore) {
          return false
        }
      }

      if (roles === null) {
        return true
      }
      this.userInfo.roles.forEach(role => {
        if (roles.includes(role)) {
          show = true
        }
      })
      return show
    },
    mapItem(item) {
      return {
        ...item,
        children: item.enable && item.children && item.children.length > 0 ? item.children.filter(itemDetail => {
          if (itemDetail.ignoreRole && this.userInfo.roles.indexOf(itemDetail.ignoreRole) > -1) {
            return false
          }
          return true
        }).map(this.mapItem) : undefined,
        title: this.$t(item.title)
      }
    },
    checkReloadPage() {
      const isReload = localStorage.getItem('isReloadPage')
      if (isReload) {
        localStorage.removeItem('isReloadPage')
        window.location.reload()
      }
    }
  }
}
</script>
<style lang="scss">
.btn-menu {
  position: absolute;
  left: 0;
  top: 5px;
}
</style>
