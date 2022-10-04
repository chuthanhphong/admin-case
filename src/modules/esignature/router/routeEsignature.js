import routeNames from './routeNames'
import esignaturePath from './routePaths'
import Dashboard from '@/modules/esignature/views/dashboard/Dashboard'
import ListDocumentCreated from '@/modules/esignature/views/list/created/ListDocumentCreated'
import CreateDocument from '@/modules/esignature/views/create/CreateDocument'
import UpdateDocument from '@/modules/esignature/views/update/UpdateDocument'
import CopyDocument from '@/modules/esignature/views/copy/CopyDocument'
import DetailDocument from '@/modules/esignature/views/detail/DetailDocument'
import TabsDocumentProcess from '@/modules/esignature/views/list/process/TabsDocumentProcess'
import CreateFlow from '@/modules/esignature/views/flow/create/CreateFlow'
import UpdateFlow from '@/modules/esignature/views/flow/update/UpdateFlow'
import ListFlows from '@/modules/esignature/views/flow/list/ListFlows'
import ListProclaim from '@/modules/esignature/views/list/proclaim/ListDocumentProclaim'

export const routeEsignature = [
  {
    path: esignaturePath.ESIGNATURE_DASHBOARD,
    name: routeNames.ESIGNATURE_DASHBOARD,
    component: Dashboard
  },
  // Ky dien tu.
  // List van ban toi trinh
  {
    name: routeNames.DOCUMENT_LIST_CREATE,
    path: esignaturePath.DOCUMENT_LIST_CREATE_PATH,
    component: ListDocumentCreated
  },
  // List van ban ban hanh
  {
    name: routeNames.DOCUMENT_LIST_PROCLAIM,
    path: esignaturePath.DOCUMENT_LIST_PROCLAIM_PATH,
    component: ListProclaim
  },

  // tao van ban trinh ky
  {
    name: routeNames.CREATE_DOCUMENT,
    path: esignaturePath.CREATE_DOCUMENT_PATH,
    component: CreateDocument
  },

  // sua van ban trinh ky
  {
    name: routeNames.UPDATE_DOCUMENT,
    path: esignaturePath.UPDATE_DOCUMENT_PATH,
    component: UpdateDocument
  },

  // copy van ban trinh ky
  {
    name: routeNames.COPY_DOCUMENT,
    path: esignaturePath.COPY_DOCUMENT_PATH,
    component: CopyDocument
  },

  // chi tiet van ban toi trinh
  {
    name: routeNames.DOCUMENT_DETAIL,
    path: esignaturePath.DOCUMENT_DETAIL_PATH,
    component: DetailDocument
  },

  // List van ban toi xu ly
  {
    name: routeNames.DOCUMENT_LIST_PROCESS,
    path: esignaturePath.DOCUMENT_LIST_PROCESS_PATH,
    component: TabsDocumentProcess
  },
  // Tao luong mau
  {
    name: routeNames.CREATE_FLOW,
    path: esignaturePath.CREATE_FLOW_PATH,
    component: CreateFlow
  },
  // Sua luong mau
  {
    name: routeNames.UPDATE_FLOW,
    path: esignaturePath.UPDATE_FLOW_PATH,
    component: UpdateFlow
  },
  // Danh sach luong mau
  {
    name: routeNames.LIST_FLOWS,
    path: esignaturePath.LIST_FLOWS_PATH,
    component: ListFlows
  }
]

