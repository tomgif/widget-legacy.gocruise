const state = {
  isLoading: false,
  name: null,
  contact: null,
  note: null
};

const mutations = {
  SET_LOADING: (state, isLoading) => state.isLoading = isLoading,
  SET_NAME: (state, name) => state.name = name,
  SET_CONTACT: (state, contact) => state.contact = contact,
  SET_NOTE: (state, note) => state.note = note
}

export default {
  namespaced: true,
  state,
  mutations
}
