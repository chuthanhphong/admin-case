<template>
  <!-- Ten nguoi ky -->
  <div class="participant-item form-group pa-0">
    <div class="d-flex participant-wrap no-wrap">
      <div class="d-flex pt-2 pb-0">
        <div class="d-flex no-wrap flex-left">
          <div
            :class="[
              isShowCheckBox
                ? 'form-group px-0 pt-0 pb-5'
                : 'form-group px-0 pt-0 pb-5',
            ]"
          >
            <div
              class="participant-action mr-1 mt-2"
              :style="showRemove ? '' : 'opacity: 0.3'"
            >
              <btn-remove @on-click="showRemove ? removeSigner() : ''" />
            </div>
          </div>

          <!-- Ten nguoi ky -->
          <div
            :class="[
              isShowCheckBox
                ? 'participant-item form-group pa-0 ml-1'
                : 'participant-item form-group pa-0 ml-1',
            ]"
          >
            <div :class="isShowErrorNameNull ? 'error-red' : 'error-blue'">
              <v-text-field
                v-model="participant.participantName"
                class="calendar-text--body-4"
                outlined
                maxlength="255"
                dense
                required
                :autofocus="isEntered"
                hide-details
                :clearable="checkGroup"
                :readonly="checkGroup"
                :placeholder="$t('calendar.placeholder.participantName')"
                @click:clear="clearSignerName"
                @input="onInputSearchCustomer"
                @blur="closeFilterCustomer"
                @change="onChangeParticipantName"
                @click="selectSigner()"
                @keydown.enter="addSigner()"
              >
              </v-text-field>
              <div v-if="isShowErrorNameNull">
                <span class="mes-error-red">{{ radioGroup === index ? $t('calendar.createMeeting.errorChairManName') : $t('calendar.createMeeting.errorParticipantName') }}</span>
              </div>
              <div v-if="!isShowErrorNameNull && listMeetingDupDetail && listMeetingDupDetail.length">
                <v-menu
                  v-model="menuParticipantsDup"
                  :nudge-width="200"
                  offset-x
                  attach
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      v-bind="attrs"
                      v-on="on"
                    >
                      <span class="time-duplicate" v-html="renderTimeDup()" />
                      <span class="icon-warning" />
                    </div>
                  </template>

                  <v-card>
                    <v-card-title class="d-flex justify-space-between align-center" style="border-bottom: 1px solid #eee;">
                      <div class="title-schedule-duplicate">{{ $t('calendar.createMeeting.schedule-duplicate') }}</div>
                      <v-icon class="close-dialog cursor-pointer" @click="menuParticipantsDup = false">mdi-close</v-icon>
                    </v-card-title>
                    <v-list>
                      <v-list-item v-for="(item, ind) in listMeetingDupDetail" :key="ind">
                        <v-list-item-content>
                          <div class="row">
                            <div class="col-1">
                              <v-tooltip top content-class="tooltip-top">
                                <template v-slot:activator="{ on, attrs }">
                                  <span
                                    class="icon-li"
                                    v-bind="attrs"
                                    :class="item.status === 'PENDING' ? 'icon-li-violet' : 'icon-li-blue'"
                                    v-on="on"
                                  />
                                </template>
                                <span>{{ item.status === 'PENDING' ? $t('calendar.tooltip.pending') : $t('calendar.tooltip.approved') }}</span>
                              </v-tooltip>
                            </div>
                            <div class="col-10">
                              <div
                                class="d-flex align-center mb-3"
                                style="gap: 3px"
                                v-html="renderTimeMeeting(item)"
                              />
                              <div class="title-meeting mb-3" v-html="renderTitleMeeting(item)" />
                              <div class="mb-3" v-html="renderClue(item)" />
                            </div>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </div>
              <div
                v-if="radioGroup == index"
                :class="
                  participant.isPrepare ? 'bg-award-check' : 'bg-award-miss'
                "
                class="bg-award"
              ></div>
              <div v-if="participant.isPrepare" class="bg-ruler"></div>
            </div>
            <div v-show="showFilterCustomer" class="wrap-list-search-user">
              <v-list :autofocus="true" dense>
                <v-list-item-group v-model="selectedCustomer" color="primary">
                  <v-list-item
                    v-for="(user, idx) in listCustomer"
                    :key="idx"
                    two-line
                    class="py-0"
                  >
                    <v-list-item-content class="py-0">
                      <v-list-item-title v-if="user.userId">
                        {{
                          isShowCheckBox ? user.participantName : user.fullName
                        }}
                        ({{ isShowCheckBox ? user.username : user.userName }})
                      </v-list-item-title>
                      <v-list-item-title v-else>{{
                        user.participantName
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ genEmailAndPhone(user) }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ genPositionName(user) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
          </div>
        </div>
        <div class="flex-right pr-1">
          <!-- Email -->
          <div
            v-if="!checkGroup"
            :class="[
              isShowCheckBox
                ? 'form-group pa-0 pl-1'
                : 'form-group pa-0 pl-2 pr-1',
            ]"
          >
            <validation-provider
              v-slot="{ errors }"
              name="participantEmail"
              :rules="participant.email ? ruleEmailNotRequired : ''"
              :vid="`email-${index}`"
            >
              <v-text-field
                ref="signerEmail"
                v-model="participant.email"
                name="email"
                outlined
                dense
                :placeholder="$t('enterEmail')"
                maxlength="255"
                required
                class="calendar-text--body-4"
                :error-messages="errors"
                @change="participant.email = trimSpace(participant.email)"
              />
            </validation-provider>
          </div>
        </div>
        <div v-if="checkGroup" class="mt-2 check-all-group">
          <div class="d-flex">
            <v-checkbox
              v-model="participant.isInviteAllInGroup"
              hide-details
              :label="$t('calendar.createMeeting.allGroup')"
              class="mt-0 pt-0"
            />
            <div class="btn d-flex">
              <v-tooltip right content-class="tooltip-right" max-width="12%">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    color="#22242C"
                    dense
                    class="margin-b1 pl-5"
                    v-on="on"
                  >
                    mdi-information-outline
                  </v-icon>
                </template>
                <div class="checkbox-tooltip">
                  <ul>
                    <li>
                      <span>{{ $t("calendar.createMeeting.tooltip.tooltip-1") }}</span>
                      <img class="ma-auto" src="@/assets/icons/calendar/check-inactive.png">
                      <span>{{ $t("calendar.createMeeting.tooltip.tooltip-2") }}</span>
                    </li>
                    <li>
                      <span>{{ $t("calendar.createMeeting.tooltip.tooltip-3") }}</span>
                      <img class="ma-auto" src="@/assets/icons/calendar/check-active.png">
                      <span>{{ $t("calendar.createMeeting.tooltip.tooltip-4") }}</span>
                    </li>
                  </ul>
                </div>
              </v-tooltip>
            </div>
          </div>
        </div>
        <!-- Phone -->
        <div v-if="!checkGroup" style="width: 150px">
          <!-- Phone -->
          <div
            :class="[
              isShowCheckBox ? 'form-group pa-0 pl-1' : 'form-group pa-0 pl-1',
            ]"
          >
            <v-text-field
              v-model="participant.phone"
              name="phone"
              outlined
              :placeholder="$t('calendar.placeholder.phone')"
              maxlength="15"
              dense
              class="calendar-text--body-4"
              oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
            />
          </div>
        </div>

        <div
          class="pt-1"
          :class="[
            isShowCheckBox
              ? 'form-group px-0 pb-5 pl-5'
              : 'form-group px-0 pl-5 pb-5',
          ]"
          style="width: 60px"
        >
          <v-radio :value="index" color="primary" />
        </div>
        <div v-if="isShowCheckBox" class="form-group pl-6" style="width: 60px">
          <v-checkbox
            v-model="participant.isPrepare"
            class="mt-0"
            color="primary"
          />
        </div>
      </div>
    </div>
    <div v-if="participant.isPrepare" class="note-calendar">
      <div class="form-group px-0 pb-0">
        <v-text-field
          v-model="participant.note"
          name="phone"
          outlined
          :placeholder="$t('calendar.placeholder.content')"
          maxlength="500"
          dense
          class="calendar-text--body-4"
          @change="participant.note = trimSpace(participant.note)"
        />
      </div>
    </div>
  </div>
</template>

<script>
// Contants

// Mixins
import rules from "@/mixins/rules";
import fileMixin from "@/modules/econtract/mixins/fileMixin";

// Components
import BtnRemove from "@/modules/calendar/views/create/components/ButtonRemove.vue";

// Services
import { CalendarService } from "@/modules/calendar/services/calendarService";
import { BookingService } from "@/modules/carbooking/services/bookingService";

export default {
  components: { BtnRemove },
  mixins: [rules, fileMixin],
  props: {
    meetingParticipants: {
      type: Array,
      default: () => [],
    },
    participant: {
      type: Object,
      default: undefined,
    },
    index: {
      type: Number,
      default: undefined,
    },
    showRemove: {
      type: Boolean,
      default: false,
    },
    formdata: {
      type: Object,
      default: undefined,
    },
    radioGroup: {
      type: Number,
      default: undefined,
    },
    isShowCheckBox: {
      type: Boolean,
      default: true,
    },
    isEntered: {
      type: Boolean,
      default: false,
    },
    listMeetingDup: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listCompany: [],
      listCustomer: [],
      showFilterCompany: false,
      showFilterCustomer: false,
      selectedCompany: null,
      selectedCustomer: null,
      tempCompany: null,
      tempCustomer: null,
      keywordTemp: null,
      firstSelect: false,
      groupNameTmp: null,
      listMeetingDupDetail: [],
      menuParticipantsDup: false,
      isShowErrorNameNull: false,
      isShowErrorDup: false
    };
  },
  computed: {
    checkGroup() {
      return !!this.participant.groupType;
    }
  },
  watch: {
    selectedCustomer() {
      if (this.selectedCustomer == null) {
        return;
      }
      var item = this.listCustomer[this.selectedCustomer];
      if (item) {
        this.tempCustomer = item;
      }
      this.participant.groupId = this.tempCustomer.groupId;
      this.participant.userId = this.tempCustomer.userId;
      this.participant.participantName = this.tempCustomer.fullName;
      if (this.isShowCheckBox) {
        this.participant.participantName = this.tempCustomer.participantName;
      }
      this.participant.groupType = this.tempCustomer.groupType;
      this.participant.email = this.tempCustomer.email;
      this.participant.phone = this.tempCustomer.phone;
      this.triggerValidate();
      this.closeFilterCustomer();
      this.$emit("selected-customer", this.participant.userId, this.index);
    },
    listMeetingDup() {
      this.getListMeetingDupDetail()
    }
  },
  created() {},
  methods: {
    genEmailAndPhone(user) {
      if (user.phone) {
        return `${user.email} - ${user.phone}`;
      }
      return user.email;
    },
    genPositionName(user) {
      if (user.positionName) {
        return `${user.positionName} - ${user.groupPathName}`;
      }
      return user.groupPathName ? `${user.groupPathName}` : "";
    },

    triggerValidate() {
      setTimeout(() => {
        this.$emit("validate-duplicates");
      }, 200);
    },

    // xoa nguoi ky
    removeSigner() {
      if (this.meetingParticipants.length <= 1) {
        return;
      }
      this.$emit("remove-participant", this.index);
    },

    // click chon ten nguoi ky
    selectSigner() {
      this.$emit('change-auto-forcus')
      this.keywordTemp = null;
      this.searchCustomer();
      this.isValidParticipantName()
      this.listMeetingDupDetail = []
    },

    trimSpace(val) {
      return val ? val.trim() : "";
    },

    // api tim kiem nguoi ky
    async searchCustomer() {
      if (
        this.participant.participantName &&
        this.participant.participantName.trim() === this.keywordTemp
      ) {
        return;
      }
      this.keywordTemp =
        this.participant.participantName &&
        this.participant.participantName.trim();

      const params = {
        keyword: this.participant.participantName,
      };
      let response;
      if (!this.isShowCheckBox) {
        response = await BookingService.getAllUserDomain(params);
        this.listCustomer = response.data.data ? response.data.data : [];
      } else {
        response = await CalendarService.searchParticipant(params);
        if (response.success) {
          this.listCustomer = response.data ? response.data : [];
          // this.filterCustomers()
        } else {
          console.log(response.messages);
        }
      }
      this.showFilterCustomer = this.listCustomer.length > 0;
    },

    // dong popup show danh sach nguoi ky
    closeFilterCustomer() {
      setTimeout(() => {
        this.showFilterCustomer = false;
      }, 200);
      this.isValidParticipantName()
    },

    // xoa nguoi ky
    clearSignerName() {
      this.participant.email = "";
      this.participant.groupId = "";
      this.participant.phone = "";
      this.participant.participantName = "";
      this.participant.participantId = "";
      this.participant.userId = "";
      this.participant.groupType = null;
      this.isValidParticipantName();
      this.listMeetingDupDetail = []
    },

    // nhap de tim kiem nguoi ky
    onInputSearchCustomer() {
      this.selectedCustomer = null;
      this.participant.participantId = null;
      this.participant.userId = null;
      this.participant.groupId = null;
      setTimeout(() => {
        this.searchCustomer();
      }, 200);
      this.isValidParticipantName()
    },

    addSigner() {
      this.$emit("add-participant");
      this.isValidParticipantName();
      this.listMeetingDupDetail = []
    },
    isValidParticipantName() {
      this.participant.participantName = this.trimSpace(
        this.participant.participantName
      )
      if (!this.participant.participantName) {
        this.isShowErrorNameNull = true
      } else {
        this.isShowErrorNameNull = false
      }
    },
    onChangeParticipantName() {
      this.triggerValidate()
      this.isValidParticipantName();
      this.listMeetingDupDetail = []
    },
    getListMeetingDupDetail() {
      this.listMeetingDupDetail = []
      this.listMeetingDup.filter(
        e => {
          // user
          if (e.userId &&
                this.participant.groupId &&
                e.userId === this.participant.userId &&
                e.groupId === this.participant.groupId) {
            this.listMeetingDupDetail.push(e)
          }
          // group
          if (!e.userId &&
                !this.participant.groupId &&
                this.participant.userId &&
                e.groupId === this.participant.groupId
          ) {
            this.listMeetingDupDetail.push(e)
          }
        }
      )
    },
    renderTimeDup() {
      if (this.listMeetingDup) {
        return this.$t('calendar.createMeeting.duplicate') + " " + this.listMeetingDup[0].startTime.split(" ")[0] + " - " + this.listMeetingDup[0].endTime.split(" ")[0]
      }
      return ''
    },
    renderTimeMeeting(item) {
      return `
          <span class="first-time">
              ${item.startTime.split(" ")[0]}
          </span>
          <span class="end-time">
              ${item.startTime.split(" ")[1]}
          </span>
          <span class="mx-1"> - </span>
          <span class="first-time">
          ${item.endTime.split(" ")[0]}
          </span>
          <span class="end-time">
          ${item.endTime.split(" ")[1]}
          </span>
        `
    },
    renderTitleMeeting(item) {
      return item.participantName
    },
    renderClue(item) {
      return item.contactBy
    }
  },
};
</script>

<style lang="scss" scoped>
.note-calendar {
  width: 520px;
  margin-left: 36px;
}
.flex-left {
  width: 238px;
}
.flex-right {
  max-width: 160px;
  margin-left: 7px;
}
.check-all-group {
  width: 307px;
}
.bg-award {
  background-image: url("../../assets/icons/calendar/award.png");
}
.bg-award-check {
  position: absolute;
  top: -5px;
  right: 30px;
  width: 30px;
  height: 30px;
}

.bg-award-miss {
  position: absolute;
  top: -5px;
  right: 0;
  width: 30px;
  height: 30px;
}

.bg-ruler {
  position: absolute;
  top: -5px;
  right: 0;
  width: 30px;
  height: 30px;
  background-image: url("../../assets/icons/calendar/ruler.png");
}
.participant-wrap {
  ::v-deep(.v-input--checkbox) {
    .v-label {
      text-transform: inherit;
      font-size: 14px;
      font-weight: 600;
      color: #22242c !important;
      text-transform: inherit;
      margin-bottom: 0;
    }
  }
  .participant-item {
    position: relative;
    .wrap-list-search-user {
      border-radius: 8px;
      position: absolute;
      border: 1px solid #c4c4c4;
      z-index: 9;
      width: 200%;
      top: 50px;
      max-height: 220px;
      overflow-y: auto;
      .v-list-item {
        min-height: 45px !important;
        padding: 5px !important;
      }
    }
  }
}

</style>
