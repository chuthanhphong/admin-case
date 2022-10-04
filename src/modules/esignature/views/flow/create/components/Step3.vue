<template>
  <div class="custom-file-pdf">
    <div class="main__tool">
      <div class="tool__header">
        <!-- Select file pdf -->
        <div class="esignature-file-name">
          <div v-if="checkListFile" multiple class="tooltip-select-file">
            <v-select
              v-model="fileDocument"
              background-color="white"
              :items="listFileDocument"
              :item-text="(item) => item.fileName"
              item-value="fileName"
              return-object
              outlined
              :menu-props="{ bottom: true, offsetY: true, maxWidth: 200 }"
              dense
              @change="onchangeFilePdf(`${fileDocument.fileName}`)"
            />
          </div>

          <TooltipFileDocument
            v-if="listFileDocument && listFileDocument.length === 1"
            :file-name="fileDocument.fileName"
          />
        </div>
      </div>

      <div class="tool">
        <!-- File PDF preview -->
        <div class="tool__preview">
          <bsd-pdf
            v-if="src"
            id="pdf-preview"
            ref="pdfPreview"
            prefix-render-id="page-preview"
            :file-path="src"
            :force-render="forceRender"
            :show-nav="false"
            scale="0.11"
            @on-success="loadPreviewSuccess"
            @on-pagerender="loadSignFilePreview"
          />
        </div>

        <!-- File PDF view -->
        <div id="workArea" ref="workArea" class="tool__workarea">
          <bsd-pdf
            v-if="src"
            ref="pdf"
            prefix-render-id="page-content"
            :file-path="src"
            :show-nav="false"
            :force-render="forceRender"
            @on-scroll="onScollFile"
            @on-success="loadPdfSuccess"
            @on-pagerender="loadSignaturePage"
          >
            <!-- <template slot="loading">
              <v-progress-circular :size="50" color="primary" indeterminate />
            </template> -->
          </bsd-pdf>
        </div>

        <!-- Chon chan ky -->
        <div class="tool__sidebar">
          <v-tooltip left content-class="tooltip-left">
            <template v-slot:activator="{ on, attrs }">
              <div
                class="sign-item"
                v-bind="attrs"
                @click="toggleDialog"
                v-on="on"
              >
                <div class="count-sign">{{ getNumSignByFile }}</div>
                <div class="text-sign">
                  <i class="icon-pentool" />
                  <span class="text-capitalize">
                    {{ $t('electronicSign.footSign') }}
                  </span>
                  <div class="divSignName" />

                  <div class="note-sign">
                    <span>{{ $t('electronicSign.idSignature') }} </span>
                  </div>
                </div>
              </div>
            </template>
            <span>{{ $t('document.tooltip.addSignature') }}</span>
          </v-tooltip>

          <v-btn
            v-if="getNumSignByFile > 0"
            class="my-2 py-5 mt-8"
            rounded
            block
            color="primary"
            @click="clearAllSignature"
          >
            {{ $t('document.label.removeAllItemSign') }}
          </v-btn>
        </div>
      </div>

      <!-- Dialog chon nguoi ky -->
      <DialogSelectSigner
        :list-person-sign="listPersonSign"
        :message-required="messageRequired"
        :show-dialog="dialogSelectSigner"
        @accept-personal-sign="acceptPersonalSign"
        @update-list-index-personal-sign="updateListIndexPersonalSign"
        @close-dialog="dialogSelectSigner = false"
      />

      <!-- Dialog sao chep chan ky-->
      <DialogConfigSignature
        :show-dialog="dialogEditSignature"
        :signer-edit="signerEdit"
        :list-select-page-sign="listSelectPageSign"
        :max-page="numPages"
        @close-dialog="dialogEditSignature = false"
        @add-select-page-sign="addSelectPageSign"
        @accept-edit-signature="acceptEditSignature"
        @update-option-copy-signature="updateOptionCopySignature"
      />
    </div>

    <!-- Button bottom -->
    <div class="d-flex justify-end align-center mr-4">
      <v-btn
        class="my-2 w-150 py-4 mr-10"
        color="#0FAFE4"
        outlined
        rounded
        @click="showDialogCancel"
      >
        <span class="text-primary"> {{ $t('cancelLabel') }}</span>
      </v-btn>

      <v-btn
        class="my-2 w-150 py-4 mr-10"
        color="#0FAFE4"
        outlined
        rounded
        @click="prevStep"
      >
        <span class="text-primary"> {{ $t('electronicSign.back') }}</span>
      </v-btn>

      <v-btn class="my-2 w-150 py-4" rounded color="primary" @click="nextStep">
        {{ $t('electronicSign.continue') }}
      </v-btn>
    </div>

    <base-preload :dialog="loading" />
  </div>
</template>

<script>
import Vue from 'vue'
import i18n from '@/i18n'
import bsdPdf from 'bsd-pdf'
import TypeSignature from './TypeSignature'
import IconSign from './IconSign'
import TextPagePdf from './TextPagePdf'
import { randomId } from '@/core/utils'
import { mapState, mapActions } from 'vuex'
import DialogSelectSigner from './DialogSelectSigner.vue'
import constants from '@/constants'
import DialogConfigSignature from './DialogConfigSignature.vue'
import _ from 'lodash'
import TooltipFileDocument from '@/modules/esignature/views/components/TooltipFileDocument'

export default {
  name: 'Step3',
  components: {
    bsdPdf,
    DialogSelectSigner,
    DialogConfigSignature,
    TooltipFileDocument
  },
  props: {
    listFileDocument: {
      type: Array,
      default: null
    } // File van ban.
  },
  data() {
    return {
      fileDocument: {
        fileName: ''
      },
      src: null,
      numPages: undefined,
      currentPage: 1,
      pagesItemSign: [],
      itemsSign: [], // Danh sach chan ky dc add
      indexsPersonSign: null, // Index nguoi dc chon ky
      signerEdit: null, // Nguoi dc edit chu ky
      listSelectPageSign: [{ start: 1, end: 1 }],
      optionsCopy: constants.OPTIONS_COPY_SIGNATURE,
      optionCopySignature: constants.OPTIONS_COPY_SIGNATURE.ALL_PAGE,
      countSignature: 0,
      loading: false,
      pageActive: 1,
      pagePreviewTooltips: [],
      forceRender: false,
      // Dialog
      dialogSelectSigner: false,
      messageRequired: '', // Mess error dialogSelectSigner.
      dialogEditSignature: false, // Dialog dat lai chu ky
      loadFileSignPreview: false // Check load file pdf preview success.
    }
  },
  computed: {
    ...mapState('esignature', [
      'listSigner',
      'contractDetail',
      'resetSignatures',
      'loadFileSign'
    ]),

    checkListFile() {
      return this.listFileDocument && this.listFileDocument.length > 1
    },
    // Loc danh sach nguoi ky
    listPersonSign() {
      const list = []
      if (!this.listSigner) return []
      this.listSigner.map((group) => {
        group.signers.map((signer) => {
          if (signer.signUserType !== constants.SIGN_USER_TYPE.REVIEWER) {
            list.push({ ...signer })
          }
        })
      })
      return list
    },

    // Lay so luong chan ky theo file ky.
    getNumSignByFile() {
      return this.itemsSign.filter(
        (item) => item.fileName === this.fileDocument.fileName
      ).length
    }
  },
  watch: {
    // Call when list file sign change
    listFileDocument() {
      this.src = null
      if (
        this.listFileDocument &&
        this.listFileDocument.length > 0 &&
        this.listFileDocument[0].url
      ) {
        this.fileDocument = this.listFileDocument[0]
        this.clearAllSignatureAllFile()
        if (this.loadFileSign) {
          this.src = this.fileDocument.url
          setTimeout(() => {
            this.loading = false
          }, 500)
          this.setLoadFileSign(false)
        }
      }
    },

    // Hien thi thong bao co item ky cho page review
    itemsSign() {
      this.reloadIconSignPreview()
    },

    // Reset all chan ky khi back step va sua nguoi ky.
    resetSignatures() {
      if (this.resetSignatures) {
        this.clearAllSignatureAllFile()
        this.setResetSignatures(false)
      }
    },

    // Load file ky khi next qua step3
    loadFileSign() {
      if (this.loadFileSign && this.src === null) {
        this.loading = true
      }
      if (
        this.loadFileSign &&
        this.listFileDocument &&
        this.listFileDocument.length > 0 &&
        this.listFileDocument[0].url
      ) {
        this.src = this.fileDocument.url
        setTimeout(() => {
          this.loading = false
        }, 500)
        this.setLoadFileSign(false)
      }
      // this.loadFileSignPreview = false
    },

    pagesItemSign() {
      this.reloadPagesItemSign()
    }
  },
  methods: {
    ...mapActions('esignature', [
      'setItemsSign',
      'setLoadFileSign',
      'setResetSignatures'
    ]),

    // Add lai pageNum & iconSign khi scroll file
    loadSignFilePreview(pageLoaded) {
      if (this.pagePreviewTooltips && this.loadFileSignPreview) {
        var element = document.getElementById(`page-preview${pageLoaded}`)
        this.addTextPage(element, pageLoaded)
        this.repalceIconSign(element, pageLoaded)

        setTimeout(() => {
          this.reloadPagesItemSign()
        }, 100)
      }
    },

    // Check load file PDF Preview success.
    loadPreviewSuccess(val) {
      this.numPages = val
      const self = this
      this.pagePreviewTooltips = []
      this.loadFileSignPreview = false
      this.pageActive = 1
      this.currentPage = 1

      // Add event click to file PDF Preview.
      var onClickPdfPreviewPage = function() {
        var attribute = this.getAttribute('data-page-number')
        if (attribute) self.$refs.pdf.goToPage(+attribute)
        if (self.pageActive) {
          var elements = document.getElementById(
            `page-preview${self.pageActive}`
          )
          elements.classList.remove('activePagePreview')
        }
        this.classList.add('activePagePreview')
        self.pageActive = +attribute
      }

      setTimeout(() => {
        // Scroll file pdf Preview to top.
        const listPdf = document.getElementsByClassName('pdf-container')
        if (listPdf && listPdf.length > 0) listPdf[0].scrollTop = 0
      }, 200)

      setTimeout(() => {
        for (var i = 1; i <= val; i++) {
          var element = document.getElementById(`page-preview${i}`)
          if (element) {
            if (i === 1) {
              element.classList.add('activePagePreview')
            }
            this.addTextPage(element, i)
            this.addIconSign(element, 0)
            this.loadFileSignPreview = true
            element.addEventListener('click', onClickPdfPreviewPage)
          }
        }
        this.reloadIconSignPreview()
      }, 500)
    },

    // Check load file PDF main success.
    loadPdfSuccess(val) {
      setTimeout(() => {
        this.reloadSign()
      }, 500)
    },

    // Change file PDF view.
    async onchangeFilePdf(url) {
      this.forceRender = false
      this.loadFileSignPreview = false
      this.src = null

      setTimeout(() => {
        this.forceRender = true
        this.src = this.fileDocument.url
      }, 100)
    },

    // Reload chan ky khi change file PDF.
    reloadSign() {
      this.itemsSign.map((item) => {
        if (item.signer.fileName === this.fileDocument.fileName) {
          var pageSign = this.$refs.workArea.querySelector(
            `#page-content${item.signer.page}`
          )
          var dataLoaded = pageSign.getAttribute('data-loaded')
          if (dataLoaded) {
            item.$mount()
            pageSign.appendChild(item.$el)
          }
        }
      })
    },

    // Reload icon ky khi change file PDF.
    reloadIconSignPreview() {
      var pageItems = []
      this.itemsSign.map((item) => {
        if (item.fileName === this.fileDocument.fileName) {
          pageItems.push(item.signer.page)
        }
      })
      const group = _.groupBy(pageItems)
      this.pagesItemSign = group
      this.reloadPagesItemSign()
    },

    // Reload tooltip icon sign.
    reloadPagesItemSign() {
      this.pagePreviewTooltips.map((tooltip, page) => {
        var itemSign = this.pagesItemSign[page + 1]
        tooltip.numSign = itemSign ? itemSign.length : 0
      })
    },

    // Load chan ky khi page pdf load success.
    loadSignaturePage(pageLoaded) {
      var instances = this.itemsSign.filter(
        (item) =>
          item.signer.page === pageLoaded &&
          item.fileName === this.fileDocument.fileName
      )

      if (instances) {
        var pageSign = this.$refs.workArea.querySelector(
          `#page-content${pageLoaded}`
        )

        for (var i = 0; i < instances.length; i++) {
          instances[i].$mount()
          pageSign.appendChild(instances[i].$el)
        }
      }
    },

    // Scroll file pdf
    onScollFile(currentPage) {
      this.currentPage = currentPage
      if (this.pageActive && this.pageActive !== currentPage) {
        this.$refs.pdfPreview.goToPage(this.currentPage)
        // Remove old pageActive
        var oldPage = document.getElementById(`page-preview${this.pageActive}`)
        oldPage.classList.remove('activePagePreview')
        this.pageActive = +currentPage

        // Add new pageActive
        var newPage = document.getElementById(`page-preview${this.pageActive}`)
        newPage.classList.add('activePagePreview')
      }
    },

    showDialogCancel() {
      this.$emit('show-cancel')
    },

    // Dialog chon nguoi ky.
    toggleDialog() {
      this.messageRequired = ''
      this.dialogSelectSigner = true
    },

    prevStep() {
      this.$emit('next-step', 2)
    },

    nextStep() {
      this.setItemsSign(this.itemsSign)
      this.$emit('next-step', 4)
    },

    // Reset all chan ky tren 1 file pdf.
    clearAllSignature() {
      if (this.itemsSign.length > 0) {
        this.itemsSign.map((item) => {
          if (item.fileName === this.fileDocument.fileName && item.$el) {
            item.$el.remove()
          }
        })
        this.itemsSign = this.itemsSign.filter(
          (item) => item.fileName !== this.fileDocument.fileName
        )
      }
    },

    // Reset all chan ky all file.
    clearAllSignatureAllFile() {
      if (this.itemsSign.length > 0) {
        this.itemsSign.map((item) => {
          if (item.$el) item.$el.remove()
        })
      }
      this.itemsSign = []
    },

    acceptPersonalSign(list) {
      this.indexsPersonSign = list
      if (this.indexsPersonSign.length === 0) {
        this.messageRequired = this.$t('document.mustSelectSigner')
        return
      }
      const signers = []

      // Lay danh sach nguoi ky duoc chon.
      this.indexsPersonSign.map((index) => {
        signers.push({
          ...this.listPersonSign[index],
          signType: constants.SIGN_TYPES.IMAGE,
          fileName: this.fileDocument.fileName,
          fileOrder: this.fileDocument.fileOrder
        })
      })

      // Them chan ky vao file pdf.
      signers.map((signer) => {
        this.addItemSign2(
          'img-sign',
          signer,
          this.currentPage,
          null,
          null,
          true
        )
      })

      this.dialogSelectSigner = false // Tat popup chon nguoi ky
      this.indexsPersonSign = null // Reset danh sach chon nguoi ky
    },

    updateListIndexPersonalSign() {
      this.messageRequired = ''
    },

    addTextPage(pageSign, page) {
      var TextPagePdfEl = Vue.extend(TextPagePdf)
      var instance = new TextPagePdfEl({
        i18n,
        propsData: {
          textPage: '' + page
        }
      })
      instance.$mount()
      pageSign.appendChild(instance.$el)
    },

    repalceIconSign(pageSign, pageNum) {
      var instance = this.pagePreviewTooltips[pageNum - 1]
      instance.$mount()
      pageSign.appendChild(instance.$el)
    },

    addIconSign(pageSign, numSign) {
      var IconSignEl = Vue.extend(IconSign)
      var instance = new IconSignEl({
        i18n,
        propsData: {
          numSign: numSign
        }
      })
      instance.$mount()
      this.pagePreviewTooltips.push(instance)
      pageSign.appendChild(instance.$el)
    },

    // Them chan ky vao file pdf.
    addItemSign2(type, signer, pageContain, x, y, scrollToSignature) {
      var TyppeSignatureEl = Vue.extend(TypeSignature)
      var pageSign = this.$refs.workArea.querySelector(
        `#page-content${pageContain}`
      )
      var dataLoaded = pageSign.getAttribute('data-loaded')
      if (this.countSignature >= 16) this.countSignature = 0

      const marginItemSign = 20 * this.countSignature
      x = x || pageSign.clientWidth / 2 + marginItemSign - 80
      y = y || -215
      this.countSignature++
      if (x >= 640) x = 640
      if (y >= -78) y = -78

      signer.x = x
      signer.y = y
      signer.page = pageContain
      const id = randomId()
      var instance = new TyppeSignatureEl({
        i18n,
        propsData: {
          type: type,
          id: id,
          w: 100,
          h: 60,
          itemIndex: this.itemsSign.length,
          signer: signer,
          fileName: this.fileDocument.fileName,
          fileOrder: this.fileDocument.fileOrder,
          wfile: pageSign.clientWidth,
          hfile: pageSign.clientHeight
        },
        methods: {
          removeItemSign: this.removeItemSign,
          editSignature: this.editSignature
        }
      })
      this.itemsSign.push(instance)
      if (dataLoaded) {
        instance.$mount()
        pageSign.appendChild(instance.$el)
      }

      if (scrollToSignature) {
        instance.$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    },

    // Xoa chan chu ky
    removeItemSign(id) {
      try {
        const index = this.itemsSign.findIndex((i) => i.id === id)
        this.itemsSign[index].$el.remove()
        this.itemsSign.splice(index, 1)
      } catch (error) {
        console.log(error)
      }
    },

    // Hien thi popup dat lai chu ky
    editSignature(id) {
      const indexSigner = this.itemsSign.findIndex((item) => item.id === id)
      const signer = this.itemsSign[indexSigner].signer
      this.signerEdit = { ...signer }
      this.dialogEditSignature = true
    },

    // Them moi item chu ky cho cac trang
    addSelectPageSign() {
      this.listSelectPageSign.push({ start: 1, end: 1 })
    },

    // Xac nhan dat lai chu ky
    acceptEditSignature() {
      this.dialogEditSignature = false
      this.signerEdit.clone = true

      // Copy chu ky cho tat ca cac trang
      if (this.optionCopySignature === this.optionsCopy.ALL_PAGE) {
        for (let page = 1; page <= this.numPages; page++) {
          if (page !== this.signerEdit.page) {
            const newSigner = { ...this.signerEdit }
            this.addItemSign2(
              'img-sign',
              newSigner,
              page,
              newSigner.x,
              newSigner.y,
              false
            )
          }
        }
      } else {
        var listRange = []
        this.listSelectPageSign.map((range) => {
          for (let i = range.start; i <= range.end; i++) {
            listRange.push(i)
          }
        })

        listRange = listRange.sort((a, b) => a - b)
        const uniqueRange = new Set()
        listRange.map((r) => uniqueRange.add(r))
        listRange = Array.from(uniqueRange)
        for (const page of listRange) {
          if (page !== this.signerEdit.page) {
            const newSigner = { ...this.signerEdit }
            this.addItemSign2(
              'img-sign',
              newSigner,
              page,
              newSigner.x,
              newSigner.y,
              false
            )
          }
        }
      }
      // Reset lai list page
      this.listSelectPageSign = [{ start: 1, end: 1 }]
      this.optionsCopy = constants.OPTIONS_COPY_SIGNATURE
    },

    updateOptionCopySignature(option) {
      this.optionCopySignature = option
    }
  }
}
</script>

<style lang="scss"></style>
