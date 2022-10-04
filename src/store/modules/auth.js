import contants from '@/constants'

export default {
  namespaced: true,
  state: {
    accessTokenExpDate: ''
  },

  mutations: {
    SET_ATOKEN_EXP_DATE(state, expDate) {
      state.accessTokenExpDate = expDate
      // Ghi vao local storage
      localStorage.setItem(contants.CURRENT_USER, expDate)
    }
  }
}
