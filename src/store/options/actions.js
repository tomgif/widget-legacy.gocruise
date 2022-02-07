const uri = new URL(process.env.VUE_APP_API_URL)

export default {
  GET_SHIPS({commit}) {
    uri.search = new URLSearchParams({action: 'ships.list'}).toString()
    return fetch(uri)
    .then(response => response.json())
    .then(({data: ships}) => {
      let dictionary = {}
      ships.map(ship => dictionary[ship.id] = ship)
      commit('SET_SHIPS', dictionary)
    })
  },

  GET_REGIONS({commit}) {
    uri.search = new URLSearchParams({action: 'regions.list'}).toString()
    return fetch(uri)
    .then(response => response.json())
    .then(({data: regions}) => {
      let dictionary = {}
      regions.map(region => dictionary[region.id] = region)
      commit('SET_REGIONS', dictionary)
    })
  },

  GET_CITIES({commit}) {
    uri.search = new URLSearchParams({action: 'cities.list'}).toString()
    return fetch(uri)
    .then(response => response.json())
    .then(({data: cities}) => {
      let dictionary = {cities: {}, countries: {}, city2country: {}}
      cities.forEach(city => {
        dictionary.cities[city.id] = city
        dictionary.countries[city.country.id] = city.country.title
        dictionary.city2country[city.id] = city.country.id
      })
      commit('SET_CITIES', dictionary)
    })
  },

  GET_CRUISE_TYPES({commit}) {
    uri.search = new URLSearchParams({action: 'cruiseTypes.list'}).toString()
    return fetch(uri)
    .then(response => response.json())
    .then(({data: cruiseTypes}) => {
      let dictionary = {}
      cruiseTypes.map(type => dictionary[type.id] = type)
      commit('SET_CRUISE_TYPES', dictionary)
    })
  },

  GET_FARES({commit}) {
    uri.search = new URLSearchParams({action: 'fares.list'}).toString()
    return fetch(uri)
    .then(response => response.json())
    .then(({data: fares}) => {
      let dictionary = {}
      fares.map(type => dictionary[type.id] = type)
      commit('SET_FARES', dictionary)
    })
  },

  GET_CURRENCIES({commit}) {
    uri.search = new URLSearchParams({action: 'currencies.list'}).toString()
    return fetch(uri)
    .then(response => response.json())
    .then(({data: currencies}) => {
      let dictionary = {}
      currencies.map((type, index) => {
        if (!type.rate) return false
        type['id'] = type.code
        dictionary[type.code] = type
        dictionary[type.code]['order'] = index
      })
      commit('SET_CURRENCIES', dictionary)
    })
  },

  GET_CABINS({commit}) {
    uri.search = new URLSearchParams({
      action: 'cabins.list',
      params: 'exclude[*][]=id&exclude[*][]=title&exclude[*][]=type&exclude[*][]=experience&exclude[*][]=vendorCode'
    }).toString()
    return fetch(uri)
    .then(response => response.json())
    .then(({data: cabins}) => {
      let dictionary = {}
      cabins.map(cabin => dictionary[cabin.vendorCode] = cabin.type)
      commit('SET_CABINS', dictionary)
    })
  },

  GET_FILTERS({commit}) {
    return fetch(process.env.VUE_APP_API_FILTER_URL)
    .then(response => response.json())
    .then(response => commit('SET_FILTERS', response))
    .catch(() => commit('SET_FILTERS', {}))
  }
}
