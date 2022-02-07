const state = {
  theme: 'light',
  email: null,
  currencies: [],
  currency: 'EUR',
  showResults: false
}

const mutations = {
  SET_THEME: (state, theme) => state.theme = theme,
  SET_EMAIL: (state, email) => state.email = email,
  SET_CURRENCIES: (state, currencies) => state.currencies = currencies,
  SET_CURRENCY: (state, currency) => state.currency = currency,
  SET_SHOW_RESULTS: (state, showResults) => state.showResults = showResults
}

export default {
  namespaced: true,
  state,
  mutations
}