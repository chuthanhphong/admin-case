import constants from '@/constants'

export default {
  ROOT_GROUP_CONTRACT: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app`,
  ECONTRACT_DASHBOARD_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contracts/dashboard`,
  // Hop Dong
  CREATE_CONTRACT_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contract/create`,
  UPDATE_CONTRACT_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contract/update/:contractId`,
  COORDINATION_CONTRACT_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contract/coordination/:contractId`,
  SIGN_CONTRACT_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contract/:contractId/sign`,
  // Group Hop dong danh sach
  LIST_CONTRACT_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contracts`,
  LIST_CONTRACT_CREATED_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contracts/created`,
  LIST_CONTRACT_PROCESS_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contracts/process`,
  LIST_CONTRACT_COORDINATION_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contracts/coordination`,
  // So Hoa
  CREATE_CONTRACT_DIGIT_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contract/digitzation/create`,
  UPDATE_CONTRACT_DIGIT_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contract/digitzation/update/:contractId`,
  LIST_CONTRACT_DIGIT_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contracts/digitzations`,

  // Luong Mau
  CREATE_FLOW_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contract/flow/create`,
  UPDATE_FLOW_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contract/flow/update/:contractId`,
  LIST_FLOWS_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contracts/flows`,

  // Bao cao
  REPORT_PATH: `${constants.ROOT_PATH}${constants.ECONTRACT_PATH}app/contracts/report`
}
