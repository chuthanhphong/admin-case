import { mapValueTypeToCSSClass } from '@/modules/ticket/helpers/ticketUtils'
export default {
  methods: {
    renderClassIcon(value) {
      const type = mapValueTypeToCSSClass.find((vType) => vType.value === value)
      if (!type) {
        return ''
      }
      return type.icon
    },
    isTypeValue(code, typeMap) {
      let attr = typeMap
      if (!typeMap) {
        attr = this.typeAttributes
      }
      const type = mapValueTypeToCSSClass.find(
        (t) => attr.valueType === t.value
      )
      if (type) return type.code === code
      return false
    }
  }
}
