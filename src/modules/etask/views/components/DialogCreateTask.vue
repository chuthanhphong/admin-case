<template>
  <div>
    <v-dialog
      v-model="showDialog"
      max-width="711"
      persistent
      transition="dialog-transition"
    >
      <validation-observer ref="observer" v-slot="{ invalid }">
        <div class="dialog_creat_task_test">
          <v-card>
            <!--        header-dialog-->
            <div class="justify-start  px-3 d-flex flex-row align-center">
              <div :class="formData.name ?'' : 'opacity-3'" class="mt-4">
                <v-select
                  v-model="formData.status"
                  :item-value="item=>item.value"
                  :items="listStatusTask"
                  :menu-props="{ maxWidth:'210px' }"
                  :readonly="isShowAll"
                  append-icon=""
                  dense
                >
                  <template v-slot:selection="data">
                    <div
                      :style="{backgroundColor : data.item.background, color:data.item.bg}"
                      class="selected-status d-flex flex-row align-center ml-3"
                    >
                      <v-avatar :style="{backgroundColor : data.item.bg}" size="15">
                        <v-img :src="data.item.icon" />
                      </v-avatar>
                      <v-list-item-title class="item-status ml-2" v-html="$t(data.item.label)" />
                    </div>
                  </template>
                  <template v-slot:item="data">
                    <template>
                      <div class="select--status d-flex flex-row align-center">
                        <v-avatar :style="{backgroundColor : data.item.bg , backgroundSize : 'contain'}" size="15">
                          <v-img :src="data.item.icon" />
                        </v-avatar>
                        <v-list-item-title class="ml-2" v-html="$t(data.item.label)" />
                      </div>

                    </template>
                  </template>
                </v-select>
              </div>
              <div class="d-flex flex-row pl-6 mt-2 justify-end align-center">
                <v-select
                  v-show="isShowflash"
                  v-model="formData.priority"
                  :item-value="item=>item.value"
                  :items="listPriority"
                  :menu-props="{ minWidth:'150px' }"
                  :placeholder="$t('task-manager.label.priority')"
                  :readonly="isShowAll"
                  append-icon=""
                  class="ml-5"
                >
                  <template v-slot:selection="data">
                    <div
                      :style="{backgroundColor : data.item.bg , width : '150px' }"
                      class="selected-priority d-flex "
                    >
                      <v-icon
                        :color="data.item.colorIcon"
                      >
                        mdi-flash
                      </v-icon>
                      <v-list-item-title
                        class="item-status ml-2"
                        v-html="$t(data.item.label)"
                      />
                    </div>

                  </template>

                  <template v-slot:item="data">
                    <div class="select--status d-flex flex-row align-center justify-center">
                      <v-icon
                        :color="data.item.colorIcon"
                      >
                        mdi-flash
                      </v-icon>
                      <v-list-item-title class="ml-3" v-html="$t(data.item.label)" />
                    </div>
                  </template>
                </v-select>
                <v-icon class="close-dialog mt-4 pr-7" @click="miniMizeDiaLog">mdi-minus</v-icon>
                <v-icon class="close-dialog mt-4" @click="closeDialog">mdi-close</v-icon>
              </div>
            </div>
            <hr>
            <!--          ten-task-->
            <div class="pt-3">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('task-manager.error.name')"
                rules="required"
              >
                <v-text-field
                  id="taskName"
                  v-model="formData.name"
                  :error-messages="errors"
                  :placeholder="$t('task-manager.placeHolder.task-name')"
                  autofocus
                  class="text--area-task ml-7 pa-0 justify-center text-h6"
                  maxlength="200"
                  @blur="checkEmptyTaskName"
                  @change="formData.name = trimSpace(formData.name)"
                />
              </validation-provider>
            </div>

            <div :class="formData.name ?'' : 'opacity-3'" class="dialog-body">
              <!--          //thuc hien-->
              <div class="d-flex flex-column">
                <span class="label-field-create-task justify-start ml-6">
                  {{ $t('task-manager.label.assign-to') }}
                  <span v-if="formData.status" class="color-require">*</span>
                </span>
                <v-autocomplete
                  v-model.trim="formData.performer"
                  :error-messages="$t(validatePerformer)"
                  :filter="filterItems"
                  :item-text="item=> item.userFullName ? item.userFullName : item.groupName"
                  :item-value="item=> item.userId ? item.userId : item.groupId"
                  :items="listCombinator"
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :no-data-text="$t('noData')"
                  :placeholder="$t('task-manager.placeHolder.assign-to')"
                  :readonly="isShowAll"
                  attach
                  class="text--body-5 px-6"
                  dense
                  elevation="0"
                  maxlength="255"
                  outlined
                  return-object
                >
                  <template v-slot:append>
                    <v-img
                      :src="require('@/assets/icons/task/createTask/iconMoreChoice/person.png')"
                      class="hover--pointer"
                    />
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                      :input-value="data.selected"
                      close
                      @click:close="removePerfomer"
                    >
                      <div>
                        <v-avatar
                          v-if="data.item.objectType === 'GROUP'"
                        >
                          <v-img
                            src="@/assets/icons/task/PersonAvatar.svg"
                          />
                        </v-avatar>
                        <v-avatar
                          v-else
                          :color="lstColors[2]"
                          size="40"
                        >
                          <span
                            class="text-uppercase white--text"
                          >{{
                            renderAvatarText(data.item.userFullName)
                          }}</span>
                        </v-avatar>
                        <span class="ml-1"> {{ checkEqualItem(data.item.objectType,'USER') ? data.item.username : data.item.groupName }} </span>
                      </div>
                    </v-chip>
                  </template>
                  <template v-slot:item="data">
                    <div class="select-item flex-column d-flex">
                      <div class="title-item">
                        {{ checkEqualItem(data.item.objectType , 'GROUP') ? data.item.groupName : data.item.userFullName }}
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
              <!--          nguoi giao-->
              <div class="d-flex flex-column">
                <span class="label-field-create-task d-flex flex-row justify-start ml-6">{{
                                                                                           $t('task-manager.label.assign-from')
                                                                                         }}
                  <span v-if="formData.status" class="color-require">*</span>
                </span>
                <v-autocomplete
                  v-model.trim="formData.assigner"
                  :error-messages="$t(validateAssigner)"
                  :filter="filterItems"
                  :item-text="item=> item.userFullName"
                  :item-value="item => item"
                  :items="listAssigner"
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :no-data-text="$t('noData')"
                  :placeholder="$t('task-manager.placeHolder.assign-from')"
                  :readonly="isShowAll"
                  class="text--body-5 px-6"
                  dense
                  elevation="0"
                  maxlength="255"
                  outlined
                >
                  <template v-slot:append>
                    <v-img
                      :src="require('@/assets/icons/task/createTask/addPerson.png')"
                      class="hover--pointer"
                    />
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                      close
                      @click:close="removeAssigner"
                    >
                      <div>
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
                        {{ data.item.userFullName }}
                      </div>
                      <div class="desc-item">
                        {{ data.item.positionName }} - {{ data.item.groupPathName }}
                      </div>
                    </div>
                  </template>
                </v-autocomplete>
              </div>
              <!--          nguoi phop hop-->
              <div v-if=" isShowPerfomer " id="performerList" class="d-flex flex-column">
                <span class="label-field-create-task d-flex justify-start ml-6">{{
                  $t('task-manager.label.coordinator')
                }}</span>
                <v-autocomplete
                  v-model.trim="formData.combinators"
                  :autofocus="isShowPerfomer"
                  :filter="filterItems"
                  :item-text="item=> item.userFullName ? item.userFullName : item.groupName"
                  :item-value="item=> item"
                  :items="listCombinaTorTransfer"
                  :no-data-text="$t('noData')"
                  :placeholder="$t('task-manager.placeHolder.coordinator')"
                  :readonly="isShowAll"
                  :search-input.sync="search"
                  class="text--body-5 px-6"
                  dense
                  multiple
                  outlined
                  @change="search=''"
                >
                  <template v-slot:append>
                    <v-img
                      :src="require('@/assets/icons/task/createTask/group_add.png')"
                      class="hover--pointer"
                    />
                  </template>
                  <template v-slot:selection="{ item,index }">
                    <div>
                      <v-chip
                        :input-value="item.selected"
                        close
                        v-bind="item.attrs"
                        @click:close="removeCombinator(index)"
                      >
                        <div v-if="checkEqualItem(item.objectType,'GROUP')" class="d-flex   align-center">
                          <img src="@/assets/icons/task/PersonAvatar.svg">
                          <span class="ml-1"> {{ item.groupName }}</span>
                        </div>
                        <div v-else>
                          <v-avatar
                            :color="lstColors[1]"
                            size="40"
                          >
                            <span
                              class="text-uppercase white--text"
                            >{{
                              renderAvatarText(item.userFullName)
                            }}</span>
                          </v-avatar>
                          <span class="ml-1"> {{ item.username }} </span>
                        </div>
                      </v-chip>
                    </div>

                  </template>
                  <template v-slot:item="data">
                    <div class="select-item flex-column d-flex">
                      <div class="title-item">
                        {{ checkEqualItem(data.item.objectType,'USER') ? data.item.userFullName : data.item.groupName }}
                      </div>
                      <div v-if="checkEqualItem(data.item.objectType,'USER')" class="desc-item">
                        {{ data.item.positionName }} - {{ data.item.groupPathName }}
                      </div>
                      <div v-else class="desc-item">
                        {{ data.item.groupPathName }}
                      </div>
                    </div>
                  </template>
                </v-autocomplete>
              </div>
              <!--          nguoi theo doi-->
              <div v-if="isShowFollower" id="followerTask" class="d-flex flex-column">
                <span class="label-field-create-task d-flex justify-start ml-6">{{
                  $t('task-manager.label.follower')
                }}</span>
                <v-autocomplete
                  id="monitor-label"
                  v-model.trim="formData.monitors"
                  :autofocus="isShowFollower"
                  :filter="filterItems"
                  :item-text="item=> item.userFullName"
                  :item-value="item=> item"
                  :items="listMonitorTranfer"
                  :no-data-text="$t('noData')"
                  :placeholder="$t('task-manager.placeHolder.follower')"
                  :readonly="isShowAll"
                  :search-input.sync="searchFollow"
                  class="text--body-5 px-6"
                  dense
                  multiple
                  outlined
                  @change="searchFollow=''"
                >
                  <template v-slot:append>
                    <v-img
                      :src="require('@/assets/icons/task/createTask/eye.png')"
                      class="hover--pointer"
                    />
                  </template>
                  <template v-slot:selection="{ item,index }">
                    <div>
                      <v-chip
                        :input-value="item.selected"
                        close
                        v-bind="item.attrs"

                        @click:close="remove(index)"
                      >
                        <div>
                          <v-avatar
                            :color="lstColors[1]"
                            size="40"
                          >
                            <span
                              class="text-uppercase white--text"
                            >{{
                              renderAvatarText(item.userFullName)
                            }}</span>
                          </v-avatar>
                          <span class="ml-1"> {{ item.username }} </span>
                        </div>
                      </v-chip>
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

              <!--          thoi han-->
              <div v-if="isShowDeadline" id="deadlineToTask" class="d-flex flex-column">
                <span class="label-field-create-task d-flex justify-start ml-6">{{
                  $t('task-manager.label.deadline')
                }}</span>
                <v-menu
                  v-model="menuOpenDialogselectDateTime"
                  :close-on-click="!errorDate && !errorStartTime && !errorEndTime"
                  :close-on-content-click="false"
                  max-height="512px"
                  min-width="336px"
                  nudge-right="250px"
                  nudge-top="30px"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      ref="deadline"
                      :autofocus="isShowDeadline"
                      :error-messages="$t(validateDate)"
                      :placeholder="$t('task-manager.placeHolder.deadline')"
                      :value="deadlineFromPicker.length !== 0 ? $t(strDeadline) : ''"
                      class="text--body-5 px-6"
                      clearable
                      dense
                      outlined
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="clearDateTime"
                    >
                      <template v-slot:append>
                        <v-img
                          :src="require('@/assets/icons/task/createTask/calendar.png')"
                          class="hover--pointer"
                          @click="menuOpenDialogselectDateTime = !menuOpenDialogselectDateTime"
                        />
                      </template>
                    </v-text-field>
                  </template>
                  <v-container class="select-date-task align-start">
                    <div class="d-flex flex-row justify-start align-center">
                      <!--                    //ngay bat dau-->
                      <div class="d-flex flex-row justify-start align-center">
                        <div class="d-flex align-start form-group flex-column">
                          <label class="title-picker-task">
                            {{ $t('task-manager.label.start-date') }}
                            <span v-if="formData.status === 'FINISH'" class="color-require">*</span>
                          </label>

                          <v-text-field
                            :value="formatDateStart"
                            class="text--body-5 clear-display mr-1"
                            dense
                            height="28px"
                            readonly
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
                      <!--                         ngay ket thuc-->
                      <div class="d-flex flex-row justify-start align-center ml-2">
                        <div class="d-flex align-start form-group flex-column">
                          <label class="title-picker-task">
                            {{ $t('task-manager.label.end-date') }}
                            <span v-if="checkEqualItem(formData.status ,'FINISH')" class="color-require">*</span>
                          </label>

                          <v-text-field
                            :value="formatDateEnd"
                            class="text--body-5 clear-display mr-1"
                            dense
                            height="28px"
                            readonly
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
                    <div class="d-flex mt-2">
                      <!--                        gio bat dau-->
                      <div class="d-flex flex-row clear-display justify-start align-center">
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
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="startTime"
                                :disabled="!deadlineFromPicker[1]"
                                :error-messages="$t(errorStartDate)"
                                :readonly="!deadlineFromPicker[1]"
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
                                    @click="deadlineFromPicker[1] ? menuStarttimePicker = !menuStarttimePicker :''"
                                  >
                                </template>
                              </v-text-field>
                            </template>
                            <v-time-picker
                              v-if="menuStarttimePicker"
                              v-model="startTime"
                              full-width
                              @click:minute="$refs.menu.save(startTime)"
                            ></v-time-picker>
                          </v-menu>
                        </div>
                      </div>

                      <!--                        gio ket thuc-->
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
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="endTime"
                              :disabled="!deadlineFromPicker[0]"
                              :error-messages="$t(errorEndDate)"
                              :readonly="!deadlineFromPicker[0]"
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
                                  @click=" deadlineFromPicker[0] ? menuEndTimePicker = !menuEndTimePicker : ''"
                                >
                              </template>
                            </v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menuEndTimePicker"
                            v-model="endTime"

                            full-width
                            @click:minute="$refs.menu2.save(endTime)"
                          ></v-time-picker>
                        </v-menu>
                      </div>
                    </div>
                    <div class="mt-1 justify-start">
                      <div class="v-messages__message error--text ml-4">{{ $t(errorDate) }}</div>
                      <div class="v-messages__message error--text ml-4">{{ $t(errorStartTime) }}</div>
                      <div class="v-messages__message error--text ml-4">{{ $t(errorEndTime) }}</div>
                    </div>
                    <div class="d-flex flex-row justify-center align-center mt-2">
                      <v-date-picker
                        v-model="deadlineFromPicker"
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
                      />
                      <span class="text--body-1 ml-12">{{ $t('task-manager.label.repeat-task') }}</span>
                    </div>
                  </v-container>
                </v-menu>
              </div>

              <!--          loai cong viec-->
              <div v-if="isShowTag" id="typeTask" class="d-flex flex-column">
                <span class="label-field-create-task d-flex justify-start ml-6">{{
                  $t('task-manager.label.type-work')
                }}</span>
                <v-autocomplete
                  id="typeWork-label"
                  v-model="formData.taskCategoryId"
                  :autofocus="isShowTag"
                  :filter="filterItems"
                  :item-text="item=> item.name"
                  :item-value="item=> item.taskCategoryId"
                  :items="listWorkType"
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
                  :no-data-text="$t('noData')"
                  :placeholder="$t('task-manager.placeHolder.type-work')"
                  :readonly="isShowAll"
                  class="text--body-5 px-6"
                  dense
                  elevation="0"
                  maxlength="255"
                  outlined
                >
                  <template v-slot:selection="data">
                    <v-chip
                      :input-value="data.selected"
                      close
                      v-bind="data.attrs"
                      @click:close="removeWorkType"
                    >
                      <span>
                        {{ data.item.name }}
                      </span>
                    </v-chip>
                  </template>
                </v-autocomplete>
              </div>

              <!--          nguon goc-->
              <div v-if=" isShowSourceTask" id="sourceTask" class="d-flex flex-column">
                <span class="label-field-create-task d-flex justify-start ml-6">{{
                  $t('task-manager.label.parent-work')
                }}</span>
                <div>
                  <v-autocomplete
                    v-model="formData.sourceTask"
                    :autofocus="isShowSourceTask"
                    :item-text="item=>item.name"
                    :item-value="item=>item.id"
                    :items="listSourceTask"
                    :placeholder="$t('task-manager.placeHolder.source-task')"
                    class="text--body-5 px-6 cursor-pointer"
                    dense
                    height="40px"
                    hide-no-data
                    outlined
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
                            close
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
                </div>
                <dialog-select-source-task
                  :show-dialog="showDialogSelectSoucreTask"
                  :source-task="formData.sourceTask"
                  :title="'task-manager.title.source-task'"
                  @source-task="sourceTaskFromEmit"
                  @close-dia-log="closeDialogSelectSourceTask"
                  @list-association="listAssociationFromEmit"
                />
              </div>

              <!--          lien-ket-->
              <div v-if=" isShowlink" id="linkTo" class="d-flex flex-column">
                <span class="label-field-create-task d-flex justify-start ml-6">{{
                  $t('task-manager.label.link-to')
                }}</span>
                <v-autocomplete
                  v-model="formData.taskAssociations"
                  :autofocus="isShowlink"
                  :hide-selected="true"
                  :item-text="item=>item.name"
                  :item-value="item=>item.id"
                  :items="formData.taskAssociations"
                  :placeholder="$t('task-manager.placeHolder.link-to')"
                  class="text--body-5 px-6 cursor-pointer custom-autocomplete"
                  dense
                  height="auto"
                  hide-no-data
                  multiple
                  outlined
                  readonly
                  return-object
                  @click="OpenDialogSelectTaskAssociations"
                >
                  <template v-slot:selection="{item,index}">
                    <v-tooltip
                      content-class="tooltip-top"
                      top
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-chip
                          :input-value="item.selected"
                          close
                          v-bind="attrs"
                          v-on="on"
                          @click:close="removeLinkTo(index)"
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
                  :show-dialog="showDialogSelectTaskAssociations"
                  :task-associations="formData.taskAssociations"
                  :title="'task-manager.title.link-to'"
                  @list-link-to="taskAssociationsFromEmit"
                  @close-dia-log="closeDialogSelectTaskAssociations"
                />
              </div>

              <!--          mo ta -->
              <div class="d-flex flex-column">
                <span
                  class="label-field-create-task d-flex justify-start ml-6 cursor-pointer"
                  @click="btnShowDescription"
                >{{ $t('task-manager.label.description') }}</span>
                <v-textarea
                  id="description-label"
                  v-model="formData.content"
                  :readonly="isShowAll"
                  class="text--body-5 px-6 clear-display"
                  counter="500"
                  maxlength="500"
                  name="note"
                  outlined
                  rows="3"
                  style="border-radius: 12px"
                  @change="formData.content = trimSpace(formData.content)"
                />
              </div>

              <!--       cong viec con-->
              <div class="mt-1 d-flex flex-column py-2">
                <span class="label-field-create-task d-flex justify-start ml-6">{{
                  $t('task-manager.label.chirldren-work')
                }}</span>
                <div
                  v-for="(child,index) in formData.childrenTask"
                  :key="index"
                >
                  <ChildrenWorkTask
                    :deadline-parent-work="deadlineFromPicker"
                    :end-time-parent="endTime"
                    :form-data="child"
                    :format-date="formatDate"
                    :item="child"
                    :list-user="listCombinator"
                    :start-time-parent="startTime"
                    :status-task="formData.status"
                    @remove-child-task="removeChildWork(index)"
                  />
                </div>
                <div class="d-flex align-center ml-7 cursor-pointer">
                  <div class="d-flex align-center">
                    <v-btn
                      elevation="0"
                      fab
                      x-small
                      @click="addChildWork()"
                    >
                      <v-icon color="#22242C" size="20">mdi-plus-circle-outline</v-icon>
                    </v-btn>
                    <b
                      class="text pl-1 btn"
                      style="color: #A7A7AB"
                      @click="formData.name ? addChildWork() : ''"
                    >{{ $t('task-manager.label.child-work') }}</b>
                  </div>
                </div>
              </div>

              <!--          file up load-->
              <div v-if=" isShowFileInput" id="fileUploadTask" class="mt-7 flex-column">
                <v-col class="ml-6 mt-2 d-flex" md="5"><img
                                                         :src="require('@/assets/icons/task/createTask/iconMoreChoice/file.png')"
                                                         alt=""
                                                       >
                  <span class="label-file-attact ml-2">{{ $t('task-manager.label.file') }}</span></v-col>
                <div class="d-flex justify-space-between align-start pl-8">
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
                        <img
                          :src="getIconFile(`${file.fileName}`)"
                          class="mr-2"
                        >
                        <span>{{ customFileName(file) }}</span>
                        <span
                          class="remove-attach"
                          @click="removeFileAttach(index)"
                        ><v-icon>mdi-close</v-icon>
                        </span>
                      </li>
                    </ul>
                    <div class="d-flex justify-space-between align-center mr-2 mt-4">
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
                    :autofocus="isShowFileInput"
                    :disabled="uploadingFileAttatch"
                    :loading="uploadingFileAttatch"
                    class="btn-upload ml-auto mr-12"
                    outlined
                    @click="uploadAttachs"
                  >
                    <v-icon size="30">mdi-upload</v-icon>
                  </v-btn>
                </div>
              </div>

              <!--          more-option-->

            </div>
            <div :class="formData.name ?'' : 'opacity-3 mt-2'" class="mt-2">
              <div class=" d-flex label-more-choice  justify-center">
                <v-col class="d-flex justify-center align-center" md="1">
                  <v-tooltip
                    content-class="tooltip-top"
                    top
                  >
                    <template v-slot:activator="{ on }">
                      <div class="d-flex flex-column hover--pointer" @click.stop="!isShowAll ? btnClickChangePerformer() : ''">
                        <div class="bg-icon-more justify-start ml-8" v-on="on">
                          <a href="#performerList">
                            <v-img
                              :src=" isShowPerfomer ? require('@/assets/icons/task/createTask/active/activePhoihop.png') : require('@/assets/icons/task/createTask/active/iconPhoihopInactive.png') "
                              alt=""
                              class="icon-more"
                            />
                          </a>
                        </div>
                        <div class="justify-center flex-column d-flex">
                          <span :class="isShowPerfomer ? 'text-active' : 'text-more-choice'">{{
                            $t('task-manager.more-choice.performer')
                          }}</span>
                        </div>
                      </div>
                    </template>
                    <div>
                      {{ $t('task-manager.tool-tip.coordinator') }}
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col class="d-flex justify-center align-center ml-6" md="1">
                  <v-tooltip content-class="tooltip-top" top>
                    <template v-slot:activator="{ on }">
                      <div class="d-flex flex-column hover--pointer" @click=" !isShowAll ? btnClickChangeFollower():''">
                        <a href="#followerTask">
                          <div class="bg-icon-more justify-start ml-8 " v-on="on">
                            <a href=""></a>
                            <v-img
                              :src=" isShowFollower ? require('@/assets/icons/task/createTask/active/eyeactive.png') : require('@/assets/icons/task/createTask/active/eyes.png') "
                              alt=""
                              class="icon-more"
                            />

                          </div>
                        </a>
                        <div class="justify-center flex-column d-flex">
                          <span :class="isShowFollower ? 'text-active' : 'text-more-choice'">{{
                            $t('task-manager.more-choice.follow')
                          }}</span>
                        </div>
                      </div>
                    </template>
                    <div>
                      {{ $t('task-manager.tool-tip.follower') }}
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col class="d-flex justify-center align-center ml-6" md="1">
                  <v-tooltip content-class="tooltip-top" top>
                    <template v-slot:activator="{ on }">
                      <div class="d-flex flex-column hover--pointer" @click="!isShowAll ? btnCLickChangeDeadline() :''">
                        <div class="bg-icon-more justify-start ml-8" v-on="on">
                          <a href="#deadlineToTask">
                            <v-img
                              :src=" isShowDeadline ? require('@/assets/icons/task/createTask/active/calendaractive.png') : require('@/assets/icons/task/createTask/active/calendar.png') "
                              alt=""
                              class="icon-more"
                            />
                          </a>
                        </div>
                        <div class="justify-center flex-column d-flex">
                          <span :class="isShowDeadline ? 'text-active' : 'text-more-choice'">{{
                            $t('task-manager.more-choice.deadline')
                          }}</span>
                        </div>
                      </div>
                    </template>
                    <div>
                      {{ $t('task-manager.tool-tip.deadline') }}
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col class=" d-flex justify-center align-center ml-6" md="1">
                  <v-tooltip content-class="tooltip-top" top>
                    <template v-slot:activator="{ on }">
                      <div class="d-flex flex-column hover--pointer" @click="!isShowAll ? btnShowChangeTag() :''">
                        <a href="#typeTask">
                          <div class="bg-icon-more justify-start ml-8" v-on="on">
                            <v-img
                              :src=" isShowTag ? require('@/assets/icons/task/createTask/active/tagactive.png') : require('@/assets/icons/task/createTask/active/tag.png') "
                              alt=""
                              class="icon-more"
                            />
                          </div>
                        </a>
                        <div class="justify-center flex-column d-flex">
                          <span :class="isShowTag ? 'text-active' : 'text-more-choice'">{{
                            $t('task-manager.more-choice.classify')
                          }}</span>
                        </div>
                      </div>
                    </template>
                    <div>
                      {{ $t('task-manager.tool-tip.type-work') }}
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col class=" d-flex justify-center align-center ml-6" md="1">
                  <v-menu
                    :readonly="isShowAll"
                    offset-y
                    top
                  >
                    <template v-slot:activator="{ on: menu, attrs }">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <div class="d-flex flex-column hover--pointer" @click="formData.name ? btnShowFlash() :''" v-on="{...menu, ...tooltip}">
                            <div class="bg-icon-more justify-start ml-8">
                              <v-img
                                :src=" isShowflash ? require('@/assets/icons/task/createTask/active/flash_on.png') : require('@/assets/icons/task/createTask/active/flash.png') "
                                alt=""
                                class="icon-more"
                                v-bind="attrs"
                              />

                            </div>
                            <div class="justify-center flex-column d-flex">
                              <span :class="isShowflash ? 'text-active' : 'text-more-choice'">{{
                                $t('task-manager.more-choice.priority')
                              }}</span>
                            </div>
                          </div>
                        </template>
                        <div>
                          {{ $t('task-manager.tool-tip.priority') }}
                        </div>
                      </v-tooltip>
                    </template>
                    <v-list-item-group
                      v-if="!isShowAll"
                      v-model="formData.priority"
                      color="primary"
                    >
                      <v-list-item
                        v-for="(item, i) in listPriority"
                        :key="i"
                        :value="item.value"
                      >
                        <v-list-item-icon>
                          <v-icon
                            :color="item.colorIcon"
                          >
                            mdi-flash
                          </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title v-text="$t(item.label)" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-menu>
                </v-col>
                <v-col class=" d-flex justify-center align-center ml-6" md="1">
                  <v-tooltip content-class="tooltip-top" top>
                    <template v-slot:activator="{ on }">
                      <div class="d-flex flex-column hover--pointer" @click="!isShowAll ? btnShowlink() :''">
                        <a href="#linkTo">
                          <div class="bg-icon-more justify-start ml-8" v-on="on">
                            <v-img
                              :src=" isShowlink ? require('@/assets/icons/task/createTask/active/linkactive.png') : require('@/assets/icons/task/createTask/active/linkdisactive.png') "
                              alt=""
                              class="icon-more"
                            />

                          </div>
                        </a>
                        <div class="justify-center flex-column d-flex">
                          <span :class="isShowlink ? 'text-active' : 'text-more-choice'">{{
                            $t('task-manager.more-choice.link')
                          }}</span>
                        </div>
                      </div>
                    </template>
                    <div>
                      {{ $t('task-manager.tool-tip.link') }}
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col class=" d-flex justify-center align-center ml-6" md="1">
                  <v-tooltip content-class="tooltip-top" top>
                    <template v-slot:activator="{ on }">
                      <div class="d-flex flex-column hover--pointer">
                        <a href="#sourceTask">
                          <div class="bg-icon-more justify-start ml-8" @click="!isShowAll ? btnShowsource() :''" v-on="on">
                            <v-img
                              :src=" isShowSourceTask ? require('@/assets/icons/task/createTask/active/sourceactive.png') : require('@/assets/icons/task/createTask/active/souceinactive.png') "
                              alt=""
                              class="icon-more"
                            />

                          </div>
                        </a>
                        <div class="justify-center flex-column d-flex">
                          <span :class="isShowSourceTask ? 'text-active' : 'text-more-choice'">{{
                            $t('task-manager.more-choice.source')
                          }}</span>
                        </div>
                      </div>
                    </template>
                    <div>
                      {{ $t('task-manager.tool-tip.parent') }}
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col class=" d-flex justify-center align-center ml-6" md="1">
                  <v-tooltip content-class="tooltip-top" top>
                    <template v-slot:activator="{ on }">
                      <div class="d-flex flex-column hover--pointer" @click="!isShowAll ? btnShowFile() :'' ">
                        <a href="#fileUploadTask">
                          <div class="bg-icon-more justify-start ml-8 " v-on="on">
                            <v-img
                              :src=" isShowFileInput ? require('@/assets/icons/task/createTask/active/fileactive.png') : require('@/assets/icons/task/createTask/active/file.png') "
                              alt=""
                              class="icon-more"
                            />

                          </div>
                        </a>
                        <div class="justify-center flex-column d-flex">
                          <span :class="isShowFileInput ? 'text-active' : 'text-more-choice'">{{
                            $t('task-manager.more-choice.attach')
                          }}</span>
                        </div>
                      </div>

                    </template>
                    <div>
                      {{ $t('task-manager.tool-tip.file') }}
                    </div>
                  </v-tooltip>
                </v-col>
              </div>
              <v-card-actions :class="formData.name ?'' : 'opacity-3 mt-2'" class="justify-end mt-2">
                <v-btn
                  :disabled="isShowAll"
                  class="w-140 py-5 mr-0 mr-md-3 bg-white"
                  color="primary"
                  outlined
                  rounded
                  @click="cancelDialog"
                >
                  {{ $t('task-manager.button.cancel') }}
                </v-btn>

                <v-btn
                  :disabled="invalid || validateAssigner !== '' || validatePerformer !=='' || validateDate !== ''"
                  class="w-140 py-5"
                  color="primary"
                  rounded
                  @click="showDialogConfirmCreate"
                >
                  {{ $t('task-manager.button.create-task') }}
                </v-btn>
              </v-card-actions>
            </div></v-card>
        </div>
        <dia-log-confirm
          :loading="loading"
          :obj-confirm="objConfirmTask"
          @close-dialog="objConfirmTask.showDialogConfirm = false"
          @accept-action="accept"
        />

      </validation-observer>
    </v-dialog>
  </div>
</template>

<script>
import fileMixin from '@/modules/econtract/mixins/fileMixin';
import constants from '@/modules/etask/constants';
import Constants from '@/modules/etask/constants';
import DialogSelectLinkTo from "@/components/dialog/DialogSelectLinkTo";
import DialogSelectSourceTask from "@/components/dialog/DialogSelectSourceTask";
import ChildrenWorkTask from './ChildrenWorkTask';
import DiaLogConfirm from "@/modules/etask/views/components/DiaLogConfirm";
import rules from '@/mixins/rules';
import { TaskService } from '@/modules/etask/services/taskService';
import moment from 'moment';
import { mapActions } from 'vuex';
import I18n from "@/i18n";
import filterItems from '@/mixins/filterItems.js'
import actionsTask from "@/modules/etask/mixins/actionsTask";

const initChildWorkData = {
  name: '',
  endDate: null,
  startDate: null,
  performer: null
}

const initformData = {
  taskCategoryId: null,
  name: '',
  content: null,
  priority: constants.PRIORITY.MEDIUM,
  status: null,
  description: '',
  startDate: null,
  endDate: null,
  actualDuration: '',
  performer: null,
  assigner: null,
  taskAssociations: [],
  sourceTask: null,
  monitors: [],
  combinators: [],
  childrenTask: [],
  fileAttachments: []
}

export default {
  name: 'DiaLogCreateTask',
  components: {
    DialogSelectLinkTo,
    ChildrenWorkTask,
    DiaLogConfirm,
    DialogSelectSourceTask
  },
  mixins: [fileMixin, rules, filterItems, actionsTask],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // start kiennt add
    ticketInfoForCreateTask: {
      type: Object,
      default: undefined
    },
    // end kiennt add
    formDataSearch: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      lstColors: ['#FFAF2E', '#0FAFE4', '#4A50E2', '#F028A0', '#FF4A55'],
      // validatePerformer: '',
      // validateAssigner: '',

      showDialogSelectSoucreTask: false,
      showDialogConfirm: false,
      showDialogSelectPerformer: false,
      showDialogSelectTaskAssociations: false,
      uploadingFileAttatch: false,
      listStatusTask: [
        {
          value: null,
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
      ],
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
          class: 'priority-task priority-draft',
          colorIcon: '#7A7C80',
          bg: '#D3D3D5'
        }
      ],
      listAssigner: [],
      listCombinator: [],
      listCombinaTorTransfer: [],
      listMonitor: [],
      listMonitorTranfer: [],
      fileAttachs: [],
      listWorkType: [],
      listSourceTask: [],
      listAssociation: [],
      formData: { ...initformData },
      nameFileAttachs: [], // file dinh kem
      deadlineFromPicker: [], // array hạn hoàn thành ngày bắt đầu + kết thúc
      isShowALl: false,
      priority: {}, // do uu tien,
      menuOpenDialogselectDateTime: false, // menu o dialog select ngay bat dau ket thuc,
      menuStartDatePicker: false, // menu o time picker ngay bat dau
      menuEndDatePicker: false, // menu o time picker ngay ket thuc
      menuStarttimePicker: false, // menu o time picker gio bat dau
      menuEndTimePicker: false, // menu o time picker gio ket thuc
      menuDateChirldenWork: false, // menu o time picker cong viec con
      startTime: null, // gio bat dau
      endTime: null, // gio ket thuc,
      errorStartDate: null, // loi ngay bat dau
      errorEndDate: null, // loi ngay ket thuc
      errorStartTime: null, // loi gio bat dau
      errorDate: null, // loi gio ket thuc
      errorEndTime: '',
      autoUpdate: true,
      isUpdating: false,
      isShowAll: true,
      isShowDescripton: false,
      isShowPerfomer: false,
      isShowFollower: false,
      isShowDeadline: false,
      isShowTag: false,
      isShowflash: false,
      isShowFileInput: false,
      isShowSourceTask: false,
      isShowlink: false,
      loading: false,
      strDeadline: '',
      search: '',
      searchFollow: '',
      formatDateStart: '',
      formatDateEnd: '',
      objConfirmTask: {
        titleConfirm: '',
        showDialogConfirm: false,
        isReason: false,
        isNull: false,
        comment: '',
      },
      typeActionActive: ''
    }
  },
  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    },
    fileStyle() {
      return {
        opacity: this.fileContract != null ? 1 : 0
      }
    },
    validatePerformer() {
      let str = ''
      this.formData.status && !this.formData.performer ? str = 'task-manager.error.perfomer' : str = ''
      return str
    },
    validateAssigner() {
      let str = ''
      this.formData.status && !this.formData.assigner ? str = 'task-manager.error.assigner' : str = ''
      return str
    },
    validateDate() {
      let str = ''
      this.formData.status === constants.STATUS_TASK.FINISH && this.deadlineFromPicker.length === 0 ? str = 'task-manager.error.start-date-required' : str = ''
      return str
    },
    // start kiennt add
    disabledSourceTask() {
      return !this.formData.name || (this.ticketInfoForCreateTask && this.ticketInfoForCreateTask.id > 0)
    }
    // end kiennt add
  },
  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    },
    async showDialog() {
      if (this.showDialog) {
        this.getListAsginer()
        this.getListMonitor()
        this.getListCombinator()
        this.getWorkType()
        const currentUser = JSON.parse(localStorage.getItem('USER_INFO'))
        setTimeout(() => {
          if (currentUser.roles.includes(constants.ROLE.NV)) {
            this.listCombinator.filter(user => {
              if (user.userId === currentUser.userId) {
                currentUser.userRoleDetails.filter(role => {
                  if (role.roleType === constants.ROLE_TYPE.MAIN) {
                    this.formData.performer = user
                  }
                })
              }
            })
            this.listAssigner.filter(user => {
              if (user.userId === currentUser.userId) {
                currentUser.userRoleDetails.filter(role => {
                  if (role.roleType === constants.ROLE_TYPE.MAIN) {
                    this.formData.assigner = user
                  }
                })
              }
            })
          }
          if (currentUser.roles.includes(constants.ROLE.LD) || currentUser.roles.includes(constants.ROLE.GD)) {
            this.listAssigner.filter(user => {
              if (user.userId === currentUser.userId) {
                currentUser.userRoleDetails.filter(role => {
                  if (role.roleType === constants.ROLE_TYPE.MAIN) {
                    this.formData.assigner = user
                  }
                })
              }
            })
          }
          // start kiennt add
          if (this.$route.name === "DETAIL_TICKET") {
            this.bindInitDataCreateFromTicket(this.ticketInfoForCreateTask)
          }
          // end kiennt add
        }, 500)
        this.formatDateStart = ''
        this.formatDateEnd = ''
      }
    },
    formData: {
      handler() {
        const arrCheck = [null, undefined, '']
        arrCheck.includes(this.trimSpace(this.formData.name)) ? this.isShowAll = true : this.isShowAll = false

        // nguoi thuc hien va nguoi giao null
        if (this.formData.performer && !this.formData.assigner) {
          const newArrMonitorTranfer = []
          const newArrCombiNatorTranfer = []
          if (this.formData.performer.objectType === constants.OBJECT_TYPE.USER) {
            this.listMonitor.filter(item => {
              if (item.userId !== this.formData.performer.userId) { newArrMonitorTranfer.push(item) }
            })
            this.listMonitorTranfer = newArrMonitorTranfer
            this.listCombinator.filter(item => {
              if (item.userId !== this.formData.performer.userId) { newArrCombiNatorTranfer.push(item) }
            })
            this.listCombinaTorTransfer = newArrCombiNatorTranfer
          } else {
            this.listCombinator.filter(item => {
              if (item.groupId !== this.formData.performer.groupId) { newArrCombiNatorTranfer.push(item) }
            })
            this.listCombinaTorTransfer = newArrCombiNatorTranfer
          }
        }
        // // nguoi giao va ng thuc hien null
        if (this.formData.assigner && !this.formData.performer) {
          const newArrMonitorTranfer = []
          const newArrCombiNatorTranfer = []
          this.listMonitor.filter(item => {
            if (item.userId !== this.formData.assigner.userId

            ) {
              newArrMonitorTranfer.push(item)
            }
          })
          this.listMonitorTranfer = newArrMonitorTranfer

          this.listCombinator.filter(item => {
            if (item.userId !== this.formData.assigner.userId) {
              newArrCombiNatorTranfer.push(item)
            }
          })
          this.listCombinaTorTransfer = newArrCombiNatorTranfer
        }

        // ca 2 khong null
        if (this.formData.performer && this.formData.assigner) {
          const newArrMonitorTranfer = []
          const newArrCombiNatorTranfer = []
          var arr = []

          if (this.formData.performer.objectType === constants.OBJECT_TYPE.USER) {
            if (this.formData.combinators && this.formData.combinators.length > 0) {
              this.listCombinator.filter(item => {
                if (item.userId !== this.formData.performer.userId) {
                  newArrCombiNatorTranfer.push(item)
                }
              })
              this.listCombinaTorTransfer = newArrCombiNatorTranfer
              this.formData.combinators.filter(user => {
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
                if (item.userId !== this.formData.performer.userId && item.userId !== this.formData.assigner.userId) { newArrMonitorTranfer.push(item) }
                if (this.formData.combinators && this.formData.combinators.length !== 0) {
                  this.formData.combinators.filter(user => {
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
                if (item.userId !== this.formData.performer.userId) { newArrCombiNatorTranfer.push(item) }
              })
              this.listCombinaTorTransfer = newArrCombiNatorTranfer
            }
          } else {
            this.listCombinator.filter(item => {
              if (item.groupId !== this.formData.performer.groupId) { newArrCombiNatorTranfer.push(item) }
            })
            this.listCombinaTorTransfer = newArrCombiNatorTranfer
          }
        }

        // truogn hop 1 th va phoi hop  !== null
        if (this.formData.performer && this.formData.combinators && this.formData.combinators.length > 0) {
          const arrNew = []
          this.listCombinator.filter(item => {
            if (this.formData.performer.objectType === constants.OBJECT_TYPE.USER) {
              if (item.userId !== this.formData.performer.userId) {
                arrNew.push(item)
              }
            } else {
              if (item.groupId !== this.formData.performer.groupId) {
                arrNew.push(item)
              }
            }
          })
          this.listCombinaTorTransfer = arrNew
        }
        // pass

        // truogn hop 2 th va theo doi !== null
        if (this.formData.performer && this.formData.monitors && this.formData.monitors.length > 0) {
          const arrNew = []
          this.listMonitor.filter(item => {
            if (item.userId !== this.formData.performer.userId) {
              arrNew.push(item)
            }
          })
          this.listMonitorTranfer = arrNew
        }
        // pass*/

        if (this.formData.status === constants.STATUS_TASK.FINISH) {
          this.isShowDeadline = true
          const selectDate = moment(this.deadlineFromPicker[1], 'YYYY-MM-DD')
          const timeExprired = moment(new Date(), 'YYYY-MM-DD')
          const diff = selectDate.diff(timeExprired, 'days')
          if (diff === 0) {
            if (this.startTime) {
              const date = new Date()
              const newTime = date.getHours() + ':' + date.getMinutes()
              const strnewTime = newTime.split(':')
              const strStartTime = this.startTime.split(':')
              const totalSeconds1 = parseInt(strnewTime[0] * 3600 + strnewTime[1] * 60);
              const totalSeconds2 = parseInt(strStartTime[0] * 3600 + strStartTime[1] * 60);
              if (totalSeconds1 < totalSeconds2) {
                this.errorStartTime = 'task-manager.error.start-time'
              } else {
                this.errorStartTime = ''
              }
            }
          }
        } else {
          this.errorStartTime = ''
        }
      },
      deep: true
    },
    deadlineFromPicker() {
      if (this.deadlineFromPicker[0] && this.deadlineFromPicker[1]) {
        const selectDate = moment(this.deadlineFromPicker[0], 'YYYY-MM-DD')
        const timeExprired = moment(this.deadlineFromPicker[1], 'YYYY-MM-DD')
        const diff = selectDate.diff(timeExprired, 'days')
        if (diff > 0) {
          const temp = this.deadlineFromPicker[0]
          this.deadlineFromPicker[0] = this.deadlineFromPicker[1]
          this.deadlineFromPicker[1] = temp
        }
        this.formatDateFromArray()
        if (this.formData.status === constants.STATUS_TASK.FINISH) {
          const selectDate = moment(this.deadlineFromPicker[0], 'YYYY-MM-DD')
          const timeExprired = moment(new Date(), 'YYYY-MM-DD')
          const diff = selectDate.diff(timeExprired, 'days')
          if (diff > 0) {
            const selectDate = moment(this.deadlineFromPicker[0], 'YYYY-MM-DD')
            const timeExprired = moment(this.deadlineFromPicker[1], 'YYYY-MM-DD')
            const diff = selectDate.diff(timeExprired, 'days')
            if (diff < 0) {
              this.formatDateStart = this.formatDate(this.deadlineFromPicker[0])
              this.formatDateEnd = this.formatDate(this.deadlineFromPicker[1])
            } else {
              const temp = this.deadlineFromPicker[0]
              this.deadlineFromPicker[0] = this.deadlineFromPicker[1]
              this.deadlineFromPicker[1] = temp
              this.formatDateStart = this.formatDate(this.deadlineFromPicker[0])
              this.formatDateEnd = this.formatDate(this.deadlineFromPicker[1])
            }
            this.errorDate = 'task-manager.error.start-date'
          } else {
            this.formatDateFromArray()
            this.errorDate = ''
          }
        } else {
          this.errorDate = ''
          this.errorStartTime = ''
          const selectDate = moment(this.deadlineFromPicker[0], 'YYYY-MM-DD')
          const timeExprired = moment(this.deadlineFromPicker[1], 'YYYY-MM-DD')
          const diff = selectDate.diff(timeExprired, 'days')
          if (diff > 0) {
            const temp = this.deadlineFromPicker[0]
            this.deadlineFromPicker[0] = this.deadlineFromPicker[1]
            this.deadlineFromPicker[1] = temp
          }
          this.formatDateFromArray()
        }
      } else {
        const isValidEndDate = moment(
          this.deadlineFromPicker[0],
          'DD/MM/YYYY',
          true
        ).isValid
        if (isValidEndDate) {
          this.formData.endDate = null
          this.formData.startDate = null
          this.startTime = ''
          const vi = 'task-manager.label.endDateStr'
          this.formData.endDate = moment(this.deadlineFromPicker[0], 'YYYY-MM-DD').format('DD/MM/YYYY')
          this.deadlineFromPicker[0] ? this.strDeadline = I18n.t(vi, { end: this.formData.endDate }) : this.strDeadline = ''
          this.formData.startDate = null
          this.errorEndDate = ''
          this.formatDateStart = ''
          this.formatDateEnd = this.formatDate(this.deadlineFromPicker[0])
        }
      }
    },
    startTime() {
      if (this.formData.status === constants.STATUS_TASK.FINISH) {
        const selectDate = moment(this.deadlineFromPicker[0], 'YYYY-MM-DD')
        const timeExprired = moment(new Date(), 'YYYY-MM-DD')
        const diff = selectDate.diff(timeExprired, 'days')
        if (diff === 0) {
          if (this.startTime) {
            const date = new Date()
            const newTime = date.getHours() + ':' + date.getMinutes()
            const strnewTime = newTime.split(':')
            const strStartTime = this.startTime.split(':')
            const totalSeconds1 = parseInt(strnewTime[0] * 3600 + strnewTime[1] * 60);
            const totalSeconds2 = parseInt(strStartTime[0] * 3600 + strStartTime[1] * 60);
            if (totalSeconds1 < totalSeconds2) {
              this.errorStartTime = 'task-manager.error.start-time'
            } else {
              this.errorStartTime = ''
            }
          }
        }
      } else {
        this.errorStartTime = ''
      }
      if (this.endTime) {
        const selectDate = moment(this.deadlineFromPicker[0], 'YYYY-MM-DD')
        const timeExprired = moment(this.deadlineFromPicker[1], 'YYYY-MM-DD')
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
    "formData.status"() {
      if (this.formData.status === constants.STATUS_TASK.FINISH) {
        const selectDate = moment(this.deadlineFromPicker[0], 'YYYY-MM-DD')
        const timeExprired = moment(new Date(), 'YYYY-MM-DD')
        const diff = selectDate.diff(timeExprired, 'days')
        if (diff > 0) {
          const selectDate = moment(this.deadlineFromPicker[0], 'YYYY-MM-DD')
          const timeExprired = moment(this.deadlineFromPicker[1], 'YYYY-MM-DD')
          const diff = selectDate.diff(timeExprired, 'days')
          if (diff < 0) {
            this.formatDateStart = this.formatDate(this.deadlineFromPicker[0])
            this.formatDateEnd = this.formatDate(this.deadlineFromPicker[1])
          } else {
            const temp = this.deadlineFromPicker[0]
            this.deadlineFromPicker[0] = this.deadlineFromPicker[1]
            this.deadlineFromPicker[1] = temp
            this.formatDateStart = this.formatDate(this.deadlineFromPicker[0])
            this.formatDateEnd = this.formatDate(this.deadlineFromPicker[1])
          }
          this.errorDate = 'task-manager.error.start-date'
        } else {
          this.formatDateFromArray()
          this.errorDate = ''
        }
      } else {
        this.errorDate = ''
      }
    },
    endTime() {
      if (this.deadlineFromPicker[0] && this.deadlineFromPicker[1]) {
        if (this.startTime) {
          const selectDate = moment(this.deadlineFromPicker[0], 'YYYY-MM-DD')
          const timeExprired = moment(this.deadlineFromPicker[1], 'YYYY-MM-DD')
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
  created() {

  },
  mounted() {
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    formatDateFromArray() {
      this.formatDateStart = this.deadlineFromPicker[0] ? this.formatDate(this.deadlineFromPicker[0]) : ''
      this.formatDateEnd = this.deadlineFromPicker[1] ? this.formatDate(this.deadlineFromPicker[1]) : ''
      const vi = 'task-manager.label.deadlinestr'
      this.deadlineFromPicker[1] !== 'undefined' ? this.strDeadline = I18n.t(vi, {
        start: this.formatDateStart,
        end: this.formatDateEnd
      }) : ''
    },
    checkEmptyTaskName() {
      if (this.formData.name === '' || this.formData.name === null) {
        document.getElementById('taskName').focus()
      }
    },
    btnClickChangePerformer() {
      if (!this.isShowPerfomer) {
        this.formData.combinators = null
      }
      this.isShowPerfomer = !this.isShowPerfomer
      // document.getElementById('performerList').focus()
    },
    btnClickChangeFollower() {
      if (!this.isShowFollower) {
        this.formData.monitors = null
      }
      this.isShowFollower = !this.isShowFollower
    },
    btnCLickChangeDeadline() {
      this.deadlineFromPicker = []
      this.formData.startDate = null
      this.formData.endDate = null
      this.deadline = null
      this.isShowDeadline = !this.isShowDeadline
    },
    btnShowDescription() {
      this.formData.description = ''
      this.isShowDescripton = !this.isShowDescripton
    },
    btnShowChangeTag() {
      this.formData.taskCategoryId = null
      this.isShowTag = !this.isShowTag
    },
    btnShowFlash() {
      this.isShowflash = !this.isShowflash
    },
    btnShowFile() {
      this.nameFileAttachs = []
      this.isShowFileInput = !this.isShowFileInput
    },
    btnShowsource() {
      this.formData.parentId = null
      this.isShowSourceTask = !this.isShowSourceTask
    },
    btnShowlink() {
      this.isShowlink = !this.isShowlink
    },
    miniMizeDiaLog() {
      this.$emit('miniMize-dialog')
    },
    resetForm() {
      this.formatDateStart = ''
      this.formatDateEnd = ''
      this.deadlineFromPicker = []
      this.startTime = ''
      this.endTime = ''
      this.formData = { ...initformData }
      this.nameFileAttachs = []
      this.formData.childrenTask = []
      this.$refs.observer.reset()
      this.strDeadline = ''
      this.deadlineFromPicker = []
      this.isShowflash = false
      this.isShowPerfomer = false
      this.isShowTag = false
      this.isShowDescripton = false
      this.isShowlink = false
      this.isShowSourceTask = false
      this.isShowDeadline = false
      this.isShowFollower = false
      this.isShowFileInput = false
      this.isShowFollower = false
    },
    closeDialog() {
      this.isShowALl = false
      this.resetForm()
      this.$emit('close-dialog')
    },
    formatDate(date, event) {
      return moment(date).format('DD/MM/YYYY')
    },
    async accept() {
      if (this.typeActionActive === constants.TASK_TYPE_ACTION.CANCEL) {
        // huy
        if (this.checkFormDataIsNull()) {
          this.resetFormData()
        }
      } else {
        // save
        if (this.deadlineFromPicker[0]) {
          if (this.deadlineFromPicker[1]) {
            this.startTime ? this.formData.startDate = this.formatDate(this.deadlineFromPicker[0]) + ' ' + this.startTime : this.formData.startDate = this.formatDate(this.deadlineFromPicker[0]) + ' 00:00'
            this.endTime ? this.formData.endDate = this.formatDate(this.deadlineFromPicker[1]) + ' ' + this.endTime : this.formData.endDate = this.formatDate(this.deadlineFromPicker[1]) + ' 23:59'
          } else {
            this.endTime ? this.formData.endDate = this.formatDate(this.deadlineFromPicker[0]) + ' ' + this.endTime : this.formData.endDate = this.formatDate(this.deadlineFromPicker[0]) + ' 23:59'
            this.formData.startDate = null
          }
        } else {
          this.formData.startDate = null
          this.formData.endDate = null
        }
        this.formData.fileAttachments = this.nameFileAttachs
        const arrChirldren = []
        if (this.formData.childrenTask && this.formData.childrenTask.length > 0) {
          this.formData.childrenTask.filter(task => {
            if (task.name) {
              arrChirldren.push(task)
            }
          })
          this.formData.childrenTask = arrChirldren
        }
        try {
          this.loading = true
          await TaskService.createTask(this.formData)
          // start kiennt add
          if (this.ticketInfoForCreateTask && this.ticketInfoForCreateTask.id > 0) {
            this.ticketInfoForCreateTask.isReload = true
          }
          // end kiennt add
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.SUCCESS,
            content: this.$t('task-manager.notify.success'),
            key: false
          })
          this.closeDialog()
          // start kiennt add
          if (this.$route.name !== "DETAIL_TICKET") {
            this.$emit('search-task-create')
          }
          if (this.$route.name === 'TASK_DASHBOARD') {
            this.$router.push({ name: 'I_CREATE' })
          }
          // end kiennt add
        } catch (error) {
          this.setNotify({
            show: true,
            type: constants.NOTIFY_TYPE.ERROR,
            content: error.message,
            key: false
          })
        } finally {
          this.loading = false
        }
      }
    },
    showDialogConfirmCreate() {
      this.typeActionActive = constants.TASK_TYPE_ACTION.SAVE
      this.objConfirmTask.titleConfirm = 'task-manager.confirm.create'
      this.objConfirmTask.showDialogConfirm = true
    },
    openDialogSelectSoureTask() {
      this.showDialogSelectSoucreTask = true
    },
    OpenDialogSelectTaskAssociations() {
      this.showDialogSelectTaskAssociations = true
    },
    sourceTaskFromEmit(value) {
      this.formData.sourceTask = value
    },
    listAssociationFromEmit(val) {
      this.listSourceTask = val
    },
    taskAssociationsFromEmit(value) {
      this.formData.taskAssociations = value
    },

    closeDialogSelectSourceTask() {
      this.showDialogSelectSoucreTask = false
    },
    closeDialogSelectTaskAssociations() {
      this.showDialogSelectTaskAssociations = false
    },
    trimSpace(val) {
      return val ? val.trim() : ''
    },
    async selectAttachs() {
      try {
        this.fileAttachs = [...this.$refs.fileAttachsInput.files];
        // bien chua index de xoa
        const listIndexRemove = [];
        // lap de tim cac ten file trung nhau
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
            this.fileAttachs = this.nameFileAttachs;
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
        var formData = new FormData();
        this.fileAttachs.map((file) => {
          if (file.name) {
            formData.append("files", file);
          }
        });
        formData.append("fileType", constants.FILE_TYPES.FILE_EXTRA);
        const response = await TaskService.upload(formData);
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
          key: false
        });
      } finally {
        this.uploadingFileAttatch = false;
      }
    },
    uploadAttachs() {
      document.getElementById('fileAttachsInput').click()
    },
    removeFileAttach(index) {
      var fileBuffer = new DataTransfer()
      document.getElementById('fileAttachsInput').files = fileBuffer.files
      this.fileAttachs.splice(index, 1)
      this.nameFileAttachs.splice(index, 1)
      this.formdata.fileAttachments = this.nameFileAttachs
      this.setFileAttachs(this.nameFileAttachs)
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

    remove(index) {
      if (index >= 0) {
        this.formData.monitors.splice(index, 1)
      }
    },
    removePerfomer() {
      if (this.formData.name) {
        this.formData.performer = null
      }
    },
    removeAssigner() {
      if (this.formData.name) {
        this.formData.assigner = null
      }
    },
    removeCombinator(index) {
      if (index >= 0) {
        this.formData.combinators.splice(index, 1)
      }
    },
    removeLinkTo(index) {
      if (index >= 0) {
        this.formData.taskAssociations.splice(index, 1)
      }
    },
    removeSourceTask() {
      this.formData.sourceTask = null
    },
    removeWorkType() {
      this.formData.taskCategoryId = null
    },
    renderAvatarText(name) {
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
    addChildWork() {
      if (this.formData.name && this.formData.assigner) {
        this.formData.childrenTask.push({ ...initChildWorkData })
      } else {
        this.setNotify({
          show: true,
          type: constants.NOTIFY_TYPE.WARNING,
          content: this.$t('task-manager.notify.required-assigner')
        })
      }
    },
    removeChildWork(index) {
      if (index >= 0) {
        return this.formData.childrenTask.splice(index, 1)
      }
    },
    checkExpiredDate(dateStart, dateEnd) {
      if (this.formData.startDate && this.formData.endDate) {
        if (dateEnd != null) {
          if (dateStart) {
            const dateDataStart = moment(dateStart, 'DD/MM/YYYY')
            const dateNowSTart = moment(this.formData.startDate, 'DD/MM/YYYY')
            const diff = dateDataStart.diff(dateNowSTart, 'days')
            const dateDataEnd = moment(dateEnd, 'DD/MM/YYYY')
            const dateNowEnd = moment(this.formData.endDate, 'DD/MM/YYYY')
            const diffEnd = dateDataEnd.diff(dateNowEnd, 'days')
            if (diff <= 0 && diffEnd >= 0 || diffEnd === 0) {
              return true
            } else if (diff <= 0 && diffEnd <= 0) {
              return true
            } else if (diff >= 0 && diffEnd >= 0) {
              return true
            } else {
              return false
            }
          }
        }
      }
    },
    async getListAsginer() {
      try {
        const response = await TaskService.getPersonParticipation(Constants.PATICIPATION.ASSIGNER)
        this.listAssigner = response.data
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
    async getListCombinator() {
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
    bindInitDataCreateFromTicket(data) {
      // bind assigner
      if (typeof data.assignId !== "undefined") {
        this.formData.assigner = []
        const selected = this.listAssigner.find(x => x.userId === data.assignId)
        if (selected) {
          this.formData.assigner = selected
        }
      }

      // bind monitor
      if (typeof data.monitorIds !== "undefined") {
        this.formData.monitors = [];
        const monitorIds = data.monitorIds
        monitorIds.forEach(val => {
          const selected = this.listMonitor.find(x => x.userId === val)
          if (selected) {
            this.formData.monitors.push(selected)
          }
        });
        this.isShowFollower = true
      }

      // bind source task
      const sourceSelected = {
        id: data.id,
        name: data.name,
        associationType: constants.ASSOCIATION_TYPE.TICKET
      }
      this.listSourceTask = []
      this.listSourceTask.push(sourceSelected)
      this.formData.sourceTask = sourceSelected
      this.isShowSourceTask = true
    },
    cancelDialog() {
      this.typeActionActive = constants.TASK_TYPE_ACTION.CANCEL
      this.objConfirmTask.titleConfirm = 'task-manager.confirm.cancel'
      this.objConfirmTask.showDialogConfirm = true
    },
    checkFormDataIsNull() {
      if (this.formData.name ||
          this.formData.taskCategoryId ||
          this.formData.content ||
          this.formData.priority !== constants.PRIORITY.MEDIUM ||
          this.formData.status ||
          this.formData.description ||
          this.formData.startDate ||
          this.formData.endDate ||
          this.formData.actualDuration ||
          this.formData.assigner ||
          this.formData.taskAssociations.length !== 0 ||
          this.formData.sourceTask ||
          this.formData.monitors.length !== 0 ||
          this.formData.monitors.length !== 0 ||
          this.formData.combinators.length !== 0 ||
          this.formData.childrenTask.length !== 0 ||
          this.formData.fileAttachments.length !== 0
      ) {
        return true
      } else {
        return false
      }
    },

    resetFormData() {
      this.formatDateStart = ''
      this.formatDateEnd = ''
      this.deadlineFromPicker = []
      this.startTime = ''
      this.endTime = ''
      this.formData = { ...initformData }
      this.nameFileAttachs = []
      this.formData.childrenTask = []
      this.$refs.observer.reset()
      this.strDeadline = ''
      this.deadlineFromPicker = []
    },
    clearDateTime() {
      this.startTime = ''
      this.endTime = ''
      this.formatDateStart = ''
      this.formatDateEnd = ''
      this.deadlineFromPicker = []
    },
    checkEqualItem(item1, item2) {
      return item1 === item2
    }
  }
}
</script>
<style scoped>
.opacity-3 {
  opacity: 0.3;
}
</style>
