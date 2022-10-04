<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-row class="mt-0 text-body-5">
        <v-col cols="6" xl="4">
          <menu-date
            :menu="menu"
            :menu-complete="menuComplete"
            :menu-task="menuTask"
            @change-menu-task="changeMenuTask"
            @change-menu-complete="changeMenuComplete"
          />
        </v-col>
        <v-col cols="6" xl="4">
          <div class="d-flex align-baseline">
            <v-menu
              v-model="menuDateFromTo"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
              max-width="270"
              attach
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  ref="dateRangeText"
                  v-model="dateRangeText"
                  :value="dateRangeText"
                  readonly
                  outlined
                  placeholder="DD/MM/YYYY ~ DD/MM/YYYY"
                  dense
                  v-bind="attrs"
                  hide-details="auto"
                  append-icon="mdi-calendar-range"
                  class="text--body-5 box--date"
                  :error-messages="$t(errorDateFromTo)"
                  v-on="on"
                  @click:append="menuDateFromTo = !menuDateFromTo"
                >
                  <template v-slot:append>
                    <img
                      src="@/assets/icons/task/createTask/calendar.png"
                      alt=""
                      class="hover--pointer"
                      @click="menuDateFromTo = !menuDateFromTo"
                    >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="datesPicker"
                fomat="DD/MM/YYYY"
                :locale="localDate"
                range
                no-title
              />
            </v-menu>
            <v-tooltip right content-class="tooltip-right">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="darken"
                  size="20"
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-information-outline
                </v-icon>
              </template>
              <span>{{ $t('task-manager.tool-tip.description-date') }}</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="6" class="pr-0">
      <div class="col-12">
        <div class="d-flex justify-sm-end justify-start">
          <div class="d-flex">
            <validation-provider
              name="contractName"
              rules="required|max:200"
            >
              <v-text-field
                v-model="formData.keywords"
                outlined
                dense
                clearable
                hide-details
                maxlength="200"
                counter="200"
                class="text--body-5 mr-3 w-300"
                name="txtSearch"
                autofocus
                :placeholder="$t('task-manager.label.name-performer-combiner')"
                @keyup.enter="searchTask"
                @change="searchTask"
                @click:clear="resetSearch"
              >
                <vue-feather
                  slot="prepend-inner"
                  class="grey--text"
                  type="search"
                  size="20"
                />
              </v-text-field>
            </validation-provider>
            <div>
              <v-menu
                :value="showAdvance"
                offset-x
                offset-y
                left
                attach
                :close-on-content-click="false"
                min-width="423px"
                max-width="423px"
                transition="slide-x-transition"
              >
                <template v-slot:activator="{ on: menuState, attrs }">
                  <v-tooltip top content-class="tooltip-top">
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn
                        v-bind="attrs"
                        outlined
                        :color="checkIsSearch() ? 'primary' : ''"
                        class="btn-show-advance mr-3"
                        v-on="{ ...menuState, ...tooltip}"
                        @click="showAdvance = true"
                      >
                        <v-badge
                          color="#FF4A55"
                          bordered
                          :content="objCount.countSearch"
                          :value="objCount.countSearch"
                        >
                          <template v-slot:badge />
                          <img v-if="checkIsSearch()" src="@/assets/icons/task/sliders.svg" alt="">
                          <img v-else src="@/assets/icons/task/inactive-advance.svg" alt="">
                        </v-badge>
                      </v-btn>
                    </template>
                    <div>
                      {{ $t('task-manager.label.advanceSearch') }}
                    </div>
                  </v-tooltip>
                </template>
                <v-list>
                  <v-list-item style="border: none">
                    <advance-search
                      :form-data="formData"
                      :show-advance="showAdvance"
                      :search-task="searchTask"
                      @date-from-change="dateFromChange"
                      @date-to-change="dateToChange"
                      @close-dialog="closeDialog"
                      @count-search="countSearchAdvance"
                    />
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div>
              <v-menu
                :value="showSetting"
                offset-x
                offset-y
                left
                attach
                :close-on-content-click="false"
                min-width="390px"
                transition="slide-x-transition"
              >
                <template v-slot:activator="{ on: menuSetting, attrs }">
                  <v-tooltip top content-class="tooltip-top">
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn
                        v-bind="attrs"
                        outlined
                        :color="checkIsSetting() ? 'primary' : ''"
                        class="btn-show-advance mr-3"
                        v-on="{ ...menuSetting, ...tooltip}"
                        @click="showSetting = true"
                      >
                        <img v-if="checkIsSetting()" src="@/assets/icons/task/setting-active.png" alt="">
                        <img v-else src="@/assets/icons/task/setting-inactive.png" alt="">
                      </v-btn>
                    </template>
                    <div>
                      {{ $t('task-manager.label.setting') }}
                    </div>
                  </v-tooltip>
                </template>
                <v-list>
                  <v-list-item style="border: none">
                    <menu-setting
                      :obj-setting="objSetting"
                      @close-setting="closeSetting"
                    />
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>

import AdvanceSearch from '@/modules/etask/views/task/follow/components/AdvanceSearch'
import MenuSetting from '@/modules/etask/views/components/MenuSetting'
import MenuDate from '@/modules/etask/views/components/MenuDate'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  components: {
    AdvanceSearch,
    MenuSetting,
    MenuDate
  },
  props: {
    formData: {
      type: Object,
      default: undefined
    },
    searchTask: {
      type: Function,
      default: undefined
    },
    objSetting: {
      type: Object,
      default: undefined
    },
    objCount: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      showAdvance: false,
      showSetting: false,
      menu: '',
      menuComplete: null,
      // Date
      menuDateFromTo: null,
      errorDateFromTo: null,
      dateFromToPicker: null,
      dateFromToValue: null,

      datesPicker: [],
      menuTask: [
        {
          key: 1,
          name: 'task-manager.status.unfinish'
        },
        {
          key: 2,
          name: 'task-manager.status.complete.name',
          child: [
            {
              key: 'TODAY',
              name: 'task-manager.status.complete.today',
              value: 'task-manager.status.complete.value-today'
            },
            {
              key: 'YESTERDAY',
              name: 'task-manager.status.complete.yesterday',
              value: 'task-manager.status.complete.value-yesterday'
            },
            {
              key: 'THIS_WEEK',
              name: 'task-manager.status.complete.week',
              value: 'task-manager.status.complete.value-week'
            },
            {
              key: 'THIS_MONTH',
              name: 'task-manager.status.complete.month',
              value: 'task-manager.status.complete.value-month'
            }
          ]
        },
        {
          key: 0,
          name: 'task-manager.status.all'
        }
      ],
      dateRangeText: null
    }
  },
  computed: {
    ...mapState('layout', ['params_notification']),
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    }
  },
  watch: {
    datesPicker() {
      this.errorDateFromTo = ''
      if (this.datesPicker[0] !== undefined && this.datesPicker[1] !== undefined) {
        const selectDate = moment(this.datesPicker[1], 'YYYY-MM-DD')
        const timeExprired = moment(this.datesPicker[0], 'YYYY-MM-DD')
        const diff = selectDate.diff(timeExprired, 'days')
        if (diff < 0) {
          this.formData.createdDateFrom = moment(this.datesPicker[1], 'YYYY-MM-DD').format('DD/MM/YYYY').replaceAll('/', '')
          this.formData.createdDateTo = moment(this.datesPicker[0], 'YYYY-MM-DD').format('DD/MM/YYYY').replaceAll('/', '')
          this.dateRangeText = moment(this.datesPicker[1], 'YYYY-MM-DD').format('DD/MM/YYYY') + ' ~ ' + moment(this.datesPicker[0], 'YYYY-MM-DD').format('DD/MM/YYYY')
        } else {
          this.formData.createdDateFrom = moment(this.datesPicker[0], 'YYYY-MM-DD').format('DD/MM/YYYY').replaceAll('/', '')
          this.formData.createdDateTo = moment(this.datesPicker[1], 'YYYY-MM-DD').format('DD/MM/YYYY').replaceAll('/', '')
          this.dateRangeText = moment(this.datesPicker[0], 'YYYY-MM-DD').format('DD/MM/YYYY') + ' ~ ' + moment(this.datesPicker[1], 'YYYY-MM-DD').format('DD/MM/YYYY')
        }
        this.searchTask()
      }
    },
    params_notification(newValue) {
      if (newValue) {
        this.menuComplete = null;
        this.menu = this.menuTask[2].name;
        this.initDate()
      }
    }
  },
  mounted() {
    this.initDate()
  },
  created() {
    this.menu = this.menuTask[2].name
  },
  methods: {
    closeDialog() {
      this.showAdvance = false
    },
    closeSetting() {
      this.showSetting = false
    },
    dateFromChange(value) {
      this.formData.fromDate = value && value.replace('/', '')
      this.searchTask()
    },
    dateToChange(value) {
      this.formData.toDate = value && value.replace('/', '')
      this.searchTask()
    },
    changeMenuTask(value) {
      if (value) {
        if (value.key !== 2) {
          this.menuComplete = null
        }
      }
      if (this.menu === value.name) {
        return
      }
      this.menu = value.name
      switch (value.key) {
        case 0:
          this.formData.isCompletedTask = null
          this.searchTask()
          return
        case 1:
          this.formData.isCompletedTask = 'false'
          this.searchTask()
          return
      }
    },
    changeMenuComplete(value) {
      this.menu = this.menuTask[1].name
      this.menuComplete = value
      this.formData.isCompletedTask = true
      this.formData.finishTaskTimeType = value.key
      this.searchTask()
    },
    initDate() {
      const sixMonthBefore = moment()
        .subtract(6, 'months')
        .format('DD/MM/YYYY')
      const currentDate = moment().format('DD/MM/YYYY')
      this.datesPicker = [moment(sixMonthBefore, 'DD/MM/YYYY').format('YYYY-MM-DD'), moment(currentDate, 'DD/MM/YYYY').format('YYYY-MM-DD')]
      this.formData.createdDateFrom = sixMonthBefore
      this.formData.createdDateTo = currentDate
    },
    checkIsSearch() {
      if (
        this.formData.taskName ||
          this.formData.taskStatuses.length !== 0 ||
          this.formData.taskType ||
          this.formData.deadlineTaskTimeType ||
          this.formData.estimateEndFromDate ||
          this.formData.estimateEndToDate ||
          this.formData.taskPriorities.length !== 0 ||
          this.formData.performerUserIds.length !== 0 ||
          this.formData.performerGroupIds.length !== 0 ||
          this.formData.combinerUserIds.length !== 0 ||
          this.formData.combinerGroupIds.length !== 0
      ) {
        return true
      } else {
        return false
      }
    },
    resetSearch() {
      this.formData.keywords = ''
      this.searchTask()
    },
    checkIsSetting() {
      if (this.objSetting.perform &&
          this.objSetting.state &&
          this.objSetting.progress &&
          this.objSetting.complete &&
          this.objSetting.assigner &&
          this.objSetting.createDate &&
          this.objSetting.source &&
          this.objSetting.typeTask &&
          this.objSetting.priority &&
          this.objSetting.combinator &&
          this.objSetting.follow
      ) {
        return false
      }
      return true
    },
    countSearchAdvance(count) {
      this.objCount.countSearch = 0
      if (count) {
        this.objCount.countSearch = count
      }
    }
  }
}
</script>
<style>
@media (max-width: 960px) {
  .box--date {
    min-width: 185px;
  }
}
@media (min-width: 1336px) {
  .box--date {
    min-width: 225px;
  }
}
</style>

