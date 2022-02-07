import queryString from 'query-string'

const uri = new URL(process.env.VUE_APP_API_URL)

export default {
  SET_RESULTS: ({commit}, params) => {
    uri.search = new URLSearchParams({
      action: 'cruises.find',
      params: queryString.stringify(params, {
        arrayFormat: 'bracket',
        skipNull: true
      })
    }).toString()

    return fetch(uri)
    .then(response => response.json())
    .then(({data}) => {
      commit('SET_RESULTS', data)
      commit('SET_LOADED', true)
    })
  },

  SET_SHIP: ({commit}, shipId) => {
    uri.search = new URLSearchParams({
      action: `ships.info.${shipId}`
    }).toString()

    return fetch(uri)
    .then(response => response.json())
    .then(({data}) => commit('SET_SHIP', data))
  }
}
