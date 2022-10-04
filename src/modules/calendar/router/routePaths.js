import constants from '@/constants'
export default {

  // dashboard
  CALENDAR_DASHBOARD: `${constants.ROOT_PATH}${constants.CALENDAR_PATH}app/list/dashboard`,

  CALENDAR_PATH: `${constants.ROOT_PATH}${constants.CALENDAR_PATH}app`,

  CALENDAR_MEETING_DETAIL_PATH: `${constants.ROOT_PATH}${constants.CALENDAR_PATH}app/meeting/detail/:meetingId`,

  CALENDAR_MANAGEMENT_MEETING_PATH: `${constants.ROOT_PATH}${constants.CALENDAR_PATH}app/meetings`,

  CALENDAR_VIEW_PATH: `${constants.ROOT_PATH}${constants.CALENDAR_PATH}app/calendar/view`,
}
