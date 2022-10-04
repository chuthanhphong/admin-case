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
    FORGOT_PASSWORD: 'public/auth/forget-password'
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
    FIND_USERS: 'user/private/find-users',
    GET_LIST_POSITION:
      'system-parameter/private/find-system-parameter/POSITION',
    FIND_POSITION: 'system-parameter/private/find-positions'
  },
  FileApis: {
    UPLOAD: 'file/private/upload',
    DOWNLOAD: 'signature/file/private/download',
    UPLOAD_MUTIPLE: 'file/private/upload-multiple',

    UPLOAD_IMG_SIGN: 'signature/file/private/upload-image-signature',
    UPLOAD_FILE_MAIN: 'signature/file/private/upload-main-files',
    UPLOAD_FILE_ATTACHMENT: 'signature/file/private/upload-attachment-files'
  },
  ROLES: {
    LIST: 'role/private/getAll'
  },
  CONTRACT: {
    LIST: 'contract/document/private/get-doc-formula',
    SAVE_DOCUMENT: 'contract/document/private/save-document',
    GET_COUNT_CONTRACT: 'contract/document/private/count-doc-by-state',
    RELASTE_DOCUMENT: '/contract/document/private/find-related-documents',
    // FILE_SIGN: 'contract/document/private/get-filled-image-file',
    FILE_SIGN: 'contract/document/private/view-sign-file',
    SIGNATURES_SIGN: 'contract/document/private/view-contract',
    GET_CA_IMAGE: 'contract/document/private/get-image-signature',
    SEARCH_DOCUMENT: 'contract/document/private/search-documents',
    SIGN_CONTRACT: 'contract/document/private/sign-document',
    COORDINATION_CONTRACT: 'contract/document/private/coordinate-contract',
    SEARCH_CONTRACT_DETAIL: 'contract/document/private/search-detail-contract',
    SEARCH_FLOW: 'contract/document/private/search-flow-template',
    GET_CONTRACT_DETAIL: 'contract/document/private/find-all-contract-info',
    CONTRACT_HISTORY: 'contract/document/private/find-contract-participant',
    FLOW_HISTORY: 'contract/document/private/find-flow-template-participant',
    // Them nguoi ky nhay, xem xet, ky chinh
    ADD_ADDITIONAL_SIGNERS: 'contract/document/private/add-additional-signers',
    // Tim kiem nguoi ky chinh, ky nhay, xem xet
    FIND_ADDITIONAL_SIGNERS:
      'contract/document/private/system/search-additional-signers',
    GET_ADDITIONAL_SIGNERS: 'contract/document/private/get-additional-signers',
    // Xoa hop dong
    DELETE_CONTRACT: 'contract/document/private/delete-document',
    // Huy luong
    CANCEL_CONTRACT: 'contract/document/private/cancel-document',
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
    REPORT: 'contract/document/private/search-contract-report'
  },
  DOCUMENT: {
    FORMULA_TYPE: 'system-parameter/private/find-system-parameter/FORMULA_TYPE', // hinh thuc
    PRIORITY: 'system-parameter/private/find-system-parameter/PRIORITY', // do khan
    SECURITY_TYPE:
      'system-parameter/private/find-system-parameter/SECURITY_TYPE', // do mat
    OCCUPATION: 'system-parameter/private/find-system-parameter/OCCUPATION', // nganh
    SEARCH: 'signature/document/private/search-document',
    FIND_USERS: 'core/user/private/find-users',
    SAVE_DOCUMENT: 'signature/document/private/save-document',
    LOAD_DOCUMENT: 'signature/document/private/load-signature-document',
    SEND_DOCUMENT: 'signature/document/private/send-document', // Trinh ky van ban
    REMOVE_DOCUMENT: 'signature/document/private/delete-document', // Xoa van ban trinh ky
    DETAIL_DOCUMENT: 'signature/document/private/get-document-detail',
    VIEW_DOCUMENT_INFO: 'signature/document/private/view-document-info', // View file ky
    VIEW_SIGN_FILE: 'signature/document/private/view-sign-file',
    SIGN_DOCUMENT: 'signature/document/private/sign-document',
    COUNT_DOCUMENT: 'signature/document/private/count-unprocessed-document',
    COUNT_DOC_BY_STATE: 'signature/dashboard/private/count-document-by-state', // Count dashboard
    FIND_PENDING_DOC:
      'signature/dashboard/private/find-pending-documents-dashboard', // list document dashboard.
    CANCEL_DOCUMENT: 'signature/document/private/cancel-document',
    GET_CA_IMAGE: 'signature/document/private/get-image-signature',
    CHANGE_SIGNER_BY_CREATOR:
      'signature/document/private/change-signer-by-creator',
    CHANGE_SIGNER_BY_SIGNER:
      'signature/document/private/change-signer-by-signer',
    ADD_FLASHER: 'signature/document/private/add-flashes',
    ADD_REVIEWER: 'signature/document/private/add-reviewer',
    LOAD_ADDITIONAL_SIGNER: 'signature/document/private/load-additional-signer',
    REMOVE_FLASHER: 'signature/document/private/remove-flashes',
    REMOVE_REVIEWER: 'signature/document/private/remove-reviewer',

    LIST_PROMULGATE_DOCUMENT:
      'signature/promulgate/private/search-promulgate-document', // list ban hanh
    GET_SCOPE_TEMPLATE:
      'signature/template-flow/private/get-scope-of-use-template-flow',
    PROMULGATE_DOCUMENT: 'signature/promulgate/private/promulgate-document', // ban hanh van ban
    SUGGEST_DOC_NUM: 'signature/promulgate/private/suggest-document-number', // So van ban
    CANCEL_PROMULGATE_DOCUMENT:
      'signature/promulgate/private/cancel-promulgate-document', // huy ban hanh
    SAVE_DOCUMENT_TEMPLATE: 'signature/template-flow/private/save-document', // luu luong mau

    LIST_DOCUMENT_TEMPLATE:
      'signature/template-flow/private/search-template-flows', // list luong mau
    LOAD_DOCUMENT_TEMPLATE:
      'signature/template-flow/private/load-signature-document', // load thong tin luong mau
    GET_DETAIL_DOCUMENT_TEMPLATE:
      'signature/template-flow/private/get-document-detail', // chi tiet luong mau
    REMOVE_TEMPLATE: 'signature/template-flow/private/delete-template-flow', // remove template flow

    CHANGE_PROMULGATE: 'signature/promulgate/private/change-promulgate-group', // doi don vi ban hanh
    WARNING_PROMULGATE:
      'signature/promulgate/private/warning-promulgate-register-number', // canh bao so dang ky
    GET_PROMULGATE_INFORMATION:
      'signature/promulgate/private/get-promulgate-information', // api thong tin ban hanh
    LOAD_COPY_DOCUMENT: 'signature/document/private/load-copy-document'
  }
}
