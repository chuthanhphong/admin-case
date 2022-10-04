export default {
  GroupApis: {
    ADD: 'group/private/add',
    LIST: 'public/group/list',
    EDIT: 'group/private/edit',
    SEARCH: 'group/private/search-groups',
    TREE: 'group/private/get-groups-tree',
    GETINFO: 'group/private/group-info',
    REPRESENT: '/group/private/get-represent-group',
    GROUP_REPORT: 'group/private/get-group-search-report',
    FLOW_GROUP: 'group/private/get-group-doc-scope',
    DELETE_GROUP: 'group/private/delete-group'
  },
  LOGIN: {
    LOGIN: 'public/auth/login',
    LOGIN_AGENT: 'public/auth/loginByEmailAndCode',
    RECAPCHAT: 'public/captcha/generateCaptcha',
    FORGOT_PASSWORD: 'public/auth/forget-password',
    LOAD_GLOBAL_MODULES: 'app/modules'
  },
  UserApis: {
    ADD: 'user/private/add',
    LIST: 'private/user/list',
    UPDATE: 'user/private/update',
    SEARCH: 'user/private/search-users',
    LOCK: 'user/private/lock-or-unlock',
    GETINFO: 'user/private/get-user-info',
    CHANGE_PASSWORD: 'user/private/change-password',
    GET_PROFILE: 'user/private/get-user-profile',
    UPDATE_FIRST_LOGIN: 'user/private/update-first-time-login',
    LOCK_OR_UNLOCK: 'user/private/lock-or-unlock',
    UPLOAD_IMAGE_PROFILE: 'user/private/upload-image-profile',
    DELETE_IMAGE_PROFILE: 'user/private/delete-image-profile',
    GET_LIST_POSITION: 'system-parameter/private/find-system-parameter/POSITION',
    FIND_USERS: 'user/private/find-users',
    FIND_POSITION: 'system-parameter/private/find-positions'
  },
  FileApis: {
    DOWNLOAD: 'contract/file/limitless/private/download'
  },
  ROLES: {
    LIST: 'role/private/getAll'
  },
  NOTFICATIONS: {
    NOTFICATION_LIST: 'notification/private/search-user-notification',
    NOTFICATION_UNREAD: 'notification/private/load-unread-notifications',
    NOTFICATION_UPDATE_READ_STATUS: 'notification/private/read-status',
    NOTFICATION_SAVE_FCM_TOKEN: 'notification/private/save-fcm-token'
  },
  CONTRACT: {
    UPLOAD: 'contract/file/private/upload-main-sign-file',
    UPLOAD_IMAGE_SIGN: 'contract/file/private/upload-image-sign',
    UPLOAD_MUTIPLE: 'contract/file/private/upload-file-attachments',
    UPLOAD_FILE_EXTERNAL: 'contract/file/private/upload-file-external',
    LIST: 'contract/document/limitless/private/get-doc-formula',
    SAVE_DOCUMENT: 'contract/document/private/save-document',
    GET_COUNT_CONTRACT: 'contract/document/limitless/private/count-doc-by-state',
    RELASTE_DOCUMENT: '/contract/document/limitless/private/find-related-documents',
    // FILE_SIGN: 'contract/document/private/get-filled-image-file',
    FILE_SIGN: 'contract/document/limitless/private/view-sign-file',
    SIGNATURES_SIGN: 'contract/document/limitless/private/view-contract',
    GET_CA_IMAGE: 'contract/document/limitless/private/get-image-signature',
    SEARCH_DOCUMENT: 'contract/document/limitless/private/search-documents',
    SIGN_CONTRACT: 'contract/document/private/sign-document',
    COORDINATION_CONTRACT: 'contract/document/private/coordinate-contract',
    SEARCH_CONTRACT_DETAIL: 'contract/document/limitless/private/search-detail-contract',
    SEARCH_FLOW: 'contract/document/limitless/private/search-flow-template',
    GET_CONTRACT_DETAIL: 'contract/document/limitless/private/find-all-contract-info',
    CONTRACT_HISTORY: 'contract/document/limitless/private/find-contract-participant',
    FLOW_HISTORY: 'contract/document/limitless/private/find-flow-template-participant',
    // Them nguoi ky nhay, xem xet, ky chinh
    ADD_ADDITIONAL_SIGNERS: 'contract/document/private/add-additional-signers',
    // Tim kiem nguoi ky chinh, ky nhay, xem xet
    FIND_ADDITIONAL_SIGNERS:
      'contract/document/limitless/private/search-additional-signers',
    GET_ADDITIONAL_SIGNERS: 'contract/document/limitless/private/get-additional-signers',
    // Xoa hop dong
    DELETE_CONTRACT: 'contract/document/private/delete-document',
    // Huy luong
    CANCEL_CONTRACT: 'contract/document/limitless/private/cancel-document',
    // Xoa nguoi ky nhay, nguoi xem xet
    REMOVE_ADDITIONAL_SIGNERS:
      'contract/document/private/remove-additional-signers',
    // Doi nguoi ky, nguoi xem xet
    CHANGE_ADDITIONAL_SIGNERS: 'contract/document/private/change-signer',
    // Gui hop dong
    SEND_CONTRACT: 'contract/document/private/send-document',
    // Tu choi dieu phoi
    REJECT_COORDINATING_CONTRACT:
      'contract/document/private/reject-coordinating-contract',
    // Bao cao
    REPORT: 'contract/document/limitless/private/search-contract-report',
    // Lay lai ma dang nhap
    RENEW_CODE: 'contract/document/public/renew-verification-code',
    // Lay danh don vi quan ly
    MANAGER_GROUPS:
      'contract/document/limitless/private/find-external-contract-owner-group',
    // Them moi hop dong
    MANAGER_ADD_CONTRACT: 'contract/document/private/save-external-contract',
    // Lay danhh sach loai hop dop
    MANAGER_CONTRACT_TYPE:
      'core/system-parameter/private/find-system-parameter/CONTRACT_TYPE',
    // Tim kiem cong ty
    MANAGER_SEARCH_COMPANY: 'contract/group/limitless/private/search-groups',
    // Tim kiem cong ty
    MANAGER_SEARCH_CONTRACT: 'contract/manage/limitless/private/search-all-documents',
    // Tim kiem khach hang
    MANAGER_SEARCH_CUSTOMER: 'core/user/private/search-users',
    // Lay thong tin chi tiet hop dong
    MANAGER_CONTRACT_DETAIL: 'contract/manage/limitless/private/search-detail-contract',
    // Lay thong tin chi tiet hop dong update
    MANAGER_CONTRACT_INFO_DETAIL:
      'contract/document/limitless/private/get-external-contract-info',
    // Lay thong tin chi tiet hop dong update
    MANAGER_DELETE_CONTRACT: 'contract/manage/private/delete-external-document',
    // Upload file excel
    MANAGER_UPLOAD_EXCEL: 'contract/manage/private/upload-excel-contract',
    MANAGER_EXCEL_TEMPLATE: 'contract/manage/limitless/private/download-contract-template'
  }
}
