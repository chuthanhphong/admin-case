<template>
  <div>
    <ul class="list-files">
      <li
        v-for="(file, index) in files"
        :key="index"
        @click="downloadFile(file)"
      >
        <v-tooltip top content-class="tooltip-top" max-width="30%">
          <template v-slot:activator="{ on, attrs }">
            <img :src="getIconFile(`${file.fileName}`)" class="mr-2">
            <span class="doc-text-file edoc-text--button" v-bind="attrs" v-on="on">{{
              customFileName(file)
            }}</span>
          </template>
          <span>{{ file.fileName }}</span>
        </v-tooltip>
      </li>
    </ul>
    <dialog-view-pdf
      :src-file-pdf="srcFilePdf"
      :show-dialog="showDialogViewPdf"
      @close-dialog="showDialogViewPdf = false"
    />
    <base-preload :dialog="loading" />
  </div>
</template>

<script>
import statusDocument from '@/modules/edocument/mixins/statusDocument'
import customsFile from '@/modules/edocument/mixins/customsFile'
import DialogViewPdf from '@/views/components/DialogViewPdf.vue'

export default {
  components: { DialogViewPdf },
  mixins: [statusDocument, customsFile],
  props: {
    files: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      showDialogViewPdf: false,
      srcFilePdf: null,
      loading: false
    }
  }
}
</script>

<style scope lang="scss">
.list-files {
  list-style: none;
  padding: 0 !important;
  li {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .icon-file-pdf {
    color: #fc1405;
    padding-right: 10px;
  }
  .icon-file-doc {
    color: #2684fc;
    padding-right: 10px;
  }
  .icon-file-excel {
    color: #15a5ae;
    padding-right: 10px;
  }
}
</style>
