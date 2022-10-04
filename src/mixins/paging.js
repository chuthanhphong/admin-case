export default {
  data() {
    return {
      page: 0,
      totalPages: 0,
      fromRecord: 0,
      toRecord: 0,
      totalRecords: 0
    }
  },
  methods: {
    renderPaging(dataPaging) {
      if (!dataPaging) {
        this.page = 0
        this.totalPages = 0
        this.fromRecord = 0
        this.toRecord = 0
        this.totalRecords = 0
        return
      }
      this.page = dataPaging.page
      this.pageSize = dataPaging.pageSize
      this.totalRecords = dataPaging.totalElements
      this.fromRecord = +this.pageSize * (this.page - 1) + 1
      this.toRecord = this.fromRecord + dataPaging.data.length - 1
      this.totalPages = dataPaging.totalPages
    }
  }
}
