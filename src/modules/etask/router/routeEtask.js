import routeNamesEtask from './routeNames'
import routePathsEtask from './routePaths'

import ICreate from '@/modules/etask/views/task/create'
import IAssign from '@/modules/etask/views/task/assign'
import IPerform from '@/modules/etask/views/task/perform'
import IFollow from '@/modules/etask/views/task/follow'
import RoomWork from '@/modules/etask/views/task/roomwork'
import DialogTaskDetail from '@/modules/etask/views/components/DialogTaskDetail'
import TypeTask from '@/modules/etask/views/task/typetask'
import Dashboard from '@/modules/etask/views/task/dashboard'

export const routeEtask = [
  // Viec toi thuc hien
  {
    path: routePathsEtask.I_PERFORM,
    name: routeNamesEtask.I_PERFORM,
    component: IPerform
  },
  // Viec toi giao
  {
    path: routePathsEtask.I_ASSIGN,
    name: routeNamesEtask.I_ASSIGN,
    component: IAssign
  },
  // Viec toi tao
  {
    path: routePathsEtask.I_CREATE,
    name: routeNamesEtask.I_CREATE,
    component: ICreate
  },
  // Viec toi theo doi
  {
    path: routePathsEtask.I_FOLLOW,
    name: routeNamesEtask.I_FOLLOW,
    component: IFollow
  },
  // Viec cua phong
  {
    path: routePathsEtask.ROOM_WORK,
    name: routeNamesEtask.ROOM_WORK,
    component: RoomWork
  },
  // sua-task
  {
    path: routePathsEtask.UPDATE_TASK,
    name: routeNamesEtask.UPDATE_TASK,
    component: DialogTaskDetail
  },
  // loai cong viec
  {
    path: routePathsEtask.TYPE_TASK,
    name: routeNamesEtask.TYPE_TASK,
    component: TypeTask
  },
  // Dashboard
  {
    path: routePathsEtask.TASK_DASHBOARD,
    name: routeNamesEtask.DASHBOARD,
    component: Dashboard
  }
]
