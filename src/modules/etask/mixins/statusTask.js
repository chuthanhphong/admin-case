import constants from '@/modules/etask/constants'

export default {
  methods: {
    taskState(state, isCoordinate = false) {
      switch (state) {
        case constants.STATUS_TASK.DELETED:
          return `<span class="state-delete state-task">${this.$t(
            'task-manager.status.delete'
          )}</span>`
        case constants.STATUS_TASK.NEW:
          return `<span class="state-new state-task">${this.$t(
            'task-manager.status.new'
          )}</span>`
        case constants.STATUS_TASK.REVIEW_RECEIVING:
          return `<span class="state-review-receiving state-task">${this.$t(
            'task-manager.status.review-receiving'
          )}</span>`
        case constants.STATUS_TASK.RECEIVED_UNPROCESS:
          return `<span class="state-received-unprocess state-task">${this.$t(
            'task-manager.status.received-unprocess'
          )}</span>`
        case constants.STATUS_TASK.INPROGRESS:
          return `<span class="state-inprogress state-task">${this.$t(
            'task-manager.status.inprogress'
          )}</span>`
        case constants.STATUS_TASK.REJECT_RECEIVING:
          return `<span class="state-reject-receiving state-task">${this.$t(
            'task-manager.status.reject-receiving'
          )}</span>`
        case constants.STATUS_TASK.FINISH:
          return `<span class="state-finish state-task">${this.$t(
            'task-manager.status.finish'
          )}</span>`
        case constants.STATUS_TASK.CLOSED:
          return `<span class="state-closed state-task">${this.$t(
            'task-manager.status.closed'
          )}</span>`
        case constants.STATUS_TASK.CANCELED:
          return `<span class="state-canceled state-task">${this.$t(
            'task-manager.status.canceled'
          )}</span>`
        case constants.STATUS_TASK.REVIEW_SENDING:
          return `<span class="state-review-sending state-task">${this.$t(
            'task-manager.status.review-sending'
          )}</span>`
        case constants.STATUS_TASK.PENDING:
          return `<span class="state-pending state-task">${this.$t(
            'task-manager.status.pending'
          )}</span>`
      }
    },
    checkEventProgress(action) {
      if (action.includes(constants.TASK_MANAGER_ACTIONS.UPDATE_PROGRESS)) {
        return ''
      } else {
        return 'pointer-events'
      }
    },
    checkProgress(action) {
      if (action.includes(constants.TASK_MANAGER_ACTIONS.UPDATE_PROGRESS)) {
        return 'custom-progress'
      } else {
        return ''
      }
    },
    colorProgress(state) {
      switch (state) {
        // cho xem xet
        case constants.STATUS_TASK.REVIEW_RECEIVING:
          return '#6E73E8'
        // cho tiep nhan
        case constants.STATUS_TASK.REVIEW_SENDING:
          return '#9296EE'
        // tam dung
        case constants.STATUS_TASK.PENDING:
          return '#4A50E2'
        // dang thuc hien
        case constants.STATUS_TASK.INPROGRESS:
          return '#FFAF2E'
        // chua thuc hien
        case constants.STATUS_TASK.RECEIVED_UNPROCESS:
          return '#FD8538'
        // huy
        case constants.STATUS_TASK.CANCELED:
          return '#FF4A55'
        // khoi tao
        case constants.STATUS_TASK.NEW:
          return '#8E8EA1'
        // hoan thanh
        case constants.STATUS_TASK.FINISH:
          return '#0FAFE4'
        // dong
        case constants.STATUS_TASK.CLOSED:
          return '#1C49E9'
        // tu choi tiep nhan
        case constants.STATUS_TASK.REJECT_RECEIVING:
          return '#FF4A55'
        default:
          return '#8E8EA1'
      }
    }
  }
}
