import constants from "@/constants";
import { formatFileSize } from '@/helpers/utils'
import { FileService } from "@/modules/ticket/services/fileService";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      // file attach
      uploadingFileAttatch: false,
      fileAttachs: [],
      nameFileAttachs: [],

      iconPdf: require('@/assets/icons/pdf.svg'),
      iconDoc: require('@/assets/icons/doc.svg'),
      iconXls: require('@/assets/icons/xls.svg'),
      iconPng: require('@/assets/icons/png.svg'),
      iconTxt: require('@/assets/icons/txt.svg'),
      iconMsg: require('@/assets/icons/msg.svg'),
      iconZip: require('@/assets/icons/zip.svg'),
      iconRar: require('@/assets/icons/rar.svg'),
      iconJpg: require('@/assets/icons/jpg.svg')
    }
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    // click btn upload
    uploadAttachs() {
      this.$refs.fileAttachsInput.click();
    },
    // Chon file dinh kem
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
          this.$refs.fileAttachsInput.type = "file";
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
        const response = await FileService.uploadMultiple(formData);
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
    // Xoa tai lieu dinh kem
    removeFileAttach(index) {
      var fileBuffer = new DataTransfer()
      this.$refs.fileAttachsInput.files = fileBuffer.files
      this.fileAttachs.splice(index, 1);
      this.nameFileAttachs.splice(index, 1)
    },
    getIconFile(fileName) {
      if (fileName) {
        const extFile = fileName
          .split('.')
          .pop()
          .toLowerCase()
        var icon = ''
        switch (extFile) {
          case 'pdf':
            icon = this.iconPdf
            break
          case 'doc':
          case 'docx':
            icon = this.iconDoc
            break

          case 'csv':
          case 'xls':
          case 'xlsx':
            icon = this.iconXls
            break
          case 'jpg':
            icon = this.iconJpg
            break
          case 'png':
            icon = this.iconPng
            break
          case 'txt':
            icon = this.iconTxt
            break
          case 'msg':
            icon = this.iconMsg
            break
          case 'zip':
            icon = this.iconZip
            break
          case 'rar':
            icon = this.iconRar
            break
          default:
            icon = this.iconPdf
            break
        }
        return icon
      }
    },
    // Hien thi ten file
    customFileName(file) {
      const fileName = file.name || file.fileName
      const fileSizeInput = file.size || file.fileSize
      const size = fileSizeInput / 1000
      const fileSize = formatFileSize({ size })

      var names = fileName.split('.')
      const extFile = names[names.length - 1]
      var name = names.splice(0, names.length - 1).join('')
      if (name.length > 25) {
        name = `${name.slice(0, 12)}...${name.slice(
          15,
          25
        )}.${extFile} (${fileSize})`
      } else {
        name += `.${extFile} (${fileSize})`
      }
      return name
    },
    customFileNameByName(fileName) {
      var names = fileName.split('.')
      const extFile = names[names.length - 1]
      var name = names.splice(0, names.length - 1).join('')
      if (name.length > 25) {
        name = `${name.slice(0, 12)}...${name.slice(
          15,
          25
        )}.${extFile}`
      } else {
        name += `.${extFile}`
      }
      return name
    },
    async downloadFileAttach(file) {
      this.loading = true
      try {
        await FileService.downloadFile({
          fileName: file.fileName,
          storage: file.storage,
          filePath: file.filePath
        })
      } catch (error) {
        this.srcFilePdf = ''
      } finally {
        this.loading = false
      }
    },
    async viewFilePdf(file) {
      try {
        const urlFile = await FileService.viewFile({
          fileName: file.fileName,
          storage: file.storage,
          filePath: file.filePath
        })
        console.log(urlFile)
        this.srcFilePdf = urlFile
      } catch (error) {
        this.srcFilePdf = null
      } finally {
        this.showDialogViewPdf = true
      }
    },
  }
}
