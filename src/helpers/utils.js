import faker from 'faker'
import _ from 'lodash'
import constants from '@/constants'
import moment from 'moment'

faker.locale = 'vi'
export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}
export const sleep = async seconds => {
  return await new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

export const formatQuery = params => {
  var keys = Object.keys(params)
  var values = {}
  keys.map(k => {
    var val = params[k]
    if (val) {
      values[k] = val
    }
  })
  return new URLSearchParams(values).toString()
}
export const formatFileSize = (
  { size },
  units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  delimiter = ' '
) => {
  const threshold = 1024
  size = size * threshold
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold))
  return (size / Math.pow(threshold, i)).toFixed(1) * 1 + delimiter + units[i]
}

export const genUsers = size => {
  const docStates = [
    constants.DOC_STATES.DRAFT,
    constants.DOC_STATES.REJECT,
    constants.DOC_STATES.IN_PROGRESS,
    constants.DOC_STATES.COMPLETE,
    constants.DOC_STATES.CANCEL
  ]
  const contractTypes = ['Hợp đồng lao động', 'Hợp đồng vận chuyển']
  var lstUsers = []
  for (let i = 0; i < size; i++) {
    const indexState = _.random(0, 4)
    const indexContractType = _.random(0, 1)
    var user = {}
    user.userName = `${faker.name.lastName()} ${faker.name.firstName()}`
    user.contractName = `${faker.system.fileName()}`
    user.docState = docStates[indexState]
    user.contractType = contractTypes[indexContractType]
    user.timeSign = moment().format('DD/MM/YYYY')
    user.timeExpired = moment().format('DD/MM/YYYY')
    user.filecontractName = `${faker.system.fileName()}.pdf`
    lstUsers.push(user)
  }
  return lstUsers
}
export const genTemplates = size => {
  const contractTypes = ['Hợp đồng lao động', 'Hợp đồng vận chuyển']
  const scopes = ['Cá nhân dùng riêng', 'Đơn vị dùng chung']
  var lstTemplate = []
  for (let i = 0; i < size; i++) {
    const indexContractType = _.random(0, 1)
    const indexScope = _.random(0, 1)
    var data = {}
    data.contractName = `${faker.lorem.words(5)}`
    data.contractType = contractTypes[indexContractType]
    data.scope = scopes[indexScope]
    data.fileContractName = `${faker.lorem.words(5)}.pdf`
    lstTemplate.push(data)
  }
  return lstTemplate
}

export const normalizeString = (s, transform = s => s.toLocaleLowerCase()) => {
  let normalized = transform(s)
  if (String.prototype.normalize) {
    try {
      normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
    } catch (e) {
      // just ignore
    }
  }
  return normalized
}

export const formatDate = (strDate, format) => {
  return moment(strDate).format(format)
}

export const replaceComma = (val) => {
  return val.toString().replace(/[,]/g, '')
}

export const isExistSeparation = (val) => {
  return val.toString().indexOf('.') > -1
}

export const parseValueWithTypeBoolean = (val) => {
  return val ? 1 : 0
}
