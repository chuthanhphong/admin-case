<template>
  <div class="container container-ticket py-0 px-0">
    <div class="d-flex align-center">
      <h5 class="title-page text-primary d-flex align-center">
        <span class="mr-3">{{ $t("task-dashboard.title") }}</span>
        <span>({{ totalRecords }})</span>
      </h5>
    </div>
    <div id="page-create">
      <base-preload :dialog="isLoading" />
      <v-container class="rounded-xl" fluid>
        <div class="wrap-home">
          <div class="col-md-8 col-6 pl-0">
            <div class="mt-0 text-body-5 d-inline-flex">
              <div v-show="notificationRead.length" :class="`col-xs-3 ${styleInputRead}`">
                <v-btn class="btn-read-all" outlined @click="onUpdate">
                  <span class="mr-2">{{ getTitleNoti() }}</span>
                  <vue-feather size="25" type="check" />
                </v-btn>
              </div>

              <div class="pl-0 col-xs-3 col-sm-3">
                <v-select
                  v-model="formDataSearch.selectedType"
                  :items="itemSelectType"
                  item-text="value"
                  item-value="id"
                  outlined
                  dense
                  hide-details
                  class="select-text"
                  attach=""
                  :menu-props="{ contentClass: 'reportYear' }"
                  @change="getListNoti"
                >
                  <template v-slot:append>
                    <v-icon>mdi-chevron-down</v-icon>
                  </template>
                </v-select>
              </div>

              <div class="pl-0 col-xs-3 col-sm-3">
                <v-select
                  v-model="formDataSearch.selectedRead"
                  :items="$t('task-dashboard.select-read')"
                  item-text="value"
                  item-value="id"
                  outlined
                  dense
                  hide-details
                  class="select-text"
                  attach=""
                  :menu-props="{ contentClass: 'reportYear' }"
                  @change="getListNoti"
                >
                  <template v-slot:append>
                    <v-icon>mdi-chevron-down</v-icon>
                  </template>
                </v-select>
              </div>

              <div class="pl-0 col-xs-3 col-sm-3">
                <validation-provider
                  name="contractName"
                  rules="required|max:200"
                >
                  <v-text-field
                    v-model="formDataSearch.searchKeyword"
                    outlined
                    dense
                    clearable
                    hide-details
                    maxlength="200"
                    counter="200"
                    class="text--body-5"
                    name="txtSearch"
                    autofocus
                    :placeholder="$t('task-dashboard.search-placeholder')"
                    @keyup.enter="getListNoti"
                    @click:clear="getListNoti"
                  >
                    <vue-feather
                      slot="append"
                      class="grey--text"
                      type="search"
                      size="20"
                    />
                  </v-text-field>
                </validation-provider>
              </div>

              <div class="pl-0 col-xs-3 col-sm-1">
                <div class="icon"></div>
              </div>
            </div>
          </div>

          <div>
            <div v-if="isEmpty" class="col-md-5 col-12 mx-auto wrap-empty-list">
              <empty-box :subtitle="'task-manager.empty.data'" />
            </div>

            <v-simple-table v-else dense fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left" style="width: max-content">
                      <v-checkbox
                        v-model="isCheckBoxAll"
                        @change="changeCheckBoxAll()"
                      ></v-checkbox>
                    </th>
                    <th
                      v-for="(it, index) in $t('task-dashboard.table')"
                      :key="index"
                      :style="{ width: it.width, fontSize: '14px' }"
                    >
                      {{ it.name }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(item, index) in listNoti"
                    :key="index"
                    :class="`${bgReadUnread(item.readStatus)}`"
                  >
                    <!-- check box -->
                    <td>
                      <v-checkbox
                        class="bg-none"
                        :disabled="getCheckBox(item.readStatus)"
                        :input-value="item.statusValue"
                        @change="changeCheckBox(index)"
                      ></v-checkbox>
                    </td>
                    <!-- name Send -->
                    <td @click="goToPageNotification(item)">
                      <div>
                        <v-avatar size="32px" color="primary">
                          <img
                            v-if="notiImage[index]"
                            :src="notiImage[index]"
                          />
                          <b v-else class="text-uppercase white--text">{{
                            item.senderUserName && item.senderUserName[0]
                          }}</b>
                        </v-avatar>
                      </div>
                    </td>
                    <!-- content -->
                    <td @click="goToPageNotification(item)">
                      <span class="content-noti text-title">{{
                        getModuleNotify(item.actionModule).module
                      }}</span>
                      <div class="content-noti">{{ item.content }}</div>
                    </td>
                    <!-- createAt -->
                    <td @click="goToPageNotification(item)">
                      <div>{{ formatTime(item.createdAt) }}</div>
                    </td>
                    <!-- type -->
                    <td @click="goToPageNotification(item)">
                      <div class="border-icon">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <div
                              class="icon"
                              :class="`${
                                getModuleNotify(item.actionModule).className
                              }`"
                              v-bind="attrs"
                              v-on="on"
                            />
                          </template>
                          <span>{{
                            getModuleNotify(item.actionModule).module
                          }}</span>
                        </v-tooltip>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
          <div class="mt-12 mx-2 px-8 pb-4">
            <base-paging
              :page="formDataSearch.page"
              :total-pages="totalPages"
              :from-record="fromRecord"
              :to-record="toRecord"
              :total-records="totalRecords"
              @on-change-page="onChangePage"
            />
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>
<script>
import notification from "@/mixins/notification";
import pagingData from "@/mixins/paging";
import EmptyBox from "@/views/components/EmptyBox.vue";
import constants from "@/constants";
import { mapActions } from 'vuex';

export default {
  name: "TaskDashboard",
  components: {
    EmptyBox,
  },
  mixins: [pagingData, notification],
  data() {
    return {
      notificationRead: [],
      notiImage: [],
      listNoti: [],
      itemSelectType: [],
      formDataSearch: {
        selectedType: "",
        selectedRead: "",
        searchKeyword: "",
        page: 1,
        pageSize: 10,
      },
      isEmpty: false,
      isLoading: false,
      isCheckBoxAll: false,
      styleInputRead: 'col-sm-3'
    };
  },

  created() {
    const user = JSON.parse(localStorage.getItem(constants.USER_INFO));
    this.getSelectType(user.modules);
    this.getListNoti();
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.styleInputRead = window.innerWidth > 1650 ? 'col-sm-3' : 'col-sm-4 pl-0';
    })
  },

  methods: {
    ...mapActions("layout", ["setIsLoadNewNotification"]),

    getTitleNoti() {
      return this.$t("task-dashboard.btn-read") + "( " + this.notificationRead.length + " )";
    },

    getSelectType(roles) {
      this.$t("task-dashboard.select-type").forEach((it) => {
        if (it.code !== "All" && roles.indexOf(it.code) === -1) {
          return;
        }
        this.itemSelectType.push(it);
      });
    },

    async getListNoti() {
      this.clearData();
      const keySearch = this.formDataSearch.searchKeyword;
      this.formDataSearch.searchKeyword = keySearch ? keySearch.trim() : null
      const res = await this.initNotifications(this.formDataSearch);
      this.isLoading = false;
      if (res.data && res.data.length) {
        this.listNoti = res.data;
        this.notiImage = await Promise.all(
          this.listNoti.map((it) => this.getImage(it.senderAvatar))
        );
        this.renderPaging(res);
        this.changeCheckBoxAll;
        this.isEmpty = false;
        return;
      }
      this.isEmpty = true;
    },

    clearData() {
      this.isLoading = true;
      this.notificationRead = [];
      this.isCheckBoxAll = false;
      this.listNoti = [];
    },

    changeCheckBoxAll() {
      if (!this.listNoti.length) {
        return;
      }
      this.listNoti.forEach((it) => {
        if (this.getCheckBox(it.readStatus)) {
          return;
        }
        it.statusValue = this.isCheckBoxAll;
        if (this.isCheckBoxAll) {
          this.notificationRead.push(it.id);
          return;
        }
        this.notificationRead = [];
      });
    },

    changeCheckBox(index) {
      this.isCheckBoxAll = false;
      this.listNoti[index].statusValue = !this.listNoti[index].statusValue;
      if (this.listNoti[index].statusValue) {
        this.notificationRead.push(this.listNoti[index].id);
        return;
      }
      const indexItem = this.notificationRead.indexOf(this.listNoti[index].id);
      if (indexItem !== -1) {
        this.notificationRead.splice(indexItem, 1);
      }
    },

    getCheckBox(status) {
      if (status === 0) return false;
      return true;
    },

    onChangePage(page) {
      this.formDataSearch.page = page;
      this.getListNoti();
    },

    async onUpdate() {
      const status = await this.updateReadNoti(this.notificationRead);
      if (status === 200) {
        this.setIsLoadNewNotification(true);
        this.getListNoti();
      }
    },
    async goToPageNotification(item) {
      const status = await this.updateReadNoti([item.id]);
      if (status === 200) {
        this.setIsLoadNewNotification(true);
        this.eventNotificationDetail(item);
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.content-noti {
  font-size: 14px;
}
.icon {
  width: 19px;
  height: 20px;
  margin-top: 8px;
  content: "";
  background: url(../../assets/icons/task/icon_info.svg) no-repeat;
  background-size: 100% 100%;
}

.btn-read-all {
  text-transform: none;
  background: transparent;
  border: 1px solid #7a7c80;
  border-radius: 8px;
}

.select-text {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #22242c;
}

.icon-kydt {
  content: "";
  background: url(../../assets/icons/menubar/kydt/main.svg) no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.icon-vanban {
  content: "";
  background: url(../../assets/icons/menubar/vanban/main.svg) no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.icon-tongquan {
  content: "";
  background: url(../../assets/icons/menubar/tongquan/main.svg) no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.icon-vanphongpham {
  content: "";
  background: url(../../assets/icons/menubar/vanphongpham/main.svg) no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.icon-yeucau {
  content: "";
  background: url(../../assets/icons/menubar/yeucau/main.svg) no-repeat;
  background-size: 100% 100%;
}
.icon-xe {
  content: "";
  background: url(../../assets/icons/icon-car.svg) no-repeat;
  background-size: 100% 100%;
}
.border-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  border-radius: 100%;
  border: 1px solid #252733;
  .icon {
    width: 18px;
    height: 18px;
    margin: auto;
    box-sizing: border-box;
  }
}
.bg-read {
  background: #ffffff;
}
.bg-unread {
  background: linear-gradient(0deg, #f1fdff, #f1fdff), #ffffff;
}
.text-title {
  font-weight: 900;
}
</style>
