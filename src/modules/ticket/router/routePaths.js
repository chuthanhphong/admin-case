/* eslint-disable key-spacing */
import constants from "@/constants";

export default {
  TICKET_DASHBOARD: `${constants.ROOT_PATH}${constants.TICKET_PATH}app/dashboard`,
  REQUEST_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request`,
  // categories
  CATEGORIES_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/categories`,
  CREATE_CATEGORY_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/category-ticket/create`,
  UPDATE_CATEGORY_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/category-ticket/update/:id`,

  // tickets
  MY_PERFORM_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/my-perform`,
  MY_REQUEST_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/my-request`,
  MY_FOLLOW_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/my-follow`,
  MY_APPROVE_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/my-approve`,
  TASK_CENTER_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/task-center`,
  DEPARTMENT_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/department-ticket`,
  DETAIL_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/detail`,
  REPORT_TICKET_PATH: `${constants.ROOT_PATH}${constants.TICKET_PATH}request/report`
};
