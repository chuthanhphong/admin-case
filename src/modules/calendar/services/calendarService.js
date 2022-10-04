import { BaseService } from '@/services/baseService'
import { ErrorWrapper, ResponseWrapper } from '@/services/util'
import Apis from './apis'
import { formatQuery } from '@/helpers/utils'

export class CalendarService extends BaseService {
  // load danh sach phong hop
  static async loadMeetingRoom(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CALENDAR.LOAD_MEETING_ROOM}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  //  load danh sach lich dinh ky
  static async loadCycleTypes() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        Apis.CALENDAR.LOAD_CYCLE_TYPES
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  //  danh sach user dau moi
  static async searchInternalExternalUser(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CALENDAR.SEARCH_INTERNAL_EXTERNAL_USER}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // danh sach nguoi tham gia
  static async searchParticipant(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CALENDAR.SEARCH_PARTICIPANT}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }

  // luu lich hop
  static async saveMeeting(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.CALENDAR.SAVE_MEETING, formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.message
        .split('|')
        .map(msg => `<div>${msg}</div>`)
        .join('')
      throw new ErrorWrapper(error, message)
    }
  }
  // danh sach lich hop
  static async getListMeeting(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CALENDAR.LIST_MEETING}?${formatQuery(searchForm)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText
      throw new ErrorWrapper(error, message)
    }
  }
  // tao va gui lich hop
  static async saveAndSendMeeting(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        Apis.CALENDAR.SAVE_AND_SEND_MEETING, formData
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.message
        .split('|')
        .map(msg => `<div>${msg}</div>`)
        .join('')
      throw new ErrorWrapper(error, message)
    }
  }
  // gui lich hop
  static async sendMeeting(meetingId) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.CALENDAR.SEND_MEETING}/${meetingId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.message
        .split('|')
        .map(msg => `<div>${msg}</div>`)
        .join('')
      throw new ErrorWrapper(error, message)
    }
  }

  // lay lich hop chi tiet
  static async getDetailMeeting(meetingId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CALENDAR.GET_DETAIL_MEETING}/${meetingId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.message
      throw new ErrorWrapper(error, message)
    }
  }

  // check duplicate duyet lich man list.
  static async checkDuplicateSendCalendarInList(meetingId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CALENDAR.SEARCH_APPROVING_DUPLICATE_PARTICIPANTS}/${meetingId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.message
      throw new ErrorWrapper(error, message)
    }
  }

  // tu choi duyet lich
  static async rejectMeeting(formData) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.CALENDAR.REJECT_MEETING}?${formatQuery(formData)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.message
      throw new ErrorWrapper(error, message)
    }
  }

  // check duplicate duyet lich man list.
  static async approveMeeting(meetingId) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.CALENDAR.APPROVE_MEETING}/${meetingId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.message
      throw new ErrorWrapper(error, message)
    }
  }

  // lay thong tin de sua
  static async loadDetailMeeting(meetingId) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.CALENDAR.LOAD_DETAIL_MEETING}/${meetingId}`

      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.message
      throw new ErrorWrapper(error, message)
    }
  }

  // gui duyet lich
  static async sentMeeting(meetingId) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.CALENDAR.SENT_MEETING}/${meetingId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data.message
        .split('|')
        .map(msg => `<div>${msg}</div>`)
        .join('')
      throw new ErrorWrapper(error, message)
    }
  }

  // huy lich
  static async cancelMeeting(formData) {
    try {
      const response = await this.requestContract({ auth: true }).put(
        `${Apis.CALENDAR.CANCEL_MEETING}?${formatQuery(formData)}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.message
      throw new ErrorWrapper(error, message)
    }
  }

  // xoa lich
  static async deleteMeeting(meetingId) {
    try {
      const response = await this.requestContract({ auth: true }).delete(
        `${Apis.CALENDAR.DELETE_MEETING}/${meetingId}`
      )
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.message
      throw new ErrorWrapper(error, message)
    }
  }
}
