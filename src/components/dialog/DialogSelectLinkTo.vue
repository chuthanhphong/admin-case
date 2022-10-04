<template>
  <v-dialog
    v-model="showDialog"
    class="dia-log-select"
    max-width="500"
    persistent
    transition="dialog-transition"
  >
    <div class="dia-log-select-source-task">
      <div class="d-flex flex-row justify-start align-center">
        <span class="header-title mt-4 ml-3">{{ $t(title) }}</span>
        <v-icon class="close-dialog mt-2" @click="closeDialog">mdi-close</v-icon>
      </div>
      <v-col class="mt-2 pa-0" md="12">
        <v-select
          v-model="typeSource"
          :item-value="item=>item.value"
          :items="listGroupObject"
          :label="$t('task-manager.label.select-perfomer')"
          :menu-props="{ maxHeight: '170', maxWidth:'892'}"
          :placeholder="$t('task-manager.label.select-perfomer')"
          class="text--body-5 ml-3 mr-5"
          dense
          outlined
          solo
        >
          <template v-slot:selection="data">
            <div>
              <v-chip
                :input-value="data.item.selected"
                close
                @click:close="removeTypeSource"
              >
                <v-avatar left>
                  <v-img v-if="data.item.value === 'DOCUMENT'" :src="require('@/assets/icons/task/createTask/document.svg')" />
                  <v-img v-if="data.item.value === 'REQUEST'" :src="require('@/assets/icons/task/createTask/ticket.svg')" />
                  <v-img v-if="data.item.value === 'WORK'" :src="require('@/assets/icons/task/createTask/work.svg')" />
                </v-avatar>
                {{ $t(data.item.label) }}
              </v-chip>
            </div>

          </template>

          <template v-slot:item="data">
            <div class="select--status d-flex flex-row align-center justify-center">
              <v-avatar left>
                <v-img v-if="data.item.value === 'DOCUMENT'" :src="require('@/assets/icons/task/createTask/document.svg')" />
                <v-img v-if="data.item.value === 'REQUEST'" :src="require('@/assets/icons/task/createTask/ticket.svg')" />
                <v-img v-if="data.item.value === 'WORK'" :src="require('@/assets/icons/task/createTask/work.svg')" />
              </v-avatar>
              <v-list-item-title class="ml-3 title-list-link-to" v-html="$t(data.item.label)" />
            </div>
          </template>
        </v-select>
        <v-text-field
          v-model="keyword"
          :placeholder="$t('task-manager.placeHolder.search')"
          class="text--body-5 clear-display ml-3 mr-5"
          clearable
          dense
          height="40px"
          outlined
          @keyup.enter="search()"
          @click:clear="clearKeyword"
          @change="trimSpace"
        >
          <template v-slot:append>
            <v-img
              :src="require('@/assets/icons/task/search.svg')"
              class="hover--pointer"
            />
          </template>
        </v-text-field>
        <h5 class="ml-3 mt-2">{{ `${$t('task-manager.label.subject-has-been-selected')} (${countChecked})` }}</h5>
      </v-col>
      <div id="toTop" v-scroll.self="handleScroll" class="d-flex pa-0 flex-row body-dialog-select-link-to mt-2">
        <v-col id="load-more" class="pa-0">
          <div
            v-if="listAssociation.length == 0"
          >
            <empty-box
              :subtitle="'task-manager.empty.soure-task'"
            />
          </div>
          <v-list-item-group
            v-else
            active-class=""
            class="ml-3"
          >
            <template>
              <div v-for="(item,index) in listAssociation" :key="index" class="d-flex flex-row width-400">
                <v-list-item-action style="margin-bottom: 16px;">
                  <v-checkbox
                    v-model="item.checkbox"
                    :input-value="item.id"
                    @change="checkEventSelectBox($event)"
                  />
                </v-list-item-action>
                <v-list-item-content>
                  <div class="d-flex flex-row flex-nowrap">
                    <v-avatar size="30">
                      <v-img v-if="item.associationType === 'DOCUMENT'" :src="require('@/assets/icons/task/createTask/document.svg')" />
                      <v-img v-if="item.associationType === 'TICKET'" :src="require('@/assets/icons/task/createTask/ticket.svg')" />
                      <v-img v-if="item.associationType === 'TASK'" :src="require('@/assets/icons/task/createTask/work.svg')" />
                    </v-avatar>
                    <v-list-item-content class="py-0">
                      <v-list-item-title class="ml-4 width-100">
                        <v-tooltip content-class="tooltip-top" top>
                          <template v-slot:activator="{ on }">
                            <div style="display: inline" class="text-name-hover text-ellipsis" v-on="on">{{ item.name }}</div>
                          </template>
                          <div>{{ (item.name) }}</div>
                        </v-tooltip>
                      </v-list-item-title>
                      <v-list-item-subtitle class="ml-4">{{ `${$t('task-manager.label.creator')}: ${item.creatorName}` }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </div>
                </v-list-item-content>
              </div>
            </template>
          </v-list-item-group>
        </v-col>
      </div>

      <v-card-actions class="mt-4 justify-end">
        <v-btn
          class="w-150 py-5 text--button"
          color="primary"
          outlined
          rounded
          @click="closeDialog"
        >
          {{ $t('task-manager.button.cancel') }}
        </v-btn>
        <v-btn
          class="w-150 py-5 text--button"
          color="primary"
          rounded
          @click="selectLinkTo"
        >
          {{ $t('task-manager.button.select') }}
        </v-btn>
      </v-card-actions>
    </div>
    <base-preload :dialog="loading" />
  </v-dialog>
</template>

<script>
import EmptyBox from '@/views/components/EmptyBox'
import { TaskService } from "@/modules/etask/services/taskService";
import constants from "@/modules/etask/constants";

export default {
  name: 'DialogSelectLinkTo',
  components: {
    EmptyBox
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    taskAssociations: {
      type: Array,
      default: () => []
    },
    excludes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listAssociation: [],
      listLinkTo: [],
      keyword: '',
      typeSource: '',
      loading: false,
      eventSelected: false,
      timeoutOnScroll: null,
      typeS: '',
      kw: '',
      listA: '',
      listLT: '',
      dataList: {
        documents: [],
        tickets: [],
        tasks: []
      },
      type: ['documents', 'tickets', 'tasks'],
      listCheckbox: [],
      listGroupObject: [
        {
          label: 'task-manager.group-request.document',
          value: 'DOCUMENT',
          icon: '@/assets/icons/task/createTask/file-text.png'
        },
        {
          label: 'task-manager.group-request.request',
          value: 'REQUEST',
          icon: '@/assets/icons/task/createTask/ticket.png'
        },
        {
          label: 'task-manager.group-request.work',
          value: 'WORK',
          icon: '@/assets/icons/task/createTask/briefcase.png'
        }
      ],
    }
  },
  computed: {
    // Dem so luong doi tuong duoc chon
    countChecked() {
      let count = 0;

      this.type.map(key => {
        this.dataList[key].map(item => {
          if (item.checkbox && item.associationType !== this.getType) {
            count += 1;
          }
        })
      })

      this.listAssociation.map(item => {
        if (item.checkbox) {
          count += 1;
        }
      })

      return count;
    },
    getType() {
      return this.listAssociation.length ? this.listAssociation[0].associationType : '';
    }
  },
  watch: {
    showDialog() {
      // Xet gia tri dang duoc chon ben dialog tao task
      this.typeS = this.typeSource;
      this.kw = this.keyword;
      this.listA = this.listAssociation;
      this.listLT = this.listLinkTo;

      // Neu source task bi xoa o dialog ben ngoai thi dialog chon source cung phai duoc clear
      if (!this.taskAssociations || !this.taskAssociations.length) {
        this.typeSource = ''
        this.listLinkTo = [];
        this.listAssociation = [];
        this.listCheckbox = [];
      } else {
        this.listCheckbox = this.taskAssociations.map(item => item.id)
      }
      this.dataList = {
        documents: [],
        tickets: [],
        tasks: []
      };

      // Set gia tri cho danh sach Association
      if (this.showDialog) {
        this.keyword = '';
        this.getListAssociation(this.typeSource, this.keyword)
      }
    },
    typeSource(newType, oldType) {
      this.setDataList(oldType);
      this.setListAssociation(newType, false);
    }
  },
  methods: {
    handleScroll(e) {
      this.timeoutOnScroll && clearTimeout(this.timeoutOnScroll);
      this.timeoutOnScroll = setTimeout(() => {
        const heightContent = document.querySelector(
          "#load-more > .v-list-item-group"
        ).offsetHeight;
        const computedHeightTable = e.target.offsetHeight;
        const heightHeader = 10;
        const scrollTop = heightHeader + heightContent - computedHeightTable;
        if (e.target.scrollTop >= scrollTop) {
          this.page = this.page + 1;
          this.getListAssociation(this.typeSource, this.keyword, true);
        }
      }, 20);
    },
    checkEventSelectBox: function(event) {
      this.eventSelected = event
    },
    setDataList(type) {
      if (type) {
        switch (type) {
          case constants.ASSOCIATION_TYPE.DOCUMENT:
            this.dataList.documents = this.listAssociation;
            break;
          case constants.ASSOCIATION_TYPE.REQUEST:
            this.dataList.tickets = this.listAssociation;
            break;
          default :
            this.dataList.tasks = this.listAssociation;
        }
      }
    },
    closeDialog() {
      // Neu chi dong dialog ma khong an luu thi se khong co thay doi gi
      this.noChange();

      // Dong dialog
      this.$emit('close-dia-log')
    },
    // Neu chi dong dialog ma khong an luu thi se khong co thay doi gi
    noChange() {
      this.typeSource = this.typeS;
      this.keyword = this.kw;
      this.listAssociation = this.listA;
      this.listLinkTo = this.listLT;
    },
    selectLinkTo() {
      this.listLinkTo = [];
      this.type.map(key => {
        this.dataList[key].map(as => {
          if (as.checkbox && as.associationType !== this.getType) {
            const data = {
              associationType: as.associationType,
              creatorName: as.creatorName,
              id: as.id,
              name: as.name
            }
            this.listLinkTo.push(data)
          }
        });
      })

      this.listAssociation.map(as => {
        if (as.checkbox) {
          const data = {
            associationType: as.associationType,
            creatorName: as.creatorName,
            id: as.id,
            name: as.name
          }
          this.listLinkTo.push(data)
        }
      });

      this.$emit('list-link-to', this.listLinkTo)
      this.$emit('close-dia-log')
    },
    removeLinkTo(index) {
      if (index >= 0) {
        this.listLinkTo.splice(index, 1)
        this.eventSelected = false
      }
    },
    removeTypeSource() {
      this.typeSource = ''
      this.listAssociation = [];
      this.setListAssociation(this.typeSource, false);
    },
    clearKeyword() {
      this.keyword = '';
      document.getElementById('toTop').scrollTop = 0;
      this.getListAssociation(this.typeSource, this.keyword)
    },
    trimSpace(val) {
      return val ? val.trim() : ''
    },
    setCheckbox(key, onInit, isLoadMore = false) {
      if (!onInit) {
        this.listLinkTo = [];
      }
      if (isLoadMore) {
        this.listAssociation = this.dataList[key]
      } else {
        this.listAssociation = this.dataList[key].map(item => {
          return { ...item, checkbox: onInit ? this.listCheckbox.includes(item.id) : item.checkbox }
        })
      }
    },
    setListAssociation(type, onInit, isLoadMore) {
      if (type) {
        switch (type) {
          case constants.ASSOCIATION_TYPE.DOCUMENT:
            this.setCheckbox('documents', onInit, isLoadMore);
            break;
          case constants.ASSOCIATION_TYPE.REQUEST:
            this.setCheckbox('tickets', onInit, isLoadMore);
            break;
          default :
            this.setCheckbox('tasks', onInit, isLoadMore);
        }
      }
    },
    search() {
      document.getElementById('toTop').scrollTop = 0;
      this.getListAssociation(this.typeSource, this.keyword, false);
    },
    // call api
    async getListAssociation(type, keyword, isLoadMore = false, onInit = true) {
      try {
        this.loading = true
        !onInit && this.setDataList(type);
        if (!isLoadMore) this.page = 1;

        const body = {
          keyword: keyword,
          page: this.page,
          pageSize: 20,
          statuses: [],
          excludes: this.excludes,
          modules: []
        }

        const response = await TaskService.getListAssociation(body)
        this.type.map(key => {
          const data = this.cb(response.data[key]);
          this.dataList[key] = isLoadMore ? this.dataList[key].concat(data) : data;
        })

        this.setListAssociation(type, onInit, isLoadMore);
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    cb(list) {
      return list.map(item => { return { ...item, checkbox: this.listCheckbox.includes(item.id) } })
    }
  }
}
</script>

<style scoped>
.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 300px;
  display: block;
}
.width-400 {
  width: 400px;
}
.width-100 {
  width: 100px;
}
</style>
