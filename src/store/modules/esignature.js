import constants from '@/constants'
import { FileService } from '@/modules/esignature/services/fileService'

const getDefaultState = () => {
  return {
    parentId: null,
    fileDocumentUploaded: [],
    fileAttachsUploaded: null,
    listSigner: null,
    countSigner: null,
    itemsSign: null,
    documentName: '',
    documentType: {},
    priorityId: {},
    promulgateGroupId: null,
    countDocument: null,
    signatureId: null,
    imageMainSignData: null,
    imageInitialSignData: null,
    imageCASignData: null,
    imageDrawSignData: null,
    documentDetail: null,
    resetSignatures: null,
    loadFileSign: null,
    clearDrawImg: false,
    clickClearDraw: false,
    showFullName: false,
    loadingBtnSelect: false,
    goBack: '/'
  }
}

// initial state
const state = getDefaultState()

export default {
  namespaced: true,
  state,
  mutations: {
    SET_PARENT_ID(state, payload) {
      state.parentId = payload
    },
    SET_FILE_DOCUMENT(state, payload) {
      state.fileDocumentUploaded = payload
    },
    SET_FILE_ATTACHS(state, payload) {
      state.fileAttachsUploaded = payload
    },
    SET_COUNT_SIGNER(state, payload) {
      state.countSigner = payload
    },
    SET_DOCUMENT_NAME(state, payload) {
      state.documentName = payload
    },
    SET_PRIORITY_ID(state, payload) {
      state.priorityId = payload
    },
    SET_PROMULGATE_GROUP_ID(state, payload) {
      state.promulgateGroupId = payload
    },
    SET_COUNT_DOCUMENT(state, payload) {
      state.countDocument = payload
    },
    SET_DOCUMENT_TYPE(state, payload) {
      state.documentType = payload
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
    SET_LOAD_FILE_SIGN(state, payload) {
      state.loadFileSign = payload
    },
    SET_IMAGE_SIGN(state, payload) {
      if (payload.type === constants.IMAGE_TYPES.MAIN) {
        state.imageMainSignData = payload.data
      }
      if (payload.type === constants.IMAGE_TYPES.DRAW) {
        state.imageDrawSignData = payload.data
      }
      if (payload.type === constants.IMAGE_TYPES.CA) {
        state.imageCASignData = payload.data
      }
    },
    SET_DOCUMENT_DETAIL(state, payload) {
      state.documentDetail = payload
    },
    SET_GO_BACK(state, payload) {
      state.goBack = payload
    },
    RESET_DATA_STATE(state) {
      Object.assign(state, getDefaultState())
    },
    SET_CLEAR_DRAW_IMAGE(state, payload) {
      state.clearDrawImg = payload
    },
    SET_CLICK_CLEAR_DRAW(state, payload) {
      state.clickClearDraw = payload
    },
    SET_SHOW_FULL_NAME(state, payload) {
      state.showFullName = payload
    },
    SET_LOADING_BTN_SELECT(state, payload) {
      state.loadingBtnSelect = payload
    }
  },
  actions: {
    setParentId({ commit }, value) {
      commit('SET_PARENT_ID', value)
    },
    async setFileDocument({ commit }, files) {
      if (!files || files.length === 0) {
        return commit('SET_FILE_DOCUMENT', null)
      }
      for (const [index, file] of files.entries()) {
        file.fileOrder = index
        if (!file.url) {
          file.url = await FileService.download({
            filePath: file.filePath,
            storage: file.storage,
            fileName: file.fileName
          })
        }
      }
      commit('SET_FILE_DOCUMENT', files)
    },
    setFileAttachs({ commit }, value) {
      commit('SET_FILE_ATTACHS', value)
    },
    setCountSigner({ commit }, value) {
      commit('SET_COUNT_SIGNER', value)
    },
    setCountDocument({ commit }, value) {
      commit('SET_COUNT_DOCUMENT', value)
    },
    setListSigner({ commit }, value) {
      commit('SET_LIST_SIGNER', value)
    },
    setDocumentName({ commit }, value) {
      commit('SET_DOCUMENT_NAME', value)
    },
    setPriorityId({ commit }, value) {
      commit('SET_PRIORITY_ID', value)
    },
    setPromulgateGroupId({ commit }, value) {
      commit('SET_PROMULGATE_GROUP_ID', value)
    },
    setDocumentType({ commit }, value) {
      commit('SET_DOCUMENT_TYPE', value)
    },
    setItemsSign({ commit }, value) {
      commit('SET_ITEMS_SIGN', value)
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
    setDocumentDetail({ commit }, value) {
      commit('SET_DOCUMENT_DETAIL', value)
    },
    setGoBack({ commit }, value) {
      commit('SET_GO_BACK', value)
    },
    resetDataState({ commit }) {
      commit('RESET_DATA_STATE')
    },
    setLoadFileSign({ commit }, value) {
      commit('SET_LOAD_FILE_SIGN', value)
    },
    setClearDrawImg({ commit }, value) {
      commit('SET_CLEAR_DRAW_IMAGE', value)
    },
    setClickClearDraw({ commit }, value) {
      commit('SET_CLICK_CLEAR_DRAW', value)
    },
    setShowFullName({ commit }, value) {
      commit('SET_SHOW_FULL_NAME', value)
    },
    setLoadingBtnSelect({ commit }, value) {
      commit('SET_LOADING_BTN_SELECT', value)
    }
  }
}
