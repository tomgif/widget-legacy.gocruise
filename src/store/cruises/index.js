import actions from './actions';

const state = {
  results: [],
  ship: {},
  loaded: false
}

const mutations = {
  SET_RESULTS: (state, results) => state.results = results,
  SET_LOADED: (state, loaded) => state.loaded = loaded,
  SET_SHIP: (state, ship) => state.ship = ship
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}