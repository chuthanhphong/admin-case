import moment from "moment";

export const mapValueTypeToCSSClass = [
  {
    value: 1,
    icon: "icon-param",
    code: "INPUT",
  },
  {
    value: 2,
    icon: "icon-alpha",
    code: "TITLE",
  },
  {
    value: 3,
    icon: "icon-number",
    code: "INPUT",
  },
  {
    value: 4,
    icon: "icon-selectbox",
    code: "SELECT",
  },
  {
    value: 5,
    icon: "icon-check",
    code: "CHECK_BOX",
  },
  {
    value: 6,
    icon: "icon-calendar",
    code: "INPUT",
  },
  {
    value: 7,
    icon: "icon-clock",
    code: "INPUT",
  },
  {
    value: 8,
    icon: "icon-upload",
    code: "FILE",
  },
];

export const definedValueType = {
  input: 1,
  title: 2,
  number: 3,
  selectBox: 4,
  checkBox: 5,
  calendar: 6,
  clock: 7,
  file: 8,
};

export const definedStatus = {
  cancelled: -1,
  draft: 0,
  send: 1,
  processing: 2,
  reject_review: 3, // tu choi xem xet
  forward: 4, // duyet chuyen
  waiting_close: 5,
  waiting_review: 6,
  result_approve: 8,
  refuse_close: 9,
  closed: 10,
  all: -99,
};

export const formatDate = (strDate, format) => {
  if (typeof strDate === "undefined") return "";

  return moment.utc(strDate).format(format);
};

export const formatDateLocal = (strDate, format) => {
  if (typeof strDate === "undefined") return "";

  return moment(strDate).format(format);
};

export const formatDateTimeIso = (datetime) => {
  if (typeof datetime === "undefined") return "";

  return moment.utc(datetime).local().format("YYYY-MM-DDTHH:mm:ss");
};

export const replaceComma = (val) => {
  return val.toString().replace(/[,]/g, "");
};

export const isExistSeparation = (val) => {
  return val.toString().indexOf(".") > -1;
};

export const parseValueWithTypeBoolean = (val) => {
  return val ? 1 : 0;
};

export const formatNumber = (value) => {
  if (value === null || value === "") {
    return "";
  }

  const newVal = replaceComma(value);
  if (isNaN(newVal)) return "";

  return newVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getDateNow = () => {
  return new Date(Date.now()).toISOString().substring(0, 10);
};

export const secondsToHm = (d) => {
  d = parseInt(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var hDisplay = h > 0 ? (h < 10 ? "0" + h : h) + "h" : "00h";
  var mDisplay = m > 0 ? (m < 10 ? "0" + m : m) + "m" : "00m";
  return hDisplay + " " + mDisplay;
};

export const getDiffTimeToNow = (dt) => {
  const currentDate = moment().format();
  const expectDate = moment.utc(dt).local().format();
  return moment(currentDate).diff(expectDate, "seconds");
};

export const getEstDateTimeFromStartAndHour = (dt, hour) => {
  return moment(dt).add(hour, "hours");
};

export const getTextTruncate = (val, size) => {
  if (val.length > size) {
    return val.substring(0, size) + "...";
  } else {
    return val;
  }
};

export const FORMAT_DATE_TIME_TICKET = "HH:mm DD/MM/YYYY";
export const FORMAT_DATE_TIME_HM_TICKET = "DD/MM/YYYY HH:mm";
export const FORMAT_DATE_TICKET = "DD/MM/YYYY";
export const PAGE_SIZE = 15;
export const PAGE_SIZE_GROUP = 5;
export const HTTP_STATUS_SUCCESS = 200;
export const PAGE_SIZE_GROUP_VIEW_MORE = 1000;
export const PERIOD_DAYS = 183;

export const definedTicketDetailRedirect = {
  perform: 1,
  request: 2,
  follow: 3,
  task: 4,
  group: 5,
  approve: 6,
};

export const definedPriotity = {
  urgent: 1,
  medium: 2,
  normal: 3,
};

export const definedRoleCodes = {
  ld: "LD",
  admin: "TICKET",
  gd: "GD"
};

export const selectGroupTicketType = {
  receive: 1,
  send: 2,
};

export const definedModuleType = {
  ticket: "TICKET",
  task: "TASK",
  document: "DOCUMENT",
};

export const mapStatusSearchOptions = {
  unfinish: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  closed: [definedStatus.closed],
  all: [definedStatus.all],
  cancelled: [definedStatus.cancelled],
};
