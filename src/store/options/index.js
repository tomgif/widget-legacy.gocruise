import actions from './actions'

const state = {
  ships: {},
  regions: {},
  cities: {},
  cruiseTypes: {},
  fares: {},
  currencies: {},
  nights: {
    1: {id: 1, title: '1-6 ночей', minLength: 1, maxLength: 6},
    2: {id: 2, title: '7-15 ночей', minLength: 7, maxLength: 15},
    3: {id: 3, title: '16+ ночей', minLength: 16, maxLength: 99}
  },
  cabins: {},
  variants: []
}

const mutations = {
  SET_SHIPS: (state, ships) => state.ships = ships,
  SET_REGIONS: (state, regions) => state.regions = regions,
  SET_CITIES: (state, cities) => state.cities = cities,
  SET_CRUISE_TYPES: (state, cruiseTypes) => state.cruiseTypes = cruiseTypes,
  SET_FARES: (state, fares) => state.fares = fares,
  SET_CABINS: (state, cabins) => state.cabins = cabins,
  SET_FILTERS: (state, variants) => state.variants = variants,
  SET_CURRENCIES: (state, currencies) => state.currencies = currencies
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}