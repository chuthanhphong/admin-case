// import constants from '../../constants'
export default {
  namespaced: true,
  state: {
    representGroup: []
  },
  mutations: {
    SET_GROUP(state, payload) {
      state.representGroup = payload
    }
  },
  actions: {
    setRepresentGroup({ commit }, value) {
      commit('SET_GROUP', value)
    }
  }
}
