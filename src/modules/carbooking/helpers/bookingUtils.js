import moment from "moment";

export const FORMAT_DATE_TICKET = "DD/MM/YYYY";
export const FORMAT_TIME_TICKET = "HH:mm";
export const PAGE_SIZE = 15;

export const definedStatus = {
  draft: 0,
  waiting_approve: 1,
  approved: 2,
  reject: 3,
  cancelled: 4,
  approve_expired: 5,
};

export const formatDate = (strDate, format) => {
  if (typeof strDate === "undefined") return "";

  return moment.utc(strDate).format(format);
};

export const getDateNow = () => {
  return new Date(Date.now()).toISOString().substring(0, 10);
};

export const getTextTruncate = (val, size) => {
  if (val?.length > size) {
    return val.substring(0, size) + "...";
  } else {
    return val;
  }
};

export const mapStatusSearchOptions = {
  participate: 1,
  create: 2,
  approve: 3,
};
