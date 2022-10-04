<template>
  <v-app>
    <dashboard-core-app-bar />
    <dashboard-core-view />
  </v-app>
</template>

<script>
export default {
  name: 'LayoutNoSideBar',

  components: {
    DashboardCoreAppBar: () => import('@/components/core/AppBar'),
    DashboardCoreView: () => import('@/components/core/View')
  }
}
</script>
