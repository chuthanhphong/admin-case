import routeNames from './routeNames'
import routePaths from './routePaths'

import Login from '@/views/login/Login'
import LoginAgent from '@/views/login/LoginAgent'
import ForgotPassword from '@/views/login/ForgotPassword'

export const routeCommon = [
  // Dang nhap
  {
    name: routeNames.LOGIN,
    path: routePaths.LOGIN_PATH,
    component: Login
  },
  // Dang nhap ngoai he thong
  {
    name: routeNames.LOGIN_AGENT,
    path: routePaths.LOGIN_AGENT_PATH,
    component: LoginAgent
  },
  // Lay lai mat khau
  {
    name: routeNames.FORGOT_PASSWORD,
    path: routePaths.FORGOT_PASSWORD_PATH,
    component: ForgotPassword
  }

]
