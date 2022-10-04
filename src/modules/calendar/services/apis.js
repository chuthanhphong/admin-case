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
    DOWNLOAD: 'calendar/file/private/download',
    UPLOAD_MUTIPLE: 'file/private/upload-multiple',

    UPLOAD_IMG_SIGN: 'calendar/file/private/upload-image-signature',
    UPLOAD_FILE_MAIN: 'calendar/file/private/upload-main-files',
    UPLOAD_FILE_ATTACHMENT: 'calendar/file/private/upload-attachment-files'
  },
  ROLES: {
    LIST: 'role/private/getAll'
  },
  CALENDAR: {
    LOAD_MEETING_ROOM: 'calendar/meeting-room/limitless/private/load-meeting-rooms', // phong hop
    LOAD_CYCLE_TYPES: 'calendar/system-parameter/limitless/private/load-cycle-types', // load list lich dinh ky
    SEARCH_INTERNAL_EXTERNAL_USER: 'calendar/user/limitless/private/search-internal-external-users', // danh sach user dau moi
    SEARCH_PARTICIPANT: 'calendar/user/limitless/private/search-meeting-participants', // tim nguoi tham gia

    SAVE_MEETING: 'calendar/meeting/private/save-meeting', // luu lich hop
    LIST_MEETING: 'calendar/meeting/limitless/private/search-meeting', // tim kiem lich hop
    SAVE_AND_SEND_MEETING: 'calendar/meeting/private/save-and-send-meeting', // tao va gui lich hop
    SEND_MEETING: 'calendar/meeting/private/send-meeting', // gui lich hop
    GET_DETAIL_MEETING: 'calendar/meeting/limitless/private/view-meeting-detail', // chi tiet lich hop
    SEARCH_APPROVING_DUPLICATE_PARTICIPANTS: 'calendar/meeting/limitless/private/search-approving-duplicate-participants', // check duplicate duyet lich man list.
    REJECT_MEETING: 'calendar/meeting/private/reject-meeting', // tu choi duyet lich.
    APPROVE_MEETING: 'calendar/meeting/private/approve-meeting', // duyet lich.
    LOAD_DETAIL_MEETING: 'calendar/meeting/limitless/private/load-meeting-detail', // load thong tin de sua
    SENT_MEETING: 'calendar/meeting/private/send-meeting/', // gui duyet lich
    CANCEL_MEETING: '/calendar/meeting/private/cancel-meeting', // huy lich
    DELETE_MEETING: '/calendar/meeting/private/delete-meeting' // xoa lich
  }
}
