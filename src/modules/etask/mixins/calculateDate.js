import moment from 'moment'
import constants from '@/modules/etask/constants'

export default {
  data() {
    return {
    }
  },
  methods: {
    calculateDate(date, time) {
      const today = new Date()
      const estimate = new Date(moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' ' + time)
      const diffMs = (estimate - today) // milliseconds between now & Christmas
      if (diffMs >= 0) {
        const diffDays = Math.floor(diffMs / 86400000) // days
        const diffHrs = Math.floor((diffMs % 86400000) / 3600000) // hours
        const diffMinutes = Math.round(((diffMs % 86400000) % 3600000) / 60000) // minutes
        if (diffDays === 0) {
          if (diffHrs === 0) {
            return `<span>
                ${this.$t('task-manager.label.still')}
              </span>
              <span class="mx-1">
                ${diffMinutes}
              </span>
              <span>
                ${this.$t('task-manager.label.minutes')}
              </span>
              <span class="icon-repeat"></span>
              `
          } else {
            return `<span>
                ${this.$t('task-manager.label.still')}
              </span>
              <span class="mx-1">
                ${diffHrs}
              </span>
              <span>
                ${this.$t('task-manager.label.hours')}
              </span>
              <span class="icon-repeat"></span>
              `
          }
        } else {
          return `<span>
              ${this.$t('task-manager.label.still')}
            </span>
            <span class="mx-1">
              ${diffDays}
            </span>
            <span>
              ${this.$t('task-manager.label.date')}
            </span>
            <span class="icon-repeat"></span>
            `
        }
      } else {
        const diffMs = (today - estimate)
        const diffDays = Math.floor(diffMs / 86400000) // days
        const diffHrs = Math.floor((diffMs % 86400000) / 3600000) // hours
        const diffMinutes = Math.round(((diffMs % 86400000) % 3600000) / 60000) // minutes
        if (diffDays === 0) {
          if (diffHrs === 0) {
            return `<span class="text-red">
                ${this.$t('task-manager.label.late')}
              </span>
              <span class="text-red mx-1">
                ${Math.abs(diffMinutes)}
              </span>  
              <span class="text-red">
                ${this.$t('task-manager.label.minutes')}
              </span>
              <span class="icon-repeat-late"></span>
              `
          } else {
            return `<span class="text-red">
                ${this.$t('task-manager.label.late')}
              </span>
              <span class="text-red mx-1">
                ${Math.abs(diffHrs)}
              </span>
              <span class="text-red">
                ${this.$t('task-manager.label.hours')}
              </span>
              <span class="icon-repeat-late"></span>
              `
          }
        } else {
          return `<span class="text-red">
              ${this.$t('task-manager.label.late')}
            </span>
            <span class="text-red mx-1">
              ${Math.abs(diffDays)}
            </span>
            <span class="text-red">
              ${this.$t('task-manager.label.date')}
            </span>
            <span class="icon-repeat-late"></span>
            `
        }
      }
    },
    genderTime(object) {
      if (object.late) {
        let text = 'task-manager.label.date'

        if (object.timeType === constants.TIME_TYPE.HOUR) {
          text = 'task-manager.label.hours'
        }
        if (object.timeType === constants.TIME_TYPE.MINUTE) {
          text = 'task-manager.label.minutes'
        }
        return `<span class="text-red">
              ${this.$t('task-manager.label.late')}
            </span>
            <span class="text-red mx-1">
               ${object.duration}
            </span>
            <span class="text-red">
              ${this.$t(text)}
            </span>`
        // <span class="icon-repeat-late" />
      } else {
        let text = 'task-manager.label.date'
        if (object.timeType === constants.TIME_TYPE.HOUR) {
          text = 'task-manager.label.hours'
        }
        if (object.timeType === constants.TIME_TYPE.MINUTE) {
          text = 'task-manager.label.minutes'
        }
        return `<span>
              ${this.$t('task-manager.label.still')}
            </span>
            <span class="mx-1">
              ${object.duration}
            </span>
            <span>
              ${this.$t(text)}
            </span>`
        // <span class="icon-repeat" />
      }
    }
  }
}
