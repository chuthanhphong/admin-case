import constants from '@/constants'
export default {
  // dashboard
  DOCUMENT_DASHBOARD: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/dashboard`,
  // Document.
  DOCUMENT_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app`,
  DOCUMENT_BOOK_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/books`,
  DOCUMENT_LIBRARY_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/libraries`,
  DOCUMENT_MANAGEMENT_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/managements`,
  DOCUMENT_USER_GROUP_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/user-group`,

  // quan ly van ban
  CREATE_MANAGEMENT_DOC_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/management/create`,
  UPDATE_MANAGEMENT_DOC_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/management/update/:documentId`,
  UPDATE_MANAGEMENT_DOC_GO_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/management/update/:documentId/:documentType`,
  MANAGEMENT_DOC_DETAIL_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/document/detail/:documentId`,

  // van ban di den
  CREATE_BOOK_DOC_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/book/create`,
  UPDATE_BOOK_DOC_GO_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/book/update/:documentId/:documentType`,
  UPDATE_BOOK_DOC_PATH: `${constants.ROOT_PATH}${constants.EDOCUMENT_PATH}app/book/update/:documentId`

}
