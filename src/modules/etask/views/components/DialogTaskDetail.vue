<template>
  <v-fade-transition>
    <div v-if="showDialog" :class="isShowComment ? 'dialog-task-detail-with-comment' : 'dialog-task-detail' ">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <!--          header-->
        <div class="header-dialog-detail d-flex justify-end align-center">
          <v-icon class="mr-5 mt-1" @click="closeDialog">mdi-close</v-icon>
        </div>
        <!--          // status , priority-->
        <div class="d-flex flex-row justify-start align-center">
          <div class="mt-6 pa-0 col-md-8">
            <v-select
              v-model="statusBegin"
              :item-disabled="item=> !disableStatus(item.value)"
              :item-value="item=>item.value"
              :items="listStatusTask"
              :menu-props="{ maxHeight: '200', maxWidth:'200'}"
              :readonly="!isEditStatus"
              append-icon=""
              class="ml-3"
              solo
            >
              <template v-slot:selection="data">
                <div
                  :style="{backgroundColor : data.item.background, color:data.item.bg}"
                  class="selected-status d-flex flex-row align-center"
                >
                  <v-avatar class="ml-2" size="15">
                    <v-img :src="data.item.icon" />
                  </v-avatar>
                  <span class="item-status label-status-task ml-3" v-html="$t(data.item.label)" />

                </div>
              </template>
              <template v-slot:item="data">
                <template>
                  <div
                    class="d-flex flex-row ml-2"
                  >
                    <v-avatar class="ml-1" size="15">
                      <v-img :src="data.item.icon" />
                    </v-avatar>
                    <div class="ml-4">
                      <span>{{ $t(data.item.label) }}</span>
                    </div>

                  </div>

                </template>
              </template>
            </v-select>
          </div>
          <v-col class="menu-icon d-flex justify-end align-center  pr-2 pa-0 col-md-4">
            <v-menu
              v-if="dataTask.listActions && dataTask.listActions.length > 0"
              content-class="menu-action arrow-up"
              left
              offset-y
              transition="scroll-y-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ml-3"
                  dense
                  fab
                  ml-1
                  small
                  text
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon> mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <div
                  v-for="(action, id) in dataTask.listActions"
                  :key="id"
                  class="px-2 item-action"
                >
                  <div
                    @click="showConfirm(`${action}`, dataTask.listActions)"
                    v-html="
                      renderTaskAction(`${action}`)
                    "
                  />
                </div>
              </v-list>
            </v-menu>
            <v-tooltip
              content-class="tooltip-top"
              nudge-left="12px"
              top
            >
              <template v-slot:activator="{ on }">
                <div class="hover--pointer">
                  <img
                    v-if="!isShowComment"
                    class="cursor-pointer"
                    src="@/assets/icons/task/showComment.png"
                    @click="showComment"
                    v-on="on"
                  >
                  <img v-else class="cursor-pointer" src="@/assets/icons/task/hideComment.png" @click="showComment" v-on="on">
                </div>
              </template>
              <div class="hover--pointer">
                {{ !isShowComment ? $t('task-manager.tool-tip.see-more') : $t('task-manager.tool-tip.close') }}
              </div>
            </v-tooltip>
          </v-col>
        </div>
        <div class="d-flex flex-row pl-3 task-body">
          <div :class="!isShowComment ? 'col-md-12' : 'col-md-6'">
            <div
              v-if="dataTask.parentTask"
              class="hover--pointer d-flex align-center"
              style="gap: 5px;"
              @click="getTaskChirldrenDetail(dataTask.parentTask.id)"
            >
              <span class="task-parent-name">{{ dataTask.parentTask ? dataTask.parentTask.name : '' }} </span>
              <v-icon>mdi-chevron-right</v-icon>
            </div>
            <div class="my-3">
              <span class="task-name">{{ dataTask.name }}</span>
            </div>
            <div :style="isShowComment ? 'border-right : 2px dashed  #7A7C80;' : ''">
              <!--                nguoi giao-->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.label.assigner') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-autocomplete
                    v-model="dataTask.assigner"
                    :filter="filterItems"
                    :item-text="item=>item.userFullName ? item.userFullName : item.groupName"
                    :item-value="item=>item.userId"
                    :items="listAssigner"
                    :menu-props="{
                      bottom: true,
                      offsetY: true
                    }"
                    :no-data-text="$t('noData')"
                    :outlined="isEditAssginer"
                    :placeholder="isEditAssginer ? $t('task-manager.placeHolder.assign-to') : ''"
                    :readonly="!isEditAssginer"
                    append-icon=""
                    class="text--body-5 pr-3 pr-3"
                    dense
                    elevation="0"
                    maxlength="255"
                    return-object
                  >
                    <template v-slot:append>
                      <img
                        v-if="isEditAssginer"
                        class=" cursor-pointer"
                        src="@/assets/icons/task/iconSvg/iconUser.svg"
                      >
                    </template>
                    <template v-slot:selection="data">
                      <div v-if="!isEditAssginer">
                        <v-menu
                          max-width="360"
                          offset-y
                          open-on-hover
                          origin="center center"
                          top
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-avatar
                              :color="lstColors[0]"
                              class="cursor-pointer"
                              size="40"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <span
                                class="text-uppercase white--text"
                              >{{
                                renderAvatarText(data.item.userFullName)
                              }}</span>
                            </v-avatar>
                          </template>
                          <pop-up-user-info-detail-task
                            :index="0"
                            :lst-colors="lstColors"
                            :user-info="data.item"
                          />
                        </v-menu>
                        <span class="ml-1"> {{ data.item.userFullName }} </span>
                      </div>
                      <div v-else>
                        <v-chip
                          close
                          @click:close="removeAssigner"
                        >
                          <div>
                            <v-avatar
                              :color="lstColors[0]"
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
                      </div>
                    </template>
                    <template v-slot:item="data">
                      <div class="select-item flex-column d-flex">
                        <div class="title-item">
                          {{ checkEqualItem(data.item.objectType ,'GROUP') ? data.item.groupName : data.item.userFullName }}
                        </div>
                        <div v-if="checkEqualItem(data.item.objectType ,'GROUP')" class="desc-item">
                          {{ data.item.groupPathName }}
                        </div>
                        <div v-else class="desc-item">
                          {{ data.item.positionName }} - {{ data.item.groupPathName }}
                        </div>
                      </div>
                    </template>
                  </v-autocomplete>
                </div>
              </div>

              <!--                //ten nguoi thuc hien-->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.label.detail-performer') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-autocomplete
                    v-model="dataTask.performer"
                    :filter="filterItems"
                    :item-text="item=>item.userFullName ? item.userFullName : item.groupName"
                    :item-value="item=>item.userId ? item.userId : item.groupId"
                    :items="listCombinator"
                    :menu-props="{
                      bottom: true,
                      offsetY: true
                    }"
                    :no-data-text="$t('noData')"
                    :outlined="isEditPerfomer"
                    :placeholder="isEditPerfomer ? $t('task-manager.placeHolder.assign-to') : ''"
                    :readonly="!isEditPerfomer"
                    append-icon=""
                    class="text--body-5 pr-3 pr-3"
                    dense
                    elevation="0"
                    maxlength="255"
                    return-object
                  >
                    <template v-slot:append>
                      <img
                        v-if="isEditPerfomer"
                        class=" cursor-pointer"
                        src="@/assets/icons/task/iconSvg/iconUser.svg"
                      >
                    </template>
                    <template v-slot:selection="data">
                      <div v-if="!isEditPerfomer">
                        <v-menu
                          max-width="360"
                          offset-y
                          open-on-hover
                          origin="center center"
                          top
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-avatar
                              :color="lstColors[0]"
                              class="cursor-pointer"
                              size="40"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-img
                                v-if="!checkTypeUserInfo(data.item.objectType)"
                                class="cursor-pointer"
                                src="@/assets/icons/task/PersonAvatar.svg"
                                v-bind="attrs"
                                v-on="on"
                              />
                              <span
                                v-else
                                class="text-uppercase white--text"
                              >{{
                                renderAvatarText(data.item.userFullName)
                              }}</span>
                            </v-avatar>
                          </template>
                          <pop-up-user-info-detail-task
                            :index="0"
                            :lst-colors="lstColors"
                            :user-info="data.item"
                          />
                        </v-menu>
                        <span class="ml-1"> {{ checkEqualItem(data.item.objectType ,'USER') ? data.item.userFullName : data.item.groupName }} </span>
                      </div>
                      <div v-else>
                        <v-chip
                          :input-value="data.selected"
                          close
                          @click:close="removePerfomer"
                        >
                          <div>
                            <v-avatar
                              v-if="checkEqualItem(data.item.objectType ,'GROUP')"
                            >
                              <v-img
                                src="@/assets/icons/task/PersonAvatar.svg"
                              />
                            </v-avatar>
                            <v-avatar
                              v-else
                              :color="lstColors[0]"
                              size="40"
                            >
                              <span
                                class="text-uppercase white--text"
                              >{{
                                renderAvatarText(data.item.userFullName)
                              }}</span>
                            </v-avatar>
                            <span class="ml-1"> {{ checkEqualItem(data.item.objectType ,'USER') ? data.item.userFullName : data.item.groupName }} </span>
                          </div>
                        </v-chip>
                      </div>
                    </template>
                    <template v-slot:item="data">
                      <div class="select-item flex-column d-flex">
                        <div class="title-item">
                          {{ checkEqualItem(data.item.objectType ,'GROUP') ? data.item.groupName : data.item.userFullName }}
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
                </div>
              </div>
              <!--                tien do cong viec-->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.label.process') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <div class="d-flex  clear-display align-center ml-2 justify-space-between progress-task">
                    <div
                      :class="isEditProgress ? 'role-edit-progress cursor-pointer' : ''"
                      class="d-flex align-center"
                    >
                      <v-progress-linear
                        :color="colorProgress(dataTask.status)"
                        :value="dataTask.progress"
                        class="task-style-progress"
                        height="10"
                        rounded
                        style="min-width: 200px"
                        @click="OpenDialogUpdateProcess"
                      />
                      <span class="ml-5" v-html="fixedProgressTask(dataTask.progress)" />%
                    </div>
                    <div>
                      <v-img
                        v-if="isEditProgress"
                        :src="require('@/assets/icons/task/iconSvg/iconcheck.svg')"
                        class="resize-image pr-3 mr-4"
                        @click="OpenDialogUpdateProcess"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!--                ngay du kien-->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.task-detail.day-expected') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-menu
                    v-model="menuOpenDate"
                    :close-on-click="!errorEndTime"
                    :close-on-content-click="false"
                    max-width="336px"
                    min-width="auto"
                    nudge-left="340px"
                    offset-x
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :clearable="isEditTime"
                        :error-messages="$t(errorDateFromTo)"
                        :outlined="isEditTime"
                        :placeholder="isEditTime ? $t('task-manager.placeHolder.deadline') : ''"
                        :value="dateRangeText"
                        class="text--body-5 pr-3 box--date clearable-text-input"
                        dense
                        height="40px"
                        readonly
                        v-bind="attrs"
                        v-on="isEditTime ? on :null"
                        @click:append="menuDateFromTo = !menuDateFromTo"
                        @click:clear="clearDateTime"
                      >
                        <template v-if="isEditTime" v-slot:append>
                          <div class="d-flex flex-row">
                            <v-img v-if="hiddenAction" :src="require('@/assets/icons/task/iconSvg/repeat.svg')" class="cursor-pointer" />
                            <v-img
                              :src="require('@/assets/icons/task/iconSvg/IconCalendar.svg')"
                              class="ml-2 hover--pointer"
                              v-bind="attrs"
                              v-on="on"
                              @click:append="menuDateFromTo = !menuDateFromTo"
                            />
                          </div>
                        </template>
                      </v-text-field>
                    </template>
                    <v-container class="select-date-task align-start">
                      <div class="d-flex clear-display  justify-start align-center">
                        <!--                    //ngay bat dau-->
                        <div class="d-flex flex-row justify-start align-center">
                          <div class="d-flex align-start form-group flex-column mt-1">
                            <label class="title-picker-task">
                              {{ $t('task-manager.label.start-date') }}
                            </label>
                            <v-text-field
                              :readonly="true"
                              :value="startDateStr"
                              class="text--body-5 mr-1"
                              dense
                              height="28px"
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
                          <div class="d-flex align-start form-group flex-column">
                            <label class="title-picker-task">
                              {{ $t('task-manager.label.end-date') }}
                            </label>
                            <v-text-field
                              ref="deadline"
                              :readonly="true"
                              :value="endDateStr"
                              class="text--body-5 mr-1"
                              dense
                              height="28px"
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
                      <div class="d-flex clear-display justify-center align-center mt-2">
                        <div class="d-flex flex-row justify-start align-center">
                          <div class="d-flex flex-column align-start form-group justify-center">
                            <label class="title-picker-task">
                              {{ $t('task-manager.label.start-time') }}
                            </label>
                            <v-menu
                              :close-on-content-click="false"
                              :disabled="!datesPicker[1]"
                              min-width="250px"
                              offset-y
                              transition="scale-transition"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  :disabled="!datesPicker[1]"
                                  :value="startTime"
                                  class="text--body-5 mr-1"
                                  dense
                                  height="28px"
                                  v-bind="attrs"
                                  v-on="on"
                                  @click:append="menuStarttimePicker = !menuStarttimePicker"
                                >
                                  <template v-slot:append>
                                    <img
                                      alt=""
                                      class="icon-dropdown"
                                      src="@/assets/icons/task/createTask/dropdown.png"
                                      @click:append="menuStarttimePicker = !menuStarttimePicker"
                                    >
                                  </template>
                                </v-text-field>
                              </template>
                              <v-time-picker
                                v-model="startTime"

                                full-width
                                @input="menuStarttimePicker = false"
                              />
                            </v-menu>
                          </div>
                        </div>
                        <div class="d-flex flex-row justify-start align-center ml-1">
                          <div class="d-flex flex-column align-start form-group justify-center">
                            <label class="title-picker-task">
                              {{ $t('task-manager.label.end-time') }}
                            </label>
                            <v-menu
                              :close-on-content-click="false"
                              :disabled="!datesPicker[0]"
                              min-width="auto"
                              nudge-left="80px"
                              offset-y
                              transition="scale-transition"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  :disabled="!datesPicker[0]"
                                  :value="endTime"
                                  class="text--body-5 mr-1"
                                  dense
                                  height="28px"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  <template v-slot:append>
                                    <img
                                      alt=""
                                      class="icon-dropdown"
                                      src="@/assets/icons/task/createTask/dropdown.png"
                                    >
                                  </template>
                                </v-text-field>
                              </template>
                              <v-time-picker
                                v-model="endTime"

                                full-width
                                @input="menuEndTimePicker=false"
                              />
                            </v-menu>
                          </div>
                        </div>
                      </div>
                      <div class="mt-1">
                        <div class="v-messages__message error--text ml-4">{{ $t(errorEndTime) }}</div>
                      </div>
                      <div>
                        <v-date-picker
                          v-model="datesPicker"
                          :locale="localDate"
                          format="DD/MM/YYYY"
                          no-title
                          range
                          show-adjacent-months
                        />
                      </div>
                      <div class="d-flex flex-row justify-start align-center">
                        <v-img
                          :src="require('@/assets/icons/task/createTask/iconMoreChoice/restart_alt.png')"
                          class="img-title"
                          style="background-size: contain"
                        />
                        <span class="text--body-1 ml-12">{{ $t('task-manager.label.repeat-task') }}</span>
                      </div>
                    </v-container>
                  </v-menu>
                </div>
              </div>

              <!--                //ngay thuc te-->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.task-detail.day-reality') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-menu
                    v-model="menuActDate"
                    :close-on-click="!errorActEndTime"
                    :close-on-content-click="false"
                    max-width="336px"
                    min-width="auto"
                    offset-y
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :clearable="isEditRealTime"
                        :outlined="isEditRealTime"
                        :placeholder="isEditRealTime ? $t('task-manager.placeHolder.act-time') : ''"
                        :readonly="true"
                        :value="dateActRangeText"
                        class="text--body-5 pr-3 box--date clearable-text-input"
                        dense
                        height="40px"
                        v-bind="attrs"
                        v-on=" isEditRealTime ? on : null "
                        @click:clear="clearRealDateTime"
                      >
                        <template v-slot:append>
                          <img
                            v-if="isEditRealTime"
                            class=" cursor-pointer"
                            src="@/assets/icons/task/iconSvg/IconCalendar.svg"
                            v-bind="attrs"
                            v-on:="on"
                            @click="menuActDate = !menuActDate"
                          >
                        </template>
                      </v-text-field>
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
                              :readonly="true"
                              :value="startActDateStr"
                              class="text--body-5 mr-1"
                              dense
                              height="28px"
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
                        <div class="d-flex flex-row justify-start align-center ml-2">
                          <div class="d-flex align-start form-group flex-column">
                            <label class="title-picker-task">
                              {{ $t('task-manager.label.end-date') }}
                            </label>
                            <v-text-field
                              ref="deadline"
                              :readonly="true"
                              :value="endActDateStr"
                              class="text--body-5 pr-1"
                              dense
                              height="28px"
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
                            :close-on-content-click="false"
                            :disabled="!datesActPicker[1]"
                            min-width="250px"
                            offset-y
                            transition="scale-transition"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                :disabled="!datesActPicker[1]"
                                :value="actStartTime"
                                class="text--body-5 mr-1"
                                dense
                                height="28px"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                @click:append="menuStartActTimePicker = !menuStartActTimePicker"
                              >
                                <template v-slot:append>
                                  <img
                                    alt=""
                                    class="icon-dropdown"
                                    src="@/assets/icons/task/createTask/dropdown.png"
                                    @click:append="menuStartActTimePicker = !menuStartActTimePicker"
                                  >
                                </template>
                              </v-text-field>
                            </template>
                            <v-time-picker
                              v-model="actStartTime"
                              full-width
                              @input="menuStartActTimePicker = false"
                            />
                          </v-menu>
                        </div>
                        <div class="d-flex flex-row align-start form-group flex-column ml-1">
                          <label class="title-picker-task">
                            {{ $t('task-manager.label.end-time') }}
                          </label>
                          <v-menu
                            :close-on-content-click="false"
                            :disabled="!datesActPicker[0]"
                            min-width="250px"
                            nudge-left="80px"
                            offset-y
                            transition="scale-transition"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                :disabled="!datesActPicker[0]"
                                :value="actEndTime"
                                class="text--body-5 mr-1"
                                dense
                                height="28px"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                @click:append="menuEndActTimePicker = !menuEndActTimePicker"
                              >
                                <template v-slot:append>
                                  <img
                                    alt=""
                                    class="icon-dropdown"
                                    src="@/assets/icons/task/createTask/dropdown.png"
                                    @click:append="menuEndActTimePicker = !menuEndActTimePicker"
                                  >
                                </template>
                              </v-text-field>
                            </template>
                            <v-time-picker
                              v-model="actEndTime"

                              full-width
                              @input="menuEndActTimePicker=false"
                            />
                          </v-menu>
                        </div>
                      </div>
                      <div class="mt-1">
                        <div class="v-messages__message error--text ml-4">{{ $t(errorActEndTime) }}</div>
                      </div>
                      <div class="mt-1">
                        <v-date-picker
                          v-model="datesActPicker"
                          :locale="localDate"
                          format="DD/MM/YYYY"
                          no-title
                          range
                          show-adjacent-months
                        />
                      </div>
                      <div class="d-flex  justify-start align-center mt-1">
                        <v-img
                          :src="require('@/assets/icons/task/createTask/iconMoreChoice/restart_alt.png')"
                          class="img-title"
                          style="padding-top: 9px;background-size: contain"
                        />
                        <span class="text--body-1 ml-12">{{ $t('task-manager.label.repeat-task') }}</span>
                      </div>
                    </v-container>
                  </v-menu>
                </div>
              </div>

              <!--                doi tuong phoi hop-->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.label.detail-coordinator') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-autocomplete
                    v-model="dataTask.combinators"
                    :filter="filterItems"
                    :item-text="item=> item.userFullName ? item.userFullName : item.groupName"
                    :item-value="item=> item.userId ? item.userId : item.groupId"
                    :items="listCombinaTorTransfer"
                    :menu-props="{
                      bottom: true,
                      offsetY: true
                    }"
                    :no-data-text="$t('noData')"
                    :outlined="isEditCombinator"
                    :placeholder="isEditCombinator ? $t('task-manager.placeHolder.coordinator') : ''"
                    :readonly="!isEditCombinator"
                    :search-input.sync="searchPefomer"
                    append-icon=""
                    class="text--body-5 pr-3"
                    dense
                    elevation="0"
                    maxlength="255"
                    multiple
                    return-object
                    @change="searchPefomer=''"
                  >
                    <template v-slot:append>
                      <img
                        v-if="isEditCombinator"
                        class=" cursor-pointer"
                        src="@/assets/icons/task/iconSvg/iconPerformer.svg"
                      >
                    </template>
                    <template v-slot:selection="{ item,index }">
                      <div v-if="isEditCombinator">
                        <v-chip
                          :close="checkCurrentUserId(dataTask.combinators[index].createdBy) "
                          :input-value="item.selected"
                          v-bind="item.attrs"
                          @click:close="isEditCombinator ? removeCombinator(index) : ''"
                        >
                          <div v-if="checkEqualItem(dataTask.combinators[index].objectType , 'GROUP')" class="d-flex align-center">
                            <v-img src="@/assets/icons/task/PersonAvatar.svg" />
                            <span class="ml-1"> {{ item.groupName }}</span>
                          </div>
                          <div v-else>
                            <v-avatar
                              :color="lstColors[index % 5]"
                              size="40"
                            >
                              <span
                                class="text-uppercase white--text"
                              >{{
                                renderAvatarText(checkTypeUserInfo(item.objectType) ? item.userFullName :item.groupName)
                              }}</span>
                            </v-avatar>
                            {{ item.username }}
                          </div>
                        </v-chip>
                      </div>
                      <div v-else>
                        <v-menu
                          v-if="index < 4 || (dataTask.combinators.length === 5 && index === 4)"
                          max-height="420"
                          min-width="360"
                          offset-y
                          open-on-hover
                          origin="center center"
                          top
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-avatar
                              :color="lstColors[index]"
                              :style="`left: ${-8 * index}px`"
                              class="cursor-pointer"
                              size="32"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <img
                                v-show="checkEqualItem(item.objectType , 'GROUP')"
                                class="cursor-pointer"
                                src="@/assets/icons/task/PersonAvatar.svg"
                                v-bind="attrs"
                                v-on="on"
                              >
                              <span
                                v-show="checkEqualItem(item.objectType , 'USER')"
                                class="text-uppercase white--text"
                              >{{
                                renderAvatarText(item.userFullName)
                              }}</span>
                            </v-avatar>
                          </template>
                          <pop-up-user-info-detail-task
                            :index="index % 5"
                            :lst-colors="lstColors"
                            :user-info="item"
                          />
                        </v-menu>
                        <v-menu
                          v-if="index === 5"
                          :close-on-content-click="false"
                          max-height="420"
                          max-width="360"
                          offset-y
                          open-on-hover
                          origin="center center"
                          top
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-avatar
                              :color="lstColors[4]"
                              :style="`left: -32px`"
                              class="customer cursor-pointer"
                              size="30"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <span
                                class="text-uppercase white--text"
                              >+{{
                                dataTask.combinators.length - 4
                              }}</span>
                            </v-avatar>
                          </template>
                          <list-user-info-detail-task
                            :items="dataTask.combinators"
                            :lst-colors="lstColors"
                          />
                        </v-menu>

                      </div>
                    </template>
                    <template v-slot:item="data">
                      <div class="select-item flex-column d-flex">
                        <div class="title-item">
                          {{ checkTypeUserInfo(data.item.objectType) ? data.item.userFullName : data.item.groupName }}
                        </div>
                        <div v-if="checkTypeUserInfo(data.item.objectType)" class="desc-item">
                          {{ data.item.positionName }} - {{ data.item.groupPathName }}
                        </div>
                        <div v-else class="desc-item">
                          {{ data.item.groupPathName }}
                        </div>
                      </div>
                    </template>
                  </v-autocomplete>
                </div>
              </div>

              <!--                doi tuong theo doi-->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.label.detail-follower') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-autocomplete
                    v-model="dataTask.monitors"
                    :filter="filterItems"
                    :item-text="item=>item.userFullName ? item.userFullName : item.groupName"
                    :item-value="item=> item.userId"
                    :items="listMonitorTranfer"
                    :menu-props="{
                      bottom: true,
                      offsetY: true
                    }"
                    :no-data-text="$t('noData')"
                    :outlined="isEditFollower"
                    :placeholder="isEditFollower ? $t('task-manager.placeHolder.follower-member') : ''"
                    :readonly="!isEditFollower"
                    :search-input.sync="searchFollow"
                    append-icon=""
                    class="text--body-5 pr-3"
                    dense
                    elevation="0"
                    maxlength="255"
                    multiple
                    return-object
                    @change="searchFollow=''"
                  >
                    <template v-slot:append>
                      <img
                        v-if="isEditFollower"
                        class=" cursor-pointer"
                        src="@/assets/icons/task/iconSvg/iconFollow.svg"
                      >
                    </template>
                    <template v-slot:selection="{ item,index }">
                      <div v-if="isEditFollower">
                        <v-chip
                          :close="checkCurrentUserId(dataTask.monitors[index].createdBy) "
                          :input-value="item.selected"
                          v-bind="item.attrs"
                          @click:close="isEditFollower ? removeMonitor(index) : ''"
                        >
                          <div>
                            <v-avatar
                              :color="lstColors[index % 5]"
                              size="40"
                            >
                              <span
                                class="text-uppercase white--text"
                              >{{
                                renderAvatarText( item.userFullName )
                              }}</span>
                            </v-avatar>
                          </div>
                          {{ item.username }}
                        </v-chip>
                      </div>
                      <div v-else>
                        <v-menu
                          v-if="index < 4 || (dataTask.monitors.length === 5 && index === 4)"
                          max-height="420"
                          min-width="360"
                          offset-y
                          open-on-hover
                          origin="center center"
                          top
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-avatar
                              :color="lstColors[index]"
                              :style="`left: ${-8 * index}px`"
                              class="cursor-pointer"
                              size="32"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <span
                                class="text-uppercase white--text"
                              >{{
                                renderAvatarText(item.userFullName)
                              }}</span>
                            </v-avatar>
                          </template>
                          <pop-up-user-info-detail-task
                            :index="index % 5"
                            :lst-colors="lstColors"
                            :user-info="item"
                          />
                        </v-menu>
                        <v-menu
                          v-if="index === 5"
                          :close-on-content-click="false"
                          max-height="420"
                          max-width="360"
                          offset-y
                          open-on-hover
                          origin="center center"
                          top
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-avatar
                              :color="lstColors[4]"
                              :style="`left: -32px`"
                              class="customer cursor-pointer"
                              size="30"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <span
                                class="text-uppercase white--text"
                              >+{{
                                dataTask.monitors.length - 4
                              }}</span>
                            </v-avatar>
                          </template>
                          <list-user-info-detail-task
                            :items="dataTask.monitors"
                            :lst-colors="lstColors"
                          />
                        </v-menu>

                      </div>
                    </template>
                    <template v-slot:item="data">
                      <div class="select-item flex-column d-flex">
                        <div class="title-item">
                          {{ data.item.userFullName }}
                        </div>
                        <div class="desc-item">
                          {{ data.item.positionName }} - {{ data.item.groupPathName }}
                        </div>

                      </div>
                    </template>
                  </v-autocomplete>
                </div>
              </div>

              <!--                do uu tien-->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.label.priority') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0 label-priority-task">
                  <v-select
                    v-model="dataTask.priority"
                    :item-value="item=>item.value"
                    :items="listPriority"
                    :placeholder="$t('task-manager.label.priority')"
                    :readonly="true"
                    append-icon=""
                    class="pr-3"
                    solo
                  >
                    <template v-slot:selection="data">
                      <div
                        :style="{backgroundColor : data.item.bg}"
                        class="selected-status d-flex flex-row align-center"
                      >
                        <v-icon
                          :color="data.item.colorIcon"
                          class="ml-2 mt-1"
                        >
                          mdi-flash
                        </v-icon>
                        <span class="item-status label-status-task ml-3" v-html="$t(data.item.label)" />

                      </div>
                    </template>

                    <template v-slot:item="data">
                      <div class="select--status d-flex align-center">
                        <v-col md="2">
                          <v-icon
                            :color="data.item.colorIcon"
                          >
                            mdi-flash
                          </v-icon>
                        </v-col>
                        <v-col md="8">
                          <v-list-item-title v-html="$t(data.item.label)" />
                        </v-col>
                      </div>
                    </template>
                  </v-select>
                </div>
              </div>

              <!--                  loai cong viec-->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.label.style-task') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-autocomplete
                    v-model="dataTask.taskCategoryId"
                    :filter="filterItems"
                    :item-text="item => $t(item.name)"
                    :item-value="item => item.taskCategoryId"
                    :items="listWorkType"
                    :readonly="true"
                    append-icon=""
                    class="text--body-5 pr-3"
                    dense
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        :input-value="data.selected"
                      >
                        <span>
                          {{ data.item.name }}
                        </span>
                      </v-chip>
                    </template>
                  </v-autocomplete>
                </div>
              </div>

              <!--                cong viec con-->
              <div class="row pr-5">
                <div class="col-6 col-md-3 mt-3 pb-0 d-flex align-center">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.label.task-child') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <div
                    v-for="(child, idx) in dataTask.childrenTask"
                    :key="idx"
                  >
                    <chirldren-task-detail
                      :deadline-parent-work="datesPicker"
                      :end-time-parent="endTime"
                      :form-data="child"
                      :format-date="formatDate"
                      :is-disable="isEditChildWork"
                      :item="child"
                      :list-status-task="listStatusTask"
                      :list-user="listCombinator"
                      :start-time-parent="startTime"
                      @task-detail="getTaskChirldrenDetail(child.id)"
                      @remove-child-task="removeChildWork(idx)"
                    />
                  </div>
                  <div v-if="isEditChildWork" class="d-flex align-start">
                    <div class="pt-3" @click="addChildWork()">
                      <v-btn
                        elevation="0"
                        fab
                        x-small
                      >
                        <v-icon color="#22242C" size="28">mdi-plus-circle-outline</v-icon>
                      </v-btn>
                      <b
                        class="text pl-1 btn"
                        style="color: #A7A7AB"
                      >{{ $t('task-manager.label.child-work') }}</b>
                    </div>
                  </div>
                </div>
              </div>

              <!--                Nguon goc-->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.label.parent-work') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-autocomplete
                    v-model="dataTask.sourceTask"
                    :item-text="item=>item.name"
                    :item-value="item=>item.id"
                    :items="listAssociation"
                    :outlined="isEditSourceTask"
                    :placeholder="isEditSourceTask ? $t('task-manager.placeHolder.source-task') : ''"
                    append-icon=""
                    class="text--body-5 pr-3 cursor-pointer"
                    dense
                    height="40px"
                    hide-no-data
                    readonly
                    return-object
                    @click="openDialogSelectSoureTask"
                  >
                    <template v-slot:selection="data">
                      <v-tooltip
                        content-class="tooltip-top"
                        top
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip
                            :close="isEditSourceTask"
                            v-bind="attrs"
                            @click="data.select"
                            v-on="on"
                            @click:close="removeSourceTask()"
                          >

                            <v-avatar left>
                              <v-img v-if="checkEqualItem(data.item.associationType , 'DOCUMENT')" :src="require('@/assets/icons/task/createTask/document.svg')" />
                              <v-img v-if="checkEqualItem(data.item.associationType , 'TICKET')" :src="require('@/assets/icons/task/createTask/ticket.svg')" />
                              <v-img v-if="checkEqualItem(data.item.associationType , 'TASK')" :src="require('@/assets/icons/task/createTask/work.svg')" />
                            </v-avatar>
                            {{ getTextTruncate(data.item.name,15) }}
                          </v-chip>
                        </template>
                        <span>{{ data.item.name }}</span>
                      </v-tooltip>
                    </template>
                  </v-autocomplete>
                  <dialog-select-source-task
                    :excludes="[{ id:dataTask.id, associationType: 'TASK' }]"
                    :show-dialog="showDialogSourceTask"
                    :source-task="dataTask.sourceTask"
                    :title="'task-manager.title.source-task'"
                    @source-task="sourceTaskFromEmit"
                    @close-dia-log="closeDialogSelectSourceTask"
                    @list-association="listAssociationFromEmit"
                  />
                </div>
              </div>

              <!--                lien ket -->
              <div class="clear-display row pr-5">
                <div class="d-flex justify-start align-center col-6 col-md-3 pb-0">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.label.link-to') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-autocomplete
                    v-model="dataTask.taskAssociations"
                    :item-text="item=>item.name"
                    :item-value="item=>item.id"
                    :items="dataTask.taskAssociations"
                    :outlined="isEditSourceTask"
                    :placeholder="isEditSourceTask ? $t('task-manager.placeHolder.link-to') : ''"
                    append-icon=""
                    class="text--body-5 pr-3 cursor-pointer"
                    dense
                    height="auto"
                    hide-no-data
                    multiple
                    readonly
                    return-object
                    @click="openDialogSelectTaskAssociations"
                  >
                    <template v-slot:selection="{ item,index }">
                      <v-tooltip
                        content-class="tooltip-top"
                        top
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip
                            :close="isEditSourceTask"
                            :input-value="item.selected"
                            v-bind="attrs"
                            v-on="on"
                            @click:close="removeLinkto(index)"
                          >
                            <v-avatar left>
                              <v-img v-if="checkEqualItem(item.associationType , 'DOCUMENT')" :src="require('@/assets/icons/task/createTask/document.svg')" />
                              <v-img v-if="checkEqualItem(item.associationType , 'TICKET')" :src="require('@/assets/icons/task/createTask/ticket.svg')" />
                              <v-img v-if="checkEqualItem(item.associationType , 'TASK')" :src="require('@/assets/icons/task/createTask/work.svg')" />
                            </v-avatar>
                            {{ getTextTruncate(item.name,15) }}
                          </v-chip>
                        </template>
                        <span>{{ item.name }}</span>
                      </v-tooltip>

                    </template>
                  </v-autocomplete>
                  <DialogSelectLinkTo
                    :excludes="[{ id:dataTask.id, associationType: 'TASK' }]"
                    :show-dialog="showDialogSelectTaskAssociations"
                    :task-associations="dataTask.taskAssociations"
                    :title="'task-manager.title.link-to'"
                    @list-link-to="linkToFromEmit"
                    @close-dia-log="closeDialogSelectTaskAssociations"
                  />
                </div>
              </div>

              <!--                mo ta chi tiet-->
              <div class="row pr-5">
                <div
                  class="col-6 col-md-3 pb-0"
                >
                  <label class="v-label label-detail">
                    {{ $t('task-manager.task-detail.description') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-textarea
                    v-if="isEditDescription"
                    v-model="dataTask.content"
                    :placeholder="isEditDescription ? $t('task-manager.label.description') : ''"
                    :readonly="!isEditDescription"
                    class="text--body-5 pr-3"
                    counter="500"
                    dense
                    maxlength="500"
                    outlined
                    rows="3"
                    @change="dataTask.content = trimSpace(dataTask.content)"
                  />
                  <span v-else>
                    {{ dataTask.content }}
                  </span>
                </div>
              </div>

              <!--                file dinh kem-->
              <div class="clear-display row pr-5">
                <div class="col-6 col-md-3 pb-0 mt-6">
                  <label class="v-label label-detail">
                    {{ $t('task-manager.task-detail.file') }}
                  </label>
                </div>
                <div class="col-6 col-md-9 pb-0">
                  <v-col md="12">
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
                          <li v-for="(file, index) in dataTask.fileAttachments" :key="index">
                            <img
                              :src="getIconFile(`${file.fileName}`)"
                              class="mr-2"
                            >
                            <span>{{ customFileName(file) }}</span>

                            <span
                              v-if="isUploadFile && checkCurrentUserId(file.createdBy)"
                              class="remove-attach"
                              @click="removeFileAttach(index)"
                            ><v-icon>mdi-close</v-icon>
                            </span>
                            <span
                              class="btn"
                              @click="downloadFileAttach(index)"
                            ><v-icon>mdi-tray-arrow-down</v-icon></span>
                          </li>
                        </ul>
                        <div v-if="isUploadFile" class="d-flex justify-space-between align-center mr-2 mt-4">
                          <div>
                            <div class="text--body-1">
                              {{ $t('contract.format') }}: pdf, doc, docx, xlsx, xls, png, jpg, msg, txt,rar,zip
                            </div>
                            <div class="text-danger text--body-2">
                              ({{ $t('contract.fileMax') }} 50MB)
                            </div>
                          </div>
                        </div>
                      </validation-provider>
                      <v-btn
                        v-if="isUploadFile"
                        :disabled="uploadingFileAttatch"
                        :loading="uploadingFileAttatch"
                        class="btn-upload ml-auto"
                        outlined
                        @click="uploadAttachs"
                      >
                        <v-icon size="30">mdi-upload</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isShowComment" class="form-history-comment col-md-6">
            <!--              lich su-->
            <div class="mt-3 pl-2">
              <label class="text-title-history">
                {{ $t('task-manager.task-detail.history') }}
              </label>
              <history-action-task
                :history-task="historiesDemo"
                :render-avatar-text="renderAvatarText"
              />
            </div>
            <!--              binh luan -->
            <div class="mt-6 ml-1">
              <label class="text-title-history">
                {{ $t('task-manager.task-detail.comment') }}
              </label>
              <EmptyBox
                v-if="listCommentDemo.length === 0"
                :show-subtitle="true"
                :subtitle="$t('task-manager.empty.list-comment-task')"
              />
              <div v-if="listCommentDemo > 0" class="list-comment-detail">
                <div v-for="(item, index) in listCommentDemo" :key="index">
                  <list-comment-task
                    :comment-obj="item"
                    :format-date="formatDate"
                    @comment-task="commentFromEmit"
                  />
                </div>
              </div>
            </div>

            <div class="d-flex flex-row justify-center align-center">
              <v-list-item-avatar class="avatar-comment">
                <img
                  alt="demo"
                  src="https://cdn.vuetifyjs.com/images/lists/1.jpg"
                  style="border: 1.5px solid #D3D3D5;"
                >
              </v-list-item-avatar>
              <div class="ml-2 col-md-10">
                <vue-editor
                  v-model="comment"
                  :editor-options="editorSettings"
                  :editor-toolbar="customToolbar"
                  :placeholder="$t('task-manager.placeHolder.add-comment')"
                >
                </vue-editor>
              </div>
            </div>
          </div>
        </div>
        <div :class="isShowComment ? 'd-flex justify-center align-end' : 'd-flex justify-end align-center mr-3'">
          <v-card-actions class="d-flex justify-end align-center my-3" style="gap: 10px;">
            <v-btn
              class="w-150 py-5 text--button btn-box-shadow"
              color="primary"
              outlined
              rounded
              @click="closeDialog"
            >
              {{ $t('close') }}
            </v-btn>
            <v-btn
              v-if="isEditTask"
              :disabled="invalid"
              class="w-150 py-5 text--button btn-box-shadow"
              color="primary"
              rounded
              @click="openDialogConfirmUpdate"
            >
              {{ $t('task-manager.button.update') }}
            </v-btn>
          </v-card-actions>
        </div>
      </validation-observer>
      <dialog-confirm-task
        :loading="loading"
        :show-dialog="showDialogConfirmUpdate"
        :title="$t('task-manager.confirm.update')"
        @close-dialog="showDialogConfirmUpdate = false"
        @accept-action="updateTask"
      />
      <dialog-update-process
        :data-process="dataProcess"
        :row-id="dataTask.id"
        :show-dialog="showDialogUpdateProcess"
        @change-process="changeProcessFromEmit"
        @close-dialog="closeDialogUpdateProcess"
      />
      <dia-log-confirm
        :obj-confirm="objConfirm"
        @accept-action="acceptAction"
        @close-dialog="closeDialogConfirm"
      />
      <base-preload :dialog="loading" />
    </div>
  </v-fade-transition>
</template>
<script>
import { TaskService } from '@/modules/etask/services/taskService'
import { mapActions } from 'vuex'
import Constants from '@/modules/etask/constants'
import constants from '@/modules/etask/constants'
import ChirldrenTaskDetail from "@/modules/etask/views/components/ChirldrenTaskDetail";
import DialogSelectSourceTask from "@/components/dialog/DialogSelectSourceTask";
import DialogSelectLinkTo from "@/components/dialog/DialogSelectLinkTo";
import DialogConfirmTask from "@/modules/etask/views/components/DialogConfirmTask";
import DiaLogConfirm from "@/modules/etask/views/components/DiaLogConfirm";
import DialogUpdateProcess from "@/modules/etask/views/components/DialogUpdateProcess";
import HistoryActionTask from "@/modules/etask/views/components/HistoryActionTask";
import ListCommentTask from "@/modules/etask/views/components/ListCommentTask";
import PopUpUserInfoDetailTask from "@/modules/etask/views/components/PopUpUserInfoDetailTask";
import ListUserInfoDetailTask from "@/modules/etask/views/components/ListUserInfoDetailTask";
import EmptyBox from "@/views/components/EmptyBox";
import moment from 'moment'
import fileMixin from '@/modules/econtract/mixins/fileMixin'
import rules from '@/mixins/rules'
import { VueEditor } from "vue2-editor";
import filterItems from '@/mixins/filterItems.js'
import actionsTask from "@/modules/etask/mixins/actionsTask";
import statusTask from "@/modules/etask/mixins/statusTask";

const initChildWorkData = {
  name: '',
  status: '',
  endDate: null,
  startDate: null,
  performer: null,
  creatorId: null
}

const initObjTask = {
  taskId: null
}

export default {
  name: 'DialogTaskDetail',
  components: {
    ChirldrenTaskDetail,
    DialogSelectSourceTask,
    VueEditor,
    DialogConfirmTask,
    DialogUpdateProcess,
    ListCommentTask,
    DialogSelectLinkTo,
    DiaLogConfirm,
    HistoryActionTask,
    EmptyBox,
    PopUpUserInfoDetailTask,
    ListUserInfoDetailTask
  },
  mixins: [fileMixin, rules, filterItems, actionsTask, statusTask],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    dataTask: {
      type: Object,
      default: undefined
    },
    taskIdDetail: {
      type: Number,
      default: 0
    },
    isPermissonApprove: {
      type: Boolean,
      default: false
    },
    formDataSearch: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      editorSettings: {
        modules: {
          imageDrop: true,
          imageResize: {}
        }},
      content: '',
      color: '#00c3f9',
      isApprove: '',
      searchPefomer: '',
      searchFollow: '',
      isShowComment: false,
      showDialogConfirmUpdate: false,
      showDialogUpdateProcess: false,
      showEmoji: false,
      lstColors: ['#FFAF2E', '#0FAFE4', '#4A50E2', '#F028A0', '#FF4A55'],
      loading: false,
      listPriority: [
        {
          label: 'task-manager.dialogs.priority.high',
          value: Constants.PRIORITY.HIGH,
          class: 'priority-task priority-high',
          colorIcon: '#FF4A55',
          bg: '#FFDBDD'
        },
        {
          label: 'task-manager.dialogs.priority.normal',
          value: Constants.PRIORITY.MEDIUM,
          class: 'priority-task priority-normal',
          colorIcon: '#FD8538',
          bg: '#FFE7D7'
        },
        {
          label: 'task-manager.dialogs.priority.draft',
          value: Constants.PRIORITY.LOW,
          class: 'priority-task priority-draff',
          colorIcon: '#7A7C80',
          bg: '#D3D3D5'
        }
      ],
      listStateTask: [
        {
          name: 'task-manager.select-box.processing',
          value: 'processing',
          colors: '#FFAF2E',
          className: 'state state-processing'
        },
        {
          name: 'task-manager.select-box.wait-process',
          value: 'wait-process',
          colors: '#4A50E2',
          className: 'state state-wait-process'
        },
        {
          name: 'task-manager.select-box.complete',
          value: 'complete',
          colors: '#0FAFE4',
          className: 'state state-complete'
        },
        { name: 'task-manager.select-box.draft', value: 'draft', colors: '#0FAFE4', className: 'state state-draft' }
      ],
      listStatusTask: [
        {
          value: Constants.STATUS_TASK.NEW,
          icon: require('@/assets/icons/task/detailTask/start.png'),
          label: 'task-manager.status.new',
          bg: '#8E8EA1',
          background: '#E9E9EA'

        },
        {
          value: Constants.STATUS_TASK.INPROGRESS,
          icon: require('@/assets/icons/task/statusTask/icon1.png'),
          label: 'task-manager.status.inprogress',
          bg: '#FFAF2E',
          background: '#FFEFD5'
        },
        {
          value: Constants.STATUS_TASK.FINISH,
          icon: require('@/assets/icons/task/statusTask/complete.png'),
          label: 'task-manager.status.finish',
          bg: '#0FAFE4',
          background: '#CCF3FE'
        },
        {
          value: Constants.STATUS_TASK.DELETED,
          icon: require('@/assets/icons/task/statusTask/cancel.png'),
          label: 'task-manager.status.delete',
          bg: '#FF4A55',
          background: '#FFE8E9'
        },
        {
          value: Constants.STATUS_TASK.REVIEW_RECEIVING,
          icon: require('@/assets/icons/task/statusTask/reviewReceiving.png'),
          label: 'task-manager.status.review-receiving',
          bg: '#4A50E2',
          background: '#DEDFFF'
        },
        {
          value: Constants.STATUS_TASK.RECEIVED_UNPROCESS,
          icon: require('@/assets/icons/task/statusTask/RECEIVED_UNPROCESS.svg'),
          label: 'task-manager.status.received-unprocess',
          bg: '#FD8538',
          background: '#FFECDF'
        },
        {
          value: Constants.STATUS_TASK.REJECT_RECEIVING,
          icon: require('@/assets/icons/task/statusTask/REJECT_RECEIVING.svg'),
          label: 'task-manager.status.reject-receiving',
          bg: '#FF4A55',
          background: '#FFE8E9'
        },
        {
          value: Constants.STATUS_TASK.CLOSED,
          icon: require('@/assets/icons/task/statusTask/closeStatus.svg'),
          label: 'task-manager.status.closed',
          bg: '#0FAFE4',
          background: '#CCF3FE'
        },
        {
          value: Constants.STATUS_TASK.CANCELED,
          icon: require('@/assets/icons/task/statusTask/cancel.png'),
          label: 'task-manager.status.canceled',
          bg: '#FF4A55',
          background: '#FFE8E9'
        },
        {
          value: Constants.STATUS_TASK.REVIEW_SENDING,
          icon: require('@/assets/icons/task/statusTask/reviewSending.svg'),
          label: 'task-manager.status.review-sending',
          bg: '#4A50E2',
          background: '#DEDFFF'
        },
        {
          value: Constants.STATUS_TASK.PENDING,
          icon: require('@/assets/icons/task/detailTask/pause.png'),
          label: 'task-manager.status.pending',
          bg: '#4A50E2',
          background: '#EDEEFF'
        },

      ],
      listCommentDemo: [],
      historiesDemo: [],
      customToolbar: [
        constants.ACTION_EDITOR.BOLD,
        constants.ACTION_EDITOR.ITALIC,
        constants.ACTION_EDITOR.UNDERLINE,
        constants.ACTION_EDITOR.IMAGE,
        { list: constants.ACTION_EDITOR.LIST.BUTTLET },
        { list: constants.ACTION_EDITOR.LIST.ORDERED },
        { align: "" },
        { align: constants.ACTION_EDITOR.LIST.CENTER },
        { align: constants.ACTION_EDITOR.LIST.RIGHT },
        { align: constants.ACTION_EDITOR.LIST.JUSTIFY },
      ],
      listWorkType: [],
      listCombinator: [],
      listAssigner: [],
      listMonitorTranfer: [],
      listCombinaTorTransfer: [],
      listMonitor: [],
      listAction: [
        {
          label: 'task-manager.button.consider-work',
          value: constants.APPROVE_STATUS.APPROVE,
          button: require('@/assets/icons/task/detailTask/check.svg'),
          title: 'task-manager.confirm.consider-work',
        }, {
          label: 'task-manager.button.refuse-to-consider',
          value: constants.APPROVE_STATUS.REJECT,
          button: require('@/assets/icons/task/detailTask/del.svg'),
          title: 'task-manager.confirm.refuse-to-consider',
        }
      ],
      fileAttachs: [],
      menuOpenDate: null,
      menuActDate: null,
      expiredFromPicker: null,
      showDialogSourceTask: false,
      showDialogSelectTaskAssociations: false,
      uploadingFileAttatch: false,
      nameFileAttachs: [],
      comment: '',
      isHeart: false,
      menuDateFromTo: false,
      dateRangeText: '',
      dateActRangeText: '',
      datesPicker: [],
      datesActPicker: [],
      errorDateFromTo: '',
      startTime: null,
      listAssociation: [],
      endTime: null,
      actStartTime: null,
      actEndTime: null,
      valueActStartDate: null,
      valueActEndDate: null,
      menuStarttimePicker: false,
      menuEndTimePicker: false,
      menuStartActTimePicker: false,
      menuEndActTimePicker: false,
      isPermissionUpdate: false,
      startDateStr: '',
      endDateStr: '',
      startActDateStr: '',
      endActDateStr: '',
      errorActEndTime: '',
      errorEndTime: '',
      dataProcess: {
        process: ''
      },
      listActionConfirm: [
        constants.TASK_MANAGER_ACTIONS.REMOVE,
        constants.TASK_MANAGER_ACTIONS.CANCEL,
        constants.TASK_MANAGER_ACTIONS.PAUSE,
        constants.TASK_MANAGER_ACTIONS.REVIEW,
        constants.TASK_MANAGER_ACTIONS.DENY_REVIEW,
        constants.TASK_MANAGER_ACTIONS.TAKE_OVER,
        constants.TASK_MANAGER_ACTIONS.DENY_TAKE_OVER,
        constants.TASK_MANAGER_ACTIONS.APPROVE,
        constants.TASK_MANAGER_ACTIONS.DENY_APPROVE,
        constants.TASK_MANAGER_ACTIONS.RESENT_REVIEW,
        constants.TASK_MANAGER_ACTIONS.RESENT_APPROVE,
        constants.TASK_MANAGER_ACTIONS.RESENT_TAKE_OVER
      ],
      objConfirm: {
        titleConfirm: '',
        showDialogConfirm: false,
        isReason: false,
        isNull: false,
        comment: '',
        status: false
      },
      actionTask: '',
      statusBegin: null,
    }
  },
  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },
    hiddenAction() {
      // action chua lam nen tam thoi an di comment lai sau mo ra
      return false
    },
    isEditStatus() {
      const arrStatus = [
        constants.STATUS_TASK.PENDING, // Dong
        constants.STATUS_TASK.CLOSED // Tam dung
      ]
      const userRole = []
      this.dataTask.currentUserRoles.filter(item => {
        const roles = [
          constants.PERMISSION.ASSIGNER, // nguoi giao
          constants.PERMISSION.MANAGER_ASSIGNER // lanh dao nguoi giao
        ]
        if (roles.includes(item)) {
          userRole.push(item)
        }
      })
      return arrStatus.includes(this.dataTask.status) && userRole.length > 0
    },
    isEditSourceTask() {
      let result = false
      const arrStatusCreator = [
        constants.STATUS_TASK.NEW, // khoi tao
        constants.STATUS_TASK.REVIEW_RECEIVING, // cho tiep nhan
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.REJECT_RECEIVING, // tu choi tiep nhan
        constants.STATUS_TASK.REVIEW_SENDING // cho xem set
      ]
      const arrStatusAssigner = [
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.REJECT_RECEIVING, // tu choi tiep nhan
        constants.STATUS_TASK.REVIEW_SENDING // cho xem set
      ]
      this.dataTask.currentUserRoles.filter(user => {
        if (user === constants.PERMISSION.ASSIGNER && arrStatusAssigner.includes(this.dataTask.status)) {
          result = true
        }
        if (user === constants.PERMISSION.CREATOR && arrStatusCreator.includes(this.dataTask.status)) {
          result = true
        }
      })
      return result
    },
    isEditAssginer() {
      return (this.dataTask.status === constants.STATUS_TASK.NEW &&
          this.dataTask.currentUserRoles.includes(constants.PERMISSION.CREATOR))
    },
    isEditPerfomer() {
      let result = false
      const arrStatusCreate = [
        constants.STATUS_TASK.NEW, // khoi tao
        constants.STATUS_TASK.REVIEW_SENDING // cho xem xet
      ]
      const arrStatusAssigner = [
        constants.STATUS_TASK.NEW, // khoi tao
        constants.STATUS_TASK.REVIEW_SENDING, // cho xem xet
        constants.STATUS_TASK.INPROGRESS // dang thuc hien
      ]
      const arrStatusManagerAssigner = [
        constants.STATUS_TASK.INPROGRESS // dang thuc hien
      ]
      this.dataTask.currentUserRoles.filter(user => {
        if (user === constants.PERMISSION.CREATOR && arrStatusCreate.includes(this.dataTask.status)) {
          result = true
        }
      })
      this.dataTask.currentUserRoles.filter(user => {
        if (user === constants.PERMISSION.ASSIGNER && arrStatusAssigner.includes(this.dataTask.status)) {
          result = true
        }
      })
      this.dataTask.currentUserRoles.filter(user => {
        if (user === constants.PERMISSION.MANAGER_ASSIGNER && arrStatusManagerAssigner.includes(this.dataTask.status)) {
          result = true
        }
      })
      return result
    },
    isEditProgress: function() {
      const arrStatusAssigner = [
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.INPROGRESS, // dang thuc hien
        constants.STATUS_TASK.FINISH, // hoan thanh
        constants.STATUS_TASK.CLOSED // dong
      ]
      const arrStatusPerformer = [
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.INPROGRESS, // dang thuc hien
        constants.STATUS_TASK.FINISH // hoan thanh
      ]
      let temp = null
      temp = this.dataTask.currentUserRoles.find(user => user === constants.PERMISSION.ASSIGNER &&
          arrStatusAssigner.includes(this.dataTask.status)
      )
      if (temp) return true

      temp = this.dataTask.currentUserRoles.find(user =>
        user === constants.PERMISSION.PERFORMER && arrStatusPerformer.includes(this.dataTask.status))

      if (temp) return true

      if (this.dataTask.performer) {
        if (this.dataTask.performer.objectType === constants.OBJECT_TYPE.GROUP) {
          temp = this.dataTask.currentUserRoles.find(user => user === constants.PERMISSION.MANAGER_PERFORMER && arrStatusPerformer.includes(this.dataTask.status))
        }
      }
      if (temp) return true
      return false
    },
    isEditTime() {
      const userRole = []
      this.dataTask.currentUserRoles.filter(user => {
        const arrCheck = [
          constants.PERMISSION.ASSIGNER, // nguoi giao
          constants.PERMISSION.CREATOR, // nguoi tao
          constants.PERMISSION.MANAGER_ASSIGNER // lanh dao nguoi giao
        ]
        if (arrCheck.includes(user)) {
          userRole.push(user)
        }
      })
      const arrCheckStatus = [
        constants.STATUS_TASK.NEW, // khoi tao
        constants.STATUS_TASK.REVIEW_SENDING, // cho xem xet
        constants.STATUS_TASK.REVIEW_RECEIVING, // cho tiep nhan
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.INPROGRESS // dang thuc hien
      ]
      return userRole.length > 0 && arrCheckStatus.includes(this.dataTask.status)
    },
    isEditRealTime() {
      const arrCheckStatus = [
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.INPROGRESS, // dang thuc hien
        constants.STATUS_TASK.FINISH, // hoan thanh
      ]
      const userRole = []
      this.dataTask.currentUserRoles.filter(user => {
        const arrCheckRole = [
          constants.PERMISSION.PERFORMER, // nguoi thuc hien
          constants.PERMISSION.MANAGER_PERFORMER, // lanh dao nguoi thuc hien
        ]
        if (arrCheckRole.includes(user)) {
          userRole.push(user)
        }
      })
      return arrCheckStatus.includes(this.dataTask.status) && userRole.length > 0
    },
    isEditCombinator() {
      const userRole = []
      this.dataTask.currentUserRoles.filter(user => {
        const arrCheckRole = [
          constants.PERMISSION.CREATOR, // nguoi tao
          constants.PERMISSION.ASSIGNER, // nguoi giao
          constants.PERMISSION.PERFORMER, // nguoi thuc hien
          constants.PERMISSION.MANAGER_ASSIGNER, // lanh dao nguoi giao
          constants.PERMISSION.MANAGER_PERFORMER // lanh dao nguoi thuc hien
        ]
        if (arrCheckRole.includes(user)) {
          userRole.push(user)
        }
      })
      const arrCheckStatus = [
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.INPROGRESS, // dang thuc hien
        constants.STATUS_TASK.FINISH, // hoan thanh
      ]
      return arrCheckStatus.includes(this.dataTask.status) && userRole.length > 0
    },
    isEditFollower() {
      const arrCheckStatus = [
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.INPROGRESS, // dang thuc hien
        constants.STATUS_TASK.FINISH, // hoan thanh
      ]
      const userRole = []
      this.dataTask.currentUserRoles.filter(user => {
        const arrCheckRole = [
          constants.PERMISSION.CREATOR, // nguoi tao
          constants.PERMISSION.ASSIGNER, // nguoi giao
          constants.PERMISSION.MANAGER_ASSIGNER, // lanh dao nguoi giao
          constants.PERMISSION.MANAGER_PERFORMER // lanh dao nguoi thuc hien
        ]
        if (arrCheckRole.includes(user)) {
          userRole.push(user)
        }
      })
      return arrCheckStatus.includes(this.dataTask.status) && userRole.length > 0
    },
    isEditChildWork() {
      const arrCheckStatus = [
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.INPROGRESS, // dang thuc hien
        constants.STATUS_TASK.FINISH, // hoan thanh
      ]
      const userRole = []
      this.dataTask.currentUserRoles.filter(user => {
        const arrCheckRole = [
          constants.PERMISSION.COMBINATOR,
          constants.PERMISSION.CREATOR, // nguoi tao
          constants.PERMISSION.ASSIGNER, // nguoi giao
          constants.PERMISSION.PERFORMER, // nguoi thuc hien
          constants.PERMISSION.MANAGER_PERFORMER // lanh dao nguoi thuc hien
        ]
        if (arrCheckRole.includes(user)) {
          userRole.push(user)
        }
      })
      return arrCheckStatus.includes(this.dataTask.status) && userRole.length > 0
    },
    isEditDescription() {
      const userRole = []
      this.dataTask.currentUserRoles.filter(user => {
        const arrCheckRole = [
          constants.PERMISSION.ASSIGNER, // nguoi giao
          constants.PERMISSION.CREATOR // nguoi tao
        ]
        if (arrCheckRole.includes(user)) {
          userRole.push(user)
        }
      })
      const arrCheckStatus = [
        constants.STATUS_TASK.NEW, // khoi tao
        constants.STATUS_TASK.REVIEW_RECEIVING, // cho tiep nhan
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.INPROGRESS, // dang thuc hien
        constants.STATUS_TASK.FINISH, // hoan thanh
        constants.STATUS_TASK.REVIEW_SENDING, // cho xem xet
      ]
      return arrCheckStatus.includes(this.dataTask.status) && userRole.length > 0
    },
    isUploadFile() {
      const userRole = []
      this.dataTask.currentUserRoles.filter(user => {
        const arrCheckRole = [
          constants.PERMISSION.CREATOR, // nguoi tao
          constants.PERMISSION.ASSIGNER, // nguoi giao
          constants.PERMISSION.PERFORMER // nguoi thuc hien
        ]
        if (arrCheckRole.includes(user)) {
          userRole.push(user)
        }
      })
      const arrCheckStatus = [
        constants.STATUS_TASK.NEW, // khoi tao
        constants.STATUS_TASK.REVIEW_RECEIVING, // cho tiep nhan
        constants.STATUS_TASK.RECEIVED_UNPROCESS, // chua thuc hien
        constants.STATUS_TASK.INPROGRESS, // dang thuc hien
        constants.STATUS_TASK.FINISH // hoan thanh
      ]
      return arrCheckStatus.includes(this.dataTask.status) && userRole.length > 0
    },
    isEditTask() {
      if (this.isEditStatus ||
          this.isEditSourceTask ||
          this.isEditAssginer ||
          this.isEditPerfomer ||
          this.isEditProgress ||
          this.isEditTime ||
          this.isEditRealTime ||
          this.isEditCombinator ||
          this.isEditFollower ||
          this.isEditChildWork ||
          this.isEditDescription ||
          this.isUploadFile
      ) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    showDialog() {
      if (this.showDialog) {
        this.getListExcutor()
        this.getWorkType()
        this.getListAsginer()
        this.getListMonitor()
        this.checkDateTime()
        this.checkActTime()
        if (this.dataTask.fileAttachments == null) {
          this.dataTask.fileAttachments = []
        }
      }
    },
    datesPicker() {
      if (this.datesPicker[0]) {
        if (this.datesPicker[1]) {
          const selectDate = moment(this.datesPicker[0], 'YYYY-MM-DD')
          const timeExprired = moment(this.datesPicker[1], 'YYYY-MM-DD')
          const diff = selectDate.diff(timeExprired, 'days')
          if (diff > 0) {
            const temp = this.datesPicker[0]
            this.datesPicker[0] = this.datesPicker[1]
            this.datesPicker[1] = temp
          }
          const startDate = this.datesPicker[0]
          const endDate = this.datesPicker[1]
          this.startDateStr = moment(startDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
          this.endDateStr = moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
          this.dateRangeText = this.startDateStr + ' - ' + this.endDateStr
        } else {
          this.startDateStr = ''
          this.endDateStr = ''
          const endDate = this.datesPicker[0]
          this.endDateStr = moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
          this.dateRangeText = this.endDateStr
          this.startTime = ''
          this.endTime = ''
        }
      } else {
        this.startDateStr = ''
        this.endDateStr = ''
        this.startTime = ''
        this.endTime = ''
        this.dateRangeText = ''
      }
    },
    startTime() {
      if (this.endTime) {
        const selectDate = moment(this.datesPicker[0], 'YYYY-MM-DD')
        const timeExprired = moment(this.datesPicker[1], 'YYYY-MM-DD')
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
      if (this.datesPicker[0] && this.datesPicker[1]) {
        if (this.startTime) {
          const selectDate = moment(this.datesPicker[0], 'YYYY-MM-DD')
          const timeExprired = moment(this.datesPicker[1], 'YYYY-MM-DD')
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
    dataTask: {
      handler() {
        const currentUser = JSON.parse(localStorage.getItem('USER_INFO'))
        this.checkDuplicateUser()
        // pass*/
        // set nguoi tao cho list nguoi phoi hop
        if (this.dataTask.combinators && this.dataTask.combinators.length > 0) {
          this.dataTask.combinators.forEach(user => {
            if (user.createdBy === null) {
              user.createdBy = currentUser.userId
            }
          })
        }

        // set nguoi tao cho list nguoi theo doi
        if (this.dataTask.monitors && this.dataTask.monitors.length > 0) {
          this.dataTask.monitors.forEach(user => {
            if (user.createdBy === null) {
              user.createdBy = currentUser.userId
            }
          })
        }

        // set nguoi tao cho nguoi thuc hien
        if (this.dataTask.performer) {
          this.dataTask.performer.createdBy = currentUser.userId
        }
        // set nguoi tao cho nguoi thuc giao

        if (this.dataTask.assigner) {
          this.dataTask.assigner.createdBy = currentUser.userId
        }
      }, deep: true
    },
    "dataTask.id"() {
      this.checkDuplicateUser()
      if (this.dataTask.status) {
        this.statusBegin = this.dataTask.status
      }
      if (!this.dataTask.fileAttachments) {
        this.dataTask.fileAttachments = []
      }
      this.dataProcess.process = this.dataTask.progress
      this.datesPicker = []
      this.datesActPicker = []
      if (this.dataTask.sourceTask) {
        this.listAssociation.push(this.dataTask.sourceTask)
      }
      if (this.dataTask.currentUserRoles === null) {
        this.dataTask.currentUserRoles = []
      }
      this.dateActRangeText = ''
      this.dateRangeText = ''
      this.checkDateTime()
      this.checkActTime()
    },
    "dataTask.status"() {
      if (this.dataTask.status) {
        this.statusBegin = this.dataTask.status
      }
    },
    actStartTime() {
      if (this.actStartTime) {
        const selectDate = moment(this.datesActPicker[0], 'YYYY-MM-DD')
        const timeExprired = moment(this.datesActPicker[1], 'YYYY-MM-DD')
        const diff = selectDate.diff(timeExprired, 'days')
        if (diff === 0) {
          const strEndTime = this.actEndTime.split(':')
          const strStartTime = this.actStartTime.split(':')
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
    actEndTime() {
      if (this.datesActPicker[0] && this.datesActPicker[1]) {
        if (this.actStartTime) {
          const selectDate = moment(this.datesActPicker[0], 'YYYY-MM-DD')
          const timeExprired = moment(this.datesActPicker[1], 'YYYY-MM-DD')
          const diff = selectDate.diff(timeExprired, 'days')
          if (diff === 0) {
            const strEndTime = this.actEndTime.split(':')
            const strStartTime = this.actStartTime.split(':')
            const totalSeconds1 = parseInt(strStartTime[0] * 3600 + strStartTime[1] * 60);
            const totalSeconds2 = parseInt(strEndTime[0] * 3600 + strEndTime[1] * 60);
            if (totalSeconds1 > totalSeconds2) {
              this.errorActEndTime = 'task-manager.error.end-date'
            } else {
              this.errorActEndTime = ''
            }
          } else {
            this.errorActEndTime = ''
          }
        } else {
          this.errorActEndTime = ''
        }
      } else {
        this.errorActEndTime = ''
      }
    },
    datesActPicker() {
      if (this.datesActPicker[0]) {
        if (this.datesActPicker[1]) {
          const selectDate = moment(this.datesActPicker[0], 'YYYY-MM-DD')
          const timeExprired = moment(this.datesActPicker[1], 'YYYY-MM-DD')
          const diff = selectDate.diff(timeExprired, 'days')
          if (diff > 0) {
            const temp = this.datesActPicker[0]
            this.datesActPicker[0] = this.datesActPicker[1]
            this.datesActPicker[1] = temp
          }
          const startDate = this.datesActPicker[0]
          const endDate = this.datesActPicker[1]
          this.startActDateStr = moment(startDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
          this.endActDateStr = moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
          this.dateActRangeText = this.startActDateStr + ' - ' + this.endActDateStr
        } else {
          const endDate = this.datesActPicker[0]
          this.startActDateStr = ''
          this.endActDateStr = moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
          this.actStartTime = ''
          this.dateActRangeText = this.endActDateStr
        }
      } else {
        this.endActDateStr = ''
        this.startActDateStr = ''
        this.actEndTime = ''
        this.actStartTime = ''
        this.dateActRangeText = ''
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    checkDuplicateUser() {
      if (this.dataTask.fileAttachments == null) {
        this.dataTask.fileAttachments = []
      }
      if (this.dataTask.performer && !this.dataTask.assigner) {
        const newArrMonitorTranfer = []
        const newArrCombiNatorTranfer = []
        if (this.dataTask.performer.objectType === constants.OBJECT_TYPE.USER) {
          this.listMonitor.filter(item => {
            if (item.userId !== this.dataTask.performer.userId) { newArrMonitorTranfer.push(item) }
          })
          this.listMonitorTranfer = newArrMonitorTranfer
          this.listCombinator.filter(item => {
            if (item.userId !== this.dataTask.performer.userId) { newArrCombiNatorTranfer.push(item) }
          })
          this.listCombinaTorTransfer = newArrCombiNatorTranfer
        } else {
          this.listCombinator.filter(item => {
            if (item.groupId !== this.dataTask.performer.groupId) { newArrCombiNatorTranfer.push(item) }
          })
          this.listCombinaTorTransfer = newArrCombiNatorTranfer
        }
      }
      // // nguoi giao va ng thuc hien null
      if (this.dataTask.assigner && !this.dataTask.performer) {
        const newArrMonitorTranfer = []
        const newArrCombiNatorTranfer = []
        this.listMonitor.filter(item => {
          if (item.userId !== this.dataTask.assigner.userId

          ) {
            newArrMonitorTranfer.push(item)
          }
        })
        this.listMonitorTranfer = newArrMonitorTranfer

        this.listCombinator.filter(item => {
          if (item.userId !== this.dataTask.assigner.userId) {
            newArrCombiNatorTranfer.push(item)
          }
        })
        this.listCombinaTorTransfer = newArrCombiNatorTranfer
      }

      // ca 2 khong null
      if (this.dataTask.performer && this.dataTask.assigner) {
        const newArrMonitorTranfer = []
        const newArrCombiNatorTranfer = []
        var arr = []

        if (this.dataTask.performer.objectType === constants.OBJECT_TYPE.USER) {
          if (this.dataTask.combinators && this.dataTask.combinators.length > 0) {
            this.listCombinator.filter(item => {
              if (item.userId !== this.dataTask.performer.userId && item.userId !== this.dataTask.assigner.userId) {
                newArrCombiNatorTranfer.push(item)
              }
            })
            this.listCombinaTorTransfer = newArrCombiNatorTranfer
            this.dataTask.combinators.filter(user => {
              if (user.objectType === constants.OBJECT_TYPE.USER) {
                // list nguoi theo doi
                arr.push(user.userId)
              }
            })
            this.listMonitor.filter(item => {
              if (
                !arr.includes(item.userId)
              ) {
                newArrMonitorTranfer.push(item)
              }
            })

            this.listMonitorTranfer = newArrMonitorTranfer
          } else {
            this.listMonitor.filter(item => {
              if (item.userId !== this.dataTask.performer.userId && item.userId !== this.dataTask.assigner.userId) { newArrMonitorTranfer.push(item) }
              if (this.dataTask.combinators && this.dataTask.combinators.length !== 0) {
                this.dataTask.combinators.filter(user => {
                  if (user.objectType === constants.OBJECT_TYPE.USER) {
                    // list nguoi theo doi
                    arr.push(user.userId)
                  }
                })
                this.listMonitor.filter(item => {
                  if (
                    !arr.includes(item.userId)
                  ) {
                    newArrMonitorTranfer.push(item)
                  }
                })
              }
            })
            this.listMonitorTranfer = newArrMonitorTranfer

            this.listCombinator.filter(item => {
              if (item.userId !== this.dataTask.performer.userId && item.userId !== this.dataTask.assigner.userId) { newArrCombiNatorTranfer.push(item) }
            })
            this.listCombinaTorTransfer = newArrCombiNatorTranfer
          }
        } else {
          this.listCombinator.filter(item => {
            if (item.groupId !== this.dataTask.performer.groupId && item.userId !== this.dataTask.assigner.userId) { newArrCombiNatorTranfer.push(item) }
          })
          this.listCombinaTorTransfer = newArrCombiNatorTranfer
        }
      }

      // truogn hop 1 th va phoi hop  !== null
      if (this.dataTask.performer && this.dataTask.combinators && this.dataTask.combinators.length > 0) {
        const arrNew = []
        this.listCombinator.filter(item => {
          if (this.dataTask.performer.objectType === constants.OBJECT_TYPE.USER) {
            if (item.userId !== this.dataTask.performer.userId) {
              arrNew.push(item)
            }
          } else {
            if (item.groupId !== this.dataTask.performer.groupId) {
              arrNew.push(item)
            }
          }
        })
        this.listCombinaTorTransfer = arrNew
      }
      // pass

      // truogn hop 2 th va theo doi !== null
      if (this.dataTask.performer && this.dataTask.monitors && this.dataTask.monitors.length > 0) {
        const arrNew = []
        this.listMonitor.filter(item => {
          if (item.userId !== this.dataTask.performer.userId) {
            arrNew.push(item)
          }
        })
        this.listMonitorTranfer = arrNew
      }
    },
    checkDateTime() {
      if (this.dataTask.endDate) {
        if (this.dataTask.startDate) {
          const startDate = this.dataTask.startDate ? this.dataTask.startDate : ''
          const endDate = this.dataTask.endDate ? this.dataTask.endDate : ''
          this.startDateStr = startDate.split(' ')[0]
          this.endDateStr = endDate.split(' ')[0]
          this.datesPicker[0] = moment(this.startDateStr, 'DD/MM/YYYY').format('YYYY-MM-DD')
          this.datesPicker[1] = moment(this.endDateStr, 'DD/MM/YYYY').format('YYYY-MM-DD')
          this.startTime = startDate.split(' ')[1]
          this.endTime = endDate.split(' ')[1]
          this.dateRangeText = this.startDateStr + ' - ' + this.endDateStr
        } else {
          const endDate = this.dataTask.endDate
          this.endDateStr = endDate.split(' ')[0]
          this.datesPicker[0] = moment(this.endDateStr, 'DD/MM/YYYY').format('YYYY-MM-DD')
          this.endTime = endDate.split(' ')[1]
          this.startDateStr = ''
          this.startTime = ''
          this.endTime = ''
          this.dateRangeText = this.endDateStr
        }
      } else {
        this.startDateStr = ''
        this.endDateStr = ''
        this.startTime = ''
        this.endTime = ''
        this.dateRangeText = ''
        this.datesPicker = []
      }
    },
    checkActTime() {
      if (this.dataTask.actEndDate) {
        if (this.dataTask.actStartDate) {
          const startDate = this.dataTask.actStartDate ? this.dataTask.actStartDate : ''
          const endDate = this.dataTask.actEndDate ? this.dataTask.actEndDate : ''
          this.startActDateStr = startDate.split(' ')[0]
          this.endActDateStr = endDate.split(' ')[0]
          this.datesActPicker[0] = moment(this.startActDateStr, 'DD/MM/YYYY').format('YYYY-MM-DD')
          this.datesActPicker[1] = moment(this.endActDateStr, 'DD/MM/YYYY').format('YYYY-MM-DD')
          this.actStartTime = startDate.split(' ')[1]
          this.actEndTime = endDate.split(' ')[1]
          this.dateActRangeText = this.startActDateStr + ' - ' + this.endActDateStr
        } else {
          const endDate = this.dataTask.actEndDate ? this.dataTask.actEndDate : ''
          this.endActDateStr = endDate.split(' ')[0]
          this.datesPicker[0] = moment(this.endActDateStr, 'DD/MM/YYYY').format('YYYY-MM-DD')
          this.actEndTime = endDate.split(' ')[1]
          this.startActDateStr = ''
          this.actStartTime = ''
          this.actEndTime = ''
          this.dateActRangeText = this.endActDateStr
        }
      } else {
        this.actEndTime = ''
        this.actStartTime = ''
        this.endActDateStr = ''
        this.startActDateStr = ''
        this.dateActRangeText = ''
        this.datesActPicker = []
      }
    },
    searchDetailTask() {
      this.$emit('detail-task')
    },
    checkTypeUserInfo(type) {
      if (type) {
        return type === constants.OBJECT_TYPE.USER
      }
    },
    disableStatus(item) {
      if (item === constants.STATUS_TASK.INPROGRESS || item === constants.STATUS_TASK.FINISH) {
        return !this.listStatusTask.includes(item)
      }
    },
    fixedProgressTask(num) {
      return Number(num).toFixed(0)
    },
    trimSpace(val) {
      return val ? val.trim() : ''
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
    async approveTask(status) {
      this.loading = true
      const dataTask = {}
      dataTask.taskId = this.dataTask.id
      dataTask.status = status
      dataTask.content = this.content
      try {
        await TaskService.approvalTask(dataTask)
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: this.$t('task-manager.notify.aprrove')
        })
        this.searchTask()
        setTimeout(() => {
          this.getTaskChirldrenDetail(this.dataTask.id)
        }, 200)
      } catch (e) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: e.message
        })
      }
      this.loading = false
    },
    async getListExcutor() {
      try {
        const response = await TaskService.getPersonParticipation(Constants.PATICIPATION.COMBINATOR)
        this.listCombinator = response.data
        this.listCombinaTorTransfer = this.listCombinator
      } catch (error) {
        console.log(error)
      }
    },
    async getWorkType() {
      try {
        const response = await TaskService.getWorkType()
        this.listWorkType = response.data
      } catch (error) {
        console.log(error)
      }
    },
    async getListMonitor() {
      try {
        const response = await TaskService.getPersonParticipation(Constants.PATICIPATION.MONITOR)
        this.listMonitor = response.data
        this.listMonitorTranfer = this.listMonitor
      } catch (error) {
        console.log(error)
      }
    },
    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },
    addChildWork() {
      if (this.isEditChildWork) {
        const currentUser = JSON.parse(localStorage.getItem('USER_INFO'))
        if (!this.dataTask.childrenTask) {
          this.dataTask.childrenTask = []
        }
        initChildWorkData.status = constants.STATUS_TASK.NEW
        initChildWorkData.creatorId = currentUser.userId
        this.dataTask.childrenTask.push({ ...initChildWorkData })
      }
    },
    removeChildWork(index) {
      if (this.isEditChildWork) {
        if (index >= 0) { this.dataTask.childrenTask.splice(index, 1) }
      }
    }, commentFromEmit(val) {
      this.listCommentDemo.push(val)
    },
    changeProcessFromEmit(val) {
      this.dataTask.progress = val
    },
    contentFromEmit(val) {
      this.content = val
    },
    sourceTaskFromEmit(val) {
      this.dataTask.sourceTask = val
    },
    listAssociationFromEmit(val) {
      this.listAssociation = val
    },
    closeDialogUpdateProcess() {
      this.showDialogUpdateProcess = false
    },
    OpenDialogUpdateProcess() {
      if (this.isEditProgress) {
        this.dataProcess.process = this.dataTask.progress
        this.showDialogUpdateProcess = true
      }
    },
    openDialogSelectSoureTask() {
      if (this.isEditSourceTask) {
        this.showDialogSourceTask = true
      }
    },
    openDialogSelectTaskAssociations() {
      if (this.isEditSourceTask) {
        this.showDialogSelectTaskAssociations = true
      }
    },
    linkToFromEmit(val) {
      this.dataTask.taskAssociations = val
    },
    closeDialogSelectTaskAssociations() {
      this.showDialogSelectTaskAssociations = false
    },
    closeDialogSelectSourceTask() {
      this.showDialogSourceTask = false
    },
    openDialogConfirmUpdate() {
      this.showDialogConfirmUpdate = true
    },
    showComment() {
      this.isShowComment = !this.isShowComment
    },
    getTaskChirldrenDetail(id) {
      this.$emit('get-detail', id)
    },
    async updateTask() {
      this.dataTask.status = this.statusBegin
      if (this.datesPicker[0]) {
        const startDate = this.formatDate(this.datesPicker[0])
        if (this.datesPicker[1]) {
          this.startTime ? this.dataTask.startDate = startDate + ' ' + this.startTime : this.dataTask.startDate = startDate + ' 00:00'
          const endDate = this.formatDate(this.datesPicker[1])
          this.endTime ? this.dataTask.endDate = endDate + ' ' + this.endTime : this.dataTask.endDate = endDate + ' 23:59'
        } else {
          const endDate = this.formatDate(this.datesPicker[0])
          this.endTime ? this.dataTask.endDate = endDate + ' ' + this.endTime : this.dataTask.endDate = endDate + ' 23:59'
          this.dataTask.startDate = null
        }
      } else {
        this.dataTask.startDate = null
        this.dataTask.endDate = null
      }
      if (this.datesActPicker[0]) {
        const actStartDate = this.formatDate(this.datesActPicker[0])
        if (this.datesActPicker[1]) {
          this.actStartTime ? this.dataTask.actStartDate = actStartDate + ' ' + this.actStartTime : this.dataTask.actStartDate = actStartDate + ' 00:00'
          const actEndDate = this.formatDate(this.datesActPicker[1])
          this.actEndTime ? this.dataTask.actEndDate = actEndDate + ' ' + this.actEndTime : this.dataTask.actEndDate = actEndDate + ' 23:59'
        } else {
          const actEndDate = this.formatDate(this.datesActPicker[0])
          this.actEndTime ? this.dataTask.actEndDate = actEndDate + ' ' + this.actEndTime : this.dataTask.actEndDate = actEndDate + ' 23:59'
          this.dataTask.actStartDate = null
        }
      } else {
        this.dataTask.actStartDate = null
        this.dataTask.actEndDate = null
      }
      this.dataTask.progress = this.fixedProgressTask(this.dataTask.progress)
      const arr = []
      if (this.dataTask.childrenTask && this.dataTask.childrenTask.length >= 0) {
        this.dataTask.childrenTask.filter(item => {
          if (item.name) {
            arr.push(item)
          }
        })
        this.dataTask.childrenTask = arr
      }
      try {
        this.loading = true
        await this.dataTask.status === constants.STATUS_TASK.NEW ? await TaskService.updateTaskDraff(this.dataTask) : await TaskService.updateTask(this.dataTask)
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.SUCCESS,
          content: this.$t('task-manager.notify.update-success')
        })
        this.datesActPicker = []
        this.datesActPicker = []
        this.searchTask()
        this.closeDialog()
      } catch (err) {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.ERROR,
          content: err.message
        })
      } finally {
        this.loading = false
      }
    },
    async selectAttachs() {
      try {
        this.fileAttachs = [...this.$refs.fileAttachsInput.files];
        // bien chua index de xoa
        const listIndexRemove = [];
        // lap de tim cac ten file trung nhau
        this.dataTask.fileAttachments.map((file, index) => {
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
        // xoa file cu khi bi trung ten file
        if (listIndexRemove.length > 0) {
          listIndexRemove.map((index) => {
            this.removeFileAttach(index);
          });
        }
        // validate file
        const lstFileValidate = this.fileAttachs.filter((file) => file.name);
        const { valid } = await this.$refs.providerFileAttachs.validate(
          lstFileValidate
        );
        if (!valid) {
          if (this.fileAttachs) {
            this.fileAttachs = this.dataTask.fileAttachments;
          } else {
            // neu xoa thi dat gia tri ve null
            this.fileAttachs = [];
            this.nameFileAttachs = [];
          }
          this.$refs.fileAttachsInput.type = 'text'
          this.$refs.fileAttachsInput.type = 'file'
          this.setNotify({
            show: true,
            type: "warning",
            content: this.$refs.providerFileAttachs.errors[0],
            key: false
          });
        } else {
          await this.uploadFileAttachs();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async uploadFileAttachs() {
      if (this.fileAttachs.length === 0) {
        return
      }
      try {
        if (!this.dataTask.fileAttachments) {
          this.dataTask.fileAttachments = []
        }
        this.uploadingFileAttatch = true
        var formData = new FormData()
        this.fileAttachs.map(file => {
          if (file.name) {
            formData.append('files', file)
          }
        })
        const response = await TaskService.upload(formData)

        if (response.success) {
          const { data } = response
          const lstFileName = this.dataTask.fileAttachments.map(
            file => file.fileName || file.name
          )
          const lstFileNameWithId = this.dataTask.fileAttachments.map(file => {
            return { id: file.id, name: file.fileName || file.name }
          })
          data.forEach(file => {
            if (this.isUpdate) {
              const isExited = lstFileNameWithId.some(
                f => !f.id && f.name === file.fileName
              )
              if (!isExited) {
                this.dataTask.fileAttachments.push(file)
              } else {
                const index = this.dataTask.fileAttachments.findIndex(
                  x => x.fileName === file.fileName && !x.id
                )
                this.dataTask.fileAttachments[index] = file
              }
            } else {
              if (!lstFileName.includes(file.fileName)) {
                const currentUser = JSON.parse(localStorage.getItem('USER_INFO'))
                file.createdBy = currentUser.userId
                this.dataTask.fileAttachments.push(file)
              } else {
                const index = this.dataTask.fileAttachments.findIndex(
                  x => x.fileName === file.fileName
                )
                this.dataTask.fileAttachments[index] = file
              }
            }
          })
        }
      } catch (error) {
        this.fileAttachs = this.fileAttachs.filter(file => file.fileName)
        var fileBuffer = new DataTransfer()
        document.getElementById('fileAttachsInput').files = fileBuffer.files
        this.setNotify({
          show: true,
          type: 'error',
          content: error.message
        })
      } finally {
        this.uploadingFileAttatch = false
      }
    },
    removeFileAttach(index) {
      if (this.isUploadFile) {
        var fileBuffer = new DataTransfer()
        document.getElementById('fileAttachsInput').files = fileBuffer.files
        this.fileAttachs.splice(index, 1)
        this.dataTask.fileAttachments.splice(index, 1)
      }
    },
    uploadAttachs() {
      document.getElementById('fileAttachsInput').click()
    },
    async initFileAttachs(data) {
      if (data.fileAttachments) {
        data.fileAttachments.map(file => {
          file.name = file.fileName
          file.size = file.fileSize
        })
        this.setFileAttachs(data.fileAttachments)
        this.nameFileAttachs = data.fileAttachments
      }
    },
    async downloadFileAttach(index) {
      const attach = this.dataTask.fileAttachments[index];
      await TaskService.downloadFile({
        filePath: attach.filePath,
        storage: attach.storage,
        fileName: attach.fileName,
      });
    },
    downloadFile(file, fileName) {
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = file;
      downloadLink.target = "_self";
      downloadLink.download = fileName;
      downloadLink.click();
    },
    async getListAsginer() {
      try {
        const response = await TaskService.getPersonParticipation(Constants.PATICIPATION.ASSIGNER)
        this.listAssigner = response.data
        if (this.dataTask.assigner.userId) {
          const arrIdUser = []
          this.listAssigner.filter(user => {
            arrIdUser.push(user.userId)
          })
          if (!arrIdUser.includes(this.dataTask.assigner.userId)) {
            this.listAssigner.push(this.dataTask.assigner)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    closeDialog() {
      this.isShowComment = false
      this.$emit('close-dialog')
    },
    removeAssigner() {
      this.dataTask.assigner = null
    },
    removePerfomer() {
      this.dataTask.performer = null
    },
    removeMonitor(index) {
      if (index >= 0) {
        this.dataTask.monitors.splice(index, 1)
      }
    },
    removeSourceTask() {
      this.dataTask.sourceTask = null
    },
    removeLinkto(index) {
      if (index >= 0) {
        this.dataTask.taskAssociations.splice(index, 1)
      }
    },
    removeCombinator(index) {
      if (index >= 0) {
        this.dataTask.combinators.splice(index, 1)
      }
    },
    showConfirm(action, item) {
      if (this.listActionConfirm.includes(action)) {
        this.objConfirm.showDialogConfirm = true
        if (action === constants.TASK_MANAGER_ACTIONS.REMOVE) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.delete'
        }
        if (action === constants.TASK_MANAGER_ACTIONS.CANCEL) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.cancel'
          this.objConfirm.isReason = true
          this.objConfirm.isNull = true
          this.objConfirm.status = true
        }
        if (action === constants.TASK_MANAGER_ACTIONS.PAUSE) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.pause'
          this.objConfirm.isReason = true
          this.objConfirm.isNull = true
          this.objConfirm.status = true
        }
        if (action === constants.TASK_MANAGER_ACTIONS.REVIEW) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.review'
          this.objConfirm.isReason = true
        }
        if (action === constants.TASK_MANAGER_ACTIONS.DENY_REVIEW) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.deny-review'
          this.objConfirm.isReason = true
          this.objConfirm.isNull = true
          this.objConfirm.status = true
        }
        if (action === constants.TASK_MANAGER_ACTIONS.TAKE_OVER) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.take-over'
          this.objConfirm.isReason = true
        }
        if (action === constants.TASK_MANAGER_ACTIONS.DENY_TAKE_OVER) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.deny-take-over'
          this.objConfirm.isReason = true
          this.objConfirm.isNull = true
          this.objConfirm.status = true
        }
        if (action === constants.TASK_MANAGER_ACTIONS.APPROVE) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.approve'
          this.objConfirm.isReason = true
        }
        if (action === constants.TASK_MANAGER_ACTIONS.CLOSE) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.close'
        }
        if (action === constants.TASK_MANAGER_ACTIONS.RESENT_REVIEW) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.resent-review'
        }
        if (action === constants.TASK_MANAGER_ACTIONS.RESENT_TAKE_OVER) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.resent-task-over'
        }
        if (action === constants.TASK_MANAGER_ACTIONS.RESENT_APPROVE) {
          this.objConfirm.titleConfirm = 'task-manager.title-confirm.resent-approve'
        }
        this.actionTask = action
      } else {
        this.clickAction(action, item)
      }
    },
    acceptAction() {
      this.loading = true
      try {
        const objTask = {
          ...initObjTask
        }
        objTask.taskId = this.dataTask.id
        this.clickAction(this.actionTask, objTask, this.objConfirm.comment)
        this.objConfirm.comment = ''
        if (this.actionTask === constants.TASK_MANAGER_ACTIONS.REMOVE) {
          this.closeDialog()
          this.searchTask()
        } else {
          setTimeout(() => {
            this.getTaskChirldrenDetail(this.dataTask.id)
          }, 300)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    closeDialogConfirm() {
      this.objConfirm.showDialogConfirm = false
      this.objConfirm.isReason = false
      this.objConfirm.isNull = false
      this.objConfirm.status = false
    },
    searchTask() {
      this.$emit('search-task-create')
    },
    clearRealDateTime() {
      this.actEndTime = ''
      this.actStartTime = ''
      this.startActDateStr = ''
      this.endActDateStr = ''
      this.datesActPicker = []
      this.dateActRangeText = ''
    },
    clearDateTime() {
      this.datesPicker = []
      this.startTime = ''
      this.endTime = ''
      this.startDateStr = ''
      this.endDateStr = ''
      this.dateRangeText = ''
    },
    checkEqualItem(item1, item2) {
      return item1 === item2
    },
    checkCurrentUserId(userId) {
      const currentUser = JSON.parse(localStorage.getItem('USER_INFO'))
      if (userId) {
        return userId === currentUser.userId
      }
    }
  }

}
</script>
<style scoped>

.icon-action {
  position: absolute;
  transform: rotate(90deg);
}

.task-parent-name {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-decoration-line: underline;
}

.text-title-history {
  color: #22242C;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.btn-box-shadow {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15) !important;
}

</style>
