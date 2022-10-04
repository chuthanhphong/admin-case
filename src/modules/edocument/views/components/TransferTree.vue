<template>
  <v-fade-transition>
    <div v-if="showDialog" class="wrap-transfer-tree edocument-font">
      <div class="wrap-content-tree">
        <!-- Title Transdfer Tree -->
        <div class="wrap-icon-close px-1">
          <v-btn icon class="icon-close-sign" @click="hideDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="wrap-title-tree px-1">
          <h4>{{ $t('transferTree') }}</h4>
        </div>

        <!-- Field search -->
        <div class="wrap-icon-close px-1">
          <v-col cols="4">
            <v-text-field
              ref="titleTree"
              v-model="keyword"
              :placeholder="$t('plahoderSearchTree')"
              outlined
              dense
              autofocus
              clearable
              hide-details
              class="field-search-tree"
              @change="keyword = trimSpace(keyword)"
              @keyup.enter="searchDocument"
            >
              <vue-feather
                slot="prepend-inner"
                class="grey-1"
                type="search"
                size="20"
              />
            </v-text-field>
            <p v-if="isSearch" class="ma-0 text-result-search">
              {{ $t('have') }}
              <span style="color: #00c3f9">{{ listSearchUser.length }}</span>
              {{ $t('resultSearch') }}
            </p>
          </v-col>
        </div>

        <!-- Tree view -->
        <div class="d-flex flex-row heigh-tree px-5">
          <vue-tree
            ref="treeTransfer"
            style="border: 1px solid gray"
            :dataset="treeData"
            :config="treeConfig"
            link-style="straight"
            class="wrap-tree-view"
          >
            <template v-slot:node="{ node, collapsed }">
              <!-- first node -->
              <div
                v-if="node.firstNode"
                class="tree-node"
                :style="{ border: collapsed ? '2px solid #7FDDF1' : '' }"
              >
                <img
                  :src="node.avatar"
                  style="width: 48px; height: 48px; border-raduis: 4px"
                  class="img-avatar-node-first"
                />

                <!-- Info -->
                <div>
                  <span> “{{ documentTitle }}” </span>
                  <span>-</span>
                  <span style="color: #00c3f9"> {{ countTransferUsers }} </span>
                  <span>{{ $t('userTransfer') }}</span>
                </div>
              </div>

              <!-- other node -->
              <div
                v-else
                class="tree-node"
                :style="{ border: collapsed ? '2px solid #7FDDF1' : '' }"
                :class="
                  (listSearchUser.includes(node.documentActionId) &&
                    'bg-item-search') ||
                    ''
                "
              >
                <v-menu
                  v-model="node.showMenu"
                  bottom
                  offset-y
                  :close-on-content-click="false"
                  :max-width="400"
                  :min-width="200"
                  content-class="magin-top"
                  class="menu-file-transfer"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <!-- Icon user -->
                    <div
                      v-if="node.transferredUser"
                      v-bind="attrs"
                      class="icon-group"
                      style="background-color: #00c3f9"
                      :class="(node.status === 0 && 'opacity-img') || ''"
                      v-on="on"
                    >
                      <span class="edoc-text--body-9 white--text">{{
                        getFirstCharacter(node.transferredUser.userName)
                      }}</span>
                    </div>

                    <!-- Icon don vi -->
                    <div
                      v-else
                      v-bind="attrs"
                      class="icon-group"
                      style="background-color: #4a50e2"
                      :class="(node.status === 0 && 'opacity-img') || ''"
                      v-on="on"
                    >
                      <img
                        src="@/assets/icons/building.svg"
                        width="24"
                        height="24"
                      />
                    </div>
                  </template>

                  <div class="wrap-tooltip-node">
                    <div class="d-flex flex-row pa-2">
                      <div
                        v-if="node.transferredUser"
                        class="avatar-node"
                        style="background-color: #00c3f9"
                      >
                        {{ getFirstCharacter(node.transferredUser.fullName) }}
                      </div>
                      <div
                        v-else
                        class="avatar-node"
                        style="background-color: #4a50e2"
                      >
                        <img
                          src="@/assets/icons/building.svg"
                          width="18"
                          height="18"
                        />
                      </div>

                      <div
                        v-if="node.transferredUser"
                        class="d-flex flex-column px-1"
                      >
                        <p class="ma-0">
                          {{ node.transferredUser.fullName }}
                          ({{ node.transferredUser.userName }})
                        </p>
                        <p class="ma-0 subtitle-node">
                          {{ genEmailAndPhone(node.transferredUser) }}
                        </p>
                        <p class="ma-0 subtitle-node">
                          {{ genPositionName(node.transferredUser) }}
                        </p>
                      </div>

                      <div v-else class="d-flex flex-column pl-1 pr-4">
                        <p class="ma-0">{{ node.toGroupName }}</p>
                      </div>

                      <v-spacer></v-spacer>

                      <v-btn
                        icon
                        color="#8E8EA1"
                        class="icon-close-tooltip"
                        @click="node.showMenu = false"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <v-divider class="color-divider" />

                    <!-- y kien chuyen -->
                    <div class="pa-2 wrap-idea">
                      <p class="ma-0 subtitle-node2">
                        {{ node.transferredDate }}
                      </p>
                      <span v-if="node.transferredNote" class="subtitle-node1">
                        {{ $t('contract.comment') }}:
                      </span>
                      <span
                        v-if="node.transferredNote"
                        class="subtitle-node2"
                        v-html="genComment(node.transferredNote)"
                      />
                    </div>

                    <!-- file dinh kem -->
                    <v-divider
                      v-if="
                        node.filesAttachment && node.filesAttachment.length > 0
                      "
                      class="color-divider"
                    />
                    <div
                      v-if="
                        node.filesAttachment && node.filesAttachment.length == 1
                      "
                      class="pa-2"
                    >
                      <v-list-item
                        class="py-0"
                        @click="clickFileDoc(node.filesAttachment[0])"
                      >
                        <img
                          :src="getIconFile(node.filesAttachment[0].fileName)"
                          height="20"
                          class="mr-2"
                        />
                        <v-tooltip
                          top
                          content-class="tooltip-top"
                          max-width="30%"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <span
                              class="doc-text-file"
                              v-bind="attrs"
                              v-on="on"
                            >
                              1. {{ customFileName(node.filesAttachment[0]) }}
                            </span>
                          </template>
                          <span>{{ node.filesAttachment[0].fileName }}</span>
                        </v-tooltip>
                      </v-list-item>
                    </div>
                    <v-expansion-panels
                      v-if="
                        node.filesAttachment && node.filesAttachment.length > 1
                      "
                    >
                      <v-expansion-panel>
                        <v-expansion-panel-header hide-actions>
                          <template v-slot:default="{ open }">
                            <div
                              class="d-flex justify-space-between align-center"
                            >
                              <v-list-item
                                class="py-0"
                                @click="clickFileDoc(node.filesAttachment[0])"
                              >
                                <img
                                  :src="
                                    getIconFile(
                                      node.filesAttachment[0].fileName
                                    )
                                  "
                                  height="20"
                                  class="mr-2"
                                />
                                <v-tooltip
                                  top
                                  content-class="tooltip-top"
                                  max-width="30%"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <span
                                      class="doc-text-file"
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      1.
                                      {{
                                        customFileName(node.filesAttachment[0])
                                      }}
                                    </span>
                                  </template>
                                  <span>{{
                                    node.filesAttachment[0].fileName
                                  }}</span>
                                </v-tooltip>
                              </v-list-item>

                              <v-icon v-if="open" class="icon">
                                mdi-chevron-up
                              </v-icon>
                              <v-icon v-else class="icon">
                                mdi-chevron-down
                              </v-icon>
                            </div>
                          </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-list-item
                            v-for="(item, i) in node.filesAttachment"
                            v-show="i !== 0"
                            :key="i"
                            class="py-0"
                            @click="clickFileDoc(item)"
                          >
                            <img
                              :src="getIconFile(item.fileName)"
                              height="20"
                              class="mr-2"
                            />
                            <v-tooltip
                              top
                              content-class="tooltip-top"
                              max-width="30%"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <span
                                  class="doc-text-file"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  {{ i + 1 }}.
                                  {{ customFileName(item) }}
                                </span>
                              </template>
                              <span>
                                {{ item.fileName }}
                              </span>
                            </v-tooltip>
                          </v-list-item>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>

                    <!-- thu hoi -->
                    <v-divider class="color-divider" />
                    <div v-if="!node.status" class="pa-2 wrap-idea">
                      <p class="subtitle-node1 text-red ma-0">
                        {{ $t('eviction') }}: {{ node.revokedDate }}
                      </p>
                    </div>
                  </div>
                </v-menu>

                <!-- Info -->
                <div
                  class="info-node"
                  :class="
                    (node.status === 0 && 'text-line-through opacity-img') || ''
                  "
                >
                  <div v-if="node.transferredUser" class="btn d-flex">
                    <v-tooltip top content-class="tooltip-top" max-width="30%">
                      <template v-slot:activator="{ on, attrs }">
                        <div v-bind="attrs" class="maxline1" v-on="on">
                          <span class="title-info-node">
                            {{ node.transferredUser.userName }} </span>
                          <v-icon v-if="node.transferredUser.status === 2" small color="#000" style="vertical-align: unset !important">mdi-lock</v-icon>
                        </div>
                      </template>
                      <span>{{ node.transferredUser.userName }}</span>
                    </v-tooltip>
                  </div>
                  <span v-else class="title-info-node">
                    {{ node.toGroupName }}</span>
                  <span class="subTitle-info-node">
                    {{ node.transferredDate }}</span>
                </div>

                <!-- Icon open node -->
                <v-icon v-if="collapsed" color="#22242C">
                  mdi-plus-circle-outline
                </v-icon>
                <v-icon
                  v-if="!collapsed && node.children && node.children.length > 0"
                  color="#22242C"
                >
                  mdi-minus-circle-outline
                </v-icon>
              </div>
            </template>
          </vue-tree>

          <!-- Zoom tree -->
          <div class="d-flex flex-column justify-center">
            <div class="wrap-zoom-tree">
              <v-btn icon color="#22242C" class="mb-2" @click="onZoomIn()">
                <v-icon>mdi-magnify-plus-outline</v-icon>
              </v-btn>
              <v-btn icon color="#22242C" @click="onZoomOut()">
                <v-icon>mdi-magnify-minus-outline</v-icon>
              </v-btn>
            </div>
          </div>
        </div>

        <!-- Button close -->
        <div class="d-flex flex-row justify-center">
          <v-btn
            class="shadown-btn"
            outlined
            rounded
            color="#0FAFE4"
            @click="hideDialog"
          >{{ $t('close') }}
          </v-btn>
        </div>
      </div>
      <base-preload :dialog="loading" />

      <dialog-view-pdf
        :src-file-pdf="srcFilePdf"
        :show-dialog="showDialogViewPdf"
        @close-dialog="showDialogViewPdf = false"
      />
    </div>
  </v-fade-transition>
</template>

<script>
import VueTree from '@ssthouse/vue-tree-chart'
import customsFile from '@/modules/edocument/mixins/customsFile'
import { normalizeString } from '@/helpers/utils'
import { DocumentService } from '@/modules/edocument/services/documentService'
import DialogViewPdf from '@/views/components/DialogViewPdf.vue'

const initData = {
  name: 'root',
  avatar: require('@/assets/icons/ic_tree_title.svg'),
  firstNode: true,
  children: []
}
export default {
  name: 'TransferTree',
  components: { VueTree, DialogViewPdf },

  mixins: [customsFile],

  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    documentId: {
      type: Number,
      default: 0
    },
    documentTitle: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      keyword: null,
      loading: false,
      isSearch: false,
      treeData: {
        ...initData
      },
      treeConfig: { nodeWidth: 250, nodeHeight: 60, levelHeight: 200 },
      listSearchUser: [],
      listUser: [],
      countTransferUsers: 0
    }
  },

  watch: {
    showDialog() {
      if (this.showDialog) {
        this.loading = true
        setTimeout(() => {
          this.getTransferTree()
          this.restoreZoom()
          this.listSearchUser = []
          this.keyword = null
        }, 200)
      }
    }
  },
  methods: {
    genComment(transferredNote) {
      if (!transferredNote) return ''
      if (transferredNote.includes('\n')) {
        return transferredNote.replaceAll('\n', '<br \>')
      }
      return transferredNote
    },
    genPositionName(user) {
      if (user.positionName) {
        return `${user.positionName} - ${user.groupName}`
      }
      return user.groupName
    },

    genEmailAndPhone(user) {
      if (user.phone) {
        return `${user.email} - ${user.phone}`
      }
      return user.email
    },

    getFirstCharacter(name) {
      if (!name) return ''
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },

    async getTransferTree() {
      try {
        this.loading = true
        const response = await DocumentService.getTransferTree(
          parseInt(this.documentId)
        )

        this.listUser = response.data.documentTransferredTreeResponses
        this.listUser.map(item => {
          item.showMenu = false
        })
        if (response.data.countTransferUsers) {
          this.countTransferUsers = response.data.countTransferUsers
        }

        var rootUsers = []
        this.treeData.children = []
        rootUsers = this.listUser.filter(g => !g.parentId)
        if (rootUsers && rootUsers.length > 0) {
          rootUsers.map(item => {
            this.treeData.children.push(this.buildTree(item))
          })
        }
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },

    // Build cay luan chuyen
    buildTree(user) {
      const childs = this.listUser.filter(
        g => g.parentId === user.documentActionId
      )
      const dataChild = []
      childs.map(g => dataChild.push(this.buildTree(g)))
      if (dataChild.length === 0) {
        return { ...user }
      }

      return { ...user, children: dataChild }
    },

    hideDialog() {
      this.$emit('hideDialog')
    },

    trimSpace(val) {
      const value = val ? val.toString().trim() : ''
      return value
    },

    onZoomIn() {
      this.$refs.treeTransfer.zoomIn()
    },

    onZoomOut() {
      this.$refs.treeTransfer.zoomOut()
    },

    restoreZoom() {
      this.$refs.treeTransfer.restoreScale()
    },

    clickFileDoc(file) {
      this.downloadFile(file)
    },

    searchDocument() {
      this.isSearch = true
      this.listSearchUser = []
      this.keyword = this.keyword.trim()
      if (!this.keyword) {
        return
      }
      this.restoreZoom()
      this.listUser.map(item => {
        let name = item.toGroupName
        let emailAndPhone = ''
        let userName = ''
        if (item.transferredUser) {
          name = item.transferredUser.fullName
          userName = item.transferredUser.userName
          if (item.transferredUser.email) {
            emailAndPhone += item.transferredUser.email
          }
          if (item.transferredUser.phone) {
            emailAndPhone += item.transferredUser.phone
          }
        }
        if (
          normalizeString(name).includes(normalizeString(this.keyword)) ||
          normalizeString(userName).includes(normalizeString(this.keyword)) ||
          normalizeString(emailAndPhone).includes(normalizeString(this.keyword))
        ) {
          this.listSearchUser.push(item.documentActionId)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.wrap-transfer-tree {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background: #00c3f9;
  border-top-left-radius: 20px;
  margin-left: 3px;
  padding: 8px 24px 8px 21px;

  .text-result-search {
    font-size: 14px !important;
  }

  .bg-item-search {
    background-color: #7fddf1 !important;
  }

  .text-line-through {
    text-decoration: line-through;
  }

  .opacity-img {
    opacity: 0.3;
  }

  .heigh-tree {
    height: 100%;
  }

  .shadown-btn {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 150px;
    height: 38px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  }

  .wrap-content-tree {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 20px;
    background-color: white;
  }

  .wrap-icon-close {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .wrap-title-tree {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: -16px;
  }

  .field-search-tree {
    width: 470px;
    margin-top: -16px;
  }

  // css tree
  .wrap-tree-view {
    width: 100%;
    height: 100%;

    // border: 1px solid black;
  }

  .menu-file-transfer:hover {
    .wrap-tree-view {
      display: block;
    }
  }

  .wrap-zoom-tree {
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 8px rgb(0 0 0 / 15%);
    background-color: white;
    border-radius: 30px;
    padding: 8px 0px;
    margin: 0px 8px;
  }

  .tree-node {
    padding-right: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: black;
    background-color: white;
    border-radius: 30px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  }

  .img-avatar-node {
    border-radius: 50%;
    border: 2px solid white;
    background-color: wheat;
    filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));
  }

  .img-avatar-node-first {
    object-fit: none;
  }

  .node-slot:first-child {
    width: 700px !important;
    display: inline-block;
  }

  .info-node {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 7px 10px;
    max-width: 150px;

    .title-info-node {
      font-weight: 600;
      text-transform: capitalize;
      color: #22242c;
    }

    .subTitle-info-node {
      font-weight: 400;
      font-size: 12px;
      color: #22242c;
    }
  }

  .icon-group {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid white;
    filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.magin-top {
  margin-top: 0px !important;
}

.text-line-through {
  text-decoration: line-through;
}

//css tooltip node.
.wrap-tooltip-node {
  .avatar-node {
    width: 38px;
    height: 38px;
    min-width: 38px;
    min-height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 2px solid white;
    color: white;
    font-weight: 700;
    font-size: 14px;
    filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));
  }

  .subtitle-node {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #7a7c80;
  }

  .subtitle-node1 {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: #22242c;
  }

  .subtitle-node2 {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #22242c;
  }

  .text-bold {
    font-weight: 700 !important;
  }

  .text-red {
    color: #ff4a55 !important;
  }

  .wrap-idea {
    max-height: 200px;
    overflow-y: auto;
  }

  .wrap-file-attach {
    max-height: 150px;
    overflow-y: auto;
  }

  .v-list-item {
    padding: 0px !important;
    min-height: 34px !important;
  }

  .wrap-attach-file {
    justify-content: center;
    align-items: center;
    height: 60px;
  }

  .icon-close-tooltip {
    margin-top: -6px;
    margin-right: -4px;
  }

  .color-divider {
    border-color: #e9e9ea !important;
  }

  .doc-text-file {
    color: #22242c !important;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }

  .v-expansion-panel::before {
    box-shadow: none;
  }

  .v-expansion-panel-header {
    min-height: 40px !important;
    padding: 0px 8px !important;
  }

  .v-expansion-panel-content__wrap {
    padding: 0px 8px !important;
  }
}
</style>
