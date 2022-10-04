import constants from '@/constants'
export default {
  TASK_DASHBOARD: `${constants.ROOT_PATH}${constants.TASK_PATH}app/dashboard`,
  TASK_LIST_PATH: `${constants.ROOT_PATH}${constants.TASK_PATH}app/task`,
  I_CREATE: `${constants.ROOT_PATH}${constants.TASK_PATH}app/task/create`,
  UPDATE_TASK: `${constants.ROOT_PATH}${constants.TASK_PATH}app/task/update/:taskId`,
  VIEW_TASK: `${constants.ROOT_PATH}${constants.TASK_PATH}app/task/view/:taskId`,
  I_ASSIGN: `${constants.ROOT_PATH}${constants.TASK_PATH}app/task/assign`,
  I_PERFORM: `${constants.ROOT_PATH}${constants.TASK_PATH}app/task/perform`,
  I_RELATE: `${constants.ROOT_PATH}${constants.TASK_PATH}app/task/relate`,
  I_FOLLOW: `${constants.ROOT_PATH}${constants.TASK_PATH}app/task/follow`,
  ROOM_WORK: `${constants.ROOT_PATH}${constants.TASK_PATH}app/task/room-work`,
  TYPE_TASK: `${constants.ROOT_PATH}${constants.TASK_PATH}app/task/type-task`
}
