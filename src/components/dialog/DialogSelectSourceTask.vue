<template>
  <v-dialog
    v-model="showDialog"
    class="dia-log-select"
    max-width="500"
    persistent
    transition="dialog-transition"
  >
    <v-container class="dia-log-select-source-task">
      <div>
        <!--        header-dialog-->
        <span class="d-flex text-left align-center mt-1 header-title">{{ $t(title) }}</span>
        <v-icon class="close-dialog mt-2" @click="closeDialog">mdi-close</v-icon>
      </div>

      <div class="d-flex mt-7 align-center mr-3 ">
        <v-col class="selected-source-task ml-1 mr-1 clear-display" md="12">
          <v-select
            v-model="typeSource"
            :item-value="item=>item.value"
            :items="listGroupObject"
            :label="$t('task-manager.label.select-perfomer')"
            :menu-props="{ maxHeight: '170', maxWidth:'576'}"
            :placeholder="$t('task-manager.label.select-perfomer')"
            dense
            outlined
            solo
            @change="setListAssociation(typeSource)"
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
                <v-list-item-title class="ml-3" v-html="$t(data.item.label)" />
              </div>
            </template>
          </v-select>
          <v-text-field
            v-model="keyword"
            :placeholder="$t('task-manager.placeHolder.search')"
            class="text--body-5 mt-2"
            clearable
            dense
            height="40px"
            outlined
            @change="trimSpace"
            @keyup.enter="search()"
            @click:clear="clearKeyword"
          >
            <template v-slot:append>
              <v-img
                :src="require('@/assets/icons/task/search.svg')"
                class="hover--pointer"
              />
            </template>
          </v-text-field>
          <v-text-field
            :disabled="true"
            :placeholder="$t('task-manager.label.select-object')"
            class="text--body-5 mt-2"
            dense
            height="40px"
          >
          </v-text-field>
          <div id="top" v-scroll.self="handleScroll" class="body-dialog-select-source-task align-center">
            <div class="col-12 px-0">
              <div
                v-if="listAssociation.length == 0"
              >
                <empty-box
                  :subtitle="'task-manager.empty.soure-task'"
                />
              </div>
              <v-radio-group
                v-else
                v-model="objectSource"
              >
                <v-radio
                  v-for="(item,index) in listAssociation"
                  :key="index + item.associationType"
                  :label="$t(item.label)"
                  :value="item"
                  class="d-flex justify-center align-center height-50 mb-3"
                >
                  <template v-slot:label>
                    <div class="d-flex flex-row justify-center align-center">
                      <v-avatar size="30">
                        <v-img v-if="item.associationType === 'DOCUMENT'" :src="require('@/assets/icons/task/createTask/document.svg')" />
                        <v-img v-if="item.associationType === 'TICKET'" :src="require('@/assets/icons/task/createTask/ticket.svg')" />
                        <v-img v-if="item.associationType === 'TASK'" :src="require('@/assets/icons/task/createTask/work.svg')" />
                      </v-avatar>
                    </div>
                    <v-list-item three-line>
                      <v-list-item-content style="height: 50px; margin-top: 12px">
                        <div class="label-parent-work text-ellipsis">
                          <v-tooltip :nudge-left="item.name.length > 100 ? 500 : 0 " content-class="tooltip-top" top>
                            <template v-slot:activator="{ on }">
                              <div class="text-name-hover" style="display: inline" v-on="on">
                                {{ (item.name) }}
                              </div>
                            </template>
                            <span>{{ (item.name) }}</span>
                          </v-tooltip>
                        </div>
                        <v-list-item-subtitle>{{ `${$t('task-manager.label.creator')}: ${item.creatorName}` }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
          </div>
        </v-col>
      </div>
      <v-card-actions class="mt-3 justify-end">
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
          @click="selectSourceTask"
        >
          {{ $t('task-manager.button.select') }}
        </v-btn>
      </v-card-actions>
    </v-container>
    <base-preload :dialog="loading" />
  </v-dialog>
</template>

<script>
import EmptyBox from '@/views/components/EmptyBox'
import { TaskService } from "@/modules/etask/services/taskService";
import constants from "@/modules/etask/constants";

export default {
  name: 'DialogSelectSourceTask',
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
    sourceTask: {
      type: Object,
      default: null
    },
    excludes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listAssociation: [],
      objectSource: {},
      isSelectSoureTask: false,
      isChoiceSource: false,
      keyword: '',
      loading: false,
      typeSource: '',
      typeS: '',
      kw: '',
      listA: '',
      timeoutOnScroll: null,
      objS: '',
      dataList: {},
      lastScrollTop: 0,
      page: 1,
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
  watch: {
    showDialog() {
      // Xet gia tri dang duoc chon ben dialog tao task
      this.typeS = this.typeSource;
      this.kw = this.keyword;
      this.listA = this.listAssociation;
      this.objS = { ...this.objectSource };

      // Neu source task bi xoa o dialog ben ngoai thi dialog chon source cung phai duoc clear
      if (!this.sourceTask) {
        this.typeSource = ''
        this.objectSource = {};
        this.listAssociation = [];
        this.keyword = '';
      }

      if (this.showDialog) {
        this.keyword = '';
        this.getListAssociation(this.typeSource, this.keyword)
      }
    },
    objectSource(newObjectSource, oldObjectSource) {
      if (newObjectSource === undefined) {
        this.setObjSource(oldObjectSource)
      }
    }
  },
  methods: {
    handleScroll(e) {
      this.timeoutOnScroll && clearTimeout(this.timeoutOnScroll);
      this.timeoutOnScroll = setTimeout(() => {
        const heightContent = document.querySelector(
          ".v-input--radio-group__input"
        ).offsetHeight;
        const computedHeightTable = e.target.offsetHeight;
        const heightHeader = 44;
        const scrollTop = heightHeader + heightContent - computedHeightTable;
        if (e.target.scrollTop >= scrollTop) {
          this.page = this.page + 1;
          this.getListAssociation(this.typeSource, this.keyword, true);
        }
      }, 20);
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
      this.objectSource = { ...this.objS };
    },
    selectSourceTask() {
      this.$emit('list-association', this.listAssociation)
      this.$emit('source-task', this.objectSource)
      this.$emit('close-dia-log')
    },
    removeTypeSource() {
      this.typeSource = ''
      this.listAssociation = [];
    },
    clearKeyword() {
      this.keyword = '';
      document.getElementById('top').scrollTop = 0;
      this.getListAssociation(this.typeSource, this.keyword)
    },
    search() {
      document.getElementById('top').scrollTop = 0;
      this.getListAssociation(this.typeSource, this.keyword);
    },
    trimSpace(val) {
      return val ? val.trim() : null
    },
    setListAssociation(type) {
      if (type) {
        switch (type) {
          case constants.ASSOCIATION_TYPE.DOCUMENT:
            this.listAssociation = this.dataList.documents
            break;
          case constants.ASSOCIATION_TYPE.REQUEST:
            this.listAssociation = this.dataList.tickets
            break;
          default :
            this.listAssociation = this.dataList.tasks
        }
      }
    },
    // call api
    async getListAssociation(type, keyword, isLoadMore = false) {
      try {
        this.loading = true
        if (!isLoadMore) this.page = 1;

        const body = {
          keyword: keyword,
          page: this.page,
          pageSize: 10,
          statuses: [],
          excludes: this.excludes,
          modules: []
        }

        const response = await TaskService.getListAssociation(body)
        if (isLoadMore) {
          this.dataList.documents = this.dataList.documents.concat(response.data.documents);
          this.dataList.tickets = this.dataList.tickets.concat(response.data.tickets);
          this.dataList.tasks = this.dataList.tasks.concat(response.data.tasks);
        } else {
          this.dataList = response.data;
        }

        if (this.checkObjNull(this.objectSource)) {
          if (this.sourceTask) {
            this.setObjSource(this.sourceTask);
          }
        }
        this.setListAssociation(type);
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    setObjSource(obj) {
      switch (obj.associationType) {
        case constants.ASSOCIATION_TYPE.DOCUMENT:
          this.filterObjSource('documents', obj);
          break;
        case constants.ASSOCIATION_TYPE.REQUEST:
          this.filterObjSource('tickets', obj)
          break;
        case constants.ASSOCIATION_TYPE.TICKET:
          this.filterObjSource('tickets', obj)
          break;
        default :
          this.filterObjSource('tasks', obj)
      }
    },
    filterObjSource(key, obj) {
      const listFilter = this.dataList[key].filter(item => item.id === obj.id);
      this.objectSource = listFilter.length ? { ...listFilter[0] } : {};
    },
    checkObjNull(obj) {
      return Object.keys(obj).length === 0;
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
</style>
