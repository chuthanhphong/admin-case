export default {
  TaskApis: {
    UPLOAD_FILE_MAIN: 'edocument/file/private/upload-main-files',
    UPLOAD_FILE_ATTACHMENT: 'edocument/file/private/upload-attachment-files',
    GET_LIST_TASK: 'task/private/search-tasks',
    GET_TASK_DASHBOARD: 'task/private/get-task-dash-board',
    GET_TASK_DETAIL: 'task/private/get-task-details',
    GET_LIST_GROUPS: 'task/private/get-list-groups-current-user',
    GET_PATICIPATION: 'task/private/find-task-participants?participantType',
    GET_TYPE_WORK: 'task/private/find-task-categories',
    GET_PRIORITY: 'task/private/find-task-priorities',
    POST_NEW_TASK: 'task/private/register-task',
    PUT_TASK_DETAIL: 'task/private/update-task-detail',
    PUT_TASK: 'task/private/update-task',
    UP_LOAD_FILE: 'task/file/private/upload-file-attachment',
    GET_LIST_USERS_CURRENT_USER: 'task/private/get-list-assigner-by-current-user',
    GET_LIST_USERS_ASSIGNED_CURRENT_GROUP: 'task/private/get-list-action-users-by-current-group',
    UPDATE_PROGRESS: '/task/private/update-task-progress',
    APPROVE_TASK: '/task/private/approval',
    RESENT_APPROVE_TASK: '/task/private/send-approval',
    GET_LIST_TASK_TYPE: 'core/system-parameter/private/find-system-parameter/TASK_CATEGORY',
    UPDATE_STATUS: 'task/private/update-task-status',
    GET_LIST_ASSOCIATION: '/core/association/private/get-associations',
    GET_GROUP_BY_CURRENT_USER: '/task/private/get-groups-by-current-user',
    CANCEL_TASK: '/task/private/cancel-task',
    PAUSE_TASK: '/task/private/pause-task',
    DOWNLOAD_FILE: '/task/file/private/download',
    DELETE_TASK: '/task/private/remove-task',
    GET_LIST_TYPE_TASK: 'task/private/get-list-task-type',
    CREATE_TYPE_TASK: 'task/private/create-task-type',
    UPDATE_TYPE_TASK: 'task/private/update-task-type',
    DELETE_TYPE_TASK: 'task/private/remove-task-type',
    GET_MODULE_TASK_DASHBOARD: 'task/private/get-module-task-dashboard'
  }
}
