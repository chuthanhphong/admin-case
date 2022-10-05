<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="750"
    content-class="dialog-save-calendar"
  >
    <div v-if="showDialog" class="wrap-dialog-save-calendar calendar-font calendar-create">
      <!-- Title -->
      <div class="backgroup-title-create-calendar">
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
        <h3 class="text-left text-capitalize d-block mb-0">
          {{ $t(titleMeeting) }}
        </h3>
      </div>
      <div class="wrap-content-save-calendar">
        <validation-observer ref="observer">
          <v-row class="ma-0 px-2 pt-3">
            <!-- ten lich -->
            <div class="col-12 pb-0">
              <label class="text--label calendar-text--body-4">
                {{ $t("calendar.createMeeting.meetingTitle") }}
              </label>
              <span class="red-1"> *</span>
              <validation-provider
                v-slot="{ errors }"
                name="meetingTitle"
                rules="required"
              >
                <v-text-field
                  v-model="meetingTitle"
                  :placeholder="$t('calendar.placeholder.meetingTitle')"
                  outlined
                  dense
                  autofocus
                  required
                  maxlength="255"
                  :error-messages="errors"
                  class="calendar-text--body-4"
                  @change="meetingTitle = trimSpace(meetingTitle)"
                >
                </v-text-field>
              </validation-provider>
            </div>
          </v-row>
          <!-- phong hop -->
          <v-row class="ma-0 px-2 pt-0">
            <div class="col-12 pt-0">
              <label class="text--label calendar-text--body-4">
                {{ $t("calendar.createMeeting.roomMeeting") }}
              </label>
              <span class="red-1"> *</span>
              <div class="d-flex flex-column py-2 border-wrap-meeting">
                <div class="d-flex">
                  <!-- Don vi xay dung -->
                  <v-col cols="11" class="search-item">
                    <validation-provider
                      v-slot="{ errors }"
                      name="roomMeeting"
                      rules="required"
                    >
                      <v-text-field
                        v-model="roomName"
                        :placeholder="$t('calendar.placeholder.roomMeeting')"
                        outlined
                        dense
                        required
                        maxlength="255"
                        :error-messages="errors"
                        class="calendar-text--body-4"
                        @click:clear="clearRoom"
                        @input="onInputSearchRoom"
                        @blur="closeFilterRoom"
                        @change="roomName = trimSpace(roomName)"
                        @click="selectRoom()"
                      >
                        <vue-feather slot="append" type="search" />
                      </v-text-field>
                    </validation-provider>
                    <div
                      v-show="showFilterRoom"
                      class="wrap-list-search-item search-room"
                    >
                      <v-list dense>
                        <v-list-item-group
                          v-model="selectedRoom"
                          color="primary"
                        >
                          <v-list-item
                            v-for="(room, idx) in lstMeetingRoom"
                            :key="idx"
                            two-line
                            class="py-0"
                          >
                            <v-list-item-content class="py-0">
                              <v-list-item-title>{{
                                room.roomName
                              }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </div>
                  </v-col>
                  <v-col cols="1">
                    <v-btn icon @click="viewMeetingEmpty()">
                      <v-img
                        :src="require('@/assets/icons/viewCalendar.svg')"
                        class="hover--pointer"
                      />
                    </v-btn>
                  </v-col>
                </div>

                <div class="px-3 d-flex">
                  <v-checkbox
                    v-model="isOnlineMeeting"
                    hide-details
                    :label="$t('calendar.createMeeting.roomMeetingOnline')"
                    class="mt-0 pt-0"
                  />
                </div>
              </div>
            </div>
          </v-row>
          <!-- thoi gian hop -->
          <v-row class="ma-0 px-2">
            <div class="col-12">
              <label class="text--label calendar-text--body-4">
                {{ $t("calendar.createMeeting.timeMeeting") }}
              </label>
              <span class="red-1"> *</span>
              <div class="d-flex flex-column py-2 border-wrap-meeting">
                <div class="d-flex px-3">
                  <!-- Don vi xay dung -->
                  <div class="d-flex flex-column" style="width: 210px">
                    <date-picker
                      v-model="timeStartPicker"
                      :time-picker-options="{
                        start: '00:00',
                        step: '00:15',
                        end: '23:45',
                      }"
                      :formatter="momentFormat"
                      :lang="localDate"
                      format="HH:mm"
                      type="time"
                      :class="errorTimeStart ? 'bg-color-error' : ''"
                      placeholder="hh:mm"
                      class="calendar-text--body-4"
                    />
                    <span
                      style="
                        color: #ff5252;
                        font-size: 12px;
                        line-height: 12px;
                        font-weight: 600;
                        margin: 3px 10px 0;
                      "
                    >
                      {{ $t(errorTimeStart) }}
                    </span>
                  </div>
                  <div style="width: 20px" class="d-flex justify-center mt-2">
                    <span> - </span>
                  </div>

                  <div class="d-flex flex-column" style="width: 210px">
                    <date-picker
                      v-model="timeEndPicker"
                      :time-picker-options="{
                        start: '00:00',
                        step: '00:15',
                        end: '23:45',
                      }"
                      :formatter="momentFormat"
                      format="HH:mm"
                      type="time"
                      :lang="localDate"
                      placeholder="hh:mm"
                      class="calendar-text--body-4"
                      :class="errorTimeEnd ? 'bg-color-error' : ''"
                    />
                    <span
                      style="
                        color: #ff5252;
                        font-size: 12px;
                        line-height: 12px;
                        font-weight: 600;
                        margin: 3px 10px 0;
                      "
                    >
                      {{ $t(errorTimeEnd) }}
                    </span>
                  </div>
                  <div class="d-flex flex-column pl-3" style="width: 250px">
                    <v-menu
                      v-model="menuDate"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="270px"
                      max-width="270px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateValue"
                          outlined
                          placeholder="DD/MM/YYYY"
                          dense
                          v-bind="attrs"
                          :error-messages="$t(errorDate)"
                          class="calendar-text--body-4"
                          v-on="on"
                          @click="menuDate = !menuDate"
                        >
                          <template v-slot:append>
                            <img
                              src="@/assets/icons/task/createTask/calendar.png"
                              alt=""
                              class="hover--pointer"
                              @click="menuDate = !menuDate"
                            />
                          </template>
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="datePicker"
                        format="DD/MM/YYYY"
                        :locale="localDate"
                        :min="nowDate"
                        no-title
                        @input="menuDate = false"
                      />
                    </v-menu>
                  </div>
                </div>

                <div class="d-flex px-3 justify-space-between">
                  <div style="width: 250px">
                    <v-checkbox
                      v-model="cycleType"
                      hide-details
                      :label="$t('calendar.createMeeting.cycleType')"
                      class="mt-0 pt-0"
                    />
                  </div>
                  <div style="width: 500px">
                    <v-select
                      v-model="cycleText"
                      :no-data-text="$t('noData')"
                      :placeholder="$t('calendar.placeholder.daily')"
                      outlined
                      attach
                      :menu-props="{
                        bottom: true,
                        offsetY: true,
                      }"
                      :disabled="!cycleType"
                      :items="lstCycleType"
                      item-text="name"
                      item-value="code"
                      dense
                      class="calendar-text--body-4"
                    >
                    </v-select>
                  </div>
                </div>
              </div>
            </div>
          </v-row>

          <!-- thanh phan tham gia -->
          <v-row class="ma-0 px-2 participant-meeting">
            <div class="col-12">
              <label class="text--label calendar-text--body-4">
                {{ $t("calendar.createMeeting.meetingParticipants") }}
              </label>
              <span class="red-1"> *</span>
              <div class="d-flex flex-column py-2 border-wrap-meeting">
                <div class="d-flex">
                  <!-- ten nguoi tham gia -->
                  <v-col cols="10" class="pa-0">
                    <v-row>
                      <v-col cols="1" class="pa-0" />
                      <v-col cols="11" class="pa-0">
                        <label class="calendar-text--body-4">{{
                          $t("calendar.createMeeting.participantName")
                        }}</label>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="2" class="pa-0">
                    <v-row>
                      <v-col cols="5" class="pa-0">
                        <label class="calendar-text--body-4">{{
                          $t("calendar.createMeeting.chairMan")
                        }}</label><span class="red-1">*</span>
                      </v-col>
                      <v-col cols="6" class="pa-0">
                        <label class="calendar-text--body-4">
                          {{ $t("calendar.createMeeting.prepare") }}
                        </label></v-col>
                    </v-row>
                  </v-col>
                </div>

                <div class="d-flex px-3 pt-2">
                  <div class="pa-0 col-12">
                    <template v-for="(item, idx) in meetingParticipants">
                      <div :key="idx">
                        <v-radio-group
                          v-model="radioGroup"
                          class="o-day-la-group pa-0 ma-0"
                          :v-message="false"
                        >
                          <ParticipantsMeeting
                            :participant="item"
                            :index="idx"
                            :radio-group="radioGroup"
                            :show-remove="
                              meetingParticipants.length >= 2 ? true : false
                            "
                            :is-entered="isEntered"
                            :meeting-participants="meetingParticipants"
                            :list-meeting-dup="listParticipantDup"
                            @change-auto-forcus="changeAutoForcus"
                            @remove-participant="removeSigner"
                            @add-participant="addSigner"
                            @validate-duplicates="validateDuplicates"
                          />
                        </v-radio-group>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="d-flex px-3 btn-add-participant">
                  <btn-add
                    :tooltip="$t('calendar.createMeeting.addUserOrGroup')"
                    @on-click="addSigner"
                  />
                </div>
              </div>
            </div>
          </v-row>

          <!-- check trung thanh phan tham gia -->
          <v-row class="ma-0 px-2">
            <div class="col-12 d-flex justify-end align-center pt-0">
              <span class="check-participants" @click="checkParticipants()">
                ({{ $t('calendar.createMeeting.checkParticipants') }})
              </span>
            </div>
          </v-row>

          <!-- dau moi lien he -->
          <v-row class="ma-0 px-2">
            <div class="col-12 search-item pb-0">
              <label class="text--label calendar-text--body-4">
                {{ $t("calendar.createMeeting.pointOfContact") }}
              </label>
              <v-text-field
                v-model="pointOfContact"
                :placeholder="$t('calendar.placeholder.pointOfContact')"
                outlined
                dense
                required
                :readonly="pointOfContactId ? true : false"
                class="calendar-text--body-4"
                clearable
                @click:clear="clearContact"
                @input="onInputSearchContact"
                @blur="closeFilterContact"
                @change="pointOfContact = trimSpace(pointOfContact)"
                @click="selectContact()"
              >
                <vue-feather slot="append" type="search" />
              </v-text-field>
              <div
                v-show="showFilterContact"
                class="wrap-list-search-item search-contact"
              >
                <v-list dense>
                  <v-list-item-group v-model="selectedContact" color="primary">
                    <v-list-item
                      v-for="(contact, idx) in lstPointOfContact"
                      :key="idx"
                      two-line
                      class="py-0"
                    >
                      <v-list-item-content class="py-0">
                        <v-list-item-title>{{ contact.fullName }} ({{
                          contact.userName
                        }})</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ genEmailAndPhone(contact) }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          {{ genPositionName(contact) }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </div>
          </v-row>

          <!-- ghi chu -->
          <v-row class="ma-0 px-2">
            <!-- ten lich -->
            <div class="col-12 py-0">
              <label class="text--label calendar-text--body-4">
                {{ $t("calendar.createMeeting.note") }}
              </label>
              <v-textarea
                v-model="summary"
                rows="3"
                :placeholder="$t('calendar.placeholder.note')"
                maxlength="500"
                counter="500"
                outlined
                dense
                class="calendar-text--body-4"
                @change="summary = trimSpace(summary)"
              >
              </v-textarea>
            </div>
          </v-row>

          <!-- upload file -->
          <v-row class="ma-0 px-2 pt-0">
            <!-- ten lich -->
            <div class="form-group col-12 pt-0">
              <div>
                <label class="calendar-text--body-4 text-label">
                  {{ $t("document.attachments") }}
                </label>
                <div class="d-flex justify-end align-center">
                  <validation-provider
                    ref="providerFileAttachs"
                    :rules="ruleFileAttachsCalender"
                    name="fileAttachsFile"
                  >
                    <input
                      id="fileAttachsInput"
                      ref="fileAttachsInput"
                      type="file"
                      multiple
                      hidden
                      accept=".xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.jpeg,.txt,.msg"
                      @change="selectAttachs"
                    />
                    <ul class="list-files">
                      <li v-for="(file, index) in nameFileAttachs" :key="index">
                        <img
                          :src="getIconFile(`${file.fileName}`)"
                          class="mr-2"
                        />
                        <span>{{ customFileName(file) }}</span>
                        <v-btn
                          :disabled="uploadingFileAttatch"
                          class="remove-attach"
                          icon
                          @click="removeFileAttach(index)"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </li>
                    </ul>
                  </validation-provider>
                  <v-btn
                    outlined
                    class="btn-upload ml-auto"
                    :loading="uploadingFileAttatch"
                    :disabled="uploadingFileAttatch"
                    @click="uploadAttachs"
                  >
                    <v-icon size="30">mdi-upload</v-icon>
                  </v-btn>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="calendar-text--body-2">
                      {{ $t("contract.format") }}: pdf, doc, docx, xlsx, xls,
                      png, jpg, jpeg, txt, msg
                    </div>
                    <div class="text-danger calendar-text--body-2">
                      ({{ $t("contract.fileMax") }} 50MB)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-row>

          <!-- nang cao -->
          <v-row v-if="false" class="ma-0 px-2">
            <div class="col-12">
              <label class="text--label calendar-text--body-4">
                {{ $t("calendar.createMeeting.advance") }}
              </label>
              <div class="d-flex flex-column py-2 border-wrap-meeting">
                <div class="pa-2 d-flex align-center">
                  <v-checkbox
                    v-model="hasMeetingMinute"
                    hide-details
                    :label="$t('calendar.createMeeting.hasMeetingMinute')"
                    class="mt-0 pt-0"
                  />
                </div>
                <div class="pa-2 d-flex align-center">
                  <v-checkbox
                    v-model="isSecurityMeeting"
                    hide-details
                    :label="$t('calendar.createMeeting.isSecurityMeeting')"
                    class="mt-0 pt-0"
                  />
                </div>
                <div class="pa-2 d-flex align-center">
                  <v-checkbox
                    v-model="alarmTime"
                    hide-details
                    :label="$t('calendar.createMeeting.alarmTime')"
                    class="mt-0 pt-0"
                  />
                  <div class="w-100 px-1" style="height: 40px">
                    <v-text-field
                      v-model="redmineTime"
                      dense
                      outlined
                      flat
                      solo
                      :readonly="!alarmTime"
                      class="calendar-text--body-4"
                      maxlength="3"
                      oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
                      @change="onInputRedmine"
                    />
                  </div>
                  <div class="w-100 px-1" style="height: 40px">
                    <v-select
                      v-model="redmineDay"
                      :items="itemDays"
                      item-text="value"
                      :readonly="!alarmTime"
                      attach
                      item-value="code"
                      outlined
                      dense
                    ></v-select>
                  </div>
                  <label class="calendar-text--body-4">{{
                    $t("calendar.createMeeting.alarmType")
                  }}</label>
                </div>
              </div>
            </div>
          </v-row>
        </validation-observer>
      </div>

      <!-- Bottom button -->
      <v-row class="ma-0 d-flex pr-3 justify-end py-4 bottom-create-calendar">
        <v-btn
          rounded
          outlined
          color="primary"
          class="w-150 py-5 text--button mr-7"
          @click="closeDialog"
        >
          {{ $t("cancelLabel") }}
        </v-btn>

        <v-btn
          rounded
          outlined
          color="primary"
          class="w-150 py-5 text--button mr-7"
          :disabled="!isComplete || !validateDuplicates()"
          @click="showDialogSaveDraff()"
        >
          {{ $t("calendar.createMeeting.draft") }}
        </v-btn>

        <v-btn
          rounded
          color="primary"
          class="w-150 py-5 text--button"
          :disabled="!isComplete || !validateDuplicates()"
          @click="showDialogSave()"
        >
          {{ $t("calendar.createMeeting.send") }}
        </v-btn>
      </v-row>
    </div>
    <dialog-confirm-save
      :title-confirm="titleComfirm"
      :show-dialog="showConfirmSave"
      @close-dialog="showConfirmSave = false"
      @accept-action="saveCalendar()"
    />
    <base-preload :dialog="loading" />
  </v-dialog>
</template>

<script>
import filterItems from "@/mixins/filterItems.js";
import rules from "@/mixins/rules";
import { mapActions } from "vuex";
import moment from "moment";
import ParticipantsMeeting from "@/views/components/ParticipantsMeeting.vue";
import BtnAdd from "@/modules/calendar/views/create/components/BtnAdd.vue";
import { CalendarService } from "@/modules/calendar/services/calendarService";
import mixinFile from "@/modules/calendar/views/mixin/mixinFile";
import roomCalendar from "@/modules/calendar/views/mixin/roomCalendar";
import contact from "@/modules/calendar/views/mixin/contact";
import DatePicker from "vue2-datepicker";
import DialogConfirmSave from "@/modules/calendar/views/components/DialogConfirmSave";
import groupBy from "lodash/groupBy";
import { isNull, isEmpty } from "lodash";
import constants from "@/constants";

const initData = {
  participantName: "", // ten nguoi tham gia
  userId: "", // id nguoi tham gia
  groupId: "", // id don vi
  email: "",
  phone: "",
  groupType: "", // check don vi
  isChairMan: false, // chu tri
  isPrepare: false, // chuan bi
  note: "", // ghi chu
  isInviteAllInGroup: false, // moi ca don vi
};
export default {
  name: "DialogSaveMeetingSchedule",
  components: {
    ParticipantsMeeting,
    BtnAdd,
    DatePicker,
    DialogConfirmSave,
  },
  mixins: [filterItems, rules, mixinFile, roomCalendar, contact],
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    meetingId: {
      type: Number,
      default: 0,
    },
    updateMeeting: {
      type: Boolean,
      default: false,
    },
    checkCreateCalendar: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      titleComfirm: null,
      isDraft: false,

      isComplete: false,
      showConfirmSave: false,

      radioGroup: 0,
      loading: false,

      menuDate: false,
      dateValue: null,
      datePicker: null,
      errorDate: null,
      nowDate: null,

      timeStartPicker: null,
      timeEndPicker: null,
      timeStart: null,
      timeEnd: null,
      timeValue: null,

      hasMeetingMinute: false, // bien ban hop
      isSecurityMeeting: false, // cuoc hop bao mat
      alarmTime: null, // thoi gian nhac
      alarmType: null, // loai
      redmineTime: 30,
      redmineDay: "MINUTES",
      itemDays: [
        { code: "MINUTES", value: "Phút" },
        { code: "HOURS", value: "Giờ" },
        { code: "DAYS", value: "Ngày" },
      ],

      meetingParticipants: [
        {
          ...initData,
        },
      ], // thanh phan tham gia
      pointOfContact: null, // dau moi lien he
      pointOfContactId: null,
      summary: null, // ghi chu
      meetingTitle: null, // ten lich hop
      roomId: null, // ip phong hop
      roomName: null, // ten phong hop
      isOnlineMeeting: false, // su dung phong hop online
      cycleType: false, // chu ky lap
      cycleText: "DAILY", // hang ngay

      lstMeetingRoom: [], // danh sach phong hop
      lstCycleType: [], // danh sach lich dinh ky
      lstPointOfContact: [], // danh sach dau moi

      userInfo: null, // information user

      meetingInfo: null, // thong tin lich hop

      momentFormat: {
        // [optional] Date to String
        stringify: (date) => {
          return date ? moment(date).format("HH:mm") : "";
        },
      },
      errorTimeStart: null,
      errorTimeEnd: null,

      isEntered: false,
      listParticipantDup: []
    }
  },

  computed: {
    localDate() {
      return this.$i18n.locale === "vi" ? "vi-VN" : "en-US";
    },
    titleMeeting() {
      if (this.updateMeeting) return "calendar.updateMeeting.title";
      return "calendar.createMeeting.title";
    },
  },

  watch: {
    async showDialog() {
      await this.initData();
      await Promise.all([this.loadCycleTypes()]);
      await this.initDate();
      this.tempContact = null;
      if (this.showDialog) {
        if (this.updateMeeting) {
          await this.getInfoMeeting();
        } else if (this.checkCreateCalendar) {
          this.timeStartPicker = moment(
            this.startDate,
            "HH:mm dd/MM/yyyy"
          ).toDate();
          this.timeEndPicker = moment(
            this.endDate,
            "HH:mm dd/MM/yyyy"
          ).toDate();
          this.dateValue = this.date;
        } else {
          this.tempContact = JSON.parse(
            localStorage.getItem(constants.USER_INFO)
          );

          if (this.tempContact) {
            this.pointOfContact = `${
              this.tempContact.fullName
            } (${this.genEmailAndPhone(this.tempContact)})`;

            this.pointOfContactId = this.tempContact.userId;
          }
        }
      }
    },
    datePicker(date) {
      if (date) this.dateValue = this.formatDate(date);
    },

    dateValue() {
      if (this.dateValue) {
        var isValid = moment(this.dateValue, "DD/MM/YYYY", true).isValid();

        if (!isValid) {
          this.errorDate = "calendar.messError.dateValid";
          this.datePicker = null;
          return;
        }

        if (isValid) {
          this.datePicker = moment(this.dateValue, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          );
          const dateFrom = moment().format("DD/MM/YYYY");
          const diff = moment(dateFrom, "DD/MM/YYYY").diff(
            moment(this.dateValue, "DD/MM/YYYY"),
            "days"
          );
          this.errorDate = null;
          if (diff > 0) {
            this.errorDate = "calendar.messError.compareDate";
            this.datePicker = "";
            return;
          }
        }
      } else {
        this.datePicker = null;
        this.errorDate = "calendar.messError.dateRequired";
      }
      if (this.timeStart) this.validateStartTime();
      if (this.timeEnd) this.validateEndTime();
      this.isValidStep();
    },
    timeStartPicker(dateTime) {
      this.timeStart = null;
      if (dateTime) this.timeStart = moment(dateTime).format("HH:mm");
    },
    timeEndPicker(dateTime) {
      this.timeEnd = null;
      if (dateTime) this.timeEnd = moment(dateTime).format("HH:mm");
    },

    timeStart() {
      if (this.timeStart) {
        this.validateStartTime();
        if (this.timeEnd) this.validateEndTime();
      } else {
        this.timeStart = null;
        this.errorTimeStart = "calendar.messError.timeRequired";
      }

      this.isValidStep();
    },
    timeEnd() {
      if (this.timeEnd) {
        if (this.timeStart) this.validateStartTime();
        this.validateEndTime();
      } else {
        this.timeEnd = null;
        this.errorTimeEnd = "calendar.messError.timeRequired";
      }
      this.isValidStep();
    },
    meetingTitle() {
      this.isValidStep();
    },
    roomName() {
      this.isValidStep();
    },
    pointOfContact() {
      this.isValidStep();
    },
  },

  methods: {
    ...mapActions("layout", ["setNotify"]),
    changeAutoForcus() {
      this.isEntered = true;
    },
    validateStartTime() {
      var isValid = moment(this.timeStart, "HH:mm", true).isValid();
      if (!isValid || this.timeStart === "24:00") {
        this.errorTimeStart = "calendar.messError.timeInvalid";
        return;
      }
      if (isValid) {
        this.errorTimeStart = null;

        if (this.validateDate()) {
          return;
        }
        const timeCurrent = moment().format("HH:mm");
        const diff = moment(this.timeStart, "HH:mm").diff(
          moment(timeCurrent, "HH:mm"),
          "minutes"
        );
        if (diff <= 0) {
          this.errorTimeStart = "calendar.messError.compareTime";
        }
      }
    },

    validateDate() {
      var isValidDay = this.dateValue
        ? moment(this.dateValue, "DD/MM/YYYY", true).isValid()
        : false;
      if (isValidDay) {
        const dateFrom = moment().format("DD/MM/YYYY");
        const diffDay = moment(dateFrom, "DD/MM/YYYY").diff(
          moment(this.dateValue, "DD/MM/YYYY"),
          "days"
        );
        if (diffDay >= 0) {
          return false;
        }
      }
      return true;
    },

    validateEndTime() {
      var isValid = moment(this.timeEnd, "HH:mm", true).isValid();
      if (!isValid || this.timeEnd === "24:00") {
        this.errorTimeEnd = "calendar.messError.timeInvalid";
        return;
      }
      if (isValid) {
        this.errorTimeEnd = null;

        var isValidStartTime = this.timeStart
          ? moment(this.timeStart, "HH:mm", true).isValid()
          : false;

        const timeCurrent = isValidStartTime
          ? this.timeStart
          : moment().format("HH:mm");
        const diff = moment(this.timeEnd, "HH:mm").diff(
          moment(timeCurrent, "HH:mm"),
          "minutes"
        );
        if (diff <= 0) {
          this.errorTimeEnd = isValidStartTime
            ? "calendar.messError.endTime"
            : "calendar.messError.compareTime";
          if (this.validateDate() && !isValidStartTime) {
            this.errorTimeEnd = null;
          }
        }
      }
    },

    checkValidateStart() {
      if (!this.timeStart) {
        this.errorTimeStart = "calendar.messError.timeRequired";
      }
    },

    checkValidateEnd() {
      if (!this.timeEnd) this.errorTimeEnd = "calendar.messError.timeRequired";
    },

    isValidStep() {
      this.isComplete =
        !this.uploadingFileAttatch &&
        !isEmpty(this.meetingTitle) &&
        !isEmpty(this.timeStart) &&
        !isEmpty(this.timeEnd) &&
        isNull(this.errorTimeStart) &&
        isNull(this.errorTimeEnd) &&
        !isEmpty(this.roomName) &&
        isNull(this.errorDate);
    },

    onInputRedmine() {
      if (!this.redmineTime || this.redmineTime <= 0) {
        this.redmineTime = 30;
      }
    },
    showDialogSaveDraff() {
      this.titleComfirm = "calendar.createMeeting.titleComfirmDraft";
      this.draft = true;
      this.showConfirmSave = true;
    },
    showDialogSave() {
      this.titleComfirm = "calendar.createMeeting.titleComfirm";
      this.draft = false;
      this.showConfirmSave = true;
    },

    genDate(date) {
      if (date) {
        if (date.includes(" ")) {
          const timeValue = date.split(" ");
          return timeValue[1];
        }
      } else {
        return null;
      }
    },

    async getInfoMeeting() {
      try {
        this.loading = true;
        const response = await CalendarService.loadDetailMeeting(
          this.meetingId
        );
        this.meetingInfo = response.data;
        if (this.meetingInfo) {
          this.meetingTitle = this.meetingInfo.meetingTitle;
          this.pointOfContact = this.meetingInfo.pointOfContact;
          await this.initFileAttachs(this.meetingInfo);
          this.isOnlineMeeting = this.meetingInfo.onlineMeeting;
          this.summary = this.meetingInfo.summary;
          if (this.meetingInfo.meetingRooms.length > 0) {
            this.roomId = this.meetingInfo.meetingRooms[0].id;
            this.roomName = this.meetingInfo.meetingRooms[0].name;
          }

          if (this.meetingInfo.cycleType !== "ONCE") {
            this.cycleText = this.meetingInfo.cycleType;
            this.cycleType = true;
          }

          this.meetingParticipants = this.meetingInfo.meetingParticipants;
          if (this.meetingInfo.meetingParticipants.length > 0) {
            this.meetingInfo.meetingParticipants.filter((meeting, index) => {
              if (meeting.isChairMan) {
                this.radioGroup = index;
              }
            });
          }
          this.timeStartPicker = moment(
            this.meetingInfo.startTime,
            "HH:mm dd/MM/yyyy"
          ).toDate();
          this.timeEndPicker = moment(
            this.meetingInfo.endTime,
            "HH:mm dd/MM/yyyy"
          ).toDate();
          this.dateValue = this.genDate(this.meetingInfo.startTime);

          this.loading = false;
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },

    async saveCalendar() {
      this.showConfirmSave = false;

      try {
        const params = {};
        params.meetingTitle = this.meetingTitle;
        params.meetingRooms = [];
        const room = {
          roomId: this.roomId,
          roomName: this.roomName,
          isHostRoom: true,
        };
        params.meetingId = this.updateMeeting ? this.meetingId : null;
        params.meetingRooms.push(room);
        params.isOnlineMeeting = this.isOnlineMeeting;
        params.startTime = this.buildDateTime(this.timeStart);
        params.endTime = this.buildDateTime(this.timeEnd);
        params.cycleType = this.cycleType ? this.cycleText : null;
        this.meetingParticipants.map((meeting, index) => {
          meeting.isChairMan = false;
          if (index === this.radioGroup) {
            meeting.isChairMan = true;
          }
        });
        params.meetingParticipants = this.meetingParticipants;
        params.contactBy = this.pointOfContact;
        params.summary = this.summary;
        params.fileAttachments = this.fileAttachments;
        params.hasMeetingMinute = this.hasMeetingMinute || false;
        params.isSecurityMeeting = this.isSecurityMeeting || false;
        params.alarmTime = this.alarmTime || null;
        params.alarmType = this.alarmType || null;
        if (this.draft) {
          await CalendarService.saveMeeting(params);
        } else {
          await CalendarService.saveAndSendMeeting(params);
        }

        var message = "calendar.messSuccess.sendCalendarMeeting";
        if (this.draft) {
          message = "calendar.messSuccess.saveCalendarMeetingDraft";
        }
        this.setNotify({
          show: true,
          type: 'success',
          content: this.$t(message)
        })
        this.$emit('reset-tab-current')
        this.$emit('close-dialog-save', true)
      } catch (error) {
        this.setNotify({
          show: true,
          type: "error",
          content: this.$t(error.message),
        });
      }
    },

    buildDateTime(time) {
      if (this.dateValue && time) {
        return `${this.dateValue} ${time}:00`;
      }
      return null;
    },

    validateDuplicates() {
      const lstMsgError = [];
      const keyUser = this.isDuplicateUser("keyUser");
      if (keyUser && keyUser.isDuplicate) {
        lstMsgError.push(
          `<li>
            ${keyUser.value[0]["val"].participantName}
            (${keyUser.value[0]["val"].email})
            ${this.$t("calendar.messError.duplicate")}
          </li>`
        );
      }
      const keyGroup = this.isDuplicateGroup("keyGroup");
      if (keyGroup && keyGroup.isDuplicate) {
        lstMsgError.push(
          `<li>
            ${keyGroup.value[0]["val"].participantName}
            ${this.$t("calendar.messError.duplicate")}
          </li>`
        );
      }
      if (lstMsgError.length > 0) {
        this.setNotify({
          show: true,
          type: "error",
          content: `<ul>${lstMsgError.join("")}</ul>`,
        });
      }
      let checkUser = true;
      const checkNull = this.meetingParticipants.find(
        (e) => !e.participantName || e.participantName === ""
      );
      if (checkNull) {
        checkUser = false;
      }
      return lstMsgError.length === 0 && checkUser;
    },

    isDuplicateGroup(type) {
      // check trung nguoi ky trong don vi
      this.meetingParticipants.filter((e) => {
        e[type] = "";
        if (e.groupId && e.groupType) {
          e[type] = `${e.groupId}`;
        }
      });
      return this.isDuplicate(type);
    },

    isDuplicateUser(type) {
      // check trung nguoi ky trong don vi
      this.meetingParticipants.filter((e) => {
        e[type] = "";
        if (e.userId) {
          e[type] = `${e.userId}`;
        }
      });
      return this.isDuplicate(type);
    },

    isDuplicate(type) {
      const dataCompare = this.meetingParticipants.filter(
        (e) => e[type] !== ""
      );
      const dataDuplicate = [];
      const groupKey = groupBy(dataCompare, type);
      const keys = Object.keys(groupKey);
      keys.map((k) => {
        if (groupKey[k].length > 1 && k !== "null") {
          dataDuplicate.push({ k, val: groupKey[k][0] });
        }
      });

      return { isDuplicate: dataDuplicate.length > 0, value: dataDuplicate };
    },

    genEmailAndPhone(user) {
      if (user.phone) {
        return `${user.email} - ${user.phone}`;
      }
      return user.email;
    },
    genPositionName(user) {
      if (user.roleName) {
        return `${user.positionName} - ${user.groupPathName}`;
      }
      return `${user.groupPathName}`;
    },
    // load danh sach lich dinh ky
    async loadCycleTypes() {
      try {
        const result = await CalendarService.loadCycleTypes();
        if (result) {
          this.lstCycleType = result.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    trimSpace(val) {
      return val ? val.trim() : "";
    },

    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },

    async initDate() {
      this.dateValue = moment().format("DD/MM/YYYY");
      this.nowDate = moment().format("YYYY-MM-DD");
      this.timeValue = moment().format("HH:mm");
    },

    async initData() {
      this.fileAttachments = [];
      this.uploadingFileAttatch = false;
      this.nameFileAttachs = [];
      this.fileAttachs = [];
      this.radioGroup = 0;
      this.loading = false;

      this.menuDate = false;
      this.datePicker = null;
      this.errorDate = null;

      this.timeStartPicker = false;
      this.timeEndPicker = false;
      this.timeStart = null;
      this.timeEnd = null;

      this.errorTimeStart = null;
      this.errorTimeEnd = null;

      this.meetingParticipants = [
        {
          ...initData,
        },
      ]; // thanh phan tham gia
      this.pointOfContact = null; // dau moi lien he
      this.summary = null; // ghi chu
      this.meetingTitle = null; // ten lich hop
      this.roomId = null; // ip phong hop
      this.roomName = null; // ten phong hop
      this.isOnlineMeeting = false; // su dung phong hop online
      this.cycleType = false; // chu ky lap
      this.cycleText = "DAILY"; // hang ngay
      this.lstPointOfContact = [];
      this.pointOfContactId = null;

      this.lstMeetingRoom = []; // danh sach phong hop
      this.lstCycleType = []; // danh sach lich dinh ky

      this.isEntered = false; //
    },

    closeDialog() {
      this.$refs.observer.reset();
      this.$emit("close-dialog-save");
    },
    viewMeetingEmpty() {},
    addSigner() {
      this.meetingParticipants.push({
        ...initData,
      });
    },
    removeSigner(index) {
      this.meetingParticipants.splice(index, 1);
      if (this.radioGroup >= this.meetingParticipants.length) {
        this.radioGroup = 0;
      }
    },
    async checkParticipants() {
      try {
        // check gio bat dau
        if (!this.timeStart) {
          this.setNotify({
            show: true,
            type: 'error',
            content: this.$t('calendar.messError.timeRequired')
          })
          this.errorTimeStart = this.$t('calendar.messError.timeRequired')
          return
        }
        // check gio ket thuc
        if (!this.timeEnd) {
          this.setNotify({
            show: true,
            type: 'error',
            content: this.$t('calendar.messError.timeRequired')
          })
          this.errorTimeEnd = this.$t('calendar.messError.timeRequired')
          return
        }
        // lay ra cac doi tuong can kiem tra
        const arrObject = []
        this.meetingParticipants.filter(
          e => {
            if (e.userId) {
              arrObject.push(e)
            }
          }
        )
        // check thanh phan tham gia
        if (!arrObject) {
          this.setNotify({
            show: true,
            type: 'error',
            content: this.$t('calendar.createMeeting.mesErrorParticipant')
          })
          return
        }
        const params = {}
        params.startTime = this.buildDateTime(this.timeStart)
        params.endTime = this.buildDateTime(this.timeEnd)
        params.meetingParticipants = arrObject
        const str = JSON.parse(JSON.stringify(params))
        this.loading = true
        const response = await CalendarService.searchSavingDuplicateParticipants(str)
        this.listParticipantDup = response.data
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-save-calendar {
  border-radius: 20px !important;
}

.wrap-dialog-save-calendar {
  .btn-add-participant {
    margin-top: -8px;
  }
  .search-item {
    position: relative;
    .wrap-list-search-item {
      border-radius: 8px;
      position: absolute;
      border: 1px solid #c4c4c4;
      z-index: 9;
      width: 96%;

      max-height: 220px;
      overflow-y: auto;
      .v-list {
        padding: 0;
      }
      .v-list-item {
        min-height: 45px !important;
        padding: 5px;
      }
    }
    .search-room {
      top: 60px;
    }
    .search-contact {
      top: 80px;
    }
  }
  .border-wrap-meeting {
    border: 1px solid #e7ecf1;
    border-radius: 8px;
  }

  .wrap-content-save-calendar {
    max-height: calc(100vh - 260px);
    overflow-y: auto;
    background-color: #fff;
  }

  .backgroup-title-create-calendar {
    background-color: #00c3f9;
    box-shadow: 0px 1px 0px #e7ecf1;

    .v-icon {
      color: #fff !important;
    }

    h3 {
      color: #fff !important;
      padding: 15px 0 15px 10px !important;
    }
  }

  .bottom-create-calendar {
    background-color: #f5f7f9;
  }

  .o-day-la-group > .v-input__control > .v-input__slot {
    margin-bottom: 0 !important;
  }
  .o-day-la-group > .v-input__control > .v-messages {
    display: none !important;
  }
  ::v-deep(.v-input--checkbox) {
    .v-label {
      font-size: 14px;
      font-weight: 600;
      color: #22242c !important;
    }
  }
}

.check-participants {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #00C3F9;
  text-decoration: underline;
  cursor: pointer;
}

</style>
