import constants from '@/constants'
export default {
  DASHBOARD_PATH: constants.DASHBOARD,
  DASHBOARD_HOME_PATH: `${constants.ROOT_PATH}`,
  LOGIN_PATH: `${constants.ROOT_PATH}login`,
  LOGIN_AGENT_PATH: `${constants.ROOT_PATH}login-agent`,
  FORGOT_PASSWORD_PATH: `${constants.ROOT_PATH}forgot-password`,
  NOTIFICATION_PATH: `${constants.ROOT_PATH}notification`,

  // Don vi
  ROOT_USER_UNIT: `${constants.ROOT_PATH}app`,
  GROUP_PATH: `${constants.ROOT_PATH}app/group`,
  GROUP_CREATE_PATH: `${constants.ROOT_PATH}app/group/create`,
  GROUP_UPDATE_PATH: `${constants.ROOT_PATH}app/group/update/:groupId`,
  // User
  USER_PATH: `${constants.ROOT_PATH}app/user`,
  USER_CREATE_PATH: `${constants.ROOT_PATH}app/user/create`,
  USER_UPDATE_PATH: `${constants.ROOT_PATH}app/user/update/:userId`,
  USER_INFO_PATH: `${constants.ROOT_PATH}app/user/info/:userId`
}
