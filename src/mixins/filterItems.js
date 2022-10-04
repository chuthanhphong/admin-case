
import { normalizeString } from '@/helpers/utils'
export default {
  methods: {
    filterItems(item, queryText, itemText) {
      if (queryText.trim() === null || queryText.trim().length === 0) {
        return true
      }
      return (
        itemText &&
        itemText.length > 0 &&
        normalizeString(itemText).includes(normalizeString(queryText.trim()))
      )
    }
  }
}
