import contants from '@/constants'

export default {
  // set gia trị cho state
  SET_CURRENT_USER(state, currentUserData) {
    state.currentUser = currentUserData
    localStorage.setItem(
      contants.CURRENT_USER,
      JSON.stringify(state.currentUser)
    )
  },
  UPDATE_STATUS_CREATE(state, status) {
    state.createUserSuccess = status
  }
}
