/* eslint-disable key-spacing */
// import constants from '@/constants'
import routeNames from "./routeNames";
import routePaths from "./routePaths";
import Dashboard from '@/modules/ticket/views/dashboard/Dashboard';
import ListCategoryTicket from "@/modules/ticket/views/list-category/ListCategoryTicket";
import AddUpdateCategoryTicket from "@/modules/ticket/views/category-ticket/AddUpdateCategoryTicket";
import MyPerform from "@/modules/ticket/views/my-perform/MyPerform";
import MyRequest from "@/modules/ticket/views/my-request/MyRequest";
import MyFollow from "@/modules/ticket/views/my-follow/MyFollow";
import MyApprove from "@/modules/ticket/views/my-approve/MyApprove";
import TaskCenter from "@/modules/ticket/views/task-center/TaskCenter";
import DepartmentTicket from "@/modules/ticket/views/department-ticket/DepartmentTicket";
import DetailTicket from "@/modules/ticket/views/detail-ticket/DetailTicket";
import Report from '@/modules/ticket/views/report/report'

export const routeTicket = [
  {
    name: routeNames.TICKET_DASHBOARD,
    path: routePaths.TICKET_DASHBOARD,
    component: Dashboard
  },
  {
    name: routeNames.CATEGORIES_TICKET,
    path: routePaths.CATEGORIES_TICKET_PATH,
    component: ListCategoryTicket,
  },
  {
    name: routeNames.CREATE_CATEGORY_TICKET,
    path: routePaths.CREATE_CATEGORY_TICKET_PATH,
    component: AddUpdateCategoryTicket,
  },
  {
    name: routeNames.UPDATE_CATEGORY_TICKET,
    path: routePaths.UPDATE_CATEGORY_TICKET_PATH,
    component: AddUpdateCategoryTicket,
  },
  {
    name: routeNames.MY_PERFORM_TICKET,
    path: routePaths.MY_PERFORM_TICKET_PATH,
    component: MyPerform,
  },
  {
    name: routeNames.MY_REQUEST_TICKET,
    path: routePaths.MY_REQUEST_TICKET_PATH,
    component: MyRequest,
  },
  {
    name: routeNames.MY_FOLLOW_TICKET,
    path: routePaths.MY_FOLLOW_TICKET_PATH,
    component: MyFollow,
  },
  {
    name: routeNames.MY_APPROVE_TICKET,
    path: routePaths.MY_APPROVE_TICKET_PATH,
    component: MyApprove,
  },
  {
    name: routeNames.TASK_CENTER_TICKET,
    path: routePaths.TASK_CENTER_TICKET_PATH,
    component: TaskCenter,
  },
  {
    name: routeNames.DEPARTMENT_TICKET,
    path: routePaths.DEPARTMENT_TICKET_PATH,
    component: DepartmentTicket,
  },
  {
    name: routeNames.DETAIL_TICKET,
    path: routePaths.DETAIL_TICKET_PATH,
    component: DetailTicket,
  },
  {
    path: routeNames.REPORT,
    name: routePaths.REPORT_TICKET_PATH,
    component: Report
  },
];
