import { FileService } from '../../modules/econtract/services/fileService'
import constants from '../../constants'

const getDefaultState = () => {
  return {
    fileContractUploaded: null,
    fileAttachsUploaded: null,
    listSigner: null,
    itemsSign: null,
    contractName: '',
    contractType: {},
    signatureId: null,
    imageMainSignData: null,
    imageInitialSignData: null,
    imageDrawSignData: null,
    contractDetail: null,
    resetSignatures: null,
    resetcoordination: false,
    goBack: '/',
    checkGroupSeleted: false,
    allowLoadFileSign: false,
  }
}

// initial state
const state = getDefaultState()

export default {
  namespaced: true,
  state,
  mutations: {
    SET_FILE_CONTRACT(state, payload) {
      state.fileContractUploaded = payload
    },
    SET_CHECK_GROUP_SELETED(state, payload) {
      state.checkGroupSeleted = payload
    },
    SET_FILE_ATTACHS(state, payload) {
      state.fileAttachsUploaded = payload
    },
    SET_CONTRACT_NAME(state, payload) {
      state.contractName = payload
    },
    SET_CONTACT_TYPE(state, payload) {
      state.contractType = payload
    },
    SET_LIST_SIGNER(state, payload) {
      state.listSigner = payload
    },
    SET_ITEMS_SIGN(state, payload) {
      state.itemsSign = payload
    },
    SET_SIGNATURE_ID(state, payload) {
      state.signatureId = payload
    },
    SET_RESET_SIGNATURES(state, payload) {
      state.resetSignatures = payload
    },
    SET_ALLOW_LOAD_FILE_SIGN(state, payload) {
      state.allowLoadFileSign = payload
    },
    SET_IMAGE_SIGN(state, payload) {
      if (payload.type === constants.IMAGE_TYPES.MAIN) {
        state.imageMainSignData = payload.data
      } else if (payload.type === constants.IMAGE_TYPES.INITIAL) {
        state.imageInitialSignData = payload.data
      } else if (payload.type === constants.IMAGE_TYPES.DRAW) {
        state.imageDrawSignData = payload.data
      }
    },
    SET_CONTRACT_DETAIL(state, payload) {
      state.contractDetail = payload
    },
    SET_GO_BACK(state, payload) {
      state.goBack = payload
    },
    SET_RESET_COORDINATION(state, payload) {
      state.resetcoordination = payload
    },
    RESET_DATA_STATE(state) {
      Object.assign(state, getDefaultState())
    }
  },
  actions: {
    async setFileContract({ commit }, value) {
      if (!value) {
        return commit('SET_FILE_CONTRACT', value)
      }
      const url = await FileService.download({
        filePath: value.filePath,
        storage: value.storage,
        fileName: value.fileName
      })
      value.url = url
      commit('SET_FILE_CONTRACT', value)
    },
    setFileAttachs({ commit }, value) {
      commit('SET_FILE_ATTACHS', value)
    },
    setCheckGroupSelected({ commit }, value) {
      commit('SET_CHECK_GROUP_SELETED', value)
    },
    setListSigner({ commit }, value) {
      commit('SET_LIST_SIGNER', value)
    },
    setContractName({ commit }, value) {
      commit('SET_CONTRACT_NAME', value)
    },
    setContractType({ commit }, value) {
      commit('SET_CONTACT_TYPE', value)
    },
    setItemsSign({ commit }, value) {
      commit('SET_ITEMS_SIGN', value)
    },
    setAllowLoadFileSign({ commit }, value) {
      commit('SET_ALLOW_LOAD_FILE_SIGN', value)
    },
    setSignatureId({ commit }, value) {
      commit('SET_SIGNATURE_ID', value)
    },
    setImageSign({ commit }, value) {
      commit('SET_IMAGE_SIGN', value)
    },
    setResetSignatures({ commit }, value) {
      commit('SET_RESET_SIGNATURES', value)
    },
    setContractDetail({ commit }, value) {
      commit('SET_CONTRACT_DETAIL', value)
    },
    setGoBack({ commit }, value) {
      commit('SET_GO_BACK', value)
    },
    resetDataState({ commit }) {
      commit('RESET_DATA_STATE')
    },
    setCoordination({ commit }, value) {
      commit('SET_RESET_COORDINATION', value)
    }
  }
}
