<template>
  <v-dialog v-model="isDialogShow" persistent :width="widthDialog">
    <div id="dialog-bookcar" class="dialog-bookcar">
      <div class="dialog-title">
        <div class="text-title">{{ $t("booking.dialog-create.title") }}</div>
        <v-icon class="close-dialog" @click="onCloseDialog">mdi-close</v-icon>
      </div>
      <v-form ref="form" v-model="formData.validate" lazy-validation>
        <div class="dialog-content">
          <span class="label-input">{{
            $t("booking.dialog-create.label.booking-car")
          }}</span>
          <span style="color: red"> *</span>
          <v-text-field
            v-model="formData.title"
            outlined
            maxlength="200"
            class="text--body-1"
            required
            :placeholder="$t(`booking.dialog-create.label.booking-placeholder`)"
            :autofocus="true"
            :rules="NameRules"
          ></v-text-field>
          <div class="d-flex nowrap">
            <div class="flex-left">
              <span class="label-input">{{
                $t(`booking.dialog-create.label.departure`)
              }}</span>
              <span style="color: red"> *</span>
              <v-text-field
                v-model="formData.departure"
                outlined
                required
                maxlength="500"
                class="text--body-1"
                :rules="departureRules"
                :placeholder="
                  $t(`booking.dialog-create.label.departure-placeholder`)
                "
              ></v-text-field>
            </div>
            <div class="flex-right ml-auto">
              <date-picker
                :is-departure="true"
                :is-clear="isClearTime"
                :label="$t(`booking.dialog-create.label.time-start`)"
                @changeData="onchangeDataStartTime"
                @errorDate="isErrorTime = false"
              />
              <div v-show="isErrorTime" class="error-noti">
                {{ $t(`booking.dialog-create.error.dateTimeStartRules`) }}
              </div>
            </div>
          </div>

          <div class="d-flex nowrap">
            <div class="flex-left">
              <span class="label-input">{{
                $t(`booking.dialog-create.label.destination`)
              }}</span>
              <span style="color: red"> *</span>
              <v-text-field
                v-model="formData.destination"
                outlined
                class="text--body-1"
                maxlength="500"
                required
                :rules="destinationRules"
                :placeholder="
                  $t(`booking.dialog-create.label.destination-placeholder`)
                "
              ></v-text-field>
            </div>
            <div class="flex-right ml-auto">
              <date-picker
                :is-clear="isClearTimeEnd"
                :label="$t(`booking.dialog-create.label.time-end`)"
                @changeData="onchangeDataEndTime"
                @errorDate="isErrorTime = false"
              />
              <div v-show="isErrorTime" class="error-noti">
                {{ $t(`booking.dialog-create.error.dateTimeEndRules`) }}
              </div>
            </div>
          </div>

          <div>
            <span class="label-input">{{
              $t(`booking.dialog-create.label.number-car`)
            }}</span>
            <span style="color: red"> *</span>
            <div class="number-car">
              <div v-for="(i, index) in formData.seats" :key="index">
                <div class="d-flex no-wrap mt-1">
                  <div class="flex-left d-flex nowrap">
                    <div class="pt-1">
                      <btn-remove @on-click="onRemoveCars(index)" />
                    </div>
                    <span class="ml-2 pt-2">
                      {{ $t(`booking.dialog-create.label.car-number`) }}
                      {{ index + 1 }}
                    </span>
                  </div>
                  <div style="max-width: 140px">
                    <v-select
                      v-model="formData.seats[index]"
                      item-text="name"
                      item-value="value"
                      outlined
                      dense
                      hide-details
                      attach=""
                      :items="itemTypeCar"
                      :menu-props="{ contentClass: 'reportYear' }"
                      @change="onChangeSeat(index, $event)"
                    >
                      <template v-slot:append>
                        <v-icon>mdi-chevron-down</v-icon>
                      </template>
                    </v-select>
                  </div>
                </div>
              </div>
              <div
                role="button"
                class="d-flex no-wrap mt-5"
                style="width: max-content"
                @click="onAddCars"
              >
                <img width="24px" src="@/assets/icons/ic-add.svg" alt="" />
                <span class="ml-3">{{
                  $t(`booking.dialog-create.label.car-add`)
                }}</span>
              </div>
            </div>
          </div>
          <div class="mt-5">
            <span class="label-input">{{
              $t(`booking.dialog-create.label.member-join`)
            }}</span>
            <span style="color: red"> *</span>
            <div class="number-persion">
              <div class="d-flex">
                <div class="ml-9 mb-5">
                  <span class="label-input">
                    {{ $t(`booking.dialog-create.label.participantName`) }} ({{
                      meetingParticipants.length
                    }})
                  </span>
                </div>
                <div class="ml-auto p-2">
                  <span class="label-input">{{
                    $t(`booking.dialog-create.label.admin`)
                  }}</span>
                  <span style="color: red"> *</span>
                </div>
              </div>

              <div>
                <template v-for="(item, idx) in meetingParticipants">
                  <div :key="idx">
                    <v-radio-group
                      class="radio-group-section"
                      v-model="radioGroup"
                      :v-message="false"
                      hide-details
                      @change="setParticipantRequest"
                    >
                      <ParticipantsMeeting
                        :participant="item"
                        :isEntered="isEntered"
                        :index="idx"
                        :radio-group="radioGroup"
                        :is-show-check-box="isShowCheckBox"
                        :meeting-participants="meetingParticipants"
                        :show-remove="
                          meetingParticipants.length >= 1 ? true : false
                        "
                        @remove-participant="removeSigner"
                        @add-participant="addSigner"
                        @selected-customer="onChangeParticipantMeeting"
                      />
                    </v-radio-group>
                  </div>
                </template>
              </div>
              <div class="d-flex mt-3">
                <btn-add
                  :tooltip="$t(`booking.dialog-create.label.addUserOrGroup`)"
                  @on-click="addSigner"
                />
              </div>
            </div>
          </div>
          <div class="mt-5">
            <span class="label-input">{{
              $t(`booking.dialog-create.label.description`)
            }}</span>
            <v-textarea
              v-model="formData.description"
              counter="500"
              maxlength="500"
              no-resize
              auto-grow
              rows="1"
              outlined
              class="text--body-1"
              :placeholder="
                $t(`booking.dialog-create.label.description-placeholder`)
              "
            />
          </div>
          <div v-show="isShowSourceTask">
            <source-task :is-show="isShowSourceTask" @sourceTask="setSource" />
          </div>
          <div v-show="isShowContact">
            <select-link
              :is-show="isShowContact"
              @taskAssociations="setRefers"
            />
          </div>
          <div v-show="isShowFileInput" class="flex-column">
            <div>
              <span class="label-input">{{
                $t("booking.dialog-create.label.file")
              }}</span>
            </div>
            <div class="d-flex justify-space-between align-start">
              <validation-provider
                ref="providerFileAttachs"
                :rules="ruleFileTask"
                name="fileAttachs"
              >
                <input
                  id="fileAttachsInput"
                  ref="fileAttachsInput"
                  accept=".xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.jpeg"
                  hidden
                  multiple
                  type="file"
                  @change="selectAttachs"
                />
                <ul class="list-files text--caption">
                  <li v-for="(file, index) in nameFileAttachs" :key="index">
                    <img :src="getIconFile(`${file.fileName}`)" class="mr-2" />
                    <span>{{ customFileName(file) }}</span>
                    <span
                      class="remove-attach"
                      @click="removeFileAttach(index)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </span>
                  </li>
                </ul>
                <div class="d-flex mt-5">
                  <div>
                    <div class="note-up-file">
                      {{ $t("contract.format") }}:
                      pdf,xls,xlsx,doc,docx,jpg,jpeg,png
                    </div>
                    <div class="note-up-file text-danger">
                      ({{ $t("contract.fileMax") }} 50MB)
                    </div>
                  </div>
                </div>
              </validation-provider>
              <v-btn
                :disabled="uploadingFileAttatch"
                :loading="uploadingFileAttatch"
                class="btn-upload ml-auto mr-0"
                outlined
                @click="uploadAttachs"
              >
                <v-icon size="30">mdi-upload</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <div class="footer-actions-fixed">
          <div class="dialog-footer">
<!--            <v-col md="2">-->
<!--              <v-tooltip content-class="tooltip-top" top>-->
<!--                <template v-slot:activator="{ on }">-->
<!--                  <div role="button">-->
<!--                    <div-->
<!--                      :class="[-->
<!--                        isShowSourceTask-->
<!--                          ? 'cl-icon-footer-active'-->
<!--                          : 'cl-icon-footer',-->
<!--                      ]"-->
<!--                      @click="onShowSourceTask"-->
<!--                      v-on="on"-->
<!--                    >-->
<!--                      <v-img-->
<!--                        :src="-->
<!--                          isShowSourceTask-->
<!--                            ? require('@/assets/icons/ic-source-active.svg')-->
<!--                            : require('@/assets/icons/ic-source.svg')-->
<!--                        "-->
<!--                        alt=""-->
<!--                        class="icon-more"-->
<!--                      />-->
<!--                    </div>-->
<!--                    <div :style="{ color: isShowSourceTask ? '#4A50E2' : '' }">-->
<!--                      {{ $t("task-manager.more-choice.source") }}-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </template>-->
<!--                <div>-->
<!--                  {{ $t("booking.dialog-create.tool-tip.source") }}-->
<!--                </div>-->
<!--              </v-tooltip>-->
<!--            </v-col>-->
<!--            <v-col md="2">-->
<!--              <v-tooltip content-class="tooltip-top" top>-->
<!--                <template v-slot:activator="{ on }">-->
<!--                  <div role="button">-->
<!--                    <div-->
<!--                      :class="[-->
<!--                        isShowContact-->
<!--                          ? 'cl-icon-footer-active'-->
<!--                          : 'cl-icon-footer',-->
<!--                      ]"-->
<!--                      @click="onShowLink"-->
<!--                      v-on="on"-->
<!--                    >-->
<!--                      <v-img-->
<!--                        :src="-->
<!--                          isShowContact-->
<!--                            ? require('@/assets/icons/link-active.svg')-->
<!--                            : require('@/assets/icons/ic-link.svg')-->
<!--                        "-->
<!--                        alt=""-->
<!--                        class="icon-more"-->
<!--                      />-->
<!--                    </div>-->
<!--                    <div :style="{ color: isShowContact ? '#4A50E2' : '' }">-->
<!--                      {{ $t("task-manager.more-choice.link") }}-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </template>-->
<!--                <div>-->
<!--                  {{ $t("booking.dialog-create.tool-tip.refer") }}-->
<!--                </div>-->
<!--              </v-tooltip>-->
<!--            </v-col>-->
            <v-col md="2">
              <v-tooltip content-class="tooltip-top" top>
                <template v-slot:activator="{ on }">
                  <div role="button">
                    <div
                      :class="[
                        isShowFileInput
                          ? 'cl-icon-footer-active'
                          : 'cl-icon-footer',
                      ]"
                      @click="onShowFileInput"
                      v-on="on"
                    >
                      <v-img
                        :src="
                          isShowFileInput
                            ? require('@/assets/icons/task/createTask/active/fileactive.png')
                            : require('@/assets/icons/task/createTask/active/file.png')
                        "
                        alt=""
                        class="icon-more"
                      />
                    </div>
                    <div :style="{ color: isShowFileInput ? '#4A50E2' : '' }">
                      {{ $t("task-manager.more-choice.attach") }}
                    </div>
                  </div>
                </template>
                <div>
                  {{ $t("booking.dialog-create.tool-tip.file") }}
                </div>
              </v-tooltip>
            </v-col>
          </div>
          <div
            class="bg-white pt-2 pr-6 pb-2"
            style="
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
            "
          >
            <v-card-actions class="justify-end">
              <v-btn
                class="w-140 py-5 mr-0 mr-md-3 bg-white"
                color="primary"
                outlined
                rounded
                @click="onCloseDialog"
              >
                {{ $t("task-manager.button.cancel") }}
              </v-btn>
              <v-btn
                class="w-140 py-5"
                color="primary"
                rounded
                :disabled="isDisabled"
                @click="onBookCar"
              >
                {{ $t(`booking.dialog-create.label.action-book`) }}
              </v-btn>
            </v-card-actions>
          </div>
        </div>
      </v-form>
    </div>
    <dia-log-confirm
      :loading="loading"
      :obj-confirm="objConfirmTask"
      @close-dialog="objConfirmTask.showDialogConfirm = false"
      @accept-action="acceptClose"
    />
    <base-material-snackbar
      v-model="isShowAlert"
      type="error"
      v-bind="{
        top: true,
        right: true,
      }"
    >
      {{ message }}
    </base-material-snackbar>
  </v-dialog>
</template>
<script>
import DatePicker from "./DatePicker.vue";
import SourceTask from "./SourceTask.vue";
import SelectLink from "./SelectLink.vue";
import ParticipantsMeeting from "@/views/components/ParticipantsMeeting.vue";
import BtnAdd from "@/modules/calendar/views/create/components/BtnAdd.vue";
import BtnRemove from "@/modules/calendar/views/create/components/ButtonRemove.vue";
import fileMixin from "@/modules/econtract/mixins/fileMixin";
import rules from "@/mixins/rules";
import DiaLogConfirm from "@/modules/etask/views/components/DiaLogConfirm";
import constantsLocal from "@/constants";

// Service
import { BookingService } from "@/modules/carbooking/services/bookingService";
import moment from "moment";

const dataParticipants = {
  userId: "",
  participantName: "",
  email: "",
  phone: "",
};

const initData = {
  validate: true,
  title: "",
  departure: "",
  destination: "",
  startTime: "",
  endTime: "",
  seats: [],
  participantRequest: [],
  source: {},
  refers: [],
  fileAttachmentRequests: [],
};

export default {
  components: {
    DatePicker,
    ParticipantsMeeting,
    BtnAdd,
    SourceTask,
    SelectLink,
    BtnRemove,
    DiaLogConfirm,
  },
  mixins: [fileMixin, rules],
  props: {
    widthDialog: {
      type: Number,
      default: 711,
    },
    isDialogShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      objConfirmTask: {
        titleConfirm: "",
        showDialogConfirm: false,
        isReason: false,
        isNull: false,
        comment: "",
      },
      loading: false,
      isEntered: false,
      formData: {
        validate: true,
        title: "",
        departure: "",
        destination: "",
        startTime: "",
        endTime: "",
        seats: [],
        participantRequest: [],
        source: {},
        refers: [],
        fileAttachmentRequests: [],
      },
      isBookingCar: false,
      isErrorTime: false,
      isClearTime: false,
      isClearTimeEnd: false,
      message: "",
      isShowAlert: false,
      isDisabled: true,
      meetingParticipants: [],
      radioGroup: 0,
      isShowCheckBox: false,
      itemSelectType: [],
      persions: 1,
      isShowSourceTask: false,
      isShowFileInput: false,
      isShowContact: false,
      showDialogSelectTaskAssociations: false,
      typeSeat: 4,
      itemTypeCar: [],
      fileAttachs: [],
      nameFileAttachs: [],
      uploadingFileAttatch: false,
      NameRules: [
        (v) => {
          if (!v?.length || !v?.replace(/\s/g, "").length) {
            return this.$t(`booking.dialog-create.error.title-rules`);
          }
          return true;
        },
      ],
      departureRules: [
        (v) => {
          if (!v?.length || !v?.replace(/\s/g, "").length) {
            return this.$t(`booking.dialog-create.error.departure-rules`);
          }
          return true;
        },
      ],
      destinationRules: [
        (v) => {
          if (!v?.length || !v?.replace(/\s/g, "").length) {
            return this.$t(`booking.dialog-create.error.destination-rules`);
          }
          return true;
        },
      ],
    };
  },

  watch: {
    formData: {
      deep: true,
      handler() {
        this.isDisabled = true;
        if (
          this.formData.validate &&
          !this.formData.startTime.includes("Invalid") &&
          !this.formData.endTime.includes("Invalid") &&
          this.formData.startTime !== "" &&
          this.formData.endTime !== ""
        ) {
          this.isDisabled = false;
        }
      },
    },
  },

  created() {
    this.getSeatType();
    this.onAddCars();
    this.setParticipantsDefault();
  },

  methods: {
    onShowSourceTask() {
      this.isShowSourceTask = !this.isShowSourceTask;
      if (this.isShowSourceTask) {
        this.goToBottom();
      }
    },
    onShowLink() {
      this.isShowContact = !this.isShowContact;
      if (this.isShowContact) {
        this.goToBottom();
      }
    },
    onShowFileInput() {
      this.isShowFileInput = !this.isShowFileInput;
      if (this.isShowFileInput) {
        this.goToBottom();
      }
    },
    goToBottom() {
      setTimeout(() => {
        const scroll_to_bottom = document.getElementById("dialog-bookcar");
        scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
      }, 100);
    },

    clearData() {
      this.$refs.form.resetValidation();
      this.formData = { ...initData };
      this.formData.seats = [];
      this.isClearTime = true;
      this.isClearTimeEnd = true;
      this.isShowSourceTask = false;
      this.isShowFileInput = false;
      this.isShowContact = false;
      this.fileAttachs = [];
      this.nameFileAttachs = [];
      this.uploadingFileAttatch = false;
      this.onAddCars();
      this.setParticipantsDefault();
    },
    setSource(data) {
      this.formData.source = {};
      if (data !== null) {
        this.formData.source = {
          sourceId: data.id,
          associationType: data.associationType,
        };
      }
    },
    setRefers(data) {
      this.formData.refers = [];
      data.forEach((it) => {
        this.formData.refers.push({
          sourceId: it.id,
          associationType: it.associationType,
        });
      });
    },
    setParticipantsDefault() {
      this.meetingParticipants = [];
      const user = JSON.parse(localStorage.getItem(constantsLocal.USER_INFO));
      this.meetingParticipants.push({
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        participantName: user.fullName,
      });
      this.setParticipantRequest();
    },
    async onBookCar() {
      this.isBookingCar = true;
      this.objConfirmTask.titleConfirm =
        "booking.dialog-create.confirm.booking-car";
      this.objConfirmTask.showDialogConfirm = true;
    },
    onChangeSeat(index, value) {
      this.formData.seats[index] = value;
    },
    onAddCars() {
      this.formData.seats.push(this.typeSeat);
    },
    onRemoveCars(index) {
      if (this.formData.seats.length <= 1) {
        return;
      }
      this.formData.seats.splice(index, 1);
    },
    async getSeatType() {
      try {
        const res = await BookingService.getSeatType();
        this.itemTypeCar = res.data ? res.data : [];
      } catch (error) {
        console.log(error);
      }
    },
    uploadAttachs() {
      document.getElementById("fileAttachsInput").click();
    },
    removeFileAttach(index) {
      var fileBuffer = new DataTransfer();
      document.getElementById("fileAttachsInput").files = fileBuffer.files;
      this.fileAttachs.splice(index, 1);
      this.nameFileAttachs.splice(index, 1);
      this.formData.fileAttachmentRequests.splice(index, 1);
    },
    async selectAttachs() {
      try {
        this.fileAttachs = [...this.$refs.fileAttachsInput.files];
        const listIndexRemove = [];
        this.nameFileAttachs.map((file, index) => {
          let count = 0;
          this.fileAttachs.map((fileAttach) => {
            if (file.name === fileAttach.name) {
              count++;
            }
          });
          if (count > 1) {
            listIndexRemove.push(index);
          }
        });
        if (listIndexRemove.length > 0) {
          listIndexRemove.map((index) => {
            this.removeFileAttach(index);
          });
        }
        const lstFileValidate = this.fileAttachs.filter((file) => file.name);
        const { valid } = await this.$refs.providerFileAttachs.validate(
          lstFileValidate
        );
        if (!valid) {
          if (this.fileAttachs) {
            this.fileAttachs = this.nameFileAttachs;
          } else {
            this.fileAttachs = [];
            this.nameFileAttachs = [];
          }
          this.$refs.fileAttachsInput.type = "text";
          this.$refs.fileAttachsInput.type = "file";
          this.setNotify({
            show: true,
            type: "warning",
            content: this.$refs.providerFileAttachs.errors[0],
            key: false,
          });
          return;
        } else {
          await this.uploadFileAttachs();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async uploadFileAttachs() {
      if (this.fileAttachs.length === 0) {
        return;
      }
      try {
        this.uploadingFileAttatch = true;
        var formPayload = new FormData();
        this.fileAttachs.map((file) => {
          if (file.name) {
            formPayload.append("files", file);
          }
        });
        const response = await BookingService.uploadFile(formPayload);
        if (response.success) {
          const { data } = response;
          const lstFileName = this.nameFileAttachs.map(
            (file) => file.fileName || file.name
          );
          data.forEach((file) => {
            if (!lstFileName.includes(file.fileName)) {
              this.nameFileAttachs.push(file);
            } else {
              const index = this.nameFileAttachs.findIndex(
                (x) => x.fileName === file.fileName
              );
              this.nameFileAttachs[index] = file;
            }
            this.formData.fileAttachmentRequests.push(file);
          });
        }
      } catch (error) {
        this.fileAttachs = this.fileAttachs.filter((file) => file.fileName);
        var fileBuffer = new DataTransfer();
        this.$refs.fileAttachsInput.files = fileBuffer.files;
        this.setNotify({
          show: true,
          type: "error",
          content: error.message,
          key: false,
        });
      } finally {
        this.uploadingFileAttatch = false;
      }
    },
    onCloseDialog() {
      if (
        this.formData.title !== "" ||
        this.formData.departure !== "" ||
        this.formData.destination !== "" ||
        this.formData.startTime !== "" ||
        this.formData.endTime !== ""
      ) {
        this.isBookingCar = false;
        this.objConfirmTask.titleConfirm =
          "booking.dialog-create.confirm.cancel";
        this.objConfirmTask.showDialogConfirm = true;
        return;
      }
      this.acceptClose();
    },
    async acceptClose() {
      try {
        if (this.isBookingCar) {
          var data = {};
          for (const key in this.formData) {
            if (
              key !== "validate" &&
              (this.formData[key].length ||
                Object.keys(this.formData[key]).length)
            ) {
              data[key] = this.formData[key];
            }
          }
          await BookingService.bookCar(data);
          this.isBookingCar = false;
          this.$emit("book-car-success");
        } else {
          this.$emit("close-dialog");
        }
        this.clearData();
      } catch (error) {
        this.isBookingCar = false;
        this.message = error.toString().replace("Error:", " ");
        this.isShowAlert = true;
      }
    },
    onchangeDataEndTime(data) {
      this.isClearTimeEnd = false;
      const time = moment(data.timePicker).format("HH:mm");
      const date = moment(data.datePicker).format("YYYY-MM-DD");
      this.formData.endTime = `${date} ${time}`;
      this.onValidateTime();
    },
    onchangeDataStartTime(data) {
      this.isClearTime = false;
      const time = moment(data.timePicker).format("HH:mm");
      const date = moment(data.datePicker).format("YYYY-MM-DD");
      this.formData.startTime = `${date} ${time}`;
      this.onValidateTime();
    },
    onValidateTime() {
      const timeStart = new Date(this.formData.startTime.split("-")).getTime();
      const timeEnd = new Date(this.formData.endTime.split("-")).getTime();
      if (isNaN(timeStart) || isNaN(timeEnd)) {
        return;
      }
      if (timeStart >= timeEnd) {
        this.isErrorTime = true;
        return;
      }
      this.isErrorTime = false;
    },
    addSigner() {
      this.meetingParticipants.push({ ...dataParticipants });
      this.setParticipantRequest();
    },
    removeSigner(index) {
      this.meetingParticipants.splice(index, 1);
      this.setParticipantRequest();
    },
    setParticipantRequest() {
      this.formData.participantRequest = [];
      this.meetingParticipants.forEach((it, index) => {
        if (it.userId) {
          this.formData.participantRequest.push({
            userId: it.userId,
            roleType: index === this.radioGroup ? 1 : 2,
          });
        }
      });
    },
    onChangeParticipantMeeting(userId, index) {
      this.meetingParticipants[index].userId = userId;
      this.setParticipantRequest();
      this.isEntered = true;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.v-text-field .v-input__control .v-input__slot) {
  min-height: 40px !important;
  margin-top: 0px;
}

::v-deep(.v-input--selection-controls) {
  margin-top: 0px;
  height: 70px;
}

::v-deep(.mx-input) {
  max-width: 150px;
}

.dialog-bookcar {
  height: 650px;
  overflow-y: auto;
}

.dialog-title {
  width: 711px;
  height: 52px;
  display: flex;
  background: #33cffa;
  justify-content: space-between;
  position: fixed;
  z-index: 100000;
  margin-top: -5px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  .text-title {
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    color: #ffffff;
    padding: 15px 15px 15px 40px;
  }
  .close-dialog {
    color: #ffffff;
  }
}

.dialog-content {
  background: #fff;
  padding: 60px 40px 35px 40px;
  .label-input {
    font-size: 14px;
    color: #22242c;
    font-weight: 600;
    font-size: 14px;
  }
}

.number-persion,
.number-car {
  padding: 15px 10px;
  min-height: 130px;
  height: max-content;
  border-radius: 8px;
  border: 0.5px solid #e7ecf1;
}

.number-persion {
  padding-left: 10px;
}

.dialog-footer {
  padding: 0px 20px 0px 40px;
  background: #e6f9fe;
  display: flex;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  .cl-icon-footer-active,
  .cl-icon-footer {
    margin-left: 10px;
    padding: 5px;
    width: 30px;
    height: 30px;
    border: 0.5px dashed #22242c;
    border-radius: 50%;
  }
  .cl-icon-footer-active {
    border: 0.5px dashed #4a50e2;
  }
}
.flex-left {
  width: 40%;
}
.flex-right {
  padding-left: 18px;
}
.error-noti {
  margin: -25px 0px 0px 10px;
  color: #ff5252;
  caret-color: #ff5252;
  font-size: 12px;
  font-weight: 600;
}
.note-up-file {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
}
.footer-actions-fixed {
  position: fixed;
  bottom: 30px;
  width: 711px;
}
</style>
