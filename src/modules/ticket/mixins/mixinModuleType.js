import { definedModuleType } from "@/modules/ticket/helpers/ticketUtils";

export default {
  methods: {
    getClassIconByType(type) {
      switch (type) {
        case definedModuleType.document:
          return "icon-document";
        case definedModuleType.ticket:
          return "icon-ticket";
        case definedModuleType.task:
          return "icon-briefcase";
        default:
          return "";
      }
    },
    getTextByType(text) {
      switch (text) {
        case definedModuleType.document:
          return "task-manager.group-request.document";
        case definedModuleType.ticket:
          return "task-manager.group-request.work";
        case definedModuleType.task:
          return "task-manager.group-request.request";
        default:
          return "";
      }
    },
  },
};
