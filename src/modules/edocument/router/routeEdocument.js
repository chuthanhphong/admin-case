import routeNames from './routeNames'
import edocumentPath from './routePaths'
import Dashboard from '@/modules/edocument/views/dashboard/Dashboard'
import Book from '@/modules/edocument/views/document/book-go-arrival/BookGoArrival'
import Library from '@/modules/edocument/views/document/library/Library'
import Management from '@/modules/edocument/views/document/management/ManagementDoc'
import UserGroup from '@/modules/edocument/views/document/user-group/UserGroup'
import CreateManagementDoc from '@/modules/edocument/views/document/management/create/CreateManagementDoc'
import DetailManagementDoc from '@/modules/edocument/views/document/management/detail/DetailManagement'
import UpdateManagementDoc from '@/modules/edocument/views/document/management/update/UpdateManagementDoc'
import UpdateManagementDocGo from '@/modules/edocument/views/document/management/update/UpdateManagementDocGo'

import CreateBook from '@/modules/edocument/views/document/book-go-arrival/create/CreateBook'
import UpdateBook from '@/modules/edocument/views/document/book-go-arrival/update/UpdateBook'

export const routeEDocument = [
  {
    path: edocumentPath.DOCUMENT_DASHBOARD,
    name: routeNames.DOCUMENT_DASHBOARD,
    component: Dashboard
  },
  // So di - den.
  {
    name: routeNames.DOCUMENT_BOOK,
    path: edocumentPath.DOCUMENT_BOOK_PATH,
    component: Book
  },
  // Quan ly van ban.
  {
    name: routeNames.DOCUMENT_LIBRARY,
    path: edocumentPath.DOCUMENT_LIBRARY_PATH,
    component: Library
  },
  // Chi tiet van ban quan ly
  {
    name: routeNames.MANAGEMENT_DOC_DETAIL,
    path: edocumentPath.MANAGEMENT_DOC_DETAIL_PATH,
    component: DetailManagementDoc
  },
  // Thu vien.
  {
    name: routeNames.DOCUMENT_MANAGEMENT,
    path: edocumentPath.DOCUMENT_MANAGEMENT_PATH,
    component: Management
  },
  // Tao moi van ban ca nhan
  {
    name: routeNames.CREATE_MANAGEMENT_DOC,
    path: edocumentPath.CREATE_MANAGEMENT_DOC_PATH,
    component: CreateManagementDoc
  },
  // Update van ban ca nhan
  {
    name: routeNames.UPDATE_MANAGEMENT_DOC,
    path: edocumentPath.UPDATE_MANAGEMENT_DOC_PATH,
    component: UpdateManagementDoc
  },
  // Nhom ca nhan.
  {
    name: routeNames.DOCUMENT_USER_GROUP,
    path: edocumentPath.DOCUMENT_USER_GROUP_PATH,
    component: UserGroup
  },
  // update van ban di den quan ly van ban.
  {
    name: routeNames.UPDATE_MANAGEMENT_DOC_GO,
    path: edocumentPath.UPDATE_MANAGEMENT_DOC_GO_PATH,
    component: UpdateManagementDocGo
  },
  // create van ban di den.
  {
    name: routeNames.CREATE_BOOK_DOC,
    path: edocumentPath.CREATE_BOOK_DOC_PATH,
    component: CreateBook
  },
  // update van ban di tu kdt man so van ban di den
  {
    name: routeNames.UPDATE_BOOK_DOC_GO,
    path: edocumentPath.UPDATE_BOOK_DOC_GO_PATH,
    component: UpdateManagementDocGo
  },
  // update van ban di den.
  {
    name: routeNames.UPDATE_BOOK_DOC,
    path: edocumentPath.UPDATE_BOOK_DOC_PATH,
    component: UpdateBook
  }
]

