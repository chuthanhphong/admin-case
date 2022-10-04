import constants from '../../constants'

export default {
  namespaced: true,
  state: {
    isClearAdvance: false,
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage:
      'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    notify: {
      show: false,
      showIcon: true,
      type: 'success',
      content: ''
    },
    userInfo: null,
    isReloadPage: false,
    avatarData: '',
    refreshChart: 0,
    params_notification: '',
    pageCode_notification: '',
    isLoadNewNotification: false,
    isRingTheBell: false
  },
  mutations: {
    SET_CLEAR_ADVANCE(state, payload) {
      state.isClearAdvance = payload
    },
    SET_BAR_IMAGE(state, payload) {
      state.barImage = payload
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
    SET_RERESH_CHART(state, payload) {
      state.refreshChart = payload
    },
    SET_NOTIFY(state, payload) {
      state.notify = payload
    },
    SET_USER_INFO(state, payload) {
      state.userInfo = payload
    },
    SET_RELOAD_PAGE(state, payload) {
      state.isReloadPage = payload
    },
    SET_AVATAR(state, payload) {
      const avatarLocal = localStorage.getItem(constants.AVATAR)
      if (!avatarLocal) {
        localStorage.setItem(constants.AVATAR, payload)
      }
      state.avatarData = payload
    },
    SET_PARAMS_NOTIFICATION(state, payload) {
      state.params_notification = payload;
    },
    SET_PAGECODE_NOTIFICATION(state, payload) {
      state.pageCode_notification = payload;
    },
    SET_IS_LOAD_NEW_NOTIFICATION(state, payload) {
      state.isLoadNewNotification = payload;
    },
    SET_IS_RING_THE_BELL(state, payload) {
      state.isRingTheBell = payload;
    }
  },
  actions: {
    setClearAdvance({ commit }, value) {
      commit('SET_CLEAR_ADVANCE', value)
    },
    setDrawer({ commit }, value) {
      commit('SET_DRAWER', value)
    },
    setRefreshChart({ commit }, value) {
      commit('SET_RERESH_CHART', value)
    },
    setUserInfo({ commit }, value) {
      commit('SET_USER_INFO', value)
    },
    setReloadPage({ commit }, value) {
      commit('SET_RELOAD_PAGE', value)
    },
    setNotify({ commit }, value) {
      commit('SET_NOTIFY', value)
    },
    setAvatar({ commit }, value) {
      commit('SET_AVATAR', value)
    },
    setParamsNotification({ commit }, value) {
      commit('SET_PARAMS_NOTIFICATION', value)
    },
    setPageCodeNotification({ commit }, value) {
      commit('SET_PAGECODE_NOTIFICATION', value)
    },
    setIsLoadNewNotification({ commit }, value) {
      commit('SET_IS_LOAD_NEW_NOTIFICATION', value)
    },
    setIsRingTheBell({ commit }, value) {
      commit('SET_IS_RING_THE_BELL', value)
    }
  }
}
