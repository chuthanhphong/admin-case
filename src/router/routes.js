import Vue from 'vue'
import Router from 'vue-router'
import constants from '@/constants'
import layout from '@/views/layout/default'
import { routeCommon } from './routeCommon'
import routePathsCommon from './routePaths'
import routeNames from './routeNames'
import Group from '@/views/group/Group'
import CreateGroup from '@/views/group/create/CreateGroup'
import UpdateGroup from '@/views/group/update/UpdateGroup'
import User from '@/views/user/User'
import CreateUser from '@/views/user/create/CreateUser'
import InfoUser from '@/views/user/component/InfoUser'
import UpdateUser from '@/views/user/update/UpdateUser'
import { routeDigitation } from '@/modules/econtract/router/routeDigitation'
import { routeEcontract } from '@/modules/econtract/router/routeEcontract'
import { routeEtask } from '@/modules/etask/router/routeEtask'
import { routeTicket } from '@/modules/ticket/router/routeTicket'
import { routeBooking } from '@/modules/carbooking/router/routeBooking'
import { routeEDocument } from '@/modules/edocument/router/routeEdocument'
import { routeEsignature } from '@/modules/esignature/router/routeEsignature'
import { routeCalendar } from '@/modules/calendar/router/routeCalendar'
import Dashboard from '@/views/dashboard/Dashboard'
import notification from '@/views/notification'

Vue.use(Router);

const router = new Router({
  linkActiveClass: "is-active",
  mode: "history",
  routes: [
    ...routeCommon,
    {
      path: constants.ROOT_PATH,
      component: layout,
      children: [
        // NOTIFI PAGE
        {
          name: routeNames.NOTIFICATION,
          path: routePathsCommon.NOTIFICATION_PATH,
          component: notification
        },
        // home page
        {
          name: routeNames.DASHBOARD_HOME,
          path: routePathsCommon.DASHBOARD_HOME_PATH,
          component: Dashboard
        },
        // Danh sach don vi
        {
          path: routePathsCommon.GROUP_PATH,
          name: routeNames.GROUP,
          component: Group,
        },
        // Them moi don vi
        {
          path: routePathsCommon.GROUP_CREATE_PATH,
          name: routeNames.GROUP_CREATE,
          component: CreateGroup,
        },
        // Sua moi don vi
        {
          path: routePathsCommon.GROUP_UPDATE_PATH,
          name: routeNames.GROUP_UPDATE,
          component: UpdateGroup,
        },
        // Danh sach user
        {
          path: routePathsCommon.USER_PATH,
          name: routeNames.USERS,
          component: User,
        },
        // Them moi user
        {
          path: routePathsCommon.USER_CREATE_PATH,
          name: routeNames.USER_CREATE,
          component: CreateUser,
        },
        // Thong tin user
        {
          path: routePathsCommon.USER_INFO_PATH,
          name: routeNames.USER_INFO,
          component: InfoUser,
        },
        // Sua moi user
        {
          path: routePathsCommon.USER_UPDATE_PATH,
          name: routeNames.USER_UPDATE,
          component: UpdateUser,
        },
        ...routeEcontract,
        ...routeDigitation,
        ...routeEtask,
        ...routeTicket,
        ...routeBooking,
        ...routeEDocument,
        ...routeEsignature,
        ...routeCalendar
      ]
    }
  ]
})

export default router;
