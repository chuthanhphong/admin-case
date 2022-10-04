import routeNames from './routeNames'
import econtractRoute from './routePaths'

import CreateContractDigitzation from '@/modules/econtract/views/digitzation/Create'
import UpdateContractDigitzation from '@/modules/econtract/views/digitzation/Update'
import ListContractDigitzation from '@/modules/econtract/views/digitzation/List'

export const routeDigitation = [
  {
    name: routeNames.CREATE_CONTRACT_DIGITZATION,
    path: econtractRoute.CREATE_CONTRACT_DIGIT_PATH,
    component: CreateContractDigitzation
  },
  {
    name: routeNames.UPDATE_CONTRACT_DIGITZATION,
    path: econtractRoute.UPDATE_CONTRACT_DIGIT_PATH,
    component: UpdateContractDigitzation
  },
  {
    name: routeNames.LIST_CONTRACT_DIGITZATION,
    path: econtractRoute.LIST_CONTRACT_DIGIT_PATH,
    component: ListContractDigitzation
  }
]
