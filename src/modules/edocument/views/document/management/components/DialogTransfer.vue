<template>
  <v-dialog v-if="docItem" v-model="showDialog" persistent max-width="70%">
    <v-card class="edocument-font document-transfer">
      <v-card-title class="d-flex justify-center flex-column">
        <div v-if="showListUser">
          <h3 class="text-center text-capitalize pt-6 px-10">
            {{ $t('managementDoc.transfer.listUserInGroup') }}
          </h3>
          <v-icon
            class="close-dialog"
            @click="closeDialogList"
          >mdi-close</v-icon>
        </div>
        <div v-else>
          <h3 class="text-center text-capitalize pt-6 px-10">
            {{ $t('managementDoc.transfer.transferAction') }}
          </h3>
          <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
        </div>
      </v-card-title>

      <p
        v-if="showListUser"
        class="text-center text-capitalize px-10 edoc-text--body-8"
      >
        {{ genGroupName(itemGroupShow) }}
      </p>
      <p v-else class="text-center text-capitalize px-10 edoc-text--body-8">
        {{ docItem.documentTitle }}
      </p>
      <div v-show="showListUser" class="px-10 content-transfer-list">
        <ListUserRole
          :show-table="showListUser"
          :item-group-show="itemGroupShow"
        />
      </div>

      <div v-show="!showListUser" class="px-10 content-transfer">
        <!-- y kien chuyen -->
        <div>
          <label
            class="edoc-text--body-8 text-capitalize color-label"
          >{{ $t('managementDoc.transfer.comment') }}
          </label>
          <v-textarea
            id="note"
            v-model="note"
            counter="1000"
            maxlength="1000"
            no-resize
            auto-grow
            rows="5"
            outlined
            class="edoc-text--body-2"
            :placeholder="$t('managementDoc.placeholder.comment')"
            @change="trimSpace"
          />
        </div>

        <!-- tai file dinh kem -->
        <div class="form-group col-12 col-sm-5 pl-0 pt-0">
          <div>
            <label class="edoc-text--body-8 text-capitalize color-label">
              {{ $t('contract.attachmentsFile') }}
            </label>
            <div class="d-flex justify-space-between align-center">
              <validation-provider
                ref="providerFileAttachs"
                :rules="ruleFileAttachsDoc"
                name="fileAttachsFile"
              >
                <input
                  id="fileAttachsInput"
                  ref="fileAttachsInput"
                  type="file"
                  multiple
                  hidden
                  accept=".xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.txt,.msg"
                  @change="selectAttachs"
                />
                <ul class="list-files">
                  <li v-for="(file, index) in nameFileAttachs" :key="index">
                    <img :src="getIconFile(`${file.fileName}`)" class="mr-2" />
                    <span>{{ customFileName(file) }}</span>
                    <v-btn
                      :disabled="uploadingFile"
                      class="remove-attach"
                      icon
                      @click="removeFileAttach(index)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </li>
                </ul>
              </validation-provider>
              <v-btn
                outlined
                class="btn-upload ml-auto"
                :loading="uploadingFileAttatch"
                :disabled="uploadingFileAttatch"
                @click="uploadAttachs"
              >
                <v-icon size="30">mdi-upload</v-icon>
              </v-btn>
            </div>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="edoc-text--body-2">
                  {{ $t('contract.format') }}: pdf, doc, docx, xlsx, xls, png,
                  jpg, msg, txt
                </div>
                <div class="text-danger edoc-text--body-2">
                  ({{ $t('contract.fileMax') }} 50MB)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label
            class="edoc-text--body-8 text-capitalize color-label"
          >{{ $t('managementDoc.transfer.listTransfer') }} </label>&nbsp;
          <span
            v-if="docItem.secretDocument"
            class="edoc-text--body-7 text-danger"
          >{{ $t('managementDoc.transfer.secretDocument') }}</span>
          <div class="list-transfer">
            <div class="d-flex flex-column mb-3">
              <div class="transfer-item align-center col-12 py-2 pr-4">
                <div class="row align-center item-transfer">
                  <!-- Ten cong ty -->
                  <div class="col-md-2 form-group">
                    <v-btn class="v-btn--icon v-size--small" icon>
                      <img src="@/assets/imgs/building.png" alt="" />
                    </v-btn>
                    <label class="edoc-text--body-8 ml-2 color-label">
                      {{ $t('managementDoc.transfer.group') }}
                      <span>({{ countGroup }})</span>
                    </label>
                    <v-tooltip right content-class="tooltip-right">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          v-bind="attrs"
                          color="#8E8EA1"
                          dense
                          class="ml-2"
                          v-on="on"
                        >
                          mdi-information-outline
                        </v-icon>
                      </template>
                      <span>{{ $t('managementDoc.transfer.content') }}</span>
                    </v-tooltip>
                  </div>

                  <div class="col-md-4 form-group pa-0">
                    <label class="edoc-text--body-4" />
                    <v-autocomplete
                      v-model.trim="groupValue"
                      dense
                      :placeholder="$t('managementDoc.placeholder.group')"
                      outlined
                      attach
                      :no-data-text="$t('noData')"
                      :filter="filterItems"
                      :menu-props="{
                        top: true,
                        offsetY: true,
                        maxHeight: 200
                      }"
                      :items="lstTransferGroup"
                      item-text="groupName"
                      item-value="groupId"
                      class="edoc-text--body-2"
                      @change="onChangeGroup"
                    >
                      <vue-feather
                        slot="append"
                        class="grey--text"
                        type="search"
                      />
                      <template v-slot:item="data">
                        <div class="select-item flex-column d-flex">
                          <div class="title-item">
                            {{ data.item.groupName }}
                            <span
                              v-if="data.item.receivedDocument"
                              class="text-danger"
                            >({{
                              $t('managementDoc.transfer.received')
                            }})</span>
                          </div>
                          <div class="desc-item">
                            {{ data.item.parentPathName }}
                          </div>
                        </div>
                      </template>
                    </v-autocomplete>
                  </div>
                  <ListTransferGroup
                    :group-lst="groupLst"
                    :show-table="showTableGroup"
                    @on-remove-group="onRemoveGroup"
                    @on-open-list="onOpenList"
                  />
                </div>
              </div>
            </div>
            <div class="d-flex flex-column mb-3">
              <div class="transfer-item align-center col-12 py-2 pr-4">
                <div class="row align-center">
                  <!-- Ten ca nhan -->
                  <div class="col-md-2 form-group">
                    <v-btn class="v-btn--icon v-size--small" icon>
                      <img src="@/assets/imgs/user.png" alt="" />
                    </v-btn>
                    <label class="edoc-text--body-8 ml-2 color-label">
                      {{ $t('managementDoc.transfer.user') }}
                      <span>({{ countUser }})</span>
                    </label>
                  </div>

                  <div class="col-md-4 form-group pa-0">
                    <label class="edoc-text--body-4" />
                    <v-autocomplete
                      v-model.trim="userValue"
                      dense
                      :placeholder="$t('managementDoc.placeholder.user')"
                      outlined
                      attach
                      :no-data-text="$t('noData')"
                      :filter="filterItems"
                      :menu-props="{
                        top: true,
                        offsetY: true,
                        maxHeight: 200
                      }"
                      :items="lstTransferUser"
                      :item-text="item => getFullName(item)"
                      item-value="userId"
                      class="edoc-text--body-2"
                      @change="onChangeUser"
                    >
                      <vue-feather
                        slot="append"
                        class="grey--text"
                        type="search"
                      />
                      <template v-slot:item="data">
                        <div class="select-item flex-column d-flex">
                          <div class="title-item">
                            {{ data.item.fullName }} - {{ data.item.userName }}
                            <span
                              v-if="data.item.receivedDocument"
                              class="text-danger"
                            >({{
                              $t('managementDoc.transfer.received')
                            }})</span>
                          </div>
                          <div class="desc-item">
                            {{ genEmailAndPhone(data.item) }}
                          </div>
                          <div class="desc-item">
                            {{ data.item.positionName }}
                          </div>
                          <div class="desc-item">
                            {{ data.item.groupPathName }}
                          </div>
                        </div>
                      </template>
                    </v-autocomplete>
                  </div>
                  <ListTransferUser
                    :user-lst="userLst"
                    :show-table="showTableUser"
                    @on-remove-user="onRemoveUser"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <v-card-actions class="d-flex justify-center py-6">
        <v-btn
          v-if="!showListUser"
          rounded
          outlined
          color="primary"
          class="w-200 py-6"
          @click="closeDialog"
        >
          {{ $t('cancelLabel') }}
        </v-btn>

        <v-btn
          v-if="showListUser"
          rounded
          outlined
          color="primary"
          class="w-200 py-6"
          @click="closeDialogList()"
        >
          {{ $t('close') }}
        </v-btn>

        <v-btn
          v-if="!showListUser"
          rounded
          color="primary"
          :disabled="!isComplete"
          class="w-200 py-6"
          @click="showConfirm()"
        >
          {{ $t('managementDoc.transfer.transferAction') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <dialog-confirm-save
      title-confirm="managementDoc.titleConfirmSave.transferDocument"
      :show-dialog="showConfirmContract"
      @close-dialog="showConfirmContract = false"
      @accept-action="saveContract"
    />
    <base-material-snackbar
      v-model="isShowAlert"
      :type="typeAlert"
      v-bind="{
        top: true,
        right: true
      }"
    >
      <div v-html="message" />
    </base-material-snackbar>
    <base-preload :dialog="loading" />
  </v-dialog>
</template>

<script>
import mixinManagementDoc from '../mixin/mixinManagementDoc'
import { DocumentService } from '@/modules/edocument/services/documentService'
import ListTransferGroup from '@/modules/edocument/views/document/management/components/ListTransferGroup'
import ListTransferUser from '@/modules/edocument/views/document/management/components/ListTransferUser'
import ListUserRole from '@/modules/edocument/views/document/management/components/ListUserRole'
import { isEmpty } from 'lodash'
import filterItems from '@/mixins/filterItems.js'
import { mapState, mapActions } from 'vuex'
import constants from '@/constants'
import DialogConfirmSave from '@/modules/edocument/views/components/DialogConfirmSave'

export default {
  components: { ListTransferGroup, ListTransferUser, ListUserRole, DialogConfirmSave },
  mixins: [mixinManagementDoc, filterItems],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    docItem: {
      type: Object,
      default: undefined
    },
    labelMessageComment: {
      type: String,
      default: 'managementDoc.validate.commentRequired'
    }
  },
  data() {
    return {
      showConfirmContract: false,
      itemGroupShow: null,
      loading: false,
      showListUser: false,
      note: '',
      //   don vi
      groupValue: null,
      groupLst: [],
      lstTransferGroup: [],
      lstTransferGroupData: [],
      //   ca nhan
      userValue: null,
      userLst: [],
      lstTransferUser: [],
      isComplete: false,
      lstTransferUserData: [],

      lstGroupShowUser: null,
      isDetail: false
    }
  },
  computed: {
    ...mapState('document', ['fileAttachsUploaded']),

    showTableGroup() {
      return this.groupLst.length > 0
    },
    showTableUser() {
      return this.userLst.length > 0
    },
    countGroup() {
      return this.groupLst.length
    },
    countUser() {
      return this.userLst.length
    }
  },
  watch: {
    groupLst() {
      this.isValidate()
    },
    userLst() {
      this.isValidate()
    },
    uploadingFileAttatch() {
      this.isValidate()
    },
    showDialog() {
      if (this.showDialog) {
        this.getTransferGroup()
        this.getTransferUser()
        this.groupLst = []
        this.userLst = []
        this.note = ''
        this.setFileAttachs(null)
        this.nameFileAttachs = []
        this.fileAttachs = []
        this.showListUser = false
        this.lstTransferUserData = []
        this.lstTransferGroupData = []
        this.isDetail = false
      }
    }
  },
  created() {},
  methods: {
    ...mapActions('document', [
      'setFileAttachs'
    ]),
    showConfirm() {
      this.showConfirmContract = true
    },
    genGroupName(item) {
      return item.groupPathName ? item.groupPathName : item.groupName
    },
    onOpenList(group) {
      this.itemGroupShow = group
      this.showListUser = true
    },

    closeDialogList() {
      this.showListUser = false
    },
    getFullName(item) {
      if (item) {
        return `${item.fullName} (${item.userName})`
      }
    },
    genEmailAndPhone(item) {
      let text = `${item.email}`
      if (item.phone) {
        text += ` - ${item.phone}`
      }
      return text
    },
    isValidate() {
      this.isComplete =
        (!isEmpty(this.userLst) || !isEmpty(this.groupLst)) &&
        !this.uploadingFileAttatch
    },
    async getTransferGroup() {
      try {
        if (!this.docItem) {
          return
        }
        const documentId = this.docItem.documentId
        const response = await DocumentService.getTransferGroup(documentId)
        this.lstTransferGroupData = response.data
        if (this.lstTransferGroupData) {
          this.lstTransferGroup = this.lstTransferGroupData
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getTransferUser() {
      try {
        if (!this.docItem) {
          return
        }
        const documentId = this.docItem.documentId
        const response = await DocumentService.getTransferUser(documentId)
        this.lstTransferUserData = response.data
        if (this.lstTransferUserData) {
          this.lstTransferUser = this.lstTransferUserData
        }
      } catch (error) {
        console.log(error)
      }
    },
    onRemoveGroup() {
      if (this.groupLst.length > 0) {
        const lst = []
        const lstGroupId = []
        this.groupLst.filter(group => {
          if (group != null) {
            lstGroupId.push(group.groupId)
          }
        })
        this.lstTransferGroupData.map(group => {
          if (!lstGroupId.includes(group.groupId)) {
            lst.push(group)
          }
        })
        this.lstTransferGroup = lst
      } else {
        this.lstTransferGroup = this.lstTransferGroupData
      }
    },
    onRemoveUser() {
      if (this.userLst.length > 0) {
        const lst = []
        const lstUserId = []
        this.userLst.filter(user => {
          if (user != null) {
            lstUserId.push(user.userId)
          }
        })
        this.lstTransferUserData.map(user => {
          if (!lstUserId.includes(user.userId)) {
            lst.push(user)
          }
        })
        this.lstTransferUser = lst
      } else {
        this.lstTransferUser = this.lstTransferUserData
      }
    },
    onChangeGroup() {
      if (this.groupValue) {
        const group = this.lstTransferGroupData.find(item => {
          return item.groupId === this.groupValue
        })
        if (group) {
          const groupTmp = {
            ...group
          }
          this.groupLst.push(groupTmp)

          var lst = []
          lst = this.lstTransferGroup.filter(item => {
            return item.groupId !== this.groupValue
          })
          this.lstTransferGroup = lst
          this.$nextTick(() => {
            this.groupValue = null
          })
        }
      }
    },
    onChangeUser() {
      if (this.userValue) {
        const user = this.lstTransferUserData.find(item => {
          return item.userId === this.userValue
        })
        if (user) {
          const userTmp = {
            ...user
          }
          this.userLst.push(userTmp)

          var lst = []
          lst = this.lstTransferUser.filter(item => {
            return item.userId !== this.userValue
          })
          this.lstTransferUser = lst
          this.$nextTick(() => {
            this.userValue = null
          })
        }
      }
    },
    buildReceiveObject() {
      const representGroups = []
      if (this.groupLst) {
        this.groupLst.map(group => {
          var groupTmp = {}
          groupTmp.receiveId = group.groupId
          groupTmp.transferType = constants.EDOCUMENT.GROUP_TREE

          representGroups.push(groupTmp)
        })
      }
      if (this.userLst) {
        this.userLst.map(user => {
          var userTmp = {}
          userTmp.receiveId = user.userId
          userTmp.transferType = constants.EDOCUMENT.USER

          representGroups.push(userTmp)
        })
      }
      return representGroups
    },
    async saveContract() {
      const formData = {}
      formData.documentId = this.docItem ? this.docItem.documentId : ''
      formData.note = this.note || null
      formData.fileAttachments = this.fileAttachsUploaded
      formData.receiveObjects = this.buildReceiveObject()
      try {
        this.loading = true
        await DocumentService.saveTransferDoc(formData)
        this.loading = false
        var message = 'managementDoc.messageSuccess.transferDocument'
        const typeAlert = 'success'
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message)
        })
        this.isDetail = true
        this.closeDialog()
      } catch (e) {
        this.loading = false
        const typeAlert = 'error'
        const message = e.message
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message)
        })
      }
    },
    trimSpace() {
      if (this.note) {
        this.note = this.note.trim()
      }
    },
    closeDialog() {
      if (this.uploadingFileAttatch) {
        return
      }
      this.$emit('close-dialog', this.isDetail)
    }
  }
}
</script>

<style lang="scss">
.document-transfer {
  .color-label {
    color: #22242c;
  }

  .v-card__title {
    word-break: normal;
  }

  .content-transfer-list {
    height: 600px;

    .list-transfer {
      background: #f4f8fa;

      .v-data-table > .v-data-table__wrapper {
        max-height: 50vh !important;
        overflow-y: auto;
      }
    }
  }

  .remove-attach {
    i {
      color: #ff4a55 !important;
      cursor: pointer;
    }
  }

  .content-transfer {
    max-height: 65vh;
    overflow-y: auto;

    .item-transfer {
      border-bottom: 0.5px dashed #4e5056;
    }

    .list-transfer {
      background: #f4f8fa;

      .v-data-table > .v-data-table__wrapper {
        padding-top: 5px;
        border-top: 1px solid #c4c4c4;
        height: auto !important;
        min-height: auto;
      }
    }

    .transfer-item {
      .v-input__slot {
        background: #fff !important;

        .v-input--selection-controls__input {
          margin-right: 0px !important;
        }
      }
    }
  }
}
</style>
