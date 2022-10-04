<template>
  <v-container>
    <v-row
      class="d-flex children-task flex-row align-center ml-3"
    >
      <v-col class="ml-8  align-center pr-0 mt-4 cursor-pointer" md="1">
        <img
          :src="require('@/assets/icons/task/detailTask/check.png')"
          alt=""
          class="hover--pointer"
          style="width: 27px;height: 27px;"
        >
      </v-col>
      <v-col class="pr-0" md="4">
        <v-text-field
          v-model="formData.name"
          :error-messages="$t(errorTaskName)"
          :placeholder="$t('task-manager.placeHolder.children-name')"
          class="text--body-5"
          dense
          height="24px"
          maxlength="200"
          name="name"
          @change="formData.name = trimSpace(formData.name)"
        />

      </v-col>
      <v-col class=" d-flex align-center justify-start" cols="2" md="4">
        <v-tooltip content-class="tooltip-top" top>
          <template v-slot:activator="{ on }">
            <div class="d-flex flex-column">
              <div class="bg-icon-more justify-center" v-on="on">
                <v-menu
                  v-model="menuDateChirldenWork"
                  v-click-outside="accept"
                  :close-on-click="!validateEndDate && !validateEndDateWintParentWork && !errorEndTime"
                  :close-on-content-click="false"
                  bottom
                  max-width="336px"
                  min-width="auto"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on: calendar, attrs }">
                    <v-img
                      :src="require('@/assets/icons/task/createTask/calendar.png')"
                      alt=""
                      class="hover--pointer icon-more"
                      v-bind="attrs"
                      v-on="{ ...calendar }"
                      @click:append="menuDateChirldenWork= !menuDateChirldenWork"
                    />
                  </template>
                  <v-container class="select-date-task">
                    <div class="d-flex flex-row  justify-start align-center">
                      <!--                    //ngay bat dau-->
                      <div class="d-flex flex-row justify-start align-center">
                        <div class="d-flex align-start form-group flex-column">
                          <label class="title-picker-task">
                            {{ $t('task-manager.label.start-date') }}
                          </label>
                          <v-text-field
                            v-model="formatDateStart"
                            class="text--body-5 mr-1"
                            clearable
                            dense
                            height="28px"
                            readonly
                            @click:clear="clearDataStartDate"
                          >
                            <template slot="append">
                              <v-img
                                :src="require('@/assets/icons/task/createTask/calendar.png')"
                                class="icon-date mt-1"
                              />
                            </template>
                          </v-text-field>
                        </div>
                      </div>
                      <div class="d-flex flex-row justify-start align-center ml-1">

                        <!--                        ngay ket thuc-->
                        <div class="d-flex align-start form-group flex-column">
                          <label class="title-picker-task">
                            {{ $t('task-manager.label.end-date') }}
                          </label>
                          <v-text-field
                            v-model="formatDateEnd"
                            class="text--body-5 mr-1"
                            clearable
                            dense
                            height="28px"
                            readonly
                            @click:clear="clearDataEndDate"
                          >
                            <template slot="append">
                              <v-img
                                :src="require('@/assets/icons/task/createTask/calendar.png')"
                                class="icon-date mt-1"
                              />
                            </template>
                          </v-text-field>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex flex-row clear-display mt-2 justify-center align-center">
                      <div class="d-flex flex-row align-start form-group flex-column">
                        <label class="title-picker-task">
                          {{ $t('task-manager.label.start-time') }}
                        </label>
                        <v-menu
                          ref="menu"
                          v-model="menuStarttimePicker"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="startTime"
                          max-width="290px"
                          min-width="290px"
                          offset-y
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on: start, attrs }">
                            <v-text-field
                              v-model="startTime"
                              :disabled="!listDatePicker[1]"
                              :error-messages="$t(errorStartDate)"
                              :readonly="!listDatePicker[1]"
                              class="text--body-5 mr-1"
                              clearable
                              dense
                              height="28px"
                              v-bind="attrs"
                              v-on="{ ...start }"
                            >
                              <template v-slot:append>
                                <img
                                  alt=""
                                  class="icon-dropdown"
                                  src="@/assets/icons/task/createTask/dropdown.png"
                                  @click="listDatePicker[1] ? menuStarttimePicker = !menuStarttimePicker :''"
                                >
                              </template>
                            </v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menuStarttimePicker"
                            v-model="startTime"
                            full-width
                            @click:minute="$refs.menu.save(startTime)"
                          />
                        </v-menu>
                      </div>
                      <div class="d-flex flex-row align-start form-group flex-column ml-2">
                        <label class="title-picker-task">
                          {{ $t('task-manager.label.end-time') }}
                        </label>
                        <v-menu
                          ref="menu2"
                          v-model="menuEndTimePicker"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="endTime"
                          max-width="290px"
                          min-width="290px"
                          offset-y
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on: end, attrs }">
                            <v-text-field
                              v-model="endTime"
                              :disabled="!listDatePicker[0]"
                              :error-messages="$t(errorEndDate)"
                              :readonly="!listDatePicker[0]"
                              class="text--body-5 mr-1"
                              clearable
                              dense
                              height="28px"
                              v-bind="attrs"
                              v-on="{ ...end }"
                            >
                              <template v-slot:append>
                                <img
                                  alt=""
                                  class="icon-dropdown"
                                  src="@/assets/icons/task/createTask/dropdown.png"
                                  @click=" listDatePicker[0] ? menuEndTimePicker = !menuEndTimePicker : ''"
                                >
                              </template>
                            </v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menuEndTimePicker"
                            v-model="endTime"
                            full-width
                            @click:minute="$refs.menu2.save(endTime)"
                          />
                        </v-menu>
                      </div>
                    </div>
                    <div class="mt-1 justify-start">
                      <div v-if="validateEndDateWintParentWork" class="error--text" style="line-height: 16px">{{ $t('task-manager.error.end-date-children-required') }}</div>
                      <div class="v-messages__message error--text ml-4">{{ $t(errorEndTime) }}</div>
                    </div>
                    <div class="d-flex flex-row justify-center align-center mt-1">
                      <v-date-picker
                        v-model="listDatePicker"
                        :locale="localDate"
                        format="DD/MM/YYYY"
                        no-title
                        range
                        show-adjacent-months
                      />
                    </div>
                    <div class="d-flex flex-row justify-start align-start">
                      <v-img
                        :src="require('@/assets/icons/task/createTask/iconMoreChoice/restart_alt.png')"
                        class="img-title"
                      />
                      <span class="text--body-1 ml-12">{{ $t('task-manager.label.repeat-task') }}</span>
                    </div>
                  </v-container>
                </v-menu>
              </div>
            </div>
          </template>
          <div>
            {{ $t('task-manager.tool-tip.deadline') }}
          </div>
        </v-tooltip>
        <v-menu
          :close-on-click="validatePerformer === ''"
          :close-on-content-click="false"
          min-width="180px"
          nudge-left="40px"
        >
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip content-class="tooltip-top" top>
              <template v-slot:activator="{ on: tooltip }">
                <div class="d-flex flex-column ml-3">
                  <div v-if="formData.performer">
                    <v-avatar
                      class="cursor-pointer"
                      color="red"
                      size="32"
                      v-on="{ ...tooltip, ...menu }"
                    >
                      <span
                        class="text-uppercase white--text"
                      >{{
                        renderAvatarText(formData.performer.userFullName ? formData.performer.userFullName :formData.performer.groupName)
                      }}</span>
                    </v-avatar>
                  </div>
                  <div v-else class="bg-icon-more justify-center">
                    <v-img
                      :src="require('@/assets/icons/task/userDetail.png')"
                      alt=""
                      class="icon-more"
                      v-bind="attrs"
                      v-on="{ ...tooltip, ...menu }"
                    />
                  </div>
                </div>
              </template>
              <div>
                {{ $t('task-manager.tool-tip.performer') }}
              </div>
            </v-tooltip>
          </template>
          <v-autocomplete
            v-model="formData.performer"
            :error-messages="$t(validatePerformer)"
            :filter="filterItems"
            :item-text="item=> item.userFullName ? item.userFullName : item.groupName"
            :item-value="item=> item.userId ? item.userId : item.groupId "
            :items="listUser"
            :menu-props="{
              bottom: true,
              offsetY: true
            }"
            :no-data-text="$t('noData')"
            :placeholder="$t('task-manager.placeHolder.assign-to')"
            append-icon=""
            autofocus
            class="text--body-5 ml-1 mr-1"
            dense
            elevation="0"
            maxlength="255"
            outlined
            return-object
          >
            <template v-slot:append>
              <v-img
                :src="require('@/assets/icons/task/createTask/iconMoreChoice/person.png')"
              />
            </template>
            <template v-slot:selection="data">
              <v-chip
                :input-value="data.selected"
                close
                @click="data.select"
                @click:close="removePerfomer"
              >
                <div v-if="data.item.objectType === 'GROUP'" class="d-flex   align-center">
                  <img src="@/assets/icons/task/PersonAvatar.svg">
                  <span class="ml-1"> {{ data.item.groupName }}</span>
                </div>
                <div v-else>
                  <v-avatar
                    :color="lstColors[1]"
                    size="40"
                  >
                    <span
                      class="text-uppercase white--text"
                    >{{
                      renderAvatarText(data.item.userFullName)
                    }}</span>
                  </v-avatar>
                  <span class="ml-1"> {{ data.item.username }} </span>
                </div>
              </v-chip>
            </template>
            <template v-slot:item="data">
              <div class="select-item flex-column d-flex">
                <div class="title-item">
                  {{ data.item.objectType === 'GROUP' ? data.item.groupName : data.item.userFullName }}
                </div>
                <div v-if="data.item.objectType === 'GROUP'" class="desc-item">
                  {{ data.item.groupPathName }}
                </div>
                <div v-else class="desc-item">
                  {{ data.item.positionName }} - {{ data.item.groupPathName }}
                </div>
              </div>
            </template>
          </v-autocomplete>
        </v-menu>
        <span class="action-remove cursor-pointer ml-1" @click="onRemove">
          <v-icon>mdi-close</v-icon>
        </span>
      </v-col>
    </v-row>
    <v-row>
    </v-row>

  </v-container>
</template>

<script>
import moment from 'moment'
import filterItems from '@/mixins/filterItems.js'

export default {
  name: 'ChildrenWorkTask',
  components: {

  },
  mixins: [filterItems],
  props: {
    item: {
      type: Object,
      default: undefined
    },
    formData: {
      type: Object,
      default: undefined
    },
    listUser: {
      type: Array,
      default: undefined
    },
    formatDate: {
      type: Function,
      default: undefined
    },
    statusTask: {
      type: String,
      default: undefined
    },
    deadlineParentWork: {
      type: Array,
      default: undefined
    },
    startTimeParent: {
      type: String,
      default: undefined
    },
    endTimeParent: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      lstColors: ['#FFAF2E', '#0FAFE4', '#4A50E2', '#F028A0', '#FF4A55'],
      endTime: '',
      startTime: '',
      isTime: false,
      listDatePicker: [],
      menuDateChirldenWork: false,
      menuEndTimePicker: false,
      validateEndDateWintParentWork: false,
      errorEndDate: '',
      errorStartDate: '',
      validateEndDate: false,
      menuStarttimePicker: false,
      showDialogSelectPerformer: false,
      errorPerfomer: false,
      errorEndTime: '',
      formatDateStart: '',
      formatDateEnd: '',
      labelTaskName: ''

    }
  },
  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },
    validatePerformer() {
      let str = ''
      !this.formData.performer && this.formData.name ? str = 'task-manager.error.chilren-work' : ''
      return str
    },
    errorTaskName() {
      let str = '';
      (this.listDatePicker.length !== 0 || this.formData.performer !== null) && !this.formData.name
        ? str = 'task-manager.error.children-task-name' : str = ''
      return str
    }
  },
  watch: {
    listDatePicker() {
      this.validateEndDateWintParentWork = false
      this.validateEndDate = false
      // TH1: cv con chi co ngay ket thuc
      if (this.listDatePicker[0]) {
        // reset thoi gian
        this.endTime = ''
        this.startTime = ''
        // cv cha chi co ngay ket thuc
        if (this.deadlineParentWork.length === 1) {
          const endDate1 = moment(this.listDatePicker[0], 'YYYY-MM-DD')
          const startDate1 = moment(this.deadlineParentWork[0], 'YYYY-MM-DD')
          const diff1 = endDate1.diff(startDate1, 'days')
          if (diff1 > 0) {
            this.validateEndDateWintParentWork = true
            return
          }
        }
        // cv cha co ca ngay ket thuc va ngay bat dau
        if (this.deadlineParentWork.length === 2) {
          // trong pham vi =< ngay ket thuc >= ngay bat dau cua cv cha
          const endDate2 = moment(this.listDatePicker[0], 'YYYY-MM-DD')
          const startDate2 = moment(this.deadlineParentWork[0], 'YYYY-MM-DD')
          const startDate3 = moment(this.deadlineParentWork[1], 'YYYY-MM-DD')
          const diff2 = endDate2.diff(startDate2, 'days')
          const diff3 = endDate2.diff(startDate3, 'days')
          if (diff2 < 0 || diff3 > 0) {
            if (this.listDatePicker) {
              this.validateEndDateWintParentWork = true
              return
            }
          }
        }
        // TH2: cv con co ca ngay ket thuc va ngay bat dau
        if (this.listDatePicker[1]) {
          const selectDate = moment(this.listDatePicker[0], 'YYYY-MM-DD')
          const timeExPrired = moment(this.listDatePicker[1], 'YYYY-MM-DD')
          const diff = selectDate.diff(timeExPrired, 'days')
          if (diff > 0) {
            const temp = this.listDatePicker[1]
            this.listDatePicker[1] = this.listDatePicker[0]
            this.listDatePicker[0] = temp
          }
          this.formatDateStart = this.formatDate(this.listDatePicker[0])
          this.formatDateEnd = this.formatDate(this.listDatePicker[1])
          // cv cha chi co ngay ket thuc
          if (this.deadlineParentWork.length === 1) {
            const endDate4 = moment(this.listDatePicker[1], 'YYYY-MM-DD')
            const startDate4 = moment(this.deadlineParentWork[0], 'YYYY-MM-DD')
            const diff4 = endDate4.diff(startDate4, 'days')
            if (diff4 > 0) {
              if (this.listDatePicker) {
                this.validateEndDateWintParentWork = true
                return
              }
            } else {
              this.validateEndDateWintParentWork = false
            }
          }
          // cv cha co ca ngay ket thuc va ngay bat dau
          if (this.deadlineParentWork.length === 2) {
            const endDate5 = moment(this.listDatePicker[0], 'YYYY-MM-DD')
            const startDate5 = moment(this.deadlineParentWork[0], 'YYYY-MM-DD')
            const diff5 = endDate5.diff(startDate5, 'days')

            const endDate6 = moment(this.listDatePicker[1], 'YYYY-MM-DD')
            const startDate6 = moment(this.deadlineParentWork[1], 'YYYY-MM-DD')
            const diff6 = endDate6.diff(startDate6, 'days')
            if (diff5 < 0 || diff6 > 0) {
              if (this.listDatePicker) {
                this.validateEndDateWintParentWork = true
                return
              }
            } else {
              this.validateEndDateWintParentWork = false
            }
          }
        } else {
          this.formatDateStart = ''
          this.startTime = ''
          this.formatDateEnd = this.formatDate(this.listDatePicker[0])
        }
      } else {
        // reset formData
        this.formatDateEnd = ''
        this.formatDateStart = ''
        this.startTime = ''
        this.endTime = ''
        this.validateEndDateWintParentWork = false
        this.validateEndDate = false
      }
    },
    "formData"() {
      if (this.formData.endDate) {
        if (this.formData.startDate) {
          const startDate = this.formData.startDate ? this.formData.startDate : ''
          const endDate = this.formData.endDate ? this.formData.endDate : ''
          this.formatDateStart = startDate.split(' ')[0]
          this.formatDateEnd = endDate.split(' ')[0]
          this.startTime = startDate.split(' ')[1]
          this.endTime = endDate.split(' ')[1]
          this.listDatePicker[0] = moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
          this.listDatePicker[1] = moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        } else {
          const endDate = this.formData.endDate ? this.formData.endDate : ''
          this.formatDateEnd = endDate.split(' ')[0]
          this.endTime = endDate.split(' ')[1]
          this.listDatePicker[0] = moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        }
      } else {
        this.formatDateEnd = ''
        this.formatDateStart = ''
        this.startTime = ''
        this.endTime = ''
        this.listDatePicker = []
      }
    },
    "deadlineParentWork"() {
      if (this.deadlineParentWork[0] && this.deadlineParentWork[1]) {
        this.validateEndDate = true
        this.validateEndDateWintParentWork = false
        this.validateEndDate = false
        const selectDate = moment(this.listDatePicker[1], 'YYYY-MM-DD')
        const timeExprired = moment(this.deadlineParentWork[1], 'YYYY-MM-DD')
        const diff = selectDate.diff(timeExprired, 'days')
        if (diff > 0) {
          if (this.listDatePicker) {
            this.validateEndDateWintParentWork = true
          }
        } else {
          this.validateEndDateWintParentWork = false
        }
      } else {
        this.validateEndDate = false
      }
    },
    startTime() {
      this.checkHourValid()
      if (this.endTime) {
        const selectDate = moment(this.listDatePicker[0], 'YYYY-MM-DD')
        const timeExprired = moment(this.listDatePicker[1], 'YYYY-MM-DD')
        const diff = selectDate.diff(timeExprired, 'days')
        if (diff === 0) {
          const strEndTime = this.endTime.split(':')
          const strStartTime = this.startTime.split(':')
          const totalSeconds1 = parseInt(strStartTime[0] * 3600 + strStartTime[1] * 60);
          const totalSeconds2 = parseInt(strEndTime[0] * 3600 + strEndTime[1] * 60);
          if (totalSeconds1 > totalSeconds2) {
            this.errorEndTime = 'task-manager.error.end-date'
          } else {
            this.errorEndTime = ''
          }
        } else {
          this.errorEndTime = ''
        }
      } else {
        this.errorEndTime = ''
      }
    },
    endTime() {
      this.checkHourValid()
      if (this.listDatePicker[0] && this.listDatePicker[1]) {
        if (this.startTime) {
          const selectDate = moment(this.listDatePicker[0], 'YYYY-MM-DD')
          const timeExprired = moment(this.listDatePicker[1], 'YYYY-MM-DD')
          const diff = selectDate.diff(timeExprired, 'days')
          if (diff === 0) {
            const strEndTime = this.endTime.split(':')
            const strStartTime = this.startTime.split(':')
            const totalSeconds1 = parseInt(strStartTime[0] * 3600 + strStartTime[1] * 60);
            const totalSeconds2 = parseInt(strEndTime[0] * 3600 + strEndTime[1] * 60);
            if (totalSeconds1 > totalSeconds2) {
              this.errorEndTime = 'task-manager.error.end-date'
            } else {
              this.errorEndTime = ''
            }
          } else {
            this.errorEndTime = ''
          }
        } else {
          this.errorEndTime = ''
        }
      } else {
        this.errorEndTime = ''
      }
    },
  },
  methods: {
    trimSpace(val) {
      return val ? val.trim() : ''
    },
    onRemove() {
      this.$emit('remove-child-task')
    },
    removePerfomer() {
      this.formData.performer = null
    },
    closeDialog() {
      this.listDatePicker = []
      this.formData.endDate = ''
      this.menuDateChirldenWork = false
    },
    accept() {
      if (this.listDatePicker[0]) {
        if (this.listDatePicker[1]) {
          this.startTime ? this.formData.startDate = this.formatDate(this.listDatePicker[0]) + ' ' + this.startTime : this.formData.startDate = this.formatDate(this.listDatePicker[0]) + ' 00:00'
          this.endTime ? this.formData.endDate = this.formatDate(this.listDatePicker[1]) + ' ' + this.endTime : this.formData.endDate = this.formatDate(this.listDatePicker[1]) + ' 23:59'
        } else {
          this.endTime ? this.formData.endDate = this.formatDate(this.listDatePicker[0]) + ' ' + this.endTime : this.formData.endDate = this.formatDate(this.listDatePicker[0]) + ' 23:59'
          this.formData.startDate = null
        }
      } else {
        this.formData.startDate = null
        this.formData.endDate = null
      }
    },
    renderAvatarText(customer) {
      return this.genAvatar(customer)
    },
    genAvatar(name) {
      if (!name) return ''
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        name = name.replaceAll(' ', ' ').trim()
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
    checkHourValid() {
      this.errorEndTime = ''
      this.validateEndDateWintParentWork = false
      // TH1: chi co gio ket thuc
      if (this.endTimeParent && this.deadlineParentWork.length === 1 && this.listDatePicker.length === 1) {
        const selectDate = moment(this.listDatePicker[0], 'YYYY-MM-DD')
        const timeExprired = moment(this.deadlineParentWork[0], 'YYYY-MM-DD')
        const diff = selectDate.diff(timeExprired, 'days')
        if (diff === 0) {
          const strEndTime = this.endTime.split(':')
          const strEndTimeParent = this.endTimeParent.split(':')
          const totalSeconds1 = parseInt(strEndTimeParent[0] * 3600 + strEndTimeParent[1] * 60);
          const totalSeconds2 = parseInt(strEndTime[0] * 3600 + strEndTime[1] * 60);
          if (totalSeconds1 > totalSeconds2) {
            this.validateEndDateWintParentWork = true
            return
          }
        }
      }
      // TH2: co ca gio ket thuc va gio bat dau
      if (this.endTimeParent && this.startTimeParent && this.deadlineParentWork.length === 2 && this.listDatePicker.length === 2) {
        const startDateParent = moment(this.deadlineParentWork[0], 'YYYY-MM-DD')
        const startDate = moment(this.listDatePicker[0], 'YYYY-MM-DD')
        const diffStart = startDateParent.diff(startDate, 'days')
        const endDateParent = moment(this.deadlineParentWork[1], 'YYYY-MM-DD')
        const endDate = moment(this.listDatePicker[1], 'YYYY-MM-DD')
        const diffEnd = endDateParent.diff(endDate, 'days')
        const strEndTime = this.endTime.split(':')
        const strEndTimeParent = this.endTimeParent.split(':')
        const strStartTime = this.startTime.split(':')
        const strStartTimeParent = this.startTimeParent.split(':')
        // TH1: chi trung ngay ket thuc
        if (diffStart !== 0 && diffEnd === 0) {
          const totalSeconds1 = parseInt(strEndTimeParent[0] * 3600 + strEndTimeParent[1] * 60);
          const totalSeconds2 = parseInt(strEndTime[0] * 3600 + strEndTime[1] * 60);
          if (totalSeconds1 < totalSeconds2) {
            this.validateEndDateWintParentWork = true
            return
          }
        }
        // TH2: chi trung ngay bat dau
        if (diffStart === 0 && diffEnd !== 0) {
          const totalSeconds1 = parseInt(strStartTimeParent[0] * 3600 + strStartTimeParent[1] * 60);
          const totalSeconds2 = parseInt(strStartTime[0] * 3600 + strStartTime[1] * 60);
          if (totalSeconds1 > totalSeconds2) {
            this.validateEndDateWintParentWork = true
            return
          }
        }
        // TH3: trung ca ngay bat dau va ngay ket thuc
        if (diffStart === 0 && diffEnd === 0) {
          const totalSecondsStart1 = parseInt(strStartTimeParent[0] * 3600 + strStartTimeParent[1] * 60);
          const totalSecondsStart2 = parseInt(strStartTime[0] * 3600 + strStartTime[1] * 60);
          const totalSecondsEnd1 = parseInt(strEndTimeParent[0] * 3600 + strEndTimeParent[1] * 60);
          const totalSecondsEnd2 = parseInt(strEndTime[0] * 3600 + strEndTime[1] * 60);
          if (totalSecondsStart1 > totalSecondsStart2 || totalSecondsEnd1 < totalSecondsEnd2) {
            this.validateEndDateWintParentWork = true
            return
          }
        }
      }
    },
    clearDataStartDate() {
      this.formatDateStart = ''
      this.startTime = ''
      this.listDatePicker[0] = this.listDatePicker[1]
    },
    clearDataEndDate() {
      this.formatDateStart = ''
      this.startTime = ''
      this.formatDateEnd = ''
      this.endTime = ''
      this.listDatePicker = []
    }
  }
}
</script>
