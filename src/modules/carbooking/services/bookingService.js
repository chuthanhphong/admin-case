import { BaseService } from "@/services/baseService";
import apiBookings from "./apiBookings";
import Apis from '@/services/apis';
import { formatQuery } from '@/helpers/utils';

export class BookingService extends BaseService {
  static async getListBooking(data) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        apiBookings.VehicleApis.GET_LIST_VEHICLE,
        data
      );
      return this.handleSuccess(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  static async getAllUserDomain(searchForm) {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${apiBookings.VehicleApis.GET_ALL_USER_DOMAIN}?${formatQuery(searchForm)}`,
      );
      return this.handleSuccess(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  static async getSeatType() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        apiBookings.VehicleApis.GET_SEAT_TYPE,
      );
      return this.handleSuccess(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  static async uploadFile(formData) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        apiBookings.VehicleApis.UPLOAD_FILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return this.handleSuccess(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  static async bookCar(data) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        apiBookings.VehicleApis.BOOK_CAR,
        data,
      );
      return this.handleSuccess(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  static async getListStatus() {
    try {
      const response = await this.requestContract({ auth: true }).get(
        apiBookings.VehicleApis.GET_LIST_STATUS,
      );
      return this.handleSuccess(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  static async toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  static async downloadImage(formData, type = 'image/png') {
    try {
      const response = await this.requestContract({ auth: true }).get(
        `${Apis.FileApis.DOWNLOAD}?${formatQuery(formData)}`,
        {
          responseType: 'blob'
        }
      )
      const blob = new Blob([response.data], {
        type
      })

      const url = await this.toBase64(blob)
      return url
    } catch (error) {
      console.log(error.message)
      return null
    }
  }
  static async detailBooking(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiBookings.VehicleApis.DETAIL_BOOKING,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async findTransport(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiBookings.VehicleApis.FIND_TRANSPORT_PATH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error)
    }
  }
  static async approve(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiBookings.VehicleApis.APPROVE_TRANSPORT_PATH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error);
    }
  }
  static async updateApprove(data) {
    try {
      const response = await this.requestTicket({ auth: true }).post(
        apiBookings.VehicleApis.UPDATE_APPROVE_TRANSPORT_PATH,
        data
      )
      return this.handleSuccess(response)
    } catch (error) {
      this.handleError(error);
    }
  }
  static async cancelBooking(data) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        apiBookings.VehicleApis.CANCEL_BOOKING,
        data,
      );
      return this.handleSuccess(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  static async rejectBooking(data) {
    try {
      const response = await this.requestContract({ auth: true }).post(
        apiBookings.VehicleApis.REJECT_BOOKING,
        data,
      );
      return this.handleSuccess(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}
