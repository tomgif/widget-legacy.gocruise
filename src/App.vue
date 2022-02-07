<template>
  <div class="ces-app" :class="`ces-theme-${theme}`">
    <router-view></router-view>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import intersectionWith from 'lodash/intersectionWith'

export default {
  name: 'App',
  async created() {
    this.$store.commit('main/SET_LOADING', true)
    const options = [
      await this.GET_SHIPS(),
      await this.GET_REGIONS(),
      await this.GET_CITIES(),
      await this.GET_CRUISE_TYPES(),
      await this.GET_FARES(),
      await this.GET_CURRENCIES(),
      await this.GET_CABINS(),
      await this.GET_FILTERS()
    ]

    if (this.showResults) {
      options.push(await this.getResults())
    }

    Promise.all(options).then(() => {
      this.$store.commit('main/SET_LOADING', false)
    })

    this.setCurrencies()
  },

  computed: {
    ...mapState({
      params: state => state.form,
      showResults: state => state.settings.showResults,
      theme: state => state.settings.theme,
      settings: state => state.settings,
      options: state => state.options
    })
  },

  methods: {
    ...mapActions('options', [
      'GET_SHIPS',
      'GET_REGIONS',
      'GET_CITIES',
      'GET_CRUISE_TYPES',
      'GET_FARES',
      'GET_CURRENCIES',
      'GET_CABINS',
      'GET_FILTERS'
    ]),

    setCurrencies() {
      let currencies = this.options.currencies
      let settings = intersectionWith(this.settings.currencies, Object.keys(currencies))
      if (settings.length) {
        Object.keys(currencies).map(key => {
          currencies[key]['order'] = settings.indexOf(key)
        })
      } else {
        settings = Object.keys(currencies)
      }
      this.$store.commit('settings/SET_CURRENCIES', settings)
      this.$store.commit('settings/SET_CURRENCY', settings[0])
      this.$store.commit('options/SET_CURRENCIES', currencies)
    },

    async getResults() {
      return this.$store.dispatch('cruises/SET_RESULTS', this.params)
    }
  }
}
</script>

<style lang="scss">
.ces-app {
  all: initial;
  font: normal 16px Arial, sans-serif;
  display: block;

  &, ::before, ::after {
    box-sizing: border-box
  }

  * {
    all: unset;
    display: block;
    box-sizing: inherit;
  }

  span {
    display: inline-block
  }

  table {
    display: table
  }

  thead {
    display: table-header-group
  }

  tbody {
    display: table-row-group
  }

  tr {
    display: table-row
  }

  td, th {
    display: table-cell
  }

  sup {
    display: inline-block;
    font-size: 75%;
    vertical-align: super;
  }

  h5 {
    text-decoration: underline
  }
}

.ces-bold {
  display: inline-block;
  font-weight: bold;
  margin-right: 5px;
}
</style>

<style lang="scss" src="./assets/icons.scss"></style>