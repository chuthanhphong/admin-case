export default {
  DOCUMENT: {
    FORMULA_TYPE: 'edocument/system-parameter/private/load-formula-types', // hinh thuc
    SEARCH_CRITERIA: 'edocument/system-parameter/private/load-search-criteria', // bo loc
    DOCUMENT_TYPE: 'edocument/system-parameter/private/load-document-types', // loai van ban
    SEARCH_USER: 'private/search-users', // loai van ban
    LIST_PROMULGATE_DOCUMENT:
  'signature/promulgate/private/search-promulgate-document', // list ban hanh
    PRIORITY: 'system-parameter/private/find-system-parameter/PRIORITY', // do khan
    SECURITY_TYPE:
  'system-parameter/private/find-system-parameter/SECURITY_TYPE', // do mat
    OCCUPATION: 'system-parameter/private/find-system-parameter/OCCUPATION', // nganh
    VIEW_SIGN_FILE: 'signature/document/private/view-sign-file/',
    SEARCH: 'group/private/search-groups', // list don vi ban hanh.
    SEARCH_DOCUMENT: 'edocument/document/private/search-document',
    SUGGEST_NUMBER: 'edocument/promulgate/private/suggest-document-number',
    WARNING_NUMBER: 'edocument/promulgate/private/warning-document-number',
    LOAD_SIGNATURE_DOCUMENT: 'edocument/document/private/load-document',
    SAVE_SIGNATURE_DOCUMENT: 'edocument/document/private/save-signature-document',
    BOOK_GROUP: '/edocument/group/private/get-book-group', // So thuoc don vi
    SEARCH_GROUP: 'edocument/group/private/search-groups', // tim kiem don vi
    SEARCH_SEND_RECEIVE_DOC: "edocument/document/private/search-send-receive-document",
    SEARCH_CRITERIA_BOOK: 'edocument/system-parameter/private/load-search-criteria-send-receive', // bo loc van ban di den.
    SEARCH_USER_BOOK: 'edocument/user/private/search-internal-external-users' // search users create book
  },
  BOOK: {
    SAVE_EXTERNAL_DOCUMENT: 'edocument/document/private/save-external-document'

  },
  MANAGEMENT: {
    SAVE_MANAGEMENT: 'edocument/document/private/save-personal-document', // toa moi van ban ca nhan
    LOAD_MANAGEMENT: 'edocument/document/private/load-document', // load thong tin van ban ca nhan
    MANAGER_SEARCH_COMPANY: 'core/group/private/search-groups', // Tim kiem don vi
    MANAGER_SEARCH_CUSTOMER: 'edocument/user/private/search-users', // Tim kiem nguoi ky
    DELETE_DOCUEMENT: 'edocument/document/private/delete-document',
    LOAD_TRANSFER_GROUP: 'edocument/group/private/find-transfer-groups', // load danh sach don vi
    LOAD_TRANSFER_USER: 'edocument/user/private/find-transfer-users', // load danh sach user
    LOAD_LIST_USER_ROLE: 'edocument/user/private/search-commanders-and-clerical', // load danh sach user co role la ld,vt,gd
    SAVE_TRANSFER_DOCUMENT: 'edocument/transferring/private/transfer-document', // chuyen van ban
    DETAIL_MANAGEMENT: 'edocument/document/private/get-document-detail',
    SEARCH_TRANSFER_USERS: 'edocument/transferring/private/search-transfer-users', // load danh sach nguoi duoc chuyen van ban

    FIND_WAITING_PROCESSL: 'edocument/dashboard/private/find-waiting-process', // load list dashboard
    COUNT_DASHBOARD: 'edocument/dashboard/private/perform-statistic', // count dashboard
    VIEW_FILE_DOCUMENT: 'edocument/file/private/view-sign-file', // view file ky
    UPDATE_READ_DOC: 'edocument/transferring/private/update-read-date', // update da doc van ban
    REVOKE_DOCUMENT: 'edocument/transferring/private/revoke-document', // thu hoi
    TREE_TRANSFER: 'edocument/transferring/private/get-transfer-tree',
    RECEIVE_USER: 'edocument/transferring/private/search-receive-users'
  },
  LIBRARY: {
    LOAD_TREE_FORMULA: 'edocument/system-parameter/private/load-tree-formula', // load cay hinh thuc
    LOAD_EFFECT_STATUS: 'edocument/system-parameter/private/load-effect-status', // load trang thai hieu luc
    LOAD_REPLACE_DOCUMENT: 'edocument/system-parameter/private/load-replace-document', // load van ban thay the
    LOAD_CHILDREN_GROUPS: '/edocument/group/private/load-children-groups',
    LOAD_GROUP_SCOPE: 'edocument/group/private/find-group-scope', // load pham vi su dung
    SEARCH_REPLACEMENT_DOCUMENT: '/edocument/proclaim/private/search-replacement-documents', // VB thay the.
    SAVE_DOCUMENT_PROCLAIM: '/edocument/proclaim/private/save-document-proclaim', // Luu thong tin thu vien.
    SEARCH_PROCLAIM_DOCUMENT: 'edocument/proclaim/private/search-proclaim-documents', // danh sach thu vien
    DELETE_LIBRARY: 'edocument/proclaim/private/delete-document-proclaim/', // go thu vien
    LOAD_LIBRARY_INFO: 'edocument/proclaim/private/get-document-proclaim-detail' // load thong tin thu vien
  },
  FileApis: {
    UPLOAD: 'file/private/upload',
    DOWNLOAD: 'edocument/file/private/download',
    UPLOAD_MUTIPLE: 'file/private/upload-multiple',

    UPLOAD_IMG_SIGN: 'signature/file/private/upload-image-signature',
    UPLOAD_FILE_MAIN: 'edocument/file/private/upload-main-files',
    UPLOAD_FILE_ATTACHMENT: 'edocument/file/private/upload-attachment-files'
  }
}
