import constants from '@/constants'
export default {

  // dashboard
  ESIGNATURE_DASHBOARD: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/list/dashboard`,

  ESIGNATURE_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app`,

  DOCUMENT_LIST_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/list`,
  // list
  DOCUMENT_LIST_CREATE_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/list/created`,
  DOCUMENT_LIST_PROCESS_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/list/process`,
  DOCUMENT_LIST_PROCESS_TAB_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/list/process?tabCurren=`,
  DOCUMENT_LIST_PROCLAIM_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/list/proclaim`,
  LIST_FLOWS_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/list/flows`,
  // create, update
  CREATE_DOCUMENT_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/created`,
  DOCUMENT_DETAIL_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/detail/:documentId`,
  UPDATE_DOCUMENT_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/update/:documentId`,
  COPY_DOCUMENT_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/copy/:documentId`,
  // Luong Mau
  CREATE_FLOW_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/flow/create`,
  UPDATE_FLOW_PATH: `${constants.ROOT_PATH}${constants.SIGNATURE_PATH}app/flow/update/:documentId`
}
