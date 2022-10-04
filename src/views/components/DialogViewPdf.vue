<template>
  <div>
    <v-dialog
      v-model="showDialog"
      fullscreen
      content-class="dialog-view-pdf"
      transition="dialog-bottom-transition"
      @keydown.esc="closeDialog"
    >
      <v-btn icon dark color="white" class="btn-close" @click="closeDialog">
        <v-icon size="40">mdi-close</v-icon>
      </v-btn>
      <div class="tool mt-5 d-flex justify-center">
        <div id="workArea" ref="workArea" class="tool__workarea_dialog">
          <bsd-pdf
            v-if="srcFilePdf"
            ref="pdf"
            prefix-render-id="page-content"
            :file-path="srcFilePdf"
            :show-nav="false"
            :force-render="forceRender"
          >
            <template slot="loading">
              <v-progress-circular :size="50" color="primary" indeterminate />
            </template>
          </bsd-pdf>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import bsdPdf from 'bsd-pdf'
export default {
  components: {
    bsdPdf
  },
  props: {
    srcFilePdf: {
      type: String,
      default: null
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      forceRender: false
    }
  },

  watch: {
    showDialog() {
      if (this.showDialog) {
        this.forceRender = true
      }
    }
  },

  methods: {
    closeDialog() {
      this.forceRender = false
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="scss">
.dialog-view-pdf {
  background: #22242cbd;
  .btn-close {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
.tool {
  height: calc(100% - 50px);
}
.tool__workarea_dialog {
  text-align: center;
  height: 100%;
  padding: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  border-radius: 5px;
  margin: 0 10px;

  .pdf-body .page:last-child {
    margin-bottom: 0px;
  }
}
</style>
