import constants from '@/modules/etask/constants'

export default {
  methods: {
    taskPriority(priority, isCoordinate = false) {
      switch (priority) {
        case constants.PRIORITY_TASK.URGENT:
          return `<span class="icon-priority-urgent">
          </span>`
        case constants.PRIORITY_TASK.MEDIUM:
          return `<span class="icon-priority-medium"></span>`
        case constants.PRIORITY_TASK.NORMAL:
          return `<span class="icon-priority-normal"></span>`
        default:
          return `<span class="icon-priority-normal"></span>`
      }
    }
  }
}
