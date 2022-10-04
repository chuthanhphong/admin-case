import routeNames from './routeNames'
import econtractRoute from './routePaths'
import Dashboard from '@/modules/econtract/views/eContract/dashboard/Dashboard'
import ListContractCreated from '@/modules/econtract/views/eContract/contract/list/created/ListContractCreated'
import ListContractProcess from '@/modules/econtract/views/eContract/contract/list/process/ListContractProcess'
import ListContractCoordination from '@/modules/econtract/views/eContract/contract/list/coordination/ListContractCoordination'
import SignContract from '@/modules/econtract/views/eContract/contract/sign/SignContract'
import CreateContract from '@/modules/econtract/views/eContract/contract/create-contract/CreateContract'
import UpdateContract from '@/modules/econtract/views/eContract/contract/update/UpdateContract'
import Coordination from '@/modules/econtract/views/eContract/contract/coordination/Coordination'
import CreateFlow from '@/modules/econtract/views/eContract/flow/create/CreateFlow'
import UpdateFlow from '@/modules/econtract/views/eContract/flow/update/UpdateFlow'
import ListFlows from '@/modules/econtract/views/eContract/flow/list/ListFlows'
import Report from '@/modules/econtract/views/eContract/report/Report'

export const routeEcontract = [
  {
    path: econtractRoute.ECONTRACT_DASHBOARD_PATH,
    name: routeNames.ECONTRACT_DASHBOARD,
    component: Dashboard
  },
  // D/s hop dong toi tao
  {
    name: routeNames.LIST_CONTRACT,
    path: econtractRoute.LIST_CONTRACT_CREATED_PATH,
    component: ListContractCreated
  },
  // D/s hop dong dang xu ly
  {
    name: routeNames.LIST_CONTRACT_PROCESS,
    path: econtractRoute.LIST_CONTRACT_PROCESS_PATH,
    component: ListContractProcess
  },
  // D/s hop dong dieu phoi
  {
    name: routeNames.LIST_CONTRACT_COORDINATION,
    path: econtractRoute.LIST_CONTRACT_COORDINATION_PATH,
    component: ListContractCoordination
  },
  // Ky hop dong
  {
    name: routeNames.SIGN_CONTRACT,
    path: econtractRoute.SIGN_CONTRACT_PATH,
    component: SignContract
  },
  // Tao hop dong
  {
    name: routeNames.CREATE_CONTRACT,
    path: econtractRoute.CREATE_CONTRACT_PATH,
    component: CreateContract
  },
  // Sua hop dong
  {
    name: routeNames.UPDATE_CONTRACT,
    path: econtractRoute.UPDATE_CONTRACT_PATH,
    component: UpdateContract
  },
  // Dieu phoi hop dong
  {
    name: routeNames.COORDINATION_CONTRACT,
    path: econtractRoute.COORDINATION_CONTRACT_PATH,
    component: Coordination
  },
  // Tao luong mau
  {
    name: routeNames.CREATE_FLOW,
    path: econtractRoute.CREATE_FLOW_PATH,
    component: CreateFlow
  },
  // Sua luong mau
  {
    name: routeNames.UPDATE_FLOW,
    path: econtractRoute.UPDATE_FLOW_PATH,
    component: UpdateFlow
  },
  // Danh sach luong mau
  {
    name: routeNames.LIST_FLOWS,
    path: econtractRoute.LIST_FLOWS_PATH,
    component: ListFlows
  },
  // Bao cao
  {
    name: routeNames.REPORT,
    path: econtractRoute.REPORT_PATH,
    component: Report
  }
]
