<template>
  <v-expansion-panels v-model="expandedParent" class="rounded-0 no-z-index wrap__participants">
    <v-expansion-panel class="rounded-0">
      <v-expansion-panel-header color="#E7ECF1" class="rounded-0">
        <v-layout justify-space-between>
          <v-layout align-center>
            <v-avatar color="white" size="30" class="align-center mr-4">
              <i class="app-icon icon-information darken icon-size-22"></i>
            </v-avatar>
            <label class="name-title">
              {{ $t("calendar.detailMeeting.participants") }}
            </label>
          </v-layout>
        </v-layout>
        <template v-slot:actions>
          <v-icon color="darken"> $expand </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="my-3">
        <v-expansion-panels
          v-model="expandedChildren"
          class="rounded-0 no-z-index expand-group"
          multiple
        >
          <v-expansion-panel
            v-for="(item, index) in listData"
            :key="index"
            :readonly="!isGroup(item)"
          >
            <!-- header group -->
            <v-expansion-panel-header
              v-if="isGroup(item)"
              :class="item.listUser && item.listUser.length ? '' : 'header-expansion-user'"
            >
              <div class="row">
                <div class="col-5 header-group" style="position: relative;">
                  <avatar-group
                    :item="item"
                  />
                </div>
                <div class="col-1 ma-auto d-flex justify-center align-center">
                  <span v-if="item.isChairMan" class="icon-award"></span>
                  <span v-if="item.isPrepare" class="icon-ruler"></span>
                </div>
                <div class="col-3 ma-auto text-ellipsis">
                  <v-radio-group
                    v-model="radioGroup"
                  >
                    <v-radio
                      color="#E7ECF1"
                      value="primary"
                      :label="item.isInviteAllInGroup ? $t('calendar.detailMeeting.invite-unit') : $t('calendar.detailMeeting.invite-leader')"
                    />
                  </v-radio-group>
                </div>
                <div class="col-3 ma-auto text-ellipsis">
                  <span class="mr-1">{{ item.listUser.length }}</span>
                  <span>{{ $t('calendar.detailMeeting.creator-participant') }}</span>
                </div>
              </div>
            </v-expansion-panel-header>
            <!-- note group -->
            <div v-if="item.note && item.isPrepare && isGroup(item)" class="row">
              <div
                class="d-flex align-center justify-center my-2 row"
              >
                <div class="col-10 box-prepare">
                  <v-text-field
                    :value="item.note"
                    name="note"
                    class="text--body-5"
                    messages=""
                    dense
                    flat
                    solo
                    readonly
                    hide-details
                  />
                </div>
              </div>
            </div>
            <!-- header user trong he thong -->
            <v-expansion-panel-header
              v-if="isUser(item)"
              class="header-expansion-user"
            >
              <div class="row expansion-user">
                <div class="col-5 ma-auto">
                  <avatar-user
                    :item="item"
                  />
                </div>
                <div class="col-1 ma-auto d-flex justify-center align-center">
                  <span v-if="item.isChairMan" class="icon-award"></span>
                  <span v-if="item.isPrepare" class="icon-ruler"></span>
                </div>
                <div class="col-3 ma-auto text-ellipsis">
                  <span>{{ item.email }}</span>
                </div>
                <div class="col-3 ma-auto text-ellipsis">
                  <span>{{ item.phone }}</span>
                </div>
              </div>
            </v-expansion-panel-header>
            <!-- note user trong he thong -->
            <div v-if="item.note && item.isPrepare && isUser(item)" class="row">
              <div
                class="d-flex align-center justify-center my-2 row"
              >
                <div class="col-10 box-prepare">
                  <v-text-field
                    :value="item.note"
                    name="note"
                    class="text--body-5"
                    messages=""
                    dense
                    flat
                    solo
                    readonly
                    hide-details
                  />
                </div>
              </div>
            </div>
            <!-- header user ngoai ngoai he thong -->
            <v-expansion-panel-header
              v-if="isUserOut(item)"
              class="header-expansion-user"
            >
              <div class="row expansion-user">
                <div class="col-5 ma-auto">
                  <avatar-user
                    :item="item"
                  />
                </div>
                <div class="col-1 ma-auto d-flex justify-center align-center">
                  <span v-if="item.isChairMan" class="icon-award"></span>
                  <span v-if="item.isPrepare" class="icon-ruler"></span>
                </div>
                <div class="col-3 ma-auto text-ellipsis">
                  <span>{{ item.email }}</span>
                </div>
                <div class="col-3 ma-auto text-ellipsis">
                  <span>{{ item.phone }}</span>
                </div>
              </div>
            </v-expansion-panel-header>
            <!-- note user ngoai he thong -->
            <div v-if="isUserOut(item) && item.isPrepare && item.note" class="row">
              <div
                class="d-flex align-center justify-center my-2 row"
              >
                <div class="col-10 box-prepare">
                  <v-text-field
                    :value="item.note"
                    name="note"
                    class="text--body-5"
                    messages=""
                    dense
                    flat
                    solo
                    readonly
                    hide-details
                  />
                </div>
              </div>
            </div>
            <!-- content group -->
            <v-expansion-panel-content
              v-if="isGroup(item)"
            >
              <div
                v-for="(user, idx) in item.listUser"
                :key="'user' + idx"
                class="row my-1"
              >
                <div class="col-6 d-flex align-center ma-auto">
                  <info-user
                    :item="user"
                  />
                </div>
                <div class="col-3 ma-auto text-ellipsis">
                  <span>{{ user.email }}</span>
                </div>
                <div class="col-3 ma-auto text-ellipsis">
                  <span>{{ user.phone }}</span>
                </div>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
// components
import AvatarUser from '@/modules/calendar/views/detail/components/AvatarUser'
import AvatarGroup from '@/modules/calendar/views/detail/components/AvatarGroup'
import InfoUser from '@/modules/calendar/views/detail/components/InfoUser'

export default {
  components: {
    AvatarUser,
    AvatarGroup,
    InfoUser
  },
  props: {
    listData: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      expandedParent: 0,
      expandedChildren: [],
      radioGroup: 'primary'
    }
  },
  mounted() {
  },
  methods: {
    isGroup(item) {
      if (item.groupId && !item.userId) {
        return true
      }
      return false
    },
    isUser(item) {
      if (item.groupId && item.userId) {
        return true
      }
      return false
    },
    isUserOut(item) {
      if (!item.groupId && !item.userId) {
        return true
      }
      return false
    },
    renderIndexExpanded() {
      this.expandedChildren = [...Array(this.listData).keys()].map((k, i) => i)
    }
  }
}
</script>
<style scoped>

.name-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #22242C;
}

.icon-ruler:before {
  content: '';
  width: 20px;
  height: 20px;
  background-image: url("../../../../../assets/icons/calendar/ruler.png");
  background-size: 100% 100%;
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-award:before {
  content: '';
  width: 20px;
  height: 20px;
  background-image: url("../../../../../assets/icons/calendar/award.png");
  background-size: 100% 100%;
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-group {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 !important;
}

</style>
