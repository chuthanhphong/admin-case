import constants from '@/constants'
import commonRoute from '@/router/routePaths'
import econtractRoute from '@/modules/econtract/router/routePaths'
import etaskRoute from '@/modules/etask/router/routePaths'
import ticketRoute from '@/modules/ticket/router/routePaths'
import edocumentRoute from '@/modules/edocument/router/routePaths'
import esignatureRoute from '@/modules/esignature/router/routePaths'
import calendarRoute from '@/modules/calendar/router/routePaths'
import bookingRoute from '@/modules/carbooking/router/routePaths'

export default [
  {
    enable: true,
    moduleRoles: [...constants.MODULE_ROLES.CORE],
    role: null,
    ignoreRole: null,
    icon: "icon-tongquan",
    iconType: "feather",
    title: "menubar.home",
    to: `${constants.ROOT_PATH}`,
    order: 0,
  },
  {
    enable: true,
    role: [
      constants.USER_ROLE.HDDT,
      constants.USER_ROLE.ROLE_ADMIN,
      constants.USER_ROLE.NV,
      constants.USER_ROLE.LD,
      constants.USER_ROLE.GD,
      constants.USER_ROLE.VT
    ],
    moduleRoles: [...constants.MODULE_ROLES.SIGNAGTURE],
    ignoreRole: null,
    icon: 'icon-kydt',
    title: 'menubar.esignature.moduleName',
    iconType: 'feather',
    group: `${esignatureRoute.DOCUMENT_LIST_PATH}`,
    href: `${esignatureRoute.ESIGNATURE_DASHBOARD}`,
    isReload: true,
    children: [
      // {
      //   role: null,
      //   moduleRoles: [...constants.MODULE_ROLES.SIGNAGTURE],
      //   ignoreRole: null,
      //   icon: "icon-home",
      //   iconType: "feather",
      //   title: "home-dashboard",
      //   to: "dashboard",
      //   path: esignatureRoute.ESIGNATURE_DASHBOARD,
      // },
      {
        enable: true, role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.ROLE_ADMIN,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.SIGNAGTURE],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: 'menubar.esignature.documentSubmit',
        to: 'created',
        path: esignatureRoute.DOCUMENT_LIST_CREATE_PATH,
        iconType: 'mdi'
      },
      {
        enable: true, role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.ROLE_ADMIN,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.SIGNAGTURE],
        icon: 'icon-tag-new',
        title: 'menubar.esignature.documentHandle',
        to: 'process',
        path: esignatureRoute.DOCUMENT_LIST_PROCESS_PATH,
        iconType: 'ico',
      },
      {
        enable: true,
        ignoreRole: null,
        role: [constants.USER_ROLE.LD, constants.USER_ROLE.GD, constants.USER_ROLE.VT],
        moduleRoles: [...constants.MODULE_ROLES.SIGNAGTURE],
        icon: 'icon-tag-new',
        title: 'menubar.esignature.proclaim',
        to: 'proclaim',
        path: esignatureRoute.DOCUMENT_LIST_PROCLAIM_PATH,
        iconType: 'mdi'
      },
      {
        enable: true,
        ignoreRole: null,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.ROLE_ADMIN,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.SIGNAGTURE],
        icon: 'icon-tag-new',
        title: 'menubar.esignature.flow',
        to: 'flows',
        path: `${esignatureRoute.LIST_FLOWS_PATH}`,
        iconType: 'mdi'
      }
    ]
  },
  {
    enable: true,
    role: null,
    moduleRoles: [...constants.MODULE_ROLES.ECONTRACT],
    ignoreRole: null,
    icon: "icon-hddt",
    title: "menubar.econtract.moduleName",
    iconType: "feather",
    href: `${econtractRoute.ECONTRACT_DASHBOARD_PATH}`,
    group: econtractRoute.LIST_CONTRACT_PATH,
    children: [
      {
        enable: true,
        role: [constants.USER_ROLE.HDDT],
        ignoreRole: constants.USER_ROLE.ROLE_ADMIN,
        moduleRoles: [...constants.MODULE_ROLES.ECONTRACT],
        icon: 'icon-tag-new',
        title: "menubar.econtract.created",
        to: "created",
        path: econtractRoute.LIST_CONTRACT_CREATED_PATH,
        iconType: "mdi",
      },
      {
        enable: true,
        role: null,
        ignoreRole: constants.USER_ROLE.ROLE_ADMIN,
        moduleRoles: [...constants.MODULE_ROLES.ECONTRACT],
        icon: 'icon-tag-new',
        title: "menubar.econtract.process",
        to: "process",
        path: econtractRoute.LIST_CONTRACT_PROCESS_PATH,
        iconType: "mdi",
      },
      {
        enable: true,
        role: null,
        ignoreRole: constants.USER_ROLE.ROLE_ADMIN,
        moduleRoles: [...constants.MODULE_ROLES.ECONTRACT],
        icon: 'icon-tag-new',
        title: "menubar.econtract.coordinator",
        to: "coordination",
        path: econtractRoute.LIST_CONTRACT_COORDINATION_PATH,
        iconType: "mdi",
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.MAIN,
          constants.USER_ROLE.CONCURRENTLY,
          constants.USER_ROLE.OTHER,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
        ],
        ignoreRole: constants.USER_ROLE.ROLE_ADMIN,
        moduleRoles: [...constants.MODULE_ROLES.ECONTRACT],
        icon: 'icon-tag-new',
        title: "menubar.econtract.contract-manager",
        to: "digitzations",
        path: econtractRoute.LIST_CONTRACT_DIGIT_PATH,
        iconType: "feather",
      },
      {
        enable: true,
        role: [constants.USER_ROLE.HDDT],
        moduleRoles: [...constants.MODULE_ROLES.ECONTRACT],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: "menubar.econtract.flow",
        to: 'flows',
        path: econtractRoute.LIST_FLOWS_PATH,
        iconType: "feather",
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.ROLE_ADMIN,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.HDDT,
        ],
        moduleRoles: [...constants.MODULE_ROLES.ECONTRACT],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: "menubar.econtract.report",
        to: 'report',
        path: econtractRoute.REPORT_PATH,
        iconType: "feather",
      },
    ]
  },
  {
    enable: true,
    role: [
      constants.USER_ROLE.HDDT,
      constants.USER_ROLE.ROLE_ADMIN,
      constants.USER_ROLE.NV,
      constants.USER_ROLE.LD,
      constants.USER_ROLE.GD,
      constants.USER_ROLE.VT
    ],
    moduleRoles: [...constants.MODULE_ROLES.EDOCUMENT],
    ignoreRole: null,
    icon: 'icon-vanban',
    title: 'menubar.edocument.moduleName',
    iconType: "feather",
    href: `${edocumentRoute.DOCUMENT_DASHBOARD}`,
    group: `${edocumentRoute.DOCUMENT_PATH}`,
    children: [
      // {
      //   role: null,
      //   moduleRoles: [...constants.MODULE_ROLES.EDOCUMENT],
      //   ignoreRole: null,
      //   icon: "icon-home",
      //   iconType: "feather",
      //   title: "home-dashboard",
      //   to: "dashboard",
      //   path: edocumentRoute.DOCUMENT_DASHBOARD,
      // },
      {
        enable: true,
        role: [constants.USER_ROLE.VT],
        moduleRoles: [...constants.MODULE_ROLES.EDOCUMENT],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: 'menubar.edocument.documentFrom',
        to: 'books',
        path: edocumentRoute.DOCUMENT_BOOK_PATH,
        iconType: 'mdi'
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.ROLE_ADMIN,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.EDOCUMENT],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: 'menubar.edocument.documentManager',
        to: 'managements',
        path: edocumentRoute.DOCUMENT_MANAGEMENT_PATH,
        iconType: 'icon'
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.EDOCUMENT],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: 'menubar.edocument.library',
        to: 'libraries',
        path: edocumentRoute.DOCUMENT_LIBRARY_PATH,
        iconType: 'icon'
      }
      // {
      //   role: null,
      //   moduleRoles: [...constants.MODULE_ROLES.EDOCUMENT],
      //   ignoreRole: null,
      //   icon: 'icon-document-userGroup',
      //   title: 'managerGroupUser',
      //   to: 'user-group',
      //   path: edocumentRoute.DOCUMENT_USER_GROUP_PATH,
      //   iconType: 'icon'
      // }
    ]
  },
  {
    enable: true,
    role: [
      constants.USER_ROLE.HDDT,
      constants.USER_ROLE.ROLE_ADMIN,
      constants.USER_ROLE.NV,
      constants.USER_ROLE.LD,
      constants.USER_ROLE.GD,
      constants.USER_ROLE.VT
    ],
    moduleRoles: [...constants.MODULE_ROLES.TASK],
    ignoreRole: null,
    icon: 'icon-congviec',
    title: 'menubar.task-manager.moduleName',
    iconType: 'feather',
    group: `${etaskRoute.TASK_LIST_PATH}`,
    href: `${etaskRoute.TASK_DASHBOARD}`,
    children: [
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.ROLE_ADMIN,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.TASK],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: "menubar.task-manager.perform",
        iconType: "feather",
        to: "perform",
        path: etaskRoute.I_PERFORM,
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.ROLE_ADMIN,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.TASK],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: "menubar.task-manager.assign",
        iconType: "feather",
        to: "assign",
        path: etaskRoute.I_ASSIGN,
      },
      {
        enable: true,
        ignoreRole: null,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.ROLE_ADMIN,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.TASK],
        icon: 'icon-tag-new',
        title: 'menubar.task-manager.create',
        iconType: 'feather',
        to: 'create',
        path: etaskRoute.I_CREATE
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.ROLE_ADMIN,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.TASK],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: 'menubar.task-manager.follow',
        iconType: 'feather',
        to: 'follow',
        path: etaskRoute.I_FOLLOW
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD
        ],
        moduleRoles: [...constants.MODULE_ROLES.TASK],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: 'menubar.task-manager.room-work',
        iconType: 'feather',
        to: 'room-work',
        path: etaskRoute.ROOM_WORK
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.ROLE_ADMIN
        ],
        moduleRoles: [...constants.MODULE_ROLES.TASK],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: 'menubar.task-manager.type-task',
        iconType: 'feather',
        to: 'type-task',
        path: etaskRoute.TYPE_TASK
      }
    ]
  },
  {
    enable: true,
    role: [
      constants.USER_ROLE.HDDT,
      constants.USER_ROLE.NV,
      constants.USER_ROLE.LD,
      constants.USER_ROLE.GD,
      constants.USER_ROLE.VT,
      constants.USER_ROLE.TICKET
    ],
    moduleRoles: [...constants.MODULE_ROLES.TICKET],
    ignoreRole: null,
    icon: 'icon-yeucau',
    title: 'menubar.ticket-manager.moduleName',
    iconType: 'feather',
    href: `${ticketRoute.TICKET_DASHBOARD}`,
    group: `${ticketRoute.REQUEST_TICKET_PATH}`,
    children: [
      // {
      //   role: null,
      //   moduleRoles: [...constants.MODULE_ROLES.TICKET],
      //   ignoreRole: null,
      //   icon: 'icon-ticket-request',
      //   title: 'menubar.ticket-manager.ticket-request',
      //   iconType: '',
      //   group: `${ticketRoute.REQUEST_TICKET_PATH}`,
      //   children: [
      //   ]
      // },
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.TICKET],
        ignoreRole: null,
        icon: "icon-tag-new",
        title: "menubar.ticket-manager.ticket-handle",
        to: "my-perform",
        path: ticketRoute.MY_PERFORM_TICKET_PATH,
        iconType: "icon",
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.TICKET],
        ignoreRole: null,
        icon: "icon-tag-new",
        title: "menubar.ticket-manager.my-request",
        to: "my-request",
        path: ticketRoute.MY_REQUEST_TICKET_PATH,
        iconType: "icon",
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.TICKET],
        ignoreRole: null,
        icon: "icon-tag-new",
        title: "menubar.ticket-manager.my-related",
        to: "my-follow",
        path: ticketRoute.MY_FOLLOW_TICKET_PATH,
        iconType: "icon",
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD
        ],
        moduleRoles: [...constants.MODULE_ROLES.TICKET],
        ignoreRole: null,
        icon: "icon-tag-new",
        title: "menubar.ticket-manager.my-approve",
        to: "my-approve",
        path: ticketRoute.MY_APPROVE_TICKET_PATH,
        iconType: "icon",
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT
        ],
        moduleRoles: [...constants.MODULE_ROLES.TICKET],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: 'menubar.ticket-manager.task-center',
        to: 'task-center',
        path: ticketRoute.TASK_CENTER_TICKET_PATH,
        iconType: ''
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.TICKET,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD
        ],
        moduleRoles: [...constants.MODULE_ROLES.TICKET],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: 'menubar.ticket-manager.department-ticket',
        to: 'department-ticket',
        path: ticketRoute.DEPARTMENT_TICKET_PATH,
        iconType: ''
      },
      {
        enable: true,
        role: [
          constants.USER_ROLE.HDDT,
          constants.USER_ROLE.NV,
          constants.USER_ROLE.LD,
          constants.USER_ROLE.GD,
          constants.USER_ROLE.VT,
          constants.USER_ROLE.TICKET,
        ],
        moduleRoles: [...constants.MODULE_ROLES.TICKET],
        ignoreRole: null,
        icon: "icon-tag-new",
        title: 'menubar.ticket-manager.ticket-type',
        iconType: '',
        to: 'categories',
        path: ticketRoute.CATEGORIES_TICKET_PATH
      },
      // {
      //   role: null,
      //   moduleRoles: [...constants.MODULE_ROLES.TICKET],
      //   ignoreRole: null,
      //   icon: "icon-tag-new",
      //   title: 'menubar.ticket-manager.report',
      //   iconType: '',
      //   to: 'report',
      //   path: ticketRoute.REPORT_TICKET_PATH
      // }
    ]
  },
  {
    enable: true,
    role: null,
    moduleRoles: [...constants.MODULE_ROLES.VEHICLE],
    ignoreRole: null,
    icon: 'icon-xe',
    title: 'menubar.booking.moduleName',
    iconType: 'feather',
    // href: `${bookingRoute.TICKET_DASHBOARD}`,
    group: `${bookingRoute.REQUEST_BOOKING_PATH}`,
    children: [
      {
        enable: true,
        role: null,
        moduleRoles: [...constants.MODULE_ROLES.VEHICLE],
        ignoreRole: null,
        icon: "icon-tag-new",
        title: "menubar.booking.list-booking-car",
        to: "booking-car-list",
        path: bookingRoute.LIST_BOOKING_CAR,
        iconType: "icon",
      },
    ]
  },
  {
    enable: true,
    role: [
      constants.USER_ROLE.HDDT,
      constants.USER_ROLE.NV,
      constants.USER_ROLE.LD,
      constants.USER_ROLE.GD,
      constants.USER_ROLE.VT
    ],
    moduleRoles: [...constants.MODULE_ROLES.CALENDAR],
    ignoreRole: null,
    icon: 'icon-lichhop',
    title: "menubar.calendar.moduleName",
    iconType: "feather",
    // href: `${calendarRoute.CALENDAR_DASHBOARD}`,
    group: `${calendarRoute.CALENDAR_PATH}`,
    children: [
      {
        enable: true,
        role: null,
        moduleRoles: [...constants.MODULE_ROLES.CALENDAR],
        ignoreRole: null,
        icon: 'icon-tag-new',
        title: 'menubar.calendar.meetingSchedule',
        to: 'meetings',
        path: calendarRoute.CALENDAR_MANAGEMENT_MEETING_PATH,
        iconType: 'mdi'
      }
    ]
  },
  {
    role: null,
    moduleRoles: [],
    ignoreRole: null,
    enable: false,
    icon: "icon-tailieu",
    title: "menubar.document-digital.moduleName",
    iconType: "feather",
  },
  {
    role: null,
    moduleRoles: [],
    ignoreRole: null,
    enable: false,
    icon: "icon-quytrinh",
    title: "menubar.procedure.moduleName",
    iconType: "feather",
  },
  {
    role: null,
    moduleRoles: [],
    ignoreRole: null,
    enable: false,
    icon: "icon-congtacphi",
    title: "menubar.business-fee.moduleName",
    iconType: "feather",
  },
  {
    role: null,
    moduleRoles: [],
    ignoreRole: null,
    enable: false,
    icon: "icon-cameraAI",
    title: "menubar.cameraAI.moduleName",
    iconType: "feather",
  },
  {
    role: null,
    moduleRoles: [],
    ignoreRole: null,
    enable: false,
    icon: "icon-taikhoan",
    title: "menubar.human-resource.moduleName",
    iconType: "feather",
  },
  {
    role: null,
    moduleRoles: [],
    ignoreRole: null,
    enable: false,
    icon: "icon-vanphongpham",
    title: "menubar.stationery.moduleName",
    iconType: "feather",
    path: 'none',
  },
  {
    role: null,
    moduleRoles: [],
    ignoreRole: null,
    enable: false,
    icon: "icon-truyenthong",
    title: "menubar.media-news.moduleName",
    iconType: "feather",
  },
  {
    enable: true,
    role: [constants.USER_ROLE.ROLE_ADMIN],
    moduleRoles: [...constants.MODULE_ROLES.CORE],
    ignoreRole: null,
    icon: "icon-quantri",
    title: "menubar.management-admin.moduleName",
    group: commonRoute.ROOT_USER_UNIT,
    iconType: "feather",
    children: [
      {
        enable: true,
        role: [constants.USER_ROLE.ROLE_ADMIN],
        moduleRoles: [...constants.MODULE_ROLES.CORE],
        ignoreRole: null,
        icon: "icon-tag-new",
        title: "menubar.management-admin.unit",
        to: 'group',
        path: commonRoute.GROUP_PATH,
        iconType: "mdi",
      },
      {
        enable: true,
        role: [constants.USER_ROLE.ROLE_ADMIN],
        moduleRoles: [...constants.MODULE_ROLES.CORE],
        ignoreRole: null,
        icon: "icon-tag-new",
        title: "menubar.management-admin.user",
        to: 'user',
        path: commonRoute.USER_PATH,
        iconType: "mdi",
      },
    ]
  },
]
