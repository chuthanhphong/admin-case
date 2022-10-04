import routeNames from './routeNames'
import calendarPath from './routePaths'
import Dashboard from '@/modules/calendar/views/dashboard/Dashboard'
import DetailMeetingSchedule from '@/modules/calendar/views/detail/DetailMeetingSchedule'
import tablist from '@/modules/calendar/views/list/Tablist'

export const routeCalendar = [
  {
    path: calendarPath.CALENDAR_DASHBOARD,
    name: routeNames.CALENDAR_DASHBOARD,
    component: Dashboard
  },
  // List quan ly lich hop
  {
    name: routeNames.CALENDAR_MANAGEMENT_MEETING,
    path: calendarPath.CALENDAR_MANAGEMENT_MEETING_PATH,
    component: tablist
  },
  // Chi tiet lich hop
  {
    name: routeNames.CALENDAR_MEETING_DETAIL,
    path: calendarPath.CALENDAR_MEETING_DETAIL_PATH,
    component: DetailMeetingSchedule
  },
]

