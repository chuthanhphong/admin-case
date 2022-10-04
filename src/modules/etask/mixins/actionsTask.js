import constants from '@/modules/etask/constants'
import { TaskService } from '@/modules/etask/services/taskService'

export default {
  data() {
    return {
      taskId: null,
      listActionsMixin: [],
      formDataAction: {
        taskId: null,
        status: '',
        content: ''
      }
    }
  },
  methods: {
    renderTaskAction(action) {
      switch (action) {
        case constants.TASK_MANAGER_ACTIONS.UPDATE: // Sua cv
          return this.elementAction('update', 'task-manager.label.update')
        case constants.TASK_MANAGER_ACTIONS.REMOVE: // Xoa cv
          return this.elementAction('remove', 'task-manager.label.remove')
        case constants.TASK_MANAGER_ACTIONS.CANCEL: // Huy cv
          return this.elementAction('cancel', 'task-manager.label.cancel')
        case constants.TASK_MANAGER_ACTIONS.PAUSE: // Dung cv
          return this.elementAction('pause', 'task-manager.label.pause')
        case constants.TASK_MANAGER_ACTIONS.VIEW: // Xem cv
          return this.elementAction('view', 'task-manager.label.view')
        case constants.TASK_MANAGER_ACTIONS.REVIEW: // Xem lai cv
          return this.elementAction('review', 'task-manager.label.review')
        case constants.TASK_MANAGER_ACTIONS.DENY_REVIEW: // Tu choi xem xet cv
          return this.elementAction('deny-review', 'task-manager.label.deny-review')
        case constants.TASK_MANAGER_ACTIONS.TAKE_OVER: // Tiep nhan cv
          return this.elementAction('take-over', 'task-manager.label.take-over')
        case constants.TASK_MANAGER_ACTIONS.DENY_TAKE_OVER: // Tu choi tiep nhan cv
          return this.elementAction('deny-take-over', 'task-manager.label.deny-take-over')
        case constants.TASK_MANAGER_ACTIONS.APPROVE: // Duyet cv
          return this.elementAction('approve', 'task-manager.label.approve')
        case constants.TASK_MANAGER_ACTIONS.DENY_APPROVE: // Tu choi duyet cv
          return this.elementAction('deny-approve', 'task-manager.label.deny-approve')
        case constants.TASK_MANAGER_ACTIONS.CLOSE: // Dong cv
          return this.elementAction('close', 'task-manager.label.close')
        case constants.TASK_MANAGER_ACTIONS.UPDATE_PROGRESS: // Cap nhap tien do cv
          return this.elementAction('update-progress', 'task-manager.label.update-progress')
        case constants.TASK_MANAGER_ACTIONS.RESENT_REVIEW:
          return this.elementAction('resent-request', 'task-manager.label.resent-request')
        case constants.TASK_MANAGER_ACTIONS.RESENT_TAKE_OVER:
          return this.elementAction('resent-request', 'task-manager.label.resent-request')
        case constants.TASK_MANAGER_ACTIONS.RESENT_APPROVE:
          return this.elementAction('resent-request', 'task-manager.label.resent-request')
      }
    },
    elementAction(icon, title) {
      return `
          <div class="task__btn-action">
            <i class='task__action-${icon}'></i>
            <span>${this.$t(title)}</span>
          </div>`
    },
    showNotify(type = 'success', content) {
      this.setNotify({
        show: true,
        type,
        content
      })
    },
    async clickAction(action, item, content) {
      // xem cv
      if (action === constants.TASK_MANAGER_ACTIONS.VIEW) {
        this.taskId = item.taskId
        this.listActionsMixin = item.listActions
        this.showDialogDetail()
      }
      // Xoa cv
      if (action === constants.TASK_MANAGER_ACTIONS.REMOVE) {
        try {
          await TaskService.deleteTask(
            item.taskId
          )
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('task-manager.tool-tip.delete')
            })
          )
          // Goi lai danh sach
          this.searchTask()
        } catch (error) {
          this.showNotify('error', error.message)
        }
      }
      // Huy cv
      if (action === constants.TASK_MANAGER_ACTIONS.CANCEL) {
        try {
          this.formDataAction.taskId = item.taskId
          this.formDataAction.content = content
          await TaskService.cancelTask(
            this.formDataAction
          )
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('task-manager.tool-tip.cancel')
            })
          )
          // Goi lai danh sach
          this.searchTask()
        } catch (error) {
          this.showNotify('error', error.message)
        }
      }
      // Tam dung cv
      if (action === constants.TASK_MANAGER_ACTIONS.PAUSE) {
        try {
          this.formDataAction.taskId = item.taskId
          this.formDataAction.content = content
          await TaskService.pauseTask(
            this.formDataAction
          )
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('task-manager.tool-tip.pause')
            })
          )
          // Goi lai danh sach
          this.searchTask()
        } catch (error) {
          this.showNotify('error', error.message)
        }
      }
      // cap nhat cv
      if (action === constants.TASK_MANAGER_ACTIONS.UPDATE) {
        this.taskId = item.taskId
        this.showDialogEditFromMixin()
      }
      // Xem xet, tiep nhan, duyet, dong
      if (action === constants.TASK_MANAGER_ACTIONS.REVIEW ||
          action === constants.TASK_MANAGER_ACTIONS.TAKE_OVER ||
          action === constants.TASK_MANAGER_ACTIONS.APPROVE ||
          action === constants.TASK_MANAGER_ACTIONS.CLOSE
      ) {
        try {
          this.formDataAction.taskId = item.taskId
          this.formDataAction.status = 'APPROVE'
          this.formDataAction.content = content
          await TaskService.approvalTask(
            this.formDataAction
          )
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('task-manager.tool-tip.approve')
            })
          )
          // Goi lai danh sach
          this.searchTask()
        } catch (error) {
          this.showNotify('error', error.message)
        }
      }
      // Tu choi xem xet, tu choi tiep nhan, tu choi duyet
      if (action === constants.TASK_MANAGER_ACTIONS.DENY_REVIEW ||
          action === constants.TASK_MANAGER_ACTIONS.DENY_TAKE_OVER ||
          action === constants.TASK_MANAGER_ACTIONS.DENY_APPROVE) {
        try {
          this.formDataAction.taskId = item.taskId
          this.formDataAction.status = 'REJECT'
          this.formDataAction.content = content
          await TaskService.approvalTask(
            this.formDataAction
          )
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('task-manager.tool-tip.reject')
            })
          )
          // Goi lai danh sach
          this.searchTask()
        } catch (error) {
          this.showNotify('error', error.message)
        }
      }
      // Dong cv
      if (action === constants.TASK_MANAGER_ACTIONS.CLOSE) {
        try {
          this.formAction.taskStatus = 10
          await TaskService.updateStatus(
            this.formAction
          )
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('contract.tool-tip.close-action')
            })
          )
          // Goi lai danh sach
          this.searchTask()
        } catch (error) {
          this.showNotify('error', error.message)
        }
      }
      // Gui lai yeu cau
      if (action === constants.TASK_MANAGER_ACTIONS.RESENT_REVIEW ||
        action === constants.TASK_MANAGER_ACTIONS.RESENT_TAKE_OVER ||
        action === constants.TASK_MANAGER_ACTIONS.RESENT_APPROVE) {
        try {
          this.formDataAction.taskId = item.taskId
          await TaskService.resentApprovalTask(
            this.formDataAction
          )
          this.showNotify(
            'success',
            this.$t('success', {
              msg: this.$t('task-manager.tool-tip.resent-request')
            })
          )
          // Goi lai danh sach
          this.searchTask()
        } catch (error) {
          this.showNotify('error', error.message)
        }
      }
    },
    compareObject(newData, oldData) {
      if (typeof newData === constants.TYPE_OF_ELEMENT.OBJECT) {
        return Object.keys(newData).length === Object.keys(oldData).length &&
            Object.keys(newData).every((it) =>
              newData[it] === oldData[it]
            )
      } else if (typeof newData === constants.TYPE_OF_ELEMENT.ARRAY) {
        return (newData.length === oldData.length) && newData.every(function(element, index) {
          if (typeof element === constants.TYPE_OF_ELEMENT.OBJECT) {
            return this.compareObject(element, oldData[index])
          } else {
            return newData.join() === oldData.join()
          }
        });
      } else {
        return newData === oldData
      }
    },
    getTextTruncate(val, size) {
      if (val.length > size) {
        return val.substring(0, size) + "...";
      } else {
        return val;
      }
    }
  },
}

