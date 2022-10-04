import constants from '@/constants'
import { replaceComma, isExistSeparation } from './utils'

export class FormUtils {
  static isNumber(evt) {
    evt = evt || window.event
    var charCode = evt.which ? evt.which : evt.keyCode

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      evt.preventDefault()
    }

    return true
  }

  static isOnPasteOnlyNumber(evt) {
    const val = evt.clipboardData.getData('text')
    if (val == null || val.length === 0) {
      return null
    }

    const newVal = replaceComma(val)
    const isNum = FormUtils.isOriginal(newVal)
    if (isNum) {
      return val
    }

    return null
  }

  static isOriginal(val) {
    return Number.isInteger(parseFloat(val)) && isFinite(val)
  }

  static isOnPasteOnlyNumberAndMaximum(evt, maximun) {
    const val = evt.clipboardData.getData('text')
    if (val === null || val.length === 0) {
      return null
    }

    const newVal = replaceComma(val)
    const isNum = FormUtils.isOriginal(newVal)
    if (isNum && newVal.length > maximun) {
      return newVal.substring(0, maximun)
    }

    if (isNum) {
      return newVal.toString()
    }

    return null
  }

  // decimal
  static isDecimal(evt) {
    evt = evt || window.event
    var charCode = evt.which ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      evt.preventDefault()
    }

    const val = evt.target.value
    const arrVal = val.split(constants.separation)
    // only ont dot
    if (charCode === 46 && arrVal.length === 2) {
      evt.preventDefault()
    }

    // check enter after dot
    if (
      arrVal.length === 2 &&
      arrVal[1].toString().length >= constants.maximumAfterDecimal &&
      evt.target.selectionStart >= val.length - constants.maximumAfterDecimal
    ) {
      evt.preventDefault()
    }

    return true
  }

  static isOnPasteOnlyDecimal(evt) {
    const val = evt.clipboardData.getData('text')
    if (val == null || val.length === 0) {
      return null
    }

    const newVal = replaceComma(val)
    const isNum = FormUtils.isNumeric(newVal)
    if (isNum) {
      return parseFloat(newVal)
        .toFixed(constants.maximumAfterDecimal)
        .toString()
    }

    return null
  }

  static isNumeric(val) {
    return !isNaN(parseFloat(val)) && isFinite(val)
  }

  static isOnPasteOnlyDecimalAndMaximum(evt, maximun) {
    const val = evt.clipboardData.getData('text')
    if (val === null || val.length === 0) {
      return null
    }

    const newVal = replaceComma(val)
    const isNum = FormUtils.isNumeric(newVal)
    if (isNum && isExistSeparation(newVal)) {
      const arrVal = newVal.split(constants.separation)
      let origin = arrVal[0]
      const decimal = arrVal[1]

      if (origin.length > maximun) {
        origin = origin.substring(0, maximun)
      }

      if (decimal.length > constants.maximumAfterDecimal) {
        origin = origin.substring(0, constants.maximumAfterDecimal)
      }

      if (decimal !== '') {
        return `${origin}.${decimal}`
      }

      return origin
    }

    if (isNum && newVal.length > maximun) {
      return newVal.toString().substring(0, maximun)
    }

    if (isNum) {
      return newVal.toString()
    }

    return null
  }

  static isLetter(e) {
    const char = String.fromCharCode(e.keyCode)
    if (/^[A-Za-z ]+$/.test(char)) return true
    else e.preventDefault()
  }

  static isNumberTicket(e) {
    const char = String.fromCharCode(e.keyCode)
    if (/^[0-9.,]+$/.test(char)) return true
    else e.preventDefault()
  }
}
