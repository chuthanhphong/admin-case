import { CalendarService } from '@/modules/calendar/services/calendarService'
export default {
  data() {
    return {
      // auto search room
      showFilterRoom: false,
      selectedRoom: null,
      tempRoom: null,
      keywordTempRoomRoom: null,
      lstMeetingRoom: [],
      roomName: null,
      roomId: null
    }
  },
  watch: {
    //  chon phong hop
    selectedRoom() {
      if (this.selectedRoom == null) {
        return
      }
      var item = this.lstMeetingRoom[this.selectedRoom]
      if (item) {
        this.tempRoom = item
      }
      this.roomId = this.tempRoom.roomId
      this.roomName = this.tempRoom.roomName
      this.closeFilterRoom()
    }
  },
  methods: {
    clearRoom() {
      this.roomName = null
      this.roomId = null
    },
    // search danh sach phong hop
    async searchRoom() {
      if (
        this.roomName &&
        this.roomName.trim() === this.keywordTempRoom
      ) {
        return
      }
      this.keywordTempRoom = this.roomName && this.roomName.trim()

      if (this.trimSpace(this.roomName).length === 0) {
        this.roomId = null
      }
      const params = {
        pageSize: 1000000,
        keyword: this.roomName
      }
      const result = await CalendarService.loadMeetingRoom(params)
      if (result.success) {
        this.lstMeetingRoom = result.data ? result.data : []
        this.showFilterRoom = this.lstMeetingRoom.length > 0
      } else {
        console.log(result.messages)
      }
    },

    selectRoom() {
      this.keywordTempRoom = null
      this.searchRoom()
    },

    // nhap de tim kiem nguoi ky
    onInputSearchRoom() {
      this.roomId = ''
      this.selectedRoom = null
      setTimeout(() => {
        this.searchRoom()
      }, 200)
    },

    // close dialog show phong hop
    closeFilterRoom() {
      setTimeout(() => {
        this.showFilterRoom = false
      }, 200)
    },
  }
}
