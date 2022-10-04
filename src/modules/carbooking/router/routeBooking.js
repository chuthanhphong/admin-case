/* eslint-disable key-spacing */
import routeNames from "./routeNames";
import routePaths from "./routePaths";
import ListBooking from "@/modules/carbooking/views/list-booking/ListBooking";
import DetailBooking from "@/modules/carbooking/views/detail-booking/DetailBooking";

export const routeBooking = [
  {
    name: routeNames.LIST_BOOKING_CAR,
    path: routePaths.LIST_BOOKING_CAR_PATH,
    component: ListBooking
  },
  {
    name: routeNames.DETAIL_BOOKING,
    path: routePaths.DETAIL_BOOKING_PATH,
    component: DetailBooking
  },
];
