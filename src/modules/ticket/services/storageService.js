import constants from "@/constants";
import { UserService } from "./userService";
import { GroupService } from "@/services/groupService";
import { PublicTicketService } from "@/modules/ticket/services/publicTicketService";
import {
  HTTP_STATUS_SUCCESS
} from "@/modules/ticket/helpers/ticketUtils";

export class StorageService {
  static async getAllUserOfDomain() {
    var json = localStorage.getItem(constants.ALL_USER_OF_DOMAIN);
    if (json !== null) {
      return JSON.parse(json);
    }

    const response = await UserService.getAllUserOfDomain();
    if (response !== null && response.success) {
      this.setAllUserOfDomain(JSON.stringify(response.data.data));
      return response.data.data;
    }

    return [];
  }

  static setAllUserOfDomain(data) {
    localStorage.setItem(constants.ALL_USER_OF_DOMAIN, data);
  }

  static async getAllGroup() {
    var json = localStorage.getItem(constants.ALL_GROUP);
    if (json !== null) {
      return JSON.parse(json);
    }

    const response = await GroupService.getAllGroup();
    if (response !== null && response.success) {
      this.setAllGroup(JSON.stringify(response.data.data));
      return response.data.data;
    }

    return [];
  }

  static setAllGroup(data) {
    localStorage.setItem(constants.ALL_GROUP, data);
  }

  static async getPriority() {
    var json = localStorage.getItem(constants.PRIORITY_TICKET);
    if (json !== null) {
      return JSON.parse(json);
    }

    const response = await PublicTicketService.getPriority();
    if (response !== null && response.status === HTTP_STATUS_SUCCESS) {
      this.setPrioritys(JSON.stringify(response.data));
      return response.data;
    }

    return [];
  }

  static setPrioritys(data) {
    localStorage.setItem(constants.PRIORITY_TICKET, data);
  }
}
