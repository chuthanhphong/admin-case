<template>
  <v-fade-transition>
    <v-dialog v-model="internalValue" persistent :max-width="widthDialog">
      <v-card class="px-7 py-5">
        <v-layout justify-end>
          <v-icon class="mt-n1 mr-n3" @click="onClose">mdi-close</v-icon>
        </v-layout>
        <v-layout justify-center align-center>
          <h5 class="text-capitalize">
            {{ $t("tickets.labels.complete-ticket") }}
          </h5>
        </v-layout>
        <v-layout column class="mt-4">
          <label class="text--body-1-7 darken--text">
            {{ $t("tickets.labels.note") }}:
          </label>
          <v-text-field
            v-model="formData.reason"
            outlined
            dense
            class="text--body-5"
            placeholder="Nhập lý do"
            :maxlength="maximumSmallText"
            :counter="maximumSmallText"
          >
          </v-text-field>
        </v-layout>
        <div>
          <span class="text--body-5 darken--text text-uppercase">
            {{ $t("tickets.labels.attach-file") }}
          </span>
          <validation-provider
            ref="providerFileAttachs"
            :rules="ruleFileCompleteTicket"
            name="fileAttachs"
          >
            <input
              ref="fileAttachsInput"
              type="file"
              hidden
              multiple
              :loading="uploadingFileAttatch"
              accept=".xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.jpeg"
              @change="selectAttachs"
            />
          </validation-provider>
          <v-layout justify-space-between>
            <v-layout column justify-end>
              <ul class="list-files text--caption">
                <li v-for="(file, index) in nameFileAttachs" :key="index">
                  <img :src="getIconFile(`${file.fileName}`)" class="mr-2" />
                  <span>{{ customFileName(file) }}</span>
                  <span class="remove-attach" @click="removeFileAttach(index)">
                    <v-icon>mdi-close</v-icon>
                  </span>
                </li>
              </ul>
              <label>
                {{ $t("ticket-types.format-file-valid") }}
              </label>
              <label class="error--text">
                {{ $t("tickets.labels.maximum-file-size") }}
              </label>
            </v-layout>
            <v-btn
              class="btn-upload"
              :loading="uploadingFileAttatch"
              @click="uploadAttachs"
            >
              <v-icon size="30">mdi-upload</v-icon>
            </v-btn>
          </v-layout>
        </div>
        <v-card-actions>
          <v-layout justify-space-around class="mt-4 text--label-3">
            <v-btn
              color="primary"
              rounded
              outlined
              elevation="1"
              class="w-140 py-5 bg-white"
              @click="onCancel"
            >
              <span class="text-primary">{{ $t("cancel") }}</span>
            </v-btn>
            <v-btn color="primary" rounded class="w-140 py-5" @click="onAccept">
              {{ $t("completed") }}
            </v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-fade-transition>
</template>

<script>
const initformData = {
  reason: "",
  fileAttachmentRequests: [],
};
// libs
import rules from "@/mixins/rules";
import mixinUploadFiles from "@/modules/ticket/mixins/mixinUploadFiles";
import constants from "@/constants";

export default {
  name: "DialogConfirmComplete",
  mixins: [rules, mixinUploadFiles],
  props: {
    value: Boolean,
    widthDialog: {
      type: Number,
      default: 488,
    },
  },
  data() {
    return {
      internalValue: this.value,
      maximumSmallText: constants.MAXIMUM_SMALL_TEXT,
      formData: { ...initformData },
    };
  },
  watch: {
    internalValue(val, oldVal) {
      if (val === oldVal) return;

      this.$emit("input", val);
    },
    value(val, oldVal) {
      if (val === oldVal) return;

      this.internalValue = val;
    },
    nameFileAttachs() {
      this.formData.fileAttachmentRequests = this.nameFileAttachs;
    },
  },
  methods: {
    onClose() {
      this.$emit("input", false);
      this.resetData();
    },
    onCancel() {
      this.resetData();
      this.onClose();
    },
    resetData() {
      this.formData.reason = "";
      var fileBuffer = new DataTransfer();
      this.$refs.fileAttachsInput.files = fileBuffer.files;
      this.fileAttachs = [];
      this.nameFileAttachs = [];
    },
    onAccept() {
      const parEmit = { ...this.formData };
      this.$emit("on-accept", parEmit);
      this.onClose();
      this.resetData();
    },
  },
};
</script>
