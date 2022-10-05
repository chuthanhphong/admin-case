<template>
  <div>
    <div v-if="meetingDetail" class="wrap-detail-calendar calendar-font">
      <div class="breadcrumb-text">
        <breadcrumbs :items="breadcrumbs" clazz="breadcrumb-text-calendar" />
      </div>
      <div class="meeting-detail-content">
        <div class="row meeting-detail-body">
          <div class="col-12 col-md-6">
            <div class="wrap__name">
              <h5>{{ meetingTitle }}</h5>
            </div>
            <div class="wrap__create-time">
              <img src="@/assets/icons/calendar/clock.png">
              <h5 style="color: #00C3F9">{{ meetingDetail.meetingDateTime }}</h5>
            </div>
            <div class="wrap__address">
              <div
                v-for="(item, idx) in meetingDetail.meetingRooms"
                :key="idx"
                class="text-ellipsis d-flex align-center my-2"
                style="gap: 5px;"
              >
                <img v-if="idx === 0" src="@/assets/icons/calendar/gps.png">
                <span v-else class="icon-dot" />
                <span class="item-room" :class="item.isHostRoom ? 'bold' : ''">
                  {{ item.name }}
                </span>
              </div>
            </div>
            <div class="box-body-left">
              <div class="wrap__online-meeting calendar-text--body-4">
                <!--<div class="mb-3">
                  <label class="label-name">{{ $t('calendar.detailMeeting.online-meeting') }}</label>
                  <v-text-field
                    dense
                    maxlength="200"
                    counter="200"
                    flat
                    solo
                    append-icon=""
                    class="text&#45;&#45;body-5"
                    readonly
                    hide-details
                    background-color="#F6F8FB"
                    value="https://bssd.mdo.com.vn/"
                  >
                    <template v-slot:append>
                      <v-tooltip top content-class="tooltip-top">
                        <template v-slot:activator="{ on, attrs }">
                          <img
                            alt=""
                            src="@/assets/icons/calendar/copy.png"
                            class="cursor-pointer"
                            v-bind="attrs"
                            v-on="on"
                          >
                        </template>
                        <span>{{ $t('calendar.detailMeeting.copy') }}</span>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </div>-->
                <div v-show="meetingDetail.pointOfContact" class="mb-3">
                  <label class="label-name">{{ $t('calendar.detailMeeting.pointOfContact') }}</label>
                  <v-text-field
                    dense
                    maxlength="200"
                    counter="200"
                    flat
                    solo
                    append-icon=""
                    class="text--body-5"
                    readonly
                    hide-details
                    background-color="#F6F8FB"
                    :value="meetingDetail.pointOfContact"
                  />
                </div>
                <div class="schedule">
                  <span class="type-schedule">
                    {{ meetingDetail.meetingType === 'MEETING_SCHEDULE'
                      ? $t('calendar.detailMeeting.meeting-schedule')
                      : $t('calendar.detailMeeting.on-call-schedule')
                    }}
                  </span>
                  <v-tooltip
                    v-if="isShowRepeat(meetingDetail.cycleType)"
                    top
                    content-class="tooltip-top"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <img
                        alt=""
                        src="@/assets/icons/calendar/repeat.png"
                        class="cursor-pointer"
                        v-bind="attrs"
                        v-on="on"
                      >
                    </template>
                    <span>{{ $t('calendar.detailMeeting.repeat') }}</span>
                  </v-tooltip>
                  <div
                    v-if="isShowRepeat(meetingDetail.cycleType)"
                    class="d-flex align-center"
                    style="gap: 2px"
                    v-html="renderPeriodic(meetingDetail.cycleType)"
                  />
                </div>
                <div class="creator">
                  <avatar-signer
                    :item="meetingDetail.creator"
                  />
                  <div class="box-content">
                    <div class="calendar-text--body-4">{{ meetingDetail.creator.fullName }}</div>
                    <div class="create-date">
                      <span>
                        {{ $t('calendar.detailMeeting.create-date') }}
                      </span>
                      <span>
                        ({{ meetingDetail.createDate }})
                      </span>
                    </div>
                  </div>
                </div>
                <div v-if="meetingDetail.summary" class="box-note calendar-text--body-2">
                  <span />
                  <span class="ml-2">{{ $t("calendar.detailMeeting.note") }}</span>
                  <span class="d-flex ml-3">
                    {{ meetingDetail.summary }}
                  </span>
                </div>
              </div>
              <div
                v-if="meetingDetail.fileAttachments && meetingDetail.fileAttachments.length"
                class="wrap__document-file"
              >
                <label class="calendar-text--body-4 label-name">{{ $t('calendar.detailMeeting.document-file') }}</label>
                <div class="justify-space-between">
                  <div class="d-flex justify-space-between">
                    <ul class="list-files mt-1">
                      <li
                        v-for="(file, index) of meetingDetail.fileAttachments"
                        :key="index"
                        @click="downloadFile(file)"
                      >
                        <v-tooltip
                          top
                          content-class="tooltip-top"
                          max-width="30%"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <img
                              :src="getIconFile(`${file.fileName}`)"
                              class="icon-sign"
                            />
                            <span
                              class="doc-text-file edoc-text--button"
                              v-bind="attrs"
                              v-on="on"
                            >
                              {{ customFileName(file) }}
                            </span>
                          </template>
                          <span>{{ file.fileName }}</span>
                        </v-tooltip>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <participants
                :list-data="convertData"
              />
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div
              :class="meetingDetail.approveBy ? 'd-flex justify-space-between' : ''"
            >
              <div v-if="meetingDetail.approveBy" class="personal wrap__manager">
                <div class="personal wrap__manager">
                  <avatar-signer
                    :item="meetingDetail.approveBy"
                  />
                  <div class="calendar-text--caption box-content">
                    <div class="calendar-text--body-4">
                      <span v-html="renderName(meetingDetail.approveBy)" />
                    </div>
                    <div class="phone">
                      <span v-html="renderPhoneEmail(meetingDetail.approveBy)" />
                    </div>
                    <div class="position">
                      <span v-html="renderPosition(meetingDetail.approveBy)" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-end">
                <span v-html="calendarStatus(meetingDetail.status)"></span>
              </div>
            </div>
            <div class="box-body-right">
              <report-meeting />
              <link-schedule />
              <discussion />
              <active-history />
            </div>
          </div>
        </div>
        <list-btn
          :list-action="meetingDetail.showIcons"
          :meeting-id="meetingId"
          :is-online-meeting="meetingDetail.onlineMeeting"
          :status="meetingDetail.status"
          @reload-data="reloadData"
        />
      </div>
    </div>
    <dialog-view-pdf
      :src-file-pdf="srcFilePdf"
      :show-dialog="showDialogViewPdf"
      @close-dialog="showDialogViewPdf = false"
    />
    <base-preload :dialog="loading" />
  </div>
</template>
<script>
// components
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import AvatarSigner from '@/modules/calendar/views/detail/components/AvatarSigner'
import Discussion from '@/modules/calendar/views/detail/components/Discussion'
import ReportMeeting from '@/modules/calendar/views/detail/components/ReportMeeting'
import LinkSchedule from '@/modules/calendar/views/detail/components/LinkSchedule'
import Participants from '@/modules/calendar/views/detail/components/Participants'
import ActiveHistory from '@/modules/calendar/views/detail/components/ActiveHistory'
import DialogViewPdf from '@/views/components/DialogViewPdf'
import ListBtn from '@/modules/calendar/views/detail/components/ListBtn'

// router
import calendarRoute from '@/modules/calendar/router/routePaths'

// vuex
import { mapActions } from 'vuex'

// mixins
import customAvatar from '@/mixins/customAvatar'
import customsFile from '@/modules/calendar/mixins/customsFile'
import statusCalender from '@/modules/calendar/mixins/statusCalender'

// service
import { CalendarService } from '@/modules/calendar/services/calendarService'

// vue
import Vue from 'vue'

// constants
import constants from '@/constants'

export default {
  name: 'DetailCalendarMeeting',
  components: {
    Breadcrumbs,
    AvatarSigner,
    Discussion,
    ReportMeeting,
    LinkSchedule,
    Participants,
    ActiveHistory,
    DialogViewPdf,
    ListBtn
  },
  mixins: [customAvatar, customsFile, statusCalender],
  data() {
    return {
      loading: false,
      meetingDetail: null,
      meetingId: null,
      meetingTitle: null,
      srcFilePdf: null,
      showDialogViewPdf: false
    }
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: 'menubar.calendar.meetingSchedule',
          disabled: false,
          href: `${calendarRoute.CALENDAR_MANAGEMENT_MEETING_PATH}`
        },
        {
          text: `${this.$t('calendar.detailMeeting.meetingDetail')}
          : ${this.meetingName}`,
          disabled: true,
          href: ''
        }
      ]
    },
    meetingName() {
      if (this.meetingDetail && this.meetingDetail.meetingTitle) {
        return this.customMeetingTitle(this.meetingDetail.meetingTitle)
      }
      return ''
    },
    convertData() {
      const arr = []
      this.meetingDetail.meetingParticipants.filter(item => {
        // tim ra cac don vi
        if (!item.userId && item.groupId) {
          // tim ra cac user thuoc tung don vi va them thuoc tinh nhom user vao tung don vi
          const arrUser = []
          this.meetingDetail.meetingParticipants.filter(user => {
            if (user.userId && user.groupId && !user.visible && user.groupId === item.groupId) {
              arrUser.push(user)
            }
          })
          Vue.set(item, 'listUser', arrUser)
          arr.push(item)
        }
        // tim ra cac user khong thuoc group
        if (item.userId && item.groupId && item.visible) {
          arr.push(item)
        }
        // tim ra cac user ngoai
        if (!item.userId && !item.groupId && item.visible) {
          arr.push(item)
        }
      })
      // sap xep data theo thu tu chu tri > chuan bi > con lai va sap xep theo don vi > ca nhan > ben ngoai
      const result = []
      arr.filter(item => {
        // chu tri
        if (item.isChairMan) {
          // group
          if (!item.userId && item.groupId) {
            result.push(item)
          }
          // ca nhan
          if (item.userId && item.groupId) {
            result.push(item)
          }
          // ben ngoai
          if (!item.userId && !item.groupId) {
            result.push(item)
          }
        }
      })
      // chuan bi -> group
      arr.filter(item => {
        if (item.isPrepare && !item.isChairMan) {
          if (!item.userId && item.groupId) {
            result.push(item)
          }
        }
      })
      // chuan bi -> ca nhan
      arr.filter(item => {
        if (item.isPrepare && !item.isChairMan) {
          if (item.userId && item.groupId) {
            result.push(item)
          }
        }
      })
      // chuan bi -> ben ngoai
      arr.filter(item => {
        if (item.isPrepare && !item.isChairMan) {
          if (!item.userId && !item.groupId) {
            result.push(item)
          }
        }
      })
      // binh thuong > group
      arr.filter(item => {
        if (!item.isPrepare && !item.isChairMan) {
          if (!item.userId && item.groupId) {
            result.push(item)
          }
        }
      })
      // binh thuong > ca nhan
      arr.filter(item => {
        if (!item.isPrepare && !item.isChairMan) {
          if (item.userId && item.groupId) {
            result.push(item)
          }
        }
      })
      // binh thuong > ben ngoai
      arr.filter(item => {
        if (!item.isPrepare && !item.isChairMan) {
          if (!item.userId && !item.groupId) {
            result.push(item)
          }
        }
      })
      return result
    }
  },
  async created() {
    await this.getDetailMeeting()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    customMeetingTitle(title) {
      if (title.length > 60) {
        title = `${title.slice(0, 50)}...`
      }
      return title
    },
    async getDetailMeeting() {
      try {
        this.loading = true
        this.meetingId = parseInt(this.$route.params.meetingId)
        const response = await CalendarService.getDetailMeeting(
          this.meetingId
        )
        this.meetingDetail = response.data
        if (this.meetingDetail) {
          this.meetingTitle = this.meetingDetail.meetingTitle
        }
        this.loading = false
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: this.$t(error.message)
        })
        this.loading = false
      }
    },
    getFirstCharacter(name) {
      if (!name) return ''

      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
    renderPeriodic(periodic) {
      let text = ''
      switch (periodic) {
        case constants.FREQUENCY.DAILY:
          text = 'calendar.detailMeeting.daily'
          break
        case constants.FREQUENCY.WEEKLY:
          text = 'calendar.detailMeeting.weekly'
          break
        case constants.FREQUENCY.MONTHLY:
          text = 'calendar.detailMeeting.monthly'
          break
        case constants.FREQUENCY.QUARTERLY:
          text = 'calendar.detailMeeting.quarterly'
          break
        default:
          text = ''
          break
      }
      return `
        <span>
            ${this.$t('calendar.detailMeeting.periodic')}
        </span>
        <span>
            ${this.$t(text)}
        </span>
        `
    },
    reloadData() {
      this.getDetailMeeting()
    },
    isShowRepeat(periodic) {
      if (!periodic) {
        return false
      }
      if (periodic === constants.FREQUENCY.ONCE) {
        return false
      }
      return true
    },
    renderName(user) {
      if (user.userId && user.groupId) {
        return user.fullName + " - " + user.roleName
      } else return user.groupName + " - " + user.roleName
    },
    renderPhoneEmail(user) {
      if (!user.email && !user.phone) return ""
      if (!user.email) return user.phone
      if (!user.phone) return user.email
      return user.email + " - " + user.phone
    },
    renderPosition(user) {
      let signerPositionName
      if (user.userId && user.groupId) {
        signerPositionName = user.positionName
      } else {
        signerPositionName = user.groupPathName
      }
      return signerPositionName ? signerPositionName + '<br>' : ''
    }
  }
}
</script>
<style lang="scss" src="./DetailMeetingSchedule.scss">

</style>
