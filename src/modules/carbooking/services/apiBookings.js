export default {
  VehicleApis: {
    GET_LIST_VEHICLE: 'vehicle/request/findVehicleRequest',
    GET_ALL_USER_DOMAIN: 'vehicle/user/getAllUserOfDomain',
    GET_SEAT_TYPE: 'vehicle/public/getSeatType',
    UPLOAD_FILE: 'vehicle/file-vehicle/upload-multiple',
    BOOK_CAR: 'vehicle/request/create',
    GET_LIST_STATUS: 'vehicle/public/getVehicleReqStatus',
    DETAIL_BOOKING: 'vehicle/request/detail',
    FIND_TRANSPORT_PATH: 'vehicle/driver/findTransport',
    APPROVE_TRANSPORT_PATH: 'vehicle/request/approve',
    CANCEL_BOOKING: 'vehicle/request/cancel',
    REJECT_BOOKING: 'vehicle/request/deny',
    UPDATE_APPROVE_TRANSPORT_PATH: 'vehicle/request/changeDriveAfterApproved',
  },
};
