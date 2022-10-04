import Vue from 'vue'
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  localize
} from 'vee-validate'

import * as rules from 'vee-validate/dist/rules'
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})

import en from 'vee-validate/dist/locale/en.json'
import vi from 'vee-validate/dist/locale/vi.json'
import validatorEn from '../locales/en/validator.json'
import validatorVn from '../locales/vn/validator.json'
import moment from 'moment'
import { formatFileSize } from '../helpers/utils'
extend('dateBefore', value => {
  let check = true
  const dateNew = moment(new Date(), 'DD/MM/YYYY')
  const start = moment(value, 'DD/MM/YYYY')
  const end = moment(dateNew, 'DD/MM/YYYY')
  const checkTime = moment(end).diff(moment(start), 'seconds')
  if (checkTime < 0) check = false
  return check
})
extend('checkFormatDate', value => {
  return moment(value, 'DD/MM/YYYY', true).isValid()
})

extend('checkMatch', {
  params: ['target'],
  validate(value, { target }) {
    let check = true
    let count = 0
    for (const item of target) {
      if (value === item.email) {
        count++
      }
    }
    if (count >= 2) check = false
    return check
  }
})
extend('validatePassword', value => {
  // regex check password bao gom it nhat 1 ky tu in hoa, 1 ky tu thuong, 1 so va 1 ky tu dac biet
  var regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[*@#$%^&+=])[A-Za-z\d*@#$%^&+=]{8,50}$/
  var isMatch = regex.test(String(value))
  return isMatch
})
localize({
  en: {
    messages: {
      ...en.messages,
      ...validatorEn.message,
      size: (field, size) =>
        `The ${field} must be less than ${formatFileSize(size)}.`
    },
    names: { ...validatorEn.names },
    fields: {
      parentName: {
        // required: 'The {_field_} is not null'
      },
      ...validatorEn.fields
    }
  },
  vi: {
    messages: {
      ...vi.messages,
      ...validatorVn.message,
      size: (field, size) => `${field} không được quá ${formatFileSize(size)}.`
    },
    names: { ...validatorVn.names },
    fields: {
      parentName: {
        // required: '{_field_} ko dc trong'
      },
      ...validatorVn.fields
    }
  }
})
Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)
