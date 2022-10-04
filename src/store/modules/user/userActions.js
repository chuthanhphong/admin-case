import { AuthService } from '../../../services/authService'

export default {
  // getCurrent ({ commit }) {
  //   return UsersService.getCurrent()
  //     .then(user => commit('SET_CURRENT_USER', user.data))
  //     .catch(error => commit('toast/NEW', { type: 'error', message: error.message }, { root: true }))
  // }

  //  SET_CURRENT_USER là một mutation
  async loginUser({ commit }, data) {
    try {
      const response = await AuthService.login(data)
      commit('SET_CURRENT_USER', response.data.data)
      return response
    } catch (e) {
      e['error'] = true
      return e
    }
  },
  setCurrentUser({ commit }, user) {
    console.log(user)
    commit('SET_CURRENT_USER', user)
  },
  updateStatusCreate({ commit }, status) {
    commit('UPDATE_STATUS_CREATE', status)
  }
}
