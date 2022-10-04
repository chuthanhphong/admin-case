<template>
  <div>
    <v-expansion-panels v-model="expanded" class="rounded-0 no-z-index">
      <v-expansion-panel class="rounded-0">
        <v-expansion-panel-header color="overlay" class="rounded-0">
          <v-layout justify-space-between>
            <v-layout align-center>
              <v-avatar color="white" size="30" class="align-center mr-4">
                <i class="app-icon icon-information darken icon-size-22"></i>
              </v-avatar>
              <h6>{{ $t("booking.labels.booking-car-info") }}</h6>
            </v-layout>
          </v-layout>
        </v-expansion-panel-header>
        <v-expansion-panel-content
          class="scroll-expand-detail-ticket-info overflow-y-auto pt-4"
        >
          <v-layout justify-space-between>
            <v-layout align-center class="group-avatar-signer">
              <v-avatar color="#00C3F9" size="32" class="signer-avatar mr-2">
                <span class="text-uppercase white--text">
                  {{ getFirstCharacter(detail?.requestUserInfo) }}
                </span>
                <div class="signer-tooltip">
                  <div class="d-flex align-start">
                    <v-avatar size="32" color="#00C3F9">
                      <span class="text-uppercase white--text">{{
                        getFirstCharacter(detail?.requestUserInfo)
                      }}</span>
                    </v-avatar>
                    <div class="d-flex flex-column align-start pl-2">
                      <b>{{ detail?.requestUserInfo.fullName }}</b>
                      <span>
                        {{
                          getTextTruncateView(detail?.requestUserInfo.email, 20)
                        }}
                        -
                        {{ detail?.requestUserInfo.phone }}
                      </span>
                      <span>{{ detail?.requestUserInfo.positionName }}</span>
                      <span>{{ detail?.requestUserInfo.groupName }}</span>
                    </div>
                  </div>
                </div>
              </v-avatar>
              <v-layout column>
                <span class="font-weight-bold fs-14">
                  {{ detail?.requestUserInfo.fullName }}
                </span>
                <label class="text--overlined greya7--text">
                  {{ $t("booking.labels.booker") }} ({{
                    formatDateHourView(detail?.createdDate)
                  }})
                </label>
              </v-layout>
            </v-layout>
            <v-layout v-if="detail?.sourceMapVehicleDto" align-center>
              <label class="text--body-5 mr-2">
                {{ $t("booking.labels.parent-work") }}:
              </label>
              <!-- <div v-if="!detail.sourceMapVehicleDto">
                <v-btn
                  v-if="!sourceTask"
                  rounded
                  class="w-140 btn-choose"
                  @click="showDialogSelectSourceTask = true"
                >
                  {{ $t("booking.labels.choose") }}
                </v-btn>
                <v-chip v-else color="#FFEDD2">
                  {{ sourceTask.name }}
                </v-chip>
              </div>
              <v-chip v-else color="#FFEDD2">
                {{ detail.sourceMapVehicleDto.sourceName }}
              </v-chip> -->
              <v-chip color="#FFEDD2">
                {{ detail?.sourceMapVehicleDto.sourceName }}
              </v-chip>
            </v-layout>
          </v-layout>
          <v-layout v-if="detail?.description" align-center class="mt-3">
            <v-divider class="divider-line" vertical />
            <span class="grey1--text ml-2">
              {{ detail?.description }}
            </span>
          </v-layout>
          <v-layout
            class="mt-3"
            v-if="detail?.originBookingInfos?.length"
            column
          >
            <label class="text--body-5 darken--text text-uppercase">
              {{ $t("booking.labels.number-car") }}
            </label>
            <div class="d-flex">
              <div
                v-for="(item, index) in detail?.originBookingInfos"
                :key="index"
              >
                <span
                  v-if="detail?.originBookingInfos?.length === 1"
                  class="grey1--text pa-2"
                >
                  {{ item.amount }} xe {{ item.seatNumber }} chỗ
                </span>
                <span v-else class="grey1--text pa-1">
                  {{ item.amount + " xe" }} {{ item.seatNumber + " chỗ" }}
                  <span v-if="detail?.originBookingInfos?.length - index > 1">
                    ,
                  </span>
                </span>
              </div>
            </div>
          </v-layout>
          <v-layout column class="mt-3" v-if="detail?.fileAttachments?.length">
            <span class="text--body-5 darken--text text-uppercase">
              {{ $t("booking.labels.attach-file") }}
            </span>
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
                  <li
                    v-for="(file, index) in detail.fileAttachments"
                    :key="index"
                  >
                    <img :src="getIconFile(`${file.fileName}`)" class="mr-2" />
                    <span>{{ customFileName(file) }}</span>
                    <span class="btn" @click="downloadFileAttach(index)">
                      <v-icon>mdi-tray-arrow-down</v-icon>
                    </span>
                  </li>
                </ul>
              </validation-provider>
            </div>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <dialog-select-source-task
      :show-dialog="showDialogSelectSourceTask"
      :source-task="sourceTask"
      :title="'task-manager.title.source-task'"
      @source-task="sourceTaskFromEmit"
      @close-dia-log="closeDialogSelectSourceTask"
      @list-association="listAssociationFromEmit"
    />
  </div>
</template>

<script>
import {
  formatDate,
  getTextTruncate,
} from "@/modules/carbooking/helpers/bookingUtils";
import DialogSelectSourceTask from "@/components/dialog/DialogSelectSourceTask";
import { BookingService } from "@/modules/carbooking/services/bookingService";
import { TaskService } from "@/modules/etask/services/taskService";
import fileMixin from "@/modules/econtract/mixins/fileMixin";
import rules from "@/mixins/rules";

export default {
  components: {
    DialogSelectSourceTask,
  },
  mixins: [fileMixin, rules],
  props: {
    detail: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      expanded: 0,
      showDialogSelectSourceTask: false,
      listSourceTask: [],
      sourceTask: null,
      fileAttachs: [],
      nameFileAttachs: [],
      uploadingFileAttatch: false,
    };
  },
  methods: {
    formatDateHourView(date) {
      return formatDate(date, "HH:mm DD/MM/YYYY");
    },
    getFirstCharacter(item) {
      if (this.carInfoColumn) {
        if (!item) return "";
        if (item.fullName) {
          return this.genAvatar(item.fullName);
        }
      } else {
        if (!item) return "";
        if (item.fullName) {
          return this.genAvatar(item.fullName);
        }
      }
    },
    genAvatar(name) {
      if (!name) return "";
      if (name.includes("+")) return name;
      if (name.includes(" ")) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(" ").pop();
        return lastName[0].toUpperCase();
      }
      return name[0].toUpperCase();
    },
    uploadAttachs() {
      document.getElementById("fileAttachsInput").click();
    },
    removeFileAttach(index) {
      var fileBuffer = new DataTransfer();
      document.getElementById("fileAttachsInput").files = fileBuffer.files;
      this.fileAttachs.splice(index, 1);
      this.nameFileAttachs.splice(index, 1);
      // this.formData.fileAttachmentRequests.splice(index, 1);
    },
    async selectAttachs() {
      try {
        this.fileAttachs = [...this.$refs.fileAttachsInput.files];
        const listIndexRemove = [];
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
        if (listIndexRemove.length > 0) {
          listIndexRemove.map((index) => {
            this.removeFileAttach(index);
          });
        }
        const lstFileValidate = this.fileAttachs.filter((file) => file.name);
        const { valid } = await this.$refs.providerFileAttachs.validate(
          lstFileValidate
        );
        if (!valid) {
          if (this.fileAttachs) {
            this.fileAttachs = this.nameFileAttachs;
          } else {
            this.fileAttachs = [];
            this.nameFileAttachs = [];
          }
          this.$refs.fileAttachsInput.type = "text";
          this.$refs.fileAttachsInput.type = "file";
          this.setNotify({
            show: true,
            type: "warning",
            content: this.$refs.providerFileAttachs.errors[0],
            key: false,
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
        var formPayload = new FormData();
        this.fileAttachs.map((file) => {
          if (file.name) {
            formPayload.append("files", file);
          }
        });
        const response = await BookingService.uploadFile(formPayload);
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
            // this.formData.fileAttachmentRequests.push(file);
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
          key: false,
        });
      } finally {
        this.uploadingFileAttatch = false;
      }
    },
    closeDialogSelectSourceTask() {
      this.showDialogSelectSourceTask = false;
    },
    listAssociationFromEmit(val) {
      this.listSourceTask = val;
    },
    sourceTaskFromEmit(value) {
      this.sourceTask = value;
      this.$emit("sourceTask", this.sourceTask);
    },
    async downloadFileAttach(index) {
      const attach = this.detail.fileAttachments[index];
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
    getTextTruncateView(val, size) {
      return getTextTruncate(val, size);
    },
  },
};
</script>
